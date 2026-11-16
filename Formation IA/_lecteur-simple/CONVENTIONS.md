# Conventions — Next Formation IA

Guide pour les développeurs qui construisent les fonctionnalités par-dessus la fondation, **en parallèle**.
Règle d'or : chacun travaille dans **ses** routes ; toute modification d'un fichier partagé (schéma, domaine, couche
contenu, composants `ui/`, navigation) est annoncée et reste rétrocompatible.

## Arborescence

```
app/
├── SPEC.md                    spécification validée (source de vérité fonctionnelle)
├── drizzle/                   migrations SQL générées (ne jamais éditer une migration existante)
├── deploy/                    Caddyfile.example, nikaholding.sh
├── scripts/dev-db.sh          PostgreSQL local (port 5433)
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx         racine : polices, thème (script anti-flash), TooltipProvider
    │   ├── globals.css        tokens Next Formation (clair/sombre), .prose-nf (lecteur), hljs
    │   ├── not-found.tsx, error.tsx, global-error.tsx
    │   ├── (auth)/            connexion, invitation/[token], deconnexion — panneau de marque
    │   ├── (public)/          verifier/[numero] — sans connexion
    │   ├── (app)/             pages connectées dans AppShell (barre latérale / onglets mobiles)
    │   │   ├── page.tsx       tableau de bord          ├── parcours/…, lecon/[id], quiz/[module]
    │   │   ├── examen/[niveau](/passer)                ├── certificats, badges, ressources, cle-api, profil
    │   │   └── admin/         layout requireRole("admin","trainer") + pages
    │   └── api/               auth/demo, health (à ajouter : tutor, time, certificats/[numero]/pdf, admin/export/[type])
    ├── components/
    │   ├── ui/                button, badge, surface (Panel, PageHeader, Stat, Notice, EmptyState, KeyValue), field,
    │   │                      dialog, dropdown, tabs, tooltip, switch, progress (+ ProgressRing), table, logo,
    │   │                      motion (FadeIn, Stagger, CountUp, Pop, Pulse), celebrate (confettis), theme-toggle
    │   ├── layout/            app-shell, nav.ts (entrées de menu), placeholder
    │   ├── markdown/          <Markdown source> (serveur) + MermaidDiagram (client)
    │   ├── badges/            BadgeIcon
    │   └── auth/              formulaires de connexion / activation, bouton démo
    ├── content/               couche contenu (lecture des fichiers de la formation)
    ├── domain/                règles métier PURES + tests
    ├── db/                    schema.ts (toutes les tables), index.ts (db, pool, types)
    ├── server/                auth, invitations, learner, gamification, certificates, actions/
    ├── lib/                   crypto, paths (routes, withBase, absoluteUrl), rate-limit, utils
    └── scripts/               setup.ts, migrate.ts
```

## Ajouter / remplacer une page

1. Les routes de la SPEC existent déjà sous forme de **placeholders** (`<Placeholder spec=[…]>`). Remplacez le contenu
   du `page.tsx` concerné ; ne déplacez pas la route (la navigation et les liens en dépendent : `src/lib/paths.ts → routes`).
2. **Chaque page appelle elle-même** `await requireUser()` (ou `requireRole(...)`) : un layout ne protège pas ses pages
   lors des navigations côté client.
3. Signature Next 16 : `params` et `searchParams` sont des **Promise** (`const { id } = await params`).
4. Paramètres d'URL : `levelIdFromParam("n1") → "N1"`, `moduleIdFromParam`, `lessonIdFromParam` ; `notFound()` si null.
   URLs : niveaux en minuscules (`/parcours/n2`, `/examen/n1`), modules et leçons en majuscules (`/quiz/M03`, `/lecon/L012`).
5. En-tête : `<PageHeader title description breadcrumb actions />` ; blocs : `<Panel>` / `<PanelHeader>`.
6. Une nouvelle entrée de menu se déclare dans `src/components/layout/nav.ts` uniquement.
7. `export const metadata = { title: "…" }` (le gabarit ajoute « · Next Formation IA »).

## basePath `/ia` — pièges

