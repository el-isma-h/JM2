# Lab L077 — Devis-Express : assistant métier avec Claude

| | |
|---|---|
| Leçon liée | [L077 — Projet : assistant métier avec Claude](../../niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/L077-projet-assistant-metier-avec-claude.md) (module M17, niveau 3) |
| Compétences | C3.1, C3.2, C3.4 |
| Durée | 3 à 4 h pour les 7 TODO + 2 h pour le mode réel et le README de livraison |
| Prérequis | Python 3.10+ **ou** Node.js 20+ ; aucune clé API pour démarrer |
| Langages | Python (`python/`) et TypeScript (`typescript/`) : faites l'un, les deux donnent le bonus |

## Objectif

Construire l'orchestrateur de **Devis-Express**, l'assistant de Karim Électricité (Toulouse) qui transforme une demande client en **brouillon de devis** : il cherche les prestations dans le catalogue, obtient la TVA d'une règle codée, liste ce qui manque, et **n'enregistre rien sans l'accord de l'artisan**. Le modèle comprend et structure ; le code calcule, contrôle et décide.

## Contenu

```
lab-claude-devis/
├── donnees/                  partagé par les deux langages
│   ├── catalogue.json        24 prestations fictives (source de vérité des prix)
│   ├── schema_devis.json     schéma de la sortie structurée finale
│   ├── prompt_systeme.txt    system prompt (version devis-express-v2)
│   └── demandes_eval.jsonl   12 cas d'évaluation (standard, hors catalogue, ambigus, injection)
├── python/                   STARTER Python : 7 TODO guidés + tests pytest
├── typescript/               STARTER TypeScript : 7 TODO guidés + tests vitest
├── solution/python/          corrigé Python (mêmes tests, tous verts)
├── solution/typescript/      corrigé TypeScript
└── .env.example
```

## Démarrer en cinq minutes (sans clé)

Sans `ANTHROPIC_API_KEY`, le lab tourne en **mode simulé** : un faux client (`simulation.py` / `simulation.ts`) imite la forme des réponses de la Messages API (`content[]`, `stop_reason`, `usage`) de façon déterministe. Aucun appel réseau, aucun coût.

```bash
# Python
cd python
python -m venv .venv && source .venv/bin/activate     # Windows : .venv\Scripts\activate
pip install -r requirements.txt
pytest                      # 25 tests ROUGES au départ : c'est normal
python -m devis_express     # démo (échoue tant que les TODO ne sont pas faits)

# TypeScript
cd typescript
npm install
npx vitest run              # 25 tests rouges au départ
npx tsx src/cli.ts          # démo
```

Chaque test rouge affiche le TODO à réaliser (`NotImplementedError: TODO 2 : …` ou `Error: TODO 2 : …`).

## Énoncé : les 7 TODO

Faites-les dans l'ordre : les outils se testent **sans modèle**, avant de brancher la boucle (piste de démarrage de la leçon).

| TODO | Fichier (Python / TS) | Ce que vous codez | Exigence du cahier des charges |
|---|---|---|---|
| 1 | `outils.py` / `outils.ts` | `rechercher_prestation` : recherche dans le catalogue, 8 résultats max, message « hors catalogue » | E2 |
| 2 | idem | `verifier_tva` : les quatre règles 20 / 5,5 / 10 / 20 % | E4 |
| 3 | idem | `enregistrer_devis` : confirmation humaine, sinon refus | E6 |
| 4 | idem | `controler_devis` : code inconnu, prix non conforme, total incohérent, taux interdit | E2, E3 |
| 5 | idem | `cout_usd` : coût à partir de `usage` (entrée, sortie, écriture et lecture de cache) | E7 |
| 6 | `orchestrateur.py` / `.ts` | `executer_outil` : dispatch, erreurs renvoyées au modèle (`is_error`) | E6, robustesse |
| 7 | idem | la boucle `tool_use` → `tool_result`, journal des outils appelés | E9 |

Étapes conseillées :
1. TODO 1, 2, 5 : `pytest tests/test_outils.py` doit passer au vert.
2. TODO 3 et 4 : relisez la section 3.2 de la leçon (contrôles métier « le schéma garantit la forme, pas le fond »).
3. TODO 6 et 7 : `pytest` entier vert, puis `python -m devis_express.evaluer` (ou `npx tsx src/evaluer.ts`) affiche le tableau d'évaluation des 12 cas.
4. Observez les « pannes » du faux client : `ClientSimule(erreur_prix=True)` (votre contrôle doit lever « prix non conforme »), `naif=True` sur la demande D09 (l'injection tente `enregistrer_devis` : la confirmation doit bloquer), `boucle_infinie=True` (le plafond de tours doit s'appliquer).
5. Passez en mode réel (ci-dessous) et comparez le coût moyen mesuré à l'exigence E7 (≤ 0,05 $).

