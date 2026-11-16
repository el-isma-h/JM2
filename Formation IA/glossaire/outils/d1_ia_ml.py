# -*- coding: utf-8 -*-
from core import t

# ===================== IA GÉNÉRALE ET MULTIMÉDIA =====================
t("Intelligence artificielle (IA)", "IA", "N1",
  "Ensemble des techniques qui permettent à un ordinateur d'accomplir des tâches qu'on associait à l'intelligence humaine : comprendre un texte, reconnaître une image, décider, rédiger. Aujourd'hui, la plupart des IA apprennent à partir d'exemples au lieu de suivre des règles écrites à la main.",
  "Comme un apprenti qui devient bon en observant des milliers de gestes de son maître, plutôt qu'en lisant un manuel.",
  "Une mutuelle à Niort utilise une IA pour trier automatiquement les 3 000 courriers reçus chaque jour vers le bon service.",
  ["machine-learning", "deep-learning", "ia-generative"], [r"intelligence artificielle"], "elements")
t("IA générative", "IA", "N1",
  "Famille d'IA capables de créer un contenu nouveau (texte, image, son, vidéo, code) à partir d'une demande écrite. Elle produit ce qui est statistiquement plausible, pas forcément ce qui est vrai.",
  "Comme un musicien de jazz qui improvise un morceau inédit dans le style de ce qu'il a beaucoup écouté.",
  "Une agence immobilière bordelaise génère en 30 secondes une annonce rédigée à partir des caractéristiques d'un appartement.",
  ["intelligence-artificielle", "llm", "modele-de-diffusion", "hallucination"], [r"IA générative", r"generative AI"], "google_genai")
t("IA symbolique", "IA", "N1",
  "Première grande approche de l'IA : des humains écrivent à la main des règles logiques (« si… alors… ») que la machine applique. Elle est transparente mais rigide dès que la situation sort des règles prévues.",
  "Comme un code de la route appliqué à la lettre : parfait tant que la situation est prévue, perdu devant un cas inédit.",
  "Un logiciel de calcul de paie applique des règles explicites (taux, plafonds) : c'est de l'IA symbolique, pas de l'apprentissage.",
  ["systeme-expert", "machine-learning"], [r"IA symbolique", r"symbolique"], "mit6034")
t("Système expert", "IA", "N1",
  "Programme des années 1970-1980 qui reproduit le raisonnement d'un spécialiste grâce à une grande base de règles écrites par des experts. C'est l'ancêtre « à règles » des assistants actuels.",
  "Comme un classeur géant de fiches réflexes rédigées par un médecin chevronné.",
  "Un outil de diagnostic de pannes de chaudières utilisé par un chauffagiste, qui pose des questions et suit un arbre de règles.",
  ["ia-symbolique", "hiver-de-l-ia"], [r"systèmes? experts?"], "mit6034")
t("Test de Turing", "IA", "N1",
  "Expérience proposée par Alan Turing en 1950 : si un humain qui discute par écrit ne sait pas dire s'il parle à une machine ou à une personne, la machine « réussit » le test. Il mesure l'imitation, pas la compréhension.",
  "Comme un jeu de devinettes au téléphone : savoir si votre interlocuteur est un comédien ou la vraie personne.",
  "Un client d'une banque en ligne ne réalise pas que le chat du soir est tenu par un assistant IA : la conversation « passe » le test.",
  ["intelligence-artificielle", "agi"], [r"test de Turing", r"Turing"], "mit6034")
t("AGI (Artificial General Intelligence)", "IA", "N1",
  "Intelligence artificielle générale : une IA hypothétique capable d'apprendre et de réussir n'importe quelle tâche intellectuelle aussi bien qu'un humain. Il n'existe pas de définition partagée ni de consensus sur la date de son arrivée.",
  "Comme un employé polyvalent capable d'occuper n'importe quel poste de l'entreprise, là où les IA actuelles restent des spécialistes très doués.",
  "Lors d'un comité de direction, distinguer les promesses « AGI » d'un fournisseur des tâches concrètes que son outil sait vraiment faire.",
  ["ia-etroite", "intelligence-artificielle"], [r"=AGI", r"intelligence artificielle générale"], "aiindex")
t("IA étroite (IA faible)", "IA", "N1",
  "IA spécialisée dans une tâche ou un domaine précis (traduire, reconnaître des visages, jouer aux échecs). Toutes les IA en service aujourd'hui en font partie, même les plus polyvalentes.",
  "Comme un GPS : imbattable pour trouver un itinéraire, incapable de vous conseiller sur un contrat.",
  "Le filtre anti-spam de la messagerie d'une PME est une IA étroite : excellent sur les courriels, inutile ailleurs.",
  ["agi", "intelligence-artificielle"], [r"IA (étroite|faible)", r"narrow AI"], "elements")
t("Hiver de l'IA", "IA", "N1",
  "Période où l'enthousiasme et les financements pour l'IA s'effondrent après des promesses non tenues. Il y en a eu deux, vers 1974 et vers 1987.",
  "Comme une bulle immobilière qui éclate : après l'euphorie, plus personne ne veut investir pendant des années.",
  "Un formateur cite les hivers de l'IA pour aider un dirigeant à garder un regard critique sur les annonces spectaculaires.",
  ["systeme-expert", "intelligence-artificielle"], [r"hivers? de l'IA", r"AI winter"], "mit6034")
t("Modèle (IA)", "IA", "N1",
  "Le « cerveau » d'une IA : un gros fichier de nombres obtenu par entraînement, qui transforme une entrée (texte, image) en sortie (réponse, prédiction). On l'utilise ensuite sans le modifier.",
  "Comme une recette mise au point après des centaines d'essais : une fois écrite, on la suit pour chaque nouveau plat.",
  "Le modèle de scoring d'une banque régionale reçoit un dossier de crédit et renvoie une probabilité de défaut.",
  ["poids", "entrainement", "inference"], [r"\*\*modèles?\*\*", r"modèle d'IA", r"modèles? d'IA"], "elements", slug="modele")
