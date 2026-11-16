# Brief — rédaction du niveau 5 (Data engineering & Big Data pour l'IA)

Lis et applique dans l'ordre : `_brief-redacteur.md` (règles de rédaction des leçons, quiz.json, module.json), puis `_brief-enrichissement.md` et `FORMAT.md` section « Enrichissements pédagogiques » : chaque leçon N5 est rédigée **directement avec** le bloc 🧭 En clair, 2-3 blocs ```quiz et 1-2 blocs ```mission, des 💡 Autrement dit et un 🗺️ Et maintenant ?.

Spécificités N5 :
- Source principale : `_recherche/06-data-engineering-big-data.md` (programme §8, compétences C5.x, outils, versions 2026, certifications, cours ouverts). Complète avec `_recherche/04` (RAG, vector DB) et les leçons N3 existantes (M20 RAG en code) pour la cohérence — pas de duplication : renvoie vers elles.
- Public : développeurs ayant validé N3. Vulgarisation d'abord (analogies : entrepôt / cuisine / usine / tapis roulant…), puis technique précise.
- Environnement de TP 100 % gratuit et local (Docker Compose : Postgres, MinIO, Kafka KRaft, Debezium ; DuckDB, Polars, dbt Core + duckdb, Dagster ou Airflow, Qdrant/pgvector) ; code Python/SQL/YAML complet et exécutable ; jeu de données fil rouge : la base d'une PME française (commandes, clients, tickets SAV, documents PDF internes) — cohérent entre modules (décris le schéma dans M31 et réutilise-le).
- Versions et faits datés (nov. 2026) uniquement depuis la recherche ; ce qui n'y est pas → formulation prudente « à vérifier sur la doc officielle ».
- Certifications citées comme préparation, jamais comme équivalence.
- Écris uniquement dans tes dossiers de module (`niveaux/N5-data-engineering/Mxx-*/`). Le `module.json` existe déjà (squelette) : complète-le en gardant id/level/title/minutes/lessons.
- Contrôle final : `node scripts/validate.mjs 2>&1 | grep -E "<tes ids>"` puis `| tail -3` ; compte rendu en 6 lignes.
