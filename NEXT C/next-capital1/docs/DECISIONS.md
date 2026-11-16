# Décisions (16/10/2026)

Validées par Nika :
- Nom **NEXT Capital**, token **NXT**, sous-titre « Fonds d'investissement tokenisé ».
- Un seul token général (pas un token par deal) ; blockchain simulée pour l'instant (registre interne), ERC-20 prévu plus tard.
- Quatre thèses : Sport, IA, Quantique, Agroalimentaire. Canaux : Y Combinator, Europe multi-stage, deals internes, réseaux Luxembourg et Miami, réseau d'experts.
- Ticket d'entrée 1 500 € (initialement 5 000 €, abaissé par Nika), par paliers.
- Modèle économique calqué sur Blast : adhésion annuelle Bronze 1 500 / Silver 2 000 / Gold 3 000 / Platinum 5 000 / Diamond 10 000 € ; plafonds 10 k / 25 k / 50 k / 100 k / illimité par an ; frais de structuration 5 / 5 / 4 / 4 / 3 % ; 1 à 2 % de frais de gestion annuels ; 20 % sur la plus-value ; bons de priorité 0 / 0 / 1 / 2 / 3.
- Statuts par capital investi : Membre 1 500 €, Partenaire 10 000 €, Associé 25 000 €, Club 50 50 000 € (dîners réguliers), Cercle 100 100 000 € (dîners privés).
- Pas de marché secondaire.
- KYC complet avant ouverture : questionnaire + pièces, validation manuelle par l'admin.
- Dépôts : SEPA, carte / Apple Pay (Stripe), crypto.
- Design V1 institutionnel (BlackRock, bleu nuit / or / serif) remplacé le 16/10 au soir, à la demande de Nika, par un design « beaucoup plus tech » repris du style de nikaholding.world, avec un code couleurs propre à NEXT Capital (voir ci-dessous).
- 8 langues : FR, EN, AR, JA, KO, ZH, IT, ES.
- Chatbot d'orientation (Grok xAI, clé en `.env`).
- Stack : Next.js 15, React 19, Tailwind 4, Motion, SQLite (better-sqlite3), Stripe, bcryptjs.

