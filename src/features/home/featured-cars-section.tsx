import { Sparkles } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { FeaturedCarsCarousel } from "@/features/home/featured-cars-carousel";
import { getFeaturedCars } from "@/services/cars";

export async function FeaturedCarsSection() {
  const cars = await getFeaturedCars();

  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Handpicked
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Featured Vehicles
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            Hand-picked luxury and performance vehicles currently available at
            HK Motors.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          {cars.length > 0 ? (
            <FeaturedCarsCarousel cars={cars} />
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Featured vehicles coming soon"
              description="Our team is curating a handpicked selection of standout vehicles. Check back shortly."
            >
              <Button asChild variant="outline">
                <Link href="/cars">Browse All Cars</Link>
              </Button>
            </EmptyState>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
