import { describe, expect, it } from "vitest";
import { acceptedTimeIncrement, lessonTimeCap } from "./lesson-time";

const now = new Date("2026-11-02T10:00:00Z");
const ago = (s: number) => new Date(now.getTime() - s * 1000);

describe("lessonTimeCap", () => {
  it("vaut 1,5 × la durée prévue", () => {
    expect(lessonTimeCap(40)).toBe(3600);
    expect(lessonTimeCap(0)).toBe(0);
    expect(lessonTimeCap(-5)).toBe(0);
  });
});

describe("acceptedTimeIncrement", () => {
  const base = { alreadySpent: 0, plannedMinutes: 40, now };

  it("accepte un ping normal de 30 s", () => {
    expect(acceptedTimeIncrement({ ...base, claimed: 30, lastSeenAt: ago(31) })).toBe(30);
  });

  it("borne un ping à 35 s même si le client en déclare plus", () => {
    expect(acceptedTimeIncrement({ ...base, claimed: 600, lastSeenAt: null })).toBe(35);
  });

  it("refuse les pings plus rapides que le temps réel", () => {
    expect(acceptedTimeIncrement({ ...base, claimed: 30, lastSeenAt: ago(2) })).toBe(7);
  });

  it("ignore les valeurs négatives ou invalides", () => {
    expect(acceptedTimeIncrement({ ...base, claimed: -10, lastSeenAt: null })).toBe(0);
    expect(acceptedTimeIncrement({ ...base, claimed: Number.NaN, lastSeenAt: null })).toBe(0);
  });

  it("plafonne le cumul à 1,5 × la durée prévue", () => {
    expect(acceptedTimeIncrement({ ...base, alreadySpent: 3590, claimed: 30, lastSeenAt: ago(60) })).toBe(10);
    expect(acceptedTimeIncrement({ ...base, alreadySpent: 3600, claimed: 30, lastSeenAt: ago(60) })).toBe(0);
    expect(acceptedTimeIncrement({ ...base, alreadySpent: 9999, claimed: 30, lastSeenAt: ago(60) })).toBe(0);
  });
});
