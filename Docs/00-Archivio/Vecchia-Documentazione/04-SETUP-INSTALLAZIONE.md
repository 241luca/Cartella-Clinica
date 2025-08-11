# 🚀 Setup e Installazione - Sistema Cartella Clinica

## 📋 Prerequisiti Sistema

### Software Richiesti
- **Node.js** v18+ o **Python** 3.10+
- **PostgreSQL** 14+
- **MongoDB** 6.0+
- **Redis** 7.0+
- **Docker** & Docker Compose (opzionale ma consigliato)
- **Git** per version control

### Hardware Minimo
- **Server**: 8GB RAM, 4 CPU cores, 100GB SSD
- **Client**: 4GB RAM, browser moderno (Chrome 90+, Firefox 88+, Safari 14+)
- **Tablet**: iPad/Android con 3GB RAM minimo

## 🔧 Installazione Backend

### 1. Clone del Repository
```bash
# Clona il repository
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica

# Crea branch per sviluppo
git checkout -b develop
```

### 2. Setup con Docker (Consigliato)
```bash
# Copia file environment
cp .env.example .env

# Modifica le variabili in .env
nano .env

# Avvia tutti i servizi
docker-compose up -d

# Verifica stato container
docker-compose ps

# Vedi log
docker-compose logs -f
```

### 3. Setup Manuale

#### A. Database PostgreSQL
```sql
-- Crea database
CREATE DATABASE cartella_clinica;
CREATE USER clinica_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cartella_clinica TO clinica_user;

-- Importa schema
psql -U clinica_user -d cartella_clinica -f database/schema.sql
psql -U clinica_user -d cartella_clinica -f database/migrations/001_initial.sql
```

#### B. MongoDB Setup
```javascript
// Connetti a MongoDB
mongosh

// Crea database e utente
use cartella_clinica_docs
db.createUser({
  user: "clinica_mongo",
  pwd: "secure_password",
  roles: [{role: "readWrite", db: "cartella_clinica_docs"}]
})

// Crea collezioni
db.createCollection("documents")
db.createCollection("clinical_notes")
db.createCollection("body_maps")
```

#### C. Redis Setup
```bash
# Installa Redis
brew install redis  # macOS
apt-get install redis-server  # Ubuntu

# Configura Redis
echo "requirepass your_redis_password" >> /etc/redis/redis.conf
echo "maxmemory 256mb" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

# Avvia Redis
redis-server /etc/redis/redis.conf
```

### 4. Installazione Dipendenze

#### Backend Node.js
```bash
cd backend
npm install

# Dipendenze principali
npm install express cors helmet dotenv
npm install jsonwebtoken bcrypt
npm install pg mongodb redis
npm install multer sharp  # per gestione immagini
npm install nodemailer twilio  # per comunicazioni
npm install socket.io  # per real-time
npm install joi  # validazione
npm install winston  # logging

# Dev dependencies
npm install -D nodemon jest supertest
npm install -D @types/node typescript ts-node
npm install -D eslint prettier
```

#### Backend Python (Alternativa)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oppure
venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Dipendenze principali
pip install fastapi uvicorn
pip install sqlalchemy psycopg2-binary
pip install pymongo motor
pip install redis
pip install python-jose bcrypt
pip install python-multipart pillow  # gestione file
pip install sendgrid twilio  # comunicazioni
pip install python-socketio  # real-time
pip install pydantic  # validazione
```

## 💻 Installazione Frontend

### 1. Setup React App
```bash
cd frontend

# Installa dipendenze
npm install

# Dipendenze UI
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
npm install axios react-query
npm install formik yup  # form e validazione
npm install react-hook-form  # alternativa forms
npm install date-fns  # gestione date
npm install recharts  # grafici
npm install react-dnd  # drag and drop
npm install socket.io-client  # real-time

# Dipendenze sviluppo
npm install -D @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D eslint-plugin-react
```

### 2. Configurazione Environment
```javascript
// .env.local
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_MAPS_KEY=your_key_here
VITE_WHATSAPP_NUMBER=+393334455666
```

## 📱 Setup App Mobile

### React Native Setup
```bash
cd mobile

