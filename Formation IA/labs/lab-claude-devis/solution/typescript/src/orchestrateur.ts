// Orchestrateur Devis-Express en TypeScript (L077, section 3.3) : outils + cache + sortie structurée + contrôles.
// Mode réel : ANTHROPIC_API_KEY définie (npm install @anthropic-ai/sdk). Mode simulé : sans clé ou LAB_MODE=simulation.
import { appendFileSync } from "node:fs";
import { chargerPromptSysteme, chargerSchemaDevis } from "./donnees.js";
import {
  OUTILS, calculerTotaux, controlerDevis, coutUsd, creneaux, enregistrerDevis, rechercherPrestation, verifierTva,
  type Confirmer, type Devis, type Usage,
} from "./outils.js";
import { ClientSimule } from "./simulation.js";

export const MODELE = process.env.LAB_MODELE ?? "claude-sonnet-5-5";
export const PROMPT_VERSION = "devis-express-v2";
const SCHEMA_DEVIS = chargerSchemaDevis();
const SYSTEM = [
  { type: "text", text: chargerPromptSysteme() },
  { type: "text", text: "Catalogue de référence (PDF) : les prix font foi via l'outil.", cache_control: { type: "ephemeral", ttl: "1h" } },
];

export function modeSimulation(): boolean {
  const mode = (process.env.LAB_MODE ?? "").toLowerCase();
  if (mode === "simulation") return true;
  if (mode === "reel") return false;
  return !process.env.ANTHROPIC_API_KEY;
}

/** Client réel (SDK chargé dynamiquement : inutile de l'installer en mode simulé) ou simulé. */
export async function creerClient(): Promise<any> {
  if (modeSimulation()) return new ClientSimule();
  const nom = "@anthropic-ai/sdk";
  const { default: Anthropic } = await import(nom);
  return new Anthropic();   // lit ANTHROPIC_API_KEY dans l'environnement — jamais de clé dans le code (E10)
}

const FONCTIONS: Record<string, (a: any) => string> = {
  rechercher_prestation: (a) => rechercherPrestation(a.mot_cle),
  verifier_tva: (a) => verifierTva(a.logement_plus_2_ans, a.renovation_energetique, a.local_professionnel),
  creneaux: (a) => creneaux(a.date_iso),
};

/** Exécute un outil ; toute exception (refus humain compris) est renvoyée au modèle avec isError = true. */
export async function executerOutil(nom: string, entree: any, confirmer?: Confirmer): Promise<[string, boolean]> {
  try {
    if (nom === "enregistrer_devis") return [await enregistrerDevis(entree.client_nom, entree.total_ttc, confirmer), false];
    const fn = FONCTIONS[nom];
    if (!fn) return [`erreur : outil inconnu ${nom}`, true];
    return [fn(entree), false];
  } catch (e) {
    return [`erreur : ${e instanceof Error ? e.message : String(e)}`, true];
  }
}

function cumuler(total: Usage, u: any) {
  total.input += u?.input_tokens ?? 0; total.output += u?.output_tokens ?? 0;
  total.cache_w += u?.cache_creation_input_tokens ?? 0; total.cache_r += u?.cache_read_input_tokens ?? 0;
}

export type Options = { client?: any; confirmer?: Confirmer; maxTours?: number; journal?: string };

export async function traiterDemande(texte: string, opts: Options = {}): Promise<Devis> {
  const client = opts.client ?? (await creerClient());
  const maxTours = opts.maxTours ?? 8;
  const messages: any[] = [{ role: "user", content: [{ type: "text", text: `<demande>\n${texte}\n</demande>` }] }];
  const usage: Usage = { input: 0, output: 0, cache_w: 0, cache_r: 0 };
  const outilsAppeles: { outil: string; entree: unknown; erreur: boolean }[] = [];
  const t0 = Date.now();
  let devis: Devis | undefined;

  for (let tour = 0; tour < maxTours && !devis; tour++) {
    const r = await client.messages.create({ model: MODELE, max_tokens: 2000, system: SYSTEM, tools: OUTILS, messages });
    cumuler(usage, r.usage);
    messages.push({ role: "assistant", content: r.content });
    if (r.stop_reason === "tool_use") {
      const resultats: any[] = [];
      for (const b of r.content) {
        if (b.type !== "tool_use") continue;
        const [resultat, erreur] = await executerOutil(b.name, b.input, opts.confirmer);
        outilsAppeles.push({ outil: b.name, entree: b.input, erreur });
        resultats.push({ type: "tool_result", tool_use_id: b.id, content: resultat, is_error: erreur });
      }
      messages.push({ role: "user", content: resultats });
      continue;
    }
    messages.push({ role: "user", content: "Produisez maintenant le devis final au format JSON demandé." });
    const rf = await client.messages.create({ model: MODELE, max_tokens: 2000, system: SYSTEM, messages,
      output_config: { format: { type: "json_schema", schema: SCHEMA_DEVIS } } });
    cumuler(usage, rf.usage);
    devis = JSON.parse(rf.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("")) as Devis;
  }
  if (!devis) devis = { erreur: "trop de tours", client: null, resume_besoin: "", lignes: [], taux_tva: null, total_ht: 0,
    prestations_hors_catalogue: [], questions_manquantes: [], pret_a_valider: false };

  const alertes = devis.erreur ? ["plafond de tours atteint : revue humaine"] : controlerDevis(devis);
  if (alertes.length) { devis.alertes = alertes; devis.pret_a_valider = false; }
  calculerTotaux(devis);
  const cout = coutUsd(usage);
  Object.assign(devis, { _cout_usd: cout, _usage: usage, _outils: outilsAppeles });
  appendFileSync(opts.journal ?? process.env.DEVIS_JOURNAL ?? "journal.jsonl", JSON.stringify({
    ts: Date.now(), prompt: PROMPT_VERSION, modele: MODELE, simulation: client instanceof ClientSimule, usage, cout_usd: cout,
    duree_s: (Date.now() - t0) / 1000, outils: outilsAppeles.map((o) => o.outil), alertes,
  }) + "\n", "utf8");
  return devis;
}
