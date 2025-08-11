#!/bin/bash

# Colori per output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3100/api"

echo -e "${BLUE}🔐 TEST AUTENTICAZIONE JWT${NC}"
echo "=================================="
echo ""

# 1. Test login con credenziali corrette
echo -e "${YELLOW}1. Test Login Admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicinaravenna.it",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Estrai il token dalla risposta
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('accessToken', ''))")

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Login fallito - nessun token ricevuto${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Login riuscito!${NC}"
echo -e "${BLUE}Token ricevuto (primi 50 caratteri): ${ACCESS_TOKEN:0:50}...${NC}"
echo ""

# 2. Test accesso endpoint protetto con token
echo -e "${YELLOW}2. Test Profilo Utente (endpoint protetto)...${NC}"
curl -s -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -m json.tool
echo ""

# 3. Test accesso pazienti con token
echo -e "${YELLOW}3. Test Lista Pazienti (richiede autenticazione)...${NC}"
PATIENTS_RESPONSE=$(curl -s -X GET $API_URL/patients \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PATIENTS_RESPONSE" | grep -q "success"; then
  echo -e "${GREEN}✅ Accesso autorizzato ai pazienti${NC}"
  echo "$PATIENTS_RESPONSE" | python3 -m json.tool | head -20
else
  echo -e "${RED}❌ Accesso negato${NC}"
  echo "$PATIENTS_RESPONSE"
fi
echo ""

# 4. Test accesso senza token
echo -e "${YELLOW}4. Test Accesso Senza Token (deve fallire)...${NC}"
NO_AUTH_RESPONSE=$(curl -s -X GET $API_URL/patients)
echo "$NO_AUTH_RESPONSE" | python3 -m json.tool
echo ""

# 5. Test login con credenziali errate
echo -e "${YELLOW}5. Test Login con Password Errata...${NC}"
curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicinaravenna.it",
    "password": "password_sbagliata"
  }' | python3 -m json.tool
echo ""

# 6. Test login terapista
echo -e "${YELLOW}6. Test Login Terapista...${NC}"
THERAPIST_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "terapista@medicinaravenna.it",
    "password": "therapist123"
  }')

echo "$THERAPIST_RESPONSE" | python3 -m json.tool
echo ""

# Riepilogo
echo -e "${BLUE}=================================="
echo -e "📊 RIEPILOGO TEST${NC}"
echo ""
echo -e "${GREEN}✅ Endpoint testati:${NC}"
echo "  - POST /api/auth/login"
echo "  - GET /api/auth/me"
echo "  - GET /api/patients (con e senza auth)"
echo ""
echo -e "${BLUE}🔑 Credenziali di test:${NC}"
echo "  Admin: admin@medicinaravenna.it / admin123"
echo "  Terapista: terapista@medicinaravenna.it / therapist123"
echo ""
echo -e "${YELLOW}⚠️  Nota: Tutte le API ora richiedono autenticazione JWT${NC}"
echo "  Includi sempre: Authorization: Bearer <token>"
