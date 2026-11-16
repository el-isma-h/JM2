// src/lib/couts.ts — coût d'un appel à partir du champ `usage` (tarifs de la leçon L105, section 1.3, nov. 2026).
// Vérifiez les tarifs sur https://platform.claude.com/docs/en/about-claude/pricing avant tout budget réel.

export interface Usage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

/** Prix en dollars par million de tokens. Écriture de cache = 1,25 × le tarif d'entrée. */
export const TARIFS: Record<string, { entree: number; sortie: number; lectureCache: number; ecritureCache: number }> = {
  "claude-sonnet-5-5": { entree: 2, sortie: 10, lectureCache: 0.1, ecritureCache: 2.5 },
  "claude-haiku-5-5": { entree: 0.1, sortie: 0.5, lectureCache: 0.01, ecritureCache: 0.125 },
  simule: { entree: 0, sortie: 0, lectureCache: 0, ecritureCache: 0 },
};

/** `input_tokens` ne compte que l'entrée NON cachée : les lectures et écritures de cache sont facturées à part. */
export function coutUsd(usage: Usage, modele: string): number {
  // TODO 4 : (entrée × tarif entrée + sortie × tarif sortie + lectures de cache × lectureCache
  //          + écritures de cache × ecritureCache) / 1 000 000, arrondi à 8 décimales.
  // Modèle absent de TARIFS → throw new Error(`Tarif inconnu pour le modèle ${modele}`)
  throw new Error("TODO 4 : calculer le coût d'un appel (coutUsd)");
}
