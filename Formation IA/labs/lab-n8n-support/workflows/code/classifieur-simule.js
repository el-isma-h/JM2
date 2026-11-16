// Nœud Code — "Classifieur simulé (mots-clés)" (Run Once for All Items)
// Remplace le Text Classifier (Haiku 5.5) en mode sans clé. Même contrat : 5 catégories,
// et « en cas de doute entre réclamation et une autre catégorie, choisissez réclamation ».
const sansAccents = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const REGLES = [   // ordre = priorité : la réclamation passe avant tout le reste
  ["reclamation", ["rembours", "inadmissible", "inacceptable", "litige", "avis", "etoile", "incapable", "moquez", "scandale", "arnaque", "avocat", "honte", "ignorez vos instructions"]],
  ["facturation", ["factur", "preleve", "prelevement", "avoir", "tva", "paiement", "siret"]],
  ["livraison", ["livraison", "colis", "suivi", "transit", "adresse", "carton", "recevoir", "expedi"]],
  ["technique", ["appair", "capteur", "detecteur", "voyant", "wi-fi", "wifi", "box", "application", "mot de passe", "mise a jour", "prise", "compatible", "panne"]],
];
return $input.all().map(it => {
  const t = sansAccents(`${it.json.sujet} ${it.json.message}`);
  const regle = REGLES.find(([, mots]) => mots.some(m => t.includes(m)));
  return { json: { ...it.json, categorie: regle ? regle[0] : "autre" } };
});
