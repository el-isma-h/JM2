# Relecture indépendante N1–N3 (référence : 1er novembre 2026)

Périmètre : leçons `L*.md` de N1, N2 et N3, les 23 `quiz.json`, et `examens/N1`, `N2`, `N3-examen.json`. Les faits sont confrontés à `_recherche/01` à `05`. Le web n'a pas été utilisé.

## Méthode

- **Calculs** : environ 150 lignes chiffrées ont été extraites des leçons (coûts API, mémoire, tokens, opérations Make et Zapier, TCO, pourcentages). Toutes ont été recalculées en Python, de même que tous les calculs des quiz et des examens. Le jeu Mobidesk (L055) a été rechargé et recalculé en entier : total, trimestres, mois, commerciaux, catégories, produits, quantités, semaines de L058, requêtes SQL de L057 et de N2-E29. Tout concorde.
- **Quiz et examens** (350 questions) : contrôle structurel par script (index `answer` valide, nombre d'options par type, doublons, options Vrai/Faux). Puis relecture de chaque question : bonne réponse, unicité, cohérence de l'explication avec la leçon.
- **Cohérence entre leçons** : vérification croisée des prix et des dates des modèles (Anthropic, OpenAI, xAI, Mistral, Gemini, Perplexity), de la numérotation OWASP 2026, du calendrier et des sanctions de l'AI Act, des limites d'API (cache, Batch, Files, PDF), des en-têtes et versions, et des versions de la spécification MCP.
- **Item 5** : recherche des formulations du type « équivaut / équivalence / remplace ». Aucune n'affirme d'équivalence. Tous les passages concernés (L004, L032, L064, L077, L105, N2-E40) disent déjà « atteste… ne remplace pas » ou « prépare à ».

## Corrections appliquées (9)

| # | Cat. | Fichier | Avant → Après | Justification |
|---|---|---|---|---|
| 1 | Calcul | `N3/M17/L071` (défi) | « Oui, douze millionièmes de dollar. » → « Oui, douze cent-millièmes de dollar. » | 1 200 × 0,10 $/10⁶ = 0,00012 $ = 12 × 10⁻⁵, soit douze cent-millièmes et non douze millionièmes (1,2 × 10⁻⁵). |
| 2 | Calcul | `N3/M23/L109` (§5.2) | « ×20 à ×40 entre Haiku et Opus » → « ×20 (Sonnet) à ×40 (Opus) par rapport à Haiku » | Opus 5.5 / Haiku 5.5 = 4/0,10 = 20/0,50 = ×40 exactement. Le ×20 correspond à Sonnet. |
| 3 | Calcul | `N2/M14/L059` (tableau mémoire, ligne FLUX) | « 24 Go de VRAM en FP16 ; 12-16 Go en FP8/4 bits » → « 24 Go de VRAM en FP8 ; 12-16 Go en 4 bits ; FP16 (≈ 26 Go) au-delà de 24 Go, avec déchargement en RAM » | 12 × 16 ÷ 8 × 1,1 = 26,4 Go > 24 Go, sans compter T5. La ligne contredisait sa propre colonne FP16 et la réponse 2 de l'auto-évaluation. |
| 4 | Quiz | `N2/M14/quiz.json` M14-Q02 (explication) | « tient dans 24 Go en FP16 ou en FP8 » → « tient dans 24 Go en FP8 (≈ 13 Go de poids ; en FP16, ≈ 26 Go, il faudrait décharger une partie en RAM) » | Même calcul ; on s'aligne sur L059. La réponse (option 1) reste correcte. |
| 5 | Quiz | `examens/N2-examen.json` N2-E32 (explication) | « la leçon situe le confort de FLUX en FP8/4 bits sur 12 à 16 Go et en FP16 sur 24 Go » → « …en 4 bits sur 12 à 16 Go et en FP8 sur 24 Go (le FP16, ≈ 26 Go, dépasse 24 Go) » | Explication incohérente avec son propre calcul (26,4 Go en FP16). On s'aligne sur L059 corrigée. |
| 6 | Contradiction | `N3/M21/L099` (tableau MCP/A2A) | « spécification stable **2026-07-28** (précédente : 2025-11-25) » → « spécification **2026-07-28**, la plus récente (la doc Anthropic cite encore la version stable 2025-11-25) » | L027 et L075 présentent 2025-11-25 comme la version stable et 2026-07-28 comme une révision plus récente (RC). `_recherche/01` (GitHub lu) parle d'une RC non finale ; `_recherche/04` (source tierce) la dit stable. Formulation prudente, compatible avec les deux. |
| 7 | Contradiction | `N3/M16/L067` (§1.2) | « avec les tokenizers 2026 ( » → « avec le tokenizer Claude depuis Opus 4.7 (la règle générale ~0,75 mot par token de L005 vaut pour d'autres tokenizers et donne des chiffres plus bas ; » | L005 enseigne ~0,75 mot/token (≈ 1,33 token/mot, ≈ 1,9 en français, page A4 ≈ 900–1 000 tokens). L067 donnait 1,8 / 2,5 token/mot et une page à 1 200–1 500 tokens comme règle générale. `_recherche/01` : 1M tokens ≈ 555k mots (tokenizer Claude ≥ 4.7) ; `_recherche/04` : ~0,75 mot/token en général. Les deux règles sont désormais situées. |
| 8 | Technique | `N3/M20/L093` (code Ragas) | `ChatAnthropic(model="claude-sonnet-5-5", temperature=0)` → `ChatAnthropic(model="claude-sonnet-5-5")` + commentaire « pas de temperature : 400 sur Claude ≥ 4.7 » | `_recherche/01` et L008, L066, L068, L069, L088, L101 : `temperature` provoque une erreur 400 sur les modèles ≥ 4.7. Le code tel quel échouait. |
| 9 | Technique | `N3/M20/L093` (§ précautions) | « et `temperature=0` pour la reproductibilité. » → « sans paramètre `temperature` (refusé, erreur 400, par les modèles Claude ≥ 4.7) : la stabilité vient d'une rubrique précise et d'un format de sortie imposé. » | Même raison ; aligne la leçon sur L068 et L076 (« rappel : temperature… »). |

**Décompte par catégorie** : calculs 3 · contradictions 2 · affirmations techniques 2 · quiz et examens 2 · « équivaut » 0.

Ni id, ni titre, ni durée n'ont été modifiés, et aucune section n'a été supprimée. Après correction, `node scripts/validate.mjs | tail -3` : « ✅ Aucune erreur bloquante. » La seule remarque restante concerne `N4-examen.json`, hors périmètre.

## Vérifié sans erreur (extraits)

- Coûts : L005, L009, L034, L038, L058, L060, L061, L062 (scénarios A, B, C, TCO et seuil de 15 utilisateurs), L067, L068, L070, L072, L073, L078, L083, L084, L085, L086, L094, L100, L102, L105, L109, L110. Exemples : N2-E03, N2-E09, N2-E23, N2-E35, N2-E37, N3-E02, E03, E18, E28, E39, M15-Q01, M16-Q08, M19-Q02, M22-Q10, M23-Q08.
- Mémoire et vitesse (L042) : formule, KV cache Llama 3 (131 et 328 Mo par 1 000 tokens, recalculés depuis l'architecture), rapports mesuré/théorique, réponses de l'auto-évaluation. Également N2-E13 et N2-E14.
- RRF (N3-E22), hit rate et MRR (N3-E24), p95 de `verifier-seuils` (N3-E34), grille probabilité × impact (N3-E40 / L110).
- Make (L039 : 376 opérations/jour, ≈ 11 300/mois) et Zapier (L040, M09-Q06) : cohérents avec le modèle de comptage enseigné.
- OWASP 2026 (L031, L106, L107, L109, L110, quiz, examens), AI Act (dates, report à 2027/2028, sanctions 35/15/7,5 M€), loi SREN (2 ans / 45 000 €) : concordants entre eux et avec `_recherche/04` et `/05`.
- 350 questions : tous les index `answer` sont valides, aucun doublon d'options, une seule réponse défendable par question, explications conformes aux leçons (après les corrections 4 et 5).

## Doutes non tranchés (non modifiés)

1. **Comptage des opérations Make.** Les leçons comptent une opération par bundle *émis* par le déclencheur Gmail (en plus du passage de sondage), et 5 opérations pour un module « Avis » qui renvoie 5 bundles (défi de L039). Je ne suis pas certain que Make facture ainsi un déclencheur ou un module de recherche qui renvoie plusieurs bundles : il pourrait facturer une opération par exécution du module. C'est cohérent dans tout le cours (L039, L040, N2-E09), mais à vérifier sur la doc Make avant diffusion.
2. **Statut de MCP 2026-07-28.** `_recherche/01` et `_recherche/04` se contredisent (RC non finale contre stable). La correction 6 reste neutre ; à trancher sur modelcontextprotocol.io.
3. **L042 « PDF de 60 pages (≈ 40 000 tokens) »** contre **L009 « 60 pages ≈ 60 000 tokens »**. Les documents sont différents, mais la convention de L005 (≈ 900–1 000 tokens par page dense) donne plutôt ~55–60k. Sans effet sur la démonstration de L042.
4. **gpt-oss-120b : « 5,1B actifs ≈ 3,5 Go lus par token en MXFP4 »** (L042, M10-Q04, N2-E14). En théorie, 5,1 × 4,25 bits ÷ 8 × 1,1 ≈ 3 Go. L'écart s'explique peut-être par l'attention en BF16 ; ordre de grandeur acceptable.
5. **M19-Q02 / L084 : `x_search` à 5 $/1 000 « posts »**. La recherche indique un prix par 1 000 posts (et non par appel). Le calcul suppose 1 appel = 1 unité facturée. À confirmer sur la page tarifs xAI.
6. **L087 (code Gemini)** : le coût ne prend que `promptTokenCount` et `candidatesTokenCount`. Si les tokens de réflexion (`thoughtsTokenCount`) sont facturés en sortie, le coût est sous-estimé quand le thinking est actif.
7. **L066 : noms d'exceptions du SDK Python** (`RequestTooLargeError`, `OverloadedError`) non vérifiables dans `_recherche/`. À confirmer sur le dépôt du SDK v2.
8. **Approximations tolérées.** « Lecture du cache à ~10 % du prix » (M02-Q08) et « le coût d'entrée chute de 90 % » (L070) : c'est vrai en général, alors que la lecture vaut 5 % sur Opus et Sonnet 5.5 et 2,5 % sur Fable 5.1. Ce sont des sous-estimations de l'économie, pas des erreurs de sens.
9. **`_recherche/04` (synthèse)** classe « Mistral Large 3 » sous Apache 2.0, et `_recherche/02` met Mistral Large 4 sous Mistral Ecosystem Open Weight License. Les leçons (L045, L086, M19-Q05) distinguent bien Large 3 et Large 4 : rien à corriger, mais la synthèse de la recherche gagnerait à le préciser.
