"""Le portage est réussi quand les MÊMES tests passent sur Claude et sur OpenAI (mode simulé, hors ligne)."""
import json

import pytest

from portage import couts
from portage.assistant import traiter
from portage.devis_core import OUTILS_NEUTRES
from portage.evaluer import comparer, evaluer
from portage.fournisseur_anthropic import FournisseurAnthropic
from portage.fournisseur_openai import FournisseurOpenAI, normaliser_usage, traduire_outils
from portage.simulation import ErreurRequeteSimulee, FauxOpenAI

LEROY = "Bonjour, je voudrais une porte intérieure en chêne 204x73 avec poignée inox et la pose. La maison a 15 ans. Client : Mme Leroy."


# ---------- TODO 1 : traduction des outils ----------
def test_traduction_des_outils_au_format_responses():
    outils = traduire_outils()
    assert [o["name"] for o in outils] == [o["name"] for o in OUTILS_NEUTRES]
    for o, n in zip(outils, OUTILS_NEUTRES):
        assert o["type"] == "function" and o["strict"] is True
        assert o["parameters"] == n["schema"] and "input_schema" not in o and "fn" not in o


# ---------- TODO 2 : streaming ----------
def test_lecture_du_flux():
    f = FournisseurOpenAI(client=FauxOpenAI())
    morceaux = []
    traiter(LEROY, f, afficher=morceaux.append)
    assert "".join(morceaux).startswith("Merci pour votre demande")


def test_flux_interrompu_detecte():
    f = FournisseurOpenAI(client=FauxOpenAI())
    with pytest.raises(RuntimeError, match="interrompu"):
        f.lire_flux(iter([]), afficher=lambda s: None)


# ---------- TODO 3 : appels parallèles, function_call_output sans rôle ----------
def test_appels_paralleles_executes():
    client = FauxOpenAI()
    f = FournisseurOpenAI(client=client)
    historique = f.tour([f.message_utilisateur(LEROY)])
    sorties = [it for it in historique if isinstance(it, dict) and it.get("type") == "function_call_output"]
    assert len(sorties) == 3                       # 2 articles + 1 tarif de pose, dans la MÊME réponse
    assert all("role" not in s and isinstance(s["output"], str) for s in sorties)
    assert client.requetes[0]["max_output_tokens"]  # max_output_tokens toujours fixé


def test_iterations_bornees():
    f = FournisseurOpenAI(client=FauxOpenAI(boucle_infinie=True))
    with pytest.raises(RuntimeError, match="itérations"):
        f.tour([f.message_utilisateur(LEROY)], max_iterations=3)


def test_le_faux_client_rejette_le_piege_du_role():
    client = FauxOpenAI()
    mauvais = [{"role": "user", "content": LEROY},
               {"role": "user", "content": [{"type": "function_call_output", "call_id": "x", "output": "{}"}]}]
    with pytest.raises(ErreurRequeteSimulee):
        client.responses.create(model="gpt-6.1-sol", input=mauvais, tools=[], max_output_tokens=10)


# ---------- TODO 4 : sortie structurée ----------
def test_generer_devis_structure():
    client = FauxOpenAI()
    res = traiter(LEROY, FournisseurOpenAI(client=client))
    assert res["devis"]["total_ttc"] == 618.2 and res["devis"]["tva_pct"] == 10.0
    assert res["alertes"] == []
    assert client.requetes[-1].get("parse") and client.requetes[-1]["tool_choice"] == "none"


# ---------- TODO 5 : usage normalisé ----------
def test_usage_openai_normalise():
    from types import SimpleNamespace as NS
    u = normaliser_usage(NS(input_tokens=3300, output_tokens=600, input_tokens_details=NS(cached_tokens=3000)))
    assert u == {"input_non_cache": 300, "cache_lecture": 3000, "cache_ecriture": 0, "output": 600}
    assert normaliser_usage(NS(input_tokens=100, output_tokens=5))["cache_lecture"] == 0   # champ absent


# ---------- TODO 6 : coûts ----------
def test_couts_section_6():
    # Un appel du tableau 6.2 : 300 tokens pleins, 3 000 en cache, 600 en sortie
    u = {"input_non_cache": 300, "cache_lecture": 3000, "cache_ecriture": 0, "output": 600}
    assert couts.cout_usage(u, "gpt-6.1-sol") == pytest.approx((300 * 2 + 3000 * 0.10 + 600 * 10) / 1e6)
    assert couts.cout_usage(u, "gpt-6.1-terra") == pytest.approx((300 * 1 + 3000 * 0.05 + 600 * 5) / 1e6)
    assert couts.cout_usage({"cache_ecriture": 1_000_000}, "claude-sonnet-5-5") == pytest.approx(2.50)
    with pytest.raises(KeyError):
        couts.cout_usage(u, "modele-inconnu")


# ---------- TODO 7 : harnais ----------
def test_comparer():
    att = {"lignes": [{"designation": "Poignée inox", "quantite": 2, "prix_unitaire_ht": 42.0}], "tva_pct": 20.0,
           "total_ttc": 100.8, "questions": True}
    bon = {**att, "lignes": list(att["lignes"]), "questions_en_suspens": ["Âge du logement ?"]}
    assert comparer(att, bon) == (True, [])
    ok, raisons = comparer(att, {**bon, "total_ttc": 100.0, "questions_en_suspens": []})
    assert not ok and len(raisons) == 2


@pytest.mark.parametrize("fournisseur", ["anthropic", "openai"])
def test_les_20_cas_passent_sur_les_deux_fournisseurs(fournisseur):
    bilan = evaluer(fournisseur, verbeux=False)
    assert bilan["score"] >= 18 and bilan["reussi"], bilan["echecs"]


def test_meme_comportement_claude_et_openai():
    a = traiter(LEROY, FournisseurAnthropic())["devis"]
    o = traiter(LEROY, FournisseurOpenAI())["devis"]
    assert a == o


def test_le_cache_apparait_dans_usage():
    res = traiter(LEROY, FournisseurOpenAI())
    assert res["usages"][0]["cache_lecture"] == 0 and res["usages"][-1]["cache_lecture"] > 0
    assert 0 < res["cout_usd"] < 0.05
