"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/hkmotors.jpeg"
          alt="HK Motors showroom signage"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>
      <div
        aria-hidden
        className="via-background/70 to-background/25 from-background absolute inset-0 bg-gradient-to-r"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase sm:text-sm">
            Matte Black · Metallic Silver · Performance Red
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Engineered for those who expect more.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg">
            HK Motors curates a premium inventory of performance and luxury
            vehicles, backed by expert service and a team that treats every car
            like it&apos;s the only one that matters.
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
    </section>
  );
}
