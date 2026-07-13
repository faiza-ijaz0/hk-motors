import { Award, Gauge, Handshake, ShieldCheck, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Certified Inventory",
    description: "Every vehicle inspected and verified before it's listed.",
  },
  {
    icon: Gauge,
    title: "Performance Focused",
    description: "Curated for enthusiasts who care about how a car drives.",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description: "In-house specialists for maintenance and detailing.",
  },
  {
    icon: Handshake,
    title: "Trusted by Owners",
    description: "Transparent pricing and honest, no-pressure guidance.",
  },
];

const serviceTeasers = [
  {
    icon: Award,
    title: "Vehicle Sales",
    description:
      "New, used, and certified pre-owned vehicles across every segment.",
  },
  {
    icon: Handshake,
    title: "Trade-In & Appraisals",
    description: "Fair, transparent valuations backed by market data.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Detailing",
    description: "Factory-trained technicians and premium detailing care.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Image
          src="/hkmotors.jpeg"
          alt="HK Motors showroom signage"
          fill
          priority
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="via-background/70 to-background/25 from-background absolute inset-0 bg-gradient-to-r"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase sm:text-sm">
              Matte Black · Metallic Silver · Performance Red
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Engineered for those who expect more.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg">
              HK Motors curates a premium inventory of performance and luxury
              vehicles, backed by expert service and a team that treats every
              car like it&apos;s the only one that matters.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/inventory">Browse Inventory</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Book a Test Drive</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-3">
                    <item.icon className="text-primary size-6" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                  What We Offer
                </p>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl">
                  Services built around your car
                </h2>
              </div>
              <Button asChild variant="link" className="self-start px-0">
                <Link href="/services">View all services</Link>
              </Button>
            </div>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceTeasers.map((service, index) => (
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
        </div>
      </section>

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
    </>
  );
}
