/**
 * Contrôle des rôles sur les routes et actions d'administration (sans base de données : session et services simulés).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canActOn, canManageSettings, invitableRoles, isExportType } from "@/lib/roles";

type FakeUser = { id: string; role: "learner" | "trainer" | "admin"; isDemo: boolean; firstName: string; lastName: string; email: string; dailyGoalXp: number; sessionId: string };
let current: FakeUser | null = null;
const user = (role: FakeUser["role"]): FakeUser => ({ id: "00000000-0000-4000-8000-000000000001", role, isDemo: false, firstName: "A", lastName: "B", email: "a@b.fr", dailyGoalXp: 50, sessionId: "s" });

vi.mock("@/server/auth", () => ({
  getSession: async () => current,
  isStaff: (r: string) => r === "admin" || r === "trainer",
}));
vi.mock("@/server/admin/exports", () => ({
  buildExport: vi.fn(async () => ({ filename: "x.csv", csv: "﻿a;b\r\n", rows: 0 })),
  parseDay: () => null,
}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));

describe("règles de rôles", () => {
  it("le formateur voit l'administration mais pas les réglages ni les rôles", () => {
    expect(canManageSettings("admin")).toBe(true);
    expect(canManageSettings("trainer")).toBe(false);
    expect(invitableRoles("admin")).toEqual(["learner", "trainer", "admin"]);
    expect(invitableRoles("trainer")).toEqual(["learner"]);
    expect(invitableRoles("learner")).toEqual([]);
  });
  it("actions sur un compte", () => {
    const admin = { id: "a", role: "admin" as const };
    const trainer = { id: "t", role: "trainer" as const };
    expect(canActOn(trainer, { id: "l", role: "learner" }, "progress")).toBe(true);
    expect(canActOn(trainer, { id: "x", role: "admin" }, "disable")).toBe(false);
    expect(canActOn(admin, { id: "t", role: "trainer" }, "disable")).toBe(true);
    expect(canActOn(admin, admin, "disable")).toBe(false);
    expect(canActOn({ id: "l", role: "learner" }, { id: "m", role: "learner" }, "progress")).toBe(false);
  });
  it("types d'export", () => {
    expect(isExportType("preuves")).toBe(true);
    expect(isExportType("../etc")).toBe(false);
  });
});

describe("/api/admin/export/[type]", () => {
  beforeEach(() => {
    current = null;
  });
  const call = async (type: string) => {
    const { GET } = await import("@/app/api/admin/export/[type]/route");
    return GET(new Request(`http://localhost/ia/api/admin/export/${type}`), { params: Promise.resolve({ type }) });
  };
  it("401 sans session", async () => {
    expect((await call("preuves")).status).toBe(401);
  });
  it("404 pour un apprenant", async () => {
    current = user("learner");
    expect((await call("preuves")).status).toBe(404);
  });
  it("CSV pour formateur et admin", async () => {
    for (const role of ["trainer", "admin"] as const) {
      current = user(role);
      const res = await call("quiz");
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/csv");
      expect(res.headers.get("content-disposition")).toContain("attachment");
      expect((await res.arrayBuffer()).byteLength).toBeGreaterThan(3);
    }
  });
  it("404 pour un type inconnu", async () => {
    current = user("admin");
    expect((await call("utilisateurs")).status).toBe(404);
  });
});

describe("server actions d'administration", () => {
  it("refusent un apprenant ou une session absente", async () => {
    const actions = await import("@/server/actions/admin");
    current = null;
    await expect(actions.unlockAction("00000000-0000-4000-8000-000000000002", "module", "M02")).rejects.toThrow(/refusé/);
    current = user("learner");
    await expect(actions.resetExamAttemptsAction("00000000-0000-4000-8000-000000000002", "N1")).rejects.toThrow(/refusé/);
    await expect(actions.setAccountDisabledAction("00000000-0000-4000-8000-000000000002", true)).rejects.toThrow(/refusé/);
    await expect(actions.renewInvitationAction("00000000-0000-4000-8000-000000000003")).rejects.toThrow(/refusé/);
  });
  it("les réglages IA sont réservés à l'admin", async () => {
    const ai = await import("@/server/actions/ai-key");
    current = user("trainer");
    expect(await ai.deletePlatformKeyAction()).toEqual({ error: "Réservé aux administrateurs." });
    expect(await ai.testPlatformKeyAction()).toEqual({ error: "Réservé aux administrateurs." });
  });
});

describe("/api/tutor", () => {
  it("401 sans session", async () => {
    current = null;
    const { POST, GET } = await import("@/app/api/tutor/route");
    expect((await POST(new Request("http://localhost/ia/api/tutor", { method: "POST", body: "{}" }))).status).toBe(401);
    expect((await GET()).status).toBe(401);
  });
});
