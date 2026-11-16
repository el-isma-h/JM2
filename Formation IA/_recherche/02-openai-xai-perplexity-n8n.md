# Recherche 02 — Fournisseurs d'API et plateformes d'automatisation (hors Anthropic)

**Date de la recherche : 1er novembre 2026.**
**Périmètre :** OpenAI, xAI Grok, Perplexity, Mistral AI, Google Gemini, Hugging Face, n8n, Make, Zapier, certifications grand public, outils grand public.

## Légende de vérification des URLs

| Marque | Signification |
|---|---|
| ✅ | Page ouverte et lue avec WebFetch pendant cette recherche (contenu résumé ci-dessous). |
| 🔗 | URL extraite **telle quelle** de la navigation ou du corps d'une page officielle ouverte avec WebFetch (non ouverte elle-même). |
| ⚠️ | URL **non vérifiée** : le quota de recherche web de la session a été épuisé avant de pouvoir l'atteindre, ou la page a refusé le chargement. À confirmer dans une prochaine session avant publication. |

> **Point d'attention méthodologique.** Le quota WebSearch de la session (200 appels partagés entre agents) s'est épuisé pendant la section F. Les sections A–E et la moitié de F reposent sur des pages officielles ouvertes ; les fiches AWS AIF-C01, NVIDIA DLI, Salesforce AI Associate, CompTIA AI Essentials et les grilles tarifaires grand public de ChatGPT / Claude / Gemini / Perplexity / Le Chat / Copilot n'ont **pas** pu être ouvertes et sont signalées ⚠️. Rien n'y est inventé : seules les informations lues sur des pages ouvertes sont chiffrées.

**Constat majeur de la recherche (changements depuis 2025) :**
- La doc OpenAI a migré de `platform.openai.com/docs` vers **`developers.openai.com/api/docs`** ; les modèles phares sont désormais la famille **GPT-6** (`gpt-6-astra`, `gpt-6.1-sol`, `gpt-6.1-terra`, `gpt-6-luna`). La plateforme de fine-tuning est **en cours d'arrêt** (plus d'accès pour les nouveaux comptes).
- Perplexity a **mis fin au support des Sonar Chat Completions le 27 septembre 2026** ; tout passe par l'**Agent API** (multi-fournisseurs) + Search API + Embeddings + Decisions.
- Les cours n8n « Level 1 / Level 2 » de `docs.n8n.io/courses/...` **redirigent vers la n8n Academy (`learn.n8n.io`)** lancée le 16 juin 2026 ; certification officielle repoussée à fin T4 2026.
- Microsoft a **retiré AI-900 le 30 juin 2026** au profit de **AI-901** (même certification « Azure AI Fundamentals »).
- xAI : modèle phare **grok-4.7**, docs réorganisées sous `docs.x.ai/developers/...`.

---

## A. OpenAI

### A.1 Portail documentaire et structure

| Ressource | URL | Statut |
|---|---|---|
| Accueil doc API | https://developers.openai.com/api/docs | ✅ |
| Index complet (llms.txt) | https://developers.openai.com/llms.txt | 🔗 |
| Quickstart | https://developers.openai.com/api/docs/quickstart | ✅ |
| Concepts clés | https://developers.openai.com/api/docs/concepts | 🔗 |
| Catalogue de modèles | https://developers.openai.com/api/docs/models | ✅ |
| Tarifs | https://developers.openai.com/api/docs/pricing | ✅ |
| Référence API | https://developers.openai.com/api/reference/overview | 🔗 |
| Choix d'un modèle | https://developers.openai.com/api/docs/guides/model-selection | 🔗 |
| Cookbook (site) | https://developers.openai.com/cookbook/topic/text | ✅ (redirigé depuis cookbook.openai.com) |
| Cookbook (GitHub) | https://github.com/openai/openai-cookbook | 🔗 |

**Quickstart (✅)** : 1) créer une clé dans le dashboard ; 2) `OPENAI_API_KEY` en variable d'environnement ; 3) `pip install openai` / `npm install openai` (SDK aussi en .NET, Java, Go, Ruby) ; 4) premier appel `client.responses.create(model="gpt-6-astra", input="...")` puis `response.output_text` ; 5) étendre avec fichiers/images et outils (web search, file search, code interpreter, fonctions, MCP distant).

### A.2 Modèles actuels (page Models ✅, 1er nov. 2026)

| Modèle | ID API | Contexte | Sortie max | Knowledge cutoff |
|---|---|---|---|---|
| GPT-6 Astra (phare) | `gpt-6-astra` | 1,05 M tokens | 128 k | 30 avr. 2026 |
| GPT-6.1 Sol | `gpt-6.1-sol` | 1,05 M | 128 k | 30 avr. 2026 |
| GPT-6.1 Terra | `gpt-6.1-terra` | 1,05 M | 128 k | 1er juin 2026 |
| GPT-6 Luna | `gpt-6-luna` | 1,05 M | 128 k | 18 mai 2026 |

Modèles spécialisés listés : `gpt-5.6-cyber` (cybersécurité « OpenAI Daybreak »), `gpt-rosalind-research` (sciences du vivant, organisations approuvées), `gpt-5.3-codex`, `chat-latest`. Images : `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `gpt-image-2`. Realtime : `gpt-live-1`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`, `gpt-realtime-2`, `gpt-realtime-translate`, `gpt-realtime-1.5`. Transcription : `gpt-transcribe`, `gpt-live-transcribe`, `gpt-realtime-whisper` (`gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-tts` dépréciés). Le cookbook cite aussi `gpt-5.5` et `gpt-oss-120B` (open-weight).

### A.3 Tarifs (page Pricing ✅, USD / 1 M tokens, tarif Standard)

| Modèle | Input | Cached input | Output | Cache write 30 min / 12 h |
|---|---|---|---|---|
| gpt-6-astra | 10,00 | 1,00 | 50,00 | 12,50 / 25,00 |
| gpt-6.1-sol | 2,00 | 0,10 | 10,00 | 2,50 / 5,00 |
| gpt-6.1-terra | 1,00 | 0,05 | 5,00 | 1,25 / 2,50 |
| gpt-6-luna | 0,10 | 0,01 | 0,50 | 0,125 / 0,25 |
| gpt-5.6-sol (Cyber, promo jusqu'au 21/11/2026) | 4,00 | 0,40 | 20,00 | – |
| gpt-5.6-cyber | 12,50 | 1,25 | 75,00 | – |
| gpt-6-astra-law | 10,00 | 1,00 | 50,00 | – |
| gpt-5.3-codex | 1,75 | 0,175 | 14,00 | – |
| chat-latest | 5,00 | 0,50 | 30,00 | – |

- **Niveaux de service :** Batch et Flex = 0,5× ; Fast = 2× ; Ultrafast = 6× (astra et 6.1-sol uniquement). Contexte long (au-delà du seuil) : astra 20/2/75, 6.1-sol 4/0,20/15, luna 0,20/0,02/0,75.
- **Images :** gpt-image-2.5 (sunburst/flare) 8 $ input image / 30 $ output image ; gpt-image-2 4 $ / 15 $.
- **Realtime :** gpt-realtime-2.1 audio 32 $ in / 64 $ out ; mini 10 $ / 20 $ ; gpt-live-1 0,05 $/min.
- **Transcription :** gpt-transcribe 0,0045 $/min ; gpt-live-transcribe 0,017 $/min ; gpt-realtime-translate 0,034 $/min.
- **Fine-tuning :** « OpenAI arrête progressivement sa plateforme de fine-tuning ; les nouveaux utilisateurs n'y ont plus accès. » Seul `o4-mini-2025-04-16` reste tarifé (100 $/h d'entraînement ; 4 / 1 / 16 $).
- **Outils :** web search 10 $/1 000 appels (+ tokens) ; file search 2,50 $/1 000 appels + 0,10 $/GB/jour (1 GB gratuit) ; code interpreter / hosted shell 0,03 → 1,92 $ par session selon RAM ; ChatKit stockage 0,10 $/GB-jour.
- Embeddings, mini/nano, TTS : **non listés** sur la page au 1er nov. 2026.

### A.4 Guides clés (URLs lues sur la page d'accueil doc ✅)

