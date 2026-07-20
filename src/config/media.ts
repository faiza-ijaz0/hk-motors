/**
 * Homepage marketing media (hero background, video showcase).
 * Not sourced from the database — drop real files at the paths below,
 * or swap the `src` values for hosted URLs.
 */

export const heroVideo = {
  src: "/videos/hero-background.mp4",
  poster: "/hkmotors.jpeg",
};

export const showcaseVideos = [
  {
    id: "bmw",
    brand: "BMW",
    title: "BMW M Series",
    src: "/videos/showcase-bmw.mp4",
  },
  {
    id: "mercedes-benz",
    brand: "Mercedes-Benz",
    title: "Mercedes-AMG",
    src: "/videos/showcase-mercedes-benz.mp4",
  },
  {
    id: "porsche",
    brand: "Porsche",
    title: "Porsche 911",
    src: "/videos/showcase-porsche.mp4",
  },
  {
    id: "audi",
    brand: "Audi",
    title: "Audi RS",
    src: "/videos/showcase-audi.mp4",
  },
] as const;
