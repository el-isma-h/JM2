/**
 * Types du contenu de la formation (fichiers du dossier parent, voir FORMAT.md).
 * Ce fichier ne contient que des types : il peut être importé depuis un composant client (`import type`).
 *
 * Règle de sécurité : les types `Public*` ne contiennent NI `answer` NI `explanation`. Seuls eux peuvent être
 * passés en props à un composant client avant la soumission d'un quiz / examen.
 */

export type SourceRef = { title: string; url: string; lang?: string };

export type LessonRef = { id: string; title: string; minutes: number };

/** Module tel que résumé dans programme.json. */
export type ProgrammeModule = {
  id: string;
  title: string;
  hours: number;
  minutes: number;
  quizMinutes: number;
  lessons: LessonRef[];
};

export type ProgrammeLevel = {
  id: string; // "N1"
  code: string; // "NF-IA-N1"
  title: string;
  hours: number;
  audience: string;
  prerequisites: string;
  certificate: string;
  alignedWith: string[];
  examMinutes: number;
  modules: ProgrammeModule[];
};

export type Programme = {
  code: string; // "NF-IA-150"
  title: string;
  subtitle: string;
  version: string;
  versionDate: string;
  language: string;
  organisme: string;
  totalHours: number;
  modality: string;
  passScore: number;
  quizPerModule: number;
  examPerLevel: number;
  levels: ProgrammeLevel[];
};

/** module.json (métadonnées détaillées d'un module). */
export type ModuleMeta = {
  id: string;
  level: string;
  title: string;
  minutes: number;
  description: string;
  objectives: string[];
  skills: string[];
  alignedWith: string[];
  sources: SourceRef[];
  lessons: (LessonRef & { file: string })[];
};

export type ModuleDetail = ModuleMeta & {
  /** Position 1-based dans le niveau / dans la formation. */
  indexInLevel: number;
  globalIndex: number;
  quizMinutes: number;
  hasQuiz: boolean;
};

/** En-tête YAML d'une leçon. */
export type LessonFrontMatter = {
  id: string;
  module: string;
  level: string;
  title: string;
  minutes: number;
  objectives: string[];
  skills: string[];
  sources: SourceRef[];
};

export type Heading = { depth: 2 | 3; text: string; id: string };

export type Lesson = LessonFrontMatter & {
  /** Corps Markdown, en-tête YAML retiré. */
  body: string;
  /** Titres h2 (et h3) pour le sommaire ; `id` = ancre générée par rehype-slug. */
  headings: Heading[];
  /** Nombre de mots (indicatif). */
  wordCount: number;
  /** Position 1-based dans le module et dans la formation. */
  indexInModule: number;
  globalIndex: number;
};

export type LessonNavigation = {
  prev: (LessonRef & { moduleId: string; levelId: string }) | null;
  next: (LessonRef & { moduleId: string; levelId: string }) | null;
  /** Vrai si la leçon est la dernière de son module (le quiz du module vient ensuite). */
  isLastOfModule: boolean;
  moduleId: string;
  levelId: string;
};

export type QuestionType = "qcm" | "vrai_faux" | "trouve_erreur" | "mise_en_situation";

/** Question complète (serveur uniquement). */
export type QuizQuestion = {
  id: string;
  lessonId: string;
  type: QuestionType;
  q: string;
  options: string[];
  /** Index 0-based de la bonne réponse. */
  answer: number;
  explanation: string;
  source?: SourceRef;
};

export type Quiz = { moduleId: string; title: string; passScore: number; questions: QuizQuestion[] };

export type PublicQuizQuestion = Omit<QuizQuestion, "answer" | "explanation">;
export type PublicQuiz = Omit<Quiz, "questions"> & { questions: PublicQuizQuestion[] };

export type ExamQuestion = QuizQuestion & { competence: string };

export type Exam = {
  levelId: string;
  title: string;
  passScore: number;
  timeLimitMinutes: number;
  /** Compétence → ids de questions. */
  competences: Record<string, string[]>;
  questions: ExamQuestion[];
};

export type PublicExamQuestion = Omit<ExamQuestion, "answer" | "explanation">;
export type PublicExam = Omit<Exam, "questions"> & { questions: PublicExamQuestion[] };

/** Présentation d'un niveau (niveau.md + programme.json). */
export type LevelDetail = ProgrammeLevel & {
  index: number; // 1-based
  /** Corps Markdown de niveaux/Nx-…/niveau.md (vide si absent). */
  intro: string;
  lessonsCount: number;
};

/** Bibliothèque de liens (ressources/bibliotheque-liens.md). */
export type ResourceLink = { title: string; url: string; flag: string | null; description: string };
export type ResourceSubsection = { id: string; title: string; links: ResourceLink[] };
export type ResourceSection = { id: string; title: string; intro: string; subsections: ResourceSubsection[] };
export type ResourceLibrary = {
  /** Markdown complet (pour un rendu brut). */
  markdown: string;
  /** Texte d'introduction (avant la 1re section). */
  intro: string;
  sections: ResourceSection[];
  linkCount: number;
};
