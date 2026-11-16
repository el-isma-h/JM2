"""Outils métier de Devis-Express (L077) : la source de vérité est le CODE, jamais le modèle.

- rechercher_prestation : lit le catalogue JSON (prix HT faisant foi)
- verifier_tva          : encode les règles fiscales (E4)
- creneaux              : lit l'agenda (fictif)
- enregistrer_devis     : écriture, uniquement après confirmation humaine (E6)
- controler_devis       : contrôle déterministe du devis final (E2)
- cout_usd              : coût d'une demande à partir des compteurs `usage` (E7)
"""
from __future__ import annotations

import json
import os
import sys
import unicodedata
from datetime import date
from pathlib import Path
from typing import Callable

from .donnees import charger_catalogue

CATALOGUE: dict[str, dict] = charger_catalogue()

# Tarifs Claude Sonnet 5.5 en $ par million de tokens (page Pricing, nov. 2026 — à revérifier)
TARIFS_SONNET = {"input": 2.00, "output": 10.00, "cache_w": 4.00, "cache_r": 0.10}   # cache_w : écriture TTL 1 h
TAUX_AUTORISES = (5.5, 10.0, 20.0)
MESSAGE_HORS_CATALOGUE = "aucune prestation ne correspond : signaler 'hors catalogue'"


def sans_accents(texte: str) -> str:
    """'Détecteur' -> 'detecteur' : la recherche ne dépend ni de la casse ni des accents."""
    return unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode().lower()


def rechercher_prestation(mot_cle: str, catalogue: dict[str, dict] | None = None) -> str:
    """Renvoie (en JSON) au plus 8 prestations dont le libellé ou le code contient `mot_cle`.

    Si rien ne correspond, renvoie MESSAGE_HORS_CATALOGUE (le modèle doit alors
    classer la demande en « prestations_hors_catalogue »).
    """
    catalogue = CATALOGUE if catalogue is None else catalogue
    m = sans_accents(mot_cle.strip())
    hits = [p for p in catalogue.values()
            if m and (m in sans_accents(p["libelle"]) or m in sans_accents(p["code"]))][:8]
    return json.dumps(hits, ensure_ascii=False) if hits else MESSAGE_HORS_CATALOGUE


def verifier_tva(logement_plus_2_ans: bool, renovation_energetique: bool, local_professionnel: bool) -> str:
    """Taux de TVA applicable (règles simplifiées du lab, exigence E4).

    - local professionnel                                  -> 20 %
    - rénovation énergétique d'un logement de plus de 2 ans -> 5,5 %
    - rénovation d'un logement de plus de 2 ans            -> 10 %
    - logement neuf ou de moins de 2 ans                   -> 20 %
    Renvoie un JSON {"taux": float, "motif": str}.
    """
    if local_professionnel:
        taux, motif = 20.0, "local professionnel"
    elif renovation_energetique and logement_plus_2_ans:
        taux, motif = 5.5, "rénovation énergétique, logement > 2 ans"
    elif logement_plus_2_ans:
        taux, motif = 10.0, "rénovation, logement > 2 ans"
    else:
        taux, motif = 20.0, "logement neuf ou < 2 ans"
    return json.dumps({"taux": taux, "motif": motif}, ensure_ascii=False)


def creneaux(date_iso: str) -> str:
    """Créneaux libres (agenda fictif). En v2 : lecture de l'agenda réel."""
    agenda = {"2026-11-05": ["08:00-10:00"], "2026-11-06": ["14:00-17:00"], "2026-11-09": ["08:00-12:00", "14:00-16:00"]}
    return json.dumps(agenda.get(date_iso, []))


def confirmer_console(client_nom: str, total_ttc: float) -> bool:
    """Confirmation humaine par défaut. Hors terminal interactif (CI, tests) : refus systématique."""
    if not sys.stdin.isatty():
        return False
    reponse = input(f"\n⚠️  Enregistrer le devis de {client_nom} ({total_ttc:.2f} € TTC) ? [o/n] ")
    return reponse.strip().lower() == "o"


def enregistrer_devis(client_nom: str, total_ttc: float,
                      confirmer: Callable[[str, float], bool] | None = None,
                      fichier: str | Path | None = None) -> str:
    """Écrit le devis validé dans un fichier JSONL, UNIQUEMENT si l'artisan confirme (E6).

    Lève PermissionError("refusé par l'artisan") en cas de refus.
    Fichier : `fichier`, sinon la variable DEVIS_VALIDES, sinon devis_valides.jsonl.
    """
    confirmer = confirmer or confirmer_console
    if not confirmer(client_nom, float(total_ttc)):
        raise PermissionError("refusé par l'artisan")
    chemin = Path(fichier or os.environ.get("DEVIS_VALIDES", "devis_valides.jsonl"))
    with chemin.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"date": date.today().isoformat(), "client": client_nom,
                            "total_ttc": float(total_ttc)}, ensure_ascii=False) + "\n")
    return "devis enregistré"


