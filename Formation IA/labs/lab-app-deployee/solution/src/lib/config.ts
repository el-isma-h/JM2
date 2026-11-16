// src/lib/config.ts — configuration validée au démarrage (L105, jalon 1 ; facteur III des Twelve-Factor Apps).
// L'application REFUSE de démarrer si la configuration est incomplète. Les erreurs citent les NOMS des
// variables fautives, jamais leurs valeurs.
import { TARIFS } from "./couts";

export type Mode = "simulation" | "reel";

export interface Config {
  mode: Mode;
  anthropicApiKey?: string;
  modele: string;
  demoToken: string;
  quotaParMinute: number;
  maxMessages: number;
  maxCaracteres: number;
  maxOutputTokens: number;
  budgetMensuelUsd: number;
  promptVersion: string;
  appVersion: string;
}

export class ErreurConfig extends Error {
  constructor(public readonly variables: string[]) {
    super(`Configuration invalide : ${variables.join(", ")}`);
    this.name = "ErreurConfig";
  }
}

type Env = Record<string, string | undefined>;

function entierPositif(env: Env, nom: string, defaut: number, fautives: string[]): number {
  const brut = env[nom];
  if (brut === undefined || brut === "") return defaut;
  const n = Number(brut);
  if (!Number.isFinite(n) || n <= 0) {
    fautives.push(nom);
    return defaut;
  }
  return n;
}

export function lireConfig(env: Env = process.env): Config {
  const fautives: string[] = [];
  const cle = env.ANTHROPIC_API_KEY?.trim() || undefined;
  const choix = (env.LAB_MODE ?? "").trim().toLowerCase();
  if (choix !== "" && choix !== "simulation" && choix !== "reel") fautives.push("LAB_MODE");
  const mode: Mode = choix === "simulation" || choix === "reel" ? choix : cle ? "reel" : "simulation";

  if (mode === "reel" && !cle?.startsWith("sk-ant-")) fautives.push("ANTHROPIC_API_KEY");
  const modele = env.AI_MODEL || "claude-sonnet-5-5";
  if (mode === "reel" && !(modele in TARIFS)) fautives.push("AI_MODEL");   // pas de tarif connu = pas de coût journalisé
  const demoToken = env.DEMO_TOKEN ?? "";
  if (demoToken.length < 16) fautives.push("DEMO_TOKEN");
  // ⛔ checklist : aucune clé dans une variable NEXT_PUBLIC_* (elle serait copiée dans le bundle du navigateur)
  for (const [nom, valeur] of Object.entries(env)) {
    if (nom.startsWith("NEXT_PUBLIC_") && /^sk-/.test(valeur ?? "")) fautives.push(nom);
  }

  const config: Config = {
    mode,
    anthropicApiKey: mode === "reel" ? cle : undefined,
    modele: mode === "reel" ? modele : "simule",
    demoToken,
    quotaParMinute: entierPositif(env, "QUOTA_PAR_MINUTE", 10, fautives),
    maxMessages: entierPositif(env, "MAX_MESSAGES", 30, fautives),
    maxCaracteres: entierPositif(env, "MAX_CARACTERES", 2000, fautives),
    maxOutputTokens: entierPositif(env, "MAX_OUTPUT_TOKENS", 800, fautives),
    budgetMensuelUsd: entierPositif(env, "BUDGET_MENSUEL_USD", 300, fautives),
    promptVersion: env.PROMPT_VERSION || "dev",
    appVersion: env.APP_VERSION || "local",
  };
  if (fautives.length > 0) throw new ErreurConfig(fautives);
  return config;
}
