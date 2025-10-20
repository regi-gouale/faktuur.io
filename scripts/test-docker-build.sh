#!/bin/bash

# 🐳 Script de test du build Docker
# Teste que l'image Docker se construit correctement sans erreurs

set -e

# Configuration
IMAGE_NAME="faktuur-test"
COLORS=true

# Couleurs
if [ "$COLORS" = true ]; then
  GREEN='\033[0;32m'
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  NC='\033[0m' # No Color
else
  GREEN=''
  RED=''
  YELLOW=''
  BLUE=''
  NC=''
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   🐳 Docker Build Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Fonction de nettoyage
cleanup() {
  echo ""
  echo -e "${YELLOW}🧹 Nettoyage...${NC}"
  docker rmi ${IMAGE_NAME}:latest 2>/dev/null || true
  echo -e "${GREEN}✓ Nettoyage terminé${NC}"
}

# Piège pour nettoyer en cas d'erreur
trap cleanup EXIT

# Test 1: Build de l'image
echo -e "${YELLOW}📦 Test 1: Build de l'image Docker${NC}"
echo ""

if docker build -t ${IMAGE_NAME}:latest . --no-cache; then
  echo ""
  echo -e "${GREEN}✓ Build réussi !${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}✗ Build échoué !${NC}"
  echo ""
  exit 1
fi

# Test 2: Vérifier la taille de l'image
echo -e "${YELLOW}📏 Test 2: Taille de l'image${NC}"
image_size=$(docker images ${IMAGE_NAME}:latest --format "{{.Size}}")
echo -e "  Taille: ${BLUE}${image_size}${NC}"
echo ""

# Test 3: Vérifier les layers
echo -e "${YELLOW}🔍 Test 3: Inspection de l'image${NC}"
docker history ${IMAGE_NAME}:latest --no-trunc --format "table {{.CreatedBy}}\t{{.Size}}" | head -n 10
echo ""

# Test 4: Vérifier que les fichiers nécessaires sont présents
echo -e "${YELLOW}📂 Test 4: Vérification des fichiers${NC}"
echo ""

check_file() {
  local file=$1
  if docker run --rm ${IMAGE_NAME}:latest ls ${file} > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} ${file}"
  else
    echo -e "  ${RED}✗${NC} ${file} (manquant)"
    return 1
  fi
}

check_file "/app/server.js"
check_file "/app/.next/static"
check_file "/app/prisma/schema.prisma"
check_file "/app/node_modules"
check_file "/app/src"
check_file "/app/package.json"
echo ""

# Test 5: Vérifier que l'image peut démarrer (test rapide)
echo -e "${YELLOW}🚀 Test 5: Test de démarrage (5 secondes)${NC}"
echo ""

# Démarrer le container en arrière-plan
container_id=$(docker run -d \
  -e DATABASE_URL="file:./dev.db" \
  -e BETTER_AUTH_SECRET="test-secret-min-32-characters-long" \
  -e BETTER_AUTH_URL="http://localhost:3000" \
  -e EMAIL_FROM="test@localhost" \
  -e EMAIL_PROVIDER="nodemailer" \
  -e REDIS_HOST="localhost" \
  -e REDIS_PORT="6379" \
  -e NODE_ENV="production" \
  ${IMAGE_NAME}:latest)

echo -e "  Container ID: ${BLUE}${container_id:0:12}${NC}"

# Attendre 5 secondes
sleep 5

# Vérifier les logs
echo ""
echo -e "${YELLOW}📋 Logs du container:${NC}"
docker logs ${container_id} | head -n 20

# Vérifier si le container tourne toujours
if docker ps | grep ${container_id:0:12} > /dev/null; then
  echo ""
  echo -e "${GREEN}✓ Container démarré avec succès !${NC}"
  docker stop ${container_id} > /dev/null 2>&1
  docker rm ${container_id} > /dev/null 2>&1
else
  echo ""
  echo -e "${RED}✗ Container a crash${NC}"
  docker logs ${container_id}
  docker rm ${container_id} > /dev/null 2>&1
  exit 1
fi

# Résumé
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   📊 Résumé${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✓ Tous les tests sont passés !${NC}"
echo ""
echo -e "L'image Docker est prête pour le déploiement."
echo -e "Vous pouvez maintenant :"
echo -e "  1. Push vers votre registry"
echo -e "  2. Déployer sur Coolify"
echo -e "  3. Tester avec docker-compose up"
echo ""
