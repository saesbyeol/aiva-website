import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Security headers are handled by vercel.json for Vercel
  // For other platforms, uncomment:
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         { key: "X-Content-Type-Options", value: "nosniff" },
  //         { key: "X-Frame-Options", value: "DENY" },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
