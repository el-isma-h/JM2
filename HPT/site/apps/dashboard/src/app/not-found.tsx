import Link from "next/link";

export default function Introuvable() {
  return (
    <main className="min-h-[100dvh] grid place-items-center px-4">
      <div className="text-center">
        <p className="chiffres text-texte-3">404</p>
        <h1 className="text-2xl font-semibold mt-2">Page introuvable</h1>
        <Link href="/acces" className="inline-block mt-6 text-signal underline underline-offset-4">
          Revenir au tableau de bord
        </Link>
      </div>
    </main>
  );
}
