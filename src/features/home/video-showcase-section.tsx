"use client";

import { FadeIn } from "@/components/shared/fade-in";
import { showcaseVideos } from "@/config/media";

export function VideoShowcaseSection() {
  return (
    <section className="border-border bg-card/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            In Motion
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Experience Performance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            See the world&apos;s most iconic vehicles in motion.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showcaseVideos.map((video, index) => (
            <FadeIn key={video.id} delay={index * 0.05}>
              <div className="border-border shadow-elevated hover:shadow-luxury hover:ring-primary/30 group relative aspect-9/16 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black ring-1 ring-transparent transition-shadow duration-300 sm:aspect-3/4">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={video.src} type="video/mp4" />
                </video>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
                />

                <div className="absolute bottom-4 left-4">
                  <p className="text-primary tracking-luxury text-xs font-medium uppercase">
                    {video.brand}
                  </p>
                  <p className="font-display mt-1 text-lg text-white">
                    {video.title}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
