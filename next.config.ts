import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1mb, which real photo uploads (car/gallery images,
      // logos) routinely exceed — that shows up client-side as a bare
      // "Failed to fetch" with no useful error message.
      bodySizeLimit: "15mb",
    },
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Demo content photos (blog covers, demo cars/gallery) — Unsplash CDN.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
    ],
  },
  async redirects() {
    return [
      {
        // The admin dashboard was briefly at /admin before being renamed.
        source: "/admin",
        destination: "/super-admin",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "/super-admin/:path*",
        permanent: true,
      },
      {
        // The public listings page was briefly at /inventory before being
        // renamed to /cars.
        source: "/inventory",
        destination: "/cars",
        permanent: true,
      },
      {
        source: "/inventory/:path*",
        destination: "/cars/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
