import { Award, Handshake, ShieldCheck, Target } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about HK Motors — our story, our values, and why enthusiasts trust us with their next vehicle.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity First",
    description:
      "Transparent pricing, honest condition reports, and no pressure sales tactics.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Every vehicle is inspected and certified before it reaches our floor.",
  },
  {
    icon: Handshake,
    title: "Relationships Over Transactions",
    description:
      "We measure success by how long customers stay with us, not just one sale.",
  },
  {
    icon: Target,
    title: "Precision in Everything",
    description:
      "From detailing to paperwork, we treat every detail as part of the experience.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Built by enthusiasts, for enthusiasts."
        description="HK Motors started with a simple idea: buying and owning a performance vehicle should feel as good as driving one. Today we're a full-service dealership built around that same standard."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                Our Story
              </p>
              <h2 className="font-display text-2xl sm:text-3xl">
                A dealership built around the drive
              </h2>
              <p className="text-muted-foreground">
                HK Motors was founded on the belief that a car dealership should
                feel like a garage among friends, not a sales floor. We source
                vehicles we&apos;d want to drive ourselves, inspect them to a
                standard we&apos;d stake our name on, and back every sale with
                service that doesn&apos;t stop at the handshake.
              </p>
              <p className="text-muted-foreground">
                From first inquiry to years of ownership after, our team is here
                to make sure every part of that experience matches the car
                itself.
              </p>
            </div>
            <div className="border-border bg-card flex items-center justify-center rounded-2xl border p-10">
              <p className="font-display text-muted-foreground text-center text-xl">
                &ldquo;Matte Black. Metallic Silver. Performance Red.
                That&apos;s not just our palette — it&apos;s how we work.&rdquo;
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              What We Stand For
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Our values
            </h2>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.05}>
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-3">
                    <value.icon className="text-primary size-6" />
                    <div>
                      <p className="font-medium">{value.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
