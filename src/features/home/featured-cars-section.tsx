import { Sparkles } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

// Pulls from `cars` where is_featured = true once the Supabase data layer
// is wired up — see docs/ARCHITECTURE.md §5.6.
export function FeaturedCarsSection() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Handpicked
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Featured Cars
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-8">
          <EmptyState
            icon={Sparkles}
            title="Featured vehicles coming soon"
            description="Our team is curating a handpicked selection of standout vehicles. Check back shortly."
          >
            <Button asChild variant="outline">
              <Link href="/inventory">Browse Full Inventory</Link>
            </Button>
          </EmptyState>
        </FadeIn>
      </div>
    </section>
  );
}
