import type { TheseId } from "./fonds";

/** Code couleurs NEXT Capital (voir aussi globals.css). */
export const COULEURS = {
  encre: "#0A0B0D",
  os: "#F3F0E8",
  signal: "#19E07A",
  lime: "#D8FF3D",
  /** Taupe rosé du logo (V4) : écrin sobre sur encre pour la barre latérale et les sections calmes de l'accueil. */
  taupe: "#DEA193",
} as const;

export const COULEUR_THESE: Record<TheseId, string> = {
  ia: "#00D1FF",
  quantique: "#7A3BFF",
  agroalimentaire: "#3FD66B",
  sport: "#FF5A1F",
};

/** Bandes de l'intro : les quatre thèses, encadrées par le signal et l'os. */
export const BANDES_INTRO = ["#19E07A", "#00D1FF", "#7A3BFF", "#3FD66B", "#FF5A1F", "#D8FF3D"];

/** Teintes profondes de chaque thèse, pour les fonds des panneaux épinglés (encre teintée). */
export const FOND_THESE: Record<TheseId, string> = {
  ia: "#071A22",
  quantique: "#14092A",
  agroalimentaire: "#07190F",
  sport: "#1F0C06",
};
