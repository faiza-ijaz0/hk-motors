"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { TestimonialCard } from "@/features/home/testimonial-card";

import type { Testimonial } from "@/config/testimonials";

const AUTOPLAY_MS = 4500;
const TRANSITION_MS = 500;

function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      setCount(width < 640 ? 1 : width < 1024 ? 2 : 4);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const visibleCount = useVisibleCount();
  const total = testimonials.length;
  const canLoop = total > visibleCount;

  const extended = canLoop
    ? [
        ...testimonials.slice(total - visibleCount),
        ...testimonials,
        ...testimonials.slice(0, visibleCount),
      ]
    : testimonials;

  const [index, setIndex] = useState(visibleCount);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAnimate(false);
    setIndex(visibleCount);
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [visibleCount]);

  const scheduleAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!canLoop || paused) return;
    intervalRef.current = setInterval(
      () => setIndex((i) => i + 1),
      AUTOPLAY_MS,
    );
  }, [canLoop, paused]);

  useEffect(() => {
    scheduleAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scheduleAutoplay]);

  const next = useCallback(() => {
    setIndex((i) => i + 1);
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  const prev = useCallback(() => {
    setIndex((i) => i - 1);
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  // Seamless infinite loop: once the transition into a cloned region ends,
  // silently snap back into the equivalent real-card position.
  useEffect(() => {
    if (!canLoop) return;
    if (index === visibleCount + total) {
      const timer = setTimeout(() => {
        setAnimate(false);
        setIndex(visibleCount);
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
    if (index === visibleCount - 1) {
      const timer = setTimeout(() => {
        setAnimate(false);
        setIndex(visibleCount + total - 1);
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
  }, [index, total, visibleCount, canLoop]);

  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  if (total === 0) return null;

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
            transition: animate ? `transform ${TRANSITION_MS}ms ease` : "none",
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
