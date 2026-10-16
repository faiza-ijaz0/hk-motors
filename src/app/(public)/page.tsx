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

// The homepage is otherwise prerendered once at build time, which freezes
// whatever the featured-cars read returned then (e.g. an empty state if
// Supabase was down and DEMO_DATA_FALLBACK was off) until the next deploy.
// Regenerate hourly so it recovers on its own.
export const revalidate = 3600;

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
