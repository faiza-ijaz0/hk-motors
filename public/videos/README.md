# Homepage video assets

Drop the following files here (or update the `src` values in
`src/config/media.ts` to point at hosted URLs instead):

- `hero-background.mp4` — looping background video behind the hero heading.
- `showcase-bmw.mp4`
- `showcase-mercedes-benz.mp4`
- `showcase-porsche.mp4`
- `showcase-audi.mp4`

All are rendered with `autoPlay muted loop playsInline`, so any short,
audio-free MP4 works. Until real files are added, the hero falls back to
`/hkmotors.jpeg` as a poster image, and the video showcase cards fall back to
a dark gradient tile with the brand name — nothing breaks, they just show no
motion yet.
