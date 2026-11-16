/**
 * Tuteur IA — règles pures (aucune E/S) : fournisseurs, modèles, choix de la clé, validation, coût indicatif.
 * Importable côté client (types, libellés) comme côté serveur. L'appel réseau est dans `src/server/ai/`.
 *
 * Priorité des clés : clé personnelle de l'apprenant > variables d'environnement du serveur (ANTHROPIC_API_KEY, puis
 * OPENAI_API_KEY, puis XAI_API_KEY) > clé plateforme (réglage chiffré en base, /admin/reglages).
 */

export const AI_PROVIDERS = ["anthropic", "openai", "xai"] as const;
export type AiProviderId = (typeof AI_PROVIDERS)[number];

export function isAiProvider(v: unknown): v is AiProviderId {
  return typeof v === "string" && (AI_PROVIDERS as readonly string[]).includes(v);
}

/** Tarifs en USD par million de tokens (sources : _recherche/01-anthropic.md et 02-openai-xai…, relevés nov. 2026). */
export type ModelInfo = { id: string; label: string; inputPerMTok: number; outputPerMTok: number };

export type ProviderInfo = {
  id: AiProviderId;
  name: string;
  company: string;
  consoleUrl: string;
  keysUrl: string;
  billingUrl: string;
  keyPrefix: string;
  keyExample: string;
  envKey: string;
  envModel: string;
  defaultModel: string;
  models: ModelInfo[];
};

