/**
 * GET /ia/api/admin/export/[type]?from=AAAA-MM-JJ&to=AAAA-MM-JJ&apprenant=<uuid>
 * Types : preuves | activite | quiz | examens | certificats. Réservé aux rôles admin et trainer.
 * Réponse : text/csv (UTF-8 avec BOM, séparateur « ; »), téléchargement.
 */
import { getSession, isStaff } from "@/server/auth";
import { isExportType } from "@/lib/roles";
import { buildExport, parseDay } from "@/server/admin/exports";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const user = await getSession();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  // 404 plutôt que 403 : on ne révèle pas l'existence des routes d'administration.
  if (!isStaff(user.role)) return Response.json({ error: "not_found" }, { status: 404 });
  const { type } = await params;
  if (!isExportType(type)) return Response.json({ error: "not_found" }, { status: 404 });

  const url = new URL(req.url);
  const userId = url.searchParams.get("apprenant");
  if (userId && !/^[0-9a-f-]{36}$/i.test(userId)) return Response.json({ error: "invalid" }, { status: 400 });
  const from = parseDay(url.searchParams.get("from"));
  const to = parseDay(url.searchParams.get("to"), true);

  const { filename, csv } = await buildExport(type, { from, to, userId });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
