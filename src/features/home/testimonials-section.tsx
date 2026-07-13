import { MessageSquareQuote } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";

// Pulls from `testimonials` where status = 'approved' once the Supabase
// data layer is wired up — see docs/ARCHITECTURE.md §10.
export function TestimonialsSection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Testimonials
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            What Our Customers Say
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-8">
          <EmptyState
            icon={MessageSquareQuote}
            title="Customer stories coming soon"
            description="We're collecting stories from customers who've found their vehicle with us. Check back shortly."
          />
        </FadeIn>
      </div>
    </section>
  );
}
