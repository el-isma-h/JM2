"""Rédaction du rapport : le modèle reçoit les chiffres DÉJÀ calculés et formatés, il ne fait que les mettre en phrases.

Deux rédacteurs :
- FauxRedacteur : mode sans clé, déterministe, avec des « pannes » volontaires pour tester le contrôle ;
- RedacteurClaude : mode réel (SDK anthropic, ANTHROPIC_API_KEY dans l'environnement).
"""
from __future__ import annotations

import json
import os
import re

MODELE = os.environ.get("REPORTING_MODELE", "claude-haiku-5-5")   # suffisant pour de la rédaction (nov. 2026)

PROMPT = """Tu es l'assistant du directeur commercial de Mobidesk. Rédige le rapport hebdomadaire
à partir du JSON ci-dessous, dont tous les chiffres sont déjà calculés et formatés.
RÈGLES : recopie les chiffres tels quels, sans calcul ni estimation ; si variation_pct est null,
écris « pas de semaine de référence » ; si avoirs_semaine > 0, mentionne-le dans les points d'attention ;
si alerte n'est pas null, réponds uniquement « Rapport non généré : » suivi de l'alerte ;
aucune information externe ; 120 mots maximum.
FORMAT : ligne 1 « Objet : Mobidesk — ventes semaine du {debut} au {fin} », puis
1. Chiffre de la semaine  2. Faits marquants  3. Points d'attention.
JSON :
"""

PANNES = ("faute_de_frappe", "arrondi", "invente", "signe")


def _permuter(montant: str) -> str:
    """« 1 078,20 € » → « 1 087,20 € » : inverse les deux derniers chiffres de la partie entière."""
    entier, reste = montant.split(",", 1)
    chiffres = [i for i, c in enumerate(entier) if c.isdigit()]
    if len(chiffres) < 2:
        return montant
    a, b = chiffres[-2], chiffres[-1]
    if entier[a] == entier[b]:
        a = chiffres[-3] if len(chiffres) >= 3 else a
    s = list(entier)
    s[a], s[b] = s[b], s[a]
    return "".join(s) + "," + reste


class FauxRedacteur:
    """Rédige comme un modèle obéissant. `panne` simule les erreurs typiques d'un vrai modèle :
    faute_de_frappe (1 078,20 → 1 087,20), arrondi (« environ 1 100 € »), invente (montant absent du JSON),
    signe (variation recopiée avec le mauvais signe)."""

    def __init__(self, panne: str | None = None):
        if panne is not None and panne not in PANNES:
            raise ValueError(f"panne inconnue : {panne} (choix : {', '.join(PANNES)})")
        self.panne = panne
        self.prompts: list[str] = []

    def rediger(self, kpi: dict) -> str:
        self.prompts.append(PROMPT + json.dumps(kpi, ensure_ascii=False, indent=2))
        if kpi.get("alerte"):
            return f"Rapport non généré : {kpi['alerte']}"
        p = kpi["periode"]
        ca = kpi["ca_semaine"]
        variation = kpi["variation_pct"]
        if self.panne == "faute_de_frappe":
            ca = _permuter(ca)
        elif self.panne == "arrondi":
            valeur = float(re.sub(r"[^\d,−-]", "", ca).replace(",", ".").replace("−", "-"))
            ca = f"environ {round(valeur, -2):,.0f} €".replace(",", " ")
        elif self.panne == "signe" and variation:
            variation = variation.replace("−", "+") if "−" in variation else variation.replace("+", "−")
        comparaison = f"({variation})" if variation else "(pas de semaine de référence)"
        com, prod = kpi["top_commerciaux"][0], kpi["top_produits"][0]
        attention = (f"{kpi['avoirs_semaine']} avoir(s) cette semaine." if kpi["avoirs_semaine"]
                     else "aucun avoir cette semaine.")
        if ca.startswith("-") or ca.startswith("−"):
            attention += " Chiffre d'affaires de la semaine négatif."
        lignes = [
            f"Objet : Mobidesk — ventes semaine du {p['debut']} au {p['fin']}",
            f"1. Chiffre de la semaine : CA {ca}, contre {kpi['ca_semaine_precedente']} la semaine précédente "
            f"{comparaison}. Cumul du semestre : {kpi['cumul_semestre']}.",
            f"2. Faits marquants : {com['nom']} en tête ({com['ca']}) ; produit en tête : {prod['nom']} ({prod['ca']}).",
            f"3. Points d'attention : {attention}",
        ]
        if self.panne == "invente":
            lignes.append("Objectif mensuel atteint à 4 250,00 €.")
        return "\n".join(lignes)


class RedacteurClaude:
    """Mode réel. Ne passe PAS de temperature : avec la version d'API 2026-10-21 (SDK v2), elle renvoie 400."""

    def __init__(self, modele: str = MODELE):
        from anthropic import Anthropic   # import tardif : le mode simulé n'a pas besoin du SDK
        self.client = Anthropic()          # lit ANTHROPIC_API_KEY dans l'environnement
        self.modele = modele
        self.usage = None

    def rediger(self, kpi: dict) -> str:
        reponse = self.client.messages.create(
            model=self.modele, max_tokens=600,
            messages=[{"role": "user", "content": PROMPT + json.dumps(kpi, ensure_ascii=False, indent=2)}],
        )
        self.usage = reponse.usage
        return "".join(bloc.text for bloc in reponse.content if bloc.type == "text")


def mode() -> str:
    """LAB_MODE=simulation|reel ; vide : réel si une clé est présente, simulé sinon."""
    choix = os.environ.get("LAB_MODE", "").strip().lower()
    if choix in ("simulation", "reel"):
        return choix
    return "reel" if os.environ.get("ANTHROPIC_API_KEY") else "simulation"


def choisir_redacteur(panne: str | None = None):
    return RedacteurClaude() if mode() == "reel" else FauxRedacteur(panne)
