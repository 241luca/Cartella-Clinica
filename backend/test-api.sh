#!/bin/bash

echo "🔍 Test API Cartelle Cliniche"
echo "=============================="
echo ""

# Prima otteniamo un token valido facendo login
echo "1. Login per ottenere token..."
TOKEN=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('token', ''))")

if [ -z "$TOKEN" ]; then
  echo "❌ Errore: impossibile ottenere token. Verificare che il backend sia attivo."
  exit 1
fi

echo "✅ Token ottenuto"
echo ""

echo "2. Test endpoint /api/clinical-records..."
echo "URL: http://localhost:3100/api/clinical-records"
echo ""

RESPONSE=$(curl -s -X GET "http://localhost:3100/api/clinical-records?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "📦 Risposta API:"
echo "$RESPONSE" | python3 -m json.tool

echo ""
echo "3. Analisi risposta..."
echo ""

# Estrai informazioni chiave
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))")
TOTAL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('pagination', {}).get('total', 0))")
DATA_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('data', [])))")

echo "✅ Success: $SUCCESS"
echo "📊 Totale cartelle: $TOTAL"
echo "📄 Cartelle in questa pagina: $DATA_COUNT"
