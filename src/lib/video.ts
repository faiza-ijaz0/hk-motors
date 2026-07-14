const YOUTUBE_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/;
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/;

export type VideoPlatform = "youtube" | "vimeo" | null;

/** Detects a YouTube/Vimeo "watch page" URL and extracts its video id. */
export function parseVideoUrl(url: string): {
  platform: VideoPlatform;
  id: string | null;
} {
  const youtubeMatch = url.match(YOUTUBE_PATTERN);
  if (youtubeMatch) return { platform: "youtube", id: youtubeMatch[1]! };

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch) return { platform: "vimeo", id: vimeoMatch[1]! };

  return { platform: null, id: null };
}

/**
 * Plain iframe embed URL (no autoplay) for a YouTube/Vimeo watch-page link.
 * Returns null for anything else (direct video file URLs, uploaded videos)
 * — those are played with a native <video> tag instead of an iframe.
 */
export function getVideoEmbedUrl(url: string): string | null {
  const { platform, id } = parseVideoUrl(url);
  if (platform === "youtube") return `https://www.youtube.com/embed/${id}`;
  if (platform === "vimeo") return `https://player.vimeo.com/video/${id}`;
  return null;
}

/**
 * Autoplay/muted/looping iframe embed URL for the public gallery, where
 * videos must play silently and continuously with no user interaction.
 * `loop=1` on YouTube only works when paired with `playlist=<same id>`.
 */
export function getAutoplayEmbedUrl(url: string): string | null {
  const { platform, id } = parseVideoUrl(url);
  if (platform === "youtube") {
    return (
      `https://www.youtube.com/embed/${id}` +
      `?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`
    );
  }
  if (platform === "vimeo") {
    return (
      `https://player.vimeo.com/video/${id}` +
      `?autoplay=1&muted=1&loop=1&background=1&controls=0`
    );
  }
  return null;
}
