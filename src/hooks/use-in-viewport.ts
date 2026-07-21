"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled near the viewport (per `rootMargin`),
 * and stays true — used to defer mounting expensive media (video/iframes)
 * until they're actually about to be seen, then never re-check.
 */
export function useInViewport<T extends HTMLElement>(
  options: IntersectionObserverInit = { rootMargin: "200px", threshold: 0.1 },
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // Intentionally only re-run if the element identity changes — `options`
    // is expected to be a stable literal at call sites, not re-created
    // reactively per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  return { ref, isVisible };
}
