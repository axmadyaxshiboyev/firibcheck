"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "../Reveal";
import { cn } from "@/lib/cn";

const QA: [string, React.ReactNode][] = [
  ["FiribCheck qanday ishlaydi?", "Matndagi ma'lum xavf belgilarini — kod yoki karta ma'lumotini so'rash, shoshiltirish, oldindan to'lov, shubhali havolalar — o'zbek (lotin va kirill) va rus tilidagi qoidalar asosida qidiradi. Har bir topilgan belgi nima uchun xavfli ekani tushuntiriladi, ball esa ularning og'irligidan hisoblanadi. Skrinshot yuklasangiz, matn avval brauzeringizda o'qib olinadi."],
  ["Sayt natijasi doim to'g'rimi?", "Yo'q. Bu dastlabki, ta'limiy baho. Firibgarlar usullarini doim o'zgartiradi: \"past xavf\" chiqqan xabar ham firibgarlik bo'lishi mumkin. Shubha qolsa, tashkilotga uning rasmiy kanali orqali o'zingiz murojaat qiling."],
  ["Xabarlarim saqlanadimi?", <>Yo'q. Qoidalarga asoslangan tahlil va rasmdan matn o'qish to'liq brauzeringizda bajariladi, matn serverga yuborilmaydi. Agar sayt egasi AI tahlilini yoqqan bo'lsa va siz uni o'zingiz tanlasangiz, faqat matn AI xizmatiga yuboriladi — biz uni saqlamaymiz. Batafsil: <Link href="/maxfiylik" className="font-medium text-brand underline underline-offset-4">Maxfiylik siyosati</Link>.</>],
  ["Bank karta ma'lumotlarini yuborsam bo'ladimi?", "Hech kimga yubormang. Parol, PIN, bir martalik SMS-kod, CVV va kartaning to'liq ma'lumotlarini hech kim — bank xodimi, politsiya yoki tanishingiz ham — so'rashga haqli emas. FiribCheck'ga ham haqiqiy karta raqamingizni kiritmang."],
  ["Havola xavfsiz ko'rinsa ham xavfli bo'lishi mumkinmi?", "Ha. Phishing saytlar rasmiy manzilga juda o'xshaydi va faqat bir harf bilan farq qilishi mumkin. FiribCheck havolani ochmaydi — faqat manzil tuzilishini tekshiradi. Saytga doim manzilni o'zingiz yozib yoki rasmiy ilova orqali kiring."],
  ["Firibgarlikka duch kelsam nima qilishim kerak?", "Kod yoki karta ma'lumotini berib qo'ygan bo'lsangiz, darhol bankingizga (karta orqasidagi raqam) qo'ng'iroq qilib kartani bloklating, parollarni almashtiring va 102 raqamiga murojaat qiling. IIV ma'lumotiga ko'ra, kechikib murojaat qilinsa, pul boshqa davlatlarga o'tkazib yuborilishi mumkin."],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="savol-javob" className="border-t border-line bg-surface-2 py-20 md:py-28" aria-labelledby="faq-title">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Savol-javob</p>
          <h2 id="faq-title" className="h2 mt-4">Ko'p beriladigan savollar</h2>
          <p className="lead mt-5">Javob topmadingizmi? <Link href="/qollanma" className="font-medium text-brand underline underline-offset-4">Xavfsizlik qo'llanmasida</Link> batafsil ma'lumot bor.</p>
        </Reveal>
        <div className="space-y-3">
          {QA.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 0.04}>
                <div className={cn("rounded-2xl border bg-white transition-colors", isOpen ? "border-[#BFDBFE]" : "border-line")}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      id={`faq-btn-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[16px] font-semibold md:px-6 md:text-[17px]"
                    >
                      {q}
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors", isOpen ? "bg-brand text-white" : "bg-surface-2 text-ink")}>
                        <Plus size={16} />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft md:px-6">{a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
