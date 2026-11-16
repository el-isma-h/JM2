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

## Design V3 (16/10/2026, nuit)
- Lint 0 erreur, types OK, 7 tests unitaires, build OK.
- Scénario Playwright complet vert (14 routes × 8 langues, parcours investisseur, candidature 6 étapes, admin, mobile 390 px sans débordement, menu plein écran, chatbot, 0 erreur console).
- Contrôle visuel : écran d'entrée, intro à cercles, panneaux épinglés (IA, agro), appel final, menu, page thèses, mobile.
- Corrections en cours de route : centrage des panneaux épinglés (top 50 % inline), débordement mobile du titre « AGROALIMENTAIRE » (8,5 vw), bug de soumission anticipée du formulaire de candidature.

## SEO technique (16/10/2026)
- `npm run lint` : 0 erreur ; `npm run typecheck` : OK ; `npm test` : 12 tests (7 existants + 5 SEO : robots selon `NEXT_PUBLIC_ALLOW_INDEXING`, hreflang + x-default, noindex par défaut, unicité des descriptions).
- `npm run build` non relancé (disque de la machine plein) : à rejouer avant mise en production, ou via `docker build`.
- Contrôle curl sur le serveur de développement : `robots.txt` = `Disallow: /` (indexation désactivée) ; `sitemap.xml` = 184 URL (15 pages + 8 deals, × 8 langues) avec alternates ; 16 routes publiques × 8 langues en 200, un seul `h1`, canonical, 9 hreflang (8 langues + x-default), `lang` correct ; `noindex, nofollow` en balise et en en-tête `X-Robots-Tag` ; JSON-LD Organization/WebSite (accueil), FAQPage (FAQ), BreadcrumbList (fiche deal) ; image de partage 1200 × 630 en 200.
- Non vérifié : comportement avec `NEXT_PUBLIC_ALLOW_INDEXING=true` sur un serveur réel (couvert par les tests unitaires uniquement), métadonnées des pages compte/admin en session connectée (redirection vers la connexion sans session), image Docker non construite.
