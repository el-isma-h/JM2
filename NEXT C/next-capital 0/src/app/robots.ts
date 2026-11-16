import type { MetadataRoute } from "next";
import { indexationAutorisee, urlSite } from "@/lib/seo";

/**
 * robots.txt
 * - NEXT_PUBLIC_ALLOW_INDEXING !== "true" (défaut) : tout est interdit (Disallow: /).
 * - Sinon : pages publiques autorisées ; API (dont retour Stripe), admin, compte (wallet, simulation de paiement),
 *   connexion et confirmation de candidature interdits.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexationAutorisee()) return { rules: { userAgent: "*", disallow: "/" } };
  const base = urlSite();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/*/admin",
        "/*/compte",
        "/*/connexion",
        "/*/candidature/merci",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
