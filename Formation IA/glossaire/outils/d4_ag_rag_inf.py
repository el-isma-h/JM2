# -*- coding: utf-8 -*-
from core import t

# ===================== AGENTS ET MCP =====================
t("Agent IA", "AG", "N1",
  "Programme qui utilise un LLM pour atteindre un objectif en plusieurs étapes : il planifie, choisit des outils (recherche, e-mail, base de données), observe les résultats et recommence jusqu'à ce que la tâche soit faite.",
  "Comme un assistant à qui l'on confie une mission (« organise ce déplacement ») plutôt qu'une seule question.",
  "Un agent de support lit un ticket, consulte la commande dans l'ERP, propose un remboursement et prépare la réponse au client pour validation.",
  ["boucle-agentique", "tool-use", "mcp", "human-in-the-loop"], [r"agents? IA", r"agents? d'IA", r"AI agents?", r"\*\*agents?\*\*"], "hf_agents", slug="agent-ia")
t("IA agentique", "AG", "N1",
  "Usage de l'IA où le modèle n'est plus seulement un générateur de texte mais un acteur qui enchaîne des actions de façon autonome dans des logiciels, sous contrôle humain plus ou moins étroit.",
  "Comme passer d'un conseiller qui répond aux questions à un collaborateur qui exécute les tâches.",
  "Un cabinet d'expertise comptable confie à un système agentique le rapprochement bancaire mensuel, avec validation finale par un collaborateur.",
  ["agent-ia", "boucle-agentique", "excessive-agency"], [r"agentiques?", r"agentic"], "anth_fluency", slug="ia-agentique")
t("Boucle agentique", "AG", "N3",
  "Cycle au cœur d'un agent : le modèle réfléchit, appelle un outil, lit le résultat, puis décide de la suite, jusqu'à ce que l'objectif soit atteint ou qu'une limite soit dépassée.",
  "Comme un cuisinier qui goûte, ajuste l'assaisonnement, regoûte, jusqu'à ce que le plat soit bon.",
  "Un agent de veille cherche des articles, les lit, décide d'en chercher d'autres, puis rédige la synthèse : 7 tours de boucle.",
  ["agent-ia", "react", "tool-use"], [r"boucles? agentiques?", r"agentic loop", r"agent loop"], "agentsdk", slug="boucle-agentique")
t("Outil (tool)", "AG", "N2",
  "Fonction mise à disposition d'un agent (chercher sur le web, lire un fichier, interroger un CRM, envoyer un e-mail), décrite par un nom, une description et des paramètres.",
  "Comme les instruments rangés sur l'établi d'un artisan, chacun avec son étiquette.",
  "Dans n8n, un agent reçoit les outils « Google Sheets », « Gmail » et « Calculatrice » pour gérer des relances.",
  ["tool-use", "agent-ia", "mcp"], [r"\boutils?\b", r"\btools?\b"], "n8n_agentsdo", slug="outil")
t("MCP (Model Context Protocol)", "AG", "N1",
  "Protocole ouvert, lancé par Anthropic fin 2024 et adopté par toute l'industrie, qui standardise la façon de brancher des outils et des sources de données sur un assistant ou un agent IA.",
  "Comme la prise USB-C de l'IA : un connecteur unique au lieu d'un câble différent pour chaque appareil.",
  "Un cabinet connecte Claude à son Google Drive, à son CRM et à son agenda via trois serveurs MCP, sans développement sur mesure.",
  ["serveur-mcp", "client-mcp", "tool-use", "a2a"], [r"=MCP", r"Model Context Protocol"], "mcp_intro", slug="mcp")
t("Serveur MCP", "AG", "N1",
  "Petit programme qui expose des outils, des ressources ou des prompts selon le protocole MCP, pour qu'un assistant compatible puisse les utiliser (par exemple un serveur MCP pour GitHub, Notion ou une base interne).",
  "Comme une prise murale installée dans chaque pièce, prête à recevoir l'appareil.",
  "Une PME développe un serveur MCP qui permet à Claude de consulter son catalogue produits et ses stocks en temps réel.",
  ["mcp", "client-mcp", "ressource-mcp"], [r"serveurs? MCP", r"MCP servers?"], "mcp_spec", slug="serveur-mcp")
t("Client et hôte MCP", "AG", "N3",
  "L'hôte est l'application qui accueille le modèle (Claude Desktop, Claude Code, n8n) ; le client MCP est le composant de cet hôte qui se connecte à un serveur MCP et relaie ses outils au modèle.",
  "Comme l'ordinateur (hôte) et son port USB (client) face à la clé USB (serveur).",
  "Dans n8n, le nœud MCP Client Tool joue le rôle de client pour donner à un agent les outils d'un serveur MCP distant.",
  ["serveur-mcp", "mcp"], [r"clients? MCP", r"MCP clients?", r"hôtes? MCP", r"MCP Client Tool"], "mcp_spec", slug="client-mcp")
t("Ressource et prompt MCP", "AG", "N3",
  "En plus des outils, un serveur MCP peut exposer des ressources (données à lire, comme un fichier ou une fiche client) et des prompts (modèles de consigne prêts à l'emploi).",
  "Comme une bibliothèque qui prête des livres (ressources) et propose des fiches de lecture (prompts), en plus de ses services (outils).",
  "Un serveur MCP RH expose la ressource « organigramme » et le prompt « préparer un entretien annuel ».",
  ["serveur-mcp", "mcp"], [r"ressources? MCP", r"MCP resources?", r"\bresources\b"], "mcp_spec", slug="ressource-mcp")
t("Transport MCP (stdio, HTTP streamable)", "AG", "N3",
  "Manière dont client et serveur MCP communiquent : en local par l'entrée/sortie standard (stdio) ou à distance par HTTP (« streamable HTTP »), avec authentification OAuth pour les serveurs distants.",
  "Comme parler à quelqu'un dans la même pièce ou l'appeler au téléphone.",
  "Un serveur MCP de fichiers tourne en stdio sur le poste ; celui du CRM est un serveur distant en HTTP avec OAuth.",
  ["serveur-mcp", "oauth", "sse"], [r"stdio", r"streamable HTTP", r"transports?"], "mcp_spec", slug="transport-mcp")
t("A2A (Agent-to-Agent)", "AG", "N3",
  "Protocole ouvert, initié par Google puis confié à la Linux Foundation, qui permet à des agents de fournisseurs différents de se découvrir, de se déléguer des tâches et d'échanger des résultats.",
  "Comme un langage diplomatique commun entre ambassades de pays différents.",
  "L'agent d'achats d'un industriel délègue la vérification de conformité fournisseur à l'agent juridique d'un prestataire via A2A.",
  ["mcp", "multi-agents"], [r"=A2A", r"agent-to-agent", r"Agent2Agent"], "a2a", slug="a2a")
t("Mémoire d'agent (court et long terme)", "AG", "N2",
  "Capacité d'un agent à garder des informations : à court terme dans la conversation en cours, à long terme dans une base externe (préférences, faits appris, historique) qu'il relit au besoin.",
  "Comme le carnet de bord d'un navigateur : les notes du jour et le journal des traversées passées.",
  "Un agent commercial dans n8n retient, grâce à une mémoire Postgres, les échanges précédents avec chaque prospect.",
  ["agent-ia", "compaction", "memoire-de-l-assistant"], [r"mémoire (de l'agent|d'agent|à (court|long) terme|conversationnelle)", r"\*\*mémoire\*\*", r"(Simple|Buffer|Chat|Window Buffer) Memory", r"agent memory"], "n8n_agentsdo", slug="memoire-d-agent")
