"""python -m devis_express "texte de la demande" [--piece-jointe photo.jpg]"""
import argparse
import json

from .orchestrateur import mode_simulation, traiter_demande


def main() -> None:
    ap = argparse.ArgumentParser(description="Devis-Express : prépare un brouillon de devis (validation humaine obligatoire)")
    ap.add_argument("demande", nargs="?", default="Bonjour, je voudrais ajouter 3 prises dans le salon et déplacer "
                    "l'interrupteur du couloir. Maison de 1998. Dispo le 6 novembre après-midi ? Merci, Mme Fabre")
    ap.add_argument("--piece-jointe", default=None, help="photo (JPEG/PNG) ou PDF joint à la demande")
    a = ap.parse_args()
    print(f"Mode : {'SIMULATION (sans clé, aucun appel réseau)' if mode_simulation() else 'RÉEL (API Anthropic)'}")
    devis = traiter_demande(a.demande, piece_jointe=a.piece_jointe)
    print(json.dumps(devis, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
