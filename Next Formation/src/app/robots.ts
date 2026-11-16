import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/fonctionnalites", "/solutions", "/tarifs", "/comparatif", "/securite-conformite", "/contact", "/a-propos", "/demo", "/inscription", "/cgu", "/confidentialite", "/mentions-legales", "/catalogue-public"],
      disallow: ["/app", "/moi", "/entreprise", "/formateur", "/admin", "/api/", "/telechargement", "/invitation", "/verification", "/reinitialiser", "/securite$", "/connexion", "/mot-de-passe-oublie", "/deconnexion", "/emarger", "/enquete", "/signer", "/embed"],
    },
    sitemap: `${appUrl()}/sitemap.xml`,
  };
}