t("Algorithme", "IA", "N1",
  "Suite d'instructions précises qui permet de résoudre un problème étape par étape. En IA, un algorithme d'apprentissage est la méthode qui fabrique un modèle à partir des données.",
  "Comme une recette de cuisine : des étapes dans un ordre précis pour obtenir un résultat.",
  "L'algorithme de Parcoursup classe et affecte les vœux des lycéens selon des règles définies.",
  ["modele", "machine-learning"], [r"algorithmes?"], "mitai101")
t("Entraînement", "IA", "N1",
  "Phase pendant laquelle un modèle apprend : on lui montre des exemples, il se trompe, et on corrige ses réglages internes des millions de fois jusqu'à ce qu'il se trompe peu. C'est l'étape la plus longue et la plus coûteuse.",
  "Comme les heures de conduite avant le permis : on répète, on se trompe, le moniteur corrige.",
  "Une start-up lyonnaise entraîne un modèle sur 50 000 factures annotées pour qu'il reconnaisse automatiquement le montant TTC.",
  ["inference", "donnees-d-entrainement", "pre-entrainement"], [r"entraînement", r"training"], "mlcc", slug="entrainement")
t("Inférence", "IA", "N1",
  "Moment où l'on utilise un modèle déjà entraîné pour obtenir une réponse sur une nouvelle donnée. Chaque question posée à ChatGPT ou Claude est une inférence.",
  "Comme un chef qui cuisine pour un client avec une recette déjà maîtrisée : il n'apprend plus, il exécute.",
  "Chaque fois qu'un conseiller d'un cabinet RH demande un résumé de CV à Claude, il déclenche une inférence facturée en tokens.",
  ["entrainement", "serveur-d-inference", "token"], [r"inférence", r"inference"], "mlcc", slug="inference")
t("Vision par ordinateur", "IA", "N1",
  "Branche de l'IA qui permet à une machine d'analyser des images ou des vidéos : reconnaître des objets, lire du texte, détecter des défauts. Elle repose surtout sur le deep learning.",
  "Comme donner des yeux entraînés à l'ordinateur, à la manière d'un contrôleur qualité qui repère un défaut au premier coup d'œil.",
  "Une fromagerie du Jura détecte automatiquement les meules mal formées sur la chaîne grâce à une caméra et un modèle de vision.",
  ["cnn", "ocr", "multimodal"], [r"vision par ordinateur", r"computer vision"], "hf_cv")
t("TAL (Traitement automatique du langage) — NLP", "IA", "N1",
  "Traitement automatique du langage (en anglais Natural Language Processing, NLP) : tout ce qui permet à une machine de lire, comprendre, traduire ou produire du texte humain. Les LLM en sont aujourd'hui l'outil principal.",
  "Comme un interprète qui sait aussi résumer, classer et rédiger.",
  "Un service client analyse automatiquement le ton (satisfait, en colère) des avis Google laissés sur ses agences.",
  ["llm", "token", "intelligence-artificielle"], [r"=TAL", r"=NLP", r"traitement automatique du langage"], "cs224n", slug="tal-nlp")
t("Système de recommandation", "IA", "N1",
  "IA qui propose à chaque personne des contenus ou produits susceptibles de l'intéresser, en analysant ses comportements et ceux d'utilisateurs similaires.",
  "Comme le libraire qui vous connaît et vous dit : « Les clients qui ont aimé ce roman ont adoré celui-ci. »",
  "Un site e-commerce de vins à Dijon suggère des bouteilles selon l'historique d'achat de chaque client.",
  ["intelligence-artificielle", "machine-learning"], [r"recommandation"], "mlcc")
t("IA prédictive", "IA", "N1",
  "IA qui estime ce qui va probablement se passer à partir de données passées : ventes, pannes, départs de clients. Elle donne une probabilité, pas une certitude.",
  "Comme la météo : une prévision fiable en moyenne, jamais une garantie.",
  "Une enseigne de boulangeries prévoit le nombre de baguettes à cuire chaque matin selon la météo et le jour de la semaine.",
  ["regression", "classification", "machine-learning"], [r"IA prédictive", r"prédiction"], "mlcc")
t("Reconnaissance vocale (speech-to-text)", "IA", "N2",
  "Technologie qui transforme une parole enregistrée en texte écrit. Les modèles récents comme Whisper transcrivent plusieurs langues avec ponctuation.",
  "Comme un sténographe infatigable qui tape tout ce qu'il entend.",
  "Un cabinet d'avocats transcrit automatiquement ses comptes rendus de réunion dictés sur smartphone.",
  ["synthese-vocale", "multimodal"], [r"reconnaissance vocale", r"speech-to-text", r"transcription", r"Whisper"], "oa_stt")
t("Synthèse vocale (TTS)", "IA", "N2",
  "Synthèse vocale (Text-To-Speech, TTS) : technologie qui lit un texte à voix haute avec une voix de synthèse de plus en plus naturelle, parfois clonée à partir d'un enregistrement.",
  "Comme un comédien de doublage disponible 24 h/24 qui lit n'importe quel script.",
  "Un organisme de formation produit la version audio de ses modules e-learning pour les apprenants malvoyants.",
  ["reconnaissance-vocale", "clonage-de-voix"], [r"synthèse vocale", r"text-to-speech", r"=TTS"], "oa_tts")
t("Clonage de voix", "IA", "N2",
  "Technique qui reproduit la voix d'une personne réelle à partir de quelques secondes ou minutes d'enregistrement. Utile pour le doublage, dangereuse pour les arnaques.",
  "Comme un imitateur de talent… qui n'aurait besoin que d'un message vocal pour vous copier.",
  "Une escroquerie au « faux président » : un comptable reçoit un appel avec la voix clonée de son PDG demandant un virement urgent.",
  ["deepfake", "synthese-vocale", "phishing-ia"], [r"clonage de (la )?voix", r"voix clonée", r"voice cloning"], "senat_deepfake")
