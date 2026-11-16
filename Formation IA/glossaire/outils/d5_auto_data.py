# -*- coding: utf-8 -*-
from core import t

# ===================== AUTOMATISATION =====================
t("Automatisation", "AUTO", "N1",
  "Fait de confier à un logiciel une suite de tâches répétitives qui se déclenchent toutes seules selon des règles (à heure fixe, à la réception d'un e-mail…). Avec l'IA, on peut automatiser aussi des tâches de lecture et de rédaction.",
  "Comme un programmateur de lave-linge : on règle une fois, ça tourne tout seul.",
  "Chaque facture reçue par e-mail est automatiquement enregistrée dans le logiciel comptable et classée dans le bon dossier.",
  ["workflow", "n8n", "make", "zapier"], [r"automatisations?", r"automatiser"], "n8n_first")
t("Workflow (flux de travail)", "AUTO", "N1",
  "Enchaînement d'étapes automatisées reliées entre elles : un déclencheur, puis des actions, conditions et transformations de données.",
  "Comme une recette écrite étape par étape, que la machine suit à la lettre.",
  "Formulaire de contact rempli → résumé par l'IA → fiche créée dans le CRM → message Slack au commercial.",
  ["noeud", "declencheur", "automatisation"], [r"workflows?", r"flux de travail"], "n8n_first", slug="workflow")
t("n8n", "AUTO", "N1",
  "Outil d'automatisation open source (licence fair-code), utilisable en cloud ou auto-hébergé, où l'on construit des workflows en reliant des nœuds, avec des nœuds IA (agents, RAG, MCP) très complets.",
  "Comme une boîte de Lego pour connecter vos applications entre elles, que l'on peut garder chez soi.",
  "Une agence immobilière automatise avec n8n la réponse aux demandes de visite reçues sur trois portails d'annonces.",
  ["workflow", "noeud", "make", "zapier", "auto-hebergement"], [r"n8n"], "n8n_101")
t("Make", "AUTO", "N2",
  "Plateforme d'automatisation en ligne (ex-Integromat) où l'on crée visuellement des « scénarios » composés de modules, avec des modules IA et des agents.",
  "Comme un tableau de bord de trains miniatures où l'on trace visuellement le chemin des données.",
  "Un e-commerçant crée un scénario Make qui génère la description produit dès qu'une fiche est ajoutée dans Shopify.",
  ["scenario-make", "n8n", "zapier"], [r"=Make"], "make", slug="make")
t("Zapier", "AUTO", "N2",
  "Plateforme d'automatisation en ligne très simple d'accès, avec des milliers d'intégrations ; ses automatisations s'appellent des « Zaps ». Elle propose aussi des agents IA.",
  "Comme une multiprise universelle qui relie n'importe quelle application à n'importe quelle autre.",
  "Une consultante indépendante crée un Zap qui ajoute chaque nouveau client Calendly dans Google Sheets et lui envoie un mail de bienvenue.",
  ["zap", "make", "n8n"], [r"Zapier"], "zapier")
t("Zap", "AUTO", "N2",
  "Nom d'une automatisation dans Zapier : un déclencheur suivi d'une ou plusieurs actions.",
  "Comme une règle « quand… alors… » rangée dans un classeur.",
  "Un Zap transforme chaque nouvelle ligne d'un formulaire Typeform en carte Trello.",
  ["zapier", "declencheur"], [r"\bZaps?\b"], "zapier", slug="zap")
t("Scénario (Make)", "AUTO", "N2",
  "Nom d'une automatisation dans Make : un enchaînement visuel de modules qui s'exécute selon une planification ou un déclencheur.",
  "Comme le scénario d'un film : chaque scène s'enchaîne dans un ordre défini.",
  "Un scénario Make récupère chaque matin les avis Google d'un restaurant, les classe par l'IA et prépare les réponses.",
  ["make", "module-make"], [r"scénarios?"], "make", slug="scenario-make")
t("Module (Make)", "AUTO", "N2",
  "Brique d'un scénario Make qui réalise une opération précise : lire une ligne, appeler une IA, envoyer un e-mail. Chaque exécution de module consomme des crédits.",
  "Comme un wagon dans un train : chacun transporte une marchandise précise.",
  "Un module « OpenAI – Create a completion » résume le contenu d'un e-mail entrant.",
  ["scenario-make", "make", "credits-operations"], [r"\bmodules?\b"], "make", slug="module-make")
t("Crédits et opérations (facturation)", "AUTO", "N2",
  "Unité de facturation des outils d'automatisation : Make compte des crédits par module exécuté, Zapier des tâches, n8n des exécutions de workflow. Elle détermine le coût réel d'une automatisation.",
  "Comme les tickets de manège : chaque tour en consomme un.",
  "Un scénario de 8 modules lancé 1 000 fois par mois consomme 8 000 crédits Make : de quoi changer d'offre.",
  ["make", "zapier", "execution"], [r"crédits", r"opérations", r"tâches Zapier", r"par exécution"], "make", slug="credits-operations")
t("Nœud (node)", "AUTO", "N1",
  "Brique élémentaire d'un workflow n8n : chaque nœud fait une chose (recevoir un webhook, lire un Google Sheets, appeler un LLM) et transmet ses données au suivant.",
  "Comme une station dans une chaîne de montage.",
  "Le nœud Gmail récupère l'e-mail, le nœud AI Agent le classe, le nœud Slack prévient l'équipe.",
  ["workflow", "declencheur", "noeud-ai-agent"], [r"nœuds?", r"noeuds?", r"\bnodes?\b"], "n8n_first", slug="noeud")
