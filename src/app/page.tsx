import { Benefits } from "@/components/marketing/benefits";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { FoundingOffer } from "@/components/marketing/founding-offer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { TemplateExamples } from "@/components/marketing/template-examples";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TemplateExamples />
      <Benefits />
      <FoundingOffer />
      <Faq />
      <FinalCta />
    </>
  );
}
