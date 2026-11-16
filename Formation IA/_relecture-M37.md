# Relecture indépendante — M37 « Projet final : pipeline de données de bout en bout pour un RAG d'entreprise »

Date : 5 novembre 2026. Périmètre : `niveaux/N5-data-engineering/M37-*/`, soit L180 à L184, `quiz.json` et `module.json`, sans rien modifier en dehors de ce dossier. Les références de cohérence sont L151, L152, `_harmonisation-N5.md` et les leçons M31 à M36 citées par M37. Le web n'a pas été utilisé.

## Méthode

- **Extraction des blocs** : les 92 blocs d'origine des cinq leçons ont été extraits dans `scratchpad/relecture-m37/blocs/` (24 Python, 29 bash, 10 SQL, 7 YAML, 10 quiz, 5 missions, 1 Mermaid, 6 autres).
- **Jeu de données** : celui de L152 (graine 42, échelle 1), déjà généré pendant l'harmonisation (`n5-harmonisation/run2/breval/data/raw`).
- **Exécuté et comparé au texte** :

| Bloc | Résultat |
|---|---|
| `cadrage/volumetrie.py` (L180) | sortie identique au point de contrôle : 126 documents, 9 069 mots, 36 avec téléphone, répartition par type et par confidentialité, 6 anciennes versions, 9 048 tickets, 1 380 avec téléphone, 259 par mois, 9 426 chunks, 39 Mo |
| `rag/dedup.py` (L182) | 126 → 116 ; 10 retraits (6 procédures à J = 0,864 à 0,897, 4 CGV à 1,0) ; J à 5 grammes sur le texte entier entre PRC-001 et PRC-001-v2 = 0,545 ; aucune paire distincte au-dessus de 0,7 en dehors des CGV de même public (max 0,684) |
| `rag/chunking.py` + `rag/droits.py` (L182), avec un tokenizer approché par mots (cl100k_base ne peut pas être téléchargé hors ligne) | 9 426 chunks, 9 326 indexables, 378 chunks de documents dont 100 gabarits (80 « Mise en œuvre », 20 « Étapes »), 278 indexables, 116 en `doc-entier-v1`. PRC-014 = 4 chunks indexables (« 4 points supprimés » en L183). Aucune section ne dépasse 350 tokens (ticket le plus long : 82 mots), donc les comptes ne dépendent pas du tokenizer |
| `qualite/annoter_pii.py` (L182) | 236 exemples, 222 entités, positions exactes vérifiées |

- **Faits vérifiés dans les données** :
  - Les identifiants cités existent : PRC-001/-v2 (RH, restreint), NOTE-002 (direction, restreint), PRC-002, 004, 014, 024, 030, FT-BRV-ISO-00075 (lambda 0,04), FT-BRV-BOI-00482, FT-BRV-ELE-00613, FT-BRV-ELE-00005.
  - Les rattachements des tickets sont exacts : SAV-0008640 = CMD-2026-0034174, agence STN ; SAV-0008364 = CMD-2026-0030392, agence NAN ; client 493 = SAV-0008372 (5 tickets) ; client 937 = 5 tickets.
  - 80 fiches techniques ont la section gabarit. Des titres homonymes existent (justification de M37-Q06).
- **Cohérence M31 à M36** :
  - `breval/data/breval.duckdb`, schémas `bronze`, `silver`, `gold` ;
  - conteneur `breval-postgres`, base et utilisateur `breval`, `wal_level=logical`, conteneurs `breval-minio`, `breval-kafka`, `breval-connect` ;
  - tables `erp.commandes`, `erp.clients`, `mis_a_jour_le` ; topics `breval.<schéma>.<table>` ; slot `debezium_breval` ;
  - projet dbt `dbt_breval` (`name: breval`, `profile: breval`, `--profiles-dir .`, sources `erp` et `sav` en `bronze`, `stg_erp__commandes` et `stg_erp__clients` avec `agence_id`, macro de schéma) ;
  - dlt `bronze.tickets_sav` et `bronze.tickets_sav__messages`, `ingestion/ingest.py`, Makefile de L165 (`DBT`, `ingest`), `orchestration/defs.py`, `tests_pipeline/test_idempotence.py` ;
  - L177 (`reconnaisseurs_fr.py`, `analyseur_fr.py`, `creer_analyseur`, `evaluer_pii.py`, `evals/pii_annote.jsonl`), L178 (`decouper()` identique, `struct-md-v2-max350-rec50`, `bge-m3@2026-11`, `chunks_bge_m3_v1`, alias `chunks`), L179 (`qwen3.8:27b`), L170 (Soda `breval`, GX `add_pandas`), L172 (OpenLineage), L089 (Mistral Embed à 0,10 $/M), L092 (hybride).
