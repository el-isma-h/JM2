/**
 * Couche contenu — point d'entrée pour les pages, layouts, route handlers et server actions.
 * `server-only` : toute importation depuis un composant client casse le build (protection des réponses).
 * Les composants client n'importent que des TYPES : `import type { PublicQuiz } from "@/content/types"`.
 */
import "server-only";

export * from "./loader";
export type * from "./types";