t("Déclencheur (trigger)", "AUTO", "N1",
  "Premier élément d'un workflow, qui le lance : un horaire (cron), un webhook, un nouvel e-mail, un message dans un chat, un formulaire.",
  "Comme le réveil qui lance la routine du matin.",
  "Le déclencheur « nouvel e-mail dans la boîte factures@ » lance l'automatisation comptable.",
  ["workflow", "webhook", "cron"], [r"déclencheurs?", r"triggers?"], "n8n_first", slug="declencheur")
t("Planification (cron)", "AUTO", "N2",
  "Déclenchement d'une automatisation à heures fixes (tous les lundis à 8 h, chaque nuit à 2 h). « Cron » est le format standard d'écriture de ces horaires.",
  "Comme un minuteur de four programmé à l'avance.",
  "Chaque lundi à 7 h 30, un workflow n8n génère le reporting commercial de la semaine et l'envoie par e-mail.",
  ["declencheur", "workflow", "reporting-automatise"], [r"\bcron\b", r"Schedule Trigger", r"planifi(é|ée|cation)"], "n8n_first", slug="cron")
t("Expression (n8n)", "AUTO", "N2",
  "Petit morceau de code entre doubles accolades {{ }} qui permet, dans n8n, d'insérer dynamiquement une donnée d'un nœud précédent ou de la transformer.",
  "Comme un champ de fusion dans un publipostage.",
  "{{ $json.client.nom }} insère le nom du client dans l'objet de l'e-mail de relance.",
  ["item-n8n", "noeud", "prompt-template"], [r"expressions?", r"\{\{"], "n8n_101", slug="expression-n8n")
t("Item (n8n)", "AUTO", "N2",
  "Unité de donnée qui circule entre les nœuds n8n, au format JSON. Un nœud traite chaque item reçu, un par un ou en lot.",
  "Comme les colis sur un tapis roulant : chaque nœud traite chaque colis qui passe.",
  "Un nœud Google Sheets renvoie 120 items, un par ligne ; le nœud suivant envoie 120 e-mails.",
  ["expression-n8n", "json", "noeud"], [r"\bitems?\b"], "n8n_101", slug="item-n8n")
t("Sous-workflow", "AUTO", "N2",
  "Workflow appelé par un autre workflow, comme une fonction réutilisable. Il évite de dupliquer les mêmes étapes partout.",
  "Comme une sous-traitance standardisée que plusieurs services de l'entreprise utilisent.",
  "Un sous-workflow « normaliser une adresse » est appelé par les workflows de facturation, de livraison et de CRM.",
  ["workflow", "gestion-des-erreurs"], [r"sous-workflows?", r"sub-?workflows?", r"Execute Workflow"], "n8n_103", slug="sous-workflow")
t("Gestion des erreurs (error workflow)", "AUTO", "N2",
  "Ensemble des mécanismes qui prévoient ce qui se passe quand une étape échoue : nouvelle tentative, chemin alternatif, alerte, workflow d'erreur dédié.",
  "Comme le plan d'évacuation et l'alarme incendie d'un bâtiment.",
  "Si l'API du CRM ne répond pas, le workflow réessaie trois fois puis prévient l'administrateur sur Slack via l'Error Trigger.",
  ["backoff", "sous-workflow", "code-de-statut-http"], [r"gestion des erreurs", r"traitement (des|d') erreurs", r"Error Trigger", r"error workflow"], "n8n_103", slug="gestion-des-erreurs")
t("Nœud AI Agent (n8n)", "AUTO", "N2",
  "Nœud racine de n8n qui transforme un workflow en agent : on lui branche un modèle de langage, une mémoire et des outils, et il décide lui-même quels outils appeler.",
  "Comme un poste de pilotage auquel on raccorde un cerveau, un carnet et une boîte à outils.",
  "Un AI Agent relié à Gmail, Google Calendar et une mémoire répond aux demandes de rendez-vous d'un cabinet de kinésithérapie.",
  ["agent-ia", "noeud", "cluster-nodes"], [r"AI Agent", r"nœud agent", r"Tools Agent"], "n8n_agent", slug="noeud-ai-agent")
t("Cluster nodes (n8n)", "AUTO", "N2",
  "Groupes de nœuds n8n où un nœud racine (agent, chaîne, vector store) reçoit des sous-nœuds qui lui fournissent modèle, mémoire, outils ou embeddings.",
  "Comme un robot ménager sur lequel on clipse différents accessoires.",
  "Le nœud racine « Question and Answer Chain » reçoit un sous-nœud modèle Mistral et un sous-nœud retriever Qdrant.",
  ["noeud-ai-agent", "noeud"], [r"cluster nodes?", r"sous-nœuds?", r"nœuds? racines?", r"root nodes?"], "n8n_cluster", slug="cluster-nodes")
t("Chat Trigger (n8n)", "AUTO", "N2",
  "Déclencheur n8n qui ouvre une fenêtre de chat (intégrable sur un site) : chaque message envoyé lance le workflow, souvent un agent IA.",
  "Comme une sonnette de comptoir qui appelle l'agent à chaque client.",
  "Le site d'un camping intègre le Chat Trigger de n8n pour répondre aux questions sur les emplacements.",
  ["declencheur", "noeud-ai-agent"], [r"Chat Trigger", r"When chat message received"], "n8n_chat", slug="chat-trigger")
t("HTTP Request (nœud)", "AUTO", "N2",
  "Nœud universel de n8n (et module équivalent dans Make) qui appelle n'importe quelle API, même sans intégration toute faite.",
  "Comme un téléphone qui peut appeler n'importe quel numéro, même absent de l'annuaire.",
  "Un nœud HTTP Request interroge l'API Sirene de l'Insee pour compléter la fiche d'un nouveau client.",
  ["requete-http", "api", "noeud"], [r"HTTP Request"], "n8n_102", slug="http-request")
