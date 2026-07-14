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
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
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
    ];
  },
};

export default nextConfig;
