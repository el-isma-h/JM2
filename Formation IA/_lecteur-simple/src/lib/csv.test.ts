import { describe, expect, it } from "vitest";
import { CSV_BOM, csvCell, csvDate, toCsv } from "./csv";

describe("CSV Excel FR", () => {
  it("BOM UTF-8, séparateur point-virgule, CRLF", () => {
    const out = toCsv(["Nom", "Score (%)"], [["Élodie", 85.5], ["Zoé", 100]]);
    expect(out.startsWith(CSV_BOM)).toBe(true);
    expect(out.charCodeAt(0)).toBe(0xfeff);
    expect(out.slice(1).split("\r\n")).toEqual(["Nom;Score (%)", "Élodie;85,5", "Zoé;100", ""]);
  });
  it("échappe guillemets, séparateurs et retours à la ligne", () => {
    expect(csvCell('Dit "bonjour"')).toBe('"Dit ""bonjour"""');
    expect(csvCell("a;b")).toBe('"a;b"');
    expect(csvCell("ligne 1\nligne 2")).toBe('"ligne 1\nligne 2"');
  });
  it("neutralise l'injection de formules", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csvCell("+33 6")).toBe("'+33 6");
    expect(csvCell("@cmd")).toBe("'@cmd");
    expect(csvCell(-3)).toBe("-3");
  });
  it("valeurs vides, booléens, nombres et dates (heure de Paris)", () => {
    expect(csvCell(null)).toBe("");
    expect(csvCell(undefined)).toBe("");
    expect(csvCell(true)).toBe("oui");
    expect(csvCell(false)).toBe("non");
    expect(csvCell(1 / 3)).toBe("0,33");
    expect(csvCell(Number.NaN)).toBe("");
    expect(csvDate(new Date("2026-11-02T13:05:09Z"))).toBe("02/11/2026 14:05:09");
    expect(csvDate(new Date("2026-07-14T08:00:00Z"))).toBe("14/07/2026 10:00:00");
  });
});
