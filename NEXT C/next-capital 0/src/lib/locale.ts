import { notFound } from "next/navigation";
import { estLocale, type Locale, LANGUES } from "@/i18n/config";
import { dict } from "@/i18n";

/** Résout la locale d'une page `[locale]` et renvoie le dictionnaire. 404 si inconnue. */
export async function pageLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  return { locale: locale as Locale, t: dict(locale as Locale), intl: LANGUES[locale as Locale].intl, dir: LANGUES[locale as Locale].dir };
}

export function dateLocale(iso: string, intl: string) {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" }).format(d);
}
