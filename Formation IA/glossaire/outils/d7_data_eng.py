# -*- coding: utf-8 -*-
from core import t

# ===================== DATA ENGINEERING (N5) =====================
t("JSONL (JSON Lines)", "DATA", "N3",
  "Format texte où chaque ligne est un objet JSON complet. Il sert à stocker de gros volumes d'enregistrements (logs, jeux d'entraînement, requêtes batch) qu'on peut lire ligne par ligne.",
  "Comme un registre où chaque ligne est une fiche autonome.",
  "Les 2 000 exemples d'un fine-tuning via API sont fournis dans un fichier .jsonl, un exemple par ligne.",
  ["json", "parquet", "batch-api"], [r"JSONL", r"JSON Lines"], "oa_sft", slug="jsonl")
t("Avro, ORC et Arrow", "DATA", "N5",
  "Autres formats de données du big data : Avro (en lignes, avec schéma, très utilisé avec Kafka), ORC (en colonnes, proche de Parquet), Arrow (format en colonnes en mémoire, pour échanger des données très vite entre outils).",
  "Comme différents types de conteneurs : citerne, palette, caisse frigorifique, chacun adapté à un transport.",
  "Les événements de commande transitent en Avro dans Kafka, sont stockés en Parquet, puis lus en Arrow par DuckDB.",
  ["parquet", "apache-kafka", "schema-registry"], [r"Avro", r"=ORC", r"Arrow"], None, slug="avro-orc-arrow")
t("DuckDB", "DATA", "N5",
  "Base de données analytique « embarquée », gratuite, qui s'installe en une ligne et interroge très vite en SQL des fichiers CSV, Parquet ou JSON, sur un simple portable.",
  "Comme un tableur surpuissant qui parle SQL et tient dans la poche.",
  "Un analyste interroge en quelques secondes 50 millions de lignes de ventes en Parquet avec DuckDB, sans serveur.",
  ["sql", "parquet", "polars"], [r"DuckDB", r"MotherDuck"], None, slug="duckdb")
t("Polars", "DATA", "N5",
  "Bibliothèque de manipulation de tableaux de données (comme pandas) écrite en Rust, beaucoup plus rapide et économe en mémoire, avec un mode « paresseux » qui optimise la requête avant de l'exécuter.",
  "Comme un pandas passé au turbo.",
  "Un traitement pandas de 12 minutes sur les relevés de compteurs passe à 40 secondes en Polars.",
  ["pandas", "duckdb"], [r"Polars"], None, slug="polars")
t("CTE et fonctions de fenêtre (SQL)", "DATA", "N5",
  "Deux outils du SQL moderne : la CTE (WITH …) nomme une sous-requête pour rendre une requête lisible ; une fonction de fenêtre (OVER …) calcule sur un groupe de lignes voisines sans les fusionner (cumul, rang, moyenne mobile).",
  "Comme des brouillons nommés (CTE) et une règle glissante posée sur un tableau (fenêtre).",
  "Une requête calcule le chiffre d'affaires cumulé par magasin et par mois avec SUM(...) OVER (PARTITION BY magasin ORDER BY mois).",
  ["sql", "duckdb"], [r"=CTE", r"fonctions? de fenêtre", r"window functions?", r"\bOVER\b", r"QUALIFY"], None, slug="cte-et-fenetres")
t("Schéma en étoile (modélisation dimensionnelle)", "DATA", "N5",
  "Organisation des données analytiques autour d'une table de faits (ventes, mesures) reliée à des tables de dimensions (date, client, produit, magasin). Simple à interroger et à comprendre.",
  "Comme un soleil (les faits) entouré de planètes (les dimensions).",
  "La table « ventes » contient montant et quantité, reliée aux dimensions « produit », « magasin » et « calendrier ».",
  ["data-warehouse", "scd", "data-vault"], [r"(schéma|modèle) en étoile", r"star schema", r"tables? de faits", r"dimensions?"], None, slug="schema-en-etoile")
t("SCD (Slowly Changing Dimension)", "DATA", "N5",
  "Technique pour gérer les attributs qui changent lentement (adresse d'un client, catégorie d'un produit). Le type 2 garde l'historique en créant une nouvelle ligne datée à chaque changement.",
  "Comme un registre d'état civil qui conserve toutes les adresses successives avec leurs dates.",
  "Quand un client déménage de Lyon à Nantes, ses ventes passées restent rattachées à Lyon grâce au SCD type 2.",
  ["schema-en-etoile", "snapshot-dbt"], [r"=SCD", r"slowly changing"], None, slug="scd")
