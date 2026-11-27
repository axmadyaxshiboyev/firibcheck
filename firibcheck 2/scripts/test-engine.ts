// Tahlil dvigateli uchun oddiy testlar: `npm run test:engine`
import { analyze, validate } from "../src/lib/analyzer.ts";
import { SAMPLES } from "../src/lib/samples.ts";

type Case = { name: string; text: string; expect: ("low" | "medium" | "high")[] };

const cases: Case[] = [
  ...SAMPLES.map((s) => ({ name: "Namuna: " + s.label, text: s.text, expect: ["high"] as Case["expect"] })),
  { name: "Haqiqiy bank OTP SMS", text: "Kod: 482913. Uni hech kimga bermang. Click orqali to'lovni tasdiqlash.", expect: ["low"] },
  { name: "Oddiy xabar", text: "Ertaga soat 10 da uchrashamiz, hujjatlarni olib kel.", expect: ["low"] },
  { name: "Rasmiy havola", text: "Soliq to'lovingizni my.gov.uz orqali amalga oshirishingiz mumkin.", expect: ["low"] },
  { name: "Ruscha: karta bloklandi", text: "Ваша карта заблокирована. Для разблокировки срочно сообщите код из СМС и номер карты.", expect: ["high"] },
  { name: "Kirill o'zbekcha", text: "Ҳурматли мижоз! Картангиз блокланди. Блокдан чиқариш учун СМС-кодни юборинг: http://humo-karta.xyz/login", expect: ["high"] },
  { name: "APK taklifnoma", text: "Assalomu alaykum, to'yimizga taklifnoma yubordim, taklifnoma.apk faylni oching", expect: ["medium", "high"] },
  { name: "Investitsiya", text: "Kuniga 10% kafolatlangan daromad! Kripto investitsiya, risksiz. Hoziroq botga kiring: t.me/profit_uz_bot", expect: ["high"] },
  { name: "Faqat qisqa havola", text: "Mana o'sha rasm: bit.ly/3xYz", expect: ["low", "medium"] },
  { name: "Qarindosh", text: "Onajon, bu mening yangi raqamim. Telefonim buzildi. Zudlik bilan shu kartaga 2 mln so'm tashlab bering, keyin tushuntiraman", expect: ["high"] },
  { name: "OLX oldindan to'lov", text: "Mashina hali sotilmagan, lekin bron qilish uchun oldindan to'lov 500$ kartaga o'tkazing, bugun oxirgi imkoniyat", expect: ["medium", "high"] },
];

let fail = 0;
for (const c of cases) {
  const r = analyze(c.text);
  const ok = c.expect.includes(r.level);
  if (!ok) fail++;
  console.log(`${ok ? "✔" : "✘"} ${c.name}: ${r.level} ${r.score} — [${r.signals.map((s) => s.id).join(", ")}]`);
}
console.log("validate(''):", validate(""));
console.log("validate('ok'):", validate("ok"));
if (fail) { console.error(`${fail} ta test o'tmadi`); process.exit(1); }
console.log("Barcha testlar o'tdi");
