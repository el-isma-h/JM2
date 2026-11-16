/**
 * Appels aux fournisseurs IA (serveur uniquement) : streaming du tuteur et test minimal d'une clé.
 * - Anthropic : `@anthropic-ai/sdk`, Messages API, sans paramètre `temperature` (refusé par les modèles 5.5) ;
 * - OpenAI : SDK `openai`, Responses API ;
 * - xAI (Grok) : SDK `openai` avec `baseURL: https://api.x.ai/v1`, Responses API.
 *
 * Fournisseur simulé : `AI_FAKE_PROVIDER=true` (refusé en production) remplace tout appel réseau par une réponse
 * générée localement — sert aux démonstrations hors ligne et aux tests de bout en bout.
 */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { PROVIDERS, XAI_BASE_URL, type AiProviderId } from "@/lib/ai";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type CallCredentials = { provider: AiProviderId; key: string; model: string };

export const MAX_OUTPUT_TOKENS = 1200;

export function fakeProviderEnabled(): boolean {
  return process.env.AI_FAKE_PROVIDER === "true" && process.env.NODE_ENV !== "production";
}

/** Erreur fournisseur traduite pour l'utilisateur (jamais la clé, jamais la réponse brute). */
export class AiCallError extends Error {
  constructor(
    message: string,
    readonly code: "auth" | "credit" | "rate" | "model" | "network" | "other",
  ) {
    super(message);
  }
}

export function toAiCallError(err: unknown, provider: AiProviderId): AiCallError {
  const company = PROVIDERS[provider].company;
  const status = typeof err === "object" && err && "status" in err ? Number((err as { status?: unknown }).status) : NaN;
  const msg = err instanceof Error ? err.message : "";
  if (status === 401 || status === 403) return new AiCallError(`${company} a refusé la clé : elle est invalide, révoquée ou sans droits.`, "auth");
  if (status === 402 || /credit|billing|insufficient|quota/i.test(msg)) return new AiCallError(`Le compte ${company} n'a plus de crédit : ajoutez du crédit dans la console.`, "credit");
  if (status === 429) return new AiCallError(`${company} limite le nombre de requêtes : réessayez dans une minute.`, "rate");
  if (status === 404 || (status === 400 && /model/i.test(msg))) return new AiCallError(`Le modèle demandé n'est pas disponible chez ${company} pour cette clé.`, "model");
  if (!Number.isFinite(status) || /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|Connection error|getaddrinfo/i.test(msg)) {
    return new AiCallError(`Le serveur n'arrive pas à joindre ${company}. Vérifiez sa connexion sortante.`, "network");
  }
  return new AiCallError(`${company} a renvoyé une erreur (${status}). Réessayez plus tard.`, "other");
}

function openaiClient(c: CallCredentials): OpenAI {
  return new OpenAI({ apiKey: c.key, ...(c.provider === "xai" ? { baseURL: XAI_BASE_URL } : {}), maxRetries: 1, timeout: 60_000 });
}

/** Flux de texte de la réponse (morceaux successifs). */
export async function* streamChat(c: CallCredentials, system: string, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  if (fakeProviderEnabled()) {
    yield* fakeStream(system, messages, signal);
    return;
  }
  try {
    if (c.provider === "anthropic") {
      const client = new Anthropic({ apiKey: c.key, maxRetries: 1, timeout: 60_000 });
      const stream = await client.messages.create({ model: c.model, max_tokens: MAX_OUTPUT_TOKENS, system, messages, stream: true }, { signal });
      for await (const ev of stream) {
        if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") yield ev.delta.text;
      }
      return;
    }
    const client = openaiClient(c);
    const stream = await client.responses.create(
      { model: c.model, instructions: system, input: messages.map((m) => ({ role: m.role, content: m.content })), max_output_tokens: MAX_OUTPUT_TOKENS, stream: true },
      { signal },
    );
    for await (const ev of stream) {
      if (ev.type === "response.output_text.delta") yield ev.delta;
    }
  } catch (err) {
    if (signal?.aborted) return;
    throw toAiCallError(err, c.provider);
  }
}

/** Appel minimal pour vérifier une clé (quelques tokens). */
export async function testCredentials(c: CallCredentials): Promise<{ ok: true; model: string } | { ok: false; error: string }> {
  if (fakeProviderEnabled()) {
    return c.key.includes("invalide") ? { ok: false, error: `${PROVIDERS[c.provider].company} a refusé la clé : elle est invalide, révoquée ou sans droits.` } : { ok: true, model: c.model };
  }
  try {
    if (c.provider === "anthropic") {
      const client = new Anthropic({ apiKey: c.key, maxRetries: 0, timeout: 20_000 });
      await client.messages.create({ model: c.model, max_tokens: 8, messages: [{ role: "user", content: "Réponds simplement : OK" }] });
    } else {
      await openaiClient(c).responses.create({ model: c.model, input: "Réponds simplement : OK", max_output_tokens: 16 }, { timeout: 20_000, maxRetries: 0 });
    }
    return { ok: true, model: c.model };
  } catch (err) {
    return { ok: false, error: toAiCallError(err, c.provider).message };
  }
}

// ---------- Fournisseur simulé ----------

async function* fakeStream(system: string, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  const title = /leçon L\d{3} « (.+?) »/.exec(system)?.[1] ?? "la leçon";
  const q = messages.at(-1)?.content ?? "";
  const text = [
    `**Réponse simulée** (fournisseur de test, aucun appel réseau) à propos de *${title}*.\n\n`,
    `Vous avez demandé : « ${q.slice(0, 120)} ».\n\n`,
    "Voici comment je procéderais avec une vraie clé :\n\n",
    "1. reformuler l'idée centrale de la leçon avec des mots simples ;\n",
    "2. donner un exemple concret tiré de votre métier ;\n",
    "3. vérifier votre compréhension avec une question courte.\n\n",
    "> 💡 Ce texte est produit localement pour tester l'affichage en continu et le rendu Markdown.\n",
  ].join("");
  for (const chunk of text.match(/.{1,14}/gs) ?? []) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 25));
    yield chunk;
  }
}
