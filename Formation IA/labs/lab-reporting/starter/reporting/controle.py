"""Contrôle automatique : chaque montant et chaque pourcentage du texte doit exister dans le JSON kpi.

Version du lab, un peu plus stricte que l'extrait de la leçon L058 (section 7) :
- montants à deux décimales (« 1 078,20 ») comme dans la leçon ;
- montants entiers suivis de « € » (« environ 1 100 € ») : un arrondi est une erreur ;
- pourcentages (« −55,9 % ») : valeur absolue connue ET, si le texte écrit un signe, le même signe.
Les espaces (normales, fines, insécables) sont ignorées.
"""
from __future__ import annotations

import json
import re

ESPACES = "[   ]"
MOTIF_MONTANT = re.compile(rf"\d[\d   ]*,\d{{2}}")
MOTIF_EUROS_ENTIER = re.compile(rf"(?<![\d,])\d[\d   ]*(?!{ESPACES}*[\d,]){ESPACES}*€")
MOTIF_POURCENT = re.compile(rf"([+−-]?){ESPACES}*(\d+(?:,\d+)?){ESPACES}*%")


def _normaliser(s: str) -> str:
    return re.sub(r"[   €]", "", s)


def _signe(s: str) -> str:
    return "-" if s in ("-", "−") else ("+" if s == "+" else "")


def montants(texte: str) -> set[str]:
    """Montants trouvés, normalisés : « 1 078,20 » → « 1078,20 » ; « 1 100 € » → « 1100 »."""
    trouves = {_normaliser(m) for m in MOTIF_MONTANT.findall(texte)}
    trouves |= {_normaliser(m) for m in MOTIF_EUROS_ENTIER.findall(texte)}
    return trouves


def pourcentages(texte: str) -> set[tuple[str, str]]:
    """{(signe, valeur)} : « −55,9 % » → ("-", "55,9") ; « baisse de 55,9 % » → ("", "55,9")."""
    return {(_signe(s), v) for s, v in MOTIF_POURCENT.findall(texte)}


def controler(texte: str, kpi: dict) -> list[str]:
    """Renvoie la liste triée des chiffres du texte absents du JSON (inventés, inversés, arrondis…)."""
    # TODO 4 : montants(texte) − montants(json.dumps(kpi, ensure_ascii=False)) ;
    # puis chaque pourcentage du texte : valeur inconnue, ou signe écrit différent de celui du JSON
    # → ajoutez f"{signe}{valeur} %". Renvoyez la liste triée.
    raise NotImplementedError("TODO 4 : contrôler les chiffres recopiés (controler)")