t("Modèle de diffusion", "IA", "N2",
  "Type de modèle génératif qui crée une image en partant d'un bruit aléatoire qu'il « nettoie » étape par étape jusqu'à obtenir l'image décrite. Stable Diffusion et Flux fonctionnent ainsi.",
  "Comme un sculpteur qui part d'un bloc brut et retire de la matière petit à petit jusqu'à révéler la forme.",
  "Une agence de communication à Nantes génère des visuels d'ambiance pour une campagne avec Flux en local.",
  ["text-to-image", "ia-generative", "comfyui"], [r"diffusion"], "hf_diff")
t("Text-to-image", "IA", "N1",
  "Génération d'une image à partir d'une description écrite (le prompt). Midjourney, gpt-image, Flux ou Stable Diffusion en sont des exemples.",
  "Comme décrire une scène à un illustrateur qui la dessine en quelques secondes.",
  "Un restaurant crée l'illustration de sa nouvelle carte d'automne à partir de la phrase « tarte aux figues sur table en bois, lumière douce ».",
  ["modele-de-diffusion", "text-to-video", "prompt"], [r"text-to-image", r"génération d'images?", r"Midjourney"], "oa_img")
t("Text-to-video", "IA", "N2",
  "Génération d'une courte vidéo à partir d'une description écrite ou d'une image de départ. Sora, Veo, Runway et Kling sont les outils les plus connus en 2026.",
  "Comme confier un storyboard à une équipe de tournage qui livre le plan filmé dans la minute.",
  "Un office de tourisme produit une vidéo de 10 secondes pour Instagram montrant un vignoble au lever du soleil.",
  ["text-to-image", "deepfake"], [r"text-to-video", r"génération de vidéos?", r"Sora", r"=Veo", r"Runway"], "msgenai")
t("Multimodal", "IA", "N1",
  "Se dit d'un modèle capable de comprendre ou produire plusieurs types de contenus : texte, images, audio, vidéo. On peut par exemple lui envoyer une photo et lui poser une question dessus.",
  "Comme un collègue à qui l'on peut à la fois parler, montrer un document et faire écouter un enregistrement.",
  "Un expert en sinistres envoie la photo d'un dégât des eaux à Claude pour obtenir une première description et une liste de questions à poser.",
  ["vision-par-ordinateur", "llm", "vision-api"], [r"multimodal(e|es|ité)?"], "anth_vision")
t("Assistant conversationnel (chatbot)", "IA", "N1",
  "Programme avec lequel on dialogue en langage naturel, par écrit ou à l'oral. Les assistants modernes (ChatGPT, Claude, Gemini, Le Chat) reposent sur des LLM.",
  "Comme un standardiste qui répond à toutes les questions, à toute heure.",
  "Le site d'une mairie propose un chatbot qui répond aux questions sur les inscriptions à la cantine.",
  ["llm", "chatgpt", "claude"], [r"chatbots?", r"assistant conversationnel", r"agent conversationnel"], "anth_claude101", slug="chatbot")
t("OCR (Optical Character Recognition)", "IA", "N2",
  "Reconnaissance optique de caractères : technologie qui extrait le texte d'une image ou d'un PDF scanné pour le rendre copiable et analysable.",
  "Comme une secrétaire qui retape fidèlement un document photocopié.",
  "Un cabinet comptable numérise des tickets de caisse et en extrait automatiquement date, TVA et montant.",
  ["vision-par-ordinateur", "parsing"], [r"=OCR", r"reconnaissance optique"], "mistral_ocr")
t("Modèle de fondation", "IA", "N1",
  "Très grand modèle entraîné sur des données variées et massives, ensuite adapté à de nombreuses tâches (rédaction, code, analyse). GPT, Claude, Gemini ou Llama sont des modèles de fondation.",
  "Comme les fondations d'un immeuble : une base solide sur laquelle on construit des étages très différents.",
  "Un éditeur de logiciel RH construit son assistant de recrutement au-dessus d'un modèle de fondation plutôt que de partir de zéro.",
  ["llm", "pre-entrainement", "fine-tuning"], [r"modèles? de fondation", r"foundation models?"], "mit_fm")
t("ComfyUI", "IA", "N2",
  "Logiciel libre qui permet de générer des images (et vidéos) en local avec des modèles de diffusion, en reliant des blocs visuels dans un graphe.",
  "Comme une table de mixage où chaque bouton règle une étape de la fabrication de l'image.",
  "Un studio graphique génère en interne des déclinaisons de visuels produits sans envoyer les fichiers clients dans le cloud.",
  ["modele-de-diffusion", "llm-local"], [r"ComfyUI"], None)
t("Perplexity", "IA", "N1",
  "Moteur de réponse qui combine recherche web et LLM : il cherche des pages, les lit et rédige une réponse avec des citations cliquables.",
  "Comme un documentaliste qui lit dix articles pour vous et vous rend une synthèse avec les références.",
  "Un juriste en PME vérifie en deux minutes les dernières actualités sur un décret, en contrôlant chaque source citée.",
  ["recherche-augmentee", "citations", "rag"], [r"Perplexity"], "pplx")
t("Recherche augmentée par l'IA", "IA", "N1",
  "Usage où l'IA interroge le web ou des documents en direct avant de répondre, pour s'appuyer sur des informations récentes et sourcées plutôt que sur sa seule mémoire.",
  "Comme un journaliste qui vérifie ses informations avant d'écrire, au lieu de parler de mémoire.",
  "Un commercial prépare un rendez-vous en demandant à Perplexity les dernières actualités publiques d'un prospect.",
  ["perplexity", "rag", "grounding"], [r"recherche augmentée", r"recherche web", r"web search"], "xai_search", slug="recherche-augmentee")
t("Grounding (ancrage)", "IA", "N3",
  "Fait de relier la réponse d'un modèle à des sources vérifiables (résultats de recherche, documents fournis) pour limiter les inventions.",
  "Comme exiger d'un témoin qu'il montre ses preuves plutôt que de raconter de mémoire.",
  "Une API Gemini avec Google Search renvoie une réponse sur un taux de TVA accompagnée des pages officielles consultées.",
  ["rag", "hallucination", "citations"], [r"grounding", r"ancrage"], "gem_ground")
