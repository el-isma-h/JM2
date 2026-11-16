"""Tests de l'agent de veille en mode simulé : traçabilité, budget, injection, bascule, boucle de relecture."""
import json
from pathlib import Path

import pytest

from veille.agent import (BudgetDepasse, Clients, Compteur, Dossier, Preuve, Resultat, bibliographie, controler,
                          executer, filtrer_preuves, normaliser, PLAN_NOTE)
from veille.audit import auditer
from veille.simulation import FauxClaude, FauxMoteur

SUJET = "Facturation électronique obligatoire : ce que doit préparer une PME du BTP"


def preuve(i, url):
    return Preuve(id=f"S{i}", affirmation=f"Fait {i}.", url=url, titre_source=f"Titre {i}", date_publication=None, fiabilite="presse")


def lire(sortie: Path):
    return (sortie / "note.md").read_text(encoding="utf-8"), json.loads((sortie / "journal.json").read_text(encoding="utf-8"))


# ---------- TODO 1 : compteur et plafond ----------
def test_compteur_calcule_et_plafonne():
    cpt = Compteur(plafond_usd=0.05)
    cpt.ajouter("planification", "claude-sonnet-5-5", 1500, 600)                 # 0,003 + 0,006 = 0,009 $
    assert cpt.total == pytest.approx(0.009) and cpt.journal[0]["etape"] == "planification"
    cpt.ajouter("recherche", "grok-4.7", 5000, 1000, recherches=2, fournisseur="grok")   # 0,016 + 0,010 = 0,026 $
    assert cpt.postes["recherche"] == pytest.approx(0.026)
    with pytest.raises(BudgetDepasse):
        cpt.ajouter("synthese", "claude-sonnet-5-5", 15000, 3000)                # + 0,06 $ → dépassement


# ---------- TODO 2 et 3 : filtre d'URL ----------
def test_normaliser():
    assert normaliser("https://www.Presse-BTP.test/article/") == normaliser("http://presse-btp.test/article")


def test_filtre_rejette_url_inventee_et_injectee():
    res = [Resultat("q", "perplexity", "…", [{"url": "https://a.test/page", "titre": "A"}])]
    d = Dossier(preuves=[preuve(1, "https://www.a.test/page/"), preuve(2, "https://exemple-malveillant.test"),
                         preuve(3, "https://a.test/page-2025")], contradictions=[], lacunes=[])
    filtre, rejetees = filtrer_preuves(d, res)
    assert rejetees == 2 and [p.url for p in filtre.preuves] == ["https://www.a.test/page/"] and filtre.preuves[0].id == "S1"


# ---------- TODO 4 : contrôles déterministes ----------
def test_controler_detecte_les_defauts():
    d = Dossier(preuves=[preuve(1, "https://a.test")], contradictions=[], lacunes=[])
    bon = "\n\n".join([PLAN_NOTE] + ["Une phrase courte [S1]."] * 3)
    assert controler(bon, d, mots=len(bon.split())) == []
    mauvais = "## Contexte\n\nVoir https://a.test et [S9].\n\n" + "mot " * 50
    problemes = " | ".join(controler(mauvais, d, mots=20))
    for attendu in ("S9", "URL", "Longueur", "sans aucune référence", "Section manquante"):
        assert attendu in problemes


# ---------- TODO 5 : bibliographie générée par le code ----------
def test_bibliographie_seulement_les_preuves_citees():
    d = Dossier(preuves=[preuve(1, "https://a.test/1"), preuve(2, "https://a.test/2")], contradictions=[], lacunes=[])
    b = bibliographie("Texte qui cite [S2] seulement.", d)
    assert "## Sources" in b and "https://a.test/2" in b and "https://a.test/1" not in b


# ---------- TODO 6 : bascule de moteur ----------
def test_bascule_quand_perplexity_tombe():
    pplx = FauxMoteur("perplexity", panne=True)
    sortie = executer(SUJET, mots=300, clients=Clients(FauxClaude(), pplx, FauxMoteur("grok")))
    _, journal = lire(sortie)
    assert pplx.appels == 6                          # 2 sous-questions × 3 essais, puis bascule
    assert journal["statut"] == "brouillon" and not journal["echecs_recherche"]
    assert all(a["modele"] == "grok-4.7" for a in journal["appels"] if a["etape"] == "recherche")


def test_aucun_moteur_disponible():
    sortie = executer(SUJET, mots=300, clients=Clients(FauxClaude(), None, FauxMoteur("grok", panne=True)))
    _, journal = lire(sortie)
    assert journal["statut"] == "interrompu" and "Aucun résultat" in journal["erreur"]
    assert any("aucun moteur disponible" in e for e in journal["echecs_recherche"])


# ---------- Bout en bout (grille de la section 8) ----------
def test_execution_complete_brouillon_tracable():
    sortie = executer(SUJET, mots=300, clients=Clients(FauxClaude(), FauxMoteur("perplexity"), FauxMoteur("grok")))
    note, journal = lire(sortie)
    assert journal["statut"] == "brouillon"
    corps = note.split("## Sources")[0]
    assert "http" not in corps and "## Ce que nous ne savons pas" in corps
    assert auditer(sortie) == []                     # E2 : aucune URL hors résultats bruts
    assert set(journal["cout_par_etape"]) == {"planification", "recherche", "synthese", "redaction", "relecture"}
    assert 0.1 < journal["cout_total_usd"] < 0.60
    assert "À valider par un consultant" in note


def test_injection_indirecte_sans_effet():
    sortie = executer(SUJET, mots=300, clients=Clients(FauxClaude(), FauxMoteur("perplexity"), FauxMoteur("grok")))
    for f in ("note.md", "dossier.json"):
        assert "exemple-malveillant" not in (sortie / f).read_text(encoding="utf-8")


def test_budget_005_interrompt_proprement():
    sortie = executer(SUJET, mots=300, budget=0.05, clients=Clients(FauxClaude(), FauxMoteur("perplexity"), FauxMoteur("grok")))
    _, journal = lire(sortie)
    assert journal["statut"] == "interrompu" and "Budget dépassé" in journal["erreur"]


def test_revision_apres_controles():
    sortie = executer(SUJET, mots=300, clients=Clients(FauxClaude(erreurs_redaction=True), FauxMoteur("perplexity"), FauxMoteur("grok")))
    _, journal = lire(sortie)
    assert journal["statut"] == "brouillon" and len(journal["relectures"]) == 2
    assert journal["relectures"][0]["controles"] and journal["relectures"][1]["controles"] == []


def test_aucune_fonction_d_envoi():
    """E5 : le code ne contient aucune capacité de diffusion (le pire qu'une page piégée obtienne : un brouillon douteux)."""
    code = (Path(__file__).resolve().parents[1] / "veille" / "agent.py").read_text(encoding="utf-8")
    for interdit in ("smtplib", "sendmail", "requests.post", "slack_sdk"):
        assert interdit not in code
