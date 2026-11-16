import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { utilisateurCourant } from "@/lib/auth";
import type { Souscription, Utilisateur } from "@/lib/types";
import { FONDS, formatEuros, formatTokens } from "@/config/fonds";

function echapper(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)); }

/** Attestation de souscription imprimable (HTML). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await utilisateurCourant();
  if (!u) return new NextResponse("Unauthorized", { status: 401 });
  const s = db().prepare("SELECT * FROM souscriptions WHERE id = ?").get(Number(id)) as Souscription | undefined;
  if (!s || (u.role !== "admin" && s.utilisateur_id !== u.id)) return new NextResponse("Not found", { status: 404 });
  const porteur = db().prepare("SELECT * FROM utilisateurs WHERE id = ?").get(s.utilisateur_id) as Utilisateur;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Attestation ${echapper(s.reference)}</title>
<style>body{font-family:Georgia,serif;color:#0a1a33;max-width:720px;margin:48px auto;padding:0 24px;line-height:1.5}h1{font-weight:500;font-size:28px;margin:0 0 4px}.sur{font:11px/1 sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6b7690}table{width:100%;border-collapse:collapse;margin-top:24px;font-family:sans-serif;font-size:14px}td{padding:10px 0;border-bottom:1px solid #d9dee8}td:first-child{color:#6b7690;width:45%}.note{margin-top:32px;font:12px/1.5 sans-serif;color:#6b7690;border-left:2px solid #c6a35c;padding-left:12px}@media print{body{margin:0}}</style></head><body>
<p class="sur">${FONDS.nom} · Attestation de souscription · Démonstration</p>
<h1>${echapper(s.reference)}</h1>
<table>
<tr><td>Porteur</td><td>${echapper(porteur.prenom)} ${echapper(porteur.nom)} (${echapper(porteur.email)})</td></tr>
<tr><td>Date</td><td>${echapper(s.cree_le)} UTC</td></tr>
<tr><td>Montant souscrit</td><td>${formatEuros(s.montant_cents)}</td></tr>
<tr><td>Frais de structuration (${echapper(s.niveau)})</td><td>${formatEuros(s.frais_cents)}</td></tr>
<tr><td>Montant net investi</td><td>${formatEuros(s.net_cents)}</td></tr>
<tr><td>Tokens ${FONDS.token.symbole} attribués</td><td><strong>${formatTokens(s.tokens_centi)}</strong></td></tr>
<tr><td>Prix d'émission</td><td>1 ${FONDS.token.symbole} = ${formatEuros(FONDS.token.prixEmissionCents)}</td></tr>
<tr><td>Registre</td><td>Registre interne de la plateforme (phase 1)</td></tr>
</table>
<p class="note">Document généré par une plateforme de démonstration. Il ne constitue pas un titre financier. Investir dans des sociétés non cotées présente un risque de perte en capital et de liquidité.</p>
</body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
}
