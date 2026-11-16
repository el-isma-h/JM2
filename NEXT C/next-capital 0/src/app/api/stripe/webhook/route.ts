import { NextResponse } from "next/server";
import { stripe, stripeConfigure } from "@/lib/stripe";
import { confirmerDepot } from "@/lib/depots";
import { auditer } from "@/lib/journal";

export async function POST(req: Request) {
  if (!stripeConfigure() || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ ignore: true });
  const signature = req.headers.get("stripe-signature") ?? "";
  const corps = await req.text();
  try {
    const evt = stripe().webhooks.constructEvent(corps, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (evt.type === "checkout.session.completed") {
      const s = evt.data.object as { client_reference_id?: string | null; payment_status?: string };
      if (s.payment_status === "paid" && s.client_reference_id) {
        confirmerDepot(Number(s.client_reference_id), { id: null, email: "stripe-webhook" }, "Paiement par carte / Apple Pay (Stripe)");
      }
    }
    return NextResponse.json({ recu: true });
  } catch (e) {
    auditer({ id: null, email: "stripe-webhook" }, "webhook_invalide", undefined, String(e));
    return NextResponse.json({ erreur: "signature" }, { status: 400 });
  }
}
