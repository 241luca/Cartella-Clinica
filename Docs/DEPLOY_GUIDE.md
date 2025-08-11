# 🚀 GUIDA DEPLOY PRODUZIONE

## Sistema Gestione Cartelle Cliniche - Medicina Ravenna
**Versione**: 1.0.0  
**Data**: 11 Agosto 2025

---

## 📋 PREREQUISITI

### Server Requirements
- **OS**: Ubuntu 20.04+ / Debian 11+
- **Node.js**: 18.x o superiore
- **PostgreSQL**: 14+ 
- **RAM**: Minimo 2GB (4GB consigliato)
- **Storage**: 20GB minimo
- **CPU**: 2 core minimo

### Domini e SSL
- Dominio configurato (es: app.medicinaravenna.it)
- Certificato SSL (Let's Encrypt gratuito)

---

## 🛠️ INSTALLAZIONE

### 1. Preparazione Server

```bash
# Aggiorna il sistema
sudo apt update && sudo apt upgrade -y

# Installa dipendenze
sudo apt install -y curl git build-essential nginx postgresql

# Installa Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installa PM2 per gestione processi
sudo npm install -g pm2

# Installa Certbot per SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Setup PostgreSQL

```bash
# Accedi a PostgreSQL
sudo -u postgres psql

# Crea database e utente
CREATE DATABASE cartella_clinica;
CREATE USER medicina_user WITH ENCRYPTED PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE cartella_clinica TO medicina_user;
\q

# Modifica pg_hba.conf per permettere connessioni
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Aggiungi: host all medicina_user 127.0.0.1/32 md5
sudo systemctl restart postgresql
```

### 3. Clone Repository

```bash
# Crea directory applicazione
sudo mkdir -p /var/www/cartella-clinica
sudo chown $USER:$USER /var/www/cartella-clinica

# Clone repository
cd /var/www
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica
```

### 4. Configurazione Backend

```bash
cd backend

# Installa dipendenze
npm install

# Crea file .env production
cp .env.example .env
nano .env
```

Configura `.env` per produzione:
```env
# Database
DATABASE_URL="postgresql://medicina_user:SecurePassword123!@localhost:5432/cartella_clinica"

# Server
PORT=3100
NODE_ENV=production

# JWT (genera nuove chiavi sicure!)
JWT_SECRET=genera-una-chiave-molto-sicura-qui-64-caratteri-random
JWT_REFRESH_SECRET=altra-chiave-sicura-diversa-dalla-prima-64-caratteri
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://app.medicinaravenna.it

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/cartella-clinica/uploads

# Email (configura SMTP reale)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@medicinaravenna.it
SMTP_PASS=password-email
SMTP_FROM=noreply@medicinaravenna.it

# Logging
LOG_LEVEL=info
```

```bash
# Crea directory uploads
mkdir -p /var/www/cartella-clinica/uploads
chmod 755 /var/www/cartella-clinica/uploads

# Esegui migrations
npx prisma migrate deploy

# Genera Prisma Client
npx prisma generate

# Build TypeScript
npm run build

# Seed database (SOLO primo deploy)
npx prisma db seed
```

### 5. Configurazione Frontend

```bash
cd ../frontend

# Installa dipendenze
npm install

# Crea .env production
nano .env
```

Configura `.env` frontend:
```env
VITE_API_URL=https://api.medicinaravenna.it
VITE_APP_NAME="Medicina Ravenna - Cartella Clinica"
```

```bash
# Build production
npm run build

# I file saranno in dist/
```

### 6. Configurazione Nginx

```bash
# Crea configurazione sito
sudo nano /etc/nginx/sites-available/cartella-clinica
```

Contenuto configurazione Nginx:
```nginx
# Backend API
server {
    listen 80;
    server_name api.medicinaravenna.it;
    
    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name app.medicinaravenna.it;
    root /var/www/cartella-clinica/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /uploads {
        alias /var/www/cartella-clinica/uploads;
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Abilita sito
sudo ln -s /etc/nginx/sites-available/cartella-clinica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Setup SSL con Let's Encrypt

```bash
# Ottieni certificati SSL
sudo certbot --nginx -d app.medicinaravenna.it -d api.medicinaravenna.it

# Auto-rinnovo
sudo systemctl enable certbot.timer
```

### 8. Avvio con PM2

```bash
cd /var/www/cartella-clinica/backend

# Crea ecosystem file
nano ecosystem.config.js
```

Contenuto ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'cartella-clinica-api',
    script: 'dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3100
    },
    error_file: '/var/log/pm2/cartella-error.log',
    out_file: '/var/log/pm2/cartella-out.log',
    log_file: '/var/log/pm2/cartella-combined.log',
    time: true
  }]
};
```

```bash
# Avvia applicazione
pm2 start ecosystem.config.js

