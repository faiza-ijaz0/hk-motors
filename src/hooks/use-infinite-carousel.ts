"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/**
 * Shared "clone-based" infinite carousel: renders a window of
 * `visibleCount` items (1/2/4 by breakpoint) sliding over an array padded
 * with clones of the start/end, autoplays, and reschedules its timer on
 * manual prev/next so autoplay never fights a click. Falls back to a
 * static (non-looping) grid when there aren't enough items to loop.
 */
export function useInfiniteCarousel<T>(items: T[], autoplayMs: number) {
  const visibleCount = useVisibleCount();
  const total = items.length;
  const canLoop = total > visibleCount;

  const extended = canLoop
    ? [
        ...items.slice(total - visibleCount),
        ...items,
        ...items.slice(0, visibleCount),
      ]
    : items;

  const [index, setIndex] = useState(visibleCount);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Realign the window start whenever the responsive visible count (and so
  // the clone offset) changes, without animating the jump.
  useEffect(() => {
    setAnimate(false);
    setIndex(visibleCount);
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [visibleCount]);

  const scheduleAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!canLoop || paused) return;
    intervalRef.current = setInterval(() => setIndex((i) => i + 1), autoplayMs);
  }, [canLoop, paused, autoplayMs]);

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
  // silently snap back into the equivalent real-item position.
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

  return {
    visibleCount,
    canLoop,
    extended,
    index,
    animate,
    next,
    prev,
    setPaused,
    transitionMs: TRANSITION_MS,
  };
}