def controler_devis(devis: dict, catalogue: dict[str, dict] | None = None) -> list[str]:
    """Contrôles métier : le schéma garantit la FORME, ce contrôle vérifie le FOND.

    Renvoie la liste des alertes (vide si tout est conforme) :
    - "code inconnu du catalogue : XXX"
    - "prix non conforme au catalogue : XXX"   (écart > 0,01 €)
    - "total_ht incohérent : <annoncé> au lieu de <recalculé>"
    - "taux de TVA non autorisé : <taux>"      (autorisés : 5,5 / 10 / 20 ou null)
    """
    catalogue = CATALOGUE if catalogue is None else catalogue
    alertes: list[str] = []
    lignes = devis.get("lignes", [])
    for l in lignes:
        ref = catalogue.get(l.get("code"))
        if ref is None:
            alertes.append(f"code inconnu du catalogue : {l.get('code')}")
        elif abs(ref["prix_ht"] - float(l.get("prix_unitaire_ht", 0))) > 0.01:
            alertes.append(f"prix non conforme au catalogue : {l['code']}")
    total = round(sum(float(l["quantite"]) * float(l["prix_unitaire_ht"]) for l in lignes), 2)
    if abs(total - float(devis.get("total_ht", 0))) > 0.01:
        alertes.append(f"total_ht incohérent : {devis.get('total_ht')} au lieu de {total}")
    taux = devis.get("taux_tva")
    if taux is not None and float(taux) not in TAUX_AUTORISES:
        alertes.append(f"taux de TVA non autorisé : {taux}")
    return alertes


def calculer_totaux(devis: dict) -> dict:
    """Ajoute total_tva et total_ttc calculés par le code (jamais par le modèle)."""
    taux = devis.get("taux_tva")
    ht = round(sum(float(l["quantite"]) * float(l["prix_unitaire_ht"]) for l in devis.get("lignes", [])), 2)
    devis["total_ht_calcule"] = ht
    if taux is None:
        devis["total_tva"] = devis["total_ttc"] = None
    else:
        devis["total_tva"] = round(ht * float(taux) / 100, 2)
        devis["total_ttc"] = round(ht + devis["total_tva"], 2)
    return devis


def cout_usd(usage: dict, tarifs: dict | None = None) -> float:
    """Coût en dollars d'une demande à partir des compteurs cumulés.

    usage = {"input": ..., "output": ..., "cache_w": ..., "cache_r": ...} (en tokens)
    Formule : somme(tokens × prix par million) / 1 000 000, arrondie à 6 décimales.
    """
    tarifs = tarifs or TARIFS_SONNET
    total = sum(usage.get(cle, 0) * prix for cle, prix in tarifs.items()) / 1_000_000
    return round(total, 6)


FONCTIONS: dict[str, Callable[..., str]] = {
    "rechercher_prestation": rechercher_prestation,
    "verifier_tva": verifier_tva,
    "creneaux": creneaux,
    "enregistrer_devis": enregistrer_devis,
}

OUTILS: list[dict] = [
    {"name": "rechercher_prestation",
     "description": "Recherche des prestations du catalogue par mot-clé (ex. 'prise', 'tableau'). Renvoie code, libellé, "
                    "unité, prix HT, page. Obligatoire avant toute ligne de devis ; si rien ne correspond, la prestation "
                    "est 'hors catalogue'.",
     "input_schema": {"type": "object", "properties": {"mot_cle": {"type": "string"}}, "required": ["mot_cle"]}},
    {"name": "verifier_tva",
     "description": "Détermine le taux de TVA applicable à partir de trois réponses du client. À appeler quand les trois "
                    "informations sont connues ; sinon, les demander.",
     "input_schema": {"type": "object", "properties": {"logement_plus_2_ans": {"type": "boolean"},
                                                       "renovation_energetique": {"type": "boolean"},
                                                       "local_professionnel": {"type": "boolean"}},
                      "required": ["logement_plus_2_ans", "renovation_energetique", "local_professionnel"],
                      "additionalProperties": False},
     "strict": True},
    {"name": "creneaux", "description": "Créneaux d'intervention libres pour une date AAAA-MM-JJ.",
     "input_schema": {"type": "object", "properties": {"date_iso": {"type": "string"}}, "required": ["date_iso"]}},
    {"name": "enregistrer_devis",
     "description": "Enregistre un devis validé. N'appeler qu'après avoir présenté le devis complet et obtenu l'accord "
                    "explicite de l'artisan. Peut être refusé par l'artisan.",
     "input_schema": {"type": "object", "properties": {"client_nom": {"type": "string"}, "total_ttc": {"type": "number"}},
                      "required": ["client_nom", "total_ttc"], "additionalProperties": False},
     "strict": True,
     "cache_control": {"type": "ephemeral"}},          # breakpoint de cache n° 1 : les définitions d'outils
]
