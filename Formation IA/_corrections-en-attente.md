# Corrections en attente — leçons verrouillées (M13 à M17, N5)

Corrections issues de `_recherche/07-mise-a-jour-nov-2026.md` (section 4) qui concernent des leçons en cours d'édition par d'autres agents (M13 à M17, L055 à L077, et `niveaux/N5-data-engineering/`). **Rien n'a été écrit dans ces leçons.** Chaque entrée donne le texte exact à rechercher (vérifié présent une seule fois le 5 novembre 2026) et son remplacement. Avant d'appliquer, revérifier que le texte à rechercher est toujours présent : un autre agent a pu le modifier entre-temps.

Les `quiz.json` de ces modules ont été corrigés directement (C1 : M17-Q04) ; voir `_corrections-appliquees-nov-2026.md`.

## A1 — C2

- **Fichier** : `niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/L068-messages-api-requetes-roles-parametres-modeles.md`
- **Source** : _recherche/07 P1 — référence API : « Consecutive user or assistant turns in your request will be combined into a single turn »

**Texte actuel à rechercher** (occurrence unique) :

````text
sont fusionnés par l'API en un seul tour (comportement à vérifier sur la page « Using the Messages API »)
````

**Texte de remplacement** :

````text
sont fusionnés par l'API en un seul tour
````

## A2 — C5

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C5 — https://platform.claude.com/docs/en/api/migration-2026-10-21

**Texte actuel à rechercher** (occurrence unique) :

````text
| `x-api-key` | votre clé | Authentification. Anthropic utilise un en-tête dédié ; OpenAI et xAI utilisent `Authorization: Bearer <clé>` |
````

**Texte de remplacement** :

````text
| `x-api-key` | votre clé | Authentification. En HTTP brut, Anthropic utilise un en-tête dédié ; les SDK v2 (21/10/2026, licence Apache 2.0) envoient `Authorization: Bearer`, ce qui compte si un proxy lit `X-Api-Key`. OpenAI et xAI utilisent `Authorization: Bearer <clé>` |
````

## A3 — C5

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C5 — migration 2026-10-21

**Texte actuel à rechercher** (occurrence unique) :

````text
| Authentification | `x-api-key` | `Authorization: Bearer` |
````

**Texte de remplacement** :

````text
| Authentification | `x-api-key` (HTTP brut ; `Authorization: Bearer` via les SDK v2) | `Authorization: Bearer` |
````

