# Next Formation

Logiciel de gestion d'organismes de formation et de CFA (famille Next Capital), concurrent direct de Digiforma : CRM et devis, catalogue et programmes versionnés, sessions et inscriptions OF / CFA, planning et émargement par demi-journée verrouillé, documents et signature, financements, facturation et BPF, conformité Qualiopi explicable, tâches et relais, pilotage par rôle, extranets apprenant / entreprise / formateur, e-learning, assistant IA avec validation humaine, API et intégrations.

Le périmètre fonctionnel et les règles métier suivent le cahier des charges ATLAS (`docs/cahier-des-charges-atlas.md`) : rôles additifs, propriétaire actif pour la sécurité et la charte, heures prévues / programmées / effectuées / justifiées / validées distinguées, périodes clôturées verrouillées, cohortes d'examen isolées, analyses qualité immuables.

## Démarrage rapide (local)

Prérequis : Node 22, PostgreSQL 16 (ou Docker).

```bash
cp .env.example .env            # renseigner APP_SECRET (32+ caractères) et DATABASE_URL
npm install
npm run db:migrate              # migrations Drizzle
npm run setup                   # administrateur plateforme, tarifs, registre, modèles, référentiel qualité
npm run dev                     # http://localhost:3000
```

- Démonstration : `http://localhost:3000/demo` ouvre un organisme fictif complet (OF + CFA) selon 8 profils ; supprimé après 24 h.
- Administration plateforme : `/admin` avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` du `.env`.
- Création d'un organisme réel : `/inscription`.

## Docker

```bash
cp .env.example .env            # secrets de production
docker compose up -d --build    # app (3000) + PostgreSQL 16 + cron des tâches de fond
```

Déploiement serveur Nika Holding (Caddy, `formation.nikaholding.world`) : `bash deploy/nikaholding.sh`.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` / `npm run build` / `npm run start` | Next.js |
| `npm run db:generate` / `npm run db:migrate` / `npm run db:push` | Drizzle (migrations dans `drizzle/`) |
| `npm run setup` | Bootstrap idempotent (admin, tarifs, registre, modèles, référentiels) |
| `npm run test` | Tests unitaires (vitest) : moteur d'heures, droits, numérotation, moteur qualité… |
| `npm run lint` | ESLint |
| `npx tsx --conditions=react-server src/scripts/demo-check.ts` | Crée une démo et vérifie ses invariants |

## Variables d'environnement

Voir `.env.example` : base de données, `APP_SECRET`, e-mail (Resend), IA (**une seule clé suffit** : Anthropic, OpenAI ou xAI), stockage (disque privé ou S3), signature électronique, `CRON_SECRET`, mentions légales.

## Structure

```
src/app/              routes (site vitrine, (auth), app/[orgId]/…, moi, entreprise, formateur, admin, api)
src/components/       ui (kit), app (shell, nav), marketing, modules
src/db/schema/        tenancy, auth, crm, catalog, sessions, planning, exams, documents, finance, quality, tasks, platform
src/server/           auth, authz (rôles et permissions), guard, audit, actions/*, services par domaine, jobs, backup, demo
docs/                 cahier des charges, captures
```

Conventions de développement : `CONVENTIONS.md`.

## Formation IA (NF-IA-150)

La formation IA de 150 h (4 niveaux certifiants + spécialisation N5) est vendue par l'organisme « Next Formation Académie » créé par `npm run setup` (programme `NF-IA-150`, sessions à entrées permanentes, pièces, financeurs). Vitrine : bouton « Formation IA » du menu, bloc sous l'accueil et page `/formation-ia` ; inscription en ligne `/formation-ia/inscription` (compte, offre, financement OPCO / entreprise / France Travail / personnel, CPF en pré-réservation tant que la certification n'est pas enregistrée au Répertoire spécifique, pièces, contrat ou convention, signature) ; bouton « Tester en tant que Camille » (organisme de démonstration, supprimé après 24 h). L'apprentissage se fait dans l'application e-learning séparée (`JM/Formation IA/app`, servie sous `/ia`) ouverte par connexion unique depuis `/moi/formation-ia` : variables `IA_APP_URL` et `IA_SSO_SECRET` (`.env.example`). Détails et contrat d'intégration : `docs/formation-ia-integration.md`. Recette : `npx tsx --conditions=react-server src/scripts/ia-check.ts`.
