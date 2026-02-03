import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wopatdvdamwevotxtify.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", // allow all public storage images
      },
    ],
  },
};

export default nextConfig;
