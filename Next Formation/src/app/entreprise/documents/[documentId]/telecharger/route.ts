import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getEmployerContext } from "@/server/extranet/context";
import { extranetDownload } from "@/server/extranet/download";
import { audit } from "@/server/audit";
import { issueDownloadLink } from "@/server/documents/store";

/** Documents visibilité `entreprise` du périmètre, plus le PDF des factures adressées à l'entreprise (quelle que soit leur visibilité). */
export async function GET(_req: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const ctx = await getEmployerContext().catch(() => null);
  if (ctx && /^[0-9a-f-]{36}$/i.test(documentId)) {
    const [inv] = await db
      .select({ id: schema.invoices.id })
      .from(schema.invoices)
      .where(and(eq(schema.invoices.orgId, ctx.org.id), eq(schema.invoices.companyId, ctx.company.id), eq(schema.invoices.documentId, documentId)))
      .limit(1);
    if (inv) {
      await audit({ action: "document.extranet_download", userId: ctx.user.id, orgId: ctx.org.id, entityType: "document", entityId: documentId, after: { invoiceId: inv.id } });
      return NextResponse.redirect(await issueDownloadLink(documentId, ctx.user.id), { status: 303 });
    }
  }
  return extranetDownload(getEmployerContext, (c) => ({ scope: { enrollmentIds: c.enrollmentIds, companyId: c.company.id }, visibilities: ["entreprise", "public"] }), documentId, "/entreprise/documents");
}