t("ChatGPT", "IA", "N1",
  "Assistant conversationnel d'OpenAI, lancé en novembre 2022, qui a popularisé l'IA générative auprès du grand public. Il s'appuie sur les modèles GPT.",
  "Comme le premier smartphone grand public : pas le premier de sa catégorie, mais celui qui a tout déclenché.",
  "Une assistante de direction utilise ChatGPT pour reformuler un courrier de relance plus diplomatique.",
  ["gpt", "chatbot", "claude"], [r"ChatGPT"], "oa_academy")
t("Claude", "IA", "N1",
  "Famille de modèles et assistant d'Anthropic. Claude est disponible en application web, bureau, mobile, dans Claude Code et via l'API.",
  "Comme un collaborateur à qui l'on peut confier des documents longs et des projets suivis dans le temps.",
  "Un consultant dépose 300 pages d'appel d'offres dans un projet Claude et obtient la liste des exigences éliminatoires.",
  ["chatbot", "claude-code", "projet-claude"], [r"\bClaude\b"], "anth_intro")
t("Gemini", "IA", "N1",
  "Famille de modèles et assistant de Google, intégrés à Google Workspace (Gmail, Docs, Sheets) et disponibles via l'API Gemini.",
  "Comme un assistant déjà installé dans les bureaux de l'entreprise si elle travaille sous Google.",
  "Une école de commerce utilise Gemini dans Google Docs pour résumer les comptes rendus de conseils pédagogiques.",
  ["chatbot", "gems"], [r"Gemini"], "gem_models")
t("Mistral AI", "IA", "N1",
  "Entreprise française qui développe des modèles de langage, dont certains à poids ouverts, et l'assistant Le Chat. Souvent citée pour la souveraineté numérique européenne.",
  "Comme un constructeur automobile européen face aux géants américains et chinois.",
  "Une collectivité choisit un modèle Mistral hébergé en France pour un assistant interne traitant des données de citoyens.",
  ["modele-a-poids-ouverts", "souverainete-numerique"], [r"Mistral"], "mistral")
t("Le Chat", "IA", "N1",
  "Assistant conversationnel de Mistral AI, accessible sur le web et en application mobile, avec recherche web, génération d'images et agents.",
  "Comme la version « maison » française d'un assistant conversationnel.",
  "Une PME qui veut un outil européen pour ses équipes commerciales teste Le Chat Pro.",
  ["mistral-ai", "chatbot"], [r"Le Chat"], "mistral")
t("Grok", "IA", "N1",
  "Famille de modèles et assistant de xAI, intégré au réseau social X, avec un accès en direct aux publications de X et au web.",
  "Comme un assistant qui lit les fils d'actualité en continu.",
  "Un community manager suit la perception d'un lancement de produit sur X en interrogeant Grok.",
  ["chatbot", "recherche-augmentee"], [r"Grok"], "xai_models")
t("Copilot (Microsoft)", "IA", "N1",
  "Assistant IA de Microsoft intégré à Windows, Edge et Microsoft 365 (Word, Excel, Outlook, Teams). Il s'appuie notamment sur des modèles d'OpenAI.",
  "Comme un assistant installé directement dans chaque logiciel de bureautique.",
  "Une DRH demande à Copilot dans Teams le résumé de la réunion d'hier et la liste des actions décidées.",
  ["chatbot", "copilot-studio"], [r"Copilot"], None, slug="copilot-microsoft")
t("NotebookLM", "IA", "N2",
  "Outil de Google qui répond uniquement à partir des documents que vous lui fournissez (PDF, pages web, vidéos), avec des citations vers les passages. Il peut aussi produire des résumés audio.",
  "Comme un documentaliste enfermé dans votre bibliothèque : il ne cite que vos livres.",
  "Un formateur charge les 12 fiches de son module et génère un quiz de révision qui cite les pages sources.",
  ["rag", "base-de-connaissances"], [r"NotebookLM"], None)

# ===================== MACHINE LEARNING ET MATHS =====================
t("Machine learning (apprentissage automatique)", "ML", "N1",
  "Branche de l'IA où la machine apprend des régularités à partir d'exemples au lieu de suivre des règles écrites à la main. Plus elle voit d'exemples de qualité, meilleure elle devient.",
  "Comme un enfant qui apprend à reconnaître les chiens en en voyant beaucoup, sans qu'on lui donne de définition.",
  "Un fournisseur d'énergie prévoit la consommation de ses clients à partir de cinq ans d'historique de relevés.",
  ["apprentissage-supervise", "deep-learning", "intelligence-artificielle"], [r"machine learning", r"apprentissage automatique"], "cs229", slug="machine-learning")
t("Apprentissage supervisé", "ML", "N1",
  "Méthode où l'on montre au modèle des exemples accompagnés de la bonne réponse (l'étiquette). Il apprend ensuite à prédire la réponse pour de nouveaux cas.",
  "Comme un élève qui révise avec des exercices corrigés.",
  "Une assurance entraîne un modèle sur 100 000 déclarations de sinistres marquées « frauduleuse » ou « normale ».",
  ["etiquette", "classification", "regression"], [r"apprentissage supervisé", r"supervised learning", r"supervisé"], "mlcc")
t("Apprentissage non supervisé", "ML", "N1",
  "Méthode où le modèle reçoit des données sans réponse attendue et cherche lui-même des regroupements ou des structures cachées.",
  "Comme trier un carton de photos de famille en piles sans savoir à l'avance quelles catégories existent.",
  "Une enseigne de prêt-à-porter découvre quatre profils de clientes en regroupant automatiquement leurs habitudes d'achat.",
  ["clustering", "k-means", "pca"], [r"non supervisé", r"unsupervised"], "cs229")
t("Apprentissage par renforcement", "ML", "N1",
  "Méthode où un agent apprend par essais et erreurs en recevant des récompenses ou des pénalités selon ses actions. C'est ainsi qu'on a appris à des IA à jouer au go.",
  "Comme dresser un chien avec des friandises : le bon comportement est récompensé.",
  "Un entrepôt logistique optimise les déplacements de ses robots en récompensant les trajets les plus courts.",
  ["rlhf", "agent-ia"], [r"apprentissage par renforcement", r"reinforcement learning", r"=RL\b"], "hf_rl")
