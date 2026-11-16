/**
 * `npm run setup` (et au démarrage du conteneur : `node dist/setup.cjs`) — idempotent, relançable :
 *   1. applique les migrations (drizzle/) ;
 *   2. crée le compte administrateur ADMIN_EMAIL / ADMIN_PASSWORD s'il n'existe pas (ADMIN_RESET_PASSWORD=true pour
 *      réimposer le mot de passe) ;
 *   3. (re)crée le compte démo demo@formation-ia.local avec une progression datée par rapport à aujourd'hui :
 *      N1 terminé (quiz réussis, examen réussi du premier coup, certificat), N2 à moitié, série de 5 jours, badges.
 *      Le numéro de certificat démo est conservé d'une exécution à l'autre (lien /verifier stable).
 *      DEMO_ENABLED=false : le compte démo n'est ni créé ni mis à jour.
 */
import { eq } from "drizzle-orm";
import { db, pool, schema } from "@/db";
import { getExam, getFlatLessons, getProgramme, getQuiz } from "@/content/loader";
import { buildExamOrder, examDeadline, examXp, gradeExam, gradeQuiz, lessonXp, parisDayKey, quizXp, seededRandom, shiftDayKey, type XpAward } from "@/domain";
import { randomToken } from "@/lib/crypto";
import { awardXp, logActivity, syncBadges } from "@/server/gamification";
import { issueCertificate } from "@/server/certificates";
import { hashPassword, validatePasswordStrength } from "@/server/passwords";
import { runMigrations } from "./migrate-lib";

const DEMO_EMAIL = "demo@formation-ia.local";

function log(msg: string) {
  console.log(`OK ${msg}`);
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("[setup] ADMIN_EMAIL / ADMIN_PASSWORD absents : aucun administrateur créé.");
    return;
  }
  const weak = validatePasswordStrength(password);
  if (weak) console.warn(`[setup] ADMIN_PASSWORD faible (${weak}) — à changer après la première connexion.`);
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (!existing) {
    await db.insert(schema.users).values({ email, firstName: "Administrateur", lastName: "", role: "admin", passwordHash: await hashPassword(password) });
    log(`administrateur créé : ${email}`);
    return;
  }
  const patch: Partial<typeof schema.users.$inferInsert> = {};
  if (existing.role !== "admin") patch.role = "admin";
  if (existing.disabledAt) patch.disabledAt = null;
  if (process.env.ADMIN_RESET_PASSWORD === "true") patch.passwordHash = await hashPassword(password);
  if (Object.keys(patch).length) await db.update(schema.users).set(patch).where(eq(schema.users.id, existing.id));
  log(`administrateur présent : ${email}${patch.passwordHash ? " (mot de passe réinitialisé)" : ""}`);
}

// ---------- Compte démo ----------

/** Instant du jour « il y a `offset` jours » (jour de Paris), à `hourUtc` h UTC ; jamais dans le futur. */
function at(now: Date, offset: number, hourUtc: number, minute = 0): Date {
  const key = shiftDayKey(parisDayKey(now), -offset);
  const d = new Date(`${key}T${String(hourUtc).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`);
  // Aujourd'hui, une heure encore à venir : ramenée juste avant maintenant (en gardant l'ordre chronologique).
  return d > now ? new Date(now.getTime() - ((24 - hourUtc) * 60 + (60 - minute)) * 1000) : d;
}

