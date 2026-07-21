import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";

export function ServicesHero() {
  return (
    <section className="border-border relative flex min-h-[50vh] items-center overflow-hidden border-b sm:min-h-[60vh]">
      <div className="absolute inset-0 bg-black">
        <Image
          src="/service.jpeg"
          alt="A performance vehicle serviced and prepared by HK Motors"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />

        <div aria-hidden className="absolute inset-0 bg-black/32" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/12"
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-sm">
              Services
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display mt-3 text-3xl text-white [text-shadow:0_4px_24px_rgb(0_0_0_/_65%)] sm:text-4xl lg:text-5xl">
              Everything your car needs, under one roof.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 max-w-xl text-base text-white/90 [text-shadow:0_2px_12px_rgb(0_0_0_/_70%)] sm:text-lg">
              From buying your next vehicle to registering it, HK Motors offers
              a full suite of services designed to be as premium as the vehicle
              itself.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
