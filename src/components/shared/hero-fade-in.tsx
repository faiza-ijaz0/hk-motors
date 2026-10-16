import { cn } from "@/lib/utils";

import type { CSSProperties, ReactNode } from "react";

/**
 * CSS-only entrance animation for above-the-fold hero content. Unlike
 * `FadeIn` (framer-motion, scroll-triggered), it needs no JavaScript, so
 * headings are painted as soon as the HTML arrives instead of waiting for
 * hydration — which keeps Largest Contentful Paint fast. Disabled under
 * `prefers-reduced-motion` (see `.hero-fade-in` in globals.css).
 */
export function HeroFadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("hero-fade-in", className)}
      style={{ "--hero-fade-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
