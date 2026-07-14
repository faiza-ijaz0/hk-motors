const YOUTUBE_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/;
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/;

/**
 * Converts a YouTube/Vimeo "watch page" URL into its iframe embed URL.
 * Returns null for anything else (direct video file URLs, uploaded videos)
 * — those are played with a native <video> tag instead of an iframe.
 */
export function getVideoEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(YOUTUBE_PATTERN);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
