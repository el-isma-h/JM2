# Test lecteur débutant — Niveau 1 (L001 à L031)

> Relecture du 5 novembre 2026 · lecteur simulé : salarié de PME, 45 ans, n'a jamais codé, utilise un peu ChatGPT · objectif client : formation « simplifiée et vulgarisée au maximum ».

## Méthode et règles appliquées

- Chaque leçon a été lue en entier (hors blocs `quiz` / `mission`), dans la peau de ce lecteur, en relevant : jargon non expliqué à sa première apparition, phrases trop longues ou abstraites, sauts logiques, exemples trop « tech », passages de décrochage, consignes d'exercice ambiguës.
- Corrections **strictement additives** :
  - jargon → explication entre parenthèses juste après le mot (avec « voir le lexique » quand le terme existe dans `glossaire/glossaire.json`) ;
  - passage difficile → encadré `> 💡 **Autrement dit** — …` juste après, avec une image du quotidien, seulement s'il n'y en avait pas déjà un pour ce passage ;
  - consigne ambiguë → paragraphe `**Concrètement :** …` placé juste après la consigne ;
  - en fin de leçon → encadré `> ✅ **Si vous ne retenez que 3 choses** — 1. … 2. … 3. …`, placé juste avant « 📚 Pour aller plus loin ».
- Aucune phrase existante supprimée ni réécrite ; en-têtes YAML, blocs de code, blocs `quiz` / `mission`, titres, `fiche.md`, `module.json`, `quiz.json` et lexique non modifiés. Un script a vérifié, fichier par fichier, que le texte d'origine se retrouve **intact et dans l'ordre** dans le texte enrichi (0 écart) et que les blocs de code et le YAML sont identiques.

## Bilan chiffré

