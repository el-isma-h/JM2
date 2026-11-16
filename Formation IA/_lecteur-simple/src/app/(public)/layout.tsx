import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/** Pages publiques (sans connexion) : vérification de certificat. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-8">
        <Link href="/connexion" aria-label="Next Formation IA">
          <Logo taille={22} />
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8">{children}</main>
    </div>
  );
}
