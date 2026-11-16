"""Tests unitaires des outils : ils tournent SANS modèle (la TVA se teste sans IA)."""
import json

import pytest

from devis_express import outils


# ---------- TODO 1 : rechercher_prestation ----------
def test_recherche_prise_renvoie_des_lignes_du_catalogue():
    hits = json.loads(outils.rechercher_prestation("prise"))
    codes = {h["code"] for h in hits}
    assert {"PRISE-SUPP", "PRISE-DEPL"} <= codes
    assert all(h["prix_ht"] == outils.CATALOGUE[h["code"]]["prix_ht"] for h in hits)


def test_recherche_insensible_casse_et_accents():
    assert json.loads(outils.rechercher_prestation("DETECTEUR"))[0]["code"] == "DETECT-FUMEE"
    assert json.loads(outils.rechercher_prestation("tab-rempl"))[0]["code"] == "TAB-REMPL"


def test_recherche_hors_catalogue():
    assert outils.rechercher_prestation("climatisation") == outils.MESSAGE_HORS_CATALOGUE


def test_recherche_limitee_a_8_resultats():
    catalogue = {f"X{i}": {"code": f"X{i}", "libelle": "prise test", "unite": "u", "prix_ht": 1.0, "page": 1} for i in range(20)}
    assert len(json.loads(outils.rechercher_prestation("prise", catalogue))) == 8


# ---------- TODO 2 : verifier_tva ----------
@pytest.mark.parametrize("plus2, energie, pro, attendu", [
    (True, False, False, 10.0),
    (True, True, False, 5.5),
    (False, True, False, 20.0),     # rénovation énergétique mais logement récent : pas de 5,5 %
    (False, False, False, 20.0),
    (True, True, True, 20.0),       # le local professionnel prime
])
def test_tva(plus2, energie, pro, attendu):
    r = json.loads(outils.verifier_tva(plus2, energie, pro))
    assert r["taux"] == attendu and r["motif"]


# ---------- TODO 3 : enregistrer_devis (confirmation humaine, E6) ----------
def test_enregistrement_refuse_ne_laisse_aucune_trace(environnement_isole):
    with pytest.raises(PermissionError):
        outils.enregistrer_devis("Mme Fabre", 396.0, confirmer=lambda *_: False)
    assert not (environnement_isole / "devis_valides.jsonl").exists()


def test_enregistrement_accepte(environnement_isole):
    assert outils.enregistrer_devis("Mme Fabre", 396.0, confirmer=lambda *_: True) == "devis enregistré"
    ligne = json.loads((environnement_isole / "devis_valides.jsonl").read_text(encoding="utf-8"))
    assert ligne["client"] == "Mme Fabre" and ligne["total_ttc"] == 396.0


# ---------- TODO 4 : controler_devis ----------
def _devis(lignes, total=None, taux=10.0):
    return {"lignes": lignes, "taux_tva": taux,
            "total_ht": round(sum(l["quantite"] * l["prix_unitaire_ht"] for l in lignes), 2) if total is None else total}


LIGNE_OK = {"code": "PRISE-SUPP", "libelle": "Prise", "quantite": 3, "prix_unitaire_ht": 95.0, "page_catalogue": 3}


def test_controle_devis_conforme():
    assert outils.controler_devis(_devis([LIGNE_OK])) == []


def test_controle_prix_invente():
    alertes = outils.controler_devis(_devis([{**LIGNE_OK, "prix_unitaire_ht": 99.0}]))
    assert any(a.startswith("prix non conforme") for a in alertes)


def test_controle_code_inconnu():
    alertes = outils.controler_devis(_devis([{**LIGNE_OK, "code": "PISCINE"}]))
    assert any(a.startswith("code inconnu") for a in alertes)


def test_controle_total_incoherent_et_taux_interdit():
    alertes = outils.controler_devis(_devis([LIGNE_OK], total=100.0, taux=0.0))
    assert any(a.startswith("total_ht incohérent") for a in alertes)
    assert any(a.startswith("taux de TVA non autorisé") for a in alertes)


# ---------- TODO 5 : cout_usd ----------
def test_cout_usd():
    usage = {"input": 10_000, "output": 1_000, "cache_w": 1_500, "cache_r": 12_000}
    # 10 000 × 2 + 1 000 × 10 + 1 500 × 4 + 12 000 × 0,10 = 37 200 → 0,0372 $
    assert outils.cout_usd(usage) == pytest.approx(0.0372)
    assert outils.cout_usd({"input": 1_000_000}) == pytest.approx(2.0)
