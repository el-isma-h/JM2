# Corrections appliquées — mise à jour de novembre 2026

Source : `_recherche/07-mise-a-jour-nov-2026.md`, section 4 (C1 à C26) et doutes tranchés (§1). Appliqué le 5 novembre 2026, de façon minimale : chaque ligne ci-dessous remplace un passage exact ; rien d'autre n'a été supprimé.

## Synthèse par correction

| # | Statut | Fichiers |
|---|---|---|
| C1 | Appliquée (quiz M17 autorisé) | `M17/quiz.json` (M17-Q04 : explication ; distracteur C reformulé pour ne pas devenir défendable) |
| C2 | En attente (L068 verrouillée) | `_corrections-en-attente.md` A1 |
| C3 | Appliquée | `L008` |
| C4 | Appliquée | `L131`, `L113` |
| C5 | En attente (L065, L066 verrouillées) | `_corrections-en-attente.md` A2 à A4 |
| C6 | En attente (L066 verrouillée) | `_corrections-en-attente.md` A5 à A9 |
| C7 | Appliquée | `L083` |
| C8 | Appliquée en partie | `L027` (texte + 2 liens vers la release stable), `L034`, `L099`, `L148` ; `L075` : l. 74 déjà corrigée par un autre agent, l. 427 et 465 en attente (A10, A11) ; `M06/module.json` hors périmètre |
| C9 | Appliquée | `L106` |
| C10 | Appliquée | `L039` §1 (point 2 et encadré « À retenir ») |
| C11 | Appliquée | `L039` §6 (script, résultat 316/j ≈ 9 480/mois, crédits, levier 2 rendu cohérent) |
| C12 | Appliquée (bonne réponse modifiée) | `examens/N2-examen.json` N2-E09 |
| C13 | Appliquée | `L039` défi ; N2-E09 traité en C12 ; `M09/quiz.json` vérifié : M09-Q01 et Q02 restent justes |
| C14 | Appliquée (énoncé et options modifiés) | `M19/quiz.json` M19-Q02, `L084` |
| C15 | Appliquée | `L085` (encadré + 2 lignes de code), `L088` |
| C16 | Appliquée | `L087` |
| C17 | Appliquée | `L029` |
| C18 | Appliquée | `L029` (3 passages + ligne « 2 décembre 2026 »), `L030` |
| C19 | Appliquée pour la leçon | `L023` ; `_recherche/05` hors périmètre |
| C20 | Non appliquée : hors périmètre | aucune occurrence dans les leçons ; `referentiel/` et `_recherche/05` listés dans `_corrections-en-attente.md` |
| C21 | Appliquée | `L134` §5 |
| C22 | Appliquée | `L140` |
| C23 | Appliquée | `L141` |
| C24 | Appliquée | `L139`, `L082` |
| C25 | Appliquée | `L037` (point « Mises à jour ») |
| C26 | Proposition optionnelle : non appliquée | voir `_corrections-en-attente.md` |

## Recalculs (quiz et examens)

- **N2-E09** : le déclencheur ne compte qu'une opération par passage. Avec filtre : 96 + 30 × 3 = 186/j → **≈ 5 580/mois** (bonne réponse, `answer` = 2). Sans filtre : 96 + 120 = 216/j → ≈ 6 480. Déclencheur instantané : 40 + 90 = 130/j → ≈ 3 900. Sondage seul : 96/j → ≈ 2 880. Options : « ≈ 2 880 / ≈ 3 900 / ≈ 5 580 / ≈ 6 480 ». Une seule valeur correspond à l'énoncé.
- **M19-Q02** : 20 000 × 2 $/M = 0,04 $ ; 800 × 6 $/M = 0,0048 $ ; 60 posts × 0,005 $ = 0,30 $ ; total 0,3448 $ ≈ **0,35 $** (`answer` = 0 inchangé). Le distracteur « 0,60 $ / 0,20 $ par appel » a été remplacé par l'ancien raisonnement « facturé à l'appel » (≈ 0,06 $). Longueurs des options : 88 / 59 / 73 / 77 caractères.
- **M17-Q04** : la bonne réponse ne change pas. Comme l'API fusionne deux messages `user` consécutifs, l'option « Deux messages user successifs, un par résultat » devenait défendable : elle est reformulée en « Deux messages user successifs, chacun résumant un résultat en texte libre ».

