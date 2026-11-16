import { handleAuthError } from "@/server/guard";
import { requireUser } from "@/server/auth";
import { guardEmployer } from "@/server/extranet/guard";
import { employerNav } from "@/components/app/nav";
import { ExtranetShell } from "@/components/extranet/shell";

export const dynamic = "force-dynamic";

/** Extranet entreprise / tuteur : sans session → /connexion?next=/entreprise ; sans rattachement → état vide. */
export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    handleAuthError(e, "/entreprise");
    throw e;
  }
  const ctx = await guardEmployer("/entreprise");
  return (
    <ExtranetShell base="/entreprise" items={ctx ? employerNav : []} user={user} org={ctx?.org ?? null} choices={ctx?.choices ?? []} subtitle={ctx ? `${ctx.company.name} · Espace entreprise` : undefined}>
      {children}
    </ExtranetShell>
  );
}
