#!/bin/bash

echo "🔧 Test e Setup Backend Cartella Clinica"
echo "========================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vai alla directory backend
cd /Users/lucamambelli/Desktop/Cartella-Clinica/backend

echo -e "${YELLOW}1. Verifico le dipendenze...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules non trovato. Installo le dipendenze...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Dipendenze installate${NC}"
fi

echo -e "\n${YELLOW}2. Controllo la connessione al database...${NC}"
# Test connessione database
npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connesso con successo');
    return prisma.\$disconnect();
  })
  .catch((err) => {
    console.error('❌ Errore connessione database:', err.message);
    process.exit(1);
  });
"

echo -e "\n${YELLOW}3. Genero Prisma Client...${NC}"
npx prisma generate

echo -e "\n${YELLOW}4. Eseguo le migrazioni...${NC}"
npx prisma migrate deploy

echo -e "\n${YELLOW}5. Creo gli utenti di test...${NC}"
npm run seed:users

echo -e "\n${YELLOW}6. Verifico gli utenti nel database...${NC}"
npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });
    console.log('Utenti nel database:');
    users.forEach(u => {
      console.log(\`  - \${u.email} (\${u.firstName} \${u.lastName}) - Ruolo: \${u.role} - Attivo: \${u.isActive}\`);
    });
    await prisma.\$disconnect();
  } catch (err) {
    console.error('❌ Errore:', err);
    await prisma.\$disconnect();
    process.exit(1);
  }
}
checkUsers();
"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup completato!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nOra puoi avviare il backend con: ${YELLOW}npm run dev${NC}"
echo -e "\nCredenziali di test:"
echo "  Email: admin@medicinaravenna.it"
echo "  Password: admin123"
