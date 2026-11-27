"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Reveal } from "../Reveal";

const STEPS = [
  ["Shoshilmang", "\"Hozir\", \"24 soat ichida\" degan bosim — eng keng tarqalgan hiyla. Bir daqiqa to'xtang."],
  ["Havolani darhol ochmang", "Manzilni diqqat bilan tekshiring, qisqartirilgan havolalardan ehtiyot bo'ling."],
  ["SMS-kod, PIN va parolni hech kimga bermang", "Hatto o'zini bank xodimi yoki politsiya deb tanishtirgan odamga ham."],
  ["Rasmiy kanal orqali tekshiring", "Tashkilotning rasmiy sayti, ilovasi yoki karta orqasidagi raqamga o'zingiz qo'ng'iroq qiling."],
  ["Tegishli tashkilotga murojaat qiling", "Pul yoki ma'lumot yo'qotgan bo'lsangiz — darhol bankingizga va 102 raqamiga xabar bering."],
];

export function Prevention() {
  return (
    <section className="container grid gap-12 py-20 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20" aria-labelledby="prev-title">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">Profilaktika</p>
        <h2 id="prev-title" className="h2 mt-4">Shubhali xabar keldimi? Avval shu 5 qadam.</h2>
        <p className="lead mt-5">Firibgarlar shoshilish va qo'rquvdan foydalanadi. Bir daqiqa to'xtab, quyidagilarni bajaring.</p>
        <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-danger-soft px-4 py-3.5 text-sm font-semibold text-danger">
          <ShieldAlert size={20} /> Bank hech qachon SMS-kod yoki PIN so'ramaydi.
        </div>
      </Reveal>
      <ol>
        {STEPS.map(([t, d], i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group flex gap-6 border-t border-line py-7 last:border-b md:gap-8"
          >
            <span className="w-14 shrink-0 text-[2.5rem] font-light leading-none tracking-tight text-ink-faint transition-colors duration-300 group-hover:text-brand md:w-16 md:text-5xl">0{i + 1}</span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight md:text-xl">{t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{d}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
