# Lab L094 — RAG documentaire d'entreprise (FastAPI + pgvector + citations Claude)

| | |
|---|---|
| Leçon liée | [L094 — Projet : RAG documentaire d'entreprise](../../niveaux/N3-developpeur/M20-rag-en-code/L094-projet-rag-documentaire-d-entreprise.md) (module M20, niveau 3) |
| Compétences | C3.3, C3.1 |
| Durée | 3 h pour les 7 TODO en mode simulé + 2 h pour docker compose, le mode réel et `RAPPORT.md` |
| Prérequis | Python 3.10+ ; Docker (facultatif au départ) ; aucune clé pour démarrer |

## Objectif

Livrer l'assistant documentaire de **Bréval Matériaux** (négoce de matériaux, 45 salariés, fictif) : une API `/ask` qui répond en citant **la procédure et la page**, ou qui refuse clairement ; un flux SSE `/ask/stream` ; un cache exact ; un journal des coûts ; un contrôle d'accès côté serveur ; une évaluation chiffrée sur `tests.jsonl`.

## Contenu

```
lab-rag-code/
├── procedures/        9 procédures fictives (Markdown, marqueurs <!-- page N --> = pages d'un PDF)
├── tests.jsonl        27 cas : 21 questions sourcées, 4 hors périmètre, 2 de contrôle d'accès (service Paie)
├── starter/           STARTER : package rag/ avec 7 TODO + tests pytest
├── solution/          corrigé (mêmes tests, tous verts)
├── schema.sql         table pgvector (HNSW) + tsvector (plein texte)
├── Dockerfile         image API / ingestion (ARG APP_DIR=starter|solution)
├── docker-compose.yml db (pgvector/pgvector:pg17) + api + ingestion (profil batch)
└── .env.example
```

Le package `rag/` : `ingestion.py` (lecture, découpage, ingestion incrémentale), `embeddings.py` (hash hors ligne ou `sentence-transformers`), `stockage.py` (mémoire ou pgvector), `recherche.py` (hybride + RRF + seuil), `generation.py` (blocs `document` à citations + faux client), `api.py` (FastAPI), `evaluer.py`.

## Démarrer en mode simulé (sans clé, sans Docker)

```bash
cd starter
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest                       # rouge au départ : chaque échec affiche le TODO concerné
```

Le mode simulé utilise un stockage en mémoire, des embeddings « hash » (déterministes, aucun téléchargement) et `FauxClaudeCitations`, qui renvoie des blocs texte avec citations au format de l'API (`document_index`, `cited_text`) et refuse quand les documents ne couvrent pas la question.

## Énoncé : les 7 TODO

| TODO | Fichier | Ce que vous codez | Lien avec la leçon |
|---|---|---|---|
| 1 | `ingestion.py` | `decouper` : paragraphes → phrases → mots, taille max, chevauchement recalé sur un mot | L090 |
| 2 | `ingestion.py` | `ingerer_dossier` incrémentale et **idempotente** (empreintes, suppression des disparus) | « une seconde exécution ne modifie rien » |
| 3 | `recherche.py` | `rrf` : Reciprocal Rank Fusion des classements vectoriel et plein texte | L092 |
| 4 | `recherche.py` | `filtrer` : seuil de pertinence → refus **sans appeler le modèle** | section 3 |
| 5 | `generation.py` | `construire_message` : un bloc `document` par extrait, `citations.enabled` | section 3 (citations garanties) |
| 6 | `api.py` | `cle_cache` : question normalisée **et** droits de l'utilisateur | section 4 |
| 7 | `api.py` | `services_autorises` : filtre d'accès déduit de l'identité, jamais du client | section 6 |

Ordre conseillé : 1 → 2 → 3 → 4 (`pytest -k "decoupage or ingestion or rrf or filtrer"`), puis 5 → 7, puis `python -m rag.evaluer` qui affiche hit rate@5, citations exactes, refus corrects.

## Docker compose (pgvector)

```bash
cp .env.example .env                      # PG_PASSWORD obligatoire ; RAG_APP_DIR=solution pour tester le corrigé
docker compose up -d --build              # db + api sur http://127.0.0.1:8080
docker compose run --rm ingestion         # ingestion (à planifier chaque nuit : cron hôte)
curl -s -X POST 127.0.0.1:8080/ask -H 'Content-Type: application/json' \
     -d '{"question": "Que dit la procédure PR-2024-17 sur le délai de retour ?"}'
curl -s -X POST 127.0.0.1:8080/ask -H 'Content-Type: application/json' -H 'X-Utilisateur: c.durand' \
     -d '{"question": "À quelle date le virement des salaires est-il effectué ?"}'
curl -N -X POST 127.0.0.1:8080/ask/stream -H 'Content-Type: application/json' -d '{"question": "Combien de jours de télétravail ?"}'
```

Lancez l'ingestion deux fois : la seconde doit afficher `ajoutes: 0`. L'API n'écoute que sur `127.0.0.1` ; la base n'est pas exposée.

## Mode réel

Renseignez `ANTHROPIC_API_KEY` dans `.env` (et `LAB_MODE=reel`) : `generation.py` appelle alors `claude-sonnet-5-5` avec le system prompt en cache. Pour des embeddings réels, ajoutez `sentence-transformers` à l'image, `RAG_EMBEDDINGS=sentence-transformers` (modèle par défaut `BAAI/bge-m3`, 1024 dimensions comme `schema.sql`), relancez l'ingestion et **recalibrez `RAG_SEUIL`** sur les cas hors périmètre. Vérifiez dans le journal (`journal` de `cache.sqlite`) que `cache_read` est non nul dès le deuxième appel.

Ce que le mode simulé ne mesure pas : la fidélité (*faithfulness*) d'un vrai modèle. Ajoutez Ragas ou DeepEval (L093) en mode réel pour la grille.

## Critères de réussite (repris de la leçon L094, section 7 ; seuil 70 % avec « Attendu » obligatoire sur qualité et traçabilité)

- **Qualité mesurée (30 %)** : `tests.jsonl` ≥ 40 cas relus (complétez les 27 fournis), hit rate@5 ≥ 0,85, faithfulness ≥ 0,85, refus corrects sur les cas hors périmètre.
- **Traçabilité (20 %)** : source + page sur chaque réponse ; citations garanties par l'API ; extraits affichables.
- **Ingestion (15 %)** : incrémentale, idempotente, formats PDF/DOCX/HTML (le lab fournit du Markdown : ajoutez l'extraction), gestion des scannés ; contextual retrieval activable par variable d'environnement.
- **Recherche (15 %)** : hybride + RRF + seuil de refus ; reranking mesuré (extension : cross-encoder à la place de la couverture lexicale).
- **Coûts et performance (10 %)** : tableau de coûts à partir des tarifs officiels, p95 < 5 s, prompt caching vérifié dans `usage`.
- **Sécurité et conformité (10 %)** : clés en variables d'environnement, bornes (500 caractères), filtre d'accès côté serveur, journal purgé (90 jours), revue des risques d'injection documentaire.
- Démonstration : `docker compose up`, puis cinq `curl` dont une question hors périmètre et une à référence exacte (PR-2024-17) ; une seconde ingestion ne modifie rien ; `RAPPORT.md` avec un coût mensuel calculé à partir de la page Pricing.

## Mission documentation

1. **Citations** — <https://platform.claude.com/docs/en/build-with-claude/citations> : quels types de documents acceptent les citations, quel type de localisation est renvoyé pour une source `content`, et `cited_text` est-il facturé en sortie ?
2. **Streaming** — <https://platform.claude.com/docs/en/build-with-claude/streaming> : quel événement transporte une citation pendant le flux, et dans quel ordre arrivent `message_start`, `content_block_delta` et `message_stop` ?
3. **pgvector** — <https://github.com/pgvector/pgvector> : quelle différence entre les index HNSW et IVFFlat, et quel opérateur correspond à la distance cosinus utilisée dans `stockage.py` ?
