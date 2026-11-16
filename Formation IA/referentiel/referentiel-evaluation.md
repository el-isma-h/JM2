# Référentiel d'évaluation — Formation IA Next Formation (NF-IA-150)

## 1. Principes

- Chaque niveau est validé par **trois types d'épreuves** : (a) les quiz de fin de module (10 questions, seuil 70 %), (b) l'examen de niveau (40 questions, 60 min, seuil 70 %, surveillé à distance), (c) une ou plusieurs **épreuves pratiques** évaluées sur grille par un formateur-évaluateur (à partir du niveau 2).
- Le certificat Next Formation du niveau est délivré lorsque **toutes** les compétences du bloc sont validées (règle « pas de compensation entre compétences » : une compétence non atteinte peut être repassée dans un délai de 6 mois).
- Les quiz formatifs sont illimités et comportent une explication par question ; l'examen de niveau est passable au maximum 3 fois (délai de 7 jours entre deux tentatives).
- Les épreuves pratiques sont les projets des modules de projet (M08-L038, M11-L048, M17-L077, M18-L083, M20-L094, M21-L100, M22-L105, M23-L110, M25-L120, M26-L127, M28-L140, M30-L150) ; pour la spécialisation N5 : les ateliers M31-L155, M32-L159/L160, M33-L165, M34-L169, le dossier qualité et conformité M35 (L170-L174) et le projet final M37 (L180-L184), détaillés au § 2 bis.
- Un jury de certification (2 membres, dont au moins un professionnel extérieur à l'équipe pédagogique) valide les résultats de chaque session et délivre les parchemins.

## 2. Tableau des épreuves par niveau

| Niveau | Quiz modules | Examen | Épreuves pratiques | Compétences validées |
|---|---|---|---|---|
| N1 | 7 × 10 questions | 40 questions / 60 min | Atelier prompts (L020), étude de cas RGPD/AI Act (L028-L029) — auto-corrigés avec grille | C1.1 → C1.6 |
| N2 | 8 × 10 questions | 40 questions / 60 min | Workflow n8n livré (L038) ; assistant RAG (L048/L052) ; installation LLM local documentée (L043) ; reporting automatisé (L058) ; politique IA (L063) | C2.1 → C2.6 |
| N3 | 8 × 10 questions | 40 questions / 60 min | Dépôt Git : assistant Claude (L077), portage OpenAI (L083), RAG (L094), agent + serveur MCP (L100), application déployée (L105), audit sécurité (L110) | C3.1 → C3.6 |
| N4 | 7 × 10 questions | 40 questions / 60 min | Épreuve écrite maths (M24) ; projets ML (L120), DL (L127), fine-tuning (L140) ; rapport final sûreté/gouvernance (L150) | C4.1 → C4.6 |
| N5 (spécialisation) | 7 × 10 questions | 40 questions / 60 min | Atelier modélisation DuckDB/Polars (L155) ; optimisation Spark (L159/L160) ; pipeline ELT dlt → dbt orchestré avec CI slim (L165) ; chaîne CDC Debezium → Kafka → lakehouse (L169) ; dossier qualité/gouvernance/RGPD (L170-L174) ; projet final pipeline RAG d'entreprise + soutenance 15 min (M37, L180-L184) | C5.1 → C5.6 |

## 2 bis. Épreuves pratiques du niveau 5 (spécialisation Data engineering & Big Data pour l'IA)

Toutes les épreuves N5 sont livrées dans un dépôt Git (fil rouge **Bréval Matériaux**, environnement Docker Compose local) et évaluées avec la grille commune du § 3. Les critères spécifiques ci-dessous précisent ce qu'« atteint » signifie pour chaque épreuve ; ils reprennent les critères de réussite des exercices pratiques des leçons.

| Épreuve | Leçon(s) | Livrables | Critères spécifiques (niveau « atteint ») | Compétences |
|---|---|---|---|---|
| Atelier de modélisation | L155 (+ L152, L154, L158) | Chaîne bronze → silver → gold exécutable ; modèle en étoile avec SCD type 2 ; journal de nettoyage ; étude de cas écrite de choix de format et de moteur | Tous les contrôles de réconciliation à `ok = true` ; valeurs de référence retrouvées ; journal d'au moins huit règles justifiées ; temps de bout en bout mesuré à l'échelle 10 ; choix de format/moteur justifié par au moins trois critères chiffrés (volume, coût, latence, multi-moteurs) | C5.1 |
| Optimisation d'un traitement distribué | L159, L160 | Script PySpark, plans d'exécution annotés, tableau des temps ; comparaison Polars lazy / DuckDB | Chaque `Exchange` des plans est expliqué ; l'effet de l'AQE sur un déséquilibre est mesuré ; le compactage réduit le nombre de fichiers ; le moteur retenu est justifié par le gain mesuré | C5.3 |
| Pipeline ELT orchestré | L165 (+ L161-L164) | Dépôt `breval` : ingestion dlt, modèles dbt testés, orchestration Airflow ou Dagster, CI « slim » GitHub Actions, README de démarrage | Test d'idempotence vert (un rejeu ne crée aucun doublon) ; au moins 5 tests dbt passent ; la CI ne construit que les modèles modifiés et échoue sur une erreur introduite ; alerte en cas d'échec ; aucun secret en clair | C5.2 |
| Chaîne CDC temps réel | L169 (+ L166-L168) | Docker Compose Postgres + Debezium + Kafka KRaft, consommateur vers table Delta/Iceberg, rapport de 10 lignes | Latence médiane et p95 rapportées ; agrégats identiques entre Postgres et le lakehouse (sans perte) ; aucune clé dupliquée après panne simulée ; suppressions propagées en moins de 10 s | C5.3 |
| Dossier qualité, gouvernance et conformité | L170, L171, L172, L173, L174 | Règles de qualité (2 outils) ; contrat ODCS v3.1 ; lignage OpenLineage/Marquez et fiche catalogue ; moniteurs et post-mortem ; cartographie des données personnelles, politique RLS et procédure d'effacement | Les contrôles bloquent une donnée non conforme ; `datacontract lint` et `datacontract test` passent ; graphe de lignage continu source → index ; deux alertes (volume, schéma) détectées et un post-mortem chiffré (*data downtime*, cause racine, actions) ; données personnelles et base légale identifiées sur au moins 8 lignes de cartographie | C5.4, C5.6 |
| **Projet final** : pipeline de données de bout en bout pour un RAG d'entreprise | M37 (L180-L184), intégrant les exercices L176, L177, L178 | (1) dossier d'architecture 1-2 pages avec contrat ODCS de la table de chunks ; (2) dépôt Docker Compose : MinIO, Postgres + Debezium + Kafka, parsing Docling, Presidio, déduplication MinHash, chunking, embeddings par lots, upsert idempotent dans Qdrant ou pgvector avec métadonnées de droits, dbt, Dagster ou Airflow ; (3) tests dbt + GX/Soda, moniteurs de fraîcheur/volume ; (4) évaluation sur 30 questions (dont 10 synthétiques relues) ; (5) runbook, estimation de coût local vs cloud, soutenance 15 min | Taux de doublons mesuré ; PII du jeu de test détectées à ≥ 90 % et masquées ; chunking justifié par recall@k/MRR ; document supprimé à la source absent de l'index dans le délai fixé par le SLA ; cloisonnement des droits vérifié ; jeux versionnés et reproductibles ; moniteurs sur les 5 piliers ; coût par document estimé ; runbook livré | C5.1 → C5.6 |

**Grille pondérée du projet final M37** (note globale du projet, communiquée au candidat) : fonctionnement de bout en bout 25 % · idempotence et incrémental/CDC 20 % · qualité, gouvernance et PII 20 % · évaluation RAG 15 % · observabilité et coûts 10 % · documentation et soutenance 10 %. La **validation de chaque compétence** C5.1 à C5.6 applique la grille commune du § 3 (≥ 8/15, aucun critère à 0) aux livrables qui la concernent ; la note globale ne compense pas une compétence non atteinte.

**Jury N5** : 2 membres dont au moins un data engineer en activité extérieur à l'équipe pédagogique.

## 3. Grille d'évaluation des épreuves pratiques (modèle)

| Critère | Insuffisant (0) | Partiel (1) | Atteint (2) | Expert (3) |
|---|---|---|---|---|
| Fonctionnement | Ne s'exécute pas | S'exécute avec erreurs | S'exécute sur les cas de test | S'exécute et gère les cas limites |
| Qualité / structure | Désorganisé | Lisible mais fragile | Structuré, documenté | Réutilisable, testé |
| Pertinence métier | Hors sujet | Répond partiellement au besoin | Répond au besoin | Dépasse le besoin (valeur ajoutée) |
| Conformité & sécurité | Données sensibles exposées | Risques non traités | Règles respectées | Risques anticipés et documentés |
| Explication orale/écrite | Absente | Confuse | Claire | Argumentée avec alternatives |

Validation de la compétence : ≥ 8/15 et aucun critère à 0.

## 4. Conformité FOAD (décret 2017-382)

- Assistance technique et pédagogique : formateur référent joignable (messagerie de la plateforme, réponse sous 24 h ouvrées), classes virtuelles hebdomadaires optionnelles.
- Séquencement : parcours imposé module par module ; déverrouillage du module suivant après quiz réussi.
- Justification de la réalisation : temps de connexion par leçon, résultats des quiz et examens, dépôts de projets, relevés d'émargement électronique ; validation humaine du temps comptabilisé (fonction native de Next Formation : `elearning_progress.validatedBy`).
- Durée estimée : 150 h, dont 141 h de leçons et exercices, 9 h d'évaluations.
- Spécialisation N5 (hors parcours 150 h) : 30 h, dont 27 h 15 de leçons et exercices, 2 h 45 d'évaluations (7 quiz de 15 min + examen de 60 min).

## 5. Accessibilité

Supports textuels compatibles lecteurs d'écran, transcriptions des vidéos externes recommandées, temps majoré d'un tiers aux examens sur demande (référent handicap de l'organisme).
