// TODO 1 — configuration validée au démarrage
import { describe, expect, it } from "vitest";
import { ErreurConfig, lireConfig } from "../src/lib/config";

const JETON = "jeton-de-demo-assez-long";

describe("TODO 1 — lireConfig", () => {
  it("sans clé : mode simulation, valeurs par défaut", () => {
    const c = lireConfig({ DEMO_TOKEN: JETON });
    expect(c.mode).toBe("simulation");
    expect(c.modele).toBe("simule");
    expect(c.maxMessages).toBe(30);
    expect(c.maxCaracteres).toBe(2000);
    expect(c.quotaParMinute).toBe(10);
    expect(c.budgetMensuelUsd).toBe(300);
    expect(c.anthropicApiKey).toBeUndefined();
  });

  it("avec une clé valide : mode réel et modèle par défaut", () => {
    const c = lireConfig({ DEMO_TOKEN: JETON, ANTHROPIC_API_KEY: "sk-ant-test-123" });
    expect(c.mode).toBe("reel");
    expect(c.modele).toBe("claude-sonnet-5-5");
  });

  it("LAB_MODE=simulation l'emporte sur la présence d'une clé", () => {
    expect(lireConfig({ DEMO_TOKEN: JETON, ANTHROPIC_API_KEY: "sk-ant-x", LAB_MODE: "simulation" }).mode).toBe("simulation");
  });

  it("refuse de démarrer et cite les NOMS des variables fautives, jamais leurs valeurs", () => {
    const secret = "cle-qui-ne-doit-jamais-apparaitre";
    try {
      lireConfig({ DEMO_TOKEN: "court", LAB_MODE: "reel", ANTHROPIC_API_KEY: secret, QUOTA_PAR_MINUTE: "-3" });
      expect.fail("aurait dû lever ErreurConfig");
    } catch (e) {
      expect(e).toBeInstanceOf(ErreurConfig);
      const err = e as ErreurConfig;
      expect(err.variables).toEqual(expect.arrayContaining(["DEMO_TOKEN", "ANTHROPIC_API_KEY", "QUOTA_PAR_MINUTE"]));
      expect(err.message).not.toContain(secret);
      expect(err.message).not.toContain("court");
    }
  });

  it("⛔ refuse une clé dans une variable NEXT_PUBLIC_*", () => {
    expect(() => lireConfig({ DEMO_TOKEN: JETON, NEXT_PUBLIC_ANTHROPIC_KEY: "sk-ant-fuite" })).toThrow(/NEXT_PUBLIC_ANTHROPIC_KEY/);
  });

  it("refuse un modèle sans tarif connu en mode réel", () => {
    expect(() => lireConfig({ DEMO_TOKEN: JETON, ANTHROPIC_API_KEY: "sk-ant-x", AI_MODEL: "modele-inconnu" })).toThrow(/AI_MODEL/);
  });
});
