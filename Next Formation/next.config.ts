import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Données RH sensibles et sessions : rendu dynamique par défaut, pas de cache de composants.
  cacheComponents: false,
  serverExternalPackages: ["pdfkit", "pg"],
  experimental: {
    // Uploads de documents (8 Mo) et imports CSV (5 Mo) passent par des server actions.
    serverActions: { bodySizeLimit: "10mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