t("Apprentissage auto-supervisé", "ML", "N4",
  "Méthode où les données fabriquent elles-mêmes leurs exercices : on masque une partie (le mot suivant, un morceau d'image) et le modèle apprend à la deviner. C'est ainsi que les LLM sont pré-entraînés.",
  "Comme un texte à trous que l'on se fabrique soi-même à partir d'un livre.",
  "Un LLM apprend le français juridique en devinant, des milliards de fois, le mot suivant dans des textes de loi publics.",
  ["pre-entrainement", "prediction-du-token-suivant"], [r"auto-supervisé", r"self-supervised"], "cs336")
t("Données d'entraînement", "ML", "N1",
  "Ensemble des exemples utilisés pour apprendre à un modèle. Leur qualité, leur quantité et leur représentativité déterminent en grande partie la qualité du modèle.",
  "Comme les ingrédients d'un plat : un grand chef ne rattrape pas des produits avariés.",
  "Un modèle de tri de CV entraîné uniquement sur des recrutements passés masculins reproduira ce déséquilibre.",
  ["jeu-de-donnees", "biais-algorithmique", "entrainement"], [r"données d'entraînement", r"training data"], "mlcc", slug="donnees-d-entrainement")
t("Étiquette (label)", "ML", "N4",
  "La bonne réponse associée à un exemple dans l'apprentissage supervisé : « spam » ou « pas spam », un prix, une catégorie.",
  "Comme la correction écrite en rouge sous chaque exercice.",
  "Des gestionnaires de paie annotent 5 000 bulletins avec la convention collective applicable pour entraîner un classifieur.",
  ["apprentissage-supervise", "caracteristique"], [r"étiquettes?", r"labels?"], "mlcc", slug="etiquette")
t("Caractéristique (feature)", "ML", "N4",
  "Une information mesurable utilisée par le modèle pour prédire : surface d'un logement, âge d'un client, nombre d'achats. Bien choisir les caractéristiques est souvent décisif.",
  "Comme les critères qu'un agent immobilier regarde pour estimer un prix : quartier, surface, étage.",
  "Pour prédire les résiliations d'abonnement, une salle de sport utilise la fréquence de passage et l'ancienneté comme caractéristiques.",
  ["etiquette", "feature-engineering"], [r"caractéristiques?", r"features?"], "mlcc", slug="caracteristique")
t("Feature engineering", "ML", "N4",
  "Travail qui consiste à créer, transformer ou sélectionner les caractéristiques données au modèle pour l'aider à mieux apprendre.",
  "Comme préparer et découper les ingrédients avant la cuisson : le plat dépend beaucoup de cette étape.",
  "À partir d'une date de commande, un e-commerçant crée « jour de la semaine » et « veille de fête » pour mieux prévoir les ventes.",
  ["caracteristique", "normalisation-des-donnees"], [r"feature engineering", r"ingénierie des caractéristiques"], "mlcc")
t("Classification", "ML", "N1",
  "Tâche où le modèle range chaque élément dans une catégorie parmi plusieurs : spam / non-spam, chat / chien, réclamation / demande d'information.",
  "Comme le tri du courrier dans des casiers.",
  "Le service client d'un opérateur télécom classe automatiquement chaque e-mail entrant en « facturation », « panne » ou « résiliation ».",
  ["regression", "regression-logistique", "matrice-de-confusion"], [r"classification", r"classifieur", r"classifier"], "mlcc")
t("Régression", "ML", "N4",
  "Tâche où le modèle prédit une valeur numérique continue : un prix, une durée, une quantité.",
  "Comme estimer le prix d'une maison d'après ses caractéristiques.",
  "Un réseau d'agences immobilières estime le prix de vente d'un appartement à partir de sa surface, de son quartier et de son DPE.",
  ["regression-lineaire", "classification"], [r"régression"], "cs229", slug="regression")
t("Régression linéaire", "ML", "N4",
  "Modèle le plus simple pour prédire un nombre : il trace la droite (ou le plan) qui passe au plus près des points observés.",
  "Comme tracer à la règle la tendance d'un nuage de points sur un graphique.",
  "Le projet 42 ft_linear_regression prédit le prix d'une voiture d'occasion à partir de son kilométrage.",
  ["regression", "descente-de-gradient", "fonction-de-cout"], [r"régression linéaire", r"linear regression"], "cs229")
t("Régression logistique", "ML", "N4",
  "Malgré son nom, modèle de classification : il calcule la probabilité qu'un élément appartienne à une catégorie (entre 0 et 1) grâce à une courbe en S.",
  "Comme un thermomètre de probabilité : en dessous de 50 % on dit non, au-dessus on dit oui.",
  "Une banque estime la probabilité qu'un client accepte une offre de crédit immobilier pour cibler ses appels.",
  ["classification", "sigmoide"], [r"régression logistique", r"logistic regression"], "cs229")
t("Surapprentissage (overfitting)", "ML", "N4",
  "Défaut d'un modèle qui a « appris par cœur » ses exemples d'entraînement, bruit compris, et se trompe sur des données nouvelles.",
  "Comme un élève qui récite les annales sans comprendre et échoue dès que l'énoncé change.",
  "Un modèle de prévision de ventes parfait sur 2024 s'effondre en 2025 parce qu'il avait mémorisé des événements ponctuels.",
  ["sous-apprentissage", "regularisation", "validation-croisee", "biais-variance"], [r"surapprentissage", r"sur-apprentissage", r"overfitting"], "mlcc", slug="surapprentissage")
t("Sous-apprentissage (underfitting)", "ML", "N4",
  "Défaut d'un modèle trop simple pour saisir les régularités des données : il se trompe autant sur l'entraînement que sur les nouveaux cas.",
  "Comme résumer la météo de l'année par « il fait doux » : trop simple pour être utile.",
  "Prédire la consommation électrique d'un bâtiment avec une simple moyenne annuelle ignore les saisons : c'est du sous-apprentissage.",
  ["surapprentissage", "biais-variance"], [r"sous-apprentissage", r"underfitting"], "mlcc", slug="sous-apprentissage")
