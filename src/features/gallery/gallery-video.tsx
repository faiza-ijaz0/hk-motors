"use client";

import { useInViewport } from "@/hooks/use-in-viewport";
import { getAutoplayEmbedUrl } from "@/lib/video";

export function GalleryVideo({
  url,
  caption,
}: {
  url: string;
  caption: string | null;
}) {
  // Videos are the one gallery media type that can't rely on next/image's
  // native lazy loading — defer mounting until the card is near-viewport
  // so a category with many videos doesn't autoplay-download all at once.
  const { ref, isVisible } = useInViewport<HTMLDivElement>();

  const embedUrl = getAutoplayEmbedUrl(url);

  return (
    <div ref={ref} className="absolute inset-0 size-full">
      {isVisible &&
        (embedUrl ? (
          <iframe
            src={embedUrl}
            title={caption ?? "HK Motors gallery video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            className="pointer-events-none absolute inset-0 size-full border-0"
          />
        ) : (
          // Direct video file (uploaded or a raw .mp4/.webm URL) — no
          // recognized YouTube/Vimeo watch-page pattern to embed instead.
          // `preload="metadata"` (rather than `auto`) avoids fetching the
          // full file the instant the card mounts — the browser still
          // buffers enough to honor `autoPlay` once it does.
          <video
            src={url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        ))}
    </div>
  );
}
