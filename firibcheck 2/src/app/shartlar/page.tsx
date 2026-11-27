import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Foydalanish shartlari" };

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Foydalanish shartlari" title="Xizmatdan foydalanish shartlari" />
      <article className="prose-fc container max-w-3xl pb-24">
        <p className="text-sm">Oxirgi yangilanish: 2026-yil 16-oktabr</p>
        <h2>1. Xizmat mohiyati</h2>
        <p>FiribCheck shubhali xabarlardagi ma'lum firibgarlik belgilarini tushuntiruvchi bepul, ta'limiy vositadir. U huquqiy, moliyaviy yoki texnik ekspertiza o'rnini bosmaydi.</p>
        <h2>2. Kafolat yo'qligi</h2>
        <p>Tahlil natijasi taxminiy ko'rsatkichdir. "Past xavf" natijasi xabar xavfsiz ekanini, "yuqori xavf" natijasi esa firibgarlik aniq ekanini anglatmaydi. Xizmatdan foydalanish natijasida qabul qilingan qarorlar uchun javobgarlik foydalanuvchining o'zida.</p>
        <h2>3. Foydalanuvchi majburiyatlari</h2>
        <ul>
          <li>Xizmatga boshqa shaxslarning maxfiy ma'lumotlarini yoki o'zingizning haqiqiy parol, PIN, SMS-kod va to'liq karta raqamingizni kiritmang.</li>
          <li>Xizmatdan noqonuniy maqsadlarda (masalan, firibgarlik matnlarini "tekshiruvdan o'tkazish" uchun) foydalanmang.</li>
          <li>Avtomatlashtirilgan ommaviy so'rovlar yubormang.</li>
        </ul>
        <h2>4. Rasmiy murojaat</h2>
        <p>Agar siz firibgarlik qurboni bo'lgan bo'lsangiz, FiribCheck emas, balki bankingiz va 102 raqami orqali huquqni muhofaza qiluvchi organlar yordam bera oladi.</p>
        <h2>5. O'zgarishlar</h2>
        <p>Shartlar vaqti-vaqti bilan yangilanishi mumkin. Yangilangan sana sahifa boshida ko'rsatiladi.</p>
      </article>
    </>
  );
}