t("Compromis biais-variance", "ML", "N4",
  "Équilibre à trouver entre un modèle trop simple (biais élevé, il rate la tendance) et un modèle trop complexe (variance élevée, il colle au bruit). Le bon modèle se situe entre les deux.",
  "Comme régler une paire de jumelles : trop flou d'un côté, trop sensible au moindre tremblement de l'autre.",
  "Un data scientist d'une coopérative agricole compare plusieurs profondeurs d'arbre pour prédire les rendements sans surapprendre.",
  ["surapprentissage", "sous-apprentissage", "regularisation"], [r"biais[- ]variance", r"bias[- ]variance"], "cs229", slug="biais-variance")
t("Régularisation", "ML", "N4",
  "Ensemble de techniques qui pénalisent la complexité d'un modèle pour l'empêcher de surapprendre (L1, L2, dropout, arrêt précoce).",
  "Comme imposer un nombre de mots maximum à un rédacteur pour qu'il aille à l'essentiel.",
  "Un modèle de scoring client est régularisé pour ne pas accorder un poids démesuré à une seule variable rare.",
  ["surapprentissage", "dropout", "biais-variance"], [r"régularisation", r"regularization"], "cs229", slug="regularisation")
t("Validation croisée", "ML", "N4",
  "Méthode d'évaluation qui découpe les données en plusieurs parts, entraîne le modèle sur certaines et le teste sur les autres, en tournant, pour obtenir une mesure fiable.",
  "Comme faire goûter un plat à plusieurs jurys différents plutôt qu'à un seul.",
  "Avec seulement 800 dossiers historiques, une PME évalue son modèle de prévision d'impayés en validation croisée à 5 plis.",
  ["jeu-de-test", "surapprentissage"], [r"validation croisée", r"cross-validation", r"k-fold"], "cs229", slug="validation-croisee")
t("Jeu d'entraînement, de validation et de test", "ML", "N4",
  "Découpage des données en trois parts : l'une sert à apprendre, la deuxième à régler le modèle, la troisième, gardée de côté, à mesurer honnêtement sa performance finale.",
  "Comme les exercices du cours, le devoir maison et l'examen final, qu'on ne voit qu'une fois.",
  "Une start-up garde 20 % de ses factures annotées hors de l'entraînement pour vérifier que son extracteur marche sur des factures inconnues.",
  ["validation-croisee", "fuite-de-donnees"], [r"jeu de (test|validation)", r"ensemble de (test|validation)", r"train/test", r"test set"], "mlcc", slug="jeu-de-test")
t("Fuite de données (data leakage)", "ML", "N4",
  "Erreur où une information qui ne serait pas disponible en vrai se glisse dans l'entraînement, ce qui rend les résultats artificiellement excellents.",
  "Comme un élève qui a vu le corrigé avant l'examen : sa note ne prouve rien.",
  "Un modèle de prévision de résiliation utilise par erreur la colonne « date de résiliation » et affiche 99 % de réussite.",
  ["jeu-de-test", "surapprentissage"], [r"data leakage", r"fuite de données"], "mlcc", slug="data-leakage")
t("Arbre de décision", "ML", "N4",
  "Modèle qui prend une décision en posant une série de questions simples (« revenu > 2 000 € ? ») comme un organigramme. Facile à lire et à expliquer.",
  "Comme le jeu « Qui est-ce ? » : chaque question élimine des possibilités.",
  "Une caisse d'allocations utilise un arbre de décision lisible pour pré-orienter les demandes d'aide.",
  ["foret-aleatoire", "gradient-boosting", "explicabilite"], [r"arbres? de décision", r"decision trees?"], "cs229")
t("Forêt aléatoire (random forest)", "ML", "N4",
  "Modèle qui combine des centaines d'arbres de décision entraînés chacun sur une partie différente des données, puis fait voter leurs réponses.",
  "Comme demander l'avis à un conseil de 300 experts un peu différents et retenir la majorité.",
  "Un assureur auto estime le risque de sinistre d'un jeune conducteur avec une forêt aléatoire.",
  ["arbre-de-decision", "gradient-boosting"], [r"forêts? aléatoires?", r"random forests?"], "cs229", slug="foret-aleatoire")
t("Gradient boosting", "ML", "N4",
  "Méthode qui construit des arbres les uns après les autres, chacun corrigeant les erreurs des précédents. XGBoost, LightGBM et CatBoost en sont les versions populaires, très efficaces sur les tableaux de données.",
  "Comme une relecture en chaîne où chaque correcteur reprend uniquement les fautes laissées par le précédent.",
  "Un distributeur prévoit les ruptures de stock de 2 000 références avec LightGBM.",
  ["arbre-de-decision", "foret-aleatoire"], [r"gradient boosting", r"XGBoost", r"LightGBM"], "cs229")
t("Clustering (partitionnement)", "ML", "N4",
  "Tâche non supervisée qui regroupe automatiquement des éléments qui se ressemblent, sans catégories fixées à l'avance.",
  "Comme ranger des chaussettes dépareillées en tas de couleurs voisines.",
  "Une banque mutualiste segmente ses sociétaires en groupes de comportements pour adapter ses offres.",
  ["k-means", "apprentissage-non-supervise"], [r"clustering", r"partitionnement"], "cs229")
t("K-means", "ML", "N4",
  "Algorithme de clustering qui répartit les données en K groupes autour de K centres, en déplaçant les centres jusqu'à stabilité.",
  "Comme placer K camions de glaces sur une plage pour qu'aucun baigneur n'ait trop à marcher.",
  "Un réseau de pharmacies regroupe ses officines en 5 profils de ventes pour adapter les assortiments.",
  ["clustering", "apprentissage-non-supervise"], [r"k-means", r"k-moyennes"], "cs229")
