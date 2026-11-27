// Aniqlik o'lchovi: `npm run benchmark`
import { analyze } from "../src/lib/analyzer.ts";
import { DATASET, type Item } from "./dataset.ts";
import { HOLDOUT } from "./holdout.ts";

function run(name: string, set: Item[]) {
  let tp = 0, fn = 0, tn = 0, fp = 0;
  const miss: string[] = [];
  for (const it of set) {
    const r = analyze(it.t);
    const flagged = r.level !== "low";
    const ok = flagged === it.scam;
    if (it.scam) ok ? tp++ : fn++; else ok ? tn++ : fp++;
    if (!ok) miss.push(`${it.scam ? "O'TKAZIB YUBORILDI" : "YOLG'ON SIGNAL    "} [${it.tag}] ${r.level} ${r.score} :: ${it.t.slice(0, 80)}`);
  }
  const pct = (a: number, b: number) => (b ? ((a / b) * 100).toFixed(1) : "-") + "%";
  console.log(`\n== ${name} (${set.length} ta: firibgarlik ${tp + fn}, oddiy ${tn + fp}) ==`);
  console.log(`Firibgarlikni topish: ${pct(tp, tp + fn)} (${tp}/${tp + fn})  |  Oddiy xabarni to'g'ri o'tkazish: ${pct(tn, tn + fp)} (${tn}/${tn + fp})`);
  miss.forEach((m) => console.log(" - " + m));
  return { recall: tp / (tp + fn), spec: tn / (tn + fp) };
}

console.log("DIQQAT: namunalar sintetik (muallif yozgan). Haqiqiy xabarlar bilan to'ldiring.");
const a = run("Asosiy to'plam", DATASET);
const b = run("Hold-out (sozlashda ishlatilmagan)", HOLDOUT);
if ([a.recall, a.spec, b.recall, b.spec].some((x) => x < 0.9)) { console.error("\nChegaradan past (>= 90% bo'lishi kerak)"); process.exit(1); }
