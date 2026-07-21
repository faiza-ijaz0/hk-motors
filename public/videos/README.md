# Homepage video assets

## Hero background

Drop `hero-background.mp4` here (or update `heroVideo.src` in
`src/config/media.ts` to point at a hosted URL instead) — a looping
background video behind the hero heading. Rendered with
`autoPlay muted loop playsInline`, so any short, audio-free MP4 works. Until
a real file is added, the hero falls back to `/hkmotors.jpeg` as a poster
image.

## "Experience Performance" showcase

The 4 showcase cards (`src/config/media.ts` → `showcaseVideos`) are wired to
hosted Pexels CDN URLs, not local files — no action needed here unless you
want to swap them for different clips. Each card lazy-loads its video via
`IntersectionObserver` (only fetches once scrolled near-view) and falls back
to a dark gradient tile if a URL ever 404s.
