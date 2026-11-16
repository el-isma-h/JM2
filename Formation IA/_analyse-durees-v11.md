# Analyse des durées après l'enrichissement v1.1 (5 novembre 2026)

Analyse en lecture seule : **aucune durée n'a été modifiée**. Les durées font partie du programme déclaré (150 h, CPF, Qualiopi) ; les changer demande votre accord.

Méthode d'estimation : texte hors code lu à 180 mots/min, code lu à 60 mots/min, 1 min par quiz éclair, 5 min par mission documentation. **Les exercices pratiques ne sont pas comptés** : le temps réel est donc plus long que l'estimation.

| Niveau | Durée déclarée des leçons | Lecture + quiz + missions estimés | Part |
|---|---|---|---|
| N1 | 1335 min | 1287 min | 96 % |
| N2 | 1920 min | 1538 min | 80 % |
| N3 | 2520 min | 2607 min | 103 % |
| N4 | 2535 min | 2079 min | 82 % |
| N5 | 1635 min | 1544 min | 94 % |

## Les 40 leçons dont la seule lecture dépasse la durée déclarée

| Niveau | Leçon | Titre | Déclaré | Lecture estimée |
|---|---|---|---|---|
| N5 | L182 | Transformation et qualité : parsing, PII, déduplication, chunking en silver ; tests et contrats | 45 min | 86 min |
| N5 | L152 | Types de données et formats de fichiers : CSV, JSON/JSONL, Parquet, Avro, ORC, Arrow — mesurer taille et vitesse | 55 min | 103 min |
| N5 | L184 | Industrialiser : orchestration, observabilité, coût par document, documentation et soutenance | 45 min | 72 min |
| N5 | L183 | Indexation vectorielle incrémentale (upserts, suppressions, ré-embedding) et évaluation de la récupération | 45 min | 67 min |
| N3 | L067 | Tokens, coûts, rate limits, caching : maîtriser la facture | 65 min | 88 min |
| N5 | L180 | Cadrer le projet : sources, volumétrie, fraîcheur, droits d'accès, SLA, contrat de données et architecture cible | 40 min | 54 min |
| N5 | L181 | Ingestion : documents (stockage objet) et base métier en CDC vers la couche bronze | 45 min | 58 min |
| N3 | L075 | MCP : construire un serveur et un client | 50 min | 64 min |
| N1 | L031 | Sécurité au quotidien : clés, phishing IA, shadow AI | 40 min | 51 min |
| N3 | L100 | Projet : agent de recherche et de rédaction autonome | 65 min | 81 min |
| N3 | L072 | Vision, PDF, Files API et citations | 45 min | 55 min |
| N3 | L089 | Embeddings et bases vectorielles : pgvector, Chroma, Qdrant | 55 min | 65 min |
| N3 | L102 | Backend : files d'attente, limites, coûts, cache | 50 min | 59 min |
| N3 | L066 | HTTP, JSON, streaming : anatomie d'un appel à un LLM | 65 min | 76 min |
| N3 | L068 | Messages API : requêtes, rôles, paramètres, modèles | 50 min | 58 min |
| N3 | L073 | Prompt caching, Batch API, extended thinking | 50 min | 57 min |
| N3 | L076 | Skills, bonnes pratiques et évaluation des prompts | 45 min | 51 min |
| N3 | L104 | CI/CD et tests de prompts | 45 min | 51 min |
| N5 | L179 | Features, versions et données synthétiques : Feast (point-in-time), DVC, lakeFS, SDV et génération par LLM | 45 min | 51 min |
| N1 | L004 | Mythes, réalités et chiffres clés de l'IA en 2026 | 40 min | 45 min |
| N1 | L021 | Cas d'usage par métier : RH, vente, marketing, finance, support, juridique | 45 min | 50 min |
| N3 | L103 | Observabilité : Langfuse, LangSmith ; évaluations : promptfoo, DeepEval | 55 min | 61 min |
| N3 | L070 | Tool use : donner des outils à Claude | 50 min | 55 min |
| N3 | L074 | Claude Code et Claude Agent SDK en pratique | 50 min | 55 min |
| N3 | L109 | Secrets, quotas, abus et coûts | 50 min | 54 min |
| N1 | L028 | RGPD et données personnelles dans les prompts (CNIL) | 40 min | 43 min |
| N1 | L030 | Droit d'auteur, deepfakes, biais et discriminations | 40 min | 43 min |
| N3 | L107 | Prompt injection directe et indirecte : attaques et défenses | 55 min | 59 min |
| N3 | L071 | Sorties structurées et JSON fiable | 45 min | 48 min |
| N3 | L065 | Python et TypeScript pour l'IA : environnement, SDK, clés API, secrets | 65 min | 69 min |
| N5 | L151 | Le cycle de vie du data engineering et le rôle du data engineer IA (Reis & Housley, fiche APEC, ROME M1811) | 40 min | 42 min |
| N3 | L077 | Projet : assistant métier avec Claude | 65 min | 68 min |
| N1 | L020 | Atelier guidé : 10 prompts à construire et corriger | 50 min | 52 min |
| N3 | L092 | Recherche hybride, reranking, requêtes multiples | 50 min | 52 min |
| N3 | L093 | Évaluer un RAG : Ragas, jeux de test, métriques | 50 min | 52 min |
| N3 | L090 | Pipeline d'ingestion : parsing, chunking, métadonnées | 55 min | 57 min |
| N2 | L058 | Automatiser un reporting hebdomadaire | 60 min | 62 min |
| N3 | L101 | Next.js et Vercel AI SDK : chat en streaming | 60 min | 62 min |
| N3 | L088 | Architecture multi-fournisseur : abstraction, routeurs (OpenRouter, LiteLLM), repli | 75 min | 77 min |
| N4 | L122 | Rétropropagation à la main (micrograd, Karpathy) | 65 min | 66 min |

## Pistes (à valider)

1. Garder les 150 h et rééquilibrer les minutes à l'intérieur de chaque niveau (les leçons N2 et N4 ont de la marge).
2. Garder les durées et indiquer dans le guide apprenant que les encadrés « Pas à pas » et « Pré-requis express » sont facultatifs pour les profils déjà à l'aise.
3. Augmenter la durée du parcours (impact sur le dossier RS, le prix et le plafond CPF).
