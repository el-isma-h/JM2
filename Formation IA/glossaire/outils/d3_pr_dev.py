# -*- coding: utf-8 -*-
from core import t

# ===================== PROMPT ENGINEERING =====================
t("Prompt (consigne)", "PR", "N1",
  "Tout ce que l'on écrit à un modèle pour obtenir une réponse : la question, le contexte, les exemples, le format attendu. La qualité de la réponse dépend beaucoup de la qualité du prompt.",
  "Comme le brief donné à un stagiaire brillant mais tout juste arrivé : plus il est précis, meilleur est le travail.",
  "« Rédige une relance courtoise pour une facture de 1 200 € échue depuis 30 jours, ton cordial, 5 lignes max » est un prompt bien construit.",
  ["prompt-engineering", "system-prompt", "few-shot"], [r"prompts?", r"consignes?"], "anth_pe", slug="prompt")
t("Prompt engineering (ingénierie de prompt)", "PR", "N1",
  "Art de formuler, structurer et tester ses prompts pour obtenir des réponses fiables et utiles. Il s'appuie sur des techniques éprouvées : rôle, contexte, exemples, format, décomposition.",
  "Comme l'art de rédiger un bon cahier des charges.",
  "Un service RH réduit de moitié ses retouches en standardisant ses prompts de rédaction d'offres d'emploi.",
  ["prompt", "few-shot", "chain-of-thought", "context-engineering"], [r"prompt engineering", r"ingénierie (de|des) prompts?"], "anth_pebp", slug="prompt-engineering")
t("System prompt (prompt système)", "PR", "N1",
  "Instructions de fond données au modèle avant la conversation (rôle, ton, règles, limites), qui s'appliquent à tous les échanges suivants. Dans une API, c'est un champ à part.",
  "Comme la fiche de poste et le règlement intérieur remis au salarié avant sa première journée.",
  "Le chatbot d'une mutuelle a pour system prompt : « Tu es l'assistant de la mutuelle X. Tu ne donnes jamais d'avis médical. »",
  ["prompt", "role", "instructions-personnalisees"], [r"system prompts?", r"prompts? système", r"message système"], "anth_pebp", slug="system-prompt")
t("Rôle (persona)", "PR", "N1",
  "Indication donnée au modèle sur le personnage ou l'expertise à adopter (« Tu es un juriste en droit social »). Elle oriente le vocabulaire, le niveau de détail et le point de vue.",
  "Comme demander à quelqu'un de répondre « avec sa casquette d'expert-comptable ».",
  "« En tant que responsable de la paie d'une PME de 50 salariés, explique la DSN à un nouvel arrivant. »",
  ["system-prompt", "prompt"], [r"\*\*rôle\*\*", r"persona", r"rôle"], "anth_pebp", slug="role")
t("Zero-shot", "PR", "N1",
  "Demander une tâche au modèle sans lui donner d'exemple. Suffisant pour les tâches simples et courantes.",
  "Comme demander à un collègue expérimenté de faire quelque chose sans lui montrer de modèle.",
  "« Classe cet avis client en positif, neutre ou négatif » sans aucun exemple fourni.",
  ["few-shot", "prompt"], [r"zero-?shot"], "anth_pebp")
t("Few-shot (exemples dans le prompt)", "PR", "N1",
  "Technique qui consiste à montrer au modèle quelques exemples du résultat attendu (2 à 5) avant de lui demander de traiter un nouveau cas. Il imite format et style.",
  "Comme montrer trois lettres types à un nouvel assistant avant qu'il rédige la quatrième.",
  "Un service comptable donne trois exemples de libellés bancaires déjà catégorisés avant d'en soumettre 200 nouveaux.",
  ["zero-shot", "prompt", "chain-of-thought"], [r"few-?shot", r"one-?shot", r"multishot"], "anth_pebp", slug="few-shot")
t("Chain of thought (raisonnement pas à pas)", "PR", "N1",
  "Technique qui demande au modèle de détailler son raisonnement étape par étape avant de conclure. Elle améliore les réponses sur les calculs et problèmes complexes.",
  "Comme exiger d'un élève qu'il montre ses calculs, pas seulement le résultat.",
  "« Calcule les indemnités de licenciement en détaillant chaque étape, puis donne le total. »",
  ["modele-de-raisonnement", "extended-thinking", "decomposition"], [r"chain[- ]of[- ]thought", r"=CoT", r"pas à pas", r"étape par étape"], "anth_pebp", slug="chain-of-thought")
t("Décomposition (prompt chaining)", "PR", "N1",
  "Technique qui découpe une tâche complexe en plusieurs prompts successifs, la sortie de l'un devenant l'entrée du suivant.",
  "Comme une chaîne de montage : chaque poste fait une étape précise.",
  "Pour un appel d'offres : 1) extraire les exigences, 2) les comparer à l'offre, 3) rédiger la note de synthèse.",
  ["chain-of-thought", "workflow", "agent-ia"], [r"décompos(ition|er)", r"prompt chaining", r"chaîn(age|er) (de|des) prompts"], "anth_pebp", slug="decomposition")
t("Balises XML", "PR", "N1",
  "Étiquettes comme <document> … </document> utilisées dans un prompt pour séparer clairement les instructions, les données et les exemples. Le guide d'Anthropic les recommande.",
  "Comme des intercalaires de couleur dans un classeur.",
  "<contrat>…texte…</contrat> <consigne>Liste les clauses de résiliation.</consigne>",
  ["prompt", "delimiteurs"], [r"balises?", r"\bXML\b"], "anth_pebp", slug="balises-xml")
t("Délimiteurs", "PR", "N1",
  "Repères (triples guillemets, ###, balises) qui indiquent au modèle où commence et où finit un texte à traiter, pour éviter qu'il le confonde avec vos instructions.",
  "Comme mettre un document entre deux trombones de couleur pour qu'on ne le mélange pas avec la note qui l'accompagne.",
  "« Résume le texte entre ### en 3 points. ### …compte rendu… ### »",
  ["balises-xml", "prompt-injection"], [r"délimiteurs?", r"delimiters?"], "anth_pebp", slug="delimiteurs")
t("Format de sortie", "PR", "N1",
  "Partie du prompt qui précise la forme attendue : tableau, liste à puces, JSON, nombre de mots, ton. Un format explicite rend la réponse directement exploitable.",
  "Comme indiquer au traiteur s'il doit livrer en buffet ou en plateaux-repas.",
  "« Réponds sous forme de tableau à trois colonnes : clause, risque, recommandation. »",
  ["sorties-structurees", "prompt"], [r"formats? de (sortie|réponse)", r"output format"], "anth_pebp", slug="format-de-sortie")
