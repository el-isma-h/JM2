# Tutoriel C — NotebookLM : l'assistant personnel sourcé (10 min)

Reprend la section 3 de la leçon L048. Aucune clé, aucune installation : un compte Google suffit. Les documents du lab sont fictifs et sans données personnelles ; pour vos propres documents d'entreprise, relisez d'abord la section 3.3 de la leçon (compte Google Workspace administré, conditions en vigueur).

## Pas à pas

1. Ouvrez <https://notebooklm.google.com> et créez un carnet « Lacombe — Procédures ».
2. **Ajoutez les sources** : glissez-déposez les 9 fichiers de `documents/`. Si le format `.md` est refusé sur votre offre, renommez-les en `.txt` ou collez leur texte (*Copied text*). Les limites (nombre de sources, taille) dépendent de l'offre : consultez l'aide officielle.
3. Lisez le **résumé automatique** de chaque source : un résumé vide ou hors sujet signale un problème d'extraction.
4. Posez les 10 questions de `questions-test.json` dans le chat. Cliquez sur les **numéros de citation** : le passage surligné doit être celui de la `source_attendue`.
5. Testez la restriction des sources : décochez tout sauf `grille-tarifaire-2026.md` et reposez Q05 (TVA).
6. *Studio* : générez une **FAQ** à partir des 9 documents ; comparez-la à `faq-interne.md`. Elle peut servir pour l'accueil d'un apprenti.
7. Notez le temps total de mise en place dans `grille-resultats.csv` (colonne *remarque*).

## Ce que vous ne pourrez pas régler

Ni le découpage, ni le nombre de passages, ni le modèle, ni l'hébergement. Si une réponse est incomplète, vos seuls leviers sont de **reformuler** et de **réduire les sources actives**. Il n'y a ni API ni intégration dans un workflow : pour le cas « réponse préparée à chaque e-mail client », c'est n8n.
