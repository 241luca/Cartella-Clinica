#!/bin/bash

echo "🧪 Test API Backend"
echo "==================="

# Colori
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}1. Test Health Check${NC}"
curl -s http://localhost:3100/health | python3 -m json.tool || echo -e "${RED}❌ Backend non raggiungibile${NC}"

echo -e "\n${YELLOW}2. Test API Info${NC}"
curl -s http://localhost:3100/api | python3 -m json.tool || echo -e "${RED}❌ API non raggiungibile${NC}"

echo -e "\n${YELLOW}3. Test Login con credenziali admin${NC}"
response=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}')

if echo "$response" | grep -q "token"; then
    echo -e "${GREEN}✅ Login riuscito!${NC}"
    echo "$response" | python3 -m json.tool
else
    echo -e "${RED}❌ Login fallito${NC}"
    echo "$response" | python3 -m json.tool
fi

echo -e "\n${YELLOW}4. Test Login con credenziali errate${NC}"
response=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrong"}')

if echo "$response" | grep -q "Credenziali non valide"; then
    echo -e "${GREEN}✅ Errore gestito correttamente${NC}"
else
    echo -e "${RED}❌ Errore non gestito correttamente${NC}"
    echo "$response"
fi

echo -e "\n==================="
echo -e "${GREEN}Test completati${NC}"