t("Contraintes (dans un prompt)", "PR", "N1",
  "Limites imposées à la réponse : longueur, vocabulaire interdit, public visé, sources autorisées. Elles cadrent le modèle et évitent les réponses génériques.",
  "Comme le cahier des charges d'un architecte : budget, surface, normes.",
  "« Pas de jargon, 120 mots maximum, ne cite que les articles du Code du travail fournis. »",
  ["prompt", "format-de-sortie"], [r"contraintes?"], "anth_pebp", slug="contraintes")
t("Préremplissage (prefill)", "PR", "N3",
  "Technique d'API qui consiste à écrire soi-même le début de la réponse de l'assistant (par exemple « { ») pour forcer un format ou un ton.",
  "Comme commencer la phrase de quelqu'un pour l'orienter.",
  "Un développeur préremplit la réponse avec « { » pour obtenir un JSON sans préambule.",
  ["sorties-structurees", "messages-api"], [r"pré-?rempli", r"prefill"], "anth_pebp", slug="prefill")
t("Méta-prompt", "PR", "N1",
  "Prompt qui demande au modèle d'écrire ou d'améliorer un autre prompt. Pratique pour démarrer, à vérifier toujours.",
  "Comme demander à un rédacteur en chef de rédiger le brief d'un pigiste.",
  "« Écris le meilleur prompt possible pour qu'un LLM rédige des fiches de poste conformes à notre charte. »",
  ["prompt-engineering", "bibliotheque-de-prompts"], [r"méta-?prompts?", r"meta-?prompts?", r"prompt generator"], "anth_pe", slug="meta-prompt")
t("Bibliothèque de prompts", "PR", "N1",
  "Recueil organisé de prompts testés et réutilisables pour les tâches fréquentes d'une personne ou d'une équipe, avec leurs variantes et leurs résultats.",
  "Comme un classeur de recettes éprouvées dans une cuisine professionnelle.",
  "L'équipe marketing d'un réseau d'opticiens partage 30 prompts validés dans un Notion commun.",
  ["prompt", "prompt-template", "eval"], [r"bibliothèques? de prompts", r"prompt library"], "anth_pe", slug="bibliotheque-de-prompts")
t("Prompt template (gabarit de prompt)", "PR", "N2",
  "Prompt à trous contenant des variables (par exemple {nom_client}, {montant}) que l'on remplit automatiquement à chaque utilisation, dans un outil d'automatisation ou du code.",
  "Comme un publipostage : la même lettre avec des champs personnalisés.",
  "Dans n8n, un gabarit « Relance pour {{client}} – facture {{numero}} » est rempli pour chaque ligne d'un Google Sheets.",
  ["bibliotheque-de-prompts", "expression-n8n"], [r"templates? de prompts?", r"prompt templates?", r"gabarits?"], "anth_pebp", slug="prompt-template")
t("Itération (sur un prompt)", "PR", "N1",
  "Démarche qui consiste à tester un prompt, analyser le résultat, corriger la consigne et recommencer jusqu'à obtenir une réponse fiable.",
  "Comme un brouillon que l'on reprend jusqu'à la version finale.",
  "Une chargée de communication améliore en quatre essais un prompt de résumé de revue de presse.",
  ["eval", "bibliotheque-de-prompts"], [r"itér(ation|er|ez)"], "anth_pe", slug="iteration")
t("Context engineering", "PR", "N3",
  "Discipline qui consiste à choisir et organiser toutes les informations données au modèle (instructions, documents, historique, outils, mémoire) pour qu'il ait exactement ce qu'il faut, ni plus ni moins.",
  "Comme préparer le dossier d'un avocat avant l'audience : les bonnes pièces, dans le bon ordre.",
  "Un agent de support ne reçoit que les trois articles de FAQ pertinents et l'historique du client, pas toute la base.",
  ["prompt-engineering", "rag", "fenetre-de-contexte"], [r"context engineering", r"ingénierie du contexte"], "anth_pebp", slug="context-engineering")
t("Instructions personnalisées", "PR", "N1",
  "Réglage des assistants grand public qui permet d'indiquer une fois pour toutes qui vous êtes et comment vous voulez qu'on vous réponde.",
  "Comme dire une fois à son coiffeur comment on aime sa coupe.",
  "Une avocate précise : « Je suis avocate en droit social, réponds avec références au Code du travail et sans formules de politesse. »",
  ["system-prompt", "memoire-de-l-assistant"], [r"instructions personnalisées", r"custom instructions", r"personnalisation"], "oa_academy", slug="instructions-personnalisees")
t("Mémoire (assistant)", "PR", "N1",
  "Fonction des assistants qui retient des informations d'une conversation à l'autre (préférences, projets en cours). Utile, mais à surveiller pour la confidentialité.",
  "Comme un collaborateur qui se souvient de vos habitudes d'une réunion à l'autre.",
  "ChatGPT se souvient que l'utilisateur gère une boulangerie et propose spontanément des exemples adaptés.",
  ["instructions-personnalisees", "memoire-d-agent"], [r"mémoire (de ChatGPT|de Claude|persistante|entre (les )?conversations)", r"fonction (de )?mémoire", r"\*\*mémoire\*\*"], "oa_academy", slug="memoire-de-l-assistant")
t("Projet Claude", "PR", "N1",
  "Espace de travail de Claude qui regroupe des documents de référence, des instructions et des conversations autour d'un même sujet. Claude s'appuie sur ces documents à chaque échange.",
  "Comme un dossier partagé posé sur le bureau de l'assistant, toujours ouvert.",
  "Un cabinet RH crée un projet « Convention Syntec » avec la convention, les accords d'entreprise et ses consignes de rédaction.",
  ["claude", "custom-gpt", "gems", "base-de-connaissances"], [r"projets? Claude", r"Claude Projects?", r"\*\*projets?\*\*"], "anth_claude101", slug="projet-claude")
t("Artefact (Claude)", "PR", "N1",
  "Contenu autonome produit par Claude dans un panneau à part (document, code, page web, schéma), que l'on peut modifier, réutiliser et partager.",
  "Comme une pièce jointe que l'assistant fabrique et met à jour devant vous.",
  "Un formateur demande un quiz interactif : Claude le livre sous forme d'artefact HTML jouable immédiatement.",
  ["claude", "projet-claude"], [r"artefacts?", r"artifacts?"], "anth_claude101", slug="artefact")
t("Custom GPT", "PR", "N2",
  "Version personnalisée de ChatGPT, configurée avec des instructions, des fichiers et éventuellement des actions, partageable avec d'autres utilisateurs.",
  "Comme un assistant clé en main formé à une seule mission.",
  "Une agence de voyages crée un GPT qui rédige les programmes de séjour dans son style maison.",
  ["projet-claude", "gems", "copilot-studio"], [r"Custom GPTs?", r"GPTs? personnalisés?"], "oa_academy", slug="custom-gpt")
