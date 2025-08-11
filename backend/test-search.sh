#!/bin/bash

# Login e ottieni token
echo "🔐 Login in corso..."
TOKEN=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

echo "✅ Token ottenuto"
echo ""

# Test ricerca pazienti con "gr"
echo "📊 RICERCA PAZIENTI con 'gr':"
echo "================================"
curl -s "http://localhost:3100/api/patients?search=gr" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    patients = data.get('data', [])
    print(f'Trovati {len(patients)} pazienti:')
    for p in patients:
        print(f\"  - {p['firstName']} {p['lastName']} (CF: {p['fiscalCode']})\")
else:
    print('Errore:', data.get('message'))
"

echo ""
echo "📊 RICERCA CARTELLE CLINICHE con 'gr':"
echo "================================"
curl -s "http://localhost:3100/api/clinical-records?search=gr&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    records = data.get('data', [])
    print(f'Trovate {len(records)} cartelle:')
    for r in records:
        patient = r.get('patient', {})
        print(f\"  - Cartella #{r['recordNumber']}\")
        print(f\"    Paziente: {patient.get('firstName', '')} {patient.get('lastName', '')}\")
        print(f\"    Diagnosi: {r['diagnosis']}\")
else:
    print('Errore:', data.get('message'))
"

echo ""
echo "📊 RICERCA TERAPIE con 'gr':"
echo "================================"
curl -s "http://localhost:3100/api/therapies?search=gr&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    therapies = data.get('data', [])
    print(f'Trovate {len(therapies)} terapie:')
    for t in therapies:
        therapy_type = t.get('therapyType', {})
        record = t.get('clinicalRecord', {})
        patient = record.get('patient', {}) if record else {}
        print(f\"  - {therapy_type.get('name', 'Terapia')}\")
        print(f\"    Paziente: {patient.get('firstName', '')} {patient.get('lastName', '')}\")
        print(f\"    Sedute: {t.get('completedSessions', 0)}/{t.get('prescribedSessions', 0)}\")
else:
    print('Errore:', data.get('message'))
"
