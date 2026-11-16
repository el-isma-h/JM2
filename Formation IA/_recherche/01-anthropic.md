# Recherche 01 — Écosystème ANTHROPIC (état au 1er novembre 2026)

> Objet : cartographier tout ce qu'Anthropic propose (formations, certifications, documentation, outils, dépôts) afin que notre formation IA de 150 h couvre 100 % de leur référentiel.
> Méthode : WebSearch + WebFetch. Chaque URL est marquée :
> - ✅ = page ouverte et lue avec WebFetch le 1er novembre 2026 (contenu résumé ci-dessous)
> - ⚠️ = URL citée par une page officielle vérifiée, mais que je n'ai **pas pu ouvrir** (hors liste d'accès de la session, ou document PDF non récupérable). À re-vérifier avant usage dans un support.
> - ❌ = inaccessible / redirigée
>
> **Aucune URL n'a été inventée.** Les faits provenant de sources tierces (blogs, sites de préparation) sont signalés comme tels.

---

## 0. Synthèse en 12 points (pour l'équipe pédagogique)

1. **Anthropic Academy a été renommée « Claude Academy »** le 20 août 2026 et vit désormais sur `https://academy.claude.com/` (l'ancienne URL `anthropic.com/learn` redirige en 302 vers academy.claude.com ✅). L'ancienne instance Skilljar grand public `anthropic.skilljar.com` sert encore les certificats et quelques liens, mais le catalogue de référence est academy.claude.com.
2. **Catalogue grand public : 27 cours gratuits** (5 sections), 124 tutoriels, 157 cas d'usage, en anglais uniquement. Badges de fin de cours gratuits, délivrés à la réussite du dernier quiz, vérifiables publiquement, sans expiration.
3. **Il existe bien des certifications officielles payantes**, mais elles sont **réservées aux employés d'organisations membres du Claude Partner Network** (e-mail professionnel sur domaine reconnu, 18 ans minimum). Quatre examens : Claude Certified Associate – Foundations (99 $), Claude Certified Developer – Foundations (125 $), Claude Certified Architect – Foundations (125 $), Claude Certified Architect – Professional (175 $). Examens surveillés Pearson VUE (OnVUE ou centre), 120 min, QCM/QCM multiples sur scénarios, livre fermé, score 100–1000, seuil 720, validité 12 mois, langues EN + JA, badges Credly. Source officielle : FAQ certifications Skilljar partenaires ✅.
4. **Un organisme de formation français ne peut pas « vendre la certification Anthropic »** : il peut préparer à l'examen, mais le candidat doit appartenir à un partenaire Anthropic. Notre certification devra être la nôtre (ou une certification tierce), en s'alignant sur les domaines des guides d'examen.
5. **Documentation développeur** : désormais sur `https://platform.claude.com/docs/en/…` (docs.claude.com / docs.anthropic.com sont les anciennes adresses). Chaque page existe aussi en version `.md` (ex. `home.md`) pratique pour l'ingénierie pédagogique. Claude Code a sa propre doc sur `https://code.claude.com/docs/…` avec un index `llms.txt`.
6. **Modèles actuels (1er nov. 2026)** : Claude Fable 5.1 (`claude-fable-5-1`, 10 $/50 $ par MTok, sorti 1er sept. 2026), Claude Opus 5.5 (`claude-opus-5-5`, 4 $/20 $, 22 sept. 2026), Claude Sonnet 5.5 (`claude-sonnet-5-5`, 2 $/10 $, 28 sept. 2026), Claude Haiku 5.5 (`claude-haiku-5-5`, dès 0,10 $/0,50 $, 7 oct. 2026). Tous : contexte 1M tokens, sortie max 128K, thinking adaptatif, cutoff juin 2026. Claude Mythos 5.1 = mêmes specs/prix que Fable 5.1, réservé aux organisations vérifiées (Cyber Verification Program).
7. **Nouveautés majeures 2026** : Managed Agents (harnais d'agents hébergé par Anthropic, 0,08 $/h de session), Agent Skills (SKILL.md), mode `effort`, thinking adaptatif, compaction, Fast mode, API version `2026-10-21`, SDK v2 sous licence Apache 2.0, Claude Cowork, Claude Tag (Slack), Claude Code Desktop/Web/Channels/Routines, Project Glasswing/Mythos.
8. **Le dépôt GitHub `anthropics/courses` est archivé depuis le 15 sept. 2026 et sous licence CC BY-NC 4.0** (usage non commercial uniquement) ✅ — on ne peut **pas** réutiliser ses notebooks tels quels dans une formation vendue ; il faut réécrire.
9. Le cookbook est désormais publié sur `https://platform.claude.com/cookbook` ✅ (dépôt GitHub `anthropics/claude-cookbooks` selon cette page ; licence non vérifiée).
10. Le **guide de prompt engineering** a été réorganisé : 1 page « Overview », 1 page « Prompting best practices » (référence principale), puis 8 pages de guidance par modèle (Fable 5.1, Fable 5, Opus 5.5, Opus 5, Opus 4.8, Sonnet 5.5, Sonnet 5, Haiku 5.5) ✅.
11. **MCP** : spécification stable `2025-11-25` (citée par la doc Anthropic ✅) et release candidate `2026-07-28-RC` (GitHub ✅) ; site `modelcontextprotocol.io` ⚠️ non ouvrable depuis cette session.
12. **Syllabus détaillé** de 15 cours Academy/Skilljar en fin de document (section 9), module par module.

---

## 1. Claude Academy (ex-Anthropic Academy) — cours grand public gratuits

### 1.1 Plateforme

| Élément | Détail | URL | Statut |
|---|---|---|---|
| Accueil Claude Academy | Catalogue gratuit, compte Claude (gratuit) pour sauvegarder la progression ; 27 cours, 124 tutoriels, 157 cas d'usage | https://academy.claude.com/ | ✅ (via redirection depuis anthropic.com/learn) |
| Catalogue des cours | 5 sections, 27 cours | https://academy.claude.com/courses | ✅ |
| Ancienne URL Anthropic Academy | Redirige (302) vers academy.claude.com | https://anthropic.com/learn | ✅ (redirection constatée) |
| FAQ Academy | Badges, comptes, migration Skilljar, distinction avec les certifications payantes | https://academy.claude.com/help/faq | ✅ |
| Connecteur MCP Academy | Serveur MCP en lecture seule (`search_academy`, `get_content`, `list_content`) — `https://academy.claude.com/mcp` | https://academy.claude.com/help/mcp | ✅ |
| Exemple de tutoriel | « Creating your first skill » | https://academy.claude.com/tutorials/creating-your-first-skill | ⚠️ cité par la page MCP |
| Ancienne instance Skilljar grand public | Catalogue historique (13 cours au lancement, 2 mars 2026), certificats toujours valides | https://anthropic.skilljar.com/ | ⚠️ non ouvrable directement ; un certificat Skilljar a été lu ✅ (https://anthropic.skilljar.com/c/jmi2mx2dd6xp → cours « Claude Code 101 », émetteur « Anthropic Education ») |
| Article Anthropic sur sa pédagogie | « Anthropic's approach to teaching and learning AI » | https://claude.com/blog/anthropics-approach-to-teaching-and-learning-ai | ⚠️ (résultat de recherche, non ouvert) |

Points clés de la FAQ ✅ :
- Badges gratuits, délivrés à la réussite du **dernier quiz requis** (pas à la simple lecture), lien public de vérification, partage LinkedIn, pas d'expiration, tentatives de quiz illimitées.
- Les certifications officielles sont « un programme distinct, payant et surveillé », délivrées par Pearson, titre émis via Credly, accessibles aux partenaires via anthropic-partners.skilljar.com.
- Cours en anglais (la FAQ ne mentionne pas d'autres langues ; les articles tiers confirment « anglais uniquement »).

### 1.2 Les 27 cours (catalogue lu le 1er nov. 2026 ✅)

Format URL : `https://academy.claude.com/courses/<slug>`. Licence : contenu © Anthropic PBC, aucune licence de réutilisation affichée (⇒ ne pas copier, s'en inspirer pour la structure).

**Section « Start your journey » (5)**

| Cours | Durée | Leçons / quiz | Public | URL | Statut |
|---|---|---|---|---|---|
| Claude 101 | 2,5 h | 13 / 1 | Débutants, usage pro quotidien | https://academy.claude.com/courses/claude-101 | ✅ (plan via Skilljar partenaires) |
| Claude Code 101 | 1,5 h | 12 / 1 | Devs débutants en agents de code | https://academy.claude.com/courses/claude-code-101 | ✅ |
| Introduction to Claude Cowork | 2,5 h | 14 / 1 | Utilisateurs desktop (Pro/Max) | https://academy.claude.com/courses/introduction-to-claude-cowork | ✅ (plan via Skilljar) |
| Introduction to Claude Tag | 2,5 h | 11 / 1 | Équipes Slack | https://academy.claude.com/courses/introduction-to-claude-tag | ✅ |
| Claude Platform 101 | 1,5 h | 13 / 1 | Devs (TypeScript SDK) | https://academy.claude.com/courses/claude-platform-101 | ✅ (plan via Skilljar) |

**Section « Learn the products » (7)**

| Cours | Durée | Leçons / quiz | Public | URL | Statut |
|---|---|---|---|---|---|
| Claude Code in action | 1 h | 9 / 1 | Devs utilisant déjà Claude Code | https://academy.claude.com/courses/claude-code-in-action | ✅ |
| Introduction to Model Context Protocol | 1 h | 10 / 1 | Devs Python | https://academy.claude.com/courses/introduction-to-model-context-protocol | ✅ (plan via Skilljar) |
| Model Context Protocol: Advanced topics | 1,5 h | 11 / 1 | Devs avancés (async, SSE) | https://academy.claude.com/courses/model-context-protocol-advanced-topics | ✅ (plan via Skilljar) |
| Introduction to subagents | 45 min | 4 / — | Utilisateurs Claude Code | https://academy.claude.com/courses/introduction-to-subagents | ✅ (plan via Skilljar) |
| Introduction to agent skills | 1 h | 6 / — | Utilisateurs Claude Code, équipes | https://academy.claude.com/courses/introduction-to-agent-skills | ✅ (plan via Skilljar) |
| The AI-native SDLC playbook | 1 h | 14 / — | Responsables ingénierie / plateforme / sécurité | https://academy.claude.com/courses/ai-native-sdlc-playbook | ✅ |
| Deploying Claude Enterprise with confidence | 2,5 h | 14 / 1 | Admins / responsables de déploiement | https://academy.claude.com/courses/deploying-claude-enterprise-with-confidence | ✅ |

**Section « Become AI fluent » (3)**

| Cours | Durée | Leçons / quiz | Public | URL | Statut |
|---|---|---|---|---|---|
| AI Fluency: Framework and foundations | 4 h | 14 / 1 | Tout public (framework 4D) | https://academy.claude.com/courses/ai-fluency-framework-foundations | ✅ (plan via Skilljar) |
| AI capabilities and limitations | 3,5 h | 13 / 1 | Tout public | https://academy.claude.com/courses/ai-capabilities-and-limitations | ✅ |
| Building effective human-agent teams (beta) | 45 min | 5 / 1 | Managers | https://academy.claude.com/courses/building-effective-human-agent-teams | ✅ |

**Section « AI Fluency, for your world » (9)** — durées non affichées sur le catalogue (les articles tiers indiquent 1,5 h à 5 h)

| Cours | Leçons / quiz | Public | URL | Statut |
|---|---|---|---|---|
| For builders | 9 / 1 | Concepteurs produit | https://academy.claude.com/courses/ai-fluency-for-builders | catalogue ✅ |
| For creative work | 8 / 1 | Créatifs | https://academy.claude.com/courses/ai-fluency-for-creative-work | catalogue ✅ |
| For educators | 4 / 1 | Enseignants (supérieur) | https://academy.claude.com/courses/ai-fluency-for-educators | catalogue ✅ |
| For pK–12 educators | 10 / 1 | Enseignants primaire/secondaire | https://academy.claude.com/courses/ai-fluency-for-k-12-educators | catalogue ✅ |
| For pK–12 Train the Trainer | 4 / — | Formateurs d'enseignants | https://academy.claude.com/courses/ai-fluency-for-pk-12-train-the-trainer | catalogue ✅ |
| For facilitators (Teaching AI Fluency) | 7 / 1 | Formateurs | https://academy.claude.com/courses/teaching-ai-fluency | catalogue ✅ |
| For nonprofits | 9 / 1 | Associations | https://academy.claude.com/courses/ai-fluency-for-nonprofits | catalogue ✅ |
| For small businesses | 8 / 1 | TPE/PME | https://academy.claude.com/courses/ai-fluency-for-small-businesses | catalogue ✅ |
| For students | 5 / 1 | Étudiants | https://academy.claude.com/courses/ai-fluency-for-students | catalogue ✅ |

**Section « Build with the API » (3)**

| Cours | Durée | Leçons / quiz | Public | URL | Statut |
|---|---|---|---|---|---|
| Building with the Claude API | 9 h | 67 / 8 | Devs Python | https://academy.claude.com/courses/building-with-the-claude-api | ✅ |
| Claude with Amazon Bedrock | 8 h | 65 / 8 | Devs AWS | https://academy.claude.com/courses/claude-with-amazon-bedrock | ✅ |
| Claude on Google Cloud (Vertex AI) | 8,5 h | 66 / 9 | Devs GCP | https://academy.claude.com/courses/claude-with-google-cloud-s-vertex-ai | catalogue ✅ |

Volume total approximatif du catalogue : ~75 h de contenu (hors tutoriels/cas d'usage).

Miroir Coursera (gratuit, sans certificat) du cours API : https://www.coursera.org/learn/building-with-the-claude-api ✅ (7 modules, 78 vidéos, 14 évaluations, ~13 h selon Coursera).

### 1.3 Anthropic Partner Academy (Skilljar partenaires) — 55 cours

Instance distincte réservée au Claude Partner Network, mais **les pages de cours sont lisibles sans compte** (c'est là que j'ai pu lire les plans détaillés). Catalogue complet ✅ : https://anthropic-partners.skilljar.com/page/all-courses

| Ressource | Type | Durée | Public | URL | Licence | Notes |
|---|---|---|---|---|---|---|
| Learning paths (Associate, Developer, Architect, FDE, Administrator) | page | — | Partenaires | https://anthropic-partners.skilljar.com/page/learning-paths | © Anthropic | ✅ |
| Parcours Claude Architect | path (10 cours) | — | Architectes | https://anthropic-partners.skilljar.com/path/claude-architect | © Anthropic | ✅ (Claude Platform 101 = cours 4/10) |
| Cours de préparation aux certifs | page | — | Partenaires | https://anthropic-partners.skilljar.com/page/claude-certification-exam-prep-courses | © Anthropic | ✅ |
| Prep Associate – Foundations | path (8 cours) | — | Consultants, vendeurs | https://anthropic-partners.skilljar.com/path/claude-certified-associate-foundations | © Anthropic | ✅ |
| Prep Developer – Foundations | path (5 cours, 774 min ≈ 13 h) | — | Devs | https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations | © Anthropic | ✅ |
| Prep Architect – Foundations | page (7 cours) | — | Architectes | https://anthropic-partners.skilljar.com/page/claude-certified-architect-foundations-prep-courses | © Anthropic | ✅ |
| Prep Architect – Professional | path (5 cours) | — | Architectes | https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional | © Anthropic | ✅ |
| Claude Platform & Model Foundations | cours | 59 min | Associate | https://anthropic-partners.skilljar.com/claude-platform-model-foundations | © Anthropic | catalogue ✅ |
| Workflow Integration & Solution Design | cours | 63 min | Associate | https://anthropic-partners.skilljar.com/workflow-integration-solution-design | © Anthropic | catalogue ✅ |
| Governance, Risk & Responsible Use | cours | 55 min | Associate | https://anthropic-partners.skilljar.com/governance-risk-responsible-use | © Anthropic | catalogue ✅ |
| Prompting & Task Execution | cours | 53 min | Associate | https://anthropic-partners.skilljar.com/prompting-task-execution | © Anthropic | catalogue ✅ |
| Evaluating & Validating Claude's Output | cours | 74 min | Associate | https://anthropic-partners.skilljar.com/evaluating-validating-claudes-output | © Anthropic | catalogue ✅ |
| Configuration & Knowledge Management | cours | 47 min | Associate | https://anthropic-partners.skilljar.com/configuration-knowledge-management | © Anthropic | catalogue ✅ |
| Troubleshooting & Optimization | cours | 30 min | Associate | https://anthropic-partners.skilljar.com/troubleshooting-optimization | © Anthropic | catalogue ✅ |
| MSO Foundations | cours | 57 min | Developer | https://anthropic-partners.skilljar.com/mso-foundations | © Anthropic | catalogue ✅ |
| Production-Grade Prompting, Agents & Tool Use | cours | 209 min | Developer | https://anthropic-partners.skilljar.com/production-grade-prompting-agents-tool-use | © Anthropic | ✅ (objectifs lus) |
| Claude Code, MCP & Integration | cours | 142 min | Developer | https://anthropic-partners.skilljar.com/claude-code-mcp-integration | © Anthropic | ✅ (objectifs lus) |
| Production Engineering, Evals & Security | cours | 211 min | Developer | https://anthropic-partners.skilljar.com/production-engineering-evals-security | © Anthropic | ✅ (objectifs lus) |
| Accelerators & IP Contribution | cours | 155 min | Developer | https://anthropic-partners.skilljar.com/accelerators-ip-contribution | © Anthropic | catalogue ✅ |
| Claude Platform & Solution Design | cours | 238 min | Architect Pro | https://anthropic-partners.skilljar.com/claude-platform-solution-design | © Anthropic | ✅ (objectifs lus) |
| Enterprise Integration & Production | cours | 158 min | Architect Pro | https://anthropic-partners.skilljar.com/enterprise-integration-production | © Anthropic | catalogue ✅ |
| Stakeholder Engagement, Lifecycle & GTM | cours | 178 min | Architect Pro | https://anthropic-partners.skilljar.com/stakeholder-engagement-lifecycle-gtm | © Anthropic | catalogue ✅ |
| Team Enablement & Operational Productivity | cours | 45 min | Architect Pro | https://anthropic-partners.skilljar.com/developer-productivity-enablement | © Anthropic | catalogue ✅ |
| Responsible AI, Safety & Risk for Architects | cours | 114 min | Architect Pro | https://anthropic-partners.skilljar.com/responsible-ai-safety-risk-for-architects | © Anthropic | catalogue ✅ |
| Working with Claude Fable 5.1 | cours | — | Partenaires (tous rôles) | https://anthropic-partners.skilljar.com/working-with-claude-fable-51 | © Anthropic | ✅ |
| Upgrade a client's build to the Claude 5.5 models | cours | — | Partenaires | https://anthropic-partners.skilljar.com/bring-the-claude-55-models-to-your-clients | © Anthropic | ✅ |
| Opus 4.7 and Cyber | cours | — | Partenaires | https://anthropic-partners.skilljar.com/opus-47-and-cyber | © Anthropic | catalogue ✅ |
| Claude Security | cours | — | Partenaires | https://anthropic-partners.skilljar.com/claude-security | © Anthropic | catalogue ✅ |
| Installation and Environments / Configuration and Customization / Extensibility (Claude Code admin) | cours | — | Partner Enablement | https://anthropic-partners.skilljar.com/installation-and-environments · https://anthropic-partners.skilljar.com/configuration-and-customization · https://anthropic-partners.skilljar.com/extensibility-course | © Anthropic | catalogue ✅ |
| Product Foundations / Deployment Architecture / Delivery Methodology / Security and Governance / Administration and Measurement | cours | — | Partner Enablement | https://anthropic-partners.skilljar.com/product-foundations · …/deployment-architecture · …/delivery-methodology · …/security-and-governance · …/administration-and-measurement | © Anthropic | catalogue ✅ |
| Driving enterprise adoption of Claude | cours | — | Partenaires | https://anthropic-partners.skilljar.com/driving-enterprise-adoption-of-claude | © Anthropic | catalogue ✅ |
| Claude Partner Network Connect (épisodes 01–06) | webinaires | — | Partenaires | ex. https://anthropic-partners.skilljar.com/claude-partner-network-connect-episode-01 | © Anthropic | catalogue ✅ |
| Claude Code partner badge | badge | — | Partenaires | https://anthropic-partners.skilljar.com/path/partner-badge-claude-code | — | ✅ (lien) |

Les 13 cours « grand public » (Claude 101, Claude Code 101, AI Fluency…, Building with the Claude API, MCP, Bedrock, Vertex, Cowork, agent skills, subagents…) sont dupliqués dans cette instance avec les mêmes contenus.

---

## 2. Certifications officielles Anthropic (payantes, surveillées)

### 2.1 Ce qui existe exactement

Source officielle ✅ : **FAQ Certifications** https://anthropic-partners.skilljar.com/page/faq-certifications et page **Partner certifications** https://anthropic-partners.skilljar.com/page/partner-certifications.

| Certification (nom exact) | Code usuel | Prix (USD, avant remise partenaire) | Public visé (officiel) | Compte pour le niveau Partner Network | Page d'inscription | Guide d'examen (PDF) |
|---|---|---|---|---|---|---|
| Claude Certified Associate – Foundations | CCAO-F (communauté) | 99 $ | Consultants, vendeurs, responsables de livraison | Non | https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification ✅ | ⚠️ PDF sur everpath-course-content.s3-accelerate.amazonaws.com (lien officiel, non récupérable depuis cette session) |
| Claude Certified Developer – Foundations | CCDV-F | 125 $ | Ingénieurs qui développent avec l'API Claude, Claude Code et MCP | Oui | https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification ✅ | ⚠️ idem |
| Claude Certified Architect – Foundations | CCA-F / CCAR-F (Pearson) | 125 $ (99 $ avant le 30 juin 2026) | Partenaires concevant des solutions Claude de bout en bout | Oui | https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification ✅ (bouton « Purchase \| $125 ») | ⚠️ idem |
| Claude Certified Architect – Professional | CCA-P / CCAR-P | 175 $ | Idem, niveau avancé | Oui | https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification ✅ (bouton « Purchase \| $175 ») | ⚠️ idem |

Contenu évalué, selon la page CCA-F ✅ : « Claude Code, le Claude Agent SDK, l'API Claude et le Model Context Protocol (MCP) ».

### 2.2 Format, règles, validité (FAQ officielle ✅)

| Élément | Valeur officielle |
|---|---|
| Format | Questions à choix multiples et à réponses multiples, basées sur des scénarios |
| Durée | 120 min d'examen (≈ 135 min avec enregistrement et enquête) |
| Livre fermé | Oui : ni notes, ni documentation, ni outils IA, ni traduction automatique du navigateur |
| Score | Échelle 100–1 000, **seuil de réussite 720** (les 4 certifs) |
| Nombre de questions | **Non publié dans la FAQ** (voir 2.3 pour les chiffres tiers) |
| Prérequis | Aucun prérequis formel ; Architect – Pro peut être passé sans Foundations ; Foundations ne se convertit pas en Pro |
| Éligibilité | Employé d'une organisation du Claude Partner Network (e-mail pro sur domaine reconnu) ; 18 ans minimum (pièce d'identité) |
| Validité | **12 mois** à partir de l'obtention (les certifs obtenues avant le 30 juin 2026 ont été prolongées à 12 mois) ; recertification = évaluation non surveillée gratuite sur Partner Academy ; si expirée, repasser l'examen complet ; inscription valable 5 ans |
| Reprises | Délais 14 j / 30 j / 90 j après 1er/2e/3e échec ; max 4 tentatives par 12 mois glissants ; reprise au plein tarif (avec remise de palier) |
| Langues | Anglais et japonais |
| Plateforme | Pearson (OnVUE en ligne surveillé ou centre Pearson) ; badges Credly ; annulation jusqu'à 48 h avant |
| Pays exclus OnVUE | Biélorussie, Cuba, Corée du Nord, Russie, Syrie, certaines régions d'Ukraine ; Iran suspendu à partir du 8 sept. 2026 |
| Remises | 50 % pour paliers Select / Preferred / Global Premier ; 100 % pour Global Premier jusqu'au 31 déc. 2026 |

Page Pearson VUE citée par les tiers : https://www.pearsonvue.com/us/en/anthropic.html ⚠️ (non ouvrable depuis cette session).
Annonce du Claude Partner Network citée : https://www.anthropic.com/news/claude-partner-network ⚠️.

### 2.3 Domaines évalués et pondérations — ⚠️ sources tierces (reprises des guides d'examen officiels v1.0 de juillet 2026, que je n'ai pas pu ouvrir)

Sources : CloudThat ✅ (https://www.cloudthat.com/resources/blog/claude-certified-architect-foundations-exam-guide-skills-format-and-preparation, 13 août 2026) ; claudearchitectcertification.com ✅ (https://claudearchitectcertification.com/blog/what-each-claude-certification-actually-tests-domain-by-domain) ; pasqualepillitteri.it ✅ (https://pasqualepillitteri.it/en/news/3297/claude-certified-architect-guide-2026-en). Ces trois sources concordent sur CCA-F.

**Claude Certified Architect – Foundations (CCA-F)** — 60 questions, 120 min, 29 objectifs de tâches, 4 scénarios tirés parmi 6 banques :

| # | Domaine | Poids |
|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27 % |
| 2 | Claude Code Configuration & Workflows | 20 % |
| 3 | Prompt Engineering & Structured Output | 20 % |
| 4 | Tool Design & MCP Integration | 18 % |
| 5 | Context Management & Reliability | 15 % |

Expérience recommandée (CloudThat) : ~6 mois de pratique Claude (API, Agent SDK, Claude Code, MCP).

**Claude Certified Architect – Professional (CCA-P)** — 63 questions :

| Domaine | Poids |
|---|---|
| Integration | 19 % |
| Solution Design & Architecture | 17 % |
| Evaluation, Testing & Optimization | 16 % |
| Governance, Safety & Risk | 14 % |
| Stakeholder Communication & Lifecycle | 14 % |
| Claude Models, Prompting & Context Engineering | 13 % |
| Developer Productivity & Operational Enablement | 7 % |

**Claude Certified Developer – Foundations (CCDV-F)** — 53 questions :

| Domaine | Poids |
|---|---|
| Applications & Integration | 33,1 % |
| Model Selection & Optimization | 16,8 % |
| Agents & Workflows | 14,7 % |
| Prompt & Context Engineering | 11,0 % |
| Tools & MCPs | 10,6 % |
| Security & Safety | 8,1 % |
| Claude Code | 3,1 % |
| Evaluation, Testing & Debugging | 2,6 % |

**Claude Certified Associate – Foundations (CCAO-F)** — 60 questions :

| Domaine | Poids |
|---|---|
| Output Evaluation & Validation | 21 % |
| Workflow Integration & Solution Design | 16 % |
| Governance, Risk & Responsible Use | 15 % |
| Prompting & Task Execution | 14 % |
| Product & Model Selection | 12 % |
| Configuration & Knowledge Management | 12 % |
| Troubleshooting & Optimization | 10 % |

> Remarque : les noms des domaines Associate correspondent exactement aux 7 cours de 30–74 min du parcours Associate sur Partner Academy (section 1.3) — c'est le référentiel « utilisateur métier » le plus directement exploitable pour un public non développeur.

> Divergence constatée : l'article pasqualepillitteri (mars 2026) indiquait « validité 2 ans, 99 $, lancement 12 mars 2026, early access gratuit pour 5 000 employés partenaires ». La FAQ officielle (lue le 1er nov. 2026) fait foi : **12 mois, 125 $**.

### 2.4 Conséquence pour notre formation

- Aucune certification Anthropic n'est ouverte au grand public ni vendable par un organisme de formation tiers. Les « certificats » accessibles à tous sont les **badges gratuits de Claude Academy**.
- Positionnement possible : « Formation alignée sur les référentiels Claude Certified Developer – Foundations et Architect – Foundations » (sans prétendre délivrer la certification), + notre propre évaluation certifiante.

---

## 3. Documentation Claude Platform (platform.claude.com/docs)

### 3.1 Structure et pages clés (toutes ✅ sauf mention)

| Ressource | Type | Public | URL | Notes |
|---|---|---|---|---|
| Accueil docs | hub | Devs | https://platform.claude.com/docs/en/home (version brute : https://platform.claude.com/docs/en/home.md) | ✅ Hub « Messages » vs « Managed Agents » ; exemples en Python, TS, Go, Java, Ruby, PHP, C#, cURL, CLI `ant` |
| Intro to Claude | page | Devs | https://platform.claude.com/docs/en/intro | lien ✅ |
| Quickstart | page | Devs | https://platform.claude.com/docs/en/get-started | ✅ `pip install anthropic`, `ANTHROPIC_API_KEY`, modèle `claude-opus-5-5` |
| Obtenir une clé API | page | Devs | https://platform.claude.com/docs/en/get-api-key | lien ✅ |
| Console (clés, playground) | outil | Devs | https://platform.claude.com/ · https://platform.claude.com/settings/keys · https://platform.claude.com/playground | liens ✅ (le « Workbench » historique = « Console playground ») |
| Features overview (liste exhaustive des fonctionnalités) | page | Devs | https://platform.claude.com/docs/en/build-with-claude/overview | ✅ 57 fonctionnalités plateforme + 18 Messages API + 19 Managed Agents |
| Using the Messages API | page | Devs | https://platform.claude.com/docs/en/build-with-claude/working-with-messages | ✅ multi-tours, rôle `system` en cours de conversation, prefill non supporté ≥ 4.6, `temperature/top_p/top_k` non supportés ≥ 4.7 |
| Messages API reference | référence | Devs | https://platform.claude.com/docs/en/api/messages/create | lien ✅ |
| API overview / versioning | référence | Devs | https://platform.claude.com/docs/en/api/overview · https://platform.claude.com/docs/en/api/versioning · https://platform.claude.com/docs/en/api/migration-2026-10-21 | liens ✅ (version API `2026-10-21`) |
| Stop reasons and fallback | page | Devs | https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons | lien ✅ |
| Streaming | page | Devs | https://platform.claude.com/docs/en/build-with-claude/streaming | ✅ événements `message_start` → `content_block_*` → `message_delta` → `message_stop` ; deltas `text_delta`, `input_json_delta`, `thinking_delta`, `signature_delta` |
| System prompts (prompts système des apps Claude) | référence | Tous | https://platform.claude.com/docs/en/release-notes/system-prompts/overview | lien ✅ (ex. https://platform.claude.com/docs/en/release-notes/system-prompts/claude-fable-5-1) |
| Mid-conversation system messages | page | Devs | https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages | lien ✅ |
| Tool use overview | page | Devs | https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview | ✅ 27 sous-pages (liste en 3.3) |
| Structured outputs | page | Devs | https://platform.claude.com/docs/en/build-with-claude/structured-outputs | ✅ `output_config.format` = `json_schema` ; `client.messages.parse()` ; incompatible citations/prefill |
| Vision | page | Devs | https://platform.claude.com/docs/en/build-with-claude/vision | lien ✅ (JPEG/PNG/GIF/WebP, base64/url/file) |
| PDF support | page | Devs | https://platform.claude.com/docs/en/build-with-claude/pdf-support | ✅ 128 Mo/requête, 600 pages max (100 si contexte < 1M) |
| Prompt caching | page | Devs | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | ✅ min 512 tokens (modèles 5.5), TTL 5 min (gratuit au refresh) / 1 h (2×), écriture 1,25×, lecture 0,1× (0,05× Opus/Sonnet 5.5 ; 0,025× Fable 5.1), automatic caching (`cache_control` racine), 4 breakpoints |
| Cache diagnostics | page | Devs | https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics | lien ✅ |
| Batch processing (Message Batches API) | page | Devs | https://platform.claude.com/docs/en/build-with-claude/batch-processing | ✅ −50 %, < 1 h en général, expiration 24 h, résultats 29 j, 100 000 requêtes / 256 Mo par lot |
| Files API | page | Devs | https://platform.claude.com/docs/en/build-with-claude/files | ✅ GA (header beta plus requis), 500 Mo/fichier, 1 To/org, expiration 1 h–90 j |
| Thinking (adaptive / extended / preserved) | page | Devs | https://platform.claude.com/docs/en/build-with-claude/thinking · https://platform.claude.com/docs/en/build-with-claude/extended-thinking · https://platform.claude.com/docs/en/build-with-claude/preserved-thinking | ✅ adaptive recommandé ; extended refusé (400) sur Claude 5 ; `display: summarized` |
| Effort | page | Devs | https://platform.claude.com/docs/en/build-with-claude/effort | lien ✅ (per-message effort beta) |
| Fast mode | page | Devs | https://platform.claude.com/docs/en/build-with-claude/fast-mode | lien ✅ |
| Citations | page | Devs | https://platform.claude.com/docs/en/build-with-claude/citations | ✅ `cited_text` non facturé en sortie ; incompatible structured outputs |
| Search results | page | Devs | https://platform.claude.com/docs/en/build-with-claude/search-results | lien ✅ |
| Context windows | page | Devs | https://platform.claude.com/docs/en/build-with-claude/context-windows | lien ✅ |
| Context editing / Compaction (on-demand, background, threshold, keep-tail) | pages | Devs | https://platform.claude.com/docs/en/build-with-claude/context-editing · …/compaction-on-demand · …/compaction-background · …/compaction-threshold · …/compaction-keep-recent-turns | liens ✅ |
| Task budgets | page | Devs | https://platform.claude.com/docs/en/build-with-claude/task-budgets | lien ✅ |
| Token counting | page | Devs | https://platform.claude.com/docs/en/build-with-claude/token-counting | lien ✅ |
| Multilingual support | page | Devs | https://platform.claude.com/docs/en/build-with-claude/multilingual-support | lien ✅ |
| Refusals and fallback / Fallback credit | pages | Devs | https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback · https://platform.claude.com/docs/en/build-with-claude/fallback-credit | liens ✅ |
| Agent Skills overview | page | Devs | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | ✅ SKILL.md (frontmatter `name`, `description`), skills pré-construits pptx/xlsx/docx/pdf ; code sur github.com/anthropics/skills |
| Skills guide (custom skills) | page | Devs | https://platform.claude.com/docs/en/build-with-claude/skills-guide | lien ✅ |
| MCP connector | page | Devs | https://platform.claude.com/docs/en/agents-and-tools/mcp-connector | ✅ `mcp_servers` + `mcp_toolset`, Streamable HTTP/SSE, header `mcp-client-2025-11-20` |
| MCP tunnels | page | Devs | https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview | lien ✅ |
| Client SDKs overview | page | Devs | https://platform.claude.com/docs/en/cli-sdks-libraries/overview | ✅ Python 2.3.0, TS 1.3.0, C# 13.3.0, Go 2.4.0, Java 3.3.0, PHP 1.3.0, Ruby 2.3.0, CLI `ant` 2.4.0 |
| SDK middleware | page | Devs | https://platform.claude.com/docs/en/cli-sdks-libraries/middleware | lien ✅ |
| OpenAI SDK compatibility | page | Devs | https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk | lien ✅ |
| Rate limits | page | Devs | https://platform.claude.com/docs/en/api/rate-limits | ✅ paliers Evaluation / Start (500 $) / Build (1 000 $) / Scale (200 000 $) / Custom ; token bucket ; headers `anthropic-ratelimit-*` |
| Service tiers (Priority Tier) | page | Devs | https://platform.claude.com/docs/en/api/service-tiers | lien ✅ |
| Pricing | page | Tous | https://platform.claude.com/docs/en/about-claude/pricing | ✅ (tableau en 3.2) |
| Choosing a model / Optimizing cost / Migration guide | pages | Devs | https://platform.claude.com/docs/en/about-claude/models/choosing-a-model · …/optimizing-for-cost-and-intelligence · …/migration-guide | liens ✅ |
| Model IDs & versions / Deprecations | pages | Devs | https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions · https://platform.claude.com/docs/en/about-claude/model-deprecations | liens ✅ |
| Test & evaluate : Define success / build evals | page | Devs | https://platform.claude.com/docs/en/test-and-evaluate/develop-tests | ✅ critères SMART, exact match, cosine (SBERT), ROUGE-L, LLM-as-judge (Likert, binaire, ordinal) |
| Strengthen guardrails (hallucinations, consistency, jailbreaks, prompt leak) + Reduce latency | pages | Devs | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency (lien ✅) ; …/reduce-hallucinations, …/mitigate-jailbreaks, …/reduce-prompt-leak, https://platform.claude.com/docs/en/test-and-evaluate/reduce-latency | ⚠️ chemins déduits de la navigation, non ouverts individuellement |
| Evaluation tool (Console) | page | Devs | https://platform.claude.com/docs/en/test-and-evaluate/eval-tool | ❌ non ouvrable depuis cette session (page probablement renommée/fusionnée ; la page develop-tests pointe vers un « Evals recipe » du cookbook) |
| Admin API / Workspaces / Usage & Cost Analytics API / Compliance API / Data residency / OpenTelemetry | pages | Admins | https://platform.claude.com/docs/en/manage-claude/admin-api · …/workspaces · …/usage-cost-analytics-api · …/compliance-api · …/data-residency · …/opentelemetry · …/authentication · …/api-and-data-retention | liens ✅ |
| Release notes (What's new) | page | Tous | https://platform.claude.com/docs/en/release-notes/overview | ✅ (25 entrées d'oct. 2026 lues) |
| Claude sur Amazon Bedrock / Google Cloud / Microsoft Foundry / Claude Platform on AWS | pages | Devs | https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock · https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/overview · https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry · https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws | liens ✅ |
| Usage Policy (AUP) | juridique | Tous | https://www.anthropic.com/legal/aup | ⚠️ cité par academy.claude.com/help/mcp ; non ouvrable depuis cette session |
| Commercial Terms | juridique | Tous | https://www.anthropic.com/legal/commercial-terms | ⚠️ cité par la doc Agent SDK |
| Support / Statut / Discord | — | Tous | https://support.claude.com/ · https://status.claude.com/ · https://www.anthropic.com/discord | liens ✅ |

### 3.2 Modèles actuels et tarifs (page Pricing ✅ + pages modèles ✅)

| Modèle | ID API | Sortie | Contexte / sortie max | Input / Output ($/MTok) | Cache write 5 min / 1 h | Cache read | Batch (in/out) | Effort par défaut | Cutoff | Page |
|---|---|---|---|---|---|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1er sept. 2026 | 1M / 128K | 10 / 50 | 12,50 / 20 | 0,25 | 5 / 25 | `high` (thinking toujours actif) | juin 2026 | https://platform.claude.com/docs/en/models/fable-5-1/overview ✅ |
| Claude Mythos 5.1 | — (accès vérifié) | 1er sept. 2026 | 1M / 128K | 10 / 50 | 12,50 / 20 | 0,25 | 5 / 25 | — | — | https://platform.claude.com/docs/en/models/mythos-5-1/overview (lien ✅) |
| Claude Opus 5.5 | `claude-opus-5-5` | 22 sept. 2026 | 1M / 128K | 4 / 20 | 5 / 8 | 0,20 | 2 / 10 | `medium` (thinking toujours actif) | juin 2026 | https://platform.claude.com/docs/en/models/opus-5-5/overview ✅ |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 28 sept. 2026 | 1M / 128K | 2 / 10 | 2,50 / 4 | 0,10 | 1 / 5 | `high` | juin 2026 | https://platform.claude.com/docs/en/models/sonnet-5-5/overview ✅ |
| Claude Haiku 5.5 (≤ 100k tokens) | `claude-haiku-5-5` | 7 oct. 2026 | 1M / 128K | 0,10 / 0,50 | 0,125 / 0,20 | 0,01 | 0,05 / 0,25 | `medium` | juin 2026 | https://platform.claude.com/docs/en/models/haiku-5-5/overview ✅ |
| Claude Haiku 5.5 (> 100k tokens) | idem | idem | idem | 0,50 / 2,50 | 0,625 / 1 | 0,05 | 0,25 / 1,25 | | | |

Modèles legacy encore facturés (Pricing ✅) : Fable 5 / Mythos 5 (10/50), Opus 5, 4.8, 4.7, 4.6, 4.5 (5/25), Sonnet 5 (2/10 ; sorti 30 juin 2026 ✅ https://platform.claude.com/docs/en/models/sonnet-5/), Sonnet 4.6 / 4.5 (3/15 ; **Sonnet 4.5 retiré de l'API le 30 nov. 2026**), Haiku 4.5 (1/5), Opus 4.1/4 (15/75), Sonnet 4 (3/15), Haiku 3.5 (0,80/4).

Autres tarifs ✅ : Fast mode Opus 5.5 = 8/40 ; residency US `inference_geo: "us"` = ×1,1 ; web search 10 $/1 000 recherches ; web fetch gratuit ; code execution 1 550 h gratuites/mois puis 0,05 $/h ; **Managed Agents : 0,08 $/h de session « running »** + tokens au tarif du modèle.
Points techniques ✅ : nouveau tokenizer depuis Opus 4.7 (1M tokens ≈ 555k mots ; Haiku 5.5 consomme ~30 % de tokens en plus que 4.5) ; sortie 300K via Batch avec header `output-300k-2026-03-24` ; forced tool use → erreur sur les modèles 5.5 ; `temperature` → 400 sur ≥ 4.7.

### 3.3 Section Tool use — 27 sous-pages (✅ liste lue sur l'overview)

Base `https://platform.claude.com/docs/en/agents-and-tools/tool-use/` : `overview`, `how-tool-use-works`, `build-a-tool-using-agent`, `define-tools`, `handle-tool-calls`, `parallel-tool-use`, `tool-runner`, `strict-tool-use`, `memory-tool`, `bash-tool`, `text-editor-tool`, `computer-use-tool`, `browser-use-tool`, `browser-use-sdk`, `server-tools`, `web-search-tool`, `web-fetch-tool`, `code-execution-tool`, `advisor-tool`, `tool-search-tool`, `tool-reference`, `manage-tool-context`, `tool-combinations`, `tool-use-with-prompt-caching`, `programmatic-tool-calling`, `fine-grained-tool-streaming`, `troubleshooting-tool-use`.

### 3.4 Guide de prompt engineering — chaque page (✅ overview lu)

| # | Page | URL |
|---|---|---|
| 1 | Overview (quand faire du prompt engineering, prérequis : critères de succès, tests, premier brouillon) | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview |
| 2 | **Prompting best practices** (référence principale) | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices |
| 3 | Prompting Claude Fable 5.1 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1 |
| 4 | Prompting Claude Fable 5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5 |
| 5 | Prompting Claude Opus 5.5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 |
| 6 | Prompting Claude Opus 5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5 |
| 7 | Prompting Claude Opus 4.8 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8 |
| 8 | Prompting Claude Sonnet 5.5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5 |
| 9 | Prompting Claude Sonnet 5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5 |
| 10 | Prompting Claude Haiku 5.5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-haiku-5-5 |

Plan de la page « Prompting best practices » ✅ (sections H2/H3) — **à reprendre intégralement comme squelette de notre module Prompt engineering** :
- General principles : Be clear and direct · Add context to improve performance · Use examples effectively · Structure prompts with XML tags · Give Claude a role · Long context prompting (multidocument, quote extraction) · Model self-knowledge
- Output and formatting : Communication style and verbosity · Control the format of responses · LaTeX output · Document creation · Migrating away from prefilled responses · Controlling output formatting · Eliminating preambles · Avoiding bad refusals · Continuations · Context hydration and role consistency
- Tool use : Tool usage · Explicit instructions · Optimize parallel tool calling
- Thinking and reasoning : Overthinking and excessive thoroughness · Leverage thinking and interleaved thinking
- Agentic systems : Long-horizon reasoning and state tracking · Balancing autonomy and safety · Research and information gathering · Subagent orchestration · Chain complex prompts · Reduce file creation in agentic coding · Overeagerness · Avoid focusing on passing tests and hardcoding · Minimizing hallucinations in agentic coding
- Capability-specific tips : Improved vision capabilities · Frontend design · Medication dosing
- Migration considerations : Migrating to Claude Sonnet 5.5

Les anciennes pages thématiques (chain of thought, prefill, prompt generator, templates & variables, long context tips…) ont été fusionnées dans cette page unique. L'overview renvoie aussi vers le tutoriel interactif GitHub et sa version Google Sheets.

---

## 4. Managed Agents (nouveauté 2026)

| Ressource | URL | Statut |
|---|---|---|
| Overview | https://platform.claude.com/docs/en/managed-agents/overview (lu en version pt-BR ✅ https://platform.claude.com/docs/pt/managed-agents/overview) | ✅ |
| Quickstart | https://platform.claude.com/docs/en/managed-agents/quickstart | lien ✅ |
| Console agent builder (onboarding) | https://platform.claude.com/docs/en/managed-agents/onboarding | lien ✅ |
| Agent setup / Tools / Permission policies / Environments / Sessions / Events & streaming / Budgets / Memory / Outcomes / Multiagent orchestration / Workflow runs / Session threads / Scheduled deployments / Self-hosted sandboxes / Vaults / Webhooks / GitHub / Dreams / Session observability | https://platform.claude.com/docs/en/managed-agents/agent-setup · …/tools · …/permission-policies · …/environments · …/sessions · …/events-and-streaming · …/budgets · …/memory · …/define-outcomes · …/multiagent-orchestration · …/workflow-runs · …/session-threads · …/scheduled-deployments · …/self-hosted-sandboxes · …/vaults · …/webhooks · …/github · …/dreams · …/session-observability | liens ✅ (features overview) |
| API reference (beta) | https://platform.claude.com/docs/en/api/beta/sessions | lien ✅ |

Concepts ✅ : Agent (modèle + system prompt + outils + MCP + skills, référencé par ID) → Environment (sandbox cloud Anthropic ou self-hosted) → Session → Events (SSE). Outils intégrés : bash, read/write/edit/glob/grep, web search/fetch avec allow/block lists, serveurs MCP. Header beta `managed-agents-2026-04-01`. Non éligible ZDR / HIPAA. Tarif 0,08 $/h de session.

---

## 5. Claude Code (code.claude.com/docs)

| Ressource | URL | Statut | Notes |
|---|---|---|---|
| Overview + installation | https://code.claude.com/docs (= https://code.claude.com/docs/en/overview.md) | ✅ | Install natif : `curl -fsSL https://claude.ai/install.sh \| bash` ; Windows `irm https://claude.ai/install.ps1 \| iex` ; `brew install --cask claude-code` ; `winget install Anthropic.ClaudeCode` ; apt/dnf/apk ; surfaces : Terminal, VS Code, JetBrains, Desktop, Web (claude.ai/code), mobile |
| Index complet (llms.txt) | https://code.claude.com/docs/llms.txt | ✅ | Toutes les pages |
| Quickstart | https://code.claude.com/docs/en/quickstart.md | lien ✅ | |
| Advanced setup | https://code.claude.com/docs/en/setup.md | lien ✅ | |
| Memory (CLAUDE.md, AGENTS.md, auto memory) | https://code.claude.com/docs/en/memory.md | lien ✅ | |
| Hooks reference | https://code.claude.com/docs/en/hooks.md | ✅ | 32 événements : SessionStart, Setup, UserPromptSubmit, UserPromptExpansion, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, PostToolBatch, Notification, MessageDisplay, SubagentStart/Stop, TaskCreated/Completed, Stop, StopFailure, TeammateIdle, InstructionsLoaded, ConfigChange, CwdChanged, DirectoryAdded, FileChanged, WorktreeCreate/Remove, PreCompact/PostCompact, PreModelSwitch/PostModelSwitch, Elicitation/ElicitationResult, SessionEnd |
| Hooks guide | https://code.claude.com/docs/en/hooks-guide.md | lien ✅ | |
| MCP | https://code.claude.com/docs/en/mcp.md · https://code.claude.com/docs/en/mcp-quickstart.md | ✅ | `claude mcp add --transport http\|sse\|stdio` ; scopes local / project (`.mcp.json`) / user ; SSE déprécié |
| Skills | https://code.claude.com/docs/en/skills.md | ✅ | `~/.claude/skills/` ou `.claude/skills/` ; frontmatter `description`, `allowed-tools`, `context: fork`, `disable-model-invocation`, `paths` ; `/nom-du-skill` |
| Subagents | https://code.claude.com/docs/en/sub-agents.md | lien ✅ | |
| Plugins | https://code.claude.com/docs/en/plugins/overview.md | lien ✅ | |
| Settings / settings reference / examples | https://code.claude.com/docs/en/settings.md · …/settings-reference.md · …/settings-example.md | liens ✅ | |
| Permissions / Authentication / Security / Sandboxing | https://code.claude.com/docs/en/permissions.md · …/authentication.md · …/security.md · …/sandboxing.md | liens ✅ | |
| GitHub Actions / GitLab CI / Code Review / Slack / Chrome / Channels | https://code.claude.com/docs/en/github-actions.md · …/gitlab-ci-cd.md · …/code-review.md · …/slack.md · …/chrome.md · …/channels.md | liens ✅ | |
| Headless (`claude -p`) / CLI reference / Commands / Output styles | https://code.claude.com/docs/en/headless.md · …/cli-reference.md · …/commands.md · …/output-styles.md | liens ✅ | |
| Routines (tâches planifiées cloud) / Desktop scheduled tasks / Remote Control / Teleport | https://code.claude.com/docs/en/routines.md · …/desktop-scheduled-tasks.md · …/remote-control.md | liens ✅ | |
| Dynamic workflows / Agent view (background agents) | https://code.claude.com/docs/en/workflows.md · …/agent-view.md | liens ✅ | |
| Costs / Monitoring / Model config / Best practices / Common workflows / Troubleshooting | https://code.claude.com/docs/en/costs.md · …/monitoring-usage.md · …/model-config.md · …/best-practices.md · …/common-workflows.md · …/troubleshooting.md | liens ✅ | |
| Desktop app / Web / Mobile / VS Code / JetBrains | https://code.claude.com/docs/en/desktop-quickstart.md · …/web-quickstart.md · …/mobile.md · …/vs-code.md · …/jetbrains.md | liens ✅ | |

### 5.1 Claude Agent SDK

| Ressource | URL | Statut | Notes |
|---|---|---|---|
| Agent SDK overview | https://code.claude.com/docs/en/agent-sdk/overview (platform.claude.com/docs/en/agent-sdk/overview redirige ici ✅) | ✅ | Python + TypeScript ; mêmes outils/boucle/hooks/sessions/permissions que Claude Code ; **usage régi par les Commercial Terms** (pas de login claude.ai pour des produits tiers) ; branding « Claude Agent » autorisé, « Claude Code » interdit |
| Quickstart / Migration / Agent loop / Configuration / Examples | https://code.claude.com/docs/en/agent-sdk/quickstart.md · …/migration-guide.md · …/agent-loop.md · …/configuration.md · …/examples.md | liens ✅ | |
| Sessions, streaming, structured outputs, custom tools, MCP, tool search, subagents, system prompts, skills, plugins, permissions, hooks, checkpointing, cost tracking, observability, hosting, secure deployment | `https://code.claude.com/docs/en/agent-sdk/` + `sessions`, `session-storage`, `streaming-vs-single-mode`, `user-input`, `streaming-output`, `structured-outputs`, `custom-tools`, `mcp`, `tool-search`, `subagents`, `modifying-system-prompts`, `skills`, `plugins`, `permissions`, `hooks`, `file-checkpointing`, `cost-tracking`, `observability`, `todo-tracking`, `hosting`, `secure-deployment` | liens ✅ (llms.txt) | |
| Références TypeScript / Python | https://code.claude.com/docs/en/agent-sdk/typescript.md · https://code.claude.com/docs/en/agent-sdk/python.md | liens ✅ | |
| Dépôts GitHub | https://github.com/anthropics/claude-agent-sdk-python · https://github.com/anthropics/claude-agent-sdk-typescript · https://github.com/anthropics/claude-agent-sdk-demos | ⚠️ cités par la doc, non ouverts | |

---

## 6. MCP (Model Context Protocol)

| Ressource | URL | Statut | Notes |
|---|---|---|---|
| Site officiel / introduction | https://modelcontextprotocol.io/introduction | ⚠️ cité par la doc Anthropic (mcp-connector), non ouvrable depuis cette session | |
| Spécification stable 2025-11-25 (ex. Authorization) | https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization | ⚠️ cité par la doc Anthropic | |
| Spécification draft + changelog | https://modelcontextprotocol.io/specification/draft · https://modelcontextprotocol.io/specification/draft/changelog | ⚠️ cités par GitHub | |
| Release candidate 2026-07-28-RC | https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28-RC | ✅ | Publiée le 29 mai 2026, non finale |
| Concepts : tools | https://modelcontextprotocol.io/docs/concepts/tools | ⚠️ cité | |
| SDK TypeScript officiel | https://github.com/modelcontextprotocol/typescript-sdk | ⚠️ cité par la doc Anthropic | |
| Blog MCP | https://blog.modelcontextprotocol.io/ | ⚠️ résultat de recherche | |
| MCP côté Anthropic : MCP connector (API), MCP dans Claude Code, MCP dans Agent SDK, MCP tunnels | voir sections 3.1, 5, 5.1 | ✅ | |

Cours MCP d'Anthropic : « Introduction to MCP » (SDK Python, tools/resources/prompts, inspector, client) et « MCP: Advanced Topics » (sampling, notifications, roots, STDIO, StreamableHTTP) — plans en section 9.

---

## 7. Dépôts GitHub, cookbooks, tutoriels

| Ressource | Type | URL | Licence | Statut | Notes |
|---|---|---|---|---|---|
| anthropics/courses | 5 cours notebooks | https://github.com/anthropics/courses | **CC BY-NC 4.0** (Creative Commons Attribution-NonCommercial) ✅ https://github.com/anthropics/courses/blob/master/LICENSE | ✅ | **Archivé le 15 sept. 2026 (lecture seule)**, 22,9k étoiles. Cours : 1) Anthropic API fundamentals, 2) Prompt engineering interactive tutorial, 3) Real world prompting, 4) Prompt evaluations, 5) Tool use. Utilise Claude 3 Haiku. ⇒ **Interdit en usage commercial** : s'en inspirer, ne pas réutiliser. |
| anthropics/prompt-eng-interactive-tutorial | Tutoriel notebooks (Anthropic 1P + Bedrock) | https://github.com/anthropics/prompt-eng-interactive-tutorial | non vérifiée | ⚠️ cité par la doc prompt engineering (« écrit pour Claude 3 ») | 9 chapitres + appendices selon la structure historique (non revérifiée) |
| Cookbook (site) | Recettes | https://platform.claude.com/cookbook | non mentionnée | ✅ | ~110 recettes : Managed Agents (17), Agent SDK (10), Agent patterns, Observability, Tools, Evals, Multimodal, Skills, RAG, Integrations, Thinking… Dépôt source cité : https://github.com/anthropics/claude-cookbooks (⚠️ non ouvert ; l'ancien nom `anthropic-cookbook` a vraisemblablement été renommé) |
| anthropics/anthropic-cookbook | Dépôt | https://github.com/anthropics/anthropic-cookbook | non vérifiée | ⚠️ non ouvert (quota de recherche épuisé) | |
| anthropics/anthropic-quickstarts | Apps starter | https://github.com/anthropics/anthropic-quickstarts | non vérifiée | ⚠️ cité par docs home | |
| anthropics/skills | Skills open source (pptx, xlsx, docx, pdf…) + skill « academy-guide » | https://github.com/anthropics/skills | non vérifiée | ⚠️ cité par la doc Agent Skills ; ~185k étoiles selon skills.sh ✅ https://www.skills.sh/anthropics/skills/academy-guide | |
| anthropics/anthropic-sdk-go / anthropic-cli | SDK & CLI | https://github.com/anthropics/anthropic-sdk-go · https://github.com/anthropics/anthropic-cli | **Apache 2.0** (release notes du 21 oct. 2026 ✅ : « licence passée à Apache 2.0 » pour les SDK v2) | liens ✅ | |
| Claude Code Agent SDK (python / typescript) | SDK | voir 5.1 | Commercial Terms Anthropic | ✅ | |

Recettes du cookbook les plus utiles pour une formation (URLs ✅ lues sur la page) : `patterns-agents-basic-workflows`, `patterns-agents-orchestrator-workers`, `patterns-agents-evaluator-optimizer`, `misc-building-evals`, `misc-generate-test-cases`, `misc-prompt-caching`, `misc-batch-processing`, `misc-using-citations`, `tool-use-extracting-structured-json`, `capabilities-retrieval-augmented-generation-guide`, `capabilities-contextual-embeddings-guide`, `capabilities-classification-guide`, `capabilities-summarization-guide`, `skills-notebooks-01-skills-introduction`, `extended-thinking-extended-thinking`, `claude-agent-sdk-00-the-one-liner-research-agent` … (préfixe `https://platform.claude.com/cookbook/`).

---

## 8. Nouveautés 2026 (chronologie, sources)

| Date | Nouveauté | Source | Statut |
|---|---|---|---|
| 2 mars 2026 | Lancement Anthropic Academy (13 cours, Skilljar, anthropic.com/learn) | https://pasqualepillitteri.it/en/news/12081/claude-academy-live-free-courses-learn-claude | ✅ tiers |
| 12 mars 2026 (tiers) | Première certification technique : Claude Certified Architect – Foundations (early access partenaires) | https://pasqualepillitteri.it/en/news/3297/claude-certified-architect-guide-2026-en | ✅ tiers |
| 26 mars / 7 avril 2026 | Claude Mythos Preview + Project Glasswing (cyber) | https://en.wikipedia.org/wiki/Claude_Mythos ✅ ; https://www.anthropic.com/glasswing ⚠️ | |
| avril 2026 | Managed Agents (beta header `managed-agents-2026-04-01`) | https://platform.claude.com/docs/en/managed-agents/overview | ✅ |
| 28 mai 2026 | Claude Opus 4.8 | https://www.anthropic.com/news/claude-opus-4-8 ⚠️ (cité par Wikipédia) | |
| 9 juin 2026 | Claude Fable 5 (public) + Mythos 5 (Glasswing) ; restrictions US 12–30 juin ; Fable 5 dans les abonnements supérieurs dès le 20 juillet | https://www.anthropic.com/news/claude-fable-5-mythos-5 ⚠️ ; Wikipédia ✅ | |
| 30 juin 2026 | Claude Sonnet 5 | https://platform.claude.com/docs/en/models/sonnet-5/ | ✅ |
| 8–24 juillet 2026 | Extension du programme de certification : 4 examens disponibles (Pearson VUE, Credly) | https://claudelog.com/faqs/what-are-claude-certifications/ | ✅ tiers |
| 20 août 2026 | Lancement de **Claude Academy** (academy.claude.com), 22 cours au lancement, 27 au 1er nov. | https://academy.claude.com/courses ; https://vanja.io/claude-academy/ ✅ | ✅ |
| 1er sept. 2026 | **Claude Fable 5.1** + **Claude Mythos 5.1** | https://platform.claude.com/docs/en/models/fable-5-1/overview ✅ ; annonce https://www.anthropic.com/claude-fable-and-mythos-5-1 ⚠️ ; system card https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card ⚠️ | |
| 15 sept. 2026 | Archivage de github.com/anthropics/courses | https://github.com/anthropics/courses | ✅ |
| 22 sept. 2026 | **Claude Opus 5.5** (4 $/20 $, −40 % vs Opus 5 selon cours partenaires) | https://platform.claude.com/docs/en/models/opus-5-5/overview | ✅ |
| 28 sept. 2026 | **Claude Sonnet 5.5** | https://platform.claude.com/docs/en/models/sonnet-5-5/overview | ✅ |
| 6 oct. 2026 | Mythos 5.1 ouvert aux organisations du Cyber Verification Program | https://www.anthropic.com/news/cyber-verification-program ⚠️ ; https://support.claude.com/en/articles/14604842 ⚠️ | |
| 7 oct. 2026 | **Claude Haiku 5.5** (1M contexte) ; cache read Sonnet 5.5 abaissé à 0,10 $ | https://platform.claude.com/docs/en/release-notes/overview | ✅ |
| 9–14 oct. 2026 | Managed Agents : dynamic workflows (beta), scheduled deployments sur AWS ; export OpenTelemetry (beta) | idem | ✅ |
| 15–20 oct. 2026 | Fast mode Opus 5.5 GA ; user profiles ; organization webhooks (beta) ; inference hooks GA (Enterprise) | idem | ✅ |
| 21 oct. 2026 | **Version d'API `2026-10-21`** ; SDK v2 (Python 2.0.0, TS 1.0.0, Go 2.0.0…) et CLI `ant` 2.0.0 ; **licence SDK → Apache 2.0** | https://platform.claude.com/docs/en/api/migration-2026-10-21 (lien ✅) | ✅ |
| 22 oct. 2026 | Claude Models on Google Cloud (Anthropic managed) | https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed | lien ✅ |
| 23 oct. 2026 | Claude Tag API (beta, Enterprise) — Claude Tag = Claude dans Slack | https://platform.claude.com/docs/en/manage-claude/claude-tag-api | lien ✅ |
| 28–30 oct. 2026 | Requêtes jusqu'à 128 Mo ; Usage & Cost Analytics API (beta) ; Fast mode Opus 4.8 déprécié (fin 30 nov. 2026) | release notes | ✅ |
| 30 nov. 2026 (à venir) | Retrait de Claude Sonnet 4.5 de l'API | cours partenaire « Upgrade a client's build to the Claude 5.5 models » | ✅ |

Produits 2026 à intégrer dans la formation : Claude Cowork (desktop, fichiers/dossiers, Chrome, Microsoft 365), Claude Tag (Slack), Claude Code Desktop / Web / Channels / Routines / Remote Control / Dispatch, Managed Agents (Console agent builder), Agent Skills, Claude Enterprise (admin, groupes, connecteurs, spend caps).

---

## 9. Syllabus détaillé des cours Anthropic (module par module)

> Objectif : garantir que notre formation 150 h couvre 100 % de ces contenus. Les plans ci-dessous ont été lus sur les pages de cours (Claude Academy ✅ et/ou Anthropic Partner Academy ✅ — contenus identiques). Les titres sont conservés en anglais (titres officiels), avec traduction entre parenthèses quand utile.

### 9.1 Claude 101 — 2,5 h, 13 leçons + quiz (public : tout utilisateur pro)
https://academy.claude.com/courses/claude-101 · https://anthropic-partners.skilljar.com/claude-101 ✅
1. Meet Claude · What is Claude? · Your first conversation with Claude · Getting better results
2. How you'll work with Claude on your desktop
3. Organizing your work and knowledge : Introduction to projects · Creating with artifacts · Working with skills
4. Expanding Claude's reach : Connecting your tools · Enterprise search · Research for deep dives
5. Putting it all together : Claude in action — use-cases by role · Other ways to work with Claude
6. Conclusion & certificate · What's next?

### 9.2 Claude Code 101 — 1,5 h, 12 leçons + quiz (devs débutants en agents)
https://academy.claude.com/courses/claude-code-101 ✅ — prérequis : éditeur + terminal, compte Claude Pro/Max/Enterprise ou clé API
1. What is Claude Code? : What is Claude Code? · How Claude Code works
2. Your first prompt : Installing Claude Code · Your first prompt
3. Daily workflows : The explore → plan → code → commit workflow · Context management · Code review
4. Customizing Claude Code : The CLAUDE.md file · Subagents · Skills · MCP · Hooks
5. Course quiz → Completion badge

### 9.3 Claude Code in Action — 1 h, 9 leçons + quiz (devs utilisant déjà Claude Code)
https://academy.claude.com/courses/claude-code-in-action ✅
1. Steer the work : Steering long sessions
2. Configure Claude : A CLAUDE.md that follows · Verification skills · Permission modes · Hooks
3. Automate repeat work : Routines and headless · GitHub Actions and Code Review
4. Verify and share : Trust it — verifying unsupervised runs · Plugins
5. Course quiz

### 9.4 Introduction to Claude Cowork — 2,5 h, 14 leçons + quiz
https://academy.claude.com/courses/introduction-to-claude-cowork · https://anthropic-partners.skilljar.com/introduction-to-claude-cowork ✅
1. Meet Claude Cowork : What is Claude Cowork · Setting up Claude Cowork · What Claude Cowork can do for you
2. Hand Claude Cowork your first task
3. Make Claude Cowork yours : Get better results faster · Standing context — Global instructions and projects · Skills — teach Claude Cowork your way · Plugins — encode your team's expertise
4. Use Claude wherever you work : Claude in Chrome · Claude for Microsoft 365
5. Sharing and safety : Best practices for working safely · Validating skills for plugins · Share what you build with your team
6. Wrap up and next steps · Quiz

### 9.5 Introduction to Claude Tag — 2,5 h, 11 leçons + quiz (équipes Slack)
https://academy.claude.com/courses/introduction-to-claude-tag ✅
1. Getting started (5) : tester Claude en le mentionnant · Claude en DM · Claude en canal public · Claude en canal privé · choisir le bon lieu
2. Customizing (3) : mémoire et instructions · réponses sans mention · routines planifiées
3. Getting a task right (1) : rédiger une demande exploitable
4. Expanding Claude's responsibility (2) : travaux plus larges/continus · revue des habitudes d'équipe

### 9.6 Claude Platform 101 — 1,5 h, 13 leçons + quiz (devs, SDK TypeScript)
https://academy.claude.com/courses/claude-platform-101 · https://anthropic-partners.skilljar.com/path/claude-architect/claude-platform-101 ✅ — prérequis : un langage + CLI, Node/npm, compte Console + clé API
1. What is the Claude Platform? : What is the Claude Platform? · Your first API call · Choosing the right model (Opus, Sonnet, Haiku)
2. Giving your agent capabilities : The agent loop explained · What is tool use? · What is thinking?
3. Extending your agent : Built-in tools · Skills · MCP · Context management
4. Managed Agents : What are managed agents? · Building your first managed agent
5. Building with Claude Code
6. Quiz

### 9.7 Building with the Claude API — 9 h, 67 leçons + 8 quiz (devs Python) — **cours pivot**
https://academy.claude.com/courses/building-with-the-claude-api · https://anthropic-partners.skilljar.com/claude-with-the-anthropic-api · miroir Coursera ✅
1. Introduction · Anthropic & Claude models overview
2. Accessing Claude with the API (9) : API access & key · Making a request · Multi-turn conversations (+ exercice chat) · System prompts (+ exercice) · Temperature · Streaming responses · Structured data (+ exercice) · Quiz
3. Prompt evaluation (6) : Intro · A typical eval workflow · Generating test datasets · Running the eval · Model-based grading · Code-based grading · Exercice · Quiz
4. Prompt engineering techniques (6) : Being clear and direct · Being specific · Structure with XML tags · Providing examples · Exercice · Quiz
5. Tool use (13) : Intro · Project overview · Tool functions · Tool schemas · Handling message blocks · Sending tool results · Multi-turn with tools · Implementing multiple tools · Using multiple tools · Batch tool · Tools for structured data · Fine-grained tool calling · Text editor tool · Web search tool · Quiz
6. RAG & agentic search (7) : Intro to RAG · Text chunking strategies · Text embeddings · Full RAG flow · Implementing RAG · BM25 lexical search · Multi-index RAG pipeline · Reranking · Contextual retrieval
7. Claude features : Extended thinking · Image support · PDF support · Citations · Prompt caching (règles + pratique) · Code execution & Files API · Quiz
8. Model Context Protocol (11) : Intro · MCP clients · Project setup · Defining tools · Server inspector · Implementing a client · Defining resources · Accessing resources · Defining prompts · Prompts in the client · MCP review · Quiz
9. Anthropic applications — Claude Code & Computer use (4) : Intro · Setup · Claude Code in action · MCP server enhancements · Parallelizing Claude Code · Automated debugging · Computer Use (fonctionnement)
10. Agents & workflows (8) : AI workflows · Parallelization · Chaining · Routing · Agents and tools · Environment inspection · Workflows vs agents · Quiz
11. Final assessment · Conclusion

### 9.8 Claude with Amazon Bedrock — 8 h, 65 leçons + 8 quiz
https://academy.claude.com/courses/claude-with-amazon-bedrock ✅ — modules : Intro (1) · Working with the API (9) · Prompt engineering (6) · Tool use (13) · RAG (10) · MCP (12) · Agents (7). (Claude on Google Cloud : même structure, 66 leçons, 9 quiz.)

### 9.9 Introduction to Model Context Protocol — 1 h, 10 leçons + évaluation (devs Python)
https://academy.claude.com/courses/introduction-to-model-context-protocol · https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol ✅ — prérequis : Python, JSON, HTTP
1. Introduction : Welcome
2. Introducing MCP : MCP clients
3. Hands-on with MCP servers : Project setup · Defining tools with MCP · The server inspector
4. Connecting with MCP clients : Implementing a client · Defining resources · Accessing resources · Defining prompts · Prompts in the client
5. Assessment and wrap up : Final assessment · MCP review

### 9.10 Model Context Protocol: Advanced Topics — 1,5 h, 11 leçons + évaluation (devs avancés)
https://academy.claude.com/courses/model-context-protocol-advanced-topics · https://anthropic-partners.skilljar.com/model-context-protocol-advanced-topics ✅ — prérequis : Python async, JSON/HTTP, SSE
1. Introduction
2. Core MCP features : Sampling (+ walkthrough) · Log and progress notifications (+ walkthrough) · Roots (+ walkthrough)
3. Transports and communication : JSON message types · The STDIO transport · The StreamableHTTP transport · StreamableHTTP in depth · State and the StreamableHTTP transport
4. Assessment and next steps

### 9.11 Introduction to agent skills — 1 h, 6 leçons
https://academy.claude.com/courses/introduction-to-agent-skills ✅
1. What are skills? · 2. Creating your first skill · 3. Configuration and multi-file skills · 4. Skills vs other Claude Code features · 5. Sharing skills · 6. Troubleshooting skills

### 9.12 Introduction to subagents — 45 min, 4 leçons
https://academy.claude.com/courses/introduction-to-subagents ✅
1. What are subagents? (fenêtre de contexte séparée) · 2. Creating a subagent (`/agents`) · 3. Designing effective subagents (formats de sortie structurés, signalement des blocages, restriction d'outils) · 4. Using subagents effectively (cas d'usage, anti-patterns)

### 9.13 The AI-native SDLC playbook — 1 h, 14 leçons (responsables ingénierie / plateforme / sécurité)
https://academy.claude.com/courses/ai-native-sdlc-playbook ✅ — prérequis : Claude Code au quotidien, dépôt Git + CI modifiable
Introduction · Plan : Capture the idea in an intent.md · Design : Requirements and design · Build : Plan mode as default starting point · The CLAUDE.md file · Skills as institutional knowledge · Parallel sessions and subagents · Test : Give Claude a feedback loop · Continuous evals in CI · Deploy : AI in the PR review loop · Hooks as approval gates · CI/CD integration and deployment · Maintain : Close the loop on metrics · Conclusion & resources

### 9.14 Deploying Claude Enterprise with confidence — 2,5 h, 14 leçons + quiz (admins)
https://academy.claude.com/courses/deploying-claude-enterprise-with-confidence ✅
Introduction : Five decisions and the frame · Owners and intake · Prerequisites — Structure & Identity : One organization or many · Your groups — Access : Surfaces each group gets · Connectors — Governance : Governing customizations — Spend : Spend caps · Managing spend — Visibility : What you can measure · Adoption signals — Your rollout : How the decisions connect · When a new product arrives — Quiz

### 9.15 AI Fluency: Framework & Foundations — 4 h, 14 leçons + évaluation (tout public ; co-créé avec les Prs Joseph Feller et Rick Dakan)
https://academy.claude.com/courses/ai-fluency-framework-foundations · https://anthropic-partners.skilljar.com/ai-fluency-framework-foundations ✅
1. Introduction to AI Fluency : The AI Fluency Framework · Why do we need AI Fluency? · The 4D Framework
2. Deep Dive 1 — What is Generative AI? : Generative AI fundamentals · Capabilities & limitations
3. Delegation : A closer look at Delegation · Project planning and Delegation
4. Description : A closer look at Description
5. Deep Dive 2 — Effective prompting techniques
6. Discernment : A closer look at Discernment · The Description-Discernment loop
7. Diligence : A closer look at Diligence
8. Conclusion & certificate · Additional activities

### 9.16 AI capabilities and limitations — 3,5 h, 13 leçons + quiz (tout public)
https://academy.claude.com/courses/ai-capabilities-and-limitations ✅
1. Getting started : Intro · What we mean by AI · How AI gets its character
2. Next Token Prediction (+ Try it out)
3. Knowledge (+ Try it out)
4. Working Memory (+ Try it out)
5. Steerability (+ Try it out)
6. Putting it all together : When properties collide · Next steps · Quiz

### 9.17 Building effective human-agent teams (beta) — 45 min, 5 leçons + quiz (managers)
https://academy.claude.com/courses/building-effective-human-agent-teams ✅
1. The shift to multiplayer : Why multiplayer AI matters
2. What makes an agent a teammate : How a multiplayer agent differs from traditional AI tools · What a strong human-agent team looks like
3. Preparing your organization : Organizational checklist · Concrete ways to get started
Principes : rôles clairs, objectif directeur écrit, déploiement progressif, accès approprié à l'information.

### 9.18 Working with Claude Fable 5.1 (Partner Academy)
https://anthropic-partners.skilljar.com/working-with-claude-fable-51 ✅ — prérequis : clé API (Fable 5.1, Opus 5, Sonnet 5, Haiku 4.5), Python 3
1. Meet the model : Meet Claude Fable 5.1 · Where it fits — which model for which job
2. Put it to work : Moving a build to Fable 5.1 (+ exercice migrer un appel) · The cross-model check (+ exercice sur deux charges)
3. Take it to clients : What it opens up · Make it yours
4. Final assessment

### 9.19 Upgrade a client's build to the Claude 5.5 models (Partner Academy)
https://anthropic-partners.skilljar.com/bring-the-claude-55-models-to-your-clients ✅ — cas fil rouge « Tallyweir » (Haiku 4.5 → classification, Sonnet 4.5 → questions courantes, Opus 5 → dossiers difficiles)
1. Pick a Claude 5.5 model and effort for each step · Find every program that calls a retiring model
2. Fix the request settings that return errors · Replies that change without an error
3. Build an eval from the client's questions · Set the bar a new setup has to clear · Tune effort before you change models · Switch production in stages · Quiz

### 9.20 Cours de préparation Developer – Foundations (Partner Academy, ≈ 13 h) — objectifs d'apprentissage lus ✅
- **Production-Grade Prompting, Agents & Tool Use (209 min)** : prompts de production (system prompts, XML, few-shot, contraintes de sortie) · extended thinking et budget · schémas d'outils et boucle tool use · streaming et reprise · gestion du contexte (compaction, effacement, handoffs entre sous-agents) · agents avec points de contrôle humains (HITL) · mémoire d'agent entre sessions · images/PDF, Files API, Batches API.
- **Claude Code, MCP & Integration (142 min)** : boucle explorer/planifier/coder · modes de permission selon le risque · revue du code généré · CLAUDE.md, règles, hooks, subagents · Skills, commandes, plugins (un Skill portable Claude Code / Messages API / Agent SDK) · serveurs MCP (tools, resources, prompts, transport, scope de config) · intégration sécurisée aux SI d'entreprise, authentification pour client réglementé, projet de modernisation de code.
- **Production Engineering, Evals & Security (211 min)** : évals, tracing, gestion des pannes, coûts, sécurité — « prouver qu'un agent tient sous trafic réel ».
- **MSO Foundations (57 min)**, **Accelerators & IP Contribution (155 min)** : spécifiques partenaires.

### 9.21 Cours Architect – Professional (Partner Academy) — objectifs lus ✅
- **Claude Platform & Solution Design (238 min)** : découper une demande (Claude / systèmes existants / humains) · appel augmenté vs workflow vs agent · architectures de référence, retrieval vs live-state · décisions modèle / contexte / stratégie de contexte étayées par des évals · points d'entrée (Claude.ai, API, SDK, Claude Code, MCP) · contraintes de gouvernance et réglementaires.
- Enterprise Integration & Production (158 min) · Stakeholder Engagement, Lifecycle & GTM (178 min) · Team Enablement & Operational Productivity (45 min) · Responsible AI, Safety & Risk for Architects (114 min).

### 9.22 GitHub anthropics/courses (archivé, CC BY-NC 4.0) — structure
1. Anthropic API fundamentals (clé API, paramètres, prompts multimodaux, streaming)
2. Prompt engineering interactive tutorial (9 chapitres : bases → rôles → séparation données/instructions → format de sortie & prefill → chain of thought → exemples → hallucinations → prompts complexes ; appendices : chaînage, tool use, recherche/retrieval — structure historique non revérifiée ⚠️)
3. Real world prompting (branche `vertex` pour Google)
4. Prompt evaluations
5. Tool use

---

## 10. Matrice de couverture recommandée pour notre formation 150 h

| Référentiel Anthropic | Modules Academy / Partner correspondants | Pages docs de référence | Poids suggéré dans nos 150 h |
|---|---|---|---|
| Fondamentaux IA & usage (AI Fluency 4D, capacités/limites, Claude 101, Cowork, Tag) | 9.1, 9.4, 9.5, 9.15, 9.16, 9.17 | system prompts, usage policy | 20 h |
| API Claude & SDK (Messages, streaming, system prompts, structured outputs, vision/PDF, caching, batch, files, thinking/effort, citations) | 9.6, 9.7 (modules 2, 7) | section 3.1 | 25 h |
| Prompt engineering & évaluation | 9.7 (modules 3–4), parcours Associate (Prompting, Evaluating) | 3.4, develop-tests, cookbook evals | 20 h |
| Tool use, agents, workflows, Agent SDK, Managed Agents | 9.7 (modules 5, 10), 9.6, 9.20 | 3.3, 4, 5.1, cookbook patterns | 30 h |
| MCP (serveurs, clients, transports, connector, tunnels) | 9.9, 9.10 | 6, mcp-connector, code.claude.com/mcp | 15 h |
| Claude Code (install, CLAUDE.md, hooks, skills, subagents, plugins, headless, CI, routines) + SDLC | 9.2, 9.3, 9.11, 9.12, 9.13 | 5 | 20 h |
| RAG, retrieval, search | 9.7 (module 6) | cookbook RAG | 8 h |
| Gouvernance, sécurité, coûts, déploiement entreprise, cloud (Bedrock/Vertex/Foundry) | 9.14, 9.8, 9.21, parcours Associate (Governance, Troubleshooting) | rate limits, pricing, admin API, data residency | 12 h |

---

## 11. Limites de cette recherche (à traiter en passe 2)

- Non ouverts (hors liste d'accès ou quota de recherche atteint) : les 4 **guides d'examen PDF officiels** (pondérations officielles à confirmer, chiffres tiers utilisés en 2.3) ; `modelcontextprotocol.io` ; `anthropic.com/legal/aup` ; `anthropic.com/claude-fable-and-mythos-5-1` ; `pearsonvue.com/us/en/anthropic.html` ; dépôts GitHub `anthropic-cookbook` / `claude-cookbooks`, `prompt-eng-interactive-tutorial`, `skills`, `anthropic-quickstarts` (licences non vérifiées) ; page `test-and-evaluate/eval-tool` (probablement supprimée/renommée).
- Les durées des 9 cours « AI Fluency, for your world » ne sont pas affichées sur le catalogue (valeurs tierces : 1,5 h à 5 h).
- Le quota de WebSearch de la session a été atteint en fin de recherche ; une seconde passe pourra compléter les points ci-dessus.

Nombre d'URLs ouvertes et lues (✅) dans ce document : > 90 ; URLs citées par des pages officielles mais non ouvertes (⚠️) : ~25.