t("Gems (Gemini)", "PR", "N2",
  "Assistants personnalisés de Gemini, configurés avec des instructions et des documents, équivalents des Custom GPT chez Google.",
  "Comme un collaborateur spécialisé que l'on crée en remplissant une fiche de poste.",
  "Une école crée un Gem « correcteur de rapports de stage » avec la grille d'évaluation officielle.",
  ["custom-gpt", "projet-claude", "gemini"], [r"\bGems?\b"], "gem_models", slug="gems")
t("Eval (évaluation de prompts et de modèles)", "PR", "N2",
  "Jeu de cas de test avec résultats attendus et critères de réussite, qui permet de mesurer objectivement si un prompt ou un modèle fait bien le travail, et de détecter les régressions.",
  "Comme une batterie de contrôles qualité passés à chaque nouvelle version d'un produit.",
  "Avant de changer de modèle, un éditeur de logiciel RH rejoue 200 questions de son support et compare les réponses notées.",
  ["llm-as-a-judge", "promptfoo", "benchmark", "test-de-prompts"], [r"\bevals?\b", r"évaluations?"], "anth_evals", slug="eval")
t("LLM-as-a-judge", "PR", "N3",
  "Méthode qui utilise un LLM pour noter automatiquement les réponses d'un autre modèle selon une grille (exactitude, ton, complétude). Rapide, mais à calibrer avec des notes humaines.",
  "Comme un correcteur adjoint qui applique la grille du professeur.",
  "Un éditeur fait noter par un modèle 1 000 réponses de son chatbot sur une échelle de 1 à 5, puis vérifie 50 notes à la main.",
  ["eval", "deepeval", "ragas"], [r"LLM[- ]as[- ]a[- ]judge", r"LLM juge", r"juge LLM"], "anth_evals", slug="llm-as-a-judge")
t("Vérification des sorties (relecture critique)", "PR", "N1",
  "Réflexe de contrôler ce que produit une IA avant de l'utiliser : faits, chiffres, sources, cohérence, ton. L'humain reste responsable du résultat.",
  "Comme relire un contrat préparé par un stagiaire avant de le signer.",
  "Une comptable revérifie chaque montant d'un tableau généré par l'IA à partir des pièces originales.",
  ["hallucination", "supervision-humaine"], [r"vérifi(er|cation)", r"relecture critique", r"sourcer"], "anth_limits", slug="verification-des-sorties")

# ===================== API ET DÉVELOPPEMENT =====================
t("API (Application Programming Interface)", "DEV", "N1",
  "Interface de programmation : porte d'entrée standardisée qui permet à un logiciel de demander un service à un autre (envoyer un prompt à un LLM, créer un contact dans un CRM) par des requêtes structurées.",
  "Comme le guichet d'une administration : on y dépose une demande au bon format et on reçoit une réponse.",
  "L'outil de facturation d'une PME appelle l'API d'un LLM pour rédiger automatiquement le texte d'accompagnement des factures.",
  ["cle-api", "endpoint", "requete-http", "json"], [r"=API", r"interfaces? de programmation"], "anth_api", slug="api")
t("Clé API", "DEV", "N1",
  "Code secret personnel qui identifie votre compte quand votre programme appelle une API. Elle permet la facturation : la divulguer revient à prêter sa carte bancaire.",
  "Comme le badge d'accès à un bâtiment, associé à votre nom et à votre facture.",
  "Un développeur stocke sa clé Anthropic dans un fichier .env exclu de Git plutôt que dans le code.",
  ["api", "variable-d-environnement", "gestion-des-secrets"], [r"clés? (d')?API", r"API keys?"], "anth_key", slug="cle-api")
t("Endpoint", "DEV", "N3",
  "Adresse précise d'une API correspondant à un service (par exemple /v1/messages). Chaque endpoint attend un type de requête et renvoie un type de réponse.",
  "Comme un guichet particulier dans une grande administration : état civil, cartes grises, urbanisme.",
  "L'endpoint https://api.anthropic.com/v1/messages reçoit les conversations et renvoie la réponse de Claude.",
  ["api", "requete-http"], [r"endpoints?", r"points? d'(accès|entrée)"], "anth_api")
t("Requête HTTP (GET, POST)", "DEV", "N1",
  "Message envoyé par un programme à un serveur web. GET sert à lire une information, POST à envoyer des données (un prompt, un formulaire). La réponse arrive avec un code de statut (200 = OK, 429 = trop de requêtes).",
  "Comme un courrier envoyé à une administration avec un accusé de réception chiffré.",
  "Un nœud HTTP Request de n8n envoie une requête POST à l'API de Mistral avec le texte d'un e-mail à résumer.",
  ["api", "json", "code-de-statut-http"], [r"requêtes? HTTP", r"=HTTP", r"=POST", r"=GET"], "anth_api", slug="requete-http")
t("Code de statut HTTP", "DEV", "N3",
  "Nombre à trois chiffres renvoyé par un serveur pour indiquer le résultat d'une requête : 200 succès, 400 requête mal formée, 401 clé invalide, 429 limite atteinte, 500 erreur du serveur.",
  "Comme le voyant du tableau de bord d'une voiture : vert, orange ou rouge selon la situation.",
  "Un workflow n8n relance automatiquement l'appel après 30 secondes quand l'API renvoie 429 ou 529.",
  ["requete-http", "rate-limit", "gestion-des-erreurs"], [r"codes? (de )?(statut|status|retour)", r"\b(401|429|500|529)\b"], "anth_api", slug="code-de-statut-http")
t("JSON", "DEV", "N1",
  "JavaScript Object Notation : format texte simple pour structurer des données sous forme de paires « clé : valeur », lisible par les humains et les machines. C'est la langue commune des API.",
  "Comme un formulaire administratif où chaque case a une étiquette et une valeur.",
  "{ \"client\": \"Boulangerie Martin\", \"montant\": 1200, \"echeance\": \"2026-11-30\" }",
  ["api", "json-schema", "sorties-structurees"], [r"=JSON"], "anth_struct", slug="json")
t("JSON Schema", "DEV", "N3",
  "Description formelle de la forme qu'un JSON doit avoir : quels champs, quels types, lesquels sont obligatoires. Les sorties structurées et le tool use s'appuient dessus.",
  "Comme le gabarit d'un formulaire Cerfa : il fixe les cases et ce qu'on a le droit d'y écrire.",
  "Un schéma impose qu'une facture extraite contienne « numero » (texte), « montant_ttc » (nombre) et « date » (date).",
  ["json", "sorties-structurees", "tool-use"], [r"JSON Schema", r"schéma JSON", r"input_schema"], "anth_struct", slug="json-schema")
