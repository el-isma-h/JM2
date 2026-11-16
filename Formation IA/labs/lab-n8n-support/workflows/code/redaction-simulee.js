// Nœud Code — "Rédaction simulée (fiches)" (Run Once for All Items)
// Remplace l'AI Agent + base_support en mode sans clé : choisit une réponse type tirée des fiches de
// base-connaissances/ ; aucune réponse type trouvée → confiance basse → escalade (section 3.3 de L038).
const sansAccents = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const REPONSES = [
  { mots: ["deux fois", "en double", "doublon"], fiche: "Factures, avoirs et prélèvements",
    texte: "Après vérification de votre relevé, nous émettons un avoir et le doublon vous est remboursé sous 5 jours ouvrés." },
  { mots: ["siret", "societe", "entreprise"], fiche: "Factures, avoirs et prélèvements",
    texte: "Indiquez-nous la raison sociale et le numéro de SIRET : la facture peut être rééditée une fois au nom de votre société." },
  { mots: ["tva"], fiche: "Factures, avoirs et prélèvements",
    texte: "Nos prix sont affichés TTC, avec une TVA de 20 %. Le détail figure sur chaque facture." },
  { mots: ["factur"], fiche: "Factures, avoirs et prélèvements",
    texte: "Votre facture est téléchargeable en PDF dans votre espace client, rubrique Mes commandes → Facture." },
  { mots: ["voyant", "rouge", "pile"], fiche: "Appairer un capteur ou un détecteur",
    texte: "Un voyant qui clignote en rouge signale une pile faible : remplacez la pile CR2032, puis vérifiez que le voyant redevient bleu." },
  { mots: ["appair", "associer"], fiche: "Appairer un capteur ou un détecteur",
    texte: "Placez le capteur à moins de 2 mètres de la box, puis maintenez le bouton appuyé 10 secondes jusqu'au clignotement bleu." },
  { mots: ["wi-fi", "wifi", "5 ghz"], fiche: "Box Hub M2 — Wi-Fi et mises à jour",
    texte: "La box Hub M2 se connecte uniquement en Wi-Fi 2,4 GHz (ou par câble Ethernet) : activez la bande 2,4 GHz de votre box internet." },
  { mots: ["mot de passe"], fiche: "Application mobile Maison Connectée",
    texte: "Sur l'écran de connexion, touchez Mot de passe oublié : le nouveau lien est valable 1 heure." },
  { mots: ["mise a jour", "disparu"], fiche: "Box Hub M2 — Wi-Fi et mises à jour",
    texte: "Après une mise à jour, redémarrez la box (débranchez-la 30 secondes) : l'appareil réapparaît en général dans l'application." },
  { mots: ["suivi", "transit", "bouge"], fiche: "Livraison — délais et suivi de colis",
    texte: "Sans mouvement du suivi depuis 5 jours ouvrés, nous ouvrons une enquête auprès du transporteur ; sa réponse peut prendre 10 jours ouvrés." },
  { mots: ["ecrase", "abime", "endommage", "fele", "casse"], fiche: "Colis endommagé à la réception",
    texte: "Envoyez-nous des photos du colis et du produit sous 48 heures : nous expédions un remplacement sous 3 jours ouvrés." },
  { mots: ["adresse"], fiche: "Livraison — délais et suivi de colis",
    texte: "L'adresse peut être modifiée tant que la commande est au statut En préparation, depuis votre espace client." },
  { mots: ["combien de temps", "delai", "recevoir"], fiche: "Livraison — délais et suivi de colis",
    texte: "Commandé avant 14 h un jour ouvré, votre colis part le jour même ; la livraison Colissimo prend ensuite 2 à 3 jours ouvrés." },
];
const REDIGER = ["facturation", "technique", "livraison"];
return $input.all().map(it => {
  const d = it.json;
  if (!REDIGER.includes(d.categorie)) {
    return { json: { ...d, escalade: true, statut: "escalade", motif: `catégorie ${d.categorie}`, reponse: null, sources: [], confiance: null } };
  }
  const t = sansAccents(`${d.sujet} ${d.message}`);
  const r = REPONSES.find(x => x.mots.some(m => t.includes(m)));
  if (!r) {
    return { json: { ...d, escalade: true, statut: "escalade", motif: "confiance basse (aucune fiche ne répond)", reponse: null, sources: [], confiance: "basse" } };
  }
  return { json: { ...d, escalade: false, statut: "a_valider", motif: null, confiance: "haute",
    reponse: `Bonjour ${d.nom},\n\n${r.texte}\n\nBien cordialement,\nL'équipe support Maison Connectée`, sources: [r.fiche] } };
});
