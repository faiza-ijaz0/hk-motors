"use client";

import { CarFront } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CarGallery({
  images,
  title,
}: {
  images: { url: string; alt: string | null }[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-muted border-border relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
        <div className="flex h-full w-full items-center justify-center">
          <CarFront className="text-muted-foreground size-16" />
        </div>
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0]!;

  return (
    <div className="space-y-3">
      <div className="bg-muted border-border relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
        <Image
          src={active.url}
          alt={active.alt ?? title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "bg-muted border-border relative aspect-square overflow-hidden rounded-lg border transition-opacity",
                index === activeIndex
                  ? "ring-primary ring-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${title} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
