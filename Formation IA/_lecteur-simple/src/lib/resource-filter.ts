/**
 * Recherche instantanée dans la bibliothèque de liens (/ressources) : insensible à la casse et aux accents,
 * tous les mots doivent apparaître (titre, description, adresse, sous-section ou section). Fonction pure (client).
 */
import type { ResourceSection } from "@/content/types";

export function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function searchTokens(query: string): string[] {
  return normalizeSearch(query).split(" ").filter(Boolean);
}

export type FilteredLibrary = { sections: ResourceSection[]; count: number };

export function filterResources(sections: readonly ResourceSection[], query: string, sectionId: string | null = null): FilteredLibrary {
  const tokens = searchTokens(query);
  let count = 0;
  const out: ResourceSection[] = [];
  for (const section of sections) {
    if (sectionId && section.id !== sectionId) continue;
    const subsections = section.subsections
      .map((sub) => {
        const links = sub.links.filter((l) => {
          if (tokens.length === 0) return true;
          const hay = normalizeSearch(`${l.title} ${l.description} ${l.url} ${sub.title} ${section.title}`);
          return tokens.every((t) => hay.includes(t));
        });
        return { ...sub, links };
      })
      .filter((sub) => sub.links.length > 0);
    const n = subsections.reduce((s, sub) => s + sub.links.length, 0);
    if (n > 0) {
      out.push({ ...section, subsections });
      count += n;
    }
  }
  return { sections: out, count };
}

/** Nom de domaine lisible d'une URL (« platform.claude.com »), ou l'URL brute si invalide. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
