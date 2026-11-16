/**
 * Lecture du contenu de la formation depuis CONTENT_DIR (défaut : dossier parent de l'app, `..`).
 *
 * - Aucune duplication : les fichiers programme/, niveaux/, examens/, ressources/ sont lus tels quels.
 * - Cache mémoire par fichier, invalidé si la date de modification change (édition à chaud en dev, gratuit en prod).
 * - Validation zod : une erreur de format lève une exception explicite (fichier + chemin du champ).
 *
 * Ce module n'importe pas `server-only` pour rester utilisable par les scripts et les tests ;
 * les pages et composants serveur importent `@/content` (index.ts), qui, lui, est protégé.
 */
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { applyExamOrder, type ExamOrder } from "@/domain/exam";
import type { ProgrammeStructure } from "@/domain/types";
import type {
  Exam,
  ExamQuestion,
  Heading,
  Lesson,
  LessonFrontMatter,
  LessonNavigation,
  LevelDetail,
  ModuleDetail,
  ModuleMeta,
  Programme,
  ProgrammeLevel,
  ProgrammeModule,
  PublicExam,
  PublicExamQuestion,
  PublicQuiz,
  PublicQuizQuestion,
  Quiz,
  QuizQuestion,
  ResourceLibrary,
  ResourceLink,
  ResourceSection,
} from "./types";

// ---------- Emplacement ----------

export function contentDir(): string {
  return process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.resolve(/* turbopackIgnore: true */ process.cwd(), "..");
}

function p(...parts: string[]): string {
  return path.join(contentDir(), ...parts);
}

export class ContentError extends Error {
  constructor(message: string) {
    super(`[contenu] ${message}`);
    this.name = "ContentError";
  }
}

// ---------- Cache ----------

const cache = new Map<string, { mtimeMs: number; value: unknown }>();

function cached<T>(file: string, key: string, build: (raw: string) => T): T {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(file);
  } catch {
    throw new ContentError(`fichier introuvable : ${file} (CONTENT_DIR=${contentDir()})`);
  }
  const k = `${key}:${file}`;
  const hit = cache.get(k);
  if (hit && hit.mtimeMs === stat.mtimeMs) return hit.value as T;
  const value = build(fs.readFileSync(file, "utf8"));
  cache.set(k, { mtimeMs: stat.mtimeMs, value });
  return value;
}

/** Vide le cache (tests, rechargement manuel). */
export function clearContentCache(): void {
  cache.clear();
  dirIndex = null;
}

function parseWith<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const issue = r.error.issues[0];
    throw new ContentError(`${path.relative(contentDir(), file)} : ${issue.path.join(".") || "(racine)"} — ${issue.message}`);
  }
  return r.data;
}

function readJson<T>(file: string, schema: z.ZodType<T>): T {
  return cached(file, "json", (raw) => {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new ContentError(`${file} : JSON invalide (${(e as Error).message})`);
    }
    return parseWith(schema, data, file);
  });
}

// ---------- Schémas ----------

const sourceSchema = z.object({ title: z.string(), url: z.string(), lang: z.string().optional() });
const lessonRefSchema = z.object({ id: z.string(), title: z.string(), minutes: z.number() });

const programmeSchema: z.ZodType<Programme> = z.object({
  code: z.string(),
  title: z.string(),
  subtitle: z.string().default(""),
  version: z.string().default("1.0.0"),
  versionDate: z.string().default(""),
  language: z.string().default("fr"),
  organisme: z.string().default(""),
  totalHours: z.number(),
  modality: z.string().default("distanciel"),
  passScore: z.number().default(70),
  quizPerModule: z.number().default(10),
  examPerLevel: z.number().default(40),
  levels: z.array(
    z.object({
      id: z.string().regex(/^N\d$/),
      code: z.string(),
      title: z.string(),
      hours: z.number(),
      audience: z.string().default(""),
      prerequisites: z.string().default(""),
      certificate: z.string().default(""),
      alignedWith: z.array(z.string()).default([]),
      examMinutes: z.number().default(60),
      modules: z.array(
        z.object({
          id: z.string().regex(/^M\d{2}$/),
          title: z.string(),
          hours: z.number(),
          minutes: z.number(),
          quizMinutes: z.number().default(15),
          lessons: z.array(lessonRefSchema),
        }),
      ),
    }),
  ),
});