- **Mermaid** : `mmdc` 11 sur le schéma de L180 et sur celui de la fiche, rendus sans erreur (`relecture-m37/L180_archi.svg`, `fiche.svg`).
- **Quiz et missions** : un script contrôle le JSON, l'index de la réponse, la longueur relative des options et la présence de chaque URL dans `_recherche/` ou dans `ressources/bibliotheque-liens.md`. Chaque question a ensuite été relue.

## Corrections appliquées (14)

| # | Fichier | Problème | Correction |
|---|---|---|---|
| 1 | L181 §2 | Le compose « consolidé » ignore `docker-compose.kafka.yml` (L167) et `docker-compose.cdc.yml` (L169), encore actifs : conflit sur les noms `breval-kafka` et `breval-connect` | Phrase ajoutée : ces deux fichiers sont remplacés, on les arrête avec `down` (sans `-v`), et le Schema Registry n'est plus utilisé |
| 2 | L181 §5 | Le nouveau connecteur `breval-postgres` réutilise le slot `debezium_breval` du connecteur `breval-erp` de L169. Sa publication `dbz_publication` ne couvre que deux tables, ce qui risque de ne pas diffuser `ged.documents` ni le registre RGPD | Encadré avec `curl -X DELETE …/connectors/breval-erp`, `pg_drop_replication_slot('debezium_breval')` et `DROP PUBLICATION IF EXISTS dbz_publication` |
| 3 | L181, point de contrôle | « 120 000 » événements `r` sur les commandes, alors que l'expérience 3 de L162 en supprime 5 | « (119 995 si vous avez fait l'expérience 3 de L162) » |
| 4 | L182 §4 | M37 contredisait L176 sans le dire : L176 applique MinHash à tout le corpus, tickets compris, et garde le texte le plus long. Rejoué, il écarte 1 746 tickets et aucune ancienne version (vérifié sur `apres_minhash.jsonl` de l'harmonisation). Le seuil n'avait en fait **pas** changé (0,8 et LSH 14 × 8 conservés) : ce sont les shingles, le périmètre, la règle de survie et le Jaccard exact au lieu de l'estimation qui changent | Paragraphe réécrit : quatre écarts à L176, numérotés et justifiés par la mesure, avec le rappel que les paramètres LSH et le seuil sont conservés et la consigne de reporter ces écarts dans le dossier |
| 5 | L182, piège « tickets » | Même contradiction implicite | Ajout : « la recette générique de L176 en écarte 1 746, alors que le générateur de L152 ne crée aucun ticket envoyé deux fois » (vérifié : aucun doublon d'envoi injecté) |
| 6 | L182 §6.2 | Le `configuration.yml` Soda de L170 vise le schéma `main`, alors que `rag_chunks` est en `silver` : le scan ne trouverait pas la table | Commentaire ajouté, avec la syntaxe exacte à vérifier dans la doc Soda |
| 7 | L183 §3, point de contrôle | « `rag.recherche alice …` ne renvoie plus PRC-024 » est faux : PRC-024 appartient au service commerce, et en `restreint` il reste ouvert à `service:commerce`, qui est le groupe d'Alice | Profil remplacé par `karim`, avec une phrase qui explique pourquoi Alice le voit toujours |
| 8 | L184 §1 | `rag/lignage.py` (`nouveau_run`, `emettre`) est importé par `defs_rag.py` et annoncé dans l'arborescence de L180, mais n'est écrit nulle part | Module ajouté, sur le modèle de L172 : sans effet si `MARQUEZ_URL` n'est pas défini, namespace de job `breval-rag` comme L172 |
| 9 | L180, quiz 1 et 2 | La bonne réponse était nettement la plus longue (67 contre 47 ; 88 contre 50) | Distracteurs allongés, bonne réponse resserrée |
| 10 | L181, quiz 1 | Idem (114 contre 54) | Idem |
| 11 | L182, quiz 1 et 3 | Idem (78 contre 45 ; 98 contre 73) | Idem |
| 12 | L183, quiz 1 ; L184, quiz 1 et 2 | Idem (86 contre 54 ; 71 contre 48 ; 145 contre 38) | Idem |
| 13 | `quiz.json` Q01, Q02, Q03, Q06, Q07, Q08, Q09 | Bonne réponse la plus longue, souvent du double | Options réécrites à longueurs comparables (écart maximal ≤ 10 %), sens et index de réponse inchangés |
| 14 | `quiz.json` Q04 et Q05 | Q04 citait `https://min.io/`, absent de `_recherche/` et de la bibliothèque ; l'explication de Q05 ignorait L176 | Source de Q04 remplacée par `https://docs.aws.amazon.com/s3/` (`_recherche/06`, déjà utilisée par le quiz M32) ; L176 mentionnée dans l'explication de Q05 |

Aucune bonne réponse n'a changé. Les 22 questions (12 quiz éclair, 10 quiz de module) ont chacune une seule réponse défendable, avec une explication conforme à la leçon. Les cinq missions pointent vers des URL présentes dans `_recherche/`, et leur réponse est datée. Chaque leçon a exactement un « 🧭 En clair » avec une analogie (maçon, quai de réception, atelier de préparation, libre-service, gardien d'immeuble).

## Fichier créé

- `fiche.md` (FORMAT.md §5, sur le modèle de la fiche M33). Elle contient l'en-tête YAML, la phrase-résumé, les 7 idées avec leurs renvois de leçon, un schéma Mermaid de l'architecture (testé), une **checklist de livraison** (7 cases), la **grille d'évaluation** (6 critères, poids et preuve rejouable), le vocabulaire, les pièges, les commandes et les chiffres de référence vérifiés ci-dessus, 3 liens officiels et un auto-test avec réponses. Elle compte environ 1 280 mots, code compris, plus que les 450 à 750 mots de FORMAT.md, à cause des deux sections demandées. Les fiches M31 à M36 font déjà environ 1 000 mots.

## Conservé volontairement

- Les chiffres « 0,8 million de tokens », les latences et le rappel PII sont donnés comme ordres de grandeur. Ils ne sont pas vérifiables sans tiktoken, Presidio ni Docker, et le texte les présente bien comme tels.
- `https://min.io/` reste dans les sources et le « Pour aller plus loin » de L181 : il ne s'agit ni d'une mission ni d'un quiz, et L156 l'utilise déjà.
- Le schéma de L180 ne montre pas dlt pour l'ERP : le flux de L162 reste inchangé et il est décrit dans le texte.

## Non exécuté (outils absents ou réseau)

Docker, Postgres, Kafka, Debezium, MinIO, Qdrant, dbt, dlt, Dagster, GX, Soda, Data Contract CLI, Presidio, Docling, tiktoken (encodage non téléchargeable), sentence-transformers et le LLM local. Leurs blocs ont été relus ligne par ligne : API Qdrant (`scroll`, `set_payload`, `FilterSelector`, alias), `confluent_kafka` (`committed`, `get_watermark_offsets`), `dagster_dbt` (clés d'assets `[source, table]` et nom de modèle, `select` en union), SQL DuckDB (`epoch_ms`, `timezone`, `string_agg … order by`, `QUALIFY`, `INSERT OR IGNORE`).

## Validateur

`node scripts/validate.mjs | tail -3` → « ✅ Aucune erreur bloquante ». Le seul avertissement est antérieur à cette relecture : `examens/N5-examen.json` manquant.

## Propositions optionnelles (non appliquées, hors du dossier M37)

- Proposition optionnelle : dans L176, retirer les tickets de `minhash_lsh.py`, ou avertir que la recette générique écarte 1 746 tickets sur Bréval, puisque L177 et L178 consomment `apres_minhash.jsonl`. Aligner aussi le code sur la règle de survie annoncée dans le corrigé (« le plus récent »).
- Proposition optionnelle : ajouter `https://min.io/` à `ressources/bibliotheque-liens.md`, avec un statut vérifié, puisque L156 et L181 le citent.
- Proposition optionnelle : vérifier avec Docker que `publication.autocreate.mode=filtered` met bien à jour une publication existante (sinon, l'encadré n° 2 de L181 est indispensable), et vérifier le paramètre de schéma de la source Soda DuckDB.
