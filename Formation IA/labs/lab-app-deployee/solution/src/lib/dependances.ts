// src/lib/dependances.ts — assemble les dépendances une seule fois par processus serveur.
import type { Dependances } from "./chat";
import { lireConfig } from "./config";
import { FournisseurAnthropic, FournisseurSimule } from "./fournisseurs";
import { Budget, Limiteur } from "./quota";

let instance: Dependances | undefined;

/** Journal structuré (une ligne JSON par événement) : lisible par `docker compose logs`, Loki, Datadog… */
export function journalConsole(entree: Record<string, unknown>): void {
  console.log(JSON.stringify({ horodatage: new Date().toISOString(), ...entree }));
}

export function dependances(): Dependances {
  if (!instance) {
    const config = lireConfig();
    const fournisseur =
      config.mode === "reel" && config.anthropicApiKey
        ? new FournisseurAnthropic(config.anthropicApiKey, config.modele)
        : new FournisseurSimule();
    instance = {
      config,
      fournisseur,
      limiteur: new Limiteur(config.quotaParMinute),
      budget: new Budget(config.budgetMensuelUsd),
      journal: journalConsole,
    };
  }
  return instance;
}