# Installa React Native CLI
npm install -g react-native-cli

# Crea progetto
npx react-native init CartellaClinicaApp

# Dipendenze
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-camera  # per foto
npm install react-native-signature-canvas  # per firme
npm install react-native-push-notification
npm install react-native-vector-icons

# iOS specific
cd ios && pod install

# Android specific
# Modifica android/app/build.gradle per configurazioni
```

## 🔐 Configurazione Sicurezza

### 1. SSL/TLS Setup
```bash
# Genera certificati per sviluppo
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Produzione: usa Let's Encrypt
sudo certbot --nginx -d tuodominio.com
```

### 2. Environment Variables
```bash
# .env file
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cartella_clinica
DB_USER=clinica_user
DB_PASSWORD=secure_password_here

# MongoDB
MONGO_URI=mongodb://user:pass@localhost:27017/cartella_clinica

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT
JWT_SECRET=your_very_long_random_string_here
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=clinica@example.com
SMTP_PASS=app_specific_password

# WhatsApp Business
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id

# Storage
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
AWS_BUCKET=cartella-clinica-files
```

## 🚦 Avvio del Sistema

### Development Mode
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MongoDB
mongod

# Terminal 4: Redis
redis-server
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start con PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Nginx setup
sudo cp nginx.conf /etc/nginx/sites-available/cartella-clinica
sudo ln -s /etc/nginx/sites-available/cartella-clinica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend

# Unit tests
npm test

# Component tests
npm run test:components

# E2E con Cypress
npm run cypress:open
```

## 📊 Database Migrations

### Creazione Migration
```bash
# Crea nuova migration
npm run migration:create add_new_feature

# Esegui migrations
npm run migrate

# Rollback
npm run migrate:rollback
```

### Seed Database
```bash
# Popola database con dati di test
npm run seed

# Reset database
npm run db:reset
```

## 🔄 Backup e Restore

### Backup Automatico
```bash
# Setup cron job per backup giornaliero
crontab -e

# Aggiungi:
0 2 * * * /usr/local/bin/backup-cartella-clinica.sh
```

### Script Backup
```bash
#!/bin/bash
# backup-cartella-clinica.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/cartella-clinica"

# Backup PostgreSQL
pg_dump -U clinica_user cartella_clinica > $BACKUP_DIR/postgres_$DATE.sql

# Backup MongoDB
mongodump --uri="mongodb://user:pass@localhost:27017/cartella_clinica" --out=$BACKUP_DIR/mongo_$DATE

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /app/uploads

# Upload to S3 (opzionale)
aws s3 cp $BACKUP_DIR s3://backup-bucket/cartella-clinica/$DATE/ --recursive

# Rimuovi backup locali più vecchi di 30 giorni
find $BACKUP_DIR -type f -mtime +30 -delete
```

## 🐛 Troubleshooting

### Problemi Comuni

#### 1. Errore connessione database
```bash
# Verifica PostgreSQL
psql -U clinica_user -d cartella_clinica -c "SELECT 1"

# Check logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 2. Redis connection refused
```bash
# Verifica Redis
redis-cli ping

# Restart Redis
sudo systemctl restart redis
```

#### 3. Port già in uso
```bash
# Trova processo su porta
lsof -i :3000

# Kill processo
kill -9 <PID>
```

#### 4. Permessi file upload
```bash
# Fix permessi
chmod 755 uploads/
chown -R www-data:www-data uploads/
```

## 📝 Checklist Post-Installazione

- [ ] Database PostgreSQL operativo
- [ ] MongoDB configurato
- [ ] Redis in esecuzione
- [ ] Backend risponde su `/api/health`
- [ ] Frontend carica correttamente
- [ ] Login funziona
- [ ] Upload file funziona
- [ ] Email di test inviata
- [ ] Backup configurato
- [ ] SSL/HTTPS attivo (produzione)
- [ ] Monitoring attivo
- [ ] Log rotation configurato

## 🆘 Supporto

Per problemi di installazione:
- 📧 Email: support@cartella-clinica.it
- 📱 WhatsApp: +39 333 123 4567
- 📚 Docs: https://docs.cartella-clinica.it
- 💬 Slack: cartella-clinica.slack.com
