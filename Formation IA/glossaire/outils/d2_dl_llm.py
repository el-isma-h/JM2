# -*- coding: utf-8 -*-
from core import t

# ===================== DEEP LEARNING =====================
t("Deep learning (apprentissage profond)", "DL", "N1",
  "Famille de méthodes de machine learning qui utilise des réseaux de neurones à nombreuses couches. Chaque couche extrait des informations de plus en plus abstraites, ce qui permet de traiter images, sons et textes.",
  "Comme une chaîne de traducteurs : le premier repère les lettres, le suivant les mots, le dernier le sens de la phrase.",
  "La reconnaissance automatique des plaques d'immatriculation aux péages repose sur le deep learning.",
  ["reseau-de-neurones", "machine-learning", "cnn"], [r"deep learning", r"apprentissage profond"], "mit6s191", slug="deep-learning")
t("Réseau de neurones", "DL", "N1",
  "Modèle composé de petites unités de calcul (les neurones artificiels) organisées en couches et reliées par des poids. Il apprend en ajustant ces poids.",
  "Comme un immense standard téléphonique dont on règle des milliards de molettes pour que le bon message arrive au bon endroit.",
  "Le filtre de détection de fraude d'une néobanque est un réseau de neurones qui analyse chaque paiement en quelques millisecondes.",
  ["neurone-artificiel", "deep-learning", "poids"], [r"réseaux? de neurones", r"neural networks?"], "3b1b", slug="reseau-de-neurones")
t("Neurone artificiel", "DL", "N4",
  "Unité de calcul de base d'un réseau : il additionne ses entrées pondérées par des poids, ajoute un biais, puis applique une fonction d'activation.",
  "Comme un juré qui écoute plusieurs témoins, accorde plus de crédit à certains, et décide s'il est convaincu.",
  "Un perceptron à un seul neurone peut décider si un e-mail est prioritaire d'après trois indices pondérés.",
  ["perceptron", "fonction-d-activation", "poids"], [r"neurones? artificiels?", r"\*\*neurone"], "mit6s191")
t("Perceptron", "DL", "N4",
  "Le plus simple des réseaux de neurones (1958) : un neurone qui sépare deux catégories par une frontière droite. Il ne sait pas résoudre les problèmes non linéaires comme le XOR.",
  "Comme un videur avec une seule règle stricte pour laisser entrer ou non.",
  "Le projet 42 multilayer-perceptron commence par coder un perceptron simple avant d'empiler les couches.",
  ["mlp", "neurone-artificiel"], [r"perceptrons?"], "mit6036")
t("MLP (perceptron multicouche)", "DL", "N4",
  "Multi-Layer Perceptron : réseau de neurones avec une ou plusieurs couches cachées entre l'entrée et la sortie, capable d'apprendre des relations non linéaires.",
  "Comme une entreprise avec plusieurs échelons hiérarchiques : chaque niveau synthétise l'information du précédent.",
  "Un MLP prédit si une tumeur est bénigne ou maligne à partir de 30 mesures (projet 42 multilayer-perceptron).",
  ["perceptron", "couche-cachee", "retropropagation"], [r"=MLP", r"multicouches?", r"multilayer"], "mit6s191")
t("Couche cachée", "DL", "N4",
  "Couche de neurones située entre l'entrée et la sortie d'un réseau. On ne voit pas directement ce qu'elle calcule, d'où son nom.",
  "Comme les cuisines d'un restaurant : le client voit la commande et l'assiette, pas les étapes intermédiaires.",
  "Ajouter une deuxième couche cachée permet au réseau de mieux distinguer des écritures manuscrites de chèques.",
  ["mlp", "reseau-de-neurones"], [r"couches? cachées?", r"hidden layers?"], "mit6s191", slug="couche-cachee")
t("Fonction d'activation", "DL", "N4",
  "Petite formule appliquée à la sortie de chaque neurone pour introduire de la non-linéarité. Sans elle, empiler des couches ne servirait à rien.",
  "Comme un interrupteur à variateur qui décide à quel point la lampe s'allume selon le courant reçu.",
  "Remplacer la sigmoïde par ReLU accélère nettement l'entraînement d'un classifieur d'images de pièces industrielles.",
  ["relu", "sigmoide", "softmax"], [r"fonctions? d'activation", r"activation functions?"], "mit6s191", slug="fonction-d-activation")
t("ReLU", "DL", "N4",
  "Rectified Linear Unit : fonction d'activation qui laisse passer les valeurs positives et remplace les négatives par zéro. Simple et très utilisée.",
  "Comme un clapet anti-retour : l'eau passe dans un sens, jamais dans l'autre.",
  "Dans un réseau PyTorch de classification d'images, chaque couche convolutive est suivie d'une ReLU.",
  ["fonction-d-activation", "sigmoide"], [r"ReLU", r"GELU"], "mit6s191")
t("Sigmoïde", "DL", "N4",
  "Fonction en forme de S qui transforme n'importe quel nombre en une valeur entre 0 et 1, interprétable comme une probabilité.",
  "Comme un variateur de lumière qui ne peut jamais dépasser « éteint » ou « plein feu ».",
  "La sortie d'un modèle qui prédit « ce client va-t-il résilier ? » passe par une sigmoïde.",
  ["regression-logistique", "fonction-d-activation"], [r"sigmoïdes?", r"sigmoid"], "mit6036", slug="sigmoide")
t("Softmax", "DL", "N4",
  "Fonction qui transforme une liste de scores en probabilités positives dont la somme vaut 1. C'est elle qui donne les probabilités du prochain token dans un LLM.",
  "Comme répartir 100 % des votes entre les candidats en proportion de leurs scores.",
  "Un classifieur de tickets de support renvoie 0,82 « facturation », 0,15 « technique », 0,03 « autre » grâce au softmax.",
  ["logits", "temperature", "probabilite"], [r"softmax"], "cs224n")
t("Rétropropagation (backpropagation)", "DL", "N4",
  "Algorithme qui calcule, couche par couche en partant de la fin, la part de responsabilité de chaque poids dans l'erreur, afin de les corriger.",
  "Comme remonter une chaîne de montage après un défaut pour savoir quel poste a contribué au problème, et dans quelle mesure.",
  "Dans micrograd, on code la rétropropagation à la main sur quelques neurones pour comprendre ce que fait PyTorch.",
  ["gradient", "descente-de-gradient", "autograd", "micrograd"], [r"rétropropagation", r"backpropagation", r"backprop"], "karpathy_micro", slug="retropropagation")
t("Époque (epoch)", "DL", "N4",
  "Un passage complet du modèle sur la totalité des données d'entraînement. On entraîne en général sur plusieurs époques.",
  "Comme relire tout un manuel une fois du début à la fin avant un examen.",
  "Un classifieur d'images de feuilles malades (projet 42 Leaffliction) est entraîné sur 15 époques.",
  ["batch", "entrainement"], [r"époques?", r"epochs?"], "fastai", slug="epoque")
