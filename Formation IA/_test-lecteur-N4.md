# Test lecteur — Niveau 4 « Expert » (L111 à L150)

> Relecture menée le 5 novembre 2026 dans la peau d'un **développeur expérimenté dont les mathématiques s'arrêtent au lycée** : à l'aise en Python, en Git et en ligne de commande, mais sans souvenir des dérivées partielles, des matrices ni des probabilités conditionnelles, et n'ayant jamais utilisé PyTorch. Objectif : répondre à la demande du client d'une formation « simplifiée et vulgarisée au maximum », y compris au niveau expert.

## 1. Méthode

- Les 40 leçons du niveau 4 (`niveaux/N4-expert/M24` à `M30`) ont été lues dans l'ordre du parcours, sans les blocs quiz et mission. L111 à L129 (mathématiques, ML et deep learning) ont été lues intégralement. L130 à L150 ont été lues en vue condensée : chaque ligne de prose tronquée vers 200 à 500 caractères, formules, tableaux et code complets. Les paragraphes tronqués qui portaient un calcul ont été relus en entier (L130 §5, L145 §2, notamment).
- Pour chaque leçon, quatre types d'obstacles ont été relevés :
  - les notations non expliquées à leur première apparition dans la leçon (Σ, ∏, ∂, ∇, ⊤, ‖·‖, 𝔼, argmax, ∝, ∈ ℝⁿ, x⁽ⁱ⁾, ⌈·⌉, ⌊·⌋, θ, η, λ, σ…) ;
  - les formules clés sans exemple chiffré ;
  - le code NumPy ou PyTorch qui suppose les formes de tenseurs connues ;
  - les sauts logiques et les ordres de grandeur peu intuitifs.
- Les améliorations sont **strictement additives**. Ce sont des encadrés en citation Markdown, insérés après un paragraphe, un tableau ou un bloc de code, jamais au milieu :
  - `> 🧭 **Pré-requis express** — …` : la notation dite en mots, plus un mini-exemple chiffré. Il n'est ajouté que si aucune explication équivalente n'existait (« 🧠 L'intuition d'abord », « 💡 Autrement dit »). Une notation déjà expliquée dans une leçon précédente l'est de nouveau brièvement, avec un renvoi, à sa première apparition dans chaque leçon.
  - `> 🔢 **Exemple à la main** — …` : petits nombres, calcul détaillé étape par étape et résultat.
  - `> 🔍 **Ce que fait ce code, ligne par ligne** — …` : rôle des lignes clés et **forme de chaque tenseur** (`(B, T, d)`…).
  - `> ✅ **Si vous ne retenez que 3 choses** — 1. … 2. … 3. …` : en fin de leçon, juste avant « 🗺️ Et maintenant ? ». Aucune leçon n'en avait.
- **Calculs vérifiés** : chaque chiffre des 122 « Exemple à la main » a été recalculé par un script Python exécuté (NumPy, scikit-learn 1.9, bibliothèque standard ; 17 scripts, tous passent). Les scripts originaux suivants ont aussi été exécutés pour citer leurs sorties réelles :
  - L111 : cosinus ;
  - L117 : meilleure coupure de Gini ;
  - L119 : fuite par sélection de variables ;
  - L141 : erreurs de quantization ;
  - L143 : dimensionnement ;
  - L144 : PSI ;
  - L148 : garde de politique et journal chaîné.

  PyTorch n'est pas installé : les formes annoncées pour le code `torch` ont été dérivées à la main, puis recoupées avec les décomptes de paramètres recalculés en Python.
