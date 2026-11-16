# Corrections du code et du texte d'origine — Niveau 3 (L065 à L110)

> Intervention du 5 novembre 2026 · source : les « Propositions optionnelles » de `_test-lecteur-N3.md` · périmètre : `niveaux/N3-developpeur/` uniquement · aucune recherche web, rien de publié.

## Règles appliquées

- Correction **minimale** du défaut signalé, dans le code et la phrase d'origine. Aucun contenu pédagogique supprimé : seules des phrases ou des encadrés devenus faux après la correction ont été réécrits.
- Après chaque correction, mise à jour de l'encadré « 🛠️ Si ça ne marche pas » (et du « 🔍 ligne par ligne » quand il décrivait l'ancien code), pour ne pas laisser un avertissement devenu faux.
- Tout ce qui pouvait s'exécuter sans réseau a été exécuté dans `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/n3-fix/` : Python pur, Node 22, PostgreSQL 16 local avec pgvector, Starlette, Git, doublures (*stubs*) des SDK absents.
- Copie de sauvegarde des 70 fichiers N3 avant intervention : `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/n3-fix/backup-N3/`.

## Bilan

| Indicateur | Valeur |
|---|---|
| Propositions traitées | 17 propositions de leçon sur 17 (les 2 propositions « mise en forme » et « lexique » ne portent pas sur un défaut et restent ouvertes) |
| Fichiers modifiés | 19 leçons (L071 ajoutée, car elle répétait le défaut de L070) ; aucun `quiz.json`, `module.json`, `fiche.md` ni `niveau.md` touché |
| Blocs `quiz` / `mission` modifiés | 0 (vérifié par script : identiques à la sauvegarde) |
| Blocs Python modifiés | 17, tous analysés sans erreur (`ast.parse`) ; 6 exécutés |
| Blocs TypeScript des leçons modifiées | 20, syntaxe vérifiée (`stripTypeScriptTypes` + `node --check`) ; seul échec : `page.tsx` (JSX, non modifié) |
| Mots N3 (comptage `validate.mjs`, total formation) | 580 656 → 583 966 (+3 310) |
| `node scripts/validate.mjs \| tail -3` | `Leçons rédigées : 184/184 · mots : 583 966 · questions : 770 · URLs distinctes : 794` · `✅ Aucune erreur bloquante.` |

## Détail par proposition

### L097 — jours ouvrés faux
- **Défaut** : `(debut.toordinal() + i) % 7 not in (5, 6)` écarte le vendredi et compte le dimanche.
- **Correction** : `from datetime import date, timedelta` ; `(debut + timedelta(days=i)).weekday() < 5`, avec un commentaire sur les valeurs de `weekday()`. 🔍 réécrit ; 🛠️ réécrit : il présente l'ancienne formule comme une variante fausse, signale que les jours fériés ne sont pas gérés (renvoi au point 1 de l'exercice) et propose un `assert`.
- **Vérification** : 22-26/12/2026 (mardi → samedi) : ancienne formule 3, nouvelle 4. Comparaison sur 700 dates × 15 durées avec `isoweekday()` : 0 écart. `commun.py` extrait de la leçon et exécuté : `Congé enregistré : 4 jours ouvrés, nouveau solde 8`.

