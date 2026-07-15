"use client";

import { PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Lightbox } from "@/components/shared/lightbox";
import { formatRelativeTime } from "@/lib/format";

import type { AdminCarImage } from "@/services/admin-cars";

export function CarMediaGrid({ images }: { images: AdminCarImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-16">
        <PlayCircle className="text-muted-foreground size-8" />
        <p className="text-muted-foreground text-sm">
          No photos or videos uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="border-border bg-muted group relative aspect-4/3 overflow-hidden rounded-lg border text-left"
          >
            {image.mediaType === "video" ? (
              <div className="flex size-full flex-col items-center justify-center gap-1 bg-black/80">
                <PlayCircle className="size-8 text-white/80" />
                <span className="text-xs font-medium text-white/70">Video</span>
              </div>
            ) : (
              <Image
                src={image.url}
                alt={image.altText ?? "Vehicle photo"}
                fill
                sizes="200px"
                unoptimized={image.externalUrl !== null}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {image.isPrimary && (
              <span className="bg-primary text-primary-foreground absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                <Star className="size-3" />
                Primary
              </span>
            )}
            <span className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
              {formatRelativeTime(image.createdAt)}
            </span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={images.map((img) => ({
            url: img.url,
            mediaType: img.mediaType,
            alt: img.altText,
          }))}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
