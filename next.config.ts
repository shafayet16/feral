import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Forces Next.js image optimizer to cache images for 1 year (31,536,000 seconds)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  // Sets aggressive 1-year browser cache headers for all static media
  async headers() {
    return [
      {
        source: "/:path*.(png|jpg|jpeg|webp|svg|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;