- `<Link href="/parcours">`, `redirect("/")`, `router.push` : Next ajoute `/ia` tout seul. **N'écrivez jamais `/ia/...` dans un Link.**
- `fetch()` côté client, `<form action="…">` vers un route handler, `<img src>` bruts, liens dans les e-mails : **ajoutez-le**
  avec `withBase(routes.api.time)` ou `absoluteUrl(routes.verify(n))` (URL absolue avec `APP_URL`).
- Cookie de session : `nfia_session`, `Path=/ia`, httpOnly, SameSite=Lax, Secure si `APP_URL` est en https.
- `redirect()` dans une **server action soumise sans JavaScript** renvoie un `Location` sans `/ia` (comportement de
  Next 16.4.4). Les formulaires à server action supposent donc JS (cas normal) ; pour un flux qui doit marcher sans JS,
  utilisez un route handler qui répond `303` vers `withBase(...)` (exemple : `src/app/api/auth/demo/route.ts`).

## Couche contenu (`@/content`)

`import { getLesson, getPublicQuiz } from "@/content"` — **serveur uniquement** (`server-only`). Les composants client
n'importent que des types : `import type { PublicQuiz } from "@/content/types"`.

| Fonction | Renvoie |
| --- | --- |
| `getProgramme()`, `getLevels()`, `getStructure()` | programme.json ; squelette ordonné pour le domaine |
| `getLevel("N1")` | niveau + `intro` (niveau.md) + `index`, `lessonsCount` |
| `getModule("M01")`, `findProgrammeModule("M01")` | module.json enrichi (`indexInLevel`, `hasQuiz`, fichiers des leçons) |
| `getLesson("L001")` | front-matter + `body` (Markdown sans en-tête) + `headings` (ancres = rehype-slug) |
| `getLessonNavigation("L001")` | `prev`, `next`, `isLastOfModule` |
| `getFlatLessons()` | les 150 leçons dans l'ordre |
| `getQuiz(m)` / `getPublicQuiz(m)` | complet (serveur) / **sans `answer` ni `explanation`** (client) |
| `getExam(n)` / `getPublicExam(n)` / `getExamQuestionsForAttempt(n, order)` | idem ; questions publiques dans l'ordre mélangé d'une tentative |
| `getResourceLibrary()` | bibliothèque de liens analysée (sections, sous-sections, liens) + Markdown brut |

Règle de sécurité : **seules les versions `Public*` peuvent atteindre le client** avant soumission. La correction se fait
toujours côté serveur (server action / route handler) avec `getQuiz` / `getExam`.
Cache : mémoire, invalidé à la modification du fichier (édition à chaud en dev). `CONTENT_DIR` (défaut `..`).
Les scripts et tests importent `@/content/loader` (pas de `server-only`).

Rendu : `<Markdown source={lesson.body} />` (`src/components/markdown`) — GFM, KaTeX, coloration, Mermaid, `<details>`,
encadrés 💡 ⚠️ 🔗 stylés, liens externes en `_blank`. Sommaire : `lesson.headings` (ids identiques aux ancres rendues).

## Domaine (`@/domain`)

