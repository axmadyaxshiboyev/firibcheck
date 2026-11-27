"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./Logo";

const IntroCtx = createContext<{ ready: boolean }>({ ready: true });
export const useIntroReady = () => useContext(IntroCtx).ready;

/**
 * Sayt ochilish animatsiyasi: qalqon chiziladi, belgi qo'yiladi, so'ng suv tomchisi
 * kengayib sahifani ochadi. Har sessiyada bir marta ko'rsatiladi; reduced-motion'da o'tkazib yuboriladi.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "reveal" | "done">("intro");

  const finish = useCallback(() => {
    setPhase("done");
    try { sessionStorage.setItem("fc-intro", "1"); } catch {}
    document.documentElement.dataset.intro = "done";
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = !!sessionStorage.getItem("fc-intro"); } catch {}
    if (reduce || seen) { finish(); return; }
    document.documentElement.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("reveal"), 650);
    const t2 = setTimeout(() => { document.documentElement.style.overflow = ""; finish(); }, 1250);
    return () => { clearTimeout(t1); clearTimeout(t2); document.documentElement.style.overflow = ""; };
  }, [finish]);

  return (
    <IntroCtx.Provider value={{ ready: phase !== "intro" }}>
      {children}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            id="fc-intro"
            key="intro"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            animate={phase === "reveal" ? { clipPath: "circle(0% at 50% 50%)" } : { clipPath: "circle(150% at 50% 50%)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden
          >
            {/* suv halqalari */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-brand/25"
                initial={{ width: 40, height: 40, opacity: 0 }}
                animate={{ width: 520, height: 520, opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.8, delay: 0.35 + i * 0.28, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#C7DAFF] via-[#EAF1FF] to-white blur-3xl"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <div className="relative flex items-center gap-3">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                <LogoMark size={64} draw />
              </motion.div>
              <div className="overflow-hidden">
                <motion.span
                  className="block text-[2.4rem] font-extrabold tracking-[-0.04em] text-[#0F1B33]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  Firib<span className="text-brand">Check</span>
                </motion.span>
              </div>
            </div>
            <motion.p
              className="absolute bottom-[18%] text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Avval tekshiring
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </IntroCtx.Provider>
  );
}
