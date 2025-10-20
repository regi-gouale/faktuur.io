# 📦 Fichiers Docker - Faktuur.io

✅ **Configuration Docker Compose créée avec succès !**

## 📁 Fichiers Créés

### 1. `docker-compose.yml`

Orchestration des deux services :

- **Service App** : Application Next.js (port 3000)
- **Service Worker** : Worker BullMQ (background)

### 2. `Dockerfile`

Image Docker optimisée avec build multi-stage :

- **Stage deps** : Installation des dépendances
- **Stage builder** : Build de l'application
- **Stage runner** : Image finale légère (~200MB)

### 3. `.env.example.coolify`

Template des variables d'environnement pour production

### 4. `next.config.ts` (mis à jour)

Configuration Next.js avec `output: 'standalone'` pour Docker

### 5. `src/api/routes/health.ts` (nouveau)

Route de healthcheck avec plusieurs endpoints :

- `/api/health` - Simple check
- `/api/health/detailed` - Check avec détails DB + Redis
- `/api/health/ready` - Kubernetes readiness probe
- `/api/health/live` - Kubernetes liveness probe

### 6. Documentation

- `DOCKER.md` - Guide complet Docker
- `docs/COOLIFY_DOCKER_COMPOSE_QUICKSTART.md` - Guide de déploiement rapide

## 🚀 Déploiement Rapide

### Local (Développement)

```bash
# 1. Démarrer Redis
docker run -d -p 6379:6379 redis:alpine

# 2. Configurer l'environnement
cp .env.example.coolify .env
# Éditer .env avec vos valeurs

# 3. Lancer avec Docker Compose
docker-compose up -d

# 4. Migrations
docker exec -it faktuur-app sh -c "pnpm prisma migrate dev"

# 5. Accéder à l'app
open http://localhost:3000
```

### Production (Coolify)

```bash
# 1. Créer PostgreSQL + Redis dans Coolify

# 2. Add Resource → Docker Compose
# - Repository: regi-gouale/faktuur.io
# - Branch: main

# 3. Variables d'environnement
# Copier depuis .env.example.coolify et remplir

# 4. Déployer
# Coolify build et démarre automatiquement

# 5. Migrations
docker exec -it faktuur-app sh -c "pnpm prisma migrate deploy"
```

## ✅ Vérifications

### Santé de l'application

```bash
# Health check simple
curl http://localhost:3000/api/health

# Health check détaillé
curl http://localhost:3000/api/health/detailed

# Readiness probe
curl http://localhost:3000/api/health/ready

# Liveness probe
curl http://localhost:3000/api/health/live
```

### Logs

```bash
# Tous les logs
docker-compose logs -f

# App seulement
docker-compose logs -f app

# Worker seulement
docker-compose logs -f worker
```

### Services

```bash
# Status
docker-compose ps

# Redémarrer
docker-compose restart

# Arrêter
docker-compose down
```

## 🎯 Prochaines Étapes

1. **Tester localement** avec `docker-compose up`
2. **Pousser sur Git** (branch `feat/email-task-management`)
3. **Déployer sur Coolify** avec Docker Compose
4. **Configurer les variables** d'environnement
5. **Exécuter les migrations** Prisma
6. **Vérifier les healthchecks**
7. **Tester la création de jobs**

## 📚 Documentation

- [Guide Docker Complet](./DOCKER.md)
- [Quickstart Coolify](./docs/COOLIFY_DOCKER_COMPOSE_QUICKSTART.md)
- [Déploiement Complet](./docs/COOLIFY_DEPLOYMENT.md)

## 🔧 Variables d'Environnement Requises

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=<32+ caractères>
BETTER_AUTH_URL=https://faktuur.io

# Email
EMAIL_FROM=noreply@faktuur.io
EMAIL_PROVIDER=usesend
USESEND_API_KEY=<votre-clé>

# Redis
REDIS_HOST=faktuur-redis
REDIS_PORT=6379
QUEUE_CONCURRENCY=5

# Environment
NODE_ENV=production
```

## ✨ Fonctionnalités

- ✅ Build multi-stage optimisé
- ✅ Healthchecks automatiques (App + Worker)
- ✅ Restart automatique en cas d'échec
- ✅ Logs structurés
- ✅ Support SQLite (dev) + PostgreSQL (prod)
- ✅ Worker BullMQ séparé
- ✅ Compatible Coolify
- ✅ Ready pour Kubernetes (avec probes)

---

**Tout est prêt pour le déploiement ! 🚀**

Pour toute question, consultez la documentation complète dans `DOCKER.md` ou `docs/COOLIFY_DOCKER_COMPOSE_QUICKSTART.md`.
