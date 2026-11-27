import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Maxfiylik siyosati", description: "FiribCheck qanday ma'lumotlarni qayta ishlaydi va ularni saqlaydimi." };

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Maxfiylik siyosati" title="Sizning xabaringiz — sizniki" sub="Qisqasi: qoidalarga asoslangan tahlil va rasmdan matn o'qish to'liq brauzeringizda ishlaydi. Biz xabarlaringizni saqlamaymiz." />
      <article className="prose-fc container max-w-3xl pb-24">
        <p className="text-sm">Oxirgi yangilanish: 2026-yil 16-oktabr</p>

        <h2>1. Qanday ma'lumot qayta ishlanadi</h2>
        <ul>
          <li><b>Siz kiritgan matn yoki havola</b> — xavf belgilarini aniqlash uchun.</li>
          <li><b>Siz yuklagan rasm (skrinshot)</b> — undagi matnni o'qish uchun.</li>
          <li><b>Texnik ma'lumotlar</b> — hosting provayderi (Vercel) standart server loglarini (IP-manzil, so'rov vaqti) qisqa muddat saqlashi mumkin. Biz ularni foydalanuvchini aniqlash uchun ishlatmaymiz.</li>
        </ul>

        <h2>2. Qoidalarga asoslangan tekshiruv</h2>
        <p>Standart tekshiruv to'liq brauzeringizda (qurilmangizda) bajariladi. Matn serverga yuborilmaydi, saqlanmaydi va loglanmaydi. Sahifani yangilasangiz yoki yopsangiz, kiritilgan matn yo'qoladi.</p>

        <h2>3. Rasmdan matn o'qish (OCR)</h2>
        <p>Rasm brauzeringizda Tesseract.js kutubxonasi yordamida o'qiladi va hech qayerga yuborilmaydi. Birinchi foydalanishda o'zbek, rus va ingliz tili modellari shu saytning o'zidan yuklab olinadi va brauzer keshida saqlanadi — uchinchi tomon xizmatlari ishlatilmaydi, rasmingiz esa hech qayerga yuborilmaydi.</p>

        <h2>4. Ixtiyoriy AI tahlili</h2>
        <p>Agar sayt egasi AI xizmatini sozlagan bo'lsa, tekshiruv kartasida "AI bilan chuqurroq tahlil" tugmasi paydo bo'ladi. U standart holatda o'chiq. Uni o'zingiz yoqsangiz:</p>
        <ul>
          <li>Kiritilgan <b>matn</b> (rasm emas) serverimiz orqali Anthropic kompaniyasining Claude AI xizmatiga tahlil uchun yuboriladi. Bu uchinchi tomonga ma'lumot uzatish hisoblanadi.</li>
          <li>FiribCheck serveri matnni saqlamaydi va loglamaydi. Anthropic ma'lumotlarni o'zining maxfiylik siyosati asosida qayta ishlaydi.</li>
          <li>AI'ni xohlagan vaqtda o'chirib, faqat brauzerdagi qoidaviy tahlildan foydalanishingiz mumkin.</li>
        </ul>

        <h2>5. Brauzer xotirasi</h2>
        <p>Sayt brauzeringizda faqat ikki kichik sozlamani saqlaydi: ochilish animatsiyasi ko'rsatilganmi (sessiya davomida) va AI tugmasi holati. Cookie, reklama yoki kuzatuv skriptlari ishlatilmaydi.</p>

        <h2>6. Xizmat cheklovlari</h2>
        <p>FiribCheck — ta'limiy xavf-baholash vositasi. U xabarning xavfsiz yoki firibgarlik ekanini kafolatlay olmaydi. Natija dastlabki baho bo'lib, qaror qabul qilishda yordamchi sifatida ishlatilishi kerak.</p>

        <h2>7. Muhim eslatma</h2>
        <p>FiribCheck'ga haqiqiy parol, PIN, SMS-kod yoki to'liq karta raqamini kiritmang. Bunday ma'lumotlar tahlil uchun kerak emas.</p>
      </article>
    </>
  );
}
