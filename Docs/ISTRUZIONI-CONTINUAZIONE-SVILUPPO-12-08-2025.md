# 📋 ISTRUZIONI DETTAGLIATE PER CONTINUAZIONE SVILUPPO
## Sistema Gestione Cartella Clinica - Medicina Ravenna
## Data: 11 Agosto 2025 - ore 23:00
## Per: Prossima sessione Claude o altro sviluppatore

---

## 🎯 CONTESTO DEL PROGETTO

### Cliente
**Medicina Ravenna SRL**
- Via Porto Coriandro, 7 - 48121 Ravenna
- Clinica di riabilitazione e fisioterapia
- Necessita digitalizzazione cartelle cliniche

### Repository GitHub
- URL: https://github.com/241luca/cartella-clinica
- User: 241luca
- Token: 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

### Credenziali Accesso Sistema
- Admin: admin@medicinaravenna.it / admin123
- Test: dott.rossi@medicinaravenna.it / doctor123

---

## 📊 STATO ATTUALE DEL PROGETTO

### Completamento: 45%
- ✅ Database PostgreSQL configurato e funzionante
- ✅ Backend base con Express + TypeScript
- ✅ Autenticazione JWT funzionante
- ✅ PatientService completato (100%)
- ✅ ClinicalRecordService completato (100%)
- ⚠️ Frontend base presente ma incompleto
- ❌ TherapyService da completare
- ❌ 13 tipi di terapie specifiche da implementare
- ❌ Sistema PDF non implementato
- ❌ Upload documenti mancante

### Directory Progetto
```
/Users/lucamambelli/Desktop/Cartella-Clinica/
├── backend/          # Server Node.js/Express
├── frontend/         # App React
└── Docs/            # Documentazione completa
```

---

## 🚨 LAVORI DA COMPLETARE - PRIORITÀ ALTA

### 1. COMPLETARE TherapyService.ts (URGENTE)
Il file è stato iniziato ma NON completato. Si trova in:
`/backend/src/services/TherapyService.ts`

Deve implementare i 13 tipi di terapie con parametri specifici:

```typescript
// PARAMETRI DA IMPLEMENTARE PER OGNI TERAPIA:

1. LIMFATERAPY
   - sedute: number
   - programma: string
   - modalita: 'auto' | 'manuale'
   - descrizione: string

2. LASER_YAG_145
   - watt: number
   - joulePerPulse: number (JxP)
   - pulse: number (P)
   - dose: number
   - distretto: string

3. LASER_810_980
   - watt: number
   - joulePerPulse: number
   - pulse: number
   - dose: number
   - distretto: string

4. LASER_SCAN
   - potenza: number
   - drenaggio: boolean
   - normale: boolean
   - radiofrequenza: number
   - temperatura: number
   - distretto: string

5. MAGNETOTERAPIA
   - programma: number
   - hertz: number
   - intensita: number
   - tempo: number

6. TENS
   - tempo: number
   - tipo: string
   - distretto: string

7. ULTRASUONI
   - mhz: number
   - watt: number
   - tempo: number
   - inAcqua: boolean

8. ELETTROSTIMOLAZIONE
   - distretto: string
   - programma: string
   - intensita: number

9. MASSOTERAPIA
   - tipo: string
   - distretto: string
   - durata: number

10. MOBILIZZAZIONI
    - distretto: string
    - tipo: string
    - note: string

11. TECARSIN (Tecar)
    - programma: string
    - potenza: number
    - tempo: number

12. SIT
    - distretto: string
    - farmaco: string

13. TECALAB
    - sedute: number
    - programma: string
```

### Metodi da implementare in TherapyService:
```typescript
class TherapyService {
  // Da completare:
  async createTherapyPlan(data: {...}) // Crea piano terapeutico
  async scheduleSession(therapyId: string, date: Date) // Pianifica seduta
  async updateSessionProgress(sessionId: string, data: {...}) // Aggiorna progressi
  async calculateVASImprovement(therapyId: string) // Calcola miglioramento VAS
  async getParametersByType(type: TherapyType) // Ottieni parametri per tipo
  async generateTherapyReport(therapyId: string) // Genera report PDF
  
  // Per ogni tipo di terapia, creare metodo specifico:
  async createLimfaterapy(recordId: string, params: {...})
  async createLaserYag(recordId: string, params: {...})
  // ... etc per tutti i 13 tipi
}
```

---

## 🚨 LAVORI DA COMPLETARE - FRONTEND

### 2. Pagine da creare/completare

