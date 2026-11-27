"use client";

import { motion } from "framer-motion";
import { useIntroReady } from "./IntroProvider";

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  const ready = useIntroReady();
  return (
    <section className="relative -mt-[72px] overflow-hidden pb-14 pt-[140px] md:pb-20 md:pt-[170px]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-10%,#DCE7FF_0%,#F3F7FF_40%,#FFFFFF_75%)]" />
      <div aria-hidden className="absolute inset-0 opacity-60 [background-image:linear-gradient(#E5E7EB_1px,transparent_1px),linear-gradient(90deg,#E5E7EB_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="container relative">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.5 }} className="eyebrow">{eyebrow}</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[4rem]"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.7, delay: 0.2 }} className="lead mt-5 max-w-2xl">
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}