## Détail avant / après

### C1 — `niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/quiz.json` (M17-Q04)

**Avant**

````text
{"q": "Claude répond avec stop_reason « tool_use » et deux blocs tool_use (vérifier_stock et creneaux). Que devez-vous renvoyer ?", "options": ["Un message assistant contenant les résultats", "Rien : l'API exécute les outils elle-même", "Deux messages user successifs, un par résultat", "Un seul message de rôle user contenant deux blocs tool_result, chacun avec le tool_use_id correspondant"], "answer": 3, "explanation": "Les outils clients sont exécutés par votre code ; tous les résultats d'un même tour sont renvoyés dans un unique message user, sous forme de blocs tool_result référençant chaque tool_use_id. Deux messages user consécutifs provoqueraient une erreur."}
````

**Après**

````text
{"q": "Claude répond avec stop_reason « tool_use » et deux blocs tool_use (vérifier_stock et creneaux). Que devez-vous renvoyer ?", "options": ["Un message assistant contenant les résultats", "Rien : l'API exécute les outils elle-même", "Deux messages user successifs, un par résultat", "Un seul message de rôle user contenant deux blocs tool_result, chacun avec le tool_use_id correspondant"], "answer": 3, "explanation": "Les outils clients sont exécutés par votre code ; tous les résultats d'un même tour sont renvoyés dans un unique message user, sous forme de blocs tool_result référençant chaque tool_use_id. Deux messages user consécutifs ne provoquent pas d'erreur : l'API les fusionne en un seul tour. La forme attendue reste un seul message user contenant tous les tool_result."}
````

### C1 (cohérence) — `niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/quiz.json` (M17-Q04)

**Avant**

````text
{"options": ["Un message assistant contenant les résultats", "Rien : l'API exécute les outils elle-même", "Deux messages user successifs, un par résultat", "Un seul message de rôle user contenant deux blocs tool_result, chacun avec le tool_use_id correspondant"], "explanation": "Les outils clients sont exécutés par votre code ; tous les résultats d'un même tour sont renvoyés dans un unique message user, sous forme de blocs tool_result référençant chaque tool_use_id. Deux messages user consécutifs ne provoquent pas d'erreur : l'API les fusionne en un seul tour. La forme attendue reste un seul message user contenant tous les tool_result."}
````

**Après**

````text
{"options": ["Un message assistant contenant les résultats", "Rien : l'API exécute les outils elle-même", "Deux messages user successifs, chacun résumant un résultat en texte libre", "Un seul message de rôle user contenant deux blocs tool_result, chacun avec le tool_use_id correspondant"], "explanation": "Les outils clients sont exécutés par votre code ; tous les résultats d'un même tour sont renvoyés dans un unique message user, sous forme de blocs tool_result référençant chaque tool_use_id. Deux messages user consécutifs ne provoquent pas d'erreur : l'API les fusionne en un seul tour. La forme attendue reste un seul message user contenant tous les tool_result ; un résumé en texte libre, sans bloc tool_result ni tool_use_id, ne rattache pas les résultats aux appels."}
````

### C3 — `niveaux/N1-fondamentaux/M02-les-grands-modeles-de-langage-llm-expliques/L008-fenetre-de-contexte-temperature-hallucinations-les-limites-a.md`

**Avant**

````text
et l'on pilote plutôt le niveau d'**effort** de raisonnement. C'est un bon rappel
````

**Après**

````text
et l'on pilote plutôt le niveau d'**effort** de raisonnement. Depuis la version d'API 2026-10-21 (envoyée par défaut par les SDK v2), `temperature`, `top_p` et `top_k` renvoient une erreur 400 **sur tous les modèles**, même à leur valeur par défaut. C'est un bon rappel
````

### C4 — `niveaux/N4-expert/M27-transformers-et-llm-from-scratch-inspire-cs224n-cs336-cs25/L131-un-gpt-from-scratch-nanogpt.md`

**Avant**

