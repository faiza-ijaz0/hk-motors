import Image from "next/image";
import Link from "next/link";

import { HeroFadeIn } from "@/components/shared/hero-fade-in";
import { HeroGlow } from "@/components/shared/hero-glow";
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
            the now-centered copy readable. Trimmed slightly further so the
            image reads a touch brighter without losing contrast. */}
        <div aria-hidden className="absolute inset-0 bg-black/20" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/10"
        />

        <HeroGlow />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col items-center">
          <HeroFadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-sm">
              About HK Motors
            </p>
          </HeroFadeIn>
          <HeroFadeIn delay={0.1}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white [text-shadow:0_4px_24px_rgb(0_0_0_/_65%)] sm:text-5xl lg:text-6xl">
              A Dealership Built Around the Drive
            </h1>
          </HeroFadeIn>
          <HeroFadeIn delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0_/_70%)] sm:text-lg">
              For over a decade, HK Motors has been home to discerning drivers
              who expect more — where every vehicle is chosen, inspected, and
              delivered to a standard we&apos;d stake our name on.
            </p>
          </HeroFadeIn>
          <HeroFadeIn delay={0.3}>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-luxury">
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </div>
          </HeroFadeIn>
        </div>
      </div>
    </section>
  );
}
