/**
 * Certificat PDF (pdf-lib, A4 paysage, généré à la volée) — identité Next Formation :
 * fond os, encre, un seul accent violet, filets fins, Archivo en capitales espacées, JetBrains Mono pour les
 * références, QR code vectoriel vers la page publique de vérification.
 *
 * Polices : TTF statiques dérivés des paquets @fontsource-variable (scripts/build-cert-fonts.py) dans
 * public/fonts/certificat ; à défaut, Helvetica (polices standard PDF).
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, setCharacterSpacing, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";

export type CertificatePdfInput = {
  number: string;
  holder: string;
  levelIndex: number;
  levelTitle: string; // « Fondamentaux de l'IA »
  certificateTitle: string; // « Utilisateur IA certifié »
  hours: number;
  issuedAt: Date;
  competences: { code: string; label: string }[];
  verifyUrl: string;
  programmeCode: string; // NF-IA-150
  organisme: string;
  revoked?: boolean;
};

const OS = rgb(0xf3 / 255, 0xf0 / 255, 0xe8 / 255);
const OS_2 = rgb(0xea / 255, 0xe6 / 255, 0xdc / 255);
const ENCRE = rgb(0x0a / 255, 0x0b / 255, 0x0d / 255);
const GRAPHITE = rgb(0x5c / 255, 0x5b / 255, 0x61 / 255);
const PIERRE = rgb(0x8e / 255, 0x8b / 255, 0x83 / 255);
const VIOLET = rgb(0x4b / 255, 0x2a / 255, 0x7f / 255);
const DANGER = rgb(0xc8 / 255, 0x32 / 255, 0x2d / 255);

const FONT_DIR = path.join(process.cwd(), "public", "fonts", "certificat");

type Fonts = { light: PDFFont; medium: PDFFont; body: PDFFont; mono: PDFFont; embedded: boolean };

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  const files = { light: "Archivo-Light.ttf", medium: "Archivo-Medium.ttf", body: "Inter-Regular.ttf", mono: "JetBrainsMono-Regular.ttf" };
  try {
    doc.registerFontkit(fontkit);
    const read = (f: string) => fs.readFileSync(path.join(FONT_DIR, f));
    const [light, medium, body, mono] = await Promise.all([
      doc.embedFont(read(files.light), { subset: true }),
      doc.embedFont(read(files.medium), { subset: true }),
      doc.embedFont(read(files.body), { subset: true }),
      doc.embedFont(read(files.mono), { subset: true }),
    ]);
    return { light, medium, body, mono, embedded: true };
  } catch {
    const [h, hb, c] = await Promise.all([doc.embedFont(StandardFonts.Helvetica), doc.embedFont(StandardFonts.HelveticaBold), doc.embedFont(StandardFonts.Courier)]);
    return { light: h, medium: hb, body: h, mono: c, embedded: false };
  }
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });

/** Texte avec interlettrage (pdf-lib n'a pas d'option : opérateur Tc autour du dessin). */
function text(page: PDFPage, s: string, o: { x: number; y: number; size: number; font: PDFFont; color?: RGB; spacing?: number; align?: "left" | "center" | "right" }) {
  const spacing = o.spacing ?? 0;
  const w = width(s, o.font, o.size, spacing);
  const x = o.align === "center" ? o.x - w / 2 : o.align === "right" ? o.x - w : o.x;
  if (spacing) page.pushOperators(setCharacterSpacing(spacing));
  page.drawText(s, { x, y: o.y, size: o.size, font: o.font, color: o.color ?? ENCRE });
  if (spacing) page.pushOperators(setCharacterSpacing(0));
  return w;
}

function width(s: string, font: PDFFont, size: number, spacing = 0) {
  return font.widthOfTextAtSize(s, size) + spacing * Math.max(0, [...s].length - 1);
}

