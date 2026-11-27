import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, KeyRound, Link2, MessageSquareText, Phone, ShieldCheck, Siren, Smartphone, TriangleAlert, Landmark } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Xavfsizlik qo'llanmasi",
  description: "Firibgarlik usullari, ogohlantiruvchi belgilar, shubhali havolani bosib qo'ysangiz yoki SMS-kodni berib qo'ysangiz nima qilish kerak va qayerga murojaat qilish.",
};

const TOC = [
  ["usullar", "Keng tarqalgan usullar"],
  ["belgilar", "Ogohlantiruvchi belgilar"],
  ["xulq", "Xavfsiz onlayn xulq"],
  ["havola-bosildi", "Shubhali havolani bosib qo'ysangiz"],
  ["kod-berildi", "Karta yoki kodni berib qo'ysangiz"],
  ["murojaat", "Qayerga murojaat qilish"],
  ["raqamlar", "Rasmiy raqamlar va manbalar"],
];

const METHODS = [
  { icon: Smartphone, t: "Zararli APK fayllar", d: "To'y taklifnomasi, fotosurat yoki ta'ziya xabari niqobida yuboriladi. IIV ma'lumotiga ko'ra, kiberjinoyatlarning qariyb yarmi shu yo'l bilan sodir etilmoqda." },
  { icon: KeyRound, t: "\"Bank xodimi\" qo'ng'iroqlari", d: "Kartangiz bloklangani yoki nomingizga kredit olingani aytilib, SMS-kod va karta ma'lumotlari so'raladi." },
  { icon: Link2, t: "Phishing saytlar", d: "Rasmiy saytga juda o'xshash manzil — lekin albatta farq qiladi. Login, parol yoki karta ma'lumotini o'g'irlash uchun." },
  { icon: MessageSquareText, t: "Soxta yutuq va ish takliflari", d: "Yutuqni olish yoki ishga kirish uchun oldindan to'lov yoki karta ma'lumotlari talab qilinadi." },
  { icon: Landmark, t: "Soxta investitsiyalar", d: "Kafolatlangan yuqori daromad, ko'pincha taniqli shaxslarning dipfeyk videolari bilan reklama qilinadi." },
  { icon: Phone, t: "Qarindosh nomidan", d: "\"Avariyaga tushdim\", \"yangi raqamim\" — yaqiningiz nomidan shoshilinch pul so'raladi." },
];

