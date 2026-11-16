# Harmonisation du niveau 5 (M31 à M36, L151 à L179)

Date : 5 novembre 2026. Périmètre : `niveaux/N5-data-engineering/M31` à `M36`, leçons et `quiz.json`.
Fichiers non modifiés : M37, `programme.json`, `module.json`.
Référence : L151 (schéma `erp.*`, dictionnaire, docker-compose, conteneur `breval-postgres`, base `breval`) et L152 (`generer_breval.py` 1.0.0, graine 42, `data/raw|bronze|silver|gold`).

## 1. Décisions de cohérence

| Sujet | Décision retenue |
|---|---|
| Base DuckDB | **Un seul entrepôt, `breval/data/breval.duckdb`**, du début à la fin du niveau. Schéma `main` : ateliers M31 et tables simplifiées de M35. `bronze` : dlt (L162). `silver`, `gold`, `snapshots` : dbt (L163). Les noms `pme.duckdb` et `breval.duckdb` (à la racine) disparaissent. |
| « Vue simplifiée » de M35 | Conservée (colonnes `id`, `montant_ttc`, `cree_le`, `maj_le`…), mais **construite explicitement depuis la couche bronze de L152** par le script `creer_tables_qualite.py` (L170). Ce sont des tables et non des vues, parce que L173 et L174 font des `DELETE` et des `UPDATE` dessus. |
| Défauts de démonstration | Les défauts réels du générateur sont gardés : 240 doublons d'export, 11 dates « 206x » (donc `maj_le < cree_le`), 46 montants négatifs, téléphones dans les tickets. Trois défauts que le générateur ne produit pas sont ajoutés, avec des identifiants ≥ 900000 : client sans ville, client inexistant (999999), statut « Livrée ». Un ticket contenant un IBAN est aussi ajouté. Chaque défaut pédagogique d'origine a donc un équivalent. |
| Statuts | Ce sont ceux de L151 partout : `brouillon, validee, livree, facturee, annulee` pour les commandes et `ouvert, en_cours, resolu, clos` pour les tickets. |
| Table MERGE de L153 | Renommée `clients_a_jour`, pour qu'elle n'entre pas en collision avec `main.clients` de M35. |
| Échelle 10 | Toujours dans une copie `breval-x10/`, pour que `breval/` reste à l'échelle 1, dont dépendent tous les chiffres attendus. |
| Chaîne du corpus M36 | `silver_filtre.jsonl` (L175) → `apres_minhash.jsonl` (L176) → `silver_tickets.jsonl` pseudonymisé (L177) → `chunks.parquet` (L178). C'est la chaîne déjà décrite par le `dvc.yaml` de L179. |

## 2. Incohérences et corrections

