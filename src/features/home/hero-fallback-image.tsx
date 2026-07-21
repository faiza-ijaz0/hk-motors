"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Slow, edge-safe horizontal pan (right → left → right, infinite). The
 * image is rendered 20% wider than its container and offset, so the pan
 * never reveals empty space at either edge.
 */
export function HeroFallbackImage({ src }: { src: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-[-10%] h-full w-[120%]"
        animate={{ x: ["0%", "-8%", "0%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="120vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
