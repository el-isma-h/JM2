import sys
from datetime import datetime
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def hors_ligne(monkeypatch):
    """Aucun test n'appelle l'API ni n'envoie d'e-mail."""
    monkeypatch.setenv("LAB_MODE", "simulation")
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    for var in ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "RAPPORT_TO", "RESPONSABLE_TO"):
        monkeypatch.delenv(var, raising=False)


@pytest.fixture(scope="session")
def ventes():
    from reporting.kpi import charger
    return charger()


@pytest.fixture
def kpi_juin(ventes):
    from reporting.kpi import calculer_kpi
    return calculer_kpi(ventes, datetime(2026, 6, 29))
