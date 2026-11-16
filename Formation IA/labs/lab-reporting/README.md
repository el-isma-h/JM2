# Lab L058 — Reporting hebdomadaire automatisé (Mobidesk)

| | |
|---|---|
| Leçon liée | [L058 — Automatiser un reporting hebdomadaire](../../niveaux/N2-praticien/M13-donnees-et-analyse-avec-l-ia/L058-automatiser-un-reporting-hebdomadaire.md) (module M13, niveau 2) |
| Compétences | C2.4, C2.1 |
| Durée | 1 h 30 pour le workflow simulé et ses 6 tests + 1 h pour la version réelle (Sheets, Claude, Gmail, Slack) ; variante Python : 1 h 30 pour les 5 TODO |
| Prérequis | n8n (Docker ou Cloud) **ou** Python 3.10+ ; aucune clé pour démarrer |

## Objectif

Chaque lundi à 7 h 30, le directeur commercial de **Mobidesk** (PME fictive de Nantes) reçoit le CA de la semaine, la comparaison avec la semaine précédente, le cumul du semestre, le commercial et le produit en tête, et trois lignes de commentaire. Vous appliquez la règle d'or : **le code calcule, le modèle rédige, le code contrôle**. Un rapport dont un chiffre n'existe pas dans le JSON calculé n'est jamais envoyé à la direction : il part en relecture chez le responsable.

## Contenu

```
lab-reporting/
├── donnees/ventes_mobidesk_2026_S1.csv   les 24 lignes de la leçon L055 (CA total 33 500,00 €, avoir C-1016)
├── n8n/
│   ├── reporting-hebdo-simule.json       MODE SANS CLÉ : CSV intégré, rédaction simulée, contrôle, aiguillage
│   ├── reporting-hebdo.json              version réelle : Schedule, Google Sheets, Claude Haiku 5.5, Gmail, Slack
│   ├── alerte-reporting.json             workflow d'erreur (Error Trigger → Slack #ops)
│   └── code/                             le JavaScript des nœuds Code, lisible hors de n8n
│       ├── calcul-kpi.js                 indicateurs (+ bloc « affichage » déjà formaté)
│       ├── controle-chiffres.js          contrôle des chiffres recopiés
│       └── redaction-simulee.js          rédacteur sans clé, avec pannes volontaires
├── starter/                              VARIANTE PYTHON (optionnelle) : package reporting/ avec 5 TODO + tests pytest
├── solution/                             corrigé Python (mêmes tests, tous verts)
└── .env.example
```

## Démarrer en mode simulé (sans clé)

