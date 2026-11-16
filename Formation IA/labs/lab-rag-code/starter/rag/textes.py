"""Outils de texte partagés : normalisation, mots vides, jetons (embeddings hash et BM25)."""
from __future__ import annotations

import re
import unicodedata

MOTS_VIDES = set("""a au aux avec ce ces cette dans de des du elle en est et être il ils je la le les leur lui ma mais me
même mes moi mon ne nos notre nous on ou où par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une vos
votre vous y d l j s n c t m qu est-ce quel quelle quels quelles combien comment quand faut il-faut peut on-peut doit sont
ont été fait faire après avant plus moins tout tous toute toutes chaque ainsi aussi selon lors entre sans sous chez
dit si suis ai as avez avons sommes etes peux puis veux dois sais quoi""".split())


def sans_accents(t: str) -> str:
    return unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()


def jetons(t: str) -> list[str]:
    """Mots normalisés, sans mots vides, avec une racinisation minimale (pluriels)."""
    sortie = []
    for m in re.findall(r"[a-z0-9]+", sans_accents(t)):
        if m in MOTS_VIDES or (len(m) < 2 and not m.isdigit()):
            continue
        if len(m) > 3 and m[-1] in "sx" and not m.isdigit():
            m = m[:-1]
        sortie.append(m)
    return sortie


def correspond(a: str, b: str) -> bool:
    """Deux jetons « se correspondent » s'ils sont égaux ou partagent un préfixe de 5 lettres (malade / maladie)."""
    return a == b or (len(a) >= 5 and len(b) >= 5 and a[:5] == b[:5])


def couverture(question: str, texte: str) -> float:
    """Part des mots de la question retrouvés dans le texte (0 à 1) : un « reranker » lexical, remplaçable par un
    cross-encoder (L092). C'est ce score, interprétable, qui sert au seuil de refus."""
    q = set(jetons(question))
    if not q:
        return 0.0
    t = set(jetons(texte))
    return sum(1 for w in q if any(correspond(w, x) for x in t)) / len(q)