````text
(OpenAI, Mistral ; Claude jusqu'à la version 4.6, ces paramètres étant refusés à partir de 4.7, voir L008)
````

**Après**

````text
(OpenAI, Mistral ; Claude : refusés à partir de 4.7, et refusés sur tous les modèles avec la version d'API 2026-10-21 (SDK v2) ; seule l'ancienne version d'API `2023-06-01` les accepte encore sur Sonnet 4.6 et les modèles antérieurs, voir L008)
````

### C4 — `niveaux/N4-expert/M24-mathematiques-pour-l-ia/L113-probabilites-et-statistiques-utiles.md`

**Avant**

````text
(OpenAI, Mistral, serveurs locaux… ; les modèles Claude ≥ 4.7 la refusent, voir L008)
````

**Après**

````text
(OpenAI, Mistral, serveurs locaux… ; Claude la refuse à partir de 4.7, et sur tous les modèles avec la version d'API 2026-10-21 (SDK v2) ; seule l'ancienne version d'API `2023-06-01` l'accepte encore sur Sonnet 4.6 et les modèles antérieurs, voir L008)
````

### C7 — `niveaux/N3-developpeur/M18-api-openai/L083-projet-le-meme-assistant-porte-sur-openai.md`

**Avant**

````text
forçage → erreur sur les modèles 5.5 |
````

**Après**

````text
forçage → erreur 400 sur Opus 5.5 et Sonnet 5.5 ; accepté sur Haiku 5.5, mais la réponse commence alors par l'appel d'outil, sans bloc de réflexion |
````

### C8 — `niveaux/N1-fondamentaux/M06-introduction-a-l-automatisation-et-aux-agents/L027-mcp-model-context-protocol-explique-simplement.md`

**Avant**

````text
{ title: "MCP — spécification 2026-07-28-RC (GitHub)", url: "https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28-RC", lang: "en" }
````

**Après**

````text
{ title: "MCP — spécification 2026-07-28, release stable (GitHub)", url: "https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28", lang: "en" }
````

### C8 — `niveaux/N1-fondamentaux/M06-introduction-a-l-automatisation-et-aux-agents/L027-mcp-model-context-protocol-explique-simplement.md`

**Avant**

````text
La spécification évolue par versions datées : `2025-11-25` est la version stable citée par la documentation Anthropic, et une version `2026-07-28` est la plus récente (nov. 2026).
````

**Après**

````text
La spécification évolue par versions datées : `2026-07-28` est la **version stable actuelle** (publiée le 28 juillet 2026) et `2025-11-25` la version stable précédente, encore citée par la documentation Anthropic (nov. 2026). La révision 2026-07-28 rend le protocole **sans état** (plus d'`initialize` ni d'ID de session), déprécie Roots, Sampling, Logging et le transport HTTP+SSE, et ajoute les extensions officielles Apps, Tasks et Enterprise-Managed Authorization : du code qui suppose une session MCP doit évoluer.
````

### C8 — `niveaux/N1-fondamentaux/M06-introduction-a-l-automatisation-et-aux-agents/L027-mcp-model-context-protocol-explique-simplement.md`

**Avant**

````text
- [Spécification MCP 2026-07-28-RC (GitHub)](https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28-RC) 🇬🇧 — pour voir
````

**Après**

````text
- [Spécification MCP 2026-07-28, release stable (GitHub)](https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28) 🇬🇧 — pour voir
````

### C8 — `niveaux/N2-praticien/M08-n8n-avance-automatiser-avec-l-ia/L034-les-n-uds-ia-ai-agent-modeles-memoire-outils.md`

**Avant**

````text
(spécification stable 2025-11-25, puis 2026-07-28)
````

**Après**

````text
(spécification stable actuelle 2026-07-28, qui succède à la version stable 2025-11-25)
````

### C8 — `niveaux/N3-developpeur/M21-agents-en-code/L099-agents-mcp-et-a2a-interoperabilite.md`

**Avant**

````text
spécification **2026-07-28**, la plus récente (la doc Anthropic cite encore la version stable 2025-11-25)
````

**Après**

````text
spécification **2026-07-28**, version stable actuelle (publiée le 28 juillet 2026) ; 2025-11-25 = version stable précédente, encore citée par la doc Anthropic. Protocole sans état (plus d'`initialize` ni d'ID de session) ; Roots, Sampling, Logging et HTTP+SSE dépréciés ; extensions Apps, Tasks et Enterprise-Managed Authorization : du code qui suppose une session MCP doit évoluer
````

### C8 — `niveaux/N4-expert/M30-securite-avancee-alignement-et-frontiere-de-la-recherche/L148-securite-des-systemes-agentiques-owasp-agentic-mitre-atlas.md`

**Avant**

````text
(révision 2026-07-28, la plus récente ; la documentation Anthropic cite encore la version stable 2025-11-25)
````

**Après**

````text
(version stable actuelle 2026-07-28, publiée le 28 juillet 2026 ; la documentation Anthropic cite encore la version stable précédente 2025-11-25)
````

### C9 — `niveaux/N3-developpeur/M23-securite-des-applications-llm/L106-owasp-top-10-pour-les-applications-llm.md`

**Avant**

````text
> ⚠️ **Piège fréquent** — Le texte exact des dix entrées ASI01–ASI10 n'a pas pu être relu lors de la préparation de ce cours (nov. 2026) : **vérifiez la liste à jour sur genai.owasp.org** avant un audit client, et citez la version datée du document.
````

**Après**

````text
> ⚠️ **Piège fréquent** — Citer la liste sans sa version. L'édition officielle **2026** (publiée le 9 décembre 2025) est : **ASI01** Agent Goal Hijack · **ASI02** Tool Misuse and Exploitation · **ASI03** Identity and Privilege Abuse · **ASI04** Agentic Supply Chain Vulnerabilities · **ASI05** Unexpected Code Execution (RCE) · **ASI06** Memory & Context Poisoning · **ASI07** Insecure Inter-Agent Communication · **ASI08** Cascading Failures · **ASI09** Human-Agent Trust Exploitation · **ASI10** Rogue Agents ([OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)). Avant un audit client, citez la version datée du document.
````

### C10 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
12 bundles partent du module déclencheur et chaque module en aval s'exécute 12 fois — donc 12 opérations par module.
````

**Après**

````text
12 bundles partent du module déclencheur et chaque module **en aval** s'exécute 12 fois — donc 12 opérations par module en aval. **Le déclencheur, lui, ne compte qu'une opération par passage**, quel que soit le nombre de bundles renvoyés.
````

### C10 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
Chaque bulle qui traite un bundle en coûte une.
````

**Après**

````text
Chaque bulle qui traite un bundle en coûte une (sauf le déclencheur : une par passage, quel que soit le nombre de bundles renvoyés).
````

### C11 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
# Chaque e-mail : Gmail(1) + IA(1) + Parse JSON(1) + branche finale(1)
base = emails_par_jour * 4
````

**Après**

````text
# Chaque e-mail : IA(1) + Parse JSON(1) + branche finale(1) ; le déclencheur Gmail est compté dans polling
base = emails_par_jour * 3
````

### C11 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
# Déclencheur planifié toutes les 15 min : une opération par passage, même à vide
````

**Après**

````text
# Déclencheur planifié toutes les 15 min : une opération par passage, même à vide, quel que soit le nombre d'e-mails renvoyés
````

### C11 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
Résultat : environ 376 opérations par jour, soit **≈ 11 300 opérations par mois**.
````

**Après**

````text
Résultat : 180 + 40 + 96 = 316 opérations par jour, soit **≈ 9 480 opérations par mois**.
````

### C11 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
un forfait payant d'entrée de gamme, vendu par tranche de milliers d'opérations, le couvre. Trois leviers
````

**Après**

````text
un forfait payant d'entrée de gamme, vendu par tranche de milliers d'opérations, le couvre. Make facture en **crédits** : 1 opération = 1 crédit pour les modules à coût fixe, mais certains modules coûtent plus d'un crédit et les modules IA de Make ont un coût variable. Trois leviers
````

### C11 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
les 96 opérations de *polling* quotidiennes disparaissent.
````

**Après**

````text
les 96 opérations de *polling* quotidiennes sont remplacées par une opération par e-mail reçu (60 par jour ici).
````

### C12 — `examens/N2-examen.json` (N2-E09)

**Avant**

````text
{"q": "Scénario Make « Tri SAV » : déclencheur Gmail planifié toutes les 15 minutes, 40 e-mails par jour. Un filtre placé juste après le module Gmail écarte 10 e-mails (newsletters) ; chaque e-mail restant traverse Claude, Parse JSON et un module final. Combien d'opérations par mois (30 jours), en comptant le sondage à vide ?", "options": ["≈ 2 880", "≈ 3 900", "≈ 6 780", "≈ 7 680"], "answer": 2, "explanation": "Sondage : 4 passages par heure × 24 h = 96 opérations par jour, même à vide. Gmail : 40 bundles = 40 opérations. Un filtre qui bloque un bundle ne consomme rien ; les 30 e-mails restants traversent trois modules = 90. Total : 96 + 40 + 90 = 226 par jour, soit ≈ 6 780 par mois. Sans le filtre, on aurait ≈ 7 680 ; avec un déclencheur instantané (sans sondage), ≈ 3 900 : ce sont exactement les deux leviers recommandés par la leçon."}
````

**Après**

````text
{"q": "Scénario Make « Tri SAV » : déclencheur Gmail planifié toutes les 15 minutes, 40 e-mails par jour. Un filtre placé juste après le module Gmail écarte 10 e-mails (newsletters) ; chaque e-mail restant traverse Claude, Parse JSON et un module final. Combien d'opérations par mois (30 jours), en comptant le sondage à vide ?", "options": ["≈ 2 880", "≈ 3 900", "≈ 5 580", "≈ 6 480"], "answer": 2, "explanation": "Sondage : 4 passages par heure × 24 h = 96 opérations par jour, même à vide ; le déclencheur ne compte qu'une opération par passage, quel que soit le nombre d'e-mails renvoyés (les 40 e-mails ne s'y ajoutent donc pas). Un filtre qui bloque un bundle ne consomme rien ; les 30 e-mails restants traversent trois modules = 90. Total : 96 + 90 = 186 par jour, soit ≈ 5 580 par mois. Sans le filtre, 96 + 120 = 216 par jour, soit ≈ 6 480 ; avec un déclencheur instantané (une exécution, donc une opération, par e-mail, sans sondage), 40 + 90 = 130 par jour, soit ≈ 3 900 : ce sont exactement les deux leviers recommandés par la leçon. ≈ 2 880 ne compte que le sondage à vide."}
````

### C13 — `niveaux/N2-praticien/M09-make-zapier-et-choix-d-un-outil-d-automatisation/L039-make-scenarios-avec-modules-ia.md`

**Avant**

````text
Si l'application renvoie 5 bundles : 1 + 5 + agrégateur 1 + Claude 1 + Slack 1 = 9.)
````

**Après**

````text
Si l'application renvoie 5 bundles : le module Avis s'exécute une fois et produit 5 bundles, que l'agrégateur regroupe en un seul, soit plus probablement 1 + 1 + agrégateur 1 + Claude 1 + Slack 1 = 5 ; la doc Make ne traite pas explicitement ce cas : vérifiez dans l'historique d'exécution.)
````

### C14 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L084-xai-grok-api-compatibilite-sdk-live-search-vision.md`

**Avant**

````text
| Outil `x_search` | 5 $ / 1 000 posts lus, 10 $ / 1 000 profils |
````

**Après**

````text
| Outil `x_search` | 5 $ / 1 000 posts lus (posts parents et cités compris), 10 $ / 1 000 profils |
````

### C14 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/quiz.json` (M19-Q02)

**Avant**

````text
{"q": "Un fabricant de vélos veut un résumé quotidien de ce que disent les cyclistes sur X à propos d'un concurrent. Un appel grok-4.7 lit 20 000 tokens, produit 800 tokens et déclenche 3 appels de l'outil x_search (posts). Quel est l'ordre de grandeur du coût (tarifs nov. 2026) ?", "options": ["Environ 0,06 $ : 0,04 $ de tokens d'entrée, 0,005 $ de sortie et 0,015 $ d'outils serveur", "Impossible à estimer : xAI ne publie pas le prix des outils", "Environ 0,60 $ : chaque appel x_search coûte 0,20 $", "Environ 0,005 $ : les outils serveur sont gratuits, seuls les tokens comptent"], "answer": 0, "explanation": "20 000 × 2 $/M = 0,04 $ ; 800 × 6 $/M = 0,0048 $ ; x_search = 5 $/1 000 posts, soit 3 × 0,005 = 0,015 $. Total ≈ 0,06 $. Les outils serveur sont facturés à l'appel, en plus des tokens."}
````

**Après**

````text
{"q": "Un fabricant de vélos veut un résumé quotidien de ce que disent les cyclistes sur X à propos d'un concurrent. Un appel grok-4.7 lit 20 000 tokens, produit 800 tokens et déclenche 3 appels de l'outil x_search qui renvoient 60 posts au total. Quel est l'ordre de grandeur du coût (tarifs nov. 2026) ?", "options": ["Environ 0,35 $ : 0,04 $ d'entrée, 0,005 $ de sortie et 0,30 $ pour les 60 posts renvoyés", "Impossible à estimer : xAI ne publie pas le prix des outils", "Environ 0,06 $ : x_search est facturé à l'appel, soit 3 × 0,005 = 0,015 $", "Environ 0,005 $ : les outils serveur sont gratuits, seuls les tokens comptent"], "answer": 0, "explanation": "20 000 × 2 $/M = 0,04 $ ; 800 × 6 $/M = 0,0048 $ ; x_search est facturé par post renvoyé (5 $/1 000 posts, posts parents et cités compris ; 10 $/1 000 profils), pas par appel : 60 × 0,005 = 0,30 $. Total ≈ 0,345 $, soit environ 0,35 $. Les autres outils serveur (web_search, code_execution…) sont, eux, facturés à l'appel, en plus des tokens."}
````

### C15 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L085-perplexity-sonar-api-recherche-avec-citations.md`

**Avant**

````text
les exemples ci-dessous utilisent `https://api.perplexity.ai`. Avant de déployer,
````

**Après**

````text
les exemples ci-dessous utilisent `https://api.perplexity.ai/v1` pour l'Agent API (quickstart officiel, nov. 2026 : SDK OpenAI → `client.responses.create` ; point de terminaison canonique `POST /v1/agent`, alias `POST /v1/responses`) et `https://api.perplexity.ai/search` pour la Search API. Il existe aussi un SDK natif (`pip install perplexityai` / `npm install @perplexity-ai/perplexity_ai`), dont les exemples placent `effort` à la racine de la requête (la forme `reasoning={"effort": …}` utilisée ici reste à tester). Les citations se lisent dans `output[].content[].annotations[]` (`type: "citation"`, `url`) et dans l'élément `output` de type `search_results`. Avant de déployer,
````

### C15 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L085-perplexity-sonar-api-recherche-avec-citations.md`

**Avant**

````text
base_url="https://api.perplexity.ai",   # à confirmer sur la page OpenAI compatibility
````

**Après**

````text
base_url="https://api.perplexity.ai/v1",   # quickstart officiel (nov. 2026)
````

### C15 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L085-perplexity-sonar-api-recherche-avec-citations.md`

**Avant**

````text
baseURL: "https://api.perplexity.ai", // à confirmer sur la page OpenAI compatibility
````

**Après**

````text
baseURL: "https://api.perplexity.ai/v1", // quickstart officiel (nov. 2026)
````

### C15 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L088-architecture-multi-fournisseur-abstraction-routeurs-openrout.md`

**Avant**

````text
createOpenAI({ baseURL: "https://api.perplexity.ai", apiKey
````

**Après**

````text
createOpenAI({ baseURL: "https://api.perplexity.ai/v1", apiKey
````

### C16 — `niveaux/N3-developpeur/M19-xai-grok-perplexity-mistral-gemini-et-multi-fournisseur/L087-google-gemini-api.md`

**Avant**

````text
  // Comptage pour le calcul du coût : 0,75 $/M in, 3,75 $/M out (nov. 2026)
  const u = response.usageMetadata!;
  const cout = (u.promptTokenCount! * 0.75 + u.candidatesTokenCount! * 3.75) / 1_000_000;
````

**Après**

````text
  // Comptage pour le calcul du coût : 0,75 $/M in, 3,75 $/M out, tokens de réflexion inclus au tarif de sortie (nov. 2026)
  const u = response.usageMetadata!;
  const cout = (u.promptTokenCount! * 0.75 + u.candidatesTokenCount! * 3.75 + (u.thoughtsTokenCount ?? 0) * 3.75) / 1_000_000;
````

### C17 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L029-ai-act-categories-de-risque-calendrier-obligation-d-alphabet.md`

**Avant**

````text
en tenant compte de leurs connaissances, de leur expérience et du contexte d'utilisation.
````

**Après**

````text
en tenant compte de leurs connaissances, de leur expérience et du contexte d'utilisation. Depuis l'omnibus (règlement (UE) 2026/1744, en vigueur le 27 juillet 2026), l'article 4 est reformulé : fournisseurs et déployeurs prennent des mesures qui *favorisent* la maîtrise de l'IA, sans niveau individuel imposé. L'obligation de former demeure (formulation exacte à vérifier sur la version consolidée d'EUR-Lex).
````

### C18 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L029-ai-act-categories-de-risque-calendrier-obligation-d-alphabet.md`

**Avant**

````text
**Reporté** par le règlement (UE) 2026/1744 du 8 juillet 2026 (JOUE 24 juillet 2026) selon la source citée — à confirmer sur EUR-Lex.
````

**Après**

````text
**Reporté** par le règlement (UE) 2026/1744 (JOUE du 24 juillet 2026, en vigueur le 27 juillet 2026).
````

### C18 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L029-ai-act-categories-de-risque-calendrier-obligation-d-alphabet.md`

**Avant**

````text
L'art. 50(2) (marquage) bénéficie d'un délai au 2 décembre 2026 pour les systèmes déjà sur le marché |

````

**Après**

````text
L'art. 50(2) (marquage) bénéficie d'un délai au 2 décembre 2026 pour les systèmes déjà sur le marché |
| **2 décembre 2026** | **Nouvelles interdictions** ajoutées par l'omnibus : systèmes générant des images intimes non consenties (applications « nudifier ») et du matériel pédopornographique | Vérifiez qu'aucun outil d'image utilisé ou proposé ne permet ces usages |

````

### C18 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L029-ai-act-categories-de-risque-calendrier-obligation-d-alphabet.md`

**Avant**

````text
(report de l'omnibus, à confirmer sur EUR-Lex)
````

**Après**

````text
(report de l'omnibus, règlement (UE) 2026/1744)
````

### C18 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L029-ai-act-categories-de-risque-calendrier-obligation-d-alphabet.md`

**Avant**

````text
selon le calendrier révisé (à confirmer sur EUR-Lex),
````

**Après**

````text
selon le calendrier révisé (règlement (UE) 2026/1744),
````

### C18 — `niveaux/N1-fondamentaux/M07-ethique-droit-et-securite-de-l-ia/L030-droit-d-auteur-deepfakes-biais-et-discriminations.md`

**Avant**

````text
aux fournisseurs de **marquer** les contenus synthétiques.
````

**Après**

````text
aux fournisseurs de **marquer** les contenus synthétiques. À partir du **2 décembre 2026**, l'omnibus (règlement (UE) 2026/1744) ajoute aux pratiques interdites les systèmes qui génèrent des images intimes non consenties (applications dites « nudifier ») et du matériel pédopornographique.
````

### C19 — `niveaux/N1-fondamentaux/M05-l-ia-au-travail/L023-verifier-sourcer-corriger-la-relecture-critique-des-sorties-.md`

**Avant**

````text
est de **1 500 €** (décret 2026-127), non 2 000 €
````

**Après**

````text
est de **1 500 €** par an, hors socle CléA (décret n° 2026-127 du 24 février 2026), non 2 000 €
````

### C21 — `niveaux/N4-expert/M27-transformers-et-llm-from-scratch-inspire-cs224n-cs336-cs25/L134-architectures-2026-moe-contexte-long-multimodal.md`

**Avant**

````text
Gemma 4 accepte texte, image et audio (plus la vidéo pour les grandes tailles)
````

**Après**

````text
Gemma 4 accepte texte, image et audio en E2B / E4B, texte et image sans audio en 26B-A4B / 31B (la vidéo y est traitée comme une suite d'images)
````

### C22 — `niveaux/N4-expert/M28-fine-tuning-et-adaptation-de-modeles/L140-projet-specialiser-un-modele-ouvert-sur-un-domaine.md`

**Avant**

````text
| Taille GGUF Q4_K_M | ~3 Go | ~5 Go |
````

**Après**

````text
| Taille GGUF Q4_K_M | ~4,5-5 Go (8B de paramètres avec les embeddings par couche, 4,5B effectifs ; à mesurer) | ~5 Go |
````

### C23 — `niveaux/N4-expert/M29-inference-deploiement-et-mlops/L141-quantization-gguf-et-serveurs-d-inference-vllm-llama-cpp-tgi.md`

**Avant**

````text
Hugging Face a annoncé fin 2025 le passage de TGI en **mode maintenance** et oriente vers vLLM ou SGLang pour les nouveaux déploiements :
````

**Après**

````text
TGI est en **mode maintenance** (annonce officielle sur la doc TGI, qui recommande vLLM, SGLang, llama.cpp ou MLX pour les nouveaux déploiements) :
````

### C24 — `niveaux/N4-expert/M28-fine-tuning-et-adaptation-de-modeles/L139-fine-tuning-via-api-openai-mistral-gemini.md`

**Avant**

````text
La plateforme de fine-tuning **est en cours d'arrêt** : les nouveaux comptes n'y ont plus accès.
````

**Après**

````text
La plateforme de fine-tuning **est en cours d'arrêt** : les nouveaux comptes n'y ont plus accès. Calendrier (page Deprecations, annonce du 7 mai 2026) : depuis le 7/05/2026, plus de nouveaux clients ; depuis le 2/07/2026, organisations sans inférence sur un modèle fine-tuné depuis 60 jours exclues ; **le 6/01/2027, plus aucun nouveau job** ; l'inférence sur les modèles déjà fine-tunés continue jusqu'à la dépréciation du modèle de base.
````

### C24 — `niveaux/N3-developpeur/M18-api-openai/L082-fine-tuning-et-evals-via-l-api.md`

**Avant**

````text
et que les nouveaux utilisateurs n'y ont plus accès**.
````

**Après**

````text
et que les nouveaux utilisateurs n'y ont plus accès**. Calendrier (page Deprecations, annonce du 7 mai 2026) : depuis le 7/05/2026, plus de nouveaux clients ; depuis le 2/07/2026, organisations sans inférence sur un modèle fine-tuné depuis 60 jours exclues ; **le 6/01/2027, plus aucun nouveau job** ; l'inférence sur les modèles déjà fine-tunés continue jusqu'à la dépréciation du modèle de base.
````

### C25 — `niveaux/N2-praticien/M08-n8n-avance-automatiser-avec-l-ia/L037-auto-heberger-n8n-docker-et-securiser.md`

**Avant**

````text
4. **Mises à jour** : épinglez une version (`n8nio/n8n:2.x.y`), lisez les notes de version,
````

**Après**

````text
4. **Mises à jour** : épinglez une version (`n8nio/n8n:2.x.y`), lisez les notes de version (**n8n 3.0**, sortie le 27 octobre 2026, est une version majeure avec des changements incompatibles, un outil de migration et des nœuds dépréciés gelés : vérifiez la version installée avant de suivre les captures du cours),
````

## Bibliothèque de liens

`ressources/bibliotheque-liens.md` : **81 liens ajoutés** sur les 82 de `_recherche/07` §3, au format existant, avec la mention « (nov. 2026) » (et « vue dans l'index officiel » pour les liens de statut I). Le n° 82 (FAQ certifications Anthropic) figurait déjà en §1.3 : non dupliqué. Répartition : §1.4 (19), §1.6 (5), §2.1 (10), §3 (3), §4 (13), §5 (12), §6.1 (11), §8.2 (1), §8.3 (2), §12.2 (2), §14 (2), §17.2 (1).

## Propositions optionnelles (non appliquées)

- Proposition optionnelle : `M16/quiz.json` M16-Q03 porte sur le SDK v2 ; son explication pourrait préciser qu'avec la version d'API 2026-10-21, `temperature` renvoie 400 sur tous les modèles (la bonne réponse reste juste).
- Proposition optionnelle : retirer « à confirmer sur EUR-Lex » et la date non retrouvée « du 8 juillet 2026 » dans `L149` (l. 86, 152, 162), `M30/quiz.json` (explication citant le 2026/1744) et `examens/N1-examen.json` (explication citant le tableau de L029), par cohérence avec C18.
- Proposition optionnelle : reprendre la reformulation de l'article 4 (C17) dans `L004`, `L063` (M15, verrouillée) et `M01/quiz.json`, qui parlent encore de « niveau suffisant ».
- Proposition optionnelle : dans `L068` (verrouillée), nuancer « la liste doit commencer par `user` » : la doc ne l'impose pas explicitement (P1).
