import { BrandShowcaseSection } from "@/features/home/brand-showcase-section";
import { CeoPreviewSection } from "@/features/home/ceo-preview-section";
import { CtaSection } from "@/features/home/cta-section";
import { FeaturedCarsSection } from "@/features/home/featured-cars-section";
import { HeroSection } from "@/features/home/hero-section";
import { LatestInventorySection } from "@/features/home/latest-inventory-section";
import { StatisticsSection } from "@/features/home/statistics-section";
import { TestimonialsSection } from "@/features/home/testimonials-section";
import { VideoShowcaseSection } from "@/features/home/video-showcase-section";
import { WhyChooseUsSection } from "@/features/home/why-choose-us-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandShowcaseSection />
      <FeaturedCarsSection />
      <VideoShowcaseSection />
      <LatestInventorySection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <CeoPreviewSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
