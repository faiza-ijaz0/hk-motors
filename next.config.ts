import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
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
