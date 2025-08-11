#!/bin/bash

# Script di test automatico del sistema Cartella Clinica
# Data: 11 Agosto 2025

echo "🧪 TEST AUTOMATICO SISTEMA CARTELLA CLINICA"
echo "==========================================="
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base
BACKEND_URL="http://localhost:3100"
FRONTEND_URL="http://localhost:5183"

# Funzione per verificare se un servizio è attivo
check_service() {
    local url=$1
    local name=$2
    
    if curl -s --head --request GET $url | grep "200\|302\|301" > /dev/null; then 
        echo -e "${GREEN}✅ $name attivo su $url${NC}"
        return 0
    else
        echo -e "${RED}❌ $name non risponde su $url${NC}"
        return 1
    fi
}

# 1. Verifica servizi
echo "1️⃣ VERIFICA SERVIZI"
echo "-------------------"
check_service "$BACKEND_URL/api/health" "Backend"
BACKEND_STATUS=$?

check_service "$FRONTEND_URL" "Frontend"
FRONTEND_STATUS=$?

check_service "http://localhost:5555" "Prisma Studio"
echo ""

# 2. Test API Backend
echo "2️⃣ TEST API BACKEND"
echo "-------------------"

# Login come admin
echo "Testing login admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Login admin funzionante${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "   Token ottenuto: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Login admin fallito${NC}"
    echo "   Response: $LOGIN_RESPONSE"
fi
echo ""

# 3. Test Endpoints principali
echo "3️⃣ TEST ENDPOINTS API"
echo "---------------------"

# Test pazienti
echo "Testing /api/patients..."
PATIENTS=$(curl -s -X GET "$BACKEND_URL/api/patients" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PATIENTS" | grep -q "success"; then
    echo -e "${GREEN}✅ Endpoint pazienti funzionante${NC}"
    PATIENT_COUNT=$(echo "$PATIENTS" | grep -o '"id"' | wc -l)
    echo "   Trovati $PATIENT_COUNT pazienti"
else
    echo -e "${RED}❌ Endpoint pazienti non funziona${NC}"
fi

# Test cartelle cliniche
echo "Testing /api/clinical-records..."
RECORDS=$(curl -s -X GET "$BACKEND_URL/api/clinical-records" \
  -H "Authorization: Bearer $TOKEN")

if echo "$RECORDS" | grep -q "success"; then
    echo -e "${GREEN}✅ Endpoint cartelle cliniche funzionante${NC}"
else
    echo -e "${RED}❌ Endpoint cartelle cliniche non funziona${NC}"
fi

# Test tipi terapia
echo "Testing /api/therapies/therapy-types..."
TYPES=$(curl -s -X GET "$BACKEND_URL/api/therapies/therapy-types" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TYPES" | grep -q "therapyTypes"; then
    echo -e "${GREEN}✅ Endpoint tipi terapia funzionante${NC}"
    TYPE_COUNT=$(echo "$TYPES" | grep -o '"id"' | wc -l)
    echo "   Trovati $TYPE_COUNT tipi di terapia"
    if [ "$TYPE_COUNT" -eq "0" ]; then
        echo -e "${YELLOW}⚠️  Nessun tipo di terapia - inizializzazione necessaria${NC}"
    fi
else
    echo -e "${RED}❌ Endpoint tipi terapia non funziona${NC}"
fi

# Test terapie
echo "Testing /api/therapies..."
THERAPIES=$(curl -s -X GET "$BACKEND_URL/api/therapies" \
  -H "Authorization: Bearer $TOKEN")

if echo "$THERAPIES" | grep -q "success"; then
    echo -e "${GREEN}✅ Endpoint terapie funzionante${NC}"
else
    echo -e "${RED}❌ Endpoint terapie non funziona${NC}"
fi
echo ""

# 4. Report finale
echo "4️⃣ REPORT FINALE"
echo "----------------"

TOTAL_TESTS=6
PASSED_TESTS=0

[ $BACKEND_STATUS -eq 0 ] && ((PASSED_TESTS++))
[ $FRONTEND_STATUS -eq 0 ] && ((PASSED_TESTS++))
[ "$LOGIN_RESPONSE" != "" ] && ((PASSED_TESTS++))
echo "$PATIENTS" | grep -q "success" && ((PASSED_TESTS++))
echo "$RECORDS" | grep -q "success" && ((PASSED_TESTS++))
echo "$THERAPIES" | grep -q "success" && ((PASSED_TESTS++))

PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo "Test superati: $PASSED_TESTS/$TOTAL_TESTS ($PERCENTAGE%)"
echo ""

if [ $PERCENTAGE -eq 100 ]; then
    echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE FUNZIONANTE!${NC}"
elif [ $PERCENTAGE -ge 75 ]; then
    echo -e "${GREEN}✅ Sistema operativo con piccole mancanze${NC}"
elif [ $PERCENTAGE -ge 50 ]; then
    echo -e "${YELLOW}⚠️ Sistema parzialmente operativo${NC}"
else
    echo -e "${RED}❌ Sistema non operativo - necessari fix${NC}"
fi

echo ""
echo "📋 SUGGERIMENTI:"
if [ "$TYPE_COUNT" -eq "0" ]; then
    echo "• Esegui: curl -X POST $BACKEND_URL/api/therapies/initialize-types -H 'Authorization: Bearer $TOKEN'"
fi

echo ""
echo "🏁 TEST COMPLETATO"
echo "=================="