t("REST", "DEV", "N3",
  "Style d'architecture d'API très répandu, où l'on manipule des ressources (clients, factures) via des URL et des requêtes HTTP standard (GET, POST, PUT, DELETE).",
  "Comme un classement de bibliothèque universel : chaque livre a son adresse et on sait toujours comment l'emprunter ou le rendre.",
  "L'API REST d'un CRM permet de créer un contact par POST /contacts et de le lire par GET /contacts/42.",
  ["api", "requete-http", "endpoint"], [r"=REST", r"RESTful"], None)
t("Webhook", "DEV", "N1",
  "Adresse web qui reçoit automatiquement une notification quand un événement se produit dans une autre application (nouveau paiement, formulaire rempli). C'est l'inverse d'une API qu'on interroge.",
  "Comme une sonnette : au lieu d'aller voir sans cesse si quelqu'un est là, on est prévenu quand il sonne.",
  "Quand un client paie sur Stripe, un webhook déclenche un workflow n8n qui envoie la facture et met à jour le CRM.",
  ["api", "declencheur", "workflow"], [r"webhooks?"], "n8n_first")
t("SDK (Software Development Kit)", "DEV", "N3",
  "Kit de développement : bibliothèque prête à l'emploi (Python, TypeScript…) qui simplifie l'appel à une API en évitant d'écrire soi-même les requêtes HTTP.",
  "Comme une télécommande universelle livrée avec l'appareil : plus besoin de connaître les signaux infrarouges.",
  "Avec le SDK Python d'Anthropic, trois lignes suffisent pour envoyer un message à Claude.",
  ["api", "python", "typescript"], [r"=SDK"], "anth_sdk", slug="sdk")
t("Python", "DEV", "N3",
  "Langage de programmation lisible et polyvalent, le plus utilisé en IA, data science et automatisation, avec un immense écosystème de bibliothèques.",
  "Comme l'anglais des développeurs IA : tout le monde le parle un peu.",
  "Un analyste écrit un script Python qui envoie chaque mois les relevés de ventes à un LLM pour en tirer un commentaire.",
  ["typescript", "sdk", "pandas"], [r"Python"], "anth_sdk")
t("TypeScript", "DEV", "N3",
  "Version de JavaScript avec des types vérifiés, très utilisée pour les applications web et les serveurs Node.js, notamment les interfaces de chat IA.",
  "Comme JavaScript avec un correcteur orthographique intégré.",
  "Une start-up développe son assistant de prise de rendez-vous en TypeScript avec Next.js et le Vercel AI SDK.",
  ["python", "next-js", "vercel-ai-sdk"], [r"TypeScript"], "anth_sdk")
t("Variable d'environnement (.env)", "DEV", "N3",
  "Valeur de configuration stockée en dehors du code (souvent dans un fichier .env), typiquement pour les clés API et mots de passe, afin de ne jamais les publier.",
  "Comme garder les clés de la maison dans une boîte à part plutôt que scotchées sur la porte.",
  "ANTHROPIC_API_KEY est lue depuis l'environnement ; le fichier .env est listé dans .gitignore.",
  ["cle-api", "gestion-des-secrets"], [r"variables? d'environnement", r"\.env\b", r"environment variables?"], "anth_key", slug="variable-d-environnement")
t("Streaming (réponse en flux)", "DEV", "N3",
  "Mode où la réponse du modèle arrive morceau par morceau, au fur et à mesure qu'elle est générée, au lieu d'attendre la fin. L'utilisateur voit le texte s'écrire.",
  "Comme regarder une vidéo pendant son téléchargement plutôt qu'attendre la fin.",
  "Le chat d'un site e-commerce affiche la réponse en streaming pour que le client n'attende pas 8 secondes devant un écran vide.",
  ["sse", "ttft", "api"], [r"streaming", r"en flux"], "anth_stream", slug="streaming")
t("SSE (Server-Sent Events)", "DEV", "N3",
  "Technique web qui permet à un serveur d'envoyer une suite d'événements à un navigateur sur une connexion ouverte. C'est le transport habituel du streaming des LLM et de certains serveurs MCP.",
  "Comme un fil d'actualité qui défile en direct sans qu'on recharge la page.",
  "L'API Messages renvoie des événements SSE content_block_delta contenant chacun quelques tokens.",
  ["streaming", "transport-mcp"], [r"=SSE", r"server-sent events"], "anth_stream", slug="sse")
t("Rate limit (limite de débit)", "DEV", "N3",
  "Plafond du nombre de requêtes ou de tokens autorisés par minute pour un compte d'API. Au-delà, l'API renvoie une erreur 429 et il faut patienter.",
  "Comme un péage qui ne laisse passer qu'un certain nombre de voitures par minute.",
  "Un traitement de 10 000 CV doit être étalé ou passé en Batch API pour respecter les limites de débit.",
  ["quota", "batch-api", "code-de-statut-http", "backoff"], [r"rate limits?", r"limites? de débit", r"\b429\b"], "anth_rate", slug="rate-limit")
t("Quota", "DEV", "N3",
  "Volume maximal d'usage alloué sur une période (tokens par jour, dépense mensuelle). Il protège contre les dérapages de facture.",
  "Comme un forfait téléphonique avec une enveloppe de données mensuelle.",
  "Une DSI fixe un quota de 300 € par mois par équipe sur la console de l'API.",
  ["rate-limit", "denial-of-wallet"], [r"quotas?"], "anth_rate")
t("Backoff exponentiel (retry)", "DEV", "N3",
  "Stratégie de nouvelle tentative après une erreur temporaire : on attend 1 s, puis 2, 4, 8… pour ne pas surcharger le service.",
  "Comme rappeler un standard occupé en espaçant de plus en plus les appels.",
  "Le SDK relance automatiquement une requête qui a reçu une erreur 529 « overloaded » avec un backoff exponentiel.",
  ["rate-limit", "gestion-des-erreurs"], [r"backoff", r"retry", r"nouvelles? tentatives?", r"réessa"], "anth_rate", slug="backoff")
t("Latence", "DEV", "N2",
  "Temps d'attente entre l'envoi d'une demande et la réception de la réponse. Elle dépend de la taille du modèle, de la longueur du texte, du réseau et de la charge du serveur.",
  "Comme le temps entre la commande au comptoir et l'arrivée du plat.",
  "Un standard téléphonique IA doit répondre en moins d'une seconde : on choisit un modèle rapide et le streaming.",
  ["ttft", "tokens-par-seconde", "streaming"], [r"latences?", r"latency"], "anth_models")