#### A. PatientDetail.tsx
Path: `/frontend/src/pages/patients/PatientDetail.tsx`
```typescript
// Deve mostrare:
- Dati anagrafici completi
- Lista cartelle cliniche
- Terapie in corso
- Documenti
- Timeline attività
- Pulsanti azione (nuova cartella, nuova terapia, etc)
```

#### B. ClinicalRecordEditor.tsx
Path: `/frontend/src/pages/clinical-records/RecordEditor.tsx`
```typescript
// Editor completo cartella con:
- Sezioni: Anamnesi, Esame Obiettivo, Diagnosi, Piano Terapeutico
- Possibilità di aggiungere terapie
- Upload documenti
- Gestione consensi
- Salvataggio automatico
```

#### C. TherapyForms (13 form specifici)
Path: `/frontend/src/components/therapy-forms/`

Creare un form per OGNI tipo di terapia con i campi specifici:
- LimfaterapyForm.tsx
- LaserYagForm.tsx
- Laser810Form.tsx
- LaserScanForm.tsx
- MagnetoterapiaForm.tsx
- TensForm.tsx
- UltrasuoniForm.tsx
- ElettrostimolazioneForm.tsx
- MassoterapiaForm.tsx
- MobilizzazioniForm.tsx
- TecarsinForm.tsx
- SITForm.tsx
- TecalabForm.tsx

#### D. Componenti Speciali
Path: `/frontend/src/components/medical/`

```typescript
// VASScale.tsx - Scala dolore interattiva 0-10
interface VASScaleProps {
  value: number;
  onChange: (value: number) => void;
  showLabels?: boolean; // 0=Nessun dolore, 10=Massimo dolore
}

// BodyMapper.tsx - Mappa zone corpo cliccabili
interface BodyMapperProps {
  zones: Zone[];
  onZoneClick: (zone: Zone) => void;
  view: 'front' | 'back';
}

// GoniometerInput.tsx - Input gradi articolari
interface GoniometerProps {
  articulation: string;
  movements: {
    flexion?: number;
    extension?: number;
    abduction?: number;
    adduction?: number;
    rotation?: number;
  };
  onChange: (movements: any) => void;
}
```

---

## 🛠️ SETUP AMBIENTE DI SVILUPPO

### 1. Prerequisiti
```bash
# Verificare installazioni
node --version  # Deve essere 18+
psql --version  # PostgreSQL deve essere attivo
```

### 2. Setup Database
```bash
cd backend

# Configurare .env con:
DATABASE_URL="postgresql://postgres:password@localhost:5432/cartella_clinica"
JWT_SECRET="your-secret-key"
PORT=3100

# Applicare migrazioni
npx prisma migrate dev
npx prisma db seed
```

### 3. Avvio Sistema
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server su http://localhost:3100

# Terminal 2 - Frontend  
cd frontend
npm run dev
# UI su http://localhost:5183 (ATTENZIONE: porta custom!)
```

### 4. Test Login
1. Aprire http://localhost:5183
2. Login con: admin@medicinaravenna.it / admin123
3. Verificare dashboard funzionante

---

## 📝 DOCUMENTAZIONE ESSENZIALE

### File da consultare SEMPRE:
1. `/Docs/PIANO-LAVORO-DETTAGLIATO-11-08-2025.md` - Roadmap completa
2. `/Docs/MR Cartella clinica infermieristica 2.docx` - Specifiche originali
3. `/backend/prisma/schema.prisma` - Schema database
4. `/Docs/REPORT-AVANZAMENTO-SESSIONE1-11-08-2025.md` - Ultimo stato

### Documenti Medicina Ravenna (nel prompt iniziale)
Contengono TUTTI i campi specifici per:
- Parametri vitali
- Scale di valutazione
- Tipi di terapie
- Moduli consenso
- Scheda piscina/palestra

---

## ⚠️ PROBLEMI NOTI DA RISOLVERE

### 1. Porta Frontend
Il frontend gira su porta **5183** non 5173!
File: `/frontend/vite.config.ts`
```typescript
server: {
  port: 5183,
  strictPort: true
}
```

### 2. React Version
È stato fatto downgrade da React 19 a React 18.3.1
Non aggiornare a React 19!

### 3. TypeScript Errors
Potrebbero esserci errori di tipo da sistemare in:
- `/backend/src/controllers/`
- `/frontend/src/services/`

---

## 🎯 ORDINE DI ESECUZIONE CONSIGLIATO

### GIORNO 1 (4-6 ore)
1. ✅ Completare TherapyService.ts (2 ore)
2. ✅ Testare services con Postman (30 min)
3. ✅ Creare API endpoints mancanti (1 ora)
4. ✅ Fix TypeScript errors (30 min)
5. ✅ Creare PatientDetail.tsx (1 ora)
6. ✅ Creare RecordEditor.tsx (1 ora)

### GIORNO 2 (6-8 ore)
1. ✅ Creare i 13 TherapyForms (4 ore)
2. ✅ Implementare VASScale component (1 ora)
3. ✅ Implementare BodyMapper (2 ore)
4. ✅ Test integrazione completa (1 ora)

### GIORNO 3 (4-6 ore)
1. ✅ Sistema generazione PDF (2 ore)
2. ✅ Upload documenti (1 ora)
3. ✅ Calendar view per sedute (2 ore)
4. ✅ Testing e bug fixing (1 ora)

---

## 🔍 QUERY UTILI DATABASE

### Verificare dati esistenti:
```sql
-- Conta record per tabella
SELECT 'patients' as table_name, COUNT(*) from patients
UNION SELECT 'clinical_records', COUNT(*) from clinical_records
UNION SELECT 'therapies', COUNT(*) from therapies
UNION SELECT 'therapy_sessions', COUNT(*) from therapy_sessions;

