"""Embeddings locaux : rien ne quitte le serveur pour l'indexation (décision d'architecture de L094).

- EmbeddeurHash : hors ligne, déterministe, sans téléchargement (mots + bigrammes hachés). Suffisant pour les tests
  et pour comprendre le pipeline ; pas pour la production (aucune compréhension des synonymes).
- EmbeddeurST   : sentence-transformers (modèle ouvert local, voir LOCAL_EMBEDDING_MODEL) — installez
  `sentence-transformers` et recalibrez RAG_SEUIL (les scores n'ont pas la même échelle).
"""
from __future__ import annotations

import hashlib
import math

from . import config
from .textes import jetons


class EmbeddeurHash:
    nom = "hash"

    def __init__(self, dimension: int = config.DIMENSION):
        self.dimension = dimension

    def _vecteur(self, texte: str) -> list[float]:
        v = [0.0] * self.dimension
        mots = jetons(texte)
        traits = mots + [f"{a}_{b}" for a, b in zip(mots, mots[1:])]
        for t in traits:
            h = int(hashlib.md5(t.encode()).hexdigest(), 16)
            v[h % self.dimension] += 1.0 if (h >> 64) % 2 else -1.0
        n = math.sqrt(sum(x * x for x in v)) or 1.0
        return [x / n for x in v]

    def encoder(self, textes: list[str]) -> list[list[float]]:
        return [self._vecteur(t) for t in textes]


class EmbeddeurST:
    nom = "sentence-transformers"

    def __init__(self, modele: str = config.LOCAL_EMBEDDING_MODEL):
        from sentence_transformers import SentenceTransformer     # dépendance optionnelle
        self.modele = SentenceTransformer(modele)
        self.dimension = self.modele.get_sentence_embedding_dimension()

    def encoder(self, textes: list[str]) -> list[list[float]]:
        return [list(map(float, v)) for v in self.modele.encode(textes, normalize_embeddings=True)]


def creer_embeddeur():
    return EmbeddeurST() if config.EMBEDDINGS == "sentence-transformers" else EmbeddeurHash()


def cosinus(a: list[float], b: list[float]) -> float:
    return sum(x * y for x, y in zip(a, b))          # vecteurs déjà normalisés
