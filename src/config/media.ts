/**
 * Homepage marketing media (hero background, video showcase).
 * Not sourced from the database — drop real files at the paths below,
 * or swap the `src` values for hosted URLs.
 */

export const heroVideo = {
  src: "/videos/hero-background.mp4",
  poster: "/hkmotors.jpeg",
};

// Direct CDN files (not the pexels.com/download/... redirect pages) so the
// browser skips an extra round trip before the video can start buffering.
export const showcaseVideos = [
  {
    id: "showcase-1",
    label: "Performance",
    src: "https://videos.pexels.com/video-files/28408297/12377001_1080_1920_29fps.mp4",
  },
  {
    id: "showcase-2",
    label: "Precision",
    src: "https://videos.pexels.com/video-files/27807956/12229027_2160_3840_30fps.mp4",
  },
  {
    id: "showcase-3",
    label: "Craftsmanship",
    src: "https://videos.pexels.com/video-files/8345027/8345027-uhd_2160_3840_25fps.mp4",
  },
  {
    id: "showcase-4",
    label: "Velocity",
    src: "https://videos.pexels.com/video-files/36543600/15494947_2160_3840_60fps.mp4",
  },
] as const;