t("Identifiants (credentials)", "AUTO", "N2",
  "Clés API, jetons OAuth ou mots de passe enregistrés de façon chiffrée dans l'outil d'automatisation pour se connecter aux services, sans les écrire dans le workflow.",
  "Comme le trousseau de clés confié au gardien plutôt que laissé sur les portes.",
  "Une agence crée un identifiant Google par client dans n8n pour ne jamais mélanger les comptes.",
  ["cle-api", "gestion-des-secrets", "oauth"], [r"credentials?", r"identifiants?"], "n8n_102", slug="credentials")
t("Intégration (connecteur)", "AUTO", "N2",
  "Module prêt à l'emploi qui relie un outil d'automatisation à une application précise (Gmail, Salesforce, Pennylane) sans coder d'appel d'API.",
  "Comme un adaptateur spécifique fourni avec un appareil.",
  "L'intégration Google Sheets de n8n permet de lire et d'écrire des lignes en deux clics.",
  ["http-request", "api", "ipaas"], [r"intégrations?", r"connecteurs?"], "n8n_102", slug="integration")
t("iPaaS", "AUTO", "N2",
  "Integration Platform as a Service : plateforme en ligne qui sert à relier les applications d'une entreprise entre elles. n8n cloud, Make et Zapier en sont des exemples grand public.",
  "Comme un central téléphonique pour logiciels.",
  "Un groupe de distribution choisit un iPaaS pour synchroniser son ERP, son CRM et sa boutique en ligne.",
  ["integration", "n8n", "make"], [r"iPaaS"], None, slug="ipaas")
t("RPA (Robotic Process Automation)", "AUTO", "N2",
  "Automatisation qui imite les clics et saisies d'un humain sur des écrans de logiciels, utile pour les vieux outils sans API. L'IA (computer use) la rend plus souple.",
  "Comme un robot qui tape au clavier à votre place en suivant une procédure.",
  "Un service RH automatise la saisie des absences dans un vieux logiciel de paie sans API grâce à un robot RPA.",
  ["computer-use", "automatisation"], [r"=RPA"], None, slug="rpa")
t("No-code et low-code", "AUTO", "N1",
  "Outils qui permettent de créer applications et automatisations par glisser-déposer (no-code), ou avec très peu de code (low-code), sans être développeur.",
  "Comme monter un meuble en kit plutôt que de le fabriquer en menuiserie.",
  "Une responsable administrative d'une PME crée seule son automatisation de notes de frais avec Make.",
  ["n8n", "make", "app-builder"], [r"no-?code", r"low-?code", r"sans code"], "n8n_101", slug="no-code")
t("Template (modèle de workflow)", "AUTO", "N2",
  "Workflow tout prêt, partagé par l'éditeur ou la communauté, que l'on importe puis adapte à son besoin.",
  "Comme un patron de couture qu'on ajuste à sa taille.",
  "Un formateur importe le template « résumé d'e-mails par l'IA » de n8n et le connecte à la boîte de son organisme.",
  ["workflow", "n8n"], [r"templates?"], "n8n_tpl", slug="template")
t("Data Tables (n8n)", "AUTO", "N2",
  "Petites tables de données stockées directement dans n8n, pour garder un état entre les exécutions (liste de clients traités, compteur) sans base externe.",
  "Comme un carnet de bord rangé dans la boîte à gants.",
  "Un workflow note dans une Data Table les factures déjà relancées pour ne pas relancer deux fois.",
  ["n8n", "base-de-donnees-relationnelle"], [r"Data Tables?"], "n8n_dt", slug="data-tables")
t("Exécution (d'un workflow)", "AUTO", "N2",
  "Un lancement complet d'un workflow, du déclencheur à la dernière étape, avec ses données et son statut (succès, échec). L'historique des exécutions sert au débogage.",
  "Comme une tournée de facteur : chaque matin, une nouvelle tournée consignée.",
  "En ouvrant l'exécution qui a échoué, on voit que le nœud CRM a reçu un champ « email » vide.",
  ["workflow", "gestion-des-erreurs", "credits-operations"], [r"exécutions?", r"executions?"], "n8n_101", slug="execution")
t("Auto-hébergement (self-hosting)", "AUTO", "N2",
  "Fait d'installer un logiciel (n8n, Open WebUI, Langfuse) sur son propre serveur ou VPS plutôt que d'utiliser la version en ligne de l'éditeur. On gagne en maîtrise et en coût, on assume la sécurité et les mises à jour.",
  "Comme être propriétaire plutôt que locataire : plus de liberté, plus de responsabilités.",
  "Un cabinet comptable auto-héberge n8n sur un VPS en France pour garder la maîtrise des données de ses clients.",
  ["docker", "on-premise", "n8n"], [r"auto-?hébergé?e?", r"auto-?héberger", r"auto-?hébergement", r"self-?host"], "n8n_host", slug="auto-hebergement")
t("Queue mode (n8n)", "AUTO", "N2",
  "Mode d'installation de n8n où les exécutions sont placées dans une file d'attente (Redis) et traitées par plusieurs « workers », pour supporter de gros volumes.",
  "Comme ouvrir plusieurs caisses au supermarché les jours d'affluence.",
  "Une plateforme qui traite 50 000 webhooks par jour passe n8n en queue mode avec quatre workers.",
  ["file-d-attente", "auto-hebergement"], [r"queue mode", r"mode file", r"workers?", r"Redis"], "n8n_scale", slug="queue-mode")