## A4 — C5

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L065-python-et-typescript-pour-l-ia-environnement-sdk-cles-api-se.md`
- **Source** : _recherche/07 C5 — migration 2026-10-21

**Texte actuel à rechercher** (occurrence unique) :

````text
et sont désormais sous licence **Apache 2.0**.
````

**Texte de remplacement** :

````text
et sont désormais sous licence **Apache 2.0** ; ils s'authentifient avec `Authorization: Bearer` au lieu de `X-Api-Key` (en HTTP brut, `x-api-key` reste l'en-tête documenté), ce qui compte si un proxy lit `X-Api-Key`.
````

## A5 — C6

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C6 — https://platform.claude.com/docs/en/api/errors

**Texte actuel à rechercher** (occurrence unique) :

````text
| Non : vérifiez `ANTHROPIC_API_KEY` | `AuthenticationError` |
````

**Texte de remplacement** :

````text
| Non : vérifiez `ANTHROPIC_API_KEY` | `AuthenticationError` |
| 402 | `billing_error` | Problème de facturation ou de paiement du compte | Non : réglez la facturation dans la Console | à vérifier dans le README du SDK |
````

_Le texte à rechercher inclut le saut de ligne final ; le remplacement aussi._

## A6 — C6

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C6 — https://platform.claude.com/docs/en/api/errors

**Texte actuel à rechercher** (occurrence unique) :

````text
| Modèle ou ressource inexistants (faute de frappe dans l'ID) | Non | `NotFoundError` |
````

**Texte de remplacement** :

````text
| Modèle ou ressource inexistants (faute de frappe dans l'ID) | Non | `NotFoundError` |
| 409 | `conflict_error` | Conflit avec l'état de la ressource visée | Selon le cas (le SDK le réessaie, voir ci-dessous) | à vérifier dans le README du SDK |
````

_Le texte à rechercher inclut le saut de ligne final ; le remplacement aussi._

## A7 — C6

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C6

**Texte actuel à rechercher** (occurrence unique) :

````text
| Non : réduisez | `RequestTooLargeError` |
````

**Texte de remplacement** :

````text
| Non : réduisez | `RequestTooLargeError` (à vérifier dans le README du SDK) |
````

## A8 — C6

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C6 — https://platform.claude.com/docs/en/api/errors

**Texte actuel à rechercher** (occurrence unique) :

````text
| Erreur interne côté Anthropic | Oui, avec backoff | `InternalServerError` |
````

**Texte de remplacement** :

````text
| Erreur interne côté Anthropic | Oui, avec backoff | `InternalServerError` |
| 504 | `timeout_error` | Délai de traitement dépassé côté Anthropic | Oui, avec backoff | à vérifier dans le README du SDK |
````

_Le texte à rechercher inclut le saut de ligne final ; le remplacement aussi._

## A9 — C6

- **Fichier** : `niveaux/N3-developpeur/M16-fondations-de-developpement-pour-l-ia/L066-http-json-streaming-anatomie-d-un-appel-a-un-llm.md`
- **Source** : _recherche/07 C6

**Texte actuel à rechercher** (occurrence unique) :

````text
| **Oui**, avec backoff | `OverloadedError` |
````

**Texte de remplacement** :

````text
| **Oui**, avec backoff | `OverloadedError` (à vérifier dans le README du SDK) |

Seule la classe `anthropic.NotFoundError` est citée par la page officielle *Errors* ; les autres noms de classes de ce tableau sont à vérifier dans le README du SDK.
````

_Le texte à rechercher inclut le saut de ligne final ; le remplacement aussi._

## A10 — C8

- **Fichier** : `niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/L075-mcp-construire-un-serveur-et-un-client.md`
- **Source** : _recherche/07 P3 — https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28

**Texte actuel à rechercher** (occurrence unique) :

````text
(à consulter en ligne ; version stable 2025-11-25, révision 2026-07-28).
````

**Texte de remplacement** :

````text
(à consulter en ligne ; version stable actuelle 2026-07-28, version stable précédente 2025-11-25).
````

## A11 — C8

- **Fichier** : `niveaux/N3-developpeur/M17-api-anthropic-construire-avec-claude/L075-mcp-construire-un-serveur-et-un-client.md`
- **Source** : _recherche/07 P3

**Texte actuel à rechercher** (occurrence unique) :

````text
— spécification 2025-11-25, à vérifier si une nouvelle version stable est publiée.
````

**Texte de remplacement** :

````text
— spécification 2025-11-25 ; la version stable actuelle est 2026-07-28 (28 juillet 2026) : vérifiez si cette section a changé.
````

## Déjà traité par un autre agent (constaté le 5 novembre 2026)

- **C8 — `L075` l. 74** : l'encadré « 📌 Précision (nov. 2026) » présente déjà `2026-07-28` comme version stable actuelle, avec les changements clés. Rien à faire.

## Non appliqué : hors du périmètre demandé (ni leçon, ni quiz, ni examen)

- **C8 — `niveaux/N1-fondamentaux/M06-introduction-a-l-automatisation-et-aux-agents/module.json` l. 134-135** : source « MCP — spécification 2026-07-28-RC (GitHub) » → remplacer par `"title": "MCP — spécification 2026-07-28, release stable (GitHub)"`, `"url": "https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28"` (la leçon L027 a été mise à jour dans ce sens).
- **C19 — `_recherche/05`** : « décret 2026-127 du 26 février 2026 » → « décret n° 2026-127 du 24 février 2026 » (plafond annuel de 1 500 € pour le RS, hors CléA). `referentiel/dossier-rs-france-competences.md` l. 249 porte déjà la bonne date.
- **C20 — `referentiel/dossier-rs-france-competences.md` l. 277 et 370, `_recherche/05`** : « Qualiopi V10 » → « Référentiel national qualité actualisé (décret n° 2026-728 du 1er août 2026, arrêté du 28 octobre 2026), guide de lecture V10 » ; 33 indicateurs dont le n° 33 réservé aux CFA ; seuils des indicateurs 19 et 20. Aucune occurrence dans les leçons.

## Proposition optionnelle (non appliquée)

- **C26 — `L068` ou `L070`** : ajouter un encadré sur les *message threads* (bêta du 2/11/2026, en-tête `message-threads-2026-08-12`) : l'API garde la conversation côté serveur et l'on n'envoie plus que les nouveaux messages ; le fil expire 5 min après la dernière requête et est supprimé au plus tard 1 h après. Source : https://platform.claude.com/docs/fr/build-with-claude/message-threads
