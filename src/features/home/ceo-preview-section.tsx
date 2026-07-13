import { Quote, UserRound } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function CeoPreviewSection() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="border-border bg-card flex flex-col items-center gap-8 rounded-2xl border p-8 text-center sm:p-12 lg:flex-row lg:items-center lg:text-left">
            <div className="border-border bg-background flex size-24 shrink-0 items-center justify-center rounded-full border sm:size-28">
              <UserRound className="text-muted-foreground size-12" />
            </div>
            <div className="flex-1">
              <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                Leadership
              </p>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl">
                Meet Our CEO
              </h2>
              <div className="text-muted-foreground mt-4 flex items-start gap-2">
                <Quote className="text-primary mt-1 size-4 shrink-0" />
                <p className="italic">
                  &ldquo;We built HK Motors on the idea that buying a car should
                  feel like joining a community of people who care about the
                  same things you do.&rdquo;
                </p>
              </div>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/ceo">Read the Full Story</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
