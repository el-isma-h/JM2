import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { requireRole } from "@/server/auth";
import { db, schema } from "@/db";
import { EXPORT_TYPES } from "@/lib/roles";
import { EXPORT_META } from "@/server/admin/exports";
import { routes } from "@/lib/paths";
import { PageHeader } from "@/components/ui/surface";
import { ExportsPanel } from "@/components/admin/exports-panel";

export const metadata: Metadata = { title: "Exports FOAD" };
export const dynamic = "force-dynamic";

const COLUMNS: Record<string, string> = {
  preuves: "apprenant, leçon, première ouverture, fin, temps total et sur la période, questions au tuteur, meilleur score du quiz",
  activite: "date, apprenant, minutes, leçons consultées et terminées, quiz, examens, tuteur, connexions, première et dernière activité",
  quiz: "date, apprenant, module, bonnes réponses, score, réussite",
  examens: "apprenant, niveau, n° de tentative, début, échéance, soumission, durée, score, réussite, annulation",
  certificats: "numéro, apprenant, niveau, émission, statut, révocation, lien de vérification",
};

export default async function AdminExportsPage() {
  await requireRole("admin", "trainer");
  const learners = await db
    .select({ id: schema.users.id, firstName: schema.users.firstName, lastName: schema.users.lastName, email: schema.users.email, isDemo: schema.users.isDemo })
    .from(schema.users)
    .where(eq(schema.users.role, "learner"))
    .orderBy(asc(schema.users.lastName), asc(schema.users.firstName));
  return (
    <div>
      <PageHeader
        title="Exports FOAD"
        description="Les preuves de réalisation d'une formation à distance : temps passé par leçon, dates d'ouverture et de fin, scores et tentatives. À joindre aux dossiers de financement (OPCO, CPF) ou à archiver."
        breadcrumb={[{ label: "Administration", href: routes.admin }, { label: "Exports" }]}
      />
      <ExportsPanel
        items={EXPORT_TYPES.map((t) => ({ type: t, title: EXPORT_META[t].title, description: EXPORT_META[t].description, columns: COLUMNS[t] }))}
        learners={learners.map((l) => ({ id: l.id, name: `${`${l.lastName} ${l.firstName}`.trim() || l.email}${l.isDemo ? " (démo)" : ""}` }))}
      />
    </div>
  );
}
