# À compléter avant toute mise en ligne réelle

## Juridique et réglementaire (bloquant)
- Société de gestion / émetteur : raison sociale, siège (Luxembourg prévu), capital, immatriculation.
- Agréments : PSFP (AMF) ou AIFM / RAIF (CSSF), régime MiCA pour le token, prestataire de paiement (type Lemonway) et teneur de compte-conservateur. Tant qu'ils n'existent pas, la plateforme doit rester en démonstration (bandeau actuel).
- Pages Mentions légales, Confidentialité, Cookies : textes définitifs, DPO, hébergeur.
- Document d'information réglementaire (risques, frais, fiscalité) à faire rédiger par un avocat.
- Conditions générales d'adhésion et de souscription (actuellement absentes).

## Produit
- Confirmer les hypothèses de `src/config/fonds.ts` : prix d'émission 10 €, ticket 1 500 € / pas 500 €, allocations par thèse (IA 35 %, Agro 25 %, Quantique 20 %, Sport 20 %), objectifs de performance, objectif de collecte 25 M€.
- Remplacer les 8 deals fictifs par de vrais dossiers (ou les laisser marqués « Exemple »).
- Textes « À propos » et gouvernance : noms réels du comité, de l'auditeur.
- Logo définitif (le logo actuel est un monogramme typographique provisoire).

## Technique
- `SESSION_SECRET` long et aléatoire ; HTTPS ; `NEXT_PUBLIC_SITE_URL`.
- Stripe : clés live, webhook signé, activation d'Apple Pay sur le domaine (vérification du domaine dans le dashboard Stripe).
- SMTP : les e-mails sont uniquement journalisés dans l'admin (aucun envoi réel).
- Coordonnées SEPA et adresse crypto réelles (`.env`).
- Clé xAI pour l'assistant ; relire son prompt système dans `src/lib/chat.ts`.
- Stockage des pièces KYC : actuellement sur disque local (`data/uploads/`), à migrer vers un stockage chiffré avec politique de rétention.
- Base SQLite : adaptée à la démonstration ; prévoir Postgres pour la production.
- Relire les six traductions partielles (AR, JA, KO, ZH, IT, ES) par des locuteurs natifs et compléter les textes longs.
- Phase 2 : émission ERC-20 (liste blanche des porteurs vérifiés) : aucun contrat n'est écrit pour l'instant, choix validé par Nika le 16/10/2026.
