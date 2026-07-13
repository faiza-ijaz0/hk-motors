import { Gauge, Handshake, ShieldCheck, Wrench } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent } from "@/components/ui/card";

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

export function WhyChooseUsSection() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Why HK Motors
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Why Choose Us
          </h2>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
