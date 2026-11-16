#!/bin/bash
# Double-cliquez sur ce fichier pour lancer l'application Next Formation IA sur votre Mac.
# Prérequis : Docker Desktop installé et démarré (https://www.docker.com/products/docker-desktop/).
cd "$(dirname "$0")" || exit 1
echo "=== Next Formation IA ==="
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker n'est pas installé. Installez Docker Desktop : https://www.docker.com/products/docker-desktop/"
  read -r -p "Appuyez sur Entrée pour fermer." _; exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop n'est pas démarré : ouverture…"
  open -a Docker 2>/dev/null
  for i in $(seq 1 60); do docker info >/dev/null 2>&1 && break; sleep 2; done
  docker info >/dev/null 2>&1 || { echo "Docker ne répond pas. Démarrez Docker Desktop puis relancez."; read -r -p "Entrée pour fermer." _; exit 1; }
fi
if [ ! -f .env ]; then
  echo "Création du fichier .env (secrets générés automatiquement)…"
  SECRET=$(openssl rand -hex 32)
  ADMINPW="Admin-$(openssl rand -hex 6)"
  PGPW=$(openssl rand -hex 16)
  cat > .env <<ENV
APP_URL=http://localhost:3000
APP_SECRET=$SECRET
ADMIN_EMAIL=admin@formation-ia.local
ADMIN_PASSWORD=$ADMINPW
POSTGRES_PASSWORD=$PGPW
ENV
  echo "Compte administrateur : admin@formation-ia.local / $ADMINPW (noté dans le fichier .env)"
fi
echo "Construction et démarrage (la première fois : 3 à 8 minutes)…"
docker compose up -d --build || { read -r -p "Erreur. Entrée pour fermer." _; exit 1; }
echo "Attente du démarrage…"
for i in $(seq 1 90); do curl -fsS http://localhost:3000/ia/connexion >/dev/null 2>&1 && break; sleep 2; done
open "http://localhost:3000/ia/connexion"
echo ""
echo "C'est prêt : http://localhost:3000/ia"
echo "  - Bouton « Essayer le compte démo » (Camille)"
echo "  - Admin : voir ADMIN_EMAIL / ADMIN_PASSWORD dans le fichier .env"
echo "Pour arrêter : docker compose down (dans ce dossier)."
read -r -p "Entrée pour fermer cette fenêtre." _