t("TTFT (Time To First Token)", "DEV", "N3",
  "Délai avant l'arrivée du premier token de la réponse. C'est l'indicateur clé de la réactivité perçue d'un chat.",
  "Comme le temps avant que le serveur dise « je m'occupe de vous » : l'attente paraît bien plus courte ensuite.",
  "Avec le prompt caching, le TTFT d'un assistant juridique passe de 4 s à 0,8 s sur un long contexte réutilisé.",
  ["latence", "streaming", "prompt-caching", "tokens-par-seconde"], [r"TTFT", r"time to first token", r"premier token"], "anth_cache", slug="ttft")
t("Coût par million de tokens", "DEV", "N1",
  "Unité de facturation des API de LLM : un prix pour les tokens envoyés (entrée) et un autre, plus élevé, pour les tokens générés (sortie).",
  "Comme un tarif au kilo différent pour la matière première et pour le produit fini.",
  "À 2 $ le million de tokens d'entrée et 10 $ en sortie, résumer 1 000 e-mails de 800 tokens en 100 tokens coûte environ 2,60 $.",
  ["token", "prompt-caching", "batch-api"], [r"millions? de tokens", r"\$ ?/ ?M", r"par million"], "anth_price", slug="cout-par-million-de-tokens")
t("Prompt caching (mise en cache du prompt)", "DEV", "N3",
  "Fonction d'API qui garde en mémoire la partie fixe et répétée d'un prompt (longues instructions, document de référence) pour la facturer bien moins cher et la traiter plus vite aux appels suivants.",
  "Comme un restaurant qui prépare la base de sauce une fois le matin au lieu de la refaire pour chaque assiette.",
  "Un assistant qui reçoit à chaque question les 80 pages de la convention collective divise sa facture par cinq grâce au cache.",
  ["ttft", "cout-par-million-de-tokens", "batch-api"], [r"prompt caching", r"mise en cache", r"cache_control", r"context caching"], "anth_cache", slug="prompt-caching")
t("Batch API (traitement par lots)", "DEV", "N3",
  "Mode d'API où l'on envoie un gros paquet de requêtes à traiter en différé (jusqu'à 24 h) avec une remise d'environ 50 %.",
  "Comme déposer son linge au pressing le soir pour le récupérer le lendemain à moindre prix.",
  "Une agence classe 50 000 avis clients pendant la nuit via la Batch API pour moitié prix.",
  ["prompt-caching", "rate-limit", "traitement-par-lots"], [r"Batch API", r"Message Batches", r"\*\*batch\*\*"], "anth_batch", slug="batch-api")
t("Messages API (Anthropic)", "DEV", "N3",
  "API principale d'Anthropic pour converser avec Claude : on envoie une liste de messages (rôles user / assistant), un system prompt et des paramètres, et on reçoit la réponse.",
  "Comme un échange de lettres numérotées : on renvoie tout l'historique à chaque courrier.",
  "Un intégrateur construit le chatbot d'un office notarial sur la Messages API avec un system prompt métier.",
  ["api", "system-prompt", "roles-des-messages"], [r"Messages API", r"/v1/messages", r"messages\.create"], "anth_msg", slug="messages-api")
t("Rôles des messages (user, assistant, system)", "DEV", "N3",
  "Dans une API de chat, chaque message est étiqueté par son auteur : « user » pour l'utilisateur, « assistant » pour le modèle, « system » (ou un champ dédié) pour les instructions de fond.",
  "Comme un script de théâtre où chaque réplique indique le personnage qui parle.",
  "Pour reprendre une conversation, l'application renvoie à l'API tous les messages user et assistant précédents.",
  ["messages-api", "system-prompt"], [r"rôles? (user|assistant)", r"\"role\"", r"role: ?\"?(user|assistant)"], "anth_msg", slug="roles-des-messages")
t("Sans état (stateless)", "DEV", "N3",
  "Se dit d'une API qui ne garde aucun souvenir entre deux appels : il faut lui renvoyer tout le contexte utile à chaque requête.",
  "Comme un guichetier différent à chaque passage : il faut réexpliquer tout son dossier.",
  "L'application d'une banque stocke l'historique de conversation dans sa base et le renvoie à chaque appel au modèle.",
  ["messages-api", "conversation-state"], [r"sans état", r"stateless"], "anth_msg", slug="stateless")
t("Responses API (OpenAI)", "DEV", "N3",
  "API recommandée par OpenAI depuis 2025, qui unifie texte, outils intégrés (recherche web, fichiers), raisonnement et état de conversation côté serveur. Elle succède à Chat Completions.",
  "Comme un guichet unique qui remplace plusieurs guichets spécialisés.",
  "Un développeur porte son assistant de la Messages API d'Anthropic vers la Responses API d'OpenAI en adaptant le format des outils.",
  ["chat-completions", "api", "function-calling"], [r"Responses API", r"responses\.create"], "oa_resp", slug="responses-api")
t("Chat Completions", "DEV", "N3",
  "Ancienne API de conversation d'OpenAI, devenue un standard de fait : de nombreux fournisseurs et serveurs locaux proposent une API « compatible OpenAI » au même format.",
  "Comme une prise électrique standard que tout le monde a fini par adopter.",
  "Ollama expose un endpoint /v1/chat/completions, ce qui permet de brancher un modèle local dans un outil prévu pour OpenAI.",
  ["responses-api", "api-compatible-openai"], [r"Chat Completions?", r"chat/completions"], "oa_resp", slug="chat-completions")
t("API compatible OpenAI", "DEV", "N2",
  "API qui reprend le format d'OpenAI (Chat Completions) : on peut alors utiliser les mêmes SDK et outils en changeant seulement l'adresse et la clé. Ollama, LM Studio, vLLM, xAI et OpenRouter en proposent une.",
  "Comme un adaptateur de voyage qui permet de brancher n'importe quel appareil sur la même prise.",
  "Un workflow n8n passe de GPT à un modèle local Ollama en changeant simplement la base URL du nœud OpenAI.",
  ["chat-completions", "ollama", "multi-fournisseur"], [r"compatibles? OpenAI", r"OpenAI[- ]compatible", r"base[_ ]?url"], "anth_oaicompat", slug="api-compatible-openai")
t("État de conversation (conversation state)", "DEV", "N3",
  "Manière dont l'historique d'un dialogue est conservé : renvoyé à chaque appel par l'application (sans état) ou stocké côté fournisseur et référencé par un identifiant.",
  "Comme garder soi-même son dossier médical ou le laisser au cabinet du médecin.",
  "Avec la Responses API, l'application passe previous_response_id au lieu de renvoyer tout l'historique.",
  ["stateless", "responses-api"], [r"conversation state", r"état de (la )?conversation", r"previous_response_id"], "oa_state", slug="conversation-state")
