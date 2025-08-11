# 📋 ISTRUZIONI DETTAGLIATE PER COMPLETAMENTO PROGETTO
## Sistema Gestione Cartella Clinica - Medicina Ravenna
## Data: 12 Agosto 2025 - Per prossima sessione Claude
## URGENTE: Da completare entro 25 Agosto 2025

---

# 🎯 COSA DIRE A CLAUDE (COPIA E INCOLLA QUESTO):

```
Ciao! Devi continuare lo sviluppo del progetto di gestione cartella clinica per Medicina Ravenna.

**INFORMAZIONI PROGETTO:**
* Directory progetto: /Users/lucamambelli/Desktop/Cartella-Clinica
* Directory documentazione: /Users/lucamambelli/Desktop/Cartella-Clinica/Docs
* Repository GitHub: https://github.com/241luca/cartella-clinica
* Progresso attuale: 55% completato

**COSA È STATO FATTO:**
* Backend completato al 90% (manca solo PDF)
* TherapyService completato con 13 tipi di terapie
* Database PostgreSQL funzionante
* API REST complete per pazienti, cartelle cliniche e terapie

**COSA DEVI FARE SUBITO:**
1. PRIMA DI TUTTO leggi il file /Users/lucamambelli/Desktop/Cartella-Clinica/Docs/ISTRUZIONI-SESSIONE3-12-08-2025.md
2. Creare i form frontend per le 13 terapie
3. Creare la pagina PatientDetail
4. Implementare il componente VASScale
5. Testare tutto il sistema

**SETUP AMBIENTE:**
```bash
# Backend su porta 3100
cd backend && npm run dev

# Frontend su porta 5183 (NON 5173!)
cd frontend && npm run dev
```

**CREDENZIALI:**
* Admin: admin@medicinaravenna.it / admin123
* GitHub: user 241luca, password 241-Mambo, token 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

**IMPORTANTE:**
* Leggi SEMPRE tutta la documentazione nella cartella Docs prima di iniziare
* Il frontend usa la porta 5183, non 5173
* React è versione 18.3.1, NON aggiornare
* Fai commit su GitHub ogni ora
* Aggiorna sempre la documentazione

Io non ho esperienza di programmazione, quindi parla in modo semplice e spiega cosa stai facendo.
Puoi iniziare leggendo le istruzioni dettagliate e poi creare i form per le terapie?
```

---

# 📊 STATO ATTUALE DEL PROGETTO (55% COMPLETATO)

## ✅ COSA È GIÀ FATTO:

### Backend (90% completato)
- ✅ Database PostgreSQL configurato e funzionante
- ✅ Server Express + TypeScript
- ✅ Autenticazione JWT
- ✅ **PatientService** - Gestione pazienti completa
- ✅ **ClinicalRecordService** - Gestione cartelle cliniche
- ✅ **TherapyService** - TUTTE le 13 terapie implementate:
  1. Limfaterapy
  2. Laser YAG 145
  3. Laser 810+980
  4. Laser Scanner
  5. Magnetoterapia
  6. TENS
  7. Ultrasuoni
  8. Elettrostimolazione
  9. Massoterapia
  10. Mobilizzazioni
  11. Tecarsin
  12. SIT
  13. Tecalab
- ✅ Controllers e Routes complete
- ✅ Validazione dati con Zod
- ❌ Generazione PDF (da completare)

### Frontend (20% completato)
- ✅ Setup React 18.3.1 con Vite
- ✅ Pagina Login funzionante
- ✅ Dashboard base
- ✅ Lista pazienti
- ❌ **PatientDetail** (DA FARE)
- ❌ **Form terapie** (DA FARE - 13 form)
- ❌ **Componenti medici** (DA FARE)

---

# 🔴 LAVORI DA COMPLETARE URGENTEMENTE

## 1. FRONTEND - Form Terapie (PRIORITÀ ALTA)