t("Reporting automatisé", "AUTO", "N2",
  "Production automatique et régulière de rapports (chiffres, graphiques, commentaires rédigés par l'IA) envoyés aux bonnes personnes sans intervention.",
  "Comme un journal livré chaque matin dans la boîte aux lettres.",
  "Chaque lundi, le directeur d'un réseau de pharmacies reçoit les ventes de la semaine commentées par l'IA.",
  ["cron", "tableau-de-bord", "workflow"], [r"reporting", r"rapports? (hebdomadaires?|automatis)"], "n8n_first", slug="reporting-automatise")

# ===================== DATA ET DATA ENGINEERING =====================
t("Donnée", "DATA", "N1",
  "Information enregistrée (un chiffre, un texte, une image, une date) qu'un logiciel peut stocker et traiter. C'est la matière première de l'IA.",
  "Comme les ingrédients d'une cuisine : sans eux, pas de plat.",
  "Le montant, la date et le client d'une facture sont trois données exploitables par un tableau de bord.",
  ["donnees-structurees", "jeu-de-donnees"], [r"\bdonnées\b"], "mlcc", slug="donnee")
t("Données structurées et non structurées", "DATA", "N1",
  "Les données structurées sont rangées en lignes et colonnes (tableur, base) ; les non structurées sont des textes libres, e-mails, PDF, images, sons. Les LLM ont rendu les secondes enfin exploitables.",
  "Comme un fichier client bien rempli face à une boîte à chaussures pleine de courriers.",
  "Un assureur exploite ses tableaux de sinistres (structurés) et, grâce à l'IA, les comptes rendus d'experts (non structurés).",
  ["donnee", "base-de-donnees-relationnelle", "data-lake"], [r"(non )?structurées?", r"unstructured"], "mlcc", slug="donnees-structurees")
t("Jeu de données (dataset)", "DATA", "N2",
  "Ensemble organisé de données sur un sujet, prêt à être analysé ou à servir à l'entraînement d'un modèle.",
  "Comme un album photo trié et légendé plutôt qu'un tas de clichés en vrac.",
  "Une collectivité publie sur data.gouv.fr le jeu de données des consommations d'eau de ses bâtiments.",
  ["donnee", "donnees-d-entrainement", "open-data"], [r"jeux? de données", r"datasets?"], "mlcc", slug="jeu-de-donnees")
t("CSV", "DATA", "N2",
  "Comma-Separated Values : format texte très simple de tableau, une ligne par enregistrement et des valeurs séparées par des virgules ou points-virgules. Universel pour échanger des données.",
  "Comme un tableau recopié à la main sur une feuille, colonnes séparées par des traits.",
  "Un comptable exporte le grand livre en CSV et le fait analyser par Claude pour repérer les écritures inhabituelles.",
  ["parquet", "pandas", "donnees-structurees"], [r"=CSV"], "mlcc", slug="csv")
t("SQL", "DATA", "N2",
  "Structured Query Language : langage standard pour interroger et modifier une base de données relationnelle (« donne-moi le chiffre d'affaires par région en 2026 »).",
  "Comme la langue officielle pour parler aux archivistes des bases de données.",
  "SELECT region, SUM(montant) FROM ventes WHERE annee = 2026 GROUP BY region;",
  ["text-to-sql", "base-de-donnees-relationnelle"], [r"=SQL"], None, slug="sql")
t("Text-to-SQL (SQL en langage naturel)", "DATA", "N2",
  "Usage où un LLM traduit une question en français en requête SQL, l'exécute sur la base et commente le résultat. Pratique, mais la requête doit être vérifiée et l'accès limité en lecture.",
  "Comme un interprète entre le directeur commercial et l'archiviste.",
  "Un directeur d'agence demande « quels clients n'ont rien commandé depuis six mois ? » et obtient la liste sans connaître SQL.",
  ["sql", "moindre-privilege"], [r"text-to-SQL", r"SQL en langage naturel", r"langage naturel"], None, slug="text-to-sql")
t("Base de données relationnelle", "DATA", "N2",
  "Base qui range les données dans des tables liées entre elles (clients, commandes, produits) et s'interroge en SQL. PostgreSQL, MySQL et SQL Server sont les plus connues.",
  "Comme un classeur de fiches reliées par des renvois : la fiche commande renvoie à la fiche client.",
  "Le logiciel de caisse d'une chaîne de boulangeries stocke ventes et produits dans PostgreSQL.",
  ["sql", "schema", "nosql"], [r"bases? de données relationnelles?", r"PostgreSQL", r"MySQL", r"tables?"], None, slug="base-de-donnees-relationnelle")
t("NoSQL", "DATA", "N3",
  "Famille de bases de données qui ne reposent pas sur des tables relationnelles : documents (MongoDB), clé-valeur (Redis), graphes, colonnes. Plus souples pour certaines données.",
  "Comme ranger ses affaires dans des boîtes étiquetées plutôt que dans un meuble à tiroirs identiques.",
  "Une application mobile stocke les profils utilisateurs, très variables, dans une base documentaire MongoDB.",
  ["base-de-donnees-relationnelle", "base-vectorielle"], [r"NoSQL", r"MongoDB"], None, slug="nosql")
t("Schéma (de données)", "DATA", "N3",
  "Description de la structure des données : noms des tables et colonnes, types (texte, nombre, date), contraintes. Il sert de contrat entre producteurs et utilisateurs des données.",
  "Comme le plan d'un meuble de rangement : combien de tiroirs, et ce que chacun doit contenir.",
  "Le schéma de la table « factures » impose une date d'émission et un montant positif.",
  ["json-schema", "data-contract", "base-de-donnees-relationnelle"], [r"schémas?", r"schemas?"], None, slug="schema")
