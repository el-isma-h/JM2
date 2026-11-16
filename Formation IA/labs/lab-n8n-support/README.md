# Lab L038 — Assistant de support client automatisé (n8n)

| | |
|---|---|
| Leçon liée | [L038 — Projet : assistant de support client automatisé](../../niveaux/N2-praticien/M08-n8n-avance-automatiser-avec-l-ia/L038-projet-assistant-de-support-client-automatise.md) (module M08, niveau 2) |
| Compétences | C2.1, C2.2 |
| Durée | 45 min pour la simulation sans clé + 3 h pour l'assistant complet, l'évaluation et la fiche d'exploitation |
| Prérequis | Docker (ou n8n Cloud) ; aucune clé pour démarrer ; pour le mode réel : clé Anthropic, comptes Gmail, Slack et Google Sheets de test |

## Objectif

Livrer l'assistant de support de **Maison Connectée SAS** (18 personnes, objets domotiques, fictive) : chaque demande reçue par formulaire ou par e-mail obtient un accusé de réception et un numéro de ticket ; les demandes facturation, technique et livraison reçoivent une réponse **rédigée par l'IA à partir des fiches** et **validée par un humain** dans Slack ; les réclamations, les messages agressifs et les cas douteux sont **escaladés sans réponse IA** ; tout est journalisé ; aucune panne ne fait perdre un ticket.

## Contenu

```
lab-n8n-support/
├── docker-compose.yml             n8n + Qdrant + Ollama (local, sans clé API)
├── .env.example                   N8N_ENCRYPTION_KEY, versions d'images, WEBHOOK_URL
├── base-connaissances/            9 fiches de support Maison Connectée (Markdown, métadonnées titre / catégorie / date)
├── donnees/
│   ├── emails_test.json           20 e-mails de test : catégorie attendue, éléments attendus, escalade oui/non
│   └── emails_test.csv            le même jeu, à importer dans Google Sheets ou une Data Table (nœud Evaluation)
└── workflows/
    ├── 00-simulation-sans-cle.json        MODE SANS CLÉ : tri à mots-clés, réponses tirées des fiches, synthèse des 3 indicateurs
    ├── 01-ingestion-base-support.json     fiches → découpage 1 000 / 150 → Ollama nomic-embed-text → Qdrant support_fiches
    ├── starter/02-assistant-support-squelette.json   STARTER : le squelette de la section 4 de la leçon (« À COMPLÉTER »)
    ├── solution/02-assistant-support.json            corrigé : deux entrées, tri, RAG, validation Slack, journal, escalades, erreurs
    ├── 03-alerte-erreurs.json             workflow d'erreur (Error Trigger → Slack)
    └── code/                              le JavaScript des nœuds Code de la simulation, lisible hors de n8n
```

Tous les JSON sont importables par *Workflows → Import from File*. Les exports ne contiennent **aucune clé** : seulement le nom des credentials à créer. Les `typeVersion` sont indicatifs, n8n les adapte à l'import ; avec **n8n 3.0** (27 oct. 2026, changements incompatibles), vérifiez les noms des nœuds et des options sur votre version.

## Démarrer en mode simulé (sans clé)

```bash
cp .env.example .env
sed -i "s/^N8N_ENCRYPTION_KEY=$/N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)/" .env   # macOS : sed -i ''
docker compose up -d n8n                                       # http://localhost:5678, créez le compte propriétaire
```

Importez `workflows/00-simulation-sans-cle.json` et cliquez sur *Execute workflow*. Le nœud **Synthèse de l'évaluation** affiche `taux_bonne_categorie`, `taux_reponses_conformes`, `reclamations_non_escaladees` et `livrable`. Testez aussi l'entrée webhook (bouton *Listen for test event*, puis) :

```bash
curl -s -X POST http://localhost:5678/webhook-test/support-simulation -H 'Content-Type: application/json' \
     -d '{"email":"c.martin@exemple.fr","nom":"Claire Martin","sujet":"Facture en double","message":"Prélevée deux fois."}'
```

Le classifieur à mots-clés obtient 20/20 sur le jeu fourni **parce qu'il a été réglé dessus**. Écrivez cinq e-mails nouveaux (« Vous êtes nuls, rendez-moi mon argent », « Le thermostat affiche E4 ») : il se trompe. C'est la démonstration de deux règles de la leçon : un vrai classifieur (Haiku 5.5) et un **jeu de test que le système n'a jamais vu**.

## Énoncé : de la simulation à l'assistant réel

