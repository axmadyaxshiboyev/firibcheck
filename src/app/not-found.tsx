import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-[7rem] font-light leading-none tracking-[-0.06em] text-line md:text-[10rem]">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sahifa topilmadi</h1>
      <p className="mt-3 max-w-md text-ink-soft">Bu manzil mavjud emas. Shubhali havola orqali kelgan bo'lsangiz — ehtiyot bo'ling.</p>
      <Link href="/" className="btn-primary mt-8">Bosh sahifaga qaytish <ArrowRight size={18} /></Link>
    </section>
  );
}
