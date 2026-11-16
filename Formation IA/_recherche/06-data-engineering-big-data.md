# 06 — Data engineering & Big Data pour l'IA : recherche pour un niveau 5 (≈ 30 h)

**Date de la recherche :** 5 novembre 2026
**Objet :** préparer un **niveau 5 « Data engineering & Big Data pour l'IA »** (≈ 30 h, spécialisation accessible après le niveau 3) de la formation NF-IA (Next Formation). Numérotation proposée dans la continuité de l'existant : modules **M31 à M37**, leçons **L151 à L184**, compétences **C5.1 à C5.6**.
**Méthode :** WebSearch + WebFetch (≈ 57 recherches, quota partagé). Statut de chaque URL :

| Marque | Signification |
|---|---|
| ✅ | Page **ouverte et lue** par WebFetch pendant la session (contenu résumé ici issu de cette lecture) |
| 🔎 | URL exacte **relevée dans un résultat de recherche** ou citée par une page ✅, mais **non ouverte** |
| ⚠️ | URL officielle probable **non vérifiée** pendant la session (site racine du projet) : à contrôler avec `node scripts/validate.mjs --links` avant publication |

**Avertissements :** (1) les prix d'examens sont en USD hors taxes, tels qu'affichés au 5 novembre 2026 ; ils changent souvent. (2) Les comparatifs d'outils publiés par des tiers (blogs) sont signalés comme tels. (3) Les cours universitaires (CMU, Berkeley, MIT, Stanford) servent d'**inspiration de structure** ; leurs contenus ne doivent pas être recopiés dans une formation payante (cf. règle licences de `05-reglementation-certification-marche.md`).

---

## 0. Synthèse exécutive

| Sujet | Constat au 5 nov. 2026 | Conséquence pour le N5 |
|---|---|---|
| Socle technique | Le « lakehouse » (Parquet + format de table ouvert Iceberg/Delta + catalogue) est devenu l'architecture de référence ; Spark reste le moteur distribué standard (PySpark **4.3.0** en doc « latest ») ; DuckDB (doc **2.0 LTS**) et Polars dominent le calcul mono-nœud. | Enseigner le lakehouse **en local d'abord** (DuckDB + Parquet + Iceberg/Delta), puis montrer la montée à l'échelle (Spark, entrepôt cloud). Coût apprenant ≈ 0 €. |
| Orchestration | Airflow **3.3.2** (17 sept. 2026) ; **Prefect rachète Dagster Labs** (annonce du 13 juillet 2026, Dagster garde sa marque). | Enseigner Airflow (standard du marché, examens AWS/GCP) + un orchestrateur « orienté assets » (Dagster) ; signaler la consolidation. |
| Transformation | dbt reste la norme ELT ; certification dbt alignée sur **dbt 1.11** ; cours **dbt Fundamentals gratuit (~5 h)**. | Module ELT centré dbt (Core, gratuit) + DuckDB adapter. |
| Streaming | Kafka 4.x : **ZooKeeper supprimé, KRaft par défaut**, nouveau protocole consumer (KIP-848), « Queues for Kafka » (KIP-932) en accès anticipé. | Kafka en mode KRaft dans Docker ; CDC Debezium ; Flink / Spark Structured Streaming en démonstration. |
| Données pour l'IA | Chaîne type : extraction → normalisation → **déduplication MinHash** → filtres qualité → **PII** → stockage Parquet/Arrow sharding ; outils open source datatrove (HF), NeMo Curator (NVIDIA), Presidio (Microsoft), Ray Data LLM. | Module M36 dédié + projet final RAG d'entreprise (incrémental, CDC, PII, évaluation). |
| Gouvernance | Contrats de données **ODCS v3.1.0** (Bitol, LF AI & Data, Apache 2.0) ; Unity Catalog OSS, OpenMetadata, DataHub ; Apache Polaris (catalogue Iceberg). | Compétence C5.4 + lien avec AI Act art. 10 (gouvernance des données) et RGPD déjà traités en N1-N3. |
| Certifications | 7 certifications de référence vérifiées (§5). **DP-203 retirée le 31 mars 2025** → DP-700 (Fabric). **SnowPro Core COF-C03** remplace COF-C02 (lancement 16 fév. 2026). Guide Databricks DE Associate d'**août 2026** (Lakeflow Jobs, CI/CD). | Correspondance N5 ↔ certifications (§8.6) ; le N5 couvre les fondamentaux communs, pas les spécificités produit de chaque cloud. |
| Marché France | APEC : 80 % des offres data engineer entre **35 et 60 k€** brut annuel, moyenne ≈ **47 k€**. Michael Page (étude 2027, Île-de-France) : **45 / 59 / 80 k€** (bas / moyen / haut). RNCP actifs : **RNCP42655** (DataScientest/Liora, niv. 7, 2026-2031), **RNCP39775** (OpenClassrooms, niv. 7). | Argumentaire commercial : spécialisation à forte demande ; le N5 n'est pas un titre RNCP mais peut être présenté comme bloc RS « données pour l'IA ». |

---

## 1. Fondamentaux data

### 1.1 Cycle de vie et vocabulaire (référence : Reis & Housley)

