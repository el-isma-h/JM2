import { beforeAll, describe, expect, it } from "vitest";
import { cryptoRandom, decrypt, encrypt, maskSecret, randomToken, safeEqual, sha256 } from "./crypto";

beforeAll(() => {
  process.env.APP_SECRET = "test-secret-test-secret-test-secret-0123";
});

describe("crypto", () => {
  it("chiffrement aller-retour, IV aléatoire, usage séparé", () => {
    const a = encrypt("sk-ant-123", "ai-key");
    const b = encrypt("sk-ant-123", "ai-key");
    expect(a).not.toBe(b);
    expect(decrypt(a, "ai-key")).toBe("sk-ant-123");
    expect(() => decrypt(a, "autre")).toThrow();
  });
  it("altération détectée", () => {
    const parts = encrypt("x").split(".");
    parts[3] = Buffer.from("y").toString("base64url");
    expect(() => decrypt(parts.join("."))).toThrow();
  });
  it("secret trop court", () => {
    const old = process.env.APP_SECRET;
    process.env.APP_SECRET = "court";
    expect(() => encrypt("x")).toThrow(/APP_SECRET/);
    process.env.APP_SECRET = old;
  });
  it("utilitaires", () => {
    expect(sha256("abc")).toHaveLength(64);
    expect(randomToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(safeEqual("a", "a")).toBe(true);
    expect(safeEqual("a", "ab")).toBe(false);
    const r = cryptoRandom();
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThan(1);
    expect(maskSecret("sk-ant-api03-abcdefgh1234")).toBe("sk-ant-…1234");
  });
});
