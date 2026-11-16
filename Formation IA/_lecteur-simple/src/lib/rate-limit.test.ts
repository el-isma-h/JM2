import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";
import { levelIdFromParam, lessonIdFromParam, moduleIdFromParam, withBase } from "./paths";
import { safeNextPath } from "./utils";

describe("rate limiter", () => {
  it("bloque au-delà de la limite puis libère après la fenêtre", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.hit("k", 0).allowed).toBe(true);
    expect(rl.hit("k", 100).allowed).toBe(true);
    const blocked = rl.hit("k", 200);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(800);
    expect(rl.hit("k", 1001).allowed).toBe(true);
    expect(rl.hit("autre", 200).allowed).toBe(true);
  });
});

describe("chemins", () => {
  it("basePath et paramètres", () => {
    expect(withBase("/")).toBe("/ia");
    expect(withBase("/api/time")).toBe("/ia/api/time");
    expect(levelIdFromParam("n2")).toBe("N2");
    expect(levelIdFromParam("n0")).toBeNull();
    expect(moduleIdFromParam("m07")).toBe("M07");
    expect(lessonIdFromParam("L123")).toBe("L123");
    expect(safeNextPath("//evil.com")).toBe("/");
    expect(safeNextPath("/parcours")).toBe("/parcours");
  });
});
