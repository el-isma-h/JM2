export const LOCALES = ["fr", "en", "ar", "ja", "ko", "zh", "it", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_DEFAUT: Locale = "fr";

export const LANGUES: Record<Locale, { nom: string; dir: "ltr" | "rtl"; intl: string }> = {
  fr: { nom: "Français", dir: "ltr", intl: "fr-FR" },
  en: { nom: "English", dir: "ltr", intl: "en-GB" },
  ar: { nom: "العربية", dir: "rtl", intl: "ar-AE" },
  ja: { nom: "日本語", dir: "ltr", intl: "ja-JP" },
  ko: { nom: "한국어", dir: "ltr", intl: "ko-KR" },
  zh: { nom: "中文", dir: "ltr", intl: "zh-CN" },
  it: { nom: "Italiano", dir: "ltr", intl: "it-IT" },
  es: { nom: "Español", dir: "ltr", intl: "es-ES" },
};

export function estLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}
