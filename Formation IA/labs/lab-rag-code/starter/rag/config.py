"""Configuration lue dans l'environnement (jamais de secret dans le code)."""
from __future__ import annotations

import os
from pathlib import Path


def _racine_lab() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "procedures").is_dir() and (parent / "tests.jsonl").exists():
            return parent
    return Path.cwd()


RACINE = _racine_lab()
DOCS_DIR = Path(os.environ.get("DOCS_DIR", RACINE / "procedures"))
TESTS_JSONL = Path(os.environ.get("RAG_TESTS", RACINE / "tests.jsonl"))

BACKEND = os.environ.get("RAG_BACKEND", "memoire")            # memoire | pgvector
PG_DSN = os.environ.get("PG_DSN", "")
EMBEDDINGS = os.environ.get("RAG_EMBEDDINGS", "hash")          # hash (hors ligne) | sentence-transformers
LOCAL_EMBEDDING_MODEL = os.environ.get("LOCAL_EMBEDDING_MODEL", "BAAI/bge-m3")
DIMENSION = int(os.environ.get("RAG_DIMENSION", "1024"))        # doit correspondre à schema.sql (bge-m3 : 1024)
MODELE = os.environ.get("RAG_MODEL", "claude-sonnet-5-5")
SEUIL = float(os.environ.get("RAG_SEUIL", "0.5"))              # couverture minimale ; calibrée sur les cas hors périmètre (L093)
K = int(os.environ.get("RAG_K", "6"))
N_CANDIDATS = int(os.environ.get("RAG_N_CANDIDATS", "25"))
TAILLE_MORCEAU = int(os.environ.get("RAG_TAILLE", "700"))       # caractères
CHEVAUCHEMENT = int(os.environ.get("RAG_CHEVAUCHEMENT", "100"))
CACHE_TTL = int(os.environ.get("RAG_CACHE_TTL", "86400"))
CACHE_DB = os.environ.get("RAG_CACHE_DB", "cache.sqlite")

# Annuaire SIMULÉ : en production, le service vient du SSO de l'intranet, jamais d'un champ envoyé par le client.
ANNUAIRE = {"j.martin": "Logistique", "s.bernard": "Commerce", "c.durand": "Paie", "a.leroy": "Direction"}
SERVICES_RESTREINTS = {"Paie": {"Paie", "Direction"}}           # service du document → services autorisés


def mode_simulation() -> bool:
    mode = os.environ.get("LAB_MODE", "").lower()
    if mode in ("simulation", "reel"):
        return mode == "simulation"
    return not os.environ.get("ANTHROPIC_API_KEY")
