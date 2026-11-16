import { requireUser } from "@/server/auth";
import { logoutAction } from "@/server/actions/auth";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/feedback/toaster";

/**
 * Coque des pages connectées. ATTENTION : ce layout ne suffit pas à protéger les pages (il n'est pas ré-exécuté à
 * chaque navigation) — chaque page appelle elle-même requireUser() / requireRole().
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <AppShell user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isDemo: user.isDemo }} logoutAction={logoutAction}>
      {children}
      <Toaster />
    </AppShell>
  );
}
