// next.config.ts — produit un serveur autonome (.next/standalone) pour l'image Docker (L105, jalon 2)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
