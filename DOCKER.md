# 🐳 Docker Deployment - Faktuur.io

Ce fichier explique comment utiliser les fichiers Docker pour déployer Faktuur.io.

## 📁 Fichiers Docker

- `Dockerfile` : Image optimisée pour Next.js 15 avec build multi-stage
- `docker-compose.yml` : Orchestration des services (App + Worker)
- `.dockerignore` : Exclusion des fichiers inutiles
- `.env.example.coolify` : Template des variables d'environnement

## 🚀 Déploiement Local

### 1. Préparer l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example.coolify .env

# Éditer les variables (utiliser SQLite pour le local)
nano .env
```

Variables minimales pour le local :

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-local-secret-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
EMAIL_FROM="dev@localhost"
EMAIL_PROVIDER="nodemailer"
REDIS_HOST="localhost"
REDIS_PORT="6379"
QUEUE_CONCURRENCY="2"
NODE_ENV="development"
```

### 2. Démarrer Redis (requis)

```bash
# Avec Docker
docker run -d -p 6379:6379 redis:alpine

# Ou avec Homebrew (macOS)
brew services start redis
```

### 3. Construire et lancer

```bash
# Build de l'image
docker build -t faktuur-app .

# Lancer avec docker-compose
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

### 4. Exécuter les migrations

```bash
docker exec -it faktuur-app sh
pnpm prisma migrate dev
pnpm prisma generate
exit
```

### 5. Accéder à l'application

- Application : http://localhost:3000
- API Health : http://localhost:3000/api/health

## 🚀 Déploiement sur Coolify

Consultez le guide complet : [COOLIFY_DOCKER_COMPOSE_QUICKSTART.md](./docs/COOLIFY_DOCKER_COMPOSE_QUICKSTART.md)

### Résumé rapide

1. **Créer les services externes** : PostgreSQL + Redis dans Coolify
2. **Ajouter l'application** : Docker Compose → Repository GitHub
3. **Configurer les variables** : Copier depuis `.env.example.coolify`
4. **Déployer** : Coolify build et lance automatiquement
5. **Migrations** : `docker exec -it faktuur-app sh -c "pnpm prisma migrate deploy"`

## 🏗️ Architecture Docker

```
┌─────────────────────────────────────┐
│     docker-compose.yml              │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   app        │  │   worker    │ │
│  │ (Port 3000)  │  │ (Background)│ │
│  │              │  │             │ │
│  │ Next.js      │  │ BullMQ      │ │
│  │ Server       │  │ Worker      │ │
│  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────┘
         ↓                    ↓
    ┌────────┐          ┌─────────┐
    │  DB    │          │  Redis  │
    │  (ext) │          │  (ext)  │
    └────────┘          └─────────┘
```

## 🔧 Commandes Utiles

### Build et Run

```bash
# Build uniquement
docker-compose build

# Lancer en détaché
docker-compose up -d

# Arrêter
docker-compose down

# Rebuild complet
docker-compose down
docker-compose up -d --build
```

### Logs et Debugging

```bash
# Tous les logs
docker-compose logs -f

# Logs d'un service
docker-compose logs -f app
docker-compose logs -f worker

# Entrer dans un container
docker exec -it faktuur-app sh
docker exec -it faktuur-worker sh

# Status des services
docker-compose ps
```

### Maintenance

```bash
# Redémarrer un service
docker-compose restart app
docker-compose restart worker

# Voir l'utilisation des ressources
docker stats faktuur-app faktuur-worker

# Nettoyer les images non utilisées
docker system prune -a
```

### Prisma

```bash
# Migrations
docker exec -it faktuur-app sh -c "pnpm prisma migrate deploy"

# Générer le client
docker exec -it faktuur-app sh -c "pnpm prisma generate"

# Studio (interface graphique)
docker exec -it faktuur-app sh -c "pnpm prisma studio"
# Accessible sur http://localhost:5555
```

## 📦 Optimisations Docker

### Build Multi-Stage

Le `Dockerfile` utilise 3 stages :

1. **deps** : Installation des dépendances
2. **builder** : Build de l'application
3. **runner** : Image finale légère

Avantages :

- Image finale ~200MB (vs ~1GB sans optimisation)
- Sécurité : pas de code source dans l'image finale
- Performance : Next.js standalone output

### Cache Docker

Pour accélérer les builds, Docker met en cache les layers :

```bash
# Build avec cache
docker-compose build

# Build sans cache (force rebuild)
docker-compose build --no-cache
```

### Environnement Variables

Les variables sensibles ne sont **jamais** committées :

- ✅ `.env.example.coolify` → Template (committé)
- ❌ `.env` → Variables réelles (gitignored)
- ✅ Coolify → Variables chiffrées dans l'interface

## 🐛 Troubleshooting

### Erreur "Cannot find module '@prisma/client'"

```bash
# Régénérer le client Prisma
docker exec -it faktuur-app sh -c "pnpm prisma generate"
docker-compose restart app
```

### Le worker ne démarre pas

```bash
# Vérifier les logs
docker-compose logs worker

# Vérifier Redis
docker exec -it faktuur-worker sh
redis-cli -h $REDIS_HOST ping
# Devrait retourner : PONG
```

### Erreur de connexion à la base de données

```bash
# Vérifier DATABASE_URL
docker exec -it faktuur-app env | grep DATABASE_URL

# Tester la connexion
docker exec -it faktuur-app sh -c "pnpm prisma db pull"
```

### Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
ports:
  - '3001:3000'  # Port 3001 au lieu de 3000
```

## 🔒 Sécurité

### Bonnes Pratiques

1. **Utilisateur non-root** : Le Dockerfile crée un utilisateur `nextjs` (UID 1001)
2. **Secrets** : Utiliser les variables d'environnement, jamais en dur dans le code
3. **HTTPS** : Coolify gère automatiquement Let's Encrypt
4. **Healthchecks** : Définis dans `docker-compose.yml` pour monitoring

### Génération de Secrets

```bash
# BETTER_AUTH_SECRET (32 caractères minimum)
openssl rand -base64 32

# Ou avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📚 Documentation Complète

- [Guide de Déploiement Coolify](./docs/COOLIFY_DEPLOYMENT.md)
- [Quickstart Docker Compose](./docs/COOLIFY_DOCKER_COMPOSE_QUICKSTART.md)
- [Architecture Email/Queue](./docs/EMAIL_ARCHITECTURE.md)

## ✅ Production Readiness

Ce setup Docker est **production-ready** et inclut :

- ✅ Build multi-stage optimisé
- ✅ Healthchecks configurés
- ✅ Restart automatique
- ✅ Logs structurés
- ✅ Variables d'environnement sécurisées
- ✅ Prisma migrations supportées
- ✅ Worker BullMQ séparé
- ✅ Compatible Coolify

---

**Besoin d'aide ?** Consultez la [documentation complète](./docs/) ou créez une issue sur GitHub.
