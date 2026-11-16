import { describe, expect, it } from "vitest";
import { cleanHeading, stripLessonPreamble } from "./lesson-text";

describe("cleanHeading", () => {
  it("retire l'émoji de tête", () => {
    expect(cleanHeading("🎯 Ce que vous saurez faire")).toBe("Ce que vous saurez faire");
    expect(cleanHeading("⚠️ Pièges")).toBe("Pièges");
    expect(cleanHeading("1. Quatre mots")).toBe("1. Quatre mots");
  });
});

describe("stripLessonPreamble", () => {
  it("retire le titre et la ligne de méta", () => {
    const body = "# Titre\n\n> ⏱ 45 min · 🎯 Niveau 1\n\n## 🎯 Objectifs\n- a";
    expect(stripLessonPreamble(body)).toBe("## 🎯 Objectifs\n- a");
  });
  it("retire le titre seul s'il n'y a pas de méta", () => {
    expect(stripLessonPreamble("# Titre\n\nTexte")).toBe("Texte");
  });
  it("ne touche à rien sans titre initial", () => {
    expect(stripLessonPreamble("## Section\n# Pas en tête")).toBe("## Section\n# Pas en tête");
  });
  it("conserve une citation ordinaire après le titre", () => {
    expect(stripLessonPreamble("# T\n> Une citation\n\nx")).toBe("> Une citation\n\nx");
  });
});
