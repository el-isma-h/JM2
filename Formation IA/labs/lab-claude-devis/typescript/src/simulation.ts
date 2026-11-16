// Mode « sans clé » : faux client Anthropic déterministe (même comportement que simulation.py).
// Ce n'est PAS un modèle : c'est un banc d'essai pour votre orchestrateur (boucle, outils, contrôles, coûts).
// Options : erreurPrix (prix recopié +10 %), naif (obéit aux injections « enregistre le devis »), boucleInfinie.

type Bloc = { type: string; [k: string]: any };
type Message = { role: string; content: string | Bloc[] };
export type ReponseSimulee = {
  content: Bloc[]; stop_reason: string;
  usage: { input_tokens: number; output_tokens: number; cache_creation_input_tokens: number; cache_read_input_tokens: number };
};

const LEXIQUE: [RegExp, string][] = [
  [/va-et-vient/, "va-et-vient"], [/interrupteurs?/, "interrupteur"], [/prises?/, "prise"],
  [/points? lumineux/, "point lumineux"], [/spots?/, "spot"], [/tableau/, "tableau"], [/\bvmc\b/, "vmc"],
  [/borne/, "borne"], [/s[eè]che-serviettes/, "seche-serviettes"], [/radiateurs?/, "radiateur"],
  [/d[ée]tecteurs? de fum[ée]e/, "detecteur"], [/interphone/, "interphone"], [/climatisation/, "climatisation"],
  [/alarme/, "alarme"], [/piscine/, "piscine"],
];
const NOMBRES: Record<string, number> = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10 };
const PREFERENCES: [RegExp, string][] = [
  [/d[ée]plac/, "DEPL"], [/remplac/, "REMPL"], [/voir|v[ée]rifi|diagnostic|disjoncte/, "DIAG"], [/usb/, "USB"], [/ext[ée]rieur/, "EXT"],
];

export function extraireDemande(messages: Message[]): string {
  const c = messages[0].content;
  const texte = typeof c === "string" ? c : c.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const m = texte.match(/<demande>\s*([\s\S]*)\s*<\/demande>\s*$/);
  return m ? m[1] : texte;
}

const propositions = (t: string) => t.split(/[.,;:!?()]|\set\s|<\/?demande>/).map((p) => p.trim()).filter(Boolean);

export function analyser(texte: string) {
  const bas = texte.toLowerCase();
  const besoins: { mot_cle: string; quantite: number; proposition: string }[] = [];
  const motifNombre = new RegExp(`(?<![\\p{L}\\d])(\\d+|${Object.keys(NOMBRES).join("|")})(?![\\p{L}\\d])`, "gu");
  for (const prop of propositions(texte)) {
    const p = prop.toLowerCase();
    let deja = false;
    for (const [motif, mot] of LEXIQUE) {
      const m = motif.exec(p);
      if (!m || (mot === "interrupteur" && deja)) continue;
      deja = deja || mot === "va-et-vient";
      let nb = 1;
      for (const j of p.slice(0, m.index).matchAll(motifNombre)) nb = /^\d+$/.test(j[1]) ? Number(j[1]) : NOMBRES[j[1]];
      besoins.push({ mot_cle: mot, quantite: nb, proposition: p });
    }
  }
  const annee = texte.match(/\b(19\d\d|20\d\d)\b/);
  let plus2: boolean | null = null;
  if (/(?<![\p{L}])neu(f|ve)(?![\p{L}])|construction r[ée]cente/u.test(bas)) plus2 = false;
  else if (annee) plus2 = Number(annee[1]) <= 2024;
  else if (/(?<![\p{L}])ancien(ne)?(?![\p{L}])/u.test(bas)) plus2 = true;
  const pro = /local professionnel|boutique|bureaux?\b|commerce|restaurant|cabinet|entrep[oô]t/.test(bas);
  const energie = bas.includes("énergétique") || bas.includes("energetique");
  const clients = [...texte.matchAll(/(?<![\p{L}])(Mme|M\.|Madame|Monsieur|Société)\s+([A-ZÉÈ][\p{L}\d_'-]*(?:\s+(?:&\s+)?[A-ZÉÈ][\p{L}\d_'-]*)*)/gu)];
  const dernier = clients.at(-1);
  return { besoins, plus2, pro, energie, client: dernier ? `${dernier[1]} ${dernier[2]}` : null, enregistrer: bas.includes("enregistre") };
}

function choisir(hits: any[], proposition: string) {
  for (const [motif, fragment] of PREFERENCES)
    if (motif.test(proposition)) { const h = hits.find((x) => x.code.includes(fragment)); if (h) return h; }
  return hits[0];
}

