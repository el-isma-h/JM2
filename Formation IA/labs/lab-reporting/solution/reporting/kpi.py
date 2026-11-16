"""Calcul des indicateurs de la semaine : TOUT est calculé ici, le modèle ne fera que recopier (règle d'or L058)."""
from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd

CSV_DEFAUT = Path(__file__).resolve().parents[2] / "donnees" / "ventes_mobidesk_2026_S1.csv"
COLONNES = ["date", "commande", "commercial", "region", "categorie", "produit",
            "quantite", "prix_unitaire_ht", "montant_ht"]
MOINS = "−"      # signe moins typographique, utilisé pour les pourcentages (« −55,9 % »)
ESPACE_FINE = " "  # séparateur de milliers (« 1 078,20 € »)


def charger(chemin: str | Path = CSV_DEFAUT) -> pd.DataFrame:
    """Lit le CSV Mobidesk et refuse un fichier dont les colonnes ne sont pas celles attendues."""
    df = pd.read_csv(chemin, parse_dates=["date"])
    manquantes = [c for c in COLONNES if c not in df.columns]
    if manquantes:
        raise ValueError(f"Colonnes manquantes dans {chemin} : {', '.join(manquantes)}")
    return df


def euros(x: float) -> str:
    """1078.2 → « 1 078,20 € » (espace fine insécable comme séparateur de milliers)."""
    return f"{x:,.2f} €".replace(",", ESPACE_FINE).replace(".", ",")


def pourcentage(v: float | None) -> str | None:
    """-55.9 → « −55,9 % » ; 12 → « +12,0 % » ; None → None (pas de semaine de référence)."""
    if v is None:
        return None
    return f"{v:+.1f} %".replace(".", ",").replace("-", MOINS)


def bornes_semaine(date_ref: datetime) -> tuple[datetime, datetime, datetime]:
    """Renvoie (début semaine N, début semaine N−1, lundi de la semaine en cours), à minuit.
    La semaine N est la semaine complète (lundi → dimanche) qui précède date_ref."""
    lundi = (date_ref - timedelta(days=date_ref.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    return lundi - timedelta(days=7), lundi - timedelta(days=14), lundi


def calculer_kpi(df: pd.DataFrame, date_ref: datetime) -> dict:
    debut_n, debut_n1, lundi = bornes_semaine(date_ref)
    sem_n = df[(df["date"] >= debut_n) & (df["date"] < lundi)]
    sem_n1 = df[(df["date"] >= debut_n1) & (df["date"] < debut_n)]
    ca_n, ca_n1 = round(float(sem_n["montant_ht"].sum()), 2), round(float(sem_n1["montant_ht"].sum()), 2)
    variation = None if ca_n1 == 0 else round((ca_n - ca_n1) / ca_n1 * 100, 1)

    def top(col: str) -> list[dict]:
        serie = sem_n.groupby(col)["montant_ht"].sum().sort_values(ascending=False)
        return [{"nom": k, "ca": euros(round(float(v), 2))} for k, v in serie.items()]

    return {
        "periode": {"debut": debut_n.date().isoformat(), "fin": (lundi - timedelta(days=1)).date().isoformat()},
        "nb_lignes_semaine": int(len(sem_n)),
        "ca_semaine": euros(ca_n),
        "ca_semaine_precedente": euros(ca_n1),
        "variation_pct": pourcentage(variation),
        "cumul_semestre": euros(round(float(df["montant_ht"].sum()), 2)),
        "avoirs_semaine": int((sem_n["quantite"] < 0).sum()),
        "top_commerciaux": top("commercial"),
        "top_produits": top("produit"),
        "alerte": "Aucune ligne cette semaine : vérifier la source" if len(sem_n) == 0 else None,
    }
