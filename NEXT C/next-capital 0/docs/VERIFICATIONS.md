# Vérifications effectuées le 16/10/2026

- `npm run lint` : 0 erreur, 0 avertissement.
- `npm run typecheck` : OK.
- `npm test` : 7 tests unitaires (frais par niveau, ticket et pas, grille Blast, statuts, prochain statut, prix d'émission).
- `npm run build` : OK (Next.js 15.5).
- Scénario Playwright (Chromium, ordinateur 1440 px et mobile 390 px), tout vert :
  - 13 routes publiques × 8 langues en 200, redirection `/` → langue, arabe en RTL ;
  - connexion investisseur, dépôt SEPA (instructions + référence), dépôt carte simulé crédité, simulateur de souscription (5 000 € Gold → 480 NXT), souscription confirmée (solde 20 000 → 15 000 €), historique, statut Partenaire, attestation HTML ;
  - candidature complète en 6 étapes avec pièces PDF, compte en attente, wallet bloqué tant que KYC non validé ;
  - admin : dossier listé, pièce consultable, validation KYC, confirmation d'un dépôt SEPA, journal d'audit, e-mail journalisé, export CSV, deals ;
  - candidat validé : accès au wallet et adhésion à régler ;
  - mobile : aucun débordement horizontal sur 6 pages, menu, chatbot (réponse de secours) ;
  - 0 erreur console.

Non vérifié : Stripe réel (clé absente : mode simulation testé), webhook Stripe, xAI réel, Safari / Firefox, appareils réels, Lighthouse, lecture par des natifs des 6 traductions partielles.

## Design V2 (16/10/2026, soir)
- Lint 0 erreur, types OK, 7 tests unitaires, build OK.
- Même scénario Playwright rejoué intégralement : tout vert (8 langues × 13 routes, parcours investisseur, candidature, admin, mobile 390 px sans débordement, chatbot, 0 erreur console).
- Contrôle visuel : accueil ordinateur et mobile, adhésion, espace investisseur, thèses ; titres géants réduits à 10 vw sur mobile pour « AGROALIMENTAIRE ».

## Études de marché (16/10/2026, soir)
- 24 publications sources lues via les pages officielles (goldmansachs.com, morganstanley.com, jpmorgan.com / am.jpmorgan.com, blackrock.com) le 16/10/2026 ; chiffres recopiés tels quels.
- Le conteneur de travail ne peut pas ouvrir ces domaines en direct (proxy) : la vérification des liens a été faite par lecture des pages, pas par test HTTP automatisé. À recontrôler ponctuellement (les PDF Goldman Sachs et Morgan Stanley peuvent changer d'URL).
- Build OK, `/marches` en 200 dans les 8 langues, scénario Playwright complet vert (14 routes × 8 langues, mobile sans débordement sur /marches et /theses).
