import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def environnement_isole(tmp_path, monkeypatch):
    """Tests 100 % hors ligne : mode simulé forcé, fichiers écrits dans un dossier temporaire."""
    monkeypatch.setenv("LAB_MODE", "simulation")
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setenv("DEVIS_VALIDES", str(tmp_path / "devis_valides.jsonl"))
    monkeypatch.setenv("DEVIS_JOURNAL", str(tmp_path / "journal.jsonl"))
    yield tmp_path
