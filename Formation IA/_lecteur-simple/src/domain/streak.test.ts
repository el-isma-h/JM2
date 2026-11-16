import { describe, expect, it } from "vitest";
import { computeStreak, dailyGoalProgress, parisDayKey, parisHour, shiftDayKey } from "./streak";

describe("fuseau Europe/Paris", () => {
  it("23 h 30 à Paris en hiver (22 h 30 UTC) reste le même jour", () => {
    expect(parisDayKey(new Date("2026-01-15T22:30:00Z"))).toBe("2026-01-15");
    expect(parisDayKey(new Date("2026-01-15T23:30:00Z"))).toBe("2026-01-16");
  });
  it("heure d'été (UTC+2)", () => {
    expect(parisDayKey(new Date("2026-07-15T22:30:00Z"))).toBe("2026-07-16");
    expect(parisHour(new Date("2026-07-15T22:30:00Z"))).toBe(0);
  });
  it("décalage de jour au passage à l'heure d'hiver", () => {
    expect(shiftDayKey("2026-10-25", -1)).toBe("2026-10-24");
    expect(shiftDayKey("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("computeStreak", () => {
  const now = new Date("2026-11-02T10:00:00Z");
  const day = (k: string, h = 12) => new Date(`${k}T${String(h).padStart(2, "0")}:00:00Z`);

  it("série en cours incluant aujourd'hui", () => {
    const s = computeStreak([day("2026-10-29"), day("2026-10-30"), day("2026-10-31"), day("2026-11-01"), day("2026-11-02", 9)], now);
    expect(s.current).toBe(5);
    expect(s.activeToday).toBe(true);
  });
  it("série conservée si rien aujourd'hui mais hier actif", () => {
    const s = computeStreak([day("2026-10-31"), day("2026-11-01")], now);
    expect(s.current).toBe(2);
    expect(s.activeToday).toBe(false);
  });
  it("série perdue après un jour sans activité", () => {
    const s = computeStreak([day("2026-10-28"), day("2026-10-29"), day("2026-10-30")], now);
    expect(s.current).toBe(0);
    expect(s.longest).toBe(3);
  });
  it("plusieurs événements le même jour comptent une fois", () => {
    const s = computeStreak([day("2026-11-02", 8), day("2026-11-02", 9)], now);
    expect(s.current).toBe(1);
    expect(s.activeDays).toEqual(["2026-11-02"]);
  });
  it("aucune activité", () => expect(computeStreak([], now)).toMatchObject({ current: 0, longest: 0, activeToday: false }));
});

describe("objectif quotidien", () => {
  it("cumule les XP du jour à Paris", () => {
    const now = new Date("2026-11-02T20:00:00Z");
    const g = dailyGoalProgress(
      [
        { amount: 20, at: new Date("2026-11-02T08:00:00Z") },
        { amount: 50, at: new Date("2026-11-01T22:59:00Z") }, // 23 h 59 Paris la veille
        { amount: 20, at: new Date("2026-11-02T19:00:00Z") },
      ],
      50,
      now,
    );
    expect(g.earned).toBe(40);
    expect(g.reached).toBe(false);
    expect(g.progress).toBeCloseTo(0.8);
  });
});
