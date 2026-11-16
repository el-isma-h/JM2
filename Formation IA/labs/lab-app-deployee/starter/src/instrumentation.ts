// src/instrumentation.ts — register() s'exécute au démarrage du serveur : une configuration incomplète
// ARRÊTE le processus (visible dans les journaux du déploiement ; Docker le redémarre en boucle), au lieu
// d'échouer à la première requête d'un utilisateur. Next.js se contente sinon d'afficher l'erreur.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { lireConfig } = await import("./lib/config");
  try {
    const c = lireConfig();
    console.log(JSON.stringify({ type: "demarrage", mode: c.mode, modele: c.modele, version: c.appVersion }));
  } catch (e) {
    console.error(`Démarrage interrompu — ${e instanceof Error ? e.message : String(e)}`);   // noms des variables, jamais les valeurs
    process.exit(1);
  }
}
