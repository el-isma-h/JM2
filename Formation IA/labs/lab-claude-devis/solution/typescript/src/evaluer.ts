// Évaluation sur donnees/demandes_eval.jsonl — npx tsx src/evaluer.ts
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chargerCasEval } from "./donnees.js";
import { creerClient, traiterDemande } from "./orchestrateur.js";

export async function evaluer(client?: any, verbeux = true) {
  client = client ?? (await creerClient());
  const cas = chargerCasEval();
  const tmp = mkdtempSync(join(tmpdir(), "devis-eval-"));
  let lignes = 0, tva = 0, hors = 0, questions = 0, prixInventes = 0, couts = 0;
  try {
    for (const c of cas) {
      const d: any = await traiterDemande(c.texte, { client, confirmer: () => false, journal: join(tmp, "journal.jsonl") });
      const obtenues = Object.fromEntries(d.lignes.map((l: any) => [l.code, l.quantite]));
      const okL = JSON.stringify(Object.entries(obtenues).sort()) === JSON.stringify(Object.entries(c.lignes_attendues).sort());
      const okT = d.taux_tva === c.taux_tva_attendu;
      const okH = c.hors_catalogue_attendu.every((h) => d.prestations_hors_catalogue.some((x: string) => x.includes(h)));
      const okQ = c.questions_attendues ? d.questions_manquantes.length > 0 : true;
      const nPrix = (d.alertes ?? []).filter((a: string) => a.startsWith("prix non conforme") || a.startsWith("code inconnu")).length;
      lignes += +okL; tva += +okT; hors += +okH; questions += +okQ; prixInventes += nPrix; couts += d._cout_usd;
      if (verbeux) console.log(`${c.id} ${c.type.padEnd(15)} lignes ${okL ? "✔" : "✘"} tva ${okT ? "✔" : "✘"} hors ${okH ? "✔" : "✘"} questions ${okQ ? "✔" : "✘"} prix inventés ${nPrix}`);
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
  const n = cas.length;
  const res = { cas: n, lignes: lignes / n, tva: tva / n, hors_catalogue: hors / n, questions: questions / n,
    prix_inventes: prixInventes, cout_moyen_usd: Math.round((couts / n) * 1e5) / 1e5, reussi: false };
  res.reussi = res.prix_inventes === 0 && res.tva >= 0.9 && res.cout_moyen_usd <= 0.05;
  if (verbeux) console.log(res);
  return res;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  evaluer().then((r) => process.exit(r.reussi ? 0 : 1));
}
