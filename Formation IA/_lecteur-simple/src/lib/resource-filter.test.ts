import { describe, expect, it } from "vitest";
import type { ResourceSection } from "@/content/types";
import { filterResources, hostOf, normalizeSearch, searchTokens } from "./resource-filter";

const sections: ResourceSection[] = [
  {
    id: "anthropic",
    title: "Anthropic & Claude",
    intro: "",
    subsections: [
      { id: "docs", title: "Documentation", links: [{ title: "Prompt engineering", url: "https://docs.claude.com/prompt", flag: null, description: "Guide officiel" }] },
      { id: "cours", title: "Cours", links: [{ title: "Claude Academy", url: "https://academy.claude.com", flag: null, description: "Formation gratuite" }] },
    ],
  },
  {
    id: "openai",
    title: "OpenAI",
    intro: "",
    subsections: [{ id: "openai", title: "OpenAI", links: [{ title: "Cookbook", url: "https://cookbook.openai.com", flag: null, description: "Exemples de génération" }] }],
  },
];

describe("normalizeSearch / searchTokens", () => {
  it("retire accents, casse et espaces superflus", () => {
    expect(normalizeSearch("  Génération   IA ")).toBe("generation ia");
    expect(searchTokens("Prompt  CLAUDE")).toEqual(["prompt", "claude"]);
    expect(searchTokens("   ")).toEqual([]);
  });
});

describe("filterResources", () => {
  it("sans requête : tout, avec le total", () => {
    const r = filterResources(sections, "");
    expect(r.count).toBe(3);
    expect(r.sections).toHaveLength(2);
  });

  it("tous les mots doivent correspondre, accents ignorés", () => {
    expect(filterResources(sections, "generation").count).toBe(1);
    expect(filterResources(sections, "claude gratuite").sections[0].subsections.map((s) => s.id)).toEqual(["cours"]);
    expect(filterResources(sections, "claude cookbook").count).toBe(0);
  });

  it("cherche aussi dans le titre de section et l'adresse", () => {
    expect(filterResources(sections, "anthropic").count).toBe(2);
    expect(filterResources(sections, "cookbook.openai").count).toBe(1);
  });

  it("filtre par section", () => {
    const r = filterResources(sections, "", "openai");
    expect(r.sections.map((s) => s.id)).toEqual(["openai"]);
    expect(r.count).toBe(1);
  });

  it("ne modifie pas l'entrée", () => {
    filterResources(sections, "claude");
    expect(sections[0].subsections[0].links).toHaveLength(1);
  });
});

describe("hostOf", () => {
  it("extrait le domaine sans www", () => {
    expect(hostOf("https://www.example.com/a")).toBe("example.com");
    expect(hostOf("pas une url")).toBe("pas une url");
  });
});
