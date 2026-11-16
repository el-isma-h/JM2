# Brief rédacteur — Formation IA Next Formation (NF-IA-150)

Tu rédiges **un module complet** de la formation IA de Next Formation (organisme de formation français). Date de référence : **1er novembre 2026**. Tout est en **français**, tutoiement proscrit (vouvoiement « vous »), ton pédagogique, concret, vivant, ludique mais rigoureux. Public : voir le niveau dans `programme/programme.json`.

## Fichiers à lire AVANT d'écrire (dans `/home/claude/formation-ia/`)
1. `FORMAT.md` — format exact des leçons, quiz, module.json (à respecter à la lettre).
2. `programme/programme.json` — ton module : id, titre, leçons (id, titre, minutes). **Ne change ni les ids, ni les titres, ni les minutes.**
3. `referentiel/referentiel-competences.md` — les codes de compétences (C1.1…C4.6) que ton module couvre.
4. Les dossiers de recherche `_recherche/0x-*.md` indiqués dans ta consigne : ils contiennent les faits, chiffres, URLs **vérifiées** (statut ✅ / [vérifiée]). **Utilise uniquement des URLs présentes dans ces dossiers** (ou des URLs de documentation officielle dont tu es certain). N'invente jamais une URL. Préfère les URLs marquées vérifiées. Si un fait n'est pas dans la recherche et que tu n'en es pas certain, formule prudemment (« à vérifier sur la page officielle ») plutôt que d'inventer.

## Ce que tu produis (dans le dossier du module `niveaux/<niveau>/<Mxx-slug>/`)
- Une leçon par fichier `Lxxx-<slug>.md` (le slug attendu est dans `module.json` → `lessons[].file`), avec l'en-tête YAML complet (id, module, level, title, minutes, objectives, skills, sources).
- `quiz.json` : **10 questions** (types variés : qcm, vrai_faux, trouve_erreur, mise_en_situation), réparties sur toutes les leçons, `answer` index 0-based, `explanation` pédagogique obligatoire, `source` (titre + URL) quand une doc officielle justifie la réponse, `passScore: 70`.
- `module.json` : remplace le squelette existant en conservant `id, level, title, minutes, lessons` et en remplissant `description` (2-3 phrases), `objectives` (3-6, verbes d'action de la taxonomie de Bloom : identifier, expliquer, appliquer, construire, évaluer…), `skills` (codes du référentiel), `alignedWith` (cours / certifications tiers que ce module couvre, d'après la recherche), `sources` (5-15 {title, url} vérifiées).

## Qualité attendue (« la meilleure formation de l'univers sur l'IA »)
- Longueur : 900-1 800 mots par leçon de 40-60 min ; 1 500-2 500 mots au-delà de 60 min (hors blocs de code). Pas de remplissage : chaque paragraphe apprend quelque chose.
- Structure obligatoire (voir FORMAT.md) : bandeau durée/niveau/module, « 🎯 Ce que vous saurez faire », sections numérotées, encadrés 💡 À retenir / ⚠️ Piège fréquent / 🔗 Documentation officielle, « 🧪 Exercice pratique » (consigne + critères de réussite + corrigé ou pistes), « ✅ Auto-évaluation express » (3 questions + réponses), « 📚 Pour aller plus loin » (≥ 2 liens officiels, drapeau 🇬🇧 si en anglais).
- Pédagogie : analogies du quotidien, exemples professionnels français (PME, RH, commerce, artisanat, cabinet comptable…), tableaux comparatifs, schémas en ASCII ou Mermaid si utile, mini-défis ludiques (« 🎮 Défi »), anecdotes historiques exactes.
- Chaque leçon renvoie vers la **documentation officielle** pertinente (Anthropic/Claude, OpenAI, xAI, Perplexity, Mistral, Google, Hugging Face, n8n, MIT OCW, Stanford, 42, CNIL, EUR-Lex…). Les cours universitaires sont **cités comme sources d'inspiration**, jamais copiés (droits d'auteur / licences CC BY-NC).
- Chiffres (prix, tailles de modèles, dates, versions) : datés « (nov. 2026) » et sourcés. Modèles actuels : voir `_recherche/01` (Claude Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5), `_recherche/02` (GPT-6 famille, Grok 4.7, Gemini 4, Mistral Large 4 / Small 4), `_recherche/04` (modèles ouverts : Qwen3.8, Gemma 4, gpt-oss, DeepSeek V4.1, Kimi K3, Mistral Small 4, Llama 4…).
- Code : blocs complets et exécutables (Python 3.12+ / TypeScript / bash), clés API lues depuis des variables d'environnement, commentaires en français.
- Conformité : la formation couvre les référentiels des certifications tierces et **incite** à les passer ; ne jamais écrire que le certificat Next Formation « équivaut » à une certification tierce.
- Ne modifie **aucun** fichier en dehors de ton dossier de module. N'écris pas dans `_recherche/`.

## Vérification finale
Avant de terminer, exécute `cd /home/claude/formation-ia && node scripts/validate.mjs 2>&1 | grep -E "<TON_MODULE_ID>|Lxxx"` (remplace par tes ids) et corrige tout avertissement te concernant (longueur, liens, sections, JSON). Rends compte en 10 lignes maximum : fichiers écrits, nombre de mots, nombre d'URLs, points non vérifiés.
