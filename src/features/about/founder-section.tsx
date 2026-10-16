import { Compass, Mail, Rocket, ShieldCheck, UserRound } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";

const highlights = [
  {
    icon: Mail,
    title: "Founder Message",
    description:
      "HK Motors was built to be the dealership I always wished existed — honest, meticulous, and genuinely glad to see you walk through the door.",
  },
  {
    icon: Compass,
    title: "Leadership Vision",
    description:
      "Every customer should be treated with the same honesty and attention to detail I'd want when buying a car myself.",
  },
  {
    icon: ShieldCheck,
    title: "Commitment to Quality",
    description:
      "No vehicle reaches our floor that I wouldn't personally stand behind — that standard doesn't change as we grow.",
  },
  {
    icon: Rocket,
    title: "Future Growth Vision",
    description:
      "We're expanding our inventory and service, but never at the cost of the trust that built HK Motors in the first place.",
  },
];

export function FounderSection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="border-border from-background to-background shadow-luxury relative flex aspect-square w-40 items-center justify-center overflow-hidden rounded-full border bg-gradient-to-b lg:w-full lg:max-w-56">
                <UserRound className="text-muted-foreground size-16" />
              </div>
              <p className="font-display mt-6 text-xl">Our Founder</p>
              <p className="text-muted-foreground text-sm">
                Founder &amp; CEO, HK Motors
              </p>
            </div>

            <div>
              <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                Leadership
              </p>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl">
                Guided by One Standard, Every Day
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {highlights.map((item, index) => (
                  <FadeIn key={item.title} delay={index * 0.05}>
                    <div className="border-border bg-background h-full rounded-2xl border p-6">
                      <item.icon className="text-primary size-6" />
                      <p className="mt-3 font-medium">{item.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
