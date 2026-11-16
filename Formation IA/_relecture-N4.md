# Relecture indépendante N4 (référence : 1er novembre 2026)

Périmètre : les 40 leçons `L*.md` de `niveaux/N4-expert/` (M24 à M30, L111 à L150) et les 7 `quiz.json` (70 questions). `examens/` n'a pas été touché. Les faits ont été confrontés à `_recherche/01` à `05`, aux leçons N1 à N3 et à la relecture `_relecture-N1-N3.md`. Le web n'a pas été utilisé.

## Méthode

- **Code exécuté** : les 155 blocs de code ont été extraits, dont 94 en Python. Les 45 blocs Python sans dépendance lourde (NumPy, scikit-learn 1.9.1, pandas, bibliothèque standard) ont été exécutés. Chaque sortie a été comparée au texte qui la commente : L111 à L122, L130, L141, L143, L144 (PSI) et le garde de L148. PyTorch n'est pas installé, donc les blocs `torch`, `transformers`, `peft`, `trl`, `unsloth`, `vllm` et `openai` ont été relus ligne par ligne : formes de tenseurs, masque causal, ordre `zero_grad`/`backward`/`clip`/`step`/`scheduler`, `eval()`/`no_grad`, fuite train/éval, API PEFT/TRL/vLLM/llama.cpp. Les nombres de paramètres qu'ils annoncent ont tous été recalculés en Python.
- **Calculs recalculés** :
  - Dérivées et gradients (neurone sigmoïde, ∇f, Adam pas à pas), entropies et KL (bits/nats), softmax à T = 0,5/1/2, Bayes, MLE.
  - Schedule warm-up + cosinus (valeurs du graphique), paramètres de chaque réseau : 1 394, 109 386, 337, 1 218, 50 186/50 378, 288 746, 196 736, 808 320, LoRA r(d+k), 8B × r = 8/16/64.
  - KV cache (Llama 3.1 8B/70B, Qwen3-8B, MHA/GQA/MQA, défis et quiz), lois d'échelle : allocation Chinchilla approche 3, 6ND, h-GPU, coûts 1B/Llama 3 8B/Chinchilla, exercice des 10 000 €.
  - Coûts API et GPU de L139 et L143 (tous les montants), décodage spéculatif E(α, γ), loi de Little, PSI, bits effectifs des quantizations, erreurs INT8/INT4.
  - Tout concorde, sauf les points corrigés ci-dessous.
- **Quiz** (70 questions) : contrôle par script de l'index `answer`, de 4 options (ou Vrai/Faux) et de l'absence de doublon. Puis relecture de chaque question : bonne réponse, une seule défendable, explication cohérente avec la leçon.
- **Cohérence** : prix et modèles (Anthropic, OpenAI, Mistral, Gemini, modèles ouverts), comportement de `temperature` sur Claude ≥ 4.7, statut de MCP 2026-07-28, OWASP LLM 2026, AI Act, certifications Anthropic, renvois internes entre leçons (« vu en L1xx »).

## Corrections appliquées (19)