**n8n.** Lancez n8n (le `docker-compose.yml` du lab [`lab-n8n-support`](../lab-n8n-support/) suffit : `docker compose up -d n8n`, puis <http://localhost:5678>). *Workflows → Import from File* → `n8n/reporting-hebdo-simule.json`. Aucune credential n'est nécessaire : cliquez sur *Execute workflow*.

**Python.**

```bash
cd starter
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest                                     # 18 tests rouges au départ : chaque échec affiche le TODO
python -m reporting --date-ref 2026-06-29  # après les TODO : statut + rapport
python -m reporting --date-ref 2026-06-29 --panne faute_de_frappe   # le contrôle doit router vers le responsable
```

Le rédacteur simulé écrit comme un modèle obéissant ; ses **pannes** (`faute_de_frappe`, `arrondi`, `invente`, `signe` en Python) reproduisent les erreurs réelles d'un modèle qui recopie mal. Votre contrôle doit toutes les attraper.

## Énoncé

### A. Workflow n8n simulé : six tests (critères de la leçon)

Modifiez `date_ref` et `panne` dans le nœud **Paramètres**, exécutez, et notez la branche atteinte.

| # | `date_ref` | `panne` | Résultat attendu |
|---|---|---|---|
| 1 | `2026-06-29` | — | semaine du 22 au 28 juin : **1 078,20 €**, 2 443,00 €, **−55,9 %**, cumul **33 500,00 €** → *Diffusion direction* |
| 2 | `2026-05-04` | — | avoir C-1016 : **−349,00 €**, 1 110,00 €, **−131,4 %**, l'avoir est mentionné → *Diffusion direction* |
| 3 | `2026-08-03` | — | « Rapport non généré : Aucune ligne cette semaine… » → *Relecture responsable* |
| 4 | `2026-06-29` | `faute_de_frappe` | 1 087,20 détecté → *Relecture responsable* |
| 5 | `2026-06-29` | `arrondi` | « environ 1 100 € » détecté → *Relecture responsable* |
| 6 | `2026-06-29` | `invente` | 4 250,00 détecté → *Relecture responsable* |

Vérifiez à la main les quatre chiffres du test 1 avant tout (méthode T-S-E-C de la fiche M13).

> ⚠️ **Écart avec la leçon** — Le code de contrôle de la section 5 de L058, tel quel, signale à tort les numéros de section « 2. » et « 3. » imposés par le format du prompt (testé hors ligne : `chiffres_inconnus = [2, 3]` sur un texte fidèle). `n8n/code/controle-chiffres.js` retire ces numéros en début de ligne avant l'analyse. Le nœud KPI lit aussi la date dans **Paramètres** plutôt que dans `$env` (souvent bloqué par `N8N_BLOCK_ENV_ACCESS_IN_NODE`).

### B. Version réelle (`reporting-hebdo.json`)

1. Importez la feuille : `donnees/ventes_mobidesk_2026_S1.csv` dans Google Sheets, onglet `ventes`.
2. Importez `alerte-reporting.json`, puis `reporting-hebdo.json`. Créez les quatre credentials nommées dans la Sticky Note (Google Sheets, Anthropic, Gmail, Slack) : les exports de workflow ne contiennent que leur **nom**, jamais leur valeur.
3. Collez l'URL de la feuille dans **Lire la feuille ventes**, remplacez les destinataires (d'abord **vous seul**, pendant deux semaines).
4. *Settings → Error workflow* : « Lab L058 — Alerte reporting ». Désactivez la credential Google et lancez le test manuel : l'alerte doit arriver dans `#ops`.
5. Rejouez les tests 1 à 3 avec le vrai modèle (dans **Paramètres**). Puis lancez le défi de la leçon : supprimez la règle « recopiés tels quels » du prompt et comptez les montants reformulés que le contrôle attrape.
6. Activez le workflow ; videz `date_ref` (vide = aujourd'hui).

Les `typeVersion` des nœuds sont indicatifs : n8n les adapte à l'import. Avec **n8n 3.0** (27 oct. 2026, changements incompatibles), vérifiez les noms des nœuds et options sur votre version.

### C. Variante Python (optionnelle) : les 5 TODO

| TODO | Fichier | Ce que vous codez | Lien avec la leçon |
|---|---|---|---|
| 1 | `kpi.py` | `euros` et `pourcentage` : « 1 078,20 € », « −55,9 % » | formatage fait par le code, section 4 |
| 2 | `kpi.py` | `bornes_semaine` : lundi → dimanche précédents, à minuit | section 3 |
| 3 | `kpi.py` | `calculer_kpi` : semaines N et N−1, variation, avoirs, alerte semaine vide | sections 3 et 7 |
| 4 | `controle.py` | `controler` : montants et pourcentages absents du JSON (signe compris) | section 5 |
| 5 | `diffusion.py` | `decider` : `direction`, `responsable` ou `non_genere` | humain dans la boucle |

Ordre conseillé : 1 → 2 → 3 (`pytest -k "euros or pourcentage or bornes or kpi"`), puis 4 → 5, puis `pytest` entier.

## Mode réel (Python)

```bash
cp .env.example .env          # ANTHROPIC_API_KEY, puis SMTP_* et RAPPORT_TO / RESPONSABLE_TO pour l'envoi
export $(grep -v '^#' .env | xargs)
pip install "anthropic>=2.0"
LAB_MODE=reel python -m reporting --date-ref 2026-05-04 --json
```

`RedacteurClaude` appelle `claude-haiku-5-5` sans `temperature` (erreur 400 avec la version d'API `2026-10-21`, voir `_recherche/07-mise-a-jour-nov-2026.md`). Planification : `cron` (`30 7 * * 1`) ou le Planificateur de tâches Windows.

## Critères de réussite (repris de la leçon L058)

- Les quatre chiffres du test 1 sont exacts et recopiés tels quels dans le texte.
- Le test 2 mentionne explicitement l'avoir ; le test 3 ne produit aucun chiffre inventé.
- Aucun chiffre du rapport n'est calculé par le modèle (le JSON `kpi` contient tout).
- Le contrôle automatique et l'Error Trigger fonctionnent (preuve par capture).
- La note d'une demi-page chiffre le coût (≈ 0,0002 $ par rapport avec Haiku 5.5, nov. 2026) et nomme au moins deux contrôles humains.

Livrables : l'export JSON du workflow (ou le script), trois captures des trois rapports, la note (coût, contrôles humains, passage de Google Sheets à la vraie base de facturation).

## Mission documentation

1. **Schedule Trigger et workflows** — <https://docs.n8n.io/build-your-first-workflow.md> : comment un workflow est-il déclenché et activé, et quel réglage de fuseau horaire faut-il vérifier pour un déclenchement « lundi 7 h 30 » ?
2. **Nœuds IA de n8n** — <https://docs.n8n.io/build/integrate-ai/langchain-in-n8n.md> : quelle différence entre une *chain* (Basic LLM Chain) et un *AI Agent*, et pourquoi une chaîne suffit-elle ici ?
3. **Humain dans la boucle** — <https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools.md> : quel mécanisme met un workflow en pause jusqu'à une validation, et comment l'utiliseriez-vous à la place de l'e-mail de relecture ?

## Limites du mode simulé

Le rédacteur simulé ne se trompe que quand vous le lui demandez : il vérifie votre **plomberie** (calcul, contrôle, aiguillage), pas la discipline d'un vrai modèle. Mesurez celle-ci en mode réel, sur plusieurs semaines, en comptant les rapports routés vers la relecture.
