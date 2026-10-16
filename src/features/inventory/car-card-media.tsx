"use client";

import { CarFront, ChevronLeft, ChevronRight, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { canOptimizeImage } from "@/lib/images";

export function CarCardMedia({
  images,
  hasVideo,
  title,
}: {
  images: { url: string }[];
  hasVideo: boolean;
  title: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CarFront className="text-muted-foreground size-10" />
      </div>
    );
  }

  const current = images[index] ?? images[0]!;

  function go(delta: number, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIndex((prev) => (prev + delta + images.length) % images.length);
  }

  return (
    <>
      <Image
        src={current.url}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        unoptimized={!canOptimizeImage(current.url)}
        className="object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(-1, e)}
            aria-label="Previous photo"
            className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={(e) => go(1, e)}
            aria-label="Next photo"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((image, i) => (
              <span
                key={image.url}
                className={
                  i === index
                    ? "size-1.5 rounded-full bg-white"
                    : "size-1.5 rounded-full bg-white/50"
                }
              />
            ))}
          </div>
        </>
      )}

      {hasVideo && (
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          <Video className="size-3.5" />
          Video
        </span>
      )}
    </>
  );
}