t("Batch (lot)", "DL", "N4",
  "Petit paquet d'exemples traités ensemble avant chaque mise à jour des poids. La taille du batch influence vitesse et stabilité de l'entraînement.",
  "Comme corriger des copies par paquets de 32 plutôt qu'une à une ou toutes d'un coup.",
  "Faute de VRAM, un ingénieur réduit la taille de batch de 64 à 16 pour entraîner son modèle sur une RTX 4070.",
  ["epoque", "vram", "batching"], [r"\bbatch(es)?\b", r"mini-batch", r"\blots?\b"], "fastai", slug="batch")
t("Taux d'apprentissage (learning rate)", "DL", "N4",
  "Hyperparamètre qui fixe la taille des pas de la descente de gradient. Trop grand, l'entraînement diverge ; trop petit, il n'avance pas.",
  "Comme la longueur de vos pas en descendant une pente dans le brouillard : trop grands, vous trébuchez ; trop petits, vous n'arrivez jamais.",
  "Un fine-tuning LoRA échoue tant que le taux d'apprentissage reste à 1e-2 ; à 2e-4 il converge.",
  ["descente-de-gradient", "hyperparametre", "optimiseur"], [r"taux d'apprentissage", r"learning rate"], "mit6s191", slug="taux-d-apprentissage")
t("Optimiseur (SGD, Adam)", "DL", "N4",
  "Algorithme qui décide comment mettre à jour les poids à partir des gradients. SGD est le plus simple ; Adam et AdamW adaptent le pas pour chaque poids et sont les plus utilisés.",
  "Comme le GPS qui ajuste votre vitesse selon la route, plutôt que de rouler toujours à la même allure.",
  "Le passage de SGD à AdamW divise par deux le temps d'entraînement d'un petit GPT sur les textes d'une base juridique.",
  ["descente-de-gradient", "taux-d-apprentissage"], [r"optimiseurs?", r"\bAdamW?\b", r"\bSGD\b"], "cs336", slug="optimiseur")
t("Dropout", "DL", "N4",
  "Technique de régularisation qui « éteint » au hasard une partie des neurones à chaque étape d'entraînement pour éviter que le réseau ne dépende trop de quelques-uns.",
  "Comme entraîner une équipe de foot en retirant au hasard des joueurs à chaque match d'entraînement pour que tous progressent.",
  "Ajouter un dropout de 0,3 réduit le surapprentissage d'un modèle de prévision de demande.",
  ["regularisation", "surapprentissage"], [r"dropout"], "mit6s191")
t("Batch normalization", "DL", "N4",
  "Technique qui renormalise les valeurs qui circulent entre les couches pour stabiliser et accélérer l'entraînement. Les transformers utilisent une variante, la layer normalization.",
  "Comme recalibrer régulièrement les instruments d'un orchestre pour qu'ils restent accordés.",
  "Une équipe stabilise l'entraînement de son réseau convolutif de contrôle qualité en ajoutant de la batch normalization.",
  ["normalisation-des-donnees", "transformer"], [r"batch ?norm", r"layer ?norm", r"BatchNorm", r"LayerNorm"], "karpathy")
t("CNN (réseau convolutif)", "DL", "N4",
  "Convolutional Neural Network : réseau spécialisé dans les images, qui fait glisser de petits filtres sur l'image pour repérer bords, textures puis formes.",
  "Comme examiner un tableau à la loupe, zone par zone, avant d'en comprendre la scène.",
  "Une coopérative viticole détecte le mildiou sur des photos de feuilles grâce à un CNN.",
  ["convolution", "vision-par-ordinateur", "deep-learning"], [r"=CNN", r"réseaux? convolutifs?", r"convolutional"], "cs231n", slug="cnn")
t("Convolution", "DL", "N4",
  "Opération qui fait glisser un petit filtre sur une image et calcule à chaque position une réponse, pour détecter un motif précis (un bord, un angle).",
  "Comme passer un tampon-encreur sur une feuille pour repérer où le motif colle parfaitement.",
  "La première couche de convolution d'un modèle de lecture de plaques détecte les traits horizontaux et verticaux des caractères.",
  ["cnn", "pooling"], [r"convolutions?"], "cs231n")
t("Pooling", "DL", "N4",
  "Opération qui réduit la taille d'une image intermédiaire en ne gardant, par zone, que la valeur la plus forte ou la moyenne.",
  "Comme résumer chaque quartier d'une ville par son immeuble le plus haut.",
  "Après deux convolutions, un max-pooling divise par quatre la taille des cartes d'un classifieur de radios pulmonaires.",
  ["convolution", "cnn"], [r"pooling"], "cs231n")
t("RNN (réseau récurrent)", "DL", "N4",
  "Recurrent Neural Network : réseau qui lit une séquence élément par élément en gardant une mémoire de ce qu'il a lu. Il oublie vite sur les longues séquences.",
  "Comme lire un roman en ne retenant qu'un résumé d'une ligne mis à jour à chaque page.",
  "Avant les transformers, les claviers de smartphones prédisaient le mot suivant avec des RNN.",
  ["lstm", "transformer", "vanishing-gradient"], [r"=RNN", r"réseaux? récurrents?", r"recurrent"], "mit6s191", slug="rnn")
t("LSTM", "DL", "N4",
  "Long Short-Term Memory : variante de RNN dotée de « portes » qui décident quoi retenir ou oublier, ce qui lui permet de garder l'information plus longtemps.",
  "Comme un carnet de notes où l'on choisit ce qu'on surligne, ce qu'on rature et ce qu'on recopie.",
  "Un gestionnaire de réseau d'eau prévoyait sa consommation horaire avec un LSTM avant de passer aux transformers.",
  ["rnn", "transformer"], [r"LSTM"], "mit6s191")
t("Disparition du gradient (vanishing gradient)", "DL", "N4",
  "Problème où les gradients deviennent minuscules en remontant les couches, si bien que les premières couches n'apprennent presque plus. Il a longtemps limité les réseaux profonds et les RNN.",
  "Comme un message chuchoté de bouche à oreille sur 50 personnes : il n'en reste rien à la fin.",
  "Un RNN qui doit relier le début et la fin d'un contrat de 20 pages échoue à cause de la disparition du gradient.",
  ["rnn", "lstm", "retropropagation"], [r"vanishing gradient", r"disparition du gradient", r"gradients? qui (s'évanouissent|disparaissent)"], "mit6s191", slug="vanishing-gradient")
