#!/usr/bin/env bash
# Déploiement de Next Formation sur le serveur Nika Holding (Hetzner, Caddy en frontal), sous formation.nikaholding.world.
#
#   bash deploy/nikaholding.sh            # premier déploiement ou mise à jour
#
# Ce que fait le script (idempotent, relançable) :
#   1. construit l'image linux/amd64 sur ce Mac (le serveur n'a pas la mémoire pour compiler) et la transfère ;
#   2. au premier passage : crée la base `nextformation` dans le PostgreSQL de l'hôte, /opt/nextformation et son .env avec des
#      secrets générés sur le serveur (jamais affichés) ;
#   3. démarre le conteneur `nextformation` (réseau hôte, écoute sur 127.0.0.1:3060 uniquement, 512 Mo max) ;
#   4. ajoute le bloc Caddy (sauvegarde Caddyfile.avant-nextformation, validation avant rechargement) et la tâche cron ;
#   5. vérifie /api/health en local puis en HTTPS.
set -euo pipefail

HOST="${HOST:-root@188.245.54.227}"
DOMAIN="${DOMAIN:-formation.nikaholding.world}"
PORT=3060
IMAGE=nextformation:latest
HERE="$(cd "$(dirname "$0")/.." && pwd)"

step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }

step "1/5 Image linux/amd64"
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  docker buildx build --platform linux/amd64 -t "$IMAGE" --load "$HERE"
fi
[[ "$(docker image inspect "$IMAGE" --format '{{.Architecture}}')" == "amd64" ]] || { echo "L'image $IMAGE n'est pas amd64"; exit 1; }
echo "Transfert de l'image (compressée)…"
docker save "$IMAGE" | gzip -1 | ssh "$HOST" 'gunzip | docker load'

step "2/5 Base de données, dossier et secrets (premier passage uniquement)"
ssh "$HOST" bash -s <<'REMOTE'
set -euo pipefail
if [[ -f /opt/nextformation/.env ]]; then echo "/opt/nextformation/.env déjà présent : conservé."; exit 0; fi
mkdir -p /opt/nextformation/storage
chmod 700 /opt/nextformation
DBPW=$(openssl rand -hex 24)
if ! sudo -u postgres psql -Atc "select 1 from pg_roles where rolname='nextformation'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE ROLE nextformation LOGIN PASSWORD '$DBPW'"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "ALTER ROLE nextformation PASSWORD '$DBPW'"
fi
sudo -u postgres psql -Atc "select 1 from pg_database where datname='nextformation'" | grep -q 1 || sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE DATABASE nextformation OWNER nextformation"
umask 077
cat > /opt/nextformation/.env <<EOF
# Next Formation, production (formation.nikaholding.world). Secrets générés sur le serveur le $(date +%d/%m/%Y).
DATABASE_URL=postgresql://nextformation:$DBPW@127.0.0.1:5432/nextformation
APP_URL=https://formation.nikaholding.world
# APP_SECRET chiffre NIR, IBAN et TOTP : à sauvegarder hors du serveur, ne jamais le changer.
APP_SECRET=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)
ADMIN_EMAIL=admin@nikaholding.world
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=')Aa1
STORAGE_DIR=/app/storage
# E-mail : coupé par défaut (MAIL_ENABLED absent = désactivé). Les e-mails restent dans Admin > Boîte d'envoi.
# Pour l'activer : Admin > Clés API (RESEND_API_KEY, MAIL_FROM sur un domaine vérifié, MAIL_ENABLED=true), sans redémarrage.
# Laisser ces lignes vides : une valeur non vide ici prime sur l'administration.
MAIL_ENABLED=
RESEND_API_KEY=
MAIL_FROM=
# Clé IA : à saisir dans Admin > Clés API (chiffrée en base, chargée au démarrage). Laisser vide ici.
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5
# Mentions légales (affichées « à renseigner » tant qu'elles sont vides)
LEGAL_COMPANY_NAME=
LEGAL_COMPANY_FORM=
LEGAL_COMPANY_SIREN=
LEGAL_COMPANY_ADDRESS=
LEGAL_PUBLICATION_DIRECTOR=
LEGAL_CONTACT_EMAIL=
LEGAL_DPO_EMAIL=
LEGAL_HOST=Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne
GOOGLE_SITE_VERIFICATION=
EOF
echo "Base nextformation et /opt/nextformation/.env créés."
REMOTE

