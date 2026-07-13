import { AnimatedCounter } from "@/components/shared/animated-counter";
import { FadeIn } from "@/components/shared/fade-in";
import { companyStats } from "@/constants/company-stats";

export function StatisticsSection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
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
  );
}