Source ✅ [O'Reilly — Fundamentals of Data Engineering (Joe Reis, Matt Housley, juin 2022, ISBN 9781098108298)](https://oreilly.com/library/view/fundamentals-of-data/9781098108298).

- **Cycle de vie** : génération (systèmes sources) → stockage → ingestion → transformation → service (*serving* : analytique, ML, reverse ETL).
- **Courants sous-jacents (*undercurrents*)** : sécurité, gestion des données (*data management*), DataOps, architecture des données, orchestration, génie logiciel.
- Plan du livre : Partie I (fondations : ch. 1-4), Partie II (cycle de vie en profondeur : sources, stockage, ingestion, requêtes/modélisation/transformation, service), Partie III (sécurité, vie privée, futur) ; annexes sérialisation/compression et réseau cloud.
- Billet de l'auteur sur l'évolution du cadre : 🔎 [Joe Reis — The Data Engineering Lifecycle and Undercurrents, 4 Years Later](https://joereis.substack.com/p/the-data-engineering-lifecycle-and).

→ **Usage pédagogique** : ce cycle sert d'ossature à l'ensemble du N5 (M31 = sources/stockage, M33 = ingestion/transformation, M36 = *serving* pour l'IA).

### 1.2 Types de données

| Catégorie | Exemples | Point d'attention pour l'IA |
|---|---|---|
| Structurées | tables SQL, CSV typés | schéma explicite, contrôles faciles |
| Semi-structurées | JSON, logs, événements, XML | schéma implicite qui dérive ; aplatissement (*flattening*) |
| Non structurées | PDF, e-mails, images, audio | extraction (OCR, parsing), métadonnées, PII ; matière première des RAG |
| Flux (événements) | clics, IoT, CDC | temps d'événement vs temps de traitement, ordre, doublons |
| Vectorielles | embeddings | dimension, modèle d'origine, version, ré-indexation |

### 1.3 Formats de fichiers et formats de table

| Format | Nature | Usage type | Doc officielle |
|---|---|---|---|
| CSV | texte, ligne | échange simple ; pas de types ni de schéma | — |
| JSON / JSONL | texte, semi-structuré | API, logs ; **JSONL** recommandé pour prototyper des corpus LLM (cf. §4.1) | — |
| **Parquet** | binaire, **colonnaire**, compressé, statistiques par row group | standard analytique et lakehouse ; shards de 50–500 Mo recommandés pour l'entraînement (✅ [UPPMAX LLM workshop — data pipelines](https://uppmax.github.io/LLM-workshop/day2/data_pipelines)) | ⚠️ https://parquet.apache.org/ |
| **Avro** | binaire, **ligne**, schéma embarqué, évolution de schéma | messages Kafka + Schema Registry, CDC | ⚠️ https://avro.apache.org/ |
| **ORC** | binaire colonnaire (écosystème Hive) | historique Hadoop | ⚠️ https://orc.apache.org/ |
| **Arrow** | format **en mémoire** colonnaire, zéro-copie | échange DuckDB ↔ Polars ↔ pandas ; Polars « uses Apache Arrow's columnar format as its memory model » (✅ [DuckDB 2.0 — Polars guide](https://duckdb.org/docs/2.0/guides/python/polars.html)) | ⚠️ https://arrow.apache.org/ |
| **Delta Lake** | format de **table** (journal `_delta_log/` JSON) | Spark / Databricks ; « Universal Format » écrit des métadonnées compatibles Iceberg | ⚠️ https://delta.io/ |
| **Apache Iceberg** | format de table (métadonnées hiérarchiques, manifests, statistiques de colonnes) | **support multi-moteurs le plus large** ; seul à proposer *partition evolution* et *hidden partitioning* ; API REST catalog standardisée | ⚠️ https://iceberg.apache.org/ |
| **Apache Hudi** | format de table (timeline) | upserts fréquents (Merge-on-Read), index par enregistrement ; Hudi 1.1 ajoute un support natif du format Iceberg | ⚠️ https://hudi.apache.org/ |

Comparatif (tiers, 20 mars 2026) : ✅ [RisingWave — Apache Iceberg vs Delta Lake vs Apache Hudi (2026)](https://risingwave.com/blog/apache-iceberg-vs-delta-lake-vs-hudi-2026/). Détails cités : Iceberg 1.10 (2025) avec maturité de la spec V3 ; streaming le plus mature côté Hudi (DeltaStreamer) ; Delta le plus fort dans Spark/Databricks.

### 1.4 SQL moderne

Notions à couvrir (toutes testées par dbt, Databricks, Snowflake, BigQuery) : CTE (`WITH`), fonctions de fenêtre (`ROW_NUMBER`, `LAG`, cumul), `QUALIFY`, `MERGE` (upsert), `GROUP BY ALL`, types semi-structurés (JSON, `STRUCT`, `ARRAY`, `UNNEST`), *time travel* sur table ouverte, `EXPLAIN` et lecture d'un plan, partitionnement et *clustering*.

Moteur pédagogique recommandé : **DuckDB** (gratuit, local, lit Parquet/CSV/JSON/Iceberg/Delta directement). La doc stable est en version **2.0 (LTS)** ; DuckDB interroge un DataFrame ou LazyFrame Polars par son nom, pousse les projections et filtres vers un LazyFrame, et renvoie un résultat Polars via `.pl()` (`lazy=True` pour un LazyFrame) — ✅ [DuckDB 2.0 — Integration with Polars](https://duckdb.org/docs/2.0/guides/python/polars.html).

Cours SQL de référence : ✅ (via liste) 🔎 [Kaggle Learn — Intro to SQL](https://www.kaggle.com/learn/intro-to-sql), 🔎 [Kaggle Learn — Advanced SQL](https://www.kaggle.com/learn/advanced-sql) (BigQuery, gratuits) ; ✅ [Berkeley CS186 — leçons SQL I/II, projet 1 SQL](https://cs186berkeley.net/sp25/).

### 1.5 Modélisation

| Approche | Principe | Quand l'enseigner |
|---|---|---|
| 3NF (Inmon) | normalisation, entrepôt d'entreprise intégré | rappel (Berkeley CS186, MIT 6.5830 : modèles, normalisation, contraintes — ✅ [MIT 6.5830 syllabus](https://dsg.csail.mit.edu/6.5830/syllabus.php)) |
| **Schéma en étoile** (Kimball) | faits + dimensions, SCD type 1/2 | cœur du module : c'est le modèle attendu par dbt, Power BI/Fabric, BigQuery |
| **Data Vault 2.0** | hubs (clés métier), links (relations), satellites (attributs historisés) | historisation auditable, sources multiples, contexte réglementaire (banque, assurance — cf. projets Next Bank / Next Capital) |
| One Big Table / tables larges | dénormalisation pour moteurs colonnaires | marts de consommation, features ML |
| Architecture **médaillon** (bronze / silver / gold) | couches de raffinement dans le lakehouse | fil conducteur du projet final |

Sources Data Vault et Kimball : non vérifiées pendant la session (⚠️ — privilégier les livres *The Data Warehouse Toolkit* (Kimball & Ross) et *Building a Scalable Data Warehouse with Data Vault 2.0* (Linstedt & Olschimke) comme références bibliographiques, sans URL).

### 1.6 Qualité des données

Dimensions classiques : exactitude, complétude, cohérence, unicité, fraîcheur (*timeliness*), validité (format/domaine). Les **cinq piliers de l'observabilité** (Monte Carlo, essai de Barr Moses, déc. 2020) : **fraîcheur, volume, schéma, qualité (ex-« distribution »), lignage** ; indicateur clé : *data downtime* — ✅ [DataDriven — Data Observability: 5 Pillars and Tools (2026)](https://datadriven.io/data-observability). Outils au §2.6.

### 1.7 Gouvernance et catalogues

Synthèse (tiers, mi-2026) ✅ [Data Lakehouse Hub — Metadata Platforms in 2026](https://datalakehousehub.com/blog/metadata-platforms-in-2026/) :

| Outil | Statut 2026 | Rôle |
|---|---|---|
| **Unity Catalog** (OSS) | open source depuis 2024, hébergé par LF AI & Data (selon l'article) ; tables Delta et Iceberg, endpoint Iceberg REST ; la version hébergée Databricks ajoute lignage, tags, gouvernance avancée | catalogue technique + gouvernance |
| **OpenMetadata** | Apache 2.0, porté par Collate (membre Silver de la Linux Foundation depuis mars 2026, sans gouvernance de fondation) | plateforme de métadonnées (découverte, glossaire, lignage, qualité) |
| **DataHub** | Apache 2.0, né chez LinkedIn (2020) ; société renommée Acryl Data → DataHub (2025) ; v1.0 avec Iceberg REST catalog en bêta | plateforme de métadonnées + catalogue |
| **Apache Polaris** | projet de premier niveau Apache depuis février 2026 (selon l'article) ; Iceberg uniquement, RBAC, fédération | catalogue technique Iceberg |
| Apache Gravitino | fédération de catalogues | — |

Docs officielles : ⚠️ https://www.unitycatalog.io/ · ⚠️ https://open-metadata.org/ · 🔎 [docs.datahub.com — source ODCS](https://docs.datahub.com/docs/generated/ingestion/sources/odcs) · ⚠️ https://polaris.apache.org/ · Lignage : 🔎 [OpenLineage — object model](https://openlineage.io/docs/spec/object-model).

---

## 2. Pipelines

### 2.1 ETL vs ELT

- **ETL** : transformation avant chargement (outil dédié, serveur intermédiaire) — pertinent quand on doit filtrer/anonymiser **avant** d'entrer dans l'entrepôt (PII, souveraineté).
- **ELT** : chargement brut puis transformation **dans** l'entrepôt/lakehouse (SQL, dbt) — norme actuelle grâce au stockage objet bon marché et aux moteurs colonnaires.
- Pour l'IA : schéma hybride fréquent — ingestion brute (bronze), **anonymisation PII en ETL** avant la couche silver, transformations ELT, puis *serving* (marts, features, index vectoriel).

### 2.2 Orchestration

| Outil | Version / actualité 2026 | Modèle | Sources |
|---|---|---|---|
| **Apache Airflow** | **3.3.2** publiée le **17 sept. 2026** ; Airflow 3.1.0 livré avec Task SDK 1.1.0 | DAG de tâches + *assets* (partitionnement d'assets en 3.2, timetables `PartitionedAtRuntime` et *state store* en 3.3 selon l'article tiers) ; Task SDK / Task Execution API | ✅ [Airflow — Announcements](https://airflow.apache.org/announcements/) · 🔎 [notes de version 3.3.2](https://airflow.apache.org/docs/apache-airflow/3.3.2/release_notes.html) · 🔎 [notes de version 3.0.0](https://airflow.apache.org/docs/apache-airflow/3.0.0/release_notes.html) |
| **Dagster** | 1.13 (Components GA) selon l'article tiers ; **rachat par Prefect annoncé le 13 juillet 2026**, ~40 personnes rejoignent Prefect, la marque Dagster est conservée, l'OSS « actively developed » | graphe d'**assets** natif (lignage, partitions, checks, fraîcheur) ; intégration dbt la plus étroite (1 modèle dbt = 1 asset) | ✅ [Dagster — Prefect is acquiring Dagster](https://dagster.io/blog/prefect-is-acquiring-dagster) · ⚠️ https://docs.dagster.io/ |
| **Prefect** | Prefect 3 ; FastMCP comme troisième famille de produits (selon l'article) | fonctions Python `@flow` / `@task`, événements et automatisations, *work pools* | ⚠️ https://docs.prefect.io/ · 🔎 [Prefect — compare Dagster](https://www.prefect.io/compare/dagster) |
| Kestra | utilisé par le Zoomcamp 2026 (module 2) | YAML déclaratif | ⚠️ https://kestra.io/docs |

Comparatif (tiers) : ✅ [Data Lakehouse Hub — Orchestration in 2026: Airflow 3 vs Dagster vs Prefect](https://datalakehousehub.com/blog/orchestration-in-2026/) — Airflow : écosystème et base installée les plus larges, empreinte d'exploitation la plus lourde ; Dagster : lignage le plus natif ; Prefect : le plus léger à auto-héberger, le plus simple pour le *fan-out* dynamique.

### 2.3 dbt

- Certification et documentation alignées sur **dbt 1.11** (✅ [dbt Analytics Engineering Certification Exam](https://www.getdbt.com/certifications/analytics-engineer-certification-exam)).
- **Cours gratuits dbt Learn** : *dbt Learn Fundamentals* (**gratuit, ≈ 5 h**), *Macros and Packages with Jinja*, *Advanced Materializations*, *Analyses and Seeds*, *Refactoring SQL for Modularity* — ✅ [dbt Labs — New Learn courses](https://www.getdbt.com/blog/new-learn-courses) ; catalogue 🔎 https://learn.getdbt.com/catalog.
- Doc : ⚠️ https://docs.getdbt.com/ ; fraîcheur des sources 🔎 [dbt — Source freshness](https://docs.getdbt.com/docs/deploy/source-freshness).
- Notions à enseigner : sources, `ref()`, matérialisations (view, table, incremental, ephemeral), snapshots (SCD2), tests génériques (`unique`, `not_null`, `accepted_values`, `relationships`) et singuliers, *unit tests*, contrats de modèle, documentation et graphe de lignage, `state:modified` (CI « slim »).

### 2.4 Ingestion

| Outil | Type | Remarque | Doc |
|---|---|---|---|
| **Airbyte** | ELT open source, centaines de connecteurs | auto-hébergeable (Docker/K8s) | ⚠️ https://docs.airbyte.com/ |
| **Fivetran** | ELT SaaS managé | référence du marché, payant à l'usage | ⚠️ https://fivetran.com/docs |
| **dlt** (dltHub) | bibliothèque Python d'ingestion | utilisé en workshop du Zoomcamp ; idéal pédagogie (code, incrémental, schéma inféré) | 🔎 [dltHub — Airbyte source](https://dlthub.com/context/source/airbyte) · ⚠️ https://dlthub.com/docs |
| **Kafka Connect** | framework de connecteurs source/sink pour Kafka | — | ⚠️ https://kafka.apache.org/documentation/#connect |
| **Debezium** | **CDC** (capture des changements) par lecture des journaux de transactions (Postgres WAL, MySQL binlog…) | exemples officiels 🔎 [debezium-examples wiki](https://github.com/debezium/debezium-examples/wiki) | ⚠️ https://debezium.io/documentation/ |

### 2.5 Streaming

- **Apache Kafka 4.0** : KRaft par défaut, plus de dépendance ZooKeeper ; nouveau protocole de groupe de consommateurs **KIP-848** (activé côté serveur, `group.protocol=consumer` côté client) ; **KIP-932 Queues for Kafka** en accès anticipé ; Java 11 pour clients/Streams, Java 17 pour brokers/Connect — ✅ [SSOJet — Kafka 4.0 release](https://ssojet.com/blog/kafka-40-release-simplified-architecture-with-default-kraft) (article d'avril 2025 ; vérifier la version courante sur ⚠️ https://kafka.apache.org/downloads).
- **Apache Flink** : traitement de flux à état, temps d'événement, *watermarks*, exactly-once — ⚠️ https://nightlies.apache.org/flink/flink-docs-stable/
- **Spark Structured Streaming** : micro-batchs (et mode continu), même API DataFrame que le batch — ⚠️ https://spark.apache.org/docs/latest/streaming/index.html
- **Kafka Streams / ksqlDB** : utilisés dans le module 7 du Zoomcamp (✅ [dépôt Zoomcamp](https://github.com/datatalksclub/data-engineering-zoomcamp)).
- Concepts à enseigner : partitions et ordre, *consumer groups* et offsets, sémantiques at-most/at-least/exactly-once, fenêtres (tumbling, sliding, session), retard et *late data*, schémas Avro + Schema Registry, idempotence des *sinks*.

### 2.6 Qualité, tests et observabilité

| Outil | Approche | Licence / statut | Doc |
|---|---|---|---|
| **dbt tests** | tests SQL déclaratifs dans le projet dbt | inclus dans dbt Core | ⚠️ https://docs.getdbt.com/docs/build/data-tests |
| **Great Expectations (GX Core)** | *Expectations* en Python, Checkpoints, *Data Docs* HTML ; > 50 Expectations intégrées | Apache 2.0 | ✅ cité : [greatexpectations.io](https://greatexpectations.io/) |
| **Soda Core** | YAML déclaratif **SodaCL**, scan CLI, *pushdown* SQL ; Soda Cloud commercial | OSS (licence non précisée par la source) | ✅ cité : [soda.io](https://soda.io/) |
| **Elementary** | observabilité et détection d'anomalies **sur dbt** (package + rapport) | open source + cloud | ⚠️ https://docs.elementary-data.com/ |
| **Monte Carlo** | plateforme commerciale d'observabilité (5 piliers) | commercial | ⚠️ https://www.montecarlodata.com/ |
| OpenLineage / Marquez | standard de lignage | open source | 🔎 [OpenLineage object model](https://openlineage.io/docs/spec/object-model) |

Comparatif GX vs Soda (tiers, 14 fév. 2026) : ✅ [DataExpert.io — Soda vs Great Expectations](https://www.dataexpert.io/blog/soda-vs-great-expectations-data-quality-tools). Autres acteurs cités : Bigeye, Anomalo, Sifflet (français), Acceldata ; Datadog a racheté Metaplane en 2025 (✅ [DataDriven](https://datadriven.io/data-observability)).

---

## 3. Big data et calcul distribué

### 3.1 Historique : Hadoop / HDFS / MapReduce

À traiter en 20 min max comme **contexte** : HDFS (stockage distribué répliqué), MapReduce (calcul par lots map → shuffle → reduce), YARN, Hive (SQL sur Hadoop). Remplacés en pratique par stockage objet (S3, GCS, ADLS) + Spark/moteurs SQL. Encore présents dans la fiche APEC (« stockage sous Hadoop », compétences Hadoop/Hive/Spark — ✅ [APEC — fiche Data Engineer](https://www.apec.fr/tous-nos-metiers/informatique/data-engineer.html)) et le chapitre 2 de MMDS (« Map-Reduce and the New Software Stack »).

### 3.2 Apache Spark / PySpark

- Doc « latest » = **PySpark 4.3.0** ; sections *Getting Started* : Installation, Quickstart DataFrame, **Quickstart Spark Connect**, Quickstart Pandas API on Spark, Testing PySpark ; notebooks « live » utilisables sans installation — ✅ [PySpark — Getting Started](https://spark.apache.org/docs/latest/api/python/getting_started/).
- Notions : DataFrame paresseux, plan logique/physique, partitions, *shuffle*, *broadcast join*, AQE, cache, écriture partitionnée Parquet/Delta/Iceberg, Spark Connect (client léger).
- **Databricks Free Edition** : accès gratuit sans limite de durée aux outils data & IA de Databricks (ETL, ML, dashboards, SQL, Python) pour étudiants, praticiens, formateurs — ✅ [Databricks — Learn, experiment and build with Free Edition](https://www.databricks.com/blog/learn-experiment-and-build-databricks-free-edition) ; annonce de lancement 🔎 [Introducing Databricks Free Edition](https://databricks.com/blog/introducing-databricks-free-edition).
- **Databricks Academy** : cours *self-paced* **gratuits** (ex. *Get Started with Databricks for Data Engineering*, fév. 2026), mais **labs pratiques payants** (abonnement Academy Labs ≈ 200 $/an ou 75 $/lab, selon un fil communautaire) — ✅ [Databricks Community — Get Started with Databricks for Data Engineering](https://community.databricks.com/t5/training-offerings/get-started-with-databricks-for-data-engineering/td-p/146413). → Utiliser **Free Edition** pour les TP plutôt que les labs payants.

### 3.3 Calcul mono-nœud et Python distribué

| Outil | Positionnement | Doc |
|---|---|---|
| **DuckDB** | SQL analytique embarqué, lit Parquet/Iceberg/Delta, doc 2.0 LTS | ✅ [DuckDB 2.0 docs (guide Polars)](https://duckdb.org/docs/2.0/guides/python/polars.html) |
| **MotherDuck** | DuckDB managé dans le cloud (hybride local/cloud) | ⚠️ https://motherduck.com/docs/ |
| **Polars** | DataFrames Rust, API *lazy*, modèle mémoire Arrow | ⚠️ https://docs.pola.rs/ |
| **Dask** | parallélisation de l'API pandas/NumPy | ⚠️ https://docs.dask.org/ |
| **Ray / Ray Data** | calcul distribué Python, **inférence par lots LLM** : `ray.data.llm` (moteurs vLLM et SGLang, `build_processor`, *concurrency* pour plusieurs répliques GPU, embeddings et classification) ; doc en Ray **2.60.0** | ✅ [Ray — Working with LLMs](https://docs.ray.io/en/latest/data/working-with-llms.html) · 🔎 [Ray — Offline batch inference](https://docs.ray.io/en/latest/data/batch_inference.html) |

Règle d'enseignement : « *DuckDB/Polars jusqu'à quelques centaines de Go sur une machine ; Spark/Ray/entrepôt au-delà ou quand le calcul doit être partagé* ».

### 3.4 Entrepôts et lakehouses cloud

| Plateforme | Points clés à enseigner | Certification liée | Doc |
|---|---|---|---|
| **Snowflake** | séparation stockage/calcul, *virtual warehouses*, Time Travel, partage de données, semi-structuré (VARIANT), Cortex (IA) | SnowPro Core COF-C03 | ⚠️ https://docs.snowflake.com/ |
| **BigQuery** | serverless, facturation à l'octet scanné ou en slots, partitionnement/clustering, BigQuery ML ; > 30 % de l'examen PDE selon un guide tiers | Google PDE | ⚠️ https://cloud.google.com/bigquery/docs |
| **Databricks** | lakehouse Delta/Iceberg, Unity Catalog, Lakeflow (Jobs, Declarative Pipelines), Databricks SQL | Databricks DE Associate | ⚠️ https://docs.databricks.com/ |
| **Amazon Redshift** (+ S3, Glue, Athena, EMR, Kinesis) | entrepôt AWS ; l'examen DEA couvre tout l'écosystème | AWS DEA-C01 | ⚠️ https://docs.aws.amazon.com/redshift/ |
| **Microsoft Fabric** | OneLake, lakehouse, warehouse, Real-Time Intelligence | DP-700 | ⚠️ https://learn.microsoft.com/fabric/ |
| **ClickHouse** | OLAP colonnaire temps réel open source | — | ⚠️ https://clickhouse.com/docs |
| **MotherDuck** | DuckDB cloud | — | ⚠️ https://motherduck.com/docs/ |

### 3.5 Stockage objet

S3, Google Cloud Storage, Azure ADLS Gen2, et alternatives compatibles S3 auto-hébergeables (MinIO, Garage, Ceph). Notions : buckets, préfixes, classes de stockage et cycle de vie, coût egress, cohérence, chiffrement, politiques IAM, versioning. Doc : ⚠️ https://docs.aws.amazon.com/s3/ · ⚠️ https://cloud.google.com/storage/docs. Pour l'hébergement souverain (cf. projets JM2) : présenter aussi un stockage S3-compatible hébergé en France (OVHcloud, Scaleway, Outscale — ⚠️ non vérifié pendant cette session).

---

## 4. Data pour l'IA

### 4.1 Préparation de corpus pour LLM (pré-entraînement et post-entraînement)

Source principale ✅ [UPPMAX — LLM workshop, Day 2 « Data pipelines »](https://uppmax.github.io/LLM-workshop/day2/data_pipelines) :

**Pré-entraînement (10 étapes)** : 1) acquisition et licences (Common Crawl ; gouvernance PII/droit d'auteur) ; 2) extraction et normalisation (détection de langue GlotLID/FastText, Unicode, *boilerplate*) ; 3) **déduplication exacte et quasi-doublons (MinHash, SimHash)** ; 4) filtrage qualité et **décontamination** ; 5) tokenisation (BPE/Unigram) ; 6) construction du mélange (domaines, langues) ; 7) stockage et *sharding* (Arrow, Parquet, WebDataset) ; 8) entraînement et observabilité (versioning, lignage) ; 9) évaluation continue ; 10) gouvernance et éthique.

**Référence FineWeb (datatrove)** : filtrage d'URL → extraction Trafilatura → filtre de langue → filtres Gopher et C4 → filtre FineWeb → **MinHash en 4 étapes** (signatures, buckets, clustering, filtrage ; 5-grammes, 14 buckets) → formatage PII → JSONL.

**Post-entraînement** : collecte de paires instruction/réponse (dont **synthétiques**), retrait PII, annotation/classement (humain ou IA), déduplication, *chat templates*, validation de schéma (Pydantic).

**Formats** : JSONL pour prototyper et relire ; Parquet/Arrow en shards de **50–500 Mo** à l'échelle ; toujours enregistrer versions et manifestes.

Bibliothèques et articles (cités par la page ✅, non ouverts) :
- 🔎 [huggingface/datatrove](https://github.com/huggingface/datatrove) · 🔎 [NVIDIA-NeMo/Curator](https://github.com/NVIDIA-NeMo/Curator) · 🔎 [webdataset](https://github.com/webdataset/webdataset)
- 🔎 [The Pile (arXiv 2101.00027)](https://arxiv.org/abs/2101.00027) · 🔎 [CCNet (arXiv 1911.00359)](https://arxiv.org/abs/1911.00359) · 🔎 [RefinedWeb (arXiv 2306.01116)](https://arxiv.org/abs/2306.01116) · 🔎 [Dolma (arXiv 2306.07196)](https://arxiv.org/abs/2306.07196) · 🔎 [Self-Instruct (arXiv 2212.10560)](https://arxiv.org/abs/2212.10560) · 🔎 [LIMA (arXiv 2305.11206)](https://arxiv.org/abs/2305.11206)
- 🔎 [FineWeb-2 (dépôt)](https://github.com/huggingface/fineweb-2)

**NVIDIA NeMo Curator** : plateforme open source de curation à l'échelle, 4 modalités (texte : filtrage, formatage, déduplication ; images : embeddings, classification, déduplication sémantique ; vidéo ; audio avec ASR) — ✅ [NeMo Curator — Welcome](https://docs.nvidia.com/nemo/curator/latest/home/welcome.md) ; génération synthétique 🔎 [NeMo Curator — synthetic data](https://docs.nvidia.com/nemo/curator/latest/curate-text/synthetic.md).

> Lien avec l'existant : le N4 (M27-M28) traite le pré-entraînement et le fine-tuning **côté modèle** ; le N5 traite la **chaîne de données** qui les alimente. Éviter les doublons de contenu en renvoyant explicitement vers ces modules.

### 4.2 PII et données personnelles

- **Microsoft Presidio** : SDK open source de détection et d'anonymisation (analyzer + anonymizer, reconnaisseurs personnalisables, prise en charge du français à configurer avec un modèle spaCy FR) — 🔎 [Presidio — Data Protection and De-identification SDK](https://microsoft.github.io/presidio).
- Techniques : masquage, pseudonymisation réversible (table de correspondance chiffrée), généralisation, suppression ; détection de NIR, IBAN, téléphone FR, adresses (reconnaisseurs à écrire).
- Cadre : RGPD (minimisation, base légale, durée de conservation) et AI Act art. 10 (gouvernance des données d'entraînement pour les systèmes à haut risque) — déjà présentés en N1 M07 et N2 M15 ; le N5 les **met en œuvre** dans le pipeline.

### 4.3 Chunking, embeddings et pipelines RAG à l'échelle

- **Parsing de documents** : Docling (projet open source issu d'IBM Research ; exemple officiel RAG avec OpenSearch 🔎 [Docling — RAG with OpenSearch](https://docling-project.github.io/docling/examples/rag_opensearch)), Unstructured (⚠️ https://docs.unstructured.io/).
- **Chunking** : par taille fixe avec recouvrement, récursif, par structure (titres Markdown/HTML), sémantique ; conserver métadonnées (source, page, date, droits d'accès) pour le filtrage et la citation.
- **Embeddings à l'échelle** : calcul par lots avec Ray Data LLM (✅ [Ray — Working with LLMs](https://docs.ray.io/en/latest/data/working-with-llms.html)) ou Spark ; versionner *modèle d'embedding + paramètres de chunking* ; ré-indexation complète vs incrémentale.
- **Indexation incrémentale** : identifiant stable de chunk (hash du contenu + doc_id), upsert idempotent, **suppressions propagées par CDC** (Debezium → Kafka → indexeur), *tombstones*, ré-embedding sur changement de modèle.
- **Bases vectorielles à l'échelle** : pgvector (⚠️ https://github.com/pgvector/pgvector), Milvus (⚠️ https://milvus.io/docs), Qdrant (⚠️ https://qdrant.tech/documentation/), OpenSearch/Elasticsearch, Weaviate ; index HNSW vs IVF, quantization, filtrage par métadonnées, multi-tenance, sauvegarde. Le N3 (M20) a déjà couvert le RAG en code : le N5 traite **volume, fraîcheur, coûts et exploitation**.
- **Feast** propose aussi des tutoriels RAG et des *online stores* vectoriels (Milvus, Qdrant, Faiss, Elasticsearch ; référence « Vector Database » en alpha) — ✅ [Feast — index de la documentation (llms.txt)](https://docs.feast.dev/llms.txt).

### 4.4 Feature stores

**Feast** (open source) : entités, *feature views* batch et stream, dépôts de features, **jointures point-in-time** (anti-fuite de données), *offline store* / *online store* — ✅ [Feast — documentation index](https://docs.feast.dev/llms.txt) ; concept 🔎 [Feast — Feature repository](https://docs.feast.dev/getting-started/concepts/feature-repo). Version courante non confirmée (⚠️ consulter la page *releases*).

### 4.5 Versioning des données (MLOps data)

| Outil | Principe | Doc |
|---|---|---|
| **DVC** | versioning de fichiers/datasets à côté de Git (pointeurs + stockage distant), pipelines reproductibles | 🔎 [dvc.org](https://dvc.org/home/) · ⚠️ https://dvc.org/doc |
| **lakeFS** | « Git pour le lac de données » : branches, commits, merges **sur stockage objet** | 🔎 [docs.lakefs.io](https://docs.lakefs.io) |
| Time travel des formats de table | snapshots Iceberg/Delta, `VERSION AS OF` | voir §1.3 |
| HF Datasets | versions de datasets via Git LFS/Xet sur le Hub | ⚠️ https://huggingface.co/docs/datasets |

### 4.6 Données synthétiques

- **SDV (Synthetic Data Vault)** : apprend un modèle génératif sur les données réelles puis génère des données synthétiques ; 3 types : **table unique, séquentiel, multi-tables relationnelles** ; métriques de qualité statistique et visualisations réel/synthétique ; SDV Enterprise sous licence — ✅ [SDV documentation](https://docs.sdv.dev/sdv). Licence de la version communautaire non confirmée par la page (⚠️ vérifier avant usage commercial).
- Génération par LLM (instructions, Q/R pour évaluation RAG) : NeMo Curator (§4.1), Self-Instruct.
- Points de vigilance : fuite de données réelles (*memorization*), biais amplifiés, évaluation de la confidentialité (distance au plus proche voisin), étiquetage « synthétique » dans le catalogue.

### 4.7 Data contracts

**Open Data Contract Standard (ODCS) v3.1.0** — Bitol, LF AI & Data Foundation, **Apache 2.0** ; sections : fondamentaux, **schéma**, références, **qualité**, support et canaux, tarification, équipe, rôles, **SLA**, infrastructures et serveurs, propriétés personnalisées — ✅ [bitol-io/open-data-contract-standard](https://github.com/bitol-io/open-data-contract-standard). Outillage 🔎 [Data Contract CLI — ODCS](https://docs.datacontract.com/docs/open-data-contract-standard.md) ; ingestion dans DataHub 🔎 [DataHub — source ODCS](https://docs.datahub.com/docs/generated/ingestion/sources/odcs).

### 4.8 Observabilité data

Voir §1.6 et §2.6 : 5 piliers (fraîcheur, volume, schéma, qualité, lignage) ; Elementary (OSS sur dbt) pour la pratique ; Monte Carlo / Sifflet / Bigeye comme exemples commerciaux ; *warehouse-native* : fonctions de métriques Snowflake, *data quality monitoring* Databricks.

---

## 5. Certifications data reconnues

| Certification (nom exact) | Format | Prix | Domaines et pondérations | Validité | URL |
|---|---|---|---|---|---|
| **Google Cloud — Professional Data Engineer** | 2 h ; **40-50 questions** QCM/QCM multiples ; en ligne surveillé ou centre Pearson VUE ; anglais, japonais ; expérience recommandée 3 ans dont 1 an sur Google Cloud ; « sera bientôt mis à jour pour refléter des changements de marque » | **200 $** (+ taxes) | 1. Conception de systèmes de traitement (~22 %) · 2. Ingestion et traitement (~25 %) · 3. Stockage (~20 %) · 4. Préparation et usage pour l'analyse (~15 %, dont **4.2 « Preparing data for AI and ML »**) · 5. Maintenance et automatisation des charges (~18 %) | 2 ans | ✅ [page officielle](https://cloud.google.com/certification/data-engineer) · ✅ [guide d'examen PDF](https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf) |
| **AWS Certified Data Engineer – Associate (DEA-C01)** | **130 min** ; **65 questions** (50 notées + 15 non notées) ; QCM simple et multiple ; score 720/1000 (compensatoire) ; anglais, japonais, coréen, chinois simplifié | **150 $** | 1. Ingestion et transformation **34 %** · 2. Gestion des stockages **26 %** · 3. Opérations et support **22 %** · 4. Sécurité et gouvernance **18 %** | 3 ans | ✅ [page officielle](https://aws.amazon.com/en/certification/certified-data-engineer-associate) · ✅ [guide d'examen (version DE)](https://docs.aws.amazon.com/de_de/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html) · 🔎 [guide PDF](https://docs.aws.amazon.com/pdfs/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.pdf) |
| **Microsoft Certified: Fabric Data Engineer Associate** — examen **DP-700** *Implementing Data Engineering Solutions Using Microsoft Fabric* | score ≥ 700 ; durée et langues ⚠️ non vérifiées ; renouvellement annuel gratuit en ligne (évaluation éligible 6 mois avant expiration ; parcours de préparation ≈ 45 min) | ⚠️ tarif par pays affiché à l'inscription (non vérifié) | 1. Implémenter et gérer une solution analytique **30-35 %** · 2. Ingérer et transformer les données (batch + streaming) **30-35 %** · 3. Superviser et optimiser **30-35 %** (guide mis à jour le 30 oct. 2026) | 1 an (renouvelable) ⚠️ | ✅ [guide d'étude DP-700](https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-700) · ✅ [renouvellement](https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/renew) · 🔎 [page certification](https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/) |
| ↳ *Azure Data Engineer Associate (DP-203)* | **retirée le 31 mars 2025** ; reste sur les relevés mais n'est plus renouvelable ; remplacée de fait par DP-700 | — | — | — | ✅ [Trainocate — avis de retrait](https://trainocate.com.my/microsoft-certified-azure-data-engineer-associate/) (source tierce) |
| **Databricks Certified Data Engineer Associate** | **90 min** ; **45 questions notées** ; anglais, japonais, portugais (BR), coréen ; pas de prérequis ; guide d'examen daté **août 2026** | **200 $** | Databricks Intelligence Platform **6 %** · Ingestion et chargement **21 %** · Transformation et modélisation **22 %** · Lakeflow Jobs **16 %** · CI/CD **10 %** · Dépannage, supervision, optimisation **10 %** · Gouvernance et sécurité **15 %** | 2 ans | ✅ [page officielle](https://www.databricks.com/learn/certification/data-engineer-associate) |
| **SnowPro® Core Certification (COF-C03)** | remplace COF-C02 ; lancement **16 fév. 2026** ; ≥ 6 mois d'expérience Snowflake recommandés. Selon une source tierce : **100 questions, 115 min**, score 750/1000 ; COF-C02 anglais retirée le 14 mai 2026 | **175 $** (source tierce) | Selon la source tierce : Fonctionnalités et architecture AI Data Cloud **31 %** · Gestion de compte et gouvernance **20 %** · Chargement/déchargement et connectivité **18 %** · Performance, requêtes, transformation **21 %** · Collaboration de données **10 %** | ⚠️ | ✅ [page officielle COF-C03](https://learn.snowflake.com/en/certifications/snowpro-core-c03) · ✅ [Open Exam Prep — changements COF-C03](https://open-exam-prep.com/blog/snowpro-core-cof-c03-changes-study-guide-2026) (tiers) |
| **dbt Analytics Engineering Certification Exam** | **65 questions, 2 h** ; réussite **65 %** ; dbt **1.11** ; recommandé : SQL + ≥ 6 mois de dbt | **200 $** | 7 thèmes (sans pondération publiée) : développer et optimiser des modèles · gouvernance des modèles · déboguer les erreurs de modélisation · dépanner/optimiser les pipelines · implémenter les tests · dépendances externes · exploiter le *state* dbt | ⚠️ (examen de recertification distinct 🔎 [lien](https://www.getdbt.com/certifications/analytics-engineer-recertification-exam)) | ✅ [page officielle](https://www.getdbt.com/certifications/analytics-engineer-certification-exam) · 🔎 [guide d'étude v1.11](https://www.getdbt.com/dbt-assets/certifications/dbt-certificate-study-guide-version-1-11) |
| **Confluent Certified Developer for Apache Kafka® (CCDAK)** | **90 min**, surveillé, en anglais ; QCM, appariement, ordre ; nombre de questions **non publié** sur la page officielle | ⚠️ non affiché (≈ 150 $ selon sources tierces, non vérifié) | pas de tableau pondéré officiel ; thèmes usuels : fondamentaux et partitionnement, producteurs (fiabilité/perf.), consommateurs (groupes, offsets, rebalancing), transactions, schémas, Kafka Streams, dépannage | 2 ans | ✅ [Confluent — Certification](https://www.confluent.io/en-gb/certification/) · ✅ [FAQ tierce](https://techexamlexicon-com.pages.dev/confluent/ccdak/faq/) |

Parcours de préparation gratuits liés :
- Google : parcours **« Professional Data Engineer Certification »** (13 activités : cours, labs, *skill badges*) — ✅ [Google Skills — path 16](https://www.skills.google/paths/16) (l'ancien domaine `cloudskillsboost.google` redirige vers `skills.google`) ; gratuité non précisée par la page (⚠️).
- Microsoft : cours DP-700T00 (formateur) et collection Microsoft Learn auto-rythmée — 🔎 [Microsoft Learn self-guided study materials: DP-700](https://partner.microsoft.com/en-jo/asset/collection/microsoft-learn-self-guided-study-materials-dp-700).
- AWS : AWS Skill Builder (préparation officielle DEA-C01 citée par la page AWS ✅).
- dbt : dbt Learn Fundamentals (gratuit) ✅.
- Databricks : Academy self-paced gratuit + Free Edition ✅.

---

## 6. Cours ouverts de référence

| Cours / ouvrage | Contenu vérifié | Licence / réutilisation | URL |
|---|---|---|---|
| **DataTalksClub — Data Engineering Zoomcamp** | **9 semaines**, gratuit ; modules : 1 Conteneurisation & IaC (GCP, Docker, Compose, Postgres, Terraform) · 2 Orchestration (**Kestra**) · Workshop 1 Ingestion (**dlt**) · 3 Data warehousing (**BigQuery**) · 4 Analytics engineering (**dbt, DuckDB**, BigQuery) · 5 Data platforms (**Bruin**) · 6 Batch (**Spark**) · 7 Streaming (**Kafka, Kafka Streams, KSQL, Avro**) ; prochaine cohorte **janvier 2027**, self-paced possible | « free and open-source » mais **licence non indiquée** sur la page (⚠️ vérifier le fichier LICENSE avant toute réutilisation) | ✅ [GitHub](https://github.com/datatalksclub/data-engineering-zoomcamp) · 🔎 [site du cours 2026](https://datatalks.club/docs/courses/data-engineering-zoomcamp) |
| **Fundamentals of Data Engineering** (Reis & Housley, O'Reilly 2022) | cycle de vie + *undercurrents* (§1.1) | ouvrage commercial : référence bibliographique | ✅ [O'Reilly](https://oreilly.com/library/view/fundamentals-of-data/9781098108298) |
| **Designing Data-Intensive Applications, 2e éd.** (Kleppmann & **Riccomini**, O'Reilly, **mars 2026**) | 2e édition intégrant nouvelles technologies ; liste des chapitres non publiée sur la page de l'auteur | ouvrage commercial | ✅ [annonce de l'auteur (24 mars 2026)](https://martin.kleppmann.com/2026/03/24/designing-data-intensive-applications-2e.html) · 🔎 [O'Reilly 2e éd.](https://www.oreilly.com/library/view/designing-data-intensive/9781098119058/) |
| **Stanford CS246 — Mining Massive Data Sets** (hiver 2025, J. Leskovec) | MapReduce et Spark, itemsets fréquents, **LSH / plus proches voisins**, réduction de dimension (SVD, CUR), recommandation, clustering, PageRank, ML à grande échelle, flux ; 4 devoirs + Colabs Spark hebdomadaires | contenu de cours : inspiration seulement | ✅ [CS246 Info Handout 2025](https://snap.stanford.edu/class/cs246-2025/WWW/handouts/CS246_Info_Handout.pdf) |
| **Livre *Mining of Massive Datasets*** (Leskovec, Rajaraman, Ullman ; v2.1, 12 chapitres, 511 p.) | ch. 1 Data mining · 2 Map-Reduce · 3 Similar items (MinHash/LSH) · 4 Data streams · 5 Link analysis · 6 Frequent itemsets · 7 Clustering · 8 Advertising · 9 Recommendation · 10 Social graphs · 11 Dimensionality reduction · 12 Large-scale ML | **PDF gratuit** autorisé par l'éditeur (Cambridge University Press conserve le copyright) ; ne pas redistribuer | 🔎 [mmds.org](http://www.mmds.org) (URL donnée par le handout CS246 ✅ ; ancienne page Ullman lue via un miroir) |
| **Stanford CS145 — Data Management and Data Systems** (automne 2026, site « big data ») | modules SQL, problèmes, projets (détail non lu) | inspiration | 🔎 [cs145.stanford.edu — planning fa26](https://cs145.stanford.edu/schedule-fa26.html) · 🔎 [cs145-bigdata.web.app](https://cs145-bigdata.web.app/) |
| **CMU 15-445/645 Database Systems** (A. Pavlo, automne 2025) | stockage, buffer pool, index, exécution et optimisation de requêtes, concurrence, reprise, **bases distribuées** (diapos 23-24) ; vidéos gratuites YouTube | inspiration | 🔎 [diapos « Distributed databases I » fall 2025](https://15445.courses.cs.cmu.edu/fall2025/slides/23-distributed1.pdf) · 🔎 [page A. Pavlo](https://www.cs.cmu.edu/~pavlo) |
| **Berkeley CS186 — Introduction to Database Systems** (printemps 2025) | SQL I-II, disques/buffers, index et B+ trees, **index spatiaux et vectoriels**, tri/hachage, jointures, algèbre relationnelle, optimisation, transactions et concurrence, reprise, requêtes parallèles, 2PC, Paxos, NoSQL (MongoDB), **MapReduce et Spark** ; 7 projets (SQL, B+ trees, jointures, verrous, reprise, NoSQL) | notes publiques 🔎 [cs186berkeley.net/notes](https://cs186berkeley.net/notes/) ; inspiration | ✅ [CS186 sp25](https://cs186berkeley.net/sp25/) |
| **MIT 6.5830/6.5831 Database Systems** (printemps 2026) | modèles, normalisation, traitement et optimisation de requêtes, transactions, bases distribuées/parallèles, KV stores, **streaming databases**, DBaaS ; labs en **Go** ; lectures *Readings in Database Systems* (Red Book, 5e éd.) | inspiration | ✅ [syllabus](https://dsg.csail.mit.edu/6.5830/syllabus.php) |
| **Databricks Academy** | cours self-paced gratuits (SQL → ML), labs payants ; Free Edition gratuite | conditions Databricks | ✅ [Community — cours DE](https://community.databricks.com/t5/training-offerings/get-started-with-databricks-for-data-engineering/td-p/146413) · ✅ [Free Edition](https://www.databricks.com/blog/learn-experiment-and-build-databricks-free-edition) |
| **Google Skills (ex-Cloud Skills Boost)** | parcours PDE, 13 activités | conditions Google | ✅ [path 16](https://www.skills.google/paths/16) |
| **Microsoft Learn — DP-700** | guide d'étude + collection auto-rythmée | gratuit (Microsoft Learn) | ✅ [guide DP-700](https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-700) |
| **Kaggle Learn** | micro-cours gratuits de quelques heures : Python, **Pandas**, Data Visualization, **Intro to SQL**, **Advanced SQL** (BigQuery), Intro/Intermediate ML | gratuit | 🔎 [Pandas](https://www.kaggle.com/learn/pandas) · 🔎 [Intro to SQL](https://www.kaggle.com/learn/intro-to-sql) · 🔎 [Advanced SQL](https://www.kaggle.com/learn/advanced-sql) (URLs listées par ✅ [KDnuggets](https://www.kdnuggets.com/7-free-kaggle-micro-courses-for-data-science-beginners)) |
| **OpenClassrooms — parcours Data Engineer** | titre **RNCP39775** « Expert en ingénierie et science des données », niveau 7 ; 13 projets dont SQL/BDD, audit d'environnement, NoSQL, infrastructure cloud, **pipeline d'orchestration**, **« Concevez et déployez un système RAG »**, POC → MVP ; alternance possible | payant / alternance | ✅ [parcours 1039](https://openclassrooms.com/fr/paths/1039-data-engineer) |
| **FUN-MOOC — Fondamentaux pour le Big Data** | 6 semaines : Python/NumPy, algèbre linéaire, probabilités, statistiques, limites des SGBD relationnels, perceptron ; gratuit ; **aucune session ouverte** au moment de la lecture | conditions FUN | ✅ [fiche MOOC List](https://www.mooc-list.com/course/fondamentaux-pour-le-big-data-fun) · page FUN-MOOC ⚠️ non trouvée |

---

## 7. Métier et marché en France (2026)

### 7.1 Fiches métiers

- **APEC — Data Engineer** ✅ [apec.fr](https://www.apec.fr/tous-nos-metiers/informatique/data-engineer.html) : met en place la collecte et le stockage, rend les données disponibles, industrialise les traitements ; missions : APIs de collecte, stockage (Hadoop), automatisation des batchs, tests ; nettoyage, documentation, **cycle de vie RGPD**, support de production ; **déploiement et suivi de modèles ML** ; spécifications techniques. Formation : Bac+5 (informatique, data, statistiques) ou Bac+2 + expérience. Compétences : Hadoop/Hive/Spark, SQL et NoSQL, Python/Java/Scala, **Kafka, Flink**, ETL/ELT, agilité, cybersécurité. Évolutions : architecte big data, chef de projet. **Salaire : 80 % des offres entre 35 et 60 k€ brut annuel (fixe + variable), moyenne ≈ 47 k€.**
- **ROME M1811 « Data engineer »** (France Travail, ROME 4.0) : appellations big data engineer, data architect, data manager, big data developer, data quality analyst… ; compétences : bases SQL/NoSQL, modélisation, déploiement et intégration, tests, maintenance des infrastructures, anticipation des coûts — lu via ✅ [OPCO Direct — fiche M1811](https://opcodirect.fr/metier/data-engineer) (reprise de la source ROME ; fiche officielle France Travail ⚠️ non ouverte).
- **Fonction publique** : ✅ [Choisir le service public — Data engineer](https://choisirleservicepublic.gouv.fr/metiers/numerique/data-engineer/) (conçoit l'architecture des données, cartographie et priorise les jeux de données, contrôle la qualité, alimente les data scientists ; pas de grille salariale sur la page).

### 7.2 Salaires indicatifs sourcés

| Source | Périmètre | Chiffres |
|---|---|---|
| ✅ [APEC — fiche Data Engineer](https://www.apec.fr/tous-nos-metiers/informatique/data-engineer.html) | offres publiées, France | 35–60 k€ (80 % des offres), moyenne ≈ 47 k€ brut/an |
| ✅ [Michael Page — grille Data & IA (étude 2027)](https://www.michaelpage.fr/grilles-de-salaires/technology/data-ia-data-engineer-data-scientist) | Île-de-France, fixe hors variable | **45 k€ (bas) / 59 k€ (moyen) / 80 k€ (haut)** ; régions : PACA −5 %, AURA et Hauts-de-France −5 à −10 %, Grand Est et Occitanie −10 à −15 %, Nouvelle-Aquitaine et Pays de la Loire −15 %, Bretagne / Centre-Val de Loire / Normandie −15 à −20 % ; détail par expérience réservé (accès verrouillé) |
| Freelance | TJM | non vérifié pendant la session (⚠️) |

### 7.3 Certifications RNCP « data engineer » (vérifiées sur France Compétences)

| Code | Intitulé | Certificateur | Niveau | Statut | Dates |
|---|---|---|---|---|---|
| **RNCP42655** | Data engineer | DATASCIENTEST (nom commercial **Liora**) | 7 | **Active** | décision 17-07-2026 ; échéance 17-07-2031 (5 ans) — ✅ [fiche](https://www.francecompetences.fr/recherche/rncp/42655/) |
| RNCP38919 | Data engineer | DATASCIENTEST | 7 | Inactive (remplacée par RNCP42655) | 26-04-2024 → 26-04-2026 — ✅ [fiche](https://www.francecompetences.fr/recherche/RNCP/38919) |
| **RNCP42149** | Data engineer | Institut Européen F2I | 7 | Active (nouvelle version ; fiche non ouverte ⚠️) | remplace RNCP37422 |
| RNCP37422 | Data Engineer | Institut Européen F2I | 7 | Inactive | 27-03-2023 → 27-03-2026 — ✅ [fiche](https://www.francecompetences.fr/recherche/RNCP/37422) |
| **RNCP39775** | Expert en ingénierie et science des données | OpenClassrooms | 7 | cité par OpenClassrooms (fiche non ouverte ⚠️) | — ✅ [parcours](https://openclassrooms.com/fr/paths/1039-data-engineer) |
| RNCP36398 | Expert big data engineer (MS) | Université de technologie de Troyes | 7 | Inactive (fin 25-04-2025), remplacée (Certif Info 118529) | ✅ [Intercariforef](https://intercariforef.org/formations/certification-113304.html) |
| RNCP39541 → **RNCP42443** | Ingénieur diplômé du Cnam, spécialité Science de la donnée et IA | Le Cnam + MESR | 7 | 39541 inactive (fin 31-08-2026), remplacée par 42443 | ✅ [fiche 39541](https://www.francecompetences.fr/recherche/rncp/39541/) |

Blocs de compétences RNCP42655 (utiles pour aligner nos C5.x) : BC01 Concevoir un projet d'architecture technique de gestion de données · BC02 Élaborer une architecture technique de gestion de données · **BC03 Déployer une solution d'analyse de données massives intégrant l'IA** · BC04 Piloter un projet d'architecture technique de gestion de données.

Blocs RNCP37422 (F2I) : analyser les besoins en infrastructures de données **adaptés au projet d'IA** · piloter le développement de l'infrastructure de données massives · concevoir les architectures big data · piloter la maintenance.

> Positionnement : tous les titres « data engineer » sont de **niveau 7 (Bac+5)** et longs (≈ 400-900 h). Un N5 de 30 h ne peut pas viser l'équivalence ; il peut en revanche être présenté comme **certification RS** « Préparer et industrialiser les données pour l'IA générative » ou comme **passerelle** (bloc de compétences préparatoire) vers ces titres.

---

## 8. Proposition de programme — Niveau 5 « Data engineering & Big Data pour l'IA »

### 8.1 Fiche niveau

| Champ | Proposition |
|---|---|
| id / code | `N5` / `NF-IA-N5` |
| Titre | Niveau 5 — Data engineering & Big Data pour l'IA |
| Durée | **30 h** (1 800 min) : leçons 1 635 min + 7 quiz × 15 min + examen 60 min |
| Public | Développeurs, data analysts, ingénieurs IA ayant validé le N3 ; profils N4 souhaitant industrialiser les données |
| Prérequis | N3 (Python, API, RAG en code) ; SQL de base ; Docker de base (rappel en M31) |
| Certificat | Certificat Next Formation IA — Niveau 5 « Data engineer IA » |
| Environnement de TP | 100 % gratuit et local : Docker Compose (Postgres, MinIO, Kafka KRaft, Debezium), DuckDB, Polars, dbt Core + adaptateur DuckDB, Dagster ou Airflow, Qdrant/pgvector ; option cloud : Databricks Free Edition, BigQuery sandbox |
| Alignement | Google PDE, AWS DEA-C01, DP-700, Databricks DE Associate, SnowPro Core, dbt Analytics Engineering, CCDAK ; Zoomcamp DE ; CS246/MMDS, CMU 15-445, Berkeley CS186, MIT 6.5830 ; RNCP42655 BC03 |

### 8.2 Modules et leçons

**M31 — Données, formats et SQL analytique moderne** (4 h 25 = 265 min) · C5.1
| Leçon | Titre | Min |
|---|---|---|
| L151 | Le cycle de vie du data engineering et le rôle du data engineer IA (Reis & Housley, fiche APEC, ROME M1811) | 40 |
| L152 | Types de données et formats de fichiers : CSV, JSON/JSONL, Parquet, Avro, ORC, Arrow — mesurer taille et vitesse | 55 |
| L153 | SQL analytique moderne avec DuckDB : CTE, fenêtres, QUALIFY, MERGE, JSON et lecture d'un plan d'exécution | 55 |
| L154 | Modéliser pour l'analytique : 3NF, étoile et SCD type 2, Data Vault 2.0, architecture médaillon | 55 |
| L155 | Atelier : profiler, nettoyer et modéliser un jeu de données réel en Parquet avec DuckDB et Polars | 45 |
| Quiz M31 | 10 questions | 15 |

**M32 — Stockage, lakehouse et calcul distribué** (4 h 30 = 270 min) · C5.1, C5.3
| Leçon | Titre | Min |
|---|---|---|
| L156 | De Hadoop au lakehouse : HDFS et MapReduce (historique), stockage objet S3/GCS/MinIO, coûts et cycle de vie | 40 |
| L157 | Formats de table ouverts : Delta Lake, Apache Iceberg, Apache Hudi, time travel et catalogues REST (Unity Catalog, Polaris) | 55 |
| L158 | Entrepôts et lakehouses cloud : Snowflake, BigQuery, Databricks, Redshift, Fabric, ClickHouse, MotherDuck — choisir et chiffrer | 50 |
| L159 | Apache Spark et PySpark 4 : DataFrames, partitions, shuffle, jointures broadcast, AQE, Spark Connect | 60 |
| L160 | Passer à l'échelle en Python : Polars lazy, DuckDB, Dask et Ray — quand ne pas utiliser Spark | 50 |
| Quiz M32 | 10 questions | 15 |

**M33 — Pipelines batch : ingestion, ELT avec dbt et orchestration** (4 h 25 = 265 min) · C5.2
| Leçon | Titre | Min |
|---|---|---|
| L161 | ETL ou ELT : architectures, couches bronze/silver/gold, idempotence et rejouabilité | 35 |
| L162 | Ingestion incrémentale : Airbyte, Fivetran, dlt et capture de changements (CDC) avec Debezium | 50 |
| L163 | dbt Core : sources, ref, matérialisations, modèles incrémentaux, snapshots, tests, documentation et lignage | 60 |
| L164 | Orchestrer : Airflow 3 (DAG, assets, Task SDK), Dagster (assets), Prefect — reprise, backfill, alertes | 55 |
| L165 | Atelier : pipeline dlt → DuckDB → dbt orchestré, avec CI « slim » sur les modèles modifiés | 50 |
| Quiz M33 | 10 questions | 15 |

**M34 — Streaming et données temps réel** (3 h 35 = 215 min) · C5.3
| Leçon | Titre | Min |
|---|---|---|
| L166 | Penser en flux : événements, temps d'événement et de traitement, fenêtres, retard, garanties de livraison | 45 |
| L167 | Apache Kafka 4 en mode KRaft : topics, partitions, consumer groups (KIP-848), Avro et Schema Registry, Kafka Connect | 55 |
| L168 | Traiter les flux : Apache Flink, Spark Structured Streaming, Kafka Streams — état, watermarks, exactly-once | 50 |
| L169 | Atelier : CDC Postgres → Debezium → Kafka → table Iceberg/Delta interrogée par DuckDB | 50 |
| Quiz M34 | 10 questions | 15 |

**M35 — Qualité, gouvernance et observabilité des données** (3 h 55 = 235 min) · C5.4, C5.6
| Leçon | Titre | Min |
|---|---|---|
| L170 | Qualité des données : dimensions, tests dbt, Great Expectations (GX Core) et Soda Core (SodaCL) | 50 |
| L171 | Contrats de données avec l'Open Data Contract Standard v3.1 et gestion de l'évolution de schéma | 40 |
| L172 | Gouvernance, catalogues et lignage : Unity Catalog, OpenMetadata, DataHub, OpenLineage | 50 |
| L173 | Observabilité data : les 5 piliers, Elementary sur dbt, plateformes commerciales, gestion d'incident | 40 |
| L174 | Sécurité et conformité dans le pipeline : RGPD, contrôle d'accès, chiffrement, AI Act art. 10 | 40 |
| Quiz M35 | 10 questions | 15 |

**M36 — Préparer les données pour l'IA : LLM, ML et RAG** (4 h 15 = 255 min) · C5.5
| Leçon | Titre | Min |
|---|---|---|
| L175 | Construire un corpus texte : extraction (Docling, Trafilatura), normalisation, langue, filtres qualité (méthode FineWeb) | 50 |
| L176 | Dédupliquer à l'échelle : hachage exact, MinHash/LSH (MMDS ch. 3), déduplication sémantique, décontamination | 50 |
| L177 | Détecter et anonymiser les données personnelles avec Presidio (reconnaisseurs français : NIR, IBAN, téléphone) | 40 |
| L178 | Chunking, embeddings par lots (Ray Data, Spark) et bases vectorielles à l'échelle : index, filtres, multi-tenance, coûts | 55 |
| L179 | Features, versions et données synthétiques : Feast (point-in-time), DVC, lakeFS, SDV et génération par LLM | 45 |
| Quiz M36 | 10 questions | 15 |

**M37 — Projet final : pipeline de données de bout en bout pour un RAG d'entreprise** (3 h 55 = 235 min) · C5.1 à C5.6
| Leçon | Titre | Min |
|---|---|---|
| L180 | Cadrer le projet : sources, volumétrie, fraîcheur, droits d'accès, SLA, contrat de données et architecture cible | 40 |
| L181 | Ingestion : documents (stockage objet) et base métier en CDC vers la couche bronze | 45 |
| L182 | Transformation et qualité : parsing, PII, déduplication, chunking en silver ; tests et contrats | 45 |
| L183 | Indexation vectorielle incrémentale (upserts, suppressions, ré-embedding) et évaluation de la récupération | 45 |
| L184 | Industrialiser : orchestration, observabilité, coût par document, documentation et soutenance | 45 |
| Quiz M37 | 10 questions | 15 |

**Examen de certification N5** : 40 questions (majoritairement mises en situation), **60 min**, seuil 70 %.

**Contrôle des durées** : leçons 1 635 min + quiz 105 min + examen 60 min = **1 800 min = 30 h** (calcul vérifié par script). Leçons : 34 (L151-L184), soit 4 à 6 par module.

| Module | Leçons | Min (avec quiz) | Heures |
|---|---|---|---|
| M31 | 5 | 265 | 4,42 |
| M32 | 5 | 270 | 4,50 |
| M33 | 5 | 265 | 4,42 |
| M34 | 4 | 215 | 3,58 |
| M35 | 5 | 235 | 3,92 |
| M36 | 5 | 255 | 4,25 |
| M37 | 5 | 235 | 3,92 |
| Examen | — | 60 | 1,00 |
| **Total** | **34** | **1 800** | **30,00** |

### 8.3 Compétences C5.1 à C5.6 (format France Compétences)

**Bloc 5 (Niveau 5) — Concevoir, industrialiser et gouverner les pipelines de données alimentant des systèmes d'IA**

Objectif professionnel : permettre à un développeur IA de construire et d'exploiter la chaîne de données (ingestion, stockage, transformation, qualité, préparation) qui alimente les applications d'IA générative (RAG, agents, fine-tuning) et le machine learning, à l'échelle et en conformité.

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C5.1 | **Concevoir** un modèle de données analytique (étoile ou Data Vault) et **choisir** les formats et le stockage (Parquet, format de table ouvert, entrepôt cloud ou moteur local) adaptés à un volume, une latence et un budget donnés | Le modèle couvre les besoins exprimés et gère l'historisation ; le choix de format et de moteur est justifié par au moins trois critères chiffrés (volume, coût, latence, multi-moteurs) ; le schéma est documenté | Étude de cas écrite + exercice DuckDB |
| C5.2 | **Construire** un pipeline batch ELT incrémental (ingestion, transformation dbt testée, orchestration) capable de reprendre après échec sans doublon | Le pipeline s'exécute de bout en bout sur le jeu de test ; un rejeu ne crée pas de doublon (idempotence démontrée) ; au moins 5 tests dbt passent ; les dépendances sont orchestrées avec alerte en cas d'échec | Projet pratique (dépôt Git livré) |
| C5.3 | **Traiter** des données volumineuses ou en flux avec le moteur approprié (Spark, Polars/DuckDB, Kafka et Flink/Spark Streaming) en garantissant l'ordre, la fraîcheur et la sémantique de livraison requises | Le moteur retenu est justifié ; un traitement distribué est optimisé (partitionnement, jointure) avec gain mesuré ; un flux CDC est propagé avec une latence mesurée et sans perte sur le scénario de test | Exercice pratique + QCM de mise en situation |
| C5.4 | **Mettre en œuvre** la qualité, la gouvernance et la conformité des données : tests, contrat de données, catalogue et lignage, contrôle d'accès, règles RGPD | Un contrat ODCS valide décrit schéma, qualité et SLA ; les contrôles bloquent une donnée non conforme ; le lignage source → index est consultable ; les données personnelles et leur base légale sont identifiées | Projet pratique + étude de cas |
| C5.5 | **Préparer** des données pour l'IA : extraction, nettoyage, déduplication, anonymisation des données personnelles, découpage et vectorisation, versionnement des jeux et, le cas échéant, génération de données synthétiques | Le taux de doublons après traitement est mesuré ; les PII du jeu de test sont détectées à ≥ 90 % et masquées ; la stratégie de chunking est justifiée par une évaluation de récupération ; chaque jeu produit est versionné et reproductible | Projet pratique évalué sur grille |
| C5.6 | **Exploiter et optimiser** une plateforme de données en production : observabilité (fraîcheur, volume, schéma, qualité, lignage), gestion d'incident, maîtrise des coûts et documentation | Des moniteurs couvrent les 5 piliers ; un incident simulé est détecté, diagnostiqué et documenté (post-mortem) ; le coût par exécution ou par document est estimé ; un runbook est livré | Mise en situation + soutenance orale |

### 8.4 Projet final (M37) — « Pipeline de données de bout en bout pour un RAG d'entreprise »

**Contexte** : une PME (exemple réutilisable : cabinet RH client de Next RH, ou organisme de formation client de Next Formation) veut un assistant interne fiable sur ses documents (PDF, pages intranet, tickets) et sur sa base métier (Postgres). Les documents changent chaque jour ; certains contiennent des données personnelles ; chaque service ne doit voir que ses documents.

**Livrables** :
1. Dossier d'architecture (1-2 pages) : sources, volumétrie, SLA de fraîcheur, schéma médaillon, choix techniques justifiés, **contrat ODCS** de la table de chunks.
2. Dépôt Git avec Docker Compose : MinIO (stockage objet), Postgres + **Debezium + Kafka** (CDC), ingestion documents (dlt ou script), **parsing Docling**, **Presidio**, **déduplication MinHash**, **chunking**, **embeddings par lots**, upsert idempotent dans **Qdrant ou pgvector** avec métadonnées de droits, transformations **dbt** (tables de suivi, marts de qualité), orchestration **Dagster ou Airflow**.
3. Qualité et observabilité : tests dbt + GX/Soda, moniteurs de fraîcheur/volume, tableau de bord simple (Elementary ou requêtes DuckDB).
4. Évaluation : jeu de 30 questions (dont 10 générées synthétiquement et relues), métriques de récupération (recall@k, MRR), test de **suppression propagée** (un document supprimé à la source disparaît de l'index en moins de X minutes), test de cloisonnement des droits.
5. Runbook + estimation de coût (local vs cloud) + soutenance 15 min.

**Grille** : fonctionnement de bout en bout (25 %), idempotence et incrémental/CDC (20 %), qualité/gouvernance/PII (20 %), évaluation RAG (15 %), observabilité et coûts (10 %), documentation et soutenance (10 %).

### 8.5 Correspondance modules ↔ compétences

| Compétence | M31 | M32 | M33 | M34 | M35 | M36 | M37 |
|---|---|---|---|---|---|---|---|
| C5.1 | ● | ● | | | | | ● |
| C5.2 | | | ● | | | | ● |
| C5.3 | | ● | | ● | | ○ | ● |
| C5.4 | | ○ | ○ | | ● | ○ | ● |
| C5.5 | | | | | | ● | ● |
| C5.6 | | | ○ | | ● | | ● |

(● = traité principalement ; ○ = mobilisé)

### 8.6 Correspondance avec les certifications du §5

| Certification | Domaines couverts par le N5 | Modules | Couverture estimée | À compléter par l'apprenant |
|---|---|---|---|---|
| Google Professional Data Engineer | 1 Conception (sécurité, fiabilité, migration) · 2 Ingestion et traitement · 3 Stockage (entrepôt, lac, plateforme) · **4.2 Données pour l'IA/ML** · 5 Automatisation et supervision | M32, M33, M34, M35, M36 | ≈ 50 % (concepts) | services GCP : BigQuery, Dataflow/Beam, Pub/Sub, Dataproc, Dataplex, Composer ; parcours Google Skills path 16 |
| AWS DEA-C01 | Ingestion/transformation (34 %) · Stockage (26 %) · Opérations (22 %) · Sécurité/gouvernance (18 %) | M32-M35 | ≈ 45 % | Glue, Kinesis, EMR, Redshift, Athena, Lake Formation, Step Functions, MWAA ; AWS Skill Builder |
| Microsoft DP-700 (Fabric) | Ingestion batch + streaming · Orchestration · Sécurité/gouvernance · Supervision/optimisation | M33, M34, M35 | ≈ 40 % | OneLake, Lakehouse, Warehouse, Data Factory, Eventstreams, KQL, déploiement Fabric ; collection Microsoft Learn DP-700 |
| Databricks DE Associate | Ingestion (21 %) · Transformation/modélisation (22 %) · Gouvernance (15 %) · Jobs (16 %) · CI/CD (10 %) · Dépannage (10 %) | M32 (Spark, Delta, Unity Catalog), M33, M35 | ≈ 55 % | Lakeflow Jobs et Declarative Pipelines, Auto Loader, Asset Bundles ; Databricks Academy + Free Edition |
| SnowPro Core COF-C03 | Chargement/connectivité · Performance et requêtes · Gouvernance · Collaboration | M31, M32, M35 | ≈ 35 % | architecture Snowflake (warehouses, micro-partitions, Time Travel, partage, Cortex) |
| dbt Analytics Engineering | Modèles, gouvernance des modèles, tests, débogage, dépendances, *state* | **M33** (cœur), M35 | ≈ 65 % | dbt Learn (Fundamentals + 4 cours avancés gratuits), pratique ≥ 6 mois recommandée |
| Confluent CCDAK | Partitionnement, producteurs, consommateurs, schémas, Streams | **M34** | ≈ 40 % | API Java producteurs/consommateurs, transactions, Kafka Streams en profondeur |

> Message commercial honnête : le N5 **prépare les fondamentaux communs** à ces certifications et donne une expérience projet ; il ne remplace pas la préparation spécifique au fournisseur.

### 8.7 Sources par module (pour `module.json` → `sources`)

- M31 : Reis & Housley ✅ ; DuckDB 2.0 docs ✅ ; Berkeley CS186 ✅ ; MIT 6.5830 ✅ ; Kaggle Intro/Advanced SQL 🔎 ; Parquet/Avro/Arrow ⚠️.
- M32 : PySpark Getting Started ✅ ; Databricks Free Edition ✅ ; RisingWave comparatif formats ✅ ; Metadata Platforms 2026 ✅ ; Ray LLM ✅ ; MMDS ch. 2 🔎 ; CS246 ✅.
- M33 : Airflow announcements ✅ ; Dagster/Prefect ✅ ; comparatif orchestration ✅ ; dbt Learn ✅ ; dbt certification ✅ ; Debezium examples 🔎 ; Zoomcamp ✅.
- M34 : Kafka 4.0 (SSOJet) ✅ ; Zoomcamp module 7 ✅ ; Flink / Spark Streaming / Kafka docs ⚠️.
- M35 : ODCS ✅ ; DataDriven observabilité ✅ ; GX vs Soda ✅ ; catalogues 2026 ✅ ; OpenLineage 🔎 ; dbt source freshness 🔎.
- M36 : UPPMAX LLM data pipelines ✅ ; NeMo Curator ✅ ; datatrove 🔎 ; Presidio 🔎 ; Ray LLM ✅ ; Feast ✅ ; SDV ✅ ; lakeFS 🔎 ; DVC 🔎 ; Docling 🔎 ; MMDS ch. 3 🔎.
- M37 : ensemble des sources ci-dessus + OpenClassrooms projet « Concevez et déployez un système RAG » ✅ (repère marché).

---

## 9. Points ouverts et vérifications à faire avant rédaction

1. Lancer `node scripts/validate.mjs --links` sur toutes les URLs ⚠️ et 🔎 de ce document.
2. Confirmer la **licence du dépôt Zoomcamp** (fichier LICENSE) et celle de **SDV** communautaire.
3. Confirmer prix/durée **DP-700** et prix **CCDAK** sur les pages officielles (non accessibles pendant la session).
4. Ouvrir la fiche officielle **ROME M1811** sur France Travail et les fiches **RNCP42149**, **RNCP39775**, **RNCP42443**.
5. Vérifier la version courante de **Kafka**, **Flink**, **Feast**, **Delta Lake** et l'état d'**Apache Polaris** (graduation annoncée par une source tierce).
6. Trouver la page FUN-MOOC officielle de « Fondamentaux pour le Big Data » ou une alternative francophone ouverte.

## 10. Propositions optionnelles (non appliquées)

- Proposition optionnelle : intégrer le N5 au `programme.json` comme niveau **hors parcours 150 h** (« spécialisation ») afin de ne pas modifier les totaux existants (150 h / 30 modules / 150 leçons) ; le total catalogue deviendrait 180 h.
- Proposition optionnelle : déposer le N5 comme **certification RS autonome** « Préparer et industrialiser les données pour l'IA générative » (30 h, < 1 500 € compatible plafond CPF RS), en citant RNCP42655 BC03 comme correspondance partielle.
- Proposition optionnelle : prévoir une variante « souveraine » des TP (stockage S3 hébergé en France, Qdrant auto-hébergé) cohérente avec les projets Next (Next RH, Next Bank).
- Proposition optionnelle : ajouter au N5 une leçon bonus « Données pour les agents » (MCP servers d'accès aux entrepôts, requêtes text-to-SQL sécurisées) en lien avec N3 M21.
