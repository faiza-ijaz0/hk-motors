import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { HeroGlow } from "@/components/shared/hero-glow";
import { Button } from "@/components/ui/button";
import { heroVideo } from "@/config/media";

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
            bright and visible; a touch darker behind the copy on the left
            for contrast, center/right left essentially untouched. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/62 via-black/15 to-black/0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
        />

        <HeroGlow />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
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
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="shadow-luxury">
                  <Link href="/cars">Browse Cars</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <Link
                href="/contact"
                className="group hover:text-primary inline-flex items-center gap-2 text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:underline"
              >
                <CalendarClock className="size-4" />
                Book a Test Drive
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
