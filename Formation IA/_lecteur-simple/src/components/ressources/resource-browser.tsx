"use client";

/** Bibliothèque de liens : recherche instantanée (accents ignorés) et filtre par section. */
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { ResourceSection } from "@/content/types";
import { filterResources, hostOf } from "@/lib/resource-filter";
import { cn, plural } from "@/lib/utils";

/** « 1. Anthropic & Claude » → « Anthropic & Claude » (numéro affiché à part). */
function splitNumber(title: string): { n: string | null; text: string } {
  const m = /^(\d+)[.)]?\s+(.*)$/.exec(title);
  return m ? { n: m[1], text: m[2] } : { n: null, text: title };
}

export function ResourceBrowser({ sections, total }: { sections: ResourceSection[]; total: number }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const [section, setSection] = React.useState<string | null>(null);
  const deferred = React.useDeferredValue(query);
  const result = React.useMemo(() => filterResources(sections, deferred, section), [sections, deferred, section]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && t?.tagName !== "INPUT" && t?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:top-0 lg:-mx-12 lg:px-12">
        <label htmlFor="res-search" className="sr-only">
          Rechercher un lien
        </label>
        <div className="relative">
          <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
          <input
            ref={inputRef}
            id="res-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil, une documentation, un cours…"
            autoComplete="off"
            className="h-12 w-full border border-line-strong bg-bg-elev pl-10 pr-20 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink-3 hover:text-ink" aria-label="Effacer la recherche">
              <X size={14} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 border border-line-strong px-1.5 font-mono text-[10px] text-ink-3 sm:block">/</kbd>
          )}
        </div>
        <div className="scrollbar-thin -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrer par section">
          <Chip active={section === null} onClick={() => setSection(null)}>
            Tout
          </Chip>
          {sections.map((s) => (
            <Chip key={s.id} active={section === s.id} onClick={() => setSection(section === s.id ? null : s.id)}>
              {splitNumber(s.title).text}
            </Chip>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3" aria-live="polite">
          {result.count === total && !section ? plural(total, "lien") : `${plural(result.count, "lien")} sur ${total}`}
        </p>
      </div>

      {result.count === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-[15px] font-light uppercase tracking-[0.06em] text-ink">Aucun lien ne correspond</p>
          <p className="mt-2 text-[13px] text-ink-2">Essayez un autre mot, ou retirez le filtre de section.</p>
          <button type="button" onClick={() => (setQuery(""), setSection(null))} className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent hover:underline">
            Tout afficher
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          <AnimatePresence initial={false}>
            {result.sections.map((s) => {
              const t = splitNumber(s.title);
              return (
                <motion.section key={s.id} layout={!reduce} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-labelledby={`sec-${s.id}`}>
                  <div className="flex items-baseline gap-4 border-b border-line-strong pb-3">
                    {t.n ? <span className="num text-[13px] text-accent">{t.n.padStart(2, "0")}</span> : null}
                    <h2 id={`sec-${s.id}`} className="text-[18px] text-ink sm:text-[20px]">
                      {t.text}
                    </h2>
                  </div>
                  {s.intro && !deferred ? <p className="mt-3 max-w-[72ch] text-[13px] text-ink-2">{s.intro.replace(/[*_`]/g, "")}</p> : null}
                  {s.subsections.map((sub) => (
                    <div key={sub.id} className="mt-6">
                      {sub.title !== s.title ? <h3 className="font-mono text-[10px] font-medium tracking-[0.2em] text-ink-3">{sub.title}</h3> : null}
                      <ul className="mt-2 divide-y divide-line">
                        {sub.links.map((l) => (
                          <li key={l.url + l.title}>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="group grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_200px] sm:gap-6">
                              <span className="min-w-0">
                                <span className="inline-flex items-center gap-2 text-[14px] text-ink group-hover:text-accent">
                                  {l.title}
                                  <ArrowSquareOut size={12} className="shrink-0 text-ink-3 group-hover:text-accent" aria-hidden />
                                  {l.flag ? <span className="text-[12px]">{l.flag}</span> : null}
                                </span>
                                {l.description ? <span className="mt-0.5 block text-[12.5px] text-ink-2">{l.description.replace(/[*_`]/g, "")}</span> : null}
                              </span>
                              <span className="truncate font-mono text-[10.5px] text-ink-3 sm:pt-1 sm:text-right">{hostOf(l.url)}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.section>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-8 shrink-0 whitespace-nowrap border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300",
        active ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
