# Test lecteur débutant — Niveau 3 (L065 à L110)

> Relecture du 5 novembre 2026 · lecteur simulé : développeur junior sorti d'une formation web de 6 mois (bases de Python et de JavaScript, un peu de Git), qui n'a jamais appelé d'API d'IA et ne connaît ni l'asynchrone ni Docker au-delà des bases · objectif client : formation « simplifiée et vulgarisée au maximum ».

## Méthode et règles appliquées

- Chaque leçon a été lue en entier (hors en-tête YAML et blocs `quiz` / `mission`), dans la peau de ce lecteur, en relevant : concepts supposés connus, code donné sans explication, erreurs probables à l'exécution, sauts logiques.
- Corrections **strictement additives**, à la première apparition dans la leçon :
  - concept supposé connu → explication entre parenthèses juste après le terme, ou encadré `> 🧭 **Pré-requis express** — …` (5 à 8 lignes) quand une parenthèse ne suffit pas ;
  - code clé → encadré `> 🔍 **Ce que fait ce code, ligne par ligne** — …`, juste après le bloc ;
  - erreurs fréquentes → encadré `> 🛠️ **Si ça ne marche pas** — …` (3 à 5 cas, au format symptôme → cause → solution) ;
  - en fin de leçon → encadré `> ✅ **Si vous ne retenez que 3 choses** — 1. … 2. … 3. …`, juste avant « 📚 Pour aller plus loin ». Il manquait dans les 46 leçons ; l'encadré « Si vous ne retenez qu'une chose » de L065 a été conservé tel quel.
- Les faits ajoutés suivent `_recherche/07-mise-a-jour-nov-2026.md`, notamment : 400 sur `temperature` / `top_p` / `top_k` avec la version d'API `2026-10-21` (SDK v2) ; `tool_choice` forcé refusé sur Opus et Sonnet 5.5 mais accepté sur Haiku 5.5 sans réflexion ; MCP 2026-07-28 sans état ; OWASP LLM 2026 (LLM08 = Hidden Context Exposure) et ASI01-ASI10 (édition 2026) ; Perplexity `https://api.perplexity.ai/v1` avec `effort` à la racine (`extra_body` dans le SDK OpenAI) ; tokens de réflexion Gemini facturés au tarif de sortie ; citations refusées (400) dans un message user.
- Insertions faites par script à partir d'une copie de sauvegarde des originaux. Chaque insertion est refusée si elle tombe dans le YAML ou dans un bloc de code. Un second script a vérifié les 70 fichiers du dossier N3 : fichiers hors leçons (`module.json`, `quiz.json`, `fiche.md`, `niveau.md`) identiques ; dans chaque leçon, YAML, blocs de code et blocs `quiz` / `mission` identiques, et texte d'origine retrouvé **intact et dans l'ordre**. Résultat : **0 écart**.
- Aucun fichier en dehors de `niveaux/N3-developpeur/` n'a été modifié, à part ce rapport. Pas de recherche web.

## Bilan chiffré

| Indicateur | Valeur |
|---|---|
| Leçons relues et enrichies | 46 / 46 |
| Encadrés « Ce que fait ce code, ligne par ligne » | 208 |
| Encadrés « Si ça ne marche pas » | 93 |
| Encadrés « Pré-requis express » | 36 (en plus des 46 « 🧭 En clair » déjà présents, conservés) |
| Parenthèses explicatives ajoutées | 10 (dans le texte, les concepts ont surtout été expliqués dans les encadrés) |
| Encadrés « Si vous ne retenez que 3 choses » | 46 (un par leçon) |
| Mots des 46 leçons N3 (comptage de `validate.mjs`) | 102 852 → 150 726 (+47 874, soit +46,5 %) |
| Vérification d'intégrité (70 fichiers) | 0 écart |
| `node scripts/validate.mjs` | ✅ Aucune erreur bloquante |

## Constats transverses (ce qui bloque notre développeur junior)

1. **Le code est dense et rarement commenté.** Presque tous les blocs supposent du Python ou du TypeScript intermédiaire : `async` / `await` et `asyncio`, décorateurs, compréhensions de liste, `**kwargs`, `@dataclass`, types TypeScript (`Record`, `as const`, `??`), Pydantic et Zod utilisés avant d'être présentés. D'où les 208 « ligne par ligne », qui expliquent la mécanique sans réécrire le code.
2. **Ce qui casse à l'exécution n'est presque jamais anticipé** : `.env` jamais chargé (L068, L078), module ou paquet absent de la commande d'installation (L071, L101-L103), port déjà occupé, serveur local (Ollama, Langfuse, l'application testée) non démarré, 422 de FastAPI sans `Content-Type`, 400 sur `temperature` avec les SDK v2, fichiers d'entrée à fournir soi-même et identifiants fictifs (`file_0123`, `exemple.fr`). Chaque 🛠️ part du message d'erreur exact que le junior verra.
3. **Le module M22 (L101 à L103) cumule les étapes manquantes** : paquets absents de l'installation, variable `AUTH_SECRET` absente, aucune page de connexion, tables jamais créées, route `/api/chat-sync` appelée mais pas écrite, conflit de port 3000. Ce sont les leçons où un junior seul a le plus de chances d'abandonner. Les ajouts disent quoi faire, mais certaines corrections demandent de modifier le code d'origine (voir les propositions).
4. **Le vocabulaire réseau, Git et sécurité est supposé** : codes HTTP (401, 402, 413, 422, 429, 503), streaming SSE, webhooks, CI/CD, hooks Git, expressions régulières, JSON Schema, embeddings, RGPD. Les 36 « Pré-requis express » ciblent ces notions, à leur première apparition dans la leçon.
5. **Certains exercices coûtent de l'argent sans le dire** : boucles d'agent sans plafond, tests répétés sur Opus (L107, L110), évaluations en CI (L104). Les 🛠️ rappellent de fixer une limite de dépense sur la clé de test, ou de passer à Haiku.
6. **Le volume augmente nettement (+46,5 %)**, bien plus qu'en N1 (+13 %), parce que le code se commente ligne à ligne. Les encadrés sont faciles à repérer et à sauter pour un lecteur à l'aise, mais l'allongement est réel.

