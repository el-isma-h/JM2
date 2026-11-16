// TODO 3 — quota par utilisateur ; budget global (fourni)
import { describe, expect, it } from "vitest";
import { Budget, Limiteur } from "../src/lib/quota";

describe("TODO 3 — Limiteur.autoriser", () => {
  it("autorise max requêtes par fenêtre, par clé, puis indique quand réessayer", () => {
    let t = 1_000_000;
    const l = new Limiteur(3, 60_000, () => t);
    expect(l.autoriser("alice")).toEqual({ ok: true, restant: 2 });
    expect(l.autoriser("alice")).toEqual({ ok: true, restant: 1 });
    expect(l.autoriser("alice")).toEqual({ ok: true, restant: 0 });
    t += 20_000;
    expect(l.autoriser("alice")).toEqual({ ok: false, reessayerDansS: 40 });
    expect(l.autoriser("bruno").ok).toBe(true);           // une clé ne consomme pas le quota d'une autre
    t += 40_000;
    expect(l.autoriser("alice")).toEqual({ ok: true, restant: 2 });   // nouvelle fenêtre
  });

  it("reessayerDansS vaut au moins 1 seconde", () => {
    let t = 0;
    const l = new Limiteur(1, 1_000, () => t);
    l.autoriser("x");
    t = 999;
    expect(l.autoriser("x")).toEqual({ ok: false, reessayerDansS: 1 });
  });
});

describe("Budget (fourni)", () => {
  it("alerte à 80 % et bloque à 100 %", () => {
    const b = new Budget(10);
    b.ajouter(7.9);
    expect([b.alerte(), b.epuise()]).toEqual([false, false]);
    b.ajouter(0.2);
    expect([b.alerte(), b.epuise()]).toEqual([true, false]);
    b.ajouter(2);
    expect(b.epuise()).toBe(true);
  });
});
