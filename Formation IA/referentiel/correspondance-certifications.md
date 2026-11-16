# Correspondance avec les certifications et cours tiers — Formation IA Next Formation (NF-IA-150)

Version 1.0 — 1er novembre 2026. Document établi à partir des dossiers de recherche `_recherche/01` à `05` (état des référentiels tiers au 1er novembre 2026) et de `programme/programme.json` (source de vérité des identifiants de modules Mxx et de leçons Lxxx).

Complément du 5 novembre 2026 : la section consacrée à la spécialisation **N5 Data engineering & Big Data pour l'IA** (§ 12 bis) et la ligne N5 du § 13 s'appuient sur `_recherche/06-data-engineering-big-data.md` (§ 5, § 6 et § 8.6 ; état des référentiels tiers au 5 novembre 2026).

---

## ⚠️ Avertissement juridique et commercial (à reproduire dans toute communication)

1. **Les certificats Next Formation (Niveaux 1 à 4) ne sont pas des équivalences** des certifications tierces citées dans ce document. Ils ne sont ni reconnus, ni délivrés, ni validés par Anthropic, OpenAI, n8n, Make, Zapier, Microsoft, Google, IBM, AWS, Hugging Face, DeepLearning.AI, le MIT, Stanford, Harvard, l'École 42 ou l'Université d'Helsinki. Aucun de ces organismes n'a validé le présent document.
   - **Spécialisation N5** : de même, le certificat Next Formation Niveau 5 « Data engineer IA » n'est ni reconnu, ni délivré, ni validé par Google Cloud, Amazon Web Services, Microsoft, Databricks, Snowflake, dbt Labs, Confluent, DataTalksClub, Stanford, Carnegie Mellon, Berkeley ou le MIT. Les certifications data de ces éditeurs portent en grande partie sur leurs **services propriétaires**, que le N5 présente sans les pratiquer en profondeur : le N5 prépare les fondamentaux communs, pas la préparation spécifique au fournisseur.
