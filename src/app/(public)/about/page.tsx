import {
  Award,
  BadgeCheck,
  Eye,
  FileCheck,
  Gem,
  Handshake,
  MessageCircle,
  Repeat,
  ShieldCheck,
  Smile,
  Target,
} from "lucide-react";
import Image from "next/image";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { aboutAchievements } from "@/constants/about-achievements";
import { AboutHero } from "@/features/about/about-hero";
import { FounderSection } from "@/features/about/founder-section";
import { CtaSection } from "@/features/home/cta-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about HK Motors — our story, mission, vision, achievements, and the leadership behind the brand.",
};

const journey = [
  {
    title: "The Beginning",
    description:
      "HK Motors opened its doors with a small, carefully chosen inventory and one rule: never list a vehicle we wouldn't buy ourselves.",
  },
  {
    title: "Building Trust",
    description:
      "As word spread, so did our standards — a formal multi-point inspection and certification process became non-negotiable for every vehicle on the floor.",
  },
  {
    title: "Expanding the Showroom",
    description:
      "Growing demand let us widen our inventory into premium and performance marques, while adding financing, trade-in, and inspection services under one roof.",
  },
  {
    title: "HK Motors Today",
    description:
      "Now a full-service dealership trusted by thousands of drivers, still personally guided by the same founder and the same standard it opened with.",
  },
];

const whyChooseUs = [
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

const trustPillars = [
  {
    icon: Gem,
    title: "Premium Inventory",
    description:
      "A curated floor of luxury and performance vehicles, not a lot full of whatever came in on trade.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Vehicles",
    description:
      "Every listing is backed by a documented, multi-point inspection — nothing reaches the floor unverified.",
  },
  {
    icon: MessageCircle,
    title: "Professional Consultation",
    description:
      "Our team advises on fit and value the way we'd want to be advised, not the way that closes fastest.",
  },
  {
    icon: FileCheck,
    title: "Transparent Process",
    description:
      "Pricing, condition, and paperwork are laid out plainly from the first conversation to the last signature.",
  },
  {
    icon: Smile,
    title: "Customer Satisfaction",
    description:
      "Our satisfaction rate isn't a slogan — it's a number we track, and it's why most of our business is referrals.",
  },
  {
    icon: Repeat,
    title: "Long-Term Relationships",
    description:
      "Service and support don't end at delivery. We're still here for the second, third, and fourth car.",
  },
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                Who We Are
              </p>
              <h2 className="font-display text-2xl sm:text-3xl">
                More Than a Dealership
              </h2>
              <p className="text-muted-foreground">
                HK Motors was founded by Habibullah Khan on the belief that a
                car dealership should feel like a garage among friends, not a
                sales floor. We source vehicles we&apos;d want to drive
                ourselves, inspect them to a standard we&apos;d stake our name
                on, and back every sale with service that doesn&apos;t stop at
                the handshake.
              </p>
              <p className="text-muted-foreground">
                From first inquiry to years of ownership after, our team is here
                to make sure every part of that experience matches the car
                itself.
              </p>
            </div>
            <div className="border-border shadow-elevated relative isolate flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border p-10 sm:min-h-80 lg:min-h-0">
              <Image
                src="/aboutus.jpeg"
                alt=""
                fill
                quality={100}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="-z-10 object-cover"
              />
              <div aria-hidden className="absolute inset-0 -z-10 bg-black/60" />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/40"
              />
              <p className="font-display text-center text-xl text-white [text-shadow:0_2px_16px_rgb(0_0_0_/_75%)]">
                &ldquo;Every vehicle that leaves our showroom carries our name —
                and our reputation. That&apos;s a promise we take
                personally.&rdquo;
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Our Journey */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col items-center text-center">
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              How We Got Here
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Our Journey
            </h2>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <div className="border-border bg-background h-full rounded-2xl border p-6">
                  <p className="text-primary font-display text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-medium">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FadeIn>
              <Card variant="elevated" className="h-full">
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
              <Card variant="elevated" className="h-full">
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

      {/* Why Customers Choose HK Motors */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col items-center text-center">
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              What We Stand For
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Why Customers Choose HK Motors
            </h2>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((value, index) => (
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

      {/* Commitment to Excellence */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
              <div className="border-primary bg-card flex size-14 shrink-0 items-center justify-center rounded-full border-2">
                <ShieldCheck className="text-primary size-6" />
              </div>
              <div>
                <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                  Our Standards
                </p>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl">
                  Commitment to Excellence
                </h2>
                <p className="text-muted-foreground mt-4 max-w-3xl text-sm sm:text-base">
                  Excellence at HK Motors isn&apos;t a single inspection —
                  it&apos;s a standard applied at every stage, from the vehicles
                  we choose to source, to the specialists who prepare them, to
                  the way our team follows up long after the sale is signed.
                  It&apos;s the reason customers send us their friends and
                  family, and it&apos;s the standard we hold ourselves to
                  whether anyone is watching or not.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Achievements */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col items-center text-center">
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              Milestones
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              HK Motors Achievements
            </h2>
          </FadeIn>

          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {aboutAchievements.map((stat, index) => (
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

      {/* Customer Trust */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col items-center text-center">
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              Earned, Not Assumed
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Why Clients Trust HK Motors
            </h2>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustPillars.map((pillar, index) => (
              <FadeIn key={pillar.title} delay={index * 0.05}>
                <Card variant="elevated" className="h-full">
                  <CardContent className="flex flex-col gap-3">
                    <pillar.icon className="text-primary size-6" />
                    <div>
                      <p className="font-medium">{pillar.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {pillar.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & CEO */}
      <FounderSection />

      <CtaSection />
    </>
  );
}
