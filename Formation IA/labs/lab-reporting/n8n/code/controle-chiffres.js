// Nœud Code — "Contrôle des chiffres du rapport" (mode Run Once for All Items)
// Vérifie que chaque nombre du texte rédigé existe dans le JSON kpi ; sinon, avertissement + relecture humaine.
// Différence avec la leçon L058 (section 5) : les numéros de section en début de ligne (« 1. », « 2. », « 3. »)
// sont retirés avant l'analyse ; sans cela, le format imposé par le prompt déclenche de fausses alertes.
const entree = $input.first().json;
const texte = entree.text ?? entree.output ?? "";       // sortie de la Basic LLM Chain
const kpi = $('Calcul des KPI de la semaine').first().json.kpi;

// Tous les nombres autorisés : valeurs du JSON (en valeur absolue, arrondies à 2 décimales)
const autorises = new Set();
const collecter = v => {
  if (typeof v === "number") autorises.add(Math.abs(Math.round(v * 100) / 100));
  else if (v && typeof v === "object") Object.values(v).forEach(collecter);
};
collecter(kpi);

// Nombres trouvés dans le texte (formats « 1 078,20 », « 55,9 », « 33500.00 »),
// après avoir retiré les dates ISO (2026-06-22), les numéros de section, et en ignorant les années isolées.
const sansDates = texte
  .replace(/\d{4}-\d{2}-\d{2}/g, " ")
  .replace(/^\s*\d+[.)]\s/gm, " ");
const trouves = [...sansDates.matchAll(/\d[\d   ]*(?:[.,]\d+)?/g)]
  .map(m => Number(m[0].replace(/[\s ]/g, "").replace(",", ".")))
  .filter(n => !Number.isNaN(n) && n >= 1 && !(n >= 2000 && n <= 2100));
const inconnus = [...new Set(trouves)].filter(n => !autorises.has(n));

// Une alerte (semaine vide) ne doit produire AUCUN chiffre : on vérifie la phrase imposée.
const alerte_respectee = !kpi.alerte || texte.trim().startsWith("Rapport non généré");

return [{ json: {
  texte,
  controle_ok: inconnus.length === 0 && alerte_respectee && !kpi.alerte,
  alerte: kpi.alerte,
  chiffres_inconnus: inconnus,
  texte_final: inconnus.length === 0 ? texte
    : texte + `\n\n⚠️ CONTRÔLE AUTOMATIQUE : chiffres non reconnus ${inconnus.join(", ")} — rapport à relire avant diffusion.`
} }];
