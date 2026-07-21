"use client";

import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { heroVideo } from "@/config/media";
import { HeroFallbackImage } from "@/features/home/hero-fallback-image";

// If autoplay is blocked, the file errors, or the connection is too slow to
// start playback within this window, the video fades out and the animated
// fallback image takes over — the fallback layer is always mounted
// underneath, so there's never a gap between the two.
const VIDEO_TIMEOUT_MS = 4000;

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let settled = false;
    const markFailed = () => {
      if (!settled) {
        settled = true;
        setVideoOk(false);
      }
    };
    const markPlaying = () => {
      settled = true;
      clearTimeout(timeout);
    };

    video.addEventListener("playing", markPlaying);
    video.addEventListener("error", markFailed);
    video.addEventListener("stalled", markFailed);

    video.play()?.catch(markFailed);

    const timeout = setTimeout(markFailed, VIDEO_TIMEOUT_MS);

    return () => {
      video.removeEventListener("playing", markPlaying);
      video.removeEventListener("error", markFailed);
      video.removeEventListener("stalled", markFailed);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="border-border relative flex min-h-[85vh] items-center overflow-hidden border-b sm:min-h-[92vh]">
      <div className="absolute inset-0">
        <HeroFallbackImage src={heroVideo.fallbackImage} />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroVideo.poster}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            videoOk ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>

        {/* Flat cinematic scrim — keeps the whole frame at ~65% dark so text
            never has to fight bright footage, whatever the clip. */}
        <div aria-hidden className="absolute inset-0 bg-black/65" />

        {/* Directional depth: darkest behind the copy on the left, lifting
            toward the right so the video still reads through. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
        />

        {/* Subtle red accent glow — warmth, not brightness. */}
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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-sm">
              Pakistan&apos;s Premier Luxury &amp; Performance Dealership
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white [text-shadow:0_4px_24px_rgb(0_0_0_/_65%)] sm:text-5xl lg:text-6xl">
              Exceptional Vehicles. Uncompromising Standards.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0_/_70%)] sm:text-lg">
              Step into a curated collection of premium and performance vehicles
              — each hand-selected, rigorously inspected, and backed by a
              dealership built on transparency, expertise, and genuine care for
              every customer who walks through our doors.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="shadow-luxury">
                  <Link href="/cars">Explore Our Collection</Link>
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