t("Data Vault 2.0", "DATA", "N5",
  "Méthode de modélisation d'entrepôt qui sépare les clés métier (hubs), les relations (links) et les attributs historisés (satellites), pour intégrer de nombreuses sources de façon traçable et évolutive.",
  "Comme une bibliothèque où l'on sépare le catalogue des titres, les liens entre ouvrages et les fiches d'état successives.",
  "Une banque modélise en Data Vault les données clients venues de cinq systèmes historiques.",
  ["schema-en-etoile", "data-warehouse"], [r"Data Vault", r"\bhubs?\b", r"satellites?"], None, slug="data-vault")
t("Architecture médaillon (bronze, silver, gold)", "DATA", "N5",
  "Organisation d'un lakehouse en trois couches : bronze (données brutes telles que reçues), silver (nettoyées et conformées), gold (agrégées, prêtes pour les tableaux de bord et l'IA).",
  "Comme le minerai, le métal raffiné et le bijou fini.",
  "Les PDF bruts d'un RAG sont en bronze, le texte extrait et dédupliqué en silver, les chunks indexés en gold.",
  ["lakehouse", "elt", "pipeline-de-donnees"], [r"médaillon", r"medallion", r"bronze", r"silver", r"\bgold\b"], None, slug="architecture-medaillon")
t("Stockage objet (S3, GCS, MinIO)", "DATA", "N5",
  "Stockage cloud de fichiers (« objets ») quasi illimité et bon marché, accessible par API. C'est la base physique des data lakes et lakehouses.",
  "Comme un garde-meuble infini où chaque carton a une étiquette unique.",
  "Une PME stocke ses archives de factures PDF sur un stockage objet compatible S3 hébergé en France.",
  ["data-lake", "lakehouse"], [r"stockage objet", r"object storage", r"=S3", r"=GCS", r"MinIO"], None, slug="stockage-objet")
t("MapReduce", "DATA", "N5",
  "Modèle de calcul distribué historique (Google, puis Hadoop) : on découpe le travail en tâches « map » réparties sur de nombreuses machines, puis on regroupe les résultats en tâches « reduce ».",
  "Comme faire compter les bulletins de vote par chaque bureau, puis additionner les totaux à la préfecture.",
  "Compter les mots de 10 millions de documents se fait en MapReduce : chaque machine compte sa part, puis on fusionne.",
  ["hadoop", "apache-spark", "shuffle"], [r"MapReduce", r"map ?/ ?reduce"], None, slug="mapreduce")
t("Shuffle (redistribution des données)", "DATA", "N5",
  "Étape coûteuse d'un calcul distribué où les données sont redistribuées entre machines (pour une jointure ou un regroupement). Réduire les shuffles accélère fortement Spark.",
  "Comme redistribuer tout le courrier entre centres de tri avant la tournée.",
  "Une jointure broadcast évite le shuffle quand l'une des deux tables est petite.",
  ["apache-spark", "partitionnement"], [r"shuffle", r"broadcast"], None, slug="shuffle")
t("Dask et Ray", "DATA", "N5",
  "Bibliothèques Python de calcul parallèle et distribué : Dask étend pandas et NumPy à plusieurs cœurs ou machines ; Ray distribue des tâches Python et sert beaucoup en IA (entraînement, embeddings par lots).",
  "Comme engager des renforts quand la cuisine est débordée.",
  "Une équipe calcule les embeddings de 20 millions de passages en quelques heures avec Ray Data.",
  ["apache-spark", "polars"], [r"\bDask\b", r"\bRay\b( Data)?"], None, slug="dask-ray")
t("Outils d'ingestion (Airbyte, Fivetran, dlt)", "DATA", "N5",
  "Outils qui copient automatiquement les données de centaines de sources (CRM, ERP, API, bases) vers un entrepôt ou un lakehouse, avec des connecteurs prêts à l'emploi et des chargements incrémentaux.",
  "Comme des camions de collecte qui passent chez chaque fournisseur selon un circuit établi.",
  "Une start-up synchronise HubSpot, Stripe et sa base PostgreSQL vers DuckDB avec dlt, chaque heure.",
  ["ingestion", "elt", "cdc"], [r"Airbyte", r"Fivetran", r"\bdlt\b"], None, slug="outils-d-ingestion")