const moduleSchema = z.object({
  id: z.string(),
  level: z.string(),
  title: z.string(),
  minutes: z.number(),
  description: z.string().default(""),
  objectives: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  alignedWith: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).default([]),
  // FORMAT.md autorise une liste d'ids ; les fichiers actuels contiennent des objets avec `file`.
  lessons: z.array(z.union([z.string(), lessonRefSchema.extend({ file: z.string().optional() })])),
});

const frontMatterSchema: z.ZodType<LessonFrontMatter> = z.object({
  id: z.string(),
  module: z.string(),
  level: z.string(),
  title: z.string(),
  minutes: z.number(),
  objectives: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).default([]),
});

const questionSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  type: z.enum(["qcm", "vrai_faux", "trouve_erreur", "mise_en_situation"]),
  q: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().min(0),
  explanation: z.string(),
  source: sourceSchema.optional(),
});

const quizSchema: z.ZodType<Quiz> = z.object({
  moduleId: z.string(),
  title: z.string(),
  passScore: z.number().default(70),
  questions: z.array(questionSchema),
});

const examSchema: z.ZodType<Exam> = z.object({
  levelId: z.string(),
  title: z.string(),
  passScore: z.number().default(70),
  timeLimitMinutes: z.number().default(60),
  competences: z.record(z.string(), z.array(z.string())).default({}),
  questions: z.array(questionSchema.extend({ competence: z.string() })),
});

// ---------- Index des dossiers ----------

type DirIndex = { levels: Map<string, string>; modules: Map<string, { levelId: string; dir: string }> };
let dirIndex: { mtimeMs: number; value: DirIndex } | null = null;

/** niveaux/N1-xxx/M01-yyy : correspondance id → dossier (les noms de dossiers ne sont pas dans programme.json). */
function directories(): DirIndex {
  const root = p("niveaux");
  let mtimeMs = 0;
  try {
    mtimeMs = fs.statSync(root).mtimeMs;
  } catch {
    throw new ContentError(`dossier introuvable : ${root}`);
  }
  if (dirIndex && dirIndex.mtimeMs === mtimeMs) return dirIndex.value;
  const levels = new Map<string, string>();
  const modules = new Map<string, { levelId: string; dir: string }>();
  for (const lv of fs.readdirSync(root, { withFileTypes: true })) {
    const m = /^(N\d)-/.exec(lv.name);
    if (!lv.isDirectory() || !m) continue;
    const levelDir = path.join(root, lv.name);
    levels.set(m[1], levelDir);
    for (const md of fs.readdirSync(levelDir, { withFileTypes: true })) {
      const mm = /^(M\d{2})-/.exec(md.name);
      if (md.isDirectory() && mm) modules.set(mm[1], { levelId: m[1], dir: path.join(levelDir, md.name) });
    }
  }
  dirIndex = { mtimeMs, value: { levels, modules } };
  return dirIndex.value;
}

function moduleDir(moduleId: string): string {
  const d = directories().modules.get(moduleId);
  if (!d) throw new ContentError(`module ${moduleId} introuvable dans niveaux/`);
  return d.dir;
}

// ---------- Programme ----------

export function getProgramme(): Programme {
  return readJson(p("programme", "programme.json"), programmeSchema);
}

/** Squelette ordonné pour le domaine (règles de déblocage). */
export function getStructure(): ProgrammeStructure {
  const prog = getProgramme();
  return { levels: prog.levels.map((l) => ({ id: l.id, modules: l.modules.map((m) => ({ id: m.id, lessons: m.lessons.map((x) => x.id) })) })) };
}

type FlatLesson = { id: string; title: string; minutes: number; moduleId: string; levelId: string; indexInModule: number; globalIndex: number; isLastOfModule: boolean };

/** Toutes les leçons dans l'ordre pédagogique. */
export function getFlatLessons(): FlatLesson[] {
  const out: FlatLesson[] = [];
  for (const level of getProgramme().levels)
    for (const mod of level.modules)
      mod.lessons.forEach((l, i) =>
        out.push({ ...l, moduleId: mod.id, levelId: level.id, indexInModule: i + 1, globalIndex: out.length + 1, isLastOfModule: i === mod.lessons.length - 1 }),
      );
  return out;
}

export function getLevels(): ProgrammeLevel[] {
  return getProgramme().levels;
}

