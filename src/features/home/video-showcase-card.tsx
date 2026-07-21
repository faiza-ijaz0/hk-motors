"use client";

import { useEffect, useRef, useState } from "react";

export function VideoShowcaseCard({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only start fetching/playing once the card is nearly on screen — keeps
  // four ~30-50MB clips from competing with the initial page load.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="border-border shadow-elevated hover:shadow-luxury hover:ring-primary/30 group relative aspect-9/16 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black ring-1 ring-transparent transition-shadow duration-300 sm:aspect-3/4"
    >
      {isVisible && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
      />

      <div className="absolute bottom-4 left-4">
        <p className="text-primary tracking-luxury text-xs font-medium uppercase">
          HK Motors
        </p>
        <p className="font-display mt-1 text-lg text-white">{label}</p>
      </div>
    </div>
  );
}
