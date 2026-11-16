# Grille d'évaluation — RAG sans code (lab L048)

Remplissez `grille-resultats.csv` (une ligne par question et par outil), puis reportez les totaux ici. Faites **au moins deux** des trois tutoriels avec le **même** jeu de documents et les **mêmes** questions.

## 1. Notation par question

| Colonne | Valeur | Règle |
|---|---|---|
| `juste_0_1` | 1 si la réponse contient tous les `elements_obligatoires` de `questions-test.json` et ne contredit pas `reponse_attendue` | Q05 : « 5,5 % » sans la condition = 0. Q08 : 12 € sans le détail du calcul = 0. |
| `source_correcte_0_1` | 1 si la citation (crochets, citation Dify, numéro NotebookLM) renvoie à `source_attendue` | Une bonne réponse mal sourcée vaut 0 ici. |
| `refus_correct_0_1` | Q09 et Q10 seulement : 1 si l'assistant dit ne pas savoir ou refuse, **sans inventer** de prix ni de météo | Un prix de véranda inventé = 0, quel que soit le reste. |

## 2. Totaux par outil

| Indicateur | n8n | Dify / Flowise | NotebookLM |
|---|---|---|---|
| Réponses justes (Q01 à Q08) | … / 8 | … / 8 | … / 8 |
| Sources correctes (Q01 à Q08) | … / 8 | … / 8 | … / 8 |
| Refus corrects (Q09, Q10) | … / 2 | … / 2 | … / 2 |
| Temps de mise en place | … min | … min | … min |
| Modèle d'embeddings (ingestion = consultation) | … | … | (non réglable) |
| Modèle de génération | … | … | Gemini (non réglable) |

## 3. Critères de réussite (adaptés de la leçon L048)

La leçon demande cinq questions dont une hors sujet ; le lab en fournit dix dont deux hors base. Pour chaque outil testé :

- [ ] **≥ 6 réponses justes sur 8** dans la base (la leçon : ≥ 3 sur 4) et **les deux refus corrects** (Q09, Q10).
- [ ] Chaque réponse juste **cite le bon document** (titre ou passage).
- [ ] Vous expliquez en **deux phrases** pourquoi un outil a mieux répondu que l'autre (découpage, `k`, modèle, extraction, recherche hybride…).
- [ ] Dans n8n ou Dify, le modèle d'embeddings est **le même** pour l'ingestion et la consultation, et il est noté dans une Sticky Note ou la description de la base.

## 4. Lecture des écarts (pistes de corrigé de la leçon)

- NotebookLM répond souvent mieux « du premier coup » (découpage et recherche optimisés), mais ne permet rien d'autre.
- n8n avec *Simple Vector Store* et `k = 5` répond bien aux questions factuelles mais peut rater une réponse répartie sur deux passages (Q07) : augmentez l'*overlap* ou `k`.
- Dify en mode hybride retrouve mieux les références exactes (« CBC-10 », « article 3 ») que le vectoriel seul.
- Une question hors base acceptée (Q09) signale un prompt système trop permissif : ajoutez une consigne explicite de refus et vérifiez le seuil de score.
- Un petit modèle local (`gemma4:e4b`) cite moins régulièrement ses sources qu'un modèle hébergé : mesurez l'écart avant de conclure qu'il « ne marche pas ».
