#!/usr/bin/env bash
# Déploiement de l'espace e-learning Formation IA sur le serveur Nika Holding (Hetzner, Caddy en frontal), RELIÉ à
# Next Formation : https://formation.nikaholding.world/ia (Next Formation reste servi à la racine du domaine, port 3060).
# Modèle : next-formation/deploy/nikaholding.sh. À lancer depuis le Mac (le serveur n'a pas la mémoire pour compiler).
#
#   bash deploy/nikaholding-ia.sh            # premier déploiement ou mise à jour (depuis app/ ou n'importe où)
#   SKIP_BUILD=1 bash deploy/nikaholding-ia.sh   # réutilise l'image déjà construite
#
# Ce que fait le script (idempotent, relançable) :
#   1. construit l'image linux/amd64 `formation-ia:latest` (contexte = dossier parent formation-ia/, contenu inclus) et la transfère ;
#   2. au premier passage : crée la base `formationia` dans le PostgreSQL de l'hôte, /opt/formation-ia et son .env avec des
#      secrets générés sur le serveur (jamais affichés) ; à chaque passage : aligne NF_SSO_SECRET sur IA_SSO_SECRET de
#      /opt/nextformation/.env (repris s'il existe, sinon généré puis écrit dans les DEUX fichiers) ;
#   3. démarre le conteneur `formation-ia` (réseau hôte, écoute sur 127.0.0.1:3061 uniquement, 512 Mo max) ;
#   4. ajoute `handle /ia* { reverse_proxy 127.0.0.1:3061 }` en tête du bloc Caddy existant de Next Formation
#      (sauvegarde Caddyfile.avant-formation-ia, validation avant rechargement, restauration si invalide) ;
#   5. vérifie /ia/api/health en local puis en HTTPS.
set -euo pipefail

HOST="${HOST:-root@188.245.54.227}"
DOMAIN="${DOMAIN:-formation.nikaholding.world}"
PORT=3061
IMAGE=formation-ia:latest
NAME=formation-ia
DIR=/opt/formation-ia
NF_ENV=/opt/nextformation/.env
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

step "2/5 Base de données, dossier, secrets et secret SSO partagé"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
DIR=$DIR
NF_ENV=$NF_ENV
DOMAIN=$DOMAIN
if [[ -f "\$DIR/.env" ]]; then
  echo "\$DIR/.env déjà présent : conservé."
else
  mkdir -p "\$DIR"
  chmod 700 "\$DIR"
  DBPW=\$(openssl rand -hex 24)
  if ! sudo -u postgres psql -Atc "select 1 from pg_roles where rolname='formationia'" | grep -q 1; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE ROLE formationia LOGIN PASSWORD '\$DBPW'"
  else
    sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "ALTER ROLE formationia PASSWORD '\$DBPW'"
  fi
  sudo -u postgres psql -Atc "select 1 from pg_database where datname='formationia'" | grep -q 1 || sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE DATABASE formationia OWNER formationia"
  umask 077
  cat > "\$DIR/.env" <<EOF
# Formation IA (e-learning), production (\$DOMAIN/ia). Secrets générés sur le serveur le \$(date +%d/%m/%Y).
DATABASE_URL=postgresql://formationia:\$DBPW@127.0.0.1:5432/formationia
APP_URL=https://\$DOMAIN
# APP_SECRET chiffre les clés API (apprenants et plateforme) : à sauvegarder hors du serveur, ne jamais le changer.
APP_SECRET=\$(openssl rand -hex 32)
ADMIN_EMAIL=admin@nikaholding.world
ADMIN_PASSWORD=\$(openssl rand -base64 18 | tr -d '/+=')Aa1
DEMO_ENABLED=true
# Connexion unique depuis Next Formation (même domaine) : NF_SSO_SECRET est aligné sur IA_SSO_SECRET de \$NF_ENV par le script.
NF_APP_URL=https://\$DOMAIN
NF_SSO_SECRET=
# Tuteur IA : une clé suffit (ou réglage chiffré dans Admin > Réglages, ou clé personnelle de l'apprenant).
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
XAI_API_KEY=
# Invitations par e-mail (sinon lien à copier dans Admin > Invitations).
RESEND_API_KEY=
MAIL_FROM=
EOF
  echo "Base formationia et \$DIR/.env créés."
