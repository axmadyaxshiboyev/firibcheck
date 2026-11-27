import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IntroProvider } from "@/components/IntroProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://firibcheck.vercel.app"),
  title: {
    default: "FiribCheck — Shubhali xabarni tekshiring",
    template: "%s · FiribCheck",
  },
  description:
    "Shubhali SMS, Telegram xabari, havola yoki skrinshotdagi firibgarlik belgilarini o'zbek tilida tahlil qiling. Ro'yxatdan o'tish shart emas.",
  keywords: ["firibgarlik", "phishing", "SMS-kod", "kiberxavfsizlik", "O'zbekiston", "firibcheck"],
  openGraph: {
    title: "FiribCheck — Har bir xabarga ishonmang. Avval tekshiring.",
    description: "Shubhali xabardagi xavf belgilarini tushuning va o'zingizni firibgarlikdan himoya qiling.",
    locale: "uz_UZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

const introScript = `try{if(sessionStorage.getItem('fc-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='done'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a href="#asosiy" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-card">
          Asosiy mazmunga o'tish
        </a>
        <IntroProvider>
          <Navbar />
          <main id="asosiy">{children}</main>
          <Footer />
        </IntroProvider>
      </body>
    </html>
  );
}
