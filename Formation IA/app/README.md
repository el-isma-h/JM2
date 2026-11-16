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
| Inscrits Next Formation | créés automatiquement par la connexion unique (`/ia/sso`, voir ci-dessous) : `users.ssoOnly = true`, aucun mot de passe, droits par niveau dans `users.entitlements` |

## Connexion unique depuis Next Formation

Next Formation (le logiciel qui vend, inscrit, finance et suit la Formation IA) ouvre l'espace e-learning d'un
apprenant par un jeton signé : `GET /ia/sso?token=<payload>.<signature>` (contrat complet :
`next-formation/docs/formation-ia-integration.md`, section « Jeton SSO »).

- `payload` = base64url(JSON), `signature` = base64url(HMAC-SHA256(payload, secret)), secret = `NF_SSO_SECRET`
  (identique à `IA_SSO_SECRET` côté Next Formation, 32 caractères minimum).
- JSON : `{ "v": 1, "sub": "<id utilisateur Next Formation>", "email", "firstName", "lastName", "iat", "exp" (= iat + 300 s),
  "nonce" (24 caractères aléatoires), "demo": false, "entitlements": ["N1","N2"], "orgSlug", "enrollmentId", "back" }`.
- Vérifications (`src/lib/sso.ts`, `src/server/sso.ts`, route `src/app/sso/route.ts`) : signature en temps constant,
  version, `exp` / `iat` (durée de vie maximale 15 min), nonce jamais vu (table `sso_nonces`, purgée des nonces expirés).
  Un jeton ne sert qu'une fois.
- Règle `demo` : `"demo": true` ouvre une session sur le compte démo existant (`demo@formation-ia.local`) sans rien
  créer ; s'il est absent ou `DEMO_ENABLED=false`, page d'erreur. Sinon l'utilisateur est trouvé ou créé par e-mail
  (`ssoOnly = true`, mot de passe aléatoire jamais communiqué ; un compte existant garde son mot de passe), ses
  `entitlements` sont mis à jour (`null` = tous les niveaux ; `PARCOURS` = N1 à N4), la session s'ouvre comme une
  connexion normale et l'apprenant arrive sur le tableau de bord.
- Droits par niveau : un niveau absent des `entitlements` est verrouillé en bloc dans le parcours, les leçons, les quiz
  et l'examen (« Ce niveau n'est pas inclus dans votre inscription », lien « Compléter mon inscription » vers
  `NF_APP_URL/moi/formation-ia`). Le déblocage séquentiel habituel s'applique à l'intérieur des droits.
- Erreurs : redirection vers `/ia/sso/erreur?code=config|invalide|expire|rejoue|demo|compte|trop` (page dans le design
  de l'app, sans détail technique ; le motif précis est dans les journaux du serveur).
- Liens retour : « Mon dossier Next Formation » (`NF_APP_URL/moi`) dans le menu et sur la page de connexion, affiché
  seulement si `NF_APP_URL` est définie. Les comptes `ssoOnly` ne peuvent pas se connecter par mot de passe ni en
  définir un ici (« Votre accès est géré par Next Formation »).
- Recette : `signSsoToken(payload, secret)` dans `src/lib/sso.ts` fabrique un jeton de test (voir `src/lib/sso.test.ts`).

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
Connexion unique : `NF_APP_URL` (origine de Next Formation) et `NF_SSO_SECRET` (= `IA_SSO_SECRET` de Next Formation).

## Déploiement

- **Docker Compose** (depuis `app/`) : `docker compose up -d --build`. Le contexte de build est le dossier parent
  `formation-ia/` : l'image embarque le contenu de la formation dans `/app/content`. Au démarrage, le conteneur exécute
  `node dist/setup.cjs` puis `node server.js`. Réinitialisation manuelle : `docker compose run --rm setup`.
- **Caddy** : ajouter le bloc `handle /ia* { reverse_proxy app:3000 }` dans le bloc du domaine
  (voir [`deploy/Caddyfile.example`](./deploy/Caddyfile.example)). Ne pas utiliser `handle_path` (le préfixe /ia doit être conservé).
- **Serveur Nika Holding** : `bash deploy/nikaholding.sh` (image amd64 construite en local et transférée, base
  `nextformation_ia` sur le PostgreSQL de l'hôte, conteneur `nextformation-ia` sur `127.0.0.1:3061`, insertion du bloc
  `handle /ia*` dans le Caddyfile existant avec sauvegarde et validation). DNS et serveur : gérés par Nika.
- **Serveur Nika Holding, relié à Next Formation** : `bash deploy/nikaholding-ia.sh` (même principe : conteneur
  `formation-ia` sur `127.0.0.1:3061`, base `formationia`, `/opt/formation-ia/.env` ; `NF_SSO_SECRET` repris de
  `IA_SSO_SECRET` dans `/opt/nextformation/.env` s'il existe, sinon généré et écrit dans les deux fichiers ; bloc Caddy
  `handle /ia*` inséré avant le `reverse_proxy` de Next Formation). À utiliser à la place de `nikaholding.sh` quand
  Next Formation est déployé sur le même domaine (un seul des deux scripts : ils occupent le même port 3061).

Sonde : `GET /ia/api/health` → `{ "ok": true, "programme": "NF-IA-150", … }`.
