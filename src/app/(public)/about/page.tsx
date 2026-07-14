import {
  Award,
  Eye,
  Handshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { companyStats } from "@/constants/company-stats";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about HK Motors — our story, mission, vision, achievements, and the team behind the brand.",
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

      {/* Story */}
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

      {/* Mission & Vision */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FadeIn>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-3">
                  <Target className="text-primary size-7" />
                  <h2 className="font-display text-xl sm:text-2xl">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    To make owning a performance vehicle feel as exceptional as
                    driving one — through honest pricing, rigorous inspection,
                    and service that respects your time and your car.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-3">
                  <Eye className="text-primary size-7" />
                  <h2 className="font-display text-xl sm:text-2xl">
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    To become the most trusted name in premium automotive retail
                    — known not just for the vehicles we sell, but for the
                    relationships we build long after the sale.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-border border-t">
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

      {/* Achievements */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              Milestones
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Our Achievements
            </h2>
          </FadeIn>

          <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {companyStats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.05}>
                <div className="text-center">
                  <p className="font-display text-primary text-3xl sm:text-4xl lg:text-5xl">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs tracking-wide uppercase sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* Pulls from `team_members` once the Supabase data layer is wired
          up — see docs/ARCHITECTURE.md §7. */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              Our People
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Meet the Team
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-8">
            <EmptyState
              icon={Users}
              title="Team profiles coming soon"
              description="We're putting together profiles for the people behind HK Motors. In the meantime, say hello to our CEO."
            >
              <Button asChild variant="outline">
                <Link href="/ceo">Meet Our CEO</Link>
              </Button>
            </EmptyState>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
