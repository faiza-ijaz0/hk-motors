import { PlayCircle } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { getVideoEmbedUrl } from "@/lib/video";

import type { GalleryImage } from "@/services/gallery";

// No per-image dimensions are stored, so true aspect-accurate masonry isn't
// possible — heights cycle through a fixed set instead, which still gives
// the staggered Pinterest-style rhythm via CSS multi-column layout.
const HEIGHT_CLASSES = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-96"];

function GalleryMedia({ image }: { image: GalleryImage }) {
  if (image.mediaType === "video") {
    const embedUrl = getVideoEmbedUrl(image.url);
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={image.caption ?? "HK Motors gallery video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />
      );
    }
    return (
      // Direct video file (uploaded or a raw .mp4/.webm URL) — no
      // recognized YouTube/Vimeo watch-page pattern to embed instead.
      <video
        src={image.url}
        controls
        preload="metadata"
        className="size-full object-cover"
      >
        <PlayCircle />
      </video>
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.caption ?? "HK Motors gallery photo"}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      unoptimized={!image.url.includes("/storage/v1/object/public/")}
      className="object-cover"
    />
  );
}

export function GalleryMasonry({ images }: { images: GalleryImage[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {images.map((image, index) => (
        <figure key={image.id} className="mb-4 break-inside-avoid">
          <div
            className={cn(
              "bg-muted border-border relative w-full overflow-hidden rounded-xl border",
              HEIGHT_CLASSES[index % HEIGHT_CLASSES.length],
            )}
          >
            <GalleryMedia image={image} />
          </div>
          {image.caption && (
            <figcaption className="text-muted-foreground mt-2 text-sm">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
