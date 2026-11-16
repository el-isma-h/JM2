"""assistant — la boucle NEUTRE : elle ne connaît que l'interface commune des fournisseurs.

python -m portage.assistant --fournisseur openai "Une porte chêne 204x73 avec pose, maison de 15 ans. Client : Mme Leroy."
"""
from __future__ import annotations

import argparse
import json
import sys

from .couts import cout_total
from .devis_core import controle_metier


def creer_fournisseur(nom: str, client=None, modele: str | None = None):
    if nom == "openai":
        from .fournisseur_openai import FournisseurOpenAI
        return FournisseurOpenAI(client=client, modele=modele)
    if nom == "anthropic":
        from .fournisseur_anthropic import FournisseurAnthropic
        return FournisseurAnthropic(client=client, modele=modele)
    raise ValueError(f"fournisseur inconnu : {nom}")


def traiter(demande: str, fournisseur, afficher=lambda s: None) -> dict:
    historique = [fournisseur.message_utilisateur(demande)]
    historique = fournisseur.tour(historique, afficher=afficher)
    devis = fournisseur.generer_devis(historique)
    return {"devis": devis.model_dump(), "alertes": controle_metier(devis), "usages": list(fournisseur.usages),
            "cout_usd": cout_total(fournisseur.usages, fournisseur.modele), "fournisseur": fournisseur.nom,
            "modele": fournisseur.modele}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("demande")
    ap.add_argument("--fournisseur", choices=["openai", "anthropic"], default="openai")
    ap.add_argument("--modele", default=None)
    a = ap.parse_args()
    f = creer_fournisseur(a.fournisseur, modele=a.modele)
    print(f"[{f.nom} · {f.modele} · {type(f.client).__name__}]")
    res = traiter(a.demande, f, afficher=lambda s: print(s, end="", flush=True))
    print()
    json.dump(res, sys.stdout, ensure_ascii=False, indent=2)
    print()


if __name__ == "__main__":
    main()