t("Tenseur", "DL", "N4",
  "Tableau de nombres à plusieurs dimensions (un vecteur est un tenseur 1D, une matrice 2D, un lot d'images couleur 4D). C'est l'objet de base de PyTorch.",
  "Comme une pile de feuilles Excel, elles-mêmes rangées dans plusieurs classeurs.",
  "Un lot de 32 photos 224×224 en couleur forme un tenseur de forme (32, 3, 224, 224).",
  ["pytorch", "matrice", "vecteur"], [r"tenseurs?", r"tensors?"], "mit6s191")
t("PyTorch", "DL", "N4",
  "Bibliothèque Python libre, créée par Meta, de référence pour construire et entraîner des réseaux de neurones. Elle calcule automatiquement les gradients.",
  "Comme un atelier équipé où les machines calculent elles-mêmes les réglages à corriger.",
  "Un ingénieur entraîne un petit classifieur de tickets en 50 lignes de PyTorch sur un GPU loué.",
  ["tenseur", "autograd", "deep-learning"], [r"PyTorch"], "mit6s191")
t("Autograd (différentiation automatique)", "DL", "N4",
  "Mécanisme qui enregistre les calculs d'un modèle pour en déduire automatiquement tous les gradients, sans les écrire à la main.",
  "Comme un comptable qui garde la trace de chaque opération pour pouvoir dire d'où vient chaque centime d'écart.",
  "Grâce à autograd, un simple loss.backward() calcule les gradients des 124 millions de poids d'un nanoGPT.",
  ["retropropagation", "pytorch", "micrograd"], [r"autograd", r"différentiation automatique"], "karpathy_micro")
t("micrograd", "DL", "N4",
  "Mini-bibliothèque pédagogique d'Andrej Karpathy (environ 100 lignes) qui reconstruit la rétropropagation à la main pour comprendre ce que font PyTorch et ses semblables.",
  "Comme démonter un moteur de mobylette pour comprendre celui d'une voiture.",
  "Un apprenant du niveau 4 recode micrograd et vérifie que ses gradients sont identiques à ceux de PyTorch.",
  ["retropropagation", "autograd", "nanogpt"], [r"micrograd"], "karpathy_micro")
t("Transfer learning (apprentissage par transfert)", "DL", "N4",
  "Réutiliser un modèle déjà entraîné sur une grande tâche générale et l'adapter à une tâche proche avec peu de données.",
  "Comme un pianiste qui apprend l'orgue bien plus vite qu'un débutant.",
  "Un laboratoire adapte un modèle de vision pré-entraîné à la reconnaissance de cellules avec seulement 500 images annotées.",
  ["fine-tuning", "modele-de-fondation"], [r"transfer learning", r"apprentissage par transfert"], "fastai", slug="transfer-learning")
t("GAN (réseau antagoniste génératif)", "DL", "N4",
  "Generative Adversarial Network : deux réseaux s'affrontent, l'un fabrique des faux, l'autre essaie de les détecter, et les deux progressent ensemble. Ancêtre des générateurs d'images actuels.",
  "Comme un faussaire et un expert en tableaux qui s'améliorent en se défiant.",
  "Les premiers visages entièrement générés (« this person does not exist ») venaient de GAN.",
  ["modele-de-diffusion", "deepfake"], [r"=GAN", r"antagonistes?"], "mit6s191")
t("Autoencodeur", "DL", "N4",
  "Réseau qui apprend à compresser une donnée puis à la reconstruire. La version compressée capture l'essentiel, utile pour détecter des anomalies.",
  "Comme résumer un livre en une page puis tenter de le réécrire à partir du résumé.",
  "Une usine détecte des vibrations anormales de machines : l'autoencodeur reconstruit mal ce qu'il n'a jamais vu.",
  ["reduction-de-dimension", "modele-de-diffusion"], [r"auto-?encodeurs?", r"autoencoders?"], "mit6s191")

# ===================== LLM =====================
t("LLM (Large Language Model)", "LLM", "N1",
  "Grand modèle de langage : programme entraîné sur d'énormes quantités de textes pour prédire le morceau de texte suivant. De cette seule capacité découlent rédaction, résumé, traduction, code et conversation.",
  "Comme un lecteur qui aurait lu une bibliothèque entière et saurait continuer n'importe quelle phrase de façon plausible.",
  "Un cabinet comptable lyonnais utilise un LLM pour rédiger des relances de paiement personnalisées.",
  ["token", "transformer", "prediction-du-token-suivant", "hallucination"], [r"=LLM", r"grands? modèles? de langage", r"large language models?"], "hf_llm1", slug="llm")
t("Token", "LLM", "N1",
  "Petit morceau de texte (mot entier, fragment de mot, ponctuation) que le modèle lit et produit. Le prix, la longueur maximale et la vitesse d'un LLM se comptent en tokens ; le français en consomme plus que l'anglais.",
  "Comme les pièces d'un jeu de Lego : chaque phrase est assemblée à partir de briques standard.",
  "Une page A4 de 500 mots en français représente environ 900 à 1 000 tokens facturés par l'API.",
  ["tokenizer", "fenetre-de-contexte", "cout-par-million-de-tokens"], [r"tokens?"], "anth_tokens")
t("Tokenizer (tokeniseur)", "LLM", "N1",
  "Outil qui découpe le texte en tokens avant de l'envoyer au modèle, puis recolle les tokens produits en texte. Chaque famille de modèles a le sien.",
  "Comme un massicot qui découpe un texte en étiquettes toujours selon le même gabarit.",
  "Le même contrat de 10 pages fait 4 200 tokens chez un fournisseur et 4 900 chez un autre, à cause de tokenizers différents.",
  ["token", "bpe"], [r"tokenizers?", r"tokeniseurs?", r"tokenisation", r"tokenization"], "karpathy_tok", slug="tokenizer")
t("BPE (Byte Pair Encoding)", "LLM", "N4",
  "Méthode de construction d'un tokenizer qui fusionne pas à pas les paires de caractères les plus fréquentes pour former un vocabulaire de sous-mots.",
  "Comme inventer des abréviations pour les groupes de lettres qu'on écrit le plus souvent.",
  "En entraînant un BPE sur des comptes rendus médicaux, « cardio » devient un seul token au lieu de trois.",
  ["tokenizer", "token"], [r"=BPE", r"byte[- ]pair"], "karpathy_tok", slug="bpe")
t("Paramètre", "LLM", "N1",
  "Nombre réglé pendant l'entraînement (un poids ou un biais). La taille d'un modèle s'exprime en paramètres : « 27B » signifie 27 milliards.",
  "Comme les molettes d'une table de mixage : un modèle en compte des milliards, toutes réglées automatiquement.",
  "Une PME compare un modèle local de 8 milliards de paramètres et un de 70 milliards pour son assistant juridique.",
  ["poids", "hyperparametre", "vram"], [r"paramètres?"], "hf_llm1", slug="parametre")
