/**
 * CSV pour Excel (France) : BOM UTF-8, séparateur « ; », fins de ligne CRLF, décimales à virgule.
 * Les cellules commençant par = + - @ (ou tabulation / retour chariot) sont préfixées d'une apostrophe
 * pour neutraliser l'injection de formules.
 */
export const CSV_BOM = "﻿";
export const CSV_SEPARATOR = ";";

export type CsvValue = string | number | boolean | Date | null | undefined;

const parisDateTime = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** « 02/11/2026 14:05:09 » (heure de Paris) — reconnu comme date par Excel FR. */
export function csvDate(d: Date): string {
  return parisDateTime.format(d).replace(",", "");
}

export function csvCell(v: CsvValue): string {
  let s: string;
  if (v === null || v === undefined) s = "";
  else if (v instanceof Date) s = Number.isNaN(v.getTime()) ? "" : csvDate(v);
  else if (typeof v === "number") s = Number.isFinite(v) ? String(Math.round(v * 100) / 100).replace(".", ",") : "";
  else if (typeof v === "boolean") s = v ? "oui" : "non";
  else {
    s = v;
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  }
  return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: readonly string[], rows: readonly (readonly CsvValue[])[]): string {
  const lines = [headers.map(csvCell).join(CSV_SEPARATOR), ...rows.map((r) => r.map(csvCell).join(CSV_SEPARATOR))];
  return CSV_BOM + lines.join("\r\n") + "\r\n";
}
