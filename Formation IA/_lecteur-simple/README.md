# Next Formation IA

Application e-learning autonome qui diffuse la formation **NF-IA-150** (4 niveaux, 30 modules, 150 leçons),
servie sous `https://formation.nikaholding.world/ia`. Spécification validée : [`SPEC.md`](./SPEC.md).
Règles de développement : [`CONVENTIONS.md`](./CONVENTIONS.md).

Pile : Next.js 16.4.4 (App Router, React 19, TypeScript strict, `basePath: "/ia"`, `output: "standalone"`),
Tailwind 4, PostgreSQL 16 + Drizzle ORM, motion, Phosphor, Radix. Identité visuelle Next Formation (`src/app/globals.css`).

Le contenu de la formation n'est **pas dupliqué** : il est lu dans le dossier parent (`../programme`, `../niveaux`,
`../examens`, `../ressources`) ou dans `CONTENT_DIR`.

## Démarrage local

```bash
npm install
cp .env.example .env                 # renseigner APP_SECRET (openssl rand -hex 32) et ADMIN_PASSWORD
bash scripts/dev-db.sh               # PostgreSQL 16 local sur le port 5433 (bash scripts/dev-db.sh fg : au premier plan)
set -a; . ./.env; set +a             # les scripts tsx ne lisent pas .env tout seuls
npm run setup                        # migrations + administrateur + compte démo (idempotent)
npm run dev                          # http://localhost:3000/ia
```

> L'application vit sous **/ia** : `http://localhost:3000/` renvoie 404, utilisez `http://localhost:3000/ia`.

## Comptes

| Compte | Accès |
| --- | --- |
| Administrateur | `ADMIN_EMAIL` / `ADMIN_PASSWORD` (créé par `npm run setup` s'il n'existe pas ; `ADMIN_RESET_PASSWORD=true` pour réimposer le mot de passe) |
| Démo | bouton « Essayer le compte démo » sur `/ia/connexion` (`demo@formation-ia.local`, sans mot de passe communicable). N1 terminé avec quiz réussis, examen réussi du premier coup et certificat ; N2 à moitié ; série de 5 jours ; badges. Recréé à chaque `setup` (dates relatives à aujourd'hui, numéro de certificat conservé). `DEMO_ENABLED=false` pour le désactiver. |
| Apprenants / formateurs | sur invitation uniquement (`/ia/admin/invitations` → lien `/ia/invitation/[jeton]`) |

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` / `build` / `start` | Développement, build de production, serveur (`start` = `next start` ; l'image Docker lance `node server.js` du build standalone) |
| `npm run db:generate` | Nouvelle migration SQL dans `drizzle/` après modification de `src/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations |
| `npm run setup` | Migrations + administrateur + compte démo (idempotent) |
| `npm run build:setup` | Compile `src/scripts/setup.ts` en `dist/setup.cjs` autonome (utilisé dans l'image) |
| `npm test` | Vitest : domaine (déblocage, XP, série, badges, examens, quiz, certificats), contenu réel, crypto, rate limiting |
| `npm run lint` / `npm run typecheck` | ESLint (config Next) / TypeScript strict |

## Variables d'environnement

Voir [`.env.example`](./.env.example). Indispensables en production : `DATABASE_URL`, `APP_URL` (origine **sans** `/ia`),
`APP_SECRET` (≥ 32 caractères, ne jamais le changer : il chiffre les clés API), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## Déploiement

- **Docker Compose** (depuis `app/`) : `docker compose up -d --build`. Le contexte de build est le dossier parent
  `formation-ia/` : l'image embarque le contenu de la formation dans `/app/content`. Au démarrage, le conteneur exécute
  `node dist/setup.cjs` puis `node server.js`. Réinitialisation manuelle : `docker compose run --rm setup`.
- **Caddy** : ajouter le bloc `handle /ia* { reverse_proxy app:3000 }` dans le bloc du domaine
  (voir [`deploy/Caddyfile.example`](./deploy/Caddyfile.example)). Ne pas utiliser `handle_path` (le préfixe /ia doit être conservé).
- **Serveur Nika Holding** : `bash deploy/nikaholding.sh` (image amd64 construite en local et transférée, base
  `nextformation_ia` sur le PostgreSQL de l'hôte, conteneur `nextformation-ia` sur `127.0.0.1:3061`, insertion du bloc
  `handle /ia*` dans le Caddyfile existant avec sauvegarde et validation). DNS et serveur : gérés par Nika.

Sonde : `GET /ia/api/health` → `{ "ok": true, "programme": "NF-IA-150", … }`.
