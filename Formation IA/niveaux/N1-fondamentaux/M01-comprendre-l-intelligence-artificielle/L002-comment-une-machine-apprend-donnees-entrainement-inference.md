---
id: L002
module: M01
level: N1
title: "Comment une machine apprend : données, entraînement, inférence"
minutes: 45
objectives:
  - "Expliquer le cycle données → entraînement → modèle → inférence avec une analogie et un exemple professionnel"
  - "Distinguer apprentissage supervisé, non supervisé et par renforcement à partir de la forme des données"
  - "Décrire les trois étapes de fabrication d'un grand modèle de langage (pré-entraînement, ajustement, alignement) et en déduire ses limites (date de connaissance, hallucinations, biais)"
skills: ["C1.1"]
sources:
  - { title: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", lang: "en" }
  - { title: "MIT 6.S191 — Introduction to Deep Learning (2026)", url: "https://introtodeeplearning.com/", lang: "en" }
  - { title: "3Blue1Brown — Neural Networks", url: "https://www.3blue1brown.com/topics/neural-networks", lang: "en" }
  - { title: "Hugging Face — LLM Course chapitre 1", url: "https://huggingface.co/learn/llm-course/chapter1/1", lang: "en" }
  - { title: "Claude Platform — Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows", lang: "en" }
  - { title: "Claude Platform — Pricing", url: "https://platform.claude.com/docs/en/about-claude/pricing", lang: "en" }
---

# Comment une machine apprend : données, entraînement, inférence

> ⏱ 45 min · 🎯 Niveau 1 · 📚 Module 1

## 🎯 Ce que vous saurez faire
- Raconter, étape par étape, ce qui se passe entre « on a des données » et « le modèle répond à ma question ».
- Reconnaître les trois grands modes d'apprentissage et citer un usage professionnel de chacun.
- Expliquer pourquoi un LLM a une « date de connaissance », pourquoi il peut inventer, et pourquoi poser une question coûte infiniment moins cher que fabriquer le modèle.

> 🧭 **En clair** — Une IA apprend un peu comme un apprenti cuisinier. D'abord on lui montre beaucoup de plats réussis (les **données**). Puis il s'entraîne : il goûte, compare avec le plat du chef, corrige l'assaisonnement, recommence des milliers de fois (l'**entraînement**). À la fin, il a « la main » : c'est le **modèle**. Ensuite, chaque fois qu'un client commande, il cuisine sans réapprendre (c'est l'**inférence**). Voilà pourquoi un assistant comme ChatGPT ne connaît pas l'actualité d'après sa formation, et pourquoi lui poser une question coûte presque rien alors que le former a coûté une fortune.

## 1. Le cycle en quatre temps

Quand un collègue dit « le logiciel a appris », voici ce qui s'est réellement passé. Le cycle est le même pour un détecteur de fraude bancaire et pour Claude ; seules l'échelle et les données changent.

```
   DONNÉES            ENTRAÎNEMENT              MODÈLE               INFÉRENCE
 (exemples)   ──►  (réglage des paramètres) ──► (fichier de    ──►  (utilisation :
 factures,           sur des milliers/milliards   nombres +          une question
 photos, textes      de passages                  un peu de code)    → une réponse)
      ▲                                                                   │
      └──────────────── retours d'usage, nouvelles données ◄──────────────┘
```

### 1.1 Les données : la matière première

Un modèle ne sait rien d'autre que ce que ses données lui ont montré. Pour un cabinet comptable qui veut classer automatiquement ses pièces (facture d'achat, note de frais, relevé bancaire), les données sont des milliers de documents **déjà classés par des humains**. Pour un LLM, ce sont des milliers de milliards de mots issus du web, de livres, de code.

