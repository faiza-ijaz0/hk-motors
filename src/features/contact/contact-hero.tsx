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

        {/* Compact hero, no large title — subtle overlay only so the
            photo stays clearly visible. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/18 to-black/0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <h1 className="font-display text-lg text-white [text-shadow:0_4px_18px_rgb(0_0_0_/_65%)] sm:text-xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-1.5 text-sm text-white/85 [text-shadow:0_2px_10px_rgb(0_0_0_/_65%)]">
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
