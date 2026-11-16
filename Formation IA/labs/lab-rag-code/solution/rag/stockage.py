"""Stockage des morceaux : en mémoire (tests, démo) ou PostgreSQL + pgvector (production, docker compose).

Interface commune :
  empreintes() -> {id: empreinte}          upsert(morceaux)          supprimer(ids)
  vectoriel(vecteur, n, services) -> [(morceau, score)]     plein_texte(question, n, services) -> [(morceau, score)]
  vecteurs(ids) -> {id: vecteur}            compter() -> int
Un morceau est un dict : id, source, page, service, titre, contenu, empreinte, vecteur.
`services` = ensemble des services AUTORISÉS pour l'utilisateur (None = pas de document restreint).
"""
from __future__ import annotations

import math
from collections import Counter

from . import config
from .embeddings import cosinus
from .textes import jetons


def _autorise(m: dict, services: set[str] | None) -> bool:
    restreint = m["service"] in config.SERVICES_RESTREINTS
    return not restreint or (services is not None and m["service"] in services)


class StockageMemoire:
    def __init__(self):
        self.morceaux: dict[str, dict] = {}

    def compter(self) -> int:
        return len(self.morceaux)

    def empreintes(self) -> dict[str, str]:
        return {i: m["empreinte"] for i, m in self.morceaux.items()}

    def upsert(self, morceaux: list[dict]) -> None:
        for m in morceaux:
            self.morceaux[m["id"]] = m

    def supprimer(self, ids: list[str]) -> None:
        for i in ids:
            self.morceaux.pop(i, None)

    def vecteurs(self, ids: list[str]) -> dict[str, list[float]]:
        return {i: self.morceaux[i]["vecteur"] for i in ids if i in self.morceaux}

    def vectoriel(self, vecteur, n, services=None):
        res = [(m, cosinus(vecteur, m["vecteur"])) for m in self.morceaux.values() if _autorise(m, services)]
        return sorted(res, key=lambda x: -x[1])[:n]

    def plein_texte(self, question, n, services=None, k1=1.5, b=0.75):
        """BM25 : l'équivalent en mémoire de ts_rank sur la colonne tsvector de Postgres."""
        docs = [m for m in self.morceaux.values() if _autorise(m, services)]
        if not docs:
            return []
        tok = {m["id"]: jetons(m["titre"] + " " + m["contenu"]) for m in docs}
        moy = sum(len(t) for t in tok.values()) / len(docs)
        df = Counter(w for t in tok.values() for w in set(t))
        q = set(jetons(question))
        res = []
        for m in docs:
            tf, lg = Counter(tok[m["id"]]), len(tok[m["id"]])
            s = sum(math.log(1 + (len(docs) - df[w] + 0.5) / (df[w] + 0.5)) * tf[w] * (k1 + 1)
                    / (tf[w] + k1 * (1 - b + b * lg / moy)) for w in q if w in tf)
            if s > 0:
                res.append((m, s))
        return sorted(res, key=lambda x: -x[1])[:n]


class StockagePg:
    """PostgreSQL + pgvector (image pgvector/pgvector:pg17). Requiert `psycopg[binary]`. Schéma : schema.sql."""

    def __init__(self, dsn: str = config.PG_DSN):
        import psycopg                                   # dépendance optionnelle (mode docker compose)
        self.cx = psycopg.connect(dsn, autocommit=True)

    @staticmethod
    def _vec(v) -> str:
        return "[" + ",".join(f"{x:.6f}" for x in v) + "]"

    @staticmethod
    def _ligne(r) -> dict:
        return {"id": r[0], "source": r[1], "page": r[2], "service": r[3], "titre": r[4], "contenu": r[5], "empreinte": r[6]}

    def compter(self) -> int:
        return self.cx.execute("SELECT count(*) FROM morceaux").fetchone()[0]

    def empreintes(self):
        return dict(self.cx.execute("SELECT id, empreinte FROM morceaux").fetchall())

    def upsert(self, morceaux):
        with self.cx.cursor() as cur:
            for m in morceaux:
                cur.execute(
                    "INSERT INTO morceaux (id, source, page, service, titre, contenu, texte_normalise, empreinte, embedding) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s::vector) ON CONFLICT (id) DO UPDATE SET contenu = EXCLUDED.contenu, "
                    "texte_normalise = EXCLUDED.texte_normalise, empreinte = EXCLUDED.empreinte, "
                    "embedding = EXCLUDED.embedding, titre = EXCLUDED.titre, service = EXCLUDED.service",
                    (m["id"], m["source"], m["page"], m["service"], m["titre"], m["contenu"],
                     " ".join(jetons(m["titre"] + " " + m["contenu"])), m["empreinte"], self._vec(m["vecteur"])))

    def supprimer(self, ids):
        if ids:
            self.cx.execute("DELETE FROM morceaux WHERE id = ANY(%s)", (list(ids),))

    def vecteurs(self, ids):
        rows = self.cx.execute("SELECT id, embedding::text FROM morceaux WHERE id = ANY(%s)", (list(ids),)).fetchall()
        return {i: [float(x) for x in t.strip("[]").split(",")] for i, t in rows}

    def _filtre(self, services):
        autorises = sorted(services or [])
        return ("(service <> ALL(%s) OR service = ANY(%s))", [list(config.SERVICES_RESTREINTS), autorises])

    def vectoriel(self, vecteur, n, services=None):
        f, p = self._filtre(services)
        rows = self.cx.execute(
            f"SELECT id, source, page, service, titre, contenu, empreinte, 1 - (embedding <=> %s::vector) AS score "
            f"FROM morceaux WHERE {f} ORDER BY embedding <=> %s::vector LIMIT %s",
            [self._vec(vecteur), *p, self._vec(vecteur), n]).fetchall()
        return [(self._ligne(r), float(r[7])) for r in rows]

    def plein_texte(self, question, n, services=None):
        mots = [w for w in jetons(question) if w.isalnum()]
        if not mots:
            return []
        f, p = self._filtre(services)
        requete = " | ".join(mots)        # OU logique ; mêmes jetons que texte_normalise (plainto_tsquery, en ET, serait trop strict)
        rows = self.cx.execute(
            f"SELECT id, source, page, service, titre, contenu, empreinte, ts_rank_cd(tsv, q) AS score "
            f"FROM morceaux, to_tsquery('simple', %s) q WHERE tsv @@ q AND {f} ORDER BY score DESC LIMIT %s",
            [requete, *p, n]).fetchall()
        return [(self._ligne(r), float(r[7])) for r in rows]


def creer_stockage():
    return StockagePg() if config.BACKEND == "pgvector" else StockageMemoire()
