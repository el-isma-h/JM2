# Checklist de mise en production — Compta-Chat (lab L105)

Reprise de la section 4 de la leçon L105. Cochez chaque ligne **avec une preuve** (capture, commande, lien de trace). Les lignes ⛔ sont **éliminatoires** : seuil de validation 70/100 et aucune ligne ⛔ en échec.

La colonne « Dans le squelette » indique ce que le lab fournit déjà et ce qui reste à construire (L101 à L104).

| Domaine | Contrôle | Preuve attendue | Dans le squelette | Fait |
|---|---|---|---|---|
| Sécurité | ⛔ Aucune clé dans le dépôt, l'historique Git ou une variable `NEXT_PUBLIC_*` | `git log -p \| grep -n "sk-ant-"` vide ; recherche dans `.next/static` | `lireConfig` refuse `NEXT_PUBLIC_*=sk-…` ; `.gitignore`, `.dockerignore` | [ ] |
| Sécurité | ⛔ Toutes les routes `/api/*` (sauf `/api/health`) renvoient 401 sans session | `curl -s -o /dev/null -w "%{http_code}" -X POST https://…/api/chat` → `401` | jeton de démonstration (à remplacer par une vraie session, L101) | [ ] |
| Sécurité | Taille des messages, profondeur d'historique, `maxOutputTokens` plafonnés | test 413 ; extrait de `validation.ts` | `MAX_CARACTERES`, `MAX_MESSAGES`, `MAX_OUTPUT_TOKENS` | [ ] |
| Sécurité | Clés distinctes par environnement (dev, preview, prod), rotation documentée | captures de la Console (noms des clés) | à faire | [ ] |
| Coûts | Quota par utilisateur et budget global bloquants ; alerte à 80 % du budget | test 429 et 503 ; journal `appel_llm` avec `alerteBudget` | en mémoire (`quota.ts`) ; à persister (table `appels_llm`, L102) | [ ] |
| Coûts | Prompt caching actif sur le préfixe stable | `cache_read_input_tokens` > 0 dans un journal `appel_llm` dès la 2ᵉ question | `cache_control` sur le prompt système (mode réel) | [ ] |
| Fiabilité | Timeouts à chaque étage, `retry-after` respecté, modèle de repli testé | journal d'un 429 simulé | timeout 90 s (fournisseur), Caddy `response_header_timeout` ; repli à ajouter | [ ] |
| Fiabilité | Jobs idempotents (clé d'unicité, écriture atomique) | double envoi → un seul job | hors périmètre du squelette (worker pg-boss, L102) | [ ] |
| Fiabilité | Sauvegarde quotidienne hors serveur et restauration testée | durée de restauration mesurée | à faire dès qu'une base est ajoutée (`sauvegarde.sh` de la leçon) | [ ] |
| Observabilité | ⛔ Traces collectées en production (modèle, tokens, coût, latence, outils, `promptVersion`) | lien vers une trace Langfuse | journal JSON sur la sortie standard ; Langfuse à brancher (L103) | [ ] |
| Observabilité | Feedback utilisateur relié aux traces ; rétention 30 jours ; masquage | paramètres du projet Langfuse | à faire | [ ] |
| Qualité | ⛔ Suite d'évaluation automatisée bloquante en CI (taux, coût, latence, cas critiques) | pull request rouge puis verte | tests vitest sans LLM (exécutés dans le `Dockerfile`) ; promptfoo à ajouter (L104) | [ ] |
| Qualité | Jeu de test alimenté par les traces réelles (≥ 30 cas) | fichier `tests/` versionné | à faire | [ ] |
| Déploiement | ⛔ Application accessible en HTTPS avec un compte de démonstration | URL + jeton pour le jury | `docker compose --profile https up -d` + `Caddyfile.exemple` | [ ] |
| Déploiement | Retour arrière exécuté une fois et chronométré (< 5 min) | journal de la commande | `IMAGE_TAG=<sha> docker compose up -d --no-build app` | [ ] |
| RGPD | Registre des traitements mis à jour ; région UE ; information des utilisateurs | fiche de traitement (voir M23) | à faire | [ ] |
| Exploitation | README : installation, variables, déploiement, retour arrière, contacts | fichier dans le dépôt | README du lab à adapter | [ ] |

## Contrôles rapides avant la soutenance

```bash
URL=https://assistant.exemple.fr          # votre domaine
curl -s $URL/api/health                   # {"statut":"ok","version":"<sha>",...} : le SHA du commit déployé
curl -s -o /dev/null -w "%{http_code}\n" -X POST $URL/api/chat -d '{}'               # 401
curl -sN -X POST $URL/api/chat -H "authorization: Bearer $DEMO_TOKEN" \
     -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"Bonjour"}]}'   # mot à mot
curl -sN -X POST $URL/api/chat -H "authorization: Bearer $DEMO_TOKEN" \
     -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"#panne"}]}'    # message propre
docker compose logs app | grep '"type":"appel_llm"' | tail -3    # coût, tokens, promptVersion
```

## Journée du chaos (défi de la leçon, section 3.6)

| Incident provoqué | Ce que voit l'utilisateur | `/api/health` | Journal | Retour à la normale |
|---|---|---|---|---|
| Question contenant `#panne` (fournisseur qui tombe en plein flux) | | | | |
| Clé Anthropic révoquée (mode réel) | | | | |
| 50 questions en 10 secondes avec le même jeton | | | | |
| `DEMO_TOKEN` supprimé de `.env` puis redémarrage | | | | |

Un message « Service momentanément indisponible, réessayez dans une minute » vaut 10 points ; une page blanche, zéro.
