import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { alternatesLangues, urlSite } from "@/lib/seo";
import { db } from "@/lib/db";

// Lu à chaque requête (dossiers en base, URL publique issue de l'environnement).
export const dynamic = "force-dynamic";

/** Pages publiques indexables (hors connexion, candidature/merci, compte, admin, API). */
const PAGES: { chemin: string; priorite: number; frequence: "weekly" | "monthly" | "yearly" }[] = [
  { chemin: "", priorite: 1, frequence: "weekly" },
  { chemin: "/fonds", priorite: 0.9, frequence: "monthly" },
  { chemin: "/theses", priorite: 0.8, frequence: "monthly" },
  { chemin: "/marches", priorite: 0.7, frequence: "monthly" },
  { chemin: "/token", priorite: 0.8, frequence: "monthly" },
  { chemin: "/adhesion", priorite: 0.7, frequence: "monthly" },
  { chemin: "/parcours", priorite: 0.6, frequence: "monthly" },
  { chemin: "/deals", priorite: 0.7, frequence: "weekly" },
  { chemin: "/faq", priorite: 0.6, frequence: "monthly" },
  { chemin: "/risques", priorite: 0.6, frequence: "yearly" },
  { chemin: "/a-propos", priorite: 0.5, frequence: "yearly" },
  { chemin: "/candidature", priorite: 0.6, frequence: "yearly" },
  { chemin: "/mentions-legales", priorite: 0.2, frequence: "yearly" },
  { chemin: "/confidentialite", priorite: 0.2, frequence: "yearly" },
  { chemin: "/cookies", priorite: 0.2, frequence: "yearly" },
];

function absolues(langues: Record<string, string>, base: string): Record<string, string> {
  return Object.fromEntries(Object.entries(langues).map(([k, v]) => [k, `${base}${v}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlSite();
  let deals: { chemin: string; modifie?: Date }[] = [];
  try {
    const lignes = db().prepare("SELECT slug, cree_le FROM deals ORDER BY id").all() as { slug: string; cree_le: string }[];
    deals = lignes.map((d) => ({ chemin: `/deals/${d.slug}`, modifie: d.cree_le ? new Date(d.cree_le.replace(" ", "T") + "Z") : undefined }));
  } catch {
    deals = [];
  }
  const entrees: MetadataRoute.Sitemap = [];
  for (const p of [...PAGES.map((x) => ({ ...x, modifie: undefined as Date | undefined })), ...deals.map((d) => ({ chemin: d.chemin, priorite: 0.5, frequence: "monthly" as const, modifie: d.modifie }))]) {
    const langues = absolues(alternatesLangues(p.chemin), base);
    for (const l of LOCALES) {
      entrees.push({
        url: `${base}/${l}${p.chemin}`,
        lastModified: p.modifie && !Number.isNaN(p.modifie.getTime()) ? p.modifie : undefined,
        changeFrequency: p.frequence,
        priority: p.priorite,
        alternates: { languages: langues },
      });
    }
  }
  return entrees;
}
