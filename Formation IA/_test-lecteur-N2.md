# Test lecteur — Niveau 2 « Praticien » (L032 à L064)

> Relecture menée le 5 novembre 2026 dans la peau d'un **apprenant praticien non développeur** (assistante de direction ou gérant de PME, à l'aise avec Excel, n'ayant jamais écrit de code ni utilisé Docker), pour répondre à la demande du client : une formation « simplifiée et vulgarisée au maximum ».

## 1. Méthode

- Les 33 leçons du niveau 2 (`niveaux/N2-praticien/M08` à `M15`) ont été lues intégralement, dans l'ordre du parcours.
- Pour chacune ont été relevés : le jargon non expliqué à sa première apparition, les étapes de tutoriel qui supposent un savoir implicite (terminal, installation, emplacement des menus), les sauts logiques et les consignes ambiguës.
- Les améliorations sont **strictement additives** :
  - jargon → courte explication entre parenthèses ou entre tirets, insérée juste après le terme, ou renvoi « (voir le lexique) » quand le terme figure dans `glossaire/glossaire.json` ;
  - étape implicite → encadré `> 🧭 **Pas à pas pour débutant** — …` (où cliquer, quoi taper, résultat attendu, que faire si ça ne marche pas) ;
  - passage difficile sans image existante → encadré `> 💡 **Autrement dit** — …` ;
  - fin de leçon → encadré `> ✅ **Si vous ne retenez que 3 choses** — 1. … 2. … 3. …`, placé juste avant l'encadré « 🗺️ Et maintenant ? ».
- **Contrôles automatiques** sur chaque fichier, après chaque passage : le texte d'origine reste une sous-séquence exacte du nouveau texte (aucun caractère supprimé ni déplacé) ; l'en-tête YAML et tous les blocs ``` (quiz, mission, code, mermaid) sont strictement identiques à l'original. Une copie des 33 fichiers d'origine est conservée dans le dossier temporaire de travail.

## 2. Chiffres clés

| Indicateur | Valeur |
|---|---|
| Leçons relues et enrichies | 33 / 33 |
| Explications de jargon insérées dans le texte | 329 |
| Encadrés « 🧭 Pas à pas pour débutant » ajoutés | 66 |
| Encadrés « 💡 Autrement dit » ajoutés | 29 |
| Encadrés « ✅ Si vous ne retenez que 3 choses » ajoutés | 33 (aucune leçon n'en avait) |
| Volume des 33 leçons | 126 247 → 144 824 mots (+18 577  soit +15 %) |
| Phrases existantes supprimées ou réécrites | 0 |
| Blocs quiz / mission / en-têtes YAML modifiés | 0 |
| Résultat de `node scripts/validate.mjs` | ✅ Aucune erreur bloquante (184/184 leçons, 770 questions, 793 URLs) ; aucun avertissement sur L032-L064 |

## 3. Constats transversaux (ce qui bloquait le plus ce profil d'apprenant)

1. **Le terminal est présupposé partout** (L036, L037, L043, L044, L053, L059, L060, L061) sans jamais expliquer comment l'ouvrir, taper une commande ou en sortir. → Encadrés « Pas à pas » systématiques (ouvrir le terminal sous Mac/Windows, se placer dans un dossier par glisser-déposer, lire un message d'erreur).
2. **Les commandes ne fonctionnent pas sous Windows** : `curl` multi-lignes avec `\` et guillemets simples, heredoc `cat > Modelfile <<'EOF'`, commande Windows de Claude Code laissée en commentaire `# irm …`. → Alternatives sans terminal (nœud HTTP Request de n8n, navigateur, éditeur de texte) et commande Windows prête à copier.
3. **Le code Python / JavaScript arrive sans statut** (L039, L040, L043, L046, L047, L049, L056, L057, L059, L061, L062) : rien ne dit s'il faut l'exécuter, le comprendre ou peut le sauter. → Encadrés « Autrement dit » qui disent explicitement « facultatif / à survoler » et donnent **l'équivalent Excel** quand il existe (grille pondérée `SOMMEPROD`, similarité cosinus, grille d'évaluation RAG, calculateur TCO) ou **un outil graphique** (DB Browser for SQLite, Buzz pour Whisper, ComfyUI Desktop, CapCut, Netlify Drop).
4. **Le passage n8n Cloud ↔ machine locale n'est jamais expliqué** : L035 et L038 utilisent Qdrant et Ollama (installés seulement en L037 et au module 10) ; L046 ne dit pas qu'un n8n Cloud **ne peut pas joindre** l'Ollama de l'ordinateur. → Encadrés indiquant la variante « n8n Cloud » (Simple Vector Store + Embeddings OpenAI) et la règle « où tourne mon n8n ? » pour choisir l'URL.
5. **Les étapes d'interface ne disent pas où cliquer** (compteur d'items, onglet Settings, réglages du workflow, création d'une credential, Data Tables, filtres Make, publication d'un Zap, menus Projets/GPT/Gems, profil de navigateur dédié). → « Pas à pas » localisés, avec le résultat attendu et le symptôme d'échec le plus courant.
6. **Le CSV dans un Excel français** (L055) : ouvrir le fichier par double-clic met tout en colonne A ou lit `349.00` comme du texte, ce qui ruine la contre-épreuve `SOMME.SI.ENS`. → Procédure d'import *Données → À partir d'un fichier texte/CSV* et alternative Google Sheets.
7. **Les tests à date fixe de L058** reposent sur `$env.DATE_REF`, souvent bloqué sur n8n Cloud. → Méthode simple (remplacer la valeur dans la ligne de code, puis la remettre avant production).
8. **Jargon récurrent non défini à sa première apparition dans la leçon** : JSON, API, webhook, credential, codes HTTP (400, 403, 429, 5xx), OAuth, port, HTTPS, Docker / conteneur / volume, VRAM, quantization, MoE, embedding, tokens / MTok, SDK, base64, licences (MIT, Apache 2.0, CC BY-NC, AGPL), AIPD, DPO, SSO. Ces termes ont reçu une glose courte à leur première apparition dans le texte de chaque leçon concernée (jamais dans les blocs de code, laissés intacts).

