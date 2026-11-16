import type { Metadata } from "next";
import Link from "next/link";
import { peekInvitation } from "@/server/invitations";
import { activateInvitationAction } from "@/server/actions/auth";
import { ActivationForm } from "@/components/auth/activation-form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Activer mon compte" };

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await peekInvitation(decodeURIComponent(token));
  if (!invitation) {
    return (
      <div>
        <p className="etiquette">Invitation</p>
        <h1 className="mt-4 text-[30px] text-ink">Lien invalide</h1>
        <p className="mt-3 text-[13.5px] text-ink-2">Ce lien d&apos;activation a expiré ou a déjà été utilisé. Demandez une nouvelle invitation à votre formateur.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/connexion">Aller à la connexion</Link>
        </Button>
      </div>
    );
  }
  return (
    <div>
      <p className="etiquette">Invitation</p>
      <h1 className="mt-4 text-[30px] text-ink">Activer mon compte</h1>
      <p className="mt-3 text-[13.5px] text-ink-2">
        Compte <strong className="text-ink">{invitation.email}</strong> <StatusBadge status={invitation.role} className="ml-1 align-middle" />
      </p>
      <div className="mt-8">
        <ActivationForm action={activateInvitationAction.bind(null, decodeURIComponent(token))} defaults={{ firstName: invitation.firstName ?? "", lastName: invitation.lastName ?? "" }} />
      </div>
    </div>
  );
}
