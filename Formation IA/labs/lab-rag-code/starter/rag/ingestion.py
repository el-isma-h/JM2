"""Ingestion (L090) : lecture des procédures → pages → morceaux → embeddings locaux → stockage.

Format des procédures du lab : Markdown avec un en-tête (titre, reference, service) et des marqueurs
`<!-- page N -->` qui jouent le rôle des pages d'un PDF (en production : extraction PDF/DOCX/HTML).
python -m rag.ingestion            # ingère DOCS_DIR dans le stockage configuré (RAG_BACKEND)
"""
from __future__ import annotations

import hashlib
import re
from pathlib import Path

from . import config


def lire_procedure(chemin: Path) -> list[dict]:
    """Renvoie une liste de pages {source, page, titre, reference, service, texte}."""
    brut = chemin.read_text(encoding="utf-8")
    meta = {}
    if brut.startswith("---"):
        entete, brut = brut[3:].split("---", 1)
        meta = dict(l.split(":", 1) for l in entete.strip().splitlines() if ":" in l)
        meta = {k.strip(): v.strip() for k, v in meta.items()}
    pages = []
    for m in re.finditer(r"<!--\s*page\s+(\d+)\s*-->(.*?)(?=<!--\s*page\s+\d+\s*-->|\Z)", brut, flags=re.S):
        texte = m.group(2).strip()
        if texte:
            pages.append({"source": chemin.name, "page": int(m.group(1)), "titre": meta.get("titre", chemin.stem),
                          "reference": meta.get("reference", ""), "service": meta.get("service", "n.c."), "texte": texte})
    return pages


def decouper(texte: str, taille: int = config.TAILLE_MORCEAU, chevauchement: int = config.CHEVAUCHEMENT) -> list[str]:
    """Découpe un texte en morceaux d'au plus `taille` caractères, en respectant les paragraphes.

    Règles : (1) on accumule des paragraphes (séparés par une ligne vide) tant que la taille n'est pas dépassée ;
    (2) un paragraphe plus long que `taille` est coupé aux phrases, puis aux mots si nécessaire ;
    (3) chaque morceau, sauf le premier, commence par les `chevauchement` derniers caractères du précédent,
        recalés sur un début de mot ; (4) aucun morceau vide ; (5) aucun morceau ne dépasse taille + chevauchement.
    """
    # TODO 1 : écrire le découpage (paragraphes → phrases → mots) puis ajouter le chevauchement
    # INDICE : paragraphes = [p.strip() for p in re.split(r"\n\s*\n", texte) if p.strip()]
    # INDICE : phrases = re.split(r"(?<=[.!?])\s+", paragraphe) ; recaler le chevauchement : queue[queue.find(" ") + 1:]
    raise NotImplementedError("TODO 1 : écrire le découpage (paragraphes → phrases → mots) puis ajouter le chevauchement")


def empreinte(texte: str) -> str:
    return hashlib.sha256(texte.encode("utf-8")).hexdigest()[:16]


def preparer_morceaux(dossier: Path = config.DOCS_DIR) -> list[dict]:
    morceaux = []
    for chemin in sorted(Path(dossier).glob("*.md")):
        for page in lire_procedure(chemin):
            for i, contenu in enumerate(decouper(page["texte"])):
                morceaux.append({"id": f"{page['source']}#p{page['page']}#{i}", "source": page["source"], "page": page["page"],
                                 "service": page["service"], "titre": f"{page['titre']} ({page['reference']})".strip(),
                                 "contenu": contenu, "empreinte": empreinte(page["service"] + contenu)})
    return morceaux


def ingerer_dossier(stockage, embeddeur, dossier: Path = config.DOCS_DIR) -> dict:
    """Ingestion INCRÉMENTALE et IDEMPOTENTE : une seconde exécution sans changement ne modifie rien.

    - morceau nouveau ou dont l'empreinte a changé → vectorisé et enregistré (upsert) ;
    - morceau inchangé → ignoré (pas de recalcul d'embedding) ;
    - morceau disparu du dossier → supprimé du stockage.
    Renvoie {"ajoutes": n, "inchanges": n, "supprimes": n}.
    """
    morceaux = preparer_morceaux(dossier)
    # TODO 2 : comparer aux empreintes déjà stockées, ne vectoriser que les nouveaux/modifiés, supprimer les disparus
    # INDICE : existants = stockage.empreintes() ; a_traiter = [m for m in morceaux if existants.get(m["id"]) != m["empreinte"]]
    # INDICE : vecteurs = embeddeur.encoder([m["titre"] + "\n" + m["contenu"] for m in a_traiter])
    raise NotImplementedError("TODO 2 : comparer aux empreintes déjà stockées, ne vectoriser que les nouveaux/modifiés, supprimer les disparus")


if __name__ == "__main__":
    from .embeddings import creer_embeddeur
    from .stockage import creer_stockage
    st = creer_stockage()
    stats = ingerer_dossier(st, creer_embeddeur())
    print(f"Ingestion de {config.DOCS_DIR} → {stats} · {st.compter()} morceaux en base ({config.BACKEND})")
    # En production : vider aussi le cache de réponses quand un document change (voir api.vider_cache).
