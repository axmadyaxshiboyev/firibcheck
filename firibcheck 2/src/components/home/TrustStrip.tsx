import { Globe, Lightbulb, TriangleAlert } from "lucide-react";
import { Reveal } from "../Reveal";

const ITEMS = [
  { icon: Globe, title: "O'zbek tilida", text: "Tahlil va tavsiyalar tushunarli o'zbek tilida." },
  { icon: TriangleAlert, title: "Tushunarli izoh", text: "Xabardagi xavf belgilarini ko'rsatadi." },
  { icon: Lightbulb, title: "Amaliy tavsiyalar", text: "Keyingi xavfsiz qadamlarni tushuntiradi." },
];

export function TrustStrip() {
  return (
    <section className="container relative z-10 pb-20 md:pb-28">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-surface-2 md:grid-cols-3">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.08} className="flex gap-4 border-line p-6 md:p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><it.icon size={22} strokeWidth={1.8} /></span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-1 text-[15px] text-ink-soft">{it.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