t("Planification (agent)", "AG", "N3",
  "Étape où un agent découpe un objectif en sous-tâches ordonnées avant de les exécuter, et révise son plan selon les résultats obtenus.",
  "Comme dresser la liste des courses et l'itinéraire du magasin avant de partir.",
  "Pour « préparer le comité de direction », l'agent planifie : récupérer les chiffres, faire les graphiques, rédiger la note.",
  ["boucle-agentique", "decomposition", "react"], [r"planification", r"planning\b", r"planifie"], "hf_agents", slug="planification")
t("ReAct (Reason + Act)", "AG", "N3",
  "Schéma classique d'agent qui alterne raisonnement (« je dois trouver le prix ») et action (appel d'outil), puis observation du résultat, jusqu'à la réponse finale.",
  "Comme un enquêteur qui réfléchit à voix haute, vérifie un indice, puis reprend sa réflexion.",
  "Un agent de veille réglementaire raisonne, cherche le texte au Journal officiel, lit l'article, puis répond.",
  ["boucle-agentique", "chain-of-thought"], [r"ReAct"], "hf_agents", slug="react")
t("Système multi-agents", "AG", "N2",
  "Organisation de plusieurs agents spécialisés qui collaborent (chercheur, rédacteur, relecteur), coordonnés par un orchestrateur ou par des échanges directs.",
  "Comme une rédaction de journal : enquêteur, rédacteur, secrétaire de rédaction et rédacteur en chef.",
  "Une agence de contenu fait produire un livre blanc par trois agents : recherche, rédaction, vérification des sources.",
  ["orchestrateur", "sous-agent", "crewai", "a2a"], [r"multi-?agents?"], "hf_agents", slug="multi-agents")
t("Orchestrateur", "AG", "N3",
  "Agent ou programme chef d'orchestre qui reçoit la demande, la répartit entre agents ou outils spécialisés, puis assemble les résultats.",
  "Comme un chef de projet qui distribue les tâches et consolide les livrables.",
  "L'orchestrateur d'un assistant RH envoie les questions de paie à un agent, celles de congés à un autre.",
  ["multi-agents", "sous-agent", "handoff"], [r"orchestrat(eur|ion|or)"], "agentsdk", slug="orchestrateur")
t("Sous-agent (subagent)", "AG", "N3",
  "Agent secondaire lancé par un agent principal pour une sous-tâche précise, avec son propre contexte et ses propres outils, qui ne renvoie que son résultat.",
  "Comme un sous-traitant à qui l'on confie un lot du chantier.",
  "Claude Code lance un sous-agent pour explorer tout le dépôt et ne rapporter que les trois fichiers concernés.",
  ["orchestrateur", "multi-agents", "claude-code"], [r"sous-agents?", r"subagents?"], "cc_sub", slug="sous-agent")
t("Handoff (passage de relais)", "AG", "N3",
  "Mécanisme par lequel un agent transmet la conversation et la main à un autre agent plus spécialisé (concept central de l'OpenAI Agents SDK).",
  "Comme un standardiste qui transfère l'appel au bon service.",
  "L'agent d'accueil d'une banque passe la main à l'agent « crédit immobilier » dès que le client parle de prêt.",
  ["orchestrateur", "openai-agents-sdk"], [r"handoffs?", r"passages? de relais"], "oa_agents", slug="handoff")
t("Human-in-the-loop (validation humaine)", "AG", "N2",
  "Principe qui impose qu'un humain valide certaines actions d'un agent avant leur exécution (envoi d'un e-mail, paiement, suppression), ou corrige ses résultats.",
  "Comme la double signature exigée pour les gros chèques.",
  "Dans n8n, l'agent prépare la réponse à une réclamation, mais l'envoi attend le clic « Approuver » d'un conseiller dans Slack.",
  ["supervision-humaine", "excessive-agency", "agent-ia"], [r"human[- ]in[- ]the[- ]loop", r"=HITL", r"validation humaine", r"humain dans la boucle"], "n8n_hitl", slug="human-in-the-loop")
t("Agent Skills (compétences)", "AG", "N3",
  "Dossiers d'instructions, de scripts et de ressources que Claude (et d'autres agents, via un standard ouvert) charge seulement quand la tâche le demande, pour acquérir un savoir-faire spécialisé.",
  "Comme des fiches procédures rangées dans une armoire, sorties uniquement quand on en a besoin.",
  "Un cabinet crée une skill « notes de synthèse au format maison » que tous les collaborateurs utilisent dans Claude.",
  ["claude-code", "claude-md", "context-engineering"], [r"Agent Skills", r"\bskills?\b", r"SKILL\.md"], "anth_skills", slug="agent-skills")
t("CLAUDE.md (fichier de mémoire projet)", "AG", "N3",
  "Fichier texte placé dans un projet que Claude Code lit à chaque session : conventions, commandes, règles de l'équipe. AGENTS.md joue le même rôle pour d'autres agents.",
  "Comme le cahier de consignes laissé au remplaçant.",
  "Le CLAUDE.md d'une agence web indique : « Toujours utiliser pnpm, ne jamais modifier les fichiers de /legacy. »",
  ["claude-code", "agent-skills"], [r"CLAUDE\.md", r"AGENTS\.md"], "cc_mem", slug="claude-md")
t("Hooks (Claude Code)", "AG", "N3",
  "Commandes automatiques déclenchées à des moments précis du travail d'un agent (avant un outil, après une modification, en fin de session), pour imposer des règles : formatage, tests, blocage d'actions.",
  "Comme les contrôles automatiques d'une chaîne de production.",
  "Un hook lance automatiquement le formateur de code après chaque fichier modifié par Claude Code.",
  ["claude-code", "guardrails"], [r"hooks?"], "cc_hooks", slug="hooks")
t("Permissions (mode de permission)", "AG", "N3",
  "Réglages qui déterminent ce qu'un agent a le droit de faire sans demander : lire, écrire des fichiers, lancer des commandes, accéder au réseau.",
  "Comme les habilitations d'un badge : certaines portes s'ouvrent, d'autres exigent une autorisation.",
  "Une équipe autorise Claude Code à lancer les tests sans confirmation, mais lui interdit toute commande de déploiement.",
  ["moindre-privilege", "claude-code", "sandbox"], [r"permissions?"], "cc_perm", slug="permissions")
t("Claude Agent SDK", "AG", "N3",
  "Kit de développement d'Anthropic (Python, TypeScript) qui fournit la boucle d'agent de Claude Code : outils, sous-agents, MCP, gestion du contexte, pour construire ses propres agents.",
  "Comme récupérer le moteur d'une voiture de course pour l'installer dans son propre véhicule.",
  "Une start-up construit un agent d'analyse de contrats sur le Claude Agent SDK en réutilisant la lecture de fichiers et les sous-agents.",
  ["claude-code", "openai-agents-sdk", "boucle-agentique"], [r"Claude Agent SDK", r"Agent SDK"], "agentsdk")
