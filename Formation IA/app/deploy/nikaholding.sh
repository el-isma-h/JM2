#!/usr/bin/env bash
# Déploiement de Next Formation IA sur le serveur Nika Holding (Hetzner, Caddy en frontal),
# sous https://formation.nikaholding.world/ia (le reste du domaine reste servi par Next Formation).
#
#   bash deploy/nikaholding.sh            # premier déploiement ou mise à jour (depuis app/ ou n'importe où)
#
# Ce que fait le script (idempotent, relançable) :
#   1. construit l'image linux/amd64 sur ce Mac (contexte = dossier parent formation-ia/, contenu inclus) et la transfère ;
#   2. au premier passage : crée la base `nextformation_ia` dans le PostgreSQL de l'hôte, /opt/nextformation-ia et son .env
#      avec des secrets générés sur le serveur (jamais affichés) ;
#   3. démarre le conteneur `nextformation-ia` (réseau hôte, écoute sur 127.0.0.1:3061 uniquement, 512 Mo max) ;
#   4. ajoute `handle /ia* { reverse_proxy 127.0.0.1:3061 }` DANS le bloc Caddy existant du domaine
#      (sauvegarde Caddyfile.avant-nextformation-ia, validation avant rechargement, restauration si invalide) ;
#   5. vérifie /ia/api/health en local puis en HTTPS.
set -euo pipefail

HOST="${HOST:-root@188.245.54.227}"
DOMAIN="${DOMAIN:-formation.nikaholding.world}"
PORT=3061
IMAGE=nextformation-ia:latest
APP="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT="$(cd "$APP/.." && pwd)"

step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }

step "1/5 Image linux/amd64"
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  docker buildx build --platform linux/amd64 -f "$APP/Dockerfile" -t "$IMAGE" --load "$CONTEXT"
fi
[[ "$(docker image inspect "$IMAGE" --format '{{.Architecture}}')" == "amd64" ]] || { echo "L'image $IMAGE n'est pas amd64"; exit 1; }
echo "Transfert de l'image (compressée)…"
docker save "$IMAGE" | gzip -1 | ssh "$HOST" 'gunzip | docker load'

step "2/5 Base de données, dossier et secrets (premier passage uniquement)"
ssh "$HOST" bash -s <<'REMOTE'
set -euo pipefail
if [[ -f /opt/nextformation-ia/.env ]]; then echo "/opt/nextformation-ia/.env déjà présent : conservé."; exit 0; fi
mkdir -p /opt/nextformation-ia
chmod 700 /opt/nextformation-ia
DBPW=$(openssl rand -hex 24)
if ! sudo -u postgres psql -Atc "select 1 from pg_roles where rolname='nextformation_ia'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE ROLE nextformation_ia LOGIN PASSWORD '$DBPW'"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "ALTER ROLE nextformation_ia PASSWORD '$DBPW'"
fi
sudo -u postgres psql -Atc "select 1 from pg_database where datname='nextformation_ia'" | grep -q 1 || sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE DATABASE nextformation_ia OWNER nextformation_ia"
umask 077
cat > /opt/nextformation-ia/.env <<EOF
# Next Formation IA, production (formation.nikaholding.world/ia). Secrets générés sur le serveur le $(date +%d/%m/%Y).
DATABASE_URL=postgresql://nextformation_ia:$DBPW@127.0.0.1:5432/nextformation_ia
APP_URL=https://formation.nikaholding.world
# APP_SECRET chiffre les clés API (apprenants et plateforme) : à sauvegarder hors du serveur, ne jamais le changer.
APP_SECRET=$(openssl rand -hex 32)
ADMIN_EMAIL=admin@nikaholding.world
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=')Aa1
DEMO_ENABLED=true
# Tuteur IA : une clé suffit (ou réglage chiffré dans Admin > Réglages, ou clé personnelle de l'apprenant).
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
XAI_API_KEY=
# Invitations par e-mail (sinon lien à copier dans Admin > Invitations).
RESEND_API_KEY=
MAIL_FROM=
EOF
echo "Base nextformation_ia et /opt/nextformation-ia/.env créés."
REMOTE

