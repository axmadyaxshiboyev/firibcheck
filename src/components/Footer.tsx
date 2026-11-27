import Link from "next/link";
import { Logo } from "./Logo";

const COLS = [
  { title: "Sahifalar", links: [["Bosh sahifa", "/"], ["Qanday ishlaydi?", "/#qanday-ishlaydi"], ["Xabarni tekshirish", "/#tekshiruv"]] },
  { title: "Resurslar", links: [["Firibgarlik turlari", "/firibgarlik-turlari"], ["Xavfsizlik qo'llanmasi", "/qollanma"], ["Savol-javob", "/#savol-javob"]] },
  { title: "Huquqiy", links: [["Maxfiylik siyosati", "/maxfiylik"], ["Foydalanish shartlari", "/shartlar"]] },
];

export function Footer() {
  return (
    <footer className="container pb-8">
      <div className="rounded-3xl border border-line bg-surface-2 p-8 md:p-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Shubhali xabarlardagi xavf belgilarini tushuntiruvchi ta'limiy vosita. Natijalar xavfsizlikni kafolatlamaydi.
            </p>
            <p className="mt-4 text-sm text-ink-soft">
              Pul yoki ma'lumot yo'qotdingizmi? <a href="tel:102" className="font-semibold text-ink underline decoration-line underline-offset-4">102</a> raqamiga qo'ng'iroq qiling.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-medium text-ink-soft">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map(([l, h]) => (
                    <li key={h}><Link href={h} className="text-sm font-medium text-ink transition-colors hover:text-brand">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} FiribCheck. Barcha huquqlar himoyalangan.</p>
          <p>Ta'limiy xavf-baholash vositasi.</p>
        </div>
      </div>
    </footer>
  );
}
