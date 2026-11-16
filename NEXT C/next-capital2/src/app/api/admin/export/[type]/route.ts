import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { utilisateurCourant } from "@/lib/auth";
import { auditer } from "@/lib/journal";

const REQUETES: Record<string, string> = {
  utilisateurs: "SELECT id, email, role, prenom, nom, langue, telephone, pays, statut_kyc, adhesion_niveau, adhesion_payee_le, adhesion_expire_le, cree_le FROM utilisateurs ORDER BY id",
  mouvements: "SELECT m.id, u.email, m.type, m.montant_cents, m.tokens_centi, m.solde_apres_cents, m.tokens_apres_centi, m.reference, m.description, m.cree_le FROM mouvements m JOIN utilisateurs u ON u.id = m.utilisateur_id ORDER BY m.id",
  souscriptions: "SELECT s.id, u.email, s.reference, s.niveau, s.montant_cents, s.frais_cents, s.net_cents, s.tokens_centi, s.cree_le FROM souscriptions s JOIN utilisateurs u ON u.id = s.utilisateur_id ORDER BY s.id",
  depots: "SELECT d.id, u.email, d.methode, d.reference, d.montant_cents, d.statut, d.cree_le, d.confirme_le FROM depots d JOIN utilisateurs u ON u.id = d.utilisateur_id ORDER BY d.id",
};

function csv(lignes: Record<string, unknown>[]): string {
  if (lignes.length === 0) return "";
  const cles = Object.keys(lignes[0]);
  const ech = (v: unknown) => { const s = v === null || v === undefined ? "" : String(v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cles.join(";"), ...lignes.map((l) => cles.map((k) => ech(l[k])).join(";"))].join("\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const u = await utilisateurCourant();
  if (!u || u.role !== "admin") return new NextResponse("Forbidden", { status: 403 });
  const sql = REQUETES[type];
  if (!sql) return new NextResponse("Not found", { status: 404 });
  const lignes = db().prepare(sql).all() as Record<string, unknown>[];
  auditer({ id: u.id, email: u.email }, "export_csv", type, { lignes: lignes.length });
  return new NextResponse("﻿" + csv(lignes), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="next-capital-${type}.csv"` } });
}