step "3/5 Conteneur"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
cat > /opt/nextformation/docker-compose.yml <<'EOF'
# Next Formation : conteneur isolé, réseau de l'hôte pour joindre le PostgreSQL local (127.0.0.1:5432),
# écoute uniquement sur 127.0.0.1:$PORT (Caddy en frontal). Mise à jour : bash deploy/nikaholding.sh depuis le Mac.
services:
  nextformation:
    image: $IMAGE
    container_name: nextformation
    env_file: .env
    restart: unless-stopped
    network_mode: host
    command: ["sh", "-c", "npm run setup && exec npx next start -H 127.0.0.1 -p $PORT"]
    volumes:
      - ./storage:/app/storage
    mem_limit: 512m
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:$PORT/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      start_period: 90s
      retries: 3
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
EOF
# Le conteneur tourne sous l'utilisateur système « nextformation » de l'image : il doit pouvoir écrire les documents.
uid=\$(docker run --rm --entrypoint id $IMAGE -u nextformation); gid=\$(docker run --rm --entrypoint id $IMAGE -g nextformation)
chown -R "\$uid:\$gid" /opt/nextformation/storage
cd /opt/nextformation && docker compose up -d --force-recreate
echo "Attente du démarrage (migrations + données de référence)…"
for i in \$(seq 1 60); do
  if curl -fsS http://127.0.0.1:$PORT/api/health >/dev/null 2>&1; then echo "Serveur prêt."; break; fi
  sleep 3
  [[ \$i == 60 ]] && { docker logs --tail 60 nextformation; echo "Le serveur ne répond pas."; exit 1; }
done
docker logs nextformation 2>&1 | grep -E '^OK|\[config\]' || true
REMOTE

step "4/5 Caddy et tâche cron"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
if ! grep -q '^$DOMAIN {' /etc/caddy/Caddyfile; then
  cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.avant-nextformation
  cat >> /etc/caddy/Caddyfile <<'EOF'

# >>> nextformation (ajouté le $(date +%d/%m/%Y)) : Next Formation, logiciel de gestion des organismes de formation et CFA, indexé (SEO actif)
$DOMAIN {
	encode zstd gzip
	reverse_proxy 127.0.0.1:$PORT {
		header_up X-Real-IP {remote_host}
	}
	request_body {
		max_size 12MB
	}
}
# <<< nextformation
EOF
  if ! caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
    cp /etc/caddy/Caddyfile.avant-nextformation /etc/caddy/Caddyfile
    echo "Caddyfile invalide : version précédente restaurée."; exit 1
  fi
  systemctl reload caddy
  echo "Bloc Caddy ajouté et rechargé (sauvegarde : /etc/caddy/Caddyfile.avant-nextformation)."
else
  echo "Bloc Caddy déjà présent."
fi
secret=\$(grep '^CRON_SECRET=' /opt/nextformation/.env | cut -d= -f2)
umask 077
cat > /etc/cron.d/nextformation <<EOF
# Next Formation : tâches de fond (nettoyage des démos, rappels d'échéances, purge des sessions) chaque minute.
* * * * * root curl -fsS -m 50 -X POST -H "x-cron-secret: \$secret" http://127.0.0.1:$PORT/api/cron >/dev/null 2>&1
EOF
chmod 600 /etc/cron.d/nextformation
echo "Tâche cron installée."
REMOTE

step "5/5 Vérifications"
for i in $(seq 1 20); do
  if curl -fsS "https://$DOMAIN/api/health" >/dev/null 2>&1; then break; fi
  sleep 3
done
curl -fsS "https://$DOMAIN/api/health" && echo
for p in / /demo /inscription /cgu /robots.txt /sitemap.xml /opengraph-image /catalogue-public/excellentia; do
  printf '%-18s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$p")"
done
echo
echo "Next Formation est en ligne : https://$DOMAIN"
echo "Mot de passe administrateur (à changer après la première connexion) :"
echo "  ssh $HOST \"grep -E '^ADMIN_(EMAIL|PASSWORD)=' /opt/nextformation/.env\""
