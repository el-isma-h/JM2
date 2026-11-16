/**
 * Délivrance des certificats (un actif par apprenant et par niveau). Le PDF (pdf-lib + QR code) est généré à la
 * volée par /api/certificats/[numero]/pdf : rien n'est stocké sur disque.
 * Pas de `server-only` (utilisé aussi par le script de setup) mais à n'importer que côté serveur.
 */
import { and, eq, isNull } from "drizzle-orm";
import { db, schema, type DbOrTx } from "@/db";
import { generateCertificateNumber } from "@/domain/certificate";
import { cryptoRandom } from "@/lib/crypto";

/** Renvoie le certificat actif existant, ou en crée un (numéro unique, régénéré en cas de collision). */
export async function issueCertificate(
  input: { userId: string; levelId: string; examAttemptId: string | null; issuedAt?: Date; number?: string },
  conn: DbOrTx = db,
) {
  const [existing] = await conn
    .select()
    .from(schema.certificates)
    .where(and(eq(schema.certificates.userId, input.userId), eq(schema.certificates.levelId, input.levelId), isNull(schema.certificates.revokedAt)))
    .limit(1);
  if (existing) return existing;
  const issuedAt = input.issuedAt ?? new Date();
  for (let i = 0; i < 5; i++) {
    const number = i === 0 && input.number ? input.number : generateCertificateNumber(input.levelId, issuedAt, cryptoRandom);
    const [row] = await conn
      .insert(schema.certificates)
      .values({ number, userId: input.userId, levelId: input.levelId, examAttemptId: input.examAttemptId, issuedAt })
      .onConflictDoNothing()
      .returning();
    if (row) return row;
  }
  throw new Error("Impossible de générer un numéro de certificat unique.");
}

/** Certificat par numéro (page publique /verifier), avec le nom du titulaire. */
export async function findCertificate(number: string) {
  const [row] = await db
    .select({ c: schema.certificates, firstName: schema.users.firstName, lastName: schema.users.lastName })
    .from(schema.certificates)
    .innerJoin(schema.users, eq(schema.users.id, schema.certificates.userId))
    .where(eq(schema.certificates.number, number))
    .limit(1);
  return row ?? null;
}
