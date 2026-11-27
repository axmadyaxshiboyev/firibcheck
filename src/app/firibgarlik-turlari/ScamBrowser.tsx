"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleCheck, Search, TriangleAlert, X } from "lucide-react";
import { CATEGORIES, SCAMS, type ScamCategory } from "@/lib/scams";
import { ScamIcon } from "@/components/ScamIcon";
import { toLatin } from "@/lib/analyzer";
import { cn } from "@/lib/cn";

export function ScamBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ScamCategory | "all">("all");

  const list = useMemo(() => {
    const nq = toLatin(q.trim());
    return SCAMS.filter((s) => (cat === "all" || s.category === cat) && (!nq || toLatin([s.title, s.short, ...s.signs, ...s.prevention, s.example].join(" ")).includes(nq)));
  }, [q, cat]);

  return (
    <div className="container pb-24">
      <div className="sticky top-[72px] z-30 -mx-5 flex flex-col gap-3 border-b border-line bg-white/85 px-5 py-4 backdrop-blur-xl md:mx-0 md:flex-row md:items-center md:rounded-2xl md:border md:px-4">
        <label className="relative flex-1">
          <span className="sr-only">Qidirish</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Qidirish: SMS-kod, ish, APK, kredit…"
            className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-10 text-[15px] outline-none transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(37,99,235,.12)]"
          />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Qidiruvni tozalash" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-faint hover:text-ink"><X size={16} /></button>}
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Turkumlar">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
              className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors", cat === c.id ? "text-white" : "text-ink-soft hover:text-ink")}>
              {cat === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">{list.length} ta tur topildi</p>

      <motion.div layout className="mt-4 grid gap-5 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((s) => (
            <motion.article
              layout
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="scroll-mt-40 rounded-3xl border border-line bg-white p-6 md:p-7"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand"><ScamIcon name={s.icon} /></span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
                  <p className="text-sm text-ink-soft">{s.short}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-warn"><TriangleAlert size={15} /> Belgilari</p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft">{s.signs.map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-warn" />{x}</li>)}</ul>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ok"><CircleCheck size={15} /> Himoyalanish</p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft">{s.prevention.map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ok" />{x}</li>)}</ul>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-surface-2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Misol xabar</p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-ink">“{s.example}”</p>
                <Link href={`/?matn=${encodeURIComponent(s.example)}&namuna=custom#tekshiruv`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Shu misolni tekshirish <ArrowRight size={15} />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-line p-12 text-center">
          <p className="font-semibold">Hech narsa topilmadi</p>
          <p className="mt-1 text-sm text-ink-soft">Boshqa so'z bilan qidirib ko'ring yoki turkumni "Barchasi"ga o'zgartiring.</p>
        </div>
      )}
    </div>
  );
}
