# Dockerfile pour Faktuur.io
# Optimisé pour Next.js 15 avec standalone output

# === Stage 1: Dependencies ===
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Générer le client Prisma
RUN pnpm prisma generate

# === Stage 2: Builder ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copier node_modules depuis deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copier le reste du code
COPY . .

# Générer le client Prisma (au cas où)
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# === Stage 3: Runner ===
FROM node:20-alpine AS runner

WORKDIR /app

# Ajouter les utilisateurs et groupes nécessaires
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Installer pnpm et les dépendances système
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache curl redis

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copier le build Next.js standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copier Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copier le worker et les scripts
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts

# Variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Exposer le port
EXPOSE 3000

# Passer à l'utilisateur non-root
USER nextjs

# Commande par défaut (peut être overridée dans docker-compose)
CMD ["node", "server.js"]
