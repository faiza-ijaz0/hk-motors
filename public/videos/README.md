# Homepage video assets

## Hero background

`hero.mp4` (this folder) is the hero background video, referenced via
`heroVideo.src` in `src/config/media.ts`. Rendered with
`autoPlay muted loop playsInline preload="auto"`, no controls, no poster,
and no fallback image — by design, the video is the only hero background
asset.

## "Experience Performance" showcase

The 4 showcase cards (`src/config/media.ts` → `showcaseVideos`) are wired to
hosted Pexels CDN URLs, not local files — no action needed here unless you
want to swap them for different clips. Each card lazy-loads its video via
`IntersectionObserver` (only fetches once scrolled near-view) and falls back
to a dark gradient tile if a URL ever 404s.
