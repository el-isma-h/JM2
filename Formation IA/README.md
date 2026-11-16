# Formation IA — Next Formation (NF-IA-150)

**La formation IA la plus complète du catalogue Next Formation : 4 niveaux, 150 heures, 30 modules, 150 leçons (≈ 656 000 mots après l'enrichissement pédagogique v1.1), 300 questions de quiz de module, 4 examens de certification (banques de 80 questions, 40 tirées par tentative), plus de 1 000 liens de documentation officielle.** **Nouveau : spécialisation N5 « Data engineering & Big Data pour l'IA » (30 h, 7 modules, 34 leçons, 7 quiz, 1 examen de certification), hors parcours certifiant de 150 h.**

Projet autonome (dossier séparé) destiné à être importé dans la plateforme Next Formation (module e-learning, catalogue, certifications). Rien ici ne modifie le code de Next Formation.

## Chiffres clés

| | |
|---|---|
| Durée totale | 150 h à distance (FOAD) pour le parcours certifiant N1-N4 · + 30 h de spécialisation N5 optionnelle (180 h au catalogue) |
| Niveaux | N1 Fondamentaux (25 h) · N2 Praticien (35 h) · N3 Développeur (45 h) · N4 Expert (45 h) |
| Spécialisation | N5 Data engineering & Big Data pour l'IA (30 h, accessible après N3) : 7 modules (M31-M37) · 34 leçons (L151-L184) · 7 quiz · 1 examen de 40 questions / 60 min · 5 ateliers évalués · 1 projet final « pipeline de données de bout en bout pour un RAG d'entreprise » avec soutenance ; environnement de TP 100 % gratuit et local (Docker Compose) — voir `niveaux/N5-data-engineering/niveau.md` |
| Modules / leçons | 30 modules · 150 leçons · exercices pratiques à chaque leçon (+ N5 : 7 modules · 34 leçons) |
| Évaluation | 30 quiz de 10 questions · 4 examens de 40 questions tirées dans des banques de 80 (320 questions, majoritairement des mises en situation, tirage équilibré par compétence) · 12 projets pratiques · seuil 70 % (+ N5 : 7 quiz · 1 examen de 40 questions tirées dans une banque de 80 · 5 ateliers · 1 projet final) |
| Certificats | 1 certificat Next Formation par niveau (4 blocs de compétences, référentiel au format France Compétences, trame de dossier RS pour l'éligibilité CPF) · + 1 certificat N5 « Data engineer IA » (bloc de compétences 5, C5.1-C5.6 ; dépôt RS recommandé après N1-N3) |
| Alignement | Référentiels Anthropic Academy, n8n Level 1-2, OpenAI Academy, Microsoft AI-900, AWS AI Practitioner, Google AI Essentials ; cours MIT 6.S191 / 6.390, Stanford CS229 / CS224N / CS324 / CS336, École 42, Karpathy, Hugging Face · N5 : Google Professional Data Engineer, AWS DEA-C01, Microsoft DP-700, Databricks DE Associate, SnowPro Core, dbt Analytics Engineering, Confluent CCDAK ; DataTalksClub Zoomcamp, Stanford CS246 / MMDS, CMU 15-445, Berkeley CS186, MIT 6.5830 |
| Sources | Documentations officielles Anthropic, OpenAI, xAI (Grok), Perplexity, Mistral, Google, Hugging Face, n8n ; liens vérifiés dans `ressources/bibliotheque-liens.md` · N5 : recherche dédiée `_recherche/06-data-engineering-big-data.md` (DuckDB, dbt, Spark, Kafka, Airflow, Delta Lake, Iceberg, Databricks, Google Cloud, AWS, Microsoft Fabric…) |
| Langue | Français (version anglaise prévue ultérieurement) |
| Version | 1.1 — 5 novembre 2026 (1.0.0 du 1er novembre 2026 enrichie : voir « Nouveautés v1.1 ») |

## Nouveautés v1.1 (5 novembre 2026)

Rien n'a été retiré ; tout ce qui suit s'ajoute à la v1.0.

- **Vulgarisation dans les 184 leçons** : encadrés 🧭 « En clair » / « Pas à pas pour débutant » / « Pré-requis express », 💡 « Autrement dit », 🔢 « Exemple à la main », 🧠 « L'intuition d'abord », 🔍 « Ce que fait ce code », 🛠️ « Si ça ne marche pas », ✅ « Si vous ne retenez que 3 choses » (formats dans `FORMAT.md`).
- **Ludique** : 525 quiz éclair intégrés aux leçons et 339 missions documentation (« allez chercher la réponse dans la doc officielle », avec indice et XP).
- **37 fiches mémo** (une par module, `niveaux/…/fiche.md`) et **5 examens blancs** alignés sur des certifications tierces publiques (`examens-blancs/`), sans aucune équivalence revendiquée.
- **Lexique de 683 termes** (`glossaire/`), relié aux leçons et vérifié par `glossaire/verifier_glossaire.py`.
- **Faits mis à jour** d'après une nouvelle recherche documentaire (`_recherche/07`) : API Claude (version 2026-10-21, `temperature`), MCP stable, Perplexity, xAI, OpenAI (fin du fine-tuning), AI Act omnibus (règlement (UE) 2026/1744), CNIL.
- **Espace e-learning** dans `app/` (Next.js, Postgres, Docker + Caddy) : voir `app/README.md`.

## Comment c'est organisé

Voir `FORMAT.md` pour l'arborescence et les formats. En résumé :

- `programme/programme.json` est la **source de vérité** ; `programme/programme.md` est la fiche programme lisible (générée).
- `niveaux/Nx-…/Mxx-…/` contient les leçons (`Lxxx-….md`), le `module.json` et le `quiz.json` du module.
- `examens/` contient les 5 banques d'examen (N1 à N4 et la spécialisation N5), de 80 questions chacune.
- `referentiel/` contient le référentiel de compétences, le référentiel d'évaluation, la correspondance avec les certifications tierces et la trame du dossier France Compétences (RS / CPF).
- `ressources/` contient la bibliothèque de liens officielle.
- `export/` contient les fichiers générés prêts pour l'import dans Next Formation.

## Scripts

```bash
node scripts/scaffold.mjs          # crée l'arborescence et les module.json manquants
node scripts/validate.mjs          # contrôle structure, en-têtes, quiz, durées (ajouter --links pour tester les URLs)
node scripts/build.mjs             # génère programme.md + export/*.json + export/formation-ia-complete.md
```

Aucune dépendance : Node 20+ suffit.

## Import dans Next Formation (à faire plus tard, hors de ce dossier)

`export/elearning-modules.json` contient un tableau d'objets au format exact de `elearning_modules` (`kind: "contenu"` → `{ format: "markdown", body }`, `kind: "quiz"` → `{ questions: [{ q, options, answer }], passScore }`), avec en plus `explanation`, `type`, `lessonId` et `source` par question (ignorés par le lecteur actuel, exploitables pour la correction commentée). `export/programme-catalogue.json` fournit la fiche programme et les 30 modules pour le catalogue (`programs`, `program_versions`, `modules`).

## Certifications tierces

Les certificats Next Formation **ne sont pas** des équivalences des certifications tierces. La formation couvre l'intégralité de leurs référentiels publics et incite chaque apprenant à passer, en complément, les certifications officielles correspondantes (Anthropic, n8n, Microsoft, AWS, Google…). Le détail est dans `referentiel/correspondance-certifications.md`.

## Relectures et points à vérifier avant publication

Deux relectures indépendantes ont été menées (`_relecture-N1-N3.md`, `_relecture-N4.md`) : 28 corrections appliquées (calculs, code, contradictions, faits) et une vingtaine de doutes non tranchés, listés dans ces fichiers. Les dossiers `_recherche/` signalent par ⚠️ les sources qui n'ont pas pu être ouvertes (décrets CPF 2026, règlement omnibus AI Act, guides d'examen Anthropic…). Dans les leçons, les points non confirmés sont marqués « à vérifier ».

## Licence et sources

Toutes les leçons sont des rédactions originales. Les cours universitaires et ressources tierces sont **cités** (titre, institution, URL, licence) et jamais reproduits. Les documentations officielles sont liées, pas copiées.

## Guides

- `guides/guide-apprenant.md` : fonctionnement de la formation, plannings types (4 semaines, 12 semaines, 6 mois), méthode, évaluation et certificat, assistance, accessibilité, FAQ et charte d'usage de l'IA.
- `guides/guide-formateur.md` : rôle du formateur-référent FOAD, classes virtuelles, suivi dans l'espace admin, correction, corrigés et pièges par projet, jury, fraude, mise à jour annuelle.
- `guides/conformite-qualiopi.md` : indicateurs Qualiopi (décret 2026-728) → preuves fournies par la formation → reste à faire par l'organisme.

## Labs pratiques

Le dossier `labs/` contient huit kits pratiques, un par leçon projet (L038, L048, L058, L077, L083, L094, L100, L105), utilisables sans clé API grâce à un mode simulé.
Chaque kit fournit un README guidé, des données d'exemple, un starter et sa solution (ou des workflows n8n importables) et des tests automatisés quand le sujet s'y prête.
L'audit de sécurité ne fait pas l'objet d'un lab : il se pratique avec l'atelier de la leçon L110. Index complet : [`labs/README.md`](labs/README.md).

## Parcours métiers

Le dossier `parcours-metiers/` propose dix parcours (dirigeant de PME, RH, marketing & communication, commercial, comptable & finance, juriste, assistant·e de direction, formateur·rice, développeur·se, data analyst / data engineer) qui relisent la formation par métier.
Chacun indique ce que l'IA change pour le métier, les leçons prioritaires et facultatives avec leur durée, 10 cas d'usage reliés aux leçons, 3 projets fil rouge, 5 missions documentation, 5 quiz éclair, les points de vigilance juridiques et les certifications tierces à préparer (jamais présentées comme des équivalences).
Aucune leçon n'est modifiée ; index et méthode de contrôle : [`parcours-metiers/README.md`](parcours-metiers/README.md).
