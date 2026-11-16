// Nœud Code — "Normaliser demande" (Run Once for All Items)
// Même item standard quelle que soit la source (webhook : $json.body ; jeu de test : $json) — section 2 de L038.
return $input.all().map((it, i) => {
  const s = it.json.body ?? it.json;
  return { json: {
    ticket_id: "T-SIM-" + (s.id ?? String(i + 1).padStart(2, "0")),
    canal: s.canal ?? "formulaire",
    email: String(s.email ?? "").toLowerCase().trim(),
    nom: s.nom ?? "",
    sujet: s.sujet ?? "",
    message: String(s.message ?? "").slice(0, 4000),
    recu_le: new Date().toISOString(),
    // champs d'évaluation (présents seulement dans le jeu de test)
    attendu: s.categorie_attendue ? { categorie: s.categorie_attendue, escalade: s.doit_escalader, elements: s.elements_attendus ?? [] } : null,
  } };
});
