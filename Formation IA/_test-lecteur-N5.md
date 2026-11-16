# Test lecteur — Niveau 5 « Data engineering » (L151 à L184)

> Relecture menée le 5 novembre 2026 dans la peau d'un **développeur qui vient de valider le niveau 3** : il sait appeler des API, monter un RAG simple et écrire un peu de SQL, mais n'a jamais fait de data engineering (ni Parquet, ni dbt, ni Kafka, ni Spark, ni CDC). Objectif fixé par le client : une formation « simplifiée et vulgarisée au maximum ».

## 1. Méthode

- Les 34 leçons du niveau 5 (`niveaux/N5-data-engineering/M31` à `M37`) ont été lues dans l'ordre du parcours, en suivant le fil rouge Bréval Matériaux d'une leçon à l'autre (dossier `breval/`, conteneurs, fichiers produits, variables d'environnement).
- Pour chacune ont été relevés : le jargon data non expliqué à sa première apparition, les commandes Docker / SQL / dbt / Python sans résultat attendu, les prérequis d'installation implicites, les erreurs fréquentes non anticipées et les sauts logiques entre leçons.
- Les sorties attendues ont été déduites du code des leçons et, quand c'était possible, **vérifiées par exécution** (simulation de fenêtres de L166, courbe en S de L176, clé du NIR de L177, valeurs du calculateur de L158) ; les autres sont formulées avec prudence (« du type », « par exemple », « vos nombres peuvent différer »).
- Les améliorations sont **strictement additives** :
  - jargon → courte explication entre parenthèses ou entre tirets juste après le terme, renvoi « (voir le lexique) » quand le terme figure dans `glossaire/glossaire.json`, ou courte note de lexique en italique sous un tableau ou un bloc ;
  - prérequis implicite → encadré `> 🧭 **Pré-requis express** — …` ;
  - commande ou requête clé → encadré `> 🔍 **Ce que vous devez voir** — …` (sortie attendue et à quoi elle ressemble) ;
  - erreurs fréquentes → encadré `> 🛠️ **Si ça ne marche pas** — …` (symptôme → cause → solution) ;
  - fin de leçon → encadré `> ✅ **Si vous ne retenez que 3 choses** — 1. … 2. … 3. …`, placé juste avant « 🗺️ Et maintenant ? » (aucune leçon n'en avait).
- **Contrôles automatiques** sur chaque fichier (script `verifier.py` du dossier de travail) : le texte d'origine est une sous-séquence exacte du nouveau texte (aucun caractère supprimé ni déplacé) ; l'en-tête YAML et tous les blocs ``` (quiz, mission, code, mermaid) sont strictement identiques et dans le même ordre ; le nombre de barres verticales de chaque ligne de tableau est inchangé (aucun tableau cassé) ; un seul encadré « 3 choses » par leçon. Résultat : **34/34 conformes**. Copie des 34 fichiers d'origine : `/tmp/claude-0/-home-claude/59782ef9-62d8-5ea8-85d5-1ab80e890349/scratchpad/lecteur-n5/orig/`.

## 2. Chiffres clés

| Indicateur | Valeur |
|---|---|
| Leçons relues et enrichies | 34 / 34 |
| Explications de jargon insérées (en ligne ou note de lexique) | 198 |
| Encadrés « 🧭 Pré-requis express » ajoutés | 86 |
| Encadrés « 🔍 Ce que vous devez voir » ajoutés | 120 |
| Encadrés « 🛠️ Si ça ne marche pas » ajoutés | 93 |
| Encadrés « ✅ Si vous ne retenez que 3 choses » ajoutés | 34 (aucune leçon n'en avait) |
| Volume des 34 leçons | 114 134 → 140 467 mots (+26 333, soit +23 %) |
| Phrases existantes supprimées ou réécrites | 0 |
| Blocs quiz / mission / code / en-têtes YAML modifiés | 0 |
| Résultat de `node scripts/validate.mjs` | ✅ Aucune erreur bloquante (184/184 leçons, 770 questions, 794 URLs) ; aucun avertissement sur L151-L184 |

## 3. Constats transversaux (ce qui bloquait le plus ce profil d'apprenant)

1. **Les commandes ne disaient presque jamais ce qu'on doit voir.** `docker compose up -d`, `\dt erp.*`, `dbt debug`, `dbt build`, `kafka-topics.sh --describe`, `kafka-consumer-groups.sh`, `datacontract lint/test`, `soda scan`, `feast apply`, `dvc repro`… → 120 encadrés « Ce que vous devez voir » décrivent la sortie (lignes clés, nombres de référence du jeu Bréval, état normal d'un programme qui « semble figé » parce qu'il attend un flux).
2. **Le verrou DuckDB est l'erreur n° 1 du niveau et n'était expliqué qu'en L165.** Dès que dbt, Dagster, un notebook, Soda ou un client `duckdb` ouvrent `data/breval.duckdb`, les autres échouent sur « Could not set lock on file ». → Symptôme, cause et remède rappelés à chaque étape qui écrit dans la base (L153 → L184).
3. **Variables d'environnement et terminaux multiples.** `BREVAL_PG_URL`, `PYTHONPATH`, `.env` (clé HMAC), `BREVAL_PROJET` (Airflow), `MINIO_ROOT_*` (DVC) disparaissent à chaque nouveau terminal, alors que M34 et M37 en font tourner trois en parallèle. → Rappels systématiques et équivalent PowerShell.
4. **Windows n'était presque jamais pris en compte.** `mkdir -p …{sql,data}`, `source`, boucles `for … do`, redirections `<`, heredocs `<<'SQL'`, `curl` multi-lignes, Spark, Airflow et Ray ne fonctionnent pas (ou mal) sous Windows natif. → Recommandation WSL 2 / Git Bash dès L151, alternatives PowerShell quand elles existent.
5. **Sauts logiques entre leçons du fil rouge** (détail en section 5) : dossier `breval-x10/` créé deux fois (L152 puis L159), producteur Kafka trop court pour qu'une fenêtre Spark se ferme (L168), modèles dbt inexistants référencés par L170 et L173, collection Qdrant utilisée en L174 avant d'être créée en L178, fichiers d'évaluation d'autres niveaux en L176, Qdrant et pgvector absents des fichiers Compose avant L181, ouverture en mode ajout des sorties de filtres en L175 (doublons silencieux en L176).
6. **Blocs à lire présentés comme blocs à exécuter.** SQL BigQuery / Snowflake / ClickHouse (L158), Spark SQL Iceberg (L157), Flink SQL et Kafka Streams Java (L168), pgvector avec `$1` (L178), test unitaire d'exemple (L170) : rien ne disait qu'ils ne s'exécutent pas dans l'environnement local. → Encadrés « Pré-requis express » qui le disent et indiquent comment essayer si on le souhaite.
7. **Installations lourdes non annoncées.** Docling (PyTorch, plusieurs Go), bge-m3 (> 2 Go, une heure d'embeddings sur CPU), spaCy `fr_core_news_lg`, Great Expectations, SDV, DataHub (8 Go de RAM Docker), Unity Catalog (compilation), modèle LLM de 27 milliards de paramètres. → Ordres de grandeur et options de repli (sous-échantillon, modèle plus léger).
8. **Jargon data récurrent** non défini à la première apparition dans la leçon : partition (au sens fenêtre SQL vs fichiers vs Kafka), shuffle, idempotence, SCD, médaillon, watermark, exactly-once, offset, consumer group, lignage, data contract, MinHash, ACID, snapshot, upsert, JVM, ISR, listeners, tombstone, LSN, epoch, UDF, payload, alias, HMAC, AES, AIPD, RBAC/ABAC, RLS, TTL, AUC, p95… → explications courtes ou renvoi au lexique.

## 4. Points de vigilance (non corrigés, hors périmètre)

- **Rendu dans l'application e-learning** : `app/src/lib/callouts.ts` reconnaît `🧭 **Pré-requis express**` (style « rappel »), `🛠️ **Si ça ne marche pas**` et `✅ **Si vous ne retenez que 3 choses**`, mais pour 🔍 il n'attend que le libellé « Ce que fait ce code, ligne par ligne ». Les 120 encadrés « 🔍 **Ce que vous devez voir** » s'afficheront donc comme une **citation ordinaire**. Le libellé imposé par la demande a été respecté ; l'application n'a pas été modifiée (consigne « ne touchez pas aux autres fichiers »). Proposition optionnelle : ajouter `l.startsWith("ce que vous devez voir")` à la règle 🔍 de `calloutFromLabel`.
- **Fichiers de l'application modifiés pendant la relecture, mais pas par cette intervention** : `app/src/lib/callouts.ts`, `app/src/components/markdown/markdown.tsx`, `app/src/app/globals.css` et des captures `app/_captures/v1.4/` portent un horodatage postérieur au début de la relecture ; ils n'ont été ni ouverts en écriture ni modifiés ici (travail parallèle probable).
- **Export Next Formation** : `export/elearning-modules.json` n'a pas été régénéré (`scripts/build.mjs` non lancé).
- **Texte d'origine à corriger, laissé intact (consigne)** :
  - L161 : la phrase de l'encadré « 🔗 Documentation officielle » après le script est grammaticalement cassée (« … vous trouverez aussi) la clause `QUALIFY` … ») ;
  - L171 : le workflow de CI lance `generer_breval.py` à la racine du dépôt, alors que L165 place le projet dans `breval/` (un encadré ajouté indique `working-directory: breval`) ;
  - L170 et L173 : le YAML vise des modèles (`mart_ca_client`, `stg_commandes`, `models/silver/`) absents du projet `dbt_breval` ; les encadrés ajoutés expliquent l'adaptation, mais le code reste à harmoniser ;
  - L174 : `effacement.py` dépend d'une collection Qdrant créée seulement en L178 (encadré ajouté : comment l'exécuter ou attendre L178) ;
  - L175 : `filtrer()` ouvre ses sorties en mode ajout (`"a"`) ; l'encadré ajouté propose de supprimer les fichiers avant chaque exécution, mais un passage en `"w"` dans le code serait plus sûr.
- **Sorties attendues** : celles qui n'ont pas pu être exécutées (absence de Docker, de Kafka et des gros modèles dans l'environnement de relecture) sont décrites d'après le code et la documentation des outils, avec des formulations prudentes ; elles devront être confirmées lors d'un passage réel sur poste (en particulier les libellés exacts de `datacontract`, `soda scan`, `edr`, `feast`, `dvc` et `lakectl`, qui changent selon les versions).
- **Longueur** : les leçons du projet final (L180-L184) dépassaient déjà 4 000 mots ; elles gagnent 500 à 900 mots chacune. Les ajouts y ont été limités aux points réellement bloquants, car ces leçons étaient déjà très guidées (points de contrôle chiffrés, tableaux d'erreurs fréquentes).

## 5. Détail par leçon

### L151 — Le cycle de vie du data engineering et le rôle du data engineer IA (Reis & Housley, fiche APEC, ROME M1811)  
*Module M31 · ajouts : 11 explications en ligne, 3 « Pré-requis express », 2 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 3619 → 4385 mots*

- Jargon non expliqué : NoSQL, MLOps, orchestrateur, dbt, CDC, Presidio, `wal_level`, journal de transactions (WAL), Debezium, DDL, grain d'une table, graine (seed).
- Prérequis implicites : Python 3.12+ et Docker Desktop installés et démarrés ; `mkdir -p breval/{sql,data}` et `source .venv/bin/activate` ne fonctionnent pas sous PowerShell.
- Étape implicite : il faut enregistrer le SQL dans `breval/sql/01_ddl_erp.sql` AVANT le premier `docker compose up -d`, sinon `\dt erp.*` ne renvoie rien.
- Commandes sans résultat attendu détaillé : `docker compose up -d`, `\dt erp.*` ; erreurs fréquentes non anticipées (port 5432 occupé, démon Docker arrêté, « input device is not a TTY » sous Git Bash).

### L152 — Types de données et formats de fichiers : CSV, JSON/JSONL, Parquet, Avro, ORC, Arrow — mesurer taille et vitesse  
*Module M31 · ajouts : 11 explications en ligne, 3 « Pré-requis express », 5 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 6967 → 7930 mots*

- Jargon non expliqué : aplatissement (*flattening*), embeddings/dimension (rappel), SHA-256/empreinte, *projection/predicate pushdown*, encodage par dictionnaire/RLE, row group, pied de page (footer), sérialisation, Schema Registry, zéro-copie, IPC/Feather, *shards*, couche bronze/silver (médaillon), *pruning*, `STRUCT`.
- Commandes sans résultat attendu : `vers_bronze.py` (tailles en Mo, `DESCRIBE`), `parquet_metadata`, boucle de chargement Postgres (un `COPY n` par table), `mesurer_formats.py`.
- Incohérence apparente non expliquée : le générateur annonce 120 240 commandes mais `erp.commandes` doit contenir 120 000 lignes (les 240 doublons d'export sont retirés par `SELECT DISTINCT`).
- Erreurs fréquentes non anticipées : boucle `for … do … done` et redirection `<` qui ne marchent pas sous PowerShell ; rechargement de Postgres qui échoue en « duplicate key » si on relance la boucle ; `fastavro` absent ; conteneur Postgres arrêté.

### L153 — SQL analytique moderne avec DuckDB : CTE, fenêtres, QUALIFY, MERGE, JSON et lecture d'un plan d'exécution  
*Module M31 · ajouts : 9 explications en ligne, 1 « Pré-requis express », 7 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2795 → 3687 mots*

- Prérequis implicite : comment exécuter les blocs SQL (aucune indication entre la console Python, le client `duckdb` et un fichier `.sql`) ; nécessité de lancer depuis `breval/` car les vues pointent vers des chemins relatifs.
- Jargon non expliqué : base « embarquée », exécution vectorisée, `TIMESTAMPTZ`, vue, partition (au sens fenêtre, à ne pas confondre avec le partitionnement de fichiers), cadre (*frame*), idempotent, SCD 2, `unnest`, `HASH_JOIN`, côté *build*, cardinalité, produit cartésien.
- Commandes sans sortie attendue : premier `print` (120 240 / 120 000), requête de fenêtres, `MERGE` (5 125), plan `EXPLAIN ANALYZE` (à quoi ressemble l'arbre).
- Erreur fréquente non anticipée : verrou du fichier `breval.duckdb` quand il est ouvert à la fois par Python et par le client `duckdb` (« Could not set lock on file »).

### L154 — Modéliser pour l'analytique : 3NF, étoile et SCD type 2, Data Vault 2.0, architecture médaillon  
*Module M31 · ajouts : 8 explications en ligne, 2 « Pré-requis express », 2 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2871 → 3576 mots*

- Jargon non expliqué : 3NF/normalisation (définie seulement par l'image), dénormaliser, séquence, table temporaire, `md5`/empreinte de hachage, `coalesce`, `concat_ws`, BI, *marts*, features ML, dimension conforme (n'apparaît que dans les critères de réussite), AI Act « haut risque ».
- Étape implicite : comment exécuter un fichier `.sql` entier dans `data/breval.duckdb` (client `duckdb` ou Python) ; aucune requête de contrôle pour voir les deux versions d'un client.
- Erreur fréquente non anticipée : relancer seulement les étapes 1-2 n'est pas la même chose que relancer tout le script ; la séquence ne repart pas à 1 ; vues `bz_*` absentes si L153 n'a pas été faite.

### L155 — Atelier : profiler, nettoyer et modéliser un jeu de données réel en Parquet avec DuckDB et Polars  
*Module M31 · ajouts : 1 explications en ligne, 4 « Pré-requis express », 4 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 2659 → 3468 mots*

- Jargon non expliqué : profilage, DataFrame, `LazyFrame` (le mode « paresseux » n'est présenté qu'en L160), quarantaine, imputation/médiane, clé de Luhn, réconciliation, `SUMMARIZE`.
- Saut logique : « Reprenez le script SCD 2 de L154 en remplaçant… » ne dit ni quel fichier créer, ni quelle ligne changer, ni que les valeurs de référence deviennent 5 130 / 5 050 (au lieu de 5 205 / 5 125).
- Commandes sans sortie attendue : `profilage.py` (`SUMMARIZE`, masques de téléphone), `vers_silver.py` (tableau des motifs de quarantaine), `controles.sql` (4 lignes `ok = true`).
- Erreurs fréquentes non anticipées : `controles.sql` lancé hors de `breval.duckdb` (table `fait_ventes` introuvable), dossier `data/gold` absent, chaîne exécutée dans le désordre.

### L156 — De Hadoop au lakehouse : HDFS et MapReduce (historique), stockage objet S3/GCS/MinIO, coûts et cycle de vie  
*Module M32 · ajouts : 6 explications en ligne, 3 « Pré-requis express », 4 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 2695 → 3521 mots*

- Jargon non expliqué : blocs répliqués, YARN, goulot d'étranglement, bucket/préfixe (défini mais sans exemple visuel), IAM, chiffrement au repos/en transit, compaction, partitionnement « de type Hive », *partition pruning*, `httpfs`, `CREATE SECRET`, *path style*.
- Prérequis implicite : modifier le `docker-compose.yml` existant à la bonne indentation (2 espaces sous `services:`) et ajouter `minio:` sous `volumes:` — source d'erreurs YAML pour un débutant.
- Commandes sans résultat attendu : `mapreduce_sav.py` (format de sortie), `docker compose up -d minio`, `publier_lac.py` (CA par agence + nombre d'objets), règle de cycle de vie ; identifiants de la console MinIO non rappelés.
- Erreurs fréquentes non anticipées : YAML mal indenté, port 9000 déjà pris, `Connection refused`/`403` si le mot de passe diffère, extension `httpfs` qui doit être téléchargée (connexion Internet requise au premier `INSTALL`).

### L157 — Formats de table ouverts : Delta Lake, Apache Iceberg, Apache Hudi, time travel et catalogues REST (Unity Catalog, Polaris)  
*Module M32 · ajouts : 9 explications en ligne, 2 « Pré-requis express », 3 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2702 → 3493 mots*

- Jargon non expliqué : ACID, commit, checkpoint, atomique/pointeur, JVM, upsert, *namespace*, Trino, RBAC, fédération de catalogues, *liquid clustering*, Hive Metastore, rétention.
- Commandes sans sortie attendue : `lakehouse_delta.py` (version, historique, comptes, résultat du `MERGE`), `lakehouse_iceberg.py` (liste des snapshots, schéma) ; le bloc Spark SQL est une illustration non exécutable en local, ce qui n'est pas dit clairement.
- Erreurs fréquentes non anticipées : relancer `lakehouse_delta.py` fait grimper le numéro de version (le « # 1 » attendu devient 3, 5…) ; extensions DuckDB `delta`/`iceberg` téléchargées au premier usage ; chemins relatifs (lancer depuis `breval/`).

### L158 — Entrepôts et lakehouses cloud : Snowflake, BigQuery, Databricks, Redshift, Fabric, ClickHouse, MotherDuck — choisir et chiffrer  
*Module M32 · ajouts : 6 explications en ligne, 3 « Pré-requis express », 2 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2501 → 3149 mots*

- Jargon non expliqué : managé, *serverless*, *slots*, OLAP, SaaS, crédits/DBU/RPU (unités de facturation), clustering (au sens tri physique, différent d'un cluster de machines), `LATERAL FLATTEN`, `LowCardinality`, jeton (*token*), verrouillage fournisseur.
- Saut logique : les blocs SQL BigQuery, Snowflake et ClickHouse ne sont exécutables que sur ces plateformes, mais rien ne le dit ; la commande `bq` suppose le Google Cloud SDK installé et un projet configuré.
- Commandes sans sortie attendue : `bq query --dry_run` (message « will process N bytes »), `cout_plateformes.py` (0,126 To et 24,1 h).
- Prérequis implicite pour l'exercice : création d'un compte cloud (carte bancaire parfois demandée hors bac à sable), alertes budgétaires à poser avant tout.

### L159 — Apache Spark et PySpark 4 : DataFrames, partitions, shuffle, jointures broadcast, AQE, Spark Connect  
*Module M32 · ajouts : 12 explications en ligne, 3 « Pré-requis express », 5 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 2869 → 3872 mots*

- Prérequis implicites : installer Java 17 ou 21 (et `JAVA_HOME`) ; sous Windows natif, Spark exige `winutils.exe`/`hadoop.dll` pour écrire des fichiers (WSL fortement conseillé) ; il faut lancer `cp -r` depuis le dossier **parent** de `breval/`.
- Saut logique : `breval-x10/` a déjà été créé dans l'exercice de L152 ; relancer `cp -r breval breval-x10` copie alors `breval` **à l'intérieur** de `breval-x10/`. « à lancer après spark_ventes.py (mêmes imports et DataFrames) » ne dit pas comment (même fichier ? console interactive ?).
- Jargon non expliqué : JVM, *thread*, Catalyst, mode SQL ANSI, job/stage/tâche (seulement dans le schéma), `noop`, *combiner*, `hashpartitioning`, *skew*, *salting*, cache, RDD, protobuf/gRPC, IDE.
- Commandes sans sortie attendue : `java -version`, `printSchema`, `explain(mode="formatted")`, ligne « 24 groupes en … s », les quatre temps A-D, démarrage du serveur Spark Connect.

### L160 — Passer à l'échelle en Python : Polars lazy, DuckDB, Dask et Ray — quand ne pas utiliser Spark  
*Module M32 · ajouts : 6 explications en ligne, 3 « Pré-requis express », 5 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 2500 → 3309 mots*

- Prérequis implicites : environ 4 à 5 Go d'espace disque libre pour `breval-x50/` (brut + bronze + silver), et des installations supplémentaires (`dask[…]`, `ray[data]`) annoncées seulement en commentaire dans le code ; Ray a une prise en charge Windows limitée.
- Jargon non expliqué : Rust, *eager*/*lazy* (défini), matérialiser, *spill* (défini), NumPy, acteurs Ray, CPU/GPU, inférence par lots, répliques, vLLM/SGLang, *Maximum resident set size*.
- Commandes sans sortie attendue : `polars_lazy.py` (forme du plan), `duckdb_echelle.py`, `dask_ventes.py` (adresse du tableau de bord), `ray_lot.py`.
- Erreurs fréquentes non anticipées : `Out of Memory Error` de DuckDB si le dossier temporaire n'est pas accessible ; « TypeError: collect() got an unexpected keyword argument 'engine' » avec un Polars ancien ; Dask sans `if __name__ == "__main__":`.

### L161 — ETL ou ELT : architectures, couches bronze/silver/gold, idempotence et rejouabilité  
*Module M33 · ajouts : 8 explications en ligne, 0 « Pré-requis express », 1 « Ce que vous devez voir », 1 « Si ça ne marche pas », 1 « 3 choses » · 2782 → 3210 mots*

- Jargon non expliqué : *append-only*, immuable, PII, IBAN, *marts*, features, contrats, SLA, erreur 503, transaction, zone d'atterrissage (*landing*), déterministe, *backfill* (renvoyé à L164).
- Commande sans sortie attendue détaillée : `l161_idempotence.py` (trois lignes « Exécution n → bronze, silver = (3, 2) » puis la date), et comportement de `charger_naif` (6 puis 9).
- Erreurs fréquentes non anticipées : script lancé hors de `breval/` (dossier `data/` créé ailleurs), `AssertionError` attendue quand on bascule sur `charger_naif`, base `lab_l161.duckdb` à supprimer pour repartir de zéro.
- Point de vigilance (non corrigé, texte d'origine) : la phrase de l'encadré « 🔗 Documentation officielle » après le script est grammaticalement cassée (parenthèse ouverte « vous trouverez aussi) la clause… »).

### L162 — Ingestion incrémentale : Airbyte, Fivetran, dlt et capture de changements (CDC) avec Debezium  
*Module M33 · ajouts : 7 explications en ligne, 3 « Pré-requis express », 3 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2927 → 3704 mots*

- Jargon non expliqué : SaaS, binlog, état (*state*, défini), déclencheur (*trigger*) et `plpgsql`, Kubernetes, DPO, CI, Kafka Connect, *topic*, slot de réplication, publication, décodage logique `pgoutput`, tables « enfants » de dlt.
- Prérequis implicites : le conteneur `breval-postgres` doit tourner (`docker compose up -d`) ; le dossier `breval/ingestion/` est à créer ; `export` ne fonctionne pas sous PowerShell et doit être refait dans chaque nouveau terminal ; mot de passe à adapter si `.env` l'a changé.
- Commandes sans sortie attendue : application du déclencheur (`CREATE FUNCTION`, `CREATE TRIGGER`), comptage par statut, sortie de `pipeline.run` et de `last_normalize_info`, vérification de la commande 42.
- Erreurs fréquentes non anticipées : `KeyError: 'BREVAL_PG_URL'`, connexion refusée sur 5432, verrou DuckDB, `cd breval` alors qu'on y est déjà.

### L163 — dbt Core : sources, ref, matérialisations, modèles incrémentaux, snapshots, tests, documentation et lignage  
*Module M33 · ajouts : 7 explications en ligne, 1 « Pré-requis express », 5 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 3741 → 4629 mots*

- Étapes implicites : `dbt init` crée un `dbt_project.yml` et un dossier `models/example/` qu'il faut **remplacer**/supprimer ; `profiles.yml` est à créer à la main dans `dbt_breval/` ; aucun résultat attendu pour `dbt debug`.
- Jargon non expliqué : DAG (seulement en sigle), Jinja et ses deux syntaxes `{{ }}` / `{% %}`, macro, adaptateur, `{{ this }}`, `delete+insert`, `microbatch`, test singulier/générique, sévérité `warn`, *asset*, CI « slim », pseudonymisation.
- Commandes sans sortie attendue : `dbt build` (ligne `Done. PASS=… WARN=… ERROR=0`), `dbt source freshness`, `dbt docs serve` (adresse locale, arrêt par Ctrl+C), snapshot du client 17 (deux lignes).
- Erreurs fréquentes non anticipées : verrou DuckDB quand un autre programme a ouvert `breval.duckdb` (très fréquent avec dbt), `BREVAL_PG_URL` absent lors de la réingestion, schéma `bronze` vide si L162 n'a pas été faite, contrat cassé par un type inattendu.

### L164 — Orchestrer : Airflow 3 (DAG, assets, Task SDK), Dagster (assets), Prefect — reprise, backfill, alertes  
*Module M33 · ajouts : 3 explications en ligne, 3 « Pré-requis express », 5 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 2725 → 3695 mots*

- Étape implicite bloquante : le DAG Airflow lit `BREVAL_PROJET` (valeur par défaut `/opt/breval`, qui n'existe pas sur le poste de l'apprenant) et l'ingestion a besoin de `BREVAL_PG_URL` dans l'environnement d'Airflow ; aucune des deux variables n'est à définir dans le texte.
- Prérequis implicites : Airflow ne tourne pas sous Windows natif (WSL obligatoire) ; il est conseillé de l'installer dans une venv séparée (conflits de dépendances avec dbt et Dagster) ; le dossier `airflow_home/dags/` est à créer ; un DAG apparaît en pause et après un délai.
- Jargon non expliqué : syntaxe `cron` (`0 2 * * *`), webhook, *callback*, *workers*, fichier de contraintes, date logique `ds`, capteur (*sensor*), matérialiser un asset, *fan-out*, CLI, Kestra.
- Commandes sans sortie attendue : `airflow standalone` (où trouver le mot de passe), apparition des DAG, `airflow backfill create`, `dagster dev`, `breval_quotidien.serve`.

### L165 — Atelier : pipeline dlt → DuckDB → dbt orchestré, avec CI « slim » sur les modèles modifiés  
*Module M33 · ajouts : 4 explications en ligne, 4 « Pré-requis express », 3 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 2465 → 3299 mots*

- Prérequis implicites : Git et un compte GitHub (créer un dépôt, une branche, pousser, ouvrir une *pull request*) ; `make` absent sous Windows natif ; `pip install -r requirements.txt` jamais écrit ; `pytest` à installer.
- Jargon non expliqué : Makefile/cible/recette, `.PHONY`, `.gitignore`, `pip freeze`, GitHub Actions/*workflow*/*job*/*runner*, *health check*, artefacts, branche `main`, `--fail-fast`, `--defer`, somme de contrôle.
- Commandes sans sortie attendue : `make up && make pipeline`, `make freshness`, `pytest -q` (« 2 passed »), onglet *Actions* de GitHub.
- Erreur fréquente non anticipée : « Makefile: *** missing separator » quand l'éditeur a remplacé les tabulations par des espaces (piège signalé en commentaire, mais sans le message d'erreur ni la solution).

### L166 — Penser en flux : événements, temps d'événement et de traitement, fenêtres, retard, garanties de livraison  
*Module M34 · ajouts : 7 explications en ligne, 0 « Pré-requis express », 1 « Ce que vous devez voir », 0 « Si ça ne marche pas », 1 « 3 choses » · 2829 → 3259 mots*

- Leçon conceptuelle claire, bien imagée ; jargon restant : micro-lot, état (*state*) d'un moteur de flux, Kafka Streams, UTC, offset (renvoyé à L167 sans définition courte), centile, clé d'idempotence côté service.
- Sortie du script `l166_fenetres.py` décrite en prose mais pas montrée telle qu'elle s'affiche (préfixes `[10:07:02]`, `[fin]`, mentions « définitif » / « provisoire ») : un débutant ne sait pas reconnaître les fenêtres encore ouvertes.
- Erreur fréquente non anticipée : confondre filigrane et heure de l'horloge murale ; lire « provisoire » comme une erreur.

### L167 — Apache Kafka 4 en mode KRaft : topics, partitions, consumer groups (KIP-848), Avro et Schema Registry, Kafka Connect  
*Module M34 · ajouts : 9 explications en ligne, 2 « Pré-requis express », 5 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 3053 → 4060 mots*

- Jargon non expliqué : consensus Raft, leader/suiveurs, ISR (`MIN_ISR`), *listeners*, `acks`, `linger.ms`, producteur idempotent, accusé de réception, *poll*, sujet (*subject*) du Schema Registry, *sink*, *worker*, API REST, `kill -9`.
- Commandes sans sortie attendue : `docker compose … up -d` (temps de démarrage), `kafka-topics.sh --describe`, producteur/consommateur (aucun exemple de ligne affichée), `kafka-consumer-groups.sh --describe` (forme du tableau), `curl` de compatibilité.
- Prérequis implicites : dossier `breval/streaming/` à créer ; la variable `K` n'existe que dans le terminal où elle a été définie ; nombre de messages réglé par la variable `NB` (500 par défaut), mentionnée seulement dans l'exercice ; syntaxe `$K/…` et `curl` multi-lignes incompatibles avec PowerShell.
- Erreurs fréquentes non anticipées : topic déjà existant au second lancement, commandes lancées avant que Kafka soit prêt, consommateur qui semble « bloqué » (il attend des messages), port 8081 du Schema Registry occupé.

### L168 — Traiter les flux : Apache Flink, Spark Structured Streaming, Kafka Streams — état, watermarks, exactly-once  
*Module M34 · ajouts : 6 explications en ligne, 3 « Pré-requis express », 1 « Ce que vous devez voir », 1 « Si ça ne marche pas », 1 « 3 choses » · 2804 → 3539 mots*

- Saut logique important : le producteur de L167 n'envoie que 500 messages en ~25 s ; en mode `append`, une fenêtre n'est émise que lorsque de **nouveaux** événements font avancer le watermark : si le producteur s'arrête, `sortie/` reste vide. Il faut un producteur qui tourne plus de 10 minutes (`NB=20000`).
- Prérequis implicites : premier lancement Spark qui télécharge le connecteur Kafka depuis Maven (connexion Internet, une à deux minutes) ; le bloc Flink SQL suppose une installation Flink (absente du `docker-compose` du niveau) et le bloc Java un projet Maven : ni l'un ni l'autre n'est exécutable tel quel, ce qui n'est pas dit.
- Jargon non expliqué : RocksDB, TTL, temporisateurs, *state store*, ksqlDB, `foreachBatch`/`batch_id`, mode `append`/`update`, JAR, barrière, *savepoint*, commit en deux phases, Serde, *changelog*, microservice, Maven.
- Commandes sans sortie attendue : démarrage du job Spark (journaux, absence de résultat pendant 10 min), requête DuckDB sur `sortie/`.

### L169 — Atelier : CDC Postgres → Debezium → Kafka → table Iceberg/Delta interrogée par DuckDB  
*Module M34 · ajouts : 7 explications en ligne, 2 « Pré-requis express », 4 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 3108 → 3952 mots*

- Commandes sans sortie attendue : réponse du `POST /connectors`, contenu de `/status`, liste des topics, message Debezium affiché par la console, progression du consommateur (lots de 5 000 lignes de l'instantané), résultat de `requete.py` avant/après modification, requête sur le slot.
- Prérequis implicites : Postgres (L151) **et** Kafka (L167) doivent être démarrés ; dossier `breval/cdc/` à créer ; mémoire vive (Postgres + Kafka + Schema Registry + Connect ≈ 3 Go) ; heredoc `<<'SQL'`, `sleep` et `curl --data @…` propres à bash.
- Saut logique : si l'expérience 3 de L162 a été faite, l'instantané contient 119 995 commandes et non 120 000 (ce que le corrigé ne signale qu'en toute fin d'exercice).
- Jargon non expliqué : *config providers*, coffre-fort de secrets, `REPLICA IDENTITY`, *tombstone* et compactage des topics, p95 (centile), microsecondes depuis 1970 (*epoch*).
- Erreurs fréquentes non anticipées : connecteur en `FAILED` (mot de passe, `wal_level`), `409 Conflict` au second `POST`, slot déjà existant après une réinstallation, consommateur qui relit tout si le dossier Delta a été supprimé mais pas le groupe.

### L170 — Qualité des données : dimensions, tests dbt, Great Expectations (GX Core) et Soda Core (SodaCL)  
*Module M35 · ajouts : 4 explications en ligne, 3 « Pré-requis express », 4 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 3197 → 4016 mots*

- Saut logique : le YAML dbt s'appelle `models/staging/_sources.yml`, **le même nom** que le fichier de sources de `dbt_breval` (L163) ; le recopier tel quel écrase les sources `erp` et `sav`. Le test unitaire vise des modèles `mart_ca_client` et `stg_commandes` qui n'existent pas dans le projet : `dbt build` échoue sur « model not found » si on le copie.
- Commandes sans sortie attendue : `creer_tables_qualite.py` (`[(120242, 120002)]`), `gx_commandes.py` (liste OK/KO), `soda scan` (résumé des contrôles et code de sortie).
- Jargon non expliqué : contrôle croisé, *Data Docs*, *data steward*, *pushdown* (rappel), code de sortie, OSS, contexte GX, *batch definition*, médiane.
- Erreurs fréquentes non anticipées : verrou DuckDB (Soda ou GX pendant qu'un `dbt build` tourne), paquet `soda-core-duckdb` incompatible avec la dernière version majeure de Soda, `great_expectations` long à installer.

### L171 — Contrats de données avec l'Open Data Contract Standard v3.1 et gestion de l'évolution de schéma  
*Module M35 · ajouts : 4 explications en ligne, 2 « Pré-requis express », 1 « Ce que vous devez voir », 1 « Si ça ne marche pas », 1 « 3 choses » · 2288 → 2786 mots*

- Jargon non expliqué : *data product*, *churn*, `physicalName`/`physicalType`/`logicalType`, *lint*, CLI (rappel), exécuteur de CI, découvrable, double diffusion.
- Prérequis implicites : où enregistrer `contrats/commandes.odcs.yaml` (dans `breval/`), depuis quel dossier lancer `datacontract` (le chemin `data/breval.duckdb` du bloc `servers` est relatif) ; la commande `export … > models/silver/_commandes.yml` suppose d'être dans `dbt_breval/`, alors que les deux précédentes supposent d'être dans `breval/`.
- Commandes sans sortie attendue : `datacontract lint` et `datacontract test` (forme du tableau de résultats).
- Point de vigilance (non corrigé) : le workflow de CI lance `generer_breval.py` à la racine du dépôt, alors que L165 place le projet dans `breval/` (il faudrait `working-directory: breval`).

### L172 — Gouvernance, catalogues et lignage : Unity Catalog, OpenMetadata, DataHub, OpenLineage  
*Module M35 · ajouts : 7 explications en ligne, 3 « Pré-requis express », 3 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2486 → 3190 mots*

- Conflits de ports non signalés : Unity Catalog et le serveur DataHub (GMS) utilisent tous deux le port 8080 (déjà pris par Airflow en L164 et `dbt docs serve`), Marquez utilise le port 3000 (celui de Dagster) et 5000 (souvent occupé par AirPlay sur macOS).
- Prérequis implicites : Java 17 et un premier démarrage long (compilation) pour Unity Catalog ; DataHub demande Docker avec 8 Go de RAM ou plus alloués ; `ingestion_dbt.yml` suppose d'être lancé depuis `dbt_breval/` après `dbt docs generate`.
- Jargon non expliqué : ADV (administration des ventes), *custodian*, ETI, CRM, UUID, URI/URN, facette, sink (rappel), enveloppeur (*wrapper*), base légale, délai de prescription.
- Commandes sans sortie attendue : `bin/uc catalog list`, `datahub docker quickstart`, `datahub ingest`, démarrage de Marquez, script `lignage_indexeur.py`.

### L173 — Observabilité data : les 5 piliers, Elementary sur dbt, plateformes commerciales, gestion d'incident  
*Module M35 · ajouts : 4 explications en ligne, 1 « Pré-requis express », 2 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2312 → 2853 mots*

- Saut logique : le YAML Elementary vise un modèle `stg_commandes` rangé dans `models/silver/`, qui n'existe pas dans le projet `dbt_breval` de L163 (le modèle s'appelle `stg_erp__commandes`, dans `models/staging/`, et la colonne de date `mis_a_jour_le`).
- Jargon non expliqué : écart-type, *data downtime* (défini), empreinte de schéma (hash), `information_schema`, package dbt / `dbt deps`, CLI `edr`, runbook (défini), post-mortem « sans recherche de coupable », SEV1-3 (définis), saisonnalité (définie).
- Commandes sans sortie attendue : premier lancement de `moniteurs.py` (alertes de fraîcheur probables, aucune alerte de volume tant qu'il n'y a pas 7 mesures), `dbt deps`, `edr report` (fichier HTML produit).
- Erreurs fréquentes non anticipées : adaptateur DuckDB non pris en charge par Elementary (signalé), webhook Slack absent, base verrouillée.

### L174 — Sécurité et conformité dans le pipeline : RGPD, contrôle d'accès, chiffrement, AI Act art. 10  
*Module M35 · ajouts : 8 explications en ligne, 2 « Pré-requis express », 2 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 2792 → 3494 mots*

- Saut logique : `effacement.py` supprime des points dans une collection Qdrant `tickets_chunks` qui n'existe qu'à partir de M36 (L178) et suppose `qdrant-client` installé et un Qdrant démarré : exécuté en L174, le script échoue à l'étape 2.
- Erreurs fréquentes non anticipées : relancer `acces.sql` échoue sur « role "lecteur_nan" already exists » ; l'utilisateur `breval` du conteneur est superutilisateur et **contourne** la RLS (il faut `SET ROLE alice` pour tester) ; la redirection `<` ne fonctionne pas sous PowerShell.
- Jargon non expliqué : AIPD, NIR, TLS, SSE, KMS, `pgcrypto`, ABAC, superutilisateur, multi-tenance, JOUE / EUR-Lex, catégories particulières de données, DVC/lakeFS (renvoyés à L179).
- Commandes sans sortie attendue : `acces.sql` (suite de `CREATE …`, `INSERT 0 5075`), requêtes de vérification de la RLS et de la vue de masquage, `effacement.py`.

### L175 — Construire un corpus texte : extraction (Docling, Trafilatura), normalisation, langue, filtres qualité (méthode FineWeb)  
*Module M36 · ajouts : 6 explications en ligne, 3 « Pré-requis express », 7 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 3301 → 4208 mots*

- Étapes implicites : `extraire_html.py` lit un dossier `intranet_html/` qui n'est fourni nulle part ; `filtres.py` ne fait que définir des fonctions (aucun appel, donc aucune sortie si on le lance tel quel) alors que `stocker.py` attend `corpus/silver_filtre.jsonl`.
- Erreur fréquente non anticipée : `filtrer()` ouvre ses fichiers de sortie en mode ajout (`"a"`) : relancer le script double les documents gardés et les rejets, ce qui faussera la déduplication de L176.
- Prérequis implicites : Docling installe PyTorch et télécharge des modèles (plusieurs Go, premier lancement long) ; `fasttext` ne compile pas toujours (variante `fasttext-wheel` signalée) ; le modèle GlotLID est téléchargé depuis le Hugging Face Hub.
- Jargon non expliqué : licences/acquisition, décontamination, tokenisation, *sharding*, *boilerplate* (défini), Common Crawl, OCR, mojibake (défini), NFC/NFKC (défini), FastText, heuristique, classifieur de qualité, rappel/précision, Slurm.
- Commandes sans sortie attendue : `extraire_docs.py`, `extraire_tickets.py` (nombre de lignes des JSONL), `normaliser.py`, `langue.py`, `stocker.py`.

### L176 — Dédupliquer à l'échelle : hachage exact, MinHash/LSH (MMDS ch. 3), déduplication sémantique, décontamination  
*Module M36 · ajouts : 6 explications en ligne, 4 « Pré-requis express », 4 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 3235 → 3987 mots*

- Leçon très bien vulgarisée (tombola, centre de tri postal) ; jargon restant : sur-apprentissage, k-grammes, permutation, estimateur sans biais, nombre premier de Mersenne, union-find, vecteurs creux, similarité cosinus (rappel), O(n²), k-means.
- Saut logique : `decontaminer.py` lit `evals/rag_questions.jsonl`, `evals/sav_eval.jsonl` (jeux de L093 et L137, d'autres niveaux) et `corpus/train_candidats.jsonl`, qu'aucune leçon du niveau 5 ne produit ; lancé tel quel, il échoue sur `FileNotFoundError`.
- Prérequis implicites : comment exécuter `dedup_exact.sql` ; le modèle `BAAI/bge-m3` pèse plus de 2 Go et l'encodage de ~9 000 documents sur CPU peut prendre une demi-heure ou plus ; `minhash_lsh.py` repart de `silver_filtre.jsonl` (et non du résultat de la déduplication exacte).
- Commandes sans sortie attendue : `dedup_exact.sql` (avant/après), `minhash_lsh.py` (taux de quasi-doublons + courbe en S), `dedup_semantique.py`.

### L177 — Détecter et anonymiser les données personnelles avec Presidio (reconnaisseurs français : NIR, IBAN, téléphone)  
*Module M36 · ajouts : 5 explications en ligne, 3 « Pré-requis express », 4 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 2728 → 3540 mots*

- Prérequis implicites : `anonymiser.py` lit deux variables d'environnement (`PII_HMAC_KEY`, `PII_AES_KEY`) sans dire comment les générer ni les définir (erreur `KeyError` sinon) ; le modèle spaCy `fr_core_news_lg` pèse environ 500 Mo ; `evals/pii_annote.jsonl` est à créer soi-même (dossier `evals/` absent).
- Jargon non expliqué : SDK, moteur NLP / NER (défini une fois), spaCy/Stanza, faux positif, `validate_result`, HMAC, AES, attaque par dictionnaire, liste d'autorisation, rappel/précision (définis), vrais positifs/faux négatifs (`vp`, `fn`, `fp` dans le code).
- Commandes sans sortie attendue : `python -m spacy download`, `analyseur_fr.py` (liste des entités et scores), `anonymiser.py` (rien à l'écran : où regarder), `evaluer_pii.py`.
- Erreurs fréquentes non anticipées : `analyseur_fr.py` et `reconnaisseurs_fr.py` doivent être dans le même dossier (import local) ; scores sous le seuil quand le contexte manque ; l'anonymisation de ~9 000 documents prend plusieurs minutes.

### L178 — Chunking, embeddings par lots (Ray Data, Spark) et bases vectorielles à l'échelle : index, filtres, multi-tenance, coûts  
*Module M36 · ajouts : 5 explications en ligne, 4 « Pré-requis express », 4 « Ce que vous devez voir », 4 « Si ça ne marche pas », 1 « 3 choses » · 3407 → 4352 mots*

- Erreur certaine au premier passage : `a_calculer.sql` lit `corpus/embeddings/*.parquet`, qui n'existe pas encore ; DuckDB répond « No files found that match the pattern ». Il faut une amorce pour la toute première exécution.
- Prérequis implicites : aucun Qdrant n'est déclaré dans les fichiers Docker Compose du niveau (« Qdrant du Docker Compose sur 6333 ») ; l'image `postgres:17` de L151 ne contient pas l'extension pgvector (`CREATE EXTENSION vector` échoue) ; le calcul des embeddings `bge-m3` sur CPU pour ~10 000 chunks prend de l'ordre d'une heure.
- Jargon non expliqué : tiktoken/`cl100k_base`, anti-jointure (définie), acteurs Ray (rappel), UDF pandas, IVF/PQ, quantification scalaire, *re-scoring*, payload, alias, *blue/green*, `halfvec`, `m`/`ef_construction`, `$1` (paramètre de requête), recall@5/MRR (renvoyés à L093).
- Commandes sans sortie attendue : `chunker.py` (nombre de chunks), `embed_ray.py` (barres de progression, fichiers produits), `qdrant_prod.py` (vérification dans le tableau de bord Qdrant).

### L179 — Features, versions et données synthétiques : Feast (point-in-time), DVC, lakeFS, SDV et génération par LLM  
*Module M36 · ajouts : 6 explications en ligne, 6 « Pré-requis express », 8 « Ce que vous devez voir », 5 « Si ça ne marche pas », 1 « 3 choses » · 3349 → 4711 mots*

- Prérequis implicites : bucket MinIO `dvc-store` à créer avant `dvc push` ; variables `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD` non définies dans le terminal (elles ne vivent que dans le conteneur) ; `git init` inutile, voire gênant, si `breval/` est déjà un dépôt (L165) ; `lakectl` est un exécutable à télécharger à part ; dossier `evals/` absent (`open(…, "w")` échoue) ; le modèle `qwen3.8:27b` demande une machine avec beaucoup de mémoire (≈ 20 Go).
- Étapes implicites : après `feast init`, supprimer `example_repo.py` et lancer `feast apply` (cité seulement en commentaire) ; `construire_corpus.py` du `dvc.yaml` est le script de l'exercice de L175, à avoir écrit.
- Jargon non expliqué : étiquette (*label*), *ttl*, online/offline store, Redis, matérialisation, `.dvc`/`dvc.lock`, tag Git, passerelle S3, HMA, époques, `StandardScaler`/plus proches voisins, AUC, Self-Instruct.
- Commandes sans sortie attendue : `point_in_time.py` (3 lignes), `feast apply`, `entrainement_et_service.py`, `dvc repro`/`dvc push`, `synth_sdv.py` (score de qualité), `questions_eval.py`.

### L180 — Cadrer le projet : sources, volumétrie, fraîcheur, droits d'accès, SLA, contrat de données et architecture cible  
*Module M37 · ajouts : 3 explications en ligne, 1 « Pré-requis express », 2 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 4696 → 5200 mots*

- Leçon de cadrage bien construite (sortie attendue du métré fournie, SLI/SLO/SLA définis et imagés) ; jargon restant : GED, p95/percentile, persona, SSO/LDAP, `items` (ODCS), micro-batch, SI.
- Prérequis implicites : `rag/droits.py` doit être importable (dossier `rag/` à créer, lancement depuis `breval/`) ; aucune façon simple de « vérifier à la main » les accès des cinq personas n'est proposée (on peut appeler `autorise()` dans la console Python).
- Erreurs fréquentes non anticipées : `volumetrie.py` lancé hors de `breval/`, ou sur un jeu régénéré à une autre échelle (les chiffres de contrôle ne correspondent plus) ; `datacontract lint` qui échoue sur la description des tableaux (`items`), signalé seulement dans le corrigé.

### L181 — Ingestion : documents (stockage objet) et base métier en CDC vers la couche bronze  
*Module M37 · ajouts : 1 explications en ligne, 1 « Pré-requis express », 3 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 4453 → 5059 mots*

- Leçon déjà très outillée (points de contrôle, tableau d'erreurs fréquentes) ; jargon restant : paquet Python, `PYTHONPATH`, `python -m`, marqueur de suppression (défini), `INSERT OR IGNORE`, *config provider* (rappel).
- Erreur fréquente non anticipée : un conteneur `breval-qdrant` créé à la main (`docker run`) en L174/L178 entre en conflit de nom avec le service Qdrant du nouveau Compose (« The container name "/breval-qdrant" is already in use ») ; même risque avec `breval-schema-registry` resté actif.
- Prérequis implicite : `export PYTHONPATH=$PWD` doit être refait dans **chaque** terminal (le consommateur tourne dans le terminal 1, les chargements dans le terminal 2), sinon `ModuleNotFoundError: No module named 'rag'`.
- Commandes sans sortie attendue détaillée : `ged_simulateur.py init` (ce qu'il affiche), application de `03_ged_rgpd.sql`, démarrage du consommateur bronze (forme des lignes affichées).

### L182 — Transformation et qualité : parsing, PII, déduplication, chunking en silver ; tests et contrats  
*Module M37 · ajouts : 0 explications en ligne, 3 « Pré-requis express », 3 « Ce que vous devez voir », 3 « Si ça ne marche pas », 1 « 3 choses » · 6271 → 6941 mots*

- Leçon très guidée (points de contrôle chiffrés, tableau d'erreurs) ; jargon restant : `set -a`/`source .env`, sélecteurs dbt `path:` et `source:rag+`, `list_contains`, `regexp_matches`, en-tête de contexte, heartbeat (renvoyé à L184), code de sortie `$?`.
- Piège non signalé à l'endroit de la commande : la ligne `echo "PII_HMAC_KEY=…" >> .env` **génère une nouvelle clé à chaque exécution** ; la relancer ajoute une seconde ligne dans `.env`, et c'est la dernière qui gagne : tous les pseudonymes et `chunk_id` changent (le piège est décrit plus loin, mais pas relié à cette commande).
- Prérequis implicites : `make ingest` suppose le Makefile de L165 ; `dbt build --select path:models/rag/amont` échoue si la source `cdc` ou la table `tickets_sav__messages` n'ont pas été déclarées, ou si `bronze.cdc_evenements` n'a jamais été chargé (L181).
- Erreurs fréquentes non anticipées : `rag.preparer` lancé sans `PII_HMAC_KEY` dans l'environnement (nouveau terminal), verrou DuckDB pendant que Dagster tourne, analyseur spaCy absent de la venv.

### L183 — Indexation vectorielle incrémentale (upserts, suppressions, ré-embedding) et évaluation de la récupération  
*Module M37 · ajouts : 1 explications en ligne, 3 « Pré-requis express », 2 « Ce que vous devez voir », 5 « Si ça ne marche pas », 1 « 3 choses » · 5481 → 6179 mots*

- Leçon très guidée (sorties attendues en commentaire des commandes, tableau d'erreurs) ; jargon restant : `scroll`, `set_payload`, `python -m json.tool`, recherche hybride (renvoyée à L092), démon Dagster.
- Prérequis implicites : jusqu'à trois terminaux ouverts en même temps (consommateur bronze, indexeur de suppressions, commandes), chacun ayant besoin de `export PYTHONPATH=$PWD` et du `.env` chargé ; le fichier `evals/questions_projet.jsonl` doit exister (les 12 questions données + celles à écrire) avant `rag.evaluation`.
- Commandes sans sortie attendue : `rag.recherche` (forme des lignes renvoyées), `rag.evaluation` (forme de la synthèse).
- Erreurs fréquentes non anticipées : indexeur de suppressions non lancé (ou lancé après la suppression et dont le groupe démarre à la fin du topic), premier `rag.recherche` lent (chargement du modèle d'embedding à chaque appel), tests `test_rag.py` qui exigent tous les services et l'indexeur actifs.

### L184 — Industrialiser : orchestration, observabilité, coût par document, documentation et soutenance  
*Module M37 · ajouts : 1 explications en ligne, 2 « Pré-requis express », 4 « Ce que vous devez voir », 2 « Si ça ne marche pas », 1 « 3 choses » · 5526 → 6214 mots*

- Leçon de synthèse claire (points de contrôle, tableau d'erreurs, grille de preuves) ; jargon restant : astreinte, `restart: unless-stopped`, heartbeat (défini), `PUT` sur l'API Connect, escalade.
- Prérequis implicites : le bloc Makefile est présenté en `text` mais doit être **ajouté** au Makefile de L165 avec de vraies tabulations ; `make dagster-rag` occupe le port 3000 (comme Dagster de L164 et Marquez de L172) ; `sleep 360` bloque le terminal 6 minutes sans le dire.
- Commandes sans sortie attendue : `make moniteurs` (forme des alertes), `curl -X PUT` du heartbeat (réponse JSON), `make couts` (tableau par étape).
- Erreurs fréquentes non anticipées : Dagster du projet lancé alors que les tests ou un script tiennent `breval.duckdb` ; `.env` non chargé dans le terminal de `make dagster-rag` (les assets Presidio échouent) ; `docker compose start connect` lancé hors de `breval/`.
