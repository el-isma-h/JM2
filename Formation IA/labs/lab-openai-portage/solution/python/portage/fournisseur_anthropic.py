"""fournisseur_anthropic — la version Claude (M17), FOURNIE et complète : c'est votre point de comparaison.

Comparez-la ligne à ligne avec fournisseur_openai.py (tableau de la section 4.3 de la leçon) :
system + cache_control ↔ instructions ; input_schema ↔ parameters ; tool_use/tool_result ↔ function_call/function_call_output.
"""
from __future__ import annotations

import json
import os
from typing import Callable

from .devis_core import FN, OUTILS_NEUTRES, SYSTEM_PROMPT, Devis
from .simulation import FauxAnthropic

MAX_SORTIE = 1500


def mode_simulation() -> bool:
    mode = os.environ.get("LAB_MODE", "").lower()
    if mode in ("simulation", "reel"):
        return mode == "simulation"
    return not os.environ.get("ANTHROPIC_API_KEY")


def creer_client():
    if mode_simulation():
        return FauxAnthropic()
    from anthropic import Anthropic
    return Anthropic()


def traduire_outils(outils_neutres: list[dict] = OUTILS_NEUTRES) -> list[dict]:
    outils = [{"name": o["name"], "description": o["description"], "input_schema": o["schema"]} for o in outils_neutres]
    outils[-1]["cache_control"] = {"type": "ephemeral"}          # point de cache sur les définitions d'outils
    return outils


def normaliser_usage(u) -> dict:
    return {"input_non_cache": u.input_tokens, "cache_lecture": getattr(u, "cache_read_input_tokens", 0) or 0,
            "cache_ecriture": getattr(u, "cache_creation_input_tokens", 0) or 0, "output": u.output_tokens}


class FournisseurAnthropic:
    nom = "anthropic"

    def __init__(self, client=None, modele: str | None = None):
        self.client = client or creer_client()
        self.modele = modele or os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5-5")
        self.outils = traduire_outils()
        self.system = [{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}]
        self.usages: list[dict] = []

    @staticmethod
    def message_utilisateur(texte: str) -> dict:
        return {"role": "user", "content": texte}

    def tour(self, historique: list, max_iterations: int = 6, afficher: Callable[[str], None] = lambda s: None) -> list:
        for _ in range(max_iterations):
            r = self.client.messages.create(model=self.modele, max_tokens=MAX_SORTIE, system=self.system,
                                            tools=self.outils, messages=historique)
            self.usages.append(normaliser_usage(r.usage))
            for b in r.content:
                if b.type == "text":
                    afficher(b.text)
            historique.append({"role": "assistant", "content": r.content})
            if r.stop_reason != "tool_use":
                return historique
            resultats = [{"type": "tool_result", "tool_use_id": b.id,
                          "content": json.dumps(FN[b.name](b.input), ensure_ascii=False)}
                         for b in r.content if b.type == "tool_use"]
            historique.append({"role": "user", "content": resultats})          # rôle user chez Anthropic
        raise RuntimeError("Trop d'itérations d'outils")

    def generer_devis(self, historique: list) -> Devis:
        r = self.client.messages.parse(
            model=self.modele, max_tokens=MAX_SORTIE, system=self.system,
            messages=historique + [{"role": "user", "content": "Produis maintenant le devis au format demandé."}],
            output_format=Devis,
        )
        self.usages.append(normaliser_usage(r.usage))
        return r.parsed_output
