"""Reporting hebdomadaire Mobidesk — version script (variante de la section 7 de L058).

Usage : python -m reporting [--date-ref 2026-06-29] [--csv chemin.csv] [--panne faute_de_frappe]
Sans ANTHROPIC_API_KEY : rédacteur simulé. Sans SMTP_HOST : affichage seul, aucun envoi.
Destinataires : RAPPORT_TO (direction) et RESPONSABLE_TO (relecture si le contrôle échoue).
"""
from __future__ import annotations

import argparse
import json
import os
from datetime import datetime

from .controle import controler
from .diffusion import decider, envoyer, texte_final
from .kpi import CSV_DEFAUT, calculer_kpi, charger
from .redaction import PANNES, choisir_redacteur, mode


def executer(csv: str, date_ref: datetime, panne: str | None = None) -> dict:
    kpi = calculer_kpi(charger(csv), date_ref)
    texte = choisir_redacteur(panne).rediger(kpi)
    inconnus = [] if kpi.get("alerte") else controler(texte, kpi)
    return {"kpi": kpi, "texte": texte_final(texte, inconnus), "inconnus": inconnus,
            "statut": decider(kpi, inconnus)}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="python -m reporting")
    p.add_argument("--csv", default=str(CSV_DEFAUT))
    p.add_argument("--date-ref", default=os.environ.get("DATE_REF", datetime.now().date().isoformat()))
    p.add_argument("--panne", choices=PANNES, help="mode simulé : erreur volontaire du rédacteur")
    p.add_argument("--json", action="store_true", help="affiche aussi le JSON kpi envoyé au modèle")
    a = p.parse_args(argv)
    r = executer(a.csv, datetime.fromisoformat(a.date_ref), a.panne)
    print(f"[mode {mode()}] statut : {r['statut']}")
    if a.json:
        print(json.dumps(r["kpi"], ensure_ascii=False, indent=2))
    print(r["texte"])
    destinataire = {"direction": os.environ.get("RAPPORT_TO", ""),
                    "responsable": os.environ.get("RESPONSABLE_TO", ""),
                    "non_genere": os.environ.get("RESPONSABLE_TO", "")}.get(r["statut"], "")
    if destinataire and envoyer(r["texte"], destinataire):
        print(f"Rapport envoyé à {destinataire}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
