// src/lib/fournisseurs.ts — le modèle derrière une interface : simulé (sans clé) ou Anthropic (mode réel).
import type { Usage } from "./couts";
import { lireEvenementsSSE } from "./sse";
import type { Message } from "./validation";

export type Fragment = { type: "texte"; texte: string } | { type: "usage"; usage: Usage };

export interface OptionsGeneration {
  maxOutputTokens: number;
  signal?: AbortSignal;
}

export interface Fournisseur {
  readonly nom: string;
  readonly modele: string;
  generer(messages: Message[], options: OptionsGeneration): AsyncIterable<Fragment>;
}

export const PROMPT_SYSTEME =
  "Tu es Compta-Chat, l'assistant interne d'un cabinet d'expertise comptable. Réponds en français, " +
  "brièvement, sans inventer de chiffre ni de date d'échéance ; si tu ne sais pas, dis-le.";

const attendre = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((ok, ko) => {
    if (ms <= 0) return ok();
    const t = setTimeout(ok, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); ko(new Error("annulé")); }, { once: true });
  });

/**
 * Fournisseur simulé : déterministe, aucun appel réseau, aucun coût. Il « streame » mot à mot.
 * Mots-clés de test (défi « journée du chaos ») : `#panne` → erreur au milieu du flux ; `#lent` → 300 ms par mot.
 */
export class FournisseurSimule implements Fournisseur {
  readonly nom = "simulation";
  readonly modele = "simule";

  constructor(private readonly delaiMs = 30) {}

  async *generer(messages: Message[], options: OptionsGeneration): AsyncIterable<Fragment> {
    const question = messages[messages.length - 1].content;
    const extrait = question.length > 80 ? question.slice(0, 77) + "…" : question;
    const texte =
      `[mode simulé] Vous avez écrit : « ${extrait} ». ` +
      `Je suis le fournisseur simulé de Compta-Chat : je réponds mot à mot pour vérifier le streaming, ` +
      `sans clé ni appel réseau. Historique reçu : ${messages.length} message(s).`;
    const mots = texte.split(" ");
    const limite = Math.min(mots.length, options.maxOutputTokens);
    const delai = question.includes("#lent") ? 300 : this.delaiMs;
    for (let i = 0; i < limite; i++) {
      if (options.signal?.aborted) return;
      await attendre(delai, options.signal);
      if (i === 5 && question.includes("#panne")) throw new Error("panne simulée du fournisseur (#panne)");
      yield { type: "texte", texte: (i === 0 ? "" : " ") + mots[i] };
    }
    const entree = Math.ceil(messages.reduce((n, m) => n + m.content.length, 0) / 4);
    yield { type: "usage", usage: { input_tokens: entree, output_tokens: Math.ceil(texte.length / 4) } };
  }
}

/**
 * Mode réel : Messages API en streaming, par fetch (aucune dépendance). Version d'API 2026-10-21 :
 * ne pas envoyer temperature / top_p / top_k (erreur 400). Le prompt système est mis en cache.
 */
export class FournisseurAnthropic implements Fournisseur {
  readonly nom = "anthropic";

  constructor(
    private readonly cle: string,
    readonly modele: string,
    private readonly url = "https://api.anthropic.com/v1/messages",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async *generer(messages: Message[], options: OptionsGeneration): AsyncIterable<Fragment> {
    const reponse = await this.fetcher(this.url, {
      method: "POST",
      signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(90_000)]) : AbortSignal.timeout(90_000),
      headers: { "content-type": "application/json", "x-api-key": this.cle, "anthropic-version": "2026-10-21" },
      body: JSON.stringify({
        model: this.modele,
        max_tokens: options.maxOutputTokens,
        stream: true,
        system: [{ type: "text", text: PROMPT_SYSTEME, cache_control: { type: "ephemeral" } }],
        messages,
      }),
    });
    if (!reponse.ok || !reponse.body) {
      // Jamais le corps complet dans l'erreur : il peut contenir des détails internes.
      throw new Error(`Fournisseur indisponible (HTTP ${reponse.status})`);
    }
    const usage: Usage = { input_tokens: 0, output_tokens: 0 };
    for await (const ev of lireEvenementsSSE(reponse.body)) {
      const d = JSON.parse(ev.data);
      if (d.type === "message_start" && d.message?.usage) Object.assign(usage, d.message.usage);
      else if (d.type === "content_block_delta" && d.delta?.type === "text_delta") yield { type: "texte", texte: d.delta.text };
      else if (d.type === "message_delta" && d.usage) usage.output_tokens = d.usage.output_tokens ?? usage.output_tokens;
      else if (d.type === "error") throw new Error(`Erreur du fournisseur : ${d.error?.type ?? "inconnue"}`);
    }
    yield { type: "usage", usage };
  }
}
