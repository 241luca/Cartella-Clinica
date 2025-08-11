#!/bin/bash

echo "📊 Verifica rapida database Cartella Clinica"
echo "==========================================="

cd /Users/lucamambelli/Desktop/Cartella-Clinica/backend

# Conta i record usando Prisma
echo ""
echo "Conteggio record nel database:"
echo ""

npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function count() {
  const counts = {
    users: await prisma.user.count(),
    patients: await prisma.patient.count(),
    clinicalRecords: await prisma.clinicalRecord.count(),
    therapies: await prisma.therapy.count(),
    therapySessions: await prisma.therapySession.count(),
    documents: await prisma.document.count(),
  };
  
  console.log('👤 Utenti:           ', counts.users);
  console.log('👥 Pazienti:         ', counts.patients);
  console.log('📁 Cartelle Cliniche:', counts.clinicalRecords);
  console.log('💊 Terapie:          ', counts.therapies);
  console.log('📅 Sedute:           ', counts.therapySessions);
  console.log('📄 Documenti:        ', counts.documents);
  console.log('----------------------------');
  console.log('📊 TOTALE:           ', Object.values(counts).reduce((a,b) => a+b, 0));
  
  await prisma.\$disconnect();
}

count().catch(console.error);
"

echo ""
echo "==========================================="
echo "Se i numeri sono bassi, esegui:"
echo "npm run seed:complete"
echo "==========================================="