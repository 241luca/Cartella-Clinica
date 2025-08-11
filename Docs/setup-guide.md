# Guida Setup Completa - Sistema Cartella Clinica

## Requisiti di Sistema

### Hardware Minimo
- **CPU**: Dual Core 2GHz
- **RAM**: 4GB
- **Spazio Disco**: 10GB liberi
- **Connessione**: ADSL/Fibra

### Hardware Consigliato
- **CPU**: Quad Core 3GHz+
- **RAM**: 8GB+
- **Spazio Disco**: 20GB SSD
- **Connessione**: Fibra 100Mbps+

### Software Richiesto
- **Node.js**: v18.0.0 o superiore
- **PostgreSQL**: v14.0 o superiore
- **Git**: v2.30 o superiore
- **Browser**: Chrome/Firefox/Safari/Edge (ultimi 2 anni)

## Installazione Step-by-Step

### 1. Preparazione Ambiente

#### Windows
```powershell
# Installa Node.js
# Download da https://nodejs.org/

# Installa PostgreSQL
# Download da https://www.postgresql.org/download/windows/

# Installa Git
# Download da https://git-scm.com/download/win

# Verifica installazioni
node --version
npm --version
psql --version
git --version
```

#### macOS
```bash
# Installa Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa dipendenze
brew install node
brew install postgresql@14
brew services start postgresql@14
brew install git

# Verifica installazioni
node --version
npm --version
psql --version
git --version
```

#### Linux (Ubuntu/Debian)
```bash
# Aggiorna sistema
sudo apt update && sudo apt upgrade -y

# Installa Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installa PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Installa Git
sudo apt install -y git

# Avvia PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verifica installazioni
node --version
npm --version
psql --version
git --version
```

### 2. Clone Repository

```bash
# Clone del progetto
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica

# Struttura directory
ls -la
# Dovresti vedere:
# - frontend/
# - backend/
# - Docs/
# - README.md
```

### 3. Setup Database

#### Crea Database
```bash
# Accedi a PostgreSQL
sudo -u postgres psql

# Crea database e utente
CREATE DATABASE medicina_ravenna;
CREATE USER medicina_user WITH PASSWORD 'medicina_password_2025';
GRANT ALL PRIVILEGES ON DATABASE medicina_ravenna TO medicina_user;
\q
```

#### Test Connessione
```bash
psql -h localhost -U medicina_user -d medicina_ravenna
# Inserisci password: medicina_password_2025
\q
```

### 4. Setup Backend

```bash
# Entra nella directory backend
cd backend

# Installa dipendenze
npm install

# Crea file .env
cat > .env << EOL
DATABASE_URL="postgresql://medicina_user:medicina_password_2025@localhost:5432/medicina_ravenna"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"
PORT=3000
NODE_ENV=development
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
CORS_ORIGIN="http://localhost:5183"
EOL

# Crea directory uploads
mkdir -p uploads/documents
mkdir -p uploads/temp

# Setup Prisma
npx prisma generate
npx prisma migrate dev --name init

# Seed database con dati esempio
npx prisma db seed

# Avvia backend
npm run dev

# Output atteso:
# Server running on http://localhost:3000
# Database connected successfully
```

### 5. Setup Frontend

```bash
# In nuovo terminale
cd ../frontend

# Installa dipendenze
npm install

# Crea file .env
cat > .env << EOL
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME="Medicina Ravenna"
VITE_APP_VERSION="1.0.0"
VITE_ENABLE_MOCK=true
EOL

# Avvia frontend
npm run dev

# Output atteso:
# VITE v5.0.0 ready in 500 ms
# ➜ Local: http://localhost:5183/
```

### 6. Verifica Installazione

1. Apri browser: http://localhost:5183
2. Login con:
   - Email: admin@medicinaravenna.it
   - Password: admin123
3. Verifica dashboard carichi correttamente
4. Testa creazione paziente
5. Testa generazione PDF

## Configurazione Avanzata

### SSL/HTTPS (Produzione)

#### Genera Certificati
```bash
# Installa mkcert
npm install -g mkcert

# Genera certificati
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Sposta in backend
mv localhost+2.pem backend/certs/cert.pem
mv localhost+2-key.pem backend/certs/key.pem
```

#### Update Backend
```javascript
// backend/src/server.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, app).listen(443);
```

### Database Backup

#### Setup Backup Automatico
```bash
# Crea script backup
cat > backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/medicina_ravenna"
mkdir -p $BACKUP_DIR

pg_dump -U medicina_user -h localhost medicina_ravenna > $BACKUP_DIR/backup_$DATE.sql

# Mantieni solo ultimi 30 backup
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql"
EOL

chmod +x backup.sh

# Aggiungi a crontab (backup ogni notte alle 2)
crontab -e
# Aggiungi: 0 2 * * * /path/to/backup.sh
```

### Monitoring

#### PM2 per Production
```bash
# Installa PM2
npm install -g pm2

# Backend
cd backend
pm2 start npm --name "medicina-backend" -- start
pm2 save
pm2 startup

# Frontend (build statico)
cd ../frontend
npm run build
pm2 serve dist 5183 --name "medicina-frontend"
pm2 save
```

#### Logs
```bash
# Visualizza logs
pm2 logs medicina-backend
pm2 logs medicina-frontend

# Monitor
pm2 monit
```

