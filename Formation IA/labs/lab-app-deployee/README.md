# Lab L105 — Application IA complète déployée (Compta-Chat)

| | |
|---|---|
| Leçon liée | [L105 — Projet : application IA complète déployée](../../niveaux/N3-developpeur/M22-applications-ia-interface-deploiement-observabilite/L105-projet-application-ia-complete-deployee.md) (module M22, niveau 3) |
| Compétences | C3.5, C3.1 |
| Durée | 3 h pour les 7 TODO en mode simulé + 3 h pour Docker, Caddy, la checklist et la journée du chaos |
| Prérequis | Node.js 20.9+ ; Docker (pour l'image et Caddy) ; aucune clé pour démarrer |

## Objectif

Livrer le socle de production de **Compta-Chat**, l'assistant interne d'un cabinet d'expertise comptable rennais (fictif) : un chat **en streaming** derrière une route authentifiée, avec validation des entrées, quota par utilisateur, budget global bloquant, coût journalisé à chaque réponse, sonde `/api/health`, configuration qui **refuse de démarrer** si elle est incomplète, image Docker autonome et HTTPS par Caddy. Le fournisseur simulé permet de tout faire sans clé ; le mode réel appelle la Messages API d'Anthropic.

Le squelette est volontairement **minimal** : ni base de données, ni worker, ni Langfuse, ni promptfoo. Ces briques viennent des leçons L101 à L104 ; la checklist indique où elles s'insèrent.

## Contenu

```
lab-app-deployee/
├── starter/                    STARTER Next.js 16 : 7 TODO + tests vitest (36 rouges sur 40 au départ)
│   ├── src/app/                page.tsx (chat client), layout.tsx, api/chat/route.ts, api/health/route.ts
│   ├── src/instrumentation.ts  validation de la configuration au démarrage (arrêt si invalide)
│   ├── src/lib/                config, validation, quota, couts, flux (SSE serveur), sse (lecture SSE),
│   │                           chat (logique de /api/chat), fournisseurs (simulé + Anthropic), sante, dependances
│   ├── tests/                  8 fichiers vitest, 40 tests, aucun réseau
│   └── package.json, package-lock.json, next.config.ts (output standalone), tsconfig.json, vitest.config.ts
├── solution/                   corrigé (mêmes tests, tous verts ; next build vérifié)
├── Dockerfile                  multi-étapes ; ARG APP_DIR=starter|solution ; tests exécutés pendant le build
├── docker-compose.yml          app (127.0.0.1:3000) + caddy (profil https)
├── Caddyfile.exemple           HTTPS automatique, flush_interval -1, pas de compression sur le flux
├── CHECKLIST-PRODUCTION.md     checklist de la leçon (⛔ éliminatoires) + contrôles rapides + journée du chaos
├── .env.example, .dockerignore, .gitignore
```

`node_modules` n'est pas livré : `npm ci` l'installe à partir de `package-lock.json`.

## Démarrer en mode simulé (sans clé)

```bash
cd starter
npm ci
npx vitest run                 # 36 tests rouges sur 40 : chaque échec affiche « Error: TODO n : … »
npx tsc --noEmit               # le starter compile déjà
```

Après les TODO :

```bash
cp ../.env.example .env.local && sed -i "s/^DEMO_TOKEN=$/DEMO_TOKEN=$(openssl rand -hex 24)/" .env.local
npm run dev                    # http://localhost:3000 ; collez le jeton dans la page
curl -N -X POST localhost:3000/api/chat -H "authorization: Bearer <jeton>" \
     -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"Échéance TVA ?"}]}'
```

Le **fournisseur simulé** répond mot à mot, sans réseau ni coût. Deux mots-clés servent aux tests de robustesse : `#panne` (le fournisseur tombe au milieu du flux : l'utilisateur doit voir un message propre) et `#lent` (300 ms par mot : vérifiez le bouton « Arrêter » et le streaming derrière Caddy).

## Énoncé : les 7 TODO

| TODO | Fichier | Ce que vous codez | Lien avec la leçon |
|---|---|---|---|
| 1 | `src/lib/config.ts` | `lireConfig` : mode, clé, jeton, bornes ; erreur avec les **noms** des variables ; ⛔ refus de `NEXT_PUBLIC_*=sk-…` | jalon 1, facteur III |
| 2 | `src/lib/validation.ts` | `validerRequete` : rôles, contenus, 400 / 413, historique tronqué à 30 messages | F1, checklist « bornes » |
| 3 | `src/lib/quota.ts` | `Limiteur.autoriser` : fenêtre fixe par utilisateur, délai `Retry-After` | F4 |
| 4 | `src/lib/couts.ts` | `coutUsd` : entrée, sortie, lecture et écriture de cache (≈ 0,0062 $ par question Sonnet 5.5) | section 1.3 |
| 5 | `src/lib/flux.ts` | `versSSE` : fragments → événements SSE, erreur générique, annulation | streaming, journée du chaos |
| 6 | `src/lib/chat.ts` | `traiterChat` : 401 → 400 → 413 → 429 → 503 → flux, journal du coût | architecture, section 2 |
| 7 | `src/lib/sse.ts` | `lireEvenementsSSE` : tampon, découpage réseau arbitraire, UTF-8, `\r\n` | utilisé par la page **et** par le fournisseur Anthropic |

Ordre conseillé : 1 → 2 → 3 → 4 (`npx vitest run tests/config.test.ts tests/validation.test.ts tests/quota.test.ts tests/couts.test.ts`), puis 7 → 5 (`tests/flux.test.ts`), puis 6 (`tests/chat.test.ts`), puis `npx vitest run` entier et `npm run build`.

## Docker, Caddy et déploiement

```bash
cd lab-app-deployee
cp .env.example .env && sed -i "s/^DEMO_TOKEN=$/DEMO_TOKEN=$(openssl rand -hex 24)/" .env
# APP_DIR=solution dans .env pour tester d'abord le corrigé ; le starter ne se construit qu'une fois les tests verts
docker compose up -d --build                     # http://127.0.0.1:3000/api/health
docker compose --profile https up -d --build     # + Caddy : https://localhost (autorité locale) ou votre DOMAINE
curl -sN https://localhost/api/chat -k -H "authorization: Bearer $(grep ^DEMO_TOKEN .env | cut -d= -f2)" \
     -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"#lent"}]}'
```

Sur un VPS : DNS A/AAAA du sous-domaine vers le serveur, pare-feu limité aux ports 22, 80 et 443, `DOMAINE=assistant.votre-domaine.fr` dans `.env`, retirez la ligne `ports` du service `app`. Déploiement continu, test de fumée (`version` = SHA du commit) et retour arrière : section 3.5 de la leçon (`IMAGE_TAG=${{ github.sha }}`). Sur Vercel : importez le dossier `solution/` (ou votre starter terminé), définissez les variables par environnement ; `maxDuration` est fixé à 60 s dans `api/chat/route.ts` (à vérifier selon l'offre).

## Mode réel

Renseignez `ANTHROPIC_API_KEY` (et éventuellement `LAB_MODE=reel`, `AI_MODEL=claude-haiku-5-5`). `FournisseurAnthropic` appelle la Messages API en streaming par `fetch`, version d'API `2026-10-21`, **sans** `temperature` (erreur 400, voir `_recherche/07-mise-a-jour-nov-2026.md`), avec le prompt système en cache. Vérifiez dans `docker compose logs app` que `cache_read_input_tokens` est non nul à partir de la deuxième question, et comparez le coût moyen à l'exigence ≤ 0,006 $ par réponse.

## Critères de réussite (repris de la leçon L105)

- L'URL de production répond en HTTPS ; `/api/health` renvoie `"statut":"ok"` et le SHA du commit déployé.
- Le premier mot d'une réponse s'affiche en moins de 2 secondes en production (et pas seulement en local).
- Une trace de production montre modèle, tokens (dont cache), coût, latence et `promptVersion` (journal JSON du squelette, puis Langfuse, L103).
- Une pull request qui dégrade le prompt est bloquée par la CI ; la suivante, corrigée, se déploie seule (L104).
- Le retour arrière et la restauration de sauvegarde ont été exécutés au moins une fois et chronométrés.
- `CHECKLIST-PRODUCTION.md` est cochée avec une preuve par ligne, aucune ligne ⛔ en échec ; grille de la section 5 de la leçon : 70/100.

## Mission documentation

1. **Next.js** — <https://nextjs.org/docs> : que produit `output: "standalone"`, et quels dossiers faut-il copier à côté de `server.js` (voir le `Dockerfile`) ?
2. **Caddy** — <https://caddyserver.com/docs> : que signifie une valeur négative pour `flush_interval` dans `reverse_proxy`, et pourquoi le `Caddyfile.exemple` exclut-il `/api/chat` de `encode` ?
3. **Streaming Claude** — <https://platform.claude.com/docs/en/build-with-claude/streaming> : dans quel ordre arrivent `message_start`, `content_block_delta`, `message_delta` et `message_stop`, et dans lequel lit-on le nombre de tokens de sortie ?

## Limites du mode simulé

Le fournisseur simulé vérifie la **plomberie** (authentification, bornes, quotas, streaming, erreurs, coûts), pas la qualité des réponses ni la latence réelle du fournisseur. La qualité se mesure avec promptfoo en CI (L104), la latence et le coût dans les traces de production (L103). L'audit de sécurité de cette application se pratique dans l'atelier de la leçon L110.
