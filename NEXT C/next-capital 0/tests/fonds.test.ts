import { describe, expect, it } from "vitest";
import { ADHESIONS, STATUTS, calculSouscription, montantValide, prochainStatut, statutPourCapital, FONDS } from "@/config/fonds";

describe("souscription", () => {
  it("applique les frais de structuration du niveau", () => {
    const c = calculSouscription(1000000, "gold"); // 10 000 €
    expect(c.fraisPct).toBe(4);
    expect(c.fraisCents).toBe(40000);
    expect(c.netCents).toBe(960000);
    expect(c.tokensCenti).toBe(96000); // 960 NXT à 10 €
  });
  it("bronze 5 %, diamond 3 %", () => {
    expect(calculSouscription(150000, "bronze").fraisCents).toBe(7500);
    expect(calculSouscription(150000, "diamond").fraisCents).toBe(4500);
  });
  it("valide le ticket minimum et le pas", () => {
    expect(montantValide(150000)).toBe(true);
    expect(montantValide(100000)).toBe(false);
    expect(montantValide(175000)).toBe(false);
    expect(montantValide(200000)).toBe(true);
  });
  it("les niveaux reprennent le modèle Blast (1 500 à 10 000 €)", () => {
    expect(ADHESIONS.map((a) => a.prixAnnuelCents)).toEqual([150000, 200000, 300000, 500000, 1000000]);
    expect(ADHESIONS.map((a) => a.fraisStructurationPct)).toEqual([5, 5, 4, 4, 3]);
    expect(ADHESIONS.at(-1)?.plafondAnnuelCents).toBeNull();
  });
});

describe("statuts", () => {
  it("attribue le statut selon le capital investi", () => {
    expect(statutPourCapital(0)).toBeNull();
    expect(statutPourCapital(150000)?.id).toBe("membre");
    expect(statutPourCapital(2499999)?.id).toBe("partenaire");
    expect(statutPourCapital(5000000)?.id).toBe("club50");
    expect(statutPourCapital(99999999)?.id).toBe("cercle100");
  });
  it("indique le prochain statut", () => {
    expect(prochainStatut(0)?.id).toBe("membre");
    expect(prochainStatut(1500000)?.id).toBe("associe");
    expect(prochainStatut(10000000)).toBeNull();
    expect(STATUTS).toHaveLength(5);
  });
  it("prix d'émission 10 €", () => { expect(FONDS.token.prixEmissionCents).toBe(1000); });
});
