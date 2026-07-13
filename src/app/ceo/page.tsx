import { Quote, UserRound } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Meet Our CEO | ${siteConfig.name}`,
  description:
    "Meet the CEO of HK Motors and the vision driving our commitment to premium vehicles and service.",
};

export default function CeoPage() {
  return (
    <>
      <PageHero eyebrow="Leadership" title="Meet Our CEO" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div className="border-border bg-card flex aspect-square w-full max-w-xs items-center justify-center self-start rounded-2xl border lg:max-w-none">
              <UserRound className="text-muted-foreground size-20" />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl">
                  Founder & CEO
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">HK Motors</p>
              </div>

              <div className="border-primary text-muted-foreground border-l-2 pl-4 italic">
                <Quote className="text-primary mb-2 size-5" />
                <p>
                  &ldquo;We built HK Motors on the idea that buying a car should
                  feel like joining a community of people who care about the
                  same things you do — performance, craftsmanship, and
                  honesty.&rdquo;
                </p>
              </div>

              <div className="text-muted-foreground space-y-4 text-sm sm:text-base">
                <p>
                  With a career spent around performance and luxury vehicles,
                  our CEO founded HK Motors to bring a more personal, more
                  transparent approach to an industry that often feels neither.
                  That philosophy still shapes every decision the team makes —
                  from which vehicles we source to how we treat every customer
                  who walks through the door.
                </p>
                <p>
                  Today, that vision continues to guide HK Motors as it grows: a
                  dealership built on trust, driven by a genuine passion for the
                  cars we sell.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