- **Contrôles automatiques** (copie des 40 fichiers d'origine dans le dossier de travail `lecteur-n4/orig/`) :
  - le texte d'origine reste une **sous-séquence exacte** du nouveau texte, ligne à ligne ;
  - toutes les lignes ajoutées sont des lignes d'encadré (`>`) ou des lignes vides ;
  - l'en-tête YAML et **tous** les blocs ``` (quiz, mission, code, mermaid) sont identiques à l'original.

  Les insertions sont rejouables depuis les fichiers `specs/Lxxx.py`, en ancrant chaque encadré sur un numéro de ligne d'origine dont le début est vérifié.

## 2. Chiffres clés

| Indicateur | Valeur |
|---|---|
| Leçons relues et enrichies | 40 / 40 |
| Encadrés « 🧭 Pré-requis express » | 57 |
| Encadrés « 🔢 Exemple à la main » | 122 (tous recalculés par script) |
| Encadrés « 🔍 Ce que fait ce code, ligne par ligne » | 82 |
| Encadrés « ✅ Si vous ne retenez que 3 choses » | 40 (aucune leçon n'en avait) |
| Total d'encadrés ajoutés | 301 |
| Volume des 40 fichiers | 164 043 → 197 066 mots (+33 023, soit +20 %) |
| Phrases existantes supprimées ou réécrites | 0 |
| En-têtes YAML, blocs quiz / mission / code modifiés | 0 |
| Résultat de `node scripts/validate.mjs` | ✅ Aucune erreur bloquante (184/184 leçons, 582 633 mots, 770 questions, 794 URLs) ; aucun avertissement sur L111 à L150 |

Répartition : M24 (mathématiques) concentre 28 « Pré-requis » et 30 « Exemples ». À partir de M28, les leçons sont surtout outillage, sécurité et gouvernance : les ajouts y portent sur le code, les calculs de coûts et de mémoire, et le récapitulatif final.

## 3. Constats transversaux (ce qui bloquait ce profil d'apprenant)

1. **Les symboles sont posés avant d'être lus.** Les encadrés « 🧠 L'intuition d'abord » et « 💡 Autrement dit » de M24 à M26 sont excellents sur le *sens*, mais ne disent presque jamais *comment lire* le symbole : Σ comme une boucle `for`, ∈ ℝ^{m×n} comme une forme `(m, n)`, ∂f/∂x comme « les autres variables gelées », x⁽ⁱ⁾ qui n'est pas une puissance, β₁ᵗ qui en est une, ⌈·⌉ et ⌊·⌋. Pour ce profil, c'était le premier mur. Il est traité par les « Pré-requis express », chacun avec sa traduction Python (`sum(...)`, `x[0]`, `A.shape`, `t // s`).
2. **Une même lettre change de sens d'une section ou d'une leçon à l'autre**, sans avertissement. Les encadrés le signalent explicitement :
   - Σ est une somme (L111 §2), la matrice de la SVD (L111 §6), puis la covariance (L118) ;
   - λ est une valeur propre, puis un coefficient de weight decay (L114, L116) ;
   - T est une température, puis un nombre de tokens (L113) ;
   - ‖ est une norme, puis un séparateur dans D_KL(p ‖ q) (L113, L133) ;
   - σ désigne la sigmoïde ou un écart-type.
3. **Beaucoup de formules clés n'avaient pas d'exemple chiffré**, alors que les sections « exemple numérique » existantes (neurone de L112, tableau KL de L113, Gini de L117 en corrigé, attention de L128 en code) montrent que l'approche fonctionne. Les formules restées sans exemple sont désormais calculées à la main sur 2 à 4 valeurs : produit scalaire et cosinus, softmax, attention, dérivée partielle, jacobienne, gradient d'une couche, Bayes, MLE, BCE, Gini et gain, variance du bagging, Adam au premier pas, BatchNorm, RoPE, RMSNorm, LoRA, DPO, GRPO, quantization INT4, KV cache, décodage spéculatif, PSI, Elo, intervalle de Wilson.
4. **Le code PyTorch et NumPy suppose les formes connues.** C'était le second mur pour ce profil, qui n'a jamais vu `view(B, T, h, d_k).transpose(1, 2)`, `keepdims=True`, `axis=0` ou `reshape(-1, 1)`, ni les indexations du type `P[np.arange(B), y]` et `x[:, None, :] - c[None, :, :]`. Les 82 encadrés « ligne par ligne » donnent la forme de chaque tenseur à chaque étape. Ils expliquent aussi les conventions de PyTorch : tiret bas « sur place », `requires_grad`, `.item()`, `dim=-1`, `batch_first`.
5. **Les décomptes de paramètres et de mémoire sont annoncés sans le détail.** Les chiffres « 0,8 M », « 50 378 », « 288 746 », « 196 736 », « 109 386 », « 128 Go », « 56 Go », « 1,2 Go de KV », « 4,9 Go en Q4_K_M » sont désormais décomposés terme à terme. Tous ont été recalculés et concordent avec le texte.
6. **Ordres de grandeur contre-intuitifs** : chaque fois, une petite échelle de comparaison a été ajoutée.
   - Exposant 0,076 d'une loi de puissance : il faut environ 9 000 fois plus de paramètres pour diviser l'écart par 2.
   - 0,9⁵⁰ ≈ 0,005 : évanouissement du gradient sur 50 pas.
   - Intervalle d'incertitude d'un score sur 50 cas : ± 11 points.
   - Perte de 87 : le bon caractère reçoit une probabilité d'environ 10⁻³⁸.
   - Génération limitée par la bande passante plutôt que par les TOPS.
7. **Pas de synthèse finale par leçon.** Les 40 encadrés « ✅ Si vous ne retenez que 3 choses » donnent un point d'arrêt clair, essentiel sur des leçons de 4 000 à 8 000 mots.

## 4. Points de vigilance (non corrigés, hors périmètre)

- **Rendu dans l'application** : `app/src/lib/callouts.ts` reconnaît `🧭 **Pré-requis express**` (style « prereq »), `🔍 **Ce que fait ce code, ligne par ligne**` (style « code ») et `✅ **Si vous ne retenez que 3 choses**` (style « recap »). En revanche, **`🔢 **Exemple à la main**` n'est pas reconnu** : il s'affiche comme une citation ordinaire, sans en-tête ni icône. Le format imposé a été respecté et l'application n'a pas été modifiée. Une ligne `if (emoji === "🔢" && l.startsWith("exemple a la main")) …` dans `calloutFromLabel`, avec un style dédié, suffirait. Les encadrés « 🧠 L'intuition d'abord » d'origine ne sont pas reconnus non plus.
- **Dollars et formules** : `app/src/lib/lesson-text.ts` échappe tout « chiffre + espace + `$` » pour protéger les prix, même quand ce `$` ouvre une formule (« F1 $= …$ », « l'expert 2 $(0, 4)$ »). Les six cas de ce type présents dans mes encadrés ont été réécrits (L112, L115, L134, L136, L139, L143) ; un contrôle par script ne trouve plus aucun conflit dans le texte ajouté. Le texte d'origine n'en contient pas : les quatre signalements du contrôle sont de vrais prix.
- **Export Next Formation** : `export/elearning-modules.json` n'a pas été régénéré (`scripts/build.mjs` non lancé) ; il reflète encore les leçons d'avant l'enrichissement.
- **Trois observations sur le contenu d'origine** (rien n'a été modifié) :
  - **L136 §1** : la phrase « Pour un modèle de 8 milliards de paramètres : » se termine par deux-points, mais le calcul annoncé manque (une ligne ou un tableau a probablement disparu). L'encadré « Exemple à la main » ajouté juste après comble le trou (8 × 10⁹ × 16 octets ≈ 128 Go). La source mériterait d'être revue.
  - **L137, fonction `empreinte`** : la docstring annonce une normalisation de « casse, ponctuation, chiffres ». Mais la suppression des chiffres laisse deux espaces consécutives : « Où est ma commande 4512 ? » et « Où est ma commande ? » n'obtiennent donc pas la même empreinte (vérifié par script). L'encadré ajouté le signale. Une correction possible serait `re.sub(r"\s+", " ", norm).strip()` avant le hachage.
  - **L111, code du cosinus** : le commentaire `# ≈ 0.11` pour facture/chaton correspond à une sortie réelle de 0,116 (soit 0,12 à deux décimales). L'encadré ajouté donne la valeur exacte.
- **Hypothèses chiffrées introduites par les encadrés**, toutes signalées comme telles dans le texte : le coût horaire d'expert de 50 € (L135), les taux de réussite fictifs de la grille pondérée (L140), les scores fictifs du projet final (L150) et l'exemple de complaisance (L146).
- **Volume** : +20 % de mots en moyenne, jusqu'à +41 % sur L111 et +39 % sur L113. Les encadrés sont regroupés et typés, donc faciles à replier ou à masquer si l'application le permet. Mais la durée annoncée des leçons de M24 (70-80 min) devient optimiste pour ce profil d'apprenant.

## 5. Détail par leçon

Légende : P = Pré-requis express, E = Exemple à la main, C = Ce que fait ce code (+ 1 « 3 choses » partout).

### Module 24 — Mathématiques pour l'IA

**L111 — Algèbre linéaire** · P7 E5 C5 · 5 652 → 7 959 mots
- Notations relevées : x ∈ ℝⁿ et x_i (indices décalés par rapport à Python), Σ et ⊤, ‖x‖₂ / ‖x‖₁, ℝ^{m×n} et A_ij, A⁻¹, det, O(n³), softmax et eˣ, √d_k, Σ réutilisé pour la SVD, σ_i, ≪.
- Exemples ajoutés : produit scalaire et cosinus de (3, 4)·(4, 3), transposée et déterminant, one-hot × E, mini-couche y = Wx + b, attention complète à 2 tokens (73 % / 27 %).
- Code : formes de toutes les étapes de l'attention NumPy et de la SVD tronquée.

**L112 — Dérivées et gradients** · P7 E7 C4 · 5 133 → 7 184
- Notations relevées : f′(x) et lim, ln, σ, tanh, max ; ∂ (« d rond ») et ⇒ ; dy/dx et composition ; η et ← ; f : ℝⁿ → ℝᵐ, ⋯ ⋮ ⋱ ; ∘ et les accolades \underbrace ; δ et Δ.
- Exemples ajoutés : pente de x² en 3 (6,001 → 6), dérivée numérique, ∇f(1, 2) = (4, 4) vérifié à la main, règle de la chaîne sur 9x², addition sur deux chemins, jacobienne 2 × 2, δxᵀ et Wᵀδ.
- Code : formes du MLP NumPy (`(5, 3)` → `(5, 4)` → `(5, 1)`) ; premier contact avec `torch.tensor`, `requires_grad`, `backward`, `gradcheck` ; fonctionnement de la classe `Valeur`.

**L113 — Probabilités et statistiques** · P9 E9 C2 · 4 941 → 6 887
- Notations relevées : p(a | b), P(X = x), ∫, 𝔼, ∝, P(A | B) et ∩, {0, 1}, π_k, μ, σ², 𝓛 et p̂, θ dans p_θ, log₂, ‖ dans D_KL, T → ∞, T employé comme nombre de tokens.
- Exemples ajoutés : probabilité d'une phrase, dé (𝔼 = 3,5, Var ≈ 2,92), variance d'un neurone, gaussienne en 0, 1 et 2, log-vraisemblance pour p = 0,06 / 0,5 / 0,10, H(p, q) terme à terme, softmax à T = 1, perplexité 4, log-sum-exp, top-k / top-p.
- Code : `argsort`, `cumsum`, `searchsorted`, `np.where`, `F.cross_entropy` avec ses formes `(N, K)` / `(N,)`.

**L114 — Descente de gradient** · P5 E9 C4 · 5 251 → 7 069
- Notations relevées : θ_t et θ_{t+1}, ∀ et [0, 1], hessienne et « semi-définie positive », β₁ᵗ (une puissance), ε, ⌊·⌋, γ, 3e-4.
- Exemples ajoutés : deux pas sur x², pas maximal 2/λ_max et κ = 50, nombre de pas par époque, momentum constant / alterné, premier pas d'Adam (invariance d'échelle), 56 Go d'état d'Adam, weight decay par pas, valeurs du cosinus (dont le point à 6 000 pas du graphique), écrêtage de (3, 4).
- Code : sorties réelles de la boucle η (notation `5.765e-02`), formes du SGD mini-batch, état des optimiseurs, `squeeze(-1)` et `p.ndim`.

### Module 25 — Machine learning

**L115 — Régressions linéaire et logistique** · P5 E8 C2 · 4 240 → 5 596
- Notations relevées : ŷ et h_θ, x⁽ⁱ⁾ (qui n'est pas une puissance), ε ∼ 𝒩, α comme taux d'apprentissage, ]0, 1[, argmax, |·| et ȳ.
- Exemples ajoutés : coût J sur deux voitures, gradients qui diffèrent d'un facteur 250 000 (motivation de la normalisation), dé-normalisation complète, sigmoïde en −2 / 0 / 2, BCE, gradient Xᵀ(p̂ − y), MAE / RMSE / R², précision / rappel / F1.
- Code : formes du pipeline Wine (`(178, 13)` → `(124, 14)` → `(54, 3)`).

**L116 — Biais-variance, régularisation, validation croisée** · P4 E4 C3 · 3 982 → 5 102
- Notations relevées : f̂_D et 𝔼_D, ‖·‖₂², θ*, argmax_θ, τ, i.i.d.
- Exemples ajoutés : décomposition 9 + 1 + 4 = 14, Ridge en une dimension (pente rabotée de 2 à 1), pourquoi le Lasso annule (0,01 contre 0,1), plis de 442 patients.
- Code : `reshape(-1, 1)`, `preds.mean(axis=0)`, `[-1].coef_`, `logspace`, nommage `etape__param`.

**L117 — Arbres, forêts, boosting** · P1 E5 C3 · 4 084 → 5 194
- Exemples ajoutés : Gini et entropie d'un nœud 6/4 ; meilleure coupure à 6 mois (gain 0,227, identique à la sortie du script exécuté) ; variance du bagging selon ρ ; origine des 63 % / 37 % (1/e) ; F₀ + η·h₁ sur trois maisons.
- Pré-requis : pseudo-résidu « évalué en ».

**L118 — k-means, PCA** · P3 E3 C3 · 4 241 → 5 314
- Notations relevées : c⁽ⁱ⁾ et μ_{c⁽ⁱ⁾}, argmin et |C_j|, Σ comme covariance et m − 1, S à la place de Σ dans la SVD.
- Exemples ajoutés : itérations de Lloyd sur 1, 2, 9, 10 ; silhouette ; covariance et valeurs propres d'un nuage de 4 points (98 % de variance sur un axe).
- Code : diffusion `X[:, None, :] - centers[None, :, :]` → `(900, 3, 3)`.

**L119 — scikit-learn en pratique** · E2 C3 · 3 824 → 4 505
- Exemples ajoutés : coût combinatoire d'une grille ; pourquoi la fuite marche sur du bruit (corrélations dues au hasard de 0,20 à 0,30 ; sorties réelles 0,79 contre 0,51).
- Code : `ColumnTransformer`, `OneHotEncoder` (colonnes produites), grille de deux sous-grilles (40 entraînements), transformateur maison.

**L120 — Projet ML** · E3 C2 · 4 444 → 5 100
- Exemples ajoutés : écart standardisé réel de « worst perimeter » (1,62) ; découpage 455 / 114 et 15 entraînements ; poids d'un patient dans le rappel (2,4 points, l'objectif de 0,98 exigeant 42/42).
- Code : EDA pandas (`np.triu`, `.stack()`) ; script complet (prédictions hors pli, `ravel` de la matrice de confusion, bootstrap).

### Module 26 — Deep learning

**L121 — Perceptron et MLP** · P2 E3 C2 · 5 056 → 5 978
- Notations relevées : « sur un compact », fonction affine, Φ de GELU.
- Exemples ajoutés : perceptron ET, une correction de Rosenblatt, softmax / entropie croisée / gradient P − Y.
- Code : formes du MLP NumPy, astuce `np.eye(2)[y]`.

**L122 — Rétropropagation (micrograd)** · E3 C4 · 4 826 → 5 825
- Exemples ajoutés : division obtenue sans dérivée écrite (a/b = a·b⁻¹), perte hinge, somme du gradient d'un biais diffusé.
- Code : moteur `Valeur` (surcharge d'opérateurs, closures, tri topologique itératif), boucle d'entraînement, `Tenseur` (`_reduire`, indexation `P[np.arange(B), y]`), comparaison à PyTorch.

**L123 — PyTorch** · E1 C5 · 3 880 → 4 727
- Leçon clé pour ce profil.
- Code : création et formes des tenseurs, `view` / `reshape(-1)` / `unsqueeze`, diffusion illustrée, mémoire partagée avec NumPy, autograd et accumulation (6 + 6 = 12), `nn.Module` (formes de `(32, 1, 28, 28)` à `(32, 10)`), `Dataset` / `DataLoader`, script Fashion-MNIST (430 lots, 235 146 paramètres).
- Exemple ajouté : décompte des 109 386 paramètres.

**L124 — CNN** · P1 E3 C4 · 4 344 → 5 402
- Pré-requis : double Σ comme boucles imbriquées, C_in / C_out.
- Exemples ajoutés : Sobel sur une fenêtre (= 4), formule de taille (28 / 26 / 14) et 320 paramètres, pooling.
- Code : formes du `PetitCNN` (3 136 entrées, +192 de BatchNorm), bloc résiduel, transfert ResNet-18 (gel, 2 052 paramètres).

**L125 — RNN, LSTM** · P2 E4 C2 · 4 687 → 5 681
- Pré-requis : ∏, diag(1 − h²), ‖W_hh‖, γ, « majorée par » ; notation O(n) / O(n²).
- Exemples ajoutés : RNN scalaire qui oublie, 0,9⁵⁰ contre 1,1⁵⁰, pas de LSTM (⊙, concaténation, 0,95¹⁰⁰), décompte RNN / GRU / LSTM.
- Code : `batch_first`, `bias_ih_l0[h:2h]` (porte d'oubli), `norm(dim=(0, 2))`.

**L126 — Entraîner efficacement** · P1 E4 C2 · 5 263 → 6 208
- Pré-requis : notations d'Adam reprises de L114.
- Exemples ajoutés : écarts-types He / Xavier pour 512 entrées, BatchNorm à la main, dropout et lissage des étiquettes, comportement de float16 (10⁻⁸ → 0, 70 000 → inf, rôle du `GradScaler`).
- Code : profil d'initialisation ; recette complète (ln K, 756 étapes, `autocast` / `scaler`).

**L127 — Projet DL** · E2 C1 · 4 615 → 5 190
- Exemples ajoutés : décomposition des 288 746 paramètres, métriques de la classe « chat ».
- Code : script CIFAR-10 complet (formes, `index_put_`, `sum(0)` / `sum(1)`).

### Module 27 — Transformers et LLM

**L128 — Attention** · P1 E4 C1 · 3 941 → 4 758
- Exemples ajoutés : attention à 3 tokens ; saturation du softmax sans la division par √d_k ; ligne 2 du tableau masqué (0,49 / 0,51) et rôle de −∞ ; 16 384 paramètres pour quatre matrices de 64 × 64.
- Code : `transpose(-2, -1)`, `triu`, `masked_fill`, découpage en têtes `(2, 10, 64)` → `(2, 8, 10, 8)`.

**L129 — Bloc transformer** · E5 C1 · 3 885 → 4 770
- Exemples ajoutés : encodage sinusoïdal en p = 1 ; RoPE (même score pour (5, 2) et (45, 42)) ; LayerNorm contre RMSNorm sur (1, 2, 3, 4) ; SwiGLU et budget 8/3·d ; estimation d'un modèle de 0,9B.
- Code : `outer`, entrelacement `0::2` / `1::2` puis `stack` / `flatten`, décompte des 196 736 paramètres.

**L130 — Tokenization BPE** · E2 C2 · 3 703 → 4 298
- Exemples ajoutés : fusions sur « banane » puis « ananas », octets de « é », taxe du français sur un contrat de 10 000 mots.
- Code : BPE minimal, tiktoken / tokenizers.

**L131 — nanoGPT** · P1 E2 C1 · 4 446 → 5 107
- Exemples ajoutés : décomposition des 808 320 paramètres, perte initiale ln 53 et sens d'une perte de 87.
- Pré-requis : τ et argmax.
- Code : script complet (`view(-1, 53)`, top-k / top-p, `scatter`).

**L132 — Lois d'échelle** · P1 E3 C1 · 3 814 → 4 397
- Pré-requis : ∝, puissance négative, graphique log-log.
- Exemples ajoutés : facteur 9 000 ; formule de Chinchilla appliquée à Chinchilla et à Gopher ; C = 6ND → 84 h-GPU → 230 €.

**L133 — Post-entraînement** · P1 E3 C1 · 3 712 → 4 460
- Pré-requis : π_θ, π_ref, r_φ, 𝔼_{y∼π}, max_θ, β, KL.
- Exemples ajoutés : perte de Bradley-Terry, perte DPO (ln 2 → 0,644), avantages GRPO (±1 contre ±0,87 avec l'écart-type corrigé).
- Code : DPO jouet et RLVR (`Categorical`, `sample((G,))`, `log_prob`).

**L134 — MoE, contexte long, multimodal** · E5 C1 · 4 230 → 5 047
- Exemples ajoutés : routage top-2 renormalisé, perte d'équilibrage (1,0 contre 2,8), KV cache GQA / MHA, fenêtre glissante (×24), 196 patchs ViT.
- Code : couche MoE (`topk`, `nonzero`, `index_add_`, 25 % de paramètres actifs).

### Module 28 — Fine-tuning

**L135 — Quand fine-tuner** · E1 · 2 751 → 2 969
- Exemple ajouté : chiffrage d'un cycle, où le GPU pèse moins de 0,1 % (hypothèse de 50 €/h signalée).

**L136 — LoRA / QLoRA** · P1 E4 C2 · 3 558 → 4 321
- Exemples ajoutés : 128 Go en fine-tuning complet (complète une phrase tronquée, voir § 4), LoRA miniature 2 × 2, 16 niveaux NF4 et 4,4 Go, 8 minutes pour moins d'un café.
- Code : script SFT QLoRA (lot effectif, nombre de pas), test de l'adaptateur.

**L137 — Données** · E1 C3 · 3 400 → 4 096
- Code : expressions régulières de pseudonymisation, empreinte, filtres pandas, séparation ; client Ollama ; DPO.
- Exemple ajouté : `n_eval` et comportement réel de l'empreinte.

**L138 — Évaluer** · P1 E2 C2 · 3 098 → 3 643
- Pré-requis : pass@1, Elo (100 points d'écart = 64 % de victoires), 0-shot, saturation.
- Exemples ajoutés : intervalle de confiance d'un score (± 4,5 points sur 300 cas, ± 11 sur 50), juge A/B en double ordre et calibrage.

**L139 — Fine-tuning via API** · E1 C1 · 3 169 → 3 542
- Exemple ajouté : détail du tableau de coûts (prix par million de tokens).

**L140 — Projet** · E1 C2 · 3 396 → 3 859
- Exemple ajouté : note pondérée base contre fine-tuné (+21,75 points, chiffres fictifs).
- Code : script Unsloth, `compare.py`.

### Module 29 — Inférence et MLOps

**L141 — Quantization** · P1 E3 C2 · 4 465 → 5 160
- Pré-requis : round / clip / x̂.
- Exemples ajoutés : INT4 à la main et effet d'un outlier ; tailles GGUF ; KL token à token.
- Code : sorties réelles du script de granularité (INT4 : 0,95 / 0,20 / 0,12 / 0,10).

**L142 — KV cache, batching, spéculatif** · P1 E3 C2 · 4 073 → 4 822
- Exemples ajoutés : 144 Kio par token pour Qwen3-8B, économie du prefix caching, E2E / TPOT / p95.
- Pré-requis : formule du décodage spéculatif comme somme 1 + α + … + α^γ.
- Code : `kv_calc` (29 requêtes en BF16, 59 en FP8), banc asynchrone.

**L143 — Servir en production** · P1 E1 C1 · 4 144 → 4 588
- Pré-requis : λ, T_in / T_out, SLO, ⌈·⌉, MTok.
- Exemple ajouté : coût par requête et seuil de 2,4 M de requêtes par mois.
- Code : script de dimensionnement exécuté.

**L144 — MLOps** · E1 C2 · 3 651 → 4 113
- Exemple ajouté : PSI à deux thèmes (0,70 contre 0,004).
- Code : épinglage SHA-256 par morceaux, script de dérive (sorties réelles 0,003 / 0,917).

**L145 — Edge et NPU** · E1 C3 · 3 602 → 4 165
- Exemple ajouté : bande passante contre TOPS (39 tokens/s contre 7 500 tokens/s de prefill).
- Code : ONNX Runtime GenAI, formes d'ExecuTorch (5 187 paramètres), routeur hybride.

### Module 30 — Sécurité, alignement, gouvernance

**L146 — Alignement et interprétabilité** · P1 E1 · 3 985 → 4 306
- Pré-requis : autoencodeur creux, latents.
- Exemple ajouté : taux de bascule de complaisance.

**L147 — Red teaming** · E1 C1 · 3 692 → 4 030
- Exemple ajouté : ASR et intervalle de Wilson (1/5 → 4 % à 62 %).
- Code : harnais à canaries.

**L148 — Sécurité agentique** · E1 C1 · 3 701 → 4 105
- Code : garde de politique, exécuté.
- Exemple ajouté : journal chaîné et détection d'une falsification.

**L149 — Gouvernance** · 3 561 → 3 682
- Aucune notation mathématique ni code exécutable : seul le récapitulatif « 3 choses » a été ajouté.

**L150 — Veille et projet final** · E1 C1 · 3 603 → 3 907
- Code : script de veille arXiv (Atom, espaces de noms XML).
- Exemple ajouté : double seuil de validation (68 points non validés, 61 validés).
