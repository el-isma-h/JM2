import { Logo, FiletMarque } from "@/components/ui/logo";
import { getProgramme } from "@/content";

/** Pages publiques d'accès (connexion, invitation, déconnexion) : panneau de marque encre + formulaire. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const prog = getProgramme();
  const modules = prog.levels.reduce((s, l) => s + l.modules.length, 0);
  const lessons = prog.levels.reduce((s, l) => s + l.modules.reduce((t, m) => t + m.lessons.length, 0), 0);
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="sombre relative hidden overflow-hidden bg-encre p-12 text-os lg:flex lg:flex-col lg:justify-between">
        <Logo clair taille={26} />
        <div>
          <p className="etiquette">{prog.code}</p>
          <p className="titre-geant mt-6 text-[52px] xl:text-[64px]">
            De zéro
            <br />à expert
          </p>
          <p className="mt-6 max-w-[42ch] font-serif text-[22px] italic leading-snug text-os/80">
            {prog.levels.length} niveaux, {modules} modules, {lessons} leçons — à votre rythme, avec un tuteur IA à chaque leçon.
          </p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <FiletMarque />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-os/45">{prog.totalHours} h · distanciel</p>
        </div>
        <span className="filigrane pointer-events-none absolute -right-8 bottom-24 text-[260px]" aria-hidden>
          IA
        </span>
      </aside>
      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo taille={22} />
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}
