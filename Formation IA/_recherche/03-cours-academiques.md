# 03 — Cours académiques et cours ouverts de référence (IA / ML / Deep Learning / LLM)

**Date de la recherche :** 1er novembre 2026
**Objet :** inventaire des cours de référence (universitaires et ouverts) dont nous devons couvrir les sujets dans notre propre formation IA de 150 h. Pour chaque cours : titre exact, institution, enseignants, URL officielle, vidéos, licence, prérequis, durée et **plan détaillé**.

## Légende de vérification des URLs

| Symbole | Signification |
|---|---|
| ✅ | Page ouverte et lue le 01/11/2026 (WebFetch) : contenu confirmé |
| 🔗 | URL citée textuellement par une page ✅ (ex. playlist YouTube indiquée sur le site officiel), non ouverte elle-même |
| 🔎 | URL obtenue dans des résultats de recherche, non ouverte |
| ⚠️ | URL non vérifiée (budget de recherche épuisé en fin de session ou accès bloqué) : **à confirmer avant usage** |

**Règle :** aucune URL n'a été inventée. Les URLs ⚠️ sont des adresses canoniques connues mais **non ouvertes** dans cette session ; elles sont listées à part (section 8) pour une seconde passe de vérification.

**Bilan :** 101 URLs ✅ ouvertes avec succès, ~25 URLs 🔗 citées par des pages officielles, une quinzaine ⚠️ à vérifier (livres libres et MOOC français, section 8).

---

## 0. Tableau récapitulatif global

