"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CreditCard, Gift, ImageUp, Link2, LoaderCircle, Lock, ScanSearch, ShieldCheck, TriangleAlert, Type, Upload, X, Bot, FileText } from "lucide-react";
import { useChecker, type Mode } from "./CheckerProvider";
import { ResultCard } from "./ResultCard";
import { SAMPLES } from "@/lib/samples";
import { MAX_LENGTH } from "@/lib/analyzer";
import { SectionHead } from "../Reveal";
import { cn } from "@/lib/cn";
import { FILE_ACCEPT } from "@/lib/files";

const TABS: { id: Mode; label: string; icon: typeof Type }[] = [
  { id: "text", label: "Matn", icon: Type },
  { id: "link", label: "Havola", icon: Link2 },
  { id: "image", label: "Skrinshot", icon: ImageUp },
  { id: "file", label: "Fayl", icon: FileText },
];
const SAMPLE_ICONS: Record<string, typeof Gift> = { prize: Gift, job: BriefcaseBusiness, card: CreditCard };

export function Checker() {
  const c = useChecker();
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const loading = c.status === "loading";
  const ocr = c.status === "ocr";

  const onPaste = (e: React.ClipboardEvent) => {
    const f = Array.from(e.clipboardData.files || []).find((x) => x.type.startsWith("image/"));
    if (f) { e.preventDefault(); c.handleImage(f); }
  };

  const progressLabel = () => {
    const p = c.image?.progress;
    if (!p) return null;
    if (p.stage === "load") return `Til modellari tayyorlanmoqda… ${Math.round(p.progress * 100)}%`;
    return `Matn o'qilmoqda… ${Math.round(p.progress * 100)}%`;
  };

  return (
    <section id="tekshiruv" className="relative border-y border-line bg-surface-2 py-20 md:py-28" aria-labelledby="tekshiruv-title">
      <div className="container">
        <SectionHead
          center
          id="tekshiruv-title"
          eyebrow="Tekshiruv"
          title="Shubhali xabarni tekshiring"
          sub="Xabar matnini, havolani, skrinshotni yoki faylni kiriting. FiribCheck xavf belgilarini tahlil qilib, natijani tushuntiradi."
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:mt-14 lg:grid-cols-2 [&>*]:min-w-0">
          {/* KIRITISH */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="card flex flex-col gap-5 p-5 md:p-7 lg:sticky lg:top-24"
            onPaste={onPaste}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) c.handleFile(f); }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="fc-input" className="text-[15px] font-semibold">
                {c.mode === "image" ? "Skrinshot orqali tekshirish" : c.mode === "file" ? "Fayl orqali tekshirish" : c.mode === "link" ? "Havola" : "Xabar matni yoki havola"}
              </label>
              <button type="button" onClick={c.reset} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink">
                <X size={15} /> Tozalash
              </button>
            </div>

            <div role="tablist" aria-label="Kiritish turi" className="flex gap-1 rounded-[14px] bg-[#F1F3F7] p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={c.mode === t.id}
                  onClick={() => c.setMode(t.id)}
                  className={cn("relative flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-1 py-2.5 text-[13px] font-semibold transition-colors sm:text-sm", c.mode === t.id ? "text-ink" : "text-ink-soft hover:text-ink")}
                >
                  {c.mode === t.id && <motion.span layoutId="checker-tab" className="absolute inset-0 rounded-[10px] bg-white shadow-sm" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <t.icon size={16} className="relative max-[430px]:hidden" />
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>

            {/* FAYL REJIMI */}
            <AnimatePresence initial={false}>
              {c.mode === "file" && (
                <motion.div key="file" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  {!c.file ? (
                    <button
                      type="button"
                      onClick={() => docRef.current?.click()}
                      className={cn("flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-dashed px-6 py-9 text-center transition-colors", drag ? "border-brand bg-brand-soft" : "border-[#93B4FF] bg-brand-soft/60 hover:bg-brand-soft")}
                    >
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand shadow-sm"><FileText size={24} /></span>
                      <span className="text-base font-semibold">Faylni shu yerga tashlang</span>
                      <span className="text-sm text-ink-soft">APK (ruxsatlar tekshiriladi), DOCX, TXT, EML<br />Fayl brauzeringizdan chiqmaydi</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-line p-3">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-2 text-brand"><FileText size={22} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{c.file.name}</p>
                        <p className="mt-1 text-[13px] font-medium text-ink-soft">{c.file.busy ? "O'qilmoqda…" : `${c.file.size >= 1048576 ? (c.file.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(c.file.size / 1024)) + " KB"} · ${c.file.kind === "apk" ? "ruxsatlar tekshirildi" : "matn olindi"}`}</p>
                      </div>
                      <button type="button" onClick={c.clearFile} aria-label="Faylni olib tashlash" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-soft hover:text-ink">
                        <X size={15} />
                      </button>
                    </div>
                  )}
                  <input ref={docRef} type="file" accept={FILE_ACCEPT} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) c.handleFile(f); e.target.value = ""; }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* RASM REJIMI */}
            <AnimatePresence initial={false}>
              {c.mode === "image" && (
                <motion.div key="img" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  {!c.image ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={cn("flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-dashed px-6 py-9 text-center transition-colors", drag ? "border-brand bg-brand-soft" : "border-[#93B4FF] bg-brand-soft/60 hover:bg-brand-soft")}
                    >
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand shadow-sm">
                        <Upload size={24} />
                      </motion.span>
                      <span className="text-base font-semibold">Skrinshotni shu yerga tashlang</span>
                      <span className="text-sm text-ink-soft">yoki faylni tanlang · Ctrl+V bilan joylang<br />PNG, JPG, WEBP · 10 MB gacha</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-line p-3">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image.url} alt="Yuklangan skrinshot" className="h-full w-full object-cover" />
                        {ocr && <span className="absolute inset-x-0 h-[3px] animate-scan bg-brand shadow-[0_0_12px_2px_rgba(37,99,235,.6)]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{c.image.file.name}</p>
                        {ocr ? (
                          <>
                            <p className="mt-1 text-[13px] font-medium text-brand" aria-live="polite">{progressLabel()}</p>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5ECFB]">
                              <motion.div className="h-full rounded-full bg-brand" animate={{ width: `${Math.round((c.image.progress?.progress || 0) * 100)}%` }} />
                            </div>
                          </>
                        ) : c.image.error ? (
                          <p className="mt-1 text-[13px] font-medium text-danger">{c.image.error}</p>
                        ) : (
                          <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-ok"><ShieldCheck size={14} /> Matn olindi{c.image.confidence ? ` · aniqlik ~${c.image.confidence}%` : ""}</p>
                        )}
                      </div>
                      <button type="button" onClick={c.clearImage} aria-label="Rasmni olib tashlash" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-soft hover:text-ink">
                        <X size={15} />
                      </button>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) c.handleImage(f); e.target.value = ""; }} />
                </motion.div>
              )}
            </AnimatePresence>

            {((c.mode !== "image" && c.mode !== "file") || (c.mode === "image" && c.image && !ocr) || (c.mode === "file" && c.file?.kind === "text" && !c.file.busy)) && (
              <div className="relative">
                {(c.mode === "image" || c.mode === "file") && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">{c.mode === "file" ? "Fayldan olingan matn" : "Rasmdan olingan matn"} · tahrirlash mumkin</p>}
                <textarea
                  id="fc-input"
                  value={c.text}
                  onChange={(e) => c.setText(e.target.value.slice(0, MAX_LENGTH))}
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") c.run(); }}
                  placeholder={c.mode === "link" ? "https://… shubhali havolani joylashtiring" : "Shubhali SMS yoki Telegram xabarini shu yerga joylashtiring..."}
                  rows={c.mode === "link" ? 3 : c.mode === "image" || c.mode === "file" ? 5 : 8}
                  aria-invalid={!!c.error}
                  aria-describedby="fc-help"
                  className={cn(
                    "w-full resize-y rounded-2xl border-[1.5px] bg-white px-4 pb-9 pt-4 text-[16px] leading-relaxed outline-none transition-all placeholder:text-ink-faint",
                    c.error ? "border-danger" : "border-line focus:border-brand focus:shadow-[0_0_0_4px_rgba(37,99,235,.12)]"
                  )}
                />
                <span className="pointer-events-none absolute bottom-3 right-4 text-xs font-medium tabular-nums text-ink-faint">{c.text.length} / {MAX_LENGTH}</span>
              </div>
            )}

            <AnimatePresence>
              {c.error && (
                <motion.p role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="-mt-2 flex items-center gap-2 text-sm font-medium text-danger">
                  <TriangleAlert size={16} /> {c.error}
                </motion.p>
              )}
            </AnimatePresence>

            {c.mode === "text" && (
              <button type="button" onClick={() => c.setMode("image")} className="-mt-1 flex items-center gap-2 rounded-xl bg-brand-soft px-3.5 py-3 text-left text-[13px] font-medium text-brand transition-colors hover:bg-[#E2EDFF]">
                <ImageUp size={16} className="shrink-0" /> Skrinshot yoki fayl (APK, DOCX, TXT) bo'lsa, tegishli tabni tanlang yoki uni shu yerga tashlang.
              </button>
            )}

            <div>
              <p className="text-[13px] font-medium text-ink-soft">Namunani sinab ko'ring</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SAMPLES.map((s) => {
                  const Icon = SAMPLE_ICONS[s.id] || Gift;
                  return (
                    <button key={s.id} type="button" onClick={() => c.loadSample(s.id)} className="flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white">
                      <Icon size={15} /> {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {c.aiAvailable && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-3.5">
                <input type="checkbox" checked={c.aiOn} onChange={(e) => c.setAiOn(e.target.checked)} className="peer sr-only" />
                <span className="relative mt-0.5 h-6 w-10 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-brand peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-brand" />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold"><Bot size={15} /> AI bilan chuqurroq tahlil</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">Yoqilsa, matn (rasm emas) qo'shimcha tahlil uchun Anthropic AI serveriga yuboriladi. FiribCheck uni saqlamaydi.</span>
                </span>
              </label>
            )}

            <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
              <p id="fc-help" className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft sm:max-w-[300px]">
                <Lock size={14} className="mt-0.5 shrink-0" />
                {c.aiOn && c.aiAvailable ? "Matn qoidalar asosida brauzeringizda va AI xizmatida tahlil qilinadi. Rasm faqat brauzeringizda o'qiladi." : "Matn, rasm va fayl faqat brauzeringizda, qoidalar asosida tahlil qilinadi va saqlanmaydi."}
              </p>
              <button type="button" onClick={() => c.run()} disabled={loading || ocr || (c.mode === "file" && c.file?.kind === "apk")} className="btn-primary btn-shine min-w-[170px]">
                {loading ? (<><LoaderCircle size={18} className="animate-spin" /> Tahlil qilinmoqda…</>) : ocr ? (<><ScanSearch size={18} /> Rasm o'qilmoqda…</>) : (<>Tekshirish <ArrowRight size={18} /></>)}
              </button>
            </div>
          </motion.div>

          {/* NATIJA */}
          <div id="natija" aria-live="polite" className="scroll-mt-24">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card relative overflow-hidden p-7">
                  <motion.div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand/10 to-transparent" animate={{ y: [0, 380, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
                  <div className="flex items-center gap-5">
                    <div className="h-[120px] w-[120px] animate-pulse rounded-full border-[9px] border-line" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-28 animate-pulse rounded-full bg-line/70" />
                      <div className="h-5 w-4/5 animate-pulse rounded-lg bg-line/70" />
                      <div className="h-4 w-3/5 animate-pulse rounded-lg bg-line/60" />
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-surface-2" style={{ animationDelay: `${i * 120}ms` }} />)}</div>
                  <p className="mt-6 text-center text-sm font-medium text-ink-soft">Xavf belgilari tekshirilmoqda…</p>
                </motion.div>
              ) : c.result ? (
                <ResultCard key={"res" + c.result.score + c.result.length} />
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white/60 p-10 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand"><ScanSearch size={28} /></span>
                  <p className="mt-5 text-lg font-semibold">Natija shu yerda paydo bo'ladi</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">Xabarni kiriting yoki namunalardan birini tanlang. Siz xavf darajasi, aniqlangan belgilar va keyingi xavfsiz qadamlarni ko'rasiz.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
