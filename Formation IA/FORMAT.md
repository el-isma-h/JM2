# Formats de contenu — Formation IA Next Formation

Ce document fixe le format de **toutes** les leçons, quiz et examens. Il est conçu pour être
importé tel quel dans le module e-learning de Next Formation (`elearning_modules`,
`kind = "contenu"` → `{ format: "markdown", body }` ; `kind = "quiz"` → `{ questions: [{ q, options, answer }], passScore }`).

## Arborescence

```
Formation IA/
├── README.md                      ← présentation, chiffres clés, comment utiliser
├── FORMAT.md                      ← ce fichier
├── programme/
│   ├── programme.json             ← SOURCE DE VÉRITÉ (niveaux, modules, leçons, durées)
│   └── programme.md               ← généré : programme lisible (fiche formation)
├── referentiel/
│   ├── referentiel-competences.md ← compétences / critères / modalités (format France Compétences)
│   ├── referentiel-evaluation.md  ← épreuves, barèmes, jury
│   ├── correspondance-certifications.md ← couverture des référentiels tiers (Anthropic, n8n, AI-900…)
│   └── dossier-rs-france-competences.md ← trame du dossier d'enregistrement RS (CPF)
├── ressources/
│   └── bibliotheque-liens.md      ← toutes les URLs officielles, classées
├── niveaux/
│   └── N1-fondamentaux/
│       ├── niveau.md              ← présentation du niveau
│       ├── M01-comprendre-l-ia/
│       │   ├── module.json        ← métadonnées du module (objectifs, compétences, sources)
│       │   ├── L001-....md        ← une leçon = un fichier Markdown avec en-tête YAML
│       │   ├── ...
│       │   └── quiz.json          ← 10 questions
│       └── ...
├── examens/
│   ├── N1-examen.json             ← 40 questions, seuil 70 %
│   └── ...
├── export/
│   ├── elearning-modules.json     ← généré : prêt pour Next Formation
│   └── programme-catalogue.json   ← généré : fiche programme + modules (schéma catalog)
├── scripts/
│   ├── validate.mjs               ← vérifie structure, JSON, quiz, durées, liens
│   └── build.mjs                  ← génère programme.md, export/*.json
└── _recherche/                    ← dossiers de recherche (sources brutes)
```

## Leçon (`Lxxx-slug.md`)

```markdown
---
id: L001
module: M01
level: N1
title: "Histoire et définitions : IA, machine learning, deep learning, IA générative"
minutes: 40
objectives:
  - "Distinguer IA, machine learning, deep learning et IA générative"
  - "Situer les grandes dates de l'IA"
skills: ["C1.1"]
sources:
  - { title: "MIT 6.S191 — Lecture 1", url: "https://..." , lang: "en" }
---

# Titre de la leçon

> ⏱ 40 min · 🎯 Niveau 1 · 📚 Module 1

## 🎯 Ce que vous saurez faire
- …

## 1. Section
Texte pédagogique, exemples concrets, analogies. Encadrés :
> 💡 **À retenir** — …
> ⚠️ **Piège fréquent** — …
> 🔗 **Documentation officielle** — [Titre](url)

## 2. Section
…

## 🧪 Exercice pratique
Consigne précise + critères de réussite (+ corrigé en détail repliable si pertinent).

## ✅ Auto-évaluation express
3 questions rapides (réponses en fin de leçon).

## 📚 Pour aller plus loin
- [Titre](url) 🇬🇧 — une ligne de description
```

