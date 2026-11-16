import { describe, expect, it } from "vitest";
import { CERT_NUMBER_REGEX, generateCertificateNumber, normalizeCertificateNumber, parseCertificateNumber, verificationPath } from "./certificate";
import { seededRandom } from "./exam";

describe("numéro de certificat", () => {
  it("format NF-IA-N{n}-{AAAA}-{6 car.}", () => {
    const n = generateCertificateNumber("N1", new Date("2026-11-02T10:00:00Z"), seededRandom(1));
    expect(n).toMatch(CERT_NUMBER_REGEX);
    expect(n.startsWith("NF-IA-N1-2026-")).toBe(true);
  });
  it("année de Paris (31 déc. 23 h 30 UTC = 1er janv. à Paris)", () => {
    expect(generateCertificateNumber("N2", new Date("2026-12-31T23:30:00Z"), seededRandom(2))).toMatch(/^NF-IA-N2-2027-/);
  });
  it("pas de caractères ambigus, valeurs variées", () => {
    const rand = seededRandom(3);
    const set = new Set(Array.from({ length: 500 }, () => generateCertificateNumber("N3", new Date(), rand)));
    expect(set.size).toBe(500);
    for (const n of set) expect(n.slice(-6)).not.toMatch(/[01OIL]/);
  });
  it("niveau invalide", () => expect(() => generateCertificateNumber("X9", new Date(), Math.random)).toThrow());
  it("normalisation et analyse", () => {
    expect(normalizeCertificateNumber("  nf-ia-n4-2026-abcdef ")).toBe("NF-IA-N4-2026-ABCDEF");
    expect(normalizeCertificateNumber("NF-IA-N4-2026-ABCDE0")).toBeNull();
    expect(parseCertificateNumber("NF-IA-N4-2026-ABCDEF")).toEqual({ level: 4, year: 2026, suffix: "ABCDEF" });
    expect(verificationPath("NF-IA-N1-2026-ABCDEF")).toBe("/verifier/NF-IA-N1-2026-ABCDEF");
  });
});
