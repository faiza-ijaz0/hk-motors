import { FadeIn } from "@/components/shared/fade-in";
import { showcaseVideos } from "@/config/media";
import { VideoShowcaseCard } from "@/features/home/video-showcase-card";

export function VideoShowcaseSection() {
  return (
    <section className="border-border bg-card/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col items-center text-center">
          <h2 className="font-display text-2xl sm:text-3xl">
            Experience Performance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            See the world&apos;s most iconic vehicles in motion.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showcaseVideos.map((video, index) => (
            <FadeIn key={video.id} delay={index * 0.05}>
              <VideoShowcaseCard src={video.src} label={video.label} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
