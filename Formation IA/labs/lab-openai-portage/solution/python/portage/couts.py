"""couts — coût réel d'un devis à partir des `usage` normalisés, cache inclus (L083, section 6).

Tarifs Standard en $ par million de tokens (pages Pricing des deux fournisseurs, nov. 2026 — à revérifier) :
(entrée, entrée lue en cache, écriture de cache, sortie). OpenAI ne facture pas d'écriture de cache standard.
"""
from __future__ import annotations

TARIFS = {
    "claude-haiku-5-5":  (0.10, 0.01, 0.125, 0.50),
    "claude-sonnet-5-5": (2.00, 0.10, 2.50, 10.00),     # écriture 1,25 × l'entrée (TTL 5 min)
    "claude-opus-5-5":   (4.00, 0.20, 5.00, 20.00),
    "gpt-6-luna":        (0.10, 0.01, 0.0, 0.50),
    "gpt-6.1-terra":     (1.00, 0.05, 0.0, 5.00),
    "gpt-6.1-sol":       (2.00, 0.10, 0.0, 10.00),
}


def cout_usage(usage: dict, modele: str) -> float:
    """Coût en $ d'UN appel. usage = {input_non_cache, cache_lecture, cache_ecriture, output}."""
    if modele not in TARIFS:
        raise KeyError(f"Tarif inconnu pour {modele} : ajoutez-le à TARIFS (source + date)")
    p_in, p_cache, p_ecriture, p_out = TARIFS[modele]
    total = (usage.get("input_non_cache", 0) * p_in + usage.get("cache_lecture", 0) * p_cache
             + usage.get("cache_ecriture", 0) * p_ecriture + usage.get("output", 0) * p_out) / 1_000_000
    return round(total, 6)


def cout_total(usages: list[dict], modele: str) -> float:
    return round(sum(cout_usage(u, modele) for u in usages), 6)


def cout_mensuel(cout_par_devis: float, devis_par_jour: int = 150, jours: int = 22) -> float:
    return round(cout_par_devis * devis_par_jour * jours, 2)


if __name__ == "__main__":
    import json, sys
    # python -m portage.couts usages.json gpt-6.1-sol   (usages.json = liste produite par evaluer --sortie)
    usages = json.loads(open(sys.argv[1], encoding="utf-8").read())
    c = cout_total(usages, sys.argv[2])
    print(f"Coût total : {c:.5f} $")
