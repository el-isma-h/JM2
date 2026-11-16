# Tutoriel B — Dify : livrer une application de chat (20 à 30 min)

Reprend la section 2 de la leçon L048. Mode sans clé : Ollama (celui du `docker-compose.yml` du lab) comme fournisseur de modèles. Variante Flowise en fin de page.

## 1. Installer Dify (Docker Compose)

Suivez le *Quick start* du README officiel (<https://github.com/langgenius/dify>, il évolue) : en résumé, cloner le dépôt, se placer dans le dossier `docker`, copier le fichier d'environnement d'exemple, puis `docker compose up -d`, et ouvrir la page d'installation dans le navigateur pour créer le compte administrateur. Configuration minimale relevée en nov. 2026 : 2 cœurs, 4 Go de RAM (mission de la leçon, section 2.1).

Gardez **Ollama** lancé (`docker compose up -d ollama` dans ce lab) : Dify l'utilisera comme fournisseur de modèles.

## 2. Connecter les modèles (sans clé)

1. *Settings → Model Provider → Ollama*.
2. Ajoutez deux modèles avec l'URL de base `http://host.docker.internal:11434` (sous Linux, l'adresse IP de l'hôte sur le réseau Docker, souvent `http://172.17.0.1:11434`) :
   - type **LLM** : `gemma4:e4b` ;
   - type **Text Embedding** : `nomic-embed-text`.
3. Pour comparer avec un modèle hébergé : ajoutez le fournisseur Anthropic, OpenAI ou Mistral avec **votre** clé, saisie dans Dify uniquement.

## 3. Créer la base de connaissances

1. *Knowledge → Create Knowledge* → importez les 9 fichiers de `documents/` (Markdown accepté).
2. **Découpage personnalisé** : séparateur `\n\n`, taille maximale 800 tokens, chevauchement 10 à 15 % ; nettoyage des espaces multiples activé.
3. **Lisez trois morceaux dans l'aperçu** : chacun doit avoir un sens seul (une ligne de tableau tarifaire coupée de son en-tête n'en a pas).
4. Indexation **High Quality** avec `nomic-embed-text` ; recherche **Hybrid** si disponible, *Top K* 4 à 6, **seuil de score** 0,5 ; reranking seulement si un modèle de reclassement est configuré.
5. Après l'indexation, onglet de test de la base : tapez « vis béton cellulaire », puis « véranda ». Notez les scores : le second doit être faible, ou ne renvoyer que la mention « ne font pas partie de notre offre ».
6. Notez le modèle d'embeddings dans la description de la base (critère de réussite).

## 4. Créer l'application

1. *Studio → Create from Blank → Chatbot*.
2. *Orchestrate* : collez le prompt système du tutoriel A (adapté : « titre du document source » → les citations de Dify), ajoutez la base dans **Context**, choisissez `gemma4:e4b`, activez l'affichage des **citations**.
3. Testez les 10 questions dans le panneau de droite, une conversation par question ; reportez les résultats dans `grille-resultats.csv`.
4. *Publish* : page web, script à intégrer ou API. Dans *Logs & Annotations*, relisez les questions posées : c'est votre futur jeu de test (leçon L049).

> 💡 Une même *Knowledge* peut alimenter plusieurs *Apps* (atelier, commercial) avec des instructions différentes.

## 5. Variante Flowise

*Document Store* : loader Markdown ou dossier, *Recursive Character Text Splitter* 1 000 / 150, aperçu, puis *Upsert* vers un vector store avec les embeddings Ollama. *Chatflow* : *Conversational Retrieval QA Chain* (ou un agent avec un outil *Retriever*), modèle de chat Ollama, *Document Store Retriever*, mémoire. Installation et licence : README de <https://github.com/FlowiseAI/Flowise>.

## Pièges fréquents

- Changer le modèle d'embeddings d'une base existante **sans la ré-indexer** : recherche incohérente.
- Un fournisseur Ollama « injoignable » : `localhost` désigne le conteneur Dify lui-même ; utilisez l'adresse de l'hôte.