### Creare 13 form specifici in: `/frontend/src/components/therapy-forms/`

#### A. LimfaterapyForm.tsx
```typescript
// Campi necessari:
- sedute: number (input numerico)
- programma: string (select o input testo)
- modalita: 'auto' | 'manuale' (radio button)
- descrizione: string (textarea opzionale)
```

#### B. LaserYagForm.tsx
```typescript
// Campi necessari:
- watt: number (slider 0-100)
- joulePerPulse: number (input numerico)
- pulse: number (input numerico)
- dose: number (input numerico)
- distretto: string (select zone corpo)
```

#### C. Laser810980Form.tsx
```typescript
// Stessi campi di LaserYagForm
```

#### D. LaserScanForm.tsx
```typescript
// Campi necessari:
- potenza: number (slider)
- drenaggio: boolean (checkbox)
- normale: boolean (checkbox)
- radiofrequenza: number (input opzionale)
- temperatura: number (input opzionale)
- distretto: string (select)
```

#### E. MagnetoterapiaForm.tsx
```typescript
// Campi necessari:
- programma: number (select 1-20)
- hertz: number (input 1-100)
- intensita: number (slider 0-100)
- tempo: number (select 15/30/45/60 minuti)
```

#### F. TensForm.tsx
```typescript
// Campi necessari:
- tempo: number (select minuti)
- tipo: string (select tipo programma)
- distretto: string (select zona)
```

#### G. UltrasuoniForm.tsx
```typescript
// Campi necessari:
- mhz: number (radio 1MHz o 3MHz)
- watt: number (slider potenza)
- tempo: number (select minuti)
- inAcqua: boolean (checkbox)
```

#### H. ElettrostimolazioneForm.tsx
```typescript
// Campi necessari:
- distretto: string (select zona)
- programma: string (input)
- intensita: number (slider 0-100)
```

#### I. MassoterapiaForm.tsx
```typescript
// Campi necessari:
- tipo: string (select: decontratturante/drenante/sportivo)
- distretto: string (select zona)
- durata: number (select 30/45/60 minuti)
```

#### J. MobilizzazioniForm.tsx
```typescript
// Campi necessari:
- distretto: string (select articolazione)
- tipo: string (select: passiva/attiva/assistita)
- note: string (textarea)
```

#### K. TecarsinForm.tsx
```typescript
// Campi necessari:
- programma: string (input)
- potenza: number (slider W)
- tempo: number (select minuti)
```

#### L. SITForm.tsx
```typescript
// Campi necessari:
- distretto: string (select zona)
- farmaco: string (input nome farmaco)
```

#### M. TecalabForm.tsx
```typescript
// Campi necessari:
- sedute: number (input numerico)
- programma: string (input)
```

## 2. FRONTEND - Pagina PatientDetail.tsx

**Path:** `/frontend/src/pages/patients/PatientDetail.tsx`

### Deve contenere:
1. **Header con dati paziente**
   - Nome, cognome, codice fiscale
   - Età, telefono, email
   - Medico curante

2. **Sezione Cartelle Cliniche**
   - Lista cartelle (aperte/chiuse)
   - Pulsante "Nuova Cartella"
   - Click su cartella → mostra dettagli

3. **Sezione Terapie in Corso**
   - Card per ogni terapia attiva
   - Progressi (sedute fatte/totali)
   - Prossima seduta
   - Pulsante "Nuova Terapia"

4. **Sezione Documenti**
   - Lista documenti
   - Pulsante upload
   - Anteprima/download

5. **Timeline Attività**
   - Ultime 10 attività
   - Data, tipo, descrizione

## 3. FRONTEND - Componenti Medici

### A. VASScale.tsx
**Path:** `/frontend/src/components/medical/VASScale.tsx`

