import { FadeIn } from "@/components/shared/fade-in";
import { testimonials, testimonialsAreSamples } from "@/config/testimonials";
import { TestimonialsCarousel } from "@/features/home/testimonials-carousel";

export function TestimonialsSection() {
  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col items-center text-center">
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Testimonials
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            {testimonialsAreSamples
              ? "The kind of experience we aim to give every driver who finds their vehicle — and a dealership they trust — at HK Motors."
              : "Real experiences from drivers who found their vehicle — and a dealership they trust — at HK Motors."}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <TestimonialsCarousel testimonials={testimonials} />
          {testimonialsAreSamples && (
            <p className="text-muted-foreground mt-6 text-center text-xs">
              Sample reviews shown for illustration.
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
