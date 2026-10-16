export const siteConfig = {
  name: "HK Motors",
  description:
    "HK Motors — a premium automotive experience in Dubai, United Arab Emirates.",
  themeColor: "#050505",
  // Falls back to the known production domain so sitemap/OG/canonical URLs
  // are correct out of the box; override via env if the domain changes.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hk-motors.vercel.app",
} as const;
