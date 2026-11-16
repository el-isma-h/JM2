import fr, { type Dict } from "./dictionnaires/fr";
import en from "./dictionnaires/en";
import ar from "./dictionnaires/ar";
import ja from "./dictionnaires/ja";
import ko from "./dictionnaires/ko";
import zh from "./dictionnaires/zh";
import it from "./dictionnaires/it";
import es from "./dictionnaires/es";
import type { Locale } from "./config";

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K] };

function fusion<T>(base: T, surcharge: DeepPartial<T> | undefined): T {
  if (!surcharge) return base;
  if (Array.isArray(base)) return (surcharge as unknown as T) ?? base;
  if (typeof base !== "object" || base === null) return (surcharge as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(surcharge as Record<string, unknown>)) {
    if (v === undefined) continue;
    const b = (base as Record<string, unknown>)[k];
    out[k] = typeof b === "object" && b !== null && !Array.isArray(b) && typeof v === "object" && v !== null && !Array.isArray(v) ? fusion(b, v as DeepPartial<typeof b>) : v;
  }
  return out as T;
}

const partiels: Record<string, DeepPartial<Dict>> = { ar, ja, ko, zh, it, es };
const cache = new Map<Locale, Dict>();

/** Dictionnaire complet : FR et EN sont intégraux ; les autres langues sont complétées par l'anglais. */
export function dict(locale: Locale): Dict {
  if (locale === "fr") return fr;
  if (locale === "en") return en;
  const c = cache.get(locale);
  if (c) return c;
  const d = fusion(en, partiels[locale]);
  cache.set(locale, d);
  return d;
}

export type { Dict };