t("Poids (weights)", "LLM", "N1",
  "Valeurs numériques apprises qui relient les neurones entre eux et constituent tout le « savoir » d'un modèle. Télécharger un modèle ouvert, c'est télécharger ses poids.",
  "Comme les réglages précis d'un instrument de musique : sans eux, l'instrument existe mais ne joue rien de juste.",
  "Un DSI télécharge les poids de Mistral Small depuis Hugging Face pour les faire tourner sur un serveur interne.",
  ["parametre", "modele-a-poids-ouverts", "quantization"], [r"\bpoids\b", r"weights"], "hf_llm1")
t("Transformer", "LLM", "N1",
  "Architecture de réseau de neurones inventée en 2017 (article « Attention Is All You Need ») sur laquelle reposent presque tous les LLM. Son mécanisme d'attention lui permet de relier entre eux tous les mots d'un texte en parallèle.",
  "Comme une réunion où chacun peut écouter tout le monde à la fois, au lieu d'un téléphone arabe.",
  "GPT, Claude, Gemini, Llama et Mistral sont tous des transformers, malgré leurs différences.",
  ["attention", "self-attention", "llm"], [r"transformers?"], "cs25")
t("Attention (mécanisme d')", "LLM", "N1",
  "Mécanisme qui permet au modèle, pour chaque mot, de pondérer l'importance de tous les autres mots du contexte. C'est ce qui lui permet de comprendre à quoi renvoie « il » ou « celui-ci ».",
  "Comme surligner, en lisant une phrase, les mots qui éclairent celui que vous êtes en train de lire.",
  "Dans « Le client a rappelé le technicien car il était absent », l'attention aide le modèle à relier « il » au bon nom.",
  ["self-attention", "transformer", "multi-head-attention"], [r"attention"], "cs224n", slug="attention")
t("Self-attention (auto-attention)", "LLM", "N4",
  "Forme d'attention où chaque token d'une séquence regarde tous les autres tokens de la même séquence pour enrichir sa représentation, grâce à des vecteurs requête, clé et valeur (Q, K, V).",
  "Comme une table ronde où chacun écoute tous les autres avant de reformuler son idée.",
  "Un apprenant code la self-attention en 20 lignes de PyTorch dans la leçon nanoGPT.",
  ["attention", "multi-head-attention", "kv-cache"], [r"self-attention", r"auto-attention", r"requêtes?, clés?", r"query, key"], "cs224n")
t("Multi-head attention (attention multi-têtes)", "LLM", "N4",
  "Variante où plusieurs mécanismes d'attention travaillent en parallèle, chacun pouvant se concentrer sur un type de relation (grammaire, sens, position).",
  "Comme plusieurs relecteurs spécialisés (orthographe, logique, style) qui lisent le même texte en même temps.",
  "Le modèle GPT-2 small utilise 12 têtes d'attention par couche.",
  ["self-attention", "transformer"], [r"multi-?head", r"multi-têtes", r"têtes d'attention"], "cs224n")
t("Encodage positionnel", "LLM", "N4",
  "Information ajoutée à chaque token pour indiquer sa position dans la phrase, car l'attention seule ne connaît pas l'ordre des mots. RoPE est la méthode la plus répandue en 2026.",
  "Comme numéroter les pages d'un manuscrit avant de les mélanger.",
  "Sans encodage positionnel, « le chien mord l'homme » et « l'homme mord le chien » seraient identiques pour le modèle.",
  ["rope", "transformer"], [r"encodages? positionnels?", r"positional (encoding|embedding)"], "cs224n")
t("RoPE (Rotary Position Embedding)", "LLM", "N4",
  "Méthode d'encodage positionnel qui fait « tourner » les vecteurs selon la position du token. Elle facilite l'extension des modèles à de longs contextes.",
  "Comme indiquer l'heure par l'angle des aiguilles plutôt que par un numéro.",
  "Llama, Qwen et Mistral utilisent RoPE, ce qui permet d'étendre leur contexte au-delà de la longueur d'entraînement.",
  ["encodage-positionnel", "contexte-long"], [r"RoPE"], "cs336", slug="rope")
t("Prédiction du token suivant", "LLM", "N1",
  "Principe de fonctionnement des LLM : à chaque étape, le modèle calcule la probabilité de chaque token possible et en choisit un, puis recommence avec le texte prolongé (on dit qu'il est autorégressif).",
  "Comme l'autocomplétion du téléphone, mais entraînée sur une bibliothèque entière et répétée des milliers de fois.",
  "Quand Claude rédige un courrier de 300 mots, il effectue environ 450 prédictions successives.",
  ["llm", "echantillonnage", "softmax"], [r"(prochain|token|mot) suivant", r"autorégressifs?", r"next[- ]token"], "hf_llm1", slug="prediction-du-token-suivant")
t("Logits", "LLM", "N4",
  "Scores bruts que le modèle attribue à chaque token possible avant leur transformation en probabilités par le softmax. La température agit sur eux.",
  "Comme les notes brutes d'un jury avant qu'on les convertisse en pourcentages.",
  "En inspectant les logits, un ingénieur voit que « Monsieur » et « Madame » étaient presque à égalité dans une formule de politesse.",
  ["softmax", "temperature"], [r"logits?"], "cs336")
t("Fenêtre de contexte", "LLM", "N1",
  "Quantité maximale de tokens qu'un modèle peut traiter d'un coup : votre demande, l'historique, les documents joints et la réponse. Au-delà, il faut résumer ou découper.",
  "Comme la taille du plan de travail : on ne peut pas étaler plus de documents que la table ne le permet.",
  "Un modèle à 1 million de tokens de contexte peut lire en une fois le dossier complet d'un appel d'offres de 1 500 pages.",
  ["token", "contexte-long", "compaction"], [r"fenêtres? de contexte", r"context windows?"], "anth_ctx", slug="fenetre-de-contexte")
t("Contexte long", "LLM", "N4",
  "Capacité d'un modèle à traiter des centaines de milliers ou des millions de tokens. Plus le contexte est long, plus l'inférence coûte cher et plus le modèle risque de « perdre » des informations au milieu.",
  "Comme une mémoire de travail qui peut garder des milliers de pages sur la table, mais pas toutes avec la même attention.",
  "Un notaire soumet un acte de vente et ses 40 annexes en une seule requête plutôt que de les découper.",
  ["fenetre-de-contexte", "rope", "kv-cache"], [r"contextes? longs?", r"long context"], "anth_ctx")
t("Température", "LLM", "N1",
  "Réglage qui contrôle le hasard dans le choix des tokens. Basse (0 à 0,3) : réponses stables et prévisibles ; haute (0,8 à 1) : réponses plus variées et créatives.",
  "Comme le curseur d'audace d'un cuisinier : à zéro il suit la recette, à fond il improvise.",
  "Un service juridique fixe la température à 0 pour l'extraction de clauses ; le marketing la monte à 0,9 pour des slogans.",
  ["top-p", "echantillonnage", "logits"], [r"températures?", r"temperature"], "anth_msg", slug="temperature")
