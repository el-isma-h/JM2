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
