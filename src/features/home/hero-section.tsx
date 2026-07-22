import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { HeroGlow } from "@/components/shared/hero-glow";
import { Button } from "@/components/ui/button";
import { heroVideo } from "@/config/media";
import { HeroCarSearch } from "@/features/home/hero-car-search";

export function HeroSection() {
  return (
    <section className="border-border relative flex min-h-[85vh] items-center overflow-hidden border-b sm:min-h-[92vh]">
      <div className="absolute inset-0 bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>

        {/* Subtle gradient overlay only — no flat scrim — so the video stays
            bright and visible; an even vignette keeps the now-centered copy
            legible no matter where it sits over the frame. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/30 to-black/15"
        />
        <div aria-hidden className="absolute inset-0 bg-black/25" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]"
        />

        <HeroGlow />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col items-center">
          <FadeIn>
            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-sm">
              Trusted Dealership · Premium Vehicles · Proven Expertise
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white [text-shadow:0_4px_24px_rgb(0_0_0_/_65%)] sm:text-5xl lg:text-6xl">
              Find Your Dream Car
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0_/_70%)] sm:text-lg">
              Explore premium luxury and performance vehicles carefully selected
              by HK Motors. Discover exceptional quality, expert guidance, and a
              showroom experience built around your passion for driving.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="shadow-luxury h-12 rounded-lg px-8 text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(192,0,0,0.6)]"
              >
                <Link href="/cars">Browse Cars</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-lg border-white/30 bg-white/5 px-8 text-sm font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/15 hover:text-white hover:shadow-[0_16px_36px_-12px_rgba(255,255,255,0.25)]"
              >
                <Link href="/contact">
                  <CalendarClock className="size-4" />
                  Book a Test Drive
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:border-primary/60 hover:bg-primary/10 h-12 rounded-lg border-white/20 bg-transparent px-8 text-sm font-semibold tracking-[0.08em] text-white/90 uppercase backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <HeroCarSearch />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