t("OpenAI Agents SDK", "AG", "N3",
  "Bibliothèque d'OpenAI (Python, JavaScript) pour construire des agents avec outils, handoffs entre agents, garde-fous et traçage intégré.",
  "Comme une boîte à outils standard pour monter une équipe d'agents.",
  "Une néobanque construit un agent d'accueil qui passe la main à un agent « fraude » avec l'OpenAI Agents SDK.",
  ["handoff", "guardrails", "claude-agent-sdk"], [r"OpenAI Agents SDK", r"Agents SDK"], "oa_agents")
t("LangGraph", "AG", "N3",
  "Framework de l'écosystème LangChain qui modélise un agent comme un graphe d'états : des nœuds (étapes) reliés par des transitions, avec mémoire et points de validation humaine.",
  "Comme un organigramme de procédure où l'on sait à tout moment à quelle étape on se trouve.",
  "Un assureur modélise le traitement d'un sinistre en LangGraph : collecte, vérification, décision, validation humaine.",
  ["langchain", "agent-ia", "human-in-the-loop"], [r"LangGraph"], "langchain")
t("CrewAI", "AG", "N3",
  "Framework Python open source pour créer des équipes d'agents ayant chacun un rôle, un objectif et des outils, qui collaborent sur des tâches.",
  "Comme constituer une équipe projet avec des fiches de poste.",
  "Une agence marketing crée une « crew » chercheur-rédacteur-relecteur pour produire ses newsletters.",
  ["multi-agents", "autogen"], [r"CrewAI"], None)
t("AutoGen / AG2", "AG", "N3",
  "Framework multi-agents issu de Microsoft Research (AG2 en est la version communautaire) où des agents conversent entre eux pour résoudre une tâche.",
  "Comme une réunion de travail entre spécialistes qui échangent jusqu'à trouver la solution.",
  "Un laboratoire teste AutoGen pour faire dialoguer un agent « analyste » et un agent « critique » sur des données d'essai.",
  ["multi-agents", "crewai"], [r"AutoGen", r"=AG2"], "msaf", slug="autogen")
t("Pydantic AI", "AG", "N3",
  "Framework Python d'agents qui s'appuie sur Pydantic pour valider strictement les entrées et sorties typées des modèles.",
  "Comme un contrôle douanier qui vérifie chaque colis entrant et sortant.",
  "Un éditeur de logiciel comptable garantit avec Pydantic AI que chaque écriture proposée par l'agent a un compte et un montant valides.",
  ["sorties-structurees", "agent-ia"], [r"Pydantic AI", r"Pydantic"], None)
t("smolagents", "AG", "N3",
  "Bibliothèque minimaliste de Hugging Face pour créer des agents, dont des « code agents » qui écrivent du code Python pour agir.",
  "Comme un kit d'initiation compact pour fabriquer ses premiers agents.",
  "Un apprenant construit avec smolagents un agent qui interroge l'open data de la SNCF.",
  ["agent-ia", "hugging-face"], [r"smolagents"], "smolagents")
t("Computer use (pilotage d'ordinateur)", "AG", "N2",
  "Capacité d'un modèle à utiliser un ordinateur comme un humain : il regarde des captures d'écran, déplace la souris, clique et tape au clavier.",
  "Comme un collègue à qui vous prêtez votre poste et qui suit la procédure à l'écran.",
  "Un agent remplit automatiquement des déclarations sur un vieux portail administratif sans API.",
  ["navigateur-ia", "agent-ia", "rpa"], [r"computer use", r"pilot(age|er) (d'|un )ordinateur"], None, slug="computer-use")
t("Navigateur IA (agentique)", "AG", "N2",
  "Navigateur web ou extension où un agent peut naviguer, lire et agir sur les sites à votre place (remplir un formulaire, comparer des offres).",
  "Comme un assistant qui surfe pour vous pendant que vous regardez par-dessus son épaule.",
  "Un acheteur demande au navigateur IA de comparer les tarifs de trois fournisseurs de papeterie et de remplir le panier.",
  ["computer-use", "prompt-injection-indirecte"], [r"navigateurs? (IA|agentiques?)", r"AI browsers?", r"Comet", r"ChatGPT Atlas"], None, slug="navigateur-ia")
t("Managed Agents (Anthropic)", "AG", "N3",
  "Service d'Anthropic qui héberge et exécute des agents Claude dans l'infrastructure de l'éditeur (sessions, outils, environnement), sans avoir à gérer soi-même les serveurs.",
  "Comme louer une équipe avec bureaux et matériel plutôt que de tout installer chez soi.",
  "Une start-up déploie un agent de qualification de leads via Managed Agents pour éviter de maintenir sa propre boucle d'agent.",
  ["claude-agent-sdk", "agent-ia"], [r"Managed Agents"], "anth_managed", slug="managed-agents")
t("Copilot Studio", "AG", "N2",
  "Outil low-code de Microsoft pour créer des assistants et agents connectés à Microsoft 365, SharePoint, Teams et Dataverse.",
  "Comme un atelier de montage d'assistants pour les entreprises sous Microsoft.",
  "Une DRH crée dans Copilot Studio un agent qui répond aux questions des salariés à partir des politiques RH stockées sur SharePoint.",
  ["custom-gpt", "no-code", "copilot-microsoft"], [r"Copilot Studio"], None)
t("Agent Builder (constructeur d'agents)", "AG", "N2",
  "Interface visuelle (chez n8n, OpenAI, Make, Zapier…) qui permet de configurer un agent en choisissant instructions, modèle et outils sans écrire de code.",
  "Comme un formulaire de recrutement où l'on décrit le poste et l'agent est « embauché » aussitôt.",
  "Un responsable support crée en 30 minutes, dans un Agent Builder, un agent qui répond aux questions de livraison.",
  ["agent-ia", "no-code"], [r"Agent Builder"], "n8n_agentsdo", slug="agent-builder")

# ===================== RAG =====================
t("RAG (Retrieval-Augmented Generation)", "RAG", "N2",
  "Génération augmentée par récupération : avant de répondre, le système va chercher les passages pertinents dans vos documents et les fournit au modèle, qui répond en s'appuyant dessus. On obtient des réponses à jour, sourcées et propres à l'entreprise.",
  "Comme un examen à livre ouvert : l'élève cherche d'abord la bonne page, puis répond.",
  "Le chatbot RH d'une PME répond sur les congés en s'appuyant sur l'accord d'entreprise, et cite le paragraphe concerné.",
  ["embedding", "base-vectorielle", "chunking", "hallucination"], [r"=RAG", r"retrieval[- ]augmented", r"génération augmentée"], "rag_paper", slug="rag")
t("Embedding (plongement vectoriel)", "RAG", "N2",
  "Représentation d'un texte (ou d'une image) sous forme d'une liste de nombres qui capture son sens : deux textes proches en sens ont des embeddings proches.",
  "Comme les coordonnées GPS d'une idée : les idées voisines sont proches sur la carte.",
  "« Comment poser un congé ? » et « procédure de demande de vacances » obtiennent des embeddings très proches, même sans mot commun.",
  ["recherche-semantique", "similarite-cosinus", "base-vectorielle"], [r"embeddings?", r"plongements?"], "oa_emb", slug="embedding")
