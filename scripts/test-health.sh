#!/bin/bash

# 🏥 Script de test des healthchecks
# Teste tous les endpoints de santé de l'application

set -e

# Configuration
BASE_URL="${1:-http://localhost:3000}"
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
echo -e "${BLUE}   🏥 Faktuur.io - Health Check Tests${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Base URL: ${BASE_URL}${NC}"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
  local name=$1
  local endpoint=$2
  local expected_status=${3:-200}
  
  echo -e "${YELLOW}Testing: ${name}${NC}"
  echo -e "  Endpoint: ${endpoint}"
  
  response=$(curl -s -w "\n%{http_code}" "${BASE_URL}${endpoint}" 2>&1)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "$expected_status" ]; then
    echo -e "  ${GREEN}✓ Status: ${http_code} (Expected: ${expected_status})${NC}"
    echo -e "  ${GREEN}✓ Response:${NC} ${body}"
    echo ""
    return 0
  else
    echo -e "  ${RED}✗ Status: ${http_code} (Expected: ${expected_status})${NC}"
    echo -e "  ${RED}✗ Response:${NC} ${body}"
    echo ""
    return 1
  fi
}

# Tests
total_tests=0
passed_tests=0

# Test 1: Basic health check
((total_tests++))
if test_endpoint "Basic Health Check" "/api/health" 200; then
  ((passed_tests++))
fi

# Test 2: Detailed health check
((total_tests++))
if test_endpoint "Detailed Health Check" "/api/health/detailed" 200; then
  ((passed_tests++))
fi

# Test 3: Readiness probe
((total_tests++))
if test_endpoint "Readiness Probe" "/api/health/ready" 200; then
  ((passed_tests++))
fi

# Test 4: Liveness probe
((total_tests++))
if test_endpoint "Liveness Probe" "/api/health/live" 200; then
  ((passed_tests++))
fi

# Résumé
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   📊 Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  Total tests: ${total_tests}"

if [ $passed_tests -eq $total_tests ]; then
  echo -e "  ${GREEN}✓ Passed: ${passed_tests}${NC}"
  echo -e "  ${RED}✗ Failed: $((total_tests - passed_tests))${NC}"
  echo ""
  echo -e "${GREEN}🎉 All health checks passed!${NC}"
  exit 0
else
  echo -e "  ${GREEN}✓ Passed: ${passed_tests}${NC}"
  echo -e "  ${RED}✗ Failed: $((total_tests - passed_tests))${NC}"
  echo ""
  echo -e "${RED}❌ Some health checks failed!${NC}"
  exit 1
fi