| Indicateur | Valeur |
|---|---|
| Leçons relues et enrichies | 31 / 31 |
| Parenthèses explicatives ajoutées | 178 |
| Nouveaux encadrés « Autrement dit » | 36 (74 au total dans N1 avec les 38 déjà présents) |
| Paragraphes « Concrètement » (consignes d'exercice) | 33 (dans les 31 leçons) |
| Encadrés « Si vous ne retenez que 3 choses » | 31 (un par leçon) |
| Mots des 31 leçons N1 (comptage de validate.mjs) | 77 272 → 87 422 (+10 150, soit +13 %) |
| `node scripts/validate.mjs` | ✅ Aucune erreur bloquante |

## Constats transverses (ce qui fait décrocher notre lecteur)

1. **Les exercices supposent un savoir-faire implicite.** Où cliquer, quel format rendre, que faire sans compte payant ni données réelles : c'était le premier point bloquant, dans presque toutes les leçons. D'où un « Concrètement » sous chaque consigne d'exercice, et parfois deux.
2. **Des paragraphes écrits pour des développeurs** se trouvent au milieu de leçons grand public : versions d'API, paramètres `temperature` / `top_k`, erreur 400, SDK (L008, L017), Search / Agent API (L013), révision MCP 2026-07-28 (L027), blocs Python ou bash (L002, L011, L031). Pour chacun, un « Autrement dit » dit au lecteur ce qu'il peut sauter et la seule idée à retenir.
3. **Les listes de noms de modèles et de produits** (L001, L003, L009, L010, L012) donnent l'impression qu'il faut tout mémoriser. Ajout d'un message rassurant (« ce sont des marques, comme des modèles de voiture »).
4. **Le vocabulaire technique revient sans être redéfini d'un module à l'autre** (API, token, local, open source, tenant, CRM…). Il est maintenant expliqué à sa première apparition dans chaque leçon où il gênait.
5. **Les obstacles matériels** : un terminal (L011), une clé API payante (L025), un abonnement Pro (L011) arrivent sans prévenir. Les prérequis et les solutions de repli sont désormais dits dans les « Concrètement ».

## Points relevés mais non traités (hors périmètre additif)

- Proposition optionnelle : **L029** — le paragraphe sur l'article 4 et l'encadré « 📌 Mise à jour (nov. 2026) » qui le suit disent presque mot pour mot la même chose. Un « Autrement dit » prévient le lecteur, mais il serait plus simple de supprimer l'un des deux (demande explicite nécessaire).
- Proposition optionnelle : **L025** — l'exercice exige une clé API Anthropic payante. Il faudrait prévoir une variante sans clé (par exemple un modèle gratuit, ou une démonstration par le formateur) pour les apprenants dont l'employeur ne fournit pas de moyen de paiement.
- Proposition optionnelle : **L004 et L028** — « 15 fiches pratiques (numérotées de 1 à 13) » étonne le lecteur dans L004. L028 explique l'écart (fiche 4 en deux parties, fiche 8 bis) ; L004 pourrait renvoyer à cette explication.
- Proposition optionnelle : reporter dans `glossaire/glossaire.json` les termes expliqués ici qui n'y figurent pas encore (tenant, ruban, plage, persona, verbatim, ERP, SIRH, localhost…).
- Note de méthode : dans L014, une de mes propres parenthèses (sur le « marquage lisible par machine ») a été reformulée juste après insertion, pour éviter une ponctuation « ;, ». Le texte d'origine n'a pas été touché.

---

# Détail par leçon : points bloquants → ajout fait

## M01 — Comprendre l'intelligence artificielle

### L001 — Histoire et définitions
| Point bloquant (lecture « débutant ») | Ajout fait |
|---|---|
| « algorithme de recherche » non expliqué (§1.1) | Parenthèse : méthode qui essaie les chemins possibles + renvoi lexique |
| « exemples étiquetés » (§1.2) | Parenthèse : exemples accompagnés de la bonne réponse |
| « rétropropagation du gradient » (§1.3) | Parenthèse : méthode qui corrige les erreurs petit à petit + lexique |
| Tableau historique : « perceptron », « poids », « apprentissage par renforcement » | Trois parenthèses courtes dans les cellules |
| Dernière ligne du tableau (noms de modèles 2026, « fenêtre de contexte », « agents ») : décrochage | Encadré *Autrement dit* (noms = modèles de voiture, fenêtre = plusieurs romans, agent = IA qui enchaîne des étapes) |
| Tableau des 3 approches abstrait (« données structurées », « caractéristiques », « halluciner ») | Encadré *Autrement dit* « trois cuisiniers » |
| « milliards (B) » | Parenthèse : B = *billion* (« 70B ») |
| Exercice : comment choisir la famille quand on n'y connaît rien ? | *Concrètement* : support, durée, deux questions-test, droit à l'hésitation |
| — | Encadré final *3 choses* |

### L002 — Comment une machine apprend
| Point bloquant | Ajout fait |
|---|---|
| « étiquettes », « licéité » (§1.1) | Deux parenthèses |
| « potentiomètres » | Parenthèse : boutons de réglage du son |
| Jeu de test / sur-apprentissage : liste abstraite | *Autrement dit* : examen avec sujets inédits / élève qui récite les annales |
| « modèle ouvert », « Ollama », « API » (§1.3) | Trois parenthèses (+ renvoi lexique et L024 pour API) |
| « token » à sa première apparition | Parenthèse + renvoi lexique/L005 |
| Tableau des 3 modes d'apprentissage ; « data center » | *Autrement dit* : corrigé / boîte de boutons / dressage du chien |
| §2.1 « interpréteur Python 3.12 en ligne », « converger » : blocage total pour un non-codeur | *Concrètement* : comment faire pas à pas, sens de « converger », droit de sauter |
| « époque », « annotateurs », « DPO » | Trois parenthèses |
| « fenêtre de contexte », « tokens en entrée » | Deux parenthèses |
| Exercice « fiche d'une page », « indicateur chiffré » | *Concrètement* : format, rien à programmer, exemple d'indicateur |
| — | Encadré final *3 choses* |

### L003 — Les grandes familles d'IA
| Point bloquant | Ajout fait |
|---|---|
| Intro abstraite (« référentiels », « type de donnée d'entrée / de sortie ») | *Autrement dit* « machine à café » |
| « pixels », « AI Act » (1re apparition), « en local », « biais algorithmique » | Quatre parenthèses (+ lexique) |
| Paragraphe CNN / vision transformers / LeNet | *Autrement dit* : ce sont des « moteurs », inutile de retenir les noms |
| « Transformers », « speech-to-text / text-to-speech », « poids ouverts » | Trois parenthèses |
| Liste de 13 noms de modèles : effet catalogue | *Autrement dit* : marques et modèles de voiture, rien à mémoriser |
| Tableau prédiction : « séries temporelles », « churn », « scoring » | Trois parenthèses |
| Paragraphe régression logistique / forêts / gradient boosting | *Autrement dit* : l'arbre de décision comme questionnaire oui/non |
| « benchmark OSWorld » | Parenthèse : examen commun aux IA |
| Exercice : forme attendue floue | *Concrètement* : tableau 6 × 5, familles possibles rappelées |
| — | Encadré final *3 choses* |

### L004 — Mythes, réalités et chiffres clés
| Point bloquant | Ajout fait |
|---|---|
| « intelligence artificielle générale », « biais de carnation », « compétence C1.4 » | Trois parenthèses (+ lexique AGI) |
| Mythe 3 : avalanche de pourcentages | *Autrement dit* : l'exemple du tableur des années 1990 |
| Mythe 8 : « finalité, base légale, minimisation, information » | *Autrement dit* : la voiture empruntée au collègue |
| Tableau des 10 chiffres (Md$, score Arena, TPE/ETI, OPIIEC) | *Autrement dit* : sigles traduits, rien à apprendre par cœur |
| Section 3 : « règlement (UE) 2024/1689 », fournisseur/déployeur | *Autrement dit* : le permis pour les véhicules de société |
| « omnibus », « JOUE », « EUR-Lex consolidée », « standard de diligence », « GPAI » | Cinq parenthèses |
| Calendrier AI Act très dense | *Autrement dit* : les deux seules dates utiles pour une PME |
| Exercice : comment structurer la réponse, où trouver les chiffres | *Concrètement* : modèle de phrase, où piocher, correspondance mythe ↔ phrase D |
| — | Encadré final *3 choses* |
## M02 — Les grands modèles de langage expliqués

### L005 — Qu'est-ce qu'un LLM ?
| Point bloquant | Ajout fait |
|---|---|
| « téraoctets » (objectifs) | Parenthèse |
| « API », « cloud » (§2.3) | Deux parenthèses (+ renvoi L024) |
| Tableau des tailles : « RAM », « RTX 4090 », « cluster » | *Autrement dit* : du téléphone à la salle de serveurs |
| Formule mémoire (bits, quantifié) : décrochage assuré | *Autrement dit* : prix arrondi / photo compressée, calcul non exigé |
| Exercice de calcul : méthode absente pour un non-matheux, notation « $ / M tokens » | *Concrètement* : calcul en 3 étapes, lecture de la notation |
| — | Encadré final *3 choses* |

### L006 — Le transformer sans mathématiques
| Point bloquant | Ajout fait |
|---|---|
| « RNN, LSTM », « lecture séquentielle » | Deux parenthèses |
| « le calcul se parallélise » : saut logique | *Autrement dit* : la ligne suivie du doigt vs la page entière, les « ouvriers » |
| « arXiv », « recherche sémantique et RAG », « MLP » | Trois parenthèses (+ lexique) |
| §2.4 « distribution de probabilités / tiré au sort » abstrait | *Autrement dit* : le dé truqué à cent faces |
| « streaming » | Parenthèse |
| Exercice : risque de tout faire dans la même conversation ; « HT » ; attendu de la 3e colonne | *Concrètement* : nouvelle conversation à chaque fois, exemple de réponse |
| — | Encadré final *3 choses* |

### L007 — Pré-entraînement, fine-tuning, RLHF
| Point bloquant | Ajout fait |
|---|---|
| « Common Crawl », « déduplication » | Deux parenthèses |
| « gabarits de conversation / balises invisibles » | *Autrement dit* : le texte d'une pièce de théâtre |
| « modèle de récompense », « jailbreaks », « projets / GPT personnalisés » | Trois parenthèses |
| Exercice : comment remplir la grille, et surtout la dernière ligne (SFT / alignement / pré-entraînement) | *Concrètement* : procédure + renvoi au tableau §6 |
| — | Encadré final *3 choses* |

### L008 — Fenêtre de contexte, température, hallucinations
| Point bloquant | Ajout fait |
|---|---|
| « entre deux appels » | Parenthèse |
| Tableau des fenêtres : « Sortie max », noms de versions | *Autrement dit* : la taille du bureau |
| §1.3 : paragraphe tarifaire (cache, seuils, 5 %, 10 %) très dense ; « tronquent » | *Autrement dit* : les photocopies refaites à chaque question |
| « top-p / nucleus sampling » | *Autrement dit* : le chapeau dont on retire les papiers absurdes |
| « Modelfile », « LM Studio » | Parenthèse |
| Paragraphe « erreur 400, SDK v2, top_k » : 100 % développeur | *Autrement dit* : ce qu'il faut retenir quand on n'est pas développeur |
| « erreur 404 », « calibrés », « prémisse » | Trois parenthèses |
| Exercice : « soulignez » sur écran ? Faut-il aller sur service-public.fr ? | *Concrètement* : surligner, où chercher, forme de la demande réécrite |
| — | Encadré final *3 choses* |

### L009 — Panorama des modèles 2026
| Point bloquant | Ajout fait |
|---|---|
| « Hugging Face », « open source » | Deux parenthèses |
| Section 2 : avalanche de noms et de prix « 10 / 50 », « 100 k », « frontier » | *Autrement dit* : comment lire les prix, quoi retenir (un nom + fermé/ouvert) |
| « Apache 2.0 », « l'embarqué », « inférence régionale », « souveraineté des données », « OSI » | Cinq parenthèses |
| Tableau des licences | *Autrement dit* : la salle municipale prêtée sous conditions |
| « score Elo », « indice composite », « batch », « no-code » | Quatre parenthèses |
| Exercice exigeant (modèle + mode d'accès + coût) | *Concrètement* : démarche en 4 étapes, définitions interface / API / local, formule de coût |
| — | Encadré final *3 choses* |
## M03 — Les outils IA du quotidien

### L010 — ChatGPT : prise en main complète
| Point bloquant | Ajout fait |
|---|---|
| Noms techniques `gpt-6-astra`, `chat-latest` : l'apprenant ne sait pas quoi en faire | *Autrement dit* : noms pour informaticiens, ce qu'on voit réellement dans l'appli |
| « date de coupure », « benchmark », « quotas », « humain dans la boucle », « délégué à la protection des données » | Cinq parenthèses |
| Exercice : où sont les « instructions personnalisées » ? Que faire sans vrai e-mail client ? | *Concrètement* : chemin dans les menus, plan B, comment activer la recherche web |
| — | Encadré final *3 choses* |

### L011 — Claude : conversations, projets, artefacts, Claude Code
| Point bloquant | Ajout fait |
|---|---|
| « versionner », « CRM », « protocole MCP », « plugins », « Slack », « DM » | Six parenthèses |
| §5 Claude Code : « agent », « terminal », « VS Code, JetBrains », « script », « clé API » — mur de jargon | Cinq parenthèses |
| Blocs d'installation : comment ouvrir un terminal, quelle ligne copier, les `#` | *Concrètement* : pas-à-pas Mac / Windows, rappel abonnement payant et caractère facultatif |
| `cd mon-dossier…`, `claude`, « commit », `CLAUDE.md` | *Autrement dit* : traduction ligne par ligne, le post-it sur la chemise |
| « fichiers de production », « Pearson VUE », « page HTML », « DPE » | Quatre parenthèses |
| Exercice : où créer le projet ? Pas de charte ni de notes ? | *Concrètement* : chemin dans claude.ai, plan B, exemple de notes brutes |
| — | Encadré final *3 choses* |

### L012 — Gemini, Copilot, Grok, Le Chat
| Point bloquant | Ajout fait |
|---|---|
| Liste des fonctions Gemini (Canvas, Nano Banana, AI Studio, CLI…) | *Autrement dit* : les trois à retenir, le reste pour techniciens |
| « grounding », « SharePoint / OneDrive », « en ligne de commande » | Trois parenthèses |
| Exercice : faut-il tester les outils ? mettre des prix ? | *Concrètement* : format, sources à utiliser, règle sur les prix |
| — | Encadré final *3 choses* |

### L013 — Perplexity et la recherche augmentée
| Point bloquant | Ajout fait |
|---|---|
| « SCI », « benchmark, état de l'art, due diligence » | Deux parenthèses |
| Paragraphe « Search API, Agent API, Sonar, xhigh » : pour développeurs | *Autrement dit* : ce qu'il faut en retenir (le standard téléphonique) |
| « index Google », « web fetch », « température du réseau X » (confusion avec la température de L008) | Trois parenthèses |
| Exercice : comment « limiter aux sites officiels » ? où est la recherche approfondie ? | *Concrètement* : phrase à ajouter, où cliquer, colonnes du tableau |
| — | Encadré final *3 choses* |

### L014 — Image, vidéo, voix
| Point bloquant | Ajout fait |
|---|---|
| « modèles de diffusion » | Renvoi lexique |
| Tableau des outils d'image : « Discord », « 1K », « en local », « interface à nœuds » | *Autrement dit* : vocabulaire + conseil « commencez par ChatGPT / Gemini / Grok » |
| « 16:9 », « #2E7D32 », « storyboard », « clonage », « coût marginal nul » | Cinq parenthèses |
| Règles d'or : « marquage lisible par machine », « métadonnées », « loi SREN » | Trois parenthèses |
| Exercice en 3 livrables : avec quels outils, surtout pour la voix ? | *Concrètement* : outil par livrable, plan B, trois vérifications à cocher |
| — | Encadré final *3 choses* |
## M04 — Prompt engineering

### L015 — Anatomie d'un bon prompt
| Point bloquant | Ajout fait |
|---|---|
| « sous-spécifiée » | Parenthèse |
| « balises `<document>` » (1re apparition) | Parenthèse : les rabats d'une pochette |
| Exercice : que veut dire « surlignez les briques » ? comment comparer ? | *Concrètement* : une brique par ligne, deux conversations, anonymisation |
| — | Encadré final *3 choses* (le passage R-C-T-F-C avait déjà son *Autrement dit*) |

### L016 — Few-shot, pas à pas, décomposition
| Point bloquant | Ajout fait |
|---|---|
| « balises `<example>` », « generator-evaluator », « sorties structurées JSON » | Trois parenthèses |
| Exercice : « tâche de classification » abstrait, pas de messages sous la main | *Concrètement* : définition, 3 catégories max, partir du modèle §2.3, plan B |
| — | Encadré final *3 choses* |

### L017 — Guides officiels, balises, system prompts
| Point bloquant | Ajout fait |
|---|---|
| « JSON » dans les objectifs (expliqué seulement en §4.5) | Parenthèse + renvoi |
| Tableau comparatif (paramètres `output_config`, `strict: true`, « Markdown ») | *Autrement dit* : ce qui est pour les développeurs, ce qu'est Markdown |
| « injection de prompt », « HTML », « variables d'environnement » | Trois parenthèses |
| §4.4 prefill / température / version d'API : paragraphe développeur | *Autrement dit* : ce qu'il faut en retenir |
| Exercice : où coller le system prompt ? quelles « questions pièges » ? | *Concrètement* : 3 étapes, plan B sans projet, exemples de pièges |
| — | Encadré final *3 choses* |

### L018 — Prompts métiers
| Point bloquant | Ajout fait |
|---|---|
| « cookbook », « registre et terminologie », « document opposable », « normaliser » | Quatre parenthèses |
| Exercice : comment adapter un gabarit, anonymiser, construire la grille | *Concrètement* |
| — | Encadré final *3 choses* |

### L019 — Itérer et évaluer
| Point bloquant | Ajout fait |
|---|---|
| « LLM-as-judge », « guides de migration », « nœud d'un workflow n8n » | Trois parenthèses |
| Exercice : fiche, 6 cas, score : comment s'y prendre concrètement | *Concrètement* : où écrire, quels cas, tableau de score |
| — | Encadré final *3 choses* |

### L020 — Atelier guidé : 10 prompts
| Point bloquant | Ajout fait |
|---|---|
| « INCI » | Parenthèse |
| Exercice : barème « /5 » non défini, sens d'« archiver » | *Concrètement* : échelle 1-3-5, total /20, archivage |
| — | Encadré final *3 choses* |
| Remarque | Leçon déjà très guidée (*Autrement dit* sur l'injection de prompt présent) ; peu d'ajouts nécessaires |
## M05 — L'IA au travail

### L021 — Cas d'usage par métier
| Point bloquant | Ajout fait |
|---|---|
| « annexe III de l'AI Act » | Parenthèse |
| Tableaux métiers : « verbatims », « persona », « CSV », « KPI » | Quatre parenthèses |
| Exercice : forme de la « fiche IA dans mon métier » floue ; apprenant sans poste | *Concrètement* : structure de la page, défi « journal d'une journée », plan B |
| — | Encadré final *3 choses* (le cadre de délégation avait déjà son *Autrement dit*) |

### L022 — Productivité bureautique
| Point bloquant | Ajout fait |
|---|---|
| « ruban » (Word), « plage » (Excel) | Deux parenthèses |
| Exercice en 3 livrables / 30 min : par où commencer ? faut-il produire le PowerPoint ? | *Concrètement* : trois messages successifs dans une même conversation, plan seulement |
| — | Encadré final *3 choses* |

### L023 — Vérifier, sourcer, corriger
| Point bloquant | Ajout fait |
|---|---|
| Tableau des affaires : « mémoire », « VLT », « capitalisation d'Alphabet », « pigiste » | Quatre parenthèses |
| « agrégateur » | Parenthèse |
| Exercice très dense (5 étapes sur 4 affirmations) : peur de « ne pas trouver la bonne réponse » | *Concrètement* : découpage, tableau à 6 colonnes, « [à vérifier] » accepté, modèle de traçabilité |
| — | Encadré final *3 choses* |
## M06 — Automatisation et agents

### L024 — API, webhook, JSON
| Point bloquant | Ajout fait |
|---|---|
| « n8n, Make, Zapier », « workflow » (1re apparition) | Deux parenthèses |
| « protocole HTTP », « curl », « GitHub », « révoquer », « SIRH » | Cinq parenthèses |
| Exercice : comment dessiner le schéma ? comment « tester dans un validateur » sans savoir utiliser n8n ou un éditeur de code ? | *Concrètement* : schéma en liste fléchée, partir de l'exemple, validation via un assistant avec données fictives |
| — | Encadré final *3 choses* (leçon déjà très imagée : peu d'ajouts) |

### L025 — n8n : premier workflow
| Point bloquant | Ajout fait |
|---|---|
| « mapping », « badge Accredible », « instance » (titre de section non expliqué) | Trois parenthèses |
| « localhost », « UTC », « String », « serveur SMTP » | Quatre parenthèses |
| Nœud « racine » / « sous-nœud », « console Anthropic » | *Autrement dit* : la perceuse et le foret |
| Exercice : prérequis cachés (compte n8n, clé API payante, messagerie), durée, capture d'écran | *Concrètement* : liste du matériel, ordre, pistes, plan B |
| — | Encadré final *3 choses* |

### L026 — Qu'est-ce qu'un agent IA ?
| Point bloquant | Ajout fait |
|---|---|
| « préversion », « fonction », « tests », « infrastructure », « Linux Foundation », « patterns » | Six parenthèses |
| Exercice : faut-il écrire les outils comme `factures_en_retard()` ? où mettre les ✋ ? | *Concrètement* |
| — | Encadré final *3 choses* |

### L027 — MCP expliqué simplement
| Point bloquant | Ajout fait |
|---|---|
| « Salesforce » | Parenthèse |
| Fin du §1 : « sans état, `initialize`, Roots, Sampling, SSE » — décrochage garanti | *Autrement dit* : ce qu'il faut en retenir |
| « ERP », « OWASP Top 10 » | Deux parenthèses |
| Exercice : tableau vide à 6 colonnes, pas d'exemple de ligne hors corrigé médical | *Concrètement* : exemple de ligne « messagerie », convention de nommage |
| — | Encadré final *3 choses* |
## M07 — Éthique, droit et sécurité

### L028 — RGPD et données personnelles dans les prompts
| Point bloquant | Ajout fait |
|---|---|
| « contractualisé », « adresse IP », « RQTH » | Trois parenthèses |
| « zone d'inférence », « API de modération », « moissonnage web » | Trois parenthèses |
| Exercice : « surlignez » quoi, comment trancher, comment réécrire | *Concrètement* : code couleur, une décision + une justification, procédure de réécriture |
| — | Encadré final *3 choses* (leçon déjà très claire, avec deux *Autrement dit* existants) |

### L029 — AI Act : risques, calendrier, article 4
| Point bloquant | Ajout fait |
|---|---|
| « loi de transposition » | Parenthèse |
| Tableau de la pyramide : « notation sociale », « manipulation subliminale », « moissonnage non ciblé », « conservation des journaux » | Quatre parenthèses |
| §4 : le paragraphe sur l'article 4 et l'encadré « Mise à jour » qui suit répètent la même information (le lecteur croit avoir mal lu) | *Autrement dit* : « les deux disent la même chose ; voici l'essentiel » |
| Exercice : méthode de classement absente | *Concrètement* : descendre la pyramide en 4 questions, tableau 5 × 3, l'hésitation sur le projet 4 est admise |
| — | Encadré final *3 choses* |

### L030 — Droit d'auteur, deepfakes, biais
| Point bloquant | Ajout fait |
|---|---|
| « TDMRep, ai.txt, robots.txt » | Parenthèse |
| Liste de jurisprudences (CJUE, question préjudicielle, grande chambre) | *Autrement dit* : rien à retenir par cœur, deux définitions |
| Tableau des licences : « attribution », « -SA » | Deux parenthèses |
| « corrèlent avec » | Parenthèse |
| Exercice : forme attendue des trois réponses | *Concrètement* : trois parties, renvois aux sections, pas de génération d'image |
| — | Encadré final *3 choses* |

### L031 — Sécurité au quotidien
| Point bloquant | Ajout fait |
|---|---|
| « OWASP Top 10 » dans les objectifs (défini seulement en §3) | Parenthèse + renvoi |
| « déni de service », « rotation », « DSI », « liste blanche » | Quatre parenthèses |
| Blocs bash / Python et « .gitignore / versionner » | *Autrement dit* : ce qui peut être sauté, l'idée à retenir |
| Exercice : comment « nommer les risques », différence réaction immédiate / mesure durable | *Concrètement* : tableau 3 × 3, où trouver les codes, définitions |
| — | Encadré final *3 choses* |
