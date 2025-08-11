# 📋 PIANO D'AZIONE - INTEGRAZIONE BACKEND-FRONTEND
## Data: 10 Agosto 2025
## Sviluppatore: Luca Mambelli

---

## 🎯 OBIETTIVO PRINCIPALE
Collegare il frontend React al backend Node.js/Express per creare un'applicazione funzionante end-to-end.

---

## 📊 STATO ATTUALE

### ✅ Completato
- **Backend**: Server Express su porta 3100
- **Frontend**: React app su porta 5183
- **Database**: PostgreSQL con Prisma ORM
- **Autenticazione**: Mock nel frontend (da collegare)
- **UI Base**: Login e Dashboard

### 🔴 Da Fare
- Collegamento reale frontend-backend
- API endpoints implementation
- CRUD operations
- Autenticazione JWT reale

---

## 🚀 PROSSIMI PASSI (IN ORDINE DI PRIORITÀ)

### FASE 1: AUTENTICAZIONE REALE (Priorità: ALTA) 🔐
**Obiettivo**: Sostituire l'auth mock con JWT reale

#### Backend Tasks:
1. **Implementare Auth Controller** (`backend/src/controllers/authController.ts`)
   - POST `/api/auth/login` - Login con email/password
   - POST `/api/auth/logout` - Logout
   - GET `/api/auth/me` - Get current user
   - POST `/api/auth/refresh` - Refresh token

2. **Creare User Service** (`backend/src/services/userService.ts`)
   - Validazione credenziali
   - Generazione JWT
   - Gestione refresh tokens

3. **Setup Middleware Auth** (`backend/src/middleware/auth.ts`)
   - Verifica JWT
   - Protezione route

#### Frontend Tasks:
1. **Aggiornare AuthContext**
   - Rimuovere mock
   - Usare API reale
   - Gestire token storage

2. **Aggiornare Login Page**
   - Chiamate API reali
   - Gestione errori backend

#### Database:
```sql
-- Creare tabella utenti se non esiste
-- Inserire utente admin di default
```

---

### FASE 2: GESTIONE PAZIENTI (Priorità: ALTA) 👥
**Obiettivo**: CRUD completo per i pazienti

#### Backend:
1. **Patient Controller** (`backend/src/controllers/patientController.ts`)
   - GET `/api/patients` - Lista pazienti (con paginazione)
   - GET `/api/patients/:id` - Dettaglio paziente
   - POST `/api/patients` - Crea paziente
   - PUT `/api/patients/:id` - Aggiorna paziente
   - DELETE `/api/patients/:id` - Elimina paziente

2. **Patient Service** (`backend/src/services/patientService.ts`)
   - Business logic
   - Validazioni
   - Query database

#### Frontend:
1. **Pagina Lista Pazienti** (`frontend/src/pages/PatientsPage.tsx`)
   - Tabella con ricerca e filtri
   - Paginazione
   - Azioni (view/edit/delete)

2. **Form Paziente** (`frontend/src/components/PatientForm.tsx`)
   - Validazione con react-hook-form
   - Modal o pagina dedicata

3. **Dettaglio Paziente** (`frontend/src/pages/PatientDetailPage.tsx`)
   - Info complete
   - Storia clinica
   - Documenti

---

### FASE 3: CARTELLE CLINICHE (Priorità: ALTA) 📁
**Obiettivo**: Gestione cartelle cliniche per paziente

#### Backend:
1. **ClinicalRecord Controller**
   - CRUD operations
   - Associazione paziente
   - Stati cartella (aperta/chiusa)

#### Frontend:
1. **Lista Cartelle**
2. **Form Cartella Clinica**
3. **Dettaglio Cartella**

---

### FASE 4: TERAPIE E SEDUTE (Priorità: MEDIA) 💊
**Obiettivo**: Pianificazione e tracking terapie

#### Features:
- Creazione piano terapeutico
- Registrazione sedute
- Tracking progressi
- Calendario sedute

---

### FASE 5: DASHBOARD E STATISTICHE (Priorità: MEDIA) 📊
**Obiettivo**: Dashboard con metriche real-time

#### Metriche:
- Totale pazienti
- Cartelle attive
- Sedute oggi/settimana
- Grafici statistici

---

## 🛠️ SETUP IMMEDIATO DA FARE

### 1. Backend - Creare struttura base API
```bash
cd backend/src

# Creare directories
mkdir controllers services routes

# Files da creare:
# - controllers/authController.ts
# - controllers/patientController.ts
# - services/authService.ts
# - services/patientService.ts
# - routes/authRoutes.ts
# - routes/patientRoutes.ts
```

### 2. Database - Seed data
```bash
cd backend
npx prisma db seed
```

### 3. Frontend - Setup API client
```typescript
// frontend/src/services/api.ts
// Configurare axios con interceptors
// Gestione token automatica
```

---

## 📝 TASK IMMEDIATI (PROSSIME 2 ORE)

### Task 1: Implementare Login Backend (30 min)
- [ ] Create auth endpoint
- [ ] JWT generation
- [ ] Password validation

### Task 2: Collegare Frontend Login (20 min)
- [ ] Update AuthContext
- [ ] Test real login
- [ ] Handle errors

### Task 3: Protected Routes Backend (20 min)
- [ ] Auth middleware
- [ ] Apply to routes
- [ ] Test protection

### Task 4: Prima API Pazienti (30 min)
- [ ] GET /api/patients
- [ ] Connect to frontend
- [ ] Display in dashboard

### Task 5: Form Nuovo Paziente (20 min)
- [ ] Create form component
- [ ] POST /api/patients
- [ ] Test creation

---

## 🎯 MILESTONE SETTIMANA

### Lunedì (Oggi)
- ✅ Setup base
- ⏳ Autenticazione reale
- ⏳ Prima API funzionante

### Martedì
- [ ] CRUD Pazienti completo
- [ ] Lista e dettaglio pazienti

### Mercoledì
- [ ] Cartelle cliniche base
- [ ] Associazione paziente-cartella

### Giovedì
- [ ] Terapie e sedute
- [ ] Form registrazione seduta

### Venerdì
- [ ] Testing e bug fixing
- [ ] Deploy su staging

---

## 🔧 COMANDI UTILI

### Backend Development
```bash
cd backend
npm run dev          # Start server
npm run build        # Build for production
npx prisma studio    # GUI database
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
```

### Database
```bash
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed data
npx prisma studio         # Open GUI
```

---

## 📚 RISORSE E RIFERIMENTI

### Documentazione API
- File: `/Docs/API-DOCUMENTATION.md`
- Postman Collection: Da creare

### Schema Database
- File: `/backend/prisma/schema.prisma`
- ER Diagram: Da generare

### UI/UX Reference
- Cartelle cliniche originali: `/Docs/00-Archivio/`
- Mockups: Da creare

---

## ⚠️ PRIORITÀ ASSOLUTE

1. **Autenticazione funzionante** - Senza questo niente funziona
2. **CRUD Pazienti** - Feature core dell'applicazione
3. **Cartelle Cliniche** - Valore principale del sistema
4. **Testing base** - Almeno test di integrazione API

---

## 🎉 DEFINITION OF DONE

Una feature è completa quando:
- [ ] Backend API implementata e testata
- [ ] Frontend connesso e funzionante
- [ ] Validazioni presenti
- [ ] Gestione errori implementata
- [ ] Documentazione aggiornata
- [ ] Commit su GitHub

---

*Piano creato per guidare lo sviluppo delle prossime settimane*