t("Tool use (utilisation d'outils)", "DEV", "N3",
  "Capacité d'un modèle à demander l'exécution d'une fonction que vous lui décrivez (chercher un client, calculer un devis, envoyer un e-mail). Le modèle choisit l'outil et ses paramètres ; votre code l'exécute et lui renvoie le résultat.",
  "Comme un chef de chantier qui ne porte pas les parpaings lui-même mais sait exactement quel ouvrier appeler et avec quelles consignes.",
  "Un assistant de cabinet dentaire appelle l'outil « chercher_creneau(date) » pour proposer un rendez-vous réel.",
  ["function-calling", "agent-ia", "json-schema", "mcp"], [r"tool use", r"tool_use", r"utilisation d'outils", r"appels? d'outils?", r"tool call"], "anth_tools", slug="tool-use")
t("Function calling", "DEV", "N3",
  "Nom donné par OpenAI (et d'autres) au tool use : le modèle renvoie un appel de fonction structuré, avec nom et arguments en JSON, que l'application exécute.",
  "Comme un bon de commande pré-rempli que le modèle tend à votre logiciel.",
  "Un chatbot de livraison appelle get_order_status(numero) pour répondre « Votre colis arrive demain ».",
  ["tool-use", "json-schema", "sorties-structurees"], [r"function calling", r"appel de fonctions?"], "oa_fc", slug="function-calling")
t("Sorties structurées (structured outputs)", "DEV", "N3",
  "Fonction d'API qui garantit que la réponse respecte exactement un schéma JSON donné, sans texte parasite. Indispensable pour brancher un LLM sur un logiciel.",
  "Comme exiger que le formulaire soit rempli case par case, sans commentaire dans la marge.",
  "Une plateforme RH extrait nom, poste, années d'expérience et compétences de 5 000 CV au format JSON strict.",
  ["json-schema", "json", "function-calling"], [r"sorties? structurées?", r"structured outputs?", r"JSON mode"], "anth_struct", slug="sorties-structurees")
t("Raison d'arrêt (stop reason)", "DEV", "N3",
  "Champ de la réponse d'API qui indique pourquoi le modèle s'est arrêté : fin naturelle, limite de tokens atteinte, demande d'outil, refus.",
  "Comme le motif inscrit sur un bon de livraison incomplet : rupture, colis trop lourd, adresse erronée.",
  "Quand stop_reason vaut « max_tokens », l'application relance la génération au lieu d'afficher un texte coupé.",
  ["max-tokens", "tool-use", "messages-api"], [r"stop[_ ]reason", r"raisons? d'arrêt", r"finish_reason"], "anth_stop", slug="stop-reason")
t("max_tokens", "DEV", "N3",
  "Paramètre d'API qui fixe le nombre maximal de tokens que le modèle peut générer dans sa réponse. Il protège la facture mais peut couper une réponse trop longue.",
  "Comme un nombre de pages maximum imposé à un rapport.",
  "Un résumé de réunion limité à max_tokens = 400 tient sur une demi-page.",
  ["stop-reason", "token"], [r"max_tokens", r"max_output_tokens"], "anth_msg", slug="max-tokens")
t("Files API", "DEV", "N3",
  "API qui permet de téléverser un fichier une fois chez le fournisseur et de le réutiliser par son identifiant dans plusieurs requêtes, au lieu de le renvoyer à chaque fois.",
  "Comme déposer un dossier au greffe et n'y faire référence ensuite que par son numéro.",
  "Un cabinet téléverse une fois le règlement intérieur de 60 pages et l'utilise dans des centaines de questions.",
  ["vision-api", "prompt-caching"], [r"Files API", r"file_id"], "anth_files", slug="files-api")
t("Vision (API)", "DEV", "N3",
  "Capacité d'un modèle à recevoir des images ou des PDF dans une requête d'API pour les décrire, en extraire des informations ou répondre à des questions dessus.",
  "Comme montrer un document à un collègue au lieu de le lui lire à voix haute.",
  "Une application de notes de frais envoie la photo d'un ticket et récupère commerçant, date et montant TTC.",
  ["multimodal", "ocr", "files-api"], [r"vision", r"images? en entrée", r"support PDF", r"PDF support"], "anth_vision", slug="vision-api")
t("Citations (API)", "DEV", "N3",
  "Fonction qui fait renvoyer au modèle, pour chaque affirmation, le passage exact du document source qui la justifie. Elle facilite la vérification.",
  "Comme les notes de bas de page d'un mémoire.",
  "L'assistant juridique d'une PME répond sur un contrat en citant l'article et la phrase exacte concernés.",
  ["grounding", "rag", "hallucination"], [r"citations?"], "anth_cite", slug="citations")
t("Extended thinking (réflexion étendue)", "DEV", "N3",
  "Option des modèles Claude qui leur accorde un budget de tokens pour réfléchir avant de répondre. En 2026, le mode « adaptatif » laisse le modèle décider de l'effort de réflexion.",
  "Comme accorder dix minutes de préparation avant un oral au lieu d'exiger une réponse immédiate.",
  "Un analyste active la réflexion étendue pour vérifier la cohérence d'un plan de financement sur 5 ans.",
  ["modele-de-raisonnement", "chain-of-thought", "effort"], [r"extended thinking", r"réflexion étendue", r"thinking adaptatif", r"adaptive thinking", r"budget_tokens"], "anth_think", slug="extended-thinking")
t("Effort (paramètre)", "DEV", "N3",
  "Paramètre d'API qui règle combien de calcul et de réflexion le modèle consacre à une tâche (faible, moyen, élevé), pour arbitrer entre qualité, coût et vitesse.",
  "Comme choisir entre un devis express et une étude approfondie.",
  "Un tri de tickets passe en effort faible ; l'analyse d'un litige complexe en effort élevé.",
  ["extended-thinking", "latence"], [r"\beffort\b", r"reasoning_effort"], "anth_effort", slug="effort")
t("Compaction (du contexte)", "DEV", "N3",
  "Technique qui résume ou supprime automatiquement les parties anciennes d'une longue conversation ou d'une session d'agent pour rester sous la fenêtre de contexte.",
  "Comme archiver les vieux dossiers pour libérer le bureau, en gardant une note de synthèse.",
  "Un agent qui travaille deux heures sur un audit de code compacte son historique pour continuer sans perdre le fil.",
  ["fenetre-de-contexte", "memoire-d-agent"], [r"compaction", r"compacter", r"context editing"], "anth_compact", slug="compaction")
