# Brief — enrichissement pédagogique des leçons (v1.1)

Tu améliores des leçons EXISTANTES de la formation IA Next Formation (`/home/claude/formation-ia/`). Le client veut « la meilleure formation du marché » : plus simple, plus vulgarisée, plus ludique, plus interactive. N'utilise pas l'outil Artifact, ne publie rien.

## Règles absolues
- **Additif uniquement** : ne supprime aucune section, aucun paragraphe, aucun exemple, aucun lien, aucun code existant. Tu peux corriger une coquille ou une erreur factuelle certaine (signale-la), et reformuler une phrase trop jargonneuse **en la conservant** suivie d'une explication plus simple.
- Ne change ni `id`, ni `title`, ni `minutes`, ni le nom des fichiers, ni `quiz.json`, ni `module.json` (sauf demande ci-dessous), ni `programme.json`.
- Ne touche qu'aux leçons de ton périmètre (liste dans ta consigne).
- Français, vouvoiement, ton chaleureux et concret. Pas de jargon non expliqué : chaque terme technique est expliqué la première fois en une phrase simple (ou renvoyé au lexique).

## À ajouter dans CHAQUE leçon (format exact dans `FORMAT.md`, section « Enrichissements pédagogiques »)
1. **🧭 En clair** : un bloc juste après « 🎯 Ce que vous saurez faire ». 3 à 6 phrases, une analogie du quotidien, compréhensible par quelqu'un qui n'a jamais codé (même au niveau 4 : on vulgarise l'idée, pas le détail).
2. **2 à 3 quiz éclair** (blocs ```quiz JSON) répartis après les sections clés. Ils vérifient la compréhension de la section précédente, avec une explication. Varie les formats (qcm, vrai_faux, mise en situation métier). Bonne réponse à une position variée, pas la plus longue.
3. **1 à 2 missions documentation** (blocs ```mission JSON) quand la leçon s'y prête : l'apprenant doit aller chercher une information précise dans une doc officielle (Anthropic/Claude, OpenAI, xAI, Perplexity, Mistral, Google, Hugging Face, n8n, Ollama, PyTorch, scikit-learn, CNIL, EUR-Lex, Légifrance…). URL **uniquement** issue de `_recherche/*.md`, de `ressources/bibliotheque-liens.md` ou déjà présente dans la leçon. Réponse datée si elle peut changer.
4. **Améliorations de clarté** (sans rien retirer) : là où un passage est dense, ajoute juste après un encadré `> 💡 **Autrement dit** — …` qui reformule simplement ; ajoute un schéma ASCII/Mermaid si une notion est spatiale ou séquentielle et qu'il n'y en a pas ; ajoute un mini « 🎮 Défi » si la leçon n'en a pas.
5. En fin de leçon, si absent, un encadré `> 🗺️ **Et maintenant ?**` qui relie la leçon à la suivante en une phrase.

## Contrôle
- Valide chaque bloc JSON : `python3 -c "import re,json,sys; s=open(sys.argv[1]).read(); [json.loads(b) for b in re.findall(r'\`\`\`(?:quiz|mission)\n(.*?)\n\`\`\`', s, re.S)]; print('ok')" FICHIER`
- Puis `cd /home/claude/formation-ia && node scripts/validate.mjs 2>&1 | tail -3` (zéro erreur).
- Compte rendu final en 6 lignes : leçons traitées, nombre de quiz éclair et de missions ajoutés, corrections factuelles faites, doutes.

## Fichiers temporaires
Plusieurs agents travaillent en parallèle : place tous tes scripts et fichiers temporaires dans un sous-dossier **à ton nom de périmètre** (ex. `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/enr-M18-M19/`), jamais directement à la racine du scratchpad, et n'utilise jamais un script écrit par un autre agent.