Choix techniques pris par Claude (modifiables) :
- 1 NXT = 10 € à l'émission ; pas de souscription 500 €.
- Adhésion réglée depuis le wallet (débit tracé) plutôt que par paiement séparé.
- Pièces KYC acceptées : PDF, JPG, PNG ≤ 8 Mo ; servies uniquement au propriétaire et aux admins.
- E-mails journalisés en base (aucun SMTP).
- Sessions en base (cookie httpOnly 7 jours).
- Toutes les pages en rendu dynamique (session dans l'en-tête).

## Design V2 (16/10/2026, soir) : style nikaholding.world, code couleurs NEXT
- Grammaire reprise de NIKA Holding : alternance de sections pleine hauteur encre / os, titres géants Archivo en capitales très serrées, numéros en filigrane (01 … 04), étiquettes JetBrains Mono espacées, accroches Cormorant italique, boutons rectangulaires sans arrondi, aucune ombre, cartes = bordures 1 px, intro à bandes obliques colorées (une fois par session), filet de six traits colorés sous le monogramme.
- Code couleurs NEXT Capital (`src/config/couleurs.ts`, `globals.css`) : encre #0A0B0D, encre-2 #121418, os #F3F0E8, os-2 #EAE6DC, graphite #5C5B61, pierre #8E8B83, **signal #19E07A** (accent principal : token, actions, chiffres clés), lime #D8FF3D (manifeste), rouge #E5484D, ambre #F5B700.
- Couleurs des thèses : IA cyan #00D1FF, Quantique violet #7A3BFF, Agroalimentaire vert #3FD66B, Sport orange #FF5A1F. Elles forment les bandes de l'intro et du hero, les filets des deals et des fiches thèses.
- Typographies : Archivo Variable (titres), Inter Variable (texte), JetBrains Mono Variable (étiquettes, références, tableaux), Cormorant Garamond Variable italique (accroches). Toutes via @fontsource, aucune requête externe.
- Accueil restructuré : hero plein écran avec bandes, 4 chiffres, manifeste court, une section par thèse avec filigrane et titre géant, canaux en grille à bordures, parcours, manifeste final sur fond lime.
- Logo : monogramme « N » filaire avec carré signal, texte « NEXT Capital » en Archivo capitales.
- Écrans internes (candidature, espace investisseur, admin, chatbot) alignés sur la même grammaire ; aucune fonctionnalité ni texte modifié.

## Études de marché (16/10/2026, soir)
- Demande de Nika : études de marché par thèse avec les sources BlackRock, J.P. Morgan, Morgan Stanley, Goldman Sachs.
- Données dans `src/config/marches.ts` : par thèse, une synthèse, 4 à 6 chiffres clés (chacun lié à sa publication et sa date), la liste des publications analysées (étiquetées « chiffrée » ou « qualitative »), et la lecture qu'en fait NEXT Capital. Textes FR et EN ; les autres langues affichent l'anglais.
- Page `/marches` (nav « Marchés », pied de page), bloc compact sur chaque thèse de `/theses`, lien depuis l'accueil, contexte ajouté au chatbot.
- Règle : aucun chiffre hors de ces publications ; quand une maison n'a rien publié de chiffré (BlackRock sur le sport, Goldman Sachs sur le quantique), c'est écrit.
- Avertissement affiché : institutions non partenaires, contenu non validé par elles, chiffres reproduits tels que publiés, pas une prévision du fonds.

## Design V3 (16/10/2026, nuit) : structure et animations k8cap.com, DA conservée
- Demande de Nika : s'inspirer de la structure et des animations de k8cap.com pour un rendu plus institutionnel et plus léger, en gardant la DA V2 (encre / os / signal / couleurs de thèses, Archivo / Inter / Mono / Cormorant), avec une expérience utilisateur optimale.
- Écran d'entrée plein cadre : fond ambiant animé en canvas 2D (`FondAmbiant`, nappes de couleurs qui dérivent, zéro média), titre centré fin et espacé, accroche serif, un seul bouton « Découvrir ». L'intro à bandes obliques (V2) et le hero à bandes ne sont plus affichés ; les fichiers `Intro.tsx` et `HeroVisuel.tsx` restent dans le projet, non utilisés.
- Défilement lissé Lenis (`DefilementLisse`), désactivé sur candidature / compte / admin / connexion et si mouvement réduit.
- Section thèses épinglée (`ThesesEpinglees`) : 4 panneaux superposés, fond en fondu vers une teinte profonde de chaque thèse (`FOND_THESE`), illustration filaire tracée par thèse (`IllustrationThese` : réseau, orbitales, parcelles, trajectoires), indicateur de progression ; empilement simple sur mobile et en mouvement réduit.
- Décor : cercles concentriques filaires tracés à l'apparition (`Cercles`) sur l'intro et les en-têtes de pages intérieures, à la place des filigranes numérotés géants.
- Typographie : titres en Archivo **fin (300) et espacés (+6 à +8 %)**, à la K8, au lieu du gras serré ; intros centrées en Cormorant.
- En-tête minimal (logo · connexion · [Menu]) en `mix-blend-difference` (lisible sur fonds clairs et sombres), menu plein écran encre avec liens centrés, connexion, candidature, langues, filet de marque ; fermeture à Échap.
- Transitions de page en fondu (`TransitionPage`), survols 0,5 s en courbe `cubic-bezier(0.165, 0.84, 0.44, 1)`, focus visible signal.
- Appel final en carte à coins arrondis (28 px, seul arrondi autorisé) sur fond ambiant ; pied de page encre avec monogramme géant.
- Espace investisseur et admin : inchangés (hors en-tête, pied de page et titres plus légers partagés).
- Correctif de fond découvert par les tests : le bouton « → » du formulaire de candidature pouvait soumettre le formulaire au passage à la dernière étape (réutilisation du nœud DOM par React) ; corrigé par des clés distinctes et `preventDefault`.

## SEO technique (16/10/2026)
- URL publique lue uniquement dans `NEXT_PUBLIC_SITE_URL` (`src/lib/seo.ts`) : `metadataBase`, canonical, hreflang, sitemap, JSON-LD. Aucun domaine dans le code (repli `http://localhost:3000` si la variable est absente).
- `NEXT_PUBLIC_ALLOW_INDEXING` (défaut `false`) : tant qu'elle ne vaut pas exactement `true`, toutes les pages sont `noindex, nofollow` (balise et en-tête `X-Robots-Tag`) et `robots.txt` répond `Disallow: /`. Raison : démonstration d'un produit financier non agréé.
- Variable à `true` : pages publiques indexables ; `robots.txt` bloque `/api/`, `/*/admin`, `/*/compte` (wallet, simulation de paiement), `/*/connexion`, `/*/candidature/merci` et déclare le sitemap ; ces espaces gardent `noindex` (métadonnées des layouts `compte` et `admin`, en-tête `X-Robots-Tag`).
- Métadonnées par page et par langue (`src/i18n/seo.ts`) : titre au gabarit « … · NEXT Capital », description de 140 à 160 caractères (plus courte en JA/KO/ZH), canonical, hreflang des 8 langues + `x-default` (français), Open Graph (`og:locale` fr_FR, en_GB, ar_AE, ja_JP, ko_KR, zh_CN, it_IT, es_ES) et Twitter. Aucune promesse de rendement ; risque de perte en capital mentionné sur accueil, fonds, token, adhésion, deals, risques.
- Image de partage générée (`src/app/[locale]/opengraph-image.tsx`, `twitter-image.tsx`, `src/lib/image-partage.tsx`), 1200 × 630, texte latin (anglais pour AR/JA/KO/ZH, la police par défaut de next/og ne couvrant pas ces écritures).
- `sitemap.xml` : 15 pages publiques + fiches deals, dans les 8 langues, avec alternates.
- JSON-LD : Organization + WebSite (accueil, nom, URL et description uniquement), FAQPage (FAQ), BreadcrumbList (fiches deals).
- Un seul `h1` par page : la fiche deal utilise désormais `TitreGeant niveau="h1"`.
- Polices conservées via `@fontsource-variable` (auto-hébergées, aucune requête externe) plutôt que `next/font` : même bénéfice de confidentialité et de performance, sans perdre les sous-ensembles `unicode-range`.
- Aucune image matricielle dans le site (SVG décoratifs en `aria-hidden`) : `next/image` sans objet pour l'instant.
- Docker : `Dockerfile` multi-étapes (node:22-bookworm-slim, compilation de better-sqlite3, `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_ALLOW_INDEXING` en arguments de build, volume `/app/data`).
