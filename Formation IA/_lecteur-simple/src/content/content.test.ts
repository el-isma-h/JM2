/** Test d'intégration : charge TOUT le contenu réel de la formation (CONTENT_DIR ou dossier parent). */
import { describe, expect, it } from "vitest";
import { buildExamOrder, seededRandom } from "@/domain/exam";
import {
  extractHeadings,
  getExam,
  getExamQuestionsForAttempt,
  getFlatLessons,
  getLesson,
  getLessonNavigation,
  getLevel,
  getModule,
  getProgramme,
  getPublicExam,
  getPublicQuiz,
  getQuiz,
  getResourceLibrary,
  getStructure,
  headingPlainText,
  parseLessonFile,
} from "./loader";

describe("contenu réel", () => {
  it("programme : 4 niveaux, 30 modules, 150 leçons", () => {
    const prog = getProgramme();
    expect(prog.code).toBe("NF-IA-150");
    expect(prog.levels).toHaveLength(4);
    expect(getStructure().levels.flatMap((l) => l.modules)).toHaveLength(30);
    expect(getFlatLessons()).toHaveLength(150);
  });

  it("chaque leçon se charge, en-tête cohérent avec programme.json", () => {
    for (const ref of getFlatLessons()) {
      const lesson = getLesson(ref.id);
      expect(lesson, ref.id).not.toBeNull();
      expect(lesson!.id).toBe(ref.id);
      expect(lesson!.module).toBe(ref.moduleId);
      expect(lesson!.level).toBe(ref.levelId);
      expect(lesson!.body.startsWith("---")).toBe(false);
      expect(lesson!.headings.length).toBeGreaterThan(0);
    }
  });

  it("chaque module, quiz et examen se charge ; réponses dans les bornes", () => {
    for (const level of getProgramme().levels) {
      expect(getLevel(level.id)?.intro.length).toBeGreaterThan(0);
      for (const m of level.modules) {
        const mod = getModule(m.id)!;
        expect(mod.level).toBe(level.id);
        expect(mod.lessons.map((l) => l.id)).toEqual(m.lessons.map((l) => l.id));
        const quiz = getQuiz(m.id)!;
        expect(quiz.questions.length).toBeGreaterThanOrEqual(5);
        for (const q of quiz.questions) expect(q.answer).toBeLessThan(q.options.length);
      }
      const exam = getExam(level.id)!;
      expect(exam.questions.length).toBe(40);
      for (const q of exam.questions) expect(q.answer).toBeLessThan(q.options.length);
    }
  });

  it("versions publiques : ni answer ni explanation", () => {
    const pq = getPublicQuiz("M01")!;
    const pe = getPublicExam("N1")!;
    for (const q of [...pq.questions, ...pe.questions]) {
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("explanation");
    }
    const order = buildExamOrder(getExam("N1")!.questions, seededRandom(7));
    const shown = getExamQuestionsForAttempt("N1", order);
    expect(shown).toHaveLength(40);
    expect(JSON.stringify(shown)).not.toContain('"answer"');
  });

  it("navigation précédente / suivante", () => {
    const first = getLessonNavigation("L001")!;
    expect(first.prev).toBeNull();
    expect(first.next?.id).toBe("L002");
    const flat = getFlatLessons();
    const lastOfM01 = flat.filter((l) => l.moduleId === "M01").at(-1)!;
    const nav = getLessonNavigation(lastOfM01.id)!;
    expect(nav.isLastOfModule).toBe(true);
    expect(nav.next?.moduleId).toBe("M02");
    expect(getLessonNavigation(flat.at(-1)!.id)!.next).toBeNull();
    expect(getLesson("L999")).toBeNull();
  });

  it("bibliothèque de liens", () => {
    const lib = getResourceLibrary();
    expect(lib.sections.length).toBeGreaterThanOrEqual(20);
    expect(lib.linkCount).toBeGreaterThan(500);
    const link = lib.sections[0].subsections[0].links[0];
    expect(link.url).toMatch(/^https:\/\//);
  });
});

describe("analyse Markdown", () => {
  it("front-matter + corps", () => {
    const { meta, body } = parseLessonFile('---\nid: L001\nmodule: M01\nlevel: N1\ntitle: "T"\nminutes: 40\n---\n\n# Titre\n', "x.md");
    expect(meta.id).toBe("L001");
    expect(body).toBe("# Titre\n");
  });
  it("titres : ancres façon rehype-slug, code ignoré, doublons suffixés", () => {
    const h = extractHeadings("## 1. Quatre **mots**\n```\n## pas un titre\n```\n## 1. Quatre mots\n### Sous `code`\n");
    expect(h).toEqual([
      { depth: 2, text: "1. Quatre mots", id: "1-quatre-mots" },
      { depth: 2, text: "1. Quatre mots", id: "1-quatre-mots-1" },
      { depth: 3, text: "Sous code", id: "sous-code" },
    ]);
    expect(headingPlainText("[Lien](https://x) et *emphase*")).toBe("Lien et emphase");
  });
});
