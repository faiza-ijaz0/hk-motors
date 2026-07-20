"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CarCard } from "@/features/inventory/car-card";

import type { CarListItem } from "@/services/cars";

const AUTOPLAY_MS = 5000;
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

export function FeaturedCarsCarousel({ cars }: { cars: CarListItem[] }) {
  const visibleCount = useVisibleCount();
  const total = cars.length;
  const canLoop = total > visibleCount;

  const extended = canLoop
    ? [
        ...cars.slice(total - visibleCount),
        ...cars,
        ...cars.slice(0, visibleCount),
      ]
    : cars;

  const [index, setIndex] = useState(visibleCount);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Realign the window start whenever the responsive card count (and so the
  // clone offset) changes, without animating the jump.
  useEffect(() => {
    setAnimate(false);
    setIndex(visibleCount);
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [visibleCount]);

  const next = useCallback(() => setIndex((i) => i + 1), []);
  const prev = useCallback(() => setIndex((i) => i - 1), []);

  useEffect(() => {
    if (!canLoop || paused) return;
    intervalRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [canLoop, paused, next]);

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
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
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
          {extended.map((car, i) => (
            <div
              key={`${car.id}-${i}`}
              className="shrink-0 px-2"
              style={{ width: `${itemWidth}%` }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous vehicles"
        className="border-border bg-background/80 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-elevated absolute top-1/2 -left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors sm:-left-5"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next vehicles"
        className="border-border bg-background/80 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-elevated absolute top-1/2 -right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors sm:-right-5"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
