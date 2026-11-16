/**
 * GET /ia/api/certificats/[numero]/pdf — certificat PDF généré à la volée.
 * Réservé au titulaire et aux administrateurs (404 pour tout autre compte : on ne révèle pas l'existence du numéro).
 */
import { getSession } from "@/server/auth";
import { normalizeCertificateNumber } from "@/domain";
import { certificateByNumber, certificatePdfInput } from "@/server/certificate-data";
import { renderCertificatePdf } from "@/server/certificate-pdf";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ numero: string }> }) {
  const user = await getSession();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const { numero } = await params;
  const number = normalizeCertificateNumber(decodeURIComponent(numero));
  if (!number) return Response.json({ error: "not_found" }, { status: 404 });
  const row = await certificateByNumber(number);
  if (!row || (row.c.userId !== user.id && user.role !== "admin")) return Response.json({ error: "not_found" }, { status: 404 });
  const bytes = await renderCertificatePdf(await certificatePdfInput(row.c, row.u));
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${number}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
