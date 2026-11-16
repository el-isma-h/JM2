import { afterEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { alternatesLangues, metaSeo, urlSite } from "@/lib/seo";
import { SEO } from "@/i18n/seo";
import { LOCALES } from "@/i18n/config";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });

describe("SEO", () => {
  it("robots.txt bloque tout tant que NEXT_PUBLIC_ALLOW_INDEXING n'est pas \"true\"", () => {
    delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = "1";
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("robots.txt ouvert : API et espaces privés bloqués, sitemap issu de NEXT_PUBLIC_SITE_URL", () => {
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://exemple.test/";
    const r = robots();
    expect(r.sitemap).toBe("https://exemple.test/sitemap.xml");
    const regles = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(regles.disallow).toEqual(expect.arrayContaining(["/api/", "/*/admin", "/*/compte"]));
    expect(urlSite()).toBe("https://exemple.test");
  });

  it("hreflang : chaque langue + x-default", () => {
    const l = alternatesLangues("/faq");
    expect(Object.keys(l)).toEqual([...LOCALES, "x-default"]);
    expect(l["x-default"]).toBe("/fr/faq");
  });

  it("noindex par défaut, index seulement si autorisé et page publique", () => {
    delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
    expect(metaSeo("fr", "faq", "/faq").robots).toMatchObject({ index: false });
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = "true";
    expect(metaSeo("fr", "faq", "/faq").robots).toMatchObject({ index: true });
    expect(metaSeo("fr", "connexion", "/connexion", { indexable: false }).robots).toMatchObject({ index: false });
  });

  it("descriptions uniques par langue, sans promesse de rendement", () => {
    for (const l of LOCALES) {
      const ds = Object.entries(SEO[l]).filter(([, v]) => typeof v === "object").map(([, v]) => (v as { d: string }).d);
      expect(new Set(ds).size).toBe(ds.length);
      for (const d of ds) expect(d).not.toMatch(/rendement garanti|guaranteed return|gain assuré/i);
    }
  });
});