export default function Guide() {
  return (
    <>
      <PageHero eyebrow="Xavfsizlik qo'llanmasi" title="Firibgarlikni tanib oling va to'g'ri harakat qiling" sub="Oddiy tilda: firibgarlar qanday ishlaydi, qaysi belgilarga e'tibor berish kerak va ma'lumot yoki pul berib qo'ysangiz, darhol nima qilish lozim." />
      <div className="container grid gap-12 pb-24 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Mundarija" className="rounded-2xl border border-line p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">Mundarija</p>
            <ol className="mt-3 space-y-2.5 text-sm">
              {TOC.map(([id, t], i) => (
                <li key={id}><a href={`#${id}`} className="flex gap-2 font-medium text-ink-soft transition-colors hover:text-brand"><span className="tabular-nums text-ink-faint">{i + 1}.</span>{t}</a></li>
              ))}
            </ol>
          </nav>
          <div className="mt-4 rounded-2xl bg-danger-soft p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-danger"><Siren size={16} /> Pul yechib olindimi?</p>
            <p className="mt-1.5 text-sm text-ink">Darhol bankingizga va <a href="tel:102" className="font-semibold underline">102</a> raqamiga qo'ng'iroq qiling.</p>
          </div>
        </aside>

        <article className="prose-fc max-w-3xl">
          <Reveal>
            <h2 id="usullar" className="!mt-0 scroll-mt-28">1. Keng tarqalgan usullar</h2>
            <p>O'zbekistonda kiberjinoyatlarning asosiy qismi elektron to'lov tizimlari orqali fuqarolar pulini o'zlashtirish bilan bog'liq. Eng ko'p uchraydigan usullar:</p>
          </Reveal>
          <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
            {METHODS.map((m, i) => (
              <Reveal key={m.t} delay={i * 0.05} className="rounded-2xl border border-line p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><m.icon size={20} /></span>
                <h3 className="!mt-4 text-base font-semibold">{m.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{m.d}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-5"><Link href="/firibgarlik-turlari">Barcha firibgarlik turlarini misollar bilan ko'rish →</Link></p>

          <Reveal>
            <h2 id="belgilar" className="scroll-mt-28">2. Ogohlantiruvchi belgilar</h2>
            <p>Bitta belgi firibgarlikni isbotlamaydi, lekin bir nechtasi birga kelsa — ehtiyot bo'ling:</p>
            <ul>
              <li><b>Maxfiy ma'lumot so'rash:</b> SMS-kod, PIN, CVV, parol, pasport ma'lumotlari.</li>
              <li><b>Shoshiltirish:</b> "24 soat ichida", "hoziroq", "aks holda bloklanadi".</li>
              <li><b>Haqiqatga to'g'ri kelmaydigan va'da:</b> kutilmagan yutuq, kafolatlangan katta daromad, juda arzon narx.</li>
              <li><b>Oldindan to'lov:</b> ishga kirish, sovrin yoki "bojxona" uchun pul.</li>
              <li><b>Shubhali havola yoki fayl:</b> qisqartirilgan havola, g'alati domen, .apk fayl.</li>
              <li><b>Boshqa kanalga o'tish:</b> "lichkaga yozing", "botga kiring".</li>
            </ul>
          </Reveal>

          <Reveal>
            <h2 id="xulq" className="scroll-mt-28">3. Xavfsiz onlayn xulq</h2>
            <ul>
              <li>SMS-kod, PIN va parolni hech kimga bermang — bank, politsiya yoki tanishingizga ham.</li>
              <li>Ilovalarni faqat Google Play yoki App Store'dan o'rnating; messenjerdagi .apk fayllarni ochmang.</li>
              <li>Bank va davlat xizmatlariga havola orqali emas, manzilni o'zingiz yozib yoki rasmiy ilova orqali kiring.</li>
              <li>Ikki bosqichli autentifikatsiyani (Telegram'da "Ikki bosqichli tasdiqlash") yoqing.</li>
              <li>Kartangiz, akkauntingiz yoki SIM-kartangizni hech kimga ijaraga bermang va sotmang — ular jinoyatda ishlatilsa, egasi ham javobgar bo'lishi mumkin.</li>
              <li>Keksa yaqinlaringizga ham shu qoidalarni tushuntiring.</li>
            </ul>
          </Reveal>

          <Reveal>
            <h2 id="havola-bosildi" className="scroll-mt-28">4. Shubhali havolani bosib qo'ysangiz</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-soft">
              <li>Ochilgan sahifaga hech qanday ma'lumot kiritmang va uni yoping.</li>
              <li>Agar biror fayl yuklangan bo'lsa — uni o'rnatmang va o'chirib tashlang.</li>
              <li>Agar login yoki parol kiritgan bo'lsangiz — darhol shu xizmatda parolni almashtiring va boshqa qurilmalardagi seanslarni yakunlang.</li>
              <li>Agar ilova o'rnatgan bo'lsangiz — internetni o'chiring, ilovani o'chiring, bankingizga xabar bering va kartani vaqtincha bloklang.</li>
            </ol>
          </Reveal>

          <Reveal>
            <h2 id="kod-berildi" className="scroll-mt-28">5. Karta ma'lumoti yoki SMS-kodni berib qo'ysangiz</h2>
            <div className="not-prose mt-5 rounded-2xl border border-danger/20 bg-danger-soft/60 p-5">
              <p className="flex items-center gap-2 font-semibold text-danger"><TriangleAlert size={18} /> Har daqiqa muhim</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] text-ink">
                <li>Bank ilovasida kartani darhol bloklang yoki karta orqasidagi raqamga qo'ng'iroq qiling.</li>
                <li><a href="tel:102" className="font-semibold underline">102</a> raqamiga yoki huquqni muhofaza qiluvchi organlarga murojaat qiling. IIV ma'lumotiga ko'ra, kechikib murojaat qilinsa, pul boshqa davlatlarga o'tkazib yuborilishi mumkin.</li>
                <li>Firibgar bilan yozishmalar, qo'ng'iroq vaqti va o'tkazmalar skrinshotini saqlang.</li>
                <li>Parollarni almashtiring, Telegram va bank ilovasidagi faol seanslarni tekshiring.</li>
                <li>Nomingizga kredit olinmaganini bankda tekshiring.</li>
              </ol>
            </div>
          </Reveal>

          <Reveal>
            <h2 id="murojaat" className="scroll-mt-28">6. Qayerga murojaat qilish</h2>
          </Reveal>
          <div className="not-prose mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { t: "102 — Ichki ishlar organlari", d: "Pul noqonuniy yechib olinganda yoki firibgarlik sodir bo'lganda darhol qo'ng'iroq qiling.", href: "tel:102", cta: "Qo'ng'iroq qilish" },
              { t: "Bankingiz", d: "Karta orqasidagi raqam yoki bankning rasmiy ilovasi orqali — kartani bloklash va operatsiyalarni tekshirish uchun.", href: null, cta: null },
              { t: "Kiberxavfsizlik markazi", d: "Phishing (soxta) veb-saytlarni aniqlasangiz, \"Kiberxavfsizlik markazi\" DUKga xabar bering.", href: "https://csec.uz", cta: "csec.uz" },
              { t: "Markaziy bank — CERT-CBU", d: "Bank va to'lov tizimlari nomidan ochilgan soxta havolalar bo'yicha kiberxavfsizlik markazi.", href: null, cta: null },
            ].map((c) => (
              <Reveal key={c.t} className="rounded-2xl border border-line p-5">
                <p className="flex items-center gap-2 font-semibold"><ShieldCheck size={17} className="text-brand" /> {c.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.d}</p>
                {c.href && (
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    {c.cta} {c.href.startsWith("http") ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                  </a>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 id="raqamlar" className="scroll-mt-28">7. Rasmiy raqamlar va manbalar</h2>
            <p>IIV 2026-yil 9-oktabrdagi matbuot anjumanida e'lon qilgan ma'lumotlarga ko'ra, yanvar–sentabr oylarida axborot texnologiyalari yordamida 69 962 ta jinoyat sodir etilgan, fuqarolarga 1 trln so'mdan ortiq zarar yetkazilgan, tergov davomida 210 mlrd so'mdan ortiq mablag' egalariga qaytarilgan. Kiberjinoyatlarning qariyb yarmi zararli APK fayllar orqali sodir etilmoqda.</p>
            <ul>
              <li><a href="https://www.spot.uz/oz/2026/10/12/cybercrime/" target="_blank" rel="noopener noreferrer">Spot.uz — 2026-yil 9 oyida kiberjinoyatlar</a></li>
              <li><a href="https://anhor.uz/uzl/news/kiberjinoyatlar-zarar-trillion-som" target="_blank" rel="noopener noreferrer">Anhor.uz — Kiberjinoyatlar zarari va APK fayllar</a></li>
              <li><a href="https://csec.uz/uz/news/maqolalar/phishing-veb-saytlardan-ogoh-bo-ling" target="_blank" rel="noopener noreferrer">Kiberxavfsizlik markazi — Phishing saytlardan ogoh bo'ling</a></li>
              <li><a href="https://gov.uz/oz/yangiobod/news/view/191253" target="_blank" rel="noopener noreferrer">IIV murojaati — oldindan to'lov va 102 raqami</a></li>
            </ul>
          </Reveal>

          <Reveal className="not-prose mt-14 rounded-3xl bg-surface-2 p-7 text-center">
            <p className="text-xl font-semibold tracking-tight">Shubhali xabaringiz bormi?</p>
            <Link href="/#tekshiruv" className="btn-primary btn-shine mt-5">Xabarni tekshirish <ArrowRight size={18} /></Link>
          </Reveal>
        </article>
      </div>
    </>
  );
}