### L096 — graphe d'approbation LangGraph
- **Défauts** : (1) arête fixe `validation → outils`, même après un refus ; (2) montant corrigé en place (`appel["args"]["montant"] = …`), sans mise à jour d'état ; (3) nœud relancé depuis son début à la reprise, sans que le code le dise.
- **Correction** : `noeud_validation` renvoie `Command[Literal["agent", "outils"]]` et l'arête fixe est supprimée (un commentaire l'explique).
  - Refus → `ToolMessage` « REFUSÉ… », plus un `ToolMessage` « NON EXÉCUTÉ » pour chaque autre appel du même message (l'API exige un résultat pour chaque appel), puis `goto="agent"`.
  - Correction du montant → copie de l'appel (`{**appel, "args": {…}}`), puis `AIMessage(content=dernier.content, tool_calls=appels, id=dernier.id)`, que `add_messages` remplace grâce au même `id`, puis `goto="outils"`.
  - La relance depuis le début est maintenant écrite dans la docstring, dans le commentaire de `Command(resume=…)` et dans le 🔍.
- **Encadrés** : 🔍 complété (relance, `Command(goto)`, copie, même `id`, annotation) ; les deux 🛠️ devenus faux (arête inconditionnelle, montant modifié en place) sont remplacés par les erreurs que peut produire le nouveau code ; le 🛠️ sur la ré-exécution est conservé.
- **Vérification** : LangGraph n'est pas installé. La logique du nœud a été exécutée avec des doublures de `interrupt` / `Command` / messages : approbation avec 60 € → `outils`, même `id`, montant 60.0 ; approbation sans montant → 89.9 ; refus avec un appel parallèle → `agent`, 2 `ToolMessage` ; l'état d'origine n'est jamais modifié en place. Le schéma suit le patron « review tool calls » de la documentation LangGraph, **non revérifié** faute de web.

### L104 — condition `if:` toujours vraie sur une pull request
- **Défaut** : le dernier terme `|| github.event_name == 'pull_request'` rendait la condition vraie sur toute PR.
- **Correction** : dans `qualite-code`, `fetch-depth: 2` et une étape `changements` (`git diff --name-only HEAD^1 HEAD | grep -qE '^(prompts/|tests/|promptfooconfig\.yaml|src/app/api/chat/)'`). Elle écrit `prompts_modifies=true` dans `$GITHUB_OUTPUT`, valeur exposée par `outputs:`. La condition devient `… || needs.qualite-code.outputs.prompts_modifies == 'true'`. Ajout de `types: [opened, synchronize, reopened, labeled]`, faute de quoi poser l'étiquette `eval` ne relançait rien.
- **Encadrés** : la phrase du 🔍 qui signalait le défaut et conseillait `paths:` est réécrite : elle explique la condition et pourquoi un filtre `paths:` désactiverait tout le workflow. Nouveau cas 🛠️ : évaluation jamais lancée (`HEAD^1` absent, dossier non couvert par l'expression).
- **Vérification** : YAML analysé (PyYAML) ; expression testée sur 7 chemins ; dépôt Git simulé (commit de fusion `--no-ff`, base avancée entre-temps) : `git diff HEAD^1 HEAD` ne liste que le fichier de la PR.

### L108 — clés de contrôle des NIR d'exemple
- **Défaut** : clés `23` et `46` fausses (59 et 74 attendues, recalculées). `pii_fr.py` ne détectait aucun NIR.
- **Correction** : NIR fictifs à clé valide, commune inexistante à Paris (codes 101 à 120) : `1 85 05 75 123 456 73` et `2 90 11 75 654 321 84`. Clé = 97 − (13 chiffres mod 97). Un commentaire dans le code dit qu'ils sont fictifs.
- **Encadrés** : 🛠️ regex réécrit (recalcul de la clé, jamais de vrai NIR) ; 🛠️ Presidio réécrit (le contrôle de clé absent se montre avec une clé fausse, `… 321 00`). Le 🎮 Défi garde volontairement `1 85 05 75 116 001 23` : c'est un « numéro de commande » à clé fausse, donc le cas de faux positif attendu.
- **Vérification** : `pii_fr.py` extrait et exécuté : `[('EMAIL', …), ('TEL_FR', …), ('NIR', '1 85 05 75 123 456 73')]`. La clé `84` est acceptée, `00` est rejetée, le numéro du Défi est rejeté.

### L110 — `config.js` non servi (404)
- **Correction** : `from fastapi.staticfiles import StaticFiles` et `app.mount("/static", StaticFiles(directory="static"), name="static")`. La faille voulue (clé exposée) devient ainsi observable. Ligne ajoutée au 🔍.
- **Encadré** : le 🛠️ « 404 » devenu faux est remplacé par l'erreur réelle `RuntimeError: Directory 'static' does not exist`.
- **Vérification** : avec Starlette 1.7 (dont FastAPI réutilise `StaticFiles`), `GET /static/config.js` → 200, fichier absent → 404, dossier absent → `RuntimeError: Directory 'static' does not exist`.
- **Non modifié** : `max_tokens=32_000` sans streaming. C'est une faille listée volontairement (V09) et le 🛠️ existant donne déjà la parade (`Anthropic(timeout=…)`). Impossible à vérifier sans le SDK.

### L101 — installation incomplète
- **Corrections** :
  - `npm install pg jose`, plus `npm install -D @types/pg` (sans ces types, `next build` et le `tsc --noEmit` de L104 refusent l'import de `pg`).
  - `AUTH_SECRET=…` ajouté au `.env.local`.
  - Nouveau `db/init.sql` (table `clients` et 3 clients fictifs, SIREN `000000001`…) avec sa commande `psql` et une variante `docker exec`.
  - Nouvelle route de test `src/app/api/dev-login/route.ts` : active seulement en développement, elle pose le cookie `session` signé puis redirige vers `/`.
- **Encadrés** : phrase « il faudra aussi `npm install jose` » retirée du 🔍, car elle est désormais dans la commande ; 🛠️ « 401 » et « relation clients » réécrits ; 🛠️ JWT complété (cas 404 de `dev-login`).
- **Vérification** : SQL exécuté deux fois sur PostgreSQL 16 (idempotent) ; requête de `rechercherClient` testée (nom et SIREN). Syntaxe TypeScript vérifiée.

### L102 — installation incomplète
- **Corrections** :
  - `npm install pg-boss @ai-sdk/mistral`.
  - Suite de `db/init.sql` : `documents` (UUID, comme l'exige la route), `resumes` (`document_id` en clé primaire : verrou d'unicité n° 3), `appels_llm` et son index.
  - Commande `psql` et nouveau 🔍.
  - En-tête du worker : `npx tsx --env-file=.env.local worker.ts`.
- **Encadrés** : 🔍 du worker complété ; 🛠️ `DATABASE_URL`, tables manquantes et `@ai-sdk/mistral` réécrits (`MISTRAL_API_KEY` dans `.env.local`, `cache_semantique` à exécuter). Une référence de section est corrigée dans mon ajout : quotas = section 3.2.
- **Vérification** : sur PostgreSQL 16, les trois tables sont créées, puis les requêtes SQL de la leçon sont rejouées : `SELECT 1 FROM resumes`, `INSERT resumes`, `INSERT appels_llm` et la requête de `verifierQuotas` (`mois_usd 0.000200`, `user_tokens 1200`). Un second résumé du même document est refusé (`duplicate key`).

### L103 — installation, port, `conversationId`, `/api/chat-sync`
- **Corrections** :
  - `@langfuse/client` ajouté à la ligne d'installation, et bloc `.env.local` des trois variables `LANGFUSE_*`.
  - Langfuse publié sur le port 3001 (`"3001:3000"`, `NEXTAUTH_URL=http://localhost:3001`), valeur par défaut de `baseUrl` alignée.
  - `const conversationId = typeof body?.id === "string" ? body.id : undefined;`, lu dans le corps envoyé par `useChat`.
  - Nouvelle route `src/app/api/chat-sync/route.ts` : elle **rejoue** le `POST` de L101 (mêmes contrôles, outils et prompt), puis recolle les événements `text-delta` du flux.
- **Encadrés** : 🔍 complétés (port, `conversationId`, chat-sync) ; 🛠️ conflit de port, `ReferenceError`, 404 chat-sync et parenthèse « absent de la ligne d'installation » réécrits.
- **Vérification** : syntaxe TypeScript vérifiée. Avec une doublure de `/api/chat` qui émet un flux au format du Vercel AI SDK 5 (outils puis texte, `[DONE]`) : réponse 200 `{"reponse": "La CA3 est due le 24 novembre."}`, 401 transmis tel quel, 400 sur un corps invalide.
- **Hypothèses non revérifiables sans web** : noms exacts dans le `docker-compose.yml` de Langfuse (le texte dit de chercher `3000`) ; noms d'événement `text-delta` / `delta` (un 🛠️ indique comment les adapter).

### L068 et L078 — `.env` jamais chargé
- **L068** : `python-dotenv` et `dotenv` ajoutés aux installations. `from dotenv import load_dotenv` + `load_dotenv()` en tête des 5 scripts Python ; `import "dotenv/config";` en tête des 3 scripts TypeScript. Paragraphe « chargez-la avec… » complété (une variable déjà exportée n'est pas écrasée) ; 🔍 réécrit ; 🛠️ réécrit (où le fichier est cherché, `.env.txt`, `ModuleNotFoundError`).
- **L078** : `dotenv` ajouté à `npm install` (`python-dotenv` y était déjà). Chargement ajouté aux scripts complets (`premier_appel.py`, `multi_tours.py`, `premier_appel.ts`, `streaming.ts`) ; l'extrait « ancien format » et `cout.py` (sans appel API) sont laissés tels quels. 🔍 et 🛠️ 401 réécrits.
- **Vérification** : `python-dotenv` 1.2.3 lancé depuis un autre dossier que celui du script : `.env` est trouvé à côté du script, et une variable déjà exportée n'est pas écrasée.

### L070 (et L071) — `tool_choice` forcé
- **L070** : « Piège fréquent » aligné sur `_recherche/07` P2-bis : erreur 400 sur Opus 5.5 et Sonnet 5.5, accepté sur Haiku 5.5 sans bloc de réflexion. La source « page Pricing » est remplacée par les guides de migration. Réponse 3 de l'auto-évaluation corrigée : la question, qui porte sur Sonnet, garde « une erreur 400 », mais sans la généralisation « les modèles 5.5 ». Le 🛠️ ajouté par le relecteur était déjà juste : inchangé.
- **L071** : la ligne du tableau « `tool_choice` forcé → erreur » est précisée de la même façon.
- **Quiz** : aucun bloc `quiz` de L070 ne porte sur `tool_choice` ; le quiz de L071 et `quiz.json` de M17 étaient déjà justes, ils sont inchangés.

### L089, L090, L093 — incohérences entre leçons
- **L089 (dimensions)** : `dimensions=1024` côté Python (branche OpenAI) et `dimensions: 1024` côté TypeScript, en face de `VECTOR(1024)`. Le 🔍 TypeScript est réécrit : même dimension **et** même modèle qu'à l'indexation (`EMB_PROVIDER=openai`). Le commentaire du schéma `documents.source` passe à `'rh/notes-de-frais-v3.pdf'`.
- **L090 (source)** : `documents.source` valait le chemin relatif alors que `metadata.source` valait le nom de fichier. Le pipeline écrit désormais la même valeur dans les deux. Le texte de la section 4 et le 🔍 sont mis à jour.
- **L093** : l'exemple JSONL passe à `rh/notes-de-frais-v3.pdf#2`, et une phrase explique le format `source#page`, identique à celui de `generer` et de `cle`. Le 🛠️ « métriques à 0 » est réécrit et signale aussi les clés `#None` (DOCX, HTML).
- **Vérification** : syntaxe Python vérifiée (blocs modifiés). Le paramètre `dimensions` des modèles `text-embedding-3-*` vient de la documentation OpenAI connue ; il n'a pas été revérifié.

### Autres propositions traitées
- **L069** : `Path` est désormais utilisé. `FICHIER_PROMPT = Path("prompts/compta-assist.txt")` remplace le texte si le fichier existe, sinon le texte intégré sert de repli ; 🔍 réécrit.
- **L084** : `sentiment: Literal["positif", "neutre", "negatif"]` (`from typing import Literal`) ; 🔍 réécrit. Vérifié avec Pydantic 2.13 : le schéma contient bien un `enum` et `"Positif"` est refusé.
- **L088** : au démarrage, `si_cle(variable, creer)` retire de sa chaîne un fournisseur sans clé et journalise un avertissement. 🔍 Bloc 4 complété ; 🛠️ `KeyError` réécrit et nouveau cas « chaîne vide ». Exécuté sans aucune clé (plus de `KeyError`, `RuntimeError` explicite), puis avec la seule clé Anthropic et un SDK simulé : 4 avertissements et réponses des deux paliers par Anthropic.
- **L109** :
  - (1) Le hook teste `command -v gitleaks` et, s'il manque, refuse le commit avec un message explicite (refus maintenu par sécurité). Vérifié en bash sans gitleaks : message juste, code de sortie 1.
  - (2) L'exercice demande un faux secret au format complet de la règle `anthropic-api-key` (`sk-ant-api03-` + 93 caractères + `AA`) et fournit une ligne Python qui le génère (vérifiée : 108 caractères, conforme au motif). Le motif de la règle vient de la configuration gitleaks connue, non revérifiée : le texte invite à le comparer avec la version installée.
  - 🔍 et 🛠️ mis à jour.

## Points non traités ou à vérifier

- **Propositions « mise en forme » (`<details>`) et « lexique » (glossaire)** : ce ne sont pas des défauts de code. Elles restent ouvertes.
- **`export/` non régénéré** : `export/formation-ia-complete.md` et `export/elearning-modules.json` contiennent encore l'ancien texte (anciens NIR, etc.). `node scripts/build.mjs` n'a pas été lancé, faute de demande.
- **Écart de méthode** : pour savoir si LangGraph était disponible, j'ai lancé par erreur une commande `pip download`. Elle a téléchargé une roue `langgraph` depuis PyPI. Je l'ai supprimée aussitôt, sans l'installer ni l'utiliser. Aucun autre accès réseau.

Proposition optionnelle : régénérer les exports avec `node scripts/build.mjs`.

Proposition optionnelle : **L110**, les deux NIR de la table `salaries` (`… 123 456 78`, `… 654 321 09`) ont aussi une clé fausse (53 et 06 attendues). C'est sans effet sur l'atelier tant qu'on ne leur applique pas `pii_fr.py` de L108.

Proposition optionnelle : **L110**, dans le 🔍, « base vectorielle locale (L088) » devrait renvoyer à **L089**.

Proposition optionnelle : **L089**, la branche Gemini (`gemini-embedding-001`, 3 072 dimensions par défaut) ne correspond pas non plus à `VECTOR(1024)` : ajouter `"output_dimensionality": 1024` dans `config`, après vérification dans la documentation.

Proposition optionnelle : **`_test-lecteur-N3.md`**, ligne 60, un saut de ligne manque avant « Proposition optionnelle : **mise en forme** » (les deux propositions sont collées).
