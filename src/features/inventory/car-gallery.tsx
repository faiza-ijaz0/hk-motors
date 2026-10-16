"use client";

import {
  CarFront,
  ChevronLeft,
  ChevronRight,
  Expand,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Lightbox } from "@/components/shared/lightbox";
import { canOptimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { getVideoEmbedUrl } from "@/lib/video";

import type { CarDetail } from "@/services/cars";

const SWIPE_THRESHOLD = 40;

export function CarGallery({
  media,
  title,
}: {
  media: CarDetail["media"];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  if (media.length === 0) {
    return (
      <div className="bg-muted border-border relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
        <div className="flex h-full w-full items-center justify-center">
          <CarFront className="text-muted-foreground size-16" />
        </div>
      </div>
    );
  }

  const active = media[activeIndex] ?? media[0]!;

  function go(delta: number) {
    setActiveIndex((prev) => (prev + delta + media.length) % media.length);
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta > 0 ? -1 : 1);
    touchStartX.current = null;
  }

  const embedUrl =
    active.mediaType === "video" ? getVideoEmbedUrl(active.url) : null;

  return (
    <div className="space-y-3">
      <div
        className="bg-muted border-border group relative aspect-4/3 w-full overflow-hidden rounded-2xl border"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            "size-full transition-opacity duration-300",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          {active.mediaType === "video" ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                title={active.alt ?? title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            ) : (
              <video
                src={active.url}
                controls
                className="size-full object-contain"
              />
            )
          ) : (
            <Image
              src={active.url}
              alt={active.alt ?? title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={!canOptimizeImage(active.url)}
              className="object-cover"
            />
          )}
        </div>

        {active.mediaType === "image" && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full screen"
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Expand className="size-4" />
          </button>
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {media.map((item, index) => (
            <button
              key={item.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View item ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "bg-muted border-border relative aspect-square overflow-hidden rounded-lg border transition-opacity",
                index === activeIndex
                  ? "ring-primary ring-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              {item.mediaType === "video" ? (
                <div className="flex size-full items-center justify-center bg-black/80">
                  <PlayCircle className="size-5 text-white/80" />
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt ?? `${title} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  unoptimized={!canOptimizeImage(item.url)}
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          items={media.map((m) => ({
            url: m.url,
            mediaType: m.mediaType,
            alt: m.alt,
          }))}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
