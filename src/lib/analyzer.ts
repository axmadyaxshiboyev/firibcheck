/**
 * FiribCheck — qoidalarga asoslangan, tushuntiriladigan xavf tahlili.
 *
 * Tamoyillar:
 *  - Har bir belgi (signal) alohida aniqlanadi va nima uchun xavfli ekani tushuntiriladi.
 *  - Ball tasodifiy emas: aniqlangan belgilar og'irligidan hisoblanadi (1 - Π(1 - w)),
 *    keyin xavfli kombinatsiyalar uchun qo'shimcha ball qo'shiladi.
 *  - Bitta kalit so'z asosida "yuqori xavf" chiqarilmaydi (bitta belgi bo'lsa ball cheklanadi).
 *  - O'zbek (lotin va kirill) hamda rus tilidagi matnlar qo'llab-quvvatlanadi.
 *
 * Bu fayl tashqi kutubxonalarga bog'liq emas — brauzerda ham, serverda ham ishlaydi.
 */

export type Severity = "high" | "medium" | "low";
export type RiskLevel = "low" | "medium" | "high";

export interface Signal {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  weight: number;
  evidence: string[];
  advice: string[];
}

export interface UrlInfo {
  url: string;
  host: string;
  flags: string[];
  official: boolean;
}

export interface AnalysisResult {
  score: number;
  level: RiskLevel;
  headline: string;
  summary: string;
  signals: Signal[];
  notes: string[];
  advice: string[];
  urls: UrlInfo[];
  scripts: { latin: boolean; cyrillic: boolean };
  length: number;
}

export interface ValidationError {
  error: string;
}

export const MAX_LENGTH = 4000;

/* ------------------------------------------------------------------ */
/* Normalizatsiya                                                       */
/* ------------------------------------------------------------------ */

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ғ: "g'", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "y",
  к: "k", қ: "q", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ў: "o'",
  ф: "f", х: "x", ҳ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "'", ь: "", ы: "i", э: "e", ю: "yu", я: "ya",
};

