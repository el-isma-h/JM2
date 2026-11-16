import type { NextConfig } from "next";

// Indexation : désactivée tant que NEXT_PUBLIC_ALLOW_INDEXING !== "true" (plateforme de démonstration non agréée).
const indexation = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const securite = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
  async headers() {
    return [
      { source: "/:path*", headers: indexation ? securite : [...securite, noindex] },
      // Réponses API (attestations, documents KYC, exports) et espaces privés : jamais indexés.
      ...(indexation
        ? ["/api/:path*", "/:locale/admin/:path*", "/:locale/compte/:path*", "/:locale/connexion", "/:locale/candidature/merci"].map((source) => ({ source, headers: [noindex] }))
        : []),
    ];
  },
};

export default nextConfig;
