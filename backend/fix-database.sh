#!/bin/bash

echo "🚀 Setup Database Cartella Clinica - Fix Permessi"
echo "================================================="

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ottieni username corrente
CURRENT_USER=$(whoami)
echo -e "${BLUE}👤 Utente corrente: $CURRENT_USER${NC}"

# Funzione per tentare connessione
try_connection() {
    local conn_string=$1
    local desc=$2
    echo -e "${YELLOW}Tentativo con: $desc${NC}"
    
    if psql "$conn_string" -c "SELECT 1" &>/dev/null; then
        echo -e "${GREEN}✅ Connessione riuscita!${NC}"
        return 0
    else
        echo -e "${RED}❌ Connessione fallita${NC}"
        return 1
    fi
}

# Determina la stringa di connessione corretta
echo ""
echo -e "${YELLOW}🔍 Ricerca configurazione PostgreSQL corretta...${NC}"

# Prova diverse combinazioni
if try_connection "postgresql:///$CURRENT_USER" "utente corrente senza password"; then
    DB_USER=$CURRENT_USER
    CONNECTION_STRING="postgresql://$CURRENT_USER@localhost:5432/cartella_clinica"
elif try_connection "postgresql:///postgres" "database postgres"; then
    DB_USER=$CURRENT_USER
    CONNECTION_STRING="postgresql://$CURRENT_USER@localhost:5432/cartella_clinica"
elif try_connection "postgresql://postgres@localhost/postgres" "utente postgres"; then
    DB_USER="postgres"
    CONNECTION_STRING="postgresql://postgres@localhost:5432/cartella_clinica"
else
    echo -e "${RED}❌ Non riesco a connettermi a PostgreSQL${NC}"
    echo ""
    echo "Opzioni per risolvere:"
    echo "1. Avvia PostgreSQL: brew services start postgresql"
    echo "2. Crea un utente: createuser -s $CURRENT_USER"
    echo "3. Usa pg_ctl per avviare: pg_ctl -D /usr/local/var/postgres start"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Configurazione trovata: DB_USER=$DB_USER${NC}"

# Crea o verifica il database
echo ""
echo -e "${YELLOW}📊 Gestione database 'cartella_clinica'...${NC}"

# Controlla se il database esiste
if psql -lqt | cut -d \| -f 1 | grep -qw cartella_clinica; then
    echo -e "${BLUE}Database già esistente${NC}"
    
    # Chiedi se fare drop e ricreare
    echo ""
    echo -e "${YELLOW}Vuoi eliminare e ricreare il database? (s/n)${NC}"
    read -r response
    if [[ "$response" == "s" || "$response" == "S" ]]; then
        echo -e "${YELLOW}Eliminazione database...${NC}"
        dropdb cartella_clinica 2>/dev/null || true
        echo -e "${YELLOW}Creazione nuovo database...${NC}"
        createdb cartella_clinica
        echo -e "${GREEN}✅ Database ricreato${NC}"
    fi
else
    echo -e "${YELLOW}Creazione database...${NC}"
    createdb cartella_clinica
    echo -e "${GREEN}✅ Database creato${NC}"
fi

# Aggiorna il file .env con la connection string corretta
echo ""
echo -e "${YELLOW}📝 Aggiornamento file .env...${NC}"

# Backup del .env attuale
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Aggiorna DATABASE_URL nel .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$CONNECTION_STRING\"|" .env
else
    # Linux
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$CONNECTION_STRING\"|" .env
fi

echo -e "${GREEN}✅ File .env aggiornato${NC}"
echo -e "${BLUE}   Connection string: $CONNECTION_STRING${NC}"

# Genera Prisma Client
echo ""
echo -e "${YELLOW}🔧 Generazione Prisma Client...${NC}"
npx prisma generate

# Esegui migrations
echo ""
echo -e "${YELLOW}📝 Esecuzione migrations...${NC}"
npx prisma migrate dev --name init --skip-seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completate con successo!${NC}"
else
    echo -e "${RED}❌ Errore nelle migrations${NC}"
    echo "Controlla i log sopra per dettagli"
    exit 1
fi

# Test connessione finale
echo ""
echo -e "${YELLOW}🧪 Test connessione finale...${NC}"
npx prisma db pull --print &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Connessione al database verificata${NC}"
else
    echo -e "${RED}❌ Problema di connessione${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup completato con successo!${NC}"
echo ""
echo -e "${BLUE}📋 Riepilogo configurazione:${NC}"
echo "   Database: cartella_clinica"
echo "   Utente: $DB_USER"
echo "   Host: localhost"
echo "   Porta: 5432"
echo ""
echo -e "${YELLOW}Prossimi passi:${NC}"
echo "1. npm run dev         -> Avvia il server di sviluppo"
echo "2. npx prisma studio   -> Apri GUI database"
echo "3. Visita http://localhost:3100/health"
echo ""
echo -e "${BLUE}Connection string salvata in .env${NC}"
echo -e "${BLUE}Backup precedente in: .env.backup.*${NC}"