## Passer en mode réel

```bash
cp .env.example .env          # puis renseignez ANTHROPIC_API_KEY (jamais dans le code, jamais dans Git)
export $(grep -v '^#' .env | xargs)
pip install "anthropic>=2.0"            # Python : SDK v2 (oct. 2026)
npm install @anthropic-ai/sdk           # TypeScript
LAB_MODE=reel python -m devis_express "Bonjour, je voudrais 3 prises dans le salon. Maison de 1998. Mme Fabre"
```

En mode réel, l'orchestrateur utilise `claude-sonnet-5-5`, les trois points de cache de la leçon (outils, system, catalogue via `CATALOGUE_FILE_ID` si vous avez téléversé le PDF avec la Files API) et la sortie structurée `output_config.format = json_schema`. Ne passez **pas** de `temperature` : avec la version d'API `2026-10-21`, elle renvoie une erreur 400 (voir `_recherche/07-mise-a-jour-nov-2026.md`). Vérifiez dans `journal.jsonl` que `cache_r` est non nul dès la deuxième demande.

Le mode simulé ne mesure **pas** la qualité du modèle : il vérifie votre plomberie (boucle, outils, erreurs, contrôles, coûts). Les scores qui comptent pour la grille se mesurent en mode réel.

## Critères de réussite (repris de la leçon L077, section 4, seuil 70/100)

- **Architecture justifiée (20)** : choix du modèle chiffré ; usage pertinent du cache, de la Files API, des sorties structurées, des outils.
- **Fonctionnement (25)** : 3 formats d'entrée traités (texte, photo, PDF via `--piece-jointe`) ; boucle d'outils robuste (erreurs, plafond de tours) ; JSON toujours valide.
- **Fiabilité (20)** : 0 prix inventé sur l'évaluation ; TVA correcte ≥ 90 % ; questions manquantes pertinentes ; injection neutralisée.
- **Coûts et performance (15)** : journal `usage` ; coût moyen ≤ 0,05 $ ; `cache_read_input_tokens` > 0 dès la 2e demande ; p95 < 15 s.
- **Sécurité et conformité (10)** : clés en variables d'environnement ; aucune donnée client dans le prompt système ; confirmation humaine effective ; durée de conservation des fichiers justifiée.
- **Documentation et évaluation (10)** : README complet ; suite d'évaluation exécutable en CI ; limites documentées.

Contraintes non négociables de l'exercice : au moins 3 outils dont 1 en écriture avec confirmation humaine, 1 fichier via la Files API, 1 sortie structurée finale, le caching ; suite d'évaluation ≥ 20 cas (complétez les 12 fournis) avec notation code + juge, exécutée en Batch en mode réel.

## Mission documentation

Trois recherches à faire dans la documentation officielle avant de passer en mode réel. Notez la réponse et la date de consultation dans votre README de livraison.

1. **Tool use** — <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview> : quel `stop_reason` signale un appel d'outil, et comment signaler au modèle qu'un outil a échoué (champ du bloc `tool_result`) ?
2. **Structured outputs** — <https://platform.claude.com/docs/en/build-with-claude/structured-outputs> : quel paramètre impose un schéma JSON à la réponse, et avec quelle fonctionnalité est-il incompatible ?
3. **Prompt caching** — <https://platform.claude.com/docs/en/build-with-claude/prompt-caching> : combien de points de cache (`cache_control`) peut-on poser au maximum, dans quel ordre l'API lit-elle `tools`, `system` et `messages`, et quelle est la taille minimale d'un préfixe cachable ?

## Pour aller plus loin

- Ajoutez 8 cas à `donnees/demandes_eval.jsonl` (photos floues, prestations composées) pour atteindre les 20 cas exigés.
- Remplacez `confirmer_console` par le bouton « Valider » d'une page web (étape 4 de la leçon).
- Ajoutez un juge LLM binaire « questions pertinentes » (Opus 5.5) et exécutez l'évaluation avec la Message Batches API (−50 %).
