# Lexique — Formation IA Next Formation (NF-IA-150)

`glossaire.json` est le lexique de la formation : **683 termes** (le minimum demandé est 350), au format de `FORMAT.md` § 4 « Lexique ». Il couvre les cinq niveaux, de N1 (Fondamentaux) à N5 (Data engineering & Big Data). L'application e-learning et l'export Next Formation peuvent l'utiliser directement : infobulles, page « Lexique », liens depuis les leçons.

## Format d'une entrée

```json
{
  "terme": "KV cache (cache clés-valeurs)",
  "slug": "kv-cache",
  "categorie": "LLM locaux, matériel et MLOps",
  "niveau": "N2",
  "definition": "2 à 3 phrases simples, sans jargon non défini.",
  "analogie": "Image tirée de la vie quotidienne.",
  "exemple": "Cas concret dans une organisation française.",
  "voirAussi": ["self-attention", "vram"],
  "lecons": ["L042", "L134", "L141", "L142"],
  "source": { "title": "Stanford CS336 — Language Modeling from Scratch", "url": "https://cs336.stanford.edu/" }
}
```

| Champ | Règle |
|---|---|
| `terme` | Forme d'usage. Un sigle est suivi de sa forme développée entre parenthèses : « RAG (Retrieval-Augmented Generation) », « AIPD (analyse d'impact relative à la protection des données) ». Une variante en anglais ou en français peut figurer entre parenthèses. |
| `slug` | Identifiant unique en kebab-case, sans accent, stable dans le temps : on ne le renomme pas, car les leçons et l'application s'en servent comme ancre. Pour deux sigles identiques, on distingue par le slug : `dpo` (Direct Preference Optimization) et `delegue-protection-donnees` (DPO/DPD du RGPD). |
| `categorie` | Une valeur de la liste fermée ci-dessous, avec le libellé exact. |
| `niveau` | Niveau `N1` à `N5` de la **première** leçon où le terme est réellement traité. Si aucune leçon ne le traite, c'est le niveau où il devient utile. |
| `definition` | 2 à 3 phrases, compréhensibles par un débutant. Tout terme technique employé a sa propre entrée dans le lexique. |
| `analogie` | Une image tirée de la vie quotidienne (cuisine, voiture, bibliothèque, administration…). |
| `exemple` | Un cas concret dans une organisation française : PME, cabinet, collectivité, mutuelle, artisan… |
| `voirAussi` | Uniquement des slugs qui existent dans le lexique. Jamais le terme lui-même, jamais de doublon. |
| `lecons` | Identifiants `Lxxx` des leçons où le terme est **expliqué**, et pas seulement cité. Ils sont calculés par recherche dans les fichiers `niveaux/**/L*.md` (voir « Méthode »). La liste est vide si aucune leçon ne traite le terme. |
| `source` | Facultatif. Page **institutionnelle ou officielle** (documentation éditeur, CNIL, France Compétences, Code du travail, Sénat, OWASP, cours universitaires, Hugging Face…) dont l'URL figure dans `_recherche/` ou dans `ressources/bibliotheque-liens.md`. Si aucune source officielle ne convient, le champ est **omis**. Les blogs, cabinets et organismes privés de la bibliothèque ont été écartés. |

## Catégories (liste fermée, 14 valeurs)

| # | Catégorie (libellé exact) | Contenu | Termes |
|---|---|---|---|
| 1 | IA générale et multimédia | Définitions, histoire, familles d'IA, assistants grand public, image, vidéo et voix | 48 |
| 2 | Machine learning et mathématiques | Apprentissages, modèles classiques, métriques, algèbre, probabilités, optimisation | 52 |
| 3 | Deep learning | Réseaux de neurones, rétropropagation, CNN, RNN, PyTorch | 32 |
| 4 | LLM et modèles de langage | Tokens, transformer, entraînement et post-entraînement, fine-tuning, benchmarks, familles de modèles | 68 |
| 5 | Prompt engineering | Techniques de prompt, outils de configuration des assistants, évaluation des prompts | 30 |
| 6 | API et développement | API, HTTP, SDK, fonctions des API de LLM, coûts, déploiement, observabilité, agents de code | 105 |
| 7 | Agents et MCP | Agents, boucle agentique, MCP, A2A, multi-agents, SDK et frameworks d'agents | 34 |
| 8 | RAG et recherche sémantique | Embeddings, bases vectorielles, chunking, recherche hybride, évaluation d'un RAG | 30 |
| 9 | LLM locaux, matériel et MLOps | Ollama et outils locaux, quantization, GPU et VRAM, serveurs d'inférence, MLOps | 41 |
| 10 | Automatisation | n8n, Make, Zapier, workflows, auto-hébergement | 34 |
| 11 | Data et data engineering | Données, SQL, big data, ETL et ELT, lakehouse, Parquet, Spark, Kafka, dbt, orchestration, CDC, contrats et qualité des données | 93 |
| 12 | Sécurité | Prompt injection, OWASP, red teaming, secrets, moindre privilège, menaces propres aux agents | 37 |
| 13 | Éthique et droit | RGPD, CNIL, AI Act, droit d'auteur, deepfakes, biais, souveraineté, normes | 47 |
| 14 | Formation et certification | CPF, RS, RNCP, France Compétences, Qualiopi, FOAD, ingénierie pédagogique, certifications des éditeurs | 32 |

On n'ajoute pas de 15e catégorie. Un nouveau terme va dans la catégorie qui correspond à son usage principal dans la formation.