## Points relevés mais non traités (hors périmètre additif)

Ces points demandent de modifier du code ou des phrases existantes ; ils n'ont donc pas été touchés. Quand c'était possible, un 🛠️ prévient l'apprenant.

- Proposition optionnelle : **L068** — les exemples n'appellent jamais `load_dotenv()` alors que le texte recommande un fichier `.env` : ajouter deux lignes (`from dotenv import load_dotenv` / `load_dotenv()`) en tête des scripts.
- Proposition optionnelle : **L069** — `Path` est importé mais inutilisé alors que le commentaire annonce un prompt lu depuis un fichier versionné : soit lire le fichier avec `Path(...).read_text()`, soit retirer l'import.
- Proposition optionnelle : **L070** — le texte et le quiz disent « `tool_choice` forcé = erreur sur les modèles 5.5 » ; selon `_recherche/07` (P2-bis), Haiku 5.5 l'accepte, sans bloc de réflexion. La nuance figure dans un 🛠️ ajouté, mais la phrase d'origine et le quiz restent à corriger (correction C7 de 07).
- Proposition optionnelle : **L078** — même absence de `load_dotenv()` qu'en L068.
- Proposition optionnelle : **L084** — `sentiment: str` dans le schéma Pydantic n'impose aucune valeur : un `Literal["positif", "neutre", "négatif"]` rendrait la sortie réellement contrainte.
- Proposition optionnelle : **L088** — le script de repli plante si **une seule** des clés de fournisseur manque, alors que son but est justement de survivre à l'absence d'un fournisseur : tester la présence de chaque clé avant de construire la liste.
- Proposition optionnelle : **L089** — la version TypeScript produit des embeddings OpenAI dont la dimension ne correspond pas à la colonne `VECTOR(1024)` créée plus haut : préciser `dimensions: 1024` ou adapter la colonne.
- Proposition optionnelle : **L093** — le format de source attendu par l'évaluation (`source#page`) diffère de celui que L090 stocke dans les métadonnées : aligner les deux leçons, sinon les métriques de rappel tombent à zéro.
- Proposition optionnelle : **L096** — trois défauts dans le graphe d'approbation : après un refus, l'arête `validation → outils` reste inconditionnelle ; la correction du montant modifie l'état en place sans le renvoyer (LangGraph ne la voit pas) ; à la reprise après `interrupt`, le nœud repart de son début (à signaler, sinon l'apprenant croit à un bogue).
- Proposition optionnelle : **L097** — dans `commun.py`, le test `toordinal() % 7 not in (5, 6)` écarte le vendredi et compte le dimanche (3 jours ouvrés trouvés au lieu de 4, vérifié par script) : remplacer par `.weekday() < 5`.
- Proposition optionnelle : **L101** — `jose` n'est pas dans la commande d'installation, aucune page de connexion n'est fournie (toutes les requêtes reçoivent 401) et `AUTH_SECRET` n'apparaît pas dans `.env.local` : ajouter les trois.
- Proposition optionnelle : **L102** — le worker ne lit pas `.env.local`, les tables ne sont jamais créées (aucun script SQL) et `@ai-sdk/mistral` est utilisé sans être installé.
- Proposition optionnelle : **L103** — `@langfuse/client` manque à l'installation, Langfuse auto-hébergé et Next.js se disputent le port 3000, `conversationId` n'est défini nulle part et la route `/api/chat-sync` appelée par promptfoo n'existe pas.
- Proposition optionnelle : **L104** — la condition `if:` du job d'évaluation est toujours vraie sur une pull request : l'évaluation payante tourne même quand aucun prompt n'a changé.
- Proposition optionnelle : **L108** — les deux NIR d'exemple (`1 85 05 75 116 001 23`, `2 90 11 75 108 221 46`) ont une clé invalide (59 et 74 attendus, vérifié par calcul) : `pii_fr.py` n'en détecte donc aucun et la démonstration paraît cassée. Corriger les clés, ou l'annoncer dans le texte ; le 🛠️ ajouté l'explique.
- Proposition optionnelle : **L109** — (1) sans `gitleaks` installé, le hook bloque **tous** les commits avec le message « secret détecté », ce qui égare le débutant : tester `command -v gitleaks` dans le hook ; (2) dans l'exercice, un faux secret `sk-ant-` + 30 caractères risque de ne pas être reconnu par les règles de gitleaks, qui visent le format complet des clés Anthropic (à vérifier avec la version installée).
- Proposition optionnelle : **L110** — `paieassist.py` ne monte aucun dossier statique : `GET /static/config.js` renvoie 404 et la vérification manuelle de la clé est impossible en l'état ; ajouter `app.mount("/static", StaticFiles(directory="static"))`. Par ailleurs, `max_tokens=32_000` sans streaming peut être refusé par certaines versions du SDK Python : à vérifier avant l'atelier.- Proposition optionnelle : **mise en forme** — pour limiter l'effet de longueur, les encadrés 🔍 et 🛠️ pourraient être repliés par défaut (`<details>`), si le moteur de rendu de la plateforme le permet.
- Proposition optionnelle : **lexique** — reporter dans `glossaire/glossaire.json` les notions expliquées dans les « Pré-requis express » qui n'y figurent pas encore (SSE, webhook, hook Git, JSON Schema, base64, MIME, NIR, pseudonymisation, seau à jetons, P × I…).

---

# Détail par leçon : points bloquants → ajouts faits

## M16 — Fondations de développement pour l'IA

### L065 — Python et TypeScript pour l'IA : environnement, SDK, clés API, secrets
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Commandes bash/npm non détaillées (curl \| sh, uv add, source activate, --save-dev, tsc --init) ; « variable d'environnement » jamais définie ; Pydantic cité sans explication ; async/await dans le code TS ; erreurs courantes non anticipées (module introuvable, .env mal placé, 401/400 temperature/404/402, "type": "module") |
| Ajouts faits | 3 🔍 commandes + 🔍 Python + 🔍 OpenAI/xAI ; 🧭 variables d'environnement ; 🧭 async/await + 🔍 TS ; 2 🛠️ (Python, TypeScript) ; parenthèse Pydantic ; ✅ 3 choses |
| Compte | 1 parenthèse(s) · 2 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |

