import { CheckerProvider } from "@/components/checker/CheckerProvider";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Checker } from "@/components/checker/Checker";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScamTypes } from "@/components/home/ScamTypes";
import { Prevention } from "@/components/home/Prevention";
import { Community } from "@/components/home/Community";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <CheckerProvider>
      <Hero />
      <TrustStrip />
      <Checker />
      <HowItWorks />
      <ScamTypes />
      <Prevention />
      <Community />
      <FAQ />
      <CTA />
    </CheckerProvider>
  );
}
