import {
  CarFront,
  ClipboardCheck,
  FileText,
  HandCoins,
  Repeat,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { ServicesHero } from "@/features/services/services-hero";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Services | ${siteConfig.name}`,
  description:
    "Buy, sell, trade in, finance, inspect, and register your vehicle — everything HK Motors offers under one roof.",
};

// Static list for now — will be replaced by a `services` table fetch once
// the Supabase data layer is wired up (see docs/ARCHITECTURE.md §5.6).
const services = [
  {
    icon: CarFront,
    title: "Buy Car",
    description:
      "Browse our certified inventory of new, used, and premium vehicles, hand-picked for condition and value.",
    cta: { label: "Browse Cars", href: "/cars" },
  },
  {
    icon: HandCoins,
    title: "Sell Car",
    description:
      "Get a fair, transparent offer on your current vehicle — no haggling, no pressure, just an honest number.",
    cta: { label: "Get an Offer", href: "/contact" },
  },
  {
    icon: Repeat,
    title: "Trade In",
    description:
      "Trade toward your next vehicle with a valuation backed by real market data, applied straight to your purchase.",
    cta: { label: "Start a Trade-In", href: "/contact" },
  },
  {
    icon: Wallet,
    title: "Financing",
    description:
      "Guidance through financing options so you can drive away with confidence, not confusion.",
    cta: { label: "Discuss Financing", href: "/contact" },
  },
  {
    icon: ClipboardCheck,
    title: "Vehicle Inspection",
    description:
      "A full multi-point inspection performed by our own specialists, on any vehicle you're considering.",
    cta: { label: "Book an Inspection", href: "/contact" },
  },
  {
    icon: FileText,
    title: "Registration",
    description:
      "We handle the paperwork — registration and transfer, taken care of so you can focus on driving.",
    cta: { label: "Get Help", href: "/contact" },
  },
];

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />

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
                <CardFooter>
                  <Button asChild variant="link" className="px-0">
                    <Link href={service.cta.href}>{service.cta.label}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
