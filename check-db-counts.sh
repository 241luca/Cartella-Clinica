#!/bin/bash

echo "📊 Verifica contatori database..."
echo ""

cd /Users/lucamambelli/Desktop/Cartella-Clinica/backend

# Esegui query SQL per contare i record
npx prisma db execute --stdin <<EOF
SELECT 'Patient' as table_name, COUNT(*) as count FROM "Patient"
UNION ALL
SELECT 'ClinicalRecord', COUNT(*) FROM "ClinicalRecord"  
UNION ALL
SELECT 'Therapy', COUNT(*) FROM "Therapy"
UNION ALL
SELECT 'TherapyType', COUNT(*) FROM "TherapyType"
UNION ALL
SELECT 'TherapySession', COUNT(*) FROM "TherapySession"
UNION ALL
SELECT 'User', COUNT(*) FROM "User"
UNION ALL
SELECT 'VitalSign', COUNT(*) FROM "VitalSign"
UNION ALL
SELECT 'Anamnesis', COUNT(*) FROM "Anamnesis";
EOF
