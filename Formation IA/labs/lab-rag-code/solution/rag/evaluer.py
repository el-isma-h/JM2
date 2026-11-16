"""Évaluation (L093) sur tests.jsonl : hit rate@5 (recherche), refus corrects (hors périmètre et droits),
citations exactes (source + page) et présence des éléments attendus dans la réponse.

python -m rag.evaluer        (mode simulé sans clé ; en mode réel, ajoutez Ragas/DeepEval pour la fidélité)
"""
from __future__ import annotations

import json
import sys

from . import config
from .api import services_autorises
from .embeddings import creer_embeddeur
from .generation import REFUS, creer_client, repondre
from .ingestion import ingerer_dossier
from .recherche import rechercher
from .stockage import StockageMemoire, creer_stockage

SEUILS = {"hit_rate_5": 0.85, "refus": 1.0, "citations": 0.85}


def charger_tests() -> list[dict]:
    return [json.loads(l) for l in config.TESTS_JSONL.read_text(encoding="utf-8").splitlines() if l.strip()]


def evaluer(stockage=None, embeddeur=None, client=None, verbeux: bool = True) -> dict:
    stockage = stockage or creer_stockage()
    embeddeur = embeddeur or creer_embeddeur()
    client = client or creer_client()
    if stockage.compter() == 0:
        ingerer_dossier(stockage, embeddeur)
    hits = n_in = refus_ok = n_hors = cit_ok = elem_ok = 0
    for t in charger_tests():
        services = services_autorises(t.get("utilisateur"))
        extraits = rechercher(t["question"], stockage, embeddeur, services, k=5)
        res = repondre(t["question"], extraits, client)
        attendues = {(s["source"], s["page"]) for s in t["sources_attendues"]}
        if t["hors_perimetre"]:
            n_hors += 1
            ok = res["reponse"] == REFUS and not res["citations"]
            refus_ok += ok
        else:
            n_in += 1
            hit = bool(attendues & {(e["source"], e["page"]) for e in extraits})
            cit = bool(res["citations"]) and all((c["source"], c["page"]) in attendues for c in res["citations"][:1])
            elem = all(e.lower() in res["reponse"].lower() for e in t["elements_attendus"])
            hits += hit; cit_ok += cit; elem_ok += elem
            ok = hit and cit
        if verbeux:
            print(f"{t['id']} {'✔' if ok else '✘'} {t['question'][:60]:60} → "
                  f"{[(c['source'], c['page']) for c in res['citations']][:1] or res['reponse'][:40]}")
    bilan = {"hit_rate_5": round(hits / n_in, 3), "citations": round(cit_ok / n_in, 3),
             "elements_attendus": round(elem_ok / n_in, 3), "refus": round(refus_ok / max(n_hors, 1), 3),
             "cas_dans_perimetre": n_in, "cas_hors_perimetre": n_hors}
    bilan["reussi"] = all(bilan[k] >= v for k, v in SEUILS.items())
    if verbeux:
        print(json.dumps(bilan, ensure_ascii=False, indent=2))
    return bilan


if __name__ == "__main__":
    sys.exit(0 if evaluer()["reussi"] else 1)
