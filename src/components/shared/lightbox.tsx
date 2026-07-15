"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import { getVideoEmbedUrl } from "@/lib/video";

export type LightboxItem = {
  url: string;
  mediaType: "image" | "video";
  alt?: string | null;
};

export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const item = items[index];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        onIndexChange((index - 1 + items.length) % items.length);
      }
      if (event.key === "ArrowRight") {
        onIndexChange((index + 1) % items.length);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onIndexChange, onClose]);

  if (!item) return null;

  const embedUrl =
    item.mediaType === "video" ? getVideoEmbedUrl(item.url) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + items.length) % items.length);
            }}
            aria-label="Previous"
            className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % items.length);
            }}
            aria-label="Next"
            className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      <div
        className="relative flex h-full max-h-[85vh] w-full max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.mediaType === "video" ? (
          embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.alt ?? "Video"}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video max-h-full w-full border-0"
            />
          ) : (
            <video
              src={item.url}
              controls
              autoPlay
              className="max-h-full max-w-full object-contain"
            />
          )
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={item.url}
              alt={item.alt ?? "Preview"}
              fill
              sizes="100vw"
              unoptimized={!item.url.includes("/storage/v1/object/public/")}
              className="object-contain"
              quality={100}
            />
          </div>
        )}
      </div>

      {items.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {index + 1} / {items.length}
        </p>
      )}
    </div>
  );
}
