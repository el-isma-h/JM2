"""Vérification E2 demandée par la leçon : aucune URL de la bibliographie n'est absente des résultats bruts.

python -m veille.audit livrables/<dossier>
"""
import json
import re
import sys
from pathlib import Path

from .agent import normaliser


def auditer(dossier: Path) -> list[str]:
    journal = json.loads((dossier / "journal.json").read_text(encoding="utf-8"))
    brutes = {normaliser(u) for u in journal.get("urls_brutes", [])}
    note = (dossier / "note.md").read_text(encoding="utf-8")
    sources = note.split("## Sources", 1)[1] if "## Sources" in note else ""
    citees = re.findall(r"https?://[^\s)]+", sources)
    return [u for u in citees if normaliser(u) not in brutes]


if __name__ == "__main__":
    hors = auditer(Path(sys.argv[1]))
    print("Conforme E2 : toutes les URL proviennent des moteurs." if not hors else f"NON CONFORME : {hors}")
    sys.exit(1 if hors else 0)
