# 📋 GUIDA SETUP COMPLETA

## Requisiti di Sistema

### Software Richiesto
- **Node.js**: v18.0.0 o superiore
- **npm**: v9.0.0 o superiore  
- **PostgreSQL**: v14.0 o superiore
- **Git**: Ultima versione

### Hardware Consigliato
- **RAM**: Minimo 4GB (8GB consigliato)
- **Storage**: 2GB spazio libero
- **Processore**: Dual-core 2GHz+

## 🚀 Installazione Step-by-Step

### 1. Clonare il Repository

```bash
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica
```

### 2. Setup Database PostgreSQL

#### Opzione A: PostgreSQL Locale

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Scarica installer da https://www.postgresql.org/download/windows/
```

#### Opzione B: Docker

```bash
docker run --name cartella-clinica-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=cartella_clinica \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Configurazione Backend

```bash
cd backend

# Installa dipendenze
npm install

# Crea file environment
cp .env.example .env
```

#### Configura .env:

```env
# Database
DATABASE_URL="postgresql://admin:password123@localhost:5432/cartella_clinica"

# Server
PORT=3100
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5183

# Email (opzionale)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Setup Database:

```bash
# Crea database schema
npx prisma migrate dev --name init

# Genera Prisma Client
npx prisma generate

# (Opzionale) Seed database con dati di esempio
npx prisma db seed
```

#### Avvia Backend:

```bash
# Development mode con hot-reload
npm run dev

# Production mode
npm run build
npm start
```

### 4. Configurazione Frontend

```bash
# Apri nuovo terminale
cd frontend

# Installa dipendenze
npm install

# Crea file environment
cp .env.example .env.local
```

#### Configura .env.local:

```env
VITE_API_URL=http://localhost:3100/api
VITE_APP_NAME="Cartella Clinica"
VITE_APP_VERSION=2.0.0
```

#### Avvia Frontend:

```bash
# Development mode
npm run dev

# Build per produzione
npm run build
npm run preview
```

## 🔑 Accesso al Sistema

### Account Default

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@medicinaravenna.it | Admin123! |
| Dottore | dottore@medicinaravenna.it | Dottore123! |
| Terapista | terapista@medicinaravenna.it | Terapista123! |

### Primo Accesso

1. Apri browser su http://localhost:5183
2. Usa credenziali admin
3. Cambia password al primo accesso
4. Crea nuovi utenti dal pannello admin

## 🔧 Configurazioni Avanzate

### SSL/HTTPS Locale

```bash
# Genera certificati self-signed
cd frontend
npm run generate-cert

# Modifica vite.config.ts
export default {
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    }
  }
}
```

### Proxy Configuration

Se usi un reverse proxy (nginx):

```nginx
server {
    listen 80;
    server_name cartella-clinica.local;

    location / {
        proxy_pass http://localhost:5183;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /api {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
    }
}
```

### Docker Compose (Opzionale)

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: cartella_clinica
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3100:3100"
    environment:
      DATABASE_URL: postgresql://admin:password123@db:5432/cartella_clinica
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5183:5183"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🐛 Troubleshooting

### Errore: "Cannot connect to database"

```bash
# Verifica PostgreSQL sia attivo
psql -U postgres -c "SELECT 1"

# Verifica connection string
npx prisma db pull
```

### Errore: "Port already in use"

```bash
# Trova processo sulla porta
lsof -i :3100  # backend
lsof -i :5183  # frontend

# Killa processo
kill -9 <PID>
```

### Errore: "Module not found"

```bash
# Pulisci cache e reinstalla
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Reset Database

```bash
cd backend

# Drop e ricrea database
npx prisma migrate reset

# Solo reset dati
npx prisma db push --force-reset
```

## 📦 Build Produzione

### Backend

```bash
cd backend

# Build
npm run build

# Start production
NODE_ENV=production npm start

# Con PM2
pm2 start dist/server.js --name cartella-clinica-api
```

### Frontend

```bash
cd frontend

# Build ottimizzato
npm run build

# Test build locale
npm run preview

# Deploy su server
rsync -avz dist/ user@server:/var/www/cartella-clinica
```

## 🔄 Aggiornamenti

```bash
# Pull ultimi cambiamenti
git pull origin main

# Aggiorna dipendenze backend
cd backend
npm update
npx prisma migrate deploy

# Aggiorna dipendenze frontend
cd frontend
npm update

# Rebuild
npm run build
```

## 🏥 Configurazione Clinica

### Personalizzazione Logo e Branding

1. Sostituisci `/frontend/public/logo.png`
2. Modifica `/frontend/src/config/clinic.ts`:

```typescript
export const clinicConfig = {
  name: "Medicina Ravenna",
  logo: "/logo.png",
  colors: {
    primary: "#4F46E5",
    secondary: "#7C3AED"
  },
  contacts: {
    phone: "0544-456845",
    email: "info@medicinaravenna.it",
    address: "Via Porto Coriandro, 7 - Ravenna"
  }
}
```

### Tipi di Terapia Personalizzati

Modifica `/backend/src/services/TherapyService.ts` per aggiungere nuovi tipi.

## 📞 Supporto

Per problemi di setup:
- 📧 Email: lucamambelli@lmtecnologie.it
- 🐛 GitHub Issues: https://github.com/241luca/cartella-clinica/issues
- 📖 Documentazione: /Docs

---
*Setup guide v2.0.0 - Agosto 2025*
