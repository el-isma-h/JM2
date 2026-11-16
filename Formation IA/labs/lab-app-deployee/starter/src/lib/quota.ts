// src/lib/quota.ts — quota par utilisateur (fenêtre fixe) et budget global bloquant (exigence F4 de L105).
// En mémoire : suffisant pour une instance ; avec plusieurs instances, déplacez les compteurs dans Postgres ou Redis.

export type DecisionQuota = { ok: true; restant: number } | { ok: false; reessayerDansS: number };

export class Limiteur {
  private readonly fenetres = new Map<string, { debut: number; compte: number }>();

  constructor(
    private readonly max: number,
    private readonly fenetreMs = 60_000,
    private readonly maintenant: () => number = Date.now,
  ) {}

  /** Autorise au plus `max` requêtes par `fenetreMs` et par clé ; au-delà, indique quand réessayer (en secondes, arrondi au-dessus). */
  autoriser(cle: string): DecisionQuota {
    // TODO 3 : fenêtre fixe par clé, dans this.fenetres (Map clé → { debut, compte })
    // - pas de fenêtre, ou fenêtre expirée (t − debut ≥ fenetreMs) → nouvelle fenêtre, compte = 1
    // - compte ≥ max → { ok: false, reessayerDansS: au moins 1, arrondi au-dessus }
    // - sinon compte + 1 → { ok: true, restant: max − compte }
    // INDICE : const t = this.maintenant();
    throw new Error("TODO 3 : quota par utilisateur (Limiteur.autoriser)");
  }
}

export class Budget {
  private depenseUsd = 0;

  constructor(private readonly plafondUsd: number) {}

  ajouter(usd: number): void {
    this.depenseUsd += usd;
  }

  get depense(): number {
    return this.depenseUsd;
  }

  /** Bloquant : plus aucun appel quand le plafond est atteint. */
  epuise(): boolean {
    return this.depenseUsd >= this.plafondUsd;
  }

  /** Alerte à 80 % du budget (checklist, ligne « Coûts »). */
  alerte(): boolean {
    return this.depenseUsd >= 0.8 * this.plafondUsd;
  }
}
