import { Capabilities } from "@/components/marketing/capabilities";
import { Comparison } from "@/components/marketing/comparison";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { FranceFirst } from "@/components/marketing/france-first";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";
import { Problem } from "@/components/marketing/problem";
import { TemplateGallery } from "@/components/marketing/template-gallery";
import { WorkflowDemo } from "@/components/marketing/workflow-demo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <WorkflowDemo />
      <TemplateGallery />
      <Capabilities />
      <FranceFirst />
      <Pricing />
      <Comparison />
      <Faq />
      <FinalCta />
    </>
  );
}
