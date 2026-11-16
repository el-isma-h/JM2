"""Tests du reporting Mobidesk en mode simulé : 100 % hors ligne. Valeurs attendues = leçon L058, sections 3 et 7."""
from datetime import datetime

import pytest

from reporting.__main__ import executer, main
from reporting.controle import controler
from reporting.diffusion import decider
from reporting.kpi import CSV_DEFAUT, bornes_semaine, calculer_kpi, euros, pourcentage
from reporting.redaction import FauxRedacteur

F = " "   # espace fine insécable
M = "−"   # signe moins typographique


# ---------- TODO 1 : formatage ----------
def test_euros_format_francais():
    assert euros(1078.2) == f"1{F}078,20 €"
    assert euros(33500) == f"33{F}500,00 €"
    assert euros(-349) == "-349,00 €"
    assert euros(0) == "0,00 €"


def test_pourcentage_signe_typographique():
    assert pourcentage(-55.9) == f"{M}55,9 %"
    assert pourcentage(12) == "+12,0 %"
    assert pourcentage(None) is None


# ---------- TODO 2 : bornes de la semaine ----------
@pytest.mark.parametrize("ref, debut_n, lundi", [
    (datetime(2026, 6, 29), datetime(2026, 6, 22), datetime(2026, 6, 29)),      # lundi
    (datetime(2026, 7, 1, 15, 30), datetime(2026, 6, 22), datetime(2026, 6, 29)),  # mercredi après-midi
    (datetime(2026, 5, 4), datetime(2026, 4, 27), datetime(2026, 5, 4)),
])
def test_bornes_semaine(ref, debut_n, lundi):
    d_n, d_n1, l = bornes_semaine(ref)
    assert (d_n, l) == (debut_n, lundi)
    assert (d_n - d_n1).days == 7 and l.hour == 0 and l.minute == 0


# ---------- TODO 3 : indicateurs ----------
def test_kpi_semaine_du_22_juin(kpi_juin):
    k = kpi_juin
    assert k["periode"] == {"debut": "2026-06-22", "fin": "2026-06-28"}
    assert k["nb_lignes_semaine"] == 1
    assert k["ca_semaine"] == f"1{F}078,20 €"
    assert k["ca_semaine_precedente"] == f"2{F}443,00 €"
    assert k["variation_pct"] == f"{M}55,9 %"
    assert k["cumul_semestre"] == f"33{F}500,00 €"
    assert k["avoirs_semaine"] == 0 and k["alerte"] is None
    assert k["top_commerciaux"][0]["nom"] == "Léa Martin"
    assert k["top_produits"][0] == {"nom": "Lampe Halo", "ca": f"1{F}078,20 €"}


def test_kpi_semaine_avec_avoir(ventes):
    k = calculer_kpi(ventes, datetime(2026, 5, 4))
    assert k["ca_semaine"] == "-349,00 €"
    assert k["ca_semaine_precedente"] == f"1{F}110,00 €"
    assert k["variation_pct"] == f"{M}131,4 %"
    assert k["avoirs_semaine"] == 1


def test_kpi_semaine_vide(ventes):
    k = calculer_kpi(ventes, datetime(2026, 8, 3))
    assert k["nb_lignes_semaine"] == 0
    assert k["alerte"] == "Aucune ligne cette semaine : vérifier la source"
    assert k["variation_pct"] is None          # semaine précédente vide aussi : pas de référence


# ---------- TODO 4 : contrôle des chiffres recopiés ----------
def test_controle_accepte_un_texte_fidele(kpi_juin):
    texte = FauxRedacteur().rediger(kpi_juin)
    assert "1 078,20 €" in texte and f"{M}55,9 %" in texte
    assert controler(texte, kpi_juin) == []
    assert controler(texte.replace(" ", " "), kpi_juin) == []      # espace normale : équivalent


@pytest.mark.parametrize("panne, attendu", [
    ("faute_de_frappe", "1087,20"),
    ("arrondi", "1100"),
    ("invente", "4250,00"),
    ("signe", "+55,9 %"),
])
def test_controle_attrape_les_pannes(kpi_juin, panne, attendu):
    texte = FauxRedacteur(panne).rediger(kpi_juin)
    assert attendu in controler(texte, kpi_juin)


def test_controle_signe_de_l_avoir(ventes):
    k = calculer_kpi(ventes, datetime(2026, 5, 4))
    assert controler("Avoir de 349,00 € ; baisse de 131,4 %.", k) == []     # sans signe : toléré
    assert controler("CA d'environ −350,00 €.", k) == ["350,00"]           # piste de corrigé de la leçon


# ---------- TODO 5 : décision de diffusion ----------
def test_decider(kpi_juin):
    assert decider(kpi_juin, []) == "direction"
    assert decider(kpi_juin, ["1087,20"]) == "responsable"
    assert decider({**kpi_juin, "alerte": "Aucune ligne"}, []) == "non_genere"


# ---------- bout en bout (mode simulé) ----------
def test_bout_en_bout_trois_dates_de_la_lecon():
    juin = executer(str(CSV_DEFAUT), datetime(2026, 6, 29))
    assert juin["statut"] == "direction" and "33 500,00 €" in juin["texte"]
    avoir = executer(str(CSV_DEFAUT), datetime(2026, 5, 4))
    assert avoir["statut"] == "direction" and "avoir" in avoir["texte"] and "négatif" in avoir["texte"]
    vide = executer(str(CSV_DEFAUT), datetime(2026, 8, 3))
    assert vide["statut"] == "non_genere" and vide["texte"].startswith("Rapport non généré :")
    panne = executer(str(CSV_DEFAUT), datetime(2026, 6, 29), "faute_de_frappe")
    assert panne["statut"] == "responsable" and "CONTRÔLE AUTOMATIQUE" in panne["texte"]


def test_prompt_contient_les_chiffres_calcules(kpi_juin):
    r = FauxRedacteur()
    r.rediger(kpi_juin)
    assert "ca_semaine_precedente" in r.prompts[0] and "N'effectue" not in r.prompts[0]
    assert "recopie les chiffres tels quels" in r.prompts[0]


def test_cli(capsys):
    assert main(["--date-ref", "2026-06-29"]) == 0
    sortie = capsys.readouterr().out
    assert "[mode simulation] statut : direction" in sortie and "Objet : Mobidesk" in sortie