### Performance Tuning

#### PostgreSQL
```sql
-- Ottimizzazioni database
ALTER DATABASE medicina_ravenna SET shared_buffers = '256MB';
ALTER DATABASE medicina_ravenna SET effective_cache_size = '1GB';
ALTER DATABASE medicina_ravenna SET maintenance_work_mem = '64MB';

-- Indici aggiuntivi
CREATE INDEX idx_patients_fiscal ON patients(fiscal_code);
CREATE INDEX idx_records_patient ON clinical_records(patient_id);
CREATE INDEX idx_therapies_record ON therapies(clinical_record_id);
CREATE INDEX idx_sessions_date ON therapy_sessions(session_date);
```

#### Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/medicina-ravenna
server {
    listen 80;
    server_name medicina.local;

    # Frontend
    location / {
        proxy_pass http://localhost:5183;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    # Upload limits
    client_max_body_size 10M;
}
```

## Troubleshooting

### Errori Comuni

#### 1. Porta già in uso
```bash
# Errore: EADDRINUSE :::3000

# Soluzione - trova processo
lsof -i :3000
# Kill processo
kill -9 <PID>

# O cambia porta in .env
PORT=3001
```

#### 2. Database connection failed
```bash
# Errore: ECONNREFUSED 127.0.0.1:5432

# Verifica PostgreSQL attivo
sudo systemctl status postgresql

# Riavvia se necessario
sudo systemctl restart postgresql

# Verifica credenziali in .env
DATABASE_URL="postgresql://..."
```

#### 3. Prisma migration failed
```bash
# Reset database
npx prisma migrate reset

# Rigenera client
npx prisma generate

# Applica migrations
npx prisma migrate dev
```

#### 4. npm install fallisce
```bash
# Pulisci cache
npm cache clean --force

# Elimina node_modules
rm -rf node_modules package-lock.json

# Reinstalla
npm install
```

#### 5. Frontend non si connette al backend
```bash
# Verifica CORS in backend
CORS_ORIGIN="http://localhost:5183"

# Verifica API URL in frontend
VITE_API_URL="http://localhost:3000/api"

# Disabilita firewall temporaneamente per test
```

### Log Files

#### Locations
```bash
# Backend logs
backend/logs/error.log
backend/logs/combined.log

# PM2 logs
~/.pm2/logs/

# PostgreSQL logs
/var/log/postgresql/

# Nginx logs
/var/log/nginx/access.log
/var/log/nginx/error.log
```

#### Debug Mode
```bash
# Backend con debug
DEBUG=* npm run dev

# Frontend con debug
VITE_LOG_LEVEL=debug npm run dev
```

## Deployment Produzione

### Preparazione

1. **Domini e DNS**
   - Registra dominio
   - Configura DNS
   - Ottieni certificati SSL

2. **Server Requirements**
   - Ubuntu 22.04 LTS
   - 4GB RAM minimo
   - 50GB SSD
   - Backup automatici

3. **Security**
   - Firewall configurato
   - Fail2ban installato
   - SSH key-only access
   - Rate limiting

### Deploy Steps

```bash
# 1. Prepara server
ssh user@server
sudo apt update && sudo apt upgrade -y

# 2. Installa dipendenze
# (vedi sezione Linux sopra)

# 3. Clone e setup
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica

# 4. Environment production
# Backend .env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="[STRONG-RANDOM-KEY]"

# Frontend .env
VITE_API_URL="https://api.medicinaravenna.it"

# 5. Build
cd backend && npm run build
cd ../frontend && npm run build

# 6. Setup PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 7. Setup Nginx
sudo nginx -t
sudo systemctl reload nginx

# 8. Test
curl https://medicinaravenna.it
```

### Post-Deploy Checklist

- [ ] SSL funzionante
- [ ] Backup automatici attivi
- [ ] Monitoring configurato
- [ ] Logs rotation setup
- [ ] Firewall rules applicate
- [ ] Rate limiting attivo
- [ ] Error tracking setup
- [ ] Health check endpoint
- [ ] Load testing eseguito
- [ ] Documentazione aggiornata

## Manutenzione

### Backup Routine
- **Giornaliero**: Database (incrementale)
- **Settimanale**: Full backup
- **Mensile**: Backup offsite

### Updates
```bash
# Backup prima di aggiornare
./backup.sh

# Pull updates
git pull origin main

# Update dipendenze
cd backend && npm update
cd ../frontend && npm update

# Rebuild
npm run build

# Restart services
pm2 restart all
```

### Monitoring Checklist
- [ ] CPU usage < 80%
- [ ] RAM usage < 85%
- [ ] Disk space > 20%
- [ ] Response time < 200ms
- [ ] Error rate < 1%
- [ ] Database connections < 80%

## Supporto

### Contatti
- **Email**: support@medicinaravenna.it
- **Tel**: 0544-456845
- **GitHub Issues**: https://github.com/241luca/cartella-clinica/issues

### Risorse
- [Documentazione API](./api-documentation.md)
- [Manuale Utente](./manuale-utente.md)
- [Report Sistema](./report-pdf-sistema.md)

---

**Versione**: 1.0.0
**Ultimo Aggiornamento**: Agosto 2025
**Autore**: LM Tecnologie
