import type { Metadata } from "next";
import { LANGUES, LOCALES, LOCALE_DEFAUT, type Locale } from "@/i18n/config";
import { SEO, type CleSeo } from "@/i18n/seo";
import { TAILLE_PARTAGE, altPartage } from "@/lib/partage";

/**
 * URL publique du site : uniquement NEXT_PUBLIC_SITE_URL (aucun domaine écrit dans le code).
 * Repli sur localhost en développement si la variable est absente.
 */
export function urlSite(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

/**
 * Indexation par les moteurs : désactivée tant que NEXT_PUBLIC_ALLOW_INDEXING ne vaut pas exactement "true".
 * Plateforme de démonstration d'un produit financier non agréé : rester à false jusqu'aux agréments.
 */
export function indexationAutorisee(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

/** Locale Open Graph (fr_FR, en_GB…) dérivée de la configuration des langues. */
export function localeOg(locale: Locale): string {
  return LANGUES[locale].intl.replace("-", "_");
}

/** Chemin localisé : chemin("fr", "/faq") → "/fr/faq" ; chemin("fr", "") → "/fr". */
export function chemin(locale: Locale, sousChemin: string): string {
  return `/${locale}${sousChemin}`;
}

/** hreflang de chaque langue + x-default (langue par défaut). */
export function alternatesLangues(sousChemin: string): Record<string, string> {
  const langues: Record<string, string> = {};
  for (const l of LOCALES) langues[l] = chemin(l, sousChemin);
  langues["x-default"] = chemin(LOCALE_DEFAUT, sousChemin);
  return langues;
}

const NOINDEX = { index: false, follow: false, googleBot: { index: false, follow: false } } as const;

export function robotsMeta(indexable: boolean): Metadata["robots"] {
  return indexable && indexationAutorisee() ? { index: true, follow: true } : NOINDEX;
}

/**
 * Métadonnées complètes d'une page publique : title, description, canonical, hreflang, Open Graph, Twitter, robots.
 * `sousChemin` commence par "/" (ou vaut "" pour l'accueil).
 */
export function metaPage(opts: {
  locale: Locale;
  sousChemin: string;
  titre: string;
  description: string;
  titreAbsolu?: boolean;
  indexable?: boolean;
  type?: "website" | "article";
}): Metadata {
  const { locale, sousChemin, titre, description, titreAbsolu = false, indexable = true, type = "website" } = opts;
  const url = chemin(locale, sousChemin);
  const titreComplet = titreAbsolu ? titre : `${titre} · NEXT Capital`;
  // Les images de partage générées (src/app/[locale]/opengraph-image.tsx, twitter-image.tsx) sont référencées
  // explicitement : un objet openGraph défini sur une page remplace celui hérité du segment parent.
  const alt = altPartage(locale);
  const imageOg = { url: `/${locale}/opengraph-image/partage`, ...TAILLE_PARTAGE, alt, type: "image/png" };
  const imageTw = { url: `/${locale}/twitter-image/partage`, ...TAILLE_PARTAGE, alt };
  return {
    title: titreAbsolu ? { absolute: titre } : titre,
    description,
    alternates: { canonical: url, languages: alternatesLangues(sousChemin) },
    openGraph: {
      type,
      url,
      siteName: "NEXT Capital",
      title: titreComplet,
      description,
      locale: localeOg(locale),
      alternateLocale: LOCALES.filter((l) => l !== locale).map(localeOg),
      images: [imageOg],
    },
    twitter: { card: "summary_large_image", title: titreComplet, description, images: [imageTw] },
    robots: robotsMeta(indexable),
  };
}

/** Raccourci pour une page décrite dans `src/i18n/seo.ts`. */
export function metaSeo(locale: Locale, cle: CleSeo, sousChemin: string, options: { indexable?: boolean } = {}): Metadata {
  const s = SEO[locale][cle];
  return metaPage({ locale, sousChemin, titre: s.t, description: s.d, titreAbsolu: cle === "accueil", indexable: options.indexable });
}

/** Métadonnées d'une page privée (compte, admin, paiement) : toujours noindex, sans canonical ni hreflang. */
export function metaPrivee(locale: Locale, cle: CleSeo): Metadata {
  return { title: SEO[locale][cle].t, robots: NOINDEX };
}

/** Sérialisation JSON-LD sûre dans une balise <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
