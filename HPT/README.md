# HPT — dossier de référence (créé le 10/11/2026)

Copie propre des projets HPT GIE. Les dossiers d'origine (`JM/SITE/hpt-gie`, `JM/Next …`) n'ont pas été modifiés ni supprimés.

```
HPT/
  site/     site vitrine + dashboard + charte commune + infra (copie de JM/SITE/hpt-gie, sans node_modules, .next ni _ancien)
  next/     les applications Next de référence (à compléter : voir docs/AUDIT-2026-11-10.md)
  docs/     audits et comptes rendus
```

## Lancer le site et le dashboard

```
cd ~/Desktop/JM/HPT/site
./lancer.sh
```

Site : http://localhost:3000 — Dashboard : http://localhost:3001

## Liens du site vers les Next

L'adresse de chaque Next se règle à un seul endroit : `site/packages/charte/src/next.ts`, champ `site`.
Un Next sans champ `site` n'affiche pas de bouton « Accéder » sur sa fiche.