## 4. Points de vigilance (non corrigés, hors périmètre)

- **Rendu dans l'application e-learning** : `app/src/components/markdown/markdown.tsx` traite tout encadré commençant par `🧭` comme un « En clair » (il affiche l'en-tête « En clair » et retire l'émoji). Les nouveaux encadrés « 🧭 **Pas à pas pour débutant** » s'afficheront donc sous l'étiquette « En clair », suivie du libellé en gras « Pas à pas pour débutant ». Le format imposé par la demande a été respecté ; l'application n'a pas été modifiée (consigne « ne touchez pas aux autres fichiers »). Les encadrés « ✅ » s'affichent comme une citation simple.
- **Export Next Formation** : `export/elearning-modules.json` n'a pas été régénéré (`scripts/build.mjs` non lancé) ; il reflète encore les leçons d'avant enrichissement.
- **Quatre encadrés sont placés juste après une phrase d'introduction se terminant par « : »** et juste avant le bloc de code qu'ils expliquent (L036 « Test depuis votre terminal », L037 « Démarrage, journaux, arrêt », L039 « Faisons le compte », L040 « Petit script ») : choix volontaire, l'encadré présentant précisément le code qui suit.
- **Informations d'interface datées** : les chemins de menus décrits (n8n, Make, Zapier, LM Studio, Dify, Claude, ChatGPT, Gemini, Chrome, CapCut, Buzz, ComfyUI Desktop, DB Browser) correspondent aux versions connues à la date de relecture ; ils sont formulés avec prudence (« ou », « selon votre version ») mais devront être revérifiés lors des mises à jour annuelles, comme le reste du contenu daté.
- **Exemple de `SKILL.md` en L051** : le bloc d'origine ne comporte pas les lignes `---` du frontmatter ; l'encadré ajouté indique à l'apprenant de les ajouter, sans modifier le bloc.

## 5. Détail par leçon

### L032 — Nœuds, expressions et structure des données (n8n Level 1 approfondi)  
*Module M08 · ajouts : 13 explications en ligne, 3 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3236 → 4015 mots*

- Jargon non expliqué à la 1re apparition : item/objet/clé `json`, JSON, API, JavaScript, Luxon, variable d'environnement, payload, types string/number/boolean, jointure/SQL, limite de débit, webhook, effet de bord, index « 0-based ».
- Étape implicite : où se trouve le « compteur d'items » et l'onglet Settings (Execute Once) dans l'éditeur ; comment ouvrir la vue des données d'un nœud.
- Étape implicite : l'exercice propose « un nœud Code qui renvoie 8 items fictifs » sans fournir ce code à un apprenant qui n'en a jamais écrit.
- Saut logique : la section 4.6 (nœud Code) suppose qu'on sait lire du JavaScript ; rien ne dit qu'on peut le copier-coller sans tout comprendre.

### L033 — n8n Level 2 : traitement d'erreurs, sous-workflows, bonnes pratiques  
*Module M08 · ajouts : 16 explications en ligne, 3 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 3237 → 3953 mots*

- Jargon non expliqué : erreur 502 / codes 429-503 / timeout, credentials, clé API, transitoire, assertion, Try/Catch, « pin » de données, en-tête, Bearer token, OAuth2, chiffré, pagination, verbes GET/POST, cron, Markdown, localhost.
- Étape implicite : « collez le JSON dans l'éditeur via Ctrl+V » — ne dit pas qu'il faut copier tout le bloc, cliquer sur le canevas vide, ni qu'il faudra créer la credential Slack avant que le nœud fonctionne.
- Étape implicite : « Settings du workflow → Error Workflow » — l'emplacement du menu n'est pas indiqué.
- Étape implicite (exercice) : création d'une Data Table et d'une credential e-mail non guidées ; « injecter un item avec quantite: -1 » suppose de savoir modifier les données épinglées.

### L034 — Les nœuds IA : AI Agent, modèles, mémoire, outils  
*Module M08 · ajouts : 14 explications en ligne, 3 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3328 → 4065 mots*