t("PCA (analyse en composantes principales)", "ML", "N4",
  "Méthode qui résume de nombreuses variables en quelques axes principaux qui conservent l'essentiel de l'information. Utile pour visualiser ou alléger des données.",
  "Comme photographier un objet 3D sous l'angle qui montre le mieux sa forme.",
  "Un institut de sondage résume 40 questions de satisfaction en 3 axes interprétables.",
  ["reduction-de-dimension", "apprentissage-non-supervise"], [r"=PCA", r"=ACP", r"composantes principales"], "cs229")
t("Réduction de dimension", "ML", "N4",
  "Ensemble de techniques qui représentent des données à nombreuses colonnes avec beaucoup moins de colonnes, en perdant le moins d'information possible.",
  "Comme une carte routière : elle aplatit la Terre en 2D tout en restant utile.",
  "On réduit des embeddings de 1 536 dimensions à 2 pour afficher sur un graphique la carte des tickets de support.",
  ["pca", "embedding"], [r"réduction de (la )?dimension"], "cs229", slug="reduction-de-dimension")
t("Matrice de confusion", "ML", "N4",
  "Tableau qui compte, pour un classifieur, les bonnes réponses et chaque type d'erreur (faux positifs, faux négatifs).",
  "Comme le bilan d'un contrôleur de billets : fraudeurs attrapés, fraudeurs ratés, voyageurs honnêtes verbalisés à tort.",
  "Un détecteur de fraude bancaire montre 40 faux positifs pour 1 000 transactions : le service client va être débordé d'appels.",
  ["precision-et-rappel", "f1-score", "classification"], [r"matrice de confusion", r"confusion matrix", r"faux positifs?", r"faux négatifs?"], "mlcc")
t("Précision et rappel", "ML", "N4",
  "Deux mesures d'un classifieur : la précision dit quelle part des alertes est juste, le rappel dit quelle part des vrais cas a été trouvée. Améliorer l'une dégrade souvent l'autre.",
  "Comme un filet de pêche : mailles serrées, on attrape tout (rappel) mais aussi des algues ; mailles larges, que du poisson (précision) mais on en rate.",
  "Pour détecter des fraudes, une banque privilégie le rappel ; pour un filtre anti-spam, la précision évite de perdre des mails clients.",
  ["matrice-de-confusion", "f1-score", "exactitude"], [r"précision", r"rappel", r"recall"], "mlcc")
t("F1-score", "ML", "N4",
  "Note unique qui combine précision et rappel (leur moyenne harmonique). Elle est utile quand les classes sont déséquilibrées.",
  "Comme une note globale qui pénalise un élève excellent à l'oral mais nul à l'écrit.",
  "Une équipe compare deux modèles de détection de factures en double grâce à leur F1-score.",
  ["precision-et-rappel", "matrice-de-confusion"], [r"F1"], "mlcc")
t("Exactitude (accuracy)", "ML", "N4",
  "Pourcentage de bonnes réponses d'un modèle. Trompeuse quand une catégorie est rare : prédire toujours « pas de fraude » donne 99 % d'exactitude si 1 % des cas sont frauduleux.",
  "Comme un détecteur d'incendie jamais déclenché : « juste » 364 jours sur 365, inutile le seul jour qui compte.",
  "Un responsable qualité refuse un modèle affichant 98 % d'exactitude car il ne détecte aucune pièce défectueuse.",
  ["precision-et-rappel", "matrice-de-confusion"], [r"accuracy", r"exactitude"], "mlcc")
t("Courbe ROC et AUC", "ML", "N4",
  "La courbe ROC montre comment évoluent bonnes détections et fausses alertes quand on change le seuil de décision ; l'AUC, l'aire sous cette courbe, résume la qualité du modèle (1 = parfait, 0,5 = hasard).",
  "Comme régler la sensibilité d'une alarme de voiture et tracer combien de vrais vols et de fausses alertes on obtient à chaque réglage.",
  "Un service de recouvrement compare deux modèles de risque d'impayé par leur AUC avant de choisir un seuil.",
  ["precision-et-rappel", "regression-logistique"], [r"=ROC", r"=AUC"], "mlcc", slug="roc-auc")
t("Hyperparamètre", "ML", "N4",
  "Réglage choisi par l'humain avant l'entraînement (taux d'apprentissage, profondeur d'un arbre, nombre d'époques), par opposition aux paramètres que le modèle apprend seul.",
  "Comme la température et la durée du four : vous les fixez, le gâteau fait le reste.",
  "Une équipe teste 20 combinaisons d'hyperparamètres pour son modèle de prévision de trafic en gare.",
  ["parametre", "taux-d-apprentissage", "validation-croisee"], [r"hyperparamètres?", r"hyperparameters?"], "mlcc", slug="hyperparametre")
t("Fonction de coût (loss)", "ML", "N4",
  "Formule qui mesure à quel point les prédictions du modèle sont fausses. L'entraînement consiste à la faire baisser.",
  "Comme le compteur d'erreurs d'un correcteur : le but est de le faire descendre au minimum.",
  "Pour prédire des prix de logements, on mesure l'erreur quadratique moyenne entre prix prédits et prix réels.",
  ["descente-de-gradient", "entropie-croisee", "gradient"], [r"fonction de (coût|perte)", r"\bloss\b"], "cs229", slug="fonction-de-cout")
t("Entropie croisée (cross-entropy)", "ML", "N4",
  "Fonction de coût utilisée pour la classification et les LLM : elle punit fortement le modèle quand il donne une faible probabilité à la bonne réponse.",
  "Comme un parieur qui perd gros s'il était très sûr de lui et s'est trompé.",
  "Pendant l'entraînement d'un nanoGPT, on suit la baisse de l'entropie croisée sur les textes de validation.",
  ["fonction-de-cout", "softmax", "perplexite"], [r"entropie croisée", r"cross-entropy"], "cs336", slug="entropie-croisee")