| # | Incohérence | Fichier | Correction |
|---|---|---|---|
| 1 | `con.execute(...).fetchone()[0]` suivi d'un `con.sql(...)` : DuckDB 2.0 lève `ResourceInUseException` (résultat non terminé) | L152 `vers_bronze.py` | `.fetchall()[0][0]`, avec un commentaire |
| 2 | Le `DESCRIBE` annonce « un type texte » pour `satisfaction`, alors que DuckDB infère `JSON` | L152 | Texte corrigé (`JSON`) |
| 3 | « Un petit nombre de row groups » : il n'y en a qu'un seul (120 240 lignes) à l'échelle 1 | L152 | Précision ajoutée (≈ 122 880 lignes par row group ; une dizaine à l'échelle 10) |
| 4 | L'exercice régénère l'échelle 10 dans `data/raw`, ce qui écrase le jeu de référence des leçons suivantes | L152, L155 | Passage par une copie `breval-x10/` (comme en L159) |
| 5 | « Les documents restent identiques » quelle que soit l'échelle : faux, car les anciennes versions et les dates changent (125 documents à 0,05, d'autres `PRC-xxx-vN` à ×10) | L151 | Phrase corrigée : seuls le catalogue et les agences sont identiques ; les chiffres cités valent pour l'échelle 1 |
| 6 | Trois bases différentes : `breval.duckdb` (M31), `data/breval.duckdb` (M33), `pme.duckdb` (M35, M36) | L153, L154, L155, L162, L163, L170, L171, L173, L174, L179 | Tout pointe vers `data/breval.duckdb` ; un commentaire en L162 et L163 indique que c'est le même fichier |
| 7 | Contrôle « CA gold = CA silver » à `false` : `remise_pct / 100` produit un `DOUBLE` et l'arrondi diffère d'un ordre de sommation à l'autre | L154 `fait_ventes`, L155 `gold.sql` + `controles.sql` | `CAST(round(...,2) AS DECIMAL(12,2))` pour `ca_ht` et `marge_ht` : le contrôle passe à `true` |
| 8 | « Même vue simplifiée que pour dbt en L163 » : L163 ne contient aucune vue simplifiée | L170 | Le renvoi est supprimé ; les tables sont créées par un script SQL depuis la couche bronze de L152, et le tableau de correspondance est mis à jour (`raison_sociale` / `prenom`+`nom`, `montant_ht` × 1,20, `messages[1].texte`, `ouvert_le` en heure de Paris) |
| 9 | Données inventées sans lien avec Bréval (Boulangerie Martin à Lyon, client 9, commandes 100 à 104) et `pip install duckdb==1.*` | L170 `creer_pme.py` | Remplacé par `creer_tables_qualite.py` (DuckDB 2.0, dérivé de L152) ; les résultats attendus des tests sont réécrits avec les vrais chiffres |
| 10 | Statuts `en_attente, payee, expediee` inexistants | L170 (dimensions, dbt, GX, SodaCL), L171 (enum ODCS), quiz M35 | Remplacés par les statuts de L151 |
| 11 | Source dbt `pme`, data source Soda `pme`, `add_pandas("pme_pandas")` | L170 | `qualite` / `breval` / `breval_pandas` |
| 12 | Contrat ODCS : `DECIMAL(10,2)` alors que la table est en `DECIMAL(12,2)` ; `path: pme.duckdb` ; la CI lance `creer_pme.py`, qui n'existe plus | L171 | `DECIMAL(12,2)`, `data/breval.duckdb` ; la CI enchaîne `generer_breval.py --echelle 0.05 && vers_bronze.py && creer_tables_qualite.py` |
| 13 | Namespaces OpenLineage `duckdb://pme`, `pme-rag`, `urn:pme-fil-rouge` | L172 | `duckdb://breval`, `breval-rag`, `urn:breval:…` |
| 14 | `information_schema.columns WHERE table_name = ?` mélange `main.commandes` et `bronze.commandes` (dlt) dans le même fichier | L173 `moniteurs.py` | Ajout de `table_schema = 'main'` |
| 15 | L'exercice simule un historique de volume à environ 3 000 lignes alors que la table en compte environ 120 240 : l'alerte de volume se déclenche dès l'étape 1 | L173 | Consigne et piste mises à 120 240 ± 150 |
| 16 | `acces.sql` sur « la base pme (PostgreSQL 16+) » avec une table vide | L174 | Base `breval` du conteneur `breval-postgres` (Postgres 17), commande `docker exec`, `INSERT … FROM erp.clients` |
| 17 | `effacement.py` sur `pme.duckdb` | L174 | `data/breval.duckdb` |
| 18 | MinHash n'écrit pas `corpus/apres_minhash.jsonl`, alors que `dedup_semantique.py` (L176) et `dvc.yaml` (L179) le lisent | L176 | Écriture des documents gardés ajoutée |
| 19 | « `PRC-007` et `PRC-007-v2` » : le jeu contient `PRC-007` (v2) et `PRC-007-v1` | L176 | Corrigé |
| 20 | L'anonymisation lit `bronze_tickets.jsonl`, ce qui contourne la déduplication ; le chunker lit `corpus/silver/*.parquet`, qui n'est pas pseudonymisé, alors que son schéma annonce « texte pseudonymisé, L177 » | L177, L178, L179 (`dvc.yaml`) | L177 lit `apres_minhash.jsonl` (tickets et documents), L178 lit `silver_tickets.jsonl`, et le `dvc.yaml` déclare `silver_filtre.jsonl` |
| 21 | `pl.DataFrame(lignes)` plante (`client_id` nul pour les 126 premiers documents, puis entier) | L178 `chunker.py` | `infer_schema_length=None` |
| 22 | « Les tickets contiennent IBAN, NIR, noms, adresses » : le générateur ne met que des téléphones (15 % des tickets) | L177 | Texte aligné sur L151 et L152 ; les autres PII sont présentées comme des ajouts d'exemple |
| 23 | « PME fil rouge (5 000 documents × 20 chunks) » | L178 | Ligne Bréval ajoutée (≈ 10 000 chunks, 41 Mo en float32) ; l'ancienne ligne devient « PME plus documentée » |
| 24 | SDV entraîné sur toute la base avec `scale=50`, et le commentaire « quelques lignes » | L179 | Échantillon de 300 clients et de leurs commandes sans doublons, `scale=2` ; « client de Lille » devient « Redon » (ville du jeu) ; `pme_features` devient `breval_features` |
| 25 | Exemple d'événement Debezium (commande 42) incompatible avec le jeu généré | L169 | Les valeurs réelles sont reprises (client 2606, `telephone`, `1704199281000000`, `19725`, `"3619.56"`) |
| 26 | `python -m venv .venv` recrée l'environnement, alors que L162 réutilise celui de L151 | L167 | `source .venv/bin/activate  # environnement de L151` |
| 27 | Cycle « créée → payée → expédiée » | L167, quiz M34 | « créée → validée → livrée » ; « validée » dans le quiz |
| 28 | Quiz M33 : curseur sur `maj_le` (nom de M35), alors que l'ERP a `mis_a_jour_le` | quiz M33 | `mis_a_jour_le` |
| 29 | Quiz M34 : « MERGE sur id » | quiz M34 | « MERGE sur commande_id » (comme dans L169) |
| 30 | Mots attendus « livraison », « facture » dans le MapReduce : le top 10 réel est cmd, commande, chantier, unités… | L156 | Texte aligné |
| 31 | Le `CREATE TABLE` BigQuery utilise `date_commande`, alors que le `fait_ventes` gold a `date_sk` | L158 | Commentaire « variante dénormalisée du fait_ventes de L155 » |

