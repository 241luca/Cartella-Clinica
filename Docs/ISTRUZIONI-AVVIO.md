# 🚀 ISTRUZIONI AVVIO PROGETTO

## 📍 PORTE UTILIZZATE
- **Backend**: `3100` (invece di 3000)
- **Frontend**: `5183` (invece di 5173)

---

## 🔧 SETUP INIZIALE

### 1. Prerequisiti
- Node.js 18+ installato
- PostgreSQL installato
- Git configurato

### 2. Installazione Backend
```bash
cd backend
npm install
```

### 3. Setup Database
```bash
# Opzione 1: Usa lo script automatico
./setup-database.sh

# Opzione 2: Manualmente
psql -U postgres -c "CREATE DATABASE cartella_clinica"
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Avvio Server di Sviluppo
```bash
npm run dev
```

Il server sarà disponibile su: **http://localhost:3100**

---

## 🧪 TEST ENDPOINTS

### Health Check
```bash
curl http://localhost:3100/health
```

### API Info
```bash
curl http://localhost:3100/api
```

---

## 📝 COMANDI UTILI

### Backend
```bash
# Sviluppo con hot-reload
npm run dev

# Build produzione
npm run build

# Start produzione
npm start

# Prisma Studio (GUI database)
npm run prisma:studio

# Genera migrations
npx prisma migrate dev --name nome_migration

# Reset database
npx prisma migrate reset
```

### Database
```bash
# Accedi a PostgreSQL
psql -U postgres -d cartella_clinica

# Backup database
pg_dump -U postgres cartella_clinica > backup.sql

# Restore database
psql -U postgres cartella_clinica < backup.sql
```

---

## 🔍 TROUBLESHOOTING

### Problema: "Database connection failed"
**Soluzione**: Verifica che PostgreSQL sia in esecuzione
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Problema: "Port already in use"
**Soluzione**: Le porte 3100 e 5183 sono state scelte apposta per evitare conflitti.
Se comunque occupate, modifica in:
- `.env` per il backend
- `vite.config.ts` per il frontend (quando lo creeremo)

### Problema: "Permission denied" su setup-database.sh
**Soluzione**: 
```bash
chmod +x setup-database.sh
```

---

## 📊 STATO SERVIZI

| Servizio | URL | Porta | Status |
|----------|-----|-------|--------|
| Backend API | http://localhost:3100 | 3100 | ✅ Configurato |
| Frontend | http://localhost:5183 | 5183 | ⏳ Da creare |
| PostgreSQL | localhost | 5432 | ✅ Standard |
| Prisma Studio | http://localhost:5555 | 5555 | ✅ Standard |

---

## 🛡️ VARIABILI AMBIENTE

Il file `.env` è già configurato con:
- Porta backend: **3100**
- CORS origin: **http://localhost:5183**
- Database: PostgreSQL su porta standard 5432
- JWT secrets generati

⚠️ **IMPORTANTE**: Non committare mai il file `.env` su Git!

---

*Documento aggiornato: 10 Agosto 2025*
