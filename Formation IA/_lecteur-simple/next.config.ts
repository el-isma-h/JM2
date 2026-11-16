import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * En-têtes de sécurité. CSP « raisonnable » : scripts et styles inline autorisés (scripts d'hydratation de Next,
 * script de thème, styles KaTeX / Mermaid), workers blob: (confettis), aucun domaine tiers. `unsafe-eval` uniquement en développement (React Refresh).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  // canvas-confetti dessine dans un Web Worker créé depuis un blob: (OffscreenCanvas).
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Servie sous https://formation.nikaholding.world/ia (Caddy : handle /ia*).
  basePath: "/ia",
  output: "standalone",
  // Le contenu de la formation est lu à l'exécution depuis CONTENT_DIR : ne pas tracer le dossier parent.
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  serverExternalPackages: ["pg"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
