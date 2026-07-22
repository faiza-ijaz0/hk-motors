import { PlayCircle } from "lucide-react";
import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";
import { Card } from "@/components/ui/card";
import { GalleryVideo } from "@/features/gallery/gallery-video";

import type { GalleryImage } from "@/services/gallery";

function GalleryMedia({ image }: { image: GalleryImage }) {
  if (image.mediaType === "video") {
    return <GalleryVideo url={image.url} caption={image.caption} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.caption ?? "HK Motors gallery photo"}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      loading="lazy"
      fetchPriority="low"
      unoptimized={!image.url.includes("/storage/v1/object/public/")}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image, index) => (
        <FadeIn key={image.id} delay={(index % 8) * 0.05}>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              image.mediaType === "video"
                ? (image.caption ?? "Open video in a new tab")
                : (image.caption ?? "Open photo in a new tab")
            }
          >
            <Card
              variant="elevated"
              className="group relative overflow-hidden py-0"
            >
              <div className="bg-muted relative aspect-4/3 w-full overflow-hidden">
                <GalleryMedia image={image} />
                {image.mediaType === "video" && (
                  <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                    <PlayCircle className="size-3.5" />
                    Video
                  </span>
                )}
                {image.caption && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="line-clamp-2 text-sm text-white">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </a>
        </FadeIn>
      ))}
    </div>
  );
}