function wrap(s: string, font: PDFFont, size: number, max: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (width(next, font, size) > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Ajuste la taille pour tenir dans une largeur (noms longs). */
function fit(s: string, font: PDFFont, size: number, max: number, spacing: number) {
  let z = size;
  while (z > 14 && width(s, font, z, spacing * (z / size)) > max) z -= 1;
  return { size: z, spacing: spacing * (z / size) };
}

const line = (page: PDFPage, x1: number, y1: number, x2: number, y2: number, color: RGB = ENCRE, t = 0.6) => page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: t, color });

export async function renderCertificatePdf(c: CertificatePdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Certificat ${c.number}`);
  doc.setAuthor(c.organisme);
  doc.setSubject(`Certificat Next Formation IA — Niveau ${c.levelIndex} « ${c.certificateTitle} »`);
  doc.setCreator("Next Formation IA");
  doc.setProducer("Next Formation IA (pdf-lib)");
  doc.setCreationDate(c.issuedAt);
  doc.setLanguage("fr-FR");
  const f = await loadFonts(doc);
  const caps = (s: string) => (f.embedded ? s.toLocaleUpperCase("fr-FR") : s.toLocaleUpperCase("fr-FR").replace(/[’]/g, "'"));

  const W = 841.89;
  const H = 595.28;
  const page = doc.addPage([W, H]);
  const M = 34; // marge du cadre
  const P = 64; // marge du contenu

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: OS });
  page.drawRectangle({ x: M, y: M, width: W - 2 * M, height: H - 2 * M, borderColor: ENCRE, borderWidth: 0.6 });
  // Bande latérale de l'accent (seul aplat de couleur) : niveau en grand.
  const bandW = 150;
  const bandX = W - M - bandW;
  page.drawRectangle({ x: bandX, y: M, width: bandW, height: H - 2 * M, color: OS_2 });
  line(page, bandX, M, bandX, H - M, ENCRE, 0.6);

  // En-tête
  const top = H - P - 6;
  text(page, "NEXT FORMATION", { x: P, y: top, size: 11, font: f.medium, spacing: 3.2 });
  const nfW = width("NEXT FORMATION", f.medium, 11, 3.2);
  text(page, "IA", { x: P + nfW + 9, y: top, size: 11, font: f.medium, spacing: 3.2, color: VIOLET });
  text(page, c.programmeCode, { x: bandX - 30, y: top, size: 8, font: f.mono, spacing: 1.2, color: GRAPHITE, align: "right" });
  line(page, P, top - 16, bandX - 30, top - 16, ENCRE, 0.6);

  // Bande : niveau
  const cx = bandX + bandW / 2;
  text(page, "NIVEAU", { x: cx, y: H - P - 6, size: 8, font: f.mono, spacing: 2.4, color: GRAPHITE, align: "center" });
  text(page, String(c.levelIndex), { x: cx, y: H - P - 128, size: 118, font: f.light, color: VIOLET, align: "center" });
  text(page, "SUR 4", { x: cx, y: H - P - 150, size: 8, font: f.mono, spacing: 2.4, color: GRAPHITE, align: "center" });

  // Titre
  const left = P;
  const maxW = bandX - 30 - P;
  let y = top - 58;
  text(page, caps("Certificat de réalisation et de compétences"), { x: left, y, size: 8.5, font: f.mono, spacing: 2, color: VIOLET });
  y -= 22;
  text(page, caps("Décerné à"), { x: left, y, size: 8, font: f.mono, spacing: 2, color: GRAPHITE });
  y -= 46;
  const nameCaps = caps(c.holder);
  const nf = fit(nameCaps, f.light, 40, maxW, 3);
  text(page, nameCaps, { x: left, y, size: nf.size, font: f.light, spacing: nf.spacing });
  y -= 30;
  line(page, left, y + 14, left + maxW, y + 14, ENCRE, 0.6);
  const intro = `pour avoir suivi le niveau ${c.levelIndex} de la formation ${c.programmeCode} et réussi son examen final de 40 questions (seuil 70 %).`;
  for (const l of wrap(intro, f.body, 10, maxW)) {
    text(page, l, { x: left, y, size: 10, font: f.body, color: GRAPHITE });
    y -= 14;
  }
  y -= 18;
  const titleCaps = caps(`« ${c.certificateTitle} »`);
  const tf = fit(titleCaps, f.light, 24, maxW, 1.8);
  text(page, titleCaps, { x: left, y, size: tf.size, font: f.light, spacing: tf.spacing, color: VIOLET });
  y -= 18;
  text(page, caps(c.levelTitle), { x: left, y, size: 9, font: f.medium, spacing: 1.8, color: ENCRE });

  // Compétences validées (2 colonnes)
  y -= 30;
  text(page, caps("Compétences validées"), { x: left, y, size: 7.5, font: f.mono, spacing: 1.8, color: GRAPHITE });
  y -= 6;
  line(page, left, y, left + maxW, y, ENCRE, 0.4);
  const colGap = 22;
  const colW = (maxW - colGap) / 2;
  const rows = Math.ceil(c.competences.length / 2);
  const lineH = 10.2;
  const colY = [y - 14, y - 14];
  c.competences.forEach((comp, i) => {
    const col = i < rows ? 0 : 1;
    const x = left + col * (colW + colGap);
    text(page, comp.code, { x, y: colY[col], size: 7.5, font: f.mono, color: VIOLET });
    const lines = wrap(comp.label, f.body, 7.6, colW - 32).slice(0, 3);
    lines.forEach((l, k) => text(page, l, { x: x + 32, y: colY[col] - k * lineH, size: 7.6, font: f.body, color: ENCRE }));
    colY[col] -= lines.length * lineH + 6;
  });

  // Pied : durée, date, numéro + QR
  const footY = M + 64;
  const qrSize = 74;
  line(page, P, footY + 30, bandX - 30 - qrSize - 18, footY + 30, ENCRE, 0.6);
  const facts = [
    { k: "Durée", v: `${c.hours} heures, à distance` },
    { k: "Délivré le", v: dateFmt.format(c.issuedAt) },
    { k: "Numéro", v: c.number },
  ];
  const factW = (maxW - 90) / 3;
  facts.forEach((fct, i) => {
    const x = P + i * factW;
    text(page, caps(fct.k), { x, y: footY + 14, size: 7, font: f.mono, spacing: 1.6, color: GRAPHITE });
    text(page, fct.v, { x, y: footY - 2, size: 10, font: fct.k === "Numéro" ? f.mono : f.body, color: ENCRE });
  });

  // QR code vectoriel
  const qr = QRCode.create(c.verifyUrl, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const cell = qrSize / n;
  const qx = bandX - 30 - qrSize;
  const qy = footY - 28;
  for (let r = 0; r < n; r++)
    for (let col = 0; col < n; col++)
      if (qr.modules.get(r, col)) page.drawRectangle({ x: qx + col * cell, y: qy + (n - 1 - r) * cell, width: cell + 0.05, height: cell + 0.05, color: ENCRE });

  // Mentions
  const mention = "Certificat de réalisation et de compétences Next Formation — prépare aux certifications tierces, ne s'y substitue pas.";
  text(page, mention, { x: P, y: M + 26, size: 7.2, font: f.body, color: GRAPHITE });
  text(page, `Vérification : ${c.verifyUrl}`, { x: P, y: M + 14, size: 7, font: f.mono, color: PIERRE });
  // Bande : organisme
  wrap(c.organisme, f.body, 7.5, bandW - 30).forEach((l, i) => text(page, l, { x: cx, y: M + 26 - i * 10, size: 7.5, font: f.body, color: GRAPHITE, align: "center" }));

  if (c.revoked) {
    page.drawRectangle({ x: P, y: H / 2 - 22, width: bandX - 30 - P, height: 44, color: OS, borderColor: DANGER, borderWidth: 1 });
    text(page, caps("Certificat révoqué"), { x: P + (bandX - 30 - P) / 2, y: H / 2 - 7, size: 18, font: f.medium, spacing: 3, color: DANGER, align: "center" });
  }

  return doc.save();
}