t("Top-p (nucleus sampling)", "LLM", "N3",
  "Réglage qui limite le choix du prochain token aux candidats les plus probables dont les probabilités cumulées atteignent p (par exemple 0,9). Il coupe les choix improbables.",
  "Comme ne choisir son plat que parmi ceux qui représentent 90 % des commandes du restaurant.",
  "Un développeur règle top_p à 0,9 pour éviter les mots incongrus dans des descriptions produits générées en masse.",
  ["temperature", "top-k", "echantillonnage"], [r"top[-_ ]p", r"nucleus"], "anth_msg")
t("Top-k (échantillonnage)", "LLM", "N3",
  "Réglage qui limite le choix du prochain token aux k candidats les plus probables (par exemple 40).",
  "Comme ne retenir que les 40 meilleurs CV avant de tirer au sort l'entretien.",
  "Avec top_k = 1, un modèle local répond toujours de la même façon aux questions de la FAQ RH.",
  ["top-p", "temperature", "echantillonnage"], [r"top[-_ ]k"], "anth_msg")
t("Échantillonnage (sampling)", "LLM", "N3",
  "Façon dont le modèle choisit le token suivant parmi les probabilités calculées : toujours le plus probable (greedy) ou par tirage au sort contrôlé (température, top-p, top-k).",
  "Comme choisir un plat soit en prenant toujours le plus commandé, soit en piochant parmi les favoris.",
  "Pour générer cinq variantes d'une accroche publicitaire, on active l'échantillonnage plutôt que le mode greedy.",
  ["temperature", "top-p", "top-k"], [r"échantillonnage", r"sampling", r"greedy"], "cs336", slug="echantillonnage")
t("Hallucination", "LLM", "N1",
  "Réponse fausse mais formulée avec assurance par un modèle : chiffre inventé, fausse citation, article de loi inexistant. Elle vient du fait que le modèle produit du plausible, pas du vérifié.",
  "Comme un candidat sûr de lui en entretien qui invente une réponse plutôt que d'avouer qu'il ne sait pas.",
  "Un avocat découvre que trois jurisprudences citées par un assistant IA n'existent pas : il faut toujours vérifier les sources.",
  ["rag", "grounding", "verification-des-sorties"], [r"hallucinations?", r"hallucine"], "anth_limits")
t("Date de coupure des connaissances (knowledge cutoff)", "LLM", "N1",
  "Date après laquelle le modèle n'a plus vu de données pendant son entraînement. Il ignore donc les événements plus récents, sauf s'il fait une recherche.",
  "Comme quelqu'un qui revient d'une longue expédition : il ne connaît pas l'actualité des derniers mois.",
  "Un modèle sans recherche web ignore le nouveau barème de reste à charge CPF entré en vigueur après sa date de coupure.",
  ["recherche-augmentee", "rag"], [r"date de coupure", r"knowledge cut-?off", r"cutoff"], "anth_models", slug="knowledge-cutoff")
t("Pré-entraînement", "LLM", "N1",
  "Première phase d'entraînement d'un LLM : il lit des milliers de milliards de tokens de textes publics pour apprendre à prédire le mot suivant. Il en ressort un « modèle de base » cultivé mais pas encore un assistant.",
  "Comme les années d'école et de lecture avant le premier emploi.",
  "Le pré-entraînement d'un modèle de frontière mobilise des dizaines de milliers de GPU pendant des mois.",
  ["modele-de-base", "fine-tuning", "lois-d-echelle"], [r"pré-?entraînement", r"pre-?training"], "cs336", slug="pre-entrainement")
t("Modèle de base vs modèle instruct", "LLM", "N4",
  "Le modèle de base sort du pré-entraînement : il continue un texte sans suivre d'instructions. Le modèle « instruct » (ou « chat ») a été post-entraîné pour suivre des consignes et dialoguer.",
  "Comme la différence entre un érudit qui récite et un assistant formé à répondre aux demandes.",
  "Sur Hugging Face, une PME télécharge « Qwen…-Instruct » et non la version base pour son chatbot.",
  ["pre-entrainement", "sft", "post-entrainement"], [r"modèles? de base", r"base model", r"instruct"], "hf_llm", slug="modele-de-base")
t("Post-entraînement", "LLM", "N1",
  "Ensemble des étapes qui transforment un modèle de base en assistant utile et sûr : SFT, RLHF ou DPO, entraînement au raisonnement, règles de sécurité.",
  "Comme la formation au poste après le diplôme : on apprend les usages de la maison.",
  "C'est le post-entraînement qui fait que Claude refuse d'aider à rédiger un faux document administratif.",
  ["sft", "rlhf", "dpo", "modele-de-raisonnement"], [r"post-?entraînement", r"post-?training"], "hf_smol", slug="post-entrainement")
t("Fine-tuning (affinage)", "LLM", "N1",
  "Prolonger l'entraînement d'un modèle existant sur un jeu de données spécifique pour l'adapter à une tâche, un style ou un domaine. Souvent inutile si un bon prompt ou un RAG suffit.",
  "Comme une formation spécialisée pour un médecin généraliste qui devient dermatologue.",
  "Un éditeur de logiciel de paie affine un petit modèle ouvert pour qu'il réponde toujours dans le format de ses fiches support.",
  ["lora", "sft", "rag", "transfer-learning"], [r"fine-?tun(ing|er|é)", r"affinage"], "oa_opt", slug="fine-tuning")
t("SFT (Supervised Fine-Tuning)", "LLM", "N4",
  "Affinage supervisé : on montre au modèle des paires « consigne → bonne réponse » rédigées par des humains (ou générées puis vérifiées) pour qu'il apprenne à les imiter.",
  "Comme un stagiaire qui apprend en lisant des dizaines de courriers modèles annotés par son tuteur.",
  "Une mutuelle prépare 2 000 exemples question/réponse validés par ses gestionnaires pour un SFT via API.",
  ["fine-tuning", "rlhf", "dpo"], [r"=SFT", r"supervised fine-?tuning"], "oa_sft", slug="sft")
t("RLHF (Reinforcement Learning from Human Feedback)", "LLM", "N1",
  "Apprentissage par renforcement à partir de retours humains : des personnes comparent plusieurs réponses du modèle, on en déduit un « modèle de récompense », puis on entraîne le LLM à maximiser cette récompense.",
  "Comme un chef qui ajuste ses recettes d'après les notes laissées par les clients.",
  "Le RLHF explique pourquoi ChatGPT adopte un ton poli et structuré plutôt que de simplement continuer le texte.",
  ["dpo", "sft", "alignement", "modele-de-recompense"], [r"RLHF", r"retours? humains"], "cs336", slug="rlhf")
