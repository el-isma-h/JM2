"""Recherche hybride (L089, L092) : vectoriel + plein texte, fusion RRF, score de pertinence et seuil de refus.

Le seuil s'applique à la `pertinence` (couverture lexicale de la question par le morceau, voir textes.couverture) :
si aucun extrait ne l'atteint, on NE consulte PAS le modèle (zéro coût, zéro hallucination, refus explicite). Extension proposée : un cross-encoder de reranking
(L092) qui remplace cette pertinence lexicale (le cosinus est conservé à titre indicatif).
"""
from __future__ import annotations

from . import config
from .embeddings import cosinus
from .textes import couverture


def rrf(classements: list[list[str]], k: int = 60) -> list[tuple[str, float]]:
    """Reciprocal Rank Fusion : score(d) = Σ 1 / (k + rang(d)), rang commençant à 1.

    `classements` : listes d'identifiants, du plus pertinent au moins pertinent.
    Renvoie [(id, score)] trié par score décroissant ; à égalité, l'ordre de première apparition est conservé.
    """
    scores: dict[str, float] = {}
    for liste in classements:
        for rang, ident in enumerate(liste, start=1):
            scores[ident] = scores.get(ident, 0.0) + 1.0 / (k + rang)
    return sorted(scores.items(), key=lambda x: -x[1])


def filtrer(candidats: list[dict], seuil: float = config.SEUIL, k: int = config.K) -> list[dict]:
    """Garde au plus k extraits dont la pertinence atteint le seuil, dans l'ordre de la fusion."""
    return [c for c in candidats if c["pertinence"] >= seuil][:k]


def rechercher(question: str, stockage, embeddeur, services: set[str] | None = None,
               k: int = config.K, n_candidats: int = config.N_CANDIDATS, seuil: float = config.SEUIL) -> list[dict]:
    """Renvoie les extraits retenus : [{id, source, page, service, titre, contenu, rrf, cosinus, pertinence}]."""
    qv = embeddeur.encoder([question])[0]
    vect = stockage.vectoriel(qv, n_candidats, services)
    texte = stockage.plein_texte(question, n_candidats, services)
    par_id = {m["id"]: m for m, _ in vect + texte}
    fusion = rrf([[m["id"] for m, _ in vect], [m["id"] for m, _ in texte]])
    vecteurs = stockage.vecteurs([i for i, _ in fusion])
    candidats = [{**{c: par_id[i][c] for c in ("id", "source", "page", "service", "titre", "contenu")},
                  "rrf": round(s, 5), "cosinus": round(cosinus(qv, vecteurs[i]), 4),
                  "pertinence": round(couverture(question, par_id[i]["titre"] + " " + par_id[i]["contenu"]), 3)}
                 for i, s in fusion if i in vecteurs]
    return filtrer(candidats, seuil=seuil, k=k)
