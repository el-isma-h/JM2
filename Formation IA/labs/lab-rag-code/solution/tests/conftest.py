import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def hors_ligne(monkeypatch):
    monkeypatch.setenv("LAB_MODE", "simulation")
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)


@pytest.fixture
def base():
    from rag.embeddings import EmbeddeurHash
    from rag.ingestion import ingerer_dossier
    from rag.stockage import StockageMemoire
    st, emb = StockageMemoire(), EmbeddeurHash()
    ingerer_dossier(st, emb)
    return st, emb


@pytest.fixture
def client_api(base, tmp_path):
    from fastapi.testclient import TestClient
    from rag.api import creer_app
    from rag.generation import FauxClaudeCitations
    faux = FauxClaudeCitations()
    app = creer_app(stockage=base[0], embeddeur=base[1], client=faux, cache_db=str(tmp_path / "cache.sqlite"))
    return TestClient(app), faux
