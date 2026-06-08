import path from "path";
import type {
  NextConfig,
} from "next";

import {
  withPayload,
} from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@payload-config":
        "./payload.config.ts",
    },
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,

      "@payload-config":
        path.resolve(
          process.cwd(),
          "payload.config.ts"
        ),
    };

    return config;
  },
};

export default withPayload(
  nextConfig
);