step "3/5 Conteneur"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
cat > /opt/nextformation-ia/docker-compose.yml <<'EOF'
# Next Formation IA : conteneur isolé, réseau de l'hôte pour joindre le PostgreSQL local (127.0.0.1:5432),
# écoute uniquement sur 127.0.0.1:$PORT (Caddy en frontal, handle /ia*). Mise à jour : bash deploy/nikaholding.sh.
services:
  nextformation-ia:
    image: $IMAGE
    container_name: nextformation-ia
    env_file: .env
    environment:
      PORT: "$PORT"
      HOSTNAME: 127.0.0.1
    restart: unless-stopped
    network_mode: host
    mem_limit: 512m
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:$PORT/ia/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      start_period: 90s
      retries: 3
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
EOF
cd /opt/nextformation-ia && docker compose up -d --force-recreate
echo "Attente du démarrage (migrations + compte démo)…"
for i in \$(seq 1 60); do
  if curl -fsS http://127.0.0.1:$PORT/ia/api/health >/dev/null 2>&1; then echo "Serveur prêt."; break; fi
  sleep 3
  [[ \$i == 60 ]] && { docker logs --tail 60 nextformation-ia; echo "Le serveur ne répond pas."; exit 1; }
done
docker logs nextformation-ia 2>&1 | grep -E '^OK|\[setup\]' || true
REMOTE

step "4/5 Caddy (handle /ia* dans le bloc du domaine)"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
CF=/etc/caddy/Caddyfile
if grep -q '>>> nextformation-ia' "\$CF"; then
  echo "Bloc Caddy /ia déjà présent."
  exit 0
fi
cp "\$CF" /etc/caddy/Caddyfile.avant-nextformation-ia
SNIPPET=\$(cat <<'EOF'
	# >>> nextformation-ia : Next Formation IA (e-learning NF-IA-150), basePath /ia — ne pas utiliser handle_path
	handle /ia* {
		reverse_proxy 127.0.0.1:$PORT {
			header_up X-Real-IP {remote_host}
		}
	}
	# <<< nextformation-ia
EOF
)
if grep -q '^$DOMAIN {' "\$CF"; then
  # Insertion juste après l'ouverture du bloc existant : prioritaire sur le reverse_proxy de Next Formation.
  awk -v snip="\$SNIPPET" '{ print } /^$DOMAIN \{/ && !done { print snip; done=1 }' "\$CF" > "\$CF.tmp" && mv "\$CF.tmp" "\$CF"
else
  printf '\n$DOMAIN {\n\tencode zstd gzip\n%s\n}\n' "\$SNIPPET" >> "\$CF"
fi
if ! caddy validate --config "\$CF" --adapter caddyfile >/dev/null 2>&1; then
  cp /etc/caddy/Caddyfile.avant-nextformation-ia "\$CF"
  echo "Caddyfile invalide : version précédente restaurée."; exit 1
fi
systemctl reload caddy
echo "Bloc Caddy /ia ajouté et rechargé (sauvegarde : /etc/caddy/Caddyfile.avant-nextformation-ia)."
REMOTE

step "5/5 Vérifications"
for i in $(seq 1 20); do
  if curl -fsS "https://$DOMAIN/ia/api/health" >/dev/null 2>&1; then break; fi
  sleep 3
done
curl -fsS "https://$DOMAIN/ia/api/health" && echo
for p in /ia/connexion /ia/api/health /; do
  printf '%-18s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$p")"
done
echo
echo "Next Formation IA est en ligne : https://$DOMAIN/ia"
echo "Mot de passe administrateur (à changer après la première connexion) :"
echo "  ssh $HOST \"grep -E '^ADMIN_(EMAIL|PASSWORD)=' /opt/nextformation-ia/.env\""
