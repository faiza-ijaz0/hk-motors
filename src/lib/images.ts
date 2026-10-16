/**
 * Whether `next/image` may optimize this URL, i.e. its host is listed in
 * `images.remotePatterns` (next.config.ts): Supabase public storage and the
 * Unsplash CDN used by demo content. Anything else is rendered as-is so an
 * unexpected host never breaks the page.
 */
export function canOptimizeImage(url: string) {
  return (
    url.startsWith("/") ||
    url.includes("/storage/v1/object/public/") ||
    url.startsWith("https://images.unsplash.com/photo-")
  );
}
