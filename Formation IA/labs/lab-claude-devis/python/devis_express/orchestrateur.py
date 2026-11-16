"""Orchestrateur Devis-Express (L077) : boucle tool use → sortie structurée → contrôles → journal.

Mode réel  : ANTHROPIC_API_KEY définie (et LAB_MODE différent de « simulation »).
Mode simulé: sans clé, ou LAB_MODE=simulation → ClientSimule (aucun appel réseau).
"""
from __future__ import annotations

import base64
import json
import mimetypes
import os
import time
from pathlib import Path
from typing import Callable

from .donnees import charger_prompt_systeme, charger_schema_devis
from .outils import FONCTIONS, OUTILS, calculer_totaux, controler_devis, cout_usd, enregistrer_devis
from .simulation import ClientSimule

MODELE = os.environ.get("LAB_MODELE", "claude-sonnet-5-5")
PROMPT_VERSION = "devis-express-v2"
MAX_TOURS = 8
SCHEMA_DEVIS = charger_schema_devis()

SYSTEM = [
    {"type": "text", "text": charger_prompt_systeme()},
    {"type": "text", "text": "Catalogue de référence (PDF) : consultez-le pour les descriptions et pages ; les prix font foi via l'outil.",
     "cache_control": {"type": "ephemeral", "ttl": "1h"}},                 # breakpoint de cache n° 2 : system prompt
]


def mode_simulation() -> bool:
    mode = os.environ.get("LAB_MODE", "").strip().lower()
    if mode == "simulation":
        return True
    if mode == "reel":
        return False
    return not os.environ.get("ANTHROPIC_API_KEY")


def creer_client():
    """Client réel (SDK anthropic) ou simulé. La clé n'est JAMAIS écrite dans le code (E10)."""
    if mode_simulation():
        return ClientSimule()
    from anthropic import Anthropic          # import tardif : inutile d'installer le SDK en mode simulé
    return Anthropic()                       # lit ANTHROPIC_API_KEY dans l'environnement


def bloc_fichier(chemin: str) -> dict:
    """Pièce jointe (photo JPEG/PNG ou PDF) encodée en base64 (exigence E1)."""
    mt = mimetypes.guess_type(chemin)[0] or "application/octet-stream"
    data = base64.standard_b64encode(Path(chemin).read_bytes()).decode()
    return {"type": "document" if mt == "application/pdf" else "image",
            "source": {"type": "base64", "media_type": mt, "data": data}}


def contenu_initial(texte: str, piece_jointe: str | None = None) -> list[dict]:
    contenu: list[dict] = []
    file_id = os.environ.get("CATALOGUE_FILE_ID")         # obtenu une fois via la Files API (etape 1 de la leçon)
    if file_id and not mode_simulation():
        contenu.append({"type": "document", "source": {"type": "file", "file_id": file_id}, "title": "Catalogue 2026",
                        "cache_control": {"type": "ephemeral", "ttl": "1h"}})   # breakpoint de cache n° 3
    if piece_jointe:
        contenu.append(bloc_fichier(piece_jointe))
    contenu.append({"type": "text", "text": f"<demande>\n{texte}\n</demande>"})
    return contenu


def executer_outil(nom: str, entree: dict, confirmer: Callable[[str, float], bool] | None = None) -> tuple[str, bool]:
    """Exécute un outil demandé par le modèle. Renvoie (résultat texte, is_error).

    Règles : outil inconnu → erreur ; toute exception (y compris le refus de l'artisan) → erreur
    renvoyée AU MODÈLE (is_error=True), jamais un plantage de l'orchestrateur.
    `enregistrer_devis` reçoit la fonction `confirmer`.
    """
    # TODO 6 : exécuter l'outil (dispatch sur FONCTIONS), transformer les exceptions en (f"erreur : {e}", True)
    # INDICE : if nom == "enregistrer_devis": enregistrer_devis(**entree, confirmer=confirmer)
    raise NotImplementedError("TODO 6 : exécuter l'outil (dispatch sur FONCTIONS), transformer les exceptions en (f'erreur : {e}', True)")


def _cumuler(total: dict, u) -> None:
    total["input"] += getattr(u, "input_tokens", 0) or 0
    total["output"] += getattr(u, "output_tokens", 0) or 0
    total["cache_w"] += getattr(u, "cache_creation_input_tokens", 0) or 0
    total["cache_r"] += getattr(u, "cache_read_input_tokens", 0) or 0


def traiter_demande(texte: str, client=None, confirmer: Callable[[str, float], bool] | None = None,
                    max_tours: int = MAX_TOURS, journal: str | Path | None = None,
                    piece_jointe: str | None = None) -> dict:
    client = client or creer_client()
    messages: list[dict] = [{"role": "user", "content": contenu_initial(texte, piece_jointe)}]
    usage = {"input": 0, "output": 0, "cache_w": 0, "cache_r": 0}
    outils_appeles: list[dict] = []
    t0 = time.time()

    for _tour in range(max_tours):
        r = client.messages.create(model=MODELE, max_tokens=2000, system=SYSTEM, tools=OUTILS, messages=messages)
        _cumuler(usage, r.usage)
        messages.append({"role": "assistant", "content": r.content})
        if r.stop_reason == "tool_use":
            # TODO 7 : pour chaque bloc tool_use, appeler executer_outil, journaliser l'appel, puis renvoyer UN message user contenant tous les tool_result
            # INDICE : {"type": "tool_result", "tool_use_id": b.id, "content": resultat, "is_error": erreur}
            # INDICE : outils_appeles.append({"outil": b.name, "entree": b.input, "erreur": erreur})
            raise NotImplementedError("TODO 7 : pour chaque bloc tool_use, appeler executer_outil, journaliser l'appel, puis renvoyer UN message user contenant tous les tool_result")
            continue

        # Dernier tour : on redemande la réponse finale en sortie structurée (sans outils)
        messages.append({"role": "user", "content": "Produisez maintenant le devis final au format JSON demandé."})
        rf = client.messages.create(model=MODELE, max_tokens=2000, system=SYSTEM, messages=messages,
                                    output_config={"format": {"type": "json_schema", "schema": SCHEMA_DEVIS}})
        _cumuler(usage, rf.usage)
        texte_final = "".join(b.text for b in rf.content if b.type == "text")
        devis = json.loads(texte_final)
        break
    else:
        devis = {"erreur": "trop de tours", "lignes": [], "total_ht": 0, "taux_tva": None}

    # Contrôles métier : le schéma garantit la forme, pas le fond
    alertes = controler_devis(devis) if "erreur" not in devis else ["plafond de tours atteint : revue humaine"]
    if alertes:
        devis["alertes"] = alertes
        devis["pret_a_valider"] = False
    calculer_totaux(devis)
    cout = cout_usd(usage)
    devis["_cout_usd"] = cout
    devis["_usage"] = usage
    devis["_outils"] = outils_appeles
    entree_journal = {"ts": round(time.time(), 3), "prompt": PROMPT_VERSION, "modele": MODELE,
                      "simulation": isinstance(client, ClientSimule), "usage": usage, "cout_usd": cout,
                      "duree_s": round(time.time() - t0, 2), "outils": [o["outil"] for o in outils_appeles],
                      "alertes": alertes}
    chemin = Path(journal or os.environ.get("DEVIS_JOURNAL", "journal.jsonl"))
    with chemin.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entree_journal, ensure_ascii=False) + "\n")
    return devis
