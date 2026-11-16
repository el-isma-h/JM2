# Relecture du lexique — 94 termes ajoutés le 5 novembre 2026

Fichier relu : `glossaire/glossaire.json`. Les nouveaux termes sont les 94 dont le slug est absent de la copie `scratchpad/lexique-2/glossaire.avant.json`.

Pour chaque terme, trois vérifications :
1. la définition, l'analogie et l'exemple sont exacts ;
2. un débutant complet peut les comprendre ;
3. chaque leçon listée dans `lecons` explique ou utilise vraiment le terme (contrôle avec grep et lecture du contexte dans `niveaux/*/*/L*.md`).

Je n'ai modifié aucune entrée existante ni aucune leçon. Après correction, `python3 glossaire/verifier_glossaire.py` affiche « OK — 0 erreur(s), 0 avertissement(s) » (683 termes).

Une remarque hors de mon périmètre : le script d'ajout `lexique-2/ajouter.py` a aussi ajouté des renvois `voirAussi` vers les nouveaux termes dans 69 entrées existantes. C'est son comportement prévu, seul ce champ a changé, et je n'y ai pas touché.

## Corrections (8 termes)

### Liens vers des leçons faux (4)

| Terme | Avant → après | Raison | Source |
|---|---|---|---|
| `chiffrement` | lecons `L037, L174, L177, L180` → `L037, L174, L177` | Dans L180, « chiffré » veut dire « exprimé en chiffres » (« critères chiffrés », « cahier des charges chiffré »). On n'y trouve aucune occurrence de chiffrement ni d'AES. | grep sur L180 |
| `thread` | lecons `L067, L100, L146, L184` → `L067, L100` | Dans L146, « Thread » est le nom d'une publication (*Transformer Circuits Thread*). Dans L184, « verrous » désigne des contrôles qualité au sens figuré (« trois verrous », « verrou dans Dagster »). Aucune des deux ne parle de fils d'exécution. | grep sur L146 et L184 |
| `wal-lsn` | lecons `L157, L162, L169, L184` → `L162, L169, L184` | Dans L157, « journal de transactions » désigne le journal de Delta Lake, pas le WAL de PostgreSQL. Ni « WAL » ni « LSN » n'y apparaissent. Le niveau N5 ne change pas. | grep sur L157 |
| `scoring` | lecons `L115, L116, L120, L178` → `L001, L003` ; niveau `N4` → `N1` | Dans L115, L116 et L120, « scoring » n'apparaît que comme le paramètre `scoring=` de scikit-learn (le choix d'une métrique) ou dans le titre de la page « Metrics and scoring ». Dans L178, il s'agit du « re-scoring » de vecteurs. Aucune ne parle de noter des dossiers ou des clients. Le sens du lexique se trouve dans L001 (« Scoring crédit ») et L003 (« Scoring (une note de risque) », avec une question de quiz sur le scoring de crédit). Le niveau suit la première leçon, selon la règle de `scorer.py`. | grep sur L001, L003, L115-L120, L178 |

### Erreurs techniques (4)

**`cookie-de-session`, définition**
- Avant : « Il doit être protégé (options HttpOnly et Secure) pour qu'un script malveillant ne puisse pas le voler. »
- Après : « Il doit être protégé par l'option HttpOnly, pour qu'un script malveillant ne puisse pas le lire, et par l'option Secure, pour qu'il ne circule qu'en HTTPS. »
- Raison : seule l'option HttpOnly empêche un script de lire le cookie. L'option Secure n'a aucun effet sur les scripts : elle interdit l'envoi du cookie hors HTTPS.
- Source : spécification des cookies, RFC 6265, §4.1.2.5 et §4.1.2.6 (fait établi).

**`offset-kafka`, exemple**
- Avant : « …redémarre à partir de son dernier offset validé, sans perdre ni doubler de relevés. »
- Après : « …redémarre à partir de son dernier offset validé, sans perdre de relevés. »
- Raison : reprendre au dernier offset validé garantit qu'aucun message n'est perdu (livraison « au moins une fois »). Mais les messages traités après la dernière validation sont relus, donc des doublons restent possibles. La leçon L167 l'enseigne : « un `kill -9` peut faire relire jusqu'à 99 messages […] c'est le "au moins une fois" ».
- Source : L167, lignes 217 et 383-385.

**`localhost`, exemple**
- Avant : « …l'ouvre sur localhost:5678 pour sa démonstration, sans rien exposer sur le réseau. »
- Après : « …sans rien exposer sur Internet. »
- Raison : avec Docker, `-p 5678:5678` publie par défaut le port sur toutes les interfaces de la machine. n8n est donc joignable depuis le réseau local, même si on l'ouvre via localhost. L037 le dit aussi : sur un poste local, il faut exposer `127.0.0.1:5678:5678`. « Internet » rejoint la définition du terme (« pas accessible depuis Internet tant qu'on ne l'a pas publié »).
- Source : documentation Docker sur la publication des ports ; L037.