t("Chargement incrémental et upsert", "DATA", "N5",
  "Ne traiter que les données nouvelles ou modifiées depuis le dernier passage (incrémental), en insérant les nouvelles lignes et en mettant à jour les existantes (upsert, MERGE).",
  "Comme ne mettre à jour que les pages modifiées d'un classeur au lieu de tout réimprimer.",
  "Chaque nuit, seules les 3 000 commandes modifiées de la veille sont fusionnées dans la table, pas les 20 millions.",
  ["cdc", "idempotence", "dbt"], [r"incrémenta(l|le|ux)", r"upserts?", r"\bMERGE\b"], None, slug="chargement-incremental")
t("Idempotence", "DATA", "N5",
  "Propriété d'un traitement qui donne le même résultat qu'on le lance une ou plusieurs fois. Indispensable pour pouvoir relancer un pipeline en échec sans créer de doublons.",
  "Comme appuyer plusieurs fois sur le bouton d'appel d'un ascenseur : il ne vient qu'une fois.",
  "Relancer l'import des ventes du 3 mars remplace les lignes de ce jour au lieu de les dupliquer.",
  ["chargement-incremental", "backfill", "exactly-once"], [r"idempoten(ce|t|te)"], None, slug="idempotence")
t("Backfill (rattrapage)", "DATA", "N5",
  "Relance d'un pipeline sur une période passée, pour combler des données manquantes ou recalculer l'historique après une correction.",
  "Comme rattraper les cours manqués pendant une absence.",
  "Après correction d'un calcul de marge, l'équipe relance le pipeline sur les 18 derniers mois.",
  ["orchestration", "idempotence"], [r"backfills?", r"rattrapage"], None, slug="backfill")
t("Snapshot et modèle incrémental (dbt)", "DATA", "N5",
  "Dans dbt, un snapshot historise automatiquement les changements d'une table source (comme un SCD type 2) ; un modèle incrémental ne recalcule que les nouvelles lignes.",
  "Comme une photo prise chaque jour d'un tableau pour garder la trace de ses changements.",
  "Un snapshot dbt conserve l'historique des statuts de chaque contrat d'assurance.",
  ["dbt", "scd", "chargement-incremental"], [r"snapshots?", r"modèles? incrémenta"], None, slug="snapshot-dbt")
t("Topic, partition et consumer group (Kafka)", "DATA", "N5",
  "Concepts de Kafka : un topic est un flux nommé de messages ; il est découpé en partitions pour être traité en parallèle ; un consumer group est un ensemble de lecteurs qui se partagent les partitions.",
  "Comme une ligne de métro (topic), ses voies (partitions) et l'équipe de contrôleurs qui se répartit les rames (consumer group).",
  "Le topic « paiements » a 12 partitions lues en parallèle par les 12 instances du service anti-fraude.",
  ["apache-kafka", "partitionnement"], [r"topics?", r"consumer groups?", r"KRaft"], None, slug="kafka-topic")
t("Schema Registry", "DATA", "N5",
  "Service qui stocke et contrôle les schémas des messages échangés dans Kafka, pour qu'un producteur ne puisse pas publier des messages incompatibles avec ce qu'attendent les consommateurs.",
  "Comme un bureau des normes qui vérifie chaque formulaire avant sa diffusion.",
  "Un développeur qui supprime un champ obligatoire voit sa publication refusée par le Schema Registry.",
  ["apache-kafka", "data-contract", "avro-orc-arrow"], [r"Schema Registry", r"registre de schémas"], None, slug="schema-registry")
t("Apache Flink", "DATA", "N5",
  "Moteur open source de traitement de flux en temps réel, avec gestion d'état, fenêtres temporelles et garanties « exactly-once ». Référence pour les calculs continus à grande échelle.",
  "Comme une usine qui transforme les matières premières au fil du tapis, sans jamais s'arrêter.",
  "Une néobanque calcule avec Flink, à la seconde, le montant dépensé par carte sur les 10 dernières minutes.",
  ["streaming-de-donnees", "apache-kafka", "watermark"], [r"Flink"], None, slug="apache-flink")
t("Fenêtre temporelle et watermark (streaming)", "DATA", "N5",
  "En traitement de flux, une fenêtre regroupe les événements d'une période (5 minutes, une session) ; le watermark indique jusqu'à quand on attend les événements en retard avant de clore une fenêtre.",
  "Comme fermer les portes d'un bureau de vote à 20 h, avec une tolérance pour les derniers arrivés dans la file.",
  "Le comptage des passages en caisse par quart d'heure accepte les événements arrivés avec moins de 2 minutes de retard.",
  ["apache-flink", "streaming-de-donnees"], [r"watermarks?", r"fenêtres? (temporelles?|glissantes?|de temps|tumbling)", r"temps d'événement"], None, slug="watermark")
