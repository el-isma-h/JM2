# Tutoriel A — n8n : le RAG au cœur d'une automatisation (30 à 45 min)

Reprend la section 1 de la leçon L048 avec les documents du lab. Mode sans clé : Ollama pour les embeddings **et** la génération.

## 1. Démarrer

```bash
cd lab-rag-sans-code
cp .env.example .env
sed -i "s/^N8N_ENCRYPTION_KEY=$/N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)/" .env   # macOS : sed -i ''
docker compose up -d
docker compose exec ollama ollama pull nomic-embed-text    # embeddings (≈ 270 Mo)
docker compose exec ollama ollama pull gemma4:e4b          # modèle de chat léger (M10)
```

Ouvrez <http://localhost:5678>, créez le compte propriétaire, puis *Credentials → Add credential → Ollama* : nom **Ollama local**, URL `http://ollama:11434` (nom du service Docker, pas `localhost`).

## 2. Workflow 1 — ingestion

1. *Workflows → Import from File* → `n8n/rag-1-ingestion.json`.
2. Ouvrez chaque nœud et vérifiez :
   - **Lire les documents** : `/home/node/lab-files/lacombe/*.md` (le dossier `documents/` est monté en lecture seule) ;
   - **Default Data Loader** : type *Binary*, métadonnées `titre` (nom du fichier), `categorie`, `date_maj` ;
   - **Recursive Character Text Splitter** : *Chunk Size* 1 000, *Chunk Overlap* 150 ;
   - **Embeddings Ollama** : `nomic-embed-text`.
3. *Execute workflow*. Le nœud *Simple Vector Store — insérer* affiche le nombre de morceaux insérés. Ouvrez sa sortie : chaque élément a `pageContent` et `metadata`.
4. Notez dans la Sticky Note le modèle d'embeddings et la date (critère de réussite).

> ⚠️ Le *Simple Vector Store* est en mémoire : après `docker compose restart`, relancez l'ingestion avant de tester. En production : PGVector ou Qdrant (voir `lab-n8n-support`).

## 3. Workflow 2 — consultation sourcée

1. Importez `n8n/rag-2-consultation.json`.
2. Vérifiez que **procedures_lacombe** utilise la même *Memory Key* (`lacombe-procedures`) et que **le même** sous-nœud *Embeddings Ollama* (`nomic-embed-text`) y est branché.
3. Lisez le *System Message* de l'agent : réponse uniquement depuis l'outil, titre du document entre crochets, refus explicite sinon.
4. *Open chat* : posez les 10 questions de `questions-test.json`, **dans l'ordre**, en ouvrant un nouveau chat entre deux questions (la *Simple Memory* mélangerait sinon les contextes).
5. Pour chaque question, ouvrez l'exécution : quels passages l'outil a-t-il renvoyés ? La bonne source est-elle parmi les 5 ? Reportez le résultat dans `grille-resultats.csv`.

## 4. Variantes à essayer (une à la fois, en mesurant)

| Variante | Comment | Ce que vous observez |
|---|---|---|
| Modèle hébergé | Remplacez *Ollama Chat Model* par *Anthropic Chat Model* (`claude-sonnet-5-5`, credential à créer) | qualité de la réponse et de la citation, coût |
| `topK` 5 → 8 | nœud *procedures_lacombe* | Q07 (réponse sur deux paragraphes) |
| *Chunk Overlap* 150 → 0 | ingestion, puis relancer | réponses coupées en milieu de liste |
| Chaîne Q&A | *Question and Answer Chain* + *Vector Store Retriever* à la place de l'agent | comportement plus déterministe, pas de mémoire |
| Mauvais embeddings | brancher un autre modèle d'embeddings sur la consultation seulement | la recherche déraille (piège de la section 1.3) |

## 5. Pièges fréquents

- **Aucun document trouvé** après un redémarrage : la base en mémoire a été vidée.
- **« model not found »** : le modèle n'a pas été téléchargé dans le conteneur Ollama (`docker compose exec ollama ollama list`).
- **Accès refusé au fichier** : le chemin n'est pas sous `N8N_RESTRICT_FILE_ACCESS_TO` (`/home/node/lab-files`).
- Les noms exacts des options évoluent avec les versions de n8n (n8n 3.0, 27 oct. 2026) : fiez-vous à la documentation plutôt qu'à une capture.
