"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { FiletMarque } from "@/components/ui/logo";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-16 text-center">
      <Warning size={36} weight="light" className="text-danger-ink" aria-hidden />
      <h1 className="mt-6 text-[24px] text-ink sm:text-[30px]">Une erreur est survenue</h1>
      <p className="mt-3 max-w-[50ch] text-[13.5px] text-ink-2">Le problème a été enregistré. Vous pouvez réessayer ou revenir au tableau de bord.</p>
      {error.digest ? <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Référence : {error.digest}</p> : null}
      <FiletMarque className="mt-8" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Réessayer</Button>
        <Button asChild variant="secondary">
          <Link href="/">Tableau de bord</Link>
        </Button>
      </div>
    </main>
  );
}