## 3. Extraits exécutés et résultats

Environnement : venv Python 3.13 dans `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/n5-harmonisation/`. Bibliothèques : DuckDB 2.0.0, Polars 2.1.0, pandas 3.1.1, pyarrow 26.0.1, fastavro. Les extraits sont tirés automatiquement des blocs de code des leçons, puis exécutés dans un dossier `breval/` vierge (`run2/`).

| Étape | Extraits | Résultat |
|---|---|---|
| Génération | L152 `generer_breval.py` (échelle 1, puis 0,05 et 10) | Les nombres de lignes sont identiques à la sortie attendue (126 / 3 / 5 075 / 250 / 120 240 / 60 / 335 153 / 1 200 / 9 048) ; à ×10 : 1 202 400 commandes, 3 370 353 lignes ; catalogue identique entre échelles |
| Bronze | L152 `vers_bronze.py`, `parquet_metadata`, `mesurer_formats.py` | OK après la correction n° 1. CSV 12,9 Mo / Parquet zstd 2,2 Mo ; requête de 89 ms contre 6 ms |
| L153 | toutes les requêtes (CTE, fenêtres, QUALIFY, MERGE ×2, STRUCT/JSON, EXPLAIN ANALYZE) | 120 240 / 120 000 ; MERGE : 5 125, puis 5 125 au rejeu ; 24 groupes dans le plan |
| L154 | SCD2 ×2, `fait_ventes`, esquisse Data Vault | 5 205 versions / 5 125 courantes, idempotent ; 80 changements suivis |
| L155 | `profilage.py`, `vers_silver.py`, SCD2 silver, `gold.sql`, `controles.sql` | 240 / 11 / 171 / 340 / 463 (dont 338) / 75 / 59 / 26 sur 1 636 / 66 conformes ; silver 119 989 / 334 951 ; quarantaine 213 ; 1 744 commandes rattachées à nouveau ; `dim_client` 5 130 / 5 050 ; `fait_ventes` 319 140 ; **4 contrôles `true`** (après la correction n° 7) |
| M32 | L156 MapReduce, L157 (attentes du MERGE vérifiées en SQL : 200 mises à jour, 50 insertions, client 4388 présent), L160 `polars_lazy.py` et `duckdb_echelle.py` à l'échelle 1 | OK |
| M33 | L161 `l161_idempotence.py` ; modèles dbt de L163 rendus en SQL (source et ref remplacés, bronze « façon dlt » à partir du Parquet) + tests de `_staging.yml` + test singulier ; L165 `empreinte()` et `test_cles_uniques` | (3, 2) à chaque passage ; staging 120 000 / 5 075 / 335 153 / 9 048 ; tests unique, accepted_values, relationships à 0 ; test des dates 206x à 11 (warn) ; empreinte stable ; 120 000 = 120 000 |
| M34 | L166 `l166_fenetres.py` | OK (retardataire 6 écarté) |
| M35 | `creer_tables_qualite.py` ; équivalents SQL des tests dbt, ODCS et SodaCL ; `moniteurs.py` (+ historique simulé, suppression de 90 % sur une copie) ; `effacement.py` (partie DuckDB) | unique 240, relationships 1, accepted_values 1, maj_le<cree_le 11, ville nulle 1, montant<0 46, doublons d'id 240 ; alerte `[VOLUME] … z = -1290` ; client 2 anonymisé, 0 ticket restant |
| M36 | L175 (docs Markdown + tickets, filtres, `stocker.py`), L176 `dedup_exact.sql` et `minhash_lsh.py`, L178 `chunker.py` + `a_calculer.sql`, L179 `point_in_time.py` | 9 174 documents → 8 808 (exact) → 7 428 (MinHash, écrit `apres_minhash.jsonl`) ; 7 716 chunks ; anti-jointure 7 706 ; ASOF JOIN OK (0,6 s) |
| Validateur | `node scripts/validate.mjs \| tail -3` | « ✅ Aucune erreur bloquante » (avertissement préexistant : `examens/N5-examen.json` manquant) |

