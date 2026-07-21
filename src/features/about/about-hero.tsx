"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section className="border-border relative flex min-h-[60vh] items-center overflow-hidden border-b sm:min-h-[70vh]">
      <div className="absolute inset-0 bg-black">
        <Image
          src="/aboutmain.jpeg"
          alt="A premium performance vehicle from the HK Motors collection"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_58%]"
        />

        {/* Lighter scrim than the other page heroes by design — this photo
            is bright, and the goal is to let it show through while keeping
            the copy on the left readable. */}
        <div aria-hidden className="absolute inset-0 bg-black/35" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"
        />

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
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-sm">
              About HK Motors
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white [text-shadow:0_4px_24px_rgb(0_0_0_/_65%)] sm:text-5xl lg:text-6xl">
              A Dealership Built Around the Drive
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0_/_70%)] sm:text-lg">
              For over a decade, HK Motors has been home to discerning drivers
              who expect more — where every vehicle is chosen, inspected, and
              delivered to a standard we&apos;d stake our name on.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-luxury">
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