t("Descente de gradient", "ML", "N4",
  "Méthode d'optimisation qui ajuste pas à pas les paramètres d'un modèle dans la direction qui fait le plus baisser l'erreur.",
  "Comme descendre une montagne dans le brouillard en suivant toujours la pente la plus raide sous ses pieds.",
  "Le modèle de régression du projet ft_linear_regression trouve sa droite par descente de gradient en quelques milliers d'itérations.",
  ["gradient", "taux-d-apprentissage", "fonction-de-cout", "optimiseur"], [r"descente de gradient", r"gradient descent"], "cs229")
t("Gradient", "ML", "N4",
  "Ensemble des pentes d'une fonction par rapport à chacun de ses paramètres : il indique dans quelle direction et avec quelle force changer chaque réglage pour réduire l'erreur.",
  "Comme une boussole qui indique la direction de la plus forte montée sur un terrain.",
  "PyTorch calcule automatiquement le gradient de la perte par rapport aux millions de poids d'un réseau.",
  ["derivee", "descente-de-gradient", "retropropagation"], [r"gradients?"], "mit6036")
t("Dérivée", "ML", "N4",
  "Mesure de la vitesse à laquelle une valeur change quand on modifie légèrement une autre. C'est l'outil mathématique de base de l'apprentissage.",
  "Comme l'indicateur de pente sur un panneau routier : il dit à quel point ça monte à cet endroit précis.",
  "Savoir de combien varie le chiffre d'affaires quand on baisse le prix d'un euro, c'est raisonner en dérivée.",
  ["gradient", "retropropagation"], [r"dérivées?"], "mit6036", slug="derivee")
t("Vecteur", "ML", "N4",
  "Liste ordonnée de nombres qui décrit un objet : un point dans l'espace, un client, un mot. En IA, presque tout est converti en vecteurs.",
  "Comme une fiche signalétique chiffrée : taille, poids, âge, pointure.",
  "Un client décrit par (âge 42, 3 achats, panier moyen 85 €) est un vecteur à 3 dimensions.",
  ["matrice", "embedding", "produit-scalaire"], [r"vecteurs?"], "mit1806")
t("Matrice", "ML", "N4",
  "Tableau de nombres en lignes et colonnes. Les poids d'un réseau de neurones sont rangés dans d'immenses matrices que le GPU multiplie très vite.",
  "Comme un tableau Excel rempli uniquement de nombres.",
  "Une couche d'un LLM multiplie une matrice de 4 096 × 4 096 poids par le vecteur de chaque token.",
  ["vecteur", "tenseur", "gpu"], [r"matrices?"], "mit1806")
t("Produit scalaire", "ML", "N4",
  "Opération qui multiplie deux vecteurs terme à terme puis additionne les résultats. Il mesure à quel point deux vecteurs « pointent dans la même direction » et sert au cœur de l'attention et de la recherche sémantique.",
  "Comme comparer deux listes de goûts musicaux : plus vous aimez les mêmes choses, plus le score est élevé.",
  "Une base vectorielle calcule le produit scalaire entre la question d'un client et chaque passage de la FAQ.",
  ["vecteur", "similarite-cosinus", "attention"], [r"produit scalaire", r"dot product"], "mit1806")
t("Probabilité", "ML", "N4",
  "Nombre entre 0 et 1 qui exprime à quel point un événement est plausible. Un LLM attribue une probabilité à chaque token possible avant de choisir le suivant.",
  "Comme les chances annoncées par la météo : 70 % de risque de pluie.",
  "Un modèle de risque donne 0,12 de probabilité d'impayé à une PME : le chargé d'affaires décide en conséquence.",
  ["distribution-de-probabilite", "softmax", "temperature"], [r"probabilités?"], "cs229", slug="probabilite")
t("Distribution de probabilité", "ML", "N4",
  "Description de toutes les valeurs possibles d'une variable et de leur probabilité respective. La loi normale (courbe en cloche) en est la plus connue.",
  "Comme la répartition des tailles de chaussures vendues dans un magasin.",
  "Avant de choisir le mot suivant, un LLM produit une distribution de probabilité sur ses 200 000 tokens possibles.",
  ["probabilite", "softmax", "echantillonnage"], [r"distributions? de probabilité", r"loi normale"], "cs229")
t("Normalisation des données", "ML", "N4",
  "Mise à une échelle comparable de variables très différentes (euros, âges, pourcentages) pour qu'aucune n'écrase les autres pendant l'apprentissage.",
  "Comme convertir toutes les monnaies en euros avant de comparer des prix.",
  "Avant d'entraîner un modèle, on ramène salaires (en milliers d'euros) et ancienneté (en années) entre 0 et 1.",
  ["feature-engineering", "batch-normalization"], [r"normalis(ation|er|ée)", r"standardis(ation|er)"], "mlcc")
t("Encodage one-hot", "ML", "N4",
  "Façon de transformer une catégorie (ville, couleur) en colonnes de 0 et de 1 que le modèle peut traiter : une colonne par valeur possible.",
  "Comme une feuille de présence où l'on coche une seule case par ligne.",
  "La colonne « agence » (Lille, Lyon, Nice) devient trois colonnes binaires dans le jeu de données d'un réseau de concessions.",
  ["feature-engineering", "embedding"], [r"one-hot"], "mlcc")
t("scikit-learn", "ML", "N4",
  "Bibliothèque Python libre de référence pour le machine learning classique : régressions, arbres, clustering, validation croisée, avec une interface simple et homogène.",
  "Comme une boîte à outils de bricolage bien rangée où chaque outil se manie de la même façon.",
  "Un analyste d'une mutuelle entraîne une forêt aléatoire en dix lignes de scikit-learn pour prédire les résiliations.",
  ["machine-learning", "pandas", "python"], [r"scikit-learn", r"sklearn"], "cs229")
t("Kaggle", "ML", "N4",
  "Plateforme de compétitions et de jeux de données en data science, avec des notebooks partagés et des cours gratuits. Idéale pour s'entraîner sur des données réelles.",
  "Comme un club de sport avec des tournois ouverts à tous.",
  "Un apprenant s'exerce sur le jeu de données public des prix immobiliers avant d'attaquer les données de son agence.",
  ["jeu-de-donnees", "notebook"], [r"Kaggle"], None)
