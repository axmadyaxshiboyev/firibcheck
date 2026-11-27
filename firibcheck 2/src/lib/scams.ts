export type ScamCategory = "pul" | "havola" | "ish" | "shaxs";

export interface ScamType {
  id: string;
  title: string;
  short: string;
  icon: "gift" | "card" | "brief" | "trend" | "link" | "package" | "phone" | "users" | "shop" | "landmark";
  category: ScamCategory;
  signs: string[];
  prevention: string[];
  example: string;
}

export const CATEGORIES: { id: ScamCategory | "all"; label: string }[] = [
  { id: "all", label: "Barchasi" },
  { id: "pul", label: "Pul va karta" },
  { id: "havola", label: "Havola va fayllar" },
  { id: "ish", label: "Ish va investitsiya" },
  { id: "shaxs", label: "Shaxsga taqlid" },
];

export const SCAMS: ScamType[] = [
  {
    id: "soxta-yutuq",
    title: "Soxta yutuqlar",
    short: "\"Siz katta sovrin yutdingiz\" kabi yolg'on va'dalar.",
    icon: "gift",
    category: "pul",
    signs: ["Siz qatnashmagan aksiya yoki o'yindan \"yutuq\"", "Sovrinni olish uchun to'lov, karta raqami yoki SMS-kod so'raladi", "Qisqa muddat: \"24 soat ichida\"", "Noma'lum yoki qisqartirilgan havola"],
    prevention: ["Aksiyani tashkilotning rasmiy sayti yoki ilovasida o'zingiz tekshiring", "Yutuq uchun hech qachon pul to'lamang", "Xabardagi havolani ochmang"],
    example: "Tabriklaymiz! Siz 5 000 000 so'm yutib oldingiz. Sovrinni olish uchun 24 soat ichida karta raqamingiz va SMS-kodni bit.ly/yutuq-uz havolasiga kiriting.",
  },
  {
    id: "karta-firibgarligi",
    title: "Bank va karta firibgarligi",
    short: "Karta ma'lumotlari, SMS-kod yoki maxfiy kodlarni so'rash.",
    icon: "card",
    category: "pul",
    signs: ["\"Kartangiz bloklandi\" degan xabar yoki qo'ng'iroq", "Karta muddati, CVV yoki SMS-kod so'raladi", "O'zini bank xodimi deb tanishtiradi", "Shoshiltiradi va qo'rqitadi"],
    prevention: ["Bank SMS-kodni hech qachon so'ramaydi", "Karta orqasidagi rasmiy raqamga o'zingiz qo'ng'iroq qiling", "Shubha tug'ilsa, kartani ilova orqali vaqtincha bloklang"],
    example: "Hurmatli mijoz! Humo kartangiz xavfsizlik sababli bloklandi. Blokdan chiqarish uchun karta raqami, amal qilish muddati va SMS orqali kelgan kodni yuboring.",
  },
  {
    id: "soxta-ish",
    title: "Soxta ish takliflari",
    short: "Ishga kirish uchun oldindan to'lov talab qilish.",
    icon: "brief",
    category: "ish",
    signs: ["\"Uyda ishlab kuniga ...\" kabi juda yuqori daromad", "Tajriba va hujjat talab qilinmaydi", "Ro'yxatdan o'tish, o'qitish yoki forma uchun to'lov", "Layk bosish, \"topshiriq\" bajarish evaziga pul"],
    prevention: ["Haqiqiy ish beruvchi ishga olish uchun pul so'ramaydi", "Kompaniyani rasmiy manbalarda tekshiring", "Shaxsiy kartangiz orqali begona pullarni aylantirmang"],
    example: "Uyda o'tirib kuniga 400 000 so'm daromad qiling. Tajriba shart emas. Ishni boshlash uchun ro'yxatdan o'tish to'lovi 50 000 so'm. @ish_admin ga yozing.",
  },
  {
    id: "soxta-investitsiya",
    title: "Soxta investitsiyalar",
    short: "Kafolatlangan katta daromad haqidagi shubhali va'dalar.",
    icon: "trend",
    category: "ish",
    signs: ["\"Kuniga 5–10% kafolatlangan foyda\"", "Kriptovalyuta yoki \"birja\" platformasi, litsenziyasiz", "Taniqli shaxsning (ko'pincha dipfeyk) videosi bilan reklama", "Yangi a'zo jalb qilishga undash (piramida belgisi)"],
    prevention: ["Investitsiyada daromad kafolatlanmaydi", "Kompaniya litsenziyasini rasmiy reyestrda tekshiring", "Video yoki reklamadagi \"tasdiqlar\"ga ishonmang"],
    example: "Kuniga 10% kafolatlangan daromad! Kripto investitsiya, risksiz. Joylar soni cheklangan, hoziroq botga kiring: t.me/profit_uz_bot",
  },
  {
    id: "phishing",
    title: "Phishing havolalari",
    short: "Soxta sayt orqali login yoki parolni qo'lga kiritish.",
    icon: "link",
    category: "havola",
    signs: ["Manzil rasmiy saytga o'xshaydi, lekin bir-ikki harf farq qiladi", "\"Hisobingizni tasdiqlang\" yoki \"ma'lumotlaringizni yangilang\"", ".xyz, .top kabi g'alati domen zonalari", "Qisqartirilgan yoki IP-manzilli havolalar"],
    prevention: ["Saytga manzilni o'zingiz yozib yoki rasmiy ilova orqali kiring", "Domen nomini harfma-harf tekshiring", "Ikki bosqichli autentifikatsiyani yoqing"],
    example: "Hisobingiz vaqtincha cheklandi. Ma'lumotlaringizni yangilash uchun http://click-uz-verify.top/login sahifasiga kiring.",
  },
  {
    id: "yetkazib-berish",
    title: "Soxta yetkazib berish xabarlari",
    short: "Buyurtma yoki yetkazib berish bahonasida to'lov ma'lumotlarini so'rash.",
    icon: "package",
    category: "havola",
    signs: ["Siz kutmagan posilka haqida xabar", "\"Bojxona\" yoki \"qayta yetkazish\" uchun kichik to'lov", "To'lov sahifasiga havola"],
    prevention: ["Buyurtma holatini do'kon yoki pochta xizmatining rasmiy ilovasida tekshiring", "Kichik summaga ham karta ma'lumotini noma'lum saytga kiritmang"],
    example: "Posilkangiz omborda ushlab qolindi. Yetkazib berish uchun 12 000 so'm to'lovni 2 soat ichida amalga oshiring: pochta-uz.online/pay",
  },
  {
    id: "apk-fayl",
    title: "Zararli APK fayllar",
    short: "Taklifnoma, rasm yoki \"yangilanish\" niqobidagi zararli ilova.",
    icon: "phone",
    category: "havola",
    signs: ["Messenjerda .apk fayl: \"to'y taklifnomasi\", \"rasmlar\", \"ta'ziya xabari\"", "\"Ko'rish uchun ilovani o'rnating\" degan talab", "Tanish raqamdan kelgan bo'lishi ham mumkin (akkaunti buzilgan)"],
    prevention: ["Messenjer orqali kelgan .apk faylni hech qachon o'rnatmang", "Ilovalarni faqat Google Play yoki App Store'dan yuklang", "Telefoningizda noma'lum manbalardan o'rnatishni o'chirib qo'ying"],
    example: "Assalomu alaykum, to'yimizga taklifnoma yubordim, ko'rish uchun taklifnoma.apk faylni oching.",
  },
  {
    id: "qarindosh",
    title: "Qarindosh yoki tanish nomidan",
    short: "\"Avariyaga tushdim\", \"yangi raqamim\" — shoshilinch pul so'rash.",
    icon: "users",
    category: "shaxs",
    signs: ["Yangi yoki noma'lum raqamdan yaqin odam nomidan yozish", "Shoshilinch pul: avariya, kasalxona, \"muammoni hal qilish\"", "Qo'ng'iroq qilishga emas, faqat yozishga undaydi"],
    prevention: ["Yaqiningizga uning eski, ma'lum raqami orqali qo'ng'iroq qiling", "Oilada maxfiy \"so'z\" kelishib oling", "Shoshilmasdan boshqa qarindoshlar bilan tekshiring"],
    example: "Onajon, bu mening yangi raqamim, telefonim buzildi. Zudlik bilan shu kartaga 2 mln so'm tashlab bering, keyin tushuntiraman.",
  },
  {
    id: "marketpleys",
    title: "Onlayn e'lon va marketpleys",
    short: "Juda arzon mahsulot taklif qilib, oldindan to'lov so'rash.",
    icon: "shop",
    category: "pul",
    signs: ["Bozor narxidan ancha arzon mahsulot yoki avtomobil", "\"Bron qilish\" uchun oldindan to'lov", "Mahsulotni ko'rsatishdan qochish, faqat Telegramda gaplashish", "Sotuvchi \"xavfsiz to'lov\" havolasini o'zi yuboradi"],
    prevention: ["Mahsulotni ko'rmasdan oldindan to'lamang", "Platformaning o'z xavfsiz to'lov tizimidan foydalaning", "Sotuvchi yuborgan \"to'lov sahifasi\" havolalariga kirmang"],
    example: "Mashina hali sotilmagan, lekin bron qilish uchun oldindan to'lov 500$ kartaga o'tkazing, bugun oxirgi imkoniyat.",
  },
  {
    id: "kredit",
    title: "Kredit va \"bekor qilish\" firibgarligi",
    short: "\"Nomingizga kredit rasmiylashtirildi, bekor qilish uchun kodni ayting\".",
    icon: "landmark",
    category: "shaxs",
    signs: ["Bank yoki \"xavfsizlik xizmati\" nomidan qo'ng'iroq", "Kreditni bekor qilish uchun SMS-kod yoki pasport ma'lumoti so'raladi", "Hujjatsiz tez kredit va'dasi"],
    prevention: ["Kredit holatingizni bank ilovasi yoki filialida tekshiring", "Pasport va SMS-kodni telefon orqali bermang", "Shubhali qo'ng'iroqni to'xtatib, bankka o'zingiz qo'ng'iroq qiling"],
    example: "Bank xavfsizlik xizmati: nomingizga 30 mln so'm kredit rasmiylashtirildi. Bekor qilish uchun pasport seriyangiz va SMS-kodni ayting.",
  },
];
