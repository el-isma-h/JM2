// TODO 4 — coût d'un appel à partir de usage
import { describe, expect, it } from "vitest";
import { coutUsd } from "../src/lib/couts";

describe("TODO 4 — coutUsd", () => {
  it("question type de la leçon L105 (section 1.3) avec Sonnet 5.5 : ≈ 0,0062 $", () => {
    const u = { input_tokens: 1000, cache_read_input_tokens: 2000, output_tokens: 400 };
    expect(coutUsd(u, "claude-sonnet-5-5")).toBeCloseTo(0.0062, 8);
  });
  it("même question avec Haiku 5.5 : ≈ 0,00032 $", () => {
    const u = { input_tokens: 1000, cache_read_input_tokens: 2000, output_tokens: 400 };
    expect(coutUsd(u, "claude-haiku-5-5")).toBeCloseTo(0.00032, 8);
  });
  it("l'écriture de cache coûte 1,25 × l'entrée", () => {
    expect(coutUsd({ input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 1_000_000 }, "claude-sonnet-5-5")).toBe(2.5);
  });
  it("le fournisseur simulé ne coûte rien ; un modèle inconnu lève une erreur", () => {
    expect(coutUsd({ input_tokens: 500, output_tokens: 500 }, "simule")).toBe(0);
    expect(() => coutUsd({ input_tokens: 1, output_tokens: 1 }, "gpt-inconnu")).toThrow(/Tarif inconnu/);
  });
});
