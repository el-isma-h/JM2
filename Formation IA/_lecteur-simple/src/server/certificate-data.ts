/**
 * Données d'affichage des certificats (liste /certificats, PDF, vérification publique).
 * La délivrance reste dans certificates.ts (issueCertificate).
 */
import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Certificate } from "@/db/schema";
import { getLevel, getProgramme } from "@/content/loader";
import { absoluteUrl, routes } from "@/lib/paths";
import { certificateCompetences } from "./exams";
import type { CertificatePdfInput } from "./certificate-pdf";

/** « Certificat Next Formation IA — Niveau 1 « Utilisateur IA certifié » » → « Utilisateur IA certifié ». */
export function certificateShortTitle(levelId: string): string {
  const level = getLevel(levelId);
  const m = /«\s*([^»]+?)\s*»/.exec(level?.certificate ?? "");
  return m ? m[1] : (level?.certificate ?? levelId);
}

export function levelShortTitle(levelId: string): string {
  return (getLevel(levelId)?.title ?? levelId).replace(/^Niveau \d+\s*[—–-]\s*/, "");
}

export function holderName(u: { firstName: string; lastName: string; email?: string }): string {
  return `${u.firstName} ${u.lastName}`.trim() || u.email || "Apprenant";
}

export async function listUserCertificates(userId: string): Promise<Certificate[]> {
  return db.select().from(schema.certificates).where(eq(schema.certificates.userId, userId)).orderBy(desc(schema.certificates.issuedAt));
}

export async function certificateByNumber(number: string) {
  const [row] = await db
    .select({ c: schema.certificates, u: { id: schema.users.id, firstName: schema.users.firstName, lastName: schema.users.lastName, email: schema.users.email } })
    .from(schema.certificates)
    .innerJoin(schema.users, eq(schema.users.id, schema.certificates.userId))
    .where(and(eq(schema.certificates.number, number)))
    .limit(1);
  return row ?? null;
}

export async function certificatePdfInput(c: Certificate, holder: { firstName: string; lastName: string; email?: string }): Promise<CertificatePdfInput> {
  const level = getLevel(c.levelId);
  const programme = getProgramme();
  return {
    number: c.number,
    holder: holderName(holder),
    levelIndex: level?.index ?? Number(c.levelId.slice(1)),
    levelTitle: levelShortTitle(c.levelId),
    certificateTitle: certificateShortTitle(c.levelId),
    hours: level?.hours ?? 0,
    issuedAt: c.issuedAt,
    competences: await certificateCompetences(c.examAttemptId, c.levelId),
    verifyUrl: absoluteUrl(routes.verify(c.number)),
    programmeCode: programme.code,
    organisme: programme.organisme,
    revoked: c.revokedAt !== null,
  };
}
