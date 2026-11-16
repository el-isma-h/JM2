import { and, eq, lte, sql } from "drizzle-orm";
import { db } from "@/serveur/db";
import { alertes, conversations, courrielsRecus, echeances, prospects, propositions } from "@/serveur/db/schema";
import { Coque } from "@/interface/coque/Coque";
import { Protection } from "@/interface/coque/Protection";
import type { LienNav } from "@/interface/coque/Navigation";
import { exiger } from "@/serveur/lib/securite/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await exiger({ equipe: true });
  const dans7Jours = new Date(Date.now() + 7 * 86_400_000);
  const [[messages], [ouvertes], [aValider], [recus], [echeances7], [prospectsNouveaux]] = await Promise.all([
    db.select({ n: sql<number>`coalesce(sum(${conversations.nonLuHpt}), 0)::int` }).from(conversations),
    db.select({ n: sql<number>`count(*)::int` }).from(alertes).where(eq(alertes.statut, "ouverte")),
    db.select({ n: sql<number>`count(*)::int` }).from(propositions).where(eq(propositions.statut, "a_valider")),
    db.select({ n: sql<number>`count(*)::int` }).from(courrielsRecus).where(eq(courrielsRecus.statut, "recu")),
    db.select({ n: sql<number>`count(*)::int` }).from(echeances).where(and(eq(echeances.statut, "a_venir"), lte(echeances.date, dans7Jours))),
    db.select({ n: sql<number>`count(*)::int` }).from(prospects).where(eq(prospects.statut, "nouveau")),
  ]);
  const liens: LienNav[] = [
    { href: "/admin", libelle: "Vue d'ensemble", icone: "tableau" },
    { href: "/admin/coffre", libelle: "Mon coffre", icone: "coffre" },
    { href: "/admin/atelier", libelle: "Ateliers", icone: "atelier" },
    { href: "/admin/courrier", libelle: "Courrier", icone: "courrier", compteur: recus.n },
    { href: "/admin/contacts", libelle: "Carnet d'adresses", icone: "contacts" },
    { href: "/admin/echeancier", libelle: "Échéancier", icone: "echeancier", compteur: echeances7.n },
    { href: "/admin/prospects", libelle: "Prospects", icone: "prospects", compteur: prospectsNouveaux.n },
    { href: "/admin/clients", libelle: "Clients", icone: "clients" },
    { href: "/admin/a-valider", libelle: "À valider", icone: "valider", compteur: aValider.n },
    { href: "/admin/ecosysteme", libelle: "Écosystème Next", icone: "ecosysteme" },
    { href: "/admin/agents", libelle: "Armée d'agents", icone: "agents" },
    { href: "/admin/envois", libelle: "Envois vers Next", icone: "envois" },
    { href: "/admin/messages", libelle: "Messages", icone: "messages", compteur: messages.n },
    { href: "/admin/securite", libelle: "Centre de sécurité", icone: "alertes", compteur: ouvertes.n },
    { href: "/admin/journal", libelle: "Journal d'audit", icone: "journal" },
    ...(s.compte.role === "admin"
      ? ([
          { href: "/admin/formules", libelle: "Formules", icone: "formules" },
          { href: "/admin/equipe", libelle: "Équipe HPT", icone: "equipe" },
          { href: "/admin/developpeur", libelle: "Développeur", icone: "developpeur" },
          { href: "/admin/sante", libelle: "Santé du système", icone: "sante" },
        ] satisfies LienNav[])
      : []),
    { href: "/admin/mon-compte", libelle: "Mon compte", icone: "securite" },
  ];
  return (
    <Coque session={s} abonnement={null} espace="admin" barre={<Protection />} liens={liens}>
      {children}
    </Coque>
  );
}
