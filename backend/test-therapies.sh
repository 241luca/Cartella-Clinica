#!/bin/bash

# Script per testare le API delle terapie
# Uso: ./test-therapies.sh

echo "🔐 Login come admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login fallito. Verifica che il server sia attivo."
    exit 1
fi

echo "✅ Login riuscito!"
echo "Token: ${TOKEN:0:20}..."

echo ""
echo "📝 Inizializzazione tipi di terapia..."
INIT_RESPONSE=$(curl -s -X POST http://localhost:3100/api/therapies/initialize-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Risposta: $INIT_RESPONSE"

echo ""
echo "✅ Tipi di terapia inizializzati!"
echo ""
echo "Per creare una terapia, usa questo comando con un ID di cartella clinica valido:"
echo ""
echo "curl -X POST http://localhost:3100/api/therapies \\"
echo "  -H \"Authorization: Bearer $TOKEN\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"clinicalRecordId\": \"[INSERISCI_ID_CARTELLA]\","
echo "    \"therapyType\": \"MAGNETOTERAPIA\","
echo "    \"parameters\": {"
echo "      \"programma\": 1,"
echo "      \"hertz\": 50,"
echo "      \"intensita\": 30,"
echo "      \"tempo\": 30"
echo "    }"
echo "  }'"
