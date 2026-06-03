import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined,
  turbopack: {
    root: process.cwd(), // Usa el directorio de trabajo actual como raíz para Turbopack
  },
};

export default nextConfig;