- Jargon non expliqué : *cluster node*, LangChain, « sans état », System Message, token / « contexte 1 M », ID API, erreur 400, Postgres / Redis, workers, base vectorielle, MCP, schéma d'appel d'outil, moindre privilège.
- Étape implicite : obtenir la clé API Anthropic (où la créer, crédit prépayé à prévoir) n'est jamais décrit.
- Étape implicite : comment brancher un sous-nœud sous l'AI Agent (les petits « + » sous le nœud) et où ouvrir le chat de test.
- Saut logique : le calcul de coût « 1 000 × 400 × 0,10 / 1 000 000 » est posé sans expliquer d'où vient la division par un million.

### L035 — RAG sans code : vector store et embeddings dans n8n  
*Module M08 · ajouts : 9 explications en ligne, 3 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3110 → 3653 mots*

- Jargon non expliqué : date de coupure, fichier binaire, « k chunks », PostgreSQL / extension, Rust, licence Apache 2.0, Docker / Docker Compose / conteneur, recherche hybride « dense + sparse », API REST, collection, « dimension mismatch », mémoire volatile.
- Saut logique : les schémas et l'exercice utilisent Embeddings **Ollama**, alors qu'Ollama n'est installé qu'au module 10 ; un débutant sur n8n Cloud ne peut pas suivre tel quel.
- Étape implicite : le bloc docker-compose arrive sans prévenir qu'on peut l'ignorer à ce stade (Docker est vu en leçon 37).
- Étape implicite (exercice) : comment faire entrer 5 à 8 PDF dans le workflow d'ingestion sans Google Drive n'est pas expliqué.

### L036 — Intégrations : Gmail, Slack, Google Sheets, CRM, webhooks  
*Module M08 · ajouts : 14 explications en ligne, 3 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 2943 → 3579 mots*

- Jargon non expliqué : CRM, HTTPS, Client ID / Client Secret, jeton, compte de service, HTML, Slack App / Bot Token, mapping, ERP, JWT, Digest, pagination « par curseur », code 403, SMTP.
- Étape implicite majeure : « Test depuis votre terminal » avec `curl` — l'apprenant n'a jamais ouvert de terminal ; la commande proposée (antislashs, guillemets simples) ne fonctionne pas telle quelle sous Windows/PowerShell. Aucune alternative sans terminal n'est proposée.
- Étape implicite : la création d'une application OAuth dans Google Cloud Console est décrite en une phrase ; un débutant ne sait pas qu'il peut l'éviter sur n8n Cloud.
- Étape implicite : où trouver l'URL du webhook et le bouton *Listen for test event* ; ce qu'est l'adresse `n8n.votre-domaine.fr` (à remplacer par la sienne).

### L037 — Auto-héberger n8n (Docker) et sécuriser  
*Module M08 · ajouts : 18 explications en ligne, 3 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 2926 → 3857 mots*

- Jargon non expliqué : code source disponible, VPS / vCPU, responsable de traitement, YAML, port, SQLite, reverse proxy (seulement imagé), certificat Let's Encrypt, nom de domaine / DNS, « commité », `chmod 600`, `openssl`, 2FA, cookie de session, paquets npm, SSH, pare-feu, dump, cron, stockage objet, pré-production, `127.0.0.1`.
- Étape implicite majeure : installer Docker Desktop, créer les fichiers (avec quel logiciel ? pas Word), les placer dans un dossier, ouvrir un terminal dans ce dossier puis taper les commandes — rien de cela n'est décrit.
- Étape implicite : l'exercice demande, en local, de « supprimer le service Caddy et exposer 127.0.0.1:5678:5678 » sans dire qu'il faut aussi adapter `N8N_HOST`, `N8N_PROTOCOL`, `WEBHOOK_URL` et `N8N_EDITOR_BASE_URL` (sinon les liens pointent vers un domaine inexistant).
- Saut logique : la leçon ne dit pas explicitement qu'un non-technicien peut s'arrêter à n8n Cloud et utiliser cette leçon pour dialoguer avec son prestataire informatique.
- Étape implicite : générer une clé aléatoire « avec openssl » suppose un terminal Linux/Mac.

### L038 — Projet : assistant de support client automatisé  
*Module M08 · ajouts : 6 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4352 → 4893 mots*

- Jargon non expliqué : `typeVersion`, « faux négatifs », Structured Output Parser / « could not parse », URL de reprise, heures ouvrées vs exécution « evaluation », mode formulaire de Send and Wait.
- Saut logique : le squelette importable repose sur Qdrant + Ollama (auto-hébergement, leçons 35 et 37, module 10) ; rien n'indique comment l'adapter pour un apprenant resté sur n8n Cloud.
- Étape implicite : après l'import, tous les nœuds à credential apparaissent en erreur ; il faut créer les canaux Slack `#support-validation` et `#support-escalade` et y inviter l'application.
- Étape implicite : la feuille de 10 cas de test (structure exacte, où la créer, comment la relier à l'Evaluation Trigger) n'est pas guidée pas à pas.
- Saut logique : le projet demande de tout assembler d'un coup ; aucune progression conseillée (une branche après l'autre) pour un débutant.

