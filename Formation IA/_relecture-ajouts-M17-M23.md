# Relecture des ajouts pédagogiques — M17 à M23 (L068-L110)

> Relecteur indépendant, 5 novembre 2026. Périmètre : **seulement les blocs ajoutés** (« 🧭 En clair », « 💡 Autrement dit », ```quiz, ```mission, défis, schémas Mermaid/ASCII) dans les 43 leçons L068-L110. L'identification des ajouts repose sur la comparaison avec la sauvegarde d'avant enrichissement (`scratchpad/backup-niveaux/`). Sources factuelles : `_recherche/07` en priorité, puis `01`, `02` et `04`. Aucune recherche web, rien publié. Les autres leçons, les `quiz.json` et les examens n'ont pas été modifiés.

## 1. Ce qui a été contrôlé

| Élément | Nombre | Méthode | Résultat |
|---|---|---|---|
| Blocs `quiz` | 128 (91 à 4 options, 37 vrai/faux) | JSON, index `answer`, fond comparé à la leçon et à `_recherche`, biais de longueur mesuré par script | 5 explications corrigées, 1 distracteur défendable remplacé (L070), 50 options raccourcies ou allongées dans 42 quiz |
| Calculs | 15 | recalculés par script (`scratchpad/relecture-ajouts-2/calc.py`) | tous justes (L078 0,02 $ ; L084 0,20 $ ; L087 450 $ / 225 $ ; L083 85 / 29 / 14,4 / 1,6 $ et cache ÷ 3 ; L092 RRF 0,0323 ; L093 MRR 0,75 ; L110 3 × 3 = 9 ; L109 Haiku 20 à 40 fois moins cher…) |
| Blocs `mission` | 86 | URL comparée à `_recherche/*.md`, à `ressources/bibliotheque-liens.md` et au reste de la leçon ; réponse comparée aux sources | 86/86 URL autorisées ; réponses plausibles et datées ; aucune correction nécessaire |
| « En clair » / « Autrement dit » | 43 / 59 | lecture complète, cohérence avec les corrections récentes | 1 simplification inexacte corrigée (L097) |
| Doublons | — | recherche des encadrés qui se répètent | 1 doublon fusionné (L099, MCP 2026-07-28) |
| Mermaid | 3 (L068, L072, L074) | `mmdc`, SVG relus (aucun « Syntax error ») | 3/3 valides |
| Schémas ASCII, défis | ~15 | lecture | conformes (Files API 1 h à 90 j, TTL du cache Gemini 1 h, grille P × I de L110…) |

## 2. Corrections appliquées

### 2.1 Fond (erreur ou affirmation dépassée)