Fonctions **pures** (aucune E/S, l'heure est passée en paramètre), importables partout, couvertes par des tests.
ESLint interdit d'y importer Next, React, la base ou le système de fichiers.

| Fichier | Contenu |
| --- | --- |
| `unlock.ts` | `computeAccess(structure, state)` → états de chaque niveau / module / leçon / quiz / examen ; `canAccessLesson`, `canTakeQuiz`, `canOpenExam`, `resumeTarget`, `currentLevelId`, `overallProgressPercent` |
| `xp.ts` | barème (`lessonXp`, `quizXp`, `examXp`), `XP_REASONS`, paliers `xpRank` |
| `streak.ts` | `computeStreak` (Europe/Paris), `dailyGoalProgress`, `parisDayKey`, `DAILY_GOAL_OPTIONS` |
| `badges.ts` | `BADGES` (20), `evaluateBadges(ctx)`, `BADGE_BY_ID` |
| `exam.ts` | `buildExamOrder`, `applyExamOrder`, `toOriginalChoice`, `gradeExam` (score par compétence), `examAttemptStatus` (3 tentatives, 7 jours, tentatives annulées ignorées), `canSubmitAttempt`, `remainingSeconds` |
| `quiz.ts` | `gradeQuiz`, `heartsLeft` (cœurs non bloquants) |
| `certificate.ts` | `generateCertificateNumber` (`NF-IA-N1-2026-7KQ3XM`), `normalizeCertificateNumber` |

Règles de déblocage (résumé) : N1 ouvert ; module suivant après réussite du quiz (≥ 70 %) ; leçons séquentielles dans un
module ; quiz après toutes les leçons du module ; examen après tous les quiz du niveau ; niveau suivant après l'examen.
Déblocage manuel de module : ouvre ce module ; de niveau : ouvre le niveau et son 1er module.

Toute nouvelle règle métier va dans `src/domain/` **avec son test** (`*.test.ts` à côté).

## Services serveur (`src/server/`)

| Module | Usage |
| --- | --- |
| `auth.ts` | `getSession()`, `requireUser()`, `requireRole(...)`, `createSession`, `destroySession`, `authenticate`, `isStaff`, `requestMeta` |
| `learner.ts` | `loadLearnerState`, `loadAccess(userId)` → `{ structure, state, access }`, `getLearnerSnapshot(userId)` (XP, série, objectif, badges, reprise) |
| `gamification.ts` | `awardXp(userId, quizXp(…))` (idempotent), `logActivity(userId, kind, …)` (preuves FOAD), `syncBadges(userId)` → nouveaux badges, `examAttemptsFor` |
| `certificates.ts` | `issueCertificate(...)` (un actif par niveau, numéro unique), `findCertificate(number)` |
| `invitations.ts` | `createInvitation` → `{ token, url }`, `peekInvitation`, `acceptInvitation` |
| `actions/auth.ts` | server actions de connexion / déconnexion / activation |

Après toute action qui fait progresser l'apprenant : `awardXp` → `logActivity` → `syncBadges` (renvoie les badges à
animer avec `celebrate()` côté client). Les fonctions acceptent une transaction (`conn`/`opts.conn`) pour les
écritures groupées (`db.transaction(async (tx) => …)`).

Compte démo : `user.isDemo` — désactivez les écritures sensibles (mot de passe, clé API personnelle).
Limitation de débit : `sharedLimiter(nom, { limit, windowMs }).hit(clé)` (`src/lib/rate-limit.ts`), obligatoire sur le tuteur.
Chiffrement : `encrypt(valeur, "ai-key")` / `decrypt(...)` (`src/lib/crypto.ts`) pour toute clé API stockée.

## Base de données

Toutes les tables de la SPEC sont dans `src/db/schema.ts` (types exportés : `User`, `ExamAttempt`…).
Modifier le schéma → `npm run db:generate` → relire le SQL généré → commiter la migration. Ne jamais éditer une
migration déjà appliquée. Ajouts documentés en tête de `schema.ts` (`exam_attempts.voidedAt` pour réinitialiser les
tentatives sans détruire les preuves, `activity_log.kind = "tutor"`, index unique des XP…).

## Design

- Tokens uniquement (`bg-bg`, `bg-bg-elev`, `text-ink`, `text-ink-2/3`, `border-line`, `text-accent`, `bg-accent-soft`,
  `text-ok-ink`, `text-warn-ink`, `text-danger-ink`…) : jamais de couleur en dur, jamais `#000` / `#fff`.
- Angles droits, bordures 1 px, pas d'ombre (sauf `--shadow-2` pour les surcouches), un seul accent (violet).
- Titres : Archivo fin en capitales (`h1`–`h3` automatiques) ; étiquettes : `.etiquette` ou `font-mono text-[10px] uppercase tracking-[0.2em]` ;
  citations : `font-serif italic` ; chiffres : `.num`.
- Animations : `motion` (`motion/react`) via `components/ui/motion.tsx` ; respecter `useReducedMotion`. Confettis : `celebrate()`.
- Icônes : `@phosphor-icons/react` dans les composants client, `@phosphor-icons/react/ssr` dans les composants serveur.
- Mobile d'abord : la coque réserve la barre d'onglets en bas (`safe-bottom`) ; tester à 360 px.
- Libellés d'état : `<StatusBadge status="perfect" />` (table `statusMeta`) plutôt qu'un code brut.

## Vérifications avant de livrer

```bash
npm run typecheck && npm run lint && npm test && npm run build
```