t("Recherche sémantique", "RAG", "N2",
  "Recherche par le sens plutôt que par les mots exacts : on compare l'embedding de la question à ceux des documents pour trouver les passages qui parlent de la même chose.",
  "Comme un bibliothécaire qui comprend ce que vous cherchez même si vous n'avez pas le bon titre.",
  "Un technicien tape « la chaudière fait un bruit de claquement » et retrouve la fiche « coups de bélier dans le circuit ».",
  ["embedding", "recherche-hybride", "recherche-lexicale"], [r"recherche sémantique", r"semantic search"], "n8n_vec", slug="recherche-semantique")
t("Similarité cosinus", "RAG", "N2",
  "Mesure de proximité entre deux embeddings, fondée sur l'angle entre les vecteurs : 1 = même sens, 0 = sans rapport.",
  "Comme mesurer si deux flèches pointent dans la même direction, quelle que soit leur longueur.",
  "La question d'un client obtient 0,87 de similarité avec l'article de FAQ « délais de livraison » : c'est lui qu'on retient.",
  ["embedding", "produit-scalaire", "recherche-semantique"], [r"similarités? cosinus", r"cosine similarity", r"cosinus"], "oa_emb", slug="similarite-cosinus")
t("Base vectorielle (vector store)", "RAG", "N2",
  "Base de données spécialisée qui stocke des embeddings et retrouve très vite les plus proches d'une question, même parmi des millions.",
  "Comme une carte où chaque document est une punaise, et où l'on trouve instantanément les punaises voisines d'un point.",
  "Une PME stocke les embeddings de ses 4 000 fiches produits dans Qdrant pour alimenter son assistant commercial.",
  ["embedding", "pgvector", "qdrant", "chroma", "index-vectoriel"], [r"bases? vectorielles?", r"vector stores?", r"vector databases?", r"bases? de données vectorielles?"], "n8n_vec", slug="base-vectorielle")
t("Index vectoriel (HNSW, ANN)", "RAG", "N3",
  "Structure de données qui accélère la recherche des vecteurs les plus proches en acceptant une infime approximation (recherche ANN). HNSW est l'algorithme le plus répandu.",
  "Comme les panneaux de quartier d'une grande ville : on ne fouille pas chaque rue, on se dirige vite vers la bonne zone.",
  "Avec un index HNSW, la recherche parmi 2 millions de passages juridiques passe de 3 secondes à 20 millisecondes.",
  ["base-vectorielle", "pgvector"], [r"HNSW", r"=ANN", r"index(es)? vectoriels?", r"approximate nearest"], None, slug="index-vectoriel")
t("Chunking (découpage)", "RAG", "N2",
  "Découpage des documents en morceaux (chunks) de taille raisonnable avant de calculer leurs embeddings. La qualité du découpage conditionne fortement la qualité du RAG.",
  "Comme découper un livre en fiches de révision : trop petites, on perd le contexte ; trop grandes, on noie l'essentiel.",
  "Un règlement intérieur de 40 pages est découpé par article, avec 50 tokens de chevauchement entre morceaux.",
  ["chevauchement", "ingestion", "metadonnees"], [r"chunking", r"découpage", r"chunks?", r"morceaux"], "n8n_rag", slug="chunking")
t("Chevauchement (chunk overlap)", "RAG", "N2",
  "Portion de texte répétée entre deux morceaux consécutifs pour qu'une idée coupée en deux ne soit pas perdue.",
  "Comme les quelques mots répétés en bas et en haut de page dans les anciens livres.",
  "Avec des chunks de 800 tokens et 100 de chevauchement, la phrase à cheval sur deux morceaux reste lisible dans l'un d'eux.",
  ["chunking"], [r"chevauchement", r"overlap"], "n8n_rag", slug="chevauchement")
t("Métadonnées", "RAG", "N2",
  "Informations sur un document ou un morceau (titre, date, auteur, service, niveau de confidentialité) stockées avec lui pour filtrer la recherche et citer la source.",
  "Comme l'étiquette sur la tranche d'un classeur : on sait ce qu'il contient sans l'ouvrir.",
  "Le RAG d'un groupe hospitalier ne cherche que dans les protocoles « en vigueur » et du service de l'utilisateur, grâce aux métadonnées.",
  ["chunking", "ingestion", "catalogue-de-donnees"], [r"métadonnées", r"metadata"], "n8n_vec", slug="metadonnees")
t("Ingestion (pipeline d'ingestion)", "RAG", "N3",
  "Chaîne de traitement qui prépare les documents pour un RAG : collecte, extraction du texte, nettoyage, découpage, ajout des métadonnées, calcul des embeddings et stockage.",
  "Comme la chaîne de préparation d'un entrepôt : réception, contrôle, étiquetage, rangement.",
  "Chaque nuit, un pipeline ingère les nouveaux comptes rendus déposés dans SharePoint et met à jour la base vectorielle.",
  ["parsing", "chunking", "pipeline-de-donnees"], [r"ingestion", r"ingérer"], None, slug="ingestion")
t("Parsing (extraction de documents)", "RAG", "N3",
  "Extraction propre du texte et de la structure (titres, tableaux, listes) depuis des PDF, Word, pages web ou scans, avant le découpage.",
  "Comme dépouiller le courrier : ouvrir chaque enveloppe et classer correctement son contenu.",
  "Un parseur mal réglé mélange les colonnes d'un tableau tarifaire PDF ; un meilleur outil restitue chaque ligne correctement.",
  ["ingestion", "ocr", "chunking"], [r"parsing", r"parseurs?", r"parsers?"], None, slug="parsing")
t("Recherche lexicale (BM25)", "RAG", "N3",
  "Recherche classique par mots-clés, qui classe les documents selon la présence et la rareté des termes de la question. BM25 en est l'algorithme de référence. Elle excelle sur les références exactes (numéros, noms).",
  "Comme l'index alphabétique à la fin d'un livre.",
  "Chercher « article L1234-9 » fonctionne mieux en BM25 qu'en recherche sémantique.",
  ["recherche-hybride", "recherche-semantique"], [r"BM25", r"recherche lexicale", r"mots-clés", r"plein texte", r"full-text"], None, slug="recherche-lexicale")
t("Recherche hybride", "RAG", "N3",
  "Combinaison de la recherche sémantique (par le sens) et de la recherche lexicale (par mots-clés) pour profiter des forces des deux.",
  "Comme demander à la fois au bibliothécaire et consulter l'index du livre.",
  "Le RAG d'un éditeur juridique retrouve à la fois les textes qui parlent de « rupture conventionnelle » et ceux qui citent exactement « L1237-11 ».",
  ["recherche-lexicale", "recherche-semantique", "reranking"], [r"recherche hybride", r"hybrid search"], None, slug="recherche-hybride")
t("Reranking (reclassement)", "RAG", "N3",
  "Seconde étape de recherche où un modèle spécialisé relit les 20 à 50 premiers passages trouvés et les reclasse par pertinence réelle avant de garder les meilleurs.",
  "Comme un jury final qui départage les finalistes après une présélection rapide.",
  "Un reranker fait remonter en tête l'article précis sur le télétravail que la recherche vectorielle avait classé 9e.",
  ["recherche-hybride", "top-k-recuperation"], [r"rerank(ing|er)?", r"reclassement"], None, slug="reranking")