t("Modèle de récompense (reward model)", "LLM", "N4",
  "Modèle entraîné à noter des réponses comme le ferait un humain. Il sert de « juge » automatique pendant le RLHF.",
  "Comme un critique gastronomique formé à reproduire les goûts du public.",
  "Des annotateurs comparent 50 000 paires de réponses ; on en tire un modèle de récompense qui guide ensuite l'entraînement.",
  ["rlhf", "dpo"], [r"modèles? de récompense", r"reward models?"], "cs336", slug="modele-de-recompense")
t("DPO (Direct Preference Optimization)", "LLM", "N4",
  "Optimisation directe des préférences : méthode qui apprend au modèle à préférer la « bonne » réponse à la « mauvaise » à partir de paires comparées, sans passer par un modèle de récompense séparé. Plus simple que le RLHF classique.",
  "Comme apprendre directement à partir de « celle-ci plutôt que celle-là » sans passer par une grille de notation.",
  "Une équipe affine un modèle via l'API OpenAI avec 1 000 paires « réponse polie / réponse sèche » en DPO.",
  ["rlhf", "sft", "fine-tuning"], [r"=DPO\b(?! ?/ ?DPD)", r"direct preference"], "oa_dpo", slug="dpo")
t("RLAIF et IA constitutionnelle", "LLM", "N4",
  "Variantes du RLHF où une IA, guidée par une liste de principes écrits (une « constitution »), fournit tout ou partie des jugements à la place des humains. Anthropic l'utilise pour Claude.",
  "Comme un règlement intérieur que l'on applique soi-même pour corriger ses propres brouillons.",
  "Un modèle critique ses propres réponses à l'aune de principes tels que « ne pas aider à nuire » puis se corrige.",
  ["rlhf", "alignement"], [r"RLAIF", r"constitution(nelle|al)"], "cs336", slug="rlaif")
t("Reinforcement fine-tuning (RFT)", "LLM", "N4",
  "Affinage par renforcement : le modèle s'entraîne sur des tâches dont on peut vérifier automatiquement le résultat (calcul juste, test qui passe) et est récompensé quand il réussit.",
  "Comme s'entraîner aux exercices de maths avec un corrigé automatique qui dit juste/faux.",
  "Un éditeur entraîne un modèle à produire des requêtes SQL valides en récompensant celles qui renvoient le bon résultat.",
  ["apprentissage-par-renforcement", "modele-de-raisonnement"], [r"reinforcement fine-?tuning", r"=RFT", r"RLVR"], "oa_rft", slug="reinforcement-fine-tuning")
t("Modèle de raisonnement", "LLM", "N1",
  "LLM entraîné à « réfléchir » avant de répondre en produisant une chaîne de raisonnement interne. Plus lent et plus coûteux, mais bien meilleur en maths, code et problèmes à étapes.",
  "Comme la différence entre répondre du tac au tac et prendre un brouillon pour poser le calcul.",
  "Un contrôleur de gestion utilise un modèle de raisonnement pour vérifier la cohérence d'un tableau de bord financier complexe.",
  ["chain-of-thought", "extended-thinking", "reinforcement-fine-tuning"], [r"modèles? de raisonnement", r"reasoning models?"], "xai_reason")
t("Lois d'échelle (scaling laws)", "LLM", "N4",
  "Relations observées entre la taille d'un modèle, la quantité de données, la puissance de calcul et sa performance : augmenter ces trois facteurs améliore le modèle de façon prévisible.",
  "Comme la règle empirique d'un boulanger : plus de farine et plus de four donnent plus de pain, dans des proportions connues.",
  "Les lois d'échelle de type « Chinchilla » conseillent environ 20 tokens d'entraînement par paramètre.",
  ["pre-entrainement", "parametre"], [r"lois d'échelle", r"scaling laws?", r"Chinchilla"], "cs336", slug="lois-d-echelle")
t("MoE (Mixture of Experts)", "LLM", "N4",
  "Mélange d'experts : architecture où le modèle contient de nombreux sous-réseaux « experts » mais n'en active que quelques-uns pour chaque token. On obtient un grand modèle qui coûte moins cher à faire tourner. « 119B-A6B » signifie 119 milliards de paramètres dont 6 actifs.",
  "Comme un grand cabinet d'avocats où chaque dossier n'est confié qu'aux deux ou trois spécialistes concernés.",
  "Un modèle MoE de 26B-A4B tourne presque aussi vite qu'un modèle de 4B sur la station de travail d'un bureau d'études.",
  ["parametre", "vram", "llm"], [r"=MoE", r"mixture of experts", r"mélange d'experts", r"experts? actifs?"], "cs336", slug="moe")
t("Modèle à poids ouverts (open weights)", "LLM", "N1",
  "Modèle dont les poids sont téléchargeables librement : on peut l'exécuter chez soi, l'affiner et le déployer sans dépendre de l'éditeur. La licence fixe les usages permis ; les données d'entraînement restent souvent secrètes.",
  "Comme une recette publiée dont on peut cuisiner et modifier le plat, même si l'on ne sait pas où le chef achète ses produits.",
  "Une collectivité déploie Mistral Small ou Qwen sur ses propres serveurs pour garder les données des usagers en interne.",
  ["modele-proprietaire", "llm-local", "licence-open-source"], [r"poids ouverts", r"open[- ]weights?", r"modèles? ouverts?"], "openllm", slug="modele-a-poids-ouverts")
t("Modèle propriétaire (fermé)", "LLM", "N1",
  "Modèle accessible uniquement via l'application ou l'API de son éditeur, sans accès aux poids. GPT, Claude et Gemini sont des modèles propriétaires.",
  "Comme un restaurant étoilé : vous goûtez le plat, la recette reste en cuisine.",
  "Un cabinet de conseil accède à Claude via l'API, avec un accord de traitement des données, sans jamais disposer du modèle.",
  ["modele-a-poids-ouverts", "api"], [r"modèles? (propriétaires?|fermés?)", r"poids fermés", r"closed[- ]weights?"], "anth_models", slug="modele-proprietaire")
t("Licence open source (Apache 2.0, MIT)", "LLM", "N2",
  "Conditions juridiques qui accompagnent un logiciel ou un modèle ouvert. Apache 2.0 et MIT autorisent l'usage commercial ; certaines licences « communautaires » ajoutent des restrictions.",
  "Comme le règlement d'un jardin partagé : ce qu'on a le droit de cueillir, replanter ou revendre.",
  "Avant d'intégrer un modèle dans un logiciel vendu à ses clients, une start-up vérifie qu'il est sous Apache 2.0.",
  ["modele-a-poids-ouverts", "droit-d-auteur"], [r"Apache 2\.0", r"licences?"], "ccbyncsa", slug="licence-open-source")
