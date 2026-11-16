# Lab L048 — RAG sans code : n8n, Dify, NotebookLM

| | |
|---|---|
| Leçon liée | [L048 — Construire un RAG sans code : n8n, Dify, Flowise, NotebookLM](../../niveaux/N2-praticien/M11-rag-et-bases-de-connaissances/L048-construire-un-rag-sans-code-n8n-dify-flowise-notebooklm.md) (module M11, niveau 2) |
| Compétences | C2.2 |
| Durée | 1 h 30 pour deux tutoriels sur trois et la grille ; 2 h pour les trois |
| Prérequis | Docker (n8n, Dify, Ollama) et/ou un compte Google (NotebookLM) ; 8 Go de RAM conseillés pour Ollama ; aucune clé API |

## Objectif

Monter, dans au moins **deux outils**, l'assistant documentaire de **Menuiserie Lacombe** (artisan fictif de 12 salariés à Angoulême) : un apprenti ou la commerciale demande « quelle vis pour du béton cellulaire ? » ou « quel délai de rétractation pour un particulier ? » et obtient une réponse **sourcée**, ou un refus clair si les documents ne répondent pas. Puis comparer les outils sur les **mêmes 10 questions**, avec la même grille.

## Contenu

```
lab-rag-sans-code/
├── documents/                 9 documents internes fictifs (Markdown, en-tête titre / catégorie / date)
│   ├── cgv-2026.md                        CGV : devis, acompte, rétractation, délais, garanties
│   ├── grille-tarifaire-2026.md           prix HT, pose, déplacement, taux de TVA
│   ├── fiche-technique-fixations.md       fiche fournisseur : chevilles et vis selon le support
│   ├── procedure-pose-fenetre-renovation.md, procedure-reception-et-sav.md, livraison-et-stockage.md
│   ├── consignes-securite-atelier.md, securite-travail-en-hauteur.md
│   └── faq-interne.md
├── questions-test.json        10 questions : réponse attendue, éléments obligatoires, source, type (dont 2 hors base)
├── grille-evaluation.md       règles de notation, totaux par outil, critères de réussite
├── grille-resultats.csv       à remplir : une ligne par question et par outil
├── guides/
│   ├── A-n8n.md               ingestion + chat sourcé, Simple Vector Store, Ollama
│   ├── B-dify.md              Knowledge + Chatbot, Ollama comme fournisseur ; variante Flowise
│   └── C-notebooklm.md        carnet, citations, Studio
├── n8n/
│   ├── rag-1-ingestion.json   Read Files → Default Data Loader → splitter 1 000 / 150 → nomic-embed-text → Simple Vector Store
│   └── rag-2-consultation.json Chat Trigger → AI Agent (gemma4:e4b) + outil procedures_lacombe + Simple Memory
├── docker-compose.yml         n8n + Ollama (documents montés en lecture seule)
└── .env.example
```

La leçon évoque 23 documents (PDF et DOCX) ; le lab en fournit 9 en Markdown pour que l'extraction ne fausse pas la comparaison. Ajoutez vos propres documents anonymisés (5 à 20) si vous le souhaitez, **sans données personnelles**.

## Démarrer (sans clé)

- **NotebookLM** : aucun prérequis technique → `guides/C-notebooklm.md` (10 min).
- **n8n + Ollama** :

  ```bash
  cp .env.example .env
  sed -i "s/^N8N_ENCRYPTION_KEY=$/N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)/" .env   # macOS : sed -i ''
  docker compose up -d
  docker compose exec ollama ollama pull nomic-embed-text
  docker compose exec ollama ollama pull gemma4:e4b
  ```

  puis `guides/A-n8n.md` (credential **Ollama local** = `http://ollama:11434`, import des deux workflows).
- **Dify + Ollama** : `guides/B-dify.md`.

Sans clé, la génération tourne sur un petit modèle local : la qualité des citations est un cran en dessous d'un modèle hébergé. C'est une mesure intéressante en soi (grille, section 4). Pour comparer, saisissez une clé Anthropic, OpenAI ou Mistral **dans l'outil** (credential n8n, fournisseur Dify), jamais dans un fichier.

## Énoncé

1. Choisissez deux tutoriels sur trois (trois pour aller plus loin) ; mêmes documents, mêmes questions.
2. Posez les 10 questions de `questions-test.json`, une conversation par question.
3. Remplissez `grille-resultats.csv` : réponse obtenue, juste, source correcte, refus correct (règles dans `grille-evaluation.md`), et le temps de mise en place.
4. Reportez les totaux dans la grille, puis rédigez deux phrases d'explication des écarts.
5. Faites le **défi** de la section 4 de la leçon (trois demandes, trois outils) et justifiez vos choix avec vos mesures.

| Question | Ce qu'elle teste |
|---|---|
| Q01, Q06 | référence technique précise (fiche fournisseur, procédure) |
| Q02, Q03, Q04 | chiffre exact et sa source (CGV, grille) |
| Q05 | condition à ne pas oublier (10 % et non 5,5 %) |
| Q07 | réponse répartie sur deux passages d'un même document |
| Q08 | calcul explicite à partir de deux règles (12 € HT) |
| Q09 | hors base **plausible** : un prix de véranda inventé est l'erreur la plus grave |
| Q10 | hors sujet : refus poli |

## Critères de réussite (repris de la leçon L048, adaptés à 10 questions)

- Les deux assistants répondent correctement à **au moins 6 des 8 questions** dans la base et **refusent les deux questions hors base**.
- Chaque réponse juste **cite le bon document** (titre ou passage).
- Vous expliquez en deux phrases pourquoi un outil a mieux répondu que l'autre (découpage, `k`, modèle, qualité de l'extraction…).
- Dans n8n ou Dify, le modèle d'embeddings est **le même** pour l'ingestion et la consultation, et il est noté dans une Sticky Note ou la description de la base.

## Mission documentation

1. **Vector stores dans n8n** — <https://docs.n8n.io/build/integrate-ai/understand-ai-components/store-and-search-data-with-vectors.md> : quels modes propose un nœud Vector Store (insertion, récupération, outil d'agent…), et pourquoi le *Simple Vector Store* est-il déconseillé en production ?
2. **RAG dans n8n** — <https://docs.n8n.io/build/integrate-ai/understand-ai-components/retrieve-relevant-context.md> : quelle différence entre donner le vector store comme **outil** à un AI Agent et l'utiliser dans une **chaîne Question and Answer** ?
3. **Dify** — <https://github.com/langgenius/dify> : quelle configuration minimale et quelle commande d'installation le README indique-t-il, et sous quelle licence Dify est-il distribué ?

## Limites

Le lab ne mesure ni la fidélité fine (*faithfulness*) ni la stabilité dans le temps : la leçon L049 apprend à régler le découpage et à évaluer avec un jeu de référence ; le lab [`lab-rag-code`](../lab-rag-code/) (L094) refait le même travail en code, avec citations garanties par l'API et évaluation chiffrée.
