"use client";

import { motion } from "framer-motion";

/** Subtle animated red accent glow used behind hero copy — warmth, not
 * brightness. Isolated in its own client boundary so the hero sections
 * that use it can otherwise stay Server Components. */
export function HeroGlow() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 75%, color-mix(in oklch, var(--brand-primary), transparent 65%), transparent 55%)",
      }}
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
