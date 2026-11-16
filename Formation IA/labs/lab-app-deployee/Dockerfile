# Dockerfile — Compta-Chat (lab L105), multi-étapes. Contexte de build : ce dossier.
#   docker build --build-arg APP_DIR=solution -t compta-chat-app:local .
# APP_DIR = starter (par défaut) ou solution. Les tests vitest tournent PENDANT le build :
# une image dont les tests sont rouges n'est jamais produite (le starter échoue tant que les TODO ne sont pas faits).
ARG APP_DIR=starter

FROM node:22-alpine AS deps
ARG APP_DIR
WORKDIR /app
COPY ${APP_DIR}/package.json ${APP_DIR}/package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
ARG APP_DIR
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY ${APP_DIR}/ ./
RUN npm test && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
# Sonde : /api/health ne coûte rien (jamais d'appel au modèle). wget est fourni par busybox (alpine).
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
