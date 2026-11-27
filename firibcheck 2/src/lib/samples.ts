export interface Sample {
  id: string;
  label: string;
  text: string;
}

/** Namuna xabarlar — real firibgarlik xabarlariga o'xshatib yozilgan (o'quv maqsadida). */
export const SAMPLES: Sample[] = [
  {
    id: "prize",
    label: "Soxta yutuq xabari",
    text:
      "Tabriklaymiz! Siz Uzum Market aksiyasida 5 000 000 so'm yutib oldingiz. Sovrinni olish uchun 24 soat ichida karta raqamingiz va SMS-kodni bit.ly/uzum-sovga havolasiga kiriting. Aks holda yutuq bekor qilinadi.",
  },
  {
    id: "job",
    label: "Shubhali ish taklifi",
    text:
      "Assalomu alaykum! Uyda o'tirib kuniga 400 000 so'm daromad qiling. Tajriba shart emas — faqat layk bosish va oddiy vazifalar bajarish. Ishni boshlash uchun ro'yxatdan o'tish to'lovi 50 000 so'm. Batafsil ma'lumot uchun @ish_admin_uz ga lichkaga yozing.",
  },
  {
    id: "card",
    label: "Karta ma'lumotlarini so'rash",
    text:
      "Hurmatli mijoz! Humo kartangiz xavfsizlik sababli bloklandi. Blokdan chiqarish uchun karta raqami, amal qilish muddati va SMS orqali kelgan kodni shu raqamga yuboring. Aks holda hisobingiz 2 soat ichida yopiladi.",
  },
];
