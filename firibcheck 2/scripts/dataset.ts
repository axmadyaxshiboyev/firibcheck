// Aniqlik sinovi uchun to'plam. DIQQAT: bu SINTETIK namunalar (haqiqiy firibgarlik xabarlariga
// o'xshatib yozilgan). Haqiqiy xabarlar bilan to'ldirib borish kerak (scripts/benchmark.ts).
//
// scam=true  -> dvigatel kamida "medium" bersa to'g'ri hisoblanadi
// scam=false -> dvigatel "low" bersa to'g'ri hisoblanadi

export type Item = { t: string; scam: boolean; tag: string };

export const DATASET: Item[] = [
  // ---------------- FIRIBGARLIK: bank / karta / OTP ----------------
  { scam: true, tag: "bank", t: "Hurmatli mijoz! Kartangiz bloklandi. Blokdan chiqarish uchun SMS-kodni yuboring: http://humo-karta.xyz/login" },
  { scam: true, tag: "bank", t: "Sizning Uzcard kartangizdan shubhali operatsiya aniqlandi. Zudlik bilan karta raqami va amal qilish muddatini ayting." },
  { scam: true, tag: "bank", t: "Assalomu alaykum, men Hamkorbank xavfsizlik xodimiman. Hisobingizga hujum bo'lmoqda, telefoningizga kelgan kodni ayting." },
  { scam: true, tag: "bank", t: "Click: hisobingiz vaqtincha cheklandi. Tasdiqlash uchun click-uz-verify.top saytiga kiring va kartangiz ma'lumotlarini kiriting." },
  { scam: true, tag: "bank", t: "Payme xavfsizlik xizmati. Kartangizdan 2 500 000 so'm yechilmoqda. Bekor qilish uchun SMS kodni bering." },
  { scam: true, tag: "bank", t: "Ваша карта заблокирована. Для разблокировки срочно сообщите код из СМС и номер карты." },
  { scam: true, tag: "bank", t: "Здравствуйте, служба безопасности банка. По вашей карте подозрительная операция. Назовите три цифры на обороте карты." },
  { scam: true, tag: "bank", t: "Ҳурматли мижоз! Картангиз блокланди. Блокдан чиқариш учун СМС-кодни юборинг: http://humo-karta.xyz/login" },
  { scam: true, tag: "bank", t: "Milliy bank: akkauntingiz 24 soat ichida o'chiriladi. Ma'lumotlaringizni yangilang: nbu-online.click/update" },
  { scam: true, tag: "bank", t: "Uzum Bank. Kartangiz xavfsizlik sababli muzlatildi, PIN kodni yuboring, aks holda hisob yopiladi." },
  { scam: true, tag: "bank", t: "Karta orqa tomonidagi 3 xonali raqamni aytsangiz, pulingizni qaytarib beramiz." },
  { scam: true, tag: "bank", t: "Sizga kredit rasmiylashtirilgan. Bekor qilish uchun kelgan tasdiqlash kodini ayting, aks holda javobgarlikka tortilasiz." },
  { scam: true, tag: "bank", t: "SQB: hisobingizga kirishga urinish bo'ldi. Agar bu siz bo'lmasangiz, kodni shu raqamga yuboring: +998 90 123 45 67" },
  { scam: true, tag: "bank", t: "Vasha karta zablokirovana, soobshite kod iz SMS srochno" },

  // ---------------- FIRIBGARLIK: yutuq ----------------
  { scam: true, tag: "prize", t: "Tabriklaymiz! Siz Uzum aksiyasida iPhone 15 yutib oldingiz! Sovrinni olish uchun bit.ly/uzum-yutuq havolasiga kiring va karta raqamingizni kiriting." },
  { scam: true, tag: "prize", t: "Siz g'olib deb topildingiz! 10 000 000 so'm pul mukofoti. Yetkazib berish uchun 50 000 so'm to'lov qiling." },
  { scam: true, tag: "prize", t: "Поздравляем! Вы выиграли автомобиль. Для получения приза оплатите комиссию и пришлите данные карты." },
  { scam: true, tag: "prize", t: "Sizning raqamingiz lotereyada tanlab olindi. Yutuqni olish uchun bugungacha ro'yxatdan o'tish to'lovini o'tkazing." },
  { scam: true, tag: "prize", t: "Beeline sovg'a o'yini: siz 5 mln so'm yutdingiz, olish uchun beeline-sovga.xyz ga kiring, shoshiling, faqat bugun!" },

  // ---------------- FIRIBGARLIK: ish / investitsiya ----------------
  { scam: true, tag: "job", t: "Uyda o'tirib ishlang! Kuniga 500 000 so'm, tajriba shart emas. Ro'yxatdan o'tish uchun 100 000 so'm depozit to'lang. Telegram: @ish_oson_uz" },
  { scam: true, tag: "job", t: "Oson daromad: layk bosib pul ishlang, vazifalarni bajaring. Boshlash uchun botga kiring t.me/pul_ishla_bot" },
  { scam: true, tag: "job", t: "Работа на дому без опыта, доход от 300$ в неделю. Для начала переведите страховой взнос на карту." },
  { scam: true, tag: "invest", t: "Kuniga 10% kafolatlangan daromad! Kripto investitsiya, risksiz. Hoziroq botga kiring: t.me/profit_uz_bot" },
  { scam: true, tag: "invest", t: "Pulingizni 3 baravar qilamiz! Faqat 24 soat ichida kiritganlar uchun. Aloqa: WhatsApp +998 91 000 00 00" },
  { scam: true, tag: "invest", t: "Гарантированный доход 5% в день. Инвестируйте в криптовалюту без риска, пишите в личку." },
  { scam: true, tag: "invest", t: "Prezident tavsiya qilgan yangi platforma: 1 mln so'm kiriting va ertasiga 3 mln oling. Kafolatlangan foyda!" },

  // ---------------- FIRIBGARLIK: qarindosh / tanish / OLX ----------------
  { scam: true, tag: "relative", t: "Onajon, bu mening yangi raqamim. Telefonim buzildi. Zudlik bilan shu kartaga 2 mln so'm tashlab bering, keyin tushuntiraman" },
  { scam: true, tag: "relative", t: "Assalomu alaykum, akam avariyaga tushdi, militsiya ushladi. Muammoni hal qilish uchun 5 000 000 so'm kartaga o'tkazing, shoshiling." },
  { scam: true, tag: "olx", t: "Mashina hali sotilmagan, lekin bron qilish uchun oldindan to'lov 500$ kartaga o'tkazing, bugun oxirgi imkoniyat" },
  { scam: true, tag: "olx", t: "OLX: sizning e'loningizni sotib olmoqchiman. Yetkazib berish uchun karta ma'lumotlaringiz va kelgan SMS kodni yuboring." },
  { scam: true, tag: "olx", t: "Telefon juda arzon, 800 000 so'm. Avans 200 000 so'mni kartaga tashlang, kuryer ertaga olib keladi." },

  // ---------------- FIRIBGARLIK: APK / fayl ----------------
  { scam: true, tag: "apk", t: "Assalomu alaykum, to'yimizga taklifnoma yubordim, taklifnoma.apk faylni oching" },
  { scam: true, tag: "apk", t: "Bu sening rasmingmi? Mana ko'r: rasm_ko'rish.apk" },
  { scam: true, tag: "apk", t: "Sud chaqiruv qog'ozi. Faylni yuklab oling va o'rnating: sud_chaqiruv.apk, aks holda jarima to'laysiz." },
  { scam: true, tag: "apk", t: "MyID yangilanishi. Ilovani o'rnating: myid-uz.top/MyID.apk, bo'lmasa akkauntingiz o'chiriladi." },
  { scam: true, tag: "apk", t: "Ta'ziya: marhumning rasmlari shu yerda, ilovani yuklab oling va oching http://foto-album.site/album.apk" },
  { scam: true, tag: "apk", t: "Davlat xizmatlari: yangi ilovani o'rnating, jarimangiz bor. Yuklab olish: gov-jarima.click/app.apk" },

  // ---------------- FIRIBGARLIK: pochta / kuryer / soliq / boshqa ----------------
  { scam: true, tag: "delivery", t: "Assalomu alaykum, men sizning kurerizman. Paket keldi, manzilni aniqlashtirish uchun mana bu linkdan kiring: delivery-uz-track.top/a1" },
  { scam: true, tag: "delivery", t: "UzPost: jo'natmangiz omborda saqlanmoqda. Yetkazib berish uchun 15 000 so'm to'lang: uzpost-pay.xyz/p" },
  { scam: true, tag: "tax", t: "Soliq qo'mitasi: sizda 1 450 000 so'm qarzdorlik bor. 24 soat ichida to'lamasangiz, hisobingiz bloklanadi: soliq-tolov.click" },
  { scam: true, tag: "tax", t: "Sizning nomingizga jarima yozildi. Jarimani to'lash uchun karta ma'lumotlarini kiriting: my-gov-jarima.top" },
  { scam: true, tag: "mule", t: "Kartangizni ijaraga bering, oyiga 2 mln so'm to'laymiz. Faqat kartangiz orqali pul o'tkazib turamiz." },
  { scam: true, tag: "mule", t: "SIM-kartangizni sotasizmi? Har biriga 300 000 so'm beramiz, hujjat kerak emas." },
  { scam: true, tag: "verify", t: "Telegram akkauntingiz bloklanadi. Tasdiqlash uchun login va parolni kiriting: telegram-verify.xyz" },
  { scam: true, tag: "identity", t: "Kredit uchun pasportingizning rasmi va JShShIR raqamingizni yuboring, 500 000 so'm bonus beramiz." },
  { scam: true, tag: "job", t: "Vakansiya: operator. Maosh 6 mln, tajriba shart emas. Hujjat ro'yxatidan o'tish uchun 150 000 so'm komissiya o'tkazing." },
  { scam: true, tag: "romance", t: "Salom, men chet eldaman, sizga sovg'a yubordim. Bojxonada to'lov kerak, 2 mln so'm kartaga tashlang." },

  // ---------------- FIRIBGARLIK: evasion (yashirish) ----------------
  { scam: true, tag: "evasion", t: "K a r t a n g i z  b l o k l a n d i.  S M S  k o d n i  y u b o r i n g" },
  { scam: true, tag: "evasion", t: "Kartangiz bloklandi! SMS k0dni yuboring zudlik bilan" },
  { scam: true, tag: "evasion", t: "Kartаngiz blоklandi, kоdni yubоring (SMS)" }, // aralash kirill harflari
  { scam: true, tag: "evasion", t: "Siz yut​ib old​ingiz! Sovrinni olish uchun kartaning raqamini yuboring" }, // zero-width
  { scam: true, tag: "evasion", t: "Vasha karta zablokirovana. Soobshite kod iz sms i nomer karty." },
  { scam: true, tag: "evasion", t: "PIN-k0d va CVV ni ayting, hisobingiz bloklanadi" },

  // ---------------- ODDIY (xavfsiz) XABARLAR ----------------
  { scam: false, tag: "ham", t: "Ertaga soat 10 da uchrashamiz, hujjatlarni olib kel." },
  { scam: false, tag: "ham", t: "Assalomu alaykum, bugun dars bo'lmaydi, ustoz kasal ekan." },
  { scam: false, tag: "ham", t: "Onajon, kechqurun non olib kelaman, boshqa nima kerak?" },
  { scam: false, tag: "ham", t: "Jamoa, haftalik hisobotni juma kuni soat 5 gacha yuboringlar." },
  { scam: false, tag: "ham", t: "Bugun ob-havo yaxshi, parkka chiqamizmi?" },
  { scam: false, tag: "ham", t: "Привет! Во сколько завтра встречаемся? Я приду к двум." },
  { scam: false, tag: "ham", t: "Спасибо за помощь вчера, с меня обед." },
  { scam: false, tag: "ham", t: "Ассалому алайкум, эртага йиғилишга келасизми?" },
  { scam: false, tag: "ham", t: "Dars jadvali o'zgardi: dushanba kuni 2-juftlik o'rniga 3-juftlik bo'ladi." },
  { scam: false, tag: "ham", t: "Sinfdoshlar, imtihon 15-dekabrda soat 9:00 da, 204-xonada." },
  { scam: false, tag: "ham", t: "Tug'ilgan kuning bilan! Sog'lik, baxt tilayman." },
  { scam: false, tag: "ham", t: "Mehmonlar 7 da keladi, shirinlik olib kelishni unutma." },
  { scam: false, tag: "ham", t: "Hujjatni elektron pochtaga yubordim, ko'rib chiqing, iltimos." },
  { scam: false, tag: "ham", t: "Akam, mashinani ertaga olib qo'yaman, kalit sizdami?" },
  { scam: false, tag: "ham", t: "Bugun ikkita qo'ng'iroq bo'ldi, mijoz narxni so'rayapti." },
  { scam: false, tag: "ham", t: "Fayllarni Google Drive ga yukladim, havolani guruhga tashlayman." },
  { scam: false, tag: "ham", t: "Mana o'sha rasm: https://t.me/mening_kanalim" },

  // ---------------- XAVFSIZ: haqiqiy bank/xizmat SMS ----------------
  { scam: false, tag: "bank-real", t: "Kod: 482913. Uni hech kimga bermang. Click orqali to'lovni tasdiqlash." },
  { scam: false, tag: "bank-real", t: "Payme: tasdiqlash kodi 5821. Kodni hech kimga aytmang, hatto bank xodimiga ham." },
  { scam: false, tag: "bank-real", t: "Uzcard: hisobingizdan 45 000 so'm yechildi. Qoldiq: 1 230 000 so'm." },
  { scam: false, tag: "bank-real", t: "Humo: kartangizga 2 000 000 so'm tushdi. Balans: 2 150 000 so'm." },
  { scam: false, tag: "bank-real", t: "Ваш код подтверждения: 7731. Никому не сообщайте этот код." },
  { scam: false, tag: "bank-real", t: "Ucell: balansingiz 5 000 so'm. Internet paketingiz 3 kundan keyin tugaydi." },
  { scam: false, tag: "bank-real", t: "Beeline: sizning tarifingiz yangilandi. Batafsil ma'lumot uchun beeline.uz saytiga kiring." },
  { scam: false, tag: "bank-real", t: "Soliq to'lovingizni my.gov.uz orqali amalga oshirishingiz mumkin." },
  { scam: false, tag: "bank-real", t: "Yandex Go: haydovchi yo'lda, avtomobil Nexia, 01 A 123 BC." },
  { scam: false, tag: "bank-real", t: "Express24: buyurtmangiz yetkazib berildi. Rahmat! express24.uz" },
  { scam: false, tag: "bank-real", t: "Uzum: buyurtmangiz yo'lda. Kuryer ertaga 10:00–14:00 oralig'ida keladi. uzum.uz" },
  { scam: false, tag: "bank-real", t: "Hurmatli mijoz, Agrobank ish vaqti o'zgardi: 9:00–18:00. agrobank.uz" },

  // ---------------- XAVFSIZ: qiyin (yolg'on signal xavfi) ----------------
  { scam: false, tag: "hard", t: "Loyiha kodini menga yuboring, parolni keyin aytaman, ertaga ko'rib chiqamiz" },
  { scam: false, tag: "hard", t: "GitHub repo kodi tayyor, kirish uchun parolni jamoa chatida ayting" },
  { scam: false, tag: "hard", t: "Wi-Fi parolini bering, iltimos, mehmonlar keldi" },
  { scam: false, tag: "hard", t: "Ma'lumot: https://advisable.com/blog yangi maqola chiqdi" },
  { scam: false, tag: "hard", t: "Sayt: https://government-news.com ni ko'rdingmi?" },
  { scam: false, tag: "hard", t: "Maqola: https://www.visa.com/travel dan viza haqida ma'lumot oldim" },
  { scam: false, tag: "hard", t: "Kod yozishni o'rganyapman, bugun 3 ta vazifa bajardim" },
  { scam: false, tag: "hard", t: "Karta olish uchun bankka bordim, ertaga tayyor bo'ladi" },
  { scam: false, tag: "hard", t: "Aksiya: 20% chegirma faqat bugun, do'konimizga keling! Toshkent, Chilonzor." },
  { scam: false, tag: "hard", t: "Investitsiya kursida o'qiyapman, bugun risk haqida dars bo'ldi" },
  { scam: false, tag: "hard", t: "Sinov muddati tugamoqda, hujjatlarni oxirgi kungacha topshiring (universitet qabul)" },
  { scam: false, tag: "hard", t: "Bu pulni qaytarish kerak edi, men bugun akam kartasiga o'tkazib qo'ydim" },
  { scam: false, tag: "hard", t: "Telegram kanalimizga qo'shiling: t.me/dasturlash_uz, har kuni yangi darslar" },
  { scam: false, tag: "hard", t: "Ish uchun rezyume yubordim, intervyu juma kuni soat 11 da ekan" },
  { scam: false, tag: "hard", t: "Kuryer pochta orqali yubordi, kuzatuv raqami 12345, kelganda xabar qilaman" },
  { scam: false, tag: "hard", t: "Mashina sotiladimi? Ko'rib, keyin pulini qo'lma-qo'l beraman." },
  { scam: false, tag: "hard", t: "Apk fayl nima ekanligini tushuntirib bera olasizmi? Darsda o'tdik" },
  { scam: false, tag: "hard", t: "https://my.gov.uz saytida ariza topshirdim, javobni kutyapman" },
];
