import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe, stripeConfigure, urlSite } from "@/lib/stripe";
import { confirmerDepot } from "@/lib/depots";
import type { Depot } from "@/lib/types";

/** Retour après Stripe Checkout : vérification côté serveur du statut de la session, puis crédit du wallet. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const depotId = Number(url.searchParams.get("depot"));
  const sessionId = url.searchParams.get("session_id");
  const depot = db().prepare("SELECT * FROM depots WHERE id = ?").get(depotId) as Depot | undefined;
  const u = depot ? (db().prepare("SELECT langue FROM utilisateurs WHERE id = ?").get(depot.utilisateur_id) as { langue: string }) : null;
  const l = u?.langue ?? "fr";
  if (!depot || !sessionId || !stripeConfigure()) return NextResponse.redirect(`${urlSite()}/${l}/compte/wallet?erreur=generique`);
  try {
    const s = await stripe().checkout.sessions.retrieve(sessionId);
    if (s.payment_status === "paid" && String(s.client_reference_id) === String(depotId)) {
      confirmerDepot(depotId, { id: null, email: "stripe" }, "Paiement par carte / Apple Pay (Stripe)");
      return NextResponse.redirect(`${urlSite()}/${l}/compte/wallet?ok=carte`);
    }
  } catch { /* on tombe sur l'erreur générique */ }
  return NextResponse.redirect(`${urlSite()}/${l}/compte/wallet?erreur=generique`);
}