### L066 — HTTP, JSON, streaming : anatomie d'un appel à un LLM
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Syntaxe curl/shell (\, $VAR, '\'') non expliquée ; « webhook » ; try/except, **params, raise, if __name__ ; with … as, flush ; fonctions fléchées et .on() ; asyncio (coroutine, gather, Semaphore) supposé connu ; erreurs curl sous Windows/PowerShell, asyncio.run dans Jupyter, coroutine non attendue |
| Ajouts faits | 8 🔍 (curl, curl streaming, retries, retry maison, stream haut/bas niveau, TS, OpenAI, parallèle) ; 🧭 asyncio ; 2 🛠️ (curl, async/stream) ; 2 parenthèses (webhook, for await) ; ✅ |
| Compte | 2 parenthèse(s) · 1 🧭 · 9 🔍 · 2 🛠️ · 1 ✅ |

### L067 — Tokens, coûts, rate limits, caching : maîtriser la facture
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | @dataclass, annotations, **kw, f-strings formatées, compréhension de liste, classes / self / verrou (threading.Lock) supposés connus ; with_raw_response non expliqué ; échecs de cache (seuil, préfixe instable, relance < 5 min), import local calcul_cout, lot batch long, limites propres à count_tokens |
| Ajouts faits | 6 🔍 (count_tokens, calculateur, en-têtes, caching, batch, garde-fou) ; 2 🧭 (dataclass/annotations, classes/verrou) ; 2 🛠️ (cache, budget/batch) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |

## M17 — API Anthropic : construire avec Claude

### L068 — Messages API : requêtes, rôles, paramètres, modèles
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Les exemples ne chargent pas `.env` alors que le texte le recommande (échec garanti chez un débutant) ; try/except et ordre des except non expliqués ; while True/input, compréhension « join », readline/promises, filter/map, template literals ; doublons dans l'historique après une erreur ; question vide |
| Ajouts faits | 7 🔍 (installation, premier appel, test temperature, chat Python, chat TS, streaming, erreurs) ; 2 🛠️ (lancement, chat) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 7 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | les exemples n'appellent jamais `load_dotenv()` alors que le texte recommande un fichier `.env` : ajouter deux lignes (`from dotenv import load_dotenv` / `load_dotenv()`) en tête des scripts. |

### L069 — System prompts et prompt engineering avancé (guide officiel Anthropic)
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `Path` importé mais inutilisé alors que le commentaire annonce un fichier versionné ; chemins relatifs (ENOENT), encodage ; glob/enumerate/f-strings imbriquées non expliqués ; cast `as any` et compatibilité des modèles pour le message système en cours de conversation |
| Ajouts faits | 4 🔍 (prompt Python, prompt TS, long contexte, message système) ; 2 🛠️ (fichier prompt, long contexte) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | `Path` est importé mais inutilisé alors que le commentaire annonce un prompt lu depuis un fichier versionné : soit lire le fichier avec `Path(...).read_text()`, soit retirer l'import. |

### L070 — Tool use : donner des outils à Claude
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | JSON Schema (type, properties, required, enum) supposé connu ; dictionnaire de fonctions + **args ; types TS (Record, ??, as, déstructuration, .then) ; Pydantic/Zod cités sans définition ; erreurs : import outils, tool_result manquant, tool_choice forcé ; outil web_search éventuellement non activé dans l'organisation |
| Ajouts faits | 🧭 JSON Schema ; 4 🔍 (définitions, boucle Python, boucle TS, web_search) ; 🛠️ (5 cas, dont la nuance Haiku 5.5 sur tool_choice) ; parenthèse Pydantic/Zod ; ✅ |
| Compte | 1 parenthèse(s) · 1 🧭 · 4 🔍 · 1 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | le texte et le quiz disent « `tool_choice` forcé = erreur sur les modèles 5.5 » ; selon `_recherche/07` (P2-bis), Haiku 5.5 l'accepte, sans bloc de réflexion. La nuance figure dans un 🛠️ ajouté, mais la phrase d'origine et le quiz restent à corriger (correction C7 de 07). |

### L071 — Sorties structurées et JSON fiable
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Pydantic et Zod utilisés sans présentation ; `items`, `additionalProperties`, `False`/`false`, `as const`, `assert`, `?.` non expliqués ; installation de zod absente ; erreurs : JSONDecodeError sur réponse coupée, attribut parse/parsed_output selon version, mot-clé de schéma refusé, ValidationError |
| Ajouts faits | 🧭 Pydantic/Zod ; 4 🔍 (forme brute Python, TS, Pydantic, Zod) ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 4 🔍 · 1 🛠️ · 1 ✅ |

### L072 — Vision, PDF, Files API et citations
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | base64 et type MIME supposés connus ; `"rb"`, `toFile`, raccourci d'objet JS ; identifiants fictifs (`exemple.fr`, `file_0123`) qui provoquent des erreurs ; formats refusés (HEIC, PDF chiffré), URL non publique, file_id expiré ; citations recopiées dans un message user (400 depuis 2026-10-21) |
| Ajouts faits | 🧭 base64/MIME ; 7 🔍 (vision Python, vision TS, PDF, Files Python, Files TS, citations Python, citations TS, count) ; 3 🛠️ (vision, Files, citations) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 8 🔍 · 3 🛠️ · 1 ✅ |

### L073 — Prompt caching, Batch API, extended thinking
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `system` sous forme de liste de blocs, position du `cache_control`, fonction anonyme `(async () => …)()`, `setTimeout` en promesse, `for await`, codes couleur ANSI non expliqués ; fichiers d'entrée (mémento, avis JSON) à fournir soi-même ; pièges : `content[0]` qui n'est pas du texte, lot refusé en bloc, réflexion qui mange `max_tokens`, `budget_tokens` refusé |
| Ajouts faits | 6 🔍 (cache Python/TS, batch Python/TS, thinking Python/TS) ; 3 🛠️ (cache, batch, thinking) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 6 🔍 · 3 🛠️ · 1 ✅ |

