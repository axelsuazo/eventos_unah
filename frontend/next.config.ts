import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gestor-de-eventos-u.vercel.app",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;