"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="container pb-6 pt-20 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[32px] border-2 border-white px-6 py-20 text-center shadow-card md:py-24"
        style={{ background: "linear-gradient(135deg,#DBE5FF 0%,#F2F6FF 55%,#D8F4FC 100%)" }}
      >
        <motion.div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#AFC8FF] opacity-60 blur-3xl" animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#BDEBFA] opacity-70 blur-3xl" animate={{ x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-[3.25rem]">Shubhali xabar oldingizmi?</h2>
          <p className="mx-auto mt-5 max-w-lg text-ink-soft md:text-lg">Javob berishdan oldin bir daqiqa ajrating — xabarni tekshiring.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/#tekshiruv" className="btn-primary btn-shine">Xabarni tekshirish <ArrowRight size={18} /></Link>
            <Link href="/qollanma" className="btn-secondary">Qo'llanmani o'qish</Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