t("Garanties de livraison (at-least-once, exactly-once)", "DATA", "N5",
  "Promesses d'un système de flux sur les messages : « au moins une fois » (pas de perte, doublons possibles), « au plus une fois » (pas de doublon, pertes possibles), « exactement une fois » (ni perte ni doublon).",
  "Comme un recommandé qui peut arriver en double, un courrier simple qui peut se perdre, ou une remise en main propre contre signature.",
  "Un pipeline de facturation exige l'exactly-once pour ne jamais facturer deux fois le même trajet.",
  ["idempotence", "apache-kafka", "apache-flink"], [r"exactly-once", r"at-least-once", r"at-most-once", r"garanties? de livraison"], None, slug="exactly-once")
t("Great Expectations et Soda", "DATA", "N5",
  "Outils open source de tests de qualité des données : on écrit des règles (« le montant est positif », « pas plus de 1 % de valeurs vides ») vérifiées automatiquement à chaque chargement.",
  "Comme un contrôle qualité à la réception des marchandises.",
  "Un test Soda bloque le pipeline quand plus de 2 % des factures du jour n'ont pas de numéro SIRET.",
  ["qualite-des-donnees", "dbt", "data-contract"], [r"Great Expectations", r"=GX", r"\bSoda\b", r"SodaCL"], None, slug="tests-de-qualite-des-donnees")
t("ODCS (Open Data Contract Standard)", "DATA", "N5",
  "Standard ouvert (format YAML) pour écrire des contrats de données lisibles par l'humain et par la machine : schéma, règles de qualité, niveau de service, propriétaires.",
  "Comme un modèle officiel de contrat que tout le monde sait lire.",
  "L'équipe logistique publie le contrat ODCS de sa table « expéditions » avec ses règles de qualité et un SLA de fraîcheur de 2 h.",
  ["data-contract", "schema"], [r"ODCS", r"Open Data Contract"], None, slug="odcs")
t("OpenLineage", "DATA", "N5",
  "Standard ouvert pour collecter automatiquement le lignage des données (quel job a lu quelles tables et produit quelles sorties), exploité par des catalogues comme DataHub ou Marquez.",
  "Comme un traceur GPS posé sur chaque livraison de données.",
  "Grâce à OpenLineage, l'équipe voit immédiatement quels tableaux de bord dépendent d'une table cassée.",
  ["lignage-des-donnees", "catalogue-de-donnees"], [r"OpenLineage", r"DataHub", r"OpenMetadata", r"Unity Catalog"], None, slug="openlineage")
t("Observabilité des données (data observability)", "DATA", "N5",
  "Surveillance continue de la santé des données selon cinq piliers : fraîcheur, volume, schéma, distribution et lignage, avec alertes en cas d'anomalie.",
  "Comme les capteurs d'un réseau d'eau qui alertent sur une baisse de pression ou une eau trouble.",
  "Une alerte prévient l'équipe data que la table des commandes n'a reçu que 10 % du volume habituel ce matin.",
  ["qualite-des-donnees", "monitoring", "lignage-des-donnees"], [r"observabilité (des )?data", r"observabilité des données", r"data observability", r"Elementary", r"5 piliers", r"cinq piliers"], None, slug="observabilite-des-donnees")
t("SLA (accord de niveau de service)", "DATA", "N5",
  "Service Level Agreement : engagement chiffré sur un service, par exemple « les données de ventes sont disponibles chaque jour avant 7 h » ou « disponibilité 99,9 % ».",
  "Comme la garantie de délai d'un transporteur.",
  "Le contrat de données des ventes promet une fraîcheur inférieure à 2 heures pendant les heures d'ouverture.",
  ["data-contract", "observabilite-des-donnees"], [r"=SLA", r"=SLO", r"niveau de service"], None, slug="sla")
t("Time travel (voyage dans le temps)", "DATA", "N5",
  "Fonction des formats de table ouverts et des entrepôts cloud qui permet d'interroger une table telle qu'elle était à une date ou une version passée.",
  "Comme consulter l'édition d'hier d'un journal en ligne.",
  "Après une erreur de chargement, l'équipe restaure la table des stocks telle qu'elle était la veille à minuit.",
  ["format-de-table-ouvert", "lakehouse"], [r"time travel", r"voyage dans le temps"], None, slug="time-travel")
