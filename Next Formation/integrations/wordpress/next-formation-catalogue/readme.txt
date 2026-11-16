=== Next Formation : catalogue ===
Contributors: nextformation
Tags: formation, catalogue, qualiopi, organisme de formation
Requires at least: 5.8
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later

Affiche sur votre site WordPress le catalogue public de votre organisme de formation géré dans Next Formation.

== Description ==

Le plugin lit l'API publique en lecture seule de votre instance Next Formation :

* JSON : https://votre-instance/api/public/{organisme}/catalogue?famille=...
* XML : https://votre-instance/api/public/{organisme}/catalogue.xml
* Widget : https://votre-instance/embed/catalogue/{organisme}?famille=...

Seules les formations publiées (case « publier sur le catalogue public ») et actives apparaissent, avec
leur version de programme active et les sessions publiées à venir. Aucune donnée personnelle n'est transmise.

== Installation ==

1. Copiez le dossier next-formation-catalogue dans wp-content/plugins, puis activez le plugin.
2. Réglages, Next Formation : renseignez l'URL de l'instance (ex. https://app.votre-instance.fr) et
   l'identifiant d'organisme : le slug de votre catalogue public (fin de l'adresse /catalogue-public/...)
   ou l'identifiant (UUID) de l'organisme si votre compte en gère plusieurs.
3. Ajoutez le shortcode dans une page.

== Shortcode ==

[next_formation_catalogue]
  Tout le catalogue, rendu en HTML par WordPress (mis en cache).

[next_formation_catalogue famille="Bureautique"]
  Une seule famille (catégorie de formation saisie dans Next Formation, casse et accents indifférents).

[next_formation_catalogue mode="iframe" hauteur="900"]
  Le widget de l'instance dans une iframe, hauteur ajustée automatiquement.

== Cache ==

La réponse de l'API est conservée dans un transient (30 minutes par défaut, réglable de 5 à 1440).
Une copie de secours est gardée 7 jours : si l'instance est momentanément injoignable, la dernière
version connue s'affiche. Le bouton « Vider le cache » des réglages force une relecture.

== Personnalisation ==

Copiez un fichier du dossier templates/ dans {votre-thème}/next-formation-catalogue/ pour le modifier
(catalogue.php, iframe.php, error.php). Conservez l'échappement (esc_html, esc_url, esc_attr).

== Changelog ==

= 1.0.0 =
* Première version : réglages, shortcode, cache par transient, mode iframe.
