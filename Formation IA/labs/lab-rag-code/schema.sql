-- schema.sql — exécuté une seule fois, à la création du volume pgdata (docker-entrypoint-initdb.d)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS morceaux (
    id              TEXT PRIMARY KEY,                 -- "<source>#p<page>#<n>"
    source          TEXT NOT NULL,
    page            INTEGER NOT NULL,
    service         TEXT NOT NULL,                    -- sert au contrôle d'accès (documents restreints)
    titre           TEXT NOT NULL,
    contenu         TEXT NOT NULL,
    texte_normalise TEXT NOT NULL,                    -- jetons normalisés (rag.textes.jetons) pour le plein texte
    empreinte       TEXT NOT NULL,                    -- ingestion incrémentale et idempotente
    embedding       vector(1024) NOT NULL,            -- 1024 = BAAI/bge-m3 et EmbeddeurHash par défaut (RAG_DIMENSION)
    tsv             tsvector GENERATED ALWAYS AS (to_tsvector('simple', texte_normalise)) STORED
);

CREATE INDEX IF NOT EXISTS morceaux_embedding_hnsw ON morceaux USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS morceaux_tsv_gin ON morceaux USING gin (tsv);
CREATE INDEX IF NOT EXISTS morceaux_service ON morceaux (service);
