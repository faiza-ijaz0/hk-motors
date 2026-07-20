"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { heroVideo } from "@/config/media";

export function HeroSection() {
  return (
    <section className="border-border relative flex min-h-[85vh] items-center overflow-hidden border-b sm:min-h-[92vh]">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroVideo.poster}
          className="h-full w-full object-cover"
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>

        <motion.div
          aria-hidden
          className="from-primary/30 absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent"
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase sm:text-sm">
              Matte Black · Metallic Silver · Performance Red
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Dream Car
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              Explore premium luxury and performance vehicles carefully selected
              by HK Motors. Discover exceptional quality, expert guidance, and a
              showroom experience built around your passion for driving.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/cars">Browse Cars</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