| Leçon | Bloc | Avant | Après | Source |
|---|---|---|---|---|
| L068 | quiz V/F `temperature` (explication) | « ne sont plus supportés sur les modèles ≥ 4.7 et provoquent une erreur 400 » | ajout : « …et sur tous les modèles avec la version d'API 2026-10-21 des SDK v2 » | 07 P2 |
| L076 | quiz V/F `temperature` (explication) | « n'est plus accepté sur les modèles ≥ 4.7 (erreur 400) » | ajout : « …ni sur aucun modèle avec la version d'API 2026-10-21 des SDK v2 » | 07 P2 |
| L070 | quiz « deux outils dans la même réponse » | distracteur 0 : « Deux messages user successifs, un pour chaque résultat d'outil ». Il était **défendable**, puisque l'API fusionne les messages consécutifs en un seul tour | remplacé par « Un seul tool_result qui regroupe les deux résultats en texte » (erreur 400 garantie, car un `tool_use_id` reste sans réponse) | 07 P1 |
| L071 | quiz « agent comptable » (explication) | « tool_choice forcé renvoie une erreur sur les modèles 5.5 » | « …empêche la boucle de choisir ses autres outils (et renvoie une erreur 400 sur Opus 5.5 et Sonnet 5.5) ». Haiku 5.5 accepte le forçage | 07 P2-bis |
| L075 | quiz MCP connector (explication) | « exposé en Streamable HTTP (ou SSE) » | « …(l'ancien transport SSE est déprécié) », comme le dit déjà la leçon (l. 70) | 07 P3 |
| L075 | quiz « primitive resource » (explication) | sampling présenté sans réserve | « le sampling (déprécié par la révision 2026-07-28) » | 07 P3 |
| L097 | 🧭 En clair | les guardrails « contrôlent en parallèle ce qui entre et ce qui sort » | « contrôlent ce qui entre (en parallèle de l'agent) et ce qui sort ». Seul le guardrail d'entrée tourne en parallèle, comme le montrent le schéma et le § 2 de la leçon | L097 l. 137 et 333 |

### 2.2 Doublon fusionné

- **L099** : la cellule « Standard » de la ligne MCP du tableau (§ 1) reprenait mot pour mot le contenu de l'encadré « 🆕 MCP 2026-07-28 en détail » placé juste en dessous : sans état, dépréciations, extensions, code à faire évoluer. La cellule garde le statut (« version stable actuelle… 2025-11-25 = version stable précédente, encore citée par la doc Anthropic ») et renvoie à l'encadré (« changements détaillés dans l'encadré ci-dessous »). L'encadré, plus complet, est conservé tel quel. Rien n'est perdu.

### 2.3 Réponses devinables par la longueur

Avant la relecture, la bonne réponse était l'option la plus longue dans **70 des 91 quiz à 4 options** (77 %). Dans 42 d'entre eux, elle dépassait d'au moins 20 % la deuxième option la plus longue. Ces 42 quiz ont été corrigés au minimum : la bonne réponse est raccourcie sans changer son sens (l'explication garde le détail), ou un distracteur est allongé. L'index `answer` n'a pas changé.

L078 (×1 ; distracteur allongé), L080 (×2), L081 (×2), L082 (×2), L083, L084, L085 (×2 ; 4 distracteurs allongés), L086 (×3), L087, L088 (×2), L089, L090, L091, L092, L093 (×2), L094 (×2), L096 (×2), L097 (×2), L098, L099 (×2), L100, L101, L103, L105, L108 (×2), L109 (×2 ; le 429 reprend le message exact du code), L110 (×2).

**Résultat** : aucun quiz ne garde une bonne réponse plus longue de 20 % que la suivante. La bonne réponse reste l'option la plus longue dans 46 quiz sur 91, avec un écart faible. **Proposition optionnelle** : rééquilibrer ces 46 cas au fil des prochaines révisions.

## 3. Vérifié et conservé (sans modification)

- **Cohérence avec `_recherche/07`** : messages consécutifs fusionnés (L068), MCP 2026-07-28 stable et sans état (L075, L099 : quiz V/F `initialize`, mission sur les dépréciations), Perplexity `https://api.perplexity.ai/v1` et citations en `annotations` / `search_results` (L085, L088, L100), `x_search` facturé par post (L084 : quiz 0,20 $, mission ; L100 : mission), Haiku 5.5 qui accepte le `tool_choice` forcé (L083), OWASP LLM 2026 et ASI01-ASI10 (L106, L110), certifications Anthropic réservées au Partner Network (L077), calendrier du fine-tuning OpenAI au 6/01/2027 (L082), réflexion Gemini facturée (L087), Usage & Cost Analytics en bêta (L109).
- **Tarifs cités dans les ajouts**, tous conformes à `_recherche/01`, `02` et `04` : Sonnet 5.5 2 / 10 $, lecture du cache 0,10 $, écriture 2,50 $ (5 min) et 4 $ (1 h) ; Opus 5.5 4 / 20 $ ; Terra 1 / 5 $ ; Batch 0,5×, Fast 2×, Ultrafast 6× ; `file_search` 2,50 $/1 000 ; `gpt-transcribe` 0,0045 $/min ; `perplexity/sonar` 0,25 / 2,50 $ ; Gemini 3.8 Flash 0,75 / 3,75 → 1,50 / 7,50 $ ; OCR Mistral 4 $ et 2 $ / 1 000 pages ; web search Claude 10 $/1 000.
- **Limites citées dans les missions** : PDF 600 pages / 128 Mo ; lot de 100 000 requêtes / 256 Mo, résultats conservés 29 jours ; 32 événements de hook ; cache minimal de 512 tokens sur les modèles 5.5 ; examen Anthropic de 120 min, échelle de 100 à 1 000, seuil 720, validité 12 mois ; palier Build à 1 000 $. Les quelques réponses absentes des sources (dimensions pgvector, distances Qdrant, valeurs par défaut de `SentenceSplitter`, fusion DBSF, chiffres du *contextual retrieval*, `MaxTurnsExceeded`, `/.well-known/agent-card.json`) sont exactes à ma connaissance, datées et assorties d'un « vérifiez ».
- **Mermaid** : `sequenceDiagram` du streaming (L068), `flowchart` de la Files API (L072), `sequenceDiagram` du hook PreToolUse (L074). Les trois passent `mmdc` (fichiers dans `scratchpad/relecture-ajouts-2/mm/`).

## 4. Points signalés, non modifiés

1. **L068, « Autrement dit » sur « sans état »** (et l'explication du quiz « 10e tour ») : la phrase est juste pour l'usage standard de la Messages API. Depuis le 2/11/2026, la bêta *message threads* conserve la conversation côté serveur (`_recherche/07` § 2, C26). **Proposition optionnelle** : ajouter « (sauf avec la bêta *message threads*, nov. 2026) » si la leçon traite un jour cette bêta.
2. **L068, texte d'origine l. 196** (« `temperature`, `top_p`, `top_k` ne sont plus supportés sur les modèles ≥ 4.7 ») : le texte n'a pas été retouché, puisqu'il ne fait pas partie des ajouts. Il n'a pas la nuance « tous les modèles avec l'API 2026-10-21 », que portent maintenant le quiz et L093. **Proposition optionnelle** : appliquer la nuance C3 de `_recherche/07` à cette ligne.
3. **L099, mission sur le changelog MCP** : le détail (DCR → CIMD, maintien de 12 mois) vient de la presse spécialisée citée par `_recherche/07` P3, le changelog officiel n'ayant pas été ouvert. La réponse reste juste, et la page est à relire avant une prochaine édition.

## 5. Contrôles finaux

- JSON de tous les blocs `quiz` et `mission` : valide (script `fix.py`).
- `node scripts/validate.mjs | tail -3` : « ✅ Aucune erreur bloquante » (seul avertissement : `N5 examen: quiz manquant`, hors périmètre).
- Sauvegarde des 43 leçons avant modification : `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/relecture-ajouts-2/bak/`.
