// Nœud Code — "Calcul des KPI de la semaine" (mode Run Once for All Items)
// Entrée : un item par ligne de la feuille ventes (colonnes du CSV Mobidesk)
// Sortie : un item { kpi: {...} } — tous les chiffres sont calculés ICI, jamais par le LLM.
// Différence avec la leçon L058 : la date de référence vient du nœud "Paramètres" (et non de $env,
// souvent bloqué par N8N_BLOCK_ENV_ACCESS_IN_NODE), et les montants sont aussi fournis déjà formatés.

// Toutes les dates sont manipulées en UTC à minuit pour éviter les décalages de fuseau.
const jour = s => new Date(String(s).slice(0, 10) + "T00:00:00Z");
const ref = $('Paramètres').first().json.date_ref;
const DATE_REF = jour(ref || new Date().toISOString());        // ex. "2026-06-29" pour tester
const lundi = new Date(DATE_REF);
lundi.setUTCDate(lundi.getUTCDate() - ((lundi.getUTCDay() + 6) % 7)); // lundi de la semaine en cours
const debutN = new Date(lundi); debutN.setUTCDate(debutN.getUTCDate() - 7);    // lundi précédent
const debutN1 = new Date(lundi); debutN1.setUTCDate(debutN1.getUTCDate() - 14);

const lignes = $input.all().map(i => i.json);
const num = v => Number(String(v).replace(/\s/g, "").replace(",", "."));   // "1 078,20" → 1078.2
const dans = (l, d1, d2) => { const d = jour(l.date); return d >= d1 && d < d2; };

const semN  = lignes.filter(l => dans(l, debutN, lundi));
const semN1 = lignes.filter(l => dans(l, debutN1, debutN));
const somme = arr => Math.round(arr.reduce((s, l) => s + num(l.montant_ht), 0) * 100) / 100;
const parCle = (arr, cle) => {
  const m = {};
  for (const l of arr) m[l[cle]] = (m[l[cle]] || 0) + num(l.montant_ht);
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ nom: k, ca: Math.round(v * 100) / 100 }));
};

const caN = somme(semN), caN1 = somme(semN1);
const variation = caN1 === 0 ? null : Math.round((caN - caN1) / caN1 * 1000) / 10;
const avoirs = semN.filter(l => num(l.quantite) < 0).length;
const fmt = d => d.toISOString().slice(0, 10);

// Formatage français fait par le CODE (le modèle recopie des chaînes prêtes) : « 1 078,20 € », « −55,9 % »
const euros = x => (x < 0 ? "-" : "") + Math.abs(x).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
const pct = v => v === null ? null : (v < 0 ? "−" : "+") + Math.abs(v).toFixed(1).replace(".", ",") + " %";
const cumul = somme(lignes);
const topCom = parCle(semN, "commercial"), topProd = parCle(semN, "produit");

return [{ json: { kpi: {
  periode: { debut: fmt(debutN), fin: fmt(new Date(lundi - 1)) },
  nb_lignes_semaine: semN.length,
  ca_semaine: caN,
  ca_semaine_precedente: caN1,
  variation_pct: variation,            // null si pas de référence
  cumul_semestre: cumul,               // toutes les lignes de la feuille
  avoirs_semaine: avoirs,
  top_commerciaux: topCom,
  top_produits: topProd,
  affichage: {                         // les mêmes chiffres, formatés pour être recopiés tels quels
    ca_semaine: euros(caN),
    ca_semaine_precedente: euros(caN1),
    variation_pct: pct(variation),
    cumul_semestre: euros(cumul),
    top_commerciaux: topCom.map(t => ({ nom: t.nom, ca: euros(t.ca) })),
    top_produits: topProd.map(t => ({ nom: t.nom, ca: euros(t.ca) })),
  },
  alerte: semN.length === 0 ? "Aucune ligne cette semaine : vérifier la source" : null
} } }];
