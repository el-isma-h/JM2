"""Tests du RAG en mode simulé (stockage mémoire, embeddings hash, faux client à citations) : 100 % hors ligne."""
import json

from rag import config
from rag.evaluer import evaluer
from rag.generation import REFUS, FauxClaudeCitations, construire_message
from rag.ingestion import decouper, ingerer_dossier
from rag.recherche import filtrer, rrf
from rag.api import cle_cache, services_autorises
from rag.embeddings import EmbeddeurHash
from rag.stockage import StockageMemoire

TEXTE = "\n\n".join(f"Paragraphe {i}. " + "Le chariot élévateur est contrôlé avant chaque prise de poste. " * 6 for i in range(6))


# ---------- TODO 1 : découpage ----------
def test_decoupage_respecte_taille_et_chevauchement():
    morceaux = decouper(TEXTE, taille=400, chevauchement=60)
    assert len(morceaux) > 3 and all(m.strip() for m in morceaux)
    assert all(len(m) <= 400 + 60 for m in morceaux)
    assert morceaux[1].split()[0] in morceaux[0]                 # le 2e morceau reprend la fin du 1er
    assert decouper("Court.", taille=400, chevauchement=60) == ["Court."]


# ---------- TODO 2 : ingestion idempotente ----------
def test_ingestion_incrementale_et_idempotente(tmp_path):
    (tmp_path / "a.md").write_text("---\ntitre: A\nservice: RH\n---\n<!-- page 1 -->\nTexte A.\n<!-- page 2 -->\nSuite A.", encoding="utf-8")
    (tmp_path / "b.md").write_text("---\ntitre: B\nservice: RH\n---\n<!-- page 1 -->\nTexte B.", encoding="utf-8")
    st, emb = StockageMemoire(), EmbeddeurHash()
    assert ingerer_dossier(st, emb, tmp_path) == {"ajoutes": 3, "inchanges": 0, "supprimes": 0}
    assert ingerer_dossier(st, emb, tmp_path) == {"ajoutes": 0, "inchanges": 3, "supprimes": 0}
    (tmp_path / "b.md").unlink()
    (tmp_path / "a.md").write_text("---\ntitre: A\nservice: RH\n---\n<!-- page 1 -->\nTexte A modifié.\n<!-- page 2 -->\nSuite A.", encoding="utf-8")
    assert ingerer_dossier(st, emb, tmp_path) == {"ajoutes": 1, "inchanges": 1, "supprimes": 1}


# ---------- TODO 3 et 4 : fusion et seuil ----------
def test_rrf():
    fusion = rrf([["a", "b", "c"], ["b", "d"]], k=60)
    assert [i for i, _ in fusion][:2] == ["b", "a"]
    assert abs(dict(fusion)["b"] - (1 / 62 + 1 / 61)) < 1e-12


def test_filtrer_par_seuil():
    cands = [{"id": i, "pertinence": p} for i, p in [("a", 0.5), ("b", 0.05), ("c", 0.3), ("d", 0.2)]]
    assert [c["id"] for c in filtrer(cands, seuil=0.15, k=2)] == ["a", "c"]
    assert filtrer(cands, seuil=0.9) == []


# ---------- TODO 5 : citations ----------
def test_construire_message_un_document_par_extrait():
    ex = [{"source": "teletravail.md", "page": 1, "service": "Ressources humaines", "contenu": "2 jours maximum."},
          {"source": "conges-et-absences.md", "page": 2, "service": "Ressources humaines", "contenu": "2 mois avant."}]
    blocs = construire_message("Télétravail ?", ex)
    docs = [b for b in blocs if b["type"] == "document"]
    assert len(docs) == 2 and blocs[-1] == {"type": "text", "text": "Question : Télétravail ?"}
    assert docs[0]["title"] == "teletravail.md — page 1" and docs[0]["citations"] == {"enabled": True}
    assert docs[1]["source"] == {"type": "content", "content": [{"type": "text", "text": "2 mois avant."}]}


# ---------- TODO 6 : cache ----------
def test_cle_cache_normalisee_et_cloisonnee():
    assert cle_cache("Notes de frais ?") == cle_cache("  notes   DE frais")
    assert cle_cache("Calendrier de paie", {"Paie"}) != cle_cache("Calendrier de paie", None)


def test_api_ask_cite_et_met_en_cache(client_api):
    tc, faux = client_api
    r1 = tc.post("/ask", json={"question": "Quel est le plafond de remboursement d'un repas au restaurant ?"}).json()
    assert r1["citations"][0]["source"] == "notes-de-frais-v3.md" and r1["citations"][0]["page"] == 1
    assert "21" in r1["reponse"] and r1["depuis_cache"] is False
    r2 = tc.post("/ask", json={"question": "quel est le plafond de remboursement d'un repas au restaurant"}).json()
    assert r2["depuis_cache"] is True and faux.appels == 1          # pas de second appel au modèle


# ---------- TODO 7 : contrôle d'accès côté serveur ----------
def test_services_autorises_depuis_l_identite():
    assert services_autorises("c.durand") == {"Paie"} and services_autorises("a.leroy") == {"Paie"}
    assert services_autorises("j.martin") is None and services_autorises(None) is None


def test_document_restreint_invisible_pour_la_logistique(client_api):
    tc, _ = client_api
    q = {"question": "À quelle date le virement des salaires est-il effectué ?"}
    refuse = tc.post("/ask", json=q, headers={"X-Utilisateur": "j.martin"}).json()
    assert refuse["reponse"] == REFUS and refuse["citations"] == []
    autorise = tc.post("/ask", json=q, headers={"X-Utilisateur": "c.durand"}).json()
    assert autorise["citations"][0]["source"] == "paie-calendrier.md"


# ---------- API : validation, flux, santé ----------
def test_question_trop_longue_refusee(client_api):
    tc, _ = client_api
    assert tc.post("/ask", json={"question": "x" * 501}).status_code == 422


def test_hors_perimetre_sans_appel_modele(client_api):
    tc, faux = client_api
    r = tc.post("/ask", json={"question": "Quel temps fera-t-il demain à Lyon ?"}).json()
    assert r["reponse"] == REFUS and faux.appels == 0


def test_stream_sse(client_api):
    tc, _ = client_api
    corps = tc.post("/ask/stream", json={"question": "Combien de jours de télétravail par semaine sont autorisés ?"}).text
    evenements = [json.loads(l[6:]) for l in corps.splitlines() if l.startswith("data: {")]
    assert any("texte" in e for e in evenements) and evenements[-1]["citations"][0]["source"] == "teletravail.md"
    assert corps.strip().endswith("data: [DONE]")


def test_health(client_api):
    tc, _ = client_api
    h = tc.get("/health").json()
    assert h["ok"] and h["morceaux"] > 0 and h["simulation"] is True


# ---------- Évaluation complète (grille section 7 : qualité mesurée) ----------
def test_evaluation_tests_jsonl(base):
    bilan = evaluer(stockage=base[0], embeddeur=base[1], client=FauxClaudeCitations(), verbeux=False)
    assert bilan["hit_rate_5"] >= 0.85 and bilan["refus"] == 1.0 and bilan["citations"] >= 0.85, bilan
