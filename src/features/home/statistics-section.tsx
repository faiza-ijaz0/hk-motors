import { AnimatedCounter } from "@/components/shared/animated-counter";
import { FadeIn } from "@/components/shared/fade-in";

// Placeholder figures — replace with real numbers before launch.
const stats = [
  { value: 500, suffix: "+", label: "Vehicles Delivered" },
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 1200, suffix: "+", label: "Happy Customers" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

export function StatisticsSection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
