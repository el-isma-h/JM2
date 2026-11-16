import { requireRole } from "@/server/auth";

/** Espace administration / formateur. Chaque page appelle aussi requireRole() (voir (app)/layout.tsx). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin", "trainer");
  return children;
}
