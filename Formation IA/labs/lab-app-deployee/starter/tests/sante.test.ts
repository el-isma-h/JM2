// /api/health — fourni (vert dès le départ si le TODO 1 est fait)
import { describe, expect, it } from "vitest";
import { sante } from "../src/lib/sante";

describe("sante (sonde /api/health)", () => {
  it("ok avec version et promptVersion, sans appel au modèle", () => {
    expect(sante({ DEMO_TOKEN: "jeton-de-demo-assez-long", APP_VERSION: "abc123", PROMPT_VERSION: "v3" }))
      .toEqual({ code: 200, corps: { statut: "ok", version: "abc123", promptVersion: "v3", mode: "simulation" } });
  });
  it("503 « degrade » si la configuration est invalide, sans révéler les variables", () => {
    const r = sante({ DEMO_TOKEN: "court" });
    expect(r).toEqual({ code: 503, corps: { statut: "degrade", raison: "configuration" } });
  });
});