| Thème | URL | Statut |
|---|---|---|
| Responses API — migration depuis Chat Completions | https://developers.openai.com/api/docs/guides/migrate-to-responses | ✅ |
| Génération de texte | https://developers.openai.com/api/docs/guides/text | 🔗 |
| Streaming | https://developers.openai.com/api/docs/guides/streaming-responses | 🔗 |
| État de conversation | https://developers.openai.com/api/docs/guides/conversation-state | 🔗 |
| Background mode | https://developers.openai.com/api/docs/guides/background | 🔗 |
| Function calling (Agents API › Functions) | https://developers.openai.com/api/docs/guides/agents-api/tools/functions | ✅ |
| Structured outputs | https://developers.openai.com/api/docs/guides/structured-outputs | ✅ |
| Embeddings | https://developers.openai.com/api/docs/guides/embeddings | 🔗 |
| Images & vision | https://developers.openai.com/api/docs/guides/images-vision | 🔗 |
| Génération d'images | https://developers.openai.com/api/docs/guides/image-generation | 🔗 |
| Audio & parole | https://developers.openai.com/api/docs/guides/audio | 🔗 |
| Speech-to-text | https://developers.openai.com/api/docs/guides/speech-to-text | 🔗 |
| Text-to-speech | https://developers.openai.com/api/docs/guides/text-to-speech | 🔗 |
| Realtime (démarrage) | https://developers.openai.com/api/docs/guides/realtime | 🔗 |
| Realtime + MCP | https://developers.openai.com/api/docs/guides/realtime-mcp | 🔗 |
| Agents (vue d'ensemble) | https://developers.openai.com/api/docs/guides/agents | 🔗 |
| Agents SDK | https://developers.openai.com/api/docs/guides/agents/sdk | ✅ |
| Agents SDK quickstart | https://developers.openai.com/api/docs/guides/agents/quickstart | 🔗 |
| Guardrails & approbations | https://developers.openai.com/api/docs/guides/agents/guardrails-approvals | 🔗 |
| Agents SDK Python (GitHub) | https://github.com/openai/openai-agents-python | 🔗 |
| Agents SDK TypeScript (GitHub) | https://github.com/openai/openai-agents-js | 🔗 |
| Optimisation de modèle / fine-tuning | https://developers.openai.com/api/docs/guides/model-optimization | 🔗 |
| Supervised fine-tuning | https://developers.openai.com/api/docs/guides/supervised-fine-tuning | 🔗 |
| DPO | https://developers.openai.com/api/docs/guides/direct-preference-optimization | 🔗 |
| Reinforcement fine-tuning | https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning | 🔗 |
| Batch | https://developers.openai.com/api/docs/guides/batch | 🔗 |
| Evals — démarrage | https://developers.openai.com/api/docs/guides/evaluation-getting-started | 🔗 |
| Evals | https://developers.openai.com/api/docs/guides/evals | 🔗 |
| Safety best practices | https://developers.openai.com/api/docs/guides/safety-best-practices | ✅ |
| Rate limits | https://developers.openai.com/api/docs/guides/rate-limits | 🔗 |
| Chat Completions (legacy) — audio | https://developers.openai.com/api/docs/guides/audio-chat-completions | 🔗 |
| Predicted outputs | https://developers.openai.com/api/docs/guides/predicted-outputs | 🔗 |

**Responses vs Chat Completions (✅)** : Chat Completions = tableau `messages` → `choices` ; Responses = `Items` typés (message, reasoning, function call, function result) → tableau `output` + helper `output_text`. `response_format` devient `text.format` ; pas de paramètre `n` ; état via `previous_response_id` ou API Conversations ; stockage par défaut (`store: false` pour désactiver). Pourquoi migrer : ~3 % de gain SWE-bench à prompt identique, boucle agentique intégrée (plusieurs outils dans une requête), 40–80 % de meilleure utilisation du cache, raisonnement chiffré pour ZDR. Outils intégrés : `web_search`, `file_search`, computer use, `code_interpreter`, `image_generation`, MCP distant. **Assistants API** : reléguée en « Legacy APIs » avec guide de migration ; aucune date de fin sur cette page (voir page Deprecations).

**Structured outputs (✅)** : `text.format = {type: "json_schema", name, schema, strict: true}` ; `additionalProperties: false` et tous les champs `required` ; helpers `pydantic BaseModel` (Python) et `zod` + `zodTextFormat` (JS).

**Agents SDK (✅)** : Python et TypeScript ; primitives Agents, Handoffs, Guardrails, Results & state, Running agents (streaming), sandboxes conteneurisés, pipeline vocal, intégrations d'observabilité/traces. S'exécute dans votre app (vs Agents API = harnais géré côté OpenAI).

**Safety best practices (✅)** — 11 rubriques : Moderation API gratuite ; adversarial testing ; human in the loop ; prompt engineering ; KYC ; contraindre l'entrée et limiter les tokens de sortie ; signalement utilisateur ; communiquer les limites ; safety identifiers ; révocation de clés compromises ; CSAM guidance.

### A.5 OpenAI Academy et certifications

| Ressource | URL | Statut |
|---|---|---|
| OpenAI Academy (accueil) | https://academy.openai.com/ | ✅ |
| Catalogue des cours | https://academy.openai.com/pages/courses | ✅ |
| Guide de déploiement des cours (organisations) | https://academy.openai.com/home/clubs/champions-ecqup/resources/openai-academy-courses-champion-deployment-guide-2026-06-11 | 🔗 |
| Annonce officielle « certificate courses » | https://openai.com/index/openai-certificate-courses/ | ⚠️ (citée par 3 sources, refusée au chargement) |
| Aide : « OpenAI Academy courses » | https://help.openai.com/en/articles/20001270-openai-academy-courses | ⚠️ (refusée au chargement) |
| Aide : « OpenAI Certified app » | https://help.openai.com/en/articles/20001151-openai-certified-app | ⚠️ (trouvée en recherche, non ouverte) |
| Analyse tierce (17 oct. 2026) | https://bestaicertifications.com/openai-certification/ | ✅ |
| Analyse tierce (12 juil. 2026) | https://findskill.ai/blog/openai-certification-guide/ | ✅ |
| Analyse tierce (9 déc. 2025) | https://www.gend.co/blog/openai-certifications-ai-foundations-2026 | ✅ |
| TechRepublic (annonce 22 déc. 2025) | https://www.techrepublic.com/article/news-openai-chatgpt-training-certifications/ | ✅ |

**Quatre parcours Academy (✅)** : « Apply AI at Work » (knowledge workers), « Build with AI » (développeurs : Codex + API), « Lead AI Adoption » (dirigeants), « Teach and Learn with AI » (éducation). Gratuit avec un compte ChatGPT.

**Cours gratuits avec badge (sources tierces ✅ concordantes)** : depuis le 12 juin 2026, trois cours en libre-service : **AI Foundations** (~70 min, évaluation 20 questions par scénarios, 80 % requis, tentatives illimitées), **Applied AI Foundations**, **Agents and Workflows**. Depuis le 21 septembre 2026 : badge « OpenAI Academy course badge » via Accredible/Credly. OpenAI précise que ces badges « are not OpenAI Certifications ».

**« OpenAI Certification » (formelle, sur invitation)** : annoncée le 4 sept. 2025 (objectif 10 M d'Américains certifiés d'ici 2030), premiers cours le 9 déc. 2025 ; passe par l'app « OpenAI Certified » dans ChatGPT Enterprise/Edu ; pilotes Walmart, Lowe's, BCG, Accenture, John Deere, Hearst, Upwork, État du Delaware/New Jersey, ASU, CSU. Partenaires psychométrie : **ETS** ; badges : **Credly by Pearson** ; diffusion : Coursera. Format = cours + projet pratique, couche d'examen surveillé en développement. **Prix : non publié. Domaines officiels : non publiés.** Disponibilité générale estimée fin 2026 / 2027 (source findskill). **ChatGPT Foundations for Teachers** (K-12, Coursera) disponible.

#### Référentiel / domaines évalués — AI Foundations (reconstitué, non officiel)
Compétences citées par les sources ✅ : rédiger des instructions claires et ajouter du contexte ; relire/critiquer les sorties ; usage responsable ; transformer des notes en plans d'action ; recherche sourcée et notes de décision ; visuels et schémas de processus ; résumés avec citations ; tâches tableur/données ; automatisation légère ; conception de workflows réutilisables ; délégation à des agents (Agents and Workflows : contexte, production attendue, limites, relecture, réutilisation).

---

## B. xAI Grok

### B.1 Portail et structure (page Quickstart ✅)

| Ressource | URL | Statut |
|---|---|---|
| Introduction | https://docs.x.ai/developers/introduction | ✅ |
| Quickstart | https://docs.x.ai/developers/quickstart | ✅ |
| Modèles | https://docs.x.ai/developers/models | ✅ |
| Tarifs | https://docs.x.ai/developers/pricing | ✅ |
| Release notes | https://docs.x.ai/developers/release-notes | 🔗 |
| Génération de texte (chat multi-tours) | https://docs.x.ai/developers/model-capabilities/text/generate-text | 🔗 |
| Streaming | https://docs.x.ai/developers/model-capabilities/text/streaming | 🔗 |
| Raisonnement | https://docs.x.ai/developers/model-capabilities/text/reasoning | 🔗 |
| Structured outputs | https://docs.x.ai/developers/model-capabilities/text/structured-outputs | 🔗 |
| Compréhension d'images (vision) | https://docs.x.ai/developers/model-capabilities/images/understanding | 🔗 |
| Multi-agent | https://docs.x.ai/developers/model-capabilities/text/multi-agent | 🔗 |
| Bonnes pratiques | https://docs.x.ai/developers/model-capabilities/text/best-practices | 🔗 |
| Comparaison / migration vers Responses | https://docs.x.ai/developers/model-capabilities/text/comparison | 🔗 |
| Chat Completions (legacy) | https://docs.x.ai/developers/model-capabilities/legacy/chat-completions | 🔗 |
| Outils — vue d'ensemble | https://docs.x.ai/developers/tools/overview | 🔗 |
| Function calling | https://docs.x.ai/developers/tools/function-calling | 🔗 |
| Web search (ex-« Live Search », outil agentique) | https://docs.x.ai/developers/tools/web-search | 🔗 |
| X search | https://docs.x.ai/developers/tools/x-search | 🔗 |
| Exécution de code | https://docs.x.ai/developers/tools/code-execution | 🔗 |
| Génération d'images | https://docs.x.ai/developers/tools/image-generation | 🔗 |
| Collections search (RAG) | https://docs.x.ai/developers/tools/collections-search | 🔗 |
| MCP distant | https://docs.x.ai/developers/tools/remote-mcp | 🔗 |
| Rate limits | https://docs.x.ai/developers/rate-limits | 🔗 |
| Debugging | https://docs.x.ai/developers/debugging | 🔗 |
| Suivi des coûts | https://docs.x.ai/developers/cost-tracking | 🔗 |
| Batch API | https://docs.x.ai/developers/advanced-api-usage/batch-api | 🔗 |
| Cookbook | https://docs.x.ai/cookbook | 🔗 |
| Console | https://console.x.ai | 🔗 |
| Clés API (console) | https://console.x.ai/team/default/api-keys | 🔗 |

**Quickstart (✅)** : quatre options — Vercel AI SDK (`ai` + `@ai-sdk/xai`), SDK OpenAI JS, SDK OpenAI Python (`base_url="https://api.x.ai/v1"`), `xai-sdk` Python. Clé dans `XAI_API_KEY`. Premier appel `client.responses.create(model="grok-4.7", ...)` → `response.output_text`. Exemple image avec `grok-imagine-image-2.0`. **Compatibilité OpenAI SDK : oui (Responses + Chat Completions legacy). Compatibilité Anthropic SDK : non mentionnée dans la doc actuelle.**

### B.2 Modèles et tarifs (pages Models + Pricing ✅, USD / 1 M tokens)

| Modèle | Contexte | Input | Cached | Output | Input ≥ 200 k | Output ≥ 200 k |
|---|---|---|---|---|---|---|
| grok-4.7 (phare, cutoff mai 2026) | 500 k | 2,00 | 0,50 | 6,00 | 4,00 | 12,00 |
| grok-4.6 (sorti 12 août 2026) | 500 k | 2,00 | 0,50 | 6,00 | 4,00 | 12,00 |
| grok-4.5 | 500 k | 2,00 | 0,30 | 6,00 | 4,00 | 12,00 |
| grok-build-0.1 (alias grok-code-fast-1) | 256 k | 1,00 | 0,20 | 2,00 | 2,00 | 4,00 |
| grok-4.3 | 1 M | 1,25 | 0,20 | 2,50 | 2,50 | 5,00 |
| grok-4.20 (variantes 0309) | 1 M | 1,25 | 0,20 | 2,50 | 2,50 | 5,00 |

- grok-4.7 : `reasoning_effort` configurable, appels d'outils agentiques, renvoie toujours `reasoning.encrypted_content` sur Responses ; `logprobs` non supportés depuis grok-4.20. Images acceptées : JPG/PNG ≤ 20 MiB.
- **Outils serveur :** `web_search` 5 $/1 000 appels ; `x_search` 5 $/1 000 posts, 10 $/1 000 profils ; `code_execution` 5 $/1 000 ; `collections_search` 2,50 $/1 000 ; `attachment_search` 5 $/1 000.
- **Imagine :** `grok-imagine-image-2.0` 0,04–0,08 $/image ; `grok-imagine-image` 0,02 $ ; vidéo Grok Imagine Video 1.5 à partir de 0,02 $/s. **Voice API :** STS 0,08 $/min ; TTS 15 $/1 M caractères ; STT batch 0,10 $/h, streaming 0,20 $/h.
- **Batch :** –20 % sur grok-4.7/4.6/4.5/4.3/4.20 ; hors rate limits. Priority = 2× ; endpoint régional US = 1,1×.
- Stockage fichiers 0,025 $/GiB/jour ; collections 0,10 $/GiB/jour.
- Source tierce de recoupement (21 août 2026) : https://www.morphllm.com/grok-api-pricing ✅ ; changements de prix mai/août 2026 : https://costbench.com/changelog/xai-api-price-increase-2026-08/ (trouvée en recherche, non ouverte ⚠️).

---

## C. Perplexity

### C.1 Changement de paradigme : fin de Sonar Chat Completions

Page « Migrate from Sonar » ✅ https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview.md : **fin de support le 27 septembre 2026**. Les requêtes synchrones/streaming sont reformulées vers l'Agent API ; l'asynchrone n'est plus supporté (→ background mode). Équivalences : `sonar` → effort `fast` ; `sonar-pro` → `fast` ; `sonar-reasoning-pro` → `low` ; `sonar-deep-research` → `high` (`xhigh` pour la meilleure qualité). `perplexity/sonar` reste disponible **dans l'Agent API** à 0,25 $ in / 2,50 $ out.

### C.2 Pages clés (index llms.txt ✅ https://docs.perplexity.ai/llms.txt)

| Thème | URL | Statut |
|---|---|---|
| Vue d'ensemble | https://docs.perplexity.ai/docs/getting-started/overview.md | 🔗 |
| Quickstart | https://docs.perplexity.ai/docs/getting-started/quickstart.md | 🔗 |
| Tarifs | https://docs.perplexity.ai/getting-started/pricing | ✅ |
| Tarifs (version .md) | https://docs.perplexity.ai/docs/getting-started/pricing.md | ✅ |
| Projets & facturation | https://docs.perplexity.ai/docs/getting-started/projects.md | 🔗 |
| Rate limits & usage tiers | https://docs.perplexity.ai/docs/admin/rate-limits-usage-tiers.md | 🔗 |
| Agent API — quickstart | https://docs.perplexity.ai/docs/agent-api/quickstart.md | 🔗 |
| Agent API — modèles & tarifs | https://docs.perplexity.ai/docs/agent-api/models.md | ✅ |
| Agent API — effort | https://docs.perplexity.ai/docs/agent-api/effort.md | 🔗 |
| Agent API — outils (overview) | https://docs.perplexity.ai/docs/agent-api/tools/overview.md | 🔗 |
| Agent API — web_search | https://docs.perplexity.ai/docs/agent-api/tools/web-search.md | 🔗 |
| Agent API — MCP | https://docs.perplexity.ai/docs/agent-api/tools/mcp.md | 🔗 |
| Agent API — custom functions | https://docs.perplexity.ai/docs/agent-api/tools/custom-functions.md | 🔗 |
| Agent API — output control (structured) | https://docs.perplexity.ai/docs/agent-api/output-control.md | 🔗 |
| Agent API — conversation state | https://docs.perplexity.ai/docs/agent-api/conversation-state.md | 🔗 |
| Agent API — batch | https://docs.perplexity.ai/docs/agent-api/batch.md | 🔗 |
| Agent API — compatibilité OpenAI | https://docs.perplexity.ai/docs/agent-api/openai-compatibility.md | 🔗 |
| Agent API — prompt guide | https://docs.perplexity.ai/docs/agent-api/prompt-guide.md | 🔗 |
| Orchestrator (Router) — modèles | https://docs.perplexity.ai/docs/router/models.md | 🔗 |
| Search API — overview | https://docs.perplexity.ai/docs/search/overview.md | 🔗 |
| Search API — quickstart | https://docs.perplexity.ai/docs/search/quickstart.md | 🔗 |
| Search API — Fast Search | https://docs.perplexity.ai/docs/search/fast-search.md | 🔗 |
| Search API — filtres (domaine, date, langue) | https://docs.perplexity.ai/docs/search/filters/domain-filter.md | 🔗 |
| Embeddings — quickstart | https://docs.perplexity.ai/docs/embeddings/quickstart.md | 🔗 |
| Decisions — quickstart | https://docs.perplexity.ai/docs/decisions/quickstart.md | 🔗 |
| SDK — overview | https://docs.perplexity.ai/docs/sdk/overview.md | 🔗 |
| MCP server Perplexity | https://docs.perplexity.ai/docs/getting-started/integrations/mcp-server.md | 🔗 |
| Intégration n8n | https://docs.perplexity.ai/docs/getting-started/integrations/n8n.md | 🔗 |
| Cookbook — streaming citations | https://docs.perplexity.ai/docs/cookbook/articles/streaming-citations/README.md | 🔗 |
| Cookbook — index | https://docs.perplexity.ai/docs/cookbook/index.md | 🔗 |

### C.3 Tarifs (✅)

- **Search API** : 5 $/1 000 requêtes réussies ; Fast Search (`search_type: "fast"`) 1 $/1 000 ; jusqu'à 5 requêtes par appel comptées pour 1.
- **Agent API — outils** : `web_search` 2,50 $/1 000 (fast 1 $/1 000) ; `image_search` 2,50 $/1 000 ; `fetch_url` 0,0005 $/appel ; `people_search` 5 $/1 000 ; `finance_search` 5 $/1 000 ; `sandbox` 0,03 $/session 20 min. Tiers `flex` 0,5× / `priority` 2× sur les tokens (modèles OpenAI).
- **Agent API — modèles (extrait)** : `openai/gpt-6-astra` 10/50 ; `openai/gpt-6.1-sol` 2/10 ; `openai/gpt-6-luna` 0,10/0,50 ; `google/gemini-4-argon` 2/10 (promo jusqu'au 30/11/2026) ; `google/gemini-3.8-flash` 0,75/3,75 ; `xai/grok-4.7` 2/6 ; `perplexity/glm-5.3` 1,40/4,40 ; `perplexity/deepseek-v4-pro-0813` 1,32/3,96 ; `perplexity/kimi-k3` 3/15 ; `perplexity/nemotron-3.5-super-120b-a12b` 0,20/0,50 ; `perplexity/sonar` 0,25/2,50 ; modèles Anthropic aussi routés (exigent `max_output_tokens`).
- **Embeddings** : `pplx-embed-v1-0.6b` 0,004 $ ; `pplx-embed-v1-4b` 0,03 $ ; `pplx-embed-context-v1-0.6b` 0,008 $ ; `pplx-embed-context-v1-4b` 0,05 $ (par 1 M tokens).
- **Decisions** : `pplx-decider-v1.2` 0,02 $ ; `pplx-decider-flash-v1.2` 0,01 $ (input ; output gratuit).
- Perplexity Labs / Comet / offres grand public : **non couverts** (⚠️ voir section G).

---

## D. Mistral AI, Google Gemini, Hugging Face

### D.1 Mistral AI

| Ressource | URL | Statut |
|---|---|---|
| Models overview | https://docs.mistral.ai/getting-started/models/ | ✅ |
| Catalogue modèles | https://docs.mistral.ai/models | ✅ |
| Tarifs | https://docs.mistral.ai/inference/pricing | ✅ |
| Guide de sélection | https://docs.mistral.ai/inference/model-selection-guide | 🔗 |
| Cycle de vie des modèles | https://docs.mistral.ai/inference/model-lifecycle | 🔗 |
| Inférence (section) | https://docs.mistral.ai/inference | 🔗 |
| Prompting | https://docs.mistral.ai/inference/prompting | 🔗 |
| Regional inference | https://docs.mistral.ai/inference/regional-inference | 🔗 |
| Priority tier | https://docs.mistral.ai/inference/priority-tier | 🔗 |
| Référence API | https://docs.mistral.ai/api | 🔗 |
| Codestral 25.08 | https://docs.mistral.ai/models/codestral-25-08 | 🔗 |
| OCR 4.1 | https://docs.mistral.ai/models/ocr-4-1 | 🔗 |
| Voxtral Mini Transcribe 3 | https://docs.mistral.ai/models/voxtral-mini-transcribe-3-0 | 🔗 |
| Voxtral TTS 3 | https://docs.mistral.ai/models/voxtral-mini-tts-3-0 | 🔗 |
| Mistral Embed | https://docs.mistral.ai/models/mistral-embed-23-12 | 🔗 |
| Codestral Embed | https://docs.mistral.ai/models/codestral-embed-25-05 | 🔗 |
| Vibe (CLI de code) | https://docs.mistral.ai/vibe | 🔗 |
| AI Studio (ex-La Plateforme, doc) | https://docs.mistral.ai/studio | 🔗 |
| Console AI Studio | https://console.mistral.ai | 🔗 |
| Fine-tuning, agents, Le Chat (pages doc) | — | ⚠️ non atteintes (non listées dans la navigation lue) |

**Modèles (✅, 1er nov. 2026)** : Mistral Large 4 (v26.10, Mistral Ecosystem Open Weight License, multimodal) ; Mistral Small 4 (v26.03, Apache 2.0, hybride instruct/raisonnement/code) ; Ministral 3 14B/8B/3B (v25.12, Apache 2.0, texte+vision) ; modèles tiers hébergés Z.ai GLM 5.3 / GLM 5.3 Flash et DeepSeek V4.1 Flash 1017 (1 M contexte) ; OCR 4.1 et OCR 3 ; Voxtral Mini/Small Transcribe 3, Voxtral Mini Transcribe Realtime 3, Voxtral TTS 3, Voxtral Small ; Codestral v25.08 ; Codestral Embed, Mistral Embed ; Shieldstral 1.0 et Mistral Moderation 2 ; Timestral 1.0 (séries temporelles). Dépréciations : `mistral-medium-2508` retiré 31/08/2026, `devstral-2512` et `mistral-small-2506` retirés 31/07/2026, `mistral-medium-3-5` retrait 30/04/2027 → Mistral Large 4.

**Tarifs (✅, USD / 1 M tokens, input / cached / output)** : Mistral Large 4 0,70 / 0,07 / 2,10 ; Mistral Small 4 0,15 / 0,015 / 0,60 ; Ministral 3 14B 0,20 / 0,02 / 0,20 ; 8B 0,15 ; 3B 0,10 ; Codestral 0,30 / 0,03 / 0,90 ; GLM 5.3 1,40 / 0,14 / 4,40 ; GLM 5.3 Flash 0,15 / 0,03 / 0,50 ; DeepSeek V4.1 Flash 0,30 / 0,007 / 1,20. OCR 4.1 4 $/1 000 pages ; OCR 3 2 $/1 000 pages. Voxtral Mini Transcribe 3 0,0035 $/min ; Realtime 0,008 $/min ; Small Transcribe 0,004 $/min ; TTS 3 13 $/1 M caractères. Embeddings : Codestral Embed 0,15 $ ; Mistral Embed 0,10 $. Moderation 2 gratuit. Voice agents 0,04 $/min (Small 4) – 0,08 $/min. Tiers Standard / Batch / Priority ; devise USD/EUR. **Fine-tuning : non tarifé sur la page lue.**

### D.2 Google Gemini (ai.google.dev)

| Ressource | URL | Statut |
|---|---|---|
| Modèles | https://ai.google.dev/gemini-api/docs/models | ✅ |
| Fiche Gemini 3.8 Flash | https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash | ✅ |
| Tarifs | https://ai.google.dev/gemini-api/docs/pricing | ✅ (page tronquée : embeddings/Veo/Imagen/Lyria non lus) |
| Quickstart | https://ai.google.dev/gemini-api/docs/get-started | 🔗 |
| Génération de texte | https://ai.google.dev/gemini-api/docs/text-generation | 🔗 |
| Function calling | https://ai.google.dev/gemini-api/docs/function-calling | 🔗 |
| Structured output | https://ai.google.dev/gemini-api/docs/structured-output | 🔗 |
| Embeddings | https://ai.google.dev/gemini-api/docs/embeddings | 🔗 |
| Génération d'images | https://ai.google.dev/gemini-api/docs/image-generation | 🔗 |
| Live API | https://ai.google.dev/gemini-api/docs/live-api | 🔗 |
| Files API | https://ai.google.dev/gemini-api/docs/files | 🔗 |
| Grounding Google Search | https://ai.google.dev/gemini-api/docs/google-search | 🔗 |
| Context caching | https://ai.google.dev/gemini-api/docs/caching | 🔗 |
| Batch API | https://ai.google.dev/gemini-api/docs/batch-api | 🔗 |
| Gemini CLI — quotas & tarifs | https://geminicli.com/docs/resources/quota-and-pricing | 🔗 (redirection depuis https://geminicli.com/docs/quota-and-pricing ✅) |
| Gemini CLI — dépôt GitHub | https://github.com/google-gemini/gemini-cli | ⚠️ (non ouvert ; seuls des forks sont apparus en recherche) |

**Modèles stables (✅)** : `gemini-4-argon` (phare, raisonnement, contexte unifié 1 M) ; `gemini-3.8-flash` (1 048 576 in / 65 536 out ; texte, image, vidéo, audio, PDF ; function calling, structured outputs, Google Search, Maps, exécution de code, computer use, file search, URL context, caching, thinking low/medium/high ; batch/flex/priority) ; `gemini-3.8-live`, `gemini-3.8-live-extended-thinking` ; `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts` ; `gemini-3.6-flash` ; `gemini-3.5-flash-lite` ; `gemini-3.1-flash-lite` ; images Nano Banana 2.1 (`gemini-nano-banana-2.1`), Nano Banana 2 (`gemini-3.1-flash-image`), Nano Banana 2 Lite, Nano Banana Pro (`gemini-3-pro-image`) ; `gemini-3.5-transcribe(-live)` ; vidéo `gemini-omni-1.1-flash`. Preview : `gemini-3-flash-preview`, `gemini-3.1-pro-preview`, `gemini-3.5-live-translate-preview`, `gemini-robotics-er-2-preview`. Embeddings : `gemini-embedding-2` (multimodal), `gemini-embedding-001`. Musique : `lyria-3.5`. Agents : `deep-research-preview-04-2026`, `antigravity-preview-09-2026`. Gemini 2.5 en accès limité, recommandation de migrer vers 3.5 Flash-Lite ou 3.8 Flash.

**Tarifs (✅, USD / 1 M tokens, Standard ; « → » = hausse annoncée au 1er déc. 2026 pour Argon et 1er janv. 2027 pour les autres)** : `gemini-4-argon` 2,00 → 4,00 / 10,00 → 20,00 (pas de free tier) ; `gemini-3.8-flash` 0,75 → 1,50 / 3,75 → 7,50 (free tier) ; `gemini-3.6-flash` idem ; `gemini-3.5-flash-lite` 0,30 / 2,50 ; `gemini-3.1-flash-lite` 0,25 / 1,50 ; `gemini-3.1-pro-preview` 2,00 (≤ 200 k) / 12,00. Batch et Flex ≈ 0,5× ; Priority ≈ 1,8×. Live 3.8 : audio 3 $/M in, 12 $/M out. TTS 3.8 Flash : 0,50 in / 9,00 out. Nano Banana 2.1 : 30 $/M tokens image (~0,034 $ par image 1K). Grounding Google Search / Maps : 5 000 requêtes gratuites/mois puis 14 $/1 000.

### D.3 Hugging Face

| Ressource | URL | Statut |
|---|---|---|
| Hugging Face Learn (catalogue) | https://huggingface.co/learn | ✅ |
| LLM Course | https://huggingface.co/learn/llm-course | ✅ |
| Agents Course | https://huggingface.co/learn/agents-course | ✅ |
| a smol course | https://huggingface.co/learn/smol-course | ✅ |
| MCP Course | https://huggingface.co/learn/mcp-course/unit0/introduction | ✅ |
| MCP Course — certificat unité 1 | https://huggingface.co/learn/mcp-course/unit1/certificate | 🔗 |
| Deep RL Course | https://huggingface.co/learn/deep-rl-course | ⚠️ (listée sur /learn ✅ ; la page elle-même a renvoyé une erreur au chargement) |
| Context Course (context engineering pour agents de code) | https://huggingface.co/learn/context-course | 🔗 |
| Robotics Course (LeRobot) | https://huggingface.co/learn/robotics-course | 🔗 |
| Community Computer Vision Course | https://huggingface.co/learn/computer-vision-course | 🔗 |
| Audio Course | https://huggingface.co/learn/audio-course | 🔗 |
| Diffusion Course | https://huggingface.co/learn/diffusion-course | 🔗 |
| ML for Games / ML for 3D | https://huggingface.co/learn/ml-games-course · https://huggingface.co/learn/ml-for-3d-course | 🔗 |
| Open-Source AI Cookbook | https://huggingface.co/learn/cookbook | 🔗 |
| Hub — inférence depuis les pages de modèles | https://huggingface.co/docs/hub/models-inference | ✅ |
| Inference Providers — premier appel | https://huggingface.co/docs/inference-providers/main/guides/first-api-call | ✅ |
| Inference Providers — tarifs | https://huggingface.co/docs/inference-providers/pricing | ✅ |
| Inference Providers — intégration Hub | https://huggingface.co/docs/inference-providers/hub-integration | 🔗 |
| HF-Inference (ex-Inference API serverless) | https://huggingface.co/docs/inference-providers/providers/hf-inference | 🔗 |
| Réglages Inference Providers (compte) | https://hf.co/settings/inference-providers | 🔗 |

**Plans de cours (✅)**
- **LLM Course** — chapitres 0 Setup ; 1 Transformer models ; 2 Using 🤗 Transformers ; 3 Fine-tuning a pretrained model ; 4 Sharing models and tokenizers ; 5 The 🤗 Datasets library ; 6 The 🤗 Tokenizers library ; 7 Classical NLP tasks ; 8 How to ask for help ; 9 Building and sharing demos ; 10 Curate high-quality datasets ; 11 Fine-tune Large Language Models ; 12 Build Reasoning Models (new). Prérequis Python ; 6–8 h/semaine. Quiz et « Certification exam » au chapitre 1 ; la FAQ indique qu'un programme de certification écosystème est en préparation.
- **Agents Course** — Unité 0 accueil ; 1 Introduction aux agents ; 2 Frameworks (2.1 smolagents, 2.2 LlamaIndex, 2.3 LangGraph) ; 3 RAG agentique ; 4 Projet final ; bonus : fine-tuning pour function calling, observabilité & évaluation, agents dans les jeux (Pokémon). Certificat fondamental = unité 1 ; certificat de réussite = unité 1 + un devoir de cas d'usage + défi final. Gratuit, sans date limite.
- **a smol course** (post-training) — 1 Instruction Tuning (SFT, chat templates) ; 2 Evaluation ; 3 Preference Alignment (DPO) ; 4 Vision Language Models ; 5 Reinforcement Learning (oct.) ; 6 Synthetic Data (nov.) ; 7 Award Ceremony (déc.). Bibliothèques Transformers, TRL, PEFT ; 3–4 h/semaine ; certificats Fundamentals (unité 1) et Completion (toutes unités + projet).
- **MCP Course** — Unité 0 Welcome ; 1 Introduction to Model Context Protocol ; 2 Use Case: End-to-End MCP Application ; 3 Advanced MCP Development: Custom Workflow Servers ; 3.1 Build a Pull Request Agent on the Hub. Certificat fondamentaux = unité 1 ; completion = unités 2 et 3. Python ou TypeScript.
- **Deep RL Course** — plan non lu (page en erreur) ⚠️.

**Inference Providers (✅)** : accès unifié (Fal, Replicate, Groq, Together, Cerebras, DeepInfra, Fireworks, Novita, Scaleway…) via `InferenceClient(provider="auto")` (`pip install huggingface_hub`, `@huggingface/inference` en JS) ; endpoint compatible OpenAI `https://router.huggingface.co/v1`. Crédits : Free = 0 $ (achat de crédits requis) ; PRO = 2 $/mois ; Team/Enterprise = 2 $/siège ; tarifs = ceux du fournisseur sans marge ; en-tête `X-HF-Bill-To` pour facturer une organisation.

---

## E. n8n, Make, Zapier

### E.1 n8n Academy (learn.n8n.io) — remplace les cours « Level 1 / Level 2 »

Les anciennes URLs https://docs.n8n.io/courses/level-one et https://docs.n8n.io/courses/level-two **redirigent (302) vers https://learn.n8n.io/** (✅ constaté). Annonce soft launch : https://community.n8n.io/t/the-n8n-academy-is-here/299695 ✅ (16 juin 2026) ; retrait des cours texte et badges forum : https://community.n8n.io/t/retiring-the-text-courses-and-forum-badges/299962 🔗 ; forum Academy : https://community.n8n.io/c/n8n-academy/41 🔗.

| Code | Titre exact | URL (✅ sauf QS101 🔗) | Durée | Prérequis |
|---|---|---|---|---|
| QS101 | n8n Quickstart | https://learn.n8n.io/courses/course-v1:n8n+QS101+2026H2/about | — | — |
| N8N101 | Essentials: Your First Workflows | https://learn.n8n.io/courses/course-v1:n8n+N8N101+2026H2/about | 2–4 h | aucun ; instance n8n Cloud (essai) ou self-hosted ; API de test fournies |
| N8N102 | Integrations: APIs & Connected Workflows | https://learn.n8n.io/courses/course-v1:n8n+N8N102+2026H2/about | 4–6 h | N8N101 recommandé |
| N8N103 | In Practice: AI, Testing & Best Practices | https://learn.n8n.io/courses/course-v1:n8n+N8N103+2026H2/about | 3–4 h | N8N101 + N8N102 ; clé API LLM (Groq dans les exemples ; OpenAI/Anthropic/Gemini/OpenRouter acceptés) |

- **Programme « n8n Foundations »** = N8N101 + N8N102 + N8N103. Catalogue : https://learn.n8n.io/courses 🔗.
- **Évaluation (identique pour les trois)** : quiz de section 10 % ; exercices pratiques 55 % ; examen final 35 % ; **70 % requis** ; exercices à terminer avant les quiz. Badge Accredible + certificat de complétion automatique (« not a certification »). **Prix : non affiché** (inscription « Enroll Now » ; n8n Cloud en essai gratuit, self-hosting gratuit).
- **Certification officielle (examen chronométré)** : annoncée pour T3 2026, **repoussée à fin T4 2026** (réponse n8n du 5 oct. 2026) — https://community.n8n.io/t/no-official-n8n-certification-yet/318573?tl=en ✅. Page éducation : https://n8n.io/education/ 🔗 (« coming soon »).

**Chapitres (✅)**
- N8N101 — Section 1 Getting started with n8n (canvas, nœuds, connexions, exécutions, triggers, scheduling, credentials) ; Section 2 Data flow & Transformation (structure des données, expressions, mapping, merge, binaires).
- N8N102 — Section 1 Exécution et logique (ordre séquentiel/parallèle, sous-workflows, IF, Switch, Loop Over Items, Wait, Error Trigger, Stop and Error, Merge, Split Out, Aggregate, Filter, Summarize, nœud Code JS/Python) ; Section 2 APIs, authentification, intégration (GET/POST/PUT/PATCH/DELETE, clé API, OAuth2, Bearer, pagination, Webhook Trigger, credentials, Data Tables).
- N8N103 — Section 1 Introduction à l'IA (nœuds IA, AI Agent node + outils + mémoire, chaînes vs agents, bonnes pratiques) ; Section 2 Tests et débogage (journal d'exécution, debugger, Try/Catch) ; Section 3 Organisation et bonnes pratiques (nommage, dossiers, tags, sous-workflows, documentation, publication, planification, monitoring, récupération) ; examen final.

### E.2 Documentation n8n — IA, MCP, hébergement (index ✅ https://docs.n8n.io/llms.txt)

| Thème | URL | Statut |
|---|---|---|
| Learning paths | https://docs.n8n.io/learning-paths | ✅ |
| Build your first workflow | https://docs.n8n.io/build-your-first-workflow.md | 🔗 |
| Intégrer l'IA (hub) | https://docs.n8n.io/build/integrate-ai.md | 🔗 |
| LangChain dans n8n (cluster nodes) | https://docs.n8n.io/build/integrate-ai/langchain-in-n8n.md | ✅ |
| Cluster nodes / root nodes / sub-nodes | https://docs.n8n.io/integrations/builtin/cluster-nodes.md · …/cluster-nodes/root-nodes.md · …/cluster-nodes/sub-nodes.md | 🔗 |
| Nœud AI Agent | https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent.md | 🔗 (refusée au chargement direct) |
| Ce que font les agents | https://docs.n8n.io/build/integrate-ai/understand-ai-components/what-agents-do.md | 🔗 |
| Agents (préversion) — Agent Builder | https://docs.n8n.io/build/build-and-manage-agents.md | ✅ |
| Vector stores & embeddings | https://docs.n8n.io/build/integrate-ai/understand-ai-components/store-and-search-data-with-vectors.md | ✅ |
| Retrieve relevant context (RAG) | https://docs.n8n.io/build/integrate-ai/understand-ai-components/retrieve-relevant-context.md | 🔗 |
| Chat Trigger | https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger.md | 🔗 |
| LangChain Code node | https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.code.md | 🔗 |
| MCP — registre & MCP Client Tool | https://docs.n8n.io/build/integrate-ai/mcp-servers.md | ✅ |
| MCP Server Trigger | https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcptrigger.md | 🔗 |
| MCP Client | https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcpclient.md | 🔗 |
| Serveur MCP de n8n (instance) | https://docs.n8n.io/build/ways-of-building-workflows/connect-to-n8n-mcp-server.md | 🔗 |
| Exemples IA — human in the loop | https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools.md | 🔗 |
| Evaluations (pourquoi tester) | https://docs.n8n.io/build/integrate-ai/test-and-improve-ai-workflows/understand-why-to-test.md | 🔗 |
| Evaluation node / trigger | https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.evaluation.md · …/n8n-nodes-base.evaluationtrigger.md | 🔗 |
| Templates | https://docs.n8n.io/build/ways-of-building-workflows/use-templates.md | 🔗 |
| Data Tables | https://docs.n8n.io/build/work-with-data/data-tables.md | 🔗 |
| Hébergement (hub) | https://docs.n8n.io/deploy/host-n8n.md | 🔗 |
| Options d'installation | https://docs.n8n.io/deploy/host-n8n/install-options.md | 🔗 |
| Docker | https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker.md | ✅ (marquée obsolète → Compose recommandé) |
| Docker Compose | https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md | 🔗 |
| npm | https://docs.n8n.io/deploy/host-n8n/install-options/install-with-npm.md | 🔗 |
| Scaling / queue mode | https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling.md · …/scaling/enable-queue-mode.md | 🔗 |

**Points lus (✅)** : cluster = root node (Chains : Basic LLM, Q&A, Summarization ; AI Agent ; Vector stores Pinecone/Qdrant/Simple) + sub-nodes (chat models Anthropic/OpenAI/Ollama ; memory Postgres/Redis/Simple ; tools Call n8n Workflow/Custom Code/Wikipedia ; retrievers ; embeddings OpenAI/Cohere ; document loaders, output parsers, text splitters). La mémoire ne se connecte qu'à l'AI Agent. MCP : registre de serveurs en un clic depuis le panneau d'outils de l'AI Agent (« Tools to include » : tous / liste / tous sauf) ou MCP Client Tool manuel. **Agents (préversion)** : Agent Builder (modèle, instructions, outils, web search, skills, base de connaissances, mémoire de session/épisodique, sous-agents), canaux Slack/Telegram/Linear/Teams, planification cron, nœud « Message an Agent » ; chaque tour = 1 exécution. Docker : volume `n8n_data` → `/home/node/.n8n`, port 5678, `GENERIC_TIMEZONE`, `N8N_ENCRYPTION_KEY`, PostgreSQL via `DB_TYPE=postgresdb` ; `N8N_RUNNERS_ENABLED` obsolète depuis n8n 2.0.

### E.3 Make Academy (academy.make.com) — gratuit, badges Credly

| Ressource | URL | Statut |
|---|---|---|
| Accueil | https://academy.make.com/ | ✅ |
| Recherche catalogue | https://academy.make.com/pages/search | 🔗 |
| Parcours « Automation to AI Agents: Advanced » | https://academy.make.com/bundles/automation-to-ai-agents-advanced-builder | ✅ |
| Vue d'ensemble des cours (community, 6 mars 2024) | https://community.make.com/t/make-academy-course-overview/29699 | ✅ |
| Annonce « AI Automation Explorer » (8 mars 2026) | https://community.make.com/t/make-academy-news-ai-automation-explorer/105070 | ✅ |

- **Gratuit**, sans abonnement ; 6 mois d'accès par inscription ; badge Credly après toutes les unités + court test.
- **Niveaux et cours (titres exacts ✅)** — *Foundation* : Setting up my first scenario ; Expanding my first scenario ; Introduction to Operations ; Introduction to Make UI. *Make Basics* : Modules, scheduling and bundles ; An introduction to data types and data structures ; Transforming data using functions ; An introduction to aggregators. *Make Intermediate* : Introduction to Iterators and Array aggregators ; Using get() and map() functions ; Introduction to HTTP ; Webhooks ; Error handling ; Intermediate Functions. *Make Advanced* : Data stores and data structures ; API calls with HTTP modules ; Pagination ; Working with Regular Expressions ; Advanced Webhooks.
- **IA** — *Automation to AI Agents: Foundation* : AI Fundamentals ; Mastering LLMs ; Using AI in Make ; AI Agents ; AI, AI agents and automation ; AI Agents in Make. *Automation to AI Agents: Advanced* (~3 h, niveau Experienced, badge **« AI Agent Builder »**) : MCP ; Information management and security ; Context Engineering ; Tools and AI agent settings optimization (20–30 min) ; Design and build a production-ready AI agent (40–60 min) ; AI Agent Builder assessment. *AI Automation Explorer* (parcours, badge **« AI Automation Explorer »**, annoncé 8 mars 2026) : MCP, contexte de conversation et sécurité, connaissances documentaires, context engineering, structure des outils/gestion d'erreurs/choix du modèle, mise en production (tests, coût, fiabilité).

### E.4 Zapier

| Ressource | URL | Statut |
|---|---|---|
| Zapier Academy — AI Builder Path | https://learn.zapier.com/path/ai-builder-path | ✅ (page JS : contenu non rendu) |
| Cours « Building AI Agents » | https://learn.zapier.com/building-ai-agents | ✅ (idem) |
| Cours « Automate your work » | https://learn.zapier.com/automate-your-work | ⚠️ (trouvé en recherche) |
| Solution Partner Program (ex-Zapier Experts) | https://zapier.com/l/new-experts/info | ✅ |
| Coursera « ChatGPT & Zapier: Agentic AI for Everyone » (Vanderbilt) | https://www.coursera.org/learn/agentic-ai-chatgpt-zapier | ⚠️ (trouvé en recherche) |

**Partenaires (✅)** : le « Zapier Experts Program » est renommé **Solution Partner Program** : site web professionnel + e-mail de domaine requis ; « structured certification program » par niveaux (tiered partner framework), formation commerciale et technique ; pas de prix affiché ; commissions, annuaire, badges ; traitement 7–21 jours ouvrés. Aucune certification grand public payante identifiée.

---

## F. Certifications grand public

### F.1 Tableau de synthèse

| Certification | Organisme | Format | Prix | URL officielle | Statut |
|---|---|---|---|---|---|
| Google AI Essentials (spécialisation 5 cours) | Google / Coursera | Cours en ligne, quiz, certificat Google | 49 $/mois (US/CA) après 7 j d'essai ; aide financière possible | https://www.coursera.org/google-specializations/ai-essentials-google | ✅ |
| Google AI Professional Certificate (8 cours) | Google / Coursera | Cours en ligne, recommandé ACE | 49 $/mois ; inclus Coursera Plus | https://www.coursera.org/professional-certificates/google-ai | ✅ |
| Google AI Essentials — page Grow with Google | Google | — | — | https://grow.google/enroll-certificates/ai-essentials-mid/ | ✅ |
| Microsoft Certified: Azure AI Fundamentals — examen **AI-900** | Microsoft | **Retiré le 30 juin 2026** ; score 700/1000 | non affiché | https://learn.microsoft.com/certifications/resources/study-guides/AI-900 | ✅ |
| Microsoft Certified: Azure AI Fundamentals — examen **AI-901** (remplaçant) | Microsoft | Bêta 15 avr. 2026, GA juin 2026 ; 700/1000 | selon pays (non publié globalement) | https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/ | ⚠️ (refusée au chargement ; source tierce ✅ https://open-exam-prep.com/blog/microsoft-azure-ai-fundamentals-ai-901-exam-guide-2026) |
| IBM AI Engineering Professional Certificate (13 cours) | IBM / Coursera | Cours + projets ; niveau intermédiaire | Coursera Plus (non chiffré sur la page) | https://www.coursera.org/professional-certificates/ai-engineer | ✅ |
| IBM AI Foundations for Everyone (4 cours) | IBM / Coursera | ~1 mois | Coursera | https://www.coursera.org/specializations/ai-foundations-for-everyone | 🔗 |
| IBM Generative AI Engineering Professional Certificate | IBM / Coursera | — | — | — | ⚠️ non atteint |
| AWS Certified AI Practitioner (AIF-C01) | AWS | QCM surveillé (source tierce MentorCruise ✅ : ~100 $) | ~100 $ (tiers) | https://aws.amazon.com/certification/certified-ai-practitioner/ | ⚠️ refusée au chargement |
| NVIDIA DLI certifications (ex. « Generative AI LLMs – Associate ») | NVIDIA | — | — | — | ⚠️ non atteint |
| Salesforce Certified AI Associate | Salesforce | — | — | https://trailhead.salesforce.com/en/credentials/aiassociate | ⚠️ refusée au chargement |
| CompTIA AI Essentials | CompTIA | — | — | https://www.comptia.org/certifications/ai-essentials | ⚠️ refusée au chargement |
| OpenAI Academy (badges) / OpenAI Certification | OpenAI | voir A.5 | gratuit / non publié | https://academy.openai.com/ | ✅ |

### F.2 Référentiel / domaines évalués — Google AI Essentials (✅)

Cinq cours (durées Coursera) :
1. **Introduction to AI** (1 h) — concepts, apprentissage automatique, cas d'usage.
2. **Maximize Productivity With AI Tools** (2 h) — intégrer l'IA dans les tâches quotidiennes.
3. **Discover the Art of Prompting** (2 h) — rédaction de prompts, itération, multimodal.
4. **Use AI Responsibly** (1 h) — biais, confidentialité, usage responsable.
5. **Stay Ahead of the AI Curve** (2 h) — veille, adaptation.
Durée totale annoncée de 4 h à « moins de 10 h » selon les pages (incohérence relevée). Aucun prérequis technique. Certificat Google partageable.

### F.3 Référentiel — Google AI Professional Certificate (✅, mis à jour août 2026)

AI Fundamentals (3 h) ; AI for Brainstorming and Planning (1 h) ; AI for Research and Insights (1 h) ; AI for Writing and Communicating (1 h) ; AI for Content Creation (2 h) ; AI for Data Analysis (1 h) ; AI for App Building (2 h) ; AI for App Deployment (2 h). Outils : Gemini (Canvas, Deep Research), Gemini Notebook, Gemini dans Workspace, Google AI Studio. 3 mois de Google AI Pro offerts. Débutant, 13 langues annoncées.

### F.4 Référentiel — Microsoft AI-900 (✅, version du 2 mai 2025, examen retiré le 30 juin 2026 — utile comme base de contenu)

| Domaine | Poids | Sous-domaines |
|---|---|---|
| 1. Décrire les charges de travail IA et leurs considérations | 15–20 % | vision par ordinateur, NLP, traitement de documents, IA générative ; principes d'IA responsable : équité, fiabilité & sécurité, confidentialité & sécurité, inclusivité, transparence, responsabilité |
| 2. Principes fondamentaux du ML sur Azure | 15–20 % | régression, classification, clustering, deep learning, architecture Transformer ; features/labels, jeux d'entraînement/validation ; Azure ML : AutoML, données & calcul, gestion/déploiement de modèles |
| 3. Vision par ordinateur sur Azure | 15–20 % | classification d'images, détection d'objets, OCR, détection/analyse faciale ; Azure AI Vision, Azure AI Face |
| 4. NLP sur Azure | 15–20 % | extraction de phrases clés, entités, sentiment, modélisation du langage, reconnaissance & synthèse vocale, traduction ; Azure AI Language, Azure AI Speech |
| 5. IA générative sur Azure | 20–25 % | caractéristiques des modèles, scénarios, IA responsable ; Azure AI Foundry, Azure OpenAI Service, catalogue de modèles |

Score de réussite 700 ; examen d'entraînement gratuit et sandbox sur Microsoft Learn ; localisations ~8 semaines après l'anglais.

### F.5 Référentiel — Microsoft AI-901 (source tierce ✅ s'appuyant sur Microsoft Learn ; page officielle ⚠️)

- Domaine 1 : **Identifier les concepts et capacités de l'IA — 40–45 %**.
- Domaine 2 : **Implémenter des solutions IA avec Microsoft Foundry — 55–60 %**.
- Score 700/1000 ; anglais d'abord ; prérequis : notions de syntaxe Python, concepts IA et ressources Azure ; nombre de questions/durée non publiés ; prix selon pays (99 $ cité par des tiers, non publié par Microsoft). Même credential « Microsoft Certified: Azure AI Fundamentals » ; les titulaires AI-900 n'ont rien à faire.

### F.6 Référentiel — IBM AI Engineering Professional Certificate (✅)

13 cours : Machine Learning with Python (20 h) ; Introduction to Deep Learning & Neural Networks with Keras (10 h) ; Deep Learning with Keras and TensorFlow (23 h) ; Introduction to Neural Networks and PyTorch (19 h) ; Deep Learning with PyTorch (21 h) ; AI Capstone Project with Deep Learning (15 h) ; Generative AI and LLMs: Architecture and Data Preparation (6 h) ; Gen AI Foundational Models for NLP & Language Understanding (10 h) ; Generative AI Language Modeling with Transformers (9 h) ; Generative AI Engineering and Fine-Tuning Transformers (8 h) ; Generative AI Advanced Fine-Tuning for LLMs (9 h) ; Fundamentals of AI Agents Using RAG and LangChain (9 h) ; Project: Generative AI Applications with RAG and LangChain (9 h). ≈ 168 h ; « 4 mois à 10 h/semaine » ; intermédiaire (Python, Jupyter, maths lycée). Compétences : ML supervisé/non supervisé, LLM, fine-tuning, RAG, prompt engineering, PyTorch, Keras, bases vectorielles, Spark.

### F.7 Référentiels non vérifiés dans cette session (⚠️ à compléter en priorité)

- **AWS Certified AI Practitioner (AIF-C01)** : page officielle refusée ; domaines/pondérations/prix non lus ici. Seule donnée lue : « ~100 $ » (source tierce MentorCruise ✅).
- **NVIDIA DLI** : aucune page atteinte.
- **Salesforce Certified AI Associate** : page refusée.
- **CompTIA AI Essentials** : page refusée.
- **IBM Generative AI Engineering Professional Certificate** : non atteint (absent de la page Coursera lue).

---

## G. Outils grand public — fonctionnalités et offres 2026

| Outil | Ce qui a été vérifié (✅) | Non vérifié (⚠️) |
|---|---|---|
| **Grok (xAI)** | Nouvelle **« The X Subscription »** depuis le 12 oct. 2026 (source ai-toolbox.co, vérifiée 25 oct. 2026 ✅ https://ai-toolbox.co/grok-models/grok-pricing-plans-api-2026) : **Plus** 8 $/mois ou 80 $/an (accès API, certificat X) ; **Premium** 30 $/mois ou 300 $/an (Grok Bot, génération vidéo, avantages Premium+ ; remplace SuperGrok + Cursor Pro + X Premium+) ; **Super** 100 $/mois (15× l'usage de Plus, vidéo 1080p, priorité) ; **Ultra** 200 $/mois (50× Plus, accès anticipé aux modèles). Free : chat, Imagine, Grok Build limités, pas de vidéo/API. Anciennes offres SuperGrok Lite 10 $ / SuperGrok 30 $ / Plus 100 $ / Heavy 300 $ fermées aux nouveaux (source pricepertoken 25 juin 2026 ✅ https://pricepertoken.com/subscriptions/grok). Fonctions : Grok 4.x, Grok Imagine (image/vidéo), Grok Build, Grok Bot, multi-agent Heavy. | — |
| **ChatGPT (OpenAI)** | Modèle `chat-latest` exposé en API (5 $/30 $). Cours Academy dans ChatGPT ; ChatGPT for Teachers gratuit pour les éducateurs vérifiés jusqu'en juin 2027 (✅ sources A.5). Codex cité comme outil développeur. | Grille Free/Plus/Pro/Business/Enterprise et prix 2026 — page openai.com non atteinte. |
| **Gemini (Google)** | « Google AI Pro » existe (3 mois offerts avec le Google AI Professional Certificate ✅) ; fonctionnalités citées : Canvas, Deep Research, Gemini Notebook, Gemini dans Workspace, AI Studio, Gemini CLI (quotas sur geminicli.com 🔗). | Prix AI Pro / AI Ultra 2026. |
| **Perplexity** | API : Agent API, Search, Embeddings, Decisions, Perplexity Computer (analytics API), CLI (https://docs.perplexity.ai/docs/cli/overview.md 🔗), MCP server. | Offres Pro/Max, Comet, Labs — non atteintes. |
| **Mistral Le Chat** | Vibe (CLI), AI Studio ; modèles Large 4 / Small 4 (✅ D.1). | Offres Le Chat Free/Pro/Team et prix. |
| **Microsoft Copilot** | Rien de vérifié. | Tout. |
| **Claude (Anthropic)** | Hors périmètre de cette recherche (voir fiche 01). | — |

---

## Récapitulatif des URLs ouvertes avec WebFetch (✅) — 62 pages

1. https://academy.openai.com/
2. https://academy.openai.com/pages/courses
3. https://www.gend.co/blog/openai-certifications-ai-foundations-2026
4. https://morphllm.com/openai-api-pricing
5. https://developers.openai.com/cookbook/topic/text
6. https://developers.openai.com/api/docs/pricing
7. https://developers.openai.com/api/docs/models
8. https://developers.openai.com/api/docs
9. https://www.techrepublic.com/article/news-openai-chatgpt-training-certifications/
10. https://flashgenius.net/blog-article/ultimate-guide-to-openai-certifications-2026
11. https://developers.openai.com/api/docs/quickstart
12. https://developers.openai.com/api/docs/guides/migrate-to-responses
13. https://developers.openai.com/api/docs/guides/agents/sdk
14. https://bestaicertifications.com/openai-certification/
15. https://findskill.ai/blog/openai-certification-guide/
16. https://docs.perplexity.ai/getting-started/pricing
17. https://docs.perplexity.ai/docs/getting-started/pricing.md
18. https://www.morphllm.com/grok-api-pricing
19. https://docs.x.ai/developers/introduction
20. https://docs.perplexity.ai/llms.txt
21. https://docs.perplexity.ai/docs/agent-api/models.md
22. https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview.md
23. https://docs.x.ai/developers/models
24. https://docs.x.ai/developers/pricing
25. https://docs.x.ai/developers/quickstart
26. https://docs.mistral.ai/getting-started/models/
27. https://ai.google.dev/gemini-api/docs/pricing
28. https://huggingface.co/learn
29. https://docs.n8n.io/courses/level-one (→ redirection learn.n8n.io)
30. https://docs.n8n.io/courses/level-two (→ redirection learn.n8n.io)
31. https://learn.n8n.io/
32. https://community.n8n.io/t/the-n8n-academy-is-here/299695
33. https://docs.n8n.io/learning-paths
34. https://docs.mistral.ai/inference/pricing
35. https://learn.n8n.io/courses/course-v1:n8n+N8N103+2026H2/about
36. https://learn.n8n.io/courses/course-v1:n8n+N8N101+2026H2/about
37. https://learn.n8n.io/courses/course-v1:n8n+N8N102+2026H2/about
38. https://docs.n8n.io/llms.txt
39. https://community.n8n.io/t/no-official-n8n-certification-yet/318573?tl=en
40. https://docs.n8n.io/build/integrate-ai/langchain-in-n8n.md
41. https://docs.n8n.io/build/integrate-ai/mcp-servers.md
42. https://academy.make.com/
43. https://community.make.com/t/make-academy-course-overview/29699
44. https://community.make.com/t/make-academy-news-ai-automation-explorer/105070
45. https://learn.zapier.com/path/ai-builder-path
46. https://learn.zapier.com/building-ai-agents
47. https://academy.make.com/bundles/automation-to-ai-agents-advanced-builder
48. https://zapier.com/l/new-experts/info
49. https://huggingface.co/learn/llm-course
50. https://huggingface.co/learn/agents-course
51. https://huggingface.co/learn/smol-course
52. https://huggingface.co/learn/mcp-course/unit0/introduction
53. https://huggingface.co/docs/inference-providers/main/guides/first-api-call
54. https://huggingface.co/docs/hub/models-inference
55. https://geminicli.com/docs/quota-and-pricing (→ redirection /docs/resources/quota-and-pricing)
56. https://ai.google.dev/gemini-api/docs/models
57. https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash
58. https://learn.microsoft.com/certifications/resources/study-guides/AI-900
59. https://open-exam-prep.com/blog/microsoft-azure-ai-fundamentals-ai-901-exam-guide-2026
60. https://grow.google/enroll-certificates/ai-essentials-mid/
61. https://www.coursera.org/google-specializations/ai-essentials-google
62. https://www.coursera.org/articles/google-vs-ibm-specializations-vs-deep-learning-ai-course
63. https://pricepertoken.com/subscriptions/grok
64. https://ai-toolbox.co/grok-models/grok-pricing-plans-api-2026
65. https://mentorcruise.com/certifications/openai/
66. https://www.coursera.org/professional-certificates/ai-engineer
67. https://www.coursera.org/professional-certificates/google-ai
68. https://docs.n8n.io/build/integrate-ai/understand-ai-components/store-and-search-data-with-vectors.md
69. https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker.md
70. https://developers.openai.com/api/docs/guides/structured-outputs
71. https://docs.n8n.io/build/build-and-manage-agents.md
72. https://docs.mistral.ai/models
73. https://huggingface.co/docs/inference-providers/pricing
74. https://developers.openai.com/api/docs/guides/safety-best-practices
75. https://developers.openai.com/api/docs/guides/agents-api/tools/functions

(75 pages ouvertes ; plus de 120 URLs supplémentaires 🔗 relevées dans la navigation de ces pages officielles et listées dans les sections A–E.)

## À faire dans une prochaine session (quota de recherche à nouveau disponible)

1. Ouvrir et extraire les référentiels officiels : AWS AIF-C01 (exam guide PDF), NVIDIA DLI, Salesforce AI Associate, CompTIA AI Essentials, Microsoft AI-901 (page Learn), IBM Generative AI Engineering.
2. Grilles tarifaires grand public 2026 : ChatGPT, Claude, Gemini (AI Pro/Ultra), Perplexity (Pro/Max, Comet), Le Chat, Copilot.
3. Pages Mistral : fine-tuning, agents, function calling, Le Chat ; page Gemini embeddings/Veo/Imagen (fin de page pricing) ; Gemini CLI (dépôt officiel et page quotas) ; HF Deep RL Course (plan).
4. Pages OpenAI non ouvertes : embeddings, batch, evals, realtime, image generation (toutes 🔗 depuis la navigation officielle) ; page Deprecations (date de fin Assistants API) ; help.openai.com « OpenAI Academy courses » et « OpenAI Certified app ».
5. n8n : page du nœud AI Agent (🔗), catalogue de templates IA sur n8n.io, page éducation/certification officielle quand elle sera publiée (fin T4 2026).
