import { eq, sql } from "drizzle-orm";
import { db } from "@/serveur/db";
import { conversations } from "@/serveur/db/schema";
import { Coque } from "@/interface/coque/Coque";
import { Protection } from "@/interface/coque/Protection";
import { abonnementDe } from "@/serveur/lib/abonnement";
import { exiger } from "@/serveur/lib/securite/session";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const s = await exiger({ equipe: false });
  const [abo, [nonLus]] = await Promise.all([
    abonnementDe(s.compte.id),
    db.select({ n: sql<number>`coalesce(sum(${conversations.nonLuClient}), 0)::int` }).from(conversations).where(eq(conversations.clientId, s.compte.id)),
  ]);
  return (
    <Coque
      session={s}
      abonnement={abo}
      espace="client"
      barre={<Protection />}
      liens={[
        { href: "/espace", libelle: "Tableau de bord", icone: "tableau" },
        { href: "/espace/coffre", libelle: "Coffre-fort", icone: "coffre" },
        { href: "/espace/messages", libelle: "Messages", icone: "messages", compteur: nonLus.n },
        { href: "/espace/abonnement", libelle: "Abonnement", icone: "abonnement" },
        { href: "/espace/securite", libelle: "Sécurité", icone: "securite" },
        { href: "/espace/profil", libelle: "Mon entreprise", icone: "profil" },
      ]}
    >
      {children}
    </Coque>
  );
}