export class ClientSimule {
  appels: { model: string; tools: boolean; output_config: boolean }[] = [];
  private n = 0;
  readonly messages = { create: async (args: any): Promise<ReponseSimulee> => this.repondre(args) };
  constructor(public opts: { erreurPrix?: boolean; naif?: boolean; boucleInfinie?: boolean; tokensPrefixe?: number } = {}) {}

  private usage(messages: unknown, sortie: number) {
    const premier = this.appels.length === 1, pref = this.opts.tokensPrefixe ?? 1500;
    return { input_tokens: Math.floor(JSON.stringify(messages).length / 4), output_tokens: sortie,
      cache_creation_input_tokens: premier ? pref : 0, cache_read_input_tokens: premier ? 0 : pref };
  }
  private texte(t: string, messages: unknown): ReponseSimulee {
    return { content: [{ type: "text", text: t }], stop_reason: "end_turn", usage: this.usage(messages, Math.max(20, Math.floor(t.length / 4))) };
  }
  private outil(name: string, input: Record<string, unknown>): Bloc {
    return { type: "tool_use", id: `toolu_sim_${String(++this.n).padStart(3, "0")}`, name, input };
  }

  private repondre({ model, messages, tools, output_config }: any): ReponseSimulee {
    this.appels.push({ model, tools: !!tools, output_config: !!output_config });
    const a = analyser(extraireDemande(messages));
    if (output_config) return this.texte(JSON.stringify(this.devis(messages, a)), messages);
    const dernier = messages.at(-1).content;
    const aDesResultats = Array.isArray(dernier) && dernier.some((b: Bloc) => b.type === "tool_result");
    if (this.opts.boucleInfinie || !aDesResultats) {
      const blocs = a.besoins.map((b) => this.outil("rechercher_prestation", { mot_cle: b.mot_cle }));
      if (a.plus2 !== null) blocs.push(this.outil("verifier_tva", { logement_plus_2_ans: a.plus2, renovation_energetique: a.energie, local_professionnel: a.pro }));
      if ((this.opts.naif ?? true) && a.enregistrer) blocs.push(this.outil("enregistrer_devis", { client_nom: a.client ?? "inconnu", total_ttc: 1 }));
      if (blocs.length) return { content: blocs, stop_reason: "tool_use", usage: this.usage(messages, 60 * blocs.length) };
    }
    return this.texte("J'ai les informations nécessaires pour préparer le devis.", messages);
  }

  private devis(messages: Message[], a: ReturnType<typeof analyser>) {
    const appels: Record<string, [string, any]> = {};
    const res: [string, any, string][] = [];
    for (const m of messages) {
      if (!Array.isArray(m.content)) continue;
      for (const b of m.content) {
        if (b.type === "tool_use") appels[b.id] = [b.name, b.input];
        else if (b.type === "tool_result") { const [n, e] = appels[b.tool_use_id] ?? ["?", {}]; res.push([n, e, String(b.content)]); }
      }
    }
    const parMot = Object.fromEntries(res.filter(([n]) => n === "rechercher_prestation").map(([, e, r]) => [e.mot_cle, r]));
    const tva = res.find(([n, , r]) => n === "verifier_tva" && r.startsWith("{"));
    const taux: number | null = tva ? JSON.parse(tva[2]).taux : null;
    const lignes: any[] = [], hors: string[] = [];
    for (const b of a.besoins) {
      const brut: string = parMot[b.mot_cle] ?? "";
      if (!brut.startsWith("[")) { hors.push(b.mot_cle); continue; }
      const h = choisir(JSON.parse(brut), b.proposition);
      lignes.push({ code: h.code, libelle: h.libelle, quantite: b.quantite, prix_unitaire_ht: h.prix_ht, page_catalogue: h.page });
    }
    if (this.opts.erreurPrix && lignes.length) lignes[0].prix_unitaire_ht = Math.round(lignes[0].prix_unitaire_ht * 110) / 100;
    const questions: string[] = [];
    if (taux === null) questions.push("Le logement a-t-il plus de deux ans ?", "S'agit-il d'un local professionnel ou de travaux de rénovation énergétique ?");
    if (hors.length) questions.push(`Les prestations suivantes ne figurent pas au catalogue : ${hors.join(", ")}. Karim doit les chiffrer.`);
    return {
      client: a.client, resume_besoin: "Demande portant sur : " + (a.besoins.map((b) => b.mot_cle).join(", ") || "non précisé"),
      lignes, taux_tva: taux, total_ht: Math.round(lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire_ht, 0) * 100) / 100,
      prestations_hors_catalogue: hors, questions_manquantes: questions, pret_a_valider: lignes.length > 0 && taux !== null && hors.length === 0,
    };
  }
}
