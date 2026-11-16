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
    # TODO 1a : formater en euros à la française
    # INDICE : f"{x:,.2f} €" donne « 1,078.20 € » ; remplacez « , » par ESPACE_FINE puis « . » par « , »
    raise NotImplementedError("TODO 1 : formater un montant en euros (euros)")


def pourcentage(v: float | None) -> str | None:
    """-55.9 → « −55,9 % » ; 12 → « +12,0 % » ; None → None (pas de semaine de référence)."""
    # TODO 1b : None → None ; sinon signe explicite, une décimale, virgule, signe moins typographique
    # INDICE : f"{v:+.1f} %" puis .replace(".", ",").replace("-", MOINS)
    raise NotImplementedError("TODO 1 : formater un pourcentage (pourcentage)")


def bornes_semaine(date_ref: datetime) -> tuple[datetime, datetime, datetime]:
    """Renvoie (début semaine N, début semaine N−1, lundi de la semaine en cours), à minuit.
    La semaine N est la semaine complète (lundi → dimanche) qui précède date_ref."""
    # TODO 2 : lundi de la semaine de date_ref, à minuit, puis les deux lundis précédents
    # INDICE : date_ref.weekday() vaut 0 le lundi ; .replace(hour=0, minute=0, second=0, microsecond=0)
    raise NotImplementedError("TODO 2 : calculer les bornes de la semaine (bornes_semaine)")


def calculer_kpi(df: pd.DataFrame, date_ref: datetime) -> dict:
    debut_n, debut_n1, lundi = bornes_semaine(date_ref)
    # TODO 3 : filtrer la semaine N [debut_n, lundi[ et la semaine N−1 [debut_n1, debut_n[,
    # calculer ca_n, ca_n1 (arrondis à 2 décimales) et la variation en % (1 décimale, None si ca_n1 == 0).
    # Puis complétez nb_lignes_semaine, avoirs_semaine (quantite < 0) et alerte (semaine vide) ci-dessous.
    # INDICE : sem_n = df[(df["date"] >= debut_n) & (df["date"] < lundi)]
    raise NotImplementedError("TODO 3 : calculer les indicateurs de la semaine (calculer_kpi)")
    sem_n = sem_n1 = ca_n = ca_n1 = variation = None  # noqa — à remplacer par votre code

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
