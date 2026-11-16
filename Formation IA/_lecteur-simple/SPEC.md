# Next Formation IA — application e-learning (spécification technique)

Application web autonome qui diffuse la formation NF-IA-150. Projet **séparé** : ne dépend pas du code de Next Formation et n'y touche pas. Destinée à être servie sous `https://formation.nikaholding.world/ia` (basePath `/ia`).

## Décisions validées par Nika (2 nov. 2026)
- Next.js 16.4.4 (App Router, React 19, TypeScript strict), PostgreSQL 16 + Drizzle ORM, Docker + Caddy. `basePath: "/ia"`, `output: "standalone"`.
- Identité visuelle **Next Formation** reprise à l'identique : `_ref-nf/src/app/globals.css` (tokens os/encre, accent violet #4B2A7F / pastel #C9B8F0, angles droits, bordures 1 px, Archivo fin en capitales espacées, JetBrains Mono pour les étiquettes, Inter pour le corps, Cormorant Garamond italique pour les citations, mode clair + sombre). Composants de base inspirés de `_ref-nf/src/components/ui/*`. Animations **motion** (Framer Motion, paquet `motion`). Icônes `@phosphor-icons/react`.
- Parcours « Duolingo en mieux » : chemin vertical de leçons par niveau/module, nœuds animés (verrouillé / disponible / en cours / terminé / parfait), module suivant débloqué après réussite du quiz du module (≥ 70 %), examen de niveau débloqué après tous les quiz du niveau, niveau suivant débloqué après réussite de l'examen.
- Gamification : XP (leçon terminée +20, quiz réussi +50 / sans faute +100, examen réussi +300), badges, série de jours (streak) avec objectif quotidien, barre de progression animée, confettis à la réussite. **Aucun classement** entre apprenants.
- Examens : chronométrés 60 min (timer serveur), 3 tentatives max par niveau, 7 jours d'attente entre deux tentatives, questions mélangées (ordre des questions et des options) avec correction côté serveur uniquement (les bonnes réponses ne sont jamais envoyées au client avant soumission).
- Certificat PDF par niveau réussi (pdf-lib), numéro unique `NF-IA-N{n}-{AAAA}-{6 car.}`, QR code vers `/ia/verifier/{numero}` (page publique de vérification).
- Admin / formateur : liste des apprenants, invitation (e-mail + lien d'activation ; envoi Resend si `RESEND_API_KEY`, sinon lien affiché à copier), progression, temps passé, résultats quiz/examens, déblocage manuel d'un module/niveau, réinitialisation des tentatives d'examen, export CSV des preuves de réalisation (FOAD : temps par leçon, dates, scores, tentatives).
- Comptes : **sur invitation** uniquement, plus un **compte démo** (apprenant pré-progressé : N1 terminé avec certificat, N2 en cours) et un compte admin créé par le script de setup (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Pas d'inscription libre, pas de paiement.
- Tuteur IA dans chaque leçon : panneau « Demander au tuteur » qui répond à partir du contenu de la leçon (contexte = leçon courante), en streaming. Fournisseurs : Anthropic, OpenAI ou xAI (Grok) — une seule clé suffit. Clé définie soit par l'admin (variables d'environnement `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `XAI_API_KEY` ou réglage chiffré en base), soit par l'apprenant lui-même (« Apporter ma clé », stockée chiffrée AES-256-GCM). Page **« Configurer une clé API »** : guide pas à pas illustré pour créer un compte et une clé chez Anthropic (platform.claude.com), OpenAI (platform.openai.com) et xAI (console.x.ai), coûts indicatifs, sécurité des clés, test de la clé en un clic. Si aucune clé : le panneau explique comment en configurer une.
- Contenu : **lu depuis les fichiers existants** de la formation (dossier parent `..` : `programme/programme.json`, `niveaux/**/L*.md`, `niveaux/**/quiz.json`, `niveaux/**/module.json`, `examens/N*-examen.json`). En build Docker, le contenu est copié dans l'image (`content/`). Variable `CONTENT_DIR` (défaut : `../` en dev). Aucune duplication manuelle.

## Rendu des leçons
Markdown (en-tête YAML retiré) rendu avec `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` (formules LaTeX) + coloration du code (`rehype-pretty-code`/shiki ou `rehype-highlight`) + diagrammes Mermaid (rendu client) + `<details>` repliables autorisés. Encadrés 💡 / ⚠️ / 🔗 (blockquotes) stylés. Liens externes `target=_blank rel=noopener`. Sommaire latéral (titres h2). Temps passé mesuré côté client (visibilité de l'onglet, ping toutes les 30 s, plafonné) et enregistré côté serveur.

## Modèle de données (Drizzle)
- `users` (id, email unique, firstName, lastName, role: learner|trainer|admin, passwordHash, isDemo, createdAt, lastLoginAt, dailyGoalXp)
- `invitations` (id, email, role, tokenHash, expiresAt, acceptedAt, invitedBy)
- `sessions` (id, userId, tokenHash, expiresAt, ip, userAgent)
- `lesson_progress` (userId, lessonId, status: started|completed, timeSpentSeconds, firstOpenedAt, completedAt) — PK (userId, lessonId)
- `activity_log` (id, userId, lessonId|null, kind: lesson_time|lesson_complete|quiz|exam|login, seconds, at) — preuves FOAD
- `quiz_attempts` (id, userId, moduleId, score, total, percent, passed, answers jsonb, at)
- `exam_attempts` (id, userId, levelId, startedAt, deadlineAt, submittedAt, questionOrder jsonb, optionOrders jsonb, answers jsonb, score, percent, passed)
- `unlocks` (userId, scope: module|level, refId, unlockedBy, at) — déblocages manuels
- `xp_events` (id, userId, amount, reason, refId, at) ; `user_badges` (userId, badgeId, at) ; streak calculée à partir de `xp_events`
- `certificates` (id, number unique, userId, levelId, issuedAt, examAttemptId, revokedAt)
- `user_settings` (userId, aiProvider, aiKeyEncrypted) ; `app_settings` (key, valueEncrypted)

## Pages (toutes sous /ia)
- `/` accueil apprenant connecté = tableau de bord (XP, série, objectif du jour, niveau en cours, reprendre la leçon, badges récents) ; non connecté → `/connexion`.
- `/connexion`, `/invitation/[token]` (activation + mot de passe), `/deconnexion`, bouton « Essayer le compte démo » sur la connexion.
- `/parcours` (4 niveaux) et `/parcours/[niveau]` (chemin animé des modules/leçons).
- `/lecon/[id]` (lecteur + sommaire + tuteur IA + bouton « J'ai terminé » + navigation précédente/suivante).
- `/quiz/[module]` (une question à la fois, feedback immédiat avec explication et source, cœurs/vies non bloquants, résultat animé, XP).
- `/examen/[niveau]` (règles, tentatives restantes, compte à rebours avant prochaine tentative) → `/examen/[niveau]/passer` (chronomètre, navigation entre questions, marquage « à revoir », soumission auto à 0) → résultats (score par compétence C1.x…, explications après soumission).
- `/certificats` (liste + téléchargement PDF) ; `/verifier/[numero]` public.
- `/badges`, `/profil` (infos, mot de passe, thème, objectif quotidien, clé API perso), `/cle-api` (guide).
- `/ressources` (bibliothèque de liens `ressources/bibliotheque-liens.md` rendue, recherche).
- `/admin` (tableau de bord), `/admin/apprenants`, `/admin/apprenants/[id]` (détail, déblocages, réinitialisation), `/admin/invitations`, `/admin/exports` (CSV), `/admin/reglages` (clé IA de la plateforme, test).
- API : `/api/tutor` (streaming), `/api/time` (ping temps), `/api/certificats/[numero]/pdf`, `/api/admin/export/[type]`.

## Sécurité
Sessions par cookie httpOnly (`nfia_session`, path `/ia`), mots de passe bcrypt, rôles vérifiés côté serveur dans chaque action/route, CSRF via Server Actions, rate limiting simple en mémoire sur connexion et tuteur, clés chiffrées AES-256-GCM avec `APP_SECRET` (≥ 32 caractères), en-têtes de sécurité (CSP raisonnable, X-Frame-Options), aucune bonne réponse d'examen exposée au client avant soumission.

## Scripts
`npm run dev`, `build`, `start`, `db:generate`, `db:migrate`, `setup` (migrations + admin + compte démo idempotent), `test` (vitest : règles de déblocage, notation d'examen, tentatives/délais, XP/streak, numéro de certificat), `lint`, `typecheck`.

## Déploiement
`Dockerfile` (multi-étapes, standalone, contenu copié), `docker-compose.yml` (app + postgres 16 + volume), `deploy/Caddyfile.example` (bloc `formation.nikaholding.world { handle /ia* { reverse_proxy app:3000 } }`), `.env.example`, `README.md` (démarrage local, comptes, déploiement). Nika se charge du DNS et du serveur.
