# 📦 SETUP E CONFIGURAZIONE
## Guida Completa Setup Ambiente di Sviluppo

---

## 📋 INDICE

1. [Environment Setup](./environment-setup.md) - Configurazione completa ambiente
2. [Project Structure](./project-structure.md) - Struttura directory e files
3. [Dependencies](./dependencies.md) - Tutte le dipendenze necessarie
4. [Docker Setup](./docker-setup.md) - Configurazione Docker
5. [Quick Start](./quick-start.md) - Guida rapida per iniziare

---

## 🚀 QUICK START

### 1. Prerequisiti
```bash
# Verifica Node.js (richiesto 18+)
node --version

# Verifica npm
npm --version

# Verifica PostgreSQL (richiesto 14+)
psql --version

# Verifica Redis (opzionale ma consigliato)
redis-cli --version
```

### 2. Clone Repository
```bash
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Modifica .env con le tue configurazioni
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### 4. Setup Frontend
```bash
# In nuovo terminale
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 5. Accesso
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API Docs: http://localhost:3000/api-docs

---

## 🔧 CONFIGURAZIONI RICHIESTE

### File .env Backend
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cartella_clinica"

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
CORS_ORIGIN=http://localhost:5173
```

### File .env Frontend
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_NAME=Cartella Clinica Digitale
```

---

## 🐳 DOCKER SETUP (Opzionale)

### Setup con Docker Compose
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica stato
docker-compose ps

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ✅ VERIFICA INSTALLAZIONE

### Test Backend
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Database
```bash
npx prisma studio
# Si aprirà il browser con Prisma Studio
```

### Test Frontend
Apri http://localhost:5173 nel browser

---

## 🔍 TROUBLESHOOTING

### Errore: Cannot connect to PostgreSQL
```bash
# Verifica che PostgreSQL sia in esecuzione
sudo systemctl status postgresql

# Avvia se necessario
sudo systemctl start postgresql
```

### Errore: Port already in use
```bash
# Trova processo sulla porta
lsof -i :3000

# Killa processo
kill -9 <PID>
```

### Errore: Prisma migration failed
```bash
# Reset database
npx prisma migrate reset

# Rigenera client
npx prisma generate
```

---

## 📚 PROSSIMI PASSI

1. ✅ Setup completato
2. → Leggi [Project Structure](./project-structure.md)
3. → Studia [Backend Architecture](../02-Backend/README.md)
4. → Inizia sviluppo

---

*Setup Guide v2.0 - Agosto 2025*