**Non exécuté (outils absents ou réseau)** : Postgres et Docker (chargement de l'ERP, déclencheur, dlt, Debezium, RLS), MinIO, delta-rs et PyIceberg, Spark, Kafka et Flink, dbt réel (seulement émulé), GX, Soda, Data Contract CLI, Elementary, Presidio (remplacé par une copie à l'identique), tiktoken (remplacé par un découpage en mots), Docling (aucun PDF), ftfy, fastText, sentence-transformers, Ray, Dask, Feast, SDV, Qdrant, DVC, lakeFS.

## 4. Points conservés volontairement

- `lakehouse/` (démonstrations de L157 et L159) et `data/lake/` (table CDC de L169) restent deux dossiers distincts, sans conflit : M37 pourrait réutiliser `data/lake/commandes`.
- Le nom `corpus/silver_tickets.jsonl` est conservé alors qu'il contient désormais tout le corpus pseudonymisé, pour ne pas casser d'éventuels renvois de M37.
- Les modèles dbt `stg_commandes` et `mart_ca_client` de M35 relèvent d'un projet de démonstration sur les tables simplifiées, distinct de `dbt_breval`. Ils sont cités mais pas écrits ; c'était déjà le cas avant l'harmonisation.
- Les `fetchone()` de L161, L165 et L173 sont conservés : ils sont suivis d'un `con.execute`, ce qui fonctionne en DuckDB 2.0 (vérifié).
- La table d'export de L161 n'a pas `date_livraison_prevue` (laboratoire séparé, `data/lab_l161.duckdb`).

## 5. Propositions optionnelles (non appliquées)

- Proposition optionnelle : renommer `corpus/silver_tickets.jsonl` en `corpus/silver_pseudonymise.jsonl` une fois M37 terminé.
- Proposition optionnelle : écrire les deux modèles dbt de démonstration de M35 (`stg_commandes`, `mart_ca_client`) sur les tables simplifiées.
- Proposition optionnelle : indiquer dans L169 « 119 995 commandes si l'expérience 3 de L162 a été faite » à côté des « 120 000 » de l'instantané initial.
- Proposition optionnelle : refaire ces vérifications avec Docker (Postgres, dlt, dbt réel, Debezium) sur une machine qui en dispose.