# Salva configurazione PM2
pm2 save

# Setup avvio automatico
pm2 startup
# Esegui il comando suggerito

# Monitora
pm2 monit
```

---

## 🔒 SICUREZZA POST-DEPLOY

### 1. Firewall

```bash
# Configura UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Fail2ban

```bash
# Installa fail2ban
sudo apt install fail2ban

# Configura per SSH
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Backup Automatici

```bash
# Crea script backup
sudo nano /usr/local/bin/backup-cartella-clinica.sh
```

Script backup:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/cartella-clinica"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U medicina_user cartella_clinica > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/cartella-clinica/uploads

# Mantieni solo ultimi 30 giorni
find $BACKUP_DIR -type f -mtime +30 -delete
```

```bash
# Rendi eseguibile
sudo chmod +x /usr/local/bin/backup-cartella-clinica.sh

# Aggiungi a crontab (backup giornaliero alle 2 AM)
sudo crontab -e
# Aggiungi: 0 2 * * * /usr/local/bin/backup-cartella-clinica.sh
```

---

## 🔍 MONITORAGGIO

### PM2 Monitoring

```bash
# Status applicazione
pm2 status

# Logs
pm2 logs cartella-clinica-api

# Metriche
pm2 monit
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Database

```bash
# Connessioni attive
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Query lente
sudo -u postgres psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

---

## 🚨 TROUBLESHOOTING

### Problema: 502 Bad Gateway
```bash
# Verifica backend
pm2 status
pm2 restart cartella-clinica-api

# Check logs
pm2 logs --lines 100
```

### Problema: Database connection
```bash
# Verifica PostgreSQL
sudo systemctl status postgresql

# Test connessione
psql -U medicina_user -d cartella_clinica -h localhost

# Check pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

### Problema: Spazio disco
```bash
# Controlla spazio
df -h

# Pulisci logs
pm2 flush
sudo journalctl --vacuum-time=7d

# Pulisci vecchi backup
find /backup -type f -mtime +30 -delete
```

---

## 📊 PERFORMANCE TUNING

### PostgreSQL
```sql
-- Aumenta connessioni
ALTER SYSTEM SET max_connections = 200;

-- Ottimizza memoria
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Reload
SELECT pg_reload_conf();
```

### Nginx
```nginx
# In nginx.conf
worker_processes auto;
worker_connections 1024;
client_max_body_size 20M;
gzip on;
gzip_types text/plain application/json application/javascript text/css;
```

### Node.js
```javascript
// In ecosystem.config.js
instances: 'max',  // Usa tutti i core CPU
max_memory_restart: '1G'
```

---

## 📱 ACCESSO SISTEMA

### URL Produzione
- **Frontend**: https://app.medicinaravenna.it
- **API**: https://api.medicinaravenna.it
- **Database**: localhost:5432 (solo interno)

### Credenziali Default
⚠️ **CAMBIARE DOPO PRIMO ACCESSO!**
- Admin: admin@medicinaravenna.it / admin123

### Primo Accesso
1. Login come admin
2. Cambiare password admin
3. Creare utenti reali
4. Disabilitare utenti demo
5. Configurare backup
6. Testare tutte le funzionalità

---

## 🆘 SUPPORTO

### Contatti Sviluppo
- **Developer**: Luca Mambelli
- **Email**: lucamambelli@lmtecnologie.it
- **GitHub**: https://github.com/241luca

### Documentazione
- README.md - Overview progetto
- CHANGELOG.md - Storico versioni
- Docs/ - Documentazione completa

---

## ✅ CHECKLIST FINALE

- [ ] Server configurato e aggiornato
- [ ] PostgreSQL installato e configurato
- [ ] Node.js 18+ installato
- [ ] Repository clonato
- [ ] Backend configurato e buildato
- [ ] Frontend buildato
- [ ] Nginx configurato
- [ ] SSL certificati installati
- [ ] PM2 configurato e avviato
- [ ] Firewall configurato
- [ ] Backup automatici configurati
- [ ] Monitoring attivo
- [ ] Test completo sistema
- [ ] Password admin cambiata
- [ ] Utenti reali creati

---

**🎉 DEPLOY COMPLETATO!**

Il sistema è ora live e pronto per l'uso in produzione.

**Buon lavoro con Medicina Ravenna! 🏥**
