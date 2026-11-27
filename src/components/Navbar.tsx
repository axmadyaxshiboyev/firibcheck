"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/#qanday-ishlaydi", label: "Qanday ishlaydi?" },
  { href: "/firibgarlik-turlari", label: "Firibgarlik turlari" },
  { href: "/qollanma", label: "Qo'llanma" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line/80 bg-white/75 backdrop-blur-xl" : "border-b border-transparent bg-white/0"
      )}
    >
      <nav className="container flex h-[72px] items-center justify-between" aria-label="Asosiy navigatsiya">
        <Link href="/" aria-label="FiribCheck bosh sahifa" className="rounded-xl">
          <Logo />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                    isActive(l.href) ? "text-ink" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {isActive(l.href) && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-surface-2" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#tekshiruv" className="btn-primary btn-shine h-11 rounded-xl px-5 text-sm md:h-11">
            Xabarni tekshirish
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] bg-white/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="container flex flex-col gap-1 pt-6">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-line py-5 text-2xl font-semibold tracking-tight">
                    {l.label}
                    <ArrowRight size={20} className="text-ink-faint" />
                  </Link>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-6">
                <Link href="/#tekshiruv" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Xabarni tekshirish <ArrowRight size={18} />
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
