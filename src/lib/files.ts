"use client";

/**
 * Fayllarni brauzer ichida tekshirish. Fayl hech qayerga yuborilmaydi.
 *  - .txt / .eml / .csv / .html / .md / .json — matn sifatida o'qiladi va xabar kabi tahlil qilinadi;
 *  - .docx — ichidagi matn ajratib olinadi va tahlil qilinadi;
 *  - .apk — AndroidManifest.xml dagi ruxsatlar (permissions) statik tekshiriladi.
 * Muhim: APK tekshiruvi virus tekshiruvi emas. U faqat firibgar ilovalarda ko'p uchraydigan
 * xavfli ruxsatlar birikmasini ko'rsatadi.
 */

import type { AnalysisResult, Signal } from "./analyzer";

export const MAX_TEXT_FILE = 5 * 1024 * 1024;
export const MAX_DOCX = 15 * 1024 * 1024;
export const MAX_APK = 100 * 1024 * 1024;

const TEXT_EXT = ["txt", "eml", "csv", "html", "htm", "md", "json", "log", "msg"];
export const FILE_ACCEPT = ".apk,.docx,.txt,.eml,.csv,.html,.htm,.md,.json,.log";

export type FileOutcome =
  | { kind: "text"; text: string; note?: string }
  | { kind: "apk"; result: AnalysisResult; hash?: string };

const extOf = (name: string) => (name.split(".").pop() || "").toLowerCase();

export function isImageFile(f: File) {
  return f.type.startsWith("image/");
}

export function validateFile(f: File): string | null {
  const ext = extOf(f.name);
  if (ext === "pdf") return "PDF hozircha qo'llab-quvvatlanmaydi. Matnini nusxalab joylang yoki sahifaning skrinshotini yuklang.";
  if (ext === "apk") return f.size > MAX_APK ? "APK fayl juda katta (100 MB gacha)." : null;
  if (ext === "docx") return f.size > MAX_DOCX ? "Fayl juda katta (15 MB gacha)." : null;
  if (TEXT_EXT.includes(ext)) return f.size > MAX_TEXT_FILE ? "Fayl juda katta (5 MB gacha)." : null;
  if (["exe", "msi", "bat", "scr", "jar", "dmg", "ipa", "zip", "rar", "7z"].includes(ext))
    return "Bu fayl turi tekshirilmaydi. Uni ochmang va o'rnatmang; shubhali bo'lsa o'chiring.";
  return "Bu fayl turi qo'llab-quvvatlanmaydi. APK, DOCX, TXT yoki EML yuklang.";
}

/* ------------------------------ matn / docx ------------------------------ */