t("Big data", "DATA", "N2",
  "Données si volumineuses, rapides ou variées qu'elles dépassent les outils classiques (un tableur, un seul serveur) et demandent des technologies distribuées. On le résume souvent par les « 3 V » : volume, vitesse, variété.",
  "Comme passer de la cuisine familiale à la cuisine centrale d'un aéroport.",
  "Un opérateur télécom analyse chaque jour des milliards d'événements réseau pour détecter les pannes.",
  ["apache-spark", "data-lake", "trois-v"], [r"big data", r"mégadonnées"], None, slug="big-data")
t("Les 3 V (volume, vélocité, variété)", "DATA", "N2",
  "Grille classique pour caractériser le big data : volume (quantité), vélocité (vitesse d'arrivée), variété (diversité des formats). On ajoute parfois véracité et valeur.",
  "Comme décrire une rivière par sa taille, son débit et ce qu'elle charrie.",
  "Les capteurs d'une usine produisent un gros volume, à haute vélocité, dans une grande variété de formats.",
  ["big-data"], [r"3 ?V", r"vélocité", r"variété"], None, slug="trois-v")
t("Entrepôt de données (data warehouse)", "DATA", "N2",
  "Base centralisée qui rassemble des données nettoyées et structurées venues de plusieurs logiciels (ERP, CRM, caisse) pour l'analyse et le reporting. BigQuery, Snowflake, Redshift en sont des versions cloud.",
  "Comme les archives centrales d'une entreprise, classées et indexées pour être consultées.",
  "Un réseau de franchises consolide les ventes de ses 120 magasins dans un entrepôt pour un tableau de bord unique.",
  ["data-lake", "lakehouse", "etl", "bi"], [r"entrepôts? de données", r"data warehouses?", r"BigQuery", r"Snowflake"], None, slug="data-warehouse")
t("Data lake (lac de données)", "DATA", "N3",
  "Grand espace de stockage bon marché où l'on dépose toutes sortes de données brutes (fichiers, logs, images) dans leur format d'origine, pour les exploiter plus tard.",
  "Comme un grand grenier où l'on entrepose tout, en espérant le ranger un jour.",
  "Un constructeur dépose dans son data lake les relevés bruts de milliers de capteurs de véhicules.",
  ["data-warehouse", "lakehouse", "parquet"], [r"data lakes?", r"lacs? de données"], None, slug="data-lake")
t("Lakehouse", "DATA", "N3",
  "Architecture qui combine la souplesse et le faible coût du data lake avec la fiabilité et les performances d'un entrepôt, grâce à des formats de tables ouverts (Delta Lake, Iceberg) posés sur des fichiers Parquet.",
  "Comme un grenier aménagé en archives : on y stocke tout, mais avec un vrai classement.",
  "Une banque migre vers un lakehouse pour faire tourner au même endroit ses rapports réglementaires et ses modèles d'IA.",
  ["data-lake", "data-warehouse", "format-de-table-ouvert", "parquet"], [r"lakehouse"], None, slug="lakehouse")
t("Format de table ouvert (Delta Lake, Apache Iceberg)", "DATA", "N3",
  "Couche qui transforme un ensemble de fichiers Parquet en véritable table : transactions fiables, historique des versions, modification du schéma.",
  "Comme le registre qui tient à jour l'inventaire d'un entrepôt de cartons.",
  "Grâce à Iceberg, un analyste peut interroger les ventes « telles qu'elles étaient au 31 décembre » pour un audit.",
  ["lakehouse", "parquet"], [r"Delta Lake", r"Iceberg", r"Apache Hudi"], None, slug="format-de-table-ouvert")
t("Parquet", "DATA", "N3",
  "Format de fichier en colonnes, compressé et typé, standard du big data et des lakehouses. Lire une seule colonne y est très rapide.",
  "Comme une bibliothèque rangée par sujet plutôt que par date d'achat : on va directement au bon rayon.",
  "Un fichier de 10 Go en CSV ne pèse plus que 1,5 Go en Parquet et s'interroge dix fois plus vite.",
  ["stockage-en-colonnes", "csv", "lakehouse"], [r"Parquet"], None, slug="parquet")
t("Stockage en colonnes (columnar)", "DATA", "N3",
  "Façon de stocker les données colonne par colonne plutôt que ligne par ligne, idéale pour les calculs analytiques (sommes, moyennes) sur de gros volumes.",
  "Comme ranger toutes les fourchettes ensemble et tous les couteaux ensemble, plutôt que des couverts complets.",
  "Calculer le chiffre d'affaires total ne lit que la colonne « montant », pas les 40 autres colonnes.",
  ["parquet", "data-warehouse"], [r"en colonnes", r"colonnaires?", r"columnar"], None, slug="stockage-en-colonnes")
t("ETL (Extract, Transform, Load)", "DATA", "N2",
  "Processus classique d'intégration de données : on extrait les données des sources, on les transforme (nettoyage, calculs) puis on les charge dans l'entrepôt.",
  "Comme récolter, laver et éplucher les légumes avant de les ranger au frigo.",
  "Chaque nuit, un ETL extrait les ventes de la caisse, convertit les devises et charge le résultat dans l'entrepôt.",
  ["elt", "pipeline-de-donnees", "data-warehouse"], [r"=ETL"], None, slug="etl")
t("ELT (Extract, Load, Transform)", "DATA", "N3",
  "Variante moderne de l'ETL : on charge d'abord les données brutes dans l'entrepôt ou le lakehouse, puis on les transforme sur place avec sa puissance de calcul (souvent avec dbt).",
  "Comme ranger les courses au frigo d'abord et cuisiner ensuite, selon les besoins.",
  "Une start-up charge ses données Stripe brutes dans BigQuery puis les transforme en tables propres avec dbt.",
  ["etl", "dbt", "data-warehouse"], [r"=ELT"], None, slug="elt")
