/**
 * Schéma PostgreSQL (Drizzle) de Next Formation IA — conforme à SPEC.md § « Modèle de données ».
 *
 * Conventions :
 * - identifiants `uuid` générés par la base ; dates `timestamptz` (UTC en base, affichage Europe/Paris) ;
 * - identifiants de contenu (L001, M01, N1, N1-E01…) stockés en `text` : ils viennent des fichiers de la formation ;
 * - toute modification passe par `npm run db:generate` (nouvelle migration dans drizzle/) — ne jamais éditer une migration existante.
 *
 * Ajouts par rapport à la SPEC (documentés) : `users.disabledAt`, `invitations.firstName/lastName/createdAt`,
 * `sessions.createdAt`, `lesson_progress.lastSeenAt`, `activity_log.refId` + type `tutor`,
 * `exam_attempts.flagged` / `voidedAt` (réinitialisation des tentatives sans effacer les preuves FOAD),
 * `user_settings.aiModel`, index d'unicité XP (une récompense par motif et par référence),
 * `admin_actions` (journal des actions admin / formateur : déblocage, réinitialisation, certificat, compte, invitation, réglages).
 */
import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ---------- Énumérations ----------

export const roleEnum = pgEnum("user_role", ["learner", "trainer", "admin"]);
export const lessonStatusEnum = pgEnum("lesson_status", ["started", "completed"]);
export const activityKindEnum = pgEnum("activity_kind", ["lesson_time", "lesson_complete", "quiz", "exam", "login", "tutor"]);
export const unlockScopeEnum = pgEnum("unlock_scope", ["module", "level"]);
export const aiProviderEnum = pgEnum("ai_provider", ["anthropic", "openai", "xai"]);

export type Role = (typeof roleEnum.enumValues)[number];
export type LessonStatus = (typeof lessonStatusEnum.enumValues)[number];
export type ActivityKind = (typeof activityKindEnum.enumValues)[number];
export type UnlockScope = (typeof unlockScopeEnum.enumValues)[number];
export type AiProvider = (typeof aiProviderEnum.enumValues)[number];

const ts = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

// ---------- Comptes ----------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Toujours en minuscules (normalisé à l'écriture). */
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  role: roleEnum("role").notNull().default("learner"),
  passwordHash: text("password_hash").notNull(),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: ts("created_at").notNull().defaultNow(),
  lastLoginAt: ts("last_login_at"),
  /** Objectif quotidien d'XP (série / objectif du jour). */
  dailyGoalXp: integer("daily_goal_xp").notNull().default(50),
  /** Compte désactivé par un admin (connexion refusée). */
  disabledAt: ts("disabled_at"),
});

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: roleEnum("role").notNull().default("learner"),
    /** sha256 du jeton envoyé par e-mail (le jeton en clair n'est jamais stocké). */
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: ts("expires_at").notNull(),
    acceptedAt: ts("accepted_at"),
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("invitations_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** sha256 du jeton du cookie `nfia_session`. */
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: ts("expires_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

// ---------- Progression ----------

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    status: lessonStatusEnum("status").notNull().default("started"),
    timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
    firstOpenedAt: ts("first_opened_at").notNull().defaultNow(),
    completedAt: ts("completed_at"),
    /** Dernier ping de temps reçu (sert à plafonner les pings, voir /api/time). */
    lastSeenAt: ts("last_seen_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

/** Journal horodaté : preuves de réalisation FOAD (temps par leçon, dates, scores, tentatives). */
export const activityLog = pgTable(
  "activity_log",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id"),
    kind: activityKindEnum("kind").notNull(),
    /** Secondes de temps passé (lesson_time) ; 0 sinon. */
    seconds: integer("seconds").notNull().default(0),
    /** Référence libre : moduleId (quiz), levelId (exam), id de tentative… */
    refId: text("ref_id"),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [index("activity_user_at_idx").on(t.userId, t.at)],
);

export type QuizAnswerRecord = {
  questionId: string;
  /** Index d'option choisi (ordre d'origine du fichier quiz.json), null si sans réponse. */
  choice: number | null;
  correct: boolean;
};

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    percent: real("percent").notNull(),
    passed: boolean("passed").notNull(),
    answers: jsonb("answers").$type<QuizAnswerRecord[]>().notNull().default([]),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [index("quiz_attempts_user_module_idx").on(t.userId, t.moduleId)],
);

export const examAttempts = pgTable(
  "exam_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    levelId: text("level_id").notNull(),
    startedAt: ts("started_at").notNull().defaultNow(),
    /** Échéance serveur (startedAt + timeLimitMinutes). Le chronomètre client n'est qu'un affichage. */
    deadlineAt: ts("deadline_at").notNull(),
    submittedAt: ts("submitted_at"),
    /** Ordre d'affichage des questions : ids de questions. */
    questionOrder: jsonb("question_order").$type<string[]>().notNull(),
    /** Par question : permutation affichée → index d'origine (voir domain/exam.ts). */
    optionOrders: jsonb("option_orders").$type<Record<string, number[]>>().notNull(),
    /** Réponses en index D'ORIGINE (déjà dé-mélangées côté serveur), null = sans réponse. */
    answers: jsonb("answers").$type<Record<string, number | null>>(),
    /** Questions marquées « à revoir » par l'apprenant (ids). */
    flagged: jsonb("flagged").$type<string[]>().notNull().default([]),
    score: integer("score"),
    percent: real("percent"),
    passed: boolean("passed"),
    /** Tentative annulée par un admin/formateur (réinitialisation) : ne compte plus dans les 3 tentatives. */
    voidedAt: ts("voided_at"),
  },
  (t) => [index("exam_attempts_user_level_idx").on(t.userId, t.levelId)],
);

/** Déblocages manuels (admin / formateur). */
export const unlocks = pgTable(
  "unlocks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scope: unlockScopeEnum("scope").notNull(),
    refId: text("ref_id").notNull(),
    unlockedBy: uuid("unlocked_by").references(() => users.id, { onDelete: "set null" }),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.scope, t.refId] })],
);