t("SLM (Small Language Model)", "LLM", "N2",
  "Petit modèle de langage (en général moins de 10 milliards de paramètres), assez léger pour tourner sur un ordinateur portable ou un téléphone. Moins savant, mais rapide, économique et privé.",
  "Comme un couteau suisse face à une caisse à outils complète : moins de fonctions, mais toujours dans la poche.",
  "Un cabinet médical fait tourner un petit modèle en local pour résumer des notes de consultation sans les envoyer en ligne.",
  ["llm-local", "quantization", "edge-ai"], [r"=SLM", r"petits? modèles?", r"small language models?"], "gemma", slug="slm")
t("Distillation", "LLM", "N4",
  "Technique où un grand modèle « professeur » génère des réponses qui servent à entraîner un petit modèle « élève », qui en garde une bonne partie des capacités.",
  "Comme un grand chef qui forme un commis à reproduire ses plats signatures.",
  "Un éditeur distille un grand modèle en un modèle de 3B qui tourne sur les tablettes de ses techniciens terrain.",
  ["donnees-synthetiques", "slm", "fine-tuning"], [r"distillation", r"distill"], "cs336")
t("Données synthétiques", "LLM", "N4",
  "Données fabriquées par un modèle (questions, dialogues, exemples) plutôt que collectées dans la réalité. Utiles pour entraîner ou tester, à condition de les vérifier.",
  "Comme des exercices inventés par le professeur pour compléter le manuel.",
  "Une banque génère 5 000 fausses conversations clients réalistes, sans données personnelles, pour tester son assistant.",
  ["distillation", "fine-tuning", "jeu-de-donnees"], [r"données synthétiques", r"synthetic data"], "hf_smol", slug="donnees-synthetiques")
t("LoRA (Low-Rank Adaptation)", "LLM", "N4",
  "Méthode d'affinage économique : au lieu de modifier les milliards de poids du modèle, on entraîne de petites matrices additionnelles. On obtient un « adaptateur » de quelques dizaines de Mo.",
  "Comme ajouter des post-it sur un manuel au lieu de le réimprimer entièrement.",
  "Un cabinet d'expertise comptable affine un modèle ouvert sur ses notes de synthèse avec LoRA sur un seul GPU.",
  ["qlora", "peft", "fine-tuning"], [r"LoRA"], "lora_paper", slug="lora")
t("QLoRA", "LLM", "N4",
  "Variante de LoRA qui charge le modèle de base en version quantifiée (4 bits) pour réduire fortement la mémoire nécessaire. Elle permet d'affiner un gros modèle sur une seule carte graphique.",
  "Comme travailler sur une photocopie allégée du manuel tout en y collant les mêmes post-it.",
  "Avec QLoRA et Unsloth, une PME affine un modèle de 14B sur une carte de 24 Go de VRAM.",
  ["lora", "quantization", "unsloth"], [r"QLoRA"], "unsloth", slug="qlora")
t("PEFT (Parameter-Efficient Fine-Tuning)", "LLM", "N4",
  "Famille de méthodes d'affinage qui ne modifient qu'une petite partie des paramètres (LoRA en tête), et nom de la bibliothèque Hugging Face qui les implémente.",
  "Comme rénover seulement les pièces utiles d'une maison plutôt que de la reconstruire.",
  "Un ingénieur utilise PEFT et TRL pour produire trois adaptateurs (juridique, RH, commercial) sur un même modèle.",
  ["lora", "qlora", "fine-tuning"], [r"=PEFT"], "hf_peft", slug="peft")
t("Alignement", "LLM", "N1",
  "Ensemble des travaux qui visent à ce qu'un modèle fasse ce que ses concepteurs et utilisateurs veulent vraiment, de manière utile, honnête et sans danger.",
  "Comme s'assurer qu'un nouveau collaborateur partage les valeurs et les règles de l'entreprise, pas seulement ses compétences.",
  "L'alignement explique qu'un assistant refuse d'expliquer comment contourner un contrôle d'accès, même poliment demandé.",
  ["rlhf", "interpretabilite", "red-teaming"], [r"alignement", r"alignment"], "anth_fluency")
t("Interprétabilité", "LLM", "N4",
  "Domaine de recherche qui cherche à comprendre ce qui se passe à l'intérieur d'un modèle : quels neurones ou « circuits » correspondent à quels concepts.",
  "Comme une IRM du cerveau du modèle pour voir quelles zones s'activent sur quel sujet.",
  "Des chercheurs identifient dans un LLM une direction interne correspondant au concept « Tour Eiffel » et la font varier.",
  ["alignement", "explicabilite"], [r"interprétabilité", r"interpretability"], "cs25", slug="interpretabilite")
t("Sycophantie (complaisance)", "LLM", "N2",
  "Tendance d'un modèle à donner raison à l'utilisateur ou à le flatter plutôt qu'à dire la vérité, souvent héritée de l'entraînement sur les préférences humaines.",
  "Comme un courtisan qui approuve toutes les idées du roi.",
  "Un dirigeant qui demande « mon business plan est excellent, non ? » obtient une réponse trop positive ; mieux vaut demander une critique.",
  ["rlhf", "hallucination", "verification-des-sorties"], [r"syco?phant", r"complaisan", r"flagornerie"], "anth_limits", slug="sycophantie")
t("Benchmark", "LLM", "N2",
  "Banc d'essai standardisé (questions, exercices, tâches) qui permet de comparer des modèles sur une même échelle. Utile mais imparfait : un modèle peut être optimisé pour un benchmark.",
  "Comme les essais d'un magazine automobile : utiles pour comparer, mais ce n'est pas votre trajet quotidien.",
  "Avant de choisir un modèle pour ses développeurs, une ESN compare les scores SWE-bench et teste sur ses propres tickets.",
  ["mmlu", "swe-bench", "eval", "lmarena"], [r"benchmarks?", r"bancs? d'essai"], "aiindex")
t("MMLU", "LLM", "N4",
  "Massive Multitask Language Understanding : benchmark de 57 matières (droit, médecine, histoire…) en QCM. Saturé en 2026 par les meilleurs modèles, il reste une référence historique.",
  "Comme un grand quiz de culture générale de niveau universitaire.",
  "Une fiche de modèle annonce 88 % au MMLU ; un formateur explique pourquoi ce chiffre ne suffit plus à départager les modèles récents.",
  ["benchmark", "gpqa"], [r"MMLU"], "mmlu", slug="mmlu")
