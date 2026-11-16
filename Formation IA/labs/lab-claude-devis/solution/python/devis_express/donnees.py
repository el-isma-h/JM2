"""Accès aux données partagées du lab (catalogue, schéma, prompt, cas d'évaluation).

Le dossier `donnees/` est cherché en remontant l'arborescence depuis ce fichier,
ce qui permet au starter et à la solution d'utiliser exactement les mêmes données.
La variable d'environnement LAB_DONNEES permet de pointer vers un autre dossier.
"""
from __future__ import annotations

import json
import os
from pathlib import Path


def dossier_donnees() -> Path:
    env = os.environ.get("LAB_DONNEES")
    if env:
        return Path(env)
    for parent in Path(__file__).resolve().parents:
        candidat = parent / "donnees" / "catalogue.json"
        if candidat.exists():
            return candidat.parent
    raise FileNotFoundError("Dossier donnees/ introuvable : définissez LAB_DONNEES.")


def charger_catalogue() -> dict[str, dict]:
    brut = json.loads((dossier_donnees() / "catalogue.json").read_text(encoding="utf-8"))
    return {p["code"]: p for p in brut["prestations"]}


def charger_schema_devis() -> dict:
    return json.loads((dossier_donnees() / "schema_devis.json").read_text(encoding="utf-8"))


def charger_prompt_systeme() -> str:
    return (dossier_donnees() / "prompt_systeme.txt").read_text(encoding="utf-8").strip()


def charger_cas_eval() -> list[dict]:
    lignes = (dossier_donnees() / "demandes_eval.jsonl").read_text(encoding="utf-8").splitlines()
    return [json.loads(l) for l in lignes if l.strip()]
