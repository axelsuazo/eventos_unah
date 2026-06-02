import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined,
  turbopack: {
    root: __dirname, // Establece la raíz de Turbopack a la carpeta del frontend
  },
};

export default nextConfig;
