"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import type { RiskLevel } from "@/lib/analyzer";

const COLOR: Record<RiskLevel, string> = { low: "#15803D", medium: "#D97706", high: "#DC2626" };

export function ScoreRing({ score, level, size = 132 }: { score: number; level: RiskLevel; size?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const mv = useMotionValue(0);
  const dash = useTransform(mv, (v) => c - (c * v) / 100);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    mv.set(0);
    const ctrl = animate(mv, score, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => ctrl.stop();
  }, [score, mv]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Taxminiy xavf ko'rsatkichi: ${score} / 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
        <motion.circle cx="60" cy="60" r={r} fill="none" stroke={COLOR[level]} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} style={{ strokeDashoffset: dash }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.4rem] font-semibold leading-none tracking-tight tabular-nums">{shown}</span>
        <span className="mt-1 text-xs font-medium text-ink-soft">/ 100</span>
      </div>
    </div>
  );
}
