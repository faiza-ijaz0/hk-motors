"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { TestimonialCard } from "@/features/home/testimonial-card";
import { useInfiniteCarousel } from "@/hooks/use-infinite-carousel";

import type { Testimonial } from "@/config/testimonials";

const AUTOPLAY_MS = 4500;

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const {
    visibleCount,
    canLoop,
    extended,
    index,
    animate,
    next,
    prev,
    setPaused,
    transitionMs,
  } = useInfiniteCarousel(testimonials, AUTOPLAY_MS);

  if (testimonials.length === 0) return null;

  if (!canLoop) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    );
  }

  const itemWidth = 100 / visibleCount;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * itemWidth}%)`,
            transition: animate ? `transform ${transitionMs}ms ease` : "none",
          }}
        >
          {extended.map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="shrink-0 px-2"
              style={{ width: `${itemWidth}%` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous testimonials"
        className="border-border bg-background/80 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-elevated absolute top-1/2 -left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors sm:-left-5"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next testimonials"
        className="border-border bg-background/80 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-elevated absolute top-1/2 -right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors sm:-right-5"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
