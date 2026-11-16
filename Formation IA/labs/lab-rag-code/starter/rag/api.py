"""API FastAPI (L094, section 4) : /ask, /ask/stream (SSE), /health — cache exact, journal, contrôle d'accès.

uvicorn rag.api:app --port 8080
L'identité vient de l'en-tête X-Utilisateur, qui SIMULE le SSO de l'intranet : en production, elle est posée par
le proxy d'authentification, jamais saisie par le navigateur.
"""
from __future__ import annotations

import hashlib
import json
import re
import sqlite3
import time

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import config
from .embeddings import creer_embeddeur
from .generation import REFUS, SYSTEM, construire_message, creer_client, repondre
from .ingestion import ingerer_dossier
from .recherche import rechercher
from .stockage import creer_stockage


class Question(BaseModel):
    question: str = Field(min_length=3, max_length=500)    # un prompt de 50 000 caractères n'est pas une question


def cle_cache(question: str, services: set[str] | None = None) -> str:
    """Clé du cache exact : question normalisée (minuscules, sans ponctuation, espaces réduits) + droits d'accès.

    « Notes de frais ? » et « notes   de frais » donnent la même clé ; deux utilisateurs aux droits différents
    n'obtiennent JAMAIS la même entrée de cache (sinon le cache contournerait le contrôle d'accès).
    """
    # TODO 6 : normaliser la question, y ajouter les services autorisés triés, puis hacher (sha256)
    # INDICE : re.sub(r"[^\w\s]", "", q.lower()) puis re.sub(r"\s+", " ", ...).strip()
    raise NotImplementedError("TODO 6 : normaliser la question, y ajouter les services autorisés triés, puis hacher (sha256)")


def services_autorises(utilisateur: str | None) -> set[str] | None:
    """Services dont l'utilisateur peut lire les documents RESTREINTS, déduits de son identité (annuaire).

    Utilisateur inconnu ou anonyme → None (aucun document restreint). Jamais d'après un champ du corps de la requête.
    """
    # TODO 7 : chercher le service de l'utilisateur dans config.ANNUAIRE et renvoyer les services restreints qu'il peut lire
    # INDICE : {s for s, autorises in config.SERVICES_RESTREINTS.items() if service in autorises}
    raise NotImplementedError("TODO 7 : chercher le service de l'utilisateur dans config.ANNUAIRE et renvoyer les services restreints qu'il peut lire")


def creer_app(stockage=None, embeddeur=None, client=None, cache_db: str = config.CACHE_DB, ingerer: bool = True) -> FastAPI:
    app = FastAPI(title="Assistant documentaire Bréval Matériaux", version="1.0")
    stockage = stockage or creer_stockage()
    embeddeur = embeddeur or creer_embeddeur()
    client = client or creer_client()
    if ingerer and stockage.compter() == 0:          # mémoire : ingestion au démarrage ; pgvector : service `ingestion`
        ingerer_dossier(stockage, embeddeur)
    db = sqlite3.connect(cache_db, check_same_thread=False)
    db.execute("CREATE TABLE IF NOT EXISTS cache (cle TEXT PRIMARY KEY, reponse TEXT, cree REAL)")
    db.execute("CREATE TABLE IF NOT EXISTS journal (ts REAL, question TEXT, sources TEXT, input_tokens INT, "
               "output_tokens INT, cache_read INT, ms INT, depuis_cache INT)")
    app.state.db, app.state.client = db, client

    def journaliser(question: str, res: dict, depuis_cache: bool) -> None:
        u = res.get("usage") or {}
        db.execute("INSERT INTO journal VALUES (?,?,?,?,?,?,?,?)",
                   (time.time(), question[:200], json.dumps([c["source"] for c in res["citations"]]),
                    u.get("input", 0), u.get("output", 0), u.get("cache_read", 0), res["ms"], int(depuis_cache)))
        db.commit()

    @app.post("/ask")
    def ask(q: Question, x_utilisateur: str | None = Header(default=None)) -> dict:
        services = services_autorises(x_utilisateur)
        cle = cle_cache(q.question, services)
        row = db.execute("SELECT reponse, cree FROM cache WHERE cle = ?", (cle,)).fetchone()
        if row and time.time() - row[1] < config.CACHE_TTL:
            res = json.loads(row[0]); journaliser(q.question, res, True)
            return {**res, "depuis_cache": True}
        res = repondre(q.question, rechercher(q.question, stockage, embeddeur, services), client)
        if res["citations"]:                                     # on ne met en cache que les réponses sourcées
            db.execute("INSERT OR REPLACE INTO cache VALUES (?,?,?)", (cle, json.dumps(res, ensure_ascii=False), time.time()))
        journaliser(q.question, res, False)
        return {**res, "depuis_cache": False}

    @app.post("/ask/stream")
    def ask_stream(q: Question, x_utilisateur: str | None = Header(default=None)) -> StreamingResponse:
        """Server-Sent Events : le texte arrive par fragments, les citations à la fin."""
        extraits = rechercher(q.question, stockage, embeddeur, services_autorises(x_utilisateur))
        if not extraits:
            raise HTTPException(status_code=404, detail=REFUS)

        def generer():
            citations = []
            with client.messages.stream(model=config.MODELE, max_tokens=700,
                                        system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
                                        messages=[{"role": "user", "content": construire_message(q.question, extraits)}]) as flux:
                for ev in flux:
                    if ev.type == "content_block_delta" and ev.delta.type == "text_delta":
                        yield f"data: {json.dumps({'texte': ev.delta.text}, ensure_ascii=False)}\n\n"
                    elif ev.type == "content_block_delta" and ev.delta.type == "citations_delta":
                        e = extraits[ev.delta.citation.document_index]
                        citations.append({"source": e["source"], "page": e["page"], "extrait": ev.delta.citation.cited_text.strip()})
            yield f"data: {json.dumps({'citations': citations}, ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(generer(), media_type="text/event-stream")

    @app.get("/health")
    def health() -> dict:
        return {"ok": True, "modele": config.MODELE, "k": config.K, "backend": config.BACKEND,
                "morceaux": stockage.compter(), "simulation": config.mode_simulation()}

    return app


def vider_cache(cache_db: str = config.CACHE_DB) -> None:
    """À appeler à la fin de l'ingestion nocturne dès qu'un document a changé."""
    with sqlite3.connect(cache_db) as db:
        db.execute("DELETE FROM cache")


def __getattr__(nom: str):
    """`uvicorn rag.api:app` : l'application n'est construite qu'à la première demande (tests sans effet de bord)."""
    if nom == "app":
        globals()["app"] = creer_app()
        return globals()["app"]
    raise AttributeError(nom)
