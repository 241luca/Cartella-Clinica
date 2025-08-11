#!/bin/bash

# Test API Script per Cartella Clinica

echo "🔐 1. Login per ottenere il token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}')

echo "Response login:"
echo $LOGIN_RESPONSE | python3 -m json.tool

# Estrai il token dalla risposta
TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Errore: non riesco ad ottenere il token"
    exit 1
fi

echo ""
echo "✅ Token ottenuto: ${TOKEN:0:20}..."
echo ""

echo "📋 2. Test API Pazienti..."
curl -s -X GET http://localhost:3100/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | python3 -m json.tool

echo ""
echo "🏥 3. Test API Tipi di Terapia..."
curl -s -X GET http://localhost:3100/api/therapy-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | python3 -m json.tool