async function seedDemo() {
  if (process.env.DEMO_ENABLED === "false") {
    console.log("[setup] DEMO_ENABLED=false : compte démo ignoré.");
    return;
  }
  const now = new Date();
  const rand = seededRandom(20261102);

  // Conserver le numéro de certificat N1 d'une exécution à l'autre.
  const [old] = await db.select().from(schema.users).where(eq(schema.users.email, DEMO_EMAIL)).limit(1);
  let keptNumber: string | undefined;
  if (old) {
    const [cert] = await db.select().from(schema.certificates).where(eq(schema.certificates.userId, old.id)).limit(1);
    keptNumber = cert?.number;
    await db.delete(schema.users).where(eq(schema.users.id, old.id)); // cascade : progression, XP, badges, sessions…
  }

  const [user] = await db
    .insert(schema.users)
    .values({
      email: DEMO_EMAIL,
      firstName: "Camille",
      lastName: "Démo",
      role: "learner",
      isDemo: true,
      // Mot de passe aléatoire jamais communiqué : connexion uniquement par le bouton « Essayer le compte démo ».
      passwordHash: await hashPassword(randomToken(24)),
      dailyGoalXp: 50,
      createdAt: at(now, 46, 9),
      lastLoginAt: now,
    })
    .returning();
  const userId = user.id;

  const programme = getProgramme();
  const flat = getFlatLessons();
  const n1 = programme.levels.find((l) => l.id === "N1")!;
  const n2 = programme.levels.find((l) => l.id === "N2")!;
  const n1Lessons = flat.filter((l) => l.levelId === "N1");
  const n2Lessons = flat.filter((l) => l.levelId === "N2");
  const n2Half = n2Lessons.slice(0, Math.floor(n2Lessons.length / 2));

  // Calendrier : N1 entre J-40 et J-11 en séries de 3 jours max ; examen à J-10 ; N2 à J-9, J-7, J-6 puis J-4 → J0.
  // J-8 et J-5 vides : la série courante vaut exactement 5 jours.
  const n1Days = Array.from({ length: 30 }, (_, i) => 40 - i).filter((d) => d % 4 !== 0 && d > 10);
  const n2Days = [9, 7, 6, 4, 3, 2, 1, 0];
  const loggedDays = new Set<number>();
  const xp: { awards: XpAward[]; at: Date }[] = [];

  const completeLesson = async (lesson: (typeof flat)[number], day: number, slot: number) => {
    const done = at(now, day, 8 + slot * 2, 15 + Math.floor(rand() * 40));
    const seconds = Math.round(lesson.minutes * 60 * (0.8 + rand() * 0.35));
    if (!loggedDays.has(day)) {
      loggedDays.add(day);
      await logActivity(userId, "login", { at: new Date(done.getTime() - seconds * 1000 - 120_000) });
    }
    await db.insert(schema.lessonProgress).values({
      userId,
      lessonId: lesson.id,
      status: "completed",
      timeSpentSeconds: seconds,
      firstOpenedAt: new Date(done.getTime() - seconds * 1000),
      completedAt: done,
      lastSeenAt: done,
    });
    await logActivity(userId, "lesson_time", { lessonId: lesson.id, seconds, at: done });
    await logActivity(userId, "lesson_complete", { lessonId: lesson.id, at: done });
    xp.push({ awards: lessonXp(lesson.id), at: done });
    return done;
  };

  const takeQuiz = async (moduleId: string, wrong: number, when: Date) => {
    const quiz = getQuiz(moduleId);
    if (!quiz) return;
    const choices: Record<string, number> = {};
    quiz.questions.forEach((q, i) => (choices[q.id] = i < wrong ? (q.answer + 1) % q.options.length : q.answer));
    const r = gradeQuiz(quiz.questions, choices, quiz.passScore);
    await db.insert(schema.quizAttempts).values({
      userId,
      moduleId,
      score: r.score,
      total: r.total,
      percent: r.percent,
      passed: r.passed,
      answers: r.answers.map((a) => ({ questionId: a.questionId, choice: a.choice, correct: a.correct })),
      at: when,
    });
    await logActivity(userId, "quiz", { refId: moduleId, at: when });
    xp.push({ awards: quizXp(moduleId, r.percent, quiz.passScore), at: when });
  };

  // --- Niveau 1 : tout terminé ---
  let dayIdx = 0;
  let slot = 0;
  let lastDone = now;
  for (const mod of n1.modules) {
    for (const ref of mod.lessons) {
      const lesson = n1Lessons.find((l) => l.id === ref.id)!;
      lastDone = await completeLesson(lesson, n1Days[Math.min(dayIdx, n1Days.length - 1)], slot);
      slot++;
      if (slot === 2) {
        slot = 0;
        dayIdx++;
      }
    }
    const quizAt = new Date(lastDone.getTime() + 25 * 60_000);
    // M02 : un premier essai manqué puis réussi ; M01 et M04 sans faute ; les autres à 80-90 %.
    if (mod.id === "M02") await takeQuiz(mod.id, 4, new Date(quizAt.getTime() - 10 * 60_000));
    await takeQuiz(mod.id, mod.id === "M01" || mod.id === "M04" ? 0 : mod.id === "M02" ? 1 : 2, quizAt);
  }

  const exam = getExam("N1");
  if (exam) {
    const startedAt = at(now, 10, 13, 5);
    const order = buildExamOrder(exam.questions, rand);
    const answers: Record<string, number> = {};
    exam.questions.forEach((q, i) => (answers[q.id] = i % 8 === 3 ? (q.answer + 1) % q.options.length : q.answer));
    const g = gradeExam(exam.questions, answers, exam.passScore);
    const submittedAt = new Date(startedAt.getTime() + 47 * 60_000);
    const [attempt] = await db
      .insert(schema.examAttempts)
      .values({
        userId,
        levelId: "N1",
        startedAt,
        deadlineAt: examDeadline(startedAt, exam.timeLimitMinutes),
        submittedAt,
        questionOrder: order.questionOrder,
        optionOrders: order.optionOrders,
        answers,
        score: g.score,
        percent: g.percent,
        passed: g.passed,
      })
      .returning();
    await logActivity(userId, "login", { at: new Date(startedAt.getTime() - 60_000) });
    await logActivity(userId, "exam", { refId: "N1", seconds: 47 * 60, at: submittedAt });
    xp.push({ awards: examXp("N1", g.passed), at: submittedAt });
    if (g.passed) await issueCertificate({ userId, levelId: "N1", examAttemptId: attempt.id, issuedAt: submittedAt, number: keptNumber });
  }

  // --- Niveau 2 : première moitié ---
  const perDay = Math.ceil(n2Half.length / n2Days.length);
  for (let i = 0; i < n2Half.length; i++) {
    const day = n2Days[Math.min(Math.floor(i / perDay), n2Days.length - 1)];
    lastDone = await completeLesson(n2Half[i], day, i % perDay);
    const mod = n2.modules.find((m) => m.id === n2Half[i].moduleId)!;
    const allDone = mod.lessons.every((l) => n2Half.some((x) => x.id === l.id));
    if (n2Half[i].isLastOfModule && allDone) await takeQuiz(mod.id, mod.id === "M09" ? 0 : 2, new Date(lastDone.getTime() + 20 * 60_000));
  }
  const nextLesson = n2Lessons[n2Half.length];
  if (nextLesson) {
    await db.insert(schema.lessonProgress).values({ userId, lessonId: nextLesson.id, status: "started", timeSpentSeconds: 540, firstOpenedAt: new Date(now.getTime() - 30 * 60_000), lastSeenAt: new Date(now.getTime() - 20 * 60_000) });
    await logActivity(userId, "lesson_time", { lessonId: nextLesson.id, seconds: 540, at: new Date(now.getTime() - 20 * 60_000) });
  }
  // Une question au tuteur IA (badge « Bonne question »).
  await logActivity(userId, "tutor", { lessonId: n2Half[0]?.id ?? null, at: at(now, 3, 15) });

  for (const x of xp) await awardXp(userId, x.awards, { at: x.at });
  const badges = await syncBadges(userId, { at: now });

  log(`compte démo ${DEMO_EMAIL} : ${n1Lessons.length + n2Half.length} leçons terminées, N1 certifié, badges : ${badges.join(", ")}`);
}

async function main() {
  if (!process.env.APP_SECRET || process.env.APP_SECRET.length < 32) {
    console.warn("[setup] APP_SECRET manquant ou < 32 caractères : le chiffrement des clés API échouera au runtime.");
  }
  await runMigrations();
  log("migrations appliquées");
  await ensureAdmin();
  await seedDemo();
}

main()
  .catch((e) => {
    console.error("[setup] échec :", e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