export function getLevel(levelId: string): LevelDetail | null {
  const levels = getProgramme().levels;
  const index = levels.findIndex((l) => l.id === levelId);
  if (index === -1) return null;
  const level = levels[index];
  const dir = directories().levels.get(levelId);
  let intro = "";
  if (dir && fs.existsSync(path.join(dir, "niveau.md"))) intro = cached(path.join(dir, "niveau.md"), "text", (raw) => raw);
  return { ...level, index: index + 1, intro, lessonsCount: level.modules.reduce((s, m) => s + m.lessons.length, 0) };
}

/** Module résumé (programme.json) avec son niveau. */
export function findProgrammeModule(moduleId: string): { level: ProgrammeLevel; module: ProgrammeModule; indexInLevel: number; globalIndex: number } | null {
  let globalIndex = 0;
  for (const level of getProgramme().levels) {
    for (let i = 0; i < level.modules.length; i++) {
      globalIndex++;
      if (level.modules[i].id === moduleId) return { level, module: level.modules[i], indexInLevel: i + 1, globalIndex };
    }
  }
  return null;
}

// ---------- Modules ----------

export function getModule(moduleId: string): ModuleDetail | null {
  const found = findProgrammeModule(moduleId);
  if (!found) return null;
  const dir = moduleDir(moduleId);
  const file = path.join(dir, "module.json");
  const raw = readJson(file, moduleSchema);
  const files = fs.readdirSync(dir);
  const lessons: ModuleMeta["lessons"] = raw.lessons.map((l) => {
    const ref = typeof l === "string" ? found.module.lessons.find((x) => x.id === l) ?? { id: l, title: l, minutes: 0 } : l;
    const fileName = (typeof l !== "string" && l.file) || files.find((f) => f.startsWith(`${ref.id}-`) && f.endsWith(".md"));
    if (!fileName) throw new ContentError(`leçon ${ref.id} : fichier Markdown introuvable dans ${dir}`);
    return { id: ref.id, title: ref.title, minutes: ref.minutes, file: fileName };
  });
  return {
    ...raw,
    lessons,
    indexInLevel: found.indexInLevel,
    globalIndex: found.globalIndex,
    quizMinutes: found.module.quizMinutes,
    hasQuiz: fs.existsSync(path.join(dir, "quiz.json")),
  };
}

// ---------- Leçons ----------

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Texte brut d'un titre Markdown (emphase, code, liens retirés) : doit correspondre au texte vu par rehype-slug. */
export function headingPlainText(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/** Titres h2/h3 hors blocs de code, avec les ancres que produira rehype-slug (même slugger, même ordre). */
export function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let fence: string | null = null;
  for (const line of body.split(/\r?\n/)) {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (fence === null) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const h = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!h) continue;
    const text = headingPlainText(h[2]);
    const id = slugger.slug(text);
    const depth = h[1].length;
    if (depth === 2 || depth === 3) out.push({ depth, text, id });
  }
  return out;
}

export function parseLessonFile(raw: string, file: string): { meta: LessonFrontMatter; body: string } {
  const m = FRONT_MATTER.exec(raw);
  if (!m) throw new ContentError(`${file} : en-tête YAML absent`);
  let data: unknown;
  try {
    data = parseYaml(m[1]);
  } catch (e) {
    throw new ContentError(`${file} : en-tête YAML invalide (${(e as Error).message})`);
  }
  return { meta: parseWith(frontMatterSchema, data, file), body: raw.slice(m[0].length).replace(/^\s+/, "") };
}

export function getLesson(lessonId: string): Lesson | null {
  const flat = getFlatLessons().find((l) => l.id === lessonId);
  if (!flat) return null;
  const mod = getModule(flat.moduleId);
  const ref = mod?.lessons.find((l) => l.id === lessonId);
  if (!mod || !ref) return null;
  const file = path.join(moduleDir(flat.moduleId), ref.file);
  return cached(file, "lesson", (raw) => {
    const { meta, body } = parseLessonFile(raw, file);
    return {
      ...meta,
      body,
      headings: extractHeadings(body),
      wordCount: body.split(/\s+/).filter(Boolean).length,
      indexInModule: flat.indexInModule,
      globalIndex: flat.globalIndex,
    };
  });
}

