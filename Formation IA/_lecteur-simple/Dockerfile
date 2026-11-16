# Next Formation IA : image de production (Next.js 16 standalone, Node 22).
#
# CONTEXTE DE BUILD = dossier parent `formation-ia/` (le contenu de la formation est copié dans l'image) :
#   docker build -f app/Dockerfile -t nextformation-ia ..        (depuis app/)
#   docker compose build                                          (depuis app/, voir docker-compose.yml)
# Fichier d'exclusion : app/Dockerfile.dockerignore (BuildKit).
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 CONTENT_DIR=/content
COPY --from=deps /app/node_modules ./node_modules
COPY app/ ./
# Le contenu est lu au rendu (pas au build) ; il est fourni ici pour les pages éventuellement pré-rendues.
COPY programme /content/programme
COPY niveaux /content/niveaux
COPY examens /content/examens
COPY ressources /content/ressources
RUN npm run build && npm run build:setup

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 \
    CONTENT_DIR=/app/content MIGRATIONS_DIR=/app/drizzle
RUN groupadd --system nfia && useradd --system --gid nfia --home /app nfia
# Serveur standalone (server.js + node_modules tracés), fichiers statiques, migrations et script de setup autonome (esbuild).
COPY --from=build --chown=nfia:nfia /app/.next/standalone ./
COPY --from=build --chown=nfia:nfia /app/.next/static ./.next/static
COPY --from=build --chown=nfia:nfia /app/public ./public
COPY --from=build --chown=nfia:nfia /app/drizzle ./drizzle
COPY --from=build --chown=nfia:nfia /app/dist/setup.cjs ./dist/setup.cjs
# Contenu de la formation (lecture seule) : CONTENT_DIR=/app/content.
COPY --chown=root:root programme ./content/programme
COPY --chown=root:root niveaux ./content/niveaux
COPY --chown=root:root examens ./content/examens
COPY --chown=root:root ressources ./content/ressources
USER nfia
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/ia/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Migrations + administrateur + compte démo (idempotent), puis serveur.
CMD ["sh", "-c", "node dist/setup.cjs && exec node server.js"]
