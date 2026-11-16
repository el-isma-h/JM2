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
  // TODO 1 : lire et valider la configuration (voir tests/config.test.ts)
  // - mode : LAB_MODE ("simulation" | "reel" | vide) ; vide → "reel" si ANTHROPIC_API_KEY est présente, sinon "simulation"
  //   (toute autre valeur de LAB_MODE est fautive)
  // - en mode réel : ANTHROPIC_API_KEY commence par "sk-ant-" et AI_MODEL (défaut "claude-sonnet-5-5") existe dans TARIFS ;
  //   en simulation : modele = "simule"
  // - DEMO_TOKEN : 16 caractères au moins
  // - ⛔ aucune variable NEXT_PUBLIC_* dont la valeur commence par "sk-"
  // - nombres : entierPositif(env, "QUOTA_PAR_MINUTE", 10, fautives), MAX_MESSAGES 30, MAX_CARACTERES 2000,
  //   MAX_OUTPUT_TOKENS 800, BUDGET_MENSUEL_USD 300 ; PROMPT_VERSION "dev" ; APP_VERSION "local"
  // - si une variable est fautive : throw new ErreurConfig(fautives) — les NOMS, jamais les valeurs
  void TARIFS;
  void entierPositif;
  throw new Error("TODO 1 : valider la configuration (lireConfig)");
}
