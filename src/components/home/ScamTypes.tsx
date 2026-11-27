"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SCAMS } from "@/lib/scams";
import { ScamIcon } from "../ScamIcon";
import { Reveal } from "../Reveal";

export function ScamTypes() {
  return (
    <section className="border-t border-line bg-surface-2 py-20 md:py-28" aria-labelledby="scam-title">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Firibgarlik turlari</p>
            <h2 id="scam-title" className="h2 mt-4">Qanday firibgarliklardan ehtiyot bo'lish kerak?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/firibgarlik-turlari" className="group inline-flex items-center gap-2 font-semibold text-brand">
              Barcha turlar <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SCAMS.slice(0, 6).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <Link href={`/firibgarlik-turlari#${s.id}`} className="group flex h-full flex-col rounded-[22px] border border-line bg-white p-7 transition-shadow hover:shadow-card">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <ScamIcon name={s.icon} />
                  </span>
                  <span className="text-sm font-medium tabular-nums text-ink-faint">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-[21px] font-semibold leading-snug tracking-tight">{s.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Batafsil <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
