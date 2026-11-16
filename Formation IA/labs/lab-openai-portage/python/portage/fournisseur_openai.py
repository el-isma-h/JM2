"""fournisseur_openai — traduction vers la Responses API d'OpenAI (L083, section 4.2).

Streaming + outils (appels parallèles) + sortie structurée Pydantic + usage normalisé.
Mode réel : OPENAI_API_KEY définie. Mode simulé : sans clé ou LAB_MODE=simulation (FauxOpenAI).
"""
from __future__ import annotations

import json
import os
from typing import Callable

from .devis_core import FN, OUTILS_NEUTRES, SYSTEM_PROMPT, Devis
from .simulation import FauxOpenAI

MAX_SORTIE = 1500


def mode_simulation() -> bool:
    mode = os.environ.get("LAB_MODE", "").lower()
    if mode in ("simulation", "reel"):
        return mode == "simulation"
    return not os.environ.get("OPENAI_API_KEY")


def creer_client():
    if mode_simulation():
        return FauxOpenAI()
    from openai import OpenAI            # import tardif : le SDK n'est requis qu'en mode réel
    return OpenAI()                      # lit OPENAI_API_KEY dans l'environnement


def traduire_outils(outils_neutres: list[dict] = OUTILS_NEUTRES) -> list[dict]:
    """Format neutre {name, description, schema, fn} → format Responses {type: 'function', name, description, parameters, strict}."""
    # TODO 1 : traduire chaque outil neutre au format OpenAI (aplati, strict=True, sans la clé fn)
    # INDICE : chez Anthropic la clé s'appelle input_schema ; chez OpenAI, parameters (et il faut type="function")
    raise NotImplementedError("TODO 1 : traduire chaque outil neutre au format OpenAI (aplati, strict=True, sans la clé fn)")


def normaliser_usage(u) -> dict:
    """Usage OpenAI → format neutre du lab : {input_non_cache, cache_lecture, cache_ecriture, output}.

    Attention : chez OpenAI, `input_tokens` INCLUT les tokens lus en cache (`input_tokens_details.cached_tokens`) ;
    chez Anthropic, `input_tokens` les EXCLUT (`cache_read_input_tokens` est à part).
    """
    # TODO 5 : extraire cached_tokens (attribut éventuellement absent) et le retrancher de input_tokens
    # INDICE : details = getattr(u, "input_tokens_details", None) ; cached = getattr(details, "cached_tokens", 0) or 0
    raise NotImplementedError("TODO 5 : extraire cached_tokens (attribut éventuellement absent) et le retrancher de input_tokens")


class FournisseurOpenAI:
    nom = "openai"

    def __init__(self, client=None, modele: str | None = None):
        self.client = client or creer_client()
        self.modele = modele or os.environ.get("OPENAI_MODEL", "gpt-6.1-sol")   # équivalent de Sonnet 5.5 (2 $/10 $)
        self.outils = traduire_outils()
        self.usages: list[dict] = []

    @staticmethod
    def message_utilisateur(texte: str) -> dict:
        return {"role": "user", "content": texte}

    def lire_flux(self, flux, afficher: Callable[[str], None]):
        """Parcourt les événements de streaming : affiche les deltas de texte, renvoie la réponse finale."""
        # TODO 2 : afficher chaque `response.output_text.delta` et récupérer la réponse de `response.completed`
        # INDICE : for ev in flux: if ev.type == "response.output_text.delta": afficher(ev.delta) ...
        # INDICE : lever RuntimeError("Flux interrompu") si aucun événement response.completed n'est arrivé
        raise NotImplementedError("TODO 2 : afficher chaque `response.output_text.delta` et récupérer la réponse de `response.completed`")

    def tour(self, historique: list, max_iterations: int = 6, afficher: Callable[[str], None] = lambda s: None) -> list:
        """Un tour de conversation : streame le texte, exécute les outils (appels parallèles), renvoie l'historique."""
        for _ in range(max_iterations):
            flux = self.client.responses.create(
                model=self.modele,
                instructions=SYSTEM_PROMPT,          # préfixe stable → mis en cache automatiquement par OpenAI
                input=historique,
                tools=self.outils,
                max_output_tokens=MAX_SORTIE,        # optionnel chez OpenAI… mais mettez-le
                stream=True,
            )
            reponse = self.lire_flux(flux, afficher)
            self.usages.append(normaliser_usage(reponse.usage))
            historique += reponse.output             # on conserve messages + function_call
            appels = [it for it in reponse.output if it.type == "function_call"]
            if not appels:
                return historique
            # TODO 3 : exécuter TOUS les appels (parallèles) et ajouter un item function_call_output par appel
            # INDICE : arguments est une CHAÎNE JSON : json.loads(ap.arguments)
            # INDICE : {"type": "function_call_output", "call_id": ap.call_id, "output": json.dumps(resultat, ensure_ascii=False)} — SANS rôle
            raise NotImplementedError("TODO 3 : exécuter TOUS les appels (parallèles) et ajouter un item function_call_output par appel")
        raise RuntimeError("Trop d'itérations d'outils")

    def generer_devis(self, historique: list) -> Devis:
        """Clôture : demande le devis structuré (Pydantic) à partir de la conversation, sans nouvel appel d'outil."""
        # TODO 4 : appeler client.responses.parse avec text_format=Devis et tool_choice="none", noter l'usage, renvoyer output_parsed
        # INDICE : input=historique + [{"role": "user", "content": "Produis maintenant le devis au format demandé."}]
        raise NotImplementedError("TODO 4 : appeler client.responses.parse avec text_format=Devis et tool_choice='none', noter l'usage, renvoyer output_parsed")
