"""python -m veille "Sujet de la note" [--mots 900] [--budget 0.60] [--domaines a.fr b.fr]"""
import argparse

from .agent import executer
from .simulation import mode_simulation

ap = argparse.ArgumentParser(description="Agent de recherche et de rédaction (note de veille, brouillon)")
ap.add_argument("sujet", nargs="?", default="Facturation électronique obligatoire : ce que doit préparer une PME du BTP")
ap.add_argument("--mots", type=int, default=900)
ap.add_argument("--budget", type=float, default=0.60, help="plafond en USD")
ap.add_argument("--domaines", nargs="*", default=[], help="ex. impots.gouv.fr economie.gouv.fr")
a = ap.parse_args()
print(f"Mode : {'SIMULATION (sans clé, aucun appel réseau)' if mode_simulation() else 'RÉEL'}")
executer(a.sujet, a.mots, a.budget, a.domaines)