```typescript
interface VASScaleProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showFaces?: boolean; // Mostra faccine
  disabled?: boolean;
}

// Implementazione:
- Slider 0-10
- Etichette: 0="Nessun dolore", 10="Massimo dolore"
- Colori: verde (0-3), giallo (4-6), rosso (7-10)
- Opzionale: faccine che cambiano espressione
```

### B. BodyMapper.tsx
**Path:** `/frontend/src/components/medical/BodyMapper.tsx`

```typescript
interface BodyMapperProps {
  selectedZones: string[];
  onZoneClick: (zone: string) => void;
  view: 'front' | 'back';
  multiple?: boolean;
}

// Zone principali:
- Testa/Collo
- Spalla dx/sx
- Braccio dx/sx
- Gomito dx/sx
- Polso/Mano dx/sx
- Torace
- Addome
- Schiena alta/media/bassa
- Anca dx/sx
- Coscia dx/sx
- Ginocchio dx/sx
- Gamba dx/sx
- Caviglia/Piede dx/sx
```

### C. SessionProgressCard.tsx
**Path:** `/frontend/src/components/medical/SessionProgressCard.tsx`

```typescript
interface SessionProgressCardProps {
  sessionNumber: number;
  date: Date;
  therapist: string;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  status: 'completed' | 'scheduled' | 'missed';
}
```

## 4. INTEGRAZIONI API FRONTEND

### Creare servizi in: `/frontend/src/services/`

#### therapyService.ts
```typescript
class TherapyService {
  // Inizializza tipi nel DB (solo prima volta)
  async initializeTypes(): Promise<void>
  
  // Crea nuova terapia
  async createTherapy(data: CreateTherapyDto): Promise<Therapy>
  
  // Pianifica seduta
  async scheduleSession(data: ScheduleSessionDto): Promise<Session>
  
  // Aggiorna progressi
  async updateProgress(sessionId: string, data: ProgressDto): Promise<Session>
  
  // Ottieni statistiche
  async getStatistics(therapyId: string): Promise<Statistics>
  
  // Lista terapie per paziente
  async getByPatient(patientId: string): Promise<Therapy[]>
  
  // Lista terapie per cartella
  async getByClinicalRecord(recordId: string): Promise<Therapy[]>
}
```

## 5. ROUTING FRONTEND

Aggiungere in `/frontend/src/App.tsx`:

```typescript
<Route path="/patients/:id" element={<PatientDetail />} />
<Route path="/patients/:id/new-therapy" element={<NewTherapyWizard />} />
<Route path="/therapies/:id" element={<TherapyDetail />} />
<Route path="/therapies/:id/session/:sessionId" element={<SessionDetail />} />
```

---

# 🧪 TEST DA ESEGUIRE

## 1. Test Backend (già funzionante)
```bash
# Login
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}'

# Inizializza tipi terapia (solo prima volta)
curl -X POST http://localhost:3100/api/therapies/initialize-types \
  -H "Authorization: Bearer [TOKEN]"
```

## 2. Test Frontend (da implementare)
1. Login → Dashboard
2. Click su paziente → PatientDetail
3. Click "Nuova Terapia" → Wizard selezione tipo
4. Seleziona "Magnetoterapia" → Form specifico
5. Compila e salva → Verifica creazione
6. Pianifica seduta → Verifica calendario
7. Registra progressi → Verifica VAS

---

# 📦 DIPENDENZE DA VERIFICARE

## Backend (già installate)
```json
{
  "@prisma/client": "^5.x",
  "express": "^4.x",
  "typescript": "^5.x",
  "zod": "^3.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x"
}
```

## Frontend (verificare/installare)
```bash
cd frontend
npm install lucide-react   # Icone
npm install date-fns       # Date
npm install react-hook-form # Form
npm install @tanstack/react-query # Cache/fetch
npm install react-hot-toast # Notifiche
```

---

# ⚠️ PROBLEMI NOTI E SOLUZIONI