t("Top-k (récupération)", "RAG", "N2",
  "Nombre de passages les plus proches que le système récupère pour les donner au modèle (souvent 3 à 10). Trop peu, on manque l'information ; trop, on noie le modèle.",
  "Comme le nombre de livres que le bibliothécaire pose sur votre table.",
  "En passant de top-k = 3 à 6, le chatbot d'une mutuelle répond enfin correctement aux questions qui croisent deux garanties.",
  ["reranking", "chunking", "rag"], [r"top[-_ ]?k"], "n8n_rag", slug="top-k-recuperation")
t("Multi-query (requêtes multiples)", "RAG", "N3",
  "Technique où le modèle reformule la question de l'utilisateur en plusieurs variantes, lance une recherche pour chacune, puis fusionne les résultats.",
  "Comme poser la même question à plusieurs collègues avec des mots différents pour être sûr de ne rien rater.",
  "« Puis-je partir plus tôt vendredi ? » devient aussi « horaires variables » et « récupération d'heures » pour trouver tous les textes utiles.",
  ["recherche-hybride", "rag"], [r"multi-?query", r"requêtes multiples", r"reformul"], None, slug="multi-query")
t("GraphRAG", "RAG", "N3",
  "Variante de RAG qui construit un graphe de connaissances (entités et relations) à partir des documents, pour répondre aux questions qui demandent de relier plusieurs informations.",
  "Comme un tableau d'enquête avec photos et fils rouges entre les personnes et les lieux.",
  "Un cabinet d'audit retrouve tous les liens entre filiales, dirigeants et contrats éparpillés dans 300 documents.",
  ["rag", "base-de-connaissances"], [r"GraphRAG", r"graphes? de connaissances", r"knowledge graph"], None, slug="graphrag")
t("Base de connaissances", "RAG", "N2",
  "Ensemble organisé de documents de référence d'une organisation (procédures, FAQ, contrats, fiches produits) que les personnes et les assistants IA consultent.",
  "Comme la bibliothèque interne d'une entreprise, bien rangée.",
  "La base de connaissances d'un éditeur de logiciel alimente à la fois son centre d'aide et son chatbot RAG.",
  ["rag", "projet-claude", "notebooklm"], [r"bases? de connaissances?", r"knowledge base"], "n8n_rag", slug="base-de-connaissances")
t("pgvector", "RAG", "N3",
  "Extension de la base de données PostgreSQL qui lui ajoute le stockage et la recherche de vecteurs. Elle permet de faire du RAG sans nouvelle base à administrer.",
  "Comme ajouter un tiroir spécialisé à un meuble que vous avez déjà.",
  "Un éditeur SaaS qui utilise déjà PostgreSQL (Supabase) ajoute pgvector pour son assistant documentaire.",
  ["base-vectorielle", "qdrant", "chroma"], [r"pgvector", r"Supabase"], None)
t("Chroma", "RAG", "N3",
  "Base vectorielle open source très simple à installer, appréciée pour les prototypes et les petits projets de RAG en Python.",
  "Comme un carnet d'adresses de poche pour vos embeddings.",
  "Un apprenant monte en dix minutes un RAG sur les 50 PDF de son module de formation avec Chroma.",
  ["base-vectorielle", "pgvector", "qdrant"], [r"Chroma(DB)?"], None)
t("Qdrant", "RAG", "N3",
  "Base vectorielle open source performante, écrite en Rust, auto-hébergeable ou en service managé, avec filtrage avancé par métadonnées.",
  "Comme un entrepôt automatisé conçu spécialement pour retrouver des vecteurs.",
  "Une PME héberge Qdrant dans Docker à côté de n8n pour le RAG de son support client.",
  ["base-vectorielle", "pgvector", "metadonnees"], [r"Qdrant"], None)
t("LangChain", "RAG", "N3",
  "Framework open source (Python, JavaScript) qui fournit des briques pour construire des applications LLM : connecteurs de modèles, chargeurs de documents, RAG, outils, agents. Les nœuds IA de n8n s'appuient dessus.",
  "Comme une grande boîte de Lego pour assembler des applications IA.",
  "Un développeur assemble en LangChain un pipeline qui charge des PDF, les découpe, les indexe et répond aux questions.",
  ["llamaindex", "langgraph", "rag"], [r"LangChain"], "langchain")
t("LlamaIndex", "RAG", "N3",
  "Framework open source centré sur la connexion des LLM à vos données : ingestion, indexation et interrogation de documents pour le RAG.",
  "Comme un documentaliste qui indexe toutes vos archives pour qu'on y trouve tout.",
  "Un cabinet d'architectes indexe ses CCTP avec LlamaIndex pour interroger ses anciens projets.",
  ["langchain", "rag", "ingestion"], [r"LlamaIndex"], None)
t("Ragas", "RAG", "N3",
  "Bibliothèque open source d'évaluation des RAG qui mesure notamment la fidélité de la réponse aux sources et la pertinence des passages récupérés.",
  "Comme un inspecteur qui vérifie à la fois que les bons livres ont été sortis et que la réponse les cite correctement.",
  "Une équipe suit chaque semaine les scores Ragas de son RAG documentaire après chaque ajout de documents.",
  ["fidelite", "eval", "deepeval"], [r"Ragas"], "ragas")
t("Fidélité (faithfulness)", "RAG", "N3",
  "Métrique d'évaluation d'un RAG : la réponse ne contient-elle que des affirmations justifiées par les passages récupérés ? Une faible fidélité signale des hallucinations.",
  "Comme vérifier qu'un compte rendu ne dit rien que l'orateur n'a pas dit.",
  "Le chatbot d'une collectivité obtient 0,72 en fidélité : il ajoute des délais qui ne figurent pas dans les délibérations.",
  ["ragas", "hallucination", "pertinence-du-contexte"], [r"fidélité", r"faithfulness"], "ragas", slug="fidelite")
t("Pertinence du contexte (context precision / recall)", "RAG", "N3",
  "Métriques qui vérifient si les passages récupérés sont bien utiles à la question (précision) et si tous les passages nécessaires ont été trouvés (rappel).",
  "Comme juger le bibliothécaire : a-t-il apporté les bons livres, et tous les bons livres ?",
  "Un audit Ragas révèle que le RAG d'une banque récupère souvent la grille tarifaire de l'an dernier.",
  ["fidelite", "precision-et-rappel", "ragas"], [r"context (precision|recall)", r"pertinence du contexte", r"context relevance"], "ragas", slug="pertinence-du-contexte")
t("Dify", "RAG", "N2",
  "Plateforme open source, auto-hébergeable, pour créer visuellement des applications LLM : chatbots RAG, workflows et agents.",
  "Comme un atelier visuel pour monter son assistant documentaire sans coder.",
  "Une école crée dans Dify un assistant qui répond aux questions des étudiants à partir du règlement des études.",
  ["flowise", "rag", "no-code"], [r"Dify"], "dify")