t("Pipeline de données", "DATA", "N2",
  "Chaîne automatisée qui fait circuler les données d'une source vers une destination en passant par des étapes de traitement (extraction, nettoyage, enrichissement, chargement).",
  "Comme un réseau de canalisations avec ses filtres et ses stations de traitement.",
  "Le pipeline d'un e-commerçant récupère les commandes, les enrichit avec la météo et alimente le modèle de prévision.",
  ["etl", "orchestration", "ingestion"], [r"pipelines? de données", r"data pipelines?", r"pipelines?"], None, slug="pipeline-de-donnees")
t("Orchestration (Airflow, Dagster, Prefect)", "DATA", "N3",
  "Pilotage automatique de l'ordre, du calendrier et des dépendances des tâches d'un pipeline de données (« ne lance le calcul des marges que quand les ventes sont chargées »), avec relance en cas d'échec.",
  "Comme un chef d'orchestre qui fait entrer chaque instrument au bon moment.",
  "Airflow lance à 2 h l'import des ventes, à 3 h les transformations dbt, à 4 h l'envoi du rapport, et alerte en cas d'échec.",
  ["dag", "pipeline-de-donnees", "dbt"], [r"Airflow", r"Dagster", r"Prefect", r"orchestrat(ion|eur) de données"], None, slug="orchestration")
t("DAG (graphe orienté acyclique)", "DATA", "N3",
  "Directed Acyclic Graph : représentation d'un ensemble de tâches et de leurs dépendances, sans boucle, utilisée par les orchestrateurs pour savoir dans quel ordre tout exécuter.",
  "Comme le planning d'un chantier : les fondations avant les murs, les murs avant le toit.",
  "Le DAG du pipeline financier impose que la table « factures » soit à jour avant le calcul de la trésorerie.",
  ["orchestration", "pipeline-de-donnees"], [r"=DAG"], None, slug="dag")
t("dbt (data build tool)", "DATA", "N3",
  "Outil open source qui permet d'écrire les transformations de données en SQL versionné, testé et documenté, directement dans l'entrepôt. Pilier de l'approche ELT.",
  "Comme un livre de recettes versionné et testé pour la cuisine de l'entrepôt de données.",
  "L'équipe data d'une mutuelle définit en dbt la table « adhérents actifs » avec des tests d'unicité et de non-nullité.",
  ["elt", "sql", "qualite-des-donnees"], [r"\bdbt\b"], None, slug="dbt")
t("Apache Spark", "DATA", "N3",
  "Moteur open source de calcul distribué qui traite de très gros volumes de données en les répartissant sur un grand nombre de machines, en SQL, Python (PySpark) ou Scala.",
  "Comme répartir le tri d'une montagne de courrier entre cent postiers au lieu d'un seul.",
  "Un opérateur d'énergie calcule avec Spark la consommation horaire de 30 millions de compteurs.",
  ["big-data", "lakehouse", "parquet"], [r"(?<!DGX )(?<!Muse )Spark(?! Open)", r"PySpark", r"Databricks"], None, slug="apache-spark")
t("Apache Kafka", "DATA", "N3",
  "Plateforme open source de diffusion d'événements en temps réel : les applications y publient des messages (une commande, un clic, un relevé de capteur) que d'autres consomment au fil de l'eau.",
  "Comme un tapis roulant géant et enregistré sur lequel chaque service dépose et prend des colis.",
  "Chaque paiement d'une néobanque est publié dans Kafka et lu en temps réel par l'anti-fraude, la comptabilité et les notifications.",
  ["streaming-de-donnees", "cdc"], [r"Kafka"], None, slug="apache-kafka")
t("Streaming de données (temps réel)", "DATA", "N3",
  "Traitement des données au fil de l'eau, dès leur arrivée, plutôt que par paquets périodiques. Indispensable pour la détection de fraude ou le suivi de capteurs.",
  "Comme un fleuve que l'on surveille en continu plutôt qu'un réservoir vidé une fois par jour.",
  "Un transporteur suit en temps réel la position de ses camions et prévient les clients des retards.",
  ["apache-kafka", "traitement-par-lots"], [r"streaming de données", r"traitement en flux", r"temps réel", r"flux d'événements", r"event streaming", r"Structured Streaming", r"Flink"], None, slug="streaming-de-donnees")
t("Traitement par lots (batch processing)", "DATA", "N2",
  "Traitement des données par paquets, à intervalles réguliers (chaque nuit, chaque heure), plutôt qu'en continu. Plus simple et moins cher quand le temps réel n'est pas nécessaire.",
  "Comme faire la vaisselle une fois le soir plutôt qu'après chaque assiette.",
  "La paie de 2 000 salariés est calculée en lot chaque fin de mois.",
  ["streaming-de-donnees", "batch-api", "etl"], [r"traitements? par lots", r"batch processing", r"par lots"], None, slug="traitement-par-lots")
t("CDC (Change Data Capture)", "DATA", "N3",
  "Capture des changements de données : technique qui détecte chaque insertion, modification ou suppression dans une base source et la transmet en continu vers d'autres systèmes, sans recopier toute la base.",
  "Comme un huissier qui note chaque modification du registre au lieu de photocopier le registre entier chaque soir.",
  "Avec Debezium et Kafka, chaque changement d'adresse client dans l'ERP arrive en quelques secondes dans le CRM.",
  ["apache-kafka", "etl", "streaming-de-donnees"], [r"=CDC", r"change data capture", r"Debezium"], None, slug="cdc")