| Cours | Institution | Niveau | Durée | Licence | URL (statut) |
|---|---|---|---|---|---|
| 6.S191 Introduction to Deep Learning (éd. 2026) | MIT | Intro / intermédiaire | 9 cours + 3 labs (bootcamp ~2 semaines, en ligne sur 9 semaines) | MIT License (slides, labs, code) | https://introtodeeplearning.com/ ✅ |
| 6.036 Introduction to Machine Learning (Fall 2020) | MIT OCW | Licence (undergrad) | 13 semaines × ~12 h | CC BY-NC-SA 4.0 (OCW) ; version Open Learning Library : « All Rights Reserved » | https://live.ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020 ✅ |
| 6.390 Introduction to Machine Learning (Fall 2026) | MIT | Licence | 1 semestre (~13 semaines) | CC BY-NC-SA 4.0 | https://introml.mit.edu/fall26/info ✅ |
| 6.034 Artificial Intelligence (Fall 2010) | MIT OCW | Licence | 23 lectures + 7 méga-récitations | CC BY-NC-SA 4.0 | https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/pages/syllabus/ ✅ |
| 18.06 Linear Algebra (Spring 2010) | MIT OCW | Licence | 35 vidéos (~50 min chacune) | CC BY-NC-SA 4.0 | https://www.ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures ✅ |
| 6.7960 Deep Learning (Fall 2024) — ex-6.S898 | MIT OCW | Licence / master | 1 semestre | CC BY-NC-SA 4.0 | https://live.ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/ ✅ |
| 6.S087 Foundation Models and Generative AI (IAP 2024) | MIT OCW | Tout public (non technique) | IAP (janvier, ~4 semaines) | CC BY-NC-SA 4.0 | https://ocw.mit.edu/courses/6-s087-foundation-models-and-generative-ai-january-iap-2024/ ✅ |
| RES.6-013 AI 101 (Fall 2021) | MIT OCW | Grand public | 1 atelier vidéo | CC BY-NC-SA 4.0 | https://ocw.mit.edu/courses/res-6-013-ai-101-fall-2021/ ✅ |
| CS229 Machine Learning (Winter/Summer 2026) | Stanford | Master | 1 trimestre (10 sem.) | Non précisée (notes PDF publiques) | https://cs229.stanford.edu/ ✅ |
| CS224N NLP with Deep Learning (Winter 2024 / Winter 2026) | Stanford | Master | 10 semaines, ~19 lectures | Non précisée (vidéos YouTube publiques) | https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/ ✅ |
| CS231n Deep Learning for Computer Vision (Spring 2026) | Stanford | Master | 18 lectures | Non précisée | https://cs231n.stanford.edu/schedule.html ✅ |
| CS324 Understanding and Developing LLMs (Winter 2022) | Stanford CRFM | Master | 1 trimestre | Non précisée | https://crfm.stanford.edu/courses.html ✅ (site : stanford-cs324.github.io/winter2022/ 🔗) |
| CS25 Transformers United V6 (Spring 2026) | Stanford | Ouvert à tous (séminaire) | 9 séances | Non précisée (vidéos YouTube publiques) | https://web.stanford.edu/class/cs25/index.html ✅ |
| CS336 Language Modeling from Scratch (Spring 2026) | Stanford | Master avancé | 19 séances + 5 devoirs | Devoirs sous licence MIT (GitHub) | https://cs336.stanford.edu/ ✅ |
| CS221 AI: Principles and Techniques | Stanford | Master | 1 trimestre | Non précisée | https://web.stanford.edu/class/archive/cs/cs221/cs221.1186/index.html ✅ |
| Artificial Intelligence Professional Program | Stanford Online | Pro (payant) | ≥ 3 cours × 10 sem. | Propriétaire | https://hackr.io/blog/stanford-ai-professional-program ✅ (source secondaire) |
| AI Index Report 2026 | Stanford HAI | Référence | 9 chapitres | Non indiquée sur la page | https://hai.stanford.edu/ai-index/2026-ai-index-report ✅ |
| CS188 Introduction to Artificial Intelligence (Fall 2025 / Spring 2026) | UC Berkeley | Licence | 26-28 lectures + 5 projets | Non précisée (vidéos publiques) | https://inst.eecs.berkeley.edu/~cs188/sp26/ ✅ |
| 11-785 Introduction to Deep Learning (Spring/Fall 2025) | CMU | Master | 28 lectures + 5 HW | Non précisée | https://deeplearning.cs.cmu.edu/S25/index.html ✅ |
| 11-667 Large Language Models: Methods and Applications | CMU | Master | 1 semestre, 6 devoirs | Non précisée | https://cmu-llms.org/ 🔗 (fiche ✅ sur csdiy.wiki) |
| CS50's Introduction to Artificial Intelligence with Python | Harvard | Intermédiaire | 7 semaines × 10-30 h | Non confirmée dans cette session (CS50 publie d'ordinaire en CC BY-NC-SA 4.0 — ⚠️ à vérifier sur la page « License ») | https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-Python ✅ |
| CS50x Introduction to Computer Science (2025/2026) | Harvard | Débutant | 11 semaines | Idem (page « License » non ouverte) | https://cs50.harvard.edu/x/2025/weeks ✅ |
| Branche « Algo, AI, data » du cursus 42 | École 42 | Intermédiaire | 7 projets | Sujets 42 : propriétaires ; dépôts étudiants : variables | voir section 4 |
| Bootcamps Python / Machine Learning | 42 AI (association) | Débutant | 2 bootcamps (modules 00-09) | Fichier LICENSE présent, nom non affiché (⚠️ à lire sur le dépôt) | https://github.com/42-ai ✅ |
| Machine Learning Specialization | DeepLearning.AI + Stanford Online | Débutant | ~95 h (3 cours) | Propriétaire (audit gratuit) | https://deeplearning.ai/courses/machine-learning-specialization ✅ |
| Deep Learning Specialization | DeepLearning.AI | Intermédiaire | ~16 semaines (5 cours) | Propriétaire | https://www.deeplearning.ai/deep-learning-specialization/ ✅ |
| Short courses GenAI (dont 4 avec Anthropic) | DeepLearning.AI + partenaires | Débutant / intermédiaire | 1-2 h chacun | Propriétaire (gratuits) | https://www.deeplearning.ai/short-courses/ ✅ |
| AI For Everyone | DeepLearning.AI (Coursera) | Débutant | ~7 h (4 semaines) | Propriétaire | https://www.deeplearning.ai/courses/ai-for-everyone ✅ |
| Generative AI with LLMs | DeepLearning.AI + AWS | Intermédiaire | ~13 h (3 semaines) | Propriétaire | https://www.deeplearning.ai/courses/generative-ai-with-llms/ ✅ |
| Machine Learning Crash Course | Google for Developers | Débutant | 12 modules | Non affichée (Google Developers publie en général en CC BY 4.0 — ⚠️ à confirmer) | https://developers.google.com/machine-learning/crash-course?authuser=8 ✅ |
| Introduction to Generative AI Learning Path | Google Cloud Skills Boost | Débutant | 3 cours courts | Propriétaire (gratuit) | https://www.cloudskillsboost.google/paths/118 ✅ (redirige vers skills.google) |
| Practical Deep Learning for Coders (2022) | fast.ai | Intermédiaire | Part 1 : 9 leçons × 90 min ; Part 2 : 17 leçons | Non précisée sur le site (livre fastbook sur GitHub) | https://course.fast.ai/ ✅ |
| Neural Networks: Zero to Hero | Andrej Karpathy | Intermédiaire | 8 vidéos (~14 h) | Non précisée (vidéos YouTube) | https://karpathy.ai/zero-to-hero.html ✅ |
| Intro to Large Language Models (1 h) / Deep Dive into LLMs like ChatGPT (3 h 30) | Andrej Karpathy | Grand public / intermédiaire | 1 h + 3 h 30 | YouTube standard | voir section 5 |
| Neural Networks (Deep Learning, chap. 1-7) | 3Blue1Brown | Grand public | 8 vidéos + 1 courte | © Grant Sanderson (pas de CC) | https://www.3blue1brown.com/topics/neural-networks ✅ |
| Kaggle Learn (17 micro-cours) | Kaggle | Débutant | « quelques heures » chacun | Propriétaire (gratuit) | kaggle.com/learn ⚠️ (fiche ✅ via beri.net) |
| Generative AI for Beginners (v3, 21 leçons) | Microsoft | Débutant | 21 leçons | MIT | https://github.com/microsoft/generative-ai-for-beginners ✅ |
| AI for Beginners (12 semaines, 24 leçons) | Microsoft | Débutant | 12 semaines | MIT | https://github.com/microsoft/ai-for-beginners ✅ |
| ML for Beginners (12 semaines, 26 leçons) | Microsoft | Débutant | 12 semaines | MIT (⚠️ non relu sur le dépôt dans cette session) | github.com/microsoft/ML-For-Beginners ⚠️ |
| Elements of AI (version française) | Université d'Helsinki + Reaktor/MinnaLearn ; Sorbonne Université pour le FR | Grand public | 6 chapitres, 30-60 h | Gratuit (licence du contenu non vérifiée) | https://www.elementsofai.com/ 🔗 |
| Full Stack Deep Learning 2022 + LLM Bootcamp 2023 | The Full Stack | Intermédiaire / pro | 9 lectures + labs ; 8 lectures + 3 invités | Non précisée | https://fullstackdeeplearning.com/course/ ✅ |
| Hugging Face Learn (12 cours) | Hugging Face | Débutant → avancé | variable | LLM Course : Apache 2.0 | https://huggingface.co/learn ✅ |
| Anthropic Academy (7 cours) | Anthropic | Débutant → intermédiaire | < 1 h à > 8 h | Gratuit, certificats | https://www.analyticsvidhya.com/blog/2026/03/free-anthropic-ai-courses-with-certificates/ ✅ (liens skilljar 🔗) |
| OpenAI Academy | OpenAI | Grand public | — | — | academy.openai.com ⚠️ (non ouvert) |
| Livres libres (D2L, Goodfellow, SLP3, UDL, LBDL, Hands-On LLM) | divers | — | — | voir section 6 | ⚠️ non ouverts (section 8) |
| MOOC francophones (Fun-MOOC, Inria, Class'Code, Objectif IA, Pix) | France | Grand public | — | — | ⚠️ non ouverts (section 8) |

---

## 1. MIT

### 1.1 MIT 6.S191 — Introduction to Deep Learning (édition 2026)

- **Titre exact :** « MIT Introduction to Deep Learning » (page : « MIT Deep Learning 6.S191 »)
- **Institution :** MIT (EECS), IAP + diffusion en ligne
- **Édition :** 2026 — en présentiel puis en ligne chaque lundi du 30 mars au 25 mai 2026
- **Enseignants :** Alexander Amini et Ava Amini (instructeurs et organisateurs) ; Daniela Rus (faculty sponsor) ; TA principaux Anisha Parsan et Shrika Eddula
- **URL officielle :** https://introtodeeplearning.com/ ✅
- **Vidéos :** playlist YouTube https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI 🔗 (indiquée sur le site) ; vidéo d'intro https://www.youtube.com/watch?v=II4giR4vOOo 🔗
- **Licence :** supports (slides, labs, code) open source sous **licence MIT**, avec obligation de conserver la mention de copyright « Alexander Amini and Ava Amini » sur chaque diapositive réutilisée
- **Prérequis :** algèbre linéaire élémentaire (produit matriciel), calcul (dérivées, règle de la chaîne) ; Python utile mais non obligatoire
- **Durée :** 9 cours (~1 h) + 3 labs logiciels + projet final

**Plan détaillé (2026) :**

| # | Séance | Sujet |
|---|---|---|
| L1 | Intro to Deep Learning | Perceptron, réseaux denses, fonctions de perte, descente de gradient, backprop, régularisation |
| L2 | Deep Sequence Modeling | RNN, LSTM, attention, transformers |
| Lab 1 | Deep Learning in Python; Music Generation | Prise en main PyTorch/TensorFlow, RNN génératif de musique |
| L3 | Deep Computer Vision | CNN, convolution, pooling, détection, segmentation |
| L4 | Deep Generative Modeling | Autoencodeurs, VAE, GAN, diffusion |
| Lab 2 | Facial Detection Systems | Détection de visages, biais algorithmique et débiaisage |
| L5 | Deep Reinforcement Learning | Q-learning, policy gradients |
| L6 | New Frontiers | Limites, robustesse, incertitude, nouvelles architectures |
| Lab 3 | Fine-Tune an LLM, You Must! | Fine-tuning d'un LLM |
| L7 | The Three Laws of AI | (nouveau 2026) |
| L8 | AI for Science | IA pour la découverte scientifique |
| L9 | Secrets to Massively Parallel Training | Entraînement distribué à grande échelle |
| Fin | Présentations de projets | Pitch, prix |

> Éditions antérieures (plans consultables) : https://introtodeeplearning.com/2025/index.html 🔎, https://introtodeeplearning.com/2024/ 🔎, https://introtodeeplearning.com/2023/index.html 🔎

### 1.2 MIT 6.036 — Introduction to Machine Learning (Fall 2020, OCW)

- **Titre exact :** « Introduction to Machine Learning » (6.036)
- **Institution :** MIT OpenCourseWare
- **Enseignants :** Leslie Kaelbling, Tomás Lozano-Pérez, Isaac Chuang, Duane Boning (OCW) ; vidéos publiques de l'édition Fall 2020 par Tamara Broderick
- **URL officielle :** https://live.ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020 ✅ (miroir de https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/ 🔎)
- **Version interactive (exercices autograder) :** MITx Open Learning Library https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.036+1T2019/about ✅ — 13 semaines × ~12 h ; **licence « All Rights Reserved »** (différent d'OCW)
- **Licence OCW :** CC BY-NC-SA 4.0 (vérifié sur https://ocw.mit.edu/terms ✅)
- **Prérequis :** programmation Python, calcul différentiel/intégral, algèbre linéaire
- **Durée :** 13 semaines

**Plan détaillé (vidéos Fall 2020, source https://tamarabroderick.com/ml.html ✅) :**

| # | Sujet | Vidéo 🔗 |
|---|---|---|
| 1 | Bases (formulation d'un problème d'apprentissage) | https://youtu.be/0xaLT4Svzgo |
| 2 | Perceptrons | https://youtu.be/A3obZhw7Jc4 |
| 3 | Features (caractéristiques) | https://youtu.be/WZVNvfMdk-E |
| 4 | Classification logistique linéaire (régression logistique) | https://youtu.be/abB3fwfPy14 |
| 5 | Régression | https://youtu.be/OpvrwhWEUmY |
| 6 | Réseaux de neurones | https://youtu.be/N0uGnAfXUes |
| 7 | (pas de cours) | https://youtu.be/QJY342H8LOo |
| 8 | Réseaux convolutifs | https://youtu.be/sFEZ180RvTI |
| 9 | Machines à états et MDP | https://youtu.be/O5hkIfUR_uA |
| 10 | Apprentissage par renforcement | https://youtu.be/Ir93m9OmOHo |
| 11 | Réseaux récurrents | https://youtu.be/JZ0WVuk4mt8 |
| 12 | Arbres de décision et forêts aléatoires | https://youtu.be/ZOiBe-nrmc4 |
| 13 | Clustering | https://youtu.be/BaZWcSq3IuI |
| 14 | Conférence invitée (David Sontag) | https://youtu.be/kZWPuZV9Qkc |

### 1.3 MIT 6.390 — Introduction to Machine Learning (successeur de 6.036)

- **Titre exact :** « 6.390 | IntroML | Fall26 »
- **URL officielle :** https://introml.mit.edu/fall26/info ✅ (accueil https://introml.mit.edu/fall26 🔗) ; éditions https://introml.mit.edu/spring26/info 🔎, https://introml.mit.edu/fall23/info 🔎
- **Licence :** CC BY-NC-SA 4.0 (indiqué sur le site)
- **Prérequis :** Python intermédiaire (classes, pseudo-code) — 6.1000/6.1010/6.1210 ; algèbre linéaire (rang, produit, inverse, gradients matriciels) — 18.06/18.C06/18.03/18.700
- **Plan (repères donnés par la page info) :** modèles linéaires et non linéaires pour apprentissage supervisé, non supervisé et par renforcement ; méthodes à base de gradient ; architectures de réseaux de neurones. Semaine 4 : classification linéaire (partiel 1) ; semaine 9 : transformers (partiel 2). Notes de cours PDF : https://introml.mit.edu/_static/fall23/LectureNotes/6390_intro.pdf 🔎 ; slides lec01 Spring 26 : https://introml.mit.edu/_static/spring26/lectures/lec01/introml-sp26-lec01.pdf 🔎

### 1.4 MIT 6.034 — Artificial Intelligence (Fall 2010, Patrick Winston)

- **Titre exact :** « Artificial Intelligence » (6.034)
- **Enseignant :** Patrick Henry Winston
- **URL officielle :** https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/pages/syllabus/ ✅ ; vidéo 1 : https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-1-introduction-and-scope ✅ (fichier mp4 archive.org cité)
- **Licence :** CC BY-NC-SA 4.0
- **Durée :** 23 lectures (~50 min) + 7 méga-récitations

**Plan détaillé (liste confirmée sur https://www.classcentral.com/course/mit-opencourseware-artificial-intelligence-fall-2010-40938 ✅) :**

1. Introduction and Scope
2. Reasoning: Goal Trees and Problem Solving
3. Reasoning: Goal Trees and Rule-Based Expert Systems
4. Search: Depth-First, Hill Climbing, Beam
5. Search: Optimal, Branch and Bound, A*
6. Search: Games, Minimax, and Alpha-Beta
7. Constraints: Interpreting Line Drawings
8. Constraints: Search, Domain Reduction
9. Constraints: Visual Object Recognition
10. Introduction to Learning, Nearest Neighbors
11. Learning: Identification Trees, Disorder
12a. Neural Nets — 12b. Deep Neural Nets
13. Learning: Genetic Algorithms
14. Learning: Sparse Spaces, Phonology
15. Learning: Near Misses, Felicity Conditions
16. Learning: Support Vector Machines
17. Learning: Boosting
18. Representations: Classes, Trajectories, Transitions
19. Architectures: GPS, SOAR, Subsumption, Society of Mind
21. Probabilistic Inference I — 22. Probabilistic Inference II
23. Model Merging, Cross-Modal Coupling, Course Summary

Méga-récitations : R1 Rule-Based Systems ; R2 Basic Search, Optimal Search ; R3 Games, Minimax, Alpha-Beta ; R4 Neural Nets ; R5 Support Vector Machines ; R6 Boosting ; R7 Near Misses, Arch Learning.

### 1.5 MIT 18.06 — Linear Algebra (Spring 2010, Gilbert Strang)

- **URL officielle :** https://www.ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures ✅
- **Licence :** CC BY-NC-SA 4.0 — **Prérequis :** calcul (18.02 recommandé)
- **Durée :** 35 vidéos

**Plan (35 vidéos) :** 1 The geometry of linear equations · 2 Elimination with matrices · 3 Multiplication and inverse matrices · 4 Factorization into A = LU · 5 Transposes, permutations, spaces Rⁿ · 6 Column space and nullspace · 7 Solving Ax = 0 · 8 Solving Ax = b · 9 Independence, basis, dimension · 10 The four fundamental subspaces · 11 Matrix spaces, rank 1, small world graphs · 12 Graphs, networks, incidence matrices · 13 Quiz 1 review · 14 Orthogonal vectors and subspaces · 15 Projections onto subspaces · 16 Projection matrices and least squares · 17 Orthogonal matrices and Gram-Schmidt · 18 Properties of determinants · 19 Determinant formulas and cofactors · 20 Cramer's rule, inverse matrix, volume · 21 Eigenvalues and eigenvectors · 22 Diagonalization and powers of A · 23 Differential equations and exp(At) · 24 Markov matrices, Fourier series · 24b Quiz 2 review · 25 Symmetric matrices and positive definiteness · 26 Complex matrices, FFT · 27 Positive definite matrices and minima · 28 Similar matrices and Jordan form · 29 Singular value decomposition · 30 Linear transformations and their matrices · 31 Change of basis, image compression · 32 Quiz 3 review · 33 Left and right inverses, pseudoinverse · 34 Final course review.

> Pour notre formation : retenir surtout 1-4, 6-10, 14-17, 21-22, 25, 29 (SVD) — c'est le socle utilisé par tous les cours de DL.

### 1.6 MIT 6.7960 — Deep Learning (Fall 2024, ex-6.S898)

- **URL :** https://live.ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/ ✅
- **Enseignants :** Phillip Isola, Sara Beery, Jeremy Bernstein — **Licence :** CC BY-NC-SA 4.0
- **Contenu :** architectures (MLP, CNN, RNN, graph nets, transformers), géométrie et invariances, backprop et différentiation automatique, théorie de l'apprentissage et généralisation en grande dimension ; applications vision, NLP, robotique. Sections : Syllabus, Readings, Lecture Notes, Homework, Final Project, Lecture Videos. (Note : 6.S898 Fall 2023 n'est pas sur OCW ; 6.7960 est le numéro permanent.)

### 1.7 Ressources MIT « Generative AI » et MIT Open Learning

- **6.S087 Foundation Models and Generative AI (IAP 2024)** — https://ocw.mit.edu/courses/6-s087-foundation-models-and-generative-ai-january-iap-2024/ ✅ — Rickard Gabrielsson — CC BY-NC-SA 4.0 — non technique : histoire de l'IA, limites du supervisé/RL, modèles de fondation, auto-supervision, applications science/entreprise.
- **RES.6-013 AI 101 (Fall 2021)** — https://ocw.mit.edu/courses/res-6-013-ai-101-fall-2021/ ✅ — Brandon Leshchinskiy — atelier d'introduction (vision, préparation des données, RL, exercice pratique).
- **Liste « 13 foundational AI courses »** — https://openlearning.mit.edu/news/13-foundational-ai-courses-resources-mit ✅ : AI 101 ; 6.006 Algorithms ; 6.034 ; SERC « AI and Algorithms » ; Computational Thinking & Data Science (edX) ; 6.036 (OLL) ; « Machine Learning with Python: From Linear Models to Deep Learning » (edX) ; 6.801 Machine Vision ; RES.10-002 Ethics of AI Bias ; 10.01 Ethics for Engineers: AI ; 6.S062 Generative AI in K-12 Education ; 6.S087 ; MIT xPRO « Driving Innovation with Generative AI » (https://xpro.mit.edu/courses/course-v1:xPRO+GenAI/ 🔗).
- **« How MIT teaches and learns AI »** — https://openlearning.mit.edu/news/how-mit-teaches-and-learns-ai ✅ : MIT Learn (12 700+ ressources, assistant « AskTIM »), Day of AI (K-12), RAISE.
- **Licence OCW :** https://ocw.mit.edu/terms ✅ — CC BY-NC-SA 4.0 International (attribution, pas d'usage commercial, partage à l'identique). ⚠️ Conséquence pour nous : du contenu dérivé d'OCW ne peut pas être vendu ; nos leçons doivent être **rédigées de façon originale** (mêmes sujets, texte et exemples propres).

---

## 2. Stanford

### 2.1 CS229 — Machine Learning

- **URL officielle :** https://cs229.stanford.edu/ ✅ (Summer 2026 : Jehangir Amjad, Anand Avati) ; Winter 2026 : https://cs229.stanford.edu/index.html-win26 ✅ (Emily Fox, Sanmi Koyejo) ; Fall 2022 : https://cs229.stanford.edu/syllabus-fall2022.html ✅ (notes PDF « main_notes.pdf »)
- **Prérequis :** Python/NumPy (CS106A/B), probabilités (CS109), calcul multivarié et algèbre linéaire (MATH51)
- **Vidéos :** cours Autumn 2018 (Andrew Ng) sur YouTube (fiche Class Central https://www.classcentral.com/course/youtube-stanford-cs229-machine-learning-full-course-taught-by-andrew-ng-autumn-2018-107761 🔎)
- **Plan :** le syllabus détaillé est dans une feuille Google réservée aux comptes Stanford ; les notes de cours (publiques) couvrent : **Apprentissage supervisé** (régression linéaire, régression logistique, GLM, modèles génératifs GDA/Naive Bayes, SVM et noyaux, réseaux de neurones et backprop) ; **Théorie de l'apprentissage** (biais/variance, régularisation, sélection de modèle) ; **Apprentissage non supervisé** (k-means, mixtures gaussiennes et EM, factor analysis, PCA, ICA) ; **Apprentissage par renforcement** (MDP, value/policy iteration, LQR, policy gradient).

### 2.2 CS224N — Natural Language Processing with Deep Learning

- **URL :** Winter 2024 : https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/ ✅ (Diyi Yang, Tatsunori Hashimoto) ; Winter 2026 : slides lecture 1 https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf ✅ (Diyi Yang, Yejin Choi ; head TA Julie Kallini)
- **Vidéos :** playlist YouTube 2023 https://www.youtube.com/playlist?list=PLoROMvodv4rMFqRtEuo6SGjY4XbRIVRd4 🔗
- **Prérequis :** Python (NumPy, PyTorch), calcul et algèbre linéaire, probabilités, bases de ML (CS221/CS229/CS230/CS124)

**Plan détaillé Winter 2024 :** 1 Word Vectors · 2 Word Vectors and Language Models · 3 Backpropagation and Neural Network Basics · 4 Dependency Parsing · 5 Recurrent Neural Networks · 6 Sequence to Sequence Models and Machine Translation · 7 Final Projects · 8 Transformers · 9 Pretraining · 10 Post-training (RLHF, SFT) · 11 Efficient Adaptation (GPT-3, LoRA) · 12 Question Answering · 13 Security and Privacy (N. Carlini) · 14 Benchmarking and Evaluation · 15 Code Generation · 16 Multimodal Language Models · 17 Human Centered NLP (Constitutional AI) · 18 Deployment and Efficiency (Tri Dao, FlashAttention) · 19 Open Questions in NLP. Sessions : Python review, PyTorch tutorial, Hugging Face Transformers tutorial.

**Winter 2026 (thèmes) :** fondements (word vectors, RNN, attention, transformers) ; pré-/post-entraînement, adaptation efficace, agents, raisonnement, multilinguisme, multimodalité, interprétabilité ; RAG, utilisation d'outils, évaluation. **Devoirs :** HW1 notebook ; HW2 dérivées de tenseurs + parseur de dépendances ; HW3 implémentation d'un transformer ; HW4 évaluation des LLM et red-teaming ; projet final (implémenter un GPT puis l'adapter).

### 2.3 CS231n — Deep Learning for Computer Vision (Spring 2026)

- **URL :** https://cs231n.stanford.edu/schedule.html ✅ (vidéos sur Canvas Stanford ; éditions antérieures https://cs231n.stanford.edu/2025/schedule.html 🔎)

**Plan (18 lectures) :** 1 Introduction · 2 Image classification with linear classifiers (kNN, softmax) · 3 Regularization and optimization (SGD, momentum, AdaGrad, Adam, LR schedules) · 4 Neural networks and backpropagation · 5 Image classification with CNNs · 6 CNN architectures (BatchNorm, transfer learning, AlexNet, VGG, ResNet) · 7 Recurrent networks (RNN, LSTM, GRU, captioning) · 8 Attention and Transformers · 9 Object detection, segmentation, visualizing and understanding (adversarial, DeepDream, style transfer) · 10 Video understanding · 11 Large-scale distributed training · 12 Self-supervised learning (contrastive) · 13 Generative models 1 (VAE, GAN, autoregressive) · 14 Generative models 2 (diffusion) · 15 3D vision (NeRF/implicit) · 16 Vision and language · 17 World modeling (Gordon Wetzstein) · 18 Human-centered AI.

### 2.4 CS324 — Understanding and Developing Large Language Models (Winter 2022)

- **Enseignants :** Percy Liang, Tatsunori Hashimoto, Christopher Ré — **Source :** https://crfm.stanford.edu/courses.html ✅ — **Site du cours :** https://stanford-cs324.github.io/winter2022/ 🔗 (non ouvert : hors allowlist)
- **Plan (d'après les notes de cours publiques, à confirmer sur le site ⚠️) :** introduction, capacités, harms (I et II), données, sécurité/privacy, aspects légaux, modélisation, entraînement, parallélisme, scaling laws, adaptation, environnement/coût.

### 2.5 CS25 — Transformers United V6 (Spring 2026)

- **URL :** https://web.stanford.edu/class/cs25/index.html ✅ ; enregistrements https://web.stanford.edu/class/cs25/recordings ✅ → playlist unique https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM 🔗 ; V5 : https://web.stanford.edu/class/cs25/past/cs25-v5 🔎 ; V4 : https://web.stanford.edu/class/cs25/past/cs25-v4/index.html 🔎
- **Enseignants :** Steven Feng, Karan Singh, Michael C. Frank, Christopher Manning — **Ouvert à tous** (Zoom), pas de prérequis

**Séances V6 :** Overview of Transformers (histoire ML/NLP, fonctionnement, impact) · JEPA / world modeling (Brown) · SSM vs Transformers (Albert Gu) · entraînement à très grande échelle, parallélisme 5D, MoE (Hugging Face) · avenir du pré-entraînement (Mistral) · généralisation paramètres vs contexte (Anthropic) · agents IA pour la science et la médecine (Google DeepMind) · intelligence multimodale native (Thinking Machines) · serving/inférence en production (Modal).

### 2.6 CS336 — Language Modeling from Scratch (Spring 2026)

- **URL :** https://cs336.stanford.edu/ ✅ ; GitHub https://github.com/stanford-cs336 ✅ (devoirs 1-4 **licence MIT**) ; supports https://github.com/stanford-cs336/lectures ✅ (lecture_01 à lecture_17, .py exécutables / .pdf)
- **Enseignants :** Tatsunori Hashimoto, Percy Liang ; TA Herman Brunborg, Marcel Rød, Steven Cao
- **Vidéos :** https://www.youtube.com/watch?v=JuoVZkPBiKk&list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV 🔗 (18 vidéos, Stanford Online)
- **Prérequis :** Python avancé, PyTorch et hiérarchie mémoire, maths (MATH51/CME100, CS109), ML (CS221/229/230/124/224N) ; 5 unités, très lourd en implémentation

**Plan (19 séances) :** 1 Overview, tokenization · 2 PyTorch (einops), resource accounting (FLOPs, mémoire, intensité arithmétique) · 3 Architectures, hyperparamètres · 4 Alternatives à l'attention, MoE · 5 GPU, TPU · 6 Kernels, Triton · 7-8 Parallélisme · 9 Scaling laws · 10 Inférence · 11 Scaling laws (suite) · 12 Évaluation · 13 Données (sources, datasets) · 14 Données (filtrage, déduplication, mélange, synthétiques) · 15 Mid/post-training (SFT/RLHF) · 16 Post-training : RLVR · 17 Alignement, multimodalité · 18-19 Invités (Daniel Selsam, Dan Fu).
**Devoirs :** A1 Basics (tokenizer BPE, Transformer, optimiseur, entraînement) ; A2 Systems (profiling, FlashAttention 2 en Triton, entraînement distribué) ; A3 Scaling (ajuster une loi d'échelle) ; A4 Data (Common Crawl → données de pré-entraînement) ; A5 Alignment and Reasoning RL (SFT + RL sur maths ; DPO optionnel).

### 2.7 CS221 — Artificial Intelligence: Principles and Techniques

- **URL :** https://web.stanford.edu/class/archive/cs/cs221/cs221.1186/index.html ✅ (Spring 2018, Dorsa Sadigh ; fiche Shervine Amidi https://web.stanford.edu/~shervine/teaching/cs-221 🔎)
- **Prérequis :** CS106A/B, CS107, CS103, CS109
- **Plan (structure classique du cours, d'après les cheatsheets Amidi 🔎, à confirmer ⚠️) :** machine learning (régression, classification, k-means) · search (recherche d'états, A*, recherche adversariale) · MDP et RL · games · CSP (satisfaction de contraintes) · Bayesian networks · logic.

### 2.8 Stanford Online — Artificial Intelligence Professional Program

- **Source :** https://hackr.io/blog/stanford-ai-professional-program ✅ (page d'inscription https://learn.stanford.edu/LP-Hackr-AI-2024.html 🔗)
- **Cours :** XCS221 AI: Principles and Techniques ; XCS224N NLP with Deep Learning ; XCS224U Natural Language Understanding ; XCS229 Machine Learning ; XCS224W Machine Learning with Graphs ; XCS234 Reinforcement Learning ; XCS330 Deep Multi-Task and Meta-Learning (codes XCS pour les autres : d'après la nomenclature Stanford, ⚠️ à confirmer)
- **Format/prix :** 1 750 $ par cours, certificat après 3 cours (≥ 30 semaines), cohortes, facilitateur pour ~25 étudiants, Slack.

### 2.9 Stanford HAI — AI Index Report 2026 (chiffres clés)

- **URL :** https://hai.stanford.edu/ai-index/2026-ai-index-report ✅ ; takeaways : https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report ✅ (13 avril 2026)
- **Chapitres :** 1 Research and Development · 2 Technical Performance · 3 Responsible AI · 4 Economy · 5 Science · 6 Medicine · 7 Education · 8 Policy and Governance · 9 Public Opinion
- **Chiffres clés lus sur la page officielle :**
  - OSWorld : précision des agents passée de ~5 % (2024) à **66,3 %** (2025), humain 72,35 %
  - Arena : meilleur modèle US 1 503 points vs meilleur modèle chinois 1 464 (2026)
  - **362 incidents IA** signalés en 2025 (record)
  - Investissement privé IA 2025 : **États-Unis 285,88 Md$**, Europe 20,92 Md$, Chine 12,41 Md$
  - IA générative : **53 % d'adoption en 3 ans** (plus rapide qu'Internet ou le PC)
  - Supercalculateurs IA : Chine 85, Europe + Asie centrale 44, Amérique du Nord 41
  - Confiance dans la régulation publique de l'IA : 91 % (Singapour) → 31 % (États-Unis)
- **Licence :** non indiquée sur la page (⚠️ vérifier le PDF ; les éditions précédentes étaient en CC BY-ND 4.0).

---

## 3. Berkeley, CMU, Harvard

### 3.1 UC Berkeley CS188 — Introduction to Artificial Intelligence

- **URLs :** portail https://inst.eecs.berkeley.edu/~cs188/ ✅ ; Spring 2026 https://inst.eecs.berkeley.edu/~cs188/sp26/ ✅ (Dan Klein, Stuart Russell) ; Fall 2025 https://inst.eecs.berkeley.edu/~cs188/fa25 ✅ (Emma Pierson, Peyrin Kao)
- **Vidéos :** Spring 2026 https://www.youtube.com/playlist?list=PLp8QV47qJEg5tSxKiwcZt4LVwN_ek2Kxy 🔗 ; Fall 2025 https://www.youtube.com/playlist?list=PLp8QV47qJEg614q1L8avhmWQPyIR5QOWq 🔗
- **Licence :** non précisée (supports et projets Pac-Man publics)

**Plan Spring 2026 (28 lectures) :** Intro, Agents, Environments · Uninformed Search · A* Search and Heuristics · Local Search · CSPs I-II · Game Trees I-II · MDPs I-II · RL I-II · Probability · Bayes Nets · Exact Inference · Sampling · Markov Models & HMMs · DBN and Particle Filtering · Rational Decisions · ML I Decision Trees and Linear Regression · ML II-III Naive Bayes and Bayesian Learning · Deep Learning: Perceptrons and Neural Networks · LLMs I Language Models · LLMs II Fine-Tuning and Aligning · Application: AI for Global Nuclear Monitoring · AI Safety · Further Thoughts.
**Fall 2025 (variante) :** … ML I Naive Bayes · ML II Perceptrons · ML III Neural Networks · ML IV Applications & Decision Trees · **ML V Transformers** · AI for Healthcare · AI for Equality.
**Projets :** P0 (IDE/terminal/Python), P1-P5 (famille de projets Pac-Man : search, multi-agent, RL, inférence, ML — intitulés non affichés sur les pages archivées).

### 3.2 CMU 11-785 — Introduction to Deep Learning

- **URLs :** Spring 2025 https://deeplearning.cs.cmu.edu/S25/index.html ✅ ; Fall 2025 https://deeplearning.cs.cmu.edu/F25/index.html ✅ ; Spring 2026 https://deeplearning.cs.cmu.edu/S26/index.html 🔗 ; fiche csdiy https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CMU11-785/ ✅
- **Enseignants :** Bhiksha Raj, Rita Singh — **Chaîne YouTube :** https://www.youtube.com/channel/UC8hYZGEkI2dDO8scT8C5UQA 🔗 — livre en cours : http://mlsp.cs.cmu.edu/people/rsingh/IDLbook.html 🔗
- **Prérequis :** algèbre linéaire, probabilités, Python, bases ML

**Plan (Spring 2025, 28 lectures) :** 0 Logistique · 1 Introduction · 2 Réseaux de neurones comme approximateurs universels · 3-8 Training I-VI (ERM ; descente de gradient et backprop ; backprop/calcul ; convergence, surfaces de perte, momentum ; SGD, mini-batch, second ordre ; optimiseurs, régularisation, batch norm, dropout) · 9-12 CNN I-IV (invariance par translation ; modèles de vision ; apprentissage dans les CNN ; convolution transposée) · 13 Séries temporelles et RNN · 14 Stabilité, mémoire, LSTM · 15-16 Prédiction de séquences (alignement, décodage ; CTC, beam search) · 17 Modèles de langage, seq2seq · 18 Attention, Transformers · 19 Transformers et nouvelles architectures · 20 LLM · 21 Représentations et autoencodeurs · 22 VAE · 23 Diffusion · 24 GAN · 25 Hopfield · 26 Boltzmann · 27 GNN (invité) · 28 tampon. **HW1-HW4** en deux parties (P1 Autolab from-scratch, P2 Kaggle) + HW5.

### 3.3 CMU 11-667 — Large Language Models: Methods and Applications

- **Site :** https://cmu-llms.org/ 🔗 (fiche ✅ https://csdiy.wiki/en/%E6%B7%B1%E5%BA%A6%E7%94%9F%E6%88%90%E6%A8%A1%E5%9E%8B/%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B/CMU11-667/ ; devoirs https://cmu-llms.org/assignments/ 🔗)
- **Prérequis :** ML (10-301/10-601), NLP (11-411/11-611), Python + PyTorch
- **Plan (thèmes) :** fondements (architectures pour la modélisation du langage, entraînement, inférence, métriques) ; sujets avancés (interprétabilité, alignement, capacités émergentes, applications texte/non-texte) ; systèmes (pré-entraînement à grande échelle, déploiement, efficacité) ; éthique et sécurité (biais, attaques adverses, droit). **6 devoirs :** préparation des données, implémentation de Transformers, RAG, évaluation et réduction des biais, efficacité de l'entraînement.

### 3.4 Harvard CS50's Introduction to Artificial Intelligence with Python (CS50 AI)

- **URLs :** https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-Python ✅ (David J. Malan, Brian Yu ; 7 semaines × 10-30 h ; audit gratuit, certificat 299 $) ; edX https://www.edx.org/course/cs50s-introduction-to-artificial-intelligence-with-python 🔗 ; lectures (éd. Extension, mêmes contenus) https://cs50.harvard.edu/extension/ai/2024/fall/lectures ✅ ; projets https://cs50.harvard.edu/extension/ai/2022/fall/projects ✅ ; article freeCodeCamp https://www.freecodecamp.org/news/harvard-cs50s-ai-python-course/ ✅ (vidéo complète 12 h : https://youtu.be/5NgNicANyqM 🔗)
- **Licence :** page « License » non ouverte dans cette session (⚠️ CS50 publie habituellement en CC BY-NC-SA 4.0 — à confirmer sur cs50.harvard.edu/ai/license)

**Plan détaillé (7 lectures, 1 projet par lecture) :**

| # | Lecture | Sujets | Projets (titres 42-style) |
|---|---|---|---|
| 0 | Search | recherche dans les graphes, heuristiques, recherche adversariale, minimax, alpha-bêta | Degrees, Tic-Tac-Toe |
| 1 | Knowledge | logique propositionnelle, inférence, résolution, logique du premier ordre | Knights, Minesweeper |
| 2 | Uncertainty | probabilités, variables aléatoires, inférence probabiliste, réseaux bayésiens, modèles de Markov | PageRank, Heredity |
| 3 | Optimization | recherche locale, hill climbing, CSP, backtracking | Crossword |
| 4 | Learning | classification, régression, SVM, RL, clustering | Shopping, Nim |
| 5 | Neural Networks | feed-forward, backprop, CNN, RNN | Traffic |
| 6 | Language | grammaires hors-contexte, n-grammes, Naive Bayes, word2vec, transformers | Parser, Attention |

> Les titres de projets (Degrees, Tic-Tac-Toe, …) sont ceux connus de CS50 AI ; la page projets ✅ n'affiche que les intitulés de semaines — ⚠️ confirmer les titres individuels.

### 3.5 Harvard CS50x — Introduction to Computer Science

- **URL :** https://cs50.harvard.edu/x/2025/weeks ✅ (David J. Malan) ; 2026 : https://cs50.harvard.edu/x/weeks/6/ 🔎
- **Plan (11 semaines) :** 0 Scratch · 1 C · 2 Arrays · 3 Algorithms · 4 Memory · 5 Data Structures · 6 Python · 7 SQL · 8 HTML, CSS, JavaScript · 9 Flask · 10 The End. Licence : page « license » liée (non ouverte ⚠️).

---

## 4. École 42 — cursus IA / data

Les **sujets officiels 42 sont propriétaires** (intranet). Les plans ci-dessous sont reconstitués à partir de dépôts d'étudiants publics ✅ et de la liste de branche ✅ https://github.com/jmcheon/42cursus (branche « Algo, AI, data » : ml_piscine [DEPRECATED], python_piscine [DEPRECATED], ft_linear_regression, dslr, Leaffliction, Multilayer_Perceptron, Total_perspective_vortex ; + lem-in, n-puzzle, rubik, expert-system, krpsim, Gomoku).

| Projet (titre exact) | Objectif | Compétences | Source ✅ |
|---|---|---|---|
| **Piscine Python for Data Science** (modules 00-04) | Initiation Python orienté data : 00 Starting (bases), 01 Array (NumPy/images), 02 DataTable (pandas, matplotlib), 03 POO (dataclasses, héritage), 04 DOD (data-oriented design, décorateurs/statistiques) ; puis journées datascience_0..4 (SQL, pandas, sklearn) | Python 3.12, Jupyter, Docker, pandas, matplotlib, scikit-learn | https://github.com/Atroooo/Piscine_DataScience |
| **ft_linear_regression** | Prédire le prix d'une voiture en fonction du kilométrage : `predict` + `train` par descente de gradient, from scratch ; bonus : visualisation, précision | régression linéaire univariée, descente de gradient, normalisation | https://github.com/madvid/42_ft_linear_regression |
| **DSLR — Datascience X Logistic Regression** | Recréer le Choixpeau de Poudlard : `describe` (stats from scratch), `histogram`, `scatter_plot`, `pair_plot`, `logreg_train` (one-vs-all, BCE, gradient descent), `logreg_predict` ; bonus SGD/mini-batch | stats descriptives, visualisation, régression logistique multiclasse ; dataset 1 600 × 20 colonnes | https://github.com/madvid/42_DSLR |
| **multilayer-perceptron** | Classifier tumeurs malignes/bénignes (Wisconsin Breast Cancer) avec un MLP from scratch (softmax, backprop, train/predict, early stopping) | réseaux de neurones, backprop, BCE, split train/valid | https://github.com/agiordan101/multilayer_perceptron_42 |
| **Learn2Slither** | Agent RL jouant à Snake sur grille 10×10 (2 pommes vertes, 1 rouge), vision limitée aux 4 directions, Q-learning / DQN, sessions d'entraînement sauvegardées ; bonus longueur ≥ 15-35 | apprentissage par renforcement, Q-learning, DQN | https://github.com/Sleleu/Learn2slither |
| **Leaffliction** | Vision par ordinateur sur maladies de feuilles : `Distribution` (analyse dataset), `Augmentation` (flip, rotation, skew, shear, crop, distortion), `Transformation` (PlantCV : blur, mask, ROI, pseudo-landmarks, histogrammes), `Classification` (train/predict, > 90 % sur ≥ 100 images de validation) | CNN, augmentation, OpenCV/PlantCV, PyTorch/TF | https://github.com/jainavas/leaffliction |
| **Total-Perspective-Vortex** | Interface cerveau-machine : EEG PhysioNet (109 sujets, imagerie motrice main/pied) ; pipeline MNE → filtrage → CSP implémenté soi-même (BaseEstimator/TransformerMixin) → classifieur sklearn → prédiction « temps réel » < 2 s/époque ; ≥ 60 % de précision moyenne | traitement du signal, réduction de dimension (CSP/PCA/ICA), pipelines scikit-learn | https://github.com/GaetanMo/Total_perspective_vortex |

### 4.1 42 AI (association étudiante, 42 Paris)

- **Organisation GitHub :** https://github.com/42-ai ✅ — site http://www.42ai.fr 🔗 — contact contact@42ai.fr — YouTube « 42AI_Paris »
- **bootcamp_python** (498 ★) — https://github.com/42-AI/bootcamp_python 🔗 (miroir lu ✅ https://gh.mise.run.place/42-AI/bootcamp_python) : « Bootcamp to learn Python for Machine Learning » — modules : Python bases (variables, types, fonctions, POO, générateurs, itérateurs) ; Python avancé (décorateurs, multiprocessing, lambda, packages) ; NumPy (slicing, broadcasting, normalisation) ; Pandas (dataframes). PDF par module dans les releases.
- **bootcamp_machine-learning** (255 ★) — https://github.com/42-AI/bootcamp_machine-learning ✅ : Module05 Premiers pas en ML (algèbre linéaire, stats, hypothèse/modèle/coût) · Module06 Régression linéaire univariée (descente de gradient, normalisation) · Module07 Régression linéaire multivariée (polynomiale, train/test, overfitting) · Module08 Régression logistique (multiclasse, précision/rappel/F1, matrice de confusion) · Module09 Régularisation (coût et gradient régularisés). Les modules 00-04 correspondent au bootcamp Python.
- **bootcamp_deep-learning** — « Work in Progress ».
- **Licence :** un fichier LICENSE existe sur chaque dépôt mais son nom n'est pas affiché dans les pages lues (⚠️ à lire ; historiquement CC BY-NC-SA 4.0 pour ces bootcamps — à confirmer).

### 4.2 42 Blockchain

- Aucune page officielle de l'association « 42 Blockchain » n'est ressortie dans les résultats de recherche de cette session (seuls des événements, ex. https://luma.com/42E_PBWS_HappyHour 🔎). ⚠️ À documenter dans une seconde passe (site/GitHub de l'association). Le profil mémoire indique que Nika en est membre : il pourra fournir le lien direct.

---

## 5. Cours ouverts majeurs

### 5.1 DeepLearning.AI — Machine Learning Specialization (Andrew Ng, avec Stanford Online)

- **URL :** https://deeplearning.ai/courses/machine-learning-specialization ✅ ; Coursera https://www.coursera.org/specializations/machine-learning-introduction 🔎
- **Créateurs :** Andrew Ng, Eddy Shyu, Aarti Bagul, Geoff Ladwig — **Débutant** — 94 h 58 (151 vidéos, 32 labs, 42 devoirs) — audit gratuit ; Pro 25-30 $/mois

**Plan :**
- **C1 Supervised Machine Learning: Regression and Classification** — S1 Intro au ML (supervisé vs non supervisé, régression, descente de gradient) · S2 Régression multiple (vectorisation, feature scaling, lab) · S3 Classification (régression logistique, coût, overfitting, régularisation)
- **C2 Advanced Learning Algorithms** — S1 Réseaux de neurones (intuition, TensorFlow, implémentation Python, vectorisation) · S2 Entraînement (activations, multiclasse/softmax, backprop) · S3 Conseils pratiques (biais/variance, cycle de développement, jeux déséquilibrés) · S4 Arbres de décision et ensembles (random forest, XGBoost)
- **C3 Unsupervised Learning, Recommenders, Reinforcement Learning** — S1 Clustering, détection d'anomalies · S2 Recommandation (filtrage collaboratif, basé contenu, PCA) · S3 RL (fonction Q, espaces continus, lunar lander)

### 5.2 DeepLearning.AI — Deep Learning Specialization

- **URL :** https://www.deeplearning.ai/deep-learning-specialization/ ✅ ; fiche https://www.deeplearning.ai/alpha/courses/deep-learning-specialization ✅ ; Coursera https://www.coursera.org/specializations/deep-learning 🔎
- **Enseignant :** Andrew Ng — ~16 semaines × 3-6 h — Intermédiaire
- **5 cours :** 1 Neural Networks and Deep Learning · 2 Improving Deep Neural Networks: Hyperparameter Tuning, Regularization and Optimization · 3 Structuring Machine Learning Projects · 4 Convolutional Neural Networks · 5 Sequence Models (RNN, LSTM, word embeddings, attention, transformers). (Détail hebdomadaire non affiché sur les pages lues.)

### 5.3 DeepLearning.AI — Short courses (catalogue vérifié le 01/11/2026)

Catalogue : https://www.deeplearning.ai/short-courses/ ✅ ; index complet https://www.deeplearning.ai/llms.txt ✅ (les short courses y sont sous `/courses/`). Tous gratuits, 1-2 h, niveau débutant/intermédiaire.

**Avec Anthropic (4) :**
| Cours | Enseignant | Durée | Leçons | URL |
|---|---|---|---|---|
| Building toward Computer Use with Anthropic | Colt Steele (Anthropic) | ~1 h 44 | Overview · Working with the API · Multimodal Requests · Real World Prompting · Prompt Caching · Tool Use · Computer Use | https://learn.deeplearning.ai/courses/building-toward-computer-use-with-anthropic/lesson/1/introduction ✅ |
| MCP: Build Rich-Context AI Apps with Anthropic | Elie Schoppik (Anthropic) | 1 h 58, intermédiaire | Why MCP · MCP Architecture · Chatbot Example · Creating an MCP Server · Creating an MCP Client · Connecting to Reference Servers · Prompt and Resource Features · Configuring Servers for Claude Desktop · Remote Servers | https://deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic ✅ |
| Claude Code: A Highly Agentic Coding Assistant | Elie Schoppik | 2 h, intermédiaire | What is Claude Code? · Setup & Codebase Understanding · Adding Features · Testing, Debugging, Refactoring · Multiple Features Simultaneously (worktrees) · GitHub Integration & Hooks · Refactoring a Jupyter Notebook & Dashboard · Web App from a Figma Mockup | https://deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant ✅ |
| Agent Skills with Anthropic | Elie Schoppik | 2 h 19, débutant | Why Skills I-II · Skills vs tools vs MCP vs subagents · Pre-built Skills · Custom Skills · Skills with the Claude API · with Claude Code · with the Claude Agent SDK | https://www.deeplearning.ai/courses/agent-skills-with-anthropic ✅ |

**Avec OpenAI :**
- ChatGPT Prompt Engineering for Developers — Isa Fulford, Andrew Ng — 1 h 40 — Guidelines · Iterative · Summarizing · Inferring · Transforming · Expanding · Chatbot — https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/ ✅
- Building Systems with the ChatGPT API — Isa Fulford, Andrew Ng — 1 h 55 — Language Models, Chat Format, Tokens · Classification · Moderation · Chain of Thought · Chaining Prompts · Check Outputs · Evaluation I-II — https://deeplearning.ai/short-courses/building-systems-with-chatgpt/ ✅
- Reasoning with o1 ; Collaborative Writing and Coding with OpenAI Canvas — https://www.deeplearning.ai/courses/reasoning-with-o1 🔗, https://www.deeplearning.ai/courses/collaborative-writing-and-coding-with-openai-canvas 🔗

**Avec LangChain :**
- LangChain for LLM Application Development — Harrison Chase, Andrew Ng — 1 h 53 — Models, Prompts and Parsers · Memory · Chains · Question and Answer · Evaluation · Agents — https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/ ✅
- LangChain: Chat with Your Data ; Functions, Tools and Agents with LangChain ; AI Agents in LangGraph ; Long-Term Agentic Memory With LangGraph ; Loop Engineering with LangChain Deep Agents — URLs 🔗 dans llms.txt (`/courses/langchain-chat-with-your-data`, `/courses/functions-tools-agents-langchain`, `/courses/ai-agents-in-langgraph`, `/courses/long-term-agentic-memory-with-langgraph`, `/courses/loop-engineering-with-langchain-deep-agents`)

**Avec Google :** Gemini CLI: Code & Create with an Open-Source Agent ; Building Live Voice Agents with Google's ADK ; Large Multimodal Model Prompting with Gemini ; Understanding and Applying Text Embeddings (Vertex AI) ; Build and Train an LLM with JAX — 🔗 llms.txt
**Avec Meta :** Building with Llama 4 ; Introducing Multimodal Llama 3.2 ; Prompt Engineering with Llama 2 & 3 — 🔗
**Avec Hugging Face :** Open Source Models with Hugging Face ; Quantization Fundamentals with Hugging Face ; Building Generative AI Applications with Gradio ; Building Code Agents with Hugging Face smolagents — 🔗 (fiches ✅ https://www.analyticsvidhya.com/blog/2024/05/free-generative-ai-short-courses-by-deeplearning-ai/)
**Avec Microsoft :** How Business Thinkers Can Start Building AI Plugins With Semantic Kernel — 🔗
**Avec Mistral :** Getting Started with Mistral — 🔗
**Avec AWS (cours long) :** Generative AI with Large Language Models — Antje Barth, Chris Fregly, Shelbee Eigenbrode, Mike Chambers — 13 h 18 — S1 cas d'usage, cycle de vie, pré-entraînement · S2 fine-tuning et évaluation · S3 RLHF et applications — https://www.deeplearning.ai/courses/generative-ai-with-llms/ ✅
**Autres partenaires listés sur la page catalogue ✅ :** crewAI (Multi AI Agent Systems ; Practical Multi AI Agents), Chroma (Advanced Retrieval), Predibase (Reinforcement Fine-Tuning with GRPO), Qdrant, Box (MCP Server), SAP, Neo4j (Agentic Knowledge Graph Construction), Databricks (DSPy), LandingAI (Document AI), LlamaIndex (Event-Driven Agentic Document Workflows), Oracle, JetBrains (AI Coding Workflows ; Spec-Driven Development with Coding Agents), Qodo (AI Code Review), Cerebras, Astronomer, AGI Inc (Building AI Browser Agents), University of Washington/NexusFlow (Post-training of LLMs), Pydantic for LLM Workflows (DeepLearning.AI). Autres cours historiques : How Diffusion Models Work (Lamini), Fine-Tuning LLMs, Knowledge Graphs for RAG, LLMs for Semantic Search (Cohere), Evaluating and Debugging GenAI (W&B), Preprocessing Unstructured Data (Unstructured), JavaScript RAG Web Apps with LlamaIndex.

### 5.4 DeepLearning.AI — AI For Everyone (Coursera)

- https://www.deeplearning.ai/courses/ai-for-everyone ✅ — Andrew Ng — 6 h 54 — Débutant — S1 Qu'est-ce que l'IA ? · S2 Construire des projets IA · S3 L'IA dans votre entreprise · S4 IA et société. Coursera : https://www.coursera.org/learn/ai-for-everyone 🔎

### 5.5 Google Machine Learning Crash Course

- https://developers.google.com/machine-learning/crash-course?authuser=8 ✅ ; prérequis https://developers.google.com/machine-learning/crash-course/prereqs-and-prework?authuser=8 🔎
- **12 modules :** ML Models (Linear Regression ; Logistic Regression ; Classification) · Data (Numerical Data ; Categorical Data ; Datasets, Generalization, Overfitting) · Advanced ML (Neural Networks ; Embeddings ; Intro to Large Language Models) · Real-world ML (Production ML Systems ; AutoML ; ML Fairness). Licence non affichée sur la page (⚠️ Google Developers : CC BY 4.0 en général).

### 5.6 Google Cloud Skills Boost — Introduction to Generative AI Learning Path

- Parcours 118 : https://www.cloudskillsboost.google/paths/118 ✅ (redirige vers https://www.skills.google/paths/118 — non ouvert) ; liste ✅ via https://www.thedailystar.net/tech-startup/news/free-google-courses-level-your-ai-skills-3626566
- **Cours :** Introduction to Generative AI (https://www.cloudskillsboost.google/paths/118/course_templates/536 🔗) · Introduction to Large Language Models (…/course_templates/539 🔗) · Introduction to Responsible AI (https://www.cloudskillsboost.google/course_templates/554 🔗) · Prompt Design in Vertex AI (…/paths/118/course_templates/976 🔗) ; connexes : Introduction to Vertex AI Studio (552), Introduction to Image Generation (541), Responsible AI: Applying AI Principles with Google Cloud (388). Version Coursera : https://www.coursera.org/specializations/introduction-to-generative-ai 🔎

### 5.7 fast.ai — Practical Deep Learning for Coders (2022-2023)

- https://course.fast.ai/ ✅ ; annonce https://www.fast.ai/posts/2022-07-21-dl-coders-22.html ✅ ; playlist https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU 🔗 ; code https://github.com/fastai/course22 🔗 ; livre https://github.com/fastai/fastbook/ 🔗
- **Enseignant :** Jeremy Howard — **Prérequis :** 1 an de code (Python), maths de lycée — Part 1 : 9 leçons × ~90 min
- **Part 1 :** 1 Getting started · 2 Deployment (Hugging Face Spaces, Gradio) · 3 Neural net foundations (SGD, matmul, ReLU) · 4 Natural Language (NLP) · 5 From-scratch model · 6 Random forests · 7 Collaborative filtering · 8 Convolutions (CNNs) · bonus Data ethics
- **Part 2 « Deep Learning Foundations to Stable Diffusion » :** 9 Stable Diffusion · 10 Diving Deeper · 11 Matrix multiplication · 12 Mean shift clustering · 13 Backpropagation & MLP · 14 Backpropagation · 15 Autoencoders · 16 The Learner framework · 17 Initialization/normalization · 18 Accelerated SGD & ResNets · 19 DDPM and Dropout · 20 Mixed Precision · 21 DDIM · 22 Karras et al (2022) · 23 Super-resolution · 24 Attention & transformers · 25 Latent diffusion
- **Licence :** non précisée sur le site (⚠️ le dépôt fastbook est sous licence propre « usage personnel », le code fastai en Apache 2.0 — à vérifier).

### 5.8 Andrej Karpathy

- **Neural Networks: Zero to Hero** — https://karpathy.ai/zero-to-hero.html ✅ — prérequis : Python solide, dérivées, gaussienne — 8 vidéos :
  1. The spelled-out intro to neural networks and backpropagation: building micrograd (2 h 25) https://youtu.be/VMj-3S1tku0 🔗
  2. The spelled-out intro to language modeling: building makemore (1 h 57) https://youtu.be/PaCmpygFfXo 🔗
  3. Building makemore Part 2: MLP (1 h 15) https://youtu.be/TCH_1BHY58I 🔗
  4. Building makemore Part 3: Activations & Gradients, BatchNorm (1 h 55) https://youtu.be/P6sfmUTpUmc 🔗
  5. Building makemore Part 4: Becoming a Backprop Ninja (1 h 55) https://youtu.be/q8SA3rM6ckI 🔗
  6. Building makemore Part 5: Building a WaveNet (56 min) https://youtu.be/t3YJ5hKiMQ0 🔗
  7. Let's build GPT: from scratch, in code, spelled out (1 h 56) https://www.youtube.com/watch?v=kCc8FmEb1nY 🔗
  8. Let's build the GPT Tokenizer (2 h 13) https://youtu.be/zduSFxRajkE 🔗
- **[1hr Talk] Intro to Large Language Models** — https://www.youtube.com/watch?v=zjkBMFhNj_g 🔗 (source ✅ https://aiiq.substack.com/p/must-watch-video-introduction-to) — ~1 h ; plan : (1) LLM = 2 fichiers, pré-entraînement, (2) fine-tuning / assistant, (3) futur et sécurité (⚠️ plan de mémoire, non relu dans cette session)
- **Deep Dive into LLMs like ChatGPT** — identifiant YouTube 7xTGNNLPyMI (https://youtubesummary.com/summary/7xTGNNLPyMI ✅ ; https://conffab.com/?p=7983 ✅ : ~3 h 30) — plan : pré-entraînement (données web) · tokenisation · architecture/optimisation · inférence · post-entraînement SFT · hallucinations · outils et fenêtre de contexte · raisonnement · RL et RLHF · perspectives.

### 5.9 3Blue1Brown — Neural Networks (série « Deep Learning »)

- https://www.3blue1brown.com/topics/neural-networks ✅ (© Grant Sanderson, pas de licence CC) ; épisodes ✅ via https://www.thetvdb.com/series/3blue1brown/seasons/official/2024 et https://www.beri.net/learning/3blue1brown-neural-networks
- **Chapitres :** 1 But what is a Neural Network? · 2 Gradient descent, how neural networks learn · 3 What is backpropagation really doing? · 4 Backpropagation calculus · 5 But what is a GPT? Visual intro to Transformers (avril 2024) · 6 Attention in transformers, visually explained · 7 How might LLMs store facts (MLP) · + Large Language Models explained briefly (nov. 2024) · + interlude (analyse du réseau entraîné).

### 5.10 Kaggle Learn

- kaggle.com/learn ⚠️ (non ouvert) ; fiche ✅ https://www.beri.net/learning/kaggle-learn — **17 micro-cours gratuits**, « quelques heures » chacun : Python · Pandas · Data Visualization · Intro to Machine Learning (modèles, validation, under/overfitting, random forests) · Intermediate Machine Learning (valeurs manquantes, encodage, pipelines, cross-validation, XGBoost, data leakage) · Data Cleaning · Feature Engineering (information mutuelle, k-means, PCA, target encoding) · Time Series · Geospatial Analysis · Machine Learning Explainability · Intro to Deep Learning · Computer Vision · Natural Language Processing · Intro to Game AI and Reinforcement Learning · Intro to AI Ethics · Intro to SQL · Advanced SQL. Plus les « Gen AI Intensive » et « AI Agents Intensive » (5 jours, avec Google).

### 5.11 Microsoft (GitHub, licence MIT)

- **Generative AI for Beginners (v3)** — https://github.com/microsoft/generative-ai-for-beginners ✅ — MIT — 00 Course Setup · 01 Introduction to Generative AI and LLMs · 02 Exploring and comparing different LLMs · 03 Using Generative AI Responsibly · 04 Prompt Engineering Fundamentals · 05 Advanced Prompts · 06 Text Generation Applications · 07 Chat Applications · 08 Search Apps / Vector Databases · 09 Image Generation · 10 Low Code AI Applications · 11 Function Calling · 12 UX for AI Applications · 13 Securing GenAI Applications · 14 GenAI Application Lifecycle · 15 RAG and Vector Databases · 16 Open Source Models and Hugging Face · 17 AI Agents · 18 Fine-Tuning LLMs · 19 Building with SLMs · 20 Building with Mistral Models · 21 Building with Meta Models. Site : https://microsoft.github.io/generative-ai-for-beginners/ 🔗
- **AI for Beginners (12 semaines, 24 leçons)** — https://github.com/microsoft/ai-for-beginners ✅ — MIT — I Intro & History · II Symbolic AI (Knowledge Representation, Expert Systems) · III Neural Networks (Perceptron ; MLP & own framework ; PyTorch/TensorFlow & overfitting) · IV Computer Vision (OpenCV ; CNN ; transfer learning ; autoencoders/VAE ; GAN & style transfer ; object detection ; segmentation U-Net) · V NLP (BoW/TF-IDF ; Word2Vec/GloVe ; language modeling ; RNN ; generative RNN ; Transformers/BERT ; NER ; LLM & prompt programming) · VI Autres (genetic algorithms ; deep RL ; multi-agent) · VII AI Ethics · Extras (multi-modal, CLIP, VQGAN).
- **ML for Beginners (12 semaines, 26 leçons)** — github.com/microsoft/ML-For-Beginners ⚠️ (non ouvert ; plan ✅ via https://www.i-programmer.info/news/150-training-a-education/14802-microsofts-machine-learning-for-beginners.html) : intro & histoire du ML, fairness · régression (prix des citrouilles I-III, web app) · classification (cuisines asiatiques 1-3) · clustering (musique nigériane) · NLP (tâches, traduction/sentiment, hôtels d'Europe) · séries temporelles (consommation électrique) · RL (Peter et le loup) · ML dans le monde réel. Licence MIT (⚠️ à relire sur le dépôt).

### 5.12 Elements of AI (Université d'Helsinki / Reaktor-MinnaLearn) — version française

- https://www.elementsofai.com/ 🔗 (course.elementsofai.com ✅ ouvert mais page JS vide) ; fiche UE ✅ https://digital-skills-jobs.europa.eu/en/learning-space/training-catalogue/elements-ai (gratuit, 23 langues dont le **français**, 6 chapitres × 3 sections, ~4 semaines) ; lancement FR ✅ https://lettres.sorbonne-universite.fr/en/news/french-version-elements-ai-platform-launched (Sorbonne Université, IRCAM/Philippe Esling ; 30-60 h)
- **Plan « Introduction à l'IA » (6 chapitres, intitulés FR officiels ⚠️ à confirmer sur elementsofai.fr) :** 1 Qu'est-ce que l'IA ? · 2 Résolution de problèmes par l'IA (recherche, jeux) · 3 L'IA dans le monde réel (probabilités, Bayes) · 4 Apprentissage automatique · 5 Réseaux neuronaux · 6 Implications. Second cours : « Building AI ».

### 5.13 Full Stack Deep Learning

- **Course 2022** — https://fullstackdeeplearning.com/course/ ✅ — 1 Course Vision and When to Use ML · 2 Development Infrastructure & Tooling · 3 Troubleshooting & Testing · 4 Data Management · 5 Deployment · 6 Continual Learning · 7 Foundation Models · 8 ML Teams and Project Management · 9 Ethics ; labs 0, 4-8 (experiment management, testing, annotation, web deployment, monitoring) ; pages https://fullstackdeeplearning.com/course/2022/ 🔗
- **LLM Bootcamp Spring 2023** — https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/ ✅ — Learn to Spell: Prompt Engineering · LLMOps · UX for Language User Interfaces · Augmented Language Models · Launch an LLM App in One Hour · LLM Foundations · Project Walkthrough: askFSDL · What's Next? · invités : Reza Shabani (train your own LLM), Harrison Chase (Agents), Peter Welinder (OpenAI).

### 5.14 Hugging Face Learn (12 cours)

- Catalogue https://huggingface.co/learn ✅ : LLM Course · Context Course (context engineering pour agents de code) · Robotics Course (LeRobot) · a smol course (post-training) · Agents Course · Deep RL Course · Community Computer Vision Course · Audio Course · Open-Source AI Cookbook · ML for Games Course · Diffusion Course · ML for 3D Course ; + MCP Course.
- **LLM Course** — https://huggingface.co/learn/llm-course/chapter1/1 ✅ — **Apache 2.0** — 0 Setup · 1 Transformer models · 2 Using 🤗 Transformers · 3 Fine-tuning a pretrained model · 4 Sharing models and tokenizers · 5 Datasets · 6 Tokenizers · 7 Classical NLP tasks · 8 How to ask for help · 9 Building and sharing demos (Gradio) · 10 Curate high-quality datasets · 11 Fine-tune LLMs · 12 Build Reasoning Models. Prérequis : Python ; cours DL intro (fast.ai / DeepLearning.AI) conseillé.
- **Agents Course** — https://huggingface.co/learn/agents-course/unit0/introduction ✅ — Unit 1 Introduction to Agents (outils, pensées, actions, observations, chat templates) · Unit 2 Frameworks (smolagents, LlamaIndex, LangGraph) · Unit 3 Agentic RAG · Unit 4 Final Project · bonus : fine-tuning pour function-calling, observabilité/évaluation, agents dans Pokémon ; 3-4 h/semaine ; certificats gratuits.
- **MCP Course** — https://huggingface.co/learn/mcp-course/unit0/introduction ✅ — 0 Onboarding · 1 Fondamentaux MCP · 2 Cas d'usage de bout en bout · 3 Advanced MCP Development: Custom Workflow Servers (agent de PR sur le Hub) · 4 Bonus.
- Deep RL Course https://huggingface.co/learn/deep-rl-course/unit0/introduction 🔗 ; Diffusion Course https://huggingface.co/learn/diffusion-course/unit0/1 🔗 (4 unités) — fiches ✅ https://www.kdnuggets.com/5-free-ai-courses-from-hugging-face, https://aiengineerguide.com/til/free-ai-courses-from-huggingface/

### 5.15 Anthropic Academy et OpenAI Academy

- **Anthropic Academy** (anthropic.skilljar.com) — fiche ✅ https://www.analyticsvidhya.com/blog/2026/03/free-anthropic-ai-courses-with-certificates/ — gratuits avec certificat : AI Fluency: Framework & Foundations (< 1 h) · Claude 101 · Building with the Claude API (> 8 h, 84 leçons : system prompts, tool use, context windows, architectures) · Introduction to Model Context Protocol · Claude with Google Cloud Vertex AI · Claude with Amazon Bedrock · Claude Code in Action. URLs skilljar 🔗 (ex. https://anthropic.skilljar.com/claude-with-the-anthropic-api).
- **OpenAI Academy** — academy.openai.com ⚠️ : non ouvert (budget de recherche épuisé). À documenter en seconde passe.

---

## 6. Livres de référence libres

⚠️ **Aucune de ces pages n'a pu être ouverte dans cette session** (hors allowlist, puis proxy 403 en accès direct). Les URLs ci-dessous sont les adresses canoniques connues ; les licences sont indiquées de mémoire et **doivent être confirmées** en seconde passe.

| Livre | Auteurs | URL canonique ⚠️ | Licence (à confirmer) |
|---|---|---|---|
| Dive into Deep Learning | Zhang, Lipton, Li, Smola | https://d2l.ai/ | CC BY-SA 4.0 (texte), code Apache 2.0 — version FR partielle existante |
| Deep Learning | Goodfellow, Bengio, Courville | https://www.deeplearningbook.org/ | lecture en ligne gratuite, pas de licence libre (HTML uniquement) |
| Speech and Language Processing (3e éd., draft) | Jurafsky, Martin | https://web.stanford.edu/~jurafsky/slp3/ | gratuit en ligne (draft), tous droits réservés |
| Understanding Deep Learning | Simon J.D. Prince | https://udlbook.github.io/udlbook/ | PDF gratuit ; notebooks sous licence libre |
| The Little Book of Deep Learning | François Fleuret | https://fleuret.org/francois/lbdl.html | CC BY-NC-SA 4.0 |
| Hands-On Large Language Models | Alammar, Grootendorst (O'Reilly) | github.com/HandsOnLLM/Hands-On-Large-Language-Models | code Apache 2.0 ; livre payant |

---

## 7. France — Fun-MOOC et cours francophones

⚠️ **Section non vérifiée** : le budget de recherche web (200 requêtes partagées) a été épuisé avant cette section et le proxy a refusé l'accès direct. Liste des ressources ciblées avec leurs URLs canoniques, **à ouvrir en seconde passe** :

| Ressource | Porteur | URL ⚠️ | Notes |
|---|---|---|---|
| « L'Intelligence Artificielle… avec intelligence ! » | Inria / Class'Code sur Fun-MOOC | https://www.fun-mooc.fr/fr/cours/intelligence-artificielle-avec-intelligence/ | MOOC citoyen, CC BY-NC-SA habituellement |
| « Machine learning in Python with scikit-learn » | Inria (Fun-MOOC) | https://www.fun-mooc.fr/fr/cours/machine-learning-in-python-with-scikit-learn/ ; support libre https://inria.github.io/scikit-learn-mooc/ | ~ « Fundamentals of ML » ; support CC BY 4.0 |
| « IA pour tous » / Class'Code IAI | Class'Code, Inria | https://classcode.fr/iai/ | ressources CC BY |
| Objectif IA | Institut Montaigne × OpenClassrooms | https://objectif-ia.openclassrooms.com/ | 6 h, gratuit |
| Pix — parcours IA | Pix (GIP) | https://pix.fr/ia | certification de compétences |
| Elements of AI (FR) | Helsinki / Sorbonne | https://www.elementsofai.fr/ | voir 5.12 (fiches UE et Sorbonne ✅) |
| France Université Numérique (catalogue) | FUN | https://www.fun-mooc.fr/ | filtrer « intelligence artificielle » |

---

## 8. Liste des URLs restant à vérifier (seconde passe)

1. https://stanford-cs324.github.io/winter2022/ (plan CS324)
2. https://cs50.harvard.edu/ai/license et https://cs50.harvard.edu/x/2025/license/ (licence CS50)
3. https://github.com/42-AI/bootcamp_python et le fichier LICENSE des bootcamps 42 AI
4. Site / GitHub de l'association **42 Blockchain**
5. https://www.kaggle.com/learn (titres et durées officiels)
6. https://github.com/microsoft/ML-For-Beginners (licence, 26 leçons)
7. https://www.elementsofai.fr/ (intitulés FR des chapitres)
8. https://academy.openai.com/ (catalogue)
9. Les 6 livres de la section 6 (URL + licence)
10. Les 7 ressources françaises de la section 7
11. https://www.skills.google/paths/118 (nouveau domaine Google Skills)
12. Licence du Machine Learning Crash Course (Google) et de fast.ai/fastbook
13. https://developers.google.com/machine-learning/crash-course/prereqs-and-prework (prérequis)

---

## 9. Synthèse pour la rédaction de nos 150 h

**Socle commun à tous les cours d'introduction (6.036/6.390, CS229, MLS, Crash Course, 42 AI) :** régression linéaire → descente de gradient → régression logistique → régularisation / biais-variance → réseaux de neurones et backprop → arbres et ensembles → non supervisé (k-means, PCA) → RL (MDP, Q-learning).

**Socle deep learning (6.S191, 11-785, CS231n, fast.ai, Karpathy, 3B1B) :** MLP et backprop from scratch → optimisation (SGD, momentum, Adam, batch norm, dropout) → CNN → RNN/LSTM → attention et Transformers → modèles génératifs (VAE, GAN, diffusion) → RL profond.

**Socle LLM (CS224N, CS336, 11-667, CS25, Karpathy Deep Dive, HF LLM Course) :** tokenisation (BPE) → architecture Transformer/GPT → pré-entraînement et scaling laws → données (filtrage, déduplication) → SFT / RLHF / DPO / RLVR → évaluation et red-teaming → inférence efficace (FlashAttention, quantification) → RAG, agents, outils, MCP.

**Socle IA classique (6.034, CS188, CS221, CS50 AI) :** recherche (DFS/BFS/A*), jeux (minimax, alpha-bêta), CSP, logique, probabilités et réseaux bayésiens, HMM, MDP.

**Socle « agents et outillage 2026 » (short courses Anthropic/DeepLearning.AI, HF Agents/MCP, Anthropic Academy) :** API Claude (tool use, prompt caching, multimodal) → MCP (serveurs/clients) → Claude Code (hooks, worktrees, GitHub) → Agent Skills → agents frameworks (smolagents, LangGraph, LlamaIndex) → observabilité/évaluation.

**Contraintes de licence à respecter :** MIT OCW et 6.390 en CC BY-NC-SA (pas de réutilisation commerciale) ; 6.S191, Microsoft, CS336 (devoirs) en MIT ; HF LLM Course en Apache 2.0 ; DeepLearning.AI, Stanford/Berkeley/CMU vidéos : propriétaires (citer, ne pas copier). → Rédiger des leçons originales couvrant les mêmes sujets, avec renvoi vers les sources.
