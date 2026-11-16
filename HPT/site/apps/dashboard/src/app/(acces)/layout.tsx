import { LockKey, ShieldCheck, HardDrives, Robot } from "@phosphor-icons/react/dist/ssr";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LogoHpt } from "@/interface/ui/Logo";
import { config } from "@/serveur/lib/config";

const GARANTIES = [
  { icone: LockKey, texte: "Chaque pièce chiffrée en AES-256 avec une clé propre à votre entreprise" },
  { icone: HardDrives, texte: "Stockage sur l'infrastructure locale de HPT GIE, aucun cloud tiers" },
  { icone: Robot, texte: "Agents IA de cybersécurité en surveillance continue" },
  { icone: ShieldCheck, texte: "Chaque accès consigné dans un journal infalsifiable" },
];

export default function AccesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100dvh] grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden lg:flex flex-col justify-between p-12 border-r border-filet bg-fond-2 overflow-hidden">
        <div className="absolute inset-0 trame opacity-60" aria-hidden />
        <div className="relative flex items-center gap-3">
          <LogoHpt className="h-10 w-auto text-texte" />
          <span className="text-sm text-texte-3">Coffre-fort</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-[2.5rem] font-semibold leading-[1.08]">Vos pièces sensibles, sous clé.</h1>
          <ul className="mt-10 flex flex-col gap-5">
            {GARANTIES.map(({ icone: Icone, texte }) => (
              <li key={texte} className="flex gap-3.5 text-texte-2">
                <Icone className="size-5 shrink-0 mt-0.5 text-signal" weight="duotone" />
                <span>{texte}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-4 text-sm text-texte-3">
          <p>HPT GIE. Optimiser aujourd&apos;hui. Performer demain.</p>
          {config.siteUrl && (
            <a href={config.siteUrl} className="inline-flex items-center gap-1.5 hover:text-texte underline-offset-4 hover:underline">
              <ArrowLeft className="size-3.5" /> Retour au site HPT GIE
            </a>
          )}
        </div>
      </aside>
      <div className="flex flex-col justify-center px-4 sm:px-10 py-12">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <LogoHpt className="h-9 w-auto" />
          <span className="text-sm text-texte-3">Coffre-fort</span>
          {config.siteUrl && (
            <a href={config.siteUrl} className="ml-auto text-sm text-texte-3 hover:text-texte">
              Retour au site
            </a>
          )}
        </div>
        <div className="w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-[12%]">{children}</div>
      </div>
    </main>
  );
}
