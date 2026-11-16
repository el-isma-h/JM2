# NEXT Capital : fonds d'investissement tokenisé (plateforme de démonstration)

Plateforme complète : site vitrine en 8 langues, candidature avec KYC, espace investisseur (wallet, dépôts SEPA / carte-Apple Pay / crypto, souscription du token NXT, grand livre, portefeuille, documents, statut), back-office d'administration et assistant d'orientation.

**Démonstration : aucun agrément, aucune souscription réelle.** Un bandeau le rappelle sur toutes les pages ; le site est en `noindex` tant que `NEXT_PUBLIC_ALLOW_INDEXING` ne vaut pas `true`.

## Lancer

```bash
npm install
cp .env.example .env     # puis compléter les clés si besoin
npm run dev              # http://localhost:3000
```

Production : `npm run build` puis `npm start`, ou Docker :

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://votre-domaine --build-arg NEXT_PUBLIC_ALLOW_INDEXING=false -t next-capital .
docker run -p 3000:3000 --env-file .env -v next-capital-data:/app/data next-capital
```

La base SQLite est créée au premier démarrage dans `data/next-capital.sqlite` avec les comptes de démonstration. Les pièces KYC sont stockées dans `data/uploads/`. Réinitialisation : bouton dans Administration → Paramètres, ou `npm run db:reset`.

## Comptes de démonstration (mot de passe : `demo1234`)

| Compte | Rôle |
|---|---|
| `admin@demo.next` | Administration |
| `investisseur@demo.next` | Investisseur KYC validé, adhésion Gold réglée, wallet alimenté, 2 souscriptions |
| `candidat@demo.next` | Candidat dont le dossier KYC est en attente |

## Parcours

1. **Candidature** (`/fr/candidature`) : identité, situation (revenus, patrimoine, secteur, origine des fonds, PPE, US person), profil d'investisseur (zones, thèses, risque, rendement, horizon, expérience), niveau d'adhésion, pièces (identité + domicile), attestations. Compte créé en statut `en_attente`.
2. **Examen** : l'admin consulte le questionnaire et les pièces (`/fr/admin/kyc`), puis valide / demande un complément / refuse. E-mail journalisé.
3. **Adhésion** : réglée depuis le wallet (Bronze 1 500 € → Diamond 10 000 € / an).
4. **Dépôt** : virement SEPA (référence + IBAN affichés, confirmation admin), carte / Apple Pay (Stripe Checkout en mode test, ou simulation locale si clé absente), crypto (adresse affichée, hash déclaré, confirmation admin).
5. **Souscription** : dès 1 500 € par multiples de 500 €, frais de structuration selon le niveau (5 / 5 / 4 / 4 / 3 %), plafonds annuels et par opération, 1 NXT = 10 € à l'émission.
6. **Suivi** : grand livre de chaque mouvement (solde et tokens après opération), portefeuille et allocation par thèse, attestations de souscription imprimables, statut par capital investi (Membre, Partenaire, Associé, Club 50, Cercle 100).

## Design

Style repris de nikaholding.world avec un code couleurs propre à NEXT Capital : encre `#0A0B0D`, os `#F3F0E8`, signal `#19E07A`, lime `#D8FF3D`, thèses IA `#00D1FF` / Quantique `#7A3BFF` / Agro `#3FD66B` / Sport `#FF5A1F` (`src/config/couleurs.ts`, `src/app/globals.css`). Typographies Archivo, Inter, JetBrains Mono, Cormorant Garamond (toutes locales). Structure et animations inspirées de k8cap.com (V3) : écran d'entrée à fond ambiant animé en canvas, défilement lissé Lenis, section thèses épinglée avec illustrations filaires, en-tête minimal et menu plein écran, titres fins et espacés.

## Études de marché

`/marches` et blocs sur `/theses` : synthèses par thèse construites uniquement à partir de publications de BlackRock, J.P. Morgan, Morgan Stanley et Goldman Sachs, chaque chiffre lié à sa source (`src/config/marches.ts`). Mettre à jour les dates et les URL lors de chaque révision.

## Configuration

Tout le modèle économique est dans `src/config/fonds.ts` (token, ticket, adhésions, statuts, thèses, frais). Les dossiers d'illustration sont dans `src/config/deals.ts` (fictifs, marqués « Exemple ») et modifiables depuis l'admin.

Variables `.env` (voir `.env.example`) : `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` (seule source de l'URL publique), `NEXT_PUBLIC_ALLOW_INDEXING` (`false` par défaut : site entier noindex et `robots.txt` en `Disallow: /`), `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (webhook : `/api/stripe/webhook`), `XAI_API_KEY` (assistant Grok ; sans clé, réponses d'orientation par mots-clés), `SEPA_*`, `CRYPTO_*`.

## Langues

`/fr`, `/en`, `/ar` (droite-à-gauche), `/ja`, `/ko`, `/zh`, `/it`, `/es`. Français et anglais sont intégralement traduits ; les six autres langues couvrent la navigation, l'accueil, les titres des pages, la candidature, l'espace investisseur et l'assistant, et retombent sur l'anglais pour les textes longs (`src/i18n/dictionnaires/`).

## Vérifications

`npm run lint`, `npm run typecheck`, `npm test` (7 tests unitaires sur les frais, tickets et statuts), `npm run build`. Un scénario Playwright de bout en bout a été rejoué (voir `docs/VERIFICATIONS.md`).

## Structure

```
src/config/        modèle économique, deals d'illustration
src/i18n/          8 dictionnaires
src/lib/           base SQLite, authentification, wallet, journal, Stripe, chat, actions serveur
src/app/[locale]/  vitrine, candidature, compte/, admin/
src/app/api/       chat, stripe (retour, webhook), documents, attestation, exports CSV
docs/              A-COMPLETER.md, DECISIONS.md, VERIFICATIONS.md
```