### L074 — Claude Code et Claude Agent SDK en pratique
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | stdin/stderr/code de sortie, expressions régulières, redirections shell (`>`, `<`, `$( )`, `2>/dev/null \|\| true`) supposés connus ; CI/CD et secrets GitHub Actions jamais définis ; options de l'Agent SDK, `async for`, `getattr`, nommage `mcp__serveur__outil` ; pièges : hook non chargé, `python3` absent sous Windows, Node manquant pour le SDK, dossier de travail vide |
| Ajouts faits | 2 🧭 (stdin/stderr/codes de sortie, CI/CD) ; 6 🔍 (installation, settings hooks, hook Python, headless, agent Python, agent TS) ; 2 🛠️ (hooks, Agent SDK) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |

### L075 — MCP : construire un serveur et un client
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Décorateurs Python, docstrings devenant descriptions, JSONL, spread, `toFixed`, top-level await non expliqués ; `--` de `claude mcp add` ; pièges non anticipés : `print()` dans un serveur stdio, Inspector qui exige Node, port occupé, chemin relatif / mauvais Python dans Claude Code, jeton absent, serveur localhost inaccessible au connector ; `session.initialize()` face à la révision 2026-07-28 sans état |
| Ajouts faits | 🧭 décorateurs ; 7 🔍 (serveur Python, serveur TS, client, hôte minimal, `claude mcp add`, connector) ; 3 🛠️ (serveur/Inspector, Claude Code, connector) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 6 🔍 · 3 🛠️ · 1 ✅ |

### L076 — Skills, bonnes pratiques et évaluation des prompts
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Embeddings, similarité cosinus, SBERT, ROUGE-L, Likert cités avant leur leçon (L089) ; fichiers et dossiers d'entrée non fournis ; parsing fragile de la note du juge (`int(text[0])`) ; `Promise.all` par paquets, `reduce`, spread ; 429 dus au double appel par cas |
| Ajouts faits | 🧭 vocabulaire des notateurs ; 3 🔍 (SKILL.md, evals Python, evals TS) ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 3 🔍 · 1 🛠️ · 1 ✅ |

### L077 — Projet : assistant métier avec Claude
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Compréhension de dictionnaire, `for … else`, `str \| None`, `[-1]`, `setdefault`, `**kwargs`, `Object.fromEntries`, ternaires enchaînés ; ordre d'exécution des étapes (étape 1 indispensable) ; fichiers supplémentaires exigés par la version TS ; script « bloqué » sur la confirmation humaine |
| Ajouts faits | 🧭 tournures Python ; 3 🔍 (étape 1, orchestrateur, TS) ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 3 🔍 · 1 🛠️ · 1 ✅ |

## M18 — API OpenAI

### L078 — Responses API et Chat Completions
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `python-dotenv` installé mais jamais chargé ; erreur 429 `insufficient_quota` (compte sans crédit) confondue avec une limite de débit ; tuple et déballage, `getattr` imbriqués, fausses classes de test non expliqués ; `instructions` non reprises par `previous_response_id` ; `store=False` incompatible avec le chaînage |
| Ajouts faits | 6 🔍 (installation, premier appel, Chat Completions, coût, multi-tours, streaming) ; 2 🛠️ (premier appel, multi-tours/streaming) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | même absence de `load_dotenv()` qu'en L068. |

### L079 — Function calling et structured outputs
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `input` sous forme de liste d'items, `+=` sur une liste, arguments reçus en texte JSON, `call_id`, types TypeScript (`type`, `?`, `as`) ; `parameters` vs `input_schema` (L070) ; erreurs fréquentes : sortie d'appel manquante (appels parallèles), `json.loads` oublié, schéma strict incomplet, `output_parsed` vide, zod absent |
| Ajouts faits | 5 🔍 (déclaration, boucle Python, boucle TS, Pydantic, Zod) ; 2 🛠️ (boucle, sorties structurées) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 5 🔍 · 2 🛠️ · 1 ✅ |

