# Brief — extension des banques d'examen (40 → 80 questions)

Objectif : chaque examen de certification `examens/Nx-examen.json` passe de 40 à **80 questions**. L'application tirera 40 questions par tentative, réparties par compétence, pour que les 3 tentatives ne présentent pas les mêmes questions.

Règles :
- **Ne modifie pas les 40 questions existantes** (ids `Nx-E01` à `Nx-E40`). Ajoute 40 nouvelles questions `Nx-E41` à `Nx-E80` dans le même tableau `questions`, et mets à jour la map `competences`.
- Même structure exacte que les questions existantes (`id`, `lessonId`, `competence`, `type`, `q`, `options`, `answer` 0-based, `explanation` 2-4 phrases, `source` {title,url} tirée des leçons).
- Répartition des 40 nouvelles : chaque module du niveau ≥ 4 questions, chaque compétence du bloc ≥ 5 ; ≥ 60 % de mises en situation professionnelles ; calculs vérifiés par script Python.
- Niveau d'exigence : au moins égal aux 40 existantes ; aucune question identique ou quasi identique aux existantes, aux `quiz.json` des modules ni aux blocs ```quiz des leçons (contrôle de similarité par script, seuil 0,6).
- Faits : uniquement tirés des leçons ; `_recherche/07-mise-a-jour-nov-2026.md` prime en cas de conflit.
- Bonne réponse jamais plus longue de plus de 15 % que la plus longue des autres options ; positions équilibrées (10 par index sur les 40 nouvelles).
- Ajoute à la racine du JSON : `"bankSize": 80, "drawPerAttempt": 40`.
- Ne modifie aucun autre fichier. Dossier temporaire personnel sous `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/banque-<niveau>/`.
- Contrôle final : JSON valide ; `node scripts/validate.mjs 2>&1 | tail -3`. Compte rendu en 5 lignes.