-- Verifica utenti
SELECT email, role FROM users;

-- Pazienti con cartelle aperte
SELECT p.*, cr.diagnosis 
FROM patients p
JOIN clinical_records cr ON cr.patient_id = p.id
WHERE cr.closed_at IS NULL;
```

---

## 📦 DIPENDENZE MANCANTI DA INSTALLARE

### Backend
```bash
cd backend
npm install pdfkit  # Per generazione PDF
npm install multer @types/multer  # Per upload files
npm install nodemailer  # Per invio email
```

### Frontend
```bash
cd frontend
npm install react-calendar  # Per calendario
npm install react-signature-canvas  # Per firma digitale
npm install react-pdf  # Per visualizzare PDF
```

---

## 🚀 COMANDI RAPIDI

### Git
```bash
# Commit frequenti
git add -A
git commit -m "feat: implementato [feature]"
git push origin main
```

### Database
```bash
# Reset database
npx prisma migrate reset

# Aprire Prisma Studio
npx prisma studio

# Generare client dopo modifiche schema
npx prisma generate
```

### Test
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## 📞 CONTATTI E SUPPORTO

### Responsabile Progetto
- **Nome**: Luca Mambelli
- **Email**: lucamambelli@lmtecnologie.it
- **GitHub**: 241luca

### Approccio Comunicazione
- Linguaggio semplice (Luca non ha esperienza programmazione)
- Aggiornare sempre documentazione
- Fare report dettagliati
- Commit e push frequenti su GitHub

---

## ✅ CHECKLIST PRIMA DI INIZIARE

- [ ] Leggere TUTTA questa documentazione
- [ ] Verificare database PostgreSQL attivo
- [ ] Controllare file .env configurato
- [ ] Eseguire npm install in backend e frontend
- [ ] Testare login funzionante
- [ ] Aprire schema.prisma per riferimento
- [ ] Avere documenti Medicina Ravenna aperti

---

## 🎯 OBIETTIVO FINALE

Sistema COMPLETO e FUNZIONANTE con:
1. Tutti i 13 tipi di terapie implementati
2. Gestione completa cartelle cliniche
3. Sistema PDF funzionante
4. Upload documenti operativo
5. Tutte le validazioni attive
6. Zero errori TypeScript
7. Interfaccia user-friendly

**Deadline stimata**: 25 Agosto 2025

---

## 💡 SUGGERIMENTI IMPORTANTI

1. **NON REINVENTARE**: Usare codice già scritto in PatientService e ClinicalRecordService come riferimento
2. **TESTARE SEMPRE**: Ogni feature deve essere testata prima di passare alla successiva
3. **DOCUMENTARE**: Aggiungere commenti al codice complesso
4. **COMMIT FREQUENTI**: Salvare progressi ogni 30-60 minuti
5. **PRIORITÀ**: Completare prima il backend, poi il frontend

---

*Documento creato: 11 Agosto 2025 - ore 23:00*
*Per: Prossima sessione di sviluppo*
*Urgenza: ALTA - Progetto da completare entro 14 giorni*

## 🔴 INIZIARE DA QUI:
1. Aprire `/backend/src/services/TherapyService.ts`
2. Completare l'implementazione
3. Testare con Postman
4. Procedere con frontend

BUON LAVORO! 💪