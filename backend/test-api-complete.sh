#!/bin/bash

# Colori per output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3100/api"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 TEST COMPLETO API BACKEND${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Funzione per test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local token=$5
    
    echo -e "${YELLOW}Testing: $description${NC}"
    
    if [ -z "$token" ]; then
        if [ -z "$data" ]; then
            response=$(curl -s -X $method $API_URL$endpoint)
        else
            response=$(curl -s -X $method $API_URL$endpoint \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    else
        if [ -z "$data" ]; then
            response=$(curl -s -X $method $API_URL$endpoint \
                -H "Authorization: Bearer $token")
        else
            response=$(curl -s -X $method $API_URL$endpoint \
                -H "Authorization: Bearer $token" \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    fi
    
    success=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null)
    
    if [ "$success" = "True" ]; then
        echo -e "${GREEN}✅ Passed${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null | head -10
    fi
    echo ""
}

# 1. TEST AUTENTICAZIONE
echo -e "${BLUE}1️⃣ AUTENTICAZIONE${NC}"
echo "-------------------"

# Login Admin
echo -e "${YELLOW}Login Admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@medicinaravenna.it","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('accessToken',''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login riuscito${NC}"
    echo "Token (primi 50 char): ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login fallito${NC}"
    echo "$LOGIN_RESPONSE" | python3 -m json.tool
    exit 1
fi
echo ""

# Test profilo
test_endpoint "GET" "/auth/me" "Profilo utente" "" "$TOKEN"

# 2. TEST PAZIENTI
echo -e "${BLUE}2️⃣ PAZIENTI${NC}"
echo "------------"

test_endpoint "GET" "/patients" "Lista pazienti" "" "$TOKEN"

# 3. TEST CARTELLE CLINICHE
echo -e "${BLUE}3️⃣ CARTELLE CLINICHE${NC}"
echo "---------------------"

test_endpoint "GET" "/clinical-records" "Lista cartelle" "" "$TOKEN"

# 4. TEST TIPI TERAPIA
echo -e "${BLUE}4️⃣ TIPI DI TERAPIA${NC}"
echo "-------------------"

test_endpoint "GET" "/therapy-types" "Lista tipi terapia" "" "$TOKEN"
test_endpoint "GET" "/therapy-types/categories" "Categorie terapie" "" "$TOKEN"

# 5. TEST TERAPIE
echo -e "${BLUE}5️⃣ TERAPIE${NC}"
echo "-----------"

test_endpoint "GET" "/therapies" "Lista terapie" "" "$TOKEN"

# 6. TEST SEDUTE
echo -e "${BLUE}6️⃣ SEDUTE TERAPIA${NC}"
echo "------------------"

test_endpoint "GET" "/therapy-sessions" "Lista sedute" "" "$TOKEN"

# Test calendario
START_DATE=$(date -v-30d +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)
test_endpoint "GET" "/therapy-sessions/calendar?startDate=$START_DATE&endDate=$END_DATE" "Calendario sedute" "" "$TOKEN"

# 7. TEST SENZA TOKEN (deve fallire)
echo -e "${BLUE}7️⃣ TEST SICUREZZA${NC}"
echo "------------------"

echo -e "${YELLOW}Test accesso senza token (deve fallire)...${NC}"
response=$(curl -s -X GET $API_URL/patients)
success=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', True))" 2>/dev/null)

if [ "$success" = "False" ]; then
    echo -e "${GREEN}✅ Accesso negato correttamente${NC}"
else
    echo -e "${RED}❌ ATTENZIONE: Accesso consentito senza token!${NC}"
fi
echo ""

# RIEPILOGO
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 RIEPILOGO TEST${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${GREEN}Endpoints testati:${NC}"
echo "  ✓ Autenticazione (login, profilo)"
echo "  ✓ Pazienti"
echo "  ✓ Cartelle cliniche"
echo "  ✓ Tipi di terapia"
echo "  ✓ Terapie"
echo "  ✓ Sedute terapia"
echo "  ✓ Calendario"
echo "  ✓ Sicurezza (accesso negato senza token)"
echo ""

echo -e "${BLUE}🎉 Test completati!${NC}"
echo ""
echo -e "${YELLOW}Nota: Per test più approfonditi, usa Postman o Insomnia${NC}"