export const PROVIDERS: Record<AiProviderId, ProviderInfo> = {
  anthropic: {
    id: "anthropic",
    name: "Claude",
    company: "Anthropic",
    consoleUrl: "https://platform.claude.com/",
    keysUrl: "https://platform.claude.com/settings/keys",
    billingUrl: "https://platform.claude.com/settings/billing",
    keyPrefix: "sk-ant-",
    keyExample: "sk-ant-api03-…",
    envKey: "ANTHROPIC_API_KEY",
    envModel: "ANTHROPIC_MODEL",
    defaultModel: "claude-haiku-5-5",
    models: [
      { id: "claude-haiku-5-5", label: "Claude Haiku 5.5 — rapide, économique", inputPerMTok: 0.1, outputPerMTok: 0.5 },
      { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5 — plus approfondi", inputPerMTok: 2, outputPerMTok: 10 },
      { id: "claude-opus-5-5", label: "Claude Opus 5.5 — le plus capable", inputPerMTok: 4, outputPerMTok: 20 },
    ],
  },
  openai: {
    id: "openai",
    name: "GPT",
    company: "OpenAI",
    consoleUrl: "https://platform.openai.com/",
    keysUrl: "https://platform.openai.com/api-keys",
    billingUrl: "https://platform.openai.com/settings/organization/billing",
    keyPrefix: "sk-",
    keyExample: "sk-proj-…",
    envKey: "OPENAI_API_KEY",
    envModel: "OPENAI_MODEL",
    defaultModel: "gpt-6-luna",
    models: [
      { id: "gpt-6-luna", label: "GPT-6 Luna — rapide, économique", inputPerMTok: 0.1, outputPerMTok: 0.5 },
      { id: "gpt-6.1-terra", label: "GPT-6.1 Terra — équilibré", inputPerMTok: 1, outputPerMTok: 5 },
      { id: "gpt-6.1-sol", label: "GPT-6.1 Sol — plus approfondi", inputPerMTok: 2, outputPerMTok: 10 },
    ],
  },
  xai: {
    id: "xai",
    name: "Grok",
    company: "xAI",
    consoleUrl: "https://console.x.ai/",
    keysUrl: "https://console.x.ai/team/default/api-keys",
    billingUrl: "https://console.x.ai/",
    keyPrefix: "xai-",
    keyExample: "xai-…",
    envKey: "XAI_API_KEY",
    envModel: "XAI_MODEL",
    defaultModel: "grok-4.3",
    models: [
      { id: "grok-4.3", label: "Grok 4.3 — économique", inputPerMTok: 1.25, outputPerMTok: 2.5 },
      { id: "grok-4.7", label: "Grok 4.7 — modèle phare", inputPerMTok: 2, outputPerMTok: 6 },
    ],
  },
};

export const XAI_BASE_URL = "https://api.x.ai/v1";

type Env = Record<string, string | undefined>;

/** Modèle effectif : choix explicite > variable d'environnement du fournisseur > défaut. */
export function resolveModel(provider: AiProviderId, explicit: string | null | undefined, env: Env): string {
  const m = explicit?.trim() || env[PROVIDERS[provider].envModel]?.trim();
  return m && /^[A-Za-z0-9._:/-]{1,80}$/.test(m) ? m : PROVIDERS[provider].defaultModel;
}

export type StoredKey = { provider: AiProviderId; key: string; model?: string | null };
export type KeySource = "personal" | "platform" | "env";
export type ResolvedCredentials = { provider: AiProviderId; key: string; model: string; source: KeySource };

/** Fournisseur disponible dans les variables d'environnement (ordre : Anthropic, OpenAI, xAI). */
export function envCredentials(env: Env): StoredKey | null {
  for (const p of AI_PROVIDERS) {
    const key = env[PROVIDERS[p].envKey]?.trim();
    if (key) return { provider: p, key };
  }
  return null;
}

/** Choisit la clé à utiliser pour un appel au tuteur. null : aucune clé configurée. */
export function resolveCredentials(input: { personal?: StoredKey | null; platform?: StoredKey | null; env: Env }): ResolvedCredentials | null {
  const candidates: [KeySource, StoredKey | null | undefined][] = [
    ["personal", input.personal],
    ["env", envCredentials(input.env)],
    ["platform", input.platform],
  ];
  for (const [source, c] of candidates) {
    if (c && isAiProvider(c.provider) && c.key?.trim()) {
      return { provider: c.provider, key: c.key.trim(), model: resolveModel(c.provider, c.model, input.env), source };
    }
  }
  return null;
}

/** Validation de forme d'une clé saisie. Renvoie un message d'erreur, ou null si elle semble correcte. */
export function validateKeyShape(provider: AiProviderId, raw: string): string | null {
  const key = raw.trim();
  const info = PROVIDERS[provider];
  if (!key) return "Collez votre clé API.";
  if (/\s/.test(key)) return "La clé ne doit contenir ni espace ni retour à la ligne.";
  if (key.length < 20 || key.length > 300) return "Cette clé n'a pas la bonne longueur : recopiez-la en entier.";
  if (!key.startsWith(info.keyPrefix)) return `Une clé ${info.company} commence par « ${info.keyPrefix} ». Vérifiez le fournisseur choisi.`;
  if (provider === "openai" && key.startsWith("sk-ant-")) return "Cette clé est une clé Anthropic : choisissez Anthropic comme fournisseur.";
  return null;
}

/** Masquage d'affichage (jamais la clé en clair) : « sk-ant-…a1b2 ». Identique à lib/crypto maskSecret. */
export function maskKey(secret: string): string {
  const s = secret.trim();
  if (s.length <= 10) return "…" + s.slice(-2);
  return `${s.slice(0, 7)}…${s.slice(-4)}`;
}

/**
 * Coût indicatif d'une session de tutorat : `questions` échanges, chacun renvoyant la leçon en contexte
 * (`lessonTokens`) + l'historique, et produisant `answerTokens` en sortie.
 */
export function estimateSessionCost(
  model: Pick<ModelInfo, "inputPerMTok" | "outputPerMTok">,
  opts: { questions?: number; lessonTokens?: number; answerTokens?: number; questionTokens?: number } = {},
): { inputTokens: number; outputTokens: number; usd: number } {
  const n = opts.questions ?? 10;
  const lesson = opts.lessonTokens ?? 5000;
  const answer = opts.answerTokens ?? 450;
  const question = opts.questionTokens ?? 40;
  let inputTokens = 0;
  for (let i = 0; i < n; i++) inputTokens += 600 /* consignes */ + lesson + i * (question + answer) + question;
  const outputTokens = n * answer;
  const usd = (inputTokens * model.inputPerMTok + outputTokens * model.outputPerMTok) / 1_000_000;
  return { inputTokens, outputTokens, usd };
}

export const SOURCE_LABELS: Record<KeySource, string> = {
  personal: "Votre clé personnelle",
  platform: "Clé de la plateforme",
  env: "Clé du serveur (variable d'environnement)",
};
