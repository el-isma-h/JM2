# Next Formation : image de production (Next.js 16, Node 22).
# Construction : docker compose build ; démarrage : docker compose up -d
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 STORAGE_DIR=/app/storage
# Client PostgreSQL pour les sauvegardes pg_dump (docs/sauvegarde.md).
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd --system nextformation && useradd --system --gid nextformation --home /app nextformation
# node_modules complet : `npm run setup` (tsx, migrations) s'exécute au démarrage.
COPY --from=build --chown=nextformation:nextformation /app/node_modules ./node_modules
COPY --from=build --chown=nextformation:nextformation /app/.next ./.next
COPY --from=build --chown=nextformation:nextformation /app/public ./public
COPY --from=build --chown=nextformation:nextformation /app/drizzle ./drizzle
COPY --from=build --chown=nextformation:nextformation /app/src ./src
COPY --from=build --chown=nextformation:nextformation /app/package.json /app/next.config.ts /app/tsconfig.json /app/drizzle.config.ts ./
RUN mkdir -p /app/storage && chown nextformation:nextformation /app/storage
USER nextformation
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Migrations + administrateur + données de référence (idempotent), puis serveur.
CMD ["sh", "-c", "npm run setup && npm run start"]
