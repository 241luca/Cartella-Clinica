# 📋 BRIEFING PER NUOVA SESSIONE CLAUDE - PROGETTO CARTELLA CLINICA

## 🎯 CONTESTO PROGETTO
Sto sviluppando un sistema di gestione cartella clinica per Medicina Ravenna. Il progetto è al 90% di completamento.

**Directory progetto**: `/Users/lucamambelli/Desktop/Cartella-Clinica`
**Directory documentazione**: `/Users/lucamambelli/Desktop/Cartella-Clinica/Docs`

## 📊 STATO ATTUALE (13 Gennaio 2025)

### ✅ COSA È STATO FATTO OGGI
1. **Rimossi TUTTI i dati mock** dal sistema
2. **Collegato completamente al database PostgreSQL reale**
3. **Corretti tutti gli errori e warning** (NaN, Invalid Date, undefined)
4. **Le seguenti pagine ora funzionano con dati reali:**
   - Lista Pazienti (`PatientList.tsx`)
   - Dettaglio Paziente (`PatientDetail.tsx`)
   - Lista Terapie (`TherapyList.tsx`)
   - Dettaglio Terapia (`TherapyDetail.tsx`)

### ⚠️ PROBLEMA ATTUALE
Il dettaglio terapia carica i dati ma probabilmente mancano le sessioni nel database. Non ci sono errori, ma potrebbe esserci un problema di coerenza nei dati del seed.

## 🔧 STACK TECNOLOGICO
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Autenticazione**: JWT

## 📁 STRUTTURA PROGETTO
```
/Cartella-Clinica
├── /backend (porta 3100)
├── /frontend (porta 5183)
└── /Docs (documentazione)
```

## 🚀 COMANDI PER INIZIARE

```bash
# 1. Aprire il progetto
cd /Users/lucamambelli/Desktop/Cartella-Clinica

# 2. Leggere il report di oggi
cat Docs/REPORT_SVILUPPO_2025-01-13.md

# 3. Leggere le istruzioni per continuare
cat Docs/ISTRUZIONI-PROSSIMA-SESSIONE-2025-01-14.md

# 4. Avviare il backend (Terminal 1)
cd backend && npm run dev

# 5. Avviare il frontend (Terminal 2)  
cd frontend && npm run dev

# 6. Verificare il database
cd backend && npx prisma studio
```

## 🎯 PRIORITÀ PER LA PROSSIMA SESSIONE

### 1️⃣ PRIORITÀ 1: Verificare Database
```bash
# Controllare che ci siano sessioni nel DB
cd backend
npx prisma studio
# Guardare la tabella TherapySession
```

Se mancano sessioni, rigenerare il seed:
```bash
npx prisma migrate reset
npx prisma db seed
```

### 2️⃣ PRIORITÀ 2: Completare UI Creazione Terapie
- Il form `NewTherapyWizard` esiste ma va verificato
- Percorso: `/therapies/new`
- File: `frontend/src/components/therapy/NewTherapyWizard.tsx`

### 3️⃣ PRIORITÀ 3: Testing Completo
Verificare tutti i flussi funzionanti

## ⚠️ ATTENZIONE IMPORTANTE

### NON RIFARE:
- ❌ NON reinserire dati mock (sono stati tutti rimossi!)
- ❌ NON modificare le pagine già sistemate
- ❌ NON cambiare la struttura delle API

### STRUTTURA API CORRETTA:
```javascript
// Dettaglio terapia
GET /api/therapies/:id
response.data.data = {
  therapy: { /* dati terapia */ }
}

// Lista terapie  
GET /api/therapies
response.data.data = [ /* array terapie */ ]
```

### STRUTTURA DATI TERAPIA:
```javascript
therapy = {
  clinicalRecord: {
    patient: { firstName, lastName, fiscalCode },
    recordNumber,
    diagnosis
  },
  therapyType: { name, category, description },
  sessions: [...],
  prescribedSessions: number,
  completedSessions: number,
  startDate: Date,
  parameters: { duration, frequency }
}
```

## 📝 CREDENZIALI
- **Admin**: admin@medicinaravenna.it / admin123
- **GitHub**: User: 241luca, PWD: 241-Mambo, Token: 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

## 🐛 BUG NOTI
1. Possibile mancanza di sessioni nel database
2. Campo `therapy.objectives` non esiste nel modello Prisma
3. Campo `therapy.frequency` è dentro `parameters`

## 📚 DOCUMENTAZIONE DA CONSULTARE
1. **PRIMA DI TUTTO**: `Docs/REPORT_SVILUPPO_2025-01-13.md`
2. **PER CONTINUARE**: `Docs/ISTRUZIONI-PROSSIMA-SESSIONE-2025-01-14.md`
3. **PER API**: `Docs/API-DOCUMENTATION.md`
4. **PER DATABASE**: `Docs/DATABASE-CONFIG.md`

## ✅ DEFINIZIONE DI COMPLETATO
Il progetto sarà completo quando:
- Tutti i CRUD funzionano (Create, Read, Update, Delete)
- Nessun errore in console
- Database con dati coerenti
- Testing manuale completato

## 💬 PRIME DOMANDE DA FARE
1. "Vuoi che verifichi prima il database per vedere se ci sono sessioni?"
2. "Preferisci che completi prima la creazione terapie o sistemi il problema delle sessioni?"
3. "Hai già provato ad accedere al sistema? Funziona tutto?"

## 🎯 OBIETTIVO FINALE
Portare il sistema dal 90% al 100% di completamento, rendendolo pronto per la produzione.

---

**MESSAGGIO DA COPIARE E INCOLLARE:**

"Ciao! Sto sviluppando un sistema di gestione cartella clinica per Medicina Ravenna. Il progetto è al 90% e si trova in `/Users/lucamambelli/Desktop/Cartella-Clinica`. 

Oggi ho completato la rimozione di tutti i dati mock e collegato il sistema al database reale PostgreSQL. Tutto funziona ma nel dettaglio terapia non si vedono le sessioni (probabilmente mancano nel DB).

Per favore:
1. Leggi prima `Docs/REPORT_SVILUPPO_2025-01-13.md` 
2. Poi `Docs/ISTRUZIONI-PROSSIMA-SESSIONE-2025-01-14.md`
3. Verifica il database con `npx prisma studio`
4. Continua dal punto dove ho lasciato

Il backend gira su porta 3100, frontend su 5183. Le credenziali sono admin@medicinaravenna.it / admin123.

Puoi aiutarmi a completare il sistema?"

---

**Buona fortuna con la prossima sessione!** 🚀
