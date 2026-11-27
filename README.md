# FiribCheck

Shubhali SMS, Telegram xabari, havola yoki **skrinshot**dagi firibgarlik belgilarini o'zbek tilida tahlil qiluvchi veb-sayt.

- **Qoidalarga asoslangan, tushuntiriladigan tahlil** — o'zbek (lotin va kirill) hamda rus tillarida 16 ta belgi turi + havola tahlili (taqlid domenlar, qisqartirilgan havolalar, punycode, IP, xavfli zonalar). Ball tasodifiy emas: belgilar og'irligidan va xavfli birikmalardan hisoblanadi; bitta belgi bo'yicha qat'iy xulosa chiqarilmaydi.
- **Rasmdan o'qish (OCR)** — Tesseract.js orqali brauzer ichida (o'zbek lotin/kirill, rus, ingliz). Rasm serverga yuborilmaydi.
- **Ixtiyoriy AI qatlami** — `ANTHROPIC_API_KEY` o'rnatilsa, foydalanuvchi o'zi yoqqanda matn Claude orqali qo'shimcha tahlil qilinadi. Kalit faqat serverda.
- **Animatsiyalar** — ochilish intro animatsiyasi, WebGL suv effekti (kursor va bosishga javob beradi), so'zma-so'z sarlavha, suzuvchi shisha chiplar, skroll bilan chiziladigan jarayon diagrammasi, sanaladigan statistika. `prefers-reduced-motion` hurmat qilinadi.
- Sahifalar: Bosh sahifa, Firibgarlik turlari (qidiruv + filtr), Xavfsizlik qo'llanmasi, Maxfiylik siyosati, Foydalanish shartlari.

## Texnologiyalar

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide · Tesseract.js

## Lokal ishga tushirish

Talab: Node.js 18.18+ (20 yoki 22 tavsiya etiladi).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Tahlil dvigateli testlari (Node 22+):

```bash
npm run test:engine
```

## Vercel'ga deploy

1. Loyihani GitHub'ga yuklang (`git init && git add . && git commit -m "FiribCheck" && git push`).
2. [vercel.com/new](https://vercel.com/new) → repozitoriyni tanlang → **Deploy**. Framework avtomatik aniqlanadi (Next.js), qo'shimcha sozlama shart emas.
3. (Ixtiyoriy) AI tahlili uchun: Project → Settings → Environment Variables → `ANTHROPIC_API_KEY` qo'shing va qayta deploy qiling.
4. (Ixtiyoriy) O'z domeningiz bo'lsa, `NEXT_PUBLIC_SITE_URL` ni shu domenga o'rnating (OpenGraph uchun).

Yoki CLI orqali: `npx vercel` → `npx vercel --prod`.

## Muhit o'zgaruvchilari

| O'zgaruvchi | Majburiy | Tavsif |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yo'q | AI qo'shimcha tahlilini yoqadi. Bo'sh bo'lsa sayt faqat qoidaviy tahlil bilan to'liq ishlaydi. |
| `ANTHROPIC_MODEL` | Yo'q | Standart: `claude-sonnet-5-5` |
| `NEXT_PUBLIC_SITE_URL` | Yo'q | Sayt manzili (metadata uchun) |

`.env.example` faylidan nusxa oling: `cp .env.example .env.local`.

## Tuzilma

```
src/
  app/
    page.tsx                 bosh sahifa
    api/analyze/route.ts     ixtiyoriy AI endpoint (rate limit, matn saqlanmaydi)
    firibgarlik-turlari/     qidiruv va filtrli katalog
    qollanma/  maxfiylik/  shartlar/
  components/
    IntroProvider.tsx        ochilish animatsiyasi
    LiquidCanvas.tsx         WebGL suv shader'i
    checker/                 tekshiruv, OCR, natija kartasi
    home/                    bosh sahifa bo'limlari
  lib/
    analyzer.ts              tahlil dvigateli (tashqi bog'liqliksiz)
    ocr.ts                   brauzerdagi OCR
    scams.ts  samples.ts     kontent
scripts/test-engine.ts       dvigatel testlari
```

## Qoidalarni kengaytirish

Yangi belgi qo'shish uchun `src/lib/analyzer.ts` dagi `RULES` massiviga obyekt qo'shing: `id`, `title`, `detail` (nima uchun xavfli), `severity`, `weight` (0–0.5), `advice` va `test` funksiyasi. Rasmiy domenlar ro'yxati — `OFFICIAL_DOMAINS`. O'zgarishdan keyin `npm run test:engine`.

## Logo

Logo `src/components/Logo.tsx` da vektor (SVG) ko'rinishida — intro animatsiyada qalqon chiziladi. Figma'dagi PNG logoni ishlatmoqchi bo'lsangiz, uni `public/logo.png` ga qo'ying va `Logo` komponentida `<img src="/logo.png">` ga almashtiring.

## Cheklovlar

- Bu ta'limiy xavf-baholash vositasi; natija xabar xavfsiz yoki firibgarlik ekanini kafolatlamaydi.
- OCR birinchi marta ishlaganda til modellari (bir necha MB) shu saytning o'zidan yuklanadi (tashqi CDN yo'q) va brauzer keshida saqlanadi. Past sifatli yoki qo'lyozma rasmlarda aniqlik pasayadi; olingan matnni tekshirishdan oldin tahrirlash mumkin.
- Havolalar ochilmaydi va real vaqtda qora ro'yxatlarga tekshirilmaydi — faqat manzil tuzilishi tahlil qilinadi.
- AI endpoint'idagi rate limit xotirada (serverless instansiya bo'yicha); yuqori trafik uchun Vercel KV/Upstash kabi tashqi limiter tavsiya etiladi.

## Manbalar

Statistika: IIV matbuot anjumani, 2026-yil 9-oktabr ([spot.uz](https://www.spot.uz/oz/2026/10/12/cybercrime/), [anhor.uz](https://anhor.uz/uzl/news/kiberjinoyatlar-zarar-trillion-som)). Phishing bo'yicha: [csec.uz](https://csec.uz/uz/news/maqolalar/phishing-veb-saytlardan-ogoh-bo-ling).

## Fayl tekshiruvi

"Fayl" tabida quyidagilarni tekshirish mumkin (hammasi brauzer ichida, fayl serverga yuborilmaydi):

- **APK** — AndroidManifest.xml dagi ruxsatlar statik tekshiriladi (SMS, Accessibility, qurilma administratori, overlay, boshqa APK o'rnatish), ichma-ich APK/DEX va "hujjat.pdf.apk" kabi nomlar aniqlanadi, SHA-256 ko'rsatiladi. **Bu virus tekshiruvi emas**: kod bajarilmaydi va ichi tahlil qilinmaydi.
- **DOCX, TXT, EML, CSV, HTML** — matn ajratib olinib, oddiy xabar kabi tahlil qilinadi.
- PDF hozircha qo'llab-quvvatlanmaydi.
