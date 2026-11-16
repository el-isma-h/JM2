# Relecture indépendante N5 (référence : 5 novembre 2026)

Périmètre : les 29 leçons de `niveaux/N5-data-engineering/` M31 à M36 (L151 à L179), leurs 67 blocs ```quiz, leurs 34 blocs ```mission et les 6 `quiz.json` (60 questions). **M37 n'a pas été touché**, pas plus que `module.json`, `programme.json` et `examens/`. Les sources de vérité sont `_recherche/06-data-engineering-big-data.md`, `_recherche/07-mise-a-jour-nov-2026.md` et `ressources/bibliotheque-liens.md`. Le web n'a pas été utilisé. Cette relecture vient après `_harmonisation-N5.md`, dont les extraits exécutés n'ont pas été rejoués.

## Méthode

- **Quiz** : un script extrait chaque bloc ```quiz et chaque question de `quiz.json`. Il vérifie le JSON, l'index `answer` et l'absence d'option en double, puis compare la longueur de la bonne réponse à celle de la plus longue des autres options (seuil : + 15 %). Chaque question a aussi été relue : une seule bonne réponse défendable, et une explication cohérente avec la leçon. Les calculs ont été refaits : LSH (P = 1 − (1 − s^8)^14 pour s = 0,5 à 0,9, seuil (1/14)^(1/8) ≈ 0,72), écart-type MinHash, mémoire des vecteurs (10 M × 1 024 × 4 o ≈ 41 Go), clé NIR (97 − 1029384756102 mod 97 = 55).
- **Missions** : chaque URL est comparée aux URLs de `_recherche/*.md`, de `bibliotheque-liens.md` et de la leçon elle-même. Chaque réponse est confrontée à `_recherche/06` (versions, certifications, tarifs, dates).
- **Affirmations techniques** : la prose de chaque leçon a été relue, sans les blocs de code (environ 48 000 mots). Points contrôlés : SQL et DuckDB, Spark, Kafka, Flink, dbt, Airflow et Dagster, Delta, Iceberg et Hudi, ODCS, RGPD, AI Act, Postgres (RLS, réplication).
- **Vulgarisation** : présence et lisibilité du bloc « 🧭 En clair » dans les 29 leçons.
- **Mermaid** : les 3 diagrammes (L151, L154 ×2) ont été extraits et rendus avec `mmdc` (puppeteer `--no-sandbox`) dans `scratchpad/relecture-n5/mmd/`. Les 3 rendus sont OK. Les autres leçons n'ont pas de bloc mermaid.
- **Certifications** : toutes les mentions ont été relues (L151, L158, L159, L163, L165, L167, L170).

## Corrections appliquées

### A. Affirmations techniques et texte (5)

| # | Fichier | Avant → Après | Justification |
|---|---|---|---|
| 1 | `M35/L174` § 2, piège RLS | « Le propriétaire d'une table et les superutilisateurs contournent la RLS, sauf `FORCE ROW LEVEL SECURITY` » → « les superutilisateurs et les rôles `BYPASSRLS` contournent **toujours** la RLS ; le propriétaire de la table aussi, sauf `FORCE ROW LEVEL SECURITY` » | `FORCE` ne s'applique qu'au propriétaire. Un superutilisateur ou un rôle `BYPASSRLS` n'y est jamais soumis. |
| 2 | `M35/L174` § 5, calendrier | « 2026/1744 — information à confirmer sur EUR-Lex » → « 2026/1744 (publié au JOUE le 24 juillet 2026, en vigueur le 27 juillet 2026) ; relisez la version consolidée sur EUR-Lex » | `_recherche/07` P6 et C18 : le règlement est confirmé, il faut retirer « à confirmer ». |
| 3 | `M35/L174` § 1 | « seules quelques personnes (et aucun index vectoriel) **n'**accèdent » → « … accèdent » | Le « ne » explétif inversait le sens. |
| 4 | `M31/L154` En clair | « chaque outil **à** une seule place » → « **a** » | Faute d'accord. |
| 5 | `M32/L157` mission « comparatif 2026 » | URL `…vs-delta-lake-vs-apache-hudi-2026/` → `…vs-delta-lake-vs-hudi-2026/` | Le slug ne correspondait ni à `_recherche/06` l. 69 ni aux sources de la leçon. La réponse (Iceberg 1.10, spec V3, Hudi + DeltaStreamer, 20 mars 2026) est conforme. |

### B. Réponses devinables par la longueur (74 questions rééquilibrées, `answer` jamais modifié)

Avant la relecture, 40 blocs de leçon et 34 questions de `quiz.json` avaient une bonne réponse plus longue de plus de 15 % que la plus longue des autres options, souvent de 2 à 4 fois. Après correction, **0** cas sur les 127 questions. Deux procédés ont été utilisés : raccourcir la bonne réponse sans perdre son contenu décisif, ou allonger les distracteurs avec un détail plausible mais faux.

- **Leçons (40 blocs)** : L151, L152, L153, L154 ×2, L155, L156, L157, L158 ×2, L159, L160 ×2, L161 ×2, L162 ×2, L163 ×2, L164 ×2, L165, L166 ×2, L168 ×2, L169, L171 ×2, L172, L173, L174, L175, L176 ×3, L177, L178, L179 ×2.
- **`quiz.json` (34 questions)** : M31-Q02, Q03, Q05, Q06, Q09 · M32-Q01, Q02, Q03, Q05, Q07, Q08, Q10 · M33-Q01, Q02, Q03, Q04, Q05, Q07, Q08 · M34-Q01, Q02, Q04, Q07, Q10 · M35-Q04, Q07, Q08, Q10 · M36-Q01, Q02, Q03, Q05, Q06, Q07.
- **Cas notables** :
  - M31-Q06 : les distracteurs `HAVING` et `WHERE` reçoivent la même fenêtre complète que la bonne réponse `QUALIFY`.
  - M36-Q01 : « Feast » est remplacé par « BeautifulSoup », car 4 noms d'outils ne se rééquilibrent pas autrement.
  - L154 : « max(ca_ht) » est remplacé par le piège plausible « sum / count(DISTINCT client_sk) ».
  - L173 : l'option « La qualité (distribution des valeurs) » devient « La qualité » ; l'explication garde la mention « anciennement distribution ».
  - Les distracteurs ajoutés sont vérifiablement faux. Par exemple, `current_date` existe en SQL standard, read_parquet de Polars est multithread et Hudi n'a pas de partitionnement caché.
- Les explications n'ont pas eu besoin d'être modifiées : elles restent exactes pour les nouvelles options.

## Contrôles sans correction

- **`answer` et bonne réponse unique** : les 127 questions sont correctes et chaque explication est cohérente. Les Vrai/Faux ont été vérifiés un par un : upsert après commit, share groups KIP-932, `exactly_once_v2` et e-mail, REPLICA IDENTITY, DVC, rappel PII, alias de collection, etc.
- **Missions (34)** : 33 URLs figurent dans `_recherche/` ou `bibliotheque-liens.md`. L'URL EUR-Lex 2024/1689 de L174 se trouve dans les sources de la leçon, ce qui est autorisé. Toutes les réponses changeantes sont datées « nov. 2026 » et concordent avec `_recherche/06` :
  - Airflow 3.3.2 (17 sept. 2026) et rachat de Dagster par Prefect (13 juillet 2026) ;
  - PySpark 4.3.0 et Ray 2.60 ;
  - certification dbt (65 questions, 2 h, 65 %, dbt 1.11, 200 $) ;
  - Google PDE (2 h, 40-50 questions, 200 $, sous-domaine 4.2) ;
  - CCDAK (90 min, anglais, validité 2 ans) ;
  - ODCS v3.1.0 ;
  - APEC (35-60 k€, moyenne ≈ 47 k€) ;
  - Feast « Vector Database » en alpha.
- **En clair** : présent dans les 29 leçons, sans jargon non expliqué, toujours avec une analogie (cuisine, bibliothèque, déménagement, tapis roulant, transport de fonds…). Aucun bloc n'a été ajouté.
- **Certifications** : elles sont toujours présentées comme une préparation. Exemples : L158 (colonne « Certification liée (préparation) » et encadré « la préparation spécifique reste à faire »), L151 (« sans s'y substituer »), L167 (« sans s'y substituer ») et L170 (« une préparation, pas un équivalent »). Aucune équivalence n'est revendiquée.
- **Points techniques vérifiés et justes**, entre autres :
  - SQL et DuckDB : ordre WHERE → GROUP BY/HAVING → fenêtres → QUALIFY, cadre par défaut d'une fenêtre ordonnée, `timezone()` qui renvoie un TIMESTAMPTZ ;
  - Delta, Iceberg et Hudi : DELETE puis VACUUM, checkpoint Delta environ tous les 10 commits, partitionnement caché d'Iceberg ;
  - Spark : AQE en 3.0 (activée par défaut en 3.2), Spark Connect en 3.4, ANSI et Java 17 en 4.0, broadcast à 10 Mo ;
  - Kafka et Avro : Kafka 4.0 (ZooKeeper supprimé, KIP-848 GA, KIP-932 en accès anticipé, Java 11/17), compatibilité BACKWARD et champ par défaut, promotions Avro ;
  - dbt : `data_tests` (1.8), `arguments` (1.10), unit tests (1.8), `+state:modified+` et `--defer` ;
  - Debezium : `before` nul en UPDATE avec REPLICA IDENTITY DEFAULT ;
  - RGPD : pseudonymisation ≠ anonymisation, délai d'un mois ;
  - AI Act : art. 10, paragraphes 2, 3 et 5.

## Points signalés, non corrigés (hors « certitude » ou hors mandat)

1. `M33/L161` § 3 : l'encadré « Documentation officielle — DuckDB 2.0 » pointe vers le guide Polars (`/docs/2.0/guides/python/polars.html`), seule page DuckDB 2.0 présente dans `_recherche/`. L'intitulé annonce QUALIFY, `read_csv` et les transactions. Proposition optionnelle : renvoyer vers l'index de la documentation 2.0 une fois l'URL vérifiée et ajoutée à la bibliothèque.
2. `M35/L173` : l'attribution des cinq piliers à « un essai de décembre 2020 » de Barr Moses n'est pas sourcée dans `_recherche/`. Elle est plausible, mais n'a pas été vérifiée.
3. `M33/L164` : le partitionnement d'assets d'Airflow 3.2 et 3.3 est déjà signalé dans le texte comme « d'après un comparatif tiers ; à vérifier ». Rien à changer.

## Validation

`node scripts/validate.mjs | tail -3` → « ✅ Aucune erreur bloquante. » Seul reste l'avertissement préexistant `examens/N5-examen.json` manquant, hors périmètre.

Sauvegarde de l'état avant rééquilibrage des quiz : `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/relecture-n5/backup-N5-avant-quiz/`. Elle contient déjà les corrections A1 à A5. Le script de correction est `…/relecture-n5/patch_quiz.py`.
