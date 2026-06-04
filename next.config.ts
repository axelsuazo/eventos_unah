import path from "path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "@payload-config": "./payload.config.ts",
      },
    },
  } as any,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@payload-config": path.resolve(process.cwd(), "payload.config.ts"),
    };

    return config;
  },
};

export default withPayload(nextConfig);