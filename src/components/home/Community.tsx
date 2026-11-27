"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ArrowRight, BookOpen, CircleCheck, Lightbulb, Link2, MessageSquareText, Share2, TriangleAlert, Users } from "lucide-react";
import { Reveal } from "../Reveal";

function Count({ to, suffix = "", format = true }: { to: number; suffix?: string; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{format ? v.toLocaleString("ru-RU").replace(/,/g, " ") : v}{suffix}</span>;
}

const W = 1200, H = 440, CX = 600, CY = 520;
const pt = (r: number, deg: number) => { const a = (deg * Math.PI) / 180; return { left: `${((CX - r * Math.cos(a)) / W) * 100}%`, top: `${((CY - r * Math.sin(a)) / H) * 100}%` }; };

const NODES = [
  { r: 480, d: 20, kind: "chip", icon: MessageSquareText, label: "Xabar", color: "text-ink-soft" },
  { r: 480, d: 56, kind: "chip", icon: TriangleAlert, label: "Xavf belgisi", color: "text-warn" },
  { r: 480, d: 92, kind: "chip", icon: Lightbulb, label: "Tavsiya", color: "text-brand" },
  { r: 480, d: 128, kind: "chip", icon: Share2, label: "Bilim ulashildi", color: "text-ink-soft" },
  { r: 480, d: 160, kind: "ok", icon: CircleCheck, label: "Firibgarlik oldi olindi", color: "text-ok" },
  { r: 350, d: 50, kind: "avatar", label: "D", bg: "#FEF3C7", fg: "#92400E" },
  { r: 350, d: 66, kind: "tile", icon: Link2, color: "text-danger" },
  { r: 350, d: 79, kind: "avatar", label: "S", bg: "#DBEAFE", fg: "#1D4ED8" },
  { r: 350, d: 92, kind: "tile", icon: Users, color: "text-brand" },
  { r: 350, d: 104, kind: "avatar", label: "O", bg: "#EDE9FE", fg: "#6D28D9" },
  { r: 350, d: 117, kind: "tile", icon: BookOpen, color: "text-ink-soft" },
  { r: 350, d: 132, kind: "avatar", label: "M", bg: "#DCFCE7", fg: "#166534" },
] as const;

export function Community() {
  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="comm-title">
      <div className="container">
        <div className="relative mx-auto hidden aspect-[1200/440] max-w-[1200px] overflow-hidden md:block">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            {[
              { r: 480, s: "#E5E7EB", w: 2 },
              { r: 350, s: "#E5E7EB", w: 2 },
              { r: 230, s: "#EEF0F3", w: 1.5, dash: "4 6" },
            ].map((a, i) => (
              <motion.path
                key={a.r}
                d={`M${CX - a.r} ${CY} A${a.r} ${a.r} 0 0 1 ${CX + a.r} ${CY}`}
                fill="none"
                stroke={a.s}
                strokeWidth={a.w}
                strokeDasharray={a.dash}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: i * 0.15, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}
            <defs><linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0.65" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" /></linearGradient></defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#fadeB)" />
          </svg>
          {NODES.map((n, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ ...pt(n.r, n.d), x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.5 + i * 0.07 }}
            >
              <motion.div animate={{ y: [0, i % 2 ? -6 : 6, 0] }} transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut" }}>
                {n.kind === "chip" && (
                  <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium shadow-[0_8px_20px_-8px_rgba(17,24,39,.12)]">
                    <n.icon size={15} className={n.color} /> {n.label}
                  </span>
                )}
                {n.kind === "ok" && (
                  <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#BBF7D0] bg-ok-soft px-3.5 py-2 text-[13px] font-medium text-ok">
                    <n.icon size={15} /> {n.label}
                  </span>
                )}
                {n.kind === "avatar" && (
                  <span className="grid h-12 w-12 place-items-center rounded-full border-4 border-white text-[15px] font-semibold shadow-[0_8px_20px_-8px_rgba(17,24,39,.2)]" style={{ background: n.bg, color: n.fg }}>{n.label}</span>
                )}
                {n.kind === "tile" && (
                  <span className={`grid h-10 w-10 place-items-center rounded-xl border border-line bg-white shadow-[0_8px_20px_-8px_rgba(17,24,39,.15)] ${n.color}`}><n.icon size={18} /></span>
                )}
              </motion.div>
            </motion.div>
          ))}
          <div className="absolute inset-x-0 top-[63%] flex justify-center gap-10 lg:gap-16">
            {[
              { v: <Count to={69962} />, l: "AT yordamidagi jinoyat" },
              { v: <><Count to={1} format={false} /> trln+</>, l: "so'm zarar" },
              { v: <>~<Count to={50} format={false} suffix="%" /></>, l: "zararli APK orqali" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-[2.75rem] font-medium leading-none tracking-[-0.04em] text-[#0F2A26] lg:text-[3.25rem]">{s.v}</p>
                <p className="mt-2 text-sm text-ink-soft">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobil statistika */}
        <div className="grid grid-cols-3 gap-3 md:hidden">
          {[["69 962", "AT yordamidagi jinoyat"], ["1 trln+", "so'm zarar"], ["~50%", "APK orqali"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
              <p className="text-xl font-semibold tracking-tight">{v}</p>
              <p className="mt-1 text-[11px] leading-tight text-ink-soft">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          2026-yil yanvar–sentabr. Manba: IIV matbuot anjumani, 9-oktabr 2026 (
          <a href="https://www.spot.uz/oz/2026/10/12/cybercrime/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">spot.uz</a>,{" "}
          <a href="https://anhor.uz/uzl/news/kiberjinoyatlar-zarar-trillion-som" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">anhor.uz</a>)
        </p>

        <Reveal className="mx-auto mt-12 max-w-4xl text-center">
          <h2 id="comm-title" className="h2">Raqamli xavfsizlik — hammamiz uchun</h2>
          <p className="lead mx-auto mt-5 max-w-2xl">Firibgarlik usullarini tanib olish va bilimlarni boshqalar bilan bo'lishish orqali ko'proq insonlarni himoya qilish mumkin.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["SMS", "Telegram", "Havolalar", "APK fayllar", "Ish takliflari", "Investitsiya"].map((t) => (
              <span key={t} className="rounded-xl border border-line px-3.5 py-2 text-sm font-medium text-ink-soft">{t}</span>
            ))}
          </div>
          <Link href="/qollanma" className="btn-primary btn-shine mt-8">Xavfsizlik qo'llanmasini o'qish <ArrowRight size={18} /></Link>
        </Reveal>
      </div>
    </section>
  );
}
