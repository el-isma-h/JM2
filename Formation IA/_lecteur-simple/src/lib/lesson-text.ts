/** Préparation du texte des leçons pour le lecteur (fonctions pures). */

/** Retire un éventuel émoji de tête (« 🎯 Ce que… » → « Ce que… »). */
export function cleanHeading(text: string): string {
  return text.replace(/^[\p{Extended_Pictographic}️‍\s]+/u, "").trim() || text;
}

/**
 * Retire du corps Markdown ce que l'en-tête de page affiche déjà : le titre `# …` initial et la ligne de méta
 * `> ⏱ 45 min · …` qui le suit. Le reste du contenu est intact.
 */
export function stripLessonPreamble(body: string): string {
  const lines = body.split(/\r?\n/);
  let i = 0;
  const skipBlank = () => {
    while (i < lines.length && lines[i].trim() === "") i++;
  };
  skipBlank();
  if (/^#\s+/.test(lines[i] ?? "")) {
    i++;
    skipBlank();
    if (/^>\s*⏱/.test(lines[i] ?? "")) {
      i++;
      while (i < lines.length && /^>/.test(lines[i])) i++;
    }
  } else {
    return body;
  }
  return lines.slice(i).join("\n").replace(/^\s+/, "");
}
