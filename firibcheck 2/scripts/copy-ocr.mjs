// OCR fayllarini (Tesseract ishchisi, WASM yadro, til ma'lumotlari) node_modules'dan public/ocr ga ko'chiradi.
// Shunda sayt uchinchi tomon CDN'iga (jsDelivr) bog'liq bo'lmaydi: xavfsizroq, tezroq, maxfiylik uchun yaxshi.
import { cpSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "ocr");
const nm = join(root, "node_modules");

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "core"), { recursive: true });
mkdirSync(join(out, "lang"), { recursive: true });

cpSync(join(nm, "tesseract.js", "dist", "worker.min.js"), join(out, "worker.min.js"));
for (const f of ["tesseract-core-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js"]) {
  cpSync(join(nm, "tesseract.js-core", f), join(out, "core", f));
}
for (const l of ["uzb", "uzb_cyrl", "rus", "eng"]) {
  const dir = join(nm, "@tesseract.js-data", l, "4.0.0_best_int");
  if (!existsSync(dir)) throw new Error(`Til ma'lumoti topilmadi: ${l}`);
  for (const f of readdirSync(dir)) if (f.endsWith(".traineddata.gz")) cpSync(join(dir, f), join(out, "lang", f));
}
console.log("OCR fayllari public/ocr ga ko'chirildi");