t("Realtime API (voix en temps réel)", "DEV", "N3",
  "API qui permet des conversations vocales quasi instantanées avec un modèle, sur une connexion permanente (WebSocket ou WebRTC), sans passer par transcription puis synthèse séparées.",
  "Comme un appel téléphonique plutôt qu'un échange de messages vocaux.",
  "Un cabinet médical teste un standard vocal IA qui prend les rendez-vous en temps réel.",
  ["synthese-vocale", "reconnaissance-vocale", "latence"], [r"Realtime( API)?", r"Live API", r"voix en temps réel"], "oa_rt", slug="realtime-api")
t("Routeur de LLM (OpenRouter, LiteLLM)", "DEV", "N3",
  "Service ou bibliothèque qui donne accès à de nombreux modèles de fournisseurs différents via une seule API, et peut basculer de l'un à l'autre selon le coût, la disponibilité ou la tâche.",
  "Comme un comparateur-réservateur de vols qui choisit la compagnie pour vous.",
  "Une start-up passe par LiteLLM pour pouvoir remplacer Claude par Mistral en cas de panne, sans réécrire son code.",
  ["multi-fournisseur", "repli", "api-compatible-openai"], [r"OpenRouter", r"LiteLLM", r"routeurs? (de modèles|de LLM|LLM|multi-fournisseurs?)"], None, slug="routeur-de-llm")
t("Architecture multi-fournisseur", "DEV", "N3",
  "Conception d'une application qui peut utiliser plusieurs fournisseurs de modèles (Anthropic, OpenAI, Mistral, local) derrière une couche d'abstraction, pour éviter la dépendance et gérer les pannes.",
  "Comme une entreprise qui a plusieurs fournisseurs pour ne jamais tomber en rupture.",
  "Un éditeur de logiciel RH envoie les données sensibles à un modèle hébergé en France et le reste à un modèle américain.",
  ["routeur-de-llm", "repli", "souverainete-numerique"], [r"multi-?fournisseurs?", r"multi-?provider"], None, slug="multi-fournisseur")
t("Repli (fallback)", "DEV", "N3",
  "Mécanisme qui bascule automatiquement vers un autre modèle ou fournisseur quand le premier échoue, est trop lent ou refuse la requête.",
  "Comme une roue de secours.",
  "Si l'API principale renvoie une erreur 529, le chatbot d'un e-commerçant bascule sur un modèle plus petit pour répondre quand même.",
  ["multi-fournisseur", "routeur-de-llm", "backoff"], [r"repli", r"fallback"], None, slug="repli")
t("Vercel AI SDK", "DEV", "N3",
  "Bibliothèque TypeScript qui simplifie la création d'interfaces de chat IA en streaming dans Next.js et d'autres frameworks, avec un format unifié pour de nombreux fournisseurs.",
  "Comme un kit de cuisine équipée prêt à installer pour une application de chat.",
  "Une agence web livre en deux jours un assistant de prise de devis sur le site d'un artisan grâce au Vercel AI SDK.",
  ["next-js", "streaming", "typescript"], [r"Vercel AI SDK", r"AI SDK"], None)
t("Next.js", "DEV", "N3",
  "Framework web basé sur React, très utilisé pour créer des sites et applications modernes, avec rendu côté serveur et routes d'API intégrées.",
  "Comme une maison préfabriquée moderne : plomberie et électricité déjà prévues.",
  "Le portail client d'un cabinet d'expertise comptable est développé en Next.js avec un assistant IA intégré.",
  ["vercel-ai-sdk", "typescript"], [r"Next\.js"], None, slug="next-js")
t("Docker (conteneur)", "DEV", "N2",
  "Outil qui emballe une application et tout ce dont elle a besoin dans un « conteneur » qui fonctionne de la même façon sur n'importe quel ordinateur ou serveur.",
  "Comme un conteneur maritime standard : on y met ce qu'on veut, il se charge sur n'importe quel bateau.",
  "Une PME installe n8n et sa base PostgreSQL sur un serveur OVH en une commande Docker Compose.",
  ["docker-compose", "auto-hebergement"], [r"Docker", r"conteneurs?", r"containers?"], "n8n_docker", slug="docker")
t("Docker Compose", "DEV", "N2",
  "Fichier de configuration qui décrit plusieurs conteneurs qui travaillent ensemble (application, base de données, interface) et les lance d'une seule commande.",
  "Comme la partition d'un orchestre qui dit à chaque musicien quand entrer.",
  "Un fichier docker-compose.yml lance ensemble n8n, PostgreSQL et Ollama sur un mini-serveur de bureau.",
  ["docker", "auto-hebergement"], [r"Docker Compose", r"docker-compose"], "n8n_compose")
t("Git et GitHub", "DEV", "N3",
  "Git est l'outil de gestion de versions du code ; GitHub est la plateforme en ligne qui héberge les projets Git et facilite le travail en équipe et l'automatisation (CI/CD).",
  "Comme l'historique des versions d'un document partagé, avec la possibilité de revenir en arrière.",
  "Une équipe versionne ses prompts et ses tests d'évaluation dans GitHub comme du code.",
  ["ci-cd", "test-de-prompts"], [r"\bGit\b", r"GitHub"], "cc_gha", slug="git")
t("CI/CD (intégration et déploiement continus)", "DEV", "N3",
  "Chaîne automatisée qui teste chaque modification du code (intégration continue) puis la met en production si tout est vert (déploiement continu).",
  "Comme un contrôle technique automatique passé à chaque réparation avant de rendre la voiture.",
  "À chaque modification de prompt, GitHub Actions lance 100 cas promptfoo ; si le score baisse, la mise en ligne est bloquée.",
  ["test-de-prompts", "git", "promptfoo"], [r"CI/CD", r"intégration continue", r"GitHub Actions"], "cc_gha", slug="ci-cd")
t("Test de prompts (tests de régression)", "DEV", "N3",
  "Batterie de cas automatisés rejouée à chaque changement de prompt ou de modèle pour vérifier que la qualité ne régresse pas.",
  "Comme les essais de freinage refaits après chaque intervention sur une voiture.",
  "Une start-up vérifie à chaque déploiement que son assistant ne donne jamais de conseil fiscal personnalisé.",
  ["eval", "ci-cd", "promptfoo"], [r"tests? de prompts?", r"tests? de (non-)?régression", r"regression tests?"], "promptfoo", slug="test-de-prompts")
t("Observabilité (LLM)", "DEV", "N3",
  "Capacité à voir ce qui se passe dans une application IA en production : chaque appel, son prompt, sa réponse, sa durée, son coût, ses erreurs, pour diagnostiquer et améliorer.",
  "Comme la boîte noire et le tableau de bord d'un avion.",
  "Grâce à Langfuse, une équipe découvre qu'un prompt mal écrit multiplie par trois le coût d'une fonction.",
  ["trace", "langfuse", "monitoring"], [r"observabilité", r"observability"], None, slug="observabilite")
