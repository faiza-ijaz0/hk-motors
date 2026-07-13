"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-border relative overflow-hidden border-b">
      <div
        aria-hidden
        className="from-primary/15 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div className="flex flex-col items-start">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase sm:text-sm">
              Matte Black · Metallic Silver · Performance Red
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 max-w-xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Engineered for those who expect more.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg">
              HK Motors curates a premium inventory of performance and luxury
              vehicles, backed by expert service and a team that treats every
              car like it&apos;s the only one that matters.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/inventory">Browse Inventory</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Book a Test Drive</Link>
              </Button>
            </div>
          </FadeIn>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
        >
          <div className="border-border bg-background shadow-luxury relative aspect-[720/570] w-full overflow-hidden rounded-2xl border">
            <Image
              src="/hkmotors.jpeg"
              alt="HK Motors showroom signage"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
