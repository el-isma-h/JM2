// src/lib/sante.ts — sonde /api/health : rapide, gratuite, JAMAIS d'appel au modèle (L105, jalon 2).
// Elle vérifie ce que vous maîtrisez (le processus, la configuration ; la base si vous en ajoutez une).
import { ErreurConfig, lireConfig } from "./config";

export type EtatSante =
  | { statut: "ok"; version: string; promptVersion: string; mode: string }
  | { statut: "degrade"; raison: string };

export function sante(env: Record<string, string | undefined> = process.env): { code: 200 | 503; corps: EtatSante } {
  try {
    const c = lireConfig(env);
    return { code: 200, corps: { statut: "ok", version: c.appVersion, promptVersion: c.promptVersion, mode: c.mode } };
  } catch (e) {
    // On donne la catégorie de panne, pas les noms des variables : la sonde est publique.
    return { code: 503, corps: { statut: "degrade", raison: e instanceof ErreurConfig ? "configuration" : "interne" } };
  }
}