t("Data contract (contrat de données)", "DATA", "N3",
  "Accord formalisé entre l'équipe qui produit des données et celles qui les utilisent : schéma, signification des champs, qualité garantie, fréquence de mise à jour et responsable. Il évite qu'un changement casse les usages en aval.",
  "Comme un cahier des charges signé entre un fournisseur et son client.",
  "L'équipe e-commerce s'engage par contrat de données à ne jamais renommer la colonne « order_id » sans préavis d'un mois.",
  ["schema", "qualite-des-donnees", "gouvernance-des-donnees"], [r"data contracts?", r"contrats? de données"], None, slug="data-contract")
t("Qualité des données", "DATA", "N2",
  "Mesure de la fiabilité des données : exactitude, complétude, cohérence, fraîcheur, absence de doublons. Une IA nourrie de données de mauvaise qualité produit des résultats de mauvaise qualité.",
  "Comme la fraîcheur des produits d'un restaurant : rien ne rattrape un ingrédient avarié.",
  "Un audit révèle que 12 % des fiches clients d'une PME ont un e-mail invalide, ce qui fausse la campagne de relance.",
  ["nettoyage-des-donnees", "data-contract", "gouvernance-des-donnees"], [r"qualité des données", r"data quality"], "cnil_reco", slug="qualite-des-donnees")
t("Nettoyage des données", "DATA", "N2",
  "Préparation des données avant analyse : corriger les erreurs, supprimer les doublons, harmoniser les formats (dates, majuscules), traiter les valeurs manquantes.",
  "Comme trier et laver les légumes avant de cuisiner.",
  "Avant l'analyse, on unifie « Paris », « PARIS » et « paris 75 » dans la colonne ville d'un fichier de prospects.",
  ["qualite-des-donnees", "valeurs-manquantes", "valeur-aberrante"], [r"nettoy(age|er)", r"data cleaning"], None, slug="nettoyage-des-donnees")
t("Valeurs manquantes", "DATA", "N2",
  "Cases vides d'un jeu de données. Il faut décider de les ignorer, de les compléter (moyenne, valeur la plus fréquente) ou de supprimer les lignes concernées, en connaissant l'effet sur les résultats.",
  "Comme les pages arrachées d'un carnet de comptes.",
  "30 % des fiches produits n'ont pas de poids renseigné : impossible de calculer correctement les frais de port moyens.",
  ["nettoyage-des-donnees", "qualite-des-donnees"], [r"valeurs? manquantes?", r"missing values?", r"\bNaN\b"], None, slug="valeurs-manquantes")
t("Valeur aberrante (outlier)", "DATA", "N2",
  "Valeur très éloignée des autres dans un jeu de données, due à une erreur de saisie ou à un cas réellement exceptionnel. À examiner avant de l'écarter.",
  "Comme un client qui mesurerait 4 mètres dans un fichier de tailles.",
  "Une note de frais de 45 000 € au lieu de 450 € est repérée comme aberrante par l'analyse.",
  ["nettoyage-des-donnees", "detection-d-anomalies"], [r"valeurs? aberrantes?", r"outliers?"], None, slug="valeur-aberrante")
t("Détection d'anomalies", "DATA", "N2",
  "Repérage automatique de comportements inhabituels dans des données (transaction suspecte, pic de consommation, panne naissante).",
  "Comme un vigile qui remarque immédiatement la personne qui ne se comporte pas comme les autres.",
  "Un cabinet comptable détecte automatiquement les écritures passées un dimanche à 3 h du matin.",
  ["valeur-aberrante", "autoencodeur"], [r"anomalies?"], None, slug="detection-d-anomalies")
t("Gouvernance des données", "DATA", "N3",
  "Organisation, règles et responsabilités qui encadrent les données d'une entreprise : qui en est propriétaire, qui y accède, comment on garantit leur qualité, leur sécurité et leur conformité (RGPD).",
  "Comme le règlement de copropriété d'un immeuble de données.",
  "Une mutuelle nomme un responsable par domaine de données (adhérents, prestations) et définit qui peut les envoyer à une IA.",
  ["catalogue-de-donnees", "data-contract", "rgpd"], [r"gouvernance (des|de la) données", r"data governance"], "cnil_reco", slug="gouvernance-des-donnees")
t("Catalogue de données", "DATA", "N3",
  "Inventaire consultable de toutes les données disponibles dans l'organisation, avec leur description, leur propriétaire, leur qualité et leur origine.",
  "Comme le catalogue d'une médiathèque.",
  "Un analyste cherche « chiffre d'affaires net » dans le catalogue et découvre quelle table officielle utiliser.",
  ["gouvernance-des-donnees", "lignage-des-donnees", "metadonnees"], [r"catalogues? de données", r"data catalog"], None, slug="catalogue-de-donnees")
t("Lignage des données (data lineage)", "DATA", "N3",
  "Traçabilité du parcours d'une donnée : d'où elle vient, quelles transformations elle a subies, où elle est utilisée. Indispensable pour auditer un chiffre ou un modèle.",
  "Comme la traçabilité d'un steak de la ferme à l'assiette.",
  "Un contrôleur de gestion retrouve, grâce au lignage, que la marge affichée provient d'une table mal mise à jour.",
  ["catalogue-de-donnees", "gouvernance-des-donnees"], [r"lignage", r"lineage", r"traçabilité des données"], None, slug="lignage-des-donnees")
t("Data mesh", "DATA", "N3",
  "Organisation où chaque domaine métier (ventes, logistique, RH) est responsable de ses propres données, publiées comme des « produits de données » documentés pour les autres équipes.",
  "Comme un marché où chaque producteur vend ses produits étiquetés, plutôt qu'une centrale d'achat unique.",
  "Dans un groupe de distribution, l'équipe logistique publie le produit de données « délais de livraison » utilisé par le service client.",
  ["data-contract", "gouvernance-des-donnees"], [r"data mesh", r"produits? de données"], None, slug="data-mesh")
