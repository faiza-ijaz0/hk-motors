import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";

export function ContactHero() {
  return (
    <section className="border-border relative flex min-h-[28vh] items-center overflow-hidden border-b sm:min-h-[34vh]">
      <div className="absolute inset-0 bg-black">
        <Image
          src="/contact.jpeg"
          alt="Reach out to the HK Motors team"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_44%]"
        />

        {/* Compact hero, no large title — overlay stays subtle enough to
            keep the photo clearly visible, just deepened slightly for
            better contrast behind the centered copy. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/28 to-black/8"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/38 via-black/10 to-black/16"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <h1 className="font-display text-lg font-semibold text-white [text-shadow:0_4px_20px_rgb(0_0_0_/_78%)] sm:text-xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-1.5 text-sm font-medium text-white/95 [text-shadow:0_2px_12px_rgb(0_0_0_/_75%)]">
            Have a question about a vehicle, service, or availability? Our team
            is ready to deliver a premium HK Motors experience. Reach out and
            expect a prompt, personal response — the same attention you&apos;d
            receive on our showroom floor.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
