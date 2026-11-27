"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function Reveal({ delay = 0, y = 28, children, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, sub, center = false, id }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h2 mt-4">{title}</h2>
      {sub && <p className={"lead mt-5 " + (center ? "mx-auto max-w-2xl" : "")}>{sub}</p>}
    </Reveal>
  );
}
