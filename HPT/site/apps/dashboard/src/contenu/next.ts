/**
 * Écosystème Next : la liste de référence vit dans packages/charte (src/next.ts), partagée avec le site.
 * Réglages par produit dans .env :
 *   NEXT_URL_<P>          adresse publique (ouverte dans le navigateur, connexion unique)
 *   NEXT_API_<P>          adresse de l'API de service vue depuis le serveur HPT (par défaut : NEXT_URL_<P>)
 *   NEXT_CLE_SERVICE_<P>  clé de service de la porte HPT de ce Next
 */
import { NEXT, NEXT_PRINCIPAUX, branchesDe, nextParSlugOuAncien, type NextProduit, type Forme } from "@hpt/charte";

export type ProduitNext = {
  slug: string;
  nom: string;
  verbe: string;
  description: string;
  couleur: string;
  forme: Forme;
  /** Suffixe des variables d'environnement. */
  cle: string;
  /** Catégories de pièces que ce Next sait traiter (utilisé par l'Aiguilleur). */
  categories: string[];
  statut: NextProduit["statut"];
  /** Next parent lorsque ce produit est une branche (ex. Next Énergie → Next Courtage). */
  parent?: string;
  /** Anciens slugs acceptés (ex. next-rh → Next Pay). */
  anciensSlugs: string[];
  /** Anciens suffixes de variables d'environnement encore acceptés (ex. RH pour PAY). */
  anciennesCles: string[];
};

/** Anciens suffixes de variables d'environnement, par clé actuelle (compatibilité : l'ancien nom reste lu). */
const ANCIENNES_CLES: Record<string, string[]> = { PAY: ["RH"] };

/** Le dashboard affiche la couleur lumineuse (lisible sur noir), en français. */
export const PRODUITS_NEXT: ProduitNext[] = NEXT.map((p) => ({
  slug: p.slug,
  nom: p.nom,
  verbe: p.verbe.fr,
  description: p.description.fr,
  couleur: p.lueur,
  forme: p.forme,
  cle: p.cle,
  categories: p.categories,
  statut: p.statut,
  parent: p.parent,
  anciensSlugs: p.anciensSlugs ?? [],
  anciennesCles: ANCIENNES_CLES[p.cle] ?? [],
}));

/** Les Next de premier niveau (sans parent), dans l'ordre de la charte. */
export const PRODUITS_PRINCIPAUX: ProduitNext[] = PRODUITS_NEXT.filter((p) => !p.parent);
/** Les branches d'un Next (ex. Next Courtage → Énergie, Assurance, Bank). */
export const branchesProduit = (slug: string) => PRODUITS_NEXT.filter((p) => p.parent === slug);
/** Les Next principaux ayant une porte HPT propre : les branches passent par leur parent. */
export const produitPorte = (p: ProduitNext): ProduitNext => (p.parent ? (produitParSlug(p.parent) ?? p) : p);
export { NEXT_PRINCIPAUX, branchesDe, nextParSlugOuAncien };

const nettoyer = (u: string | undefined) => (u ?? "").trim().replace(/\/$/, "");

/** Retrouve un produit par son slug actuel OU un ancien slug (ex. « next-rh » → Next Pay). */
export const produitParSlug = (slug: string | null | undefined) => PRODUITS_NEXT.find((p) => p.slug === slug) ?? PRODUITS_NEXT.find((p) => !!slug && p.anciensSlugs.includes(slug));
/** Slug actuel d'un produit à partir d'un slug éventuellement ancien (pour normaliser ce qui est stocké). */
export const slugActuel = (slug: string) => produitParSlug(slug)?.slug ?? slug;

type Cles = Pick<ProduitNext, "cle"> & Partial<Pick<ProduitNext, "anciennesCles">>;
/** Lit NEXT_<prefixe>_<CLE>, puis les anciens suffixes (ex. NEXT_URL_PAY puis NEXT_URL_RH). */
const variable = (prefixe: string, p: Cles) => {
  for (const cle of [p.cle, ...(p.anciennesCles ?? ANCIENNES_CLES[p.cle] ?? [])]) {
    const v = (process.env[`${prefixe}_${cle}`] ?? "").trim();
    if (v) return v;
  }
  return "";
};
export const urlProduit = (p: Cles) => nettoyer(variable("NEXT_URL", p));
export const apiProduit = (p: Cles) => nettoyer(variable("NEXT_API", p)) || urlProduit(p);
export const cleServiceProduit = (p: Cles) => variable("NEXT_CLE_SERVICE", p);