t("Hadoop (HDFS)", "DATA", "N3",
  "Écosystème open source historique du big data (années 2010) qui stocke et traite des fichiers géants répartis sur de nombreux serveurs. Largement remplacé par Spark et les lakehouses cloud.",
  "Comme les premiers grands entrepôts automatisés, aujourd'hui supplantés par des modèles plus modernes.",
  "Une banque migre ses anciens clusters Hadoop vers un lakehouse cloud.",
  ["big-data", "apache-spark", "data-lake"], [r"Hadoop", r"HDFS"], None, slug="hadoop")
t("Partitionnement", "DATA", "N3",
  "Découpage d'une grande table en morceaux selon une colonne (date, région) pour ne lire que la partie utile lors d'une requête.",
  "Comme ranger ses factures dans un classeur par mois.",
  "Une table de 5 milliards de ventes partitionnée par jour permet d'analyser une semaine en quelques secondes.",
  ["parquet", "lakehouse"], [r"partitionn(ement|ée|er)", r"partitions?"], None, slug="partitionnement")
t("BI (Business Intelligence, informatique décisionnelle)", "DATA", "N2",
  "Ensemble d'outils et de méthodes pour transformer les données en tableaux de bord, rapports et indicateurs d'aide à la décision (Power BI, Looker Studio, Metabase, Tableau).",
  "Comme le tableau de bord d'une voiture pour piloter l'entreprise.",
  "La directrice d'une chaîne de salles de sport suit dans Power BI la fréquentation et le chiffre d'affaires par club.",
  ["tableau-de-bord", "kpi", "data-warehouse"], [r"=BI\b", r"Business Intelligence", r"Power BI", r"Looker", r"Metabase", r"décisionnel"], None, slug="bi")
t("Tableau de bord (dashboard)", "DATA", "N2",
  "Écran qui rassemble les indicateurs clés d'une activité sous forme de graphiques et de chiffres mis à jour automatiquement.",
  "Comme le tableau de bord d'un avion : toutes les informations vitales d'un coup d'œil.",
  "Un responsable de flotte suit sur un tableau de bord la consommation, les pannes et les kilomètres de ses 80 véhicules.",
  ["kpi", "bi", "visualisation-de-donnees"], [r"tableaux? de bord", r"dashboards?"], None, slug="tableau-de-bord")
t("KPI (indicateur clé de performance)", "DATA", "N2",
  "Key Performance Indicator : chiffre choisi pour suivre l'atteinte d'un objectif (taux de transformation, délai moyen de réponse, marge).",
  "Comme le compteur de vitesse et la jauge d'essence : quelques chiffres qui disent si tout va bien.",
  "Le service client suit trois KPI : délai de première réponse, taux de résolution, satisfaction.",
  ["tableau-de-bord", "bi"], [r"KPIs?", r"indicateurs? clés?"], None, slug="kpi")
t("Visualisation de données (dataviz)", "DATA", "N2",
  "Représentation graphique des données (courbes, barres, cartes) pour les rendre compréhensibles d'un coup d'œil et en tirer des décisions.",
  "Comme une carte routière face à une liste de coordonnées GPS.",
  "Claude transforme un export CSV des ventes en graphique mensuel par région prêt à coller dans une présentation.",
  ["tableau-de-bord", "pandas"], [r"visualisations?", r"dataviz", r"graphiques?"], None, slug="visualisation-de-donnees")
t("pandas", "DATA", "N3",
  "Bibliothèque Python de référence pour manipuler des tableaux de données (lire un CSV ou un Excel, filtrer, regrouper, calculer). L'IA l'utilise souvent quand elle « analyse un fichier ».",
  "Comme un tableur surpuissant piloté par du code.",
  "Quand on dépose un Excel dans ChatGPT, l'assistant écrit et exécute du code pandas pour calculer les totaux.",
  ["csv", "python", "notebook"], [r"pandas", r"DataFrame"], None, slug="pandas")
t("Notebook (Jupyter, Colab)", "DATA", "N3",
  "Document interactif qui mélange code, résultats, graphiques et texte explicatif, idéal pour explorer des données et partager une analyse.",
  "Comme un cahier de laboratoire où l'on note l'expérience et son résultat juste en dessous.",
  "Un apprenant entraîne son premier modèle scikit-learn dans un notebook Google Colab gratuit.",
  ["pandas", "python", "kaggle"], [r"notebooks?", r"Jupyter", r"Colab"], None, slug="notebook")
t("Open data (données ouvertes)", "DATA", "N2",
  "Données publiées librement, souvent par les administrations, réutilisables par tous sous une licence ouverte (data.gouv.fr, INSEE, API Sirene).",
  "Comme une bibliothèque municipale gratuite et ouverte à tous.",
  "Une start-up croise les données ouvertes DVF (valeurs foncières) avec ses propres données pour estimer des biens immobiliers.",
  ["jeu-de-donnees", "api"], [r"open data", r"données ouvertes", r"data\.gouv"], None, slug="open-data")
t("Data engineer, data analyst, data scientist", "DATA", "N2",
  "Trois métiers de la donnée : le data engineer construit les pipelines et les bases ; le data analyst produit analyses et tableaux de bord ; le data scientist crée des modèles prédictifs.",
  "Comme, dans un restaurant, le fournisseur et le magasinier, le maître d'hôtel qui conseille, et le chef qui invente les recettes.",
  "Une ETI recrute un data engineer pour fiabiliser ses flux avant de recruter un data scientist pour la prévision.",
  ["pipeline-de-donnees", "bi", "machine-learning"], [r"data engineers?", r"data analysts?", r"data scientists?", r"ingénieurs? (de )?données"], "francetravail", slug="metiers-de-la-data")
