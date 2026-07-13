import {
  Award,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wallet,
  Wrench,
} from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Services | ${siteConfig.name}`,
  description:
    "From sales to service, explore everything HK Motors offers to keep your vehicle — and your ownership experience — at its best.",
};

// Static list for now — will be replaced by a `services` table fetch once
// the Supabase data layer is wired up (see docs/ARCHITECTURE.md §5.6).
const services = [
  {
    icon: Award,
    title: "Vehicle Sales",
    description:
      "New, used, and certified pre-owned vehicles across every segment, hand-picked for condition and value.",
  },
  {
    icon: Handshake,
    title: "Trade-In & Appraisals",
    description:
      "Fair, transparent valuations backed by market data — know what your vehicle is worth before you decide.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Detailing",
    description:
      "Factory-trained technicians and premium detailing care to keep your vehicle performing and looking its best.",
  },
  {
    icon: Wallet,
    title: "Financing Assistance",
    description:
      "Guidance through financing options so you can drive away with confidence, not confusion.",
  },
  {
    icon: ShieldCheck,
    title: "Pre-Purchase Inspections",
    description:
      "A full multi-point inspection on any vehicle you're considering, performed by our own specialists.",
  },
  {
    icon: Sparkles,
    title: "Extended Care Plans",
    description:
      "Optional coverage plans that extend peace of mind well beyond the day you drive off the lot.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your car needs, under one roof."
        description="Beyond the sale, HK Motors offers a full suite of services designed to keep your ownership experience as premium as the vehicle itself."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.05}>
              <Card variant="elevated" className="h-full">
                <CardHeader>
                  <service.icon className="text-primary size-6" />
                  <CardTitle className="mt-2">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