### L039 — Make : scénarios avec modules IA  
*Module M09 · ajouts : 11 explications en ligne, 3 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4546 → 5232 mots*

- Jargon non expliqué : « en aval », chaîne de caractères, tableau (*array*) — ambigu avec un tableau Excel —, codes 429 / 5xx / 529, transactions SQL, Google Cloud Pub/Sub, parsing, data stores, *context engineering*, « accents graves ``` ».
- Étape implicite : la syntaxe `{{1.subject}}` laisse croire qu'il faut taper ce texte ; en réalité on clique sur les jetons dans le panneau de mapping.
- Étape implicite : où cliquer pour poser un filtre sur un fil de routeur, où se trouve le bouton *Run once*, où trouver l'onglet *History*.
- Saut logique : un bloc de code Python apparaît en section 6 sans dire qu'il ne faut ni l'installer ni l'exécuter (c'est un simple calcul, faisable dans Excel).

### L040 — Zapier, comparatif et grille de choix  
*Module M09 · ajouts : 16 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4997 → 5642 mots*

- Jargon non expliqué : SaaS, open source / « étoiles GitHub », RBAC, SSO, multi-locataire, LangChain / LlamaIndex, *retriever*, DPA, sous-traitant (RGPD), clauses contractuelles / transfert hors UE, DSI, Kubernetes, vLLM, GPU, queue mode, BTS SIO.
- Étape implicite : construction du Zap (où cliquer pour créer un Zap, ajouter une étape, tester une étape) non décrite ; le chemin « Formatter → Utilities → Line-item / JSON » est ambigu.
- Saut logique : la grille pondérée est fournie sous forme de script Python, alors que le public visé la ferait naturellement dans Excel ; aucune formule tableur n'est donnée.
- Consigne ambiguë (exercice) : « notes 1-5 pour au moins quatre des cinq outils » sans indiquer comment justifier une note quand on n'a pas testé l'outil.

### L041 — Pourquoi un LLM local : confidentialité, coût, latence, souveraineté  
*Module M10 · ajouts : 14 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3487 → 4002 mots*

- Jargon non expliqué : GPU, noms de cartes (RTX 5090, H100, L40S), DGX Spark, FinOps, fine-tuning, « 8B quantifié », tok/s, TTFT / *prefill*, bande passante mémoire, modèle « frontière », milliards de paramètres, *pickle*, `safetensors` / GGUF, Hugging Face, MoE, « zéro rétention », base légale.
- Saut logique : le calcul « 13 800 heures » compare une location à un achat sans dire comment l'apprenant refait ce calcul avec ses propres chiffres sur 12 mois (consigne « faites le calcul » sans méthode).
- Leçon surtout conceptuelle : pas d'étape technique implicite majeure ; la latence (deux notions) est le passage le plus abstrait.

### L042 — Matériel : paramètres, RAM / VRAM, stockage, vitesse — Mac, PC NVIDIA, CPU, DGX Spark  
*Module M10 · ajouts : 17 explications en ligne, 1 « Pas à pas », 2 « Autrement dit », 1 « 3 choses » · 5096 → 5806 mots*

- Jargon non expliqué : RAM vs VRAM, bits / octets, FP16 / BF16 / FP8 / NVFP4 / MXFP4, fenêtre de contexte, mémoire unifiée, overhead, moteur d'inférence, « attention », pilote, SSD NVMe, FLOPS, modèle « dense », CUDA, ROCm / Vulkan, OEM, hyperscalers, MLX, vLLM / TensorRT-LLM ; commandes `ollama ps` et `llama-bench` citées sans mode d'emploi.
- Étape implicite majeure : la leçon demande de dimensionner « votre machine » sans jamais expliquer où lire sa mémoire, sa puce ou sa carte graphique (Mac : « À propos de ce Mac » ; Windows : Gestionnaire des tâches).
- Étape implicite : la bande passante de sa propre machine n'est pas une information affichée par le système ; rien n'indique où la trouver.
- Saut logique : la formule est posée de façon algébrique ; un exemple « à la calculatrice », touche par touche, aiderait un public peu à l'aise avec les formules.

### L043 — Ollama : installer, télécharger un modèle, dialoguer, API locale  
*Module M10 · ajouts : 13 explications en ligne, 4 « Pas à pas », 2 « Autrement dit », 1 « 3 choses » · 3957 → 4853 mots*

- Jargon non expliqué : licence MIT, serveur / requête HTTP, CLI, Metal, service `systemd`, tag, streaming, `top_p`, « déterministe », SDK / `pip`, Dockerfile, LoRA, `0.0.0.0`, partition ; analogie Docker (« vous allez vous sentir chez vous ») inopérante pour qui n'a jamais utilisé Docker.
- Étape implicite majeure : toute la leçon se fait dans un terminal ; ouvrir le terminal, taper une commande, reconnaître le prompt `>>>` et en sortir ne sont pas expliqués.
- Étape implicite : les exemples `curl` multi-lignes avec guillemets simples et la création du Modelfile par `cat > Modelfile <<'EOF'` ne fonctionnent pas sous Windows (PowerShell) ; aucune alternative n'est donnée.
- Étape implicite : le premier `ollama run` télécharge plusieurs Go (durée, espace disque) sans prévenir de l'attente.
- Saut logique : les sections Python et TypeScript arrivent sans indiquer qu'elles sont facultatives pour un non-développeur (seul l'exercice bonus les mentionne).

### L044 — LM Studio, Jan, Open WebUI : interfaces graphiques  
*Module M10 · ajouts : 10 explications en ligne, 3 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 2954 → 3513 mots*

- Jargon non expliqué : code fermé, « Hub » Hugging Face, framework, licences BSD-3 / AGPL-3.0, exécutable / binaire, batching continu, Transformers / ExLlama, reverse proxy, `mlx-lm`, `--network=host`, `host.docker.internal`.
- Étape implicite : le parcours LM Studio (où est l'onglet Discover, comment charger le modèle, où activer le serveur) n'est décrit qu'en une phrase.
- Étape implicite : la vérification « avec un `curl` sur `/v1/models` » peut se faire dans un simple navigateur, ce qui n'est pas dit.
- Étape implicite : pour Docker Desktop (Mac/Windows), l'apprenant doit lui-même fusionner la commande Linux et les remplacements donnés en commentaire ; la commande multi-ligne avec `\` ne passe pas sous PowerShell.

### L045 — Choisir le meilleur modèle ouvert : Llama, Qwen, Mistral, Gemma, DeepSeek, gpt-oss  
*Module M10 · ajouts : 8 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3690 → 4119 mots*

- Jargon non expliqué : noms de benchmarks (Terminal-Bench, GPQA, LiveCodeBench, MMLU, SWE-bench, AIME, OmniDocBench, Codeforces), score Elo, OSI, *function calling*, LiteRT, `reasoning_effort`, modèle « gated », ESN, notation « T » (2,8T = 2 800 milliards).
- Saut logique : la leçon martèle « testez sur vos propres documents » sans donner de protocole concret de test maison pour un non-technicien.
- Surcharge : le tableau des familles (11 lignes, chiffres de benchmarks) peut décourager ; rien ne dit ce qu'il faut en retenir.

### L046 — Brancher un LLM local sur n8n et vos applications (API compatible OpenAI)  
*Module M10 · ajouts : 6 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3802 → 4373 mots*

- Jargon non expliqué : « standard de fait », *base URL*, timeout, NVIDIA Container Toolkit, `docker exec -it`, expressions régulières (motifs IBAN/NIR du script), NIR, *Inference Providers* / endpoint, `OLLAMA_NUM_PARALLEL`.
- Saut logique majeur : la leçon ne dit pas qu'un n8n **Cloud** ne peut pas joindre un Ollama installé sur votre ordinateur (`localhost` désigne alors le serveur de n8n, pas votre machine) ; l'apprenant resté sur n8n Cloud (recommandé en L037) restera bloqué.
- Étape implicite : comment savoir si son n8n tourne « directement sur la machine », « dans Docker Desktop » ou « dans le même Compose » (et donc quelle URL choisir).
- Saut logique : les scripts Python et TypeScript de la section 4 arrivent sans indiquer qu'ils sont facultatifs pour un non-développeur ; seule l'idée du « vigile » est indispensable.

### L047 — Embeddings et recherche sémantique  
*Module M11 · ajouts : 9 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3861 → 4256 mots*

- Leçon déjà très accessible (feuille quadrillée, analogie de la bibliothèque) ; quelques termes restent non expliqués : réseau de neurones, vecteur (employé en § 4 sans rappel), interpréteur Python, BM25, recherche « plein texte », service « managé », « Go » (langage, confondable avec gigaoctet), clustering, « n.p. », IS / IR.
- Étape implicite : « collez ces lignes dans n'importe quel interpréteur Python 3.12 » — l'apprenant n'a pas Python ; aucune alternative tableur n'est proposée.
- Passage difficile : la similarité cosinus (« direction des flèches ») reste abstraite pour qui n'a pas fait de géométrie depuis longtemps.

### L048 — Construire un RAG sans code : n8n, Dify, Flowise, NotebookLM  
*Module M11 · ajouts : 9 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4197 → 4732 mots*

- Jargon non expliqué : workers / mode *queue*, `pageContent` / `metadata`, DOCX, *Top K*, seuil de score, widget, *Upsert*, OCRiser, onboarding, licence « Community ».
- Étape implicite : le tutoriel A suppose un compte Google Drive connecté ; rien n'indique comment faire entrer les fichiers sans Drive (renvoi possible au formulaire n8n de L035).
- Étape implicite : le tutoriel B (Dify) commence par « connecter un fournisseur » sans dire qu'un débutant sans Docker peut utiliser la version cloud de Dify, ni comment l'ouvrir.
- Saut logique : les réglages *Top K* et seuil de score sont donnés en valeurs sans image mentale de leur effet.

### L049 — Découpage (chunking), qualité et évaluation d'un RAG  
*Module M11 · ajouts : 8 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4077 → 4554 mots*

- Jargon non expliqué : Markdown, EPI, MDF, N·m, *exact match*, tests unitaires, fichier YAML, CSV, *noise sensitivity*, extrapolation.
- Étape implicite : « convertissez les tableaux en Markdown ou en phrases » — sans dire comment faire quand on ne connaît pas Markdown (un assistant IA peut le faire).
- Étape implicite : la grille de notation est calculée par un script Python « sans dépendance », alors que l'apprenant la tiendra naturellement dans un tableur ; aucune formule n'est donnée.
- Leçon par ailleurs bien structurée (tableau de diagnostic, jeu de 10 questions type) ; le passage le plus difficile est la distinction exactitude / fidélité.

### L050 — Projets Claude, GPT personnalisés, Gems : la connaissance embarquée  
*Module M11 · ajouts : 9 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3705 → 4144 mots*

- Leçon globalement accessible ; jargon restant : tokenizer, *long context prompting*, *prompt caching*, Files API, unités Mo / Go / To / Gio, `cited_text`, « amorces de conversation », store public, connecteurs, SIRH.
- Étape implicite : les chemins de menus (« Projets → Nouveau projet », « Explorer les GPT → Créer ») ne disent pas où se trouvent ces menus, ni que certaines fonctions exigent une offre payante.
- Passage difficile : le paragraphe « Côté API… » (Files API, file search, Collections, tarifs par Go et par jour) est très technique pour ce public, sans image pour le résumer.

### L051 — Custom GPT, Projets Claude, Copilot Studio  
*Module M12 · ajouts : 9 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3636 → 4187 mots*

- Jargon non expliqué : serveurs MCP, Markdown, en-tête / *frontmatter*, « standard ouvert », *tool use*, low-code, Power Platform / Power Automate / Dataverse, tenant, Entra ID, DLP, « halluciner », interpréteur de code.
- Étape implicite (exercice) : créer des fichiers `livret-accueil.md` et `faq-rh.md` — l'apprenant ne sait pas ce qu'est un fichier `.md` ni avec quoi l'écrire (et qu'un .docx ou .txt convient aussi).
- Passage difficile : les « Actions » décrites au format OpenAPI restent abstraites ; l'exemple `GET /disponibilites?date=…` suppose de savoir lire une requête.
- Étape implicite : la section skills montre un `SKILL.md` sans dire comment l'installer dans Claude.ai (hors exercice, mais l'apprenant voudra essayer).

### L052 — Agents multi-outils dans n8n  
*Module M12 · ajouts : 8 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3494 → 3938 mots*

- Jargon non expliqué : *agent loop*, schéma des paramètres, date ISO, OWASP, injection de prompt indirecte, MTok, mémoire épisodique, sous-agents, champ `usage`.
- Étape implicite (exercice, étape 2) : « un nœud Code qui simule une API » — aucun code fourni à un apprenant qui n'en a jamais écrit.
- Étape implicite : comment transformer un sous-workflow en outil (déclencheur à champs typés, sélection du sous-workflow dans le Call n8n Workflow Tool) n'est que mentionné.
- Passage difficile : l'injection de prompt indirecte est citée dans un « Piège fréquent » sans image du quotidien.

### L053 — Claude Code, Lovable, Bolt, v0 : créer une application sans coder  
*Module M12 · ajouts : 8 explications en ligne, 4 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 4402 → 5091 mots*

- Jargon non expliqué : IDE, git / dépôt / commit, GitHub Pages / Netlify Drop, framework, React / Tailwind, Supabase, XSS, entrée « échappée », paquets / dépendances, registrar, WSL, `cd`, `brew` / `winget`, invite.
- Étape implicite majeure : créer le dossier `devis-martin/` et le fichier `SPEC.md` (avec quel logiciel, où l'enregistrer) n'est pas expliqué.
- Étape implicite : la commande Windows est donnée **commentée** (`# irm …`) ; un débutant qui la copie telle quelle n'obtiendra rien. `cd devis-martin` suppose de savoir où se trouve ce dossier par rapport au terminal.
- Étape implicite : « publier sur GitHub Pages ou Netlify Drop » — rien n'indique la manière la plus simple (glisser-déposer sur Netlify Drop) pour un non-développeur.
- Saut logique : la vérification « onglet Réseau des outils de développement » (corrigé) suppose de savoir ouvrir ces outils (F12).