t("Flowise", "RAG", "N2",
  "Outil open source de construction visuelle d'applications LLM, fondé sur LangChain, où l'on relie des blocs pour créer un chatbot RAG ou un agent.",
  "Comme un schéma électrique qu'on câble à la souris.",
  "Un consultant prototype un chatbot sur la documentation d'un ERP en reliant six blocs Flowise.",
  ["dify", "langchain", "no-code"], [r"Flowise", r"Langflow"], "flowise")

# ===================== LLM LOCAUX, MATÉRIEL, MLOPS =====================
t("LLM local", "INF", "N2",
  "Modèle de langage à poids ouverts exécuté sur sa propre machine ou son propre serveur, sans envoyer les données à un fournisseur. Avantages : confidentialité, coût fixe, fonctionnement hors ligne.",
  "Comme avoir sa propre cuisine au lieu de commander chez un traiteur : vous maîtrisez tout, mais vous gérez le matériel.",
  "Un cabinet d'avocats résume ses dossiers clients avec un modèle sur un Mac Studio du cabinet, sans qu'aucune donnée ne sorte.",
  ["ollama", "vram", "quantization", "modele-a-poids-ouverts"], [r"LLM locaux?", r"modèles? locaux?", r"en local", r"local LLM"], "ollama", slug="llm-local")
t("Ollama", "INF", "N2",
  "Logiciel libre qui télécharge et fait tourner des LLM ouverts en une commande, avec une API locale compatible OpenAI. C'est le point d'entrée le plus simple du local.",
  "Comme un « Docker pour LLM » : ollama run et le modèle tourne.",
  "Un formateur installe Ollama sur son portable et lance un modèle de 8B pour animer un atelier sans connexion Internet.",
  ["llm-local", "lm-studio", "gguf", "api-compatible-openai"], [r"Ollama"], "ollama")
t("LM Studio", "INF", "N2",
  "Application de bureau gratuite pour rechercher, télécharger et discuter avec des modèles locaux, avec un serveur API intégré compatible OpenAI.",
  "Comme un lecteur multimédia, mais pour les modèles de langage.",
  "Une assistante de direction teste trois modèles locaux dans LM Studio avant que la DSI n'en déploie un.",
  ["ollama", "jan", "llm-local"], [r"LM Studio"], "lmstudio", slug="lm-studio")
t("Jan", "INF", "N2",
  "Application open source de chat avec des modèles locaux (et distants), pensée pour fonctionner hors ligne et respecter la vie privée.",
  "Comme un ChatGPT installé sur son propre ordinateur.",
  "Un journaliste utilise Jan en local pour retravailler des notes d'entretien confidentielles.",
  ["lm-studio", "ollama"], [r"\bJan\b"], "jan")
t("Open WebUI", "INF", "N2",
  "Interface web open source au style de ChatGPT, auto-hébergée, qui se branche sur Ollama ou une API et gère plusieurs utilisateurs, documents et outils.",
  "Comme une vitrine commune devant la cuisine Ollama.",
  "Une PME de 30 personnes offre à ses salariés un « ChatGPT interne » avec Open WebUI et Ollama sur un serveur du bureau.",
  ["ollama", "llm-local"], [r"Open WebUI"], "openwebui", slug="open-webui")
t("llama.cpp", "INF", "N2",
  "Moteur d'inférence open source écrit en C/C++ qui fait tourner des LLM quantifiés sur CPU, GPU ou Mac. Il est au cœur d'Ollama et de LM Studio.",
  "Comme le moteur caché sous le capot de plusieurs voitures de marques différentes.",
  "Un ingénieur fait tourner un modèle de 4B sur un Raspberry Pi avec llama.cpp pour une borne d'accueil.",
  ["gguf", "quantization", "ollama"], [r"llama\.cpp"], "vllm", slug="llama-cpp")
t("GGUF", "INF", "N2",
  "Format de fichier des modèles quantifiés utilisé par llama.cpp, Ollama et LM Studio. Le nom indique souvent le niveau de compression (Q4_K_M, Q8_0…).",
  "Comme le format MP3 de la musique : compressé, facile à partager, lisible partout.",
  "Un développeur télécharge la version Q4_K_M d'un modèle en GGUF : 5 Go au lieu de 16.",
  ["quantization", "llama-cpp"], [r"GGUF", r"Q4_K_M", r"Q8_0"], None, slug="gguf")
t("Quantization (quantification)", "INF", "N2",
  "Technique qui réduit la précision des poids d'un modèle (de 16 bits à 8 ou 4 bits) pour qu'il prenne beaucoup moins de mémoire et tourne plus vite, au prix d'une légère perte de qualité.",
  "Comme compresser une photo en JPEG : beaucoup plus légère, presque aussi belle.",
  "Quantifié en 4 bits, un modèle de 27B tient dans 16 Go de VRAM au lieu de 54.",
  ["gguf", "vram", "precision-numerique", "qlora"], [r"quanti(zation|fication|fié|fiés|sé)", r"quantiz"], "unsloth", slug="quantization")
t("Précision numérique (FP16, BF16, INT8, 4 bits)", "INF", "N4",
  "Nombre de bits utilisés pour stocker chaque poids. 16 bits (FP16, BF16) est la précision habituelle ; 8 et 4 bits sont des versions quantifiées, plus légères.",
  "Comme mesurer au millimètre ou au centimètre : plus fin, mais plus encombrant à noter.",
  "Un modèle de 8B pèse environ 16 Go en BF16 et 4,5 Go en 4 bits.",
  ["quantization", "vram"], [r"FP16", r"BF16", r"FP8", r"INT8", r"\b4 bits\b"], "cs336", slug="precision-numerique")
t("VRAM", "INF", "N2",
  "Mémoire vive de la carte graphique (Video RAM). Pour tourner vite, un modèle doit tenir entièrement en VRAM, avec en plus la place du contexte. C'est le critère n° 1 pour choisir son matériel.",
  "Comme le plan de travail du cuisinier : si tous les ingrédients n'y tiennent pas, il perd son temps à aller au frigo.",
  "Une carte de 24 Go de VRAM fait tourner confortablement un modèle de 27B quantifié en 4 bits.",
  ["gpu", "ram-unifiee", "quantization", "kv-cache"], [r"VRAM"], None, slug="vram")
t("RAM unifiée (Apple Silicon, AMD Strix Halo)", "INF", "N2",
  "Architecture où processeur et carte graphique partagent la même mémoire. Un Mac avec 64 ou 128 Go de RAM unifiée peut ainsi charger des modèles qu'aucune carte grand public ne pourrait contenir.",
  "Comme une cuisine ouverte où toute l'équipe partage le même grand plan de travail.",
  "Un bureau d'études fait tourner un modèle MoE de 120B sur un Mac Studio de 128 Go de RAM unifiée.",
  ["vram", "apple-silicon-mlx", "gpu"], [r"(RAM|mémoire) unifiée", r"unified memory", r"Strix Halo"], "mlx", slug="ram-unifiee")