// ---------- Gamification ----------

export const xpEvents = pgTable(
  "xp_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    /** Motif : voir XP_REASONS dans domain/xp.ts. */
    reason: text("reason").notNull(),
    refId: text("ref_id").notNull(),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [
    // Une récompense donnée une seule fois par (utilisateur, motif, référence) : insertion idempotente.
    uniqueIndex("xp_events_unique_award").on(t.userId, t.reason, t.refId),
    index("xp_events_user_at_idx").on(t.userId, t.at),
  ],
);

export const userBadges = pgTable(
  "user_badges",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

// ---------- Certificats ----------

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** NF-IA-N{n}-{AAAA}-{6 car.} — voir domain/certificate.ts. */
    number: text("number").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    levelId: text("level_id").notNull(),
    issuedAt: ts("issued_at").notNull().defaultNow(),
    examAttemptId: uuid("exam_attempt_id").references(() => examAttempts.id, { onDelete: "set null" }),
    revokedAt: ts("revoked_at"),
  },
  (t) => [
    // Un seul certificat actif par apprenant et par niveau.
    uniqueIndex("certificates_active_user_level").on(t.userId, t.levelId).where(sql`${t.revokedAt} is null`),
  ],
);

// ---------- Réglages ----------

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  aiProvider: aiProviderEnum("ai_provider"),
  /** Clé API personnelle chiffrée (lib/crypto.ts, usage « ai-key »). */
  aiKeyEncrypted: text("ai_key_encrypted"),
  aiModel: text("ai_model"),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

/** Réglages plateforme (ex. clé IA de la plateforme) : valeur toujours chiffrée. */
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  valueEncrypted: text("value_encrypted").notNull(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

/** Journal des actions d'administration (périmètre admin) : qui a fait quoi, sur qui, quand. Jamais modifié ni effacé. */
export const adminActions = pgTable(
  "admin_actions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    /** Apprenant concerné (null pour un réglage plateforme). */
    targetUserId: uuid("target_user_id").references(() => users.id, { onDelete: "set null" }),
    /** Ex. « unlock.module », « exam.reset », « certificate.revoke », « user.disable », « invitation.create », « settings.ai ». */
    action: text("action").notNull(),
    /** Référence libre : M03, N2, numéro de certificat, id d'invitation… */
    refId: text("ref_id"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    at: ts("at").notNull().defaultNow(),
  },
  (t) => [index("admin_actions_target_idx").on(t.targetUserId, t.at), index("admin_actions_at_idx").on(t.at)],
);

// ---------- Types dérivés ----------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type ExamAttempt = typeof examAttempts.$inferSelect;
export type Unlock = typeof unlocks.$inferSelect;
export type XpEvent = typeof xpEvents.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
