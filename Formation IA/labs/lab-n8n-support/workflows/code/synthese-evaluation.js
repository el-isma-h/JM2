// Nœud Code — "Synthèse de l'évaluation" (Run Once for All Items)
// Calcule les trois indicateurs de livraison de L038 (section 5) sur les items qui portent un « attendu ».
const items = $input.all().map(i => i.json);
const evalues = items.filter(d => d.attendu);
if (evalues.length === 0) return items.map(json => ({ json }));   // appel webhook unitaire : on renvoie le ticket
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const lignes = evalues.map(d => {
  const bonne_categorie = d.categorie === d.attendu.categorie;
  const bonne_escalade = d.escalade === d.attendu.escalade;
  const elements_ok = d.attendu.escalade ? true : d.attendu.elements.every(e => norm(d.reponse ?? "").includes(norm(e)));
  return { ticket_id: d.ticket_id, sujet: d.sujet, categorie: d.categorie, attendue: d.attendu.categorie,
           bonne_categorie, escalade: d.escalade, escalade_attendue: d.attendu.escalade, bonne_escalade,
           reponse_conforme: bonne_escalade && elements_ok };
});
const n = lignes.length;
const pct = k => Math.round(lignes.filter(l => l[k]).length / n * 100);
const reclamations_manquees = lignes.filter(l => l.attendue === "reclamation" && !l.escalade).map(l => l.ticket_id);
const synthese = {
  cas: n,
  taux_bonne_categorie: pct("bonne_categorie"),
  taux_reponses_conformes: pct("reponse_conforme"),
  reclamations_non_escaladees: reclamations_manquees,
  livrable: pct("bonne_categorie") >= 90 && pct("reponse_conforme") >= 80 && reclamations_manquees.length === 0,
  erreurs: lignes.filter(l => !l.bonne_categorie || !l.reponse_conforme),
};
return [{ json: { synthese, detail: lignes } }];
