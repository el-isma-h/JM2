import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { CHEMIN_UPLOADS, db } from "@/lib/db";
import { utilisateurCourant } from "@/lib/auth";
import { auditer } from "@/lib/journal";

const TYPES: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", png: "image/png" };

/** Pièces KYC : accessibles uniquement à leur propriétaire et aux administrateurs. */
export async function GET(_req: Request, { params }: { params: Promise<{ nom: string }> }) {
  const { nom } = await params;
  if (!/^[a-z]+-[0-9a-f]{24}\.(pdf|jpg|png)$/.test(nom)) return new NextResponse("Not found", { status: 404 });
  const u = await utilisateurCourant();
  if (!u) return new NextResponse("Unauthorized", { status: 401 });
  const proprietaire = db().prepare("SELECT utilisateur_id FROM kyc WHERE piece_identite = ? OR justificatif_domicile = ?").get(nom, nom) as { utilisateur_id: number } | undefined;
  if (!proprietaire || (u.role !== "admin" && proprietaire.utilisateur_id !== u.id)) return new NextResponse("Forbidden", { status: 403 });
  const chemin = path.join(CHEMIN_UPLOADS, nom);
  if (!fs.existsSync(chemin)) return new NextResponse("Not found", { status: 404 });
  if (u.role === "admin") auditer({ id: u.id, email: u.email }, "piece_consultee", nom);
  const ext = nom.split(".").pop() ?? "";
  return new NextResponse(fs.readFileSync(chemin), { headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Content-Disposition": `inline; filename="${nom}"`, "Cache-Control": "private, no-store" } });
}
