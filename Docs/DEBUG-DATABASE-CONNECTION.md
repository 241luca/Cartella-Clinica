# 🔍 DEBUG DATABASE CONNECTION - REPORT

## Problema
I dati nel frontend sembrano essere sempre gli stessi (mock data) invece dei dati reali dal database.

## Soluzioni Applicate

### 1. Reset e Ripopolamento Database
```bash
cd backend
npx prisma migrate reset --force
npm run seed:complete
```

### 2. Verifica Dati nel Database
```bash
# Opzione 1: Script di verifica
npm run db:verify

# Opzione 2: Prisma Studio (interfaccia grafica)
npx prisma studio
# Apre http://localhost:5555

# Opzione 3: Script veloce
./check-db.sh
```

### 3. Restart Completo Sistema
```bash
# Terminal 1 - Backend
cd backend
pkill -f 'node.*3100'  # Chiudi processo esistente
npm run dev

# Terminal 2 - Frontend
cd frontend
pkill -f 'vite'  # Chiudi processo esistente
npm run dev
```

## Checklist Debug

### ✅ Database
- [ ] PostgreSQL è attivo? `pg_ctl status`
- [ ] Database esiste? `psql -U postgres -l | grep cartella_clinica`
- [ ] Migrations applicate? `npx prisma migrate status`
- [ ] Dati presenti? `npm run db:verify`

### ✅ Backend
- [ ] Backend running su porta 3100? `lsof -i :3100`
- [ ] .env configurato correttamente?
- [ ] DATABASE_URL corretta nel .env?
- [ ] API risponde? `curl http://localhost:3100/api/patients`

### ✅ Frontend
- [ ] Frontend running su porta 5183? `lsof -i :5183`
- [ ] Proxy configurato in vite.config.ts?
- [ ] API baseURL = '/api'?
- [ ] Token JWT presente dopo login?

## Test Diretto API

### 1. Test senza autenticazione (dovrebbe dare 401)
```bash
curl http://localhost:3100/api/patients
```

### 2. Login e ottieni token
```bash
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}'
```

### 3. Test con token (sostituisci TOKEN)
```bash
curl http://localhost:3100/api/patients \
  -H "Authorization: Bearer TOKEN"
```

## Possibili Cause del Problema

### 1. **Mock Data nel Frontend**
Il frontend ha un fallback che restituisce mock data se l'API fallisce:
```typescript
// In patientService.ts
catch (error) {
  // Return mock data if API fails
  return { data: this.getMockPatients() };
}
```

### 2. **Autenticazione Mancante**
Se il token JWT non è presente o è scaduto, l'API restituisce 401 e il frontend usa mock data.

### 3. **Database Vuoto**
Se il seed non è stato eseguito correttamente, il database potrebbe essere vuoto.

## Soluzione Definitiva

### Step 1: Verifica Database
```bash
cd backend
npm run db:verify
```
Dovresti vedere:
- 50 Pazienti
- 40 Cartelle Cliniche
- 45 Terapie
- etc.

### Step 2: Se Database Vuoto
```bash
cd backend
npx prisma migrate reset --force
npm run seed:complete
npm run db:verify  # Verifica di nuovo
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

### Step 4: Clear Browser Cache
1. Apri Chrome DevTools (F12)
2. Network tab
3. Disable cache ✓
4. Application tab → Clear Storage
5. Refresh pagina

### Step 5: Login di Nuovo
1. Logout se già loggato
2. Login con: admin@medicinaravenna.it / admin123
3. Vai su Pazienti
4. Dovresti vedere 50 pazienti

## Verifica Finale

Se tutto funziona dovresti vedere:
- **Dashboard**: Numeri reali (50 pazienti, 40 cartelle, etc.)
- **Pazienti**: Lista di 50 pazienti italiani
- **Cartelle**: 40 cartelle con diagnosi reali
- **Terapie**: 45 terapie assegnate

## Se Ancora Non Funziona

1. **Controlla i log del backend**
```bash
cd backend
# Guarda la console per errori
```

2. **Controlla Chrome DevTools**
- Network tab: vedi le chiamate API
- Console: vedi errori JavaScript
- Le API dovrebbero restituire status 200

3. **Test manuale database**
```bash
cd backend
npx prisma studio
```
Verifica manualmente che ci siano dati nelle tabelle.

---

*Report creato: 11 Agosto 2025*
*Problema: Frontend mostra mock data invece di dati reali*
*Soluzione: Reset database + restart sistema*