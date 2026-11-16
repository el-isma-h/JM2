import Link from "next/link";
import { Logo, FiletMarque } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <Logo taille={26} />
      <p className="filigrane mt-10 text-[120px] sm:text-[180px]" aria-hidden>
        404
      </p>
      <h1 className="-mt-6 text-[26px] text-ink sm:text-[32px]">Page introuvable</h1>
      <p className="mt-3 max-w-[46ch] text-[13.5px] text-ink-2">Cette page n&apos;existe pas, a été déplacée ou ne vous est pas accessible.</p>
      <FiletMarque className="mt-8" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Tableau de bord</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/parcours">Parcours</Link>
        </Button>
      </div>
    </main>
  );
}
