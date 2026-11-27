"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowRight, ImageUp, KeyRound, Link2, Lock, ScanText, ShieldCheck, Sparkles, Type, Clock } from "lucide-react";
import { LiquidLazy } from "../LiquidLazy";
import { useIntroReady } from "../IntroProvider";
import { useChecker, type Mode } from "../checker/CheckerProvider";
import { cn } from "@/lib/cn";
import { useDesktop } from "@/lib/useDesktop";

const WORDS_1 = ["Har", "bir", "xabarga", "ishonmang."];
const WORDS_2 = ["Avval", "tekshiring."];

const TABS: { id: Mode; label: string; icon: typeof Type }[] = [
  { id: "text", label: "Matn", icon: Type },
  { id: "link", label: "Havola", icon: Link2 },
  { id: "image", label: "Skrinshot", icon: ImageUp },
];

function FloatChip({ className, delay, depth, mx, my, children }: { className: string; delay: number; depth: number; mx: ReturnType<typeof useSpring>; my: ReturnType<typeof useSpring>; children: React.ReactNode }) {
  const x = useTransform(mx, (v: number) => v * depth);
  const y = useTransform(my, (v: number) => v * depth);
  return (
    <motion.div style={{ x, y }} className={cn("pointer-events-none absolute z-10 hidden lg:block", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{ opacity: { delay, duration: 0.6 }, scale: { delay, duration: 0.6 }, y: { delay, duration: 6 + depth * 4, repeat: Infinity, ease: "easeInOut" } }}
        className="glass flex items-center gap-2.5 rounded-2xl py-2.5 pl-2.5 pr-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ready = useIntroReady();
  const desktop = useDesktop();
  const { submitFromHero, handleImage } = useChecker();
  const [tab, setTab] = useState<Mode>("text");
  const [value, setValue] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mxRaw.set(((e.clientX - r.left) / r.width - 0.5) * 40);
    myRaw.set(((e.clientY - r.top) / r.height - 0.5) * 30);
  };

  const pickFile = (f?: File | null) => {
    if (!f) return;
    handleImage(f);
    setTimeout(() => document.getElementById("tekshiruv")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (tab === "image") { fileRef.current?.click(); return; }
    if (!value.trim()) { setErr(tab === "link" ? "Havolani kiriting." : "Xabar matnini kiriting."); return; }
    setErr(null);
    submitFromHero(value);
  };

  const word = (w: string, i: number, accent = false) => (
    <span
      key={w + i}
      className={cn("fc-rise inline-block pr-[0.22em]", accent && "text-gradient")}
      style={{ animationDelay: `${i * 50}ms` }}
    >
      {w}
    </span>
  );

  return (
    <section ref={sectionRef} onPointerMove={onMove} className="relative -mt-[72px] overflow-hidden pb-20 pt-[150px] md:pb-28 md:pt-[180px]">
      {/* Suyuq fon */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_110%,#7FA8FF_0%,#C9DBFF_45%,#FFFFFF_80%)]" aria-hidden />
      <LiquidLazy className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_32%,rgba(255,255,255,.88),rgba(255,255,255,0)_70%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" aria-hidden />

      {/* Suv tomchilari */}
      {desktop && [
        { c: "left-[7%] top-[22%] h-36 w-36", d: 0.6 },
        { c: "right-[9%] top-[17%] h-24 w-24", d: 0.9 },
        { c: "right-[13%] bottom-[22%] h-14 w-14", d: 1.1 },
        { c: "left-[13%] bottom-[18%] h-10 w-10", d: 1.3 },
      ].map((o, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={cn("pointer-events-none absolute hidden rounded-full md:block", o.c)}
          style={{
            background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.98), rgba(214,228,255,.55) 45%, rgba(110,150,250,.32) 100%)",
            border: "1.5px solid rgba(255,255,255,.9)",
            boxShadow: "0 24px 40px -10px rgba(37,80,200,.22), inset -6px -10px 20px rgba(90,130,240,.18)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={ready ? { opacity: 1, scale: 1, y: [0, -14, 0], x: [0, 6, 0] } : undefined}
          transition={{ opacity: { delay: o.d, duration: 0.8 }, scale: { delay: o.d, duration: 0.8 }, y: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" }, x: { duration: 9 + i, repeat: Infinity, ease: "easeInOut" } }}
        />
      ))}

      {ready && desktop && (
        <>
          <FloatChip className="left-[5%] top-[44%] rotate-[3deg]" delay={1.1} depth={0.6} mx={mx} my={my}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-danger-soft text-danger"><KeyRound size={17} /></span>
            <span><b className="block text-sm font-semibold">SMS-kod so'ralmoqda</b><span className="text-xs text-ink-soft">Yuqori xavf belgisi</span></span>
          </FloatChip>
          <FloatChip className="left-[4%] top-[70%] -rotate-[2deg]" delay={1.3} depth={1} mx={mx} my={my}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-warn-soft text-warn"><Clock size={17} /></span>
            <span><b className="block text-sm font-semibold">"24 soat ichida"</b><span className="text-xs text-ink-soft">Shoshiltirish</span></span>
          </FloatChip>
          <FloatChip className="right-[5%] top-[40%] -rotate-[3deg]" delay={1.2} depth={0.8} mx={mx} my={my}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-warn-soft text-warn"><Link2 size={17} /></span>
            <span><b className="block text-sm font-semibold">bit.ly/yutuq-uz</b><span className="text-xs text-ink-soft">Qisqartirilgan havola</span></span>
          </FloatChip>
          <FloatChip className="right-[4%] top-[68%] rotate-[2deg]" delay={1.4} depth={1.2} mx={mx} my={my}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand"><ScanText size={17} /></span>
            <span><b className="block text-sm font-semibold">Skrinshotdan matn olindi</b><span className="text-xs text-ink-soft">Brauzer ichida OCR</span></span>
          </FloatChip>
        </>
      )}

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container relative z-20 flex flex-col items-center text-center">
        <div
          className="fc-rise glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink md:text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
          </span>
          Raqamli xavfsizlik • O'zbekiston
        </div>

        <h1 className="mt-7 max-w-[1000px] text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl md:text-[5rem]">
          <span className="block">{WORDS_1.map((w, i) => word(w, i))}</span>
          <span className="block">{WORDS_2.map((w, i) => word(w, i + WORDS_1.length, i === 1))}</span>
        </h1>

        <p
          style={{ animationDelay: "200ms" }}
          className="fc-rise mt-6 max-w-[640px] text-base leading-relaxed text-ink-soft md:text-[19px]"
        >
          Shubhali SMS, Telegram xabari, havola yoki skrinshotni tahlil qiling. Xavf belgilarini tushuning va o'zingizni firibgarlikdan himoya qiling.
        </p>

        <form
          onSubmit={submit}
          style={{ animationDelay: "280ms" }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}
          className={cn("fc-rise glass mt-10 w-full max-w-[820px] rounded-[28px] p-2.5 text-left transition-shadow md:p-3.5", drag && "ring-2 ring-brand")}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2.5 md:px-0">
            <div role="tablist" aria-label="Kiritish turi" className="flex w-full gap-1 rounded-[14px] bg-[#EEF2F8]/80 p-1 sm:w-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => { setTab(t.id); setErr(null); if (t.id === "image") fileRef.current?.click(); }}
                  className={cn("relative flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold transition-colors sm:flex-none", tab === t.id ? "text-ink" : "text-ink-soft hover:text-ink")}
                >
                  {tab === t.id && <motion.span layoutId="hero-tab" className="absolute inset-0 rounded-[10px] bg-white shadow-sm" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <t.icon size={15} className="relative" />
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <span className="hidden items-center gap-1.5 pr-2 text-[13px] font-medium text-ink-soft sm:flex">
              <ImageUp size={14} /> Skrinshotni shu yerga tashlang
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-[20px] border border-[#DCE5F5] bg-white p-2 sm:flex-row sm:items-center">
            <label htmlFor="hero-input" className="sr-only">Shubhali xabar yoki havola</label>
            <input
              id="hero-input"
              value={value}
              onChange={(e) => { setValue(e.target.value); setErr(null); }}
              onPaste={(e) => { const f = Array.from(e.clipboardData.files || [])[0]; if (f) { e.preventDefault(); pickFile(f); } }}
              placeholder={tab === "link" ? "https://… havolani joylashtiring" : tab === "image" ? "Rasm tanlash uchun bosing yoki Ctrl+V" : "Shubhali xabarni joylashtiring yoki rasm yuklang…"}
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[16px] text-ink outline-none placeholder:text-ink-faint md:text-[17px]"
              onFocus={() => { if (tab === "image") fileRef.current?.click(); }}
              readOnly={tab === "image"}
              aria-invalid={!!err}
              aria-describedby={err ? "hero-err" : undefined}
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-surface-2 text-ink transition-colors hover:bg-brand-soft hover:text-brand" aria-label="Skrinshot yuklash">
                <ImageUp size={20} />
              </button>
              <button type="submit" className="btn-primary btn-shine h-12 flex-1 sm:flex-none md:h-12">
                Tekshirish <ArrowRight size={18} />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          {err && <p id="hero-err" role="alert" className="px-3 pt-2 text-sm font-medium text-danger">{err}</p>}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-3 pb-1 pt-3 text-xs font-medium text-ink-soft">
            <span className="flex items-center gap-1.5"><Lock size={13} /> Ro'yxatdan o'tish shart emas</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Rasm brauzeringizda o'qiladi</span>
            <span className="flex items-center gap-1.5"><Sparkles size={13} /> O'zbek (lotin, kirill) va rus tillari</span>
          </div>
        </form>

        <a
          href="#qanday-ishlaydi"
          style={{ animationDelay: "400ms" }}
          className="fc-rise mt-8 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Qanday ishlaydi? ↓
        </a>
      </motion.div>
    </section>
  );
}
