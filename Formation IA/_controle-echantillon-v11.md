# Contrôle de justesse sur échantillon (v11), 5 novembre 2026

## Méthode

- **Tirage** : graine 20261105, générateur mulberry32, tirage sans remise (Fisher-Yates partiel). Script et échantillon : `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/qa-echantillon/tirage.mjs` et `echantillon.json`.
- **Quiz éclair** (blocs ```quiz de `niveaux/*/*/L*.md`) : 60 au total, tirés par strate, soit 12 par niveau N1 à N5 (le minimum demandé était 10). Populations : N1 93, N2 99, N3 137, N4 119, N5 77. Identifiant : `Lxxx-quizN`, où N est le rang du bloc dans la leçon.
- **Examens** : 10 questions par fichier `examens/N1..N5-examen.json` (80 questions par banque), soit 50 au total.
- **Trois contrôles par question** : la bonne réponse est-elle la seule défendable ? L'explication est-elle exacte ? Un débutant peut-il comprendre la question ?
- **Faits datés** : j'ai d'abord lu `_recherche/07-mise-a-jour-nov-2026.md`. J'ai ensuite vérifié en ligne (WebSearch et WebFetch, le 5/11/2026) les points qui n'y figurent pas : incidents de l'AI Index, date de coupure de GPT-6 Astra, prix de Fable 5.1 et de Haiku 5.5, API NotebookLM, Voxtral (licence, date, prix), réflexion et effort sur Sonnet 5.5, incompatibilité entre citations et sorties structurées, piliers de l'observabilité.
- **Calculs refaits** : L042, L055, L176, N1-E77, N2-E09, N3-E18, N4-E06, E07, E37 (intervalles de Wilson), E62, E70, N5-E33, E67.
- `node scripts/validate.mjs` après correction : « ✅ Aucune erreur bloquante » (184 leçons, 770 questions).

## Questions corrigées (3)

Les trois erreurs portent sur l'explication. Aucune bonne réponse n'était fausse et aucune option n'a été modifiée : l'équilibre des longueurs d'options n'a donc pas changé.

### 1. L048-quiz3 (`niveaux/N2-praticien/M11-rag-et-bases-de-connaissances/L048-…md`, 3ᵉ bloc quiz), explication

- **Avant** : « Faux : NotebookLM n'a ni API ni intégration dans un workflow. C'est un outil de bureau… »
- **Après** : « Faux : NotebookLM ne s'interroge pas depuis un workflow (l'API de l'édition Enterprise ne sert qu'à gérer carnets et sources). C'est un outil de bureau… »
- **Raison** : une API officielle existe pour NotebookLM Enterprise (Google Cloud). Elle sert à créer, lire, partager et supprimer des carnets et à gérer leurs sources. Elle ne permet pas de poser une question à un carnet. L'affirmation « n'a ni API » est donc fausse, mais la réponse « Faux » reste la seule défendable.
- **Sources** : https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs/api-notebooks (lue : seules des opérations de gestion de carnets) ; https://horadecodar.com.br/notebooklm-api/ (lue : API réservée à l'édition Enterprise, aucune API publique pour l'offre grand public).

### 2. N2-E74 (`examens/N2-examen.json`), explication

- **Avant** : « Voxtral 4B TTS (poids ouverts, publié le 23 mars 2026) est sous licence CC BY-NC 4.0… »
- **Après** : « Voxtral 4B TTS (poids ouverts, publié le 26 mars 2026) est sous licence CC BY-NC 4.0… »
- **Raison** : Mistral a annoncé Voxtral TTS le 26 mars 2026. La licence CC BY-NC 4.0 et le prix de Voxtral TTS 3 (13 $ par million de caractères, donc 180 000 caractères ≈ 2,34 $) sont confirmés : la bonne réponse ne change pas.
- **Sources** : https://siliconangle.com/?p=736241 (« today announced the release of Voxtral TTS », daté du 26 mars 2026) ; https://insiderllm.com/guides/mistral-voxtral-tts-local-voice-ai/ (26 mars 2026, CC BY-NC 4.0) ; https://datanorth.ai/news/mistral-releases-voxtral-tts-open-weight-text-to-speech-model (CC BY-NC 4.0) ; https://www.usagepricing.com/blueprint/activity/mistral-ai-2026-10-22-voxtral-3-audio-pricing (« TTS 3 $13/M chars »).

### 3. N3-E09 (`examens/N3-examen.json`), explication

- **Avant** : « …et l'intensité se règle par `effort` (`low`, `medium`, `high`). »
- **Après** : « …et l'intensité se règle par `effort` (`low`, `medium`, `high`, `xhigh`, `max`). »
- **Raison** : Sonnet 5.5 a cinq niveaux d'effort. L'ancienne liste laissait croire que `xhigh` (utilisé dans l'option D) n'existait pas. L'option D reste fausse pour deux raisons : `top_p` renvoie une erreur 400, et la réflexion ne s'active pas automatiquement au-delà de `high`. Le guide confirme aussi le reste de l'explication : `budget_tokens` renvoie 400, `adaptive` et `display: "summarized"` sont valides, le préremplissage est rejeté.
- **Source** : https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide (lu : « Claude Sonnet 5.5 has five effort levels: low, medium, high, xhigh, and max »).

## Doutes (rien n'a été modifié)

1. **N2-E33** (et L060, l. 82) : l'explication affirme qu'« il n'existe pas d'équivalent local ouvert de qualité comparable exécutable sur un poste de travail pour la vidéo ». Cela se discute : il existe des modèles vidéo ouverts qui tournent sur un GPU grand public de 24 Go, et je ne l'ai pas vérifié en ligne. La bonne réponse ne dépend pas de cette phrase : la génération locale ne règle pas le consentement des salariés.
2. **L173-quiz1** : « pilier qualité, anciennement appelé distribution ». Le glossaire Conduktor parle encore de « distribution ». La page de Monte Carlo n'était pas accessible depuis la session. La réponse reste unique, car « distribution » ne figure pas parmi les options.
3. **N3-E18** : selon l'explication, « 10 $ / 1 000 est le tarif Claude et OpenAI » pour la recherche web. Pour OpenAI, je ne l'ai pas revérifié, et le tarif dépend du modèle. Le calcul de la bonne réponse (outil de xAI) n'est pas concerné.
4. **L082-quiz2** : le distracteur « niveau Fast (×2) » ne correspond pas au nom d'un niveau OpenAI, qui parle plutôt de *Priority*. Comme c'est une mauvaise réponse, ce n'est pas bloquant.
5. **L169-quiz1** : « seule la clé primaire figure dans *before* avec la configuration par défaut ». C'est vrai pour PostgreSQL (`REPLICA IDENTITY DEFAULT`), pas pour MySQL, qui envoie la ligne complète. Préciser « (PostgreSQL) » serait plus juste.
6. **N2-E54** : « aucun gain de débit avec Ollama » repose sur une mesure citée en L044. Pourtant, L046 mentionne `OLLAMA_NUM_PARALLEL`. La bonne réponse (vLLM) n'est pas en cause.
7. **L083-quiz3** : le tableau de la §6.2 compte la lecture du cache Haiku 5.5 à 0,01 $/M (0,1×), ce que je n'ai pas vérifié. Si c'était 0,05×, le total serait d'environ 1,45 $ au lieu de 1,6 $, et le classement ne changerait pas.
8. **N4-E52** (lisibilité) : l'explication cite « 42 cas positifs », un chiffre absent de l'énoncé.
9. **L020-quiz2** (lisibilité) : « Atelier 8 » suppose qu'on a la leçon sous les yeux.
10. **Longueur des options** : parmi les questions à 3 options ou plus, 43 sur 95 (45 %) ont une bonne réponse aussi longue ou plus longue que toutes les autres, alors que le hasard en donnerait environ 25 %. L'écart est net pour N2-E61 (138 caractères contre 120 au plus pour les autres), N3-E51 (134 / 117), L014-quiz3 (79 / 69), N5-E33 (158 / 142) et N4-E08 (137 / 123). Ce n'est pas une erreur au sens de la consigne, donc je n'y ai pas touché.
11. **Hors échantillon, non modifié** : la même date erronée (23 mars) figure dans `L061` (l. 162) et `_recherche/04` (l. 542). La même affirmation « pas d'API » figure dans le corps de `L048` (l. 206). Ces passages sont à aligner sur les corrections 1 et 2.

## Taux d'erreur observé par niveau

| Niveau | Quiz contrôlés | Questions d'examen contrôlées | Erreurs avérées | Taux |
|---|---|---|---|---|
| N1 | 12 | 10 | 0 | 0 % |
| N2 | 12 | 10 | 2 (L048-quiz3, N2-E74) | 9,1 % |
| N3 | 12 | 10 | 1 (N3-E09) | 4,5 % |
| N4 | 12 | 10 | 0 | 0 % |
| N5 | 12 | 10 | 0 | 0 % |
| **Total** | **60** | **50** | **3** | **2,7 %** |

Aucune bonne réponse n'était fausse et aucune question n'avait deux réponses défendables : les 3 erreurs sont des explications inexactes.

## Résumé

Sur 110 questions tirées (graine 20261105), 3 contenaient une erreur avérée, toutes dans l'explication : une API NotebookLM niée à tort, une date de sortie de Voxtral fausse et une liste incomplète des niveaux d'effort de Sonnet 5.5. Chaque correction remplace quelques mots dans le fichier d'origine, sans toucher aux options ni aux réponses. Le validateur n'affiche aucune erreur bloquante. Onze doutes sont listés, dont un biais de longueur des options : la bonne réponse est la plus longue dans 45 % des cas.
