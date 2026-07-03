import Hero from "@/components/home/Hero";
import StatsBand from "@/components/home/StatsBand";
import ProductGrid from "@/components/home/ProductGrid";
import AppSection from "@/components/home/AppSection";
import RatesSection from "@/components/RatesSection";
import {
  SimulatorTeaser,
  SecurityBand,
  Testimonials,
  NewsSection,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ProductGrid />
      <AppSection />
      <SimulatorTeaser />
      <RatesSection />
      <SecurityBand />
      <Testimonials />
      <NewsSection />
    </>
  );
}
