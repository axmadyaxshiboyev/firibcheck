"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ClipboardPaste, ScanSearch, ShieldCheck } from "lucide-react";
import { Reveal } from "../Reveal";

const PATH = "M0 270 C90 270 120 290 180 290 C330 290 440 110 600 110 C760 110 860 250 1020 250 C1100 250 1150 220 1200 210";

const STEPS = [
  { n: "01", icon: ClipboardPaste, title: "Xabarni kiriting", text: "Foydalanuvchi shubhali SMS, Telegram xabari, havola yoki skrinshotni joylashtiradi.", marker: { left: "15%", top: "72.5%" }, box: { left: "3%", top: "6%" } },
  { n: "02", icon: ScanSearch, title: "Xavf belgilarini tahlil qiling", text: "Tizim matndagi shubhali iboralar, so'rovlar va havolalarni tekshiradi.", marker: { left: "50%", top: "27.5%" }, box: { left: "39%", top: "48%" } },
  { n: "03", icon: ShieldCheck, title: "To'g'ri qaror qabul qiling", text: "Natija va xavfsizlik tavsiyalarini ko'rib chiqing.", marker: { left: "85%", top: "62.5%" }, box: { left: "72%", top: "0%" } },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const len = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 22 });

  return (
    <section id="qanday-ishlaydi" className="container py-20 md:py-32" aria-labelledby="how-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Jarayon</p>
          <h2 id="how-title" className="h2 mt-4">FiribCheck qanday ishlaydi?</h2>
        </Reveal>
        <Reveal delay={0.1}><p className="max-w-xs text-ink-soft md:text-lg">Uch oddiy qadam — texnik bilim talab qilinmaydi.</p></Reveal>
      </div>

      {/* Desktop: egri chiziqli diagramma */}
      <div ref={ref} className="relative mt-16 hidden aspect-[3/1] lg:block">
        <svg viewBox="0 0 1200 400" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <path d={PATH} transform="translate(0 22)" stroke="#94A3B8" strokeOpacity="0.14" strokeWidth="10" fill="none" style={{ filter: "blur(6px)" }} />
          <path d={PATH} stroke="#E5E7EB" strokeWidth="2" fill="none" strokeDasharray="4 8" />
          <motion.path d={PATH} stroke="url(#fc-curve)" strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: len }} />
          <defs>
            <linearGradient id="fc-curve" x1="0" x2="1">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="1" stopColor="#3B9EFF" />
            </linearGradient>
          </defs>
        </svg>
        {STEPS.map((s, i) => (
          <div key={s.n}>
            <span className="pointer-events-none absolute select-none text-[9rem] font-light leading-none tracking-[-0.06em] text-[#F1F2F5]" style={{ left: `calc(${s.box.left} + 170px)`, top: `calc(${s.box.top} - 30px)` }} aria-hidden>{s.n}</span>
            <motion.div
              className="absolute"
              style={{ ...s.marker, x: "-50%", y: "-50%" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 + i * 0.25 }}
            >
              <span className="absolute inset-0 -z-10 translate-y-3 rounded-[22px] bg-[#93B4FF]/50 blur-xl" />
              <span className="grid h-16 w-16 place-items-center rounded-[20px] border border-line bg-white text-brand shadow-[0_10px_24px_-6px_rgba(37,99,235,.3)]">
                <s.icon size={26} strokeWidth={1.8} />
              </span>
            </motion.div>
            <Reveal delay={0.2 + i * 0.2} className="absolute w-[300px]" style={s.box}>
              <p className="text-xs font-semibold tracking-[0.14em] text-brand">QADAM {s.n}</p>
              <h3 className="mt-2.5 text-2xl font-semibold leading-tight tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </Reveal>
          </div>
        ))}
      </div>

      {/* Mobil va planshet: vertikal timeline */}
      <ol className="mt-12 lg:hidden">
        {STEPS.map((s, i) => (
          <motion.li key={s.n} className="flex gap-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <div className="flex flex-col items-center">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-line bg-white text-brand shadow-[0_10px_24px_-8px_rgba(37,99,235,.35)]"><s.icon size={24} /></span>
                {i < STEPS.length - 1 && <span className="my-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-brand/40 to-brand/5" />}
              </div>
              <div className="pb-10">
                <p className="text-xs font-semibold tracking-[0.14em] text-brand">QADAM {s.n}</p>
                <h3 className="mt-1.5 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