function stripHtml(s: string) {
  return s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function readText(f: File): Promise<string> {
  const raw = await f.text();
  const ext = extOf(f.name);
  const t = ext === "html" || ext === "htm" ? stripHtml(raw) : raw;
  return t.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

async function readDocx(f: File): Promise<string> {
  const { unzipSync, strFromU8 } = await import("fflate");
  const buf = new Uint8Array(await f.arrayBuffer());
  const files = unzipSync(buf, { filter: (e) => e.name === "word/document.xml" });
  const xml = files["word/document.xml"];
  if (!xml) throw new Error("docx");
  return strFromU8(xml)
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\/>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ---------------------------------- APK ---------------------------------- */

/** Binar AndroidManifest.xml (AXML) dagi satrlar jadvalini o'qiydi. */
export function axmlStrings(b: Uint8Array): string[] {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (b.length < 16 || dv.getUint16(0, true) !== 0x0003) return [];
  let off = dv.getUint16(2, true); // fayl sarlavhasi
  // birinchi chunk — satrlar jadvali (0x0001)
  if (dv.getUint16(off, true) !== 0x0001) return [];
  const base = off;
  const count = dv.getUint32(base + 8, true);
  const flags = dv.getUint32(base + 16, true);
  const strStart = dv.getUint32(base + 20, true);
  const utf8 = (flags & 0x100) !== 0;
  const hdr = dv.getUint16(base + 2, true);
  const out: string[] = [];
  const limit = Math.min(count, 20000);
  for (let i = 0; i < limit; i++) {
    let p = base + strStart + dv.getUint32(base + hdr + i * 4, true);
    if (p >= b.length) { out.push(""); continue; }
    if (utf8) {
      let n = b[p++]; if (n & 0x80) p++;       // belgilar soni
      let len = b[p++]; if (len & 0x80) len = ((len & 0x7f) << 8) | b[p++]; // bayt soni
      out.push(new TextDecoder("utf-8").decode(b.subarray(p, Math.min(p + len, b.length))));
    } else {
      let len = dv.getUint16(p, true); p += 2;
      if (len & 0x8000) { len = ((len & 0x7fff) << 16) | dv.getUint16(p, true); p += 2; }
      const end = Math.min(p + len * 2, b.length);
      out.push(new TextDecoder("utf-16le").decode(b.subarray(p, end)));
    }
  }
  return out;
}

const PERM = /^(android\.permission|com\.android\.[a-z.]+)\.[A-Z][A-Z0-9_]+$/;

interface PermRule { id: string; perms: string[]; title: string; detail: string; severity: "high" | "medium" | "low"; weight: number; advice: string }
const RULES: PermRule[] = [
  { id: "apk_sms", perms: ["READ_SMS", "RECEIVE_SMS", "SEND_SMS", "RECEIVE_MMS", "WRITE_SMS"], severity: "high", weight: 0.34,
    title: "SMS o'qish yoki yuborish ruxsati so'raladi",
    detail: "Firibgar ilovalar bank SMS-kodlarini (OTP) o'qib, jabrlanuvchi nomidan pul o'tkazish uchun aynan shu ruxsatdan foydalanadi. Oddiy ilovalarning ko'pchiligiga SMS kerak emas.",
    advice: "Ilova SMS ruxsatini so'rasa va uning sizga nima uchun kerakligini bilmasangiz, o'rnatmang." },
  { id: "apk_accessibility", perms: ["BIND_ACCESSIBILITY_SERVICE"], severity: "high", weight: 0.32,
    title: "\"Maxsus imkoniyatlar\" (Accessibility) xizmati so'raladi",
    detail: "Bu ruxsat ilovaga ekranni o'qish, bosishlarni o'zi bajarish va kiritilgan parollarni ko'rish imkonini beradi. Bank troyanlarida eng ko'p uchraydigan belgi.",
    advice: "Ilova Accessibility yoqishni so'rasa, rad eting." },
  { id: "apk_admin", perms: ["BIND_DEVICE_ADMIN", "MANAGE_DEVICE_ADMINS"], severity: "high", weight: 0.26,
    title: "Qurilma administratori huquqi so'raladi",
    detail: "Ilovani o'chirib tashlashni qiyinlashtiradi va qurilmani boshqarish imkonini beradi.",
    advice: "Bunday huquqni faqat ishonchli korporativ ilovalarga bering." },
  { id: "apk_overlay", perms: ["SYSTEM_ALERT_WINDOW"], severity: "medium", weight: 0.16,
    title: "Boshqa ilovalar ustidan oyna ochish ruxsati",
    detail: "Soxta kirish oynasini haqiqiy bank ilovasi ustiga chiqarib, parol o'g'irlash uchun ishlatilishi mumkin.",
    advice: "Ilova ustidan ko'rsatish ruxsatini faqat ishonchli ilovalarga bering." },
  { id: "apk_install", perms: ["REQUEST_INSTALL_PACKAGES", "INSTALL_PACKAGES"], severity: "medium", weight: 0.16,
    title: "Boshqa ilovalarni o'rnatish ruxsati",
    detail: "Dropper (boshqa zararli ilovani yuklab o'rnatuvchi) ilovalarga xos belgi.",
    advice: "Ilova boshqa APK o'rnatishni so'rasa, rad eting." },
  { id: "apk_calls", perms: ["READ_CALL_LOG", "WRITE_CALL_LOG", "PROCESS_OUTGOING_CALLS", "ANSWER_PHONE_CALLS", "CALL_PHONE", "READ_PHONE_NUMBERS"], severity: "medium", weight: 0.12,
    title: "Qo'ng'iroqlar bilan bog'liq ruxsatlar",
    detail: "Qo'ng'iroqlarni kuzatish yoki yo'naltirish uchun ishlatilishi mumkin.",
    advice: "Ilovaning vazifasiga mos kelmasa, bu ruxsatlarni bermang." },
  { id: "apk_privacy", perms: ["READ_CONTACTS", "RECORD_AUDIO", "READ_EXTERNAL_STORAGE", "MANAGE_EXTERNAL_STORAGE", "READ_MEDIA_IMAGES", "ACCESS_FINE_LOCATION", "CAMERA"], severity: "low", weight: 0.06,
    title: "Shaxsiy ma'lumotlarga kirish ruxsatlari",
    detail: "Kontaktlar, mikrofon, fayllar yoki joylashuv. Ko'p oddiy ilovalarda ham bor, lekin boshqa belgilar bilan birga xavfni oshiradi.",
    advice: "Faqat ilova ishlashi uchun zarur ruxsatlarni bering." },
];

const SEV_ORDER = { high: 3, medium: 2, low: 1 } as const;
const levelOf = (s: number) => (s >= 60 ? "high" : s >= 25 ? "medium" : "low") as "high" | "medium" | "low";

async function sha256(buf: ArrayBuffer): Promise<string | undefined> {
  try {
    const d = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch { return undefined; }
}

export async function analyzeApk(f: File): Promise<{ result: AnalysisResult; hash?: string }> {
  const { unzipSync } = await import("fflate");
  const ab = await f.arrayBuffer();
  const bytes = new Uint8Array(ab);
  const names: string[] = [];
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes, { filter: (e) => { names.push(e.name); return e.name === "AndroidManifest.xml"; } });
  } catch {
    throw new Error("apk-zip");
  }
  const manifest = files["AndroidManifest.xml"];
  const hash = await sha256(ab);
  const notes: string[] = [];
  const signals: Signal[] = [];

  if (!manifest) throw new Error("apk-manifest");
  const strings = axmlStrings(manifest);
  const perms = new Set(strings.filter((s) => PERM.test(s)).map((s) => s.split(".").pop() as string));

  for (const r of RULES) {
    const hit = r.perms.filter((p) => perms.has(p));
    if (!hit.length) continue;
    signals.push({ id: r.id, title: r.title, detail: r.detail, severity: r.severity, weight: r.weight, evidence: hit, advice: [r.advice] });
  }

  // Ichma-ich APK/DEX (dropper belgisi) va fayl nomi
  const nested = names.filter((n) => /^assets\/.*\.(apk|dex|jar)$/i.test(n) || /^res\/raw\/.*\.(apk|dex)$/i.test(n));
  const dexCount = names.filter((n) => /^classes\d*\.dex$/.test(n)).length;
  if (nested.length) {
    signals.push({ id: "apk_nested", title: "Ichida yana bitta ilova yoki kod fayli yashiringan", severity: "high", weight: 0.28,
      detail: "Ilova ichida alohida APK/DEX fayli bor. Bu zararli kodni o'rnatishdan keyin yashirincha yuklash usuli.",
      evidence: nested.slice(0, 3), advice: ["Bunday ilovani o'rnatmang."] });
  }
  if (/\.(pdf|jpg|jpeg|png|docx?|xlsx?)\.apk$/i.test(f.name)) {
    signals.push({ id: "apk_double_ext", title: "Fayl nomi boshqa turdagi fayldek ko'rsatilgan", severity: "high", weight: 0.26,
      detail: "Nomi \"hujjat.pdf.apk\" kabi bo'lgan fayl hujjat emas, o'rnatiladigan ilova. Bu aldash usuli.",
      evidence: [f.name], advice: ["Hujjat deb kelgan APK faylni ochmang."] });
  }
  signals.push({ id: "apk_source", title: "Ilova rasmiy do'kondan (Google Play, App Store) emas, fayl ko'rinishida kelgan", severity: "low", weight: 0.1,
    detail: "Davlat va bank xizmatlari ilovalarini faqat rasmiy do'kondan yoki o'z saytidan yuklang. Telegram yoki SMS orqali kelgan APK fayllar firibgarlikda ko'p ishlatiladi.",
    evidence: [], advice: ["Ilovani faqat Google Play yoki tashkilotning rasmiy saytidan yuklang."] });

  let keep = 1;
  for (const s of signals) keep *= 1 - s.weight;
  let score = Math.round((1 - keep) * 100);
  const high = signals.filter((s) => s.severity === "high").length;
  if (high >= 2) score = Math.max(score, 78);
  const onlyWeak = signals.every((s) => s.severity === "low");
  if (onlyWeak) score = Math.min(score, 20);
  score = Math.max(0, Math.min(99, score));
  signals.sort((a, b) => SEV_ORDER[b.severity] - SEV_ORDER[a.severity] || b.weight - a.weight);

  const level = levelOf(score);
  const found = signals.filter((s) => s.id !== "apk_source");
  notes.push("Bu virus tekshiruvi emas: ilova kodi bajarilmaydi va ichi tahlil qilinmaydi, faqat so'ralgan ruxsatlar ko'riladi. Ko'p haqiqiy ilovalar ham ba'zi ruxsatlarni so'raydi.");
  if (hash) notes.push(`Faylning SHA-256 kodi: ${hash}. Uni virustotal.com saytida qidirib, boshqa antiviruslar natijasini ko'rishingiz mumkin.`);
  if (!perms.size) notes.push("Manifestdan ruxsatlar o'qilmadi yoki ilova hech qanday ruxsat so'ramaydi.");
  if (dexCount > 4) notes.push("Ilovada juda ko'p kod fayllari bor; bu katta yoki murakkab ilovaga xos.");

  const headline = level === "high" ? "Bu APK faylda firibgar ilovalarga xos xavfli ruxsatlar birikmasi bor"
    : level === "medium" ? "Ehtiyot bo'ling: APK shubhali ruxsatlar so'raydi"
    : "Bu APK'da kuchli xavf belgisi topilmadi";
  const top = found.slice(0, 3).map((s) => (/^[A-Z][a-z]/.test(s.title) ? s.title.charAt(0).toLowerCase() + s.title.slice(1) : s.title));
  const summary = level === "high"
    ? `Fayl nomi: ${f.name}. Ruxsatlarda ${found.length} ta jiddiy belgi topildi: ${top.join("; ")}. Bunday ilovani o'rnatmang. Agar allaqachon o'rnatgan bo'lsangiz, uni o'chiring va bankingizga qo'ng'iroq qiling.`
    : level === "medium"
    ? `Fayl nomi: ${f.name}. Shubhali belgilar: ${top.join("; ")}. O'rnatishdan oldin manbasini rasmiy kanal orqali tekshiring.`
    : "Ruxsatlar bo'yicha kuchli belgi topilmadi. Bu ilova xavfsiz degani emas: manbasi ishonchli ekaniga ishonch hosil qiling.";

  const advice = Array.from(new Set([
    ...signals.flatMap((s) => s.advice),
    ...(level !== "low" ? ["Faylni ochmang va o'rnatmang. Yuborgan kishini bloklang."] : []),
    ...(level === "high" ? ["Agar o'rnatgan bo'lsangiz: internetni o'chiring, ilovani o'chiring, bankingizga qo'ng'iroq qilib kartani bloklang, 102 ga murojaat qiling."] : []),
  ])).slice(0, 6);

  return {
    hash,
    result: { score, level, headline, summary, signals, notes, advice, urls: [], scripts: { latin: true, cyrillic: false }, length: f.size },
  };
}

/* -------------------------------- umumiy kirish -------------------------------- */

export async function processFile(f: File): Promise<FileOutcome> {
  const ext = extOf(f.name);
  if (ext === "apk") {
    const { result, hash } = await analyzeApk(f);
    return { kind: "apk", result, hash };
  }
  if (ext === "docx") {
    const t = await readDocx(f);
    return { kind: "text", text: t, note: "docx" };
  }
  return { kind: "text", text: await readText(f) };
}

export function fileErrorMessage(e: unknown): string {
  const m = e instanceof Error ? e.message : "";
  if (m === "apk-zip") return "APK fayl buzilgan yoki ZIP formatida emas.";
  if (m === "apk-manifest") return "APK ichida AndroidManifest.xml topilmadi. Fayl buzilgan yoki APK emas.";
  if (m === "docx") return "DOCX faylidan matn o'qib bo'lmadi.";
  return "Faylni o'qib bo'lmadi. Boshqa fayl yuklang yoki matnni qo'lda kiriting.";
}
