// Nœud Code — "Rédaction simulée (sans clé)" : remplace la Basic LLM Chain en mode simulé.
// Rédige à partir de kpi.affichage, comme un modèle obéissant. Paramètres.panne permet de simuler
// une erreur typique d'un vrai modèle pour vérifier que le contrôle l'attrape :
//   ""              → texte fidèle            "faute_de_frappe" → 1 078,20 devient 1 087,20
//   "arrondi"       → « environ 1 100 € »     "invente"         → montant absent du JSON
const k = $input.first().json.kpi;
const panne = $('Paramètres').first().json.panne || "";
if (k.alerte) return [{ json: { text: `Rapport non généré : ${k.alerte}` } }];

const a = k.affichage;
let ca = a.ca_semaine;
if (panne === "faute_de_frappe") ca = ca.replace(/(\d)(\d),/, "$2$1,");
if (panne === "arrondi") ca = "environ " + String(Math.round(k.ca_semaine / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
const comparaison = a.variation_pct ? `(${a.variation_pct})` : "(pas de semaine de référence)";
let attention = k.avoirs_semaine > 0 ? `${k.avoirs_semaine} avoir(s) cette semaine.` : "aucun avoir cette semaine.";
if (k.ca_semaine < 0) attention += " Chiffre d'affaires de la semaine négatif.";
const lignes = [
  `Objet : Mobidesk — ventes semaine du ${k.periode.debut} au ${k.periode.fin}`,
  `1. Chiffre de la semaine : CA ${ca}, contre ${a.ca_semaine_precedente} la semaine précédente ${comparaison}. Cumul du semestre : ${a.cumul_semestre}.`,
  `2. Faits marquants : ${a.top_commerciaux[0].nom} en tête (${a.top_commerciaux[0].ca}) ; produit en tête : ${a.top_produits[0].nom} (${a.top_produits[0].ca}).`,
  `3. Points d'attention : ${attention}`,
];
if (panne === "invente") lignes.push("Objectif mensuel atteint à 4 250,00 €.");
return [{ json: { text: lignes.join("\n") } }];
