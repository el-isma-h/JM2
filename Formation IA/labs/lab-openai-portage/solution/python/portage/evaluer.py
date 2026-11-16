"""evaluer — le harnais : les 20 demandes du projet M17, indépendantes du fournisseur (L083, section 7).

python -m portage.evaluer --fournisseur openai [--modele gpt-6.1-terra] [--sortie usages.json]
Le portage est réussi si au moins 18/20 cas passent sur une configuration.
"""
from __future__ import annotations

import argparse
import json
import sys

from .assistant import creer_fournisseur, traiter
from .devis_core import DONNEES

SEUIL = 18
TOLERANCE = 0.01


def charger_cas() -> list[dict]:
    return [json.loads(l) for l in (DONNEES / "cas_tests.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]


def comparer(attendu: dict, devis: dict) -> tuple[bool, list[str]]:
    """Compare un devis obtenu au devis attendu. Renvoie (ok, raisons d'échec).

    Règles : mêmes lignes (désignation, quantité, prix unitaire à TOLERANCE près, ordre indifférent) ;
    même tva_pct ; total_ttc à TOLERANCE près ; si attendu["questions"] est vrai, au moins une question en suspens.
    """
    raisons = []
    cle = lambda l: (l["designation"], int(l["quantite"]), round(float(l["prix_unitaire_ht"]), 2))
    if sorted(map(cle, attendu["lignes"])) != sorted(map(cle, devis["lignes"])):
        raisons.append(f"lignes : attendu {sorted(map(cle, attendu['lignes']))}, obtenu {sorted(map(cle, devis['lignes']))}")
    if float(devis["tva_pct"]) != float(attendu["tva_pct"]):
        raisons.append(f"tva : attendu {attendu['tva_pct']}, obtenu {devis['tva_pct']}")
    if abs(float(devis["total_ttc"]) - float(attendu["total_ttc"])) > TOLERANCE:
        raisons.append(f"total_ttc : attendu {attendu['total_ttc']}, obtenu {devis['total_ttc']}")
    if attendu.get("questions") and not devis.get("questions_en_suspens"):
        raisons.append("aucune question en suspens alors qu'une information manque")
    return not raisons, raisons


def evaluer(nom_fournisseur: str, client=None, modele: str | None = None, verbeux: bool = True) -> dict:
    cas = charger_cas()
    reussis, couts, usages, echecs = 0, [], [], []
    for c in cas:
        f = creer_fournisseur(nom_fournisseur, client=client, modele=modele)
        res = traiter(c["demande"], f)
        ok, raisons = comparer(c["attendu"], res["devis"])
        ok = ok and not res["alertes"]
        reussis += ok
        couts.append(res["cout_usd"])
        usages.extend(res["usages"])
        if not ok:
            echecs.append({"id": c["id"], "raisons": raisons + res["alertes"]})
        if verbeux:
            print(f"{c['id']}  {'✔' if ok else '✘'}  {res['cout_usd']:.5f} $  {'; '.join(raisons + res['alertes'])}")
    bilan = {"fournisseur": nom_fournisseur, "modele": f.modele, "score": reussis, "sur": len(cas),
             "reussi": reussis >= SEUIL, "cout_moyen_usd": round(sum(couts) / len(cas), 6), "echecs": echecs,
             "usages": usages}
    if verbeux:
        print(f"\nScore {reussis}/{len(cas)} (seuil {SEUIL}) · coût moyen {bilan['cout_moyen_usd']:.5f} $ par devis")
    return bilan


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--fournisseur", choices=["openai", "anthropic"], default="openai")
    ap.add_argument("--modele", default=None)
    ap.add_argument("--sortie", default=None, help="écrit la liste des usages (pour couts.py)")
    a = ap.parse_args()
    b = evaluer(a.fournisseur, modele=a.modele)
    if a.sortie:
        json.dump(b["usages"], open(a.sortie, "w", encoding="utf-8"))
    sys.exit(0 if b["reussi"] else 1)