Trois qualités comptent plus que la quantité :
- **Représentativité** : si vos exemples de notes de frais viennent tous du service commercial, le modèle se trompera sur celles des techniciens.
- **Exactitude des étiquettes** (l'étiquette, c'est la bonne réponse inscrite sur chaque exemple, par exemple « note de frais ») : une pièce mal classée dans les exemples apprend au modèle une erreur.
- **Licéité** (avoir le droit d'utiliser ces données) : données personnelles, documents sous droit d'auteur — vous y reviendrez au module 7 (RGPD, AI Act).

### 1.2 L'entraînement : régler des millions de boutons

Imaginez une table de mixage avec des millions de potentiomètres (les petits boutons qu'on tourne pour régler le son) : ce sont les **paramètres** du modèle. Au départ, ils sont réglés au hasard. On fait passer un exemple, on compare la sortie du modèle à la bonne réponse, on mesure l'écart — la **fonction de perte** (*loss*) — puis on tourne chaque bouton d'un tout petit cran dans la direction qui réduit l'écart. On recommence des millions de fois.

Cette méthode s'appelle la **descente de gradient** (*gradient descent*) ; pour les réseaux de neurones, le calcul de « dans quel sens tourner chaque bouton » s'appelle la **rétropropagation** (*backpropagation*). Image classique : vous êtes dans le brouillard sur une montagne et vous voulez descendre dans la vallée ; à chaque pas, vous tâtez le sol et vous allez dans la direction où ça descend le plus. Le MIT 6.S191 et la série vidéo de 3Blue1Brown expliquent magnifiquement cette mécanique ; nous la mettrons en équations au niveau 4.

> 💡 **Autrement dit** — Le principe tient en quatre mots : **essayer, mesurer, corriger, recommencer**. Le modèle fait une proposition, on regarde de combien il s'est trompé, on le corrige d'un tout petit peu dans le bon sens, et on recommence des millions de fois. Les noms savants (« descente de gradient », « rétropropagation ») désignent simplement la façon de calculer cette petite correction.

Deux notions pratiques à connaître dès maintenant :
- **Jeu d'entraînement / jeu de test** : on cache une partie des exemples (souvent 20 %) pour vérifier, à la fin, que le modèle se débrouille sur des cas jamais vus.
- **Sur-apprentissage** (*overfitting*) : un modèle qui a « appris par cœur » ses exemples et échoue sur les nouveaux — comme un élève qui récite le corrigé de l'an dernier. C'est le défaut numéro un des projets ML en entreprise.

> 💡 **Autrement dit** — Le **jeu de test**, c'est l'examen final avec des sujets que l'élève n'a jamais vus : on ne lui montre pas ces exemples pendant l'entraînement, pour vérifier qu'il a vraiment compris et pas seulement mémorisé. Le **sur-apprentissage**, c'est l'élève qui connaît par cœur les annales mais panique dès que l'énoncé change d'un mot.

### 1.3 Le modèle : un gros fichier de nombres

Une fois l'entraînement terminé, le modèle est… un fichier. Des milliards de nombres (les paramètres), plus un programme de quelques centaines de lignes qui sait les utiliser. Un modèle ouvert comme Gemma 4 ou Qwen3.8 (un modèle dont les paramètres sont publiés et téléchargeables gratuitement) se télécharge ainsi, et l'outil Ollama (un logiciel gratuit qui fait tourner une IA directement sur votre ordinateur) permet de l'exécuter sur un ordinateur portable (vous le ferez au niveau 2). Les paramètres de Claude ou de GPT-6, eux, ne sont pas publiés : on y accède par une application ou une API (une « prise » qui permet à un logiciel de parler à un autre logiciel ; voir le lexique et la leçon L024).

### 1.4 L'inférence : utiliser le modèle

L'**inférence** est le moment où le modèle entraîné reçoit une nouvelle entrée et produit une sortie : vous tapez une question, le LLM génère sa réponse, mot après mot — plus exactement **token après token** (un token est un morceau de mot ; voir le lexique et la leçon L005), chaque token étant choisi parmi les plus probables selon tout ce qui précède. Le modèle **n'apprend pas** pendant l'inférence : vos conversations ne modifient pas ses paramètres (sauf si l'éditeur décide, plus tard, de les réutiliser pour un nouvel entraînement — d'où les réglages de confidentialité que vous verrez au module 3).

> 💡 **À retenir** — Entraîner coûte des mois et des dizaines de millions d'euros, une seule fois ; inférer coûte quelques millièmes d'euro, des milliards de fois. C'est pourquoi un LLM a une **date de connaissance** (*knowledge cutoff*) : Claude Fable 5.1, Opus 5.5, Sonnet 5.5 et Haiku 5.5 ont par exemple une date de connaissance de juin 2026 (nov. 2026, documentation Anthropic). Tout ce qui s'est passé après, le modèle ne peut le savoir que si on le lui fournit dans la question ou par une recherche web.

> 🔗 **Documentation officielle** — [Google — Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) 🇬🇧 : les modules « Linear Regression », « Datasets, Generalization, Overfitting » et « Neural Networks » illustrent, avec des animations interactives, la descente de gradient et le sur-apprentissage.

```quiz
{
  "type": "vrai_faux",
  "q": "Vrai ou faux : pendant que vous discutez avec Claude ou ChatGPT, les paramètres du modèle restent figés : vos messages ne le rendent pas plus savant en direct.",
  "options": [
    "Vrai",
    "Faux"
  ],
  "answer": 0,
  "explanation": "Vrai. Pendant l'inférence (l'utilisation), le modèle n'apprend pas. Seul un nouvel entraînement, décidé plus tard par l'éditeur, pourrait éventuellement réutiliser vos échanges — d'où l'intérêt des réglages de confidentialité."
}
```

```quiz
{
  "q": "Un élève récite parfaitement le corrigé de l'an dernier mais échoue au nouveau sujet. Quel défaut d'un modèle d'IA cette image illustre-t-elle ?",
  "options": [
    "La date de connaissance (cutoff)",
    "L'inférence (l'utilisation du modèle)",
    "La rétropropagation (backpropagation)",
    "Le sur-apprentissage (overfitting)"
  ],
  "answer": 3,
  "explanation": "Le sur-apprentissage, c'est apprendre ses exemples par cœur au lieu de comprendre la règle générale. On le détecte grâce au jeu de test : des exemples cachés pendant l'entraînement."
}
```

## 2. Trois façons d'apprendre

La forme des données détermine le mode d'apprentissage. Ce tableau est l'un des plus utiles de tout le niveau 1 : il vous permet de comprendre instantanément de quoi parle un prestataire.

| Mode | Les données sont… | Le modèle apprend à… | Exemples professionnels |
|---|---|---|---|
| **Supervisé** (*supervised*) | Des exemples **avec la bonne réponse** (étiquette) | Prédire l'étiquette d'un nouvel exemple | Classer des pièces comptables ; prédire le délai de paiement d'un client ; détecter un défaut sur une pièce usinée ; lire une plaque d'immatriculation |
| **Non supervisé** (*unsupervised*) | Des exemples **sans réponse** | Trouver des regroupements ou des anomalies | Segmenter une base clients en profils ; repérer une transaction anormale ; regrouper des tickets de support par thème |
| **Par renforcement** (*reinforcement learning*) | Pas d'exemples : un **environnement** et des **récompenses** | Choisir des actions qui maximisent la récompense | AlphaGo ; optimisation d'un entrepôt robotisé ; réglage de la climatisation d'un data center ; et, étape finale de l'entraînement d'un LLM |

> 💡 **Autrement dit** — **Supervisé**, c'est apprendre avec le corrigé à côté de chaque exercice. **Non supervisé**, c'est recevoir une boîte de boutons en vrac et les ranger en tas qui se ressemblent, sans qu'on vous dise lesquels. **Par renforcement**, c'est la façon dont on dresse un chien : pas d'explication, mais une friandise quand il fait la bonne action. (Au passage, un *data center* est un bâtiment rempli d'ordinateurs qui font tourner les services en ligne.)

Deux sous-cas du supervisé reviennent partout : la **classification** (la réponse est une catégorie : spam / pas spam, bénin / malin) et la **régression** (la réponse est un nombre : prix, délai, chiffre d'affaires du mois prochain).

🎮 **Défi** — Une agence immobilière veut estimer le prix de vente d'un appartement à partir de la surface, de l'étage et du quartier, en s'appuyant sur 5 000 ventes passées. Supervisé ou non supervisé ? Classification ou régression ? (Réponse : supervisé, car on connaît les prix passés ; régression, car la sortie est un nombre.)

### 2.1 Mettre les mains dedans (facultatif, 5 minutes)

Aucun prérequis en programmation n'est demandé à ce niveau, mais rien ne vaut un modèle qui apprend sous vos yeux. Le programme ci-dessous entraîne le modèle le plus simple qui soit — un seul paramètre — à retrouver le prix au kilo d'un produit à partir de tickets de caisse. Vous pouvez le coller dans n'importe quel interpréteur Python 3.12 en ligne et observer le paramètre converger.

**Concrètement :** tapez « exécuter Python en ligne » dans votre moteur de recherche, ouvrez l'un des sites proposés, effacez le code d'exemple qu'il affiche, collez le programme ci-dessous, puis cliquez sur le bouton « Run » (« Exécuter »). Des lignes de résultats s'affichent : c'est tout. « Converger » veut simplement dire que le chiffre se rapproche petit à petit de la bonne valeur (4,20). Si cela vous paraît trop technique, sautez ce passage : il est facultatif et rien dans la suite n'en dépend.

```python
# Un modèle à UN paramètre apprend le prix au kilo à partir de tickets de caisse.
# Vrai prix : 4,20 €/kg. Le modèle part d'une valeur au hasard et se corrige.

tickets = [(0.5, 2.10), (1.0, 4.20), (2.0, 8.40), (1.5, 6.30)]  # (poids en kg, prix payé en €)
prix_kilo = 10.0      # paramètre initial (faux exprès)
pas = 0.05            # taille de chaque "cran" de correction (learning rate)

for epoque in range(1, 31):                    # 30 passages sur les données
    perte_totale = 0.0
    for poids, prix_reel in tickets:
        prediction = prix_kilo * poids         # inférence : le modèle propose un prix
        erreur = prediction - prix_reel        # écart avec la réalité
        perte_totale += erreur ** 2            # fonction de perte (erreur au carré)
        prix_kilo -= pas * 2 * erreur * poids  # descente de gradient : on tourne le bouton
    if epoque % 5 == 0:
        print(f"époque {epoque:2d} : prix/kg estimé = {prix_kilo:.3f} € · perte = {perte_totale:.4f}")

print(f"\nPrédiction pour 3 kg : {prix_kilo * 3:.2f} €")   # inférence sur un cas jamais vu
```

Ce que vous observez : la perte diminue à chaque époque (une époque = un passage complet sur tous les exemples), le paramètre se rapproche de 4,20, et le modèle prédit correctement un cas qu'il n'a jamais vu (3 kg). Un LLM fait exactement cela, avec des centaines de milliards de boutons et des milliers de milliards de tokens.

```quiz
{
  "type": "mise_en_situation",
  "q": "Une enseigne veut regrouper ses 50 000 clients en « profils » ressemblants, sans avoir défini les groupes à l'avance. Quel mode d'apprentissage convient ?",
  "options": [
    "Supervisé, car on connaît la bonne réponse",
    "Non supervisé, car il n'y a pas d'étiquettes",
    "Par renforcement, car on donne des récompenses",
    "Aucun : il faut écrire des règles à la main"
  ],
  "answer": 1,
  "explanation": "Aucune « bonne réponse » n'est fournie : on demande à la machine de trouver elle-même des ressemblances. C'est l'apprentissage non supervisé (regroupement ou clustering)."
}
```

## 3. Cas particulier : comment on fabrique un LLM

Un grand modèle de langage s'entraîne en trois étapes, que le cours Hugging Face et la conférence d'Andrej Karpathy *Intro to Large Language Models* décrivent en détail.

1. **Pré-entraînement** (*pre-training*) — Le modèle lit une portion gigantesque du web et apprend une seule chose : **prédire le token suivant**. C'est de l'apprentissage auto-supervisé : les étiquettes sont fournies par le texte lui-même (le mot suivant est connu). Coût : des mois sur des dizaines de milliers de GPU. Résultat : un modèle « de base » qui complète du texte mais ne sait pas tenir une conversation.
2. **Ajustement supervisé** (*supervised fine-tuning*, SFT) — Des annotateurs rédigent (des personnes payées pour écrire ou noter des exemples) des milliers d'exemples de dialogues idéaux (question → bonne réponse). Le modèle apprend le format « assistant ».
3. **Alignement par retours humains** (RLHF, *reinforcement learning from human feedback*, ou variantes comme DPO) — DPO est une autre méthode du même genre, inutile à retenir ici — Des humains comparent des réponses ; le modèle apprend par renforcement à préférer celles jugées utiles, honnêtes et sûres. C'est ici que se règlent le ton, les refus et une partie de la prudence du modèle.

> 💡 **Autrement dit** — Fabriquer un assistant, c'est comme former un nouveau collaborateur en trois temps. 1) Il **lit toute une bibliothèque** pour se cultiver (pré-entraînement). 2) Il **observe un tuteur** qui lui montre comment répondre poliment et utilement (ajustement supervisé). 3) Il reçoit des **retours clients** — « cette réponse-ci est meilleure que celle-là » — et ajuste son comportement (RLHF).

```mermaid
flowchart LR
  A["📚 Pré-entraînement<br/>lire des milliers de milliards de mots"] --> B["🧑‍🏫 Ajustement supervisé<br/>imiter des dialogues modèles"]
  B --> C["👍👎 Retours humains (RLHF)<br/>préférer les réponses utiles et sûres"]
  C --> D["🤖 Assistant prêt à l'emploi"]
```

Trois conséquences directes pour vous, utilisateur :

| Propriété du LLM | Cause dans l'entraînement | Conséquence pratique |
|---|---|---|
| **Date de connaissance** | Le pré-entraînement s'arrête à une date | Vérifiez les faits récents ; donnez le contexte dans votre prompt |
| **Hallucinations** (affirmations fausses mais plausibles) | Le modèle optimise la *plausibilité* du token suivant, pas la *vérité* | Exigez des sources, recoupez (module 5) |
| **Biais** | Les données du web reflètent les stéréotypes de leurs auteurs ; l'alignement les corrige partiellement | Relisez d'un œil critique les textes RH, marketing, juridiques |

> ⚠️ **Piège fréquent** — Croire qu'un LLM « cherche dans une base de données » quand il répond. Non : il génère. Si un modèle vous cite un article de loi avec un numéro précis, le numéro a été produit token par token parce qu'il « sonnait juste ». Vous apprendrez au module 2 ce qu'est la **fenêtre de contexte** (la quantité de texte que l'IA peut avoir sous les yeux en même temps) (jusqu'à 1 million de tokens pour les modèles Claude actuels, nov. 2026) et comment y placer les documents de référence pour ancrer les réponses.

> 🔗 **Documentation officielle** — [Claude Platform — Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) 🇬🇧 explique ce que le modèle « voit » à l'inférence ; [Claude Platform — Pricing](https://platform.claude.com/docs/en/about-claude/pricing) 🇬🇧 montre que l'inférence se facture au million de tokens (Haiku 5.5 dès 0,10 $ par million de tokens en entrée (« en entrée » = le texte que vous envoyez ; « en sortie » = le texte que l'IA vous renvoie), Fable 5.1 à 10 $ — nov. 2026), ce qui rend concrète la différence entraînement / inférence.

## 4. Ce que cela change dans un projet d'entreprise

Une PME qui lance un projet d'IA se pose rarement les bonnes questions au début. Les voici, dans l'ordre :

1. **Ai-je des données ?** Combien d'exemples, avec quelles étiquettes, à quel niveau de qualité ? Sans données, pas de ML — mais un LLM généraliste peut souvent dépanner sans entraînement (c'est tout l'intérêt des modèles de fondation).
2. **Dois-je entraîner ou utiliser ?** Dans 90 % des cas d'usage bureautiques, on **utilise** un modèle existant (inférence via ChatGPT, Claude, Gemini, Mistral) avec un bon prompt et les bons documents. L'entraînement ou l'ajustement (*fine-tuning*) est réservé aux besoins très spécifiques (niveau 4).
3. **Comment mesurer que ça marche ?** Un jeu de test, des critères chiffrés, une relecture humaine. Un modèle « qui a l'air bien » n'est pas un modèle validé.
4. **Comment ça vieillit ?** Les données changent (nouveaux produits, nouvelles règles) : prévoyez le réentraînement ou la mise à jour des documents fournis au modèle.

> 💡 **À retenir** — Le cycle complet : données de qualité → entraînement (réglage des paramètres par descente de gradient) → modèle (un fichier de nombres) → inférence (une réponse par requête, sans apprentissage). Un LLM ajoute trois étapes (pré-entraînement, SFT, RLHF) qui expliquent ses forces et ses trois limites : date de connaissance, hallucinations, biais.

```mission
{
  "title": "Combien coûte une réponse de Claude Haiku 5.5 ?",
  "url": "https://platform.claude.com/docs/en/about-claude/pricing",
  "steps": ["Ouvrez la page Pricing de la documentation Claude", "Repérez le tableau des prix des modèles", "Trouvez la ligne Claude Haiku 5.5 et lisez la colonne des tokens de sortie (output)"],
  "question": "Combien coûte un million de tokens générés (en sortie) par Claude Haiku 5.5 ?",
  "hint": "La leçon donne déjà le prix en entrée (0,10 $) ; cherchez la colonne voisine. Un million de tokens, c'est l'équivalent de plusieurs romans.",
  "answer": "0,50 $ par million de tokens de sortie (nov. 2026) — vérifiez : les prix évoluent (vérifié le 5 nov. 2026).",
  "xp": 15
}
```

```mission
{
  "title": "Explorez le Machine Learning Crash Course de Google",
  "url": "https://developers.google.com/machine-learning/crash-course",
  "steps": ["Ouvrez la page d'accueil du Machine Learning Crash Course", "Faites défiler la liste des modules", "Comptez-les et repérez celui qui parle d'overfitting"],
  "question": "Combien de modules compte le cours, et dans quel module retrouvez-vous la notion de sur-apprentissage (overfitting) ?",
  "hint": "Le module à chercher s'intitule « Datasets, Generalization, Overfitting ».",
  "answer": "12 modules, de la régression linéaire jusqu'aux LLM et à la production ; l'overfitting est traité dans « Datasets, Generalization, Overfitting » (état au 1er nov. 2026).",
  "xp": 10
}
```

## 🧪 Exercice pratique

**Consigne.** Vous êtes responsable du service client d'un distributeur de fournitures de bureau qui reçoit 400 e-mails par jour. La direction veut « mettre de l'IA » pour trier automatiquement les demandes (commande, réclamation, facturation, autre) et proposer un brouillon de réponse.

Rédigez une fiche d'une page qui répond aux questions suivantes :
1. Pour le **tri** : quel mode d'apprentissage ? De quelles données avez-vous besoin, et combien, à votre avis ? Qui les étiquette ?
2. Pour le **brouillon de réponse** : faut-il entraîner un modèle ou utiliser un LLM existant ? Justifiez avec la notion d'inférence.
3. Citez deux risques liés aux limites des LLM vues en section 3 et la parade pour chacun.
4. Proposez un indicateur chiffré pour décider, après un mois de test, si le système est validé.

**Concrètement :** un document Word ou une feuille manuscrite, avec quatre paragraphes numérotés de 1 à 4 (5 à 10 lignes chacun). Vous n'avez rien à programmer ni à tester : on vous demande seulement de raisonner avec les mots de la leçon (supervisé, inférence, hallucination…). Pour la question 4, un « indicateur chiffré » est un nombre qu'on peut mesurer, par exemple « 9 e-mails sur 10 bien classés ».

**Critères de réussite.**
- Le tri est identifié comme de la classification supervisée, avec des e-mails historiques étiquetés par l'équipe.
- Le brouillon repose sur l'inférence d'un LLM existant (pas d'entraînement), avec les informations client fournies dans le prompt.
- Les risques cités (hallucination d'un délai de livraison, réponse datée, ton inadapté) sont associés à une parade (relecture humaine, données à jour dans le prompt, consignes de ton).
- L'indicateur est mesurable (taux de bon classement sur un échantillon relu, temps moyen de réponse, taux de brouillons envoyés sans modification).

<details>
<summary>Pistes de corrigé</summary>

1. Classification supervisée. Quelques centaines à quelques milliers d'e-mails des douze derniers mois, étiquetés par les conseillers (une après-midi d'équipe suffit souvent pour 1 000 e-mails). Prévoir un jeu de test de 20 % jamais montré au modèle. Variante 2026 : un LLM peut classer sans entraînement à partir d'une consigne ; on compare les deux approches sur le même jeu de test.
2. Utiliser un LLM existant : l'inférence coûte quelques centimes par e-mail, aucune donnée d'entraînement n'est nécessaire ; on fournit dans le prompt l'historique du client et la politique commerciale.
3. Hallucination d'une date de livraison → le brouillon ne part jamais sans validation humaine, et les données de commande sont injectées dans le prompt. Date de connaissance → les conditions générales à jour sont fournies au modèle, pas supposées connues.
4. Exemple : ≥ 90 % de bon classement sur 200 e-mails relus ; ≥ 60 % de brouillons envoyés avec moins de deux corrections.

</details>

## ✅ Auto-évaluation express

1. Pendant que vous discutez avec un assistant IA, ses paramètres changent-ils ?
2. Quel mode d'apprentissage utilise-t-on quand on ne dispose d'aucune étiquette et qu'on cherche des groupes de clients similaires ?
3. Pourquoi un LLM peut-il affirmer avec assurance une chose fausse ?

<details>
<summary>Réponses</summary>

1. Non : l'inférence n'entraîne pas le modèle ; les paramètres sont figés depuis la fin de l'entraînement.
2. L'apprentissage non supervisé (regroupement, *clustering*).
3. Parce qu'il a été entraîné à produire le token suivant le plus plausible, pas à vérifier la vérité ; l'alignement réduit le phénomène sans le supprimer.

</details>

> ✅ **Si vous ne retenez que 3 choses** — 1. Le cycle d'une IA : des données, un entraînement (on corrige des millions de petits réglages), un modèle (un gros fichier de nombres), puis l'inférence (l'utilisation au quotidien). 2. Pendant que vous lui parlez, l'IA n'apprend pas : elle a une date de connaissance et ignore ce qui s'est passé après, sauf si vous le lui fournissez. 3. Un LLM produit ce qui est plausible, pas ce qui est vrai : il peut inventer un chiffre ou un article de loi, donc on vérifie.

## 📚 Pour aller plus loin
- [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks) 🇬🇧 — les chapitres 1 à 4 montrent visuellement la descente de gradient et la rétropropagation ; les chapitres 5 à 7 expliquent le Transformer et les LLM.
- [Hugging Face — LLM Course, chapitre 1](https://huggingface.co/learn/llm-course/chapter1/1) 🇬🇧 — cours gratuit (licence Apache 2.0) : comment fonctionnent les Transformers, biais et limites.
- [Andrej Karpathy — Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) 🇬🇧 — conférence d'une heure : « un LLM, c'est deux fichiers », pré-entraînement, ajustement, sécurité.
- [MIT 6.S191 — Introduction to Deep Learning](https://introtodeeplearning.com/) 🇬🇧 — séance 1 (perceptron, perte, descente de gradient) pour celles et ceux qui veulent déjà entrevoir le niveau 4.

> 🗺️ **Et maintenant ?** — Vous savez comment une machine apprend ; la leçon L003 fait le tour des grandes familles d'IA (vision, langage, recommandation, prédiction) que l'on rencontre au quotidien.
