"""Évaluation de Devis-Express sur donnees/demandes_eval.jsonl (étape 3 de la leçon).

python -m devis_express.evaluer            # mode simulé si pas de clé, réel sinon
Notateurs « code » : prix inventés (0 exigé), taux de TVA, lignes, hors catalogue, questions, coût.
(Le juge LLM « questions pertinentes » et l'exécution en Batch sont à ajouter en mode réel : voir README.)
"""
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

from .donnees import charger_cas_eval
from .orchestrateur import creer_client, traiter_demande

SEUILS = {"prix_inventes": 0, "tva": 0.90, "cout_moyen_usd": 0.05}


def evaluer(client=None, verbeux: bool = True) -> dict:
    client = client or creer_client()
    cas = charger_cas_eval()
    lignes_ok = tva_ok = hors_ok = questions_ok = prix_inventes = 0
    couts, details = [], []
    with tempfile.TemporaryDirectory() as tmp:
        for c in cas:
            d = traiter_demande(c["texte"], client=client, confirmer=lambda *_: False,   # personne ne valide pendant l'eval
                                journal=Path(tmp) / "journal.jsonl")
            obtenues = {l["code"]: l["quantite"] for l in d.get("lignes", [])}
            ok_lignes = obtenues == c["lignes_attendues"]
            ok_tva = d.get("taux_tva") == c["taux_tva_attendu"]
            ok_hors = all(any(h in x for x in d.get("prestations_hors_catalogue", [])) for h in c["hors_catalogue_attendu"])
            ok_q = bool(d.get("questions_manquantes")) if c["questions_attendues"] else True
            n_prix = sum(1 for a in d.get("alertes", []) if a.startswith(("prix non conforme", "code inconnu")))
            lignes_ok += ok_lignes; tva_ok += ok_tva; hors_ok += ok_hors; questions_ok += ok_q; prix_inventes += n_prix
            couts.append(d["_cout_usd"])
            details.append({"id": c["id"], "type": c["type"], "lignes": ok_lignes, "tva": ok_tva, "hors": ok_hors,
                            "questions": ok_q, "prix_inventes": n_prix, "cout_usd": d["_cout_usd"]})
    n = len(cas)
    res = {"cas": n, "lignes": lignes_ok / n, "tva": tva_ok / n, "hors_catalogue": hors_ok / n,
           "questions": questions_ok / n, "prix_inventes": prix_inventes,
           "cout_moyen_usd": round(sum(couts) / n, 5), "details": details}
    res["reussi"] = (res["prix_inventes"] <= SEUILS["prix_inventes"] and res["tva"] >= SEUILS["tva"]
                     and res["cout_moyen_usd"] <= SEUILS["cout_moyen_usd"])
    if verbeux:
        print(f"{'cas':5} {'type':15} lignes tva  hors quest prix  coût $")
        for x in details:
            print(f"{x['id']:5} {x['type']:15} {'✔' if x['lignes'] else '✘':6} {'✔' if x['tva'] else '✘':4} "
                  f"{'✔' if x['hors'] else '✘':4} {'✔' if x['questions'] else '✘':5} {x['prix_inventes']:<5} {x['cout_usd']:.5f}")
        print(json.dumps({k: v for k, v in res.items() if k != "details"}, ensure_ascii=False, indent=2))
    return res


if __name__ == "__main__":
    sys.exit(0 if evaluer()["reussi"] else 1)