### L054 — Computer use et navigateurs IA  
*Module M12 · ajouts : 9 explications en ligne, 1 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 3151 → 3502 mots*

- Leçon accessible (analogie du stagiaire, exemple concret d'injection) ; jargon restant : extranet, version bêta, vision, *cookie banner*, arbre d'accessibilité, machine virtuelle / conteneur, CAPTCHA, injection « multimodale », RPA, macro, liste blanche.
- Étape implicite (exercice, étape 1) : « préparez un profil de navigateur dédié » sans dire comment créer un profil dans Chrome ou Edge.
- Étape implicite : l'accès à Claude in Chrome / ChatGPT agent (installation de l'extension, offre requise) n'est pas guidé.

### L055 — Analyser un fichier CSV / Excel avec ChatGPT et Claude  
*Module M13 · ajouts : 9 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3956 → 4493 mots*

- Leçon bien adaptée au public (Excel, chiffres de contrôle) ; jargon restant : CSV, encodage UTF-8, séparateur, chaîne de caractères, ISO 8601, pseudonymiser, Responses API, artefacts, `pandas`, « mémoire de travail ».
- Étape implicite majeure : « copiez le bloc dans un fichier texte nommé … (UTF-8, séparateur virgule) » — ni l'outil, ni l'option d'encodage, ni le piège de l'extension `.txt` ne sont expliqués.
- Étape implicite majeure : la contre-épreuve `SOMME.SI.ENS` suppose d'ouvrir le CSV dans un Excel français, qui affiche souvent tout dans la colonne A ou lit `349.00` comme du texte (point décimal) ; la procédure d'import n'est pas donnée.
- Passage difficile : lire un script `pandas` « sans savoir programmer » — la leçon donne des mots-clés à repérer, mais sans dire où regarder dans la réponse de l'assistant.

