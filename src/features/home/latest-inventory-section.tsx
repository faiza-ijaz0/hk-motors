import { CarFront } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

// Pulls from `cars` ordered by created_at once the Supabase data layer is
// wired up — see docs/ARCHITECTURE.md §5.6.
export function LatestInventorySection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="border-border bg-background flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-full">
                <CarFront className="text-primary size-5" />
              </div>
              <div>
                <p className="font-medium">New arrivals coming soon</p>
                <p className="text-muted-foreground text-sm">
                  The latest additions to our inventory will appear here as soon
                  as they land.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