t("Déduplication (MinHash, déduplication sémantique)", "DATA", "N5",
  "Suppression des doublons exacts (par hachage) ou quasi identiques (MinHash/LSH, ou par similarité d'embeddings) dans un corpus. Essentielle pour la qualité des données d'entraînement et des RAG.",
  "Comme retirer d'une pile les photocopies et les brouillons quasi identiques d'un même courrier.",
  "La déduplication retire 35 % des pages d'un corpus web de 2 millions de documents avant le fine-tuning.",
  ["nettoyage-des-donnees", "donnees-d-entrainement", "decontamination"], [r"dédupli(cation|quer)", r"MinHash", r"=LSH", r"doublons?"], None, slug="deduplication")
t("Décontamination (des benchmarks)", "DATA", "N5",
  "Vérification que les questions des benchmarks d'évaluation ne se trouvent pas dans les données d'entraînement, faute de quoi les scores seraient artificiellement gonflés.",
  "Comme s'assurer que le sujet de l'examen n'a pas fuité dans les fiches de révision.",
  "Avant d'affiner un modèle, une équipe retire de son corpus les questions présentes dans son jeu d'évaluation maison.",
  ["deduplication", "benchmark", "data-leakage"], [r"décontamin(ation|er)", r"contamination"], None, slug="decontamination")
t("Presidio", "DATA", "N5",
  "Bibliothèque open source de Microsoft qui détecte et anonymise les données personnelles dans des textes (noms, téléphones, IBAN…), extensible avec des reconnaisseurs propres à la France (NIR, SIRET).",
  "Comme un feutre noir automatique pour documents confidentiels.",
  "Avant d'indexer 50 000 tickets de support, un pipeline masque les IBAN et numéros de sécurité sociale avec Presidio.",
  ["detection-de-donnees-personnelles", "pseudonymisation", "anonymisation"], [r"Presidio"], None, slug="presidio")
t("Extraction de texte (Docling, Trafilatura)", "DATA", "N5",
  "Outils open source qui transforment des documents (PDF, Word, pages web) en texte structuré propre : Docling pour les documents bureautiques et PDF, Trafilatura pour le contenu principal des pages web.",
  "Comme un éplucheur qui ne garde que la chair du fruit.",
  "Une équipe extrait avec Trafilatura le texte de 10 000 pages de son site, sans menus ni publicités, pour son RAG.",
  ["parsing", "ingestion", "ocr"], [r"Docling", r"Trafilatura"], None, slug="extraction-de-texte")
t("Feature store (Feast)", "DATA", "N5",
  "Base qui stocke et sert des caractéristiques calculées (features) de façon cohérente pour l'entraînement et la production, avec une gestion du « point dans le temps » qui évite les fuites de données.",
  "Comme une épicerie centrale où toutes les cuisines s'approvisionnent avec les mêmes ingrédients préparés.",
  "Le score de risque client utilise la feature « nombre de retards sur 90 jours » servie par Feast au moment exact de la demande.",
  ["caracteristique", "data-leakage", "mlops"], [r"feature store", r"Feast", r"point-in-time"], None, slug="feature-store")
t("Versioning de données (DVC, lakeFS)", "DATA", "N5",
  "Outils qui versionnent les jeux de données comme Git versionne le code, pour savoir exactement sur quelles données un modèle a été entraîné et pouvoir revenir en arrière.",
  "Comme les éditions successives d'un annuaire, toutes conservées et datées.",
  "Grâce à DVC, une équipe reproduit à l'identique l'entraînement réalisé six mois plus tôt sur l'ancienne version du corpus.",
  ["mlops", "registre-de-modeles", "lignage-des-donnees"], [r"\bDVC\b", r"lakeFS", r"versionn(ement|ing) (de|des) données"], None, slug="versioning-de-donnees")
t("Prefill et decode (phases d'inférence)", "INF", "N4",
  "Deux phases de la génération d'un LLM : le prefill lit tout le prompt d'un coup (rapide, parallèle, détermine le TTFT) ; le decode génère ensuite les tokens un par un (détermine la vitesse en tokens/s).",
  "Comme lire tout l'énoncé d'un exercice d'un trait, puis écrire la réponse mot à mot.",
  "Un prompt de 50 000 tokens allonge le prefill, donc le temps avant le premier mot, même si la réponse est courte.",
  ["ttft", "kv-cache", "tokens-par-seconde"], [r"prefill", r"pré-?remplissage", r"\bdecode\b", r"décodage"], "cs336", slug="prefill-decode")