### L056 — Visualisations et rapports générés  
*Module M13 · ajouts : 5 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3737 → 4225 mots*

- Leçon accessible (questions → types de graphique, grille de relecture) ; jargon restant : `pandas` / `matplotlib`, `pip install`, PNG, artefact HTML / React, « reproductible », « taux d'attache », espace insécable.
- Saut logique : la section 4 présente un script Python de 70 lignes à un public non développeur ; la leçon dit « même sans être développeur » mais ne dit ni qu'on peut l'ignorer, ni comment l'exécuter si on le souhaite (installer Python, lancer la commande).
- Étape implicite (exercice, étape 4) : demander « un classeur Excel avec formules » et vérifier qu'il contient bien des formules (clic sur une cellule, barre de formule) n'est pas guidé.

### L057 — SQL en langage naturel  
*Module M13 · ajouts : 5 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3474 → 4024 mots*

- Leçon pédagogique (analogie de l'archiviste, cinq motifs de relecture) ; jargon restant : *text-to-SQL*, erreur de syntaxe, clé primaire (`PRIMARY KEY`), `CAST`, `GRANT SELECT`, `HAVING`, « vue », sorties structurées / JSON.
- Étape implicite majeure : l'exercice exige d'exécuter deux scripts Python (créer la base, tester les requêtes) ; la leçon cite DB Browser for SQLite mais ne montre pas qu'il permet de tout faire sans Python (import du CSV, onglet d'exécution SQL, ouverture en lecture seule).
- Étape implicite : « créez un fichier `requete.sql` » pour `tester_requete.py` n'est pas expliqué.
- Passage difficile : la différence `WHERE` / `HAVING` (corrigé de l'exercice e) n'est expliquée qu'en passant.

### L058 — Automatiser un reporting hebdomadaire  
*Module M13 · ajouts : 6 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4619 → 5111 mots*

- Jargon non expliqué : KPI, déterministe, UTC, nœud *QuickChart*, nœud *Execute Command*, Planificateur de tâches / cron, SDK, variable d'environnement `DATE_REF`.
- Étape implicite majeure : les tests 3 à 5 demandent de fixer `DATE_REF` (2026-06-29, 2026-05-04, 2026-08-03) ; or `$env` est souvent bloqué sur n8n Cloud et l'apprenant ne sait pas définir une variable d'environnement. Aucune méthode simple n'est donnée.
- Étape implicite : importer le CSV dans une feuille Google Sheets nommée `ventes` (menu, séparateur, nom de l'onglet) n'est pas guidé.
- Passage difficile : le second nœud Code (contrôle des chiffres, expressions régulières) est livré sans dire qu'il suffit de le coller et sans image de ce qu'il fait.

### L059 — Image : gpt-image, Midjourney, Flux et Stable Diffusion en local (ComfyUI)  
*Module M14 · ajouts : 12 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4506 → 5053 mots*

- Jargon non expliqué : DDPM, texte « encodé », Discord, LoRA, encodeur T5, VAE, images latentes, FP16 / FP8, déchargement en RAM, `git clone`, `venv`, PyTorch, base64, métadonnées de provenance, hypertrucage / *deepfake*, « fouille de textes et de données », réservation de droits « lisible par machine », CJUE.
- Étape implicite majeure : l'installation de ComfyUI est donnée en lignes de commande (git, environnement virtuel Python, pip, téléchargement Hugging Face) ; aucune voie sans terminal n'est proposée à un non-développeur.
- Saut logique : le script Python « par API » (section 4.3) n'est pas signalé comme facultatif ; l'exercice peut entièrement se faire dans ChatGPT ou Gemini.
- Leçon par ailleurs bien illustrée (sculpteur, KSampler, méthode S-S-C-L-C) ; le volet juridique (section 5) est dense mais clairement structuré.

### L060 — Vidéo : Sora, Veo, Runway, Kling  
*Module M14 · ajouts : 6 explications en ligne, 2 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 3783 → 4290 mots*

- Jargon non expliqué : architecture *transformer*, GIF, *packshot*, *motion brush*, raccords, normalisation du son / EBU R128, fichier `.srt`, `ffmpeg`, Vertex AI.
- Saut logique : l'étape 5 (montage) renvoie à un script `ffmpeg` en ligne de commande, alors que le public visé montera dans un logiciel graphique ; aucune marche à suivre n'est donnée pour assembler, sous-titrer et décliner en 9:16 sans terminal.
- Étape implicite : comment fournir l'« image de référence » (téléversement, bouton « image » de l'outil) n'est pas montré.
- Leçon par ailleurs claire (tableau des limites, storyboard type, vocabulaire de cinéma).

### L061 — Voix et audio : ElevenLabs, Whisper, Suno  
*Module M14 · ajouts : 8 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4068 → 4513 mots*

- Jargon non expliqué : endpoint, C++, « horodater », fichier SRT (à sa 1re mention dans la leçon), licence CC BY-NC 4.0 (dans le texte), donnée biométrique, tokens audio, latence, `voice_id` / SDK.
- Étape implicite majeure : « transcrire en local avec Whisper » passe uniquement par un script Python et `ffmpeg` en ligne de commande ; aucune application graphique (qui embarque Whisper) n'est proposée au non-développeur, alors que c'est l'objectif n° 2 de la leçon.
- Saut logique : le script ElevenLabs (section 3) n'est pas signalé comme facultatif ; l'interface web d'ElevenLabs suffit pour l'exercice.
- Leçon par ailleurs très concrète (trois métiers du studio, cas de fraude au faux dirigeant, clauses de consentement).

### L062 — SaaS, API ou local : coûts, risques, grille de décision  
*Module M15 · ajouts : 6 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4748 → 5207 mots*

- Leçon adaptée à un décideur (trois portes, TCO, scénarios chiffrés) ; jargon restant : MTok, jour-homme, parité, « au carré », capex, dépôt « versionné », référentiel RS7232.
- Saut logique : le « calculateur TCO » est un script Python, et l'exercice demande « adaptez `tco.py` » à un public qui travaille sous Excel ; aucune trame de tableur n'est proposée.
- Passage difficile : le calcul du seuil de bascule SaaS / API « dès une quinzaine d'utilisateurs » (scénario A) est condensé en une parenthèse.

### L063 — Politique IA interne, conformité AI Act et RGPD  
*Module M15 · ajouts : 13 explications en ligne, 1 « Pas à pas », 1 « Autrement dit », 1 « 3 choses » · 4727 → 5220 mots*

- Leçon juridique bien structurée (rôles, calendrier, classification affichable, charte type) ; jargon restant : AIPD (employée dans le tableau de la section 3 avant d'être définie en section 4), omnibus numérique, JOUE, marquage CE, annexe III, « standard de diligence », DPO, notation sociale, catégorisation biométrique, art. 9 RGPD, décision d'adéquation, ISO 27001 / SOC 2, SSO, moissonnage.
- Étape implicite : le défi « inventaire anonyme de l'IA fantôme » ne dit pas comment interroger ses collègues de façon réellement anonyme.
- Passage difficile : les quatre niveaux de risque de l'AI Act, avec leurs dates, sont présentés dans un tableau dense ; une image du quotidien aide à les mémoriser.

### L064 — Conduite du changement et montée en compétence des équipes  
*Module M15 · ajouts : 5 explications en ligne, 1 « Pas à pas », 0 « Autrement dit », 1 « 3 choses » · 2445 → 2729 mots*

- Leçon courte et accessible (salle de sport, boulangerie, carnet de vaccination) ; jargon restant : OPIIEC, ANSSI, Afpa, LMS, « sièges », utilisateurs actifs mensuels, « irritants ».
- Étape implicite : la « trace art. 4 » doit pouvoir être produite « en une heure », mais la leçon ne montre pas comment monter ce tableau (colonnes, alerte d'échéance) dans un tableur.
- Pas de saut logique majeur ; le calcul du taux d'adoption est donné en formule sans exemple chiffré.

## 6. Fichiers

- Modifiés (ajouts uniquement) : les 33 fichiers `niveaux/N2-praticien/M08…M15/L032…L064-*.md`.
- Créé : ce rapport, `_test-lecteur-N2.md`.
- Non modifiés : en-têtes YAML, blocs quiz et mission, blocs de code, `fiche.md`, `module.json`, `quiz.json`, glossaire, examens, application, exports, scripts.

## 7. Propositions optionnelles (non appliquées)

- Proposition optionnelle : dans `markdown.tsx`, reconnaître le libellé « Pas à pas pour débutant » (et « Si vous ne retenez que 3 choses ») pour leur donner un en-tête et un style propres, au lieu de l'étiquette « En clair ».
- Proposition optionnelle : régénérer l'export (`node scripts/build.mjs`) une fois la relecture validée par le client.
- Proposition optionnelle : ajouter au glossaire les termes très utilisés par ce public mais absents de `glossaire.json` : *terminal*, *localhost*, *HTTPS*, *port*, *reverse proxy*.
- Proposition optionnelle : mener le même test lecteur sur le niveau 1 et une relecture « Windows » de toutes les commandes du programme.