### L080 — Embeddings, images, audio et Realtime
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Vecteur, dimension, produit scalaire / norme supposés connus ; `zip`, tri de couples, `reduce`, data URL, `Buffer`, `arrayBuffer` ; WebRTC / WebSocket et `httpx` / `raise_for_status` non présentés ; IDs de modèles par défaut incertains ou dépréciés (404 probables), scores cosinus tous proches, vérification d'organisation pour la génération d'images, limites de fichiers audio |
| Ajouts faits | 2 🧭 (vecteur/cosinus, WebRTC/WebSocket/HTTP) ; 8 🔍 (embeddings Python/TS, vision, génération, transcription, synthèse, clé éphémère) ; 2 🛠️ (embeddings, génération d'image) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 7 🔍 · 2 🛠️ · 1 ✅ |

### L081 — OpenAI Agents SDK
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Nom d'import `agents` ≠ nom du paquet `openai-agents` ; décorateur `@function_tool` et section `Args:` de la docstring ; `handoff_description`, `last_agent`, `final_output_as`, guardrail qui se manifeste par une exception ; pièges : fichier local `agents.py` qui masque la bibliothèque, `MaxTurnsExceeded`, avertissement de traces |
| Ajouts faits | 5 🔍 (agent Python, agent TS, handoffs, guardrail) ; 🛠️ (4 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 1 🛠️ · 1 ✅ |

### L082 — Fine-tuning et Evals via l'API
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Gabarits `{{ item.… }}` / `{{ sample.… }}` non expliqués (et confusion possible avec les f-strings) ; format JSONL supposé connu ; `f"{i:05d}"`, `next(...)` sur générateur imbriqué, `model_dump` ; pièges : JSONL invalide, `url` ≠ `endpoint`, `output_file_id` vide, `StopIteration`, champ de gabarit mal nommé, `eq` sensible à la casse |
| Ajouts faits | 2 🧭 (gabarits, JSONL) ; 4 🔍 (éval Python, juge TS, batch, modération) ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 4 🔍 · 1 🛠️ · 1 ✅ |

### L083 — Projet : le même assistant, porté sur OpenAI
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `all(...)`, `**a`, `lambda`, compréhensions de dictionnaire, spread TS (`push(...)`, `[...historique]`) ; format d'outil « neutre » et rôle de l'adaptateur ; pièges : import `devis_core`, flux interrompu (réponse finale `None` en Python, non vérifiée contrairement à la version TS), `AssertionError` sur le total, écart de comportement entre fournisseurs |
| Ajouts faits | 3 🔍 (cœur métier, adaptateur Python, adaptateur TS) ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 3 🔍 · 1 🛠️ · 1 ✅ |

## M19 — xAI Grok, Perplexity, Mistral, Gemini et multi-fournisseur

### L084 — xAI Grok API : compatibilité SDK, live search, vision
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Rôle de `api_key` explicite (sinon le SDK prend la clé OpenAI) ; `os.environ[...]` vs `.get` ; camelCase TS (`apiKey`, `baseURL`) vs snake_case Python, option mal orthographiée ignorée ; SDK natif (`append`, `sample`) ; `sentiment: str` qui n'impose rien malgré le commentaire ; pièges de coût `x_search` |
| Ajouts faits | 6 🔍 (appel Python, TS, xai-sdk, outils serveur, sortie structurée, vision) ; 2 🛠️ (premier appel, recherche) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | `sentiment: str` dans le schéma Pydantic n'impose aucune valeur : un `Literal["positif", "neutre", "négatif"]` rendrait la sortie réellement contrainte. |

### L085 — Perplexity Sonar API : recherche avec citations
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Requête HTTP sans SDK (`httpx`, en-tête `Authorization`, `raise_for_status`) ; préfixe fournisseur des modèles ; boucles imbriquées sur les annotations ; expression régulière `re.sub` + `lambda` non expliquée ; pièges : forme `reasoning` non confirmée (solution `extra_body`), `max_output_tokens` exigé par les modèles anthropic/, préfixe oublié, filtres trop étroits |
| Ajouts faits | 5 🔍 (Search API, Agent API, streaming TS, regex) ; 2 🛠️ (Search, Agent API) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |

### L086 — Mistral AI : La Plateforme, Codestral, modèles ouverts
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Accès `event.data.choices[0].delta.content` et `if delta`, `?? ""` qui retarde l'erreur, camelCase `responseFormat`, chaînage optionnel `?.[0]?.` ; FIM (`prompt` / `suffix`) et triples apostrophes ; `json_object` ≠ schéma ; erreurs : 401 clé vide, 429 offre gratuite, `JSON.parse` sur réponse non JSON, version de modèle retirée |
| Ajouts faits | 3 🔍 (streaming Python, JSON TS, FIM) ; 🛠️ (4 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 3 🔍 · 1 🛠️ · 1 ✅ |

### L087 — Google Gemini API
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Organisation du SDK Google (`config` qui contient aussi le rôle), camelCase TS, opérateur `!`, `Type.OBJECT` ; références de fichiers mêlées au texte ; pièges : conflit avec l'ancien SDK, clé d'un autre service Google, quota free tier (`RESOURCE_EXHAUSTED`), données du free tier, fichiers vidéo pas encore prêts, taille minimale du cache, suppression du cache hors `finally` |
| Ajouts faits | 6 🔍 (streaming Python, TS + coût, multimodal, cache, grounding, JSON) ; 3 🛠️ (SDK/clé, fichiers, cache) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 6 🔍 · 3 🛠️ · 1 ✅ |

### L088 — Architecture multi-fournisseur : abstraction, routeurs (OpenRouter, LiteLLM), repli
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `typing.Protocol`, empreinte SHA-256, moyenne mobile, boucles retry/fallback imbriquées, `??=`, `Map`, top-level await ; le script plante au démarrage si une seule des cinq clés manque ; `@ai-sdk/google` lit `GOOGLE_GENERATIVE_AI_API_KEY` et non `GEMINI_API_KEY` ; le juge `llm-rubric` de promptfoo exige sa propre clé ; `is_retryable` fragile ; `_hidden_params` interne |
| Ajouts faits | 🧭 Protocol/dataclass ; 6 🔍 (installation, passerelle Python, LiteLLM, OpenRouter, Vercel AI SDK, promptfoo) ; 2 🛠️ (passerelle Python, Vercel AI SDK) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | le script de repli plante si **une seule** des clés de fournisseur manque, alors que son but est justement de survivre à l'absence d'un fournisseur : tester la présence de chaque clé avant de construire la liste. |

## M20 — RAG en code

### L089 — Embeddings et bases vectorielles : pgvector, Chroma, Qdrant
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Docker (image, conteneur, `-d`, `-p`, `-e`, `-v`) jamais expliqué ; exécution de `schema.sql` absente ; paramètres SQL nommés, `register_vector`, astuce `global` + `NameError`, `uuid5`, listes alignées de Chroma ; pièges : port 5432 déjà pris, mot de passe vide, Docker éteint, modèle local de plusieurs Go, syntaxe `VAR=… python` sous Windows, dimension 1024 vs modèle OpenAI dans la version TS, table vide (aucune insertion dans la leçon) |
| Ajouts faits | 🧭 Docker ; 7 🔍 (embed, schéma SQL, recherche pgvector, Chroma, Docker Qdrant, Qdrant, TS) ; 4 🛠️ (embed local, Docker, pgvector, Qdrant) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 7 🔍 · 4 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | la version TypeScript produit des embeddings OpenAI dont la dimension ne correspond pas à la colonne `VECTOR(1024)` créée plus haut : préciser `dimensions: 1024` ou adapter la colonne. |

### L090 — Pipeline d'ingestion : parsing, chunking, métadonnées
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Paquet Python, `__init__.py`, imports relatifs et `python -m` jamais expliqués (crash garanti en lançant le fichier directement) ; emplacement de `embeddings.py` ; récursivité, tranches de tokens, `iter(lambda…)`, transaction, `RETURNING`, `executemany` ; pièges : noms d'installation ≠ noms d'import (`python-docx`/`docx`, `beautifulsoup4`/`bs4`), `lxml` manquant, encodage HTML, `UniqueViolation` sur deux fichiers identiques |
| Ajouts faits | 🧭 paquet et imports relatifs ; 3 🔍 (parsers, chunking, pipeline) ; 2 🛠️ (parsing, pipeline) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 3 🔍 · 2 🛠️ · 1 ✅ |

### L091 — LangChain et LlamaIndex
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Chaîne LCEL (dictionnaire de tuyaux, `RunnablePassthrough`) non décortiquée ; `Settings` globaux de LlamaIndex, variable `INGEST`, `from_documents` vs `from_vector_store` ; pièges : adresse `postgresql+psycopg://` exigée par langchain-postgres, intégrations manquantes, `temperature` envoyée par une vieille intégration, base vectorisée avec un autre modèle (version TS), premier lancement sans ingestion, lecteur docx à installer |
| Ajouts faits | 4 🔍 (LangChain Python, LangChain.js, LlamaIndex) ; 2 🛠️ (LangChain, LlamaIndex) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 3 🔍 · 2 🛠️ · 1 ✅ |

### L092 — Recherche hybride, reranking, requêtes multiples
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Colonne générée `tsvector`, racines françaises, `websearch_to_tsquery` / `@@` / `ts_rank_cd`, paramètres positionnels, algorithme RRF ligne à ligne ; échec silencieux de `json.loads` (balises Markdown autour du JSON) ; pièges : script SQL non exécuté, codes à tirets mal découpés par la configuration `french`, reranker lent sur CPU, cache non relu dans le contextual retrieval, 429 en rafale |
| Ajouts faits | 5 🔍 (SQL, hybride, reranking, multi-query/HyDE, contextual) ; 2 🛠️ (hybride, contextual) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 5 🔍 · 2 🛠️ · 1 ✅ |

### L093 — Évaluer un RAG : Ragas, jeux de test, métriques
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `Callable`, intersection d'ensembles, `parametrize` pytest, DataFrame pandas, champs imposés par Ragas ; pièges non anticipés : format `source#page` différent de celui stocké par l'ingestion de L090 (métriques à 0), `rag_app` qui n'existe qu'en L094, noms Ragas variables selon la version, `NaN` du juge, JSONL présenté sur plusieurs lignes, juge OpenAI par défaut de DeepEval |
| Ajouts faits | 5 🔍 (génération de tests, métriques de recherche, Ragas, DeepEval) ; 2 🛠️ (métriques de recherche, Ragas) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | le format de source attendu par l'évaluation (`source#page`) diffère de celui que L090 stocke dans les métadonnées : aligner les deux leçons, sinon les métriques de rappel tombent à zéro. |

### L094 — Projet : RAG documentaire d'entreprise
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | FastAPI (routes, validation, uvicorn, générateur `yield`), SQLite et Docker Compose (services, `.env`, nom de service comme adresse, profils) jamais présentés ; `Dockerfile` annoncé mais non fourni ; pièges : `curl -d` sans `Content-Type` → 422, port 8080 occupé, `schema.sql` exécuté seulement sur un volume vide, `--host 0.0.0.0`, seuil de refus à calibrer selon le reranker, system prompt < 512 tokens |
| Ajouts faits | 2 🧭 (FastAPI, Docker Compose) ; 3 🔍 (rag_app, api, compose) ; 3 🛠️ (rag_app, API, Compose) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 3 🔍 · 3 🛠️ · 1 ✅ |

## M21 — Agents en code

### L095 — La boucle agentique : outils, mémoire, planification
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Décorateur maison et introspection (`inspect.signature`, `get_type_hints`, `getdoc`) non expliqués ; `SYSTEM.format` ; estimation « 4 caractères par token » ; pièges : fichier mémoire corrompu, budget de 0,05 $ vite atteint, historique incohérent après interruption, chiffres perdus par la compaction |
| Ajouts faits | 🧭 décorateur/introspection ; 🔍 agent complet ; 🛠️ (5 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 1 🔍 · 1 🛠️ · 1 ✅ |

### L096 — LangGraph : agents à états
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `TypedDict` / `Annotated` / réducteur, `bind_tools`, construction du graphe, `config` et `thread_id` ; défauts du code de la section 4 : après un refus, l'arête `validation → outils` reste inconditionnelle ; la correction de montant modifie l'état en place sans le renvoyer ; le nœud interrompu est ré-exécuté depuis son début à la reprise ; paquet `langgraph-checkpoint-sqlite` séparé |
| Ajouts faits | 🧭 TypedDict/Annotated ; 3 🔍 (graphe ReAct, persistance, validation humaine) ; 2 🛠️ (persistance, interrupt) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 3 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | trois défauts dans le graphe d'approbation : après un refus, l'arête `validation → outils` reste inconditionnelle ; la correction du montant modifie l'état en place sans le renvoyer (LangGraph ne la voit pas) ; à la reprise après `interrupt`, le nœud repart de son début (à signaler, sinon l'apprenant croit à un bogue). |

### L097 — OpenAI Agents SDK, Claude Agent SDK, Pydantic AI
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `Field(ge=…)`, `run_sync`, schéma simplifié `{"employe": str}`, signature d'un hook, `RunContext`, dépendances, `ModelRetry`, `output_validator` ; **erreur dans `commun.py`** : `toordinal() % 7 not in (5, 6)` écarte le vendredi et compte le dimanche (3 jours ouvrés au lieu de 4 pour le 22-26/12/2026, vérifié par script) ; `{societe}` non remplacé dans les instructions fixes ; `statut: str` qui n'impose rien ; clé OpenAI nécessaire pour la version OpenAI |
| Ajouts faits | 4 🔍 (commun, OpenAI, Claude, Pydantic AI) ; 2 🛠️ (calcul des jours ouvrés, installation/exécution) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | dans `commun.py`, le test `toordinal() % 7 not in (5, 6)` écarte le vendredi et compte le dimanche (3 jours ouvrés trouvés au lieu de 4, vérifié par script) : remplacer par `.weekday() < 5`. |

### L098 — Multi-agents : CrewAI, AutoGen / AG2
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Trous `{siren}` remplis par `kickoff(inputs=…)`, `context` des tâches, préfixe LiteLLM, constructeurs MAF instables, fonction imbriquée et `gather` ; pièges : installation lourde de CrewAI, `temperature` possiblement envoyée par la couche LLM, JSON « en texte » fragile dans l'orchestrateur (parade : sorties structurées), 429 des workers en parallèle |
| Ajouts faits | 3 🔍 (CrewAI, MAF, orchestrateur-workers) ; 2 🛠️ (CrewAI, orchestrateur) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 3 🔍 · 2 🛠️ · 1 ✅ |

### L099 — Agents, MCP et A2A : interopérabilité
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Lancement de serveurs MCP par l'agent (`npx -y`, dossier autorisé), `async with agent` ; extraits « patrons » non exécutables tels quels (`await` hors fonction) ; classes du SDK A2A (`AgentExecutor`, `EventQueue`, `AgentCard`), `uuid`, format des `parts` ; pièges : Node absent, mauvais Python pour le serveur, dossier autorisé inexistant, serveur A2A à lancer dans un autre terminal, chemin de la carte selon la version, port 9000 occupé |
| Ajouts faits | 5 🔍 (Pydantic AI + MCP, patrons, serveur A2A, client A2A) ; 2 🛠️ (MCP, A2A) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |

### L100 — Projet : agent de recherche et de rédaction autonome
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Threads (`ThreadPoolExecutor`, `submit`, `as_completed`, futurs), `argparse`, `@property` non expliqués ; code de 350 lignes sans découpage commenté ; `\` de la commande sous PowerShell ; pièges : annotations de citations absentes (format `[web:1]` / `search_results`) qui vident le dossier, budget atteint à la recherche, SDK ancien, emplacement des livrables |
| Ajouts faits | 🧭 threads/argparse ; 2 🔍 (agent complet par blocs, commande) ; 🛠️ (6 cas) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 2 🔍 · 1 🛠️ · 1 ✅ |

## M22 — Applications IA : interface, déploiement, observabilité

### L101 — Next.js et Vercel AI SDK : chat en streaming
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | App Router (routes par dossiers, route handler, `"use client"`, `.env.local` lu au démarrage, alias `@/`), hooks React, cookie et JWT supposés connus ; **`jose` absent de la ligne d'installation** ; aucune page de connexion : toutes les requêtes renvoient 401 sans jeton de test ; `AUTH_SECRET` absent du `.env.local` proposé ; table `clients` à créer ; versions du SDK |
| Ajouts faits | 3 🧭 (App Router, cookie/JWT) ; 4 🔍 (installation, route handler, page, auth) ; 2 🛠️ (route, jeton de test) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | `jose` n'est pas dans la commande d'installation, aucune page de connexion n'est fournie (toutes les requêtes reçoivent 401) et `AUTH_SECRET` n'apparaît pas dans `.env.local` : ajouter les trois. |

### L102 — Backend : files d'attente, limites, coûts, cache
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Worker comme processus séparé, HTTP 202, options pg-boss, `FILTER` / `COALESCE` / `date_trunc` ; **`npx tsx worker.ts` ne charge pas `.env.local`** (DATABASE_URL vide) ; tables métier (`resumes`, `documents`, `appels_llm`) jamais créées ; `@ai-sdk/mistral` non installé ; import et signatures de pg-boss selon la version ; erreur de quota levée mais à convertir en 402/429 dans la route ; `singletonKey` dépendant de l'état du job |
| Ajouts faits | 4 🔍 (file d'attente, quotas, cache de prompt, cache sémantique) ; 2 🛠️ (file d'attente, cache sémantique) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 4 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | le worker ne lit pas `.env.local`, les tables ne sont jamais créées (aucun script SQL) et `@ai-sdk/mistral` est utilisé sans être installé. |

### L103 — Observabilité : Langfuse, LangSmith ; évaluations : promptfoo, DeepEval
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Fichier spécial `instrumentation.ts`, span processor, `experimental_telemetry`, gabarits promptfoo, `parametrize` ; **conflit de port 3000 entre Langfuse et `next dev`** ; `@langfuse/client` absent de la ligne d'installation ; variable `conversationId` jamais définie ; route `/api/chat-sync` utilisée par DeepEval mais jamais écrite ; chemins `file://` relatifs ; promptfoo ne lit pas `.env.local` ; nom de modèle juge selon la version de DeepEval |
| Ajouts faits | 6 🔍 (Docker Langfuse, instrumentation, feedback, promptfoo, DeepEval) ; 4 🛠️ (Langfuse, traces, promptfoo, DeepEval) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 5 🔍 · 4 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | `@langfuse/client` manque à l'installation, Langfuse auto-hébergé et Next.js se disputent le port 3000, `conversationId` n'est défini nulle part et la route `/api/chat-sync` appelée par promptfoo n'existe pas. |

### L104 — CI/CD et tests de prompts
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Anatomie d'un workflow (`on`, `jobs`, `needs`, `if`, `uses` / `run`, expressions `${{ }}`), `process.argv`, centile, `readUInt16BE` ; la condition `if:` du job d'évaluation est toujours vraie sur une PR malgré le commentaire ; Vitest et `@vitest/coverage-v8` non installés ; secrets Vercel `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` manquants ; `~` dans le chemin de cache ; `readFileSync` relatif susceptible d'échouer une fois déployé |
| Ajouts faits | 🧭 workflow GitHub Actions ; 3 🔍 (workflow, seuils, flags) ; 2 🛠️ (CI, flags) ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 3 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | la condition `if:` du job d'évaluation est toujours vraie sur une pull request : l'évaluation payante tourne même quand aucun prompt n'a changé. |

### L105 — Projet : application IA complète déployée
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `z.coerce`, `safeParse(process.env)`, `output: "standalone"`, Dockerfile multi-étapes, `healthcheck` / `depends_on: condition`, DNS / reverse proxy / Let's Encrypt, clé SSH en CI, `set -euo pipefail`, cron : rien de cela n'était expliqué ; pièges : `npm run build` qui échoue si `env.ts` est importé à la construction, `.env.production` absent, `POSTGRES_PASSWORD` lu ailleurs que dans `env_file`, `init.sql` exécuté une seule fois, certificat refusé tant que le DNS ne pointe pas, utilisateur `deploy` hors du groupe `docker` |
| Ajouts faits | 3 🧭 (Dockerfile multi-étapes, DNS/proxy/HTTPS) ; 7 🔍 (env.ts, santé + config, Dockerfile, compose, Caddyfile, déploiement SSH, sauvegarde) ; 3 🛠️ (configuration, compose, Caddy) ; ✅ |
| Compte | 0 parenthèse(s) · 2 🧭 · 7 🔍 · 3 🛠️ · 1 ✅ |

## M23 — Sécurité des applications LLM

### L106 — OWASP Top 10 pour les applications LLM
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | XSS, injection SQL et RCE cités (LLM10) sans définition ; `IntEnum`, `@property`, tri par clé, redirection `>` (et son encodage UTF-16 sous PowerShell 5) non expliqués |
| Ajouts faits | 🧭 attaques web classiques ; 🔍 registre de risques ; ✅ |
| Compte | 0 parenthèse(s) · 1 🧭 · 1 🔍 · 0 🛠️ · 1 ✅ |

### L107 — Prompt injection directe et indirecte : attaques et défenses
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | Expressions régulières de détection (carte, IBAN, contenu actif), échappement HTML, neutralisation de balise, fournisseur HTTP de promptfoo ; pièges : `JOURNAL` global jamais vidé (résultats mélangés entre attaques), `while True` sans plafond (coût), 422 sans `Content-Type`, port 8000 occupé, juge `llm-rubric` non configuré (OpenAI par défaut selon la version) |
| Ajouts faits | 6 🔍 (app vulnérable, couches 1 à 4, promptfoo) ; 2 🛠️ (laboratoire, promptfoo) ; ✅ |
| Compte | 0 parenthèse(s) · 0 🧭 · 6 🔍 · 2 🛠️ · 1 ✅ |

### L108 — Guardrails, modération, données personnelles
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | PII, NIR, RGPD/CNIL, pseudonymisation vs anonymisation, Colang, NER/spaCy, AIPD supposés connus ; pièges : les deux NIR d'exemple ont une clé invalide (`pii_fr` n'en détecte aucun, Presidio les remplace quand même), Ollama non lancé ou modèle mal nommé (`KeyError: 'message'`), paquet `guardrails-ai` et validateurs du hub à installer à part, modèle spaCy non téléchargé, `pii_fr.py` à placer dans le même dossier |
| Ajouts faits | 3 parenthèses ; 1 🧭 (vocabulaire des données personnelles) ; 6 🔍 (Llama Guard, NeMo, Guardrails AI, regex PII, Presidio, pipeline) ; 5 🛠️ ; ✅ |
| Compte | 3 parenthèse(s) · 1 🧭 · 6 🔍 · 5 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | les deux NIR d'exemple (`1 85 05 75 116 001 23`, `2 90 11 75 108 221 46`) ont une clé invalide (59 et 74 attendus, vérifié par calcul) : `pii_fr.py` n'en détecte donc aucun et la démonstration paraît cassée. Corriger les clés, ou l'annoncer dans le texte ; le 🛠️ ajouté l'explique. |

### L109 — Secrets, quotas, abus et coûts
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | `.gitignore`, historique Git, hooks, codes HTTP 429/413/402/503, MTok, seau à jetons, `defaultdict`, `Header(...)` supposés connus ; pièges : sans `gitleaks` installé, le hook refuse **tous** les commits avec le message « secret détecté » (diagnostic trompeur), `protect` obsolète dans les versions récentes, script lancé hors dépôt Git, 422 si l'en-tête `x-user-id` manque, compteurs perdus à chaque redémarrage |
| Ajouts faits | 1 parenthèse ; 2 🧭 (Git, codes HTTP et unités) ; 2 🔍 (script bash, `garde_budget.py`) ; 2 🛠️ ; ✅ |
| Compte | 1 parenthèse(s) · 2 🧭 · 2 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | (1) sans `gitleaks` installé, le hook bloque **tous** les commits avec le message « secret détecté », ce qui égare le débutant : tester `command -v gitleaks` dans le hook ; (2) dans l'exercice, un faux secret `sk-ant-` + 30 caractères risque de ne pas être reconnu par les règles de gitleaks, qui visent le format complet des clés Anthropic (à vérifier avec la version installée). |

### L110 — Audit de sécurité d'une application IA (atelier)
| Rubrique | Détail |
|---|---|
| Points bloquants (lecture « développeur junior ») | SQLite en mémoire, Chroma, `innerHTML`, chaîne d'approvisionnement (épinglage, pickle/safetensors), cotation P × I supposés connus ; pièges : `/static/config.js` renvoie 404 (aucun montage de fichiers statiques dans `paieassist.py`, la vérification manuelle est donc impossible en l'état), `max_tokens=32_000` sans streaming peut être refusé par le SDK Python selon la version, téléchargement du modèle d'embeddings de Chroma au premier appel, coût réel des tests sur Opus sans quota, tests promptfoo qui « échouent » (c'est le résultat attendu) |
| Ajouts faits | 2 parenthèses ; 2 🧭 (chaîne d'approvisionnement, cotation P × I) ; 2 🔍 (PaieAssist, promptfoo) ; 2 🛠️ ; ✅ |
| Compte | 2 parenthèse(s) · 2 🧭 · 2 🔍 · 2 🛠️ · 1 ✅ |
| Non corrigé (voir propositions) | `paieassist.py` ne monte aucun dossier statique : `GET /static/config.js` renvoie 404 et la vérification manuelle de la clé est impossible en l'état ; ajouter `app.mount("/static", StaticFiles(directory="static"))`. Par ailleurs, `max_tokens=32_000` sans streaming peut être refusé par certaines versions du SDK Python : à vérifier avant l'atelier. |
