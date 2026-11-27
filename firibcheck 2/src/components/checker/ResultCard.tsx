"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, CircleAlert, CircleCheck, Copy, Info, Link2, Phone, RotateCcw, ShieldCheck, TriangleAlert, Check } from "lucide-react";
import { useChecker } from "./CheckerProvider";
import { ScoreRing } from "./ScoreRing";
import { resultToText, type RiskLevel, type Severity } from "@/lib/analyzer";
import { cn } from "@/lib/cn";

const LEVEL: Record<RiskLevel, { label: string; icon: typeof TriangleAlert; cls: string }> = {
  high: { label: "Yuqori xavf", icon: TriangleAlert, cls: "bg-danger-soft text-danger" },
  medium: { label: "O'rta xavf", icon: CircleAlert, cls: "bg-warn-soft text-warn" },
  low: { label: "Past xavf", icon: CircleCheck, cls: "bg-ok-soft text-ok" },
};
const SEV: Record<Severity, { cls: string; icon: typeof TriangleAlert; label: string }> = {
  high: { cls: "bg-danger-soft text-danger", icon: TriangleAlert, label: "Jiddiy" },
  medium: { cls: "bg-warn-soft text-warn", icon: CircleAlert, label: "O'rtacha" },
  low: { cls: "bg-surface-2 text-ink-soft", icon: Info, label: "Kuchsiz" },
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function ResultCard() {
  const { result: r, ai, aiError, reset } = useChecker();
  const [copied, setCopied] = useState(false);
  if (!r) return null;
  const L = LEVEL[r.level];

  const copy = async () => {
    const t = resultToText(r, ai);
    try { await navigator.clipboard.writeText(t); }
    catch {
      const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } finally { ta.remove(); }
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: 10 }}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08, delayChildren: 0.15 } } }}
      className="card flex min-w-0 flex-col gap-6 overflow-hidden p-5 md:p-7"
      aria-label="Tahlil natijasi"
    >
      <motion.div variants={item} className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ScoreRing score={r.score} level={r.level} />
        <div>
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold", L.cls)}>
            <L.icon size={15} /> {L.label}
          </span>
          <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight md:text-[22px]">{r.headline}</h3>
          <p className="mt-1.5 text-xs text-ink-soft">Taxminiy ko'rsatkich — tasdiqlangan ehtimollik emas. Aniqlangan belgilar asosida hisoblangan.</p>
        </div>
      </motion.div>

      <motion.p variants={item} className="text-[15px] leading-relaxed text-ink">{r.summary}</motion.p>

      {r.signals.length > 0 && (
        <motion.div variants={item}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-soft">Aniqlangan xavf belgilari · {r.signals.length}</p>
          <ul className="mt-3 space-y-2.5">
            {r.signals.map((s, i) => {
              const S = SEV[s.severity];
              return (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                  className="rounded-2xl border border-line p-4"
                >
                  <div className="flex gap-3.5">
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", S.cls)}><S.icon size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-semibold">{s.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", S.cls)}>{S.label}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{s.detail}</p>
                      {s.evidence.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {s.evidence.map((e) => (
                            <span key={e} className="max-w-full truncate rounded-lg bg-surface-2 px-2 py-1 font-mono text-[11.5px] text-ink">“{e}”</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}

      {r.urls.length > 0 && (
        <motion.div variants={item} className="rounded-2xl border border-line p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Link2 size={15} /> Topilgan havolalar</p>
          <ul className="mt-2 space-y-1.5">
            {r.urls.map((u) => (
              <li key={u.url} className="flex flex-wrap items-center gap-2 text-[13px]">
                <code className="break-all rounded-md bg-surface-2 px-1.5 py-0.5">{u.host}</code>
                {u.official && !u.flags.length ? <span className="text-ok">ma'lum rasmiy domen</span> : u.flags.length ? <span className="text-warn">shubhali belgilar bor</span> : <span className="text-ink-soft">noma'lum domen</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft">Havolalar ochilmaydi — faqat manzil tuzilishi tekshiriladi.</p>
        </motion.div>
      )}

      {r.notes.length > 0 && (
        <motion.ul variants={item} className="space-y-2">
          {r.notes.map((n) => (
            <li key={n} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft"><Info size={15} className="mt-0.5 shrink-0" /> {n}</li>
          ))}
        </motion.ul>
      )}

      {ai && (ai.summary || ai.extraSignals.length > 0) && (
        <motion.div variants={item} className="rounded-2xl border border-[#D9E4FF] bg-gradient-to-br from-[#F4F8FF] to-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Bot size={16} className="text-brand" /> AI qo'shimcha tahlili</p>
          {ai.summary && <p className="mt-2 text-[14px] leading-relaxed">{ai.summary}</p>}
          {ai.extraSignals.length > 0 && (
            <ul className="mt-3 space-y-2">
              {ai.extraSignals.map((s) => (
                <li key={s.title} className="text-[13px]"><b className="font-semibold">{s.title}.</b> <span className="text-ink-soft">{s.detail}</span></li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-ink-soft">AI natijasi ham xato bo'lishi mumkin. {ai.adjustment !== 0 && `Ball AI bahosi bilan ${ai.adjustment > 0 ? "+" : ""}${ai.adjustment} ga tuzatildi.`}</p>
        </motion.div>
      )}
      {aiError && <motion.p variants={item} className="text-xs text-ink-soft">{aiError}</motion.p>}

      <motion.div variants={item} className="rounded-2xl bg-brand-soft p-5">
        <p className="text-base font-semibold">Nima qilish kerak?</p>
        <ul className="mt-3 space-y-2.5">
          {[...r.advice, ...(ai?.advice || [])].slice(0, 8).map((a) => (
            <li key={a} className="flex gap-2.5 text-[14px] leading-relaxed"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" /> {a}</li>
          ))}
        </ul>
        {r.level !== "low" && (
          <a href="tel:102" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:text-brand">
            <Phone size={15} /> Pul yoki ma'lumot berib qo'ydingizmi? 102
          </a>
        )}
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-secondary h-12 flex-1"><RotateCcw size={17} /> Boshqa xabarni tekshirish</button>
        <button type="button" onClick={copy} className="btn-secondary h-12 flex-1" aria-live="polite">
          {copied ? (<><Check size={17} className="text-ok" /> Nusxalandi</>) : (<><Copy size={17} /> Natijani nusxalash</>)}
        </button>
      </motion.div>

      <motion.p variants={item} className="flex gap-2 text-xs leading-relaxed text-ink-soft">
        <Info size={14} className="mt-0.5 shrink-0" /> Bu tahlil dastlabki bahodir. Natija xabarning xavfsiz ekanini kafolatlamaydi.
      </motion.p>
    </motion.article>
  );
}