**`score-elo`, définition**
- Avant : « LMArena l'utilise pour classer les modèles… »
- Après : « LMArena en utilise une version statistique (le modèle de Bradley-Terry) pour classer les modèles… »
- Raison : le classement LMArena est calculé avec le modèle de Bradley-Terry et affiché sur une échelle de type Elo. Ce n'est plus le calcul Elo d'origine. L'exemple (« son score Elo sur LMArena ») reste juste, puisque l'échelle est de type Elo.
- Source : https://pypi.org/project/arena-rank/ (« Ranking methodology powering the LMArena leaderboard », modèle `BradleyTerry`).

## Doutes non tranchés (aucune modification faite)

1. **`plage-de-cellules`** : la définition dit qu'il faut convertir la plage en tableau pour que Copilot l'analyse correctement. Depuis 2024, Copilot dans Excel accepte aussi des plages qui ressemblent à un tableau ([Chris Menard, 9 août 2024](https://chrismenardtraining.com/post/copilot-in-excel-new-feature-enables-copilot-use-without-a-table/) : « Now you can use a range instead of a table »). Le mot « correctement » rend la phrase défendable, et elle reprend la leçon L022, que je ne dois pas modifier. Il faut vérifier si L022 est à jour.
2. **`score-elo` (et tout le programme)** : LMArena a pris le nom « Arena » le 28 janvier 2026 ([Wikipédia](https://en.wikipedia.org/wiki/Arena_(AI_platform))), et news.lmarena.ai redirige vers arena.ai. J'ai gardé « LMArena » pour rester cohérent avec les leçons et l'entrée `lmarena`. C'est à harmoniser ailleurs, si vous le souhaitez.
3. **`ivf-pq`** : la source est https://github.com/pgvector/pgvector. Or pgvector propose IVFFlat et HNSW, mais pas la Product Quantization. La définition reste exacte, mais la source ne documente pas PQ. Je n'ai trouvé aucune URL de remplacement (FAISS, Qdrant, Milvus) dans `_recherche/` ni dans la bibliothèque, et le vérificateur refuse toute autre URL.
4. **`offset-kafka`, définition** : on y lit que l'offset « augmente de un à chaque nouveau message » et que le groupe « enregistre le dernier offset traité ». Ce sont des simplifications. Les transactions et le compactage créent des trous dans la numérotation, et l'offset validé est en réalité celui du prochain message à lire (dernier traité + 1). C'est acceptable pour un débutant, mais imprécis.
5. **`nir`** : « on ne doit jamais l'envoyer à un service d'IA sans base légale ». En droit français, le NIR ne peut être traité que dans les cas prévus par le décret-cadre NIR (décret n° 2019-341). C'est plus strict qu'une simple base légale au sens du RGPD. La phrase n'est pas fausse, mais elle sous-estime l'encadrement.
6. **`hmac`** : « sans pouvoir revenir à la valeur d'origine sans la clé ». Même avec la clé, on ne « déchiffre » pas un HMAC. Mais celui qui a la clé peut retrouver un NIR en essayant toutes les valeurs possibles, car il y en a relativement peu. La formulation peut donc se défendre.
7. **`seau-a-jetons`** : la phrase « Les fournisseurs d'API de LLM appliquent leurs rate limits de cette façon » n'est confirmée que pour Anthropic (« The API uses the token bucket algorithm », https://platform.claude.com/docs/en/api/rate-limits). Je n'ai pas vérifié les autres fournisseurs.
8. **`arxiv`** : dans L129, L133 et L134, arXiv n'apparaît que dans les références d'articles (« arXiv 2305.18290 », URL). Ces leçons utilisent donc arXiv sans l'expliquer. J'ai gardé les liens.
9. **`dockerfile`** : la source est la page d'installation de n8n avec Docker, qui parle de Docker mais pas des Dockerfile. Ce n'est pas faux, juste peu pertinent.

Points que j'ai vérifiés et qui sont justes : le TTL du cache de prompt (5 min, remis à zéro à chaque lecture, option 1 h, https://platform.claude.com/docs/en/build-with-claude/prompt-caching) et les archives mensuelles de Common Crawl. La taille d'environ 66 Go pour gpt-oss-120b en MXFP4 est cohérente avec L042. Le seuil « 9 ou plus » de `cotation-p-x-i` est cohérent avec la grille 1-4 de L110.

## Résumé

- J'ai relu 94 termes.
- J'ai corrigé 8 termes : 4 listes de leçons fausses (`chiffrement`, `thread`, `wal-lsn`, `scoring`, dont le niveau passe de N4 à N1) et 4 erreurs techniques (`cookie-de-session`, `offset-kafka`, `localhost`, `score-elo`).
- 9 doutes restent ouverts. Les deux principaux : la leçon L022 sur Copilot et les plages Excel est peut-être dépassée, et LMArena s'appelle désormais Arena.
- Le vérificateur affiche 0 erreur.
