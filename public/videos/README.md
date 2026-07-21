# Homepage video assets

## Hero background

`heroVideo.src` in `src/config/media.ts` points at a hosted Pexels CDN URL —
no local file needed. Rendered with
`autoPlay muted loop playsInline preload="auto"`, no controls. If the URL
ever fails to load, the hero falls back to `/hkmotors.jpeg` as the `poster`
image.

## "Experience Performance" showcase

The 4 showcase cards (`src/config/media.ts` → `showcaseVideos`) are wired to
hosted Pexels CDN URLs, not local files — no action needed here unless you
want to swap them for different clips. Each card lazy-loads its video via
`IntersectionObserver` (only fetches once scrolled near-view) and falls back
to a dark gradient tile if a URL ever 404s.