t("GPU (processeur graphique)", "INF", "N2",
  "Processeur conçu à l'origine pour l'affichage, capable de faire des milliers de calculs en parallèle. C'est l'outil indispensable pour entraîner et faire tourner des modèles d'IA.",
  "Comme une armée de milliers de calculatrices qui travaillent en même temps, face à un seul mathématicien très rapide (le CPU).",
  "Une agence loue un GPU H100 à l'heure chez Scaleway pour affiner un modèle pendant une nuit.",
  ["vram", "cuda", "cpu", "gpu-cloud"], [r"GPU", r"cartes? graphiques?", r"processeurs? graphiques?"], "scaleway_gpu", slug="gpu")
t("CPU (processeur central)", "INF", "N2",
  "Processeur principal d'un ordinateur, polyvalent mais peu parallèle. Il peut faire tourner de petits modèles, lentement.",
  "Comme un artisan très habile mais seul, face à une équipe de manœuvres (le GPU).",
  "Sur un vieux portable sans GPU, un modèle de 3B génère 5 tokens par seconde sur CPU : utilisable pour un essai, pas pour un service.",
  ["gpu", "npu"], [r"=CPU", r"processeurs? central"], None, slug="cpu")
t("NPU (Neural Processing Unit)", "INF", "N4",
  "Puce spécialisée dans les calculs d'IA, intégrée aux ordinateurs portables et téléphones récents, très économe en énergie pour faire tourner de petits modèles.",
  "Comme un petit moteur électrique d'appoint, sobre et silencieux, à côté du moteur principal.",
  "Un PC « Copilot+ » transcrit les réunions localement grâce à son NPU, sans vider la batterie.",
  ["edge-ai", "cpu", "slm"], [r"NPU"], "litert", slug="npu")
t("CUDA", "INF", "N3",
  "Plateforme logicielle de NVIDIA qui permet de programmer ses GPU. La quasi-totalité des outils d'IA (PyTorch, vLLM) l'utilisent, d'où la domination de NVIDIA.",
  "Comme la langue officielle des cartes graphiques NVIDIA.",
  "Avant d'installer vLLM, un administrateur vérifie la version de CUDA du serveur.",
  ["gpu", "pytorch", "vllm"], [r"CUDA"], None, slug="cuda")
t("Apple Silicon et MLX", "INF", "N2",
  "Les puces Apple (M1 à M5) combinent CPU, GPU et RAM unifiée ; MLX est la bibliothèque d'Apple optimisée pour y faire tourner et affiner des modèles.",
  "Comme une cuisine compacte mais très bien organisée.",
  "Une graphiste génère des images Flux en 4 bits sur son MacBook M5 avec MLX.",
  ["ram-unifiee", "llm-local"], [r"Apple Silicon", r"\bMLX\b", r"\bM[1-5] (Pro|Max|Ultra)\b", r"Mac Studio"], "mlx", slug="apple-silicon-mlx")
t("DGX Spark", "INF", "N2",
  "Mini-ordinateur de NVIDIA (puce GB10, 128 Go de mémoire unifiée) conçu pour faire tourner et affiner de gros modèles sur un bureau, sans datacenter.",
  "Comme un petit laboratoire d'IA posé à côté de l'écran.",
  "Un cabinet de conseil fait tourner un modèle de 120B et des agents de sécurité en interne sur un DGX Spark.",
  ["ram-unifiee", "gpu", "on-premise"], [r"DGX Spark", r"GB10"], None, slug="dgx-spark")
t("Tokens par seconde", "INF", "N2",
  "Vitesse de génération d'un modèle. Au-delà d'environ 15 à 20 tokens/s, la lecture paraît fluide pour un humain ; les agents et traitements en masse en demandent bien plus.",
  "Comme la vitesse de frappe d'une dactylo.",
  "Sur une RTX 4090, un modèle de 8B quantifié produit environ 100 tokens/s ; sur un portable sans GPU, 10.",
  ["latence", "ttft", "debit"], [r"tokens? ?(par seconde|/ ?s)", r"tok/s"], None, slug="tokens-par-seconde")
t("Débit (throughput)", "INF", "N4",
  "Quantité totale de tokens ou de requêtes qu'un serveur d'inférence traite par seconde, tous utilisateurs confondus. On l'améliore surtout par le batching.",
  "Comme le nombre de clients servis par heure dans un restaurant, et non la vitesse d'un seul service.",
  "Grâce au batching continu, un serveur vLLM sert 40 utilisateurs simultanés au lieu de 4.",
  ["batching", "tokens-par-seconde", "vllm"], [r"débit", r"throughput"], None, slug="debit")
t("KV cache", "INF", "N4",
  "Mémoire où le modèle garde les calculs d'attention (clés et valeurs) des tokens déjà lus, pour ne pas les refaire à chaque nouveau token. Il accélère beaucoup la génération mais consomme de la VRAM, d'autant plus que le contexte est long.",
  "Comme garder ses notes de lecture au lieu de relire tout le livre à chaque nouvelle page.",
  "Avec 128 000 tokens de contexte, le KV cache d'un modèle de 8B occupe plusieurs Go de VRAM en plus des poids.",
  ["self-attention", "vram", "pagedattention", "prompt-caching"], [r"KV[- ]cache", r"cache KV", r"clés[- ]valeurs"], "cs336", slug="kv-cache")
t("Batching continu (continuous batching)", "INF", "N4",
  "Technique des serveurs d'inférence qui regroupe dynamiquement les requêtes de plusieurs utilisateurs pour les traiter ensemble sur le GPU, en ajoutant et retirant des requêtes à la volée.",
  "Comme un bus qui prend et dépose des passagers à chaque arrêt au lieu d'attendre d'être plein pour partir.",
  "Un intégrateur sert 50 collaborateurs avec un seul GPU grâce au batching continu de vLLM.",
  ["vllm", "debit", "kv-cache"], [r"batching", r"continuous batching"], "vllm", slug="batching")
t("PagedAttention", "INF", "N4",
  "Technique de vLLM qui gère le KV cache par petits blocs (comme la mémoire paginée d'un système d'exploitation) pour éviter le gaspillage de VRAM et servir plus d'utilisateurs.",
  "Comme ranger les affaires de chaque client dans des casiers standard plutôt que de réserver une armoire entière par personne.",
  "Grâce à PagedAttention, un serveur double le nombre de conversations simultanées sur la même carte.",
  ["kv-cache", "vllm", "batching"], [r"PagedAttention"], "vllm", slug="pagedattention")
t("Speculative decoding (décodage spéculatif)", "INF", "N4",
  "Technique d'accélération où un petit modèle propose plusieurs tokens d'avance et le grand modèle les vérifie d'un coup, en gardant ceux qu'il aurait lui-même choisis.",
  "Comme un assistant qui prépare le brouillon d'une lettre que le directeur valide d'un trait au lieu de la dicter mot à mot.",
  "Un serveur d'inférence gagne 2× en vitesse sur des réponses de support stéréotypées grâce au décodage spéculatif.",
  ["kv-cache", "serveur-d-inference", "distillation"], [r"speculative decoding", r"décodage spéculatif", r"spéculatif"], "cs336", slug="speculative-decoding")
