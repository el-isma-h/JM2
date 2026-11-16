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
    const t = this.maintenant();
    const f = this.fenetres.get(cle);
    if (!f || t - f.debut >= this.fenetreMs) {
      this.fenetres.set(cle, { debut: t, compte: 1 });
      return { ok: true, restant: this.max - 1 };
    }
    if (f.compte >= this.max) {
      return { ok: false, reessayerDansS: Math.max(1, Math.ceil((f.debut + this.fenetreMs - t) / 1000)) };
    }
    f.compte += 1;
    return { ok: true, restant: this.max - f.compte };
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
