# Lab L083 — Le même assistant, porté sur OpenAI

| | |
|---|---|
| Leçon liée | [L083 — Projet : le même assistant, porté sur OpenAI](../../niveaux/N3-developpeur/M18-api-openai/L083-projet-le-meme-assistant-porte-sur-openai.md) (module M18, niveau 3) |
| Compétences | C3.1, C3.2 |
| Durée | 2 h 30 pour les 7 TODO + 1 h 30 pour le mode réel, `couts.py` et la note à la gérante |
| Prérequis | Python 3.10+ ; avoir lu L077 (ou le lab `lab-claude-devis`) ; aucune clé pour démarrer |

## Objectif

Faire tourner l'assistant devis de la **Menuiserie Dupont** (Nantes) sur la **Responses API** d'OpenAI **sans changer son comportement ni ses tests**. La logique métier (`devis_core.py`), la boucle neutre (`assistant.py`) et l'adaptateur Claude (`fournisseur_anthropic.py`, la version M17) sont fournis ; vous écrivez l'adaptateur OpenAI, le calcul de coûts et le harnais des 20 cas. Le portage est réussi quand **les mêmes 20 tests passent sur les deux fournisseurs**.

## Contenu

```
lab-openai-portage/
├── donnees/
│   ├── catalogue.json         8 articles + grille de pose (fictifs)
│   └── cas_tests.jsonl        20 demandes et leurs devis attendus (lignes, TVA, total TTC, questions)
├── python/                    STARTER : 7 TODO
│   └── portage/
│       ├── devis_core.py            métier NEUTRE (fourni, n'importe aucun SDK)
│       ├── fournisseur_anthropic.py version Claude M17 (fournie, point de comparaison)
│       ├── fournisseur_openai.py    ← TODO 1 à 5
│       ├── couts.py                 ← TODO 6
│       ├── evaluer.py               ← TODO 7 (harnais 20 cas, seuil 18/20)
│       ├── assistant.py             boucle neutre + CLI
│       └── simulation.py            FauxOpenAI / FauxAnthropic (mode sans clé, STRICTS sur le format)
├── solution/python/           corrigé (mêmes tests, tous verts)
└── .env.example
```

## Démarrer (sans clé)

```bash
cd python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest                                    # 13 tests rouges sur 14 au départ (le 14e vérifie le faux client)
python -m portage.evaluer --fournisseur anthropic    # échoue tant que TODO 6-7 ne sont pas faits
```

Les faux clients rejettent, comme les vraies API, les erreurs classiques du portage : `function_call_output` enveloppé dans un rôle `user`, appel de fonction sans résultat, outils au format Anthropic (`input_schema`) envoyés à OpenAI, `max_tokens` absent chez Anthropic. Vous verrez donc les mêmes erreurs « 400 » qu'en vrai, sans payer.

## Énoncé : les 7 TODO

| TODO | Où | Ce qui change par rapport à la version Claude (section 4.3 de la leçon) |
|---|---|---|
| 1 | `traduire_outils` | `input_schema` → `parameters`, `type: "function"`, `strict: True` |
| 2 | `FournisseurOpenAI.lire_flux` | événements `response.output_text.delta` → `response.completed` (au lieu de `content_block_delta`) |
| 3 | `FournisseurOpenAI.tour` | `json.loads(arguments)` (chaîne JSON) ; item `function_call_output` **sans rôle** ; tous les appels parallèles |
| 4 | `FournisseurOpenAI.generer_devis` | `responses.parse(..., text_format=Devis, tool_choice="none")` |
| 5 | `normaliser_usage` | `input_tokens` **inclut** `cached_tokens` chez OpenAI (l'inverse d'Anthropic) |
| 6 | `couts.cout_usage` | tarifs entrée / cache / écriture / sortie, par modèle |
| 7 | `evaluer.comparer` | lignes en multiensemble, tolérance 0,01 € sur les montants, questions en suspens |

Étapes : (1) TODO 1 à 5 → `pytest -k "traduction or flux or appels or iterations or generer or usage"` ; (2) TODO 6 et 7 → `pytest` entier vert ; (3) `python -m portage.evaluer --fournisseur openai` puis `--fournisseur anthropic` : même score, même devis ; (4) mode réel.

## Mode réel

```bash
cp .env.example .env    # renseignez OPENAI_API_KEY (et ANTHROPIC_API_KEY pour la comparaison)
export $(grep -v '^#' .env | xargs)
pip install "openai>=2" "anthropic>=2.0"
LAB_MODE=reel python -m portage.evaluer --fournisseur openai --modele gpt-6.1-sol --sortie usages-sol.json
LAB_MODE=reel python -m portage.evaluer --fournisseur openai --modele gpt-6.1-terra
LAB_MODE=reel python -m portage.evaluer --fournisseur openai --modele gpt-6-luna
python -m portage.couts usages-sol.json gpt-6.1-sol
```

Consignez les trois scores et coûts dans votre note. Point RGPD à documenter : la Responses API stocke les réponses par défaut (`store=True`) ; décidez s'il faut passer `store=False` et ne pas utiliser `previous_response_id`.

## Critères de réussite (repris de la leçon L083)

- Aucune clé en code (variables d'environnement uniquement).
- Les tests passent à **≥ 18/20** sur au moins une configuration OpenAI.
- La boucle gère les appels parallèles et borne les itérations.
- Le JSON du devis est validé (Pydantic) **et** contrôlé arithmétiquement (`controle_metier`).
- Le coût calculé à partir de `usage` est cohérent avec le tableau de la section 6 (ordre de grandeur : 0,01 $ par devis avec cache sur Sol / Sonnet).
- Une note d'une page compréhensible par une non-développeuse : modèle recommandé, coût mensuel, point RGPD (`store`), plan de retour vers Claude. Bonus : `FOURNISSEURS.md` listant les différences sémantiques (stockage, cache, refus, limites de débit).

## Mission documentation

1. **Migrer vers la Responses API** — <https://developers.openai.com/api/docs/guides/migrate-to-responses> : quelle est la valeur par défaut de `store`, et que change `previous_response_id` dans ce qu'il faut renvoyer à chaque tour ?
2. **Function calling** — <https://developers.openai.com/api/docs/guides/agents-api/tools/functions> : sous quelle forme arrivent les `arguments` d'un `function_call`, et quel champ relie un `function_call_output` à son appel ?
3. **Tarifs OpenAI** — <https://developers.openai.com/api/docs/pricing> : relevez les prix entrée / entrée en cache / sortie de `gpt-6.1-sol`, `gpt-6.1-terra` et `gpt-6-luna`, et comparez-les à `TARIFS` dans `couts.py` (corrigez si la page a changé, en notant la date).

## Limites du mode simulé

Les faux clients appliquent une politique déterministe : ils vérifient votre **plomberie** (traduction, boucle, appels parallèles, format, coûts), pas la qualité d'un modèle. Le score réel (≥ 18/20) se mesure en mode réel.
