import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def hors_ligne(monkeypatch, tmp_path):
    monkeypatch.setenv("LAB_MODE", "simulation")
    for cle in ("ANTHROPIC_API_KEY", "PERPLEXITY_API_KEY", "XAI_API_KEY"):
        monkeypatch.delenv(cle, raising=False)
    monkeypatch.setenv("VEILLE_SORTIE", str(tmp_path / "livrables"))
    import veille.agent
    monkeypatch.setattr(veille.agent, "ATTENTE_BASE", 0)
    return tmp_path
