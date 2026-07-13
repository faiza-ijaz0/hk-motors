import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="border-border bg-card flex flex-col items-start gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                Ready to find your next car?
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Talk to our team or explore the current lineup — no pressure,
                just straight answers.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href="/inventory">Browse Inventory</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