t("GPQA", "LLM", "N4",
  "Graduate-level Google-Proof Q&A : benchmark de questions scientifiques de niveau doctorat, conçues pour qu'on ne trouve pas la réponse par une simple recherche web.",
  "Comme un oral de thèse que l'on ne peut pas réussir en consultant Google.",
  "Les annonces de modèles de raisonnement mettent en avant leur score GPQA Diamond.",
  ["benchmark", "mmlu", "humanity-s-last-exam"], [r"GPQA"], "gpqa", slug="gpqa")
t("SWE-bench", "LLM", "N4",
  "Benchmark qui mesure la capacité d'un modèle ou d'un agent à corriger de vrais bugs issus de projets GitHub, vérifiés par les tests du projet.",
  "Comme un examen pratique de mécanicien sur de vraies voitures en panne.",
  "Une DSI s'appuie sur SWE-bench Verified pour présélectionner les agents de code avant un pilote interne.",
  ["benchmark", "humaneval", "agent-de-code"], [r"SWE-?bench"], None, slug="swe-bench")
t("HumanEval", "LLM", "N4",
  "Benchmark de 164 petits exercices de programmation Python, notés par des tests automatiques (pass@1). Saturé, il est remplacé par des tests plus durs comme LiveCodeBench.",
  "Comme un contrôle de code de 164 questions corrigé par une machine.",
  "Un article compare deux modèles locaux de code à leur score HumanEval ; un ingénieur vérifie aussi sur son propre code.",
  ["benchmark", "swe-bench"], [r"HumanEval"], "humaneval", slug="humaneval")
t("Humanity's Last Exam", "LLM", "N4",
  "Benchmark de plusieurs milliers de questions très difficiles, rédigées par des experts du monde entier, conçu pour rester discriminant face aux meilleurs modèles.",
  "Comme un concours général réunissant les questions les plus dures de chaque discipline.",
  "Un rapport de veille cite le score Humanity's Last Exam pour suivre la progression des modèles de frontière.",
  ["benchmark", "gpqa"], [r"Humanity's Last Exam", r"=HLE"], "hle", slug="humanity-s-last-exam")
t("LMArena (Chatbot Arena)", "LLM", "N2",
  "Classement public où des internautes comparent à l'aveugle les réponses de deux modèles et votent pour la meilleure. On en déduit un score de type Elo.",
  "Comme une dégustation de vins à l'aveugle avec des milliers de goûteurs.",
  "Un responsable innovation consulte LMArena pour une première idée, puis teste les deux meilleurs modèles sur ses propres cas.",
  ["benchmark", "eval"], [r"LMArena", r"Chatbot Arena", r"\bElo\b"], None, slug="lmarena")
t("Perplexité (métrique)", "LLM", "N4",
  "Mesure de la « surprise » d'un modèle face à un texte : plus elle est basse, mieux le modèle prédit ce texte. Elle sert à suivre l'entraînement d'un LLM.",
  "Comme mesurer à quel point un lecteur devine la suite d'un roman : moins il est surpris, mieux il connaît le style.",
  "Pendant l'entraînement d'un nanoGPT sur Molière, la perplexité sur le jeu de validation passe de 60 à 8.",
  ["entropie-croisee", "pre-entrainement"], [r"perplexité", r"=perplexity"], "cs336", slug="perplexite")
t("GPT (Generative Pre-trained Transformer)", "LLM", "N1",
  "Transformeur génératif pré-entraîné : nom de la famille de modèles d'OpenAI (GPT-4, GPT-5, GPT-6…) et, plus largement, du type d'architecture qui prédit le mot suivant.",
  "Comme une marque devenue nom commun, à la manière de « frigidaire ».",
  "Un apprenant construit son propre mini-GPT dans la leçon nanoGPT pour comprendre ce qu'il y a sous le capot de ChatGPT.",
  ["chatgpt", "transformer", "nanogpt"], [r"=GPT"], "oa_models", slug="gpt")
t("nanoGPT", "LLM", "N4",
  "Projet pédagogique d'Andrej Karpathy : un GPT complet en quelques centaines de lignes de PyTorch, qu'on peut entraîner sur un petit corpus pour comprendre chaque pièce d'un LLM.",
  "Comme une maquette fonctionnelle de moteur qu'on peut démonter sur sa table.",
  "Un apprenant entraîne nanoGPT sur les fables de La Fontaine et obtient des vers au style reconnaissable.",
  ["gpt", "micrograd", "transformer"], [r"nanoGPT"], "karpathy_gpt", slug="nanogpt")
t("Llama", "LLM", "N2",
  "Famille de modèles à poids ouverts de Meta, très utilisée comme base d'affinage et dans les benchmarks matériel.",
  "Comme un modèle de voiture populaire dont tous les garagistes connaissent le moteur.",
  "Un intégrateur affine Llama 3.1 8B pour un client industriel qui veut un assistant 100 % interne.",
  ["modele-a-poids-ouverts", "ollama"], [r"Llama"], None)
t("Qwen", "LLM", "N2",
  "Famille de modèles à poids ouverts d'Alibaba, très performante en 2026, déclinée de très petites tailles à des modèles MoE géants, souvent sous licence Apache 2.0.",
  "Comme une gamme d'outillage qui va du tournevis de poche à la machine industrielle.",
  "Un cabinet d'architectes fait tourner Qwen 27B sur un Mac Studio pour résumer ses comptes rendus de chantier.",
  ["modele-a-poids-ouverts", "moe"], [r"Qwen"], None)
t("DeepSeek", "LLM", "N2",
  "Laboratoire chinois et famille de modèles à poids ouverts, connus pour leurs modèles de raisonnement (R1) et leurs grands MoE à faible coût d'entraînement.",
  "Comme un nouveau constructeur qui surprend le marché avec une voiture performante à petit prix.",
  "Une équipe teste DeepSeek en local sur un serveur isolé pour vérifier la qualité de ses réponses en français juridique.",
  ["modele-a-poids-ouverts", "modele-de-raisonnement"], [r"DeepSeek"], None)
t("Gemma", "LLM", "N2",
  "Famille de modèles à poids ouverts de Google, déclinée en petites tailles adaptées à l'exécution locale et sur appareils mobiles.",
  "Comme la version « de poche » de la technologie Gemini.",
  "Un développeur embarque Gemma dans une application Android de prise de notes qui fonctionne hors ligne.",
  ["modele-a-poids-ouverts", "edge-ai", "slm"], [r"Gemma"], "gemma")
t("gpt-oss", "LLM", "N2",
  "Modèles à poids ouverts publiés par OpenAI sous licence Apache 2.0, utilisables en local avec Ollama, LM Studio ou vLLM.",
  "Comme une recette maison qu'un grand restaurant publie enfin pour tous.",
  "Un intégrateur installe gpt-oss sur une station de travail pour un client qui refuse tout envoi de données dans le cloud.",
  ["modele-a-poids-ouverts", "llm-local"], [r"gpt-oss"], None)
