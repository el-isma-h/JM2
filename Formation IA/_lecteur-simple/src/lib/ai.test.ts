import { beforeAll, describe, expect, it } from "vitest";
import { envCredentials, estimateSessionCost, maskKey, PROVIDERS, resolveCredentials, resolveModel, validateKeyShape } from "./ai";
import { decrypt, encrypt, maskSecret } from "./crypto";

beforeAll(() => {
  process.env.APP_SECRET = "test-secret-test-secret-test-secret-0123";
});

const personal = { provider: "openai" as const, key: "sk-proj-personnelle-0000000000", model: "gpt-6.1-terra" };
const platform = { provider: "anthropic" as const, key: "sk-ant-plateforme-000000000000" };
const env = { XAI_API_KEY: "xai-environnement-00000000000" };

describe("choix de la clé du tuteur", () => {
  it("clé personnelle > environnement > plateforme", () => {
    expect(resolveCredentials({ personal, platform, env })?.source).toBe("personal");
    expect(resolveCredentials({ personal: null, platform, env })).toMatchObject({ source: "env", provider: "xai" });
    expect(resolveCredentials({ personal: null, platform, env: {} })).toMatchObject({ source: "platform", provider: "anthropic" });
    expect(resolveCredentials({ personal: null, platform: null, env })).toMatchObject({ source: "env", provider: "xai" });
    expect(resolveCredentials({ env: {} })).toBeNull();
  });
  it("ignore une clé vide ou un fournisseur inconnu", () => {
    expect(resolveCredentials({ personal: { ...personal, key: "  " }, platform, env })?.source).toBe("env");
    expect(resolveCredentials({ personal: { ...personal, key: "  " }, platform, env: {} })?.source).toBe("platform");
    expect(resolveCredentials({ personal: { provider: "mistral" as never, key: "x".repeat(30) }, platform: null, env })?.source).toBe("env");
    expect(resolveCredentials({ personal: null, platform: { provider: "mistral" as never, key: "x".repeat(30) }, env: {} })).toBeNull();
  });
  it("ordre des variables d'environnement : Anthropic, OpenAI, xAI", () => {
    expect(envCredentials({ OPENAI_API_KEY: "sk-a", XAI_API_KEY: "xai-b" })?.provider).toBe("openai");
    expect(envCredentials({ ANTHROPIC_API_KEY: "sk-ant-c", OPENAI_API_KEY: "sk-a" })?.provider).toBe("anthropic");
    expect(envCredentials({ ANTHROPIC_API_KEY: " " })).toBeNull();
  });
  it("modèle : choix explicite > variable d'environnement > défaut", () => {
    expect(resolveModel("anthropic", null, {})).toBe("claude-haiku-5-5");
    expect(resolveModel("anthropic", null, { ANTHROPIC_MODEL: "claude-sonnet-5-5" })).toBe("claude-sonnet-5-5");
    expect(resolveModel("anthropic", "claude-opus-5-5", { ANTHROPIC_MODEL: "claude-sonnet-5-5" })).toBe("claude-opus-5-5");
    expect(resolveModel("openai", "rm -rf /;", {})).toBe(PROVIDERS.openai.defaultModel);
    expect(resolveCredentials({ personal, env: {} })?.model).toBe("gpt-6.1-terra");
  });
});

describe("validation et masquage des clés", () => {
  it("vérifie le préfixe du fournisseur", () => {
    expect(validateKeyShape("anthropic", "sk-ant-api03-abcdefghijklmnopqrstu")).toBeNull();
    expect(validateKeyShape("anthropic", "sk-proj-abcdefghijklmnopqrstu")).toMatch(/sk-ant-/);
    expect(validateKeyShape("openai", "sk-ant-api03-abcdefghijklmnopqrstu")).toMatch(/Anthropic/);
    expect(validateKeyShape("xai", "xai-abcdefghijklmnopqrstuvwxyz")).toBeNull();
    expect(validateKeyShape("xai", "xai-abc def")).toMatch(/espace/);
    expect(validateKeyShape("openai", "")).toMatch(/Collez/);
  });
  it("ne montre jamais la clé complète", () => {
    const key = "sk-ant-api03-SECRETSECRETSECRET-a1b2";
    const m = maskKey(key);
    expect(m).toBe("sk-ant-…a1b2");
    expect(m).not.toContain("SECRET");
    expect(maskKey("court")).toBe("…rt");
    expect(maskSecret(key)).toBe(m);
  });
  it("chiffrement aller-retour de la clé (usage ai-key), sans trace en clair", () => {
    const key = "sk-ant-api03-SECRETSECRETSECRET-a1b2";
    const stored = encrypt(JSON.stringify({ provider: "anthropic", key }), "ai-key");
    expect(stored).not.toContain("SECRET");
    expect(stored.startsWith("v1.")).toBe(true);
    expect(JSON.parse(decrypt(stored, "ai-key")).key).toBe(key);
    expect(() => decrypt(stored, "field")).toThrow();
  });
});

describe("coût indicatif d'une session", () => {
  it("croît avec le nombre de questions et le prix du modèle", () => {
    const haiku = PROVIDERS.anthropic.models[0];
    const opus = PROVIDERS.anthropic.models[2];
    const a = estimateSessionCost(haiku, { questions: 10, lessonTokens: 5000 });
    expect(a.outputTokens).toBe(4500);
    expect(a.usd).toBeGreaterThan(0.005);
    expect(a.usd).toBeLessThan(0.02);
    expect(estimateSessionCost(haiku, { questions: 20 }).usd).toBeGreaterThan(a.usd);
    expect(estimateSessionCost(opus, { questions: 10, lessonTokens: 5000 }).usd).toBeCloseTo(a.usd * 40, 5);
  });
});
