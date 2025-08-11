#!/bin/bash

echo "🚀 Setup Database Cartella Clinica"
echo "=================================="

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica PostgreSQL
echo -e "${YELLOW}📍 Verifica installazione PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL trovato${NC}"
    psql --version
else
    echo -e "${RED}❌ PostgreSQL non trovato!${NC}"
    echo "Installa PostgreSQL con: brew install postgresql"
    exit 1
fi

# Crea database
echo -e "${YELLOW}📊 Creazione database 'cartella_clinica'...${NC}"
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'cartella_clinica'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE cartella_clinica"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database pronto${NC}"
else
    echo -e "${YELLOW}⚠️  Database già esistente o creato con altro utente${NC}"
fi

# Genera Prisma Client
echo -e "${YELLOW}🔧 Generazione Prisma Client...${NC}"
npx prisma generate

# Esegui migrations
echo -e "${YELLOW}📝 Esecuzione migrations...${NC}"
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completate${NC}"
else
    echo -e "${RED}❌ Errore nelle migrations${NC}"
    echo "Controlla le credenziali in .env"
fi

echo ""
echo -e "${GREEN}🎉 Setup completato!${NC}"
echo ""
echo "Prossimi passi:"
echo "1. npm run dev    -> Avvia il server di sviluppo"
echo "2. Visita http://localhost:3100/health per verificare"
