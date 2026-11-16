import { estLocale, type Locale } from "@/i18n/config";

/**
 * Visuel de partage (Open Graph / Twitter) 1200 × 630 généré à la volée.
 * La police par défaut de next/og ne couvre que l'alphabet latin : AR, JA, KO et ZH affichent la version anglaise.
 */
export const TAILLE_PARTAGE = { width: 1200, height: 630 };

const TEXTES: Partial<Record<Locale, { sous: string; demo: string; alt: string }>> & { en: { sous: string; demo: string; alt: string } } = {
  fr: { sous: "Fonds d'investissement tokenisé", demo: "Plateforme de démonstration · non agréée", alt: "NEXT Capital, fonds d'investissement tokenisé : monogramme N sur fond noir, mention plateforme de démonstration" },
  en: { sous: "Tokenised investment fund", demo: "Demonstration platform · unlicensed", alt: "NEXT Capital, tokenised investment fund: N monogram on a black background, demonstration platform notice" },
  it: { sous: "Fondo di investimento tokenizzato", demo: "Piattaforma dimostrativa · non autorizzata", alt: "NEXT Capital, fondo di investimento tokenizzato: monogramma N su fondo nero, piattaforma dimostrativa" },
  es: { sous: "Fondo de inversión tokenizado", demo: "Plataforma de demostración · sin autorización", alt: "NEXT Capital, fondo de inversión tokenizado: monograma N sobre fondo negro, plataforma de demostración" },
  ar: { sous: "Tokenised investment fund", demo: "Demonstration platform · unlicensed", alt: "شعار NEXT Capital على خلفية سوداء، صندوق استثمار مرمَّز، منصة تجريبية" },
  ja: { sous: "Tokenised investment fund", demo: "Demonstration platform · unlicensed", alt: "黒背景にNEXT CapitalのNモノグラム、トークン化投資ファンド、デモ用プラットフォーム" },
  ko: { sous: "Tokenised investment fund", demo: "Demonstration platform · unlicensed", alt: "검은 배경의 NEXT Capital N 모노그램, 토큰화 투자 펀드, 데모 플랫폼" },
  zh: { sous: "Tokenised investment fund", demo: "Demonstration platform · unlicensed", alt: "黑色背景上的 NEXT Capital N 字标，代币化投资基金，演示平台" },
};

export function textes(locale: string) {
  return (estLocale(locale) && TEXTES[locale]) || TEXTES.en;
}

export function altPartage(locale: string): string {
  return textes(locale).alt;
}

