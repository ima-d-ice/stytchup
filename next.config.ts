import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /* config options here */
  experimental: {turbopackFileSystemCacheForDev: true},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        // This allows any path under utfs.io
        pathname: "**", 
      },
        {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