2. La formation NF-IA-150 **prépare et incite** chaque apprenant à passer, en complément et à ses frais, les certifications officielles correspondant à son niveau. Le taux de couverture indiqué ci-dessous mesure le recouvrement **thématique** entre les référentiels publics tiers et nos leçons ; il ne préjuge ni de la réussite à l'examen tiers, ni d'une reconnaissance par le tiers.
3. **Conditions d'accès particulières à connaître avant d'orienter un apprenant** (dossiers 01 et 02) :
   - **Certifications Anthropic (Claude Certified Associate / Developer / Architect)** : réservées aux **employés d'organisations membres du Claude Partner Network** (adresse e-mail professionnelle sur domaine reconnu, 18 ans minimum, pièce d'identité). Prix 99 $ à 175 $ hors remise partenaire, examen surveillé Pearson VUE (OnVUE ou centre), 120 min, QCM à réponses uniques et multiples sur scénarios, livre fermé, score 100-1000 avec seuil 720, **validité 12 mois**, langues anglais et japonais. **Un organisme de formation ne peut pas vendre ni faire passer ces certifications** ; seuls les **badges gratuits de Claude Academy** (délivrés à la réussite du dernier quiz, sans expiration) sont ouverts à tous.
   - **n8n** : les cours de la n8n Academy délivrent un **certificat de complétion** (Accredible), explicitement présenté par n8n comme « not a certification ». La **certification officielle n8n (examen chronométré) est annoncée pour fin T4 2026** et n'existe pas à la date de ce document.
   - **OpenAI** : les badges des cours OpenAI Academy (AI Foundations, Applied AI Foundations, Agents and Workflows) « are not OpenAI Certifications ». La certification formelle « OpenAI Certification » est sur invitation (ChatGPT Enterprise/Edu, pilotes), prix et domaines non publiés.
   - **Microsoft AI-900** : examen **retiré le 30 juin 2026**, remplacé par **AI-901** (même titre « Microsoft Certified: Azure AI Fundamentals », score 700/1000, prix selon pays, ~99 $ cité par des tiers).
   - **Google AI Essentials / Google AI Professional Certificate** : certificats Coursera payants (~49 $/mois après 7 jours d'essai, inclus dans Coursera Plus), audit gratuit sans certificat.
   - **IBM AI Engineering Professional Certificate** : 13 cours Coursera (~168 h), abonnement Coursera Plus.
   - **AWS Certified AI Practitioner (AIF-C01)** : page officielle **non vérifiée** dans la recherche (quota épuisé) ; seule donnée lue : ~100 $ (source tierce). Les domaines ne sont pas reproduits ici.
   - **Hugging Face** (LLM Course, Agents Course, MCP Course, smol course) : certificats gratuits, sans date limite ; un programme de certification écosystème est annoncé mais non lancé.
   - **DeepLearning.AI short courses** : gratuits, 1 à 2 h, pas de certification.
   - **Cours universitaires (MIT, Stanford, Berkeley, CMU, Harvard CS50, 42)** : ce sont des cours, pas des certifications. CS50 AI propose un certificat vérifié payant (299 $). Les contenus MIT OCW / Stanford SEE / Anthropic courses sont sous licence **CC BY-NC** : nos leçons sont des rédactions originales qui **citent** ces cours sans les reproduire.
   - **Elements of AI** (Université d'Helsinki, version française avec Sorbonne Université) : gratuit, certificat de complétion.
   - **Microsoft Generative AI for Beginners** : dépôt GitHub sous licence MIT, pas de certification.
4. Les prix, dates et conditions ci-dessous sont ceux relevés le 1er novembre 2026 et doivent être revérifiés avant toute publication commerciale (Qualiopi indicateur 1 : information exacte du public ; indicateur 23 : veille réglementaire).

Légende des taux de couverture : **100 %** = tous les chapitres du référentiel tiers ont une leçon dédiée ; **80-95 %** = couverture complète sauf spécificités produit ou plateforme ; **50-75 %** = couverture partielle (concepts traités, pratique propriétaire non traitée) ; **< 50 %** = couverture d'introduction seulement.

---

## 1. Anthropic — Claude Academy (27 cours gratuits, badges)

Source : dossier 01, sections 1.2 et 9 (plans lus sur academy.claude.com et anthropic-partners.skilljar.com). Les leçons citées sont celles de `programme/programme.json`.

| Cours Claude Academy (titre officiel, durée) | Chapitres du cours tiers | Modules et leçons NF-IA-150 qui le couvrent | Couverture | Commentaire |
|---|---|---|---|---|
| **Claude 101** (2,5 h, 13 leçons) | Meet Claude · Getting better results · Claude on your desktop · Projects, artifacts, skills · Connecting your tools, enterprise search, research · Use-cases by role | M03 (L011) ; M04 (L015, L018) ; M05 (L021, L022) ; M11 (L050) ; M12 (L051) | 100 % | L011 couvre conversations, projets, artefacts ; L050/L051 les projets et la connaissance embarquée ; L021 les cas d'usage par métier. |
| **Claude Code 101** (1,5 h, 12 leçons) | What is Claude Code · Installing · First prompt · Explore → plan → code → commit · Context management · Code review · CLAUDE.md, subagents, skills, MCP, hooks | M03 (L011) ; M12 (L053) ; M17 (L074, L075, L076) | 95 % | L074 traite installation, CLAUDE.md, hooks, subagents et Agent SDK ; L075 MCP ; L076 skills. Les surfaces Desktop/Web/mobile sont mentionnées sans atelier dédié. |
| **Claude Code in action** (1 h, 9 leçons) | Steering long sessions · CLAUDE.md · Verification skills · Permission modes · Hooks · Routines and headless · GitHub Actions and Code Review · Verifying unsupervised runs · Plugins | M17 (L074, L076) ; M22 (L104) | 85 % | Routines, headless (`claude -p`) et GitHub Actions sont traités en L104 (CI/CD et tests de prompts) ; les plugins sont évoqués en L076 sans atelier. |
| **Introduction to Claude Cowork** (2,5 h, 14 leçons) | What is Cowork · Setup · First task · Global instructions and projects · Skills · Plugins · Claude in Chrome · Microsoft 365 · Working safely · Sharing | M03 (L011) ; M12 (L051, L054) ; M05 (L022) | 80 % | L054 couvre computer use et navigateurs IA (Chrome) ; L022 la productivité documents/Office. Pas de leçon dédiée aux plugins Cowork. |
| **Introduction to Claude Tag** (2,5 h, 11 leçons) | Claude dans Slack (DM, canaux) · mémoire et instructions · routines · rédiger une demande exploitable · habitudes d'équipe | M12 (L051, L052) ; M08 (L036) ; M04 (L015) ; M15 (L064) | 70 % | Les principes (instructions, routines planifiées, demandes exploitables) sont couverts ; l'outil Slack « Claude Tag » lui-même n'a pas d'atelier (les intégrations Slack sont faites côté n8n en L036). |
| **Claude Platform 101** (1,5 h, 13 leçons, SDK TypeScript) | First API call · Choosing the right model · The agent loop · Tool use · Thinking · Built-in tools · Skills · MCP · Context management · Managed Agents · Building with Claude Code | M16 (L065, L066, L067) ; M17 (L068, L070, L073, L074, L075, L076) ; M21 (L095, L097) | 90 % | Managed Agents (Console agent builder, 0,08 $/h de session) est présenté en L074/L097 ; pas d'atelier complet Managed Agents. |
| **Building with the Claude API** (9 h, 67 leçons, 8 quiz) — cours pivot | Accessing Claude (key, multi-turn, system prompts, temperature, streaming, structured data) · Prompt evaluation (datasets, model-/code-based grading) · Prompt engineering (clear and direct, specific, XML tags, examples) · Tool use (schemas, message blocks, multi-tool, batch tool, text editor, web search) · RAG & agentic search (chunking, embeddings, BM25, multi-index, reranking, contextual retrieval) · Claude features (extended thinking, images, PDF, citations, prompt caching, code execution & Files API) · MCP (tools, inspector, client, resources, prompts) · Claude Code & computer use · Agents & workflows (parallelization, chaining, routing, workflows vs agents) | M16 (L065-L067) ; M17 (L068-L077) ; M20 (L089, L090, L092, L093) ; M21 (L095) ; M12 (L054) | 100 % | Tous les chapitres ont une leçon correspondante ; L073 couvre thinking, caching et Batch ; L072 vision/PDF/Files/citations ; L076 l'évaluation des prompts ; L092 BM25, reranking et recherche hybride. |
| **Claude with Amazon Bedrock** (8 h) / **Claude on Google Cloud (Vertex AI)** (8,5 h) | Même structure que le cours API (API, prompt engineering, tool use, RAG, MCP, agents) sur Bedrock / Vertex | M17 (L068-L077) ; M19 (L088) | 75 % | Les contenus Claude sont couverts ; la configuration AWS Bedrock / GCP Vertex (IAM, régions, SDK cloud) n'est traitée qu'en L088 (multi-fournisseur, repli). |
| **Introduction to Model Context Protocol** (1 h, 10 leçons) | MCP clients · Project setup · Defining tools · Server inspector · Implementing a client · Resources · Prompts | M06 (L027) ; M17 (L075) ; M21 (L099) | 100 % | L075 = serveur et client MCP en code ; L027 = explication sans code (N1). |
| **Model Context Protocol: Advanced topics** (1,5 h, 11 leçons) | Sampling · Log and progress notifications · Roots · JSON message types · STDIO · StreamableHTTP · State | M17 (L075) ; M21 (L099) | 70 % | Transports STDIO / Streamable HTTP et sampling sont abordés en L075 et L099 ; notifications et roots ne font pas l'objet d'exercices dédiés. |
| **Introduction to agent skills** (1 h, 6 leçons) | What are skills · First skill · Multi-file skills · Skills vs other features · Sharing · Troubleshooting | M17 (L076) ; M12 (L053) | 90 % | L076 couvre SKILL.md (frontmatter `name`/`description`), skills pré-construits et custom ; le standard ouvert agentskills.io est cité. |
| **Introduction to subagents** (45 min, 4 leçons) | What are subagents · Creating (`/agents`) · Designing · Using effectively | M17 (L074) ; M21 (L095, L098) | 85 % | Subagents Claude Code en L074 ; orchestration multi-agents en L098. |
| **The AI-native SDLC playbook** (1 h, 14 leçons) | intent.md · Plan mode · CLAUDE.md · Skills as institutional knowledge · Parallel sessions · Feedback loops · Continuous evals in CI · AI in PR review · Hooks as approval gates · CI/CD · Metrics | M17 (L074, L076) ; M22 (L103, L104) | 85 % | L104 traite CI/CD et tests de prompts, L103 l'observabilité ; la méthodologie « intent.md » n'est pas nommée mais le cycle plan → build → test → deploy est suivi dans le projet L105. |
| **Deploying Claude Enterprise with confidence** (2,5 h, 14 leçons) | Owners and intake · One organization or many · Groups · Surfaces · Connectors · Governing customizations · Spend caps · Visibility · Adoption signals · Rollout | M15 (L062, L063, L064) | 70 % | Gouvernance, coûts et conduite du changement sont couverts ; l'administration spécifique de Claude Enterprise (groupes, connecteurs, spend caps) est citée sans atelier d'admin. |
| **AI Fluency: Framework and foundations** (4 h, 14 leçons, cadre 4D) | Why AI Fluency · 4D framework · Generative AI fundamentals · Delegation · Description · Effective prompting · Discernment · Diligence | M01 (L001-L004) ; M02 (L005-L008) ; M04 (L015-L020) ; M05 (L021-L023) ; M07 (L028-L031) | 100 % | Délégation = L021/L022 ; Description = L015-L018 ; Discernement = L023 ; Diligence = M07. |
| **AI capabilities and limitations** (3,5 h, 13 leçons) | What we mean by AI · How AI gets its character · Next token prediction · Knowledge · Working memory · Steerability · When properties collide | M02 (L005, L006, L007, L008) | 100 % | L006 = prédiction du mot suivant ; L007 = caractère (SFT/RLHF) ; L008 = mémoire de travail (contexte), pilotabilité et hallucinations. |
| **Building effective human-agent teams** (45 min, beta) | Why multiplayer AI · What makes an agent a teammate · Organizational checklist · Ways to get started | M15 (L064) ; M06 (L026) | 80 % | L064 traite la conduite du changement et la montée en compétence des équipes (durée courte : 10 min — voir proposition en fin de document). |
| **AI Fluency, for your world** (9 cours : builders, creative work, educators, pK-12, train the trainer, facilitators, nonprofits, small businesses, students) | Déclinaisons sectorielles du cadre 4D | M05 (L021) ; M14 (L059-L061) ; M15 (L064) | 60 % | Les déclinaisons par public ne sont pas reproduites une à une ; L021 (cas d'usage par métier) et M14 (créatifs) couvrent les variantes « builders », « creative work » et « small businesses ». Les variantes éducation ne sont pas ciblées par NF-IA-150. |

### 1 bis. Anthropic — cours de l'Anthropic Partner Academy exploités comme référentiels

| Cours Partner Academy (durée) | Objectifs lus | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| Claude Platform & Model Foundations (59 min) · Workflow Integration & Solution Design (63 min) · Governance, Risk & Responsible Use (55 min) · Prompting & Task Execution (53 min) · Evaluating & Validating Claude's Output (74 min) · Configuration & Knowledge Management (47 min) · Troubleshooting & Optimization (30 min) — **parcours Associate** | Les 7 domaines de l'examen Associate (voir tableau 2) | L009, L011, L012, L015-L019, L021-L023, L028-L031, L050, L051 | 95 % | Référentiel « utilisateur métier » le plus directement exploitable pour le Niveau 1. |
| Production-Grade Prompting, Agents & Tool Use (209 min) | Prompts de production, extended thinking et budget, schémas d'outils, streaming et reprise, compaction et handoffs, HITL, mémoire d'agent, images/PDF, Files, Batches | L069, L070, L071, L072, L073, L095, L097 | 95 % | — |
| Claude Code, MCP & Integration (142 min) | Boucle explorer/planifier/coder, modes de permission, revue du code, CLAUDE.md, hooks, subagents, skills, plugins, serveurs MCP, intégration SI, authentification | L074, L075, L076, L099, L107, L109 | 90 % | — |
| Production Engineering, Evals & Security (211 min) | Évals, tracing, pannes, coûts, sécurité en trafic réel | L076, L102, L103, L104, L106-L110 | 90 % | — |
| Claude Platform & Solution Design (238 min) — Architect Pro | Découper une demande (Claude / SI / humains), appel augmenté vs workflow vs agent, architectures de référence, retrieval vs live-state, décisions étayées par des évals, points d'entrée, gouvernance | L062, L088, L095, L103, L149 | 80 % | La dimension « conseil / go-to-market » (Stakeholder Engagement, 178 min) n'est pas un objectif de NF-IA-150. |
| Working with Claude Fable 5.1 · Upgrade a client's build to the Claude 5.5 models | Choix de modèle et d'effort par étape, migration d'un appel, cross-model check, eval avant bascule, retrait de Sonnet 4.5 le 30 nov. 2026 | L009, L067, L068, L073, L076, L088 | 85 % | La migration API `2026-10-21` et les dépréciations sont traitées en L068/L088. |

---

## 2. Anthropic — certifications officielles (réservées au Claude Partner Network)

Pondérations issues de sources tierces concordantes reprenant les guides d'examen v1.0 de juillet 2026 (dossier 01, § 2.3 — guides PDF officiels non ouverts : à confirmer).

| Certification (nom exact, prix, nb de questions) | Domaine du guide d'examen (poids) | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **Claude Certified Associate – Foundations** (99 $, 60 questions) | Output Evaluation & Validation (21 %) | L019, L023, L076 | 100 % | Niveau 1 + L076. |
| | Workflow Integration & Solution Design (16 %) | L021, L022, L026, L062 | 90 % | |
| | Governance, Risk & Responsible Use (15 %) | L028, L029, L030, L031, L063 | 100 % | |
| | Prompting & Task Execution (14 %) | L015, L016, L017, L018, L020 | 100 % | |
| | Product & Model Selection (12 %) | L009, L011, L012, L013 | 100 % | Modèles Claude 5.5 / Fable 5.1 et tarifs en L009. |
| | Configuration & Knowledge Management (12 %) | L050, L051, L011 | 90 % | Projets, instructions, connaissance embarquée. |
| | Troubleshooting & Optimization (10 %) | L008, L019, L023 | 80 % | Diagnostic des sorties erronées, itération. |
| **Claude Certified Developer – Foundations** (125 $, 53 questions) | Applications & Integration (33,1 %) | L065-L068, L072, L101, L102, L105 | 95 % | |
| | Model Selection & Optimization (16,8 %) | L009, L067, L068, L073 | 100 % | Caching, batch, effort, choix de modèle. |
| | Agents & Workflows (14,7 %) | L095, L097, L099, L100, L074 | 100 % | |
| | Prompt & Context Engineering (11,0 %) | L069, L071, L073 | 100 % | Guide officiel « Prompting best practices » suivi en L069. |
| | Tools & MCPs (10,6 %) | L070, L075 | 100 % | |
| | Security & Safety (8,1 %) | L106-L109 | 100 % | |
| | Claude Code (3,1 %) | L074 | 100 % | |
| | Evaluation, Testing & Debugging (2,6 %) | L076, L103, L104 | 100 % | |
| **Claude Certified Architect – Foundations** (125 $, 60 questions, 4 scénarios) | Agentic Architecture & Orchestration (27 %) | L095, L096, L097, L098, L099, L100 | 95 % | |
| | Claude Code Configuration & Workflows (20 %) | L074, L076, L104 | 85 % | Permission modes, hooks, headless, CI. |
| | Prompt Engineering & Structured Output (20 %) | L069, L071 | 100 % | |
| | Tool Design & MCP Integration (18 %) | L070, L075, L099 | 100 % | |
| | Context Management & Reliability (15 %) | L067, L073, L102 | 90 % | Compaction, context editing, task budgets cités en L073. |
| **Claude Certified Architect – Professional** (175 $, 63 questions) | Integration (19 %) | L088, L101, L102 | 80 % | |
| | Solution Design & Architecture (17 %) | L062, L095, L088 | 75 % | |
| | Evaluation, Testing & Optimization (16 %) | L076, L093, L103, L104, L138 | 90 % | |
| | Governance, Safety & Risk (14 %) | L063, L106-L109, L148, L149 | 90 % | |
| | Stakeholder Communication & Lifecycle (14 %) | L064 | 40 % | Compétence de conseil, hors cible NF-IA-150. |
| | Claude Models, Prompting & Context Engineering (13 %) | L068, L069, L073 | 100 % | |
| | Developer Productivity & Operational Enablement (7 %) | L074, L053 | 80 % | |

---

## 3. n8n Academy (learn.n8n.io) — programme « n8n Foundations »

Source : dossier 02, § E.1 (chapitres lus sur learn.n8n.io). Évaluation n8n : quiz 10 % + exercices 55 % + examen final 35 %, 70 % requis ; certificat de complétion Accredible ; prix non affiché.

| Cours n8n (code, durée) | Sections | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **QS101 n8n Quickstart** | Prise en main | L025 | 100 % | |
| **N8N101 Essentials: Your First Workflows** (2-4 h) | Section 1 : canvas, nœuds, connexions, exécutions, triggers, scheduling, credentials · Section 2 : structure des données, expressions, mapping, merge, binaires | L025, L032 | 100 % | L032 = « Nœuds, expressions et structure des données (n8n Level 1 approfondi) ». |
| **N8N102 Integrations: APIs & Connected Workflows** (4-6 h) | Section 1 : ordre d'exécution, sous-workflows, IF, Switch, Loop Over Items, Wait, Error Trigger, Stop and Error, Merge, Split Out, Aggregate, Filter, Summarize, nœud Code · Section 2 : HTTP (GET/POST/PUT/PATCH/DELETE), clé API, OAuth2, Bearer, pagination, Webhook Trigger, credentials, Data Tables | L024, L033, L036 | 100 % | L024 (API, webhook, JSON) en N1 ; L033 (erreurs, sous-workflows) et L036 (intégrations) en N2. |
| **N8N103 In Practice: AI, Testing & Best Practices** (3-4 h) | Section 1 : nœuds IA, AI Agent + outils + mémoire, chaînes vs agents · Section 2 : journal d'exécution, debugger, Try/Catch · Section 3 : nommage, dossiers, tags, documentation, publication, planification, monitoring, récupération · examen final | L034, L035, L037, L038, L052 | 100 % | Le projet L038 (assistant de support client) joue le rôle d'examen final pratique. |
| Documentation n8n complémentaire (cluster nodes, vector stores, MCP Server Trigger / MCP Client Tool, Agent Builder, Evaluations, Docker Compose, queue mode) | — | L034, L035, L037, L046, L052 | 90 % | Les Evaluations n8n (Evaluation node/trigger) sont citées en L049 ; l'Agent Builder (préversion) en L052. |

---

## 4. Make Academy (academy.make.com) — gratuit, badges Credly

Source : dossier 02, § E.3.

| Niveau Make Academy | Cours (titres exacts) | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **Foundation** | Setting up my first scenario · Expanding my first scenario · Introduction to Operations · Introduction to Make UI | L039 | 90 % | Une seule leçon Make (60 min) : prise en main complète mais sans badge par badge. |
| **Make Basics** | Modules, scheduling and bundles · Data types and data structures · Transforming data using functions · Aggregators | L039, L032 | 70 % | Les notions de structure de données sont enseignées sur n8n (L032) et transposées en L039. |
| **Make Intermediate** | Iterators and Array aggregators · get() and map() · Introduction to HTTP · Webhooks · Error handling · Intermediate Functions | L039, L024, L033 | 60 % | HTTP/webhooks/erreurs sont couverts sur n8n ; les fonctions Make spécifiques (get, map) sont évoquées. |
| **Make Advanced** | Data stores and data structures · API calls with HTTP modules · Pagination · Regular Expressions · Advanced Webhooks | L039, L040 | 50 % | Couverture d'introduction. |
| **Automation to AI Agents: Foundation** | AI Fundamentals · Mastering LLMs · Using AI in Make · AI Agents · AI, AI agents and automation · AI Agents in Make | M02 (L005-L009) ; L026 ; L039 ; L052 | 90 % | Les fondamentaux LLM/agents sont couverts en N1 ; « AI Agents in Make » en L039. |
| **Automation to AI Agents: Advanced** (~3 h, badge « AI Agent Builder ») | MCP · Information management and security · Context Engineering · Tools and AI agent settings optimization · Design and build a production-ready AI agent · assessment | L027, L039, L052, L015-L019, L107, L108 | 80 % | Context engineering (M04), MCP (L027), sécurité (M07/M23) sont couverts ; l'agent de production est construit sur n8n (L052) plutôt que sur Make. |
| **AI Automation Explorer** (parcours, badge) | MCP, contexte de conversation et sécurité, connaissances documentaires, context engineering, structure des outils, gestion d'erreurs, choix du modèle, mise en production (tests, coût, fiabilité) | L027, L039, L047-L049, L062, L109 | 80 % | — |

**Zapier** (Zapier Academy « AI Builder Path », « Building AI Agents » — pages JavaScript non rendues ; Solution Partner Program réservé aux partenaires) : L040 (Zapier, comparatif et grille de choix) — couverture d'introduction, pas de certification grand public identifiée.

---

## 5. OpenAI Academy et OpenAI Certification

Source : dossier 02, § A.5 (quatre parcours Academy ; trois cours gratuits avec badge depuis le 12 juin 2026 ; référentiel AI Foundations reconstitué, non officiel).

| Parcours / cours OpenAI | Compétences citées | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **Apply AI at Work** → cours **AI Foundations** (~70 min, 20 questions, 80 % requis) | Instructions claires et contexte · relire/critiquer les sorties · usage responsable · notes → plans d'action · recherche sourcée · visuels et schémas · résumés avec citations · tableur/données · automatisation légère | M03 (L010) ; M04 (L015-L020) ; M05 (L021-L023) ; M07 (L028-L031) ; M13 (L055, L056) ; M06 (L024-L026) | 100 % | L010 = prise en main complète de ChatGPT. |
| **Applied AI Foundations** | Workflows réutilisables, cas métier | L018, L019, L021, L022, L058 | 90 % | |
| **Agents and Workflows** | Délégation à des agents : contexte, production attendue, limites, relecture, réutilisation | L026, L051, L052, L053, L054 | 90 % | |
| **Build with AI** (développeurs : Codex + API) | Responses API, outils intégrés, Agents SDK, Codex | M18 (L078-L083) ; L053 | 95 % | L078 Responses vs Chat Completions ; L081 Agents SDK ; Codex CLI cité en L053/L074. |
| **Lead AI Adoption** (dirigeants) | Stratégie, gouvernance, adoption | M15 (L062-L064) ; L029 | 80 % | |
| **Teach and Learn with AI** (éducation) | ChatGPT for Teachers | — | 0 % | Hors cible NF-IA-150. |
| **OpenAI Certification** (formelle, sur invitation, ETS/Credly/Coursera, prix et domaines non publiés) | — | — | n.d. | Impossible d'établir une correspondance tant que les domaines ne sont pas publiés ; disponibilité générale estimée fin 2026 / 2027. |

---

## 6. Microsoft — AI-900 (retiré le 30 juin 2026) et AI-901 (remplaçant)

Sources : dossier 02, § F.4 (study guide AI-900 du 2 mai 2025) et § F.5 (AI-901, source tierce ; page officielle non ouverte).

| Examen | Domaine (poids) | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **AI-900** | 1. Charges de travail IA et considérations (15-20 %) : vision, NLP, documents, IA générative ; IA responsable (équité, fiabilité, confidentialité, inclusivité, transparence, responsabilité) | L003, L028, L029, L030 | 90 % | Les six principes d'IA responsable Microsoft sont couverts par M07 sans reprendre le vocabulaire Azure. |
| | 2. Principes fondamentaux du ML sur Azure (15-20 %) : régression, classification, clustering, deep learning, transformers ; features/labels, train/validation ; Azure ML, AutoML | L002, L006, L115-L118, L116 | 75 % | Concepts couverts (N1 en introduction, N4 en profondeur) ; Azure Machine Learning / AutoML non traités. |
| | 3. Vision par ordinateur sur Azure (15-20 %) : classification, détection, OCR, visages ; Azure AI Vision / Face | L003, L124, L127 | 60 % | Concepts et pratique PyTorch (N4) ; services Azure non traités. |
| | 4. NLP sur Azure (15-20 %) : phrases clés, entités, sentiment, modélisation du langage, parole, traduction ; Azure AI Language / Speech | L003, L005-L006, L018, L061 | 60 % | Idem : concepts couverts, services Azure non traités. |
| | 5. IA générative sur Azure (20-25 %) : caractéristiques des modèles, scénarios, IA responsable ; Azure AI Foundry, Azure OpenAI Service, catalogue | M02 (L005-L009) ; M04 ; L062 | 80 % | Azure OpenAI / Foundry cités en L062 et L088 (multi-fournisseur), sans atelier. |
| **AI-901** | 1. Identifier les concepts et capacités de l'IA (40-45 %) | M01, M02, M03, M07 | 90 % | |
| | 2. Implémenter des solutions IA avec Microsoft Foundry (55-60 %) | L062, L088, L087 | 30 % | **Point faible assumé** : NF-IA-150 n'est pas une formation Azure. Recommander le parcours gratuit Microsoft Learn (examen d'entraînement et sandbox) avant AI-901. |

---

## 7. Google — AI Essentials et Google AI Professional Certificate

Sources : dossier 02, § F.2 et F.3 ; dossier 05, § 6.1.

| Certificat Google | Cours (durée) | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **Google AI Essentials** (5 cours, < 10 h, Coursera ~49 $/mois) | Introduction to AI (1 h) | L001-L004 | 100 % | |
| | Maximize Productivity With AI Tools (2 h) | L010-L013, L021, L022 | 100 % | |
| | Discover the Art of Prompting (2 h) | L015-L020 | 100 % | Prompting multimodal : L014. |
| | Use AI Responsibly (1 h) | L028-L031 | 100 % | |
| | Stay Ahead of the AI Curve (2 h) | L004, L009, L064 | 80 % | La veille est traitée en L004/L009 et, pour les experts, en L150. |
| **Google AI Professional Certificate** (8 cours, mis à jour août 2026) | AI Fundamentals (3 h) | M01, M02 | 100 % | |
| | AI for Brainstorming and Planning (1 h) · AI for Research and Insights (1 h) · AI for Writing and Communicating (1 h) | L013, L018, L021, L022 | 100 % | Deep Research / Perplexity : L013. |
| | AI for Content Creation (2 h) | L014, L059-L061 | 100 % | |
| | AI for Data Analysis (1 h) | L055-L058 | 100 % | |
| | AI for App Building (2 h) · AI for App Deployment (2 h) | L053, L087, L101, L105 | 80 % | Outils Google (Gemini Canvas, AI Studio) : L012, L087 ; la pratique « app building » est faite avec Claude Code / Lovable / Bolt / v0 (L053). |

---

## 8. IBM AI Engineering Professional Certificate (13 cours, ~168 h, Coursera)

Source : dossier 02, § F.6.

| Cours IBM (durée) | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|
| Machine Learning with Python (20 h) | M25 (L115-L120) | 90 % | scikit-learn en L119 ; projet L120. |
| Introduction to Deep Learning & Neural Networks with Keras (10 h) · Deep Learning with Keras and TensorFlow (23 h) | L121-L127 | 60 % | NF-IA-150 enseigne PyTorch ; Keras/TensorFlow ne sont que cités. |
| Introduction to Neural Networks and PyTorch (19 h) · Deep Learning with PyTorch (21 h) | L121-L127 | 100 % | |
| AI Capstone Project with Deep Learning (15 h) | L127 | 90 % | |
| Generative AI and LLMs: Architecture and Data Preparation (6 h) · Gen AI Foundational Models for NLP (10 h) · Generative AI Language Modeling with Transformers (9 h) | L128-L134 | 100 % | |
| Generative AI Engineering and Fine-Tuning Transformers (8 h) · Generative AI Advanced Fine-Tuning for LLMs (9 h) | L135-L140 | 100 % | LoRA/QLoRA, SFT/DPO (L133, L136). |
| Fundamentals of AI Agents Using RAG and LangChain (9 h) · Project: Generative AI Applications with RAG and LangChain (9 h) | L089-L100 | 100 % | LangChain/LlamaIndex en L091, LangGraph en L096. |
| IBM AI Foundations for Everyone (4 cours, ~1 mois) | M01-M07 | 90 % | Non détaillé dans la recherche (page non ouverte). |

---

## 9. AWS Certified AI Practitioner (AIF-C01)

Page officielle **non vérifiée** dans la recherche (dossier 02, § F.7) ; seule donnée lue : prix ~100 $ (source tierce MentorCruise). Aucune correspondance domaine par domaine n'est établie ici pour ne pas publier de référentiel non vérifié. Thématiques généralement associées à un « AI Practitioner » (fondamentaux IA/ML, IA générative, applications de modèles de fondation, IA responsable, sécurité/conformité) : couvertes par M01, M02, M04, M07, M15, M23 — **à confirmer après lecture de l'exam guide officiel** (action inscrite dans « À faire » du dossier 02).

---

## 10. Hugging Face Learn

Source : dossier 02, § D.3 ; dossier 03, § 5.14. Certificats gratuits.

| Cours HF | Chapitres / unités | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **LLM Course** (Apache 2.0) | 1 Transformer models · 2 Using Transformers · 3 Fine-tuning · 4 Sharing models and tokenizers · 5 Datasets · 6 Tokenizers · 7 Classical NLP tasks · 9 Building demos (Gradio) · 10 Curate datasets · 11 Fine-tune LLMs · 12 Build Reasoning Models | L123, L128-L134, L136-L138, L140 | 90 % | Chapitre 9 (Gradio) non dédié ; chapitre 8 (How to ask for help) hors périmètre. Certification exam du chapitre 1 : préparé par L128-L129. |
| **Agents Course** | 1 Introduction to Agents (outils, pensées, actions, chat templates) · 2 Frameworks (smolagents, LlamaIndex, LangGraph) · 3 Agentic RAG · 4 Final Project · bonus (fine-tuning pour function calling, observabilité) | L095, L091, L096, L097, L092, L100, L103, L139 | 95 % | smolagents cité en L097 ; projet final = L100. |
| **MCP Course** | 1 Introduction to MCP · 2 End-to-End MCP Application · 3 Custom Workflow Servers (PR agent) | L027, L075, L099 | 90 % | |
| **a smol course** (post-training) | 1 Instruction Tuning (SFT, chat templates) · 2 Evaluation · 3 Preference Alignment (DPO) · 4 Vision Language Models · 5 RL · 6 Synthetic Data | L133, L136, L137, L138, L134 | 85 % | VLM et RL (GRPO) sont traités dans L134/L133 sans projet dédié. |
| Deep RL Course · Diffusion Course · Audio · Computer Vision | — | L059, L061, L124 | 30 % | Hors cœur de cible ; ressources citées « pour aller plus loin ». |
| Inference Providers (`router.huggingface.co/v1`, `InferenceClient(provider="auto")`) | — | L088, L141 | 80 % | |

---

## 11. DeepLearning.AI — short courses avec Anthropic et OpenAI (gratuits, 1-2 h)

Source : dossier 03, § 5.3.

| Short course | Leçons du cours | Leçons NF-IA-150 | Couverture |
|---|---|---|---|
| Building toward Computer Use with Anthropic (1 h 44) | API · Multimodal · Real World Prompting · Prompt Caching · Tool Use · Computer Use | L068, L072, L069, L073, L070, L054 | 100 % |
| MCP: Build Rich-Context AI Apps with Anthropic (1 h 58) | Why MCP · Architecture · Server · Client · Reference servers · Prompts/Resources · Claude Desktop · Remote servers | L027, L075 | 100 % |
| Claude Code: A Highly Agentic Coding Assistant (2 h) | Setup · Features · Testing/refactoring · Worktrees · GitHub & hooks · Notebook/dashboard · Figma → web app | L074, L053, L104 | 90 % |
| Agent Skills with Anthropic (2 h 19) | Skills vs tools vs MCP vs subagents · Pre-built · Custom · API / Claude Code / Agent SDK | L076 | 100 % |
| ChatGPT Prompt Engineering for Developers (1 h 40) | Guidelines · Iterative · Summarizing · Inferring · Transforming · Expanding · Chatbot | L017, L018, L019, L078 | 100 % |
| Building Systems with the ChatGPT API (1 h 55) | Tokens · Classification · Moderation · Chain of thought · Chaining · Check outputs · Evaluation | L078, L079, L082, L108, L104 | 100 % |
| LangChain for LLM Application Development (1 h 53) · AI Agents in LangGraph · LangChain: Chat with Your Data | Models/prompts/parsers · Memory · Chains · Q&A · Evaluation · Agents | L091, L096, L093 | 95 % |
| Generative AI with LLMs (AWS, 13 h) | Cycle de vie, pré-entraînement · fine-tuning et évaluation · RLHF | L132, L133, L135-L138 | 90 % |

---

## 12. Cours universitaires et ouverts

Source : dossier 03. Ces cours sont **cités** comme inspirations ; nos leçons sont originales (licences CC BY-NC-SA pour MIT OCW / 6.390 ; MIT pour 6.S191 et devoirs CS336 ; propriétaires pour les vidéos Stanford).

| Cours (institution, licence) | Chapitres | Leçons NF-IA-150 | Couverture | Commentaire |
|---|---|---|---|---|
| **MIT 6.S191 Introduction to Deep Learning** (éd. 2026, licence MIT) | L1 Intro DL (perceptron, backprop, régularisation) · L2 Sequence modeling (RNN, LSTM, attention, transformers) · Lab 1 · L3 Computer vision (CNN) · L4 Generative modeling (VAE, GAN, diffusion) · Lab 2 (biais) · L5 Deep RL · L6 New frontiers · Lab 3 Fine-tune an LLM · L7 Three Laws of AI · L8 AI for Science · L9 Massively parallel training | L121-L127, L128-L129, L136, L140, L059, L146, L150 | 85 % | Deep RL (L5) et AI for Science (L8) ne sont pas traités en profondeur ; entraînement parallèle évoqué en L126/L132. |
| **MIT 6.390 / 6.036 Introduction to Machine Learning** (CC BY-NC-SA) | Bases · Perceptrons · Features · Régression logistique · Régression · Réseaux de neurones · CNN · MDP et RL · RNN · Arbres et forêts · Clustering | L111-L114, L115-L120, L121, L124, L125 | 85 % | MDP/RL non couverts (hors cible). |
| **MIT 18.06 Linear Algebra** (Strang) | Élimination, espaces, projections, moindres carrés, orthogonalité, déterminants, valeurs propres, SVD | L111 | 70 % | Sélection des vidéos 1-4, 6-10, 14-17, 21-22, 25, 29 en « pour aller plus loin ». |
| **Stanford CS229 Machine Learning** | Supervisé (régression linéaire/logistique, GLM, GDA/Naive Bayes, SVM, réseaux) · Théorie (biais/variance, régularisation) · Non supervisé (k-means, EM, PCA, ICA) · RL | L111-L120 | 80 % | SVM/GLM/EM/ICA abordés sans projet ; RL non couvert. |
| **Stanford CS224N NLP with Deep Learning** (Winter 2024/2026) | Word vectors · Backprop · Dependency parsing · RNN · Seq2seq · Transformers · Pretraining · Post-training (RLHF, SFT) · Efficient adaptation (LoRA) · QA · Security and privacy · Benchmarking · Code generation · Multimodal · Constitutional AI · Deployment (FlashAttention) · HW3 transformer · HW4 évaluation et red-teaming | L047, L122, L125, L128-L136, L138, L141-L142, L146, L147 | 90 % | Dependency parsing et QA classique non traités. |
| **Stanford CS324 Understanding and Developing LLMs** (Winter 2022) | Capacités · Harms · Données · Sécurité/privacy · Légal · Modélisation · Entraînement · Parallélisme · Scaling laws · Adaptation · Environnement/coût | L132-L135, L143, L146-L149, L030 | 85 % | Plan à confirmer sur le site (non ouvert). |
| **Stanford CS336 Language Modeling from Scratch** (Spring 2026, devoirs MIT) | Tokenization · PyTorch/resource accounting · Architectures · MoE · GPU/TPU · Kernels/Triton · Parallélisme · Scaling laws · Inférence · Évaluation · Données · SFT/RLHF · RLVR · Alignement · A1 tokenizer BPE + Transformer | L130, L131, L123, L134, L126, L132, L141-L142, L138, L137, L133, L146 | 80 % | Kernels Triton et parallélisme 5D au-delà du périmètre (cités). |
| **Stanford CS25 Transformers United V6** | Overview · JEPA · SSM vs Transformers · Entraînement à grande échelle, MoE · Pré-entraînement · Généralisation (Anthropic) · Agents pour la science · Multimodal · Serving (Modal) | L128-L129, L134, L143, L150 | 70 % | Séminaire d'ouverture : cité en veille (L150). |
| **Harvard CS50's Introduction to AI with Python** | 0 Search · 1 Knowledge · 2 Uncertainty · 3 Optimization · 4 Learning · 5 Neural Networks · 6 Language | L113, L115-L120, L121-L127, L130, L006 | 55 % | IA symbolique (search, logique, CSP) non couverte : NF-IA-150 se concentre sur l'apprentissage et les LLM. |
| **École 42 — projets IA** (ft_linear_regression, DSLR, multilayer-perceptron, Learn2Slither, Leaffliction, Total-Perspective-Vortex ; bootcamps 42 AI Python / ML modules 00-09) | Régression linéaire from scratch · régression logistique multiclasse · MLP from scratch · RL Snake · CNN feuilles · EEG/CSP | L115 (ft_linear_regression, DSLR), L121 (multilayer-perceptron), L124/L127 (Leaffliction), L119, L065 | 75 % | Learn2Slither (RL) et Total-Perspective-Vortex (signal) hors périmètre. Les bootcamps 42 AI modules 05-09 correspondent à L115-L116. |
| **Elements of AI** (Helsinki / Sorbonne, FR, 6 chapitres) | 1 Qu'est-ce que l'IA · 2 Résolution de problèmes (recherche, jeux) · 3 L'IA dans le monde réel (probabilités, Bayes) · 4 Apprentissage automatique · 5 Réseaux neuronaux · 6 Implications | L001-L004, L113, L002, L006, L028-L030 | 80 % | Chapitre 2 (recherche/jeux) non couvert. Cours gratuit recommandé en pré-requis N1. |
| **Microsoft Generative AI for Beginners** (v3, 21 leçons, MIT) | 01 Intro GenAI/LLM · 02 Comparing LLMs · 03 Responsible use · 04-05 Prompt engineering · 06-07 Text/chat apps · 08 Search/vector DB · 09 Image generation · 10 Low code · 11 Function calling · 12 UX · 13 Securing · 14 Lifecycle · 15 RAG · 16 Open source/HF · 17 Agents · 18 Fine-tuning · 19 SLM · 20 Mistral · 21 Meta | L005-L009, L028-L031, L015-L020, L101, L089, L059, L039, L079, L101, L106-L110, L104, L094, L045, L095, L135-L140, L086 | 100 % | Seule ressource tierce réutilisable commercialement (MIT) : peut être traduite/adaptée avec mention de licence. |
| **Microsoft AI for Beginners** (24 leçons, MIT) · **ML for Beginners** (26 leçons) | IA symbolique · réseaux · vision · NLP · éthique / régression · classification · clustering · NLP · séries temporelles · RL | L115-L127, L003, L030 | 70 % | — |
| **Andrej Karpathy — Zero to Hero** (micrograd, makemore, GPT, tokenizer) · Deep Dive into LLMs | Backprop from scratch · MLP · BatchNorm · WaveNet · GPT from scratch · Tokenizer BPE · pré-/post-entraînement, hallucinations, RLHF | L122, L121, L126, L131, L130, L007, L133 | 100 % | Vidéos YouTube embarquées, jamais copiées. |
| **Hugging Face LLM Course** — voir § 10 | | | | |

---

## 12 bis. Spécialisation N5 — Data engineering & Big Data pour l'IA (M31-M37, L151-L184)

Source : dossier 06, § 5 (certifications), § 6 (cours ouverts), § 8.6 (correspondance). Prix en USD hors taxes au 5 novembre 2026. Les pondérations sont celles des guides officiels, sauf mention « source tierce ». Le taux global de chaque certification est la moyenne des taux par domaine pondérée par le poids du domaine (quand il est publié).

### 12 bis.1 Google Cloud — Professional Data Engineer (200 $, 2 h, 40-50 questions, validité 2 ans)

| Domaine tiers (pondération) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| 1. Conception de systèmes de traitement des données (~22 %) | L151, L158, L161, L174, L180 | 50 % | Principes d'architecture, sécurité, conformité et fiabilité traités ; IAM Google Cloud, Dataplex et scénarios de migration GCP non pratiqués. |
| 2. Ingestion et traitement (~25 %) | M33 (L161-L165), M34 (L166-L169), L159-L160 | 55 % | Batch, CDC et streaming couverts en open source (dlt, Debezium, Kafka, Spark, Flink) ; Dataflow/Apache Beam, Pub/Sub et Dataproc seulement cités. |
| 3. Stockage des données (~20 %) | L152, L156, L157, L158 | 50 % | Formats, stockage objet, lakehouse et choix d'entrepôt (BigQuery présenté en L158) ; Bigtable, Spanner, Cloud SQL non traités. |
| 4. Préparation et usage des données pour l'analyse (~15 %), dont 4.2 « Preparing data for AI and ML » | L153, L154, M36 (L175-L179) | 60 % | Le sous-domaine 4.2 est le cœur de M36 ; BigQuery ML, Looker et le partage de données BigQuery non traités. |
| 5. Maintenance et automatisation des charges (~18 %) | L164, L165, L173, L184 | 50 % | Orchestration Airflow 3 (base de Cloud Composer), CI, observabilité ; Cloud Monitoring/Logging et gestion des réservations BigQuery non traités. |
| **Global** | M32-M36 (+ M31, M37) | **≈ 50 %** | À compléter : parcours Google Skills « Professional Data Engineer Certification » (path 16) et pratique des services GCP. |

### 12 bis.2 AWS Certified Data Engineer – Associate (DEA-C01) (150 $, 130 min, 65 questions, seuil 720/1000, validité 3 ans)

| Domaine tiers (pondération) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| 1. Ingestion et transformation des données (34 %) | M33 (L161-L165), M34 (L166-L169), L159 | 50 % | Concepts batch/streaming/CDC et transformation Spark/dbt couverts ; AWS Glue, Kinesis, EMR, MSK, Step Functions et MWAA non pratiqués. |
| 2. Gestion des stockages de données (26 %) | L152, L154, L156, L157, L158 | 45 % | Formats, partitionnement, cycle de vie S3 (L156), modélisation, Redshift présenté en L158 ; DynamoDB et options de stockage AWS détaillées non traitées. |
| 3. Opérations et support des données (22 %) | L164, L170, L173, L184 | 45 % | Orchestration, qualité, observabilité et runbook ; CloudWatch, Athena et automatisation AWS non traités. |
| 4. Sécurité et gouvernance des données (18 %) | L172, L174, L177 | 40 % | Contrôle d'accès, chiffrement, lignage, RGPD, PII ; IAM, KMS, Lake Formation et Macie non traités. |
| **Global** | M32-M35 (+ M36, M37) | **≈ 45 %** | À compléter : AWS Skill Builder (préparation officielle DEA-C01). |

### 12 bis.3 Microsoft Certified: Fabric Data Engineer Associate — examen DP-700 (tarif selon pays ⚠️, renouvellement annuel gratuit)

| Domaine tiers (pondération) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| 1. Implémenter et gérer une solution analytique (30-35 %) | L157, L158, L164, L172, L174 | 35 % | Lakehouse Delta, orchestration, gouvernance et sécurité en général ; espaces de travail Fabric, OneLake, déploiement Fabric non traités. |
| 2. Ingérer et transformer les données — batch et streaming (30-35 %) | M33 (L161-L165), M34 (L166-L169), L159 | 50 % | Concepts et pratique open source ; Data Factory, Dataflows Gen2, Eventstreams et KQL non traités. |
| 3. Superviser et optimiser une solution analytique (30-35 %) | L159, L160, L173 | 35 % | Optimisation Spark et observabilité data ; outils de supervision Fabric non traités. |
| **Global** | M33, M34, M35 | **≈ 40 %** | À compléter : collection Microsoft Learn DP-700 et guide d'étude (mis à jour le 30 oct. 2026). DP-203 (Azure Data Engineer) est retirée depuis le 31 mars 2025 : ne plus l'orienter. |

### 12 bis.4 Databricks Certified Data Engineer Associate (200 $, 90 min, 45 questions, guide d'août 2026, validité 2 ans)

| Domaine tiers (pondération) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| Databricks Intelligence Platform (6 %) | L157, L158 | 40 % | Architecture lakehouse et Databricks présentés ; option de TP sur Databricks Free Edition. |
| Ingestion et chargement (21 %) | L162, L169 | 55 % | Ingestion incrémentale et CDC ; Auto Loader et `COPY INTO` non pratiqués. |
| Transformation et modélisation (22 %) | L154, L159, L163 | 70 % | PySpark 4 (DataFrames, jointures, AQE), médaillon, dbt. |
| Lakeflow Jobs (16 %) | L164 | 40 % | Concepts d'orchestration (dépendances, reprise, backfill) transposables ; Lakeflow Jobs et Declarative Pipelines non pratiqués. |
| CI/CD (10 %) | L165 | 50 % | CI slim dbt sur GitHub Actions ; Databricks Asset Bundles non traités. |
| Dépannage, supervision et optimisation (10 %) | L159, L173 | 60 % | Lecture des plans Spark, déséquilibre, observabilité. |
| Gouvernance et sécurité (15 %) | L157, L172, L174 | 55 % | Unity Catalog (OSS) présenté, lignage, contrôle d'accès. |
| **Global** | M32, M33, M35 | **≈ 55 %** | À compléter : Databricks Academy (cours self-paced gratuits) + Free Edition. |

### 12 bis.5 SnowPro Core Certification (COF-C03) (175 $ selon source tierce ; 100 questions, 115 min selon source tierce)

| Domaine tiers (pondération — source tierce) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| Fonctionnalités et architecture de l'AI Data Cloud (31 %) | L156, L158 | 25 % | Séparation stockage/calcul et principes d'entrepôt cloud ; *virtual warehouses*, micro-partitions, Cortex non traités. |
| Gestion de compte et gouvernance (20 %) | L172, L174 | 35 % | Principes de gouvernance et de contrôle d'accès ; rôles et objets Snowflake non traités. |
| Chargement, déchargement et connectivité (18 %) | L152, L162 | 45 % | Formats et ingestion ; stages, Snowpipe non traités. |
| Performance, requêtes et transformation (21 %) | L153, L163 | 45 % | SQL analytique (fenêtres, QUALIFY, MERGE, semi-structuré), dbt ; cache et clustering Snowflake non traités. |
| Collaboration de données (10 %) | L158 | 20 % | Partage de données cité ; Marketplace non traitée. |
| **Global** | M31, M32, M35 | **≈ 35 %** | Pondérations à confirmer sur le guide officiel COF-C03 ; ≥ 6 mois de pratique Snowflake recommandés par l'éditeur. |

### 12 bis.6 dbt Analytics Engineering Certification Exam (200 $, 65 questions, 2 h, seuil 65 %, dbt 1.11)

| Thème tiers (sans pondération publiée) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| Développer et optimiser des modèles dbt | L163, L165 | 80 % | Sources, `ref`, matérialisations, modèles incrémentaux, snapshots. |
| Gouvernance des modèles | L163, L171 | 60 % | Contrats et évolution de schéma (ODCS) ; versions et niveaux d'accès des modèles à approfondir. |
| Déboguer les erreurs de modélisation | L163, L165 | 60 % | Défi « PR piégée » de L165. |
| Dépanner et optimiser les pipelines | L164, L165 | 60 % | Orchestration, reprise, CI. |
| Implémenter les tests | L163, L170 | 80 % | Tests génériques, singuliers, sévérité `warn`/`error`. |
| Dépendances externes | L163 | 50 % | Sources et packages ; *exposures* à approfondir. |
| Exploiter le *state* dbt | L165 | 70 % | `state:modified`, CI slim. |
| **Global** | **M33** (cœur), M35 | **≈ 65 %** | Certification la plus proche du N5. À compléter : dbt Learn (Fundamentals gratuit + cours avancés) ; ≥ 6 mois de pratique recommandés. |

### 12 bis.7 Confluent Certified Developer for Apache Kafka (CCDAK) (90 min, prix non affiché — ≈ 150 $ selon sources tierces ⚠️, validité 2 ans)

| Thème tiers (thèmes usuels, pas de tableau pondéré officiel) | Modules / leçons N5 | Couverture | Commentaire |
|---|---|---|---|
| Fondamentaux et partitionnement | L166, L167 | 60 % | Topics, partitions, réplication, KRaft. |
| Producteurs (fiabilité, performance) | L167 | 40 % | `acks`, idempotence du producteur ; réglages de performance survolés. |
| Consommateurs (groupes, offsets, rebalancing) | L167, L169 | 50 % | Nouveau protocole KIP-848, commit après écriture. |
| Transactions et exactly-once | L168, L169 | 35 % | Sémantique de livraison et MERGE idempotent ; API transactionnelle non pratiquée. |
| Schémas (Avro, Schema Registry) | L167 | 50 % | |
| Kafka Streams | L168 | 20 % | Présenté face à Flink et Spark Structured Streaming. |
| Dépannage | L169 | 30 % | Panne simulée dans l'atelier CDC. |
| **Global** | **M34** | **≈ 40 %** | À compléter : API Java producteurs/consommateurs, transactions et Kafka Streams en profondeur. |

### 12 bis.8 Cours ouverts de référence (cours, pas des certifications)

Ces cours sont **cités** comme inspirations ; les leçons N5 sont originales (licence du Zoomcamp non indiquée sur la page ⚠️ ; contenus universitaires : inspiration seulement ; MMDS : PDF gratuit, copyright Cambridge University Press).

| Cours (institution) | Chapitres / modules | Leçons N5 | Couverture | Commentaire |
|---|---|---|---|---|
| **DataTalksClub — Data Engineering Zoomcamp** (9 semaines, gratuit) | 1 Conteneurisation & IaC (Docker, Compose, Postgres, Terraform) · 2 Orchestration (Kestra) · Workshop ingestion (dlt) · 3 Data warehousing (BigQuery) · 4 Analytics engineering (dbt, DuckDB) · 5 Data platforms (Bruin) · 6 Batch (Spark) · 7 Streaming (Kafka, Kafka Streams, KSQL, Avro) | L151, L164, L162, L165, L158, L157, L163, L159, L166-L169 | 75 % | Terraform, Kestra et Bruin non traités (Airflow/Dagster à la place de Kestra) ; KSQL non traité. Cours gratuit recommandé en complément (cohorte janvier 2027). |
| **Stanford CS246 — Mining Massive Data Sets** / livre ***Mining of Massive Datasets*** (Leskovec, Rajaraman, Ullman) | MapReduce et Spark · itemsets fréquents · LSH / plus proches voisins · réduction de dimension · recommandation · clustering · PageRank · ML à grande échelle · flux | L156, L159, L176, L178, L166 | 40 % | MMDS ch. 2 (MapReduce), ch. 3 (MinHash/LSH, cœur de L176) et ch. 4 (flux) mobilisés ; fouille de graphes, recommandation et itemsets hors périmètre. |
| **CMU 15-445/645 Database Systems** | Stockage · buffer pool · index · exécution et optimisation des requêtes · concurrence · reprise · bases distribuées | L152, L153, L157, L159 | 25 % | Le N5 utilise les SGBD sans en implémenter les internes ; stockage colonnaire, plans d'exécution et transactions de formats de table reliés au cours. |
| **Berkeley CS186 — Introduction to Database Systems** | SQL I-II · disques et buffers · B+ trees · index spatiaux et vectoriels · tri/hachage · jointures · algèbre relationnelle · optimisation · transactions · reprise · requêtes parallèles · 2PC, Paxos · NoSQL · MapReduce et Spark | L153, L154, L159, L156, L178, L157 | 40 % | SQL, jointures distribuées, index vectoriels et Spark couverts ; implémentation des B+ trees, verrous et reprise hors périmètre. |
| **MIT 6.5830/6.5831 Database Systems** | Modèles et normalisation · traitement et optimisation des requêtes · transactions · bases distribuées/parallèles · KV stores · *streaming databases* · DBaaS | L154, L153, L159, L168, L158 | 40 % | Labs en Go non repris ; *Readings in Database Systems* cité en « pour aller plus loin ». |

---

## 13. Niveau Next Formation → certifications tierces recommandées à passer ensuite

Prix et URL relevés le 1er novembre 2026 (dossiers 01, 02, 03) ; pour N5, relevés le 5 novembre 2026 (dossier 06, § 5-6) ; à revérifier avant publication.

| Niveau Next Formation | Certification / badge tiers recommandé (nom exact) | Prix | Conditions | URL |
|---|---|---|---|---|
| **N1 Fondamentaux** | Badges Claude Academy : « AI Fluency: Framework and foundations », « AI capabilities and limitations », « Claude 101 » | Gratuit | Compte Claude gratuit ; quiz final | https://academy.claude.com/courses |
| | OpenAI Academy — badge « AI Foundations » (puis « Applied AI Foundations », « Agents and Workflows ») | Gratuit | Compte ChatGPT ; évaluation 20 questions, 80 % | https://academy.openai.com/pages/courses |
| | Google AI Essentials (spécialisation 5 cours, certificat Google) | ~49 $/mois après 7 jours d'essai ; audit gratuit | Coursera | https://www.coursera.org/google-specializations/ai-essentials-google |
| | Elements of AI — « Introduction à l'IA » (certificat de complétion) | Gratuit | Version française | https://www.elementsofai.com/ |
| | Microsoft Certified: Azure AI Fundamentals — examen **AI-901** (optionnel, orienté Azure) | Selon pays (~99 $ cité par des tiers, non publié) | Score 700/1000 ; préparation gratuite Microsoft Learn | https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/ |
| **N2 Praticien** | n8n Academy — certificats de complétion **N8N101, N8N102, N8N103** (programme « n8n Foundations ») ; **certification officielle n8n** dès sa sortie (annoncée fin T4 2026) | Non affiché (inscription gratuite ; n8n Cloud en essai ou self-hosting) | 70 % requis par cours | https://learn.n8n.io/courses |
| | Make Academy — badges Credly « AI Agent Builder » (Automation to AI Agents: Advanced) et « AI Automation Explorer » | Gratuit | 6 mois d'accès par inscription | https://academy.make.com/ |
| | Google AI Professional Certificate (8 cours) | ~49 $/mois ou 349 $/an (Google Skills) ; inclus Coursera Plus | 3 mois de Google AI Pro offerts | https://www.coursera.org/professional-certificates/google-ai |
| | Badges Claude Academy : « Introduction to Claude Cowork », « Introduction to Claude Tag », « Introduction to agent skills » | Gratuit | — | https://academy.claude.com/courses |
| | AWS Certified AI Practitioner (AIF-C01) — à confirmer | ~100 $ (source tierce) | Référentiel officiel non vérifié | https://aws.amazon.com/certification/certified-ai-practitioner/ |
| **N3 Développeur** | Badges Claude Academy : « Building with the Claude API » (9 h, 8 quiz), « Claude Platform 101 », « Claude Code 101 », « Claude Code in action », « Introduction to Model Context Protocol », « Model Context Protocol: Advanced topics », « The AI-native SDLC playbook » | Gratuit | — | https://academy.claude.com/courses/building-with-the-claude-api |
| | **Claude Certified Developer – Foundations** (si l'employeur est membre du Claude Partner Network) ; sinon **Claude Certified Architect – Foundations** | 125 $ / 125 $ (remises 50-100 % selon palier partenaire) | Partner Network uniquement ; Pearson VUE ; 120 min ; seuil 720 ; validité 12 mois | https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification · https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification |
| | Hugging Face **Agents Course** (certificat de réussite) et **MCP Course** (certificat de complétion) | Gratuit | Unité 1 + projet / défi | https://huggingface.co/learn/agents-course · https://huggingface.co/learn/mcp-course/unit0/introduction |
| | DeepLearning.AI short courses : « MCP: Build Rich-Context AI Apps with Anthropic », « Agent Skills with Anthropic », « Claude Code: A Highly Agentic Coding Assistant », « Building Systems with the ChatGPT API » | Gratuit | Pas de certificat | https://www.deeplearning.ai/short-courses/ |
| | OpenAI Academy — parcours « Build with AI » | Gratuit | Compte ChatGPT | https://academy.openai.com/ |
| **N4 Expert** | Hugging Face **LLM Course** (Certification exam chapitre 1) et **a smol course** (certificats Fundamentals / Completion) | Gratuit | — | https://huggingface.co/learn/llm-course · https://huggingface.co/learn/smol-course |
| | IBM AI Engineering Professional Certificate (13 cours) | Coursera Plus (abonnement) | ~4 mois à 10 h/semaine | https://www.coursera.org/professional-certificates/ai-engineer |
| | DeepLearning.AI Deep Learning Specialization (5 cours) · Machine Learning Specialization (3 cours, Stanford Online) | Audit gratuit ; Pro ~25-30 $/mois | Coursera | https://www.deeplearning.ai/deep-learning-specialization/ · https://deeplearning.ai/courses/machine-learning-specialization |
| | **Claude Certified Architect – Professional** (Partner Network) | 175 $ | Idem Foundations ; 63 questions | https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification |
| | Harvard CS50's Introduction to AI with Python (certificat vérifié) | 299 $ (audit gratuit) | 7 projets | https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-Python |
| | Stanford Online — Artificial Intelligence Professional Program (XCS229, XCS224N…) | 1 750 $ par cours, certificat après 3 cours | Cohortes payantes | https://hackr.io/blog/stanford-ai-professional-program (source secondaire) |
| **N5 Data engineering (spécialisation)** | **dbt Analytics Engineering Certification Exam** (la plus proche du N5) | 200 $ | 65 questions, 2 h, seuil 65 %, dbt 1.11 ; ≥ 6 mois de pratique recommandés ; préparation gratuite dbt Learn Fundamentals | https://www.getdbt.com/certifications/analytics-engineer-certification-exam |
| | **Databricks Certified Data Engineer Associate** | 200 $ | 45 questions, 90 min ; pas de prérequis ; Databricks Academy + Free Edition gratuites | https://www.databricks.com/learn/certification/data-engineer-associate |
| | **Google Cloud — Professional Data Engineer** | 200 $ (+ taxes) | 40-50 questions, 2 h ; 3 ans d'expérience recommandés dont 1 an sur Google Cloud ; validité 2 ans | https://cloud.google.com/certification/data-engineer |
| | **AWS Certified Data Engineer – Associate (DEA-C01)** | 150 $ | 65 questions, 130 min, seuil 720/1000 ; validité 3 ans ; AWS Skill Builder | https://aws.amazon.com/en/certification/certified-data-engineer-associate |
| | **Microsoft Certified: Fabric Data Engineer Associate** — examen **DP-700** | Selon pays (⚠️ non vérifié) | Score ≥ 700 ; renouvellement annuel gratuit en ligne | https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-700 |
| | **SnowPro Core Certification (COF-C03)** | 175 $ (source tierce) | ≥ 6 mois de pratique Snowflake recommandés | https://learn.snowflake.com/en/certifications/snowpro-core-c03 |
| | **Confluent Certified Developer for Apache Kafka (CCDAK)** | ≈ 150 $ (sources tierces, ⚠️ non vérifié) | 90 min, surveillé, en anglais ; validité 2 ans | https://www.confluent.io/en-gb/certification/ |
| | DataTalksClub **Data Engineering Zoomcamp** (cours ; modalités de certificat ⚠️ à vérifier) | Gratuit | 9 semaines ; cohorte janvier 2027 ou self-paced | https://github.com/datatalksclub/data-engineering-zoomcamp |

---

## 14. Écarts identifiés et propositions optionnelles (non appliquées)

- **Proposition optionnelle :** L064 « Conduite du changement et montée en compétence des équipes » ne dure que 10 min dans `programme.json` alors qu'elle porte la correspondance avec « Building effective human-agent teams » et « Deploying Claude Enterprise » ; envisager 45-60 min (M15 passerait à ~180-195 min).
- **Proposition optionnelle :** ajouter un encart « Azure AI Foundry / Azure OpenAI » en L062 ou L088 pour relever la couverture d'AI-901 (domaine 2 à 55-60 %).
- **Proposition optionnelle :** ouvrir les guides d'examen PDF Anthropic et l'exam guide AWS AIF-C01 lors de la prochaine session de recherche pour remplacer les pondérations tierces par les pondérations officielles.