Règles :
- Français, termes techniques en anglais conservés entre parenthèses la première fois.
- Contenu **original** rédigé par nous ; les cours tiers (MIT, Stanford, 42…) sont cités comme sources, jamais copiés.
- Chaque leçon renvoie vers **au moins 2 pages de documentation officielle** (Anthropic, OpenAI, xAI, Perplexity, n8n, Hugging Face, MIT OCW…).
- Longueur cible : 900 à 1 800 mots pour 40-60 min (hors exercice), 1 800-2 500 mots au-delà.
- Code : blocs ```python / ```typescript / ```bash complets et exécutables.
- Les chiffres (prix, tailles, dates) sont datés « (nov. 2026) » et sourcés.

## Quiz de module (`quiz.json`)

```json
{
  "moduleId": "M01",
  "title": "Quiz — Comprendre l'intelligence artificielle",
  "passScore": 70,
  "questions": [
    {
      "id": "M01-Q01",
      "lessonId": "L001",
      "type": "qcm",
      "q": "Le deep learning est…",
      "options": ["un sous-ensemble du machine learning", "un synonyme d'IA", "une base de données", "un langage"],
      "answer": 0,
      "explanation": "Le deep learning utilise des réseaux de neurones profonds ; c'est une famille de méthodes du machine learning.",
      "source": { "title": "MIT 6.S191 Lecture 1", "url": "https://..." }
    }
  ]
}
```

- `type` : `qcm` (4 options, 1 bonne), `vrai_faux` (2 options), `trouve_erreur` (4 options : laquelle est fausse ?), `mise_en_situation` (cas pratique, 4 options).
- `answer` : index 0-based (compatible Next Formation).
- 10 questions par module, réparties sur toutes les leçons ; `explanation` obligatoire ; `source` recommandée.

## Examen de niveau (`examens/Nx-examen.json`)

Même format, 40 questions, `passScore: 70`, `timeLimitMinutes: 60`, couverture de tous les modules du niveau (≥ 3 questions par module).

## module.json

```json
{
  "id": "M01",
  "level": "N1",
  "title": "Comprendre l'intelligence artificielle",
  "minutes": 165,
  "description": "…(2-3 phrases)",
  "objectives": ["Verbe d'action (Bloom) + objet + condition", "…"],
  "skills": ["C1.1", "C1.2"],
  "alignedWith": ["Anthropic Academy — AI Fluency", "Elements of AI ch. 1"],
  "sources": [{ "title": "…", "url": "…" }],
  "lessons": ["L001", "L002", "L003", "L004"]
}
```

## Enrichissements pédagogiques (v1.1 — 5 nov. 2026)

Ajouts **additifs** : on n'enlève jamais de contenu existant d'une leçon ; on insère. Trois blocs normalisés, lisibles en Markdown brut et rendus interactifs par l'application e-learning (`app/`). L'export Next Formation (`scripts/build.mjs`) les convertit en Markdown classique.

### 1. « En clair » (vulgarisation) — un par leçon, juste après la section « 🎯 Ce que vous saurez faire »

```markdown
> 🧭 **En clair** — 3 à 6 phrases sans jargon, avec une analogie de la vie quotidienne (cuisine, voiture, bibliothèque, GPS…). Un lecteur qui ne lit que ce bloc a compris l'idée centrale de la leçon.
```

### 2. Quiz éclair d'intégration — 2 à 3 par leçon, placés à la fin des sections importantes (pas tous à la fin)

````markdown
```quiz
{
  "q": "Question courte qui vérifie la section qu'on vient de lire",
  "options": ["…", "…", "…", "…"],
  "answer": 1,
  "explanation": "Pourquoi, en une ou deux phrases."
}
```
````
- JSON strict (guillemets doubles, pas de virgule finale), `answer` index 0-based, 2 à 4 options, réponse non devinable par sa longueur.
- Variantes autorisées : `"type": "vrai_faux"` (options ["Vrai","Faux"]).

### 3. Mission documentation (« chasse à l'info ») — 1 à 2 par leçon quand une doc officielle s'y prête

````markdown
```mission
{
  "title": "Trouvez le prix d'un million de tokens de sortie de Claude Haiku 5.5",
  "url": "https://platform.claude.com/docs/en/about-claude/pricing",
  "steps": ["Ouvrez la page Pricing", "Repérez le tableau des modèles", "Lisez la colonne Output"],
  "question": "Combien coûte 1 M de tokens en sortie ?",
  "hint": "Cherchez la ligne Haiku 5.5.",
  "answer": "0,50 $ (nov. 2026) — vérifiez : les prix évoluent.",
  "xp": 15
}
```
````
- L'URL doit être une documentation officielle présente dans `_recherche/` ou `ressources/bibliotheque-liens.md` (jamais inventée).
- La réponse indique la date de référence quand elle peut changer.
- Missions variées : trouver un paramètre d'API, un prix, une limite, une commande, un exemple de code, une définition, un article de loi.

### 4. Lexique — `glossaire/glossaire.json`

`[{ "terme": "Token", "slug": "token", "categorie": "LLM", "niveau": "N1", "definition": "…(2-3 phrases simples)", "analogie": "…", "exemple": "…", "voirAussi": ["tokenizer"], "lecons": ["L005"], "source": { "title": "…", "url": "…" } }]`

### 5. Fiche mémo de module — `niveaux/Nx-…/Mxx-…/fiche.md`

Une page (450 à 750 mots) pour réviser le module en 5 minutes, imprimable :

```markdown
---
module: M01
title: "Fiche mémo — Comprendre l'intelligence artificielle"
---
# Fiche mémo — M01 · Comprendre l'intelligence artificielle

> En une phrase : …

## Les 7 idées à retenir
1. … (une ligne, renvoi `L001`)

## Le schéma à connaître
(Mermaid ou ASCII simple)

## Vocabulaire express
| Terme | En clair |
|---|---|

## Les pièges classiques
- …

## Les commandes / chiffres / dates utiles (si pertinent)

## Pour aller plus loin
- 3 liens officiels maximum

## Auto-test (3 questions — réponses en bas de fiche)
```
