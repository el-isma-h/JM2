# Référentiel de compétences — Formation IA Next Formation (NF-IA-150)

> Structure conforme aux attentes de France Compétences pour un projet de certification au Répertoire Spécifique (RS) : chaque compétence est formulée par un verbe d'action observable, assortie de critères d'évaluation et de modalités. Un niveau = un bloc de compétences = un certificat Next Formation. Les quatre blocs peuvent être présentés comme quatre certifications RS distinctes (recommandé : la granularité « un niveau = une certification » facilite l'enregistrement et la vente au CPF) ou comme une certification unique à quatre niveaux.

Version 1.0 — 1er novembre 2026.

## Bloc 1 (Niveau 1) — Utiliser l'intelligence artificielle générative de manière efficace, critique et conforme

Objectif professionnel : permettre à tout actif de mobiliser les assistants IA (Claude, ChatGPT, Gemini, Grok, Perplexity…) dans son activité, en maîtrisant les risques juridiques et de sécurité (obligation d'alphabétisation à l'IA, article 4 du règlement UE 2024/1689).

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C1.1 | Expliquer le fonctionnement général d'un grand modèle de langage (tokens, paramètres, entraînement, fenêtre de contexte) et ses limites (hallucinations, biais, date de connaissance) | Les notions clés sont correctement définies ; les limites sont identifiées sur un exemple de sortie erronée | QCM + étude de cas |
| C1.2 | Sélectionner l'outil IA adapté à une tâche professionnelle donnée (rédaction, recherche sourcée, analyse, image) parmi l'offre du marché | Le choix est justifié par au moins deux critères pertinents (sources, confidentialité, coût, modalité) | Mise en situation |
| C1.3 | Rédiger un prompt structuré (rôle, contexte, tâche, format, contraintes, exemples) produisant un résultat exploitable | Le prompt contient les composants attendus ; le résultat répond à la consigne ; une itération d'amélioration est réalisée | Exercice pratique évalué sur grille |
| C1.4 | Vérifier, sourcer et corriger une production IA avant utilisation | Les erreurs factuelles introduites sont repérées ; les sources sont contrôlées ; la correction est argumentée | Étude de cas |
| C1.5 | Décrire les principes d'une automatisation (API, webhook, workflow) et d'un agent IA et identifier un cas d'usage pertinent dans son métier | Le vocabulaire est exact ; le cas d'usage proposé est réaliste et décrit étape par étape | QCM + production écrite |
| C1.6 | Appliquer les règles de protection des données (RGPD), de propriété intellectuelle et les obligations de l'AI Act dans l'usage quotidien de l'IA | Les données interdites de saisie sont identifiées ; les obligations applicables à l'entreprise sont citées ; une charte d'usage simplifiée est produite | Mise en situation + QCM |

## Bloc 2 (Niveau 2) — Concevoir et déployer des automatisations et des assistants IA sans code

Objectif professionnel : automatiser des processus métier avec des outils no-code (n8n, Make), déployer des assistants personnalisés et des bases de connaissances (RAG), exploiter des modèles en local, et cadrer l'usage de l'IA dans l'organisation.

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C2.1 | Construire un workflow d'automatisation n8n intégrant un modèle de langage, des sources de données externes et une gestion des erreurs | Le workflow s'exécute sans erreur sur un jeu de test ; les cas d'erreur sont gérés ; les données sont correctement transformées | Projet pratique (workflow livré) |
| C2.2 | Déployer un assistant IA spécialisé (projet, GPT personnalisé, agent n8n) alimenté par une base de connaissances documentaire (RAG) | L'assistant répond correctement à 8 questions sur 10 à partir des documents fournis ; les sources sont citées | Projet pratique |
| C2.3 | Dimensionner et installer un modèle de langage local adapté à une configuration matérielle donnée (mémoire, stockage, vitesse) | Le modèle choisi est compatible avec la machine ; l'installation est fonctionnelle ; le choix est justifié (taille, licence, performance) | Exercice pratique + QCM |
| C2.4 | Exploiter l'IA pour analyser des données tabulaires et produire un reporting automatisé | Les résultats d'analyse sont exacts ; le reporting est généré automatiquement et lisible | Projet pratique |
| C2.5 | Produire des contenus visuels, vidéo ou audio avec des outils génératifs en respectant les droits et la mention d'origine | Le contenu répond au brief ; les conditions d'utilisation et la transparence (contenu généré) sont respectées | Production évaluée sur grille |
| C2.6 | Élaborer une politique d'usage de l'IA et une grille de choix (SaaS, API, local) pour une organisation, conforme à l'AI Act et au RGPD | Les risques sont cartographiés ; les mesures sont proportionnées ; les coûts sont estimés | Étude de cas écrite |

## Bloc 3 (Niveau 3) — Développer des applications et des agents fondés sur les API de modèles de langage

Objectif professionnel : concevoir, développer, sécuriser et déployer des applications utilisant les API Anthropic, OpenAI, xAI, Perplexity, Mistral et Google, incluant le RAG, les outils (tool use), le protocole MCP et les agents.

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C3.1 | Intégrer une API de modèle de langage (Anthropic, OpenAI, xAI, Perplexity, Mistral, Gemini) dans une application avec gestion du streaming, des erreurs, des coûts et des limites | Le code fonctionne ; les clés sont sécurisées ; le coût d'un appel est estimé ; le streaming est implémenté | Projet de code évalué |
| C3.2 | Mettre en œuvre l'appel d'outils (tool use / function calling) et les sorties structurées pour fiabiliser les réponses | Le schéma d'outil est valide ; le modèle appelle l'outil au bon moment ; la sortie JSON est validée | Exercice de code |
| C3.3 | Concevoir un pipeline RAG (ingestion, découpage, embeddings, base vectorielle, reranking) et en évaluer la qualité | Le pipeline répond correctement aux questions de test ; les métriques (fidélité, pertinence) sont calculées et interprétées | Projet de code |
| C3.4 | Développer un agent IA (boucle outils-mémoire-planification) et l'exposer via MCP ou un SDK d'agents | L'agent accomplit une tâche multi-étapes ; un serveur MCP est fonctionnel ; les limites de l'agent sont documentées | Projet de code |
| C3.5 | Déployer une application IA avec interface, observabilité et tests de prompts | L'application est déployée et accessible ; les traces sont collectées ; une suite d'évaluation automatisée existe | Projet déployé |
| C3.6 | Sécuriser une application LLM contre les risques de l'OWASP Top 10 (injection de prompt, fuite de données, abus) | Les vulnérabilités d'un cas fourni sont identifiées ; des contre-mesures sont implémentées et testées | Audit pratique + QCM |

## Bloc 4 (Niveau 4) — Concevoir, entraîner, adapter et déployer des modèles d'apprentissage automatique et de langage

Objectif professionnel : maîtriser les fondements mathématiques et algorithmiques du machine learning et du deep learning, construire et adapter des modèles de langage (fine-tuning), les servir en production et en garantir la sûreté.

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C4.1 | Mobiliser les outils mathématiques (algèbre linéaire, calcul différentiel, probabilités, optimisation) nécessaires à la compréhension des modèles | Les calculs demandés sont exacts ; les notions sont reliées à leur usage dans un réseau de neurones | Épreuve écrite |
| C4.2 | Entraîner, évaluer et sélectionner un modèle de machine learning supervisé ou non supervisé sur un jeu de données réel | Le protocole (séparation, validation, métriques) est correct ; les performances sont interprétées ; le sur-apprentissage est détecté | Projet de code |
| C4.3 | Implémenter et entraîner un réseau de neurones profond (MLP, CNN, transformer) avec un framework (PyTorch) | Le modèle converge ; la rétropropagation est expliquée ; les résultats sont reproductibles | Projet de code |
| C4.4 | Adapter un modèle de langage ouvert à un domaine par fine-tuning (LoRA/QLoRA) ou via API, et mesurer le gain | Le jeu de données est construit correctement ; le modèle adapté surpasse la base sur l'évaluation définie | Projet de code |
| C4.5 | Déployer un modèle en production (quantization, serveur d'inférence, GPU/edge) avec suivi des performances et des coûts | Le modèle est servi avec un débit mesuré ; les coûts sont chiffrés ; le monitoring est en place | Projet déployé |
| C4.6 | Évaluer la sûreté, la robustesse et la conformité d'un système d'IA (red teaming, sécurité agentique, NIST AI RMF, ISO/IEC 42001, AI Act) | Les vulnérabilités sont découvertes et documentées ; un plan de gouvernance est proposé | Audit + rapport |

## Correspondance compétences ↔ modules

| Compétence | Modules principaux |
|---|---|
| C1.1 | M01, M02 |
| C1.2 | M03 |
| C1.3 | M04 |
| C1.4 | M05 |
| C1.5 | M06 |
| C1.6 | M07 |
| C2.1 | M08, M09 |
| C2.2 | M11, M12 |
| C2.3 | M10 |
| C2.4 | M13 |
| C2.5 | M14 |
| C2.6 | M15 |
| C3.1 | M16, M17, M18, M19 |
| C3.2 | M17, M18 |
| C3.3 | M20 |
| C3.4 | M17, M21 |
| C3.5 | M22 |
| C3.6 | M23 |
| C4.1 | M24 |
| C4.2 | M25 |
| C4.3 | M26, M27 |
| C4.4 | M28 |
| C4.5 | M29 |
| C4.6 | M30 |

## Bloc 5 (Niveau 5, spécialisation) — Data engineering & Big Data pour l'IA

Objectif professionnel : permettre à un développeur IA de construire et d'exploiter la chaîne de données (ingestion, stockage, transformation, qualité, préparation) qui alimente les applications d'IA générative (RAG, agents, fine-tuning) et le machine learning, à l'échelle et en conformité.

| Code | Compétence | Critères d'évaluation | Modalités |
|---|---|---|---|
| C5.1 | **Concevoir** un modèle de données analytique (étoile ou Data Vault) et **choisir** les formats et le stockage (Parquet, format de table ouvert, entrepôt cloud ou moteur local) adaptés à un volume, une latence et un budget donnés | Le modèle couvre les besoins exprimés et gère l'historisation ; le choix de format et de moteur est justifié par au moins trois critères chiffrés (volume, coût, latence, multi-moteurs) ; le schéma est documenté | Étude de cas écrite + exercice DuckDB |
| C5.2 | **Construire** un pipeline batch ELT incrémental (ingestion, transformation dbt testée, orchestration) capable de reprendre après échec sans doublon | Le pipeline s'exécute de bout en bout sur le jeu de test ; un rejeu ne crée pas de doublon (idempotence démontrée) ; au moins 5 tests dbt passent ; les dépendances sont orchestrées avec alerte en cas d'échec | Projet pratique (dépôt Git livré) |
| C5.3 | **Traiter** des données volumineuses ou en flux avec le moteur approprié (Spark, Polars/DuckDB, Kafka et Flink/Spark Streaming) en garantissant l'ordre, la fraîcheur et la sémantique de livraison requises | Le moteur retenu est justifié ; un traitement distribué est optimisé (partitionnement, jointure) avec gain mesuré ; un flux CDC est propagé avec une latence mesurée et sans perte sur le scénario de test | Exercice pratique + QCM de mise en situation |
| C5.4 | **Mettre en œuvre** la qualité, la gouvernance et la conformité des données : tests, contrat de données, catalogue et lignage, contrôle d'accès, règles RGPD | Un contrat ODCS valide décrit schéma, qualité et SLA ; les contrôles bloquent une donnée non conforme ; le lignage source → index est consultable ; les données personnelles et leur base légale sont identifiées | Projet pratique + étude de cas |
| C5.5 | **Préparer** des données pour l'IA : extraction, nettoyage, déduplication, anonymisation des données personnelles, découpage et vectorisation, versionnement des jeux et, le cas échéant, génération de données synthétiques | Le taux de doublons après traitement est mesuré ; les PII du jeu de test sont détectées à ≥ 90 % et masquées ; la stratégie de chunking est justifiée par une évaluation de récupération ; chaque jeu produit est versionné et reproductible | Projet pratique évalué sur grille |
| C5.6 | **Exploiter et optimiser** une plateforme de données en production : observabilité (fraîcheur, volume, schéma, qualité, lignage), gestion d'incident, maîtrise des coûts et documentation | Des moniteurs couvrent les 5 piliers ; un incident simulé est détecté, diagnostiqué et documenté (post-mortem) ; le coût par exécution ou par document est estimé ; un runbook est livré | Mise en situation + soutenance orale |

| Compétence | Modules principaux |
|---|---|
| C5.1 | M31, M32, M37 |
| C5.2 | M33, M37 |
| C5.3 | M32, M34, M37 |
| C5.4 | M35, M37 |
| C5.5 | M36, M37 |
| C5.6 | M35, M37 |
