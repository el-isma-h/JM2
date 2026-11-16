import { NextResponse } from "next/server";
import { readDocument, resolvePublicDownloadToken } from "@/server/documents/store";
import { audit } from "@/server/audit";

/**
 * Téléchargement public d'un document transmis par e-mail (lien temporaire, sans compte).
 * Le jeton est à usage externe uniquement (payload.public) et n'ouvre jamais un lien réservé à un utilisateur.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const resolved = await resolvePublicDownloadToken(token);
  if (!resolved) return new NextResponse("Lien expiré ou invalide.", { status: 404 });
  const found = await readDocument(resolved.documentId);
  if (!found || found.doc.status === "archive") return new NextResponse("Document introuvable.", { status: 404 });
  await audit({ action: "document.download", orgId: found.doc.orgId, entityType: "document", entityId: found.doc.id, after: { public: true, email: resolved.email } });
  return new NextResponse(new Uint8Array(found.data), {
    headers: { "Content-Type": found.doc.mimeType, "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(found.doc.fileName)}`, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
