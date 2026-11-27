"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const SHIELD =
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
const CHECK = "m8.6 12.3 2.6 2.6 4.9-5.4";

export function LogoMark({ size = 32, draw = false, className }: { size?: number; draw?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <motion.path
        d={SHIELD}
        stroke="#0F1B33"
        strokeWidth={2.4}
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={draw ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d={CHECK}
        stroke="#2563EB"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={draw ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.45, delay: draw ? 0.75 : 0, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Logo({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="text-[1.2rem] font-extrabold tracking-[-0.035em] text-[#0F1B33]">
        Firib<span className="text-brand">Check</span>
      </span>
    </span>
  );
}