function normalizeApostrophes(s: string): string {
  return s.replace(/[ʻʼ‘’`´ʹ′]/g, "'");
}

/** Ko'rinmas belgilarni (zero-width, yumshoq defis) olib tashlaydi. */
function stripInvisible(s: string): string {
  return s.replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "");
}

/**
 * "K a r t a n g i z  b l o k l a n d i" kabi harflari bo'shliq bilan ajratilgan matnni tiklaydi.
 * Ikki va undan ko'p bo'shliq — so'z chegarasi, bitta bo'shliq — harflar orasi.
 */
function despace(s: string): string {
  const toks = s.split(/\s+/).filter(Boolean);
  if (toks.length < 8) return s;
  const singles = toks.filter((t) => /^\p{L}[.,;:!?]*$/u.test(t)).length;
  if (singles / toks.length < 0.6) return s;
  return s.replace(/(\p{L}[.,;:!?]*)[ \t](?=\p{L})/gu, "$1").replace(/\s{2,}/g, " ");
}

/** "k0d", "p4rol" kabi harflar orasidagi raqam-almashtirishlarni tuzatadi. */
function deLeet(s: string): string {
  const map: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };
  return s.replace(/(?<=\p{L})[013457@$](?=\p{L})/gu, (c) => map[c] ?? c);
}

/** Lotin yozuviga o'tkazilgan va kichik harfli matn (o'zbek qoidalari uchun). */
export function toLatin(s: string): string {
  const lower = normalizeApostrophes(s.toLowerCase());
  let out = "";
  for (const ch of lower) out += CYR[ch] ?? ch;
  return deLeet(out.replace(/\s+/g, " "));
}

/** Kirillni saqlagan kichik harfli matn (rus qoidalari uchun). */
function toRaw(s: string): string {
  return deLeet(normalizeApostrophes(s.toLowerCase()).replace(/ё/g, "е").replace(/\s+/g, " "));
}

/* ------------------------------------------------------------------ */
/* Yordamchi funksiyalar                                                */
/* ------------------------------------------------------------------ */

/** Parchani so'z chegarasida kesib, kerak bo'lsa "…" qo'shadi. */
function clip(text: string, a: number, b: number): string {
  let s = Math.max(0, a), e = Math.min(text.length, b);
  if (s > 0) { const sp = text.lastIndexOf(" ", s); s = sp >= 0 && s - sp < 12 ? sp + 1 : s; }
  if (e < text.length) { const sp = text.indexOf(" ", e); e = sp >= 0 && sp - e < 12 ? sp : e; }
  return (s > 0 ? "…" : "") + text.slice(s, e).trim().replace(/[.,;:]+$/, "") + (e < text.length ? "…" : "");
}

function allMatches(text: string, re: RegExp): { text: string; index: number }[] {
  const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
  const r = new RegExp(re.source, flags);
  const out: { text: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = r.exec(text)) !== null) {
    if (m[0].length === 0) { r.lastIndex++; continue; }
    out.push({ text: m[0], index: m.index });
  }
  return out;
}

/** term va verb bir-biridan `win` belgidan uzoq bo'lmagan masofada uchraydimi. */
function near(text: string, term: RegExp, verb: RegExp, win = 70): string[] {
  const terms = allMatches(text, term);
  const verbs = allMatches(text, verb);
  const ev: string[] = [];
  for (const t of terms) {
    for (const v of verbs) {
      if (Math.abs(t.index - v.index) <= win) {
        const a = Math.min(t.index, v.index) - 10;
        const b = Math.max(t.index + t.text.length, v.index + v.text.length) + 6;
        ev.push(clip(text, a, b));
        break;
      }
    }
  }
  return ev;
}

function snippets(text: string, re: RegExp, max = 2): string[] {
  return allMatches(text, re).slice(0, max).map((m) => {
    return clip(text, m.index - 12, m.index + m.text.length + 10);
  });
}

function uniq<T>(a: T[]): T[] { return Array.from(new Set(a)); }

/* ------------------------------------------------------------------ */
/* Lug'atlar                                                            */
/* ------------------------------------------------------------------ */

// O'zbekcha "so'rash" fe'llari (lotin, apostrof ixtiyoriy)
const UZ_REQ = /(yubor|jo'?nat|ayt(ing|ib|sangiz)?\b|kirit|yoz(ing|ib|sangiz)\b|ber(ing|sangiz|ib)\b|tashla|ko'?rsat|tasdiqla|kerak|so'?ra|qoldir|ulash|o'?tkaz|bildir)/;
const RU_REQ = /(сообщите|сообщи|назовите|назови|отправ|пришли|введите|введи|продиктуй|скажите|скажи|укажите|подтверди|скиньте|скинь|напишите|нужн)/;

// Haqiqiy bank SMS'larida uchraydigan "kodni hech kimga bermang" ogohlantirishi
const UZ_SAFE_OTP = /(hech kimga (bermang|aytmang|bildirmang|ko'?rsatmang|yubormang)|hech kim bilan ulashmang)/;
const RU_SAFE_OTP = /(никому не (сообщайте|говорите|передавайте|называйте)|не сообщайте никому)/;

// "kod"/"parol" so'zi o'zi bo'lsa noaniq (dasturchi, Wi-Fi...). Moliyaviy/akkaunt konteksti bo'lsa xavfli.
const FIN_CTX_UZ = /(\bsms\b|bank\w*|karta\w*|hisob\w*|akkaunt\w*|\bclick\b|payme|uzum|humo|uzcard|tasdiqla\w*|to'?lov\w*|\bpul\b|so'?m\b|blok\w*|xavfsizlik|operatsiya\w*|kredit\w*|telegram|my\.?gov|soliq|jarima\w*|pasport\w*)/;
const FIN_CTX_RU = /(смс|sms|банк\w*|карт\w*|счет\w*|аккаунт\w*|перевод\w*|оплат\w*|заблок\w*|безопасн\w*|кредит\w*)/;
// Lotin harflarida yozilgan ruscha (translit) so'rov fe'llari
const RU_LAT_REQ = /(soobshi\w*|nazovi\w*|prishli\w*|otprav\w*|vvedi\w*|prodiktuj\w*|skazhi\w*|skin\w*)/;
const HAS_CYR = /[\u0400-\u04FF]/;

const BRANDS = [
  "click", "payme", "uzum", "humo", "uzcard", "kapital", "hamkor", "ipak", "agrobank", "sqb", "nbu", "xalqbank",
  "aloqabank", "tbc", "anorbank", "mygov", "my-gov", "soliq", "olx", "uzpost", "pochta", "express24", "paynet",
  "cbu", "iiv", "gov", "beeline", "ucell", "uzmobile", "mobiuz", "telegram", "visa", "mastercard",
];

/**
 * Rasmiy domenlar (ro'yxat to'liq emas — undagi domen ham 100% xavfsiz degani emas).
 * Ro'yxatda bo'lmagan, lekin brend nomini o'z ichiga olgan domenlar "taqlid" deb belgilanadi.
 */
export const OFFICIAL_DOMAINS = [
  "click.uz", "payme.uz", "uzum.uz", "uzumbank.uz", "uzcard.uz", "humocard.uz", "humo.uz", "kapitalbank.uz",
  "hamkorbank.uz", "ipakyulibank.uz", "agrobank.uz", "sqb.uz", "nbu.uz", "xb.uz", "aloqabank.uz", "tbcbank.uz",
  "anorbank.uz", "gov.uz", "my.gov.uz", "soliq.uz", "cbu.uz", "olx.uz", "pochta.uz", "express24.uz", "paynet.uz",
  "iiv.uz", "beeline.uz", "ucell.uz", "uzmobile.uz", "mobi.uz", "telegram.org", "t.me", "visa.com", "mastercard.com",
  "google.com", "youtube.com", "instagram.com",
];

const SHORTENERS = [
  "bit.ly", "tinyurl.com", "cutt.ly", "t.ly", "is.gd", "goo.su", "clck.ru", "shorturl.at", "rb.gy", "tiny.cc",
  "ow.ly", "rebrand.ly", "v.gd", "u.to", "qps.ru", "shorte.st", "bitly.ws", "s.id", "lnkd.in", "surl.li", "go.su",
];

const RISKY_TLDS = [
  "xyz", "top", "click", "icu", "site", "online", "live", "shop", "tk", "ml", "ga", "cf", "gq", "pw", "buzz", "loan",
  "win", "bid", "cc", "rest", "cyou", "sbs", "cfd", "monster", "quest", "lol", "work", "fun", "space", "website",
];

const SECOND_LEVEL = ["com.uz", "co.uz", "org.uz", "net.uz", "com.ru", "co.uk"];

/* ------------------------------------------------------------------ */
/* URL tahlili                                                          */
/* ------------------------------------------------------------------ */

const URL_RE = /((?:https?:\/\/|www\.)[^\s<>"')\]]+|\b(?:[a-z0-9-]+\.)+(?:uz|com|ru|net|org|info|xyz|top|click|icu|site|online|live|shop|tk|ml|ga|cf|gq|pw|buzz|loan|win|bid|cc|me|io|ly|link|app|co|biz|pro|rest|cyou|sbs|cfd|monster|quest|lol|work|fun|space|website|su|kz|tj|kg)(?:\/[^\s<>"')\]]*)?)/gi;

function lev(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

const BRAND_SUFFIX = /^(uz|bank|pay|card|online|verify|login|secure|support|bonus|app|team|official|mobile|my|info|id|service|xizmat|tolov|jarima|karta|konkurs|sovga|yutuq|\d+)$/;

/**
 * Domen taniqli brendga taqlid qiladimi? So'z ichidan qidirilmaydi (advisable.com ≠ visa),
 * faqat: aniq so'z (humo-karta), brend+qo'shimcha (clickuz, payme24) yoki 1 harf farqi (clik, paymee).
 */
function looksLikeBrand(host: string): boolean {
  const labels = host.split(".").slice(0, -1);
  const norm = (x: string) => x.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/rn/g, "m").replace(/vv/g, "w");
  for (const label of labels) {
    const parts = label.split("-");
    for (const b of BRANDS) {
      const bb = b.replace(/-/g, "");
      if (parts.includes(b) || parts.includes(bb) || parts.map(norm).includes(bb)) return true;
      const n = norm(label.replace(/-/g, ""));
      if (n === bb) return true;
      if (n.startsWith(bb) && BRAND_SUFFIX.test(n.slice(bb.length))) return true;
      if (n.endsWith(bb) && BRAND_SUFFIX.test(n.slice(0, n.length - bb.length))) return true;
      if (bb.length >= 5 && n.length >= 4 && lev(n, bb) === 1) return true;
    }
  }
  return false;
}

function registrable(host: string): string {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const last2 = parts.slice(-2).join(".");
  if (SECOND_LEVEL.includes(last2)) return parts.slice(-3).join(".");
  return last2;
}

function isOfficial(host: string): boolean {
  return OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith("." + d));
}

export function extractUrls(text: string): UrlInfo[] {
  const seen = new Set<string>();
  const out: UrlInfo[] = [];
  for (const m of text.matchAll(URL_RE)) {
    let raw = m[0].replace(/[.,;:!?…]+$/, "");
    if (/^[\d.]+$/.test(raw)) continue; // 5.000.000 kabi sonlar
    const withProto = /^https?:\/\//i.test(raw) ? raw : "http://" + raw;
    let host = "";
    try { host = new URL(withProto).hostname.toLowerCase().replace(/^www\./, ""); } catch { continue; }
    if (!host.includes(".")) continue;
    if (seen.has(host + raw)) continue;
    seen.add(host + raw);
    const flags: string[] = [];
    const official = isOfficial(host);
    const base = registrable(host);
    const tld = host.split(".").pop() || "";
    if (SHORTENERS.includes(base) || SHORTENERS.includes(host)) flags.push("shortener");
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) flags.push("ip");
    if (host.split(".").some((p) => p.startsWith("xn--"))) flags.push("punycode");
    if (RISKY_TLDS.includes(tld)) flags.push("risky_tld");
    if (!official && looksLikeBrand(host)) flags.push("lookalike");
    if (/^http:\/\//i.test(raw)) flags.push("http");
    if (host.split(".").length >= 4 || (host.match(/-/g) || []).length >= 3 || /\d{4,}/.test(base)) flags.push("odd_structure");
    if (host === "t.me" || host === "telegram.me") flags.push("telegram");
    if (/\.(apk|exe|scr|bat|msi|js)(\?|$)/i.test(raw)) flags.push("file");
    out.push({ url: raw, host, flags, official });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Belgilar ta'riflari                                                  */
/* ------------------------------------------------------------------ */

interface Ctx { lat: string; raw: string; urls: UrlInfo[]; original: string }
interface Rule {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  weight: number;
  advice: string[];
  test: (c: Ctx) => string[] | null; // dalillar ro'yxati yoki null
}

const nonEmpty = (a: string[]) => (a.length ? uniq(a).slice(0, 3) : null);

const RULES: Rule[] = [
  {
    id: "otp_request",
    title: "SMS-kod, PIN yoki parol so'ralmoqda",
    detail: "Bank, to'lov tizimi yoki davlat xizmati bir martalik kod, PIN yoki parolni hech qachon so'ramaydi. Kodni bergan zahoti kartangiz yoki akkauntingiz boshqaruvi firibgarga o'tishi mumkin.",
    severity: "high",
    weight: 0.46,
    advice: ["SMS-kod, PIN, CVV va parolni hech kimga — hatto o'zini bank xodimi deb tanishtirganga ham — bermang."],
    test: ({ lat, raw }) => {
      const strongUz = /(sms[- ]?kod\w*|tasdiqlash kod\w*|bir martalik kod\w*|\bpin[- ]?kod\w*|\bpin\b|\bcvv\b|\bcvc\b|maxfiy kod\w*|3 xonali raqam)/;
      const weakUz = /(\bkod(ni|ingiz|ingizni|i)?\b|\bparol\w*)/;
      const strongRu = /(смс[- ]?код\w*|sms[- ]?код\w*|пин[- ]?код\w*|\bcvv\b|\bcvc\b|три цифры)/;
      const weakRu = /(код\w*|парол\w*)/;
      const ev = [
        ...near(lat, strongUz, UZ_REQ),
        ...(FIN_CTX_UZ.test(lat) ? near(lat, weakUz, UZ_REQ) : []),
        ...near(raw, strongRu, RU_REQ),
        ...(FIN_CTX_RU.test(raw) ? near(raw, weakRu, RU_REQ) : []),
        // lotin harfidagi ruscha: "soobshite kod iz sms"
        ...(!HAS_CYR.test(raw) ? near(lat, /(\bkod\w*|\bparol\w*|\bsms\b)/, RU_LAT_REQ) : []),
      ];
      if (!ev.length) return null;
      // Bank SMS'idagi "hech kimga bermang" — so'rov emas, ogohlantirish
      if ((UZ_SAFE_OTP.test(lat) || RU_SAFE_OTP.test(raw)) && !/(yuboring|ayting|kiriting|сообщите|назовите|отправьте)/.test(lat + " " + raw)) return null;
      return nonEmpty(ev);
    },
  },
  {
    id: "card_request",
    title: "Bank karta ma'lumotlari so'ralmoqda",
    detail: "Karta raqami, amal qilish muddati yoki orqa tomondagi kodni so'rash — karta firibgarligining eng keng tarqalgan usuli. Pul qabul qilish uchun karta muddati yoki kod kerak emas.",
    severity: "high",
    weight: 0.4,
    advice: ["Karta raqamini faqat o'zingiz tanlagan, ishonchli to'lov ilovasida kiriting. Muddat va CVV'ni hech kimga aytmang."],
    test: ({ lat, raw }) => nonEmpty([
      ...near(lat, /(karta (raqam|ma'?lumot|rekvizit)\w*|kartangiz (raqam\w*)?|\d{1,2} xonali (karta )?raqam\w*|plastik karta|amal qilish muddat\w*|karta muddat\w*|karta(ning)? orqa)/, UZ_REQ),
      ...near(raw, /(номер карты|данные карты|реквизиты карты|срок действия|номер вашей карты|оборот\w* карты)/, RU_REQ),
      ...(!HAS_CYR.test(raw) ? near(lat, /(nomer karty|dannye karty|rekvizity karty|srok dejstvi\w*)/, RU_LAT_REQ) : []),
    ]),
  },
  {
    id: "identity_request",
    title: "Pasport yoki shaxsni tasdiqlovchi ma'lumot so'ralmoqda",
    detail: "Pasport surati, JShShIR, selfi bilan hujjat — bular nomingizga kredit yoki SIM-karta rasmiylashtirishda ishlatilishi mumkin. IIV fuqarolarni bunday ma'lumotlarni begonalarga bermaslikka chaqiradi.",
    severity: "high",
    weight: 0.36,
    advice: ["Pasport, ID-karta va JShShIR ma'lumotlarini faqat rasmiy idoraga, rasmiy kanal orqali taqdim eting."],
    test: ({ lat, raw }) => nonEmpty([
      ...near(lat, /(pasport\w*|id[- ]?karta\w*|jshshir|pinfl|shaxsingizni tasdiqla\w*|selfi\w*|hujjat(ingiz)? (rasm|surat)\w*)/, UZ_REQ),
      ...near(raw, /(паспорт\w*|пинфл|селфи|фото документа)/, RU_REQ),
    ]),
  },
  {
    id: "prize",
    title: "Haqiqatga o'xshamaydigan yutuq yoki sovg'a va'da qilinmoqda",
    detail: "Siz qatnashmagan o'yin yoki aksiyadan \"yutuq\" — firibgarlarning klassik ilmog'i. Ko'pincha sovrinni \"olish\" uchun to'lov yoki karta ma'lumotlari so'raladi.",
    severity: "medium",
    weight: 0.28,
    advice: ["Yutuq haqidagi xabarni tashkilotning rasmiy sayti yoki ilovasida o'zingiz tekshiring — xabardagi havola yoki raqam orqali emas."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(yutib oldingiz|yutdingiz|g'olib (bo'ldingiz|deb topildingiz)|sovrin\w*|yutuq(ni|ingiz)\b|lotereya\w*|pul mukofot\w*|sovg'a (yutdingiz|tayyor)|tanlab olindingiz|bepul (iphone|telefon|sovg'a))/),
      ...snippets(raw, /(вы выиграли|выигрыш\w*|ваш приз|приз\w*|победител\w*|розыгрыш\w*|вы выбраны)/),
      ...(!HAS_CYR.test(raw) ? snippets(lat, /(vy vyigral\w*|vyigrysh\w*|vash priz)/) : []),
    ]),
  },
  {
    id: "urgency",
    title: "Shoshiltirish va vaqt bosimi",
    detail: "\"24 soat ichida\", \"hoziroq\", \"oxirgi imkoniyat\" kabi iboralar o'ylab ko'rishga va tekshirishga vaqt qoldirmaslik uchun ishlatiladi.",
    severity: "medium",
    weight: 0.2,
    advice: ["Shoshilmang. Haqiqiy tashkilotlar qaror qabul qilish uchun bir necha daqiqa vaqt ajratganingiz uchun hech narsani yo'qotmaydi."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(shoshiling|zudlik bilan|darhol|tezda|hoziroq|oxirgi imkoniyat|faqat bugun|bugun(gacha)? (oxirgi|tugaydi)|\d+ ?(soat|daqiqa|minut)(dan keyin| ichida)|aks holda|muddat tugaydi)/),
      ...snippets(raw, /(срочно|немедленно|в течение \d+|последний шанс|только сегодня|иначе)/),
      ...(!HAS_CYR.test(raw) ? snippets(lat, /(srochno|nemedlenno|poslednij shans)/) : []),
    ]),
  },
  {
    id: "threat",
    title: "Bloklash, jarima yoki jinoiy javobgarlik bilan qo'rqitish",
    detail: "\"Kartangiz bloklandi\", \"ishingiz sudga oshiriladi\" kabi tahdidlar vahima uyg'otib, tez harakat qilishga majburlaydi.",
    severity: "medium",
    weight: 0.24,
    advice: ["Kartangiz yoki hisobingiz holatini bankning rasmiy ilovasida yoki karta orqasidagi raqamga o'zingiz qo'ng'iroq qilib tekshiring."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /((karta|hisob|akkaunt|raqam)\w* (bloklan|muzlatil|o'?chiril|cheklan)\w*|bloklanadi|bloklandi|jarima\w*|sudga|jinoiy ish|javobgarlikka tortil\w*|qidiruvga beril\w*)/),
      ...snippets(raw, /(заблокирован\w*|будет заблокир\w*|штраф\w*|уголовн\w*|суд\w*)/),
      ...(!HAS_CYR.test(raw) ? snippets(lat, /(zablokirovan\w*|shtraf\w*|ugolovn\w*)/) : []),
    ]),
  },
  {
    id: "advance_payment",
    title: "Oldindan to'lov yoki pul o'tkazish talab qilinmoqda",
    detail: "Ishga joylash, sovrin, yetkazib berish yoki \"bojxona\" bahonasida oldindan pul so'rash — firibgarlikning eng aniq belgilaridan biri. Internet platformalarda arzon mahsulot taklif qilib oldindan to'lov so'ralishi haqida IIV ham ogohlantiradi.",
    severity: "high",
    weight: 0.38,
    advice: ["Tanimagan odam yoki tekshirilmagan sotuvchiga oldindan pul o'tkazmang. Iloji bo'lsa, mahsulotni ko'rib, qo'lma-qo'l to'lang."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(oldindan to'?lov\w*|avans\w*|oldindan (pul|to'?la)\w*|ro'?yxatdan o'?tish (uchun )?(to'?lov|haq)\w*|depozit\w*|komissiya\w* (to'?la|o'?tkaz)\w*|sug'?urta (to'?lov|badal)\w*|yetkazib berish (uchun )?to'?lov\w*|bojxona\w*|pul o'?tkaz\w*|to'?lov(ni)? (qiling|amalga oshiring|o'?tkazing)|\d[\d\s]* ?(so'?m|ming|mln|\$|usd|dollar)\w* (to'?la|o'?tkaz|tashla)\w*|kartaga .{0,30}?(tashla|o'?tkaz)\w*|pul (tashlab|o'?tkazib) (bering|yuboring))/),
      ...snippets(raw, /(предоплат\w*|оплатите\w*|переведите\w*|перевод на карту|комисси\w*|страхов\w* взнос|депозит\w*|оплат\w* доставк\w*|таможн\w*)/),
      ...(!HAS_CYR.test(raw) ? snippets(lat, /(predoplat\w*|perevedi(te)?\b|strahov\w* vznos)/) : []),
    ]),
  },
  {
    id: "guaranteed_returns",
    title: "Kafolatlangan yoki g'ayritabiiy yuqori daromad va'da qilinmoqda",
    detail: "Haqiqiy investitsiyada daromad kafolatlanmaydi. \"Kuniga 10%\", \"pulingizni 3 baravar qilamiz\" kabi va'dalar moliyaviy piramida yoki soxta platformaga xos. Firibgarlar taniqli shaxslarning soxta (dipfeyk) videolaridan ham foydalanadi.",
    severity: "high",
    weight: 0.38,
    advice: ["Investitsiya qilishdan oldin kompaniya litsenziyasini rasmiy reyestrda tekshiring. Kafolatlangan yuqori daromad — xavf belgisi."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(kafolatlangan (daromad|foyda)|daromad kafolat\w*|(kuniga|haftasiga|oyiga) \d+ ?%|\d+ ?% (foyda|daromad)\w*|\d+ (barobar|baravar)\w*|x\d+ (qilib|daromad)|risksiz|xavfsiz daromad|tez boyi\w*|passiv daromad)/),
      ...snippets(raw, /(гарантированн\w* (доход|прибыл)\w*|\d+ ?% в (день|неделю|месяц)|пассивн\w* доход|без риска|удвои\w*)/),
    ]),
  },
  {
    id: "investment_topic",
    title: "Investitsiya yoki kriptovalyuta taklifi",
    detail: "Investitsiya taklifining o'zi firibgarlik emas, lekin noma'lum manbadan kelgan bunday taklif ehtiyotkorlik talab qiladi.",
    severity: "low",
    weight: 0.1,
    advice: [],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(investitsiya\w*|kripto\w*|bitcoin|usdt|trading|treyding|birja\w*|aksiya\w* sotib)/, 1),
      ...snippets(raw, /(инвестиц\w*|крипт\w*|биткоин|трейдинг|бирж\w*)/, 1),
    ]),
  },
  {
    id: "job_offer",
    title: "Shubhali ish yoki oson daromad taklifi",
    detail: "\"Uyda ishlab kuniga ... so'm\", \"tajriba shart emas\", \"layk bosib pul ishlang\" — soxta ish takliflarining odatiy iboralari. Keyingi qadamda odatda to'lov yoki karta ma'lumotlari so'raladi.",
    severity: "medium",
    weight: 0.22,
    advice: ["Ish beruvchini rasmiy sayti, manzili va ro'yxatdan o'tganligi bo'yicha tekshiring. Ishga kirish uchun pul to'lash talab qilinmasligi kerak."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(uyda (o'?tirib )?ishla\w*|masofaviy ish\w*|oson daromad|qo'?shimcha daromad|tajriba shart emas|layk (bosib|bosish)|vazifa(lar)? bajar\w*|topshiriq(lar)? bajar\w*|kuniga \d[\d\s]* ?(so'?m|ming|\$)|vakansiya\w*)/),
      ...snippets(raw, /(работа на дому|удаленн\w* работ\w*|легк\w* заработ\w*|без опыта|ставить лайки|выполнять задания|доход от \d+)/),
    ]),
  },
  {
    id: "off_platform",
    title: "Suhbatni boshqa kanal yoki shaxsiy yozishmaga ko'chirish",
    detail: "Rasmiy platformadan chiqib, Telegram, WhatsApp yoki noma'lum botda davom etishni so'rash — himoyasiz muhitga olib o'tish usuli.",
    severity: "medium",
    weight: 0.16,
    advice: ["Muloqotni rasmiy platforma ichida davom ettiring. Noma'lum botlarni ishga tushirmang va ularga ma'lumot bermang."],
    test: ({ lat, raw, urls }) => nonEmpty([
      ...snippets(lat, /(lichka\w*|shaxsiy(ga| xabar)\w*|whatsapp\w*|telegram(ga| orqali)|botga (kir|yoz|o'?t)\w*|botni (ishga tushir|bos)\w*|admin(ga| bilan)\w*|@[a-z0-9_]{5,})/),
      ...snippets(raw, /(в личку|в лс|пишите в телеграм|ватсап\w*|whatsapp|в бот\w*)/),
      ...urls.filter((u) => u.flags.includes("telegram")).map((u) => u.url),
    ]),
  },
  {
    id: "malicious_file",
    title: "Ilova (APK) yoki fayl o'rnatish so'ralmoqda",
    detail: "IIV ma'lumotiga ko'ra, kiberjinoyatlarning qariyb yarmi zararli APK fayllar orqali sodir etilmoqda. Ular to'y taklifnomasi, fotosurat, ta'ziya xabari yoki \"yangilanish\" ko'rinishida yuboriladi va o'rnatilgach SMS-kodlaringizni o'g'irlaydi.",
    severity: "high",
    weight: 0.48,
    advice: ["Hech qachon messenjer orqali kelgan .apk faylni o'rnatmang. Ilovalarni faqat Google Play yoki App Store'dan yuklang."],
    test: ({ lat, raw, urls }) => nonEmpty([
      ...snippets(lat, /(\.apk\b|apk fayl\w* (ni )?(oching|o'?rnat\w*|yuklab\w*|yuklang|bosing)|ilova(ni)? (o'?rnat|yuklab ol)\w*|dastur(ni)? (o'?rnat|yuklab ol)\w*|yangilanish(ni)? o'?rnat\w*|taklifnoma\w*\.(apk|zip)|fayl(ni)? oching)/),
      ...snippets(raw, /(\.apk\b|установите приложени\w*|скачайте приложени\w*|установите обновлени\w*)/),
      ...urls.filter((u) => u.flags.includes("file")).map((u) => u.url),
    ]),
  },
  {
    id: "delivery_scam",
    title: "Yetkazib berish yoki pochta bahonasidagi shubhali xabar",
    detail: "\"Paketingiz keldi, manzilni tasdiqlang\" yoki \"yetkazib berish uchun to'lang\" — soxta kuryer va pochta xabarlari havola orqali karta ma'lumotini olishga qaratilgan.",
    severity: "medium",
    weight: 0.24,
    advice: ["Buyurtmangizni faqat o'zingiz foydalanadigan do'kon ilovasi yoki pochta rasmiy saytida kuzating, xabardagi havola orqali emas."],
    test: ({ lat, urls }) => {
      const link = urls.some((u) => !u.official);
      if (!link && !/(to'?lov|to'?lang|to'?la\b)/.test(lat)) return null;
      return nonEmpty(snippets(lat, /(paket\w*|posilka\w*|jo'?natma\w*|kuryer\w*|kurer\w*)[^.]{0,60}(keldi|kutmoqda|saqlanmoqda|omborda|manzil\w*|aniqlashtir\w*|qaytar\w*|tasdiqla\w*|to'?lang|to'?lov\w*)/));
    },
  },
  {
    id: "fake_summons",
    title: "Sud, prokuratura yoki IIV nomidan chaqiruv yoki jarima",
    detail: "\"Sud chaqiruvi\", \"jarima yozildi\" kabi xabarlar ko'pincha zararli ilova yoki soxta to'lov sahifasiga olib boradi. Rasmiy organlar chaqiruvni messenjer orqali fayl ko'rinishida yubormaydi.",
    severity: "medium",
    weight: 0.2,
    advice: ["Jarima yoki chaqiruvni faqat my.gov.uz yoki tegishli idoraning rasmiy kanalida tekshiring."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(sud chaqiruv\w*|chaqiruv qog'?ozi|prokuratura\w*|ichki ishlar (xodimi|vazirligi)\w*|jarima(ngiz| yozildi|ni to'?la)\w*)/),
      ...snippets(raw, /(повестк\w*|прокуратур\w*)/),
    ]),
  },
  {
    id: "relative_emergency",
    title: "Qarindosh yoki tanish nomidan shoshilinch pul so'rash",
    detail: "Firibgarlar o'zini avariyaga uchragan qarindosh, yangi raqamdan yozayotgan tanish yoki \"muammoni hal qiladigan\" xodim sifatida tanishtiradi.",
    severity: "medium",
    weight: 0.3,
    advice: ["Yaqiningizga uning eski, o'zingizga ma'lum raqami orqali qo'ng'iroq qilib, vaziyatni shaxsan tekshiring."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(yangi raqam\w*|telefonim (buzildi|yo'?qoldi|o'?chdi)|avariya\w*|baxtsiz hodisa\w*|(ona|ota|aka|opa|uka|singil)(jon)?,? (menga )?pul|militsiya\w* ushla\w*|muammoni hal qilish uchun)/),
      ...snippets(raw, /(мой новый номер|я попал в (дтп|аварию)|срочно нужны деньги|мам,|пап,|решить вопрос)/),
    ]),
  },
  {
    id: "account_verify",
    title: "Akkaunt yoki hisobni \"tasdiqlash\" bahonasi",
    detail: "\"Hisobingizni tasdiqlang\", \"ma'lumotlaringizni yangilang\" — soxta sahifaga login va parol kiritishga undaydigan phishing usuli.",
    severity: "medium",
    weight: 0.24,
    advice: ["Login va parolni faqat brauzer manzil satriga o'zingiz yozgan rasmiy sayt manziliga kiriting."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /((akkaunt|hisob|profil)\w* (tasdiqla|yangila|faollashtir|qayta tikla)\w*|ma'?lumotlaringizni yangila\w*|verifikatsiya\w*|login( va parol)?\w* kirit\w*)/),
      ...snippets(raw, /(подтвердите (аккаунт|учетн|данные)\w*|верификаци\w*|обновите данные)/),
    ]),
  },
  {
    id: "loan_scam",
    title: "Kredit rasmiylashtirish yoki \"kreditni bekor qilish\" bahonasi",
    detail: "\"Nomingizga kredit rasmiylashtirildi, bekor qilish uchun kodni ayting\" yoki \"tez kredit, hujjatsiz\" — so'nggi yillarda ko'paygan sxemalar.",
    severity: "medium",
    weight: 0.26,
    advice: ["Kredit holatingizni bankning rasmiy ilovasi yoki filialida tekshiring. Kreditni \"bekor qilish\" uchun kod aytish talab qilinmaydi."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(nomingizga kredit|kredit (rasmiylashtiril|ajratil|bekor qil)\w*|hujjatsiz kredit|onlayn kredit\w*|mikroqarz\w*)/),
      ...snippets(raw, /(на вас оформлен кредит|оформлен\w* кредит|отменить кредит|кредит без документов)/),
    ]),
  },
  {
    id: "money_mule",
    title: "Kartangiz yoki SIM-kartangizdan foydalanishga berish taklifi",
    detail: "Kartani \"ijaraga berish\", akkaunt yoki SIM-kartani pulga sotish taklifi — firibgarlar pulni yashirish uchun shunday kartalardan foydalanadi. O'zbekistonda bunday kartalar egalari ham javobgarlikka tortilishi belgilangan.",
    severity: "high",
    weight: 0.34,
    advice: ["Kartangiz, akkauntingiz yoki SIM-kartangizni hech kimga bermang va sotmang — bu sizni jinoyatga sherik qilishi mumkin."],
    test: ({ lat, raw }) => nonEmpty([
      ...snippets(lat, /(karta(ngiz)?ni (ijaraga|vaqtincha) ber\w*|karta(ngiz)? orqali pul (o'?tkazib|aylantirib)|sim[- ]?karta\w* (sot|ber)\w*|akkaunt\w* (sot|ijaraga)\w*)/),
      ...snippets(raw, /(сдать карту|аренда карт\w*|продать (сим|аккаунт)\w*)/),
    ]),
  },
];

const BRAND_MENTION_UZ = /(bank\w*|click|payme|uzum|humo|uzcard|soliq|davlat xizmat\w*|my\.?gov|iiv|ichki ishlar|politsiya|militsiya|pochta|uzpost|express24|olx|markaziy bank|beeline|ucell|uzmobile|mobiuz)/;
const BRAND_MENTION_RU = /(банк\w*|сбер|полици\w*|налогов\w*|госуслуг\w*|почта)/;

/* ------------------------------------------------------------------ */
/* Asosiy tahlil                                                        */
/* ------------------------------------------------------------------ */

export function validate(text: string): ValidationError | null {
  const t = (text || "").trim();
  if (!t) return { error: "Iltimos, avval xabar matnini kiriting." };
  if (t.length > MAX_LENGTH) return { error: `Matn juda uzun. Iltimos, ${MAX_LENGTH} belgidan oshirmang.` };
  if (t.length < 6 || !/[\p{L}]/u.test(t)) return { error: "Tahlil uchun matn juda qisqa. Xabarni to'liqroq kiriting." };
  return null;
}

function urlSignals(urls: UrlInfo[]): Signal[] {
  const out: Signal[] = [];
  const pick = (flag: string) => urls.filter((u) => u.flags.includes(flag)).map((u) => u.url).slice(0, 3);
  const add = (id: string, flag: string, title: string, detail: string, severity: Severity, weight: number, advice: string[]) => {
    const ev = pick(flag);
    if (ev.length) out.push({ id, title, detail, severity, weight, evidence: ev, advice });
  };
  add("url_lookalike", "lookalike", "Taniqli brendga taqlid qiluvchi havola",
    "Havola manzilida bank, to'lov tizimi yoki davlat xizmati nomi bor, lekin u ma'lum rasmiy domen emas. Phishing saytlar rasmiy manzilga juda o'xshash bo'ladi, ammo albatta farq qiladi.",
    "high", 0.4, ["Rasmiy saytga havola orqali emas, manzilni o'zingiz yozib yoki rasmiy ilova orqali kiring."]);
  add("url_punycode", "punycode", "Harflari almashtirilgan (punycode) domen",
    "Domen boshqa alifbo harflari bilan yozilgan — tashqi ko'rinishdan rasmiy saytga o'xshatish uchun ishlatiladi.",
    "high", 0.34, []);
  add("url_ip", "ip", "Domen o'rniga IP-manzil ishlatilgan",
    "Rasmiy tashkilotlar mijozlarga raqamli IP-manzil ko'rinishidagi havolalar yubormaydi.",
    "high", 0.32, []);
  add("url_shortener", "shortener", "Qisqartirilgan havola",
    "Qisqartiruvchi xizmat (bit.ly va h.k.) havolaning haqiqiy manzilini yashiradi. O'zi firibgarlik emas, lekin boshqa belgilar bilan birga xavfni oshiradi.",
    "medium", 0.2, ["Qisqartirilgan havolani ochmang yoki avval uning haqiqiy manzilini xavfsiz usulda tekshiring."]);
  add("url_risky_tld", "risky_tld", "Firibgarlikda ko'p uchraydigan domen zonasi",
    "Havola .xyz, .top, .click kabi arzon va nazorati sust zonada joylashgan. Bunday zonalar phishing saytlarida tez-tez uchraydi.",
    "medium", 0.2, []);
  add("url_odd", "odd_structure", "G'alati tuzilishdagi havola manzili",
    "Ko'p qavatli subdomen, ko'p chiziqcha yoki uzun raqamlar — soxta sahifa manzillariga xos.",
    "low", 0.1, []);
  add("url_http", "http", "Himoyalanmagan (http) havola",
    "Ulanish shifrlanmagan. To'lov yoki login sahifasi hech qachon http orqali bo'lmasligi kerak.",
    "low", 0.08, []);
  return out;
}

function levelOf(score: number): RiskLevel {
  return score >= 60 ? "high" : score >= 25 ? "medium" : "low";
}

export function analyze(text: string): AnalysisResult {
  const original = despace(stripInvisible((text || "").slice(0, MAX_LENGTH)));
  const lat = toLatin(original);
  const raw = toRaw(original);
  const urls = extractUrls(original);
  const ctx: Ctx = { lat, raw, urls, original };

  const signals: Signal[] = [];
  for (const r of RULES) {
    const ev = r.test(ctx);
    if (ev) signals.push({ id: r.id, title: r.title, detail: r.detail, severity: r.severity, weight: r.weight, evidence: ev, advice: r.advice });
  }
  signals.push(...urlSignals(urls));

  const has = (id: string) => signals.some((s) => s.id === id);
  const hasAny = (...ids: string[]) => ids.some(has);

  // "Investitsiya mavzusi" kafolatlangan daromad bilan birga bo'lsa, takrorlanmasin
  if (has("guaranteed_returns")) removeSignal(signals, "investment_topic");

  // Brend nomi + ma'lumot so'rash = taqlid (impersonation)
  const brand = BRAND_MENTION_UZ.test(lat) || BRAND_MENTION_RU.test(raw);
  if (brand && hasAny("otp_request", "card_request", "identity_request", "account_verify", "threat", "loan_scam")) {
    const ev = snippets(lat, BRAND_MENTION_UZ, 1).concat(snippets(raw, BRAND_MENTION_RU, 1));
    signals.push({
      id: "impersonation",
      title: "Bank yoki rasmiy tashkilot nomidan gapirilmoqda",
      detail: "Xabar bank, to'lov tizimi yoki davlat idorasi nomidan yuborilgandek ko'rinadi va shu bilan birga maxfiy ma'lumot yoki shoshilinch harakat talab qiladi. Rasmiy tashkilotlar bunday yo'l tutmaydi.",
      severity: "medium",
      weight: 0.16,
      evidence: ev.slice(0, 2),
      advice: ["Tashkilotga xabardagi raqam yoki havola orqali emas, rasmiy saytidagi yoki karta orqasidagi raqam orqali o'zingiz murojaat qiling."],
    });
  }

  // Kombinatsiya — umumiy og'irlik
  let p = 1;
  for (const s of signals) p *= 1 - s.weight;
  let combined = 1 - p;

  const notes: string[] = [];
  const combo = (cond: boolean, bonus: number, note: string) => { if (cond) { combined += bonus; notes.push(note); } };
  const linkPresent = urls.some((u) => !u.official);
  combo(hasAny("otp_request", "card_request") && (has("impersonation") || linkPresent), 0.12,
    "Maxfiy ma'lumot so'rovi rasmiy tashkilot nomi yoki havola bilan birga kelgan — bu phishing sxemasiga xos.");
  combo(has("prize") && hasAny("advance_payment", "card_request", "otp_request") , 0.12,
    "Yutuq va'dasi to'lov yoki karta ma'lumoti so'rovi bilan birga — klassik \"sovrin\" firibgarligi.");
  combo(has("prize") && linkPresent && !hasAny("advance_payment", "card_request", "otp_request"), 0.06,
    "Yutuq haqidagi xabarda noma'lum havola bor.");
  combo(has("job_offer") && hasAny("advance_payment", "card_request"), 0.14,
    "Ish taklifi oldindan to'lov yoki karta ma'lumoti bilan bog'langan — soxta ish taklifining asosiy belgisi.");
  combo(has("guaranteed_returns") && hasAny("off_platform", "advance_payment", "urgency"), 0.1,
    "Kafolatlangan daromad shoshiltirish yoki pul o'tkazish so'rovi bilan birga kelgan.");
  combo(has("relative_emergency") && hasAny("advance_payment", "card_request", "otp_request"), 0.12,
    "Yaqin odam nomidan shoshilinch pul so'rash — keng tarqalgan sxema.");
  combo(hasAny("urgency", "threat") && signals.some((s) => s.severity === "high"), 0.06,
    "Bosim (shoshiltirish yoki qo'rqitish) jiddiy so'rov bilan birga ishlatilgan.");

  let score = Math.round(Math.min(0.97, combined) * 100);

  // Bitta belgi bo'yicha qat'iy xulosa chiqarilmasin
  const scoring = signals.filter((s) => s.weight >= 0.1);
  if (scoring.length === 1) {
    const only = scoring[0];
    const cap = only.severity === "high" ? 58 : 34;
    if (score > cap) score = cap;
    notes.push("Faqat bitta xavf belgisi topildi — bu firibgarlikni isbotlamaydi, lekin ehtiyot bo'lish kerak.");
  }

  // Bank OTP xabari ko'rinishi (so'rovsiz, ogohlantirishli)
  if ((UZ_SAFE_OTP.test(lat) || RU_SAFE_OTP.test(raw)) && !has("otp_request")) {
    notes.push("Matnda \"kodni hech kimga bermang\" degan ogohlantirish bor — bu odatda bankning haqiqiy tasdiqlash SMS'iga xos. Agar bu kodni siz so'ramagan bo'lsangiz, uni hech kimga aytmang.");
  }
  if (urls.some((u) => u.official) && !signals.some((s) => s.id.startsWith("url_"))) {
    notes.push("Matndagi havola ma'lum rasmiy domenga mos keladi. Baribir manzilni harfma-harf tekshiring.");
  }

  const level = levelOf(score);
  signals.sort((a, b) => b.weight - a.weight);

  const advice = uniq([
    ...signals.flatMap((s) => s.advice),
    ...(level !== "low" ? ["Xabarga javob bermang, havolani ochmang va yuboruvchi raqamini bloklang."] : []),
    ...(level === "high" ? ["Agar ma'lumot yoki pul berib qo'ygan bo'lsangiz, darhol bankingizga qo'ng'iroq qilib kartani bloklating va 102 raqamiga murojaat qiling."] : []),
    ...(level === "low" ? ["Shubha qolsa, yuboruvchini boshqa, o'zingizga ma'lum kanal orqali tekshiring."] : []),
  ]).slice(0, 6);

  const headline =
    level === "high" ? "Bu xabarda firibgarlikka xos jiddiy belgilar bor"
      : level === "medium" ? "Ehtiyot bo'ling: shubhali belgilar topildi"
      : signals.length ? "Kuchli xavf belgisi topilmadi" : "Aniq xavf belgisi topilmadi";

  const top = signals.slice(0, 3).map((s) => (/^[A-Z][a-z]/.test(s.title) ? s.title.charAt(0).toLowerCase() + s.title.slice(1) : s.title));
  const summary =
    level === "high"
      ? `Xabarda ${signals.length} ta xavf belgisi aniqlandi, jumladan: ${top.join("; ")}. Bunday birikma firibgarlik xabarlarida ko'p uchraydi. Javob bermang va hech qanday ma'lumot yubormang.`
      : level === "medium"
      ? `Xabarda ${signals.length} ta shubhali belgi bor: ${top.join("; ")}. Bu firibgarlikni isbotlamaydi, lekin harakat qilishdan oldin manbani rasmiy kanal orqali tekshiring.`
      : signals.length
      ? `Faqat kuchsiz belgilar topildi (${top.join("; ")}). Past xavf xavfsizlik kafolati emas — kontekstga e'tibor bering.`
      : "Qoidalar bazasidagi ma'lum xavf belgilari topilmadi. Bu xabar xavfsiz degani emas: yangi usullar doim paydo bo'ladi.";

  return {
    score, level, headline, summary, signals, notes: uniq(notes), advice, urls,
    scripts: { latin: /[a-z]/i.test(original), cyrillic: /[Ѐ-ӿ]/.test(original) },
    length: original.length,
  };
}

function removeSignal(list: Signal[], id: string) {
  const i = list.findIndex((s) => s.id === id);
  if (i >= 0) list.splice(i, 1);
}

/** Natijani matn ko'rinishida (nusxalash uchun). */
export function resultToText(r: AnalysisResult, ai?: { summary?: string } | null): string {
  const lvl = r.level === "high" ? "Yuqori xavf" : r.level === "medium" ? "O'rta xavf" : "Past xavf";
  const lines = [
    `FiribCheck tahlili — ${lvl} (taxminiy ko'rsatkich: ${r.score}/100)`,
    r.headline,
    "",
    r.summary,
  ];
  if (r.signals.length) {
    lines.push("", "Aniqlangan xavf belgilari:");
    r.signals.forEach((s, i) => lines.push(`${i + 1}. ${s.title}`));
  }
  if (ai?.summary) lines.push("", "AI izohi: " + ai.summary);
  if (r.advice.length) {
    lines.push("", "Nima qilish kerak:");
    r.advice.forEach((a) => lines.push(`• ${a}`));
  }
  lines.push("", "Bu tahlil dastlabki bahodir. Natija xabarning xavfsiz ekanini kafolatlamaydi.");
  return lines.join("\n");
}