t("Trace (et span)", "DEV", "N3",
  "Enregistrement détaillé du parcours d'une requête dans une application IA ; chaque étape (appel au modèle, recherche, outil) est un « span » avec sa durée et son coût.",
  "Comme le suivi d'un colis, étape par étape, de l'entrepôt à la livraison.",
  "La trace d'une question client montre 1,2 s de recherche vectorielle, 3,5 s de génération et 0,004 € de coût.",
  ["observabilite", "langfuse"], [r"traces?", r"spans?"], None, slug="trace")
t("Langfuse et LangSmith", "DEV", "N3",
  "Plateformes d'observabilité et d'évaluation pour applications LLM. Langfuse est open source et auto-hébergeable ; LangSmith est l'offre de l'éditeur de LangChain.",
  "Comme un tableau de bord de supervision pour votre assistant IA.",
  "Un intégrateur auto-héberge Langfuse chez un client de la santé pour garder les traces en France.",
  ["observabilite", "trace", "langchain"], [r"Langfuse", r"LangSmith"], None, slug="langfuse")
t("promptfoo", "DEV", "N3",
  "Outil open source de test et d'évaluation de prompts, en ligne de commande, qui compare des modèles sur des cas définis dans un fichier et peut tester la sécurité (red teaming).",
  "Comme un banc d'essai automatisé pour vos prompts.",
  "Une équipe compare Claude, GPT et Mistral sur 80 questions RH avec promptfoo avant de choisir son fournisseur.",
  ["eval", "test-de-prompts", "red-teaming"], [r"promptfoo"], "promptfoo")
t("DeepEval", "DEV", "N3",
  "Bibliothèque Python open source d'évaluation de LLM, qui propose des métriques prêtes à l'emploi (pertinence, fidélité, hallucination) et s'intègre aux tests.",
  "Comme une grille de correction toute faite pour les réponses d'IA.",
  "Un développeur ajoute des tests DeepEval à sa suite pytest pour vérifier la fidélité de son RAG.",
  ["eval", "ragas", "llm-as-a-judge"], [r"DeepEval"], "deepeval")
t("Claude Code", "DEV", "N1",
  "Agent de programmation d'Anthropic qui travaille dans le terminal, l'IDE, l'application de bureau ou le web : il lit un projet, modifie des fichiers, lance des commandes et propose des changements.",
  "Comme un développeur assistant qui a accès à votre atelier et vous demande la permission avant chaque opération sensible.",
  "Un artisan sans compétence en code fait créer par Claude Code un petit outil de devis en HTML.",
  ["agent-de-code", "claude-md", "hooks", "sous-agent"], [r"Claude Code"], "cc")
t("Agent de code", "DEV", "N2",
  "Assistant IA capable d'écrire, modifier, tester et expliquer du code de façon autonome dans un projet : Claude Code, Codex, Cursor, Copilot, Aider, Cline…",
  "Comme un menuisier assistant qui lit le plan, prend les outils et réalise les étapes que vous validez.",
  "Une ESN confie à un agent de code la migration de 200 tests d'un framework à un autre, avec relecture humaine.",
  ["claude-code", "vibe-coding", "swe-bench"], [r"agents? de code", r"coding agents?", r"Codex", r"Cursor", r"Aider", r"Cline"], "cursor", slug="agent-de-code")
t("Vibe coding", "DEV", "N2",
  "Façon de créer un logiciel en décrivant ce que l'on veut en langage naturel et en laissant l'IA écrire le code, souvent sans le lire en détail. Rapide pour prototyper, risqué en production.",
  "Comme faire construire une cabane en décrivant le résultat, sans vérifier les fondations.",
  "Un commerçant crée en un après-midi une page de réservation avec Lovable, puis la fait relire par un développeur avant de la publier.",
  ["agent-de-code", "app-builder"], [r"vibe[- ]coding"], None, slug="vibe-coding")
t("App builder IA (Lovable, Bolt, v0)", "DEV", "N2",
  "Plateformes qui génèrent une application web complète (interface, base de données, hébergement) à partir d'une description en langage naturel.",
  "Comme un architecte qui livre une maquette habitable à partir d'un croquis.",
  "Une association crée avec Bolt une application d'inscription aux ateliers en une journée.",
  ["vibe-coding", "agent-de-code", "no-code"], [r"Lovable", r"\bBolt\b", r"\bv0\b"], None, slug="app-builder")
t("cURL", "DEV", "N3",
  "Outil en ligne de commande qui envoie des requêtes HTTP. Il sert à tester une API en quelques secondes sans écrire de programme.",
  "Comme un téléphone de test pour vérifier qu'une ligne fonctionne.",
  "Un développeur vérifie sa clé API avec une commande curl avant de coder son intégration.",
  ["requete-http", "api"], [r"\bcurl\b"], "anth_api", slug="curl")
t("Backend et frontend", "DEV", "N3",
  "Le frontend est la partie visible d'une application (pages, boutons, chat) ; le backend est la partie serveur qui traite les données, appelle les API et protège les clés.",
  "Comme la salle et la cuisine d'un restaurant.",
  "La clé API d'un chatbot reste dans le backend ; le frontend n'envoie que la question de l'utilisateur.",
  ["api", "gestion-des-secrets", "file-d-attente"], [r"backend", r"frontend", r"côté serveur"], None, slug="backend-frontend")
t("File d'attente (queue)", "DEV", "N3",
  "Mécanisme qui stocke les tâches à traiter et les distribue progressivement à des « workers », pour absorber les pics de charge et respecter les limites d'API.",
  "Comme le ticket numéroté au rayon boucherie.",
  "Les 3 000 factures déposées un lundi matin sont placées en file d'attente et traitées à 50 par minute.",
  ["rate-limit", "queue-mode", "backend-frontend"], [r"files? d'attente", r"queues?\b"], "n8n_scale", slug="file-d-attente")
t("Versioning d'API et de modèles", "DEV", "N3",
  "Gestion des versions successives d'une API ou d'un modèle (identifiants datés, dépréciations), pour qu'une application ne casse pas quand le fournisseur fait évoluer son offre.",
  "Comme les éditions successives d'un code juridique : on sait toujours laquelle s'applique.",
  "Une équipe fixe l'identifiant exact du modèle en production et planifie la migration avant la date de retrait annoncée.",
  ["api", "mlops"], [r"versioning", r"dépréci", r"deprecat"], "anth_version", slug="versioning")
