#!/usr/bin/env bash
# PostgreSQL 16 local pour le développement (sans Docker), port 5433, base/utilisateur « nfia » (mot de passe « nfia »).
#
#   bash scripts/dev-db.sh            # initialise (1re fois) puis démarre
#   bash scripts/dev-db.sh stop       # arrête
#   bash scripts/dev-db.sh status
#   bash scripts/dev-db.sh fg         # démarre au premier plan (environnements qui tuent les processus détachés)
#
# Données dans $NFIA_PGDATA (défaut : ./.dev-db, ignoré par git). Binaires : $PG_BIN ou /usr/lib/postgresql/*/bin.
# Si lancé en root, le serveur tourne sous l'utilisateur $PG_USER (défaut : claude), initdb / postgres refusant root.
# Ensuite : DATABASE_URL=postgresql://nfia:nfia@localhost:5433/nfia npm run setup
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
DATA="${NFIA_PGDATA:-$HERE/.dev-db}"
PORT="${NFIA_PGPORT:-5433}"
PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
[[ -x "$PG_BIN/pg_ctl" ]] || { echo "pg_ctl introuvable (PG_BIN=$PG_BIN)"; exit 1; }

run() {
  if [[ "$(id -u)" == "0" ]]; then
    local u="${PG_USER:-claude}"
    if command -v setpriv >/dev/null 2>&1; then
      # Capacité ambiante dac_read_search : permet de traverser des dossiers parents réservés à root (scratchpad).
      setpriv --reuid="$u" --regid="$(id -g "$u")" --init-groups --inh-caps=+dac_read_search --ambient-caps=+dac_read_search "$@"
    else
      su "$u" -s /bin/bash -c "$(printf '%q ' "$@")"
    fi
  else
    "$@"
  fi
}

case "${1:-start}" in
  stop) run "$PG_BIN/pg_ctl" -D "$DATA" stop -m fast; exit 0 ;;
  status) run "$PG_BIN/pg_ctl" -D "$DATA" status; exit $? ;;
  start|fg) ;;
  *) echo "usage : $0 [start|stop|status]"; exit 2 ;;
esac

if [[ ! -f "$DATA/PG_VERSION" ]]; then
  mkdir -p "$DATA"
  [[ "$(id -u)" == "0" ]] && chown "${PG_USER:-claude}" "$DATA"
  pwfile="$(mktemp)"; echo "nfia" > "$pwfile"; chmod 644 "$pwfile"
  run "$PG_BIN/initdb" -D "$DATA" -U nfia --pwfile="$pwfile" -A scram-sha-256 -E UTF8 --locale=C.UTF-8 >/dev/null
  rm -f "$pwfile"
  echo "Cluster initialisé dans $DATA"
fi

ensure_db() {
  for _ in $(seq 1 30); do "$PG_BIN/pg_isready" -h localhost -p "$PORT" -q && break; sleep 0.5; done
  if ! PGPASSWORD=nfia "$PG_BIN/psql" -h localhost -p "$PORT" -U nfia -d postgres -Atc "select 1 from pg_database where datname='nfia'" | grep -q 1; then
    PGPASSWORD=nfia "$PG_BIN/createdb" -h localhost -p "$PORT" -U nfia nfia
    echo "Base nfia créée."
  fi
  echo "DATABASE_URL=postgresql://nfia:nfia@localhost:$PORT/nfia"
}

if [[ "${1:-start}" == "fg" ]]; then
  ensure_db &
  run "$PG_BIN/postgres" -D "$DATA" -p "$PORT" -k /tmp -c listen_addresses=localhost
  exit $?
fi

if run "$PG_BIN/pg_ctl" -D "$DATA" status >/dev/null 2>&1; then
  echo "PostgreSQL déjà démarré (port $PORT)."
else
  run "$PG_BIN/pg_ctl" -D "$DATA" -l "$DATA/server.log" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -w start >/dev/null
  echo "PostgreSQL démarré sur localhost:$PORT"
fi

ensure_db