## 1. Porta Frontend
**PROBLEMA:** Il frontend deve girare su porta 5183, NON 5173
**SOLUZIONE:** Già configurato in vite.config.ts

## 2. React Version
**PROBLEMA:** React 19 causa problemi
**SOLUZIONE:** Mantenere React 18.3.1 (già fatto downgrade)

## 3. TypeScript Strict
**PROBLEMA:** Errori per parametri non usati
**SOLUZIONE:** Usare underscore: `_req` invece di `req`

## 4. CORS
**PROBLEMA:** Frontend non comunica con backend
**SOLUZIONE:** Backend già configurato con CORS per localhost:5183

---

# 📊 METRICHE PER VALUTARE PROGRESSO

## Completamento per modulo:
- ✅ Database: 100%
- ✅ Backend API: 90%
- ✅ Autenticazione: 100%
- ✅ Servizi Backend: 100%
- ⚠️ Frontend Base: 30%
- ❌ Form Terapie: 0%
- ❌ Componenti Medici: 0%
- ❌ Testing: 20%
- ❌ PDF Generation: 0%
- ❌ Upload Documenti: 0%

## Stima ore rimanenti:
- Form Terapie: 4 ore
- PatientDetail: 2 ore
- Componenti Medici: 2 ore
- Testing: 2 ore
- PDF: 2 ore
- **TOTALE: 12 ore**

---

# 🎯 ORDINE DI PRIORITÀ

1. **URGENTE - Giorno 1 (4 ore)**
   - [ ] PatientDetail.tsx
   - [ ] VASScale.tsx
   - [ ] 5 form terapie principali (Magneto, Laser, TENS, Massoterapia, Tecar)

2. **IMPORTANTE - Giorno 2 (4 ore)**
   - [ ] Restanti 8 form terapie
   - [ ] BodyMapper.tsx
   - [ ] Integration test completo

3. **NICE TO HAVE - Giorno 3 (4 ore)**
   - [ ] PDF generation
   - [ ] Upload documenti
   - [ ] Calendar view
   - [ ] Report avanzati

---

# 📝 DOCUMENTAZIONE DA AGGIORNARE

Dopo ogni sessione, aggiornare:

1. **REPORT-AVANZAMENTO-SESSIONE[N]-[DATA].md**
   - Cosa è stato fatto
   - Problemi risolti
   - Tempo impiegato
   - Prossimi passi

2. **README.md** del progetto
   - Percentuale completamento
   - Features complete
   - Features mancanti

3. **Commit GitHub frequenti**
   ```bash
   git add -A
   git commit -m "feat: [descrizione]"
   git push origin main
   ```

---

# 💡 SUGGERIMENTI FINALI

1. **Non perdere tempo su dettagli estetici** - Funzionalità prima di tutto
2. **Usa componenti già pronti** - Non reinventare la ruota
3. **Test man mano** - Non accumulare bug
4. **Commit frequenti** - Ogni feature completata
5. **Documentazione inline** - Commenta parti complesse
6. **Priorità ai form più usati** - Magnetoterapia, Laser, TENS sono i più comuni
7. **UI semplice** - Meglio semplice e funzionante che complesso e buggato

---

# 🔴 INIZIARE SUBITO DA:

1. Leggere questo documento
2. Verificare che backend sia attivo su porta 3100
3. Verificare che frontend sia attivo su porta 5183
4. Creare PatientDetail.tsx
5. Creare VASScale.tsx
6. Creare primo form (MagnetoterapiaForm.tsx)
7. Testare creazione terapia
8. Commit su GitHub
9. Proseguire con altri form

---

**DEADLINE: 25 Agosto 2025 (mancano 13 giorni)**
**URGENZA: ALTA**
**PROGRESSO ATTUALE: 55%**
**OBIETTIVO PROSSIMA SESSIONE: 75%**

---

*Documento creato: 12 Agosto 2025*
*Per: Prossima sessione Claude*
*Autore: Sessione precedente*