## Statistiques (5 novembre 2026)

**Répartition par niveau d'introduction**

| N1 | N2 | N3 | N4 | N5 | Total |
|---|---|---|---|---|---|
| 250 | 146 | 121 | 99 | 67 | **683** |

**Croisement catégorie × niveau**

| Catégorie | N1 | N2 | N3 | N4 | N5 |
|---|---|---|---|---|---|
| IA générale et multimédia | 43 | 4 | 1 | 0 | 0 |
| Machine learning et mathématiques | 18 | 2 | 3 | 28 | 1 |
| Deep learning | 6 | 0 | 0 | 26 | 0 |
| LLM et modèles de langage | 37 | 4 | 6 | 21 | 0 |
| Prompt engineering | 24 | 3 | 3 | 0 | 0 |
| API et développement | 19 | 21 | 63 | 2 | 0 |
| Agents et MCP | 12 | 6 | 16 | 0 | 0 |
| RAG et recherche sémantique | 0 | 24 | 5 | 0 | 1 |
| LLM locaux, matériel et MLOps | 5 | 25 | 2 | 9 | 0 |
| Automatisation | 18 | 16 | 0 | 0 | 0 |
| Data et data engineering | 7 | 10 | 7 | 7 | 62 |
| Sécurité | 11 | 5 | 15 | 4 | 2 |
| Éthique et droit | 35 | 10 | 0 | 2 | 0 |
| Formation et certification | 15 | 16 | 0 | 0 | 1 |

**Autres chiffres**
- 94 termes ont été ajoutés le 5 novembre 2026 (589 → 683). Ce sont les termes que les leçons expliquent en parenthèses, renvoient au lexique (« voir le lexique ») ou présentent dans les encadrés « Pré-requis express », et qui manquaient : centre de données, tenant, ERP, SIRH, terminal, localhost, HTTPS, reverse proxy, Pydantic, base64, JWT, offset Kafka, ACID, HMAC, NIR… Les entrées existantes n'ont pas changé, sauf 93 renvois `voirAussi` ajoutés vers ces nouveaux termes.
- 633 termes sont reliés à au moins une leçon (1 918 liens au total, 184 leçons distinctes citées). 50 termes n'ont aucune leçon associée : ils servent de référence, surtout dans la catégorie « Formation et certification » (Qualiopi, RS, FOAD…), qu'aucune leçon ne traite.
- 467 termes ont une source officielle et 216 n'en ont pas (le champ est alors omis).
- 2 077 renvois `voirAussi`, tous résolus.

## Méthode et maintenance

- **Calcul de `lecons`.** Chaque terme a une liste de motifs : le terme, son sigle, ses variantes en français et en anglais. Pour chaque leçon, on calcule un score : motif présent dans le titre du programme (+12), dans un intertitre (+4), en gras (+4), puis +1 par occurrence (plafonné à 12). Une leçon est retenue si son score atteint 5 **et** si le terme y est mis en valeur (titre, intertitre ou gras) ou y revient au moins 3 fois. On garde les 4 meilleures leçons, plus la première leçon retenue avec un score d'au moins 8, qui fixe le `niveau`. Cela fait au plus 5 leçons par terme.
- **Cas particuliers.** Quelques termes sont limités aux leçons de leur outil ou de leur niveau, pour écarter les faux positifs. C'est le cas des termes n8n et Make, des homonymes (DPO, watermark en streaming ou en marquage, top-k en génération ou en recherche, prefill) et des termes data propres au N5. Une courte liste de leçons de référence est ajoutée quand le terme y est expliqué en peu de mots (par exemple L001 pour « IA », L005 pour « tokenizer »). Elle n'est ajoutée que si le terme apparaît bien dans la leçon.
- **Leçons en cours de rédaction.** D'autres auteurs modifient les leçons et en ajoutent : les 184 leçons (L001 à L184) existent désormais ; les 94 termes ajoutés le 5 novembre 2026 ont été reliés à cette version. Après chaque vague de rédaction, il faut relancer la vérification. Ensuite, il faut recalculer les `lecons` des termes data du N5 (stockage objet, Data Vault, MapReduce, shuffle, Dask/Ray, time travel, feature store…), dont les leçons arrivent.
- **Vérification.** Lancer `python3 glossaire/verifier_glossaire.py`. Le script contrôle :
  - que le JSON est valide et que les champs sont complets, sans champ en trop ;
  - que les slugs sont uniques et en kebab-case ;
  - que les catégories appartiennent à la liste fermée et que les niveaux vont de N1 à N5 ;
  - que chaque définition compte 2 à 3 phrases ;
  - que chaque renvoi `voirAussi` pointe vers un slug existant ;
  - que chaque leçon citée existe à la fois dans `programme.json` et sur disque ;
  - que chaque URL de source figure dans `_recherche/` ou dans la bibliothèque ;
  - qu'il y a au moins 350 entrées.

  Il affiche aussi la répartition par catégorie et par niveau. Le code de sortie est 0 si tout est conforme.
- **Ajouter un terme.** Respecter les règles ci-dessus. Vérifier les `lecons` par une recherche (`grep -il "terme" niveaux/**/L*.md`), puis relancer le script de vérification.
- **Chiffres et dates.** Ils sont datés de novembre 2026 : reste à charge CPF, échéances de l'AI Act, sanctions. À revoir à chaque évolution réglementaire, notamment pour l'Omnibus numérique.