t("Serveur d'inférence (vLLM, TGI)", "INF", "N4",
  "Logiciel qui charge un modèle sur un ou plusieurs GPU et le met à disposition de nombreuses applications via une API, avec optimisations de performance (batching, cache).",
  "Comme la cuisine centrale d'une chaîne de restaurants qui alimente tous les établissements.",
  "Un groupe hospitalier sert un modèle ouvert à tous ses services via vLLM sur deux GPU internes.",
  ["vllm", "batching", "on-premise"], [r"serveurs? d'inférence", r"=TGI", r"inference servers?"], "vllm", slug="serveur-d-inference")
t("vLLM", "INF", "N4",
  "Serveur d'inférence open source haute performance pour GPU, avec PagedAttention et batching continu, qui expose une API compatible OpenAI. Référence pour servir des modèles ouverts en production.",
  "Comme un moteur de course conçu pour servir beaucoup de clients en même temps.",
  "Une ESN déploie vLLM chez un client industriel pour servir un modèle de 70B à 200 utilisateurs.",
  ["serveur-d-inference", "pagedattention", "batching"], [r"vLLM"], "vllm", slug="vllm")
t("Offloading (déchargement)", "INF", "N2",
  "Technique qui place une partie des couches d'un modèle en RAM classique (ou sur CPU) quand la VRAM ne suffit pas. Le modèle tourne, mais beaucoup plus lentement.",
  "Comme stocker une partie des ingrédients à la cave : on peut cuisiner, mais avec des allers-retours.",
  "Un modèle de 70B tourne sur une carte de 24 Go avec offloading partiel, à 3 tokens par seconde seulement.",
  ["vram", "llama-cpp"], [r"offload", r"déchargement", r"couches sur (le )?CPU"], None, slug="offloading")
t("Unsloth", "INF", "N4",
  "Outil open source qui accélère et allège l'affinage (LoRA, QLoRA) des modèles ouverts, au point de pouvoir le faire sur un seul GPU grand public ou dans un notebook gratuit.",
  "Comme un kit de tuning qui rend une voiture de série capable de rouler sur circuit.",
  "Une start-up affine un modèle de 8B sur ses conversations clients en deux heures avec Unsloth sur une RTX 4090.",
  ["lora", "qlora", "fine-tuning"], [r"Unsloth"], "unsloth")
t("Hugging Face", "INF", "N2",
  "Plateforme de référence de l'IA ouverte : elle héberge des centaines de milliers de modèles, jeux de données et démos, et publie des bibliothèques (Transformers, PEFT, TRL) et des cours gratuits.",
  "Comme le GitHub et l'App Store réunis des modèles d'IA.",
  "Un ingénieur compare sur Hugging Face les fiches de trois modèles (licence, taille, langues) avant d'en choisir un.",
  ["modele-a-poids-ouverts", "peft", "fiche-de-modele"], [r"Hugging ?Face"], "hf_learn", slug="hugging-face")
t("Fiche de modèle (model card)", "INF", "N2",
  "Page qui décrit un modèle : éditeur, taille, licence, langues, données d'entraînement, performances, usages prévus et limites. À lire avant toute adoption.",
  "Comme la notice et l'étiquette énergie d'un appareil électroménager.",
  "Avant de déployer un modèle, un DSI vérifie dans sa fiche la licence commerciale et les performances en français.",
  ["hugging-face", "licence-open-source", "transparence"], [r"fiches? de modèles?", r"model cards?", r"fiches? Hugging Face"], "hf_llm", slug="fiche-de-modele")
t("GPU cloud", "INF", "N3",
  "Location de cartes graphiques puissantes à l'heure chez un hébergeur (Scaleway, OVHcloud, RunPod…) pour entraîner ou servir des modèles sans acheter de matériel.",
  "Comme louer une camionnette pour un déménagement plutôt que d'en acheter une.",
  "Une start-up loue un H100 chez Scaleway à Paris pour une nuit de fine-tuning, données restant en France.",
  ["gpu", "on-premise", "souverainete-numerique"], [r"GPU cloud", r"cloud GPU", r"Scaleway", r"OVHcloud", r"RunPod"], "scaleway_gpu", slug="gpu-cloud")
t("On-premise (sur site)", "INF", "N2",
  "Déploiement d'un logiciel ou d'un modèle sur les serveurs de l'organisation, dans ses locaux ou son datacenter, plutôt que chez un fournisseur cloud.",
  "Comme avoir sa propre chaudière au lieu d'être raccordé au chauffage urbain.",
  "Un établissement de santé installe son assistant IA on-premise pour que les données patients ne quittent jamais l'hôpital.",
  ["llm-local", "souverainete-numerique", "gpu-cloud"], [r"on-?premise", r"sur site", r"on-prem"], None, slug="on-premise")
t("Edge AI (IA embarquée)", "INF", "N4",
  "IA qui tourne directement sur l'appareil (téléphone, caméra, voiture, capteur industriel) plutôt que dans le cloud, pour la rapidité, la confidentialité et le fonctionnement hors ligne.",
  "Comme un traducteur de poche qui marche même sans réseau.",
  "Une caméra de comptage de passages dans un magasin analyse les images sur place et n'envoie que les chiffres.",
  ["npu", "slm", "quantization"], [r"IA embarquée", r"edge( AI)?", r"on-device"], "litert", slug="edge-ai")
t("MLOps", "INF", "N4",
  "Ensemble de pratiques pour mettre en production et maintenir des modèles d'IA de façon fiable : versionner données et modèles, automatiser les déploiements, surveiller les performances et réentraîner.",
  "Comme la maintenance d'une flotte de véhicules : contrôles réguliers, carnet d'entretien, remplacement planifié.",
  "Une banque suit chaque semaine la performance de son modèle de scoring et le réentraîne si elle baisse.",
  ["derive", "monitoring", "registre-de-modeles", "ci-cd"], [r"MLOps", r"LLMOps"], "mlflow", slug="mlops")
t("Dérive (drift)", "INF", "N4",
  "Dégradation progressive d'un modèle en production parce que les données réelles s'éloignent de celles de l'entraînement (nouveaux produits, nouveaux comportements, nouvelle réglementation).",
  "Comme une carte routière qui vieillit : les routes changent, elle devient de moins en moins fiable.",
  "Après une hausse brutale des prix de l'énergie, le modèle de prévision de consommation d'un bailleur social se trompe de 30 %.",
  ["mlops", "monitoring"], [r"dérives?", r"drift"], "mlflow", slug="derive")
t("Monitoring (supervision)", "INF", "N4",
  "Surveillance continue d'un système en production : disponibilité, temps de réponse, coûts, qualité des réponses, erreurs, avec alertes en cas d'anomalie.",
  "Comme les capteurs et voyants d'une chaufferie.",
  "Une alerte prévient l'équipe quand le taux de réponses « je ne sais pas » du chatbot double en une journée.",
  ["observabilite", "derive", "mlops"], [r"monitoring", r"supervision"], "mlflow")
t("Registre de modèles", "INF", "N4",
  "Catalogue central qui stocke chaque version d'un modèle avec ses métriques, ses données d'entraînement et son statut (test, production, archivé).",
  "Comme le registre d'immatriculation d'une flotte de véhicules.",
  "Avec MLflow, une équipe sait exactement quelle version du modèle de scoring était en production le 3 mars.",
  ["mlops", "versioning"], [r"registres? de modèles?", r"model registry", r"MLflow"], "mlflow", slug="registre-de-modeles")