| Étape | Ce que vous faites | Section de la leçon | Vérification |
|---|---|---|---|
| 1 | Simulation : lire les 4 nœuds Code, comprendre l'item normalisé | 2 | `livrable: true` |
| 2 | `docker compose up -d`, `docker compose exec ollama ollama pull nomic-embed-text` ; credentials *Qdrant local* (`http://qdrant:6333`) et *Ollama local* (`http://ollama:11434`) ; importer et lancer `01-ingestion-base-support.json` | 3.3 et L035 | tableau de bord Qdrant : collection `support_fiches`, vecteurs de 768 dimensions |
| 3 | Importer le **starter** `02-assistant-support-squelette.json` ; compléter le System Message (3.3) et le message Slack (3.4) | 3.3, 3.4 | trois demandes de test traitées |
| 4 | Ajouter l'entrée Gmail, la normalisation commune, l'accusé de réception et le journal | 3.1, 3.5 | une ligne `recu` par ticket |
| 5 | Ajouter les branches manquantes : confiance basse → escalade, rejet → « à reprendre », sortie d'erreur de l'agent → « IA indisponible » | 3.3, 3.5, 3.6 | aucune branche sans issue |
| 6 | Importer `03-alerte-erreurs.json` et le désigner comme *Error workflow* ; *Retry On Fail* (3 × 5 s) sur Gmail, Slack, Sheets | 3.6 | panne simulée → alerte |
| 7 | Évaluer : importer `donnees/emails_test.csv` dans une feuille `tests_support` (ou une Data Table), brancher **Evaluation Trigger** à la place du webhook, désactiver l'envoi réel en mode évaluation, enregistrer les métriques avec **Evaluation → Set Metrics** | 5 | ≥ 90 % de catégories, ≥ 80 % de réponses conformes, 0 réclamation non escaladée |
| 8 | Chiffrer le coût mensuel (70 tickets/jour, tarifs de la page Pricing) et rédiger la fiche d'exploitation | 6, 7 | ≈ 20 à 25 €/mois |

Comparez ensuite votre travail au corrigé `solution/02-assistant-support.json`. Ses choix, à justifier si vous faites autrement :
- deux entrées convergent vers un nœud **Demande normalisée** : toutes les expressions lisent `$('Demande normalisée').item.json`, quelle que soit la source ;
- chaque écriture au journal est précédée d'un nœud *Ligne journal* (Edit Fields) qui fixe les colonnes, puis un *Append or Update* sur `ticket_id` (mappage automatique) ;
- les quatre escalades (réclamation, autre, confiance basse, IA indisponible) écrivent au journal **avant** de prévenir la responsable ;
- le message client est encadré par `<message_client>` et le System Message interdit de suivre ses instructions et de promettre un remboursement (cas E18 du jeu de test).

## Mode réel : credentials à créer

| Credential (nom attendu par les workflows) | Type n8n | Remarque |
|---|---|---|
| Support — en-tête secret | Header Auth | nom `X-Support-Token`, valeur aléatoire ; le formulaire du site l'envoie |
| Gmail support@ | Gmail OAuth2 | compte de test ; créez le libellé `n8n-traite` et collez son ID dans *Gmail — marquer n8n-traite* |
| Anthropic — support | Anthropic | clé dédiée à ce workflow ; `claude-haiku-5-5` (tri) et `claude-sonnet-5-5` (rédaction), sans `temperature` |
| Qdrant local / Ollama local | Qdrant / Ollama | URLs des services Docker ci-dessus |
| Slack support | Slack | canaux `#support-validation`, `#support-escalade`, `#support-alertes` |
| Google Sheets — support | Google Sheets OAuth2 | feuille `journal` : `ticket_id, canal, email, categorie, statut, validee_par, duree_min, motif, maj_le` |

La validation Slack (*Send and Wait*) rappelle votre instance : `WEBHOOK_URL` doit être joignable en HTTPS (leçon L037). En local, utilisez un tunnel ou faites cette étape sur n8n Cloud.

## Critères de réussite (repris de la leçon L038, section « Exercice pratique »)

- Les trois demandes de démonstration aboutissent : deux réponses proposées dans Slack et envoyées après validation (une facturation, une technique), une escalade sans réponse IA (une réclamation).
- Le jeu de test donne **≥ 8/10 réponses conformes** sur les cas de la leçon, et sur les 20 cas du lab : ≥ 90 % de bonnes catégories, ≥ 80 % de réponses conformes, **aucune réclamation non escaladée** (E15 à E18).
- Une panne simulée (credential Anthropic invalide) déclenche l'alerte et l'escalade « IA indisponible » ; aucun ticket perdu.
- Aucune clé en clair ; credentials sur un compte dédié ; Sticky Note de documentation présente ; nœuds nommés.
- Le coût mensuel est chiffré et sourcé.

Livrables : les exports JSON (ingestion, assistant, workflow d'erreur), la base ingérée (≥ 6 fiches), la feuille de test et ses résultats, la fiche d'exploitation d'une page, le calcul de coût, le plan d'amélioration en trois lignes.

## Mission documentation

Trois recherches dans la documentation n8n (liens de `ressources/bibliotheque-liens.md`, section 8.2). Notez la réponse et la date de consultation dans votre fiche d'exploitation.

1. **Human in the loop** — <https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools.md> : quels canaux proposent une opération *Send and Wait*, et que se passe-t-il pour l'exécution pendant l'attente (ressources, limite de temps) ?
2. **Evaluation** — <https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.evaluation.md> et <https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.evaluationtrigger.md> : quelles sources de jeu de test l'Evaluation Trigger accepte-t-il, et quelle opération du nœud Evaluation permet de sauter l'envoi réel pendant une évaluation ?
3. **Docker** — <https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker.md> : quel volume conserver, quel port exposer, et pourquoi `N8N_ENCRYPTION_KEY` doit-elle être sauvegardée séparément ?

## Limites du mode simulé

La simulation vérifie la **plomberie** (normalisation, routage, escalades, calcul des indicateurs), pas l'intelligence : ni la compréhension d'un e-mail mal écrit, ni la fidélité d'une réponse aux fiches, ni le respect du ton. Ces trois points se mesurent en mode réel avec le nœud Evaluation, puis en production avec le **taux de validation sans modification** dans Slack.