fi

# --- Secret SSO partagé : une seule valeur des deux côtés (jamais affichée). ---
umask 077
getvar() { grep -E "^\$2=" "\$1" 2>/dev/null | head -1 | cut -d= -f2- ; }
setvar() { # setvar fichier CLÉ VALEUR : remplace la ligne ou l'ajoute (valeurs hexadécimales / URL sans « | »)
  if grep -qE "^\$2=" "\$1"; then
    sed -i "s|^\$2=.*|\$2=\$3|" "\$1"
  else
    printf '%s=%s\n' "\$2" "\$3" >> "\$1"
  fi
}
IA_SECRET=\$(getvar "\$DIR/.env" NF_SSO_SECRET || true)
NF_SECRET=""
[[ -f "\$NF_ENV" ]] && NF_SECRET=\$(getvar "\$NF_ENV" IA_SSO_SECRET || true)
if [[ -n "\$NF_SECRET" && \${#NF_SECRET} -ge 32 ]]; then
  if [[ "\$IA_SECRET" != "\$NF_SECRET" ]]; then
    setvar "\$DIR/.env" NF_SSO_SECRET "\$NF_SECRET"
    echo "NF_SSO_SECRET repris depuis \$NF_ENV (IA_SSO_SECRET)."
  else
    echo "NF_SSO_SECRET déjà aligné sur \$NF_ENV."
  fi
else
  if [[ -z "\$IA_SECRET" || \${#IA_SECRET} -lt 32 ]]; then
    IA_SECRET=\$(openssl rand -hex 32)
    setvar "\$DIR/.env" NF_SSO_SECRET "\$IA_SECRET"
    echo "NF_SSO_SECRET généré dans \$DIR/.env."
  fi
  if [[ -f "\$NF_ENV" ]]; then
    setvar "\$NF_ENV" IA_SSO_SECRET "\$IA_SECRET"
    echo "IA_SSO_SECRET écrit dans \$NF_ENV."
    echo "  -> Next Formation doit relire son .env : cd /opt/nextformation && docker compose up -d --force-recreate"
  else
    echo "ATTENTION : \$NF_ENV absent (Next Formation pas encore déployé). Quand il le sera, copier NF_SSO_SECRET de \$DIR/.env"
    echo "            dans IA_SSO_SECRET de \$NF_ENV (ou relancer ce script, qui le fera)."
  fi
fi
if [[ -f "\$NF_ENV" ]] && ! grep -qE '^IA_APP_URL=.+' "\$NF_ENV"; then
  setvar "\$NF_ENV" IA_APP_URL "https://\$DOMAIN/ia"
  echo "IA_APP_URL=https://\$DOMAIN/ia écrit dans \$NF_ENV (redémarrage de Next Formation nécessaire, voir ci-dessus)."
fi
grep -qE "^NF_APP_URL=.+" "\$DIR/.env" || setvar "\$DIR/.env" NF_APP_URL "https://\$DOMAIN"
REMOTE

step "3/5 Conteneur"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
# L'ancien conteneur « nextformation-ia » (script deploy/nikaholding.sh) écoutait sur le même port : il est arrêté.
if docker ps -a --format '{{.Names}}' | grep -qx nextformation-ia; then
  echo "Ancien conteneur nextformation-ia présent (même port $PORT) : arrêté et retiré (sa base nextformation_ia est conservée)."
  docker rm -f nextformation-ia >/dev/null
fi
cat > $DIR/docker-compose.yml <<'EOF'
# Formation IA (e-learning) : conteneur isolé, réseau de l'hôte pour joindre le PostgreSQL local (127.0.0.1:5432),
# écoute uniquement sur 127.0.0.1:$PORT (Caddy en frontal, handle /ia*). Mise à jour : bash deploy/nikaholding-ia.sh.
services:
  $NAME:
    image: $IMAGE
    container_name: $NAME
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
cd $DIR && docker compose up -d --force-recreate
echo "Attente du démarrage (migrations + compte démo)…"
for i in \$(seq 1 60); do
  if curl -fsS http://127.0.0.1:$PORT/ia/api/health >/dev/null 2>&1; then echo "Serveur prêt."; break; fi
  sleep 3
  [[ \$i == 60 ]] && { docker logs --tail 60 $NAME; echo "Le serveur ne répond pas."; exit 1; }
done
docker logs $NAME 2>&1 | grep -E '^OK|\[setup\]' || true
REMOTE

step "4/5 Caddy (handle /ia* en tête du bloc du domaine)"
ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
CF=/etc/caddy/Caddyfile
if grep -qE '>>> (formation-ia|nextformation-ia)' "\$CF"; then
  echo "Bloc Caddy /ia déjà présent."
  exit 0
fi
cp "\$CF" /etc/caddy/Caddyfile.avant-formation-ia
# Syntaxe Caddy : « handle /ia* » = matcheur de chemin par préfixe (/ia, /ia/…). Dans l'ordre des directives de Caddy,
# « handle » est évalué avant un « reverse_proxy » sans matcheur, et le reverse_proxy à l'intérieur est terminal :
# tout ce qui commence par /ia part vers l'e-learning, le reste continue vers Next Formation (127.0.0.1:3060).
# Ne pas utiliser handle_path : l'application attend le préfixe /ia (basePath).
SNIPPET=\$(cat <<'EOF'
	# >>> formation-ia : espace e-learning Formation IA (NF-IA-150), basePath /ia, relié à Next Formation par SSO
	handle /ia* {
		reverse_proxy 127.0.0.1:$PORT {
			header_up X-Real-IP {remote_host}
		}
	}
	# <<< formation-ia
EOF
)
if grep -qE '^$DOMAIN \{' "\$CF"; then
  # Insertion juste après l'ouverture du bloc existant de Next Formation : avant son reverse_proxy.
  awk -v snip="\$SNIPPET" '{ print } /^$DOMAIN \{/ && !done { print snip; done=1 }' "\$CF" > "\$CF.tmp" && mv "\$CF.tmp" "\$CF"
else
  echo "ATTENTION : aucun bloc « $DOMAIN { » trouvé (Next Formation pas encore déployé ?) : bloc créé pour /ia seul."
  printf '\n%s {\n\tencode zstd gzip\n%s\n}\n' "$DOMAIN" "\$SNIPPET" >> "\$CF"
fi
if ! caddy validate --config "\$CF" --adapter caddyfile >/dev/null 2>&1; then
  cp /etc/caddy/Caddyfile.avant-formation-ia "\$CF"
  echo "Caddyfile invalide : version précédente restaurée."; exit 1
fi
systemctl reload caddy
echo "Bloc Caddy /ia ajouté et rechargé (sauvegarde : /etc/caddy/Caddyfile.avant-formation-ia)."
REMOTE

step "5/5 Vérifications"
for i in $(seq 1 20); do
  if curl -fsS "https://$DOMAIN/ia/api/health" >/dev/null 2>&1; then break; fi
  sleep 3
done
curl -fsS "https://$DOMAIN/ia/api/health" && echo
for p in /ia /ia/connexion /ia/sso /ia/api/health /; do
  printf '%-18s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$p")"
done
echo
echo "Formation IA est en ligne : https://$DOMAIN/ia (connexion unique : https://$DOMAIN/ia/sso?token=…)"
echo "Mot de passe administrateur (à changer après la première connexion) :"
echo "  ssh $HOST \"grep -E '^ADMIN_(EMAIL|PASSWORD)=' $DIR/.env\""
echo "Si IA_SSO_SECRET ou IA_APP_URL viennent d'être écrits dans $NF_ENV, redémarrer Next Formation :"
echo "  ssh $HOST 'cd /opt/nextformation && docker compose up -d --force-recreate'"