export function getLessonNavigation(lessonId: string): LessonNavigation | null {
  const flat = getFlatLessons();
  const i = flat.findIndex((l) => l.id === lessonId);
  if (i === -1) return null;
  const ref = (l: FlatLesson | undefined) => (l ? { id: l.id, title: l.title, minutes: l.minutes, moduleId: l.moduleId, levelId: l.levelId } : null);
  return { prev: ref(flat[i - 1]), next: ref(flat[i + 1]), isLastOfModule: flat[i].isLastOfModule, moduleId: flat[i].moduleId, levelId: flat[i].levelId };
}

// ---------- Quiz ----------

/** Quiz COMPLET (avec réponses) : serveur uniquement, jamais en props d'un composant client. */
export function getQuiz(moduleId: string): Quiz | null {
  const dirInfo = directories().modules.get(moduleId);
  if (!dirInfo) return null;
  const file = path.join(dirInfo.dir, "quiz.json");
  if (!fs.existsSync(file)) return null;
  return readJson(file, quizSchema);
}

export function toPublicQuestion<Q extends QuizQuestion>(q: Q): Omit<Q, "answer" | "explanation"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { answer, explanation, ...rest } = q;
  return rest;
}

/** Quiz sans `answer` ni `explanation` : sûr pour le client. */
export function getPublicQuiz(moduleId: string): PublicQuiz | null {
  const quiz = getQuiz(moduleId);
  if (!quiz) return null;
  return { ...quiz, questions: quiz.questions.map((q) => toPublicQuestion(q) as PublicQuizQuestion) };
}

// ---------- Examens ----------

/** Examen COMPLET (avec réponses) : serveur uniquement. */
export function getExam(levelId: string): Exam | null {
  if (!/^N\d$/.test(levelId)) return null;
  const file = p("examens", `${levelId}-examen.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file, examSchema);
}

/** Examen sans réponses ni explications, dans l'ordre du fichier. */
export function getPublicExam(levelId: string): PublicExam | null {
  const exam = getExam(levelId);
  if (!exam) return null;
  return { ...exam, questions: exam.questions.map((q) => toPublicQuestion(q) as PublicExamQuestion) };
}

/** Questions publiques d'une tentative : ordre des questions et des options de la tentative (exam_attempts). */
export function getExamQuestionsForAttempt(levelId: string, order: ExamOrder): PublicExamQuestion[] {
  const exam = getPublicExam(levelId);
  if (!exam) return [];
  return applyExamOrder(exam.questions, order);
}

export function getExamQuestion(levelId: string, questionId: string): ExamQuestion | null {
  return getExam(levelId)?.questions.find((q) => q.id === questionId) ?? null;
}

// ---------- Ressources ----------

const LINK_LINE = /^\s*-\s+\[([^\]]+)\]\((\S+?)\)\s*((?:\p{RI}\p{RI})?)\s*(?:[—–-]\s*(.*))?$/u;

export function parseResourceLibrary(markdown: string): ResourceLibrary {
  const slugger = new GithubSlugger();
  const sections: ResourceSection[] = [];
  const introLines: string[] = [];
  let linkCount = 0;
  let section: ResourceSection | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h2) {
      const title = headingPlainText(h2[1]);
      section = { id: slugger.slug(title), title, intro: "", subsections: [] };
      sections.push(section);
      continue;
    }
    if (h3 && section) {
      const title = headingPlainText(h3[1]);
      section.subsections.push({ id: slugger.slug(title), title, links: [] });
      continue;
    }
    const link = LINK_LINE.exec(line);
    if (link && section) {
      const item: ResourceLink = { title: link[1], url: link[2], flag: link[3] || null, description: (link[4] ?? "").trim() };
      if (section.subsections.length === 0) section.subsections.push({ id: section.id, title: section.title, links: [] });
      section.subsections.at(-1)!.links.push(item);
      linkCount++;
      continue;
    }
    if (/^#\s/.test(line)) continue;
    if (!section) introLines.push(line);
    else if (section.subsections.length === 0 && line.trim()) section.intro += (section.intro ? "\n" : "") + line;
  }
  return { markdown, intro: introLines.join("\n").replace(/^---$/m, "").trim(), sections, linkCount };
}

export function getResourceLibrary(): ResourceLibrary {
  return cached(p("ressources", "bibliotheque-liens.md"), "resources", parseResourceLibrary);
}
