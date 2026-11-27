import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ScamBrowser } from "./ScamBrowser";

export const metadata: Metadata = {
  title: "Firibgarlik turlari",
  description: "Soxta yutuq, karta firibgarligi, soxta ish, investitsiya, phishing, APK fayllar va boshqa firibgarlik turlari — belgilari, himoyalanish va misollar.",
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Firibgarlik turlari" title="Firibgarlarning eng ko'p uchraydigan usullari" sub="Har bir tur uchun xavf belgilari, himoyalanish yo'llari va misol xabar. Misolni bir bosishda tekshiruvga yuborishingiz mumkin." />
      <ScamBrowser />
    </>
  );
}