| # | Cat. | Fichier | Avant → Après | Justification |
|---|---|---|---|---|
| 1 | Calcul | `M24/L111` (code cosinus) | commentaire `# ≈ 0.98` → `# ≈ 0.99` | Le script affiche 0,990. |
| 2 | Calcul | `M25/L116` §2 | « une variance […] plusieurs centaines de fois celle du degré 4 » → « des dizaines de milliers de fois celle du degré 4 (≈ 774 contre ≈ 0,03 avec cette graine) » | Exécution : 773,998 / 0,028 ≈ 27 600. |
| 3 | Contradiction | `M25/L116` §3.2 | « Vous avez vu en M24 L113 l'estimation du **maximum a posteriori** (MAP) » → « Le MAP prolonge le maximum de vraisemblance vu en M24 L113 en ajoutant un a priori sur les paramètres » | L113 ne traite que le maximum de vraisemblance, jamais le MAP. |
| 4 | Contradiction | `M25/L116` (piège double descente) | « le U reste le bon guide ; vous reverrez la nuance en M26. » → « le U reste le bon guide (la double descente a été popularisée par Belkin et al., 2019). » | Aucune leçon de M26 ne parle de double descente (vérifié par grep). |
| 5 | Contradiction | `M25/L118` §4.1 | « (multiplicateur de Lagrange, M24 L114) » → « (multiplicateur de Lagrange) » | L114 ne traite pas les multiplicateurs de Lagrange. |
| 6 | Calcul | `M26/L124` §2.2 | « environ 50 000 paramètres, deux fois moins que le MLP de L123 » → « …deux fois moins que le MLP 784 → 128 → 64 → 10 de L123 (109 386) et près de cinq fois moins que le MLP entraîné sur Fashion-MNIST (235 146) » | L123 contient deux MLP. Celui du script Fashion (784 → 256 → 128 → 10) compte 235 146 paramètres. |
| 7 | Calcul | `M26/L124` §3 | « contre 88-89 % pour le MLP, avec deux fois moins de paramètres. » → « …avec près de cinq fois moins de paramètres (50 378 contre 235 146). » | Les 88-89 % sont ceux du MLP 784 → 256 → 128 → 10 : 235 146 / 50 378 ≈ 4,7. |
| 8 | Fait | `M26/L125` §3.2 | « Résultats obtenus (PyTorch 2.15, CPU, graine 0) » → « (PyTorch 2.x, CPU, graine 0) » | Au rythme d'environ une version mineure par trimestre (2.9 en octobre 2025), une 2.15 n'existe très probablement pas au 1er novembre 2026. Formulation alignée sur L126 et L128. |
| 9 | Code | `M27/L130` §3 (sortie commentée) | « `'e '`, `'ent'`, puis `'les '` » → « `'e '`, `'ent'`, puis (après `'ct'`, `'ur'`, `'ep'`, `'is'`) `'les '` » | Exécution du script : `'les '` est la 10ᵉ fusion (id 265), pas la 6ᵉ. |
| 10 | Contradiction | `M27/L131` §5 (tableau) | « $\tau < 1$ : plus sûr et plus plat » → « $\tau < 1$ : distribution plus pointue, texte plus sûr et plus prévisible » | Une température inférieure à 1 rend la distribution plus pointue. « Plus plat » contredisait L113 (T = 2 : « distribution aplatie ») et M24-Q08. |
| 11 | Contradiction | `M28/L137` §6 | « RLHF […] Puissant mais lourd : trois modèles en mémoire » → « quatre modèles en mémoire (politique, référence, récompense, critique de PPO) » | Aligné sur L133 §4 et sur son tableau comparatif. |
| 12 | Code | `M30/L147` §4.1 (harnais Python) | `temperature=1.0,  # on teste la distribution réelle…` → ligne retirée, remplacée par le commentaire « pas de temperature : refusée (erreur 400) par les modèles Claude >= 4.7 ; on teste la distribution par défaut » | Le harnais appelle `claude-haiku-5-5`. `_recherche/01`, L008, L065, L066 et M16 indiquent que `temperature` donne une erreur 400 sur les modèles ≥ 4.7 : le script échouait au premier appel. C'est la même correction que la n° 8 de la relecture N1-N3. |
| 13 | Contradiction | `M30/L147` §3 ⑤ et critères de l'exercice | « à température fixée » → « à paramètres d'échantillonnage fixés et notés (sur les modèles Claude ≥ 4.7, `temperature` n'est pas réglable : on garde la configuration par défaut) » ; « (modèle, température, nombre d'essais indiqués) » → « (modèle, paramètres d'échantillonnage, nombre d'essais indiqués) » | Cohérence avec la correction 12 et avec L008. |
| 14 | Contradiction | `M27/L131` §5 | « `temperature` et `top_p` que vous réglez dans les API (Claude, OpenAI, Mistral) » → « …dans les API (OpenAI, Mistral ; Claude jusqu'à la version 4.6, ces paramètres étant refusés à partir de 4.7, voir L008) » | Selon `_recherche/01`, `temperature`, `top_p` et `top_k` ne sont plus supportés à partir de 4.7, comme l'enseignent L008 et M16. |
| 15 | Contradiction | `M24/L113` §6 | « paramètres exposés par les API de génération (Claude, OpenAI, Mistral…) » → « (OpenAI, Mistral, serveurs locaux… ; les modèles Claude ≥ 4.7 la refusent, voir L008) » | Même raison que la correction 14. |
| 16 | Contradiction | `M30/L148` (introduction) | « la spécification MCP stable du 28 juillet 2026 » → « la spécification MCP (révision 2026-07-28, la plus récente ; la documentation Anthropic cite encore la version stable 2025-11-25) » | L027, L075 et L099 (corrigée en N1-N3) présentent 2025-11-25 comme stable et 2026-07-28 comme une révision plus récente (RC selon `_recherche/01`). La leçon citait elle-même la section *Authorization* 2025-11-25. |
| 17 | Fait | `M30/L150` (défi chronologique) | « Chinchilla (mars 2022, quelques jours après) » → « Chinchilla (fin mars 2022, un peu plus de trois semaines après) » | InstructGPT (arXiv 2203.02155) date du 4 mars 2022 et Chinchilla (2203.15556) du 29 mars 2022, soit 25 jours d'écart. L'ordre de la réponse est inchangé. |
| 18 | Contradiction | `M30/L150` §4.5 | ajout, après les domaines cités : « ; examens réservés aux employés d'organisations membres du Claude Partner Network, voir L011 » | L011 et le quiz M03 (N1) enseignent cette restriction, documentée dans `_recherche/01`. L150 encourageait à « les passer » sans la mentionner. |
| 19 | Calcul | `M25/L120` §3 (constats d'EDA) | « Fortes asymétries sur les variables « error » et « area » (coefficient d'asymétrie supérieur à 3) » → « …sur les variables « error », dont « area error » (supérieur à 3 ; « mean area » et « worst area » restent vers 1,6-1,9) » | Exécution : skew de 5,45 pour « area error », 1,65 pour « mean area », 1,86 pour « worst area ». Les cinq variables au-dessus de 3 sont toutes des « error ». |

**Décompte par catégorie** : calculs 5 (n° 1, 2, 6, 7, 19) · code 2 (n° 9, 12) · faits 2 (n° 8, 17) · contradictions 10 (n° 3, 4, 5, 10, 11, 13, 14, 15, 16, 18) · quiz 0.

Ni id, ni titre, ni durée n'ont été modifiés, et aucune section n'a été supprimée. Après correction, `node scripts/validate.mjs | tail -3` affiche : « Leçons rédigées : 150/150 · mots : 334 120 · questions : 460 · URLs distinctes : 674 » puis « ✅ Aucune erreur bloquante. »

## Vérifié sans erreur (extraits)

- **M24** :
  - L112 : neurone (L = 0,03616, ∂L/∂w = −0,07932, ∂L/∂b = −0,05288), ∇f(1, 2) = (4 ; 4), corrigé ∇f = (0,5 ; 2), gradient checking à 1,2·10⁻⁹.
  - L113 : H(p) = 1,5 bit, H(p, q) = 1,572 bit, KL = 0,072 bit (0,0499 nat) contre 0,0541 nat, softmax à T = 0,5/1/2, Bayes ≈ 16 %, T = 2/ln 2 ≈ 2,89, écart-type 0,89 point.
  - L114 : facteurs 1 − 2η, η < 2/λmax, GD 3,2·10⁻⁵ contre 4·10⁻⁸ (momentum/Adam), mini-batch 31,7 fois moins de pas, Adam pas 2 → 0,800, schedule, 56 Go d'état Adam pour 7B.
  - L111 : LoRA 4096² → < 1 %.
- **M25** : tous les scripts exécutés concordent avec le texte. Moindres carrés = descente de gradient, Wine 100 %, Lasso, AUC, fuite 0,79 contre 0,51, Gini 0,486 / seuil 6 / 0,375, MDI du bruit en tête, k = 3 par silhouette (et hésitation 2/3 sans log), DBSCAN/single ARI = 1, PCA 13/21/29 composantes, breast cancer (37 %, 15 paires > 0,95, rappel test 0,952 = 40/42, IC [0,875 ; 1]).
- **M26** :
  - Comptes de paramètres : 1 394, 109 386, 337, 1 218, 50 186 + 192, 288 746, RNN/LSTM/GRU à 256 (131 584 / 526 336 / 394 752), conv 9 472/9 408 et 73 856, tête ResNet 2 052.
  - Défi 0,8⁴⁹ / 1,2⁴⁹, ordre des 5 gestes, `batch_first`, `eval()` + `no_grad`, ordre GradScaler/`unscale_`/clip, mémoire 16-18 Go (1B, AdamW, mixte).
- **M27** :
  - Mémoire de QKᵀ (4 Mo / 4,3 Go / 4,4 To), 4d², 12d² et défi de 7,5 milliards, bloc 196 736.
  - RoPE sur Q et K seulement, masque `triu(diagonal=1)`, mini-GPT 0,81 M (ln 53 = 3,97 ; ln 96 = 4,56), top-p qui garde le token qui franchit p.
  - Chinchilla : D/N ≈ 31 → 118 avec l'approche 3, 230 €, Llama 3 8B à 7,2·10²³ FLOPs (≈ 506 000 h), défi à 413 000 h, exercice à 5,2·10²¹ / 6,6B / 132B / 320 tokens par paramètre.
  - Perte DPO, avantages GRPO, MoE 49 664 / 197 120 (25 %), KV 68,7 / 17,2 / 2,1 Go, défis 9 utilisateurs et 4 / 19 utilisateurs.
- **M28** :
  - LoRA 131 072 et 147 456 ; Qwen3-8B à r = 8/16/64 → 21,8 / 43,6 / 174,6 M (fourchettes de la leçon correctes) ; full fine-tuning 128 Go ; VRAM 4/8/27B.
  - Coûts de L139 (3 400 $, 6 570 €, 128 $) et de son corrigé (30 M tokens).
  - API PEFT/TRL (`processing_class`, `max_length`, `eval_strategy`, `peft_config`, `AutoPeftModelForCausalLM`, `DPOTrainer(ref_model=None)`), formats prompt-completion et préférences, séparation train/éval avant l'augmentation.
- **M29** :
  - Erreurs INT8/INT4 exécutées, bits effectifs (4,31 ; 4,5 ; k-quants), KV 128/144/320 Kio par token, 38 Go pour 32 utilisateurs, budget L40S ≈ 29/59 requêtes, E(0,8 ; 4) = 3,36 et E(0,6 ; 3) = 2,18, 70B × 16K = 5,2 Go.
  - Tous les coûts de L143 (API, GPU 24/7 et heures ouvrées, Spark à 193 $/mois et 175 kWh, cache Sonnet ≈ 712 $, seuil ≈ 2,4 M requêtes, exercice mutuelle), loi de Little, PSI exécuté (0,003 / 0,917), plafond edge 120 / 2,2 ≈ 55 tokens/s.
- **M30** : dates et attributions (InstructGPT, CAI, Sleeper Agents, Alignment faking, SAE Anthropic/OpenAI/Gemma Scope, RSP/ASL-3 en mai 2025, Preparedness, FSF, Zou, Ganguli, HarmBench, Constitutional Classifiers, Hardy 1988, lethal trifecta), OWASP LLM 2026 (LLM03 Excessive Agency, LLM04 Supply Chain, LLM05 Poisoning, LLM06 Unbounded Consumption, LLM08 Hidden Context Exposure), AI Act (calendrier révisé, 10²⁵ FLOP, art. 12/26/27/53/55/73, sanctions), NIST AI 600-1, ISO/IEC 42001, 18 fiches CNIL : tout est conforme à `_recherche/04` et `/05`.
- **Quiz** : 70 questions, tous les index valides, 4 options (ou Vrai/Faux), aucun doublon, une seule réponse défendable, explications conformes (y compris M27-Q10 et M29-Q03 recalculées).

## Doutes non tranchés (non modifiés)

1. **Lecture du cache à « 0,1× » (L135)** : c'est vrai en règle générale, mais la lecture vaut 0,05× sur Opus et Sonnet 5.5, le modèle cité dans la même leçon. L142 donne bien les deux. La relecture N1-N3 a toléré la même approximation (sous-estimation de l'économie, pas erreur de sens).
2. **Modalités de Gemma 4 (L134 §5)** : « texte, image et audio (plus la vidéo pour les grandes tailles) ». Selon `_recherche/04`, E2B/E4B = texte + image + audio et 26B-A4B = texte + image + vidéo : l'audio n'est pas confirmé pour les grandes tailles. À vérifier sur la fiche Google.
3. **`apply_chat_template(..., return_tensors="pt")` (L136 `test_adapter.py`)** : la leçon suppose qu'on reçoit un tenseur. Selon la version de transformers (v5), l'appel peut renvoyer un `BatchEncoding` (dans ce cas `inputs["input_ids"]`). Je n'ai pas pu le vérifier sans la bibliothèque.
4. **Sorties « obtenues » des scripts PyTorch** (L125 tableaux des gradients et de la mémoire, L126 ablation/recette 85,3 %, L129 normes 1,05/426, L131 pertes 4,03/1,64/1,70, L133 0,99/79 %, L122 « environ 45 secondes ») : impossibles à rejouer sans PyTorch. Leur cohérence interne (ordres de grandeur, ln V, rapports) a été vérifiée.
5. **« 362 incidents IA en 2025 » (AI Index 2026, L149)** : conforme à `_recherche/03`, mais la source primaire n'a pas été relue.
6. **« Les huit épisodes » de *Zero to Hero* (L131)** : la série comprend peut-être aussi « Let's reproduce GPT-2 (124M) ». À vérifier sur karpathy.ai.
7. **Taille GGUF Q4_K_M de Gemma 4 E4B ≈ 3 Go (L140)** : les modèles « E » ont un nombre de paramètres bruts supérieur à leurs paramètres effectifs (embeddings par couche). Le fichier pourrait être plus gros. À mesurer.
8. **L140, `eval.jsonl` (les 40 cas figés) passé comme `eval_dataset` pendant l'entraînement** : acceptable tant qu'il ne sert qu'à surveiller la perte (pas de `load_best_model_at_end`). Cela frôle toutefois la règle de L138 (« ne sert jamais à régler les hyperparamètres »). On pourrait suggérer un petit jeu de validation distinct.
9. **L114, graphique Mermaid** : la valeur 2,33 (×10⁻⁴ à 4 000 pas) vaut 2,32 au calcul. C'est un arrondi négligeable.
10. **TGI « en mode maintenance fin 2025 » (L141), vLLM « Python 3.11 à 3.14 »** : plausibles et formulés avec « vérifiez », mais absents de `_recherche/`.
