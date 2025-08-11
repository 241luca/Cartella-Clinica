# 📋 ISTRUZIONI DETTAGLIATE PER COMPLETAMENTO PROGETTO
## Sistema Gestione Cartella Clinica - Medicina Ravenna
## Data: 12 Agosto 2025 - Per prossima sessione Claude
## URGENTE: Da completare entro 25 Agosto 2025

---

# 🎯 COSA DIRE A CLAUDE (COPIA E INCOLLA QUESTO):

```
Ciao! Devi completare il progetto di gestione cartella clinica per Medicina Ravenna.

**INFORMAZIONI PROGETTO:**
* Directory progetto: /Users/lucamambelli/Desktop/Cartella-Clinica
* Directory documentazione: /Users/lucamambelli/Desktop/Cartella-Clinica/Docs
* Repository GitHub: https://github.com/241luca/cartella-clinica
* Progresso attuale: 75% completato

**COSA È STATO FATTO:**
* Backend completato al 90% (manca solo PDF)
* TUTTI i 13 form delle terapie sono stati creati
* Componente VASScale completato
* PatientDetail page completata
* Database PostgreSQL funzionante
* API REST complete

**COSA DEVI FARE SUBITO:**
1. PRIMA DI TUTTO leggi il file /Users/lucamambelli/Desktop/Cartella-Clinica/Docs/ISTRUZIONI-FINALI-COMPLETAMENTO.md
2. Creare il NewTherapyWizard per selezionare e usare i form
3. Integrare i form con le API backend
4. Creare il componente BodyMapper
5. Implementare generazione PDF
6. Testare tutto il sistema end-to-end
7. Aggiornare SEMPRE la documentazione

**I 13 FORM GIÀ CREATI (NON ricrearli):**
Sono in /frontend/src/components/therapy-forms/
- MagnetoterapiaForm.tsx
- LaserYagForm.tsx
- Laser810980Form.tsx
- LaserScannerForm.tsx
- TensForm.tsx
- UltrasuoniForm.tsx
- ElettrostimolazioneForm.tsx
- MassoterapiaForm.tsx
- TecarsinForm.tsx
- LimfaterapyForm.tsx
- MobilizzazioniForm.tsx
- SITForm.tsx
- TecalabForm.tsx

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
* Il frontend usa la porta 5183, NON 5173
* React è versione 18.3.1, NON aggiornare
* Fai commit su GitHub OGNI ORA
* Aggiorna SEMPRE la documentazione dopo ogni modifica
* Crea un report dettagliato alla fine della sessione

Io non ho esperienza di programmazione, quindi parla in modo semplice.
Inizia leggendo le istruzioni dettagliate e poi procedi con l'integrazione dei form.
```

---

# 📊 STATO ATTUALE DEL PROGETTO (75% COMPLETATO)

## ✅ COSA È GIÀ STATO FATTO:

### Backend (90% completato)
- ✅ Database PostgreSQL configurato
- ✅ Server Express + TypeScript
- ✅ Autenticazione JWT funzionante
- ✅ PatientService completo
- ✅ ClinicalRecordService completo
- ✅ TherapyService con tutte le 13 terapie
- ✅ Controllers e Routes complete
- ✅ Validazione dati con Zod
- ❌ Generazione PDF (DA FARE)

### Frontend (60% completato)
- ✅ Setup React 18.3.1 con Vite
- ✅ Pagina Login funzionante
- ✅ Dashboard base
- ✅ Lista pazienti
- ✅ PatientDetail completa
- ✅ **TUTTI i 13 Form Terapie** (100% completati)
- ✅ VASScale component
- ❌ NewTherapyWizard (DA FARE)
- ❌ BodyMapper component (DA FARE)
- ❌ Integrazione form con API (DA FARE)
- ❌ Upload documenti (DA FARE)

---

# 🔴 LAVORI DA COMPLETARE (25% rimanente)

## 1. PRIORITÀ ALTA - NewTherapyWizard.tsx

**Path:** `/frontend/src/components/therapy/NewTherapyWizard.tsx`

### Funzionalità da implementare:
```typescript
// Il wizard deve:
1. Mostrare lista delle 13 terapie disponibili
2. Al click su una terapia, mostrare il form corrispondente
3. Gestire il salvataggio tramite therapyService
4. Redirect a PatientDetail dopo il salvataggio

// Struttura componente:
interface NewTherapyWizardProps {
  patientId: string;
  clinicalRecordId: string;
  onComplete: () => void;
  onCancel: () => void;
}

// Step del wizard:
Step 1: Selezione tipo terapia (grid con icone)
Step 2: Compilazione form specifico
Step 3: Conferma e salvataggio
```

### Esempio implementazione:
```typescript
import { useState } from 'react';
import MagnetoterapiaForm from '../therapy-forms/MagnetoterapiaForm';
import LaserYagForm from '../therapy-forms/LaserYagForm';
// ... importare tutti i 13 form

const therapyTypes = [
  { id: 'magnetoterapia', name: 'Magnetoterapia', icon: '🧲', component: MagnetoterapiaForm },
  { id: 'laser-yag', name: 'Laser YAG', icon: '💡', component: LaserYagForm },
  // ... mappare tutti i 13 tipi
];

const NewTherapyWizard = ({ patientId, clinicalRecordId, onComplete }) => {
  const [selectedType, setSelectedType] = useState(null);
  
  // Step 1: Selezione tipo
  if (!selectedType) {
    return <TherapyTypeSelector onSelect={setSelectedType} />;
  }
  
  // Step 2: Form specifico
  const FormComponent = selectedType.component;
  return (
    <FormComponent 
      onSubmit={handleSubmit}
      onCancel={() => setSelectedType(null)}
    />
  );
};
```

## 2. PRIORITÀ ALTA - Integrazione API

**Path:** `/frontend/src/services/therapyService.ts`

### Metodi da implementare:
```typescript
class TherapyService {
  // Inizializza i tipi di terapia nel DB (solo prima volta)
  async initializeTherapyTypes(): Promise<void> {
    await api.post('/therapies/initialize-types');
  }
  
  // Crea nuova terapia
  async createTherapy(data: {
    patientId: string;
    clinicalRecordId: string;
    therapyTypeId: string;
    parameters: any;
    prescribedSessions: number;
  }): Promise<Therapy> {
    return api.post('/therapies', data);
  }
  
  // Ottieni terapie per paziente
  async getByPatient(patientId: string): Promise<Therapy[]> {
    return api.get(`/patients/${patientId}/therapies`);
  }
  
  // Aggiorna progressi seduta
  async updateSession(sessionId: string, data: {
    completed: boolean;
    vasScoreBefore?: number;
    vasScoreAfter?: number;
    notes?: string;
  }): Promise<Session> {
    return api.put(`/sessions/${sessionId}`, data);
  }
}

export default new TherapyService();
```

## 3. PRIORITÀ MEDIA - BodyMapper.tsx

**Path:** `/frontend/src/components/medical/BodyMapper.tsx`

### Specifiche componente:
```typescript
interface BodyMapperProps {
  selectedZones: string[];
  onZoneClick: (zone: string) => void;
  view: 'front' | 'back';
  multiple?: boolean;
}

// Zone da mappare:
const bodyZones = {
  front: [
    { id: 'head', label: 'Testa', path: 'M...' },
    { id: 'neck', label: 'Collo', path: 'M...' },
    { id: 'shoulder-r', label: 'Spalla DX', path: 'M...' },
    { id: 'shoulder-l', label: 'Spalla SX', path: 'M...' },
    // ... tutte le zone
  ],
  back: [
    // zone posteriori
  ]
};

// Implementazione con SVG interattivo
const BodyMapper = ({ selectedZones, onZoneClick, view }) => {
  return (
    <svg viewBox="0 0 400 600">
      {bodyZones[view].map(zone => (
        <path
          key={zone.id}
          d={zone.path}
          fill={selectedZones.includes(zone.id) ? '#3b82f6' : '#e5e7eb'}
          onClick={() => onZoneClick(zone.id)}
          className="cursor-pointer hover:fill-blue-400"
        />
      ))}
    </svg>
  );
};
```

## 4. PRIORITÀ MEDIA - Generazione PDF

**Path:** `/backend/src/services/pdfService.ts`

### Installare dipendenze:
```bash
cd backend
npm install puppeteer
npm install --save-dev @types/puppeteer
```

### Implementazione:
```typescript
import puppeteer from 'puppeteer';

class PDFService {
  async generateClinicalRecordPDF(recordId: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Genera HTML con i dati
    const html = await this.generateHTML(recordId);
    await page.setContent(html);
    
    // Genera PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' }
    });
    
    await browser.close();
    return pdf;
  }
  
  private async generateHTML(recordId: string): Promise<string> {
    // Recupera dati dal DB
    const record = await getClinicalRecord(recordId);
    const patient = await getPatient(record.patientId);
    const therapies = await getTherapies(recordId);
    
    // Template HTML
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial; }
            .header { text-align: center; }
            // ... stili CSS
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medicina Ravenna</h1>
            <h2>Cartella Clinica</h2>
          </div>
          <div class="patient-info">
            <h3>Paziente: ${patient.firstName} ${patient.lastName}</h3>
            <p>CF: ${patient.fiscalCode}</p>
            // ... altri dati
          </div>
          <div class="therapies">
            ${therapies.map(t => `
              <div class="therapy">
                <h4>${t.type.name}</h4>
                <p>Sedute: ${t.completedSessions}/${t.prescribedSessions}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  }
}
```

## 5. ROUTING DA AGGIUNGERE

**Path:** `/frontend/src/App.tsx`

Aggiungi queste route:
```typescript
import NewTherapyWizard from './components/therapy/NewTherapyWizard';

// Dentro il componente App
<Routes>
  {/* Route esistenti... */}
  
  {/* Nuove route per terapie */}
  <Route 
    path="/patients/:patientId/therapies/new" 
    element={<NewTherapyWizard />} 
  />
  <Route 
    path="/therapies/:id" 
    element={<TherapyDetail />} 
  />
  <Route 
    path="/therapies/:id/session/:sessionId" 
    element={<SessionDetail />} 
  />
</Routes>
```

---

# 🧪 TEST DA ESEGUIRE

## 1. Test Creazione Terapia Completo
```bash
1. Login come admin
2. Vai su un paziente
3. Click "Nuova Terapia"
4. Seleziona "Magnetoterapia"
5. Compila il form
6. Salva
7. Verifica che appaia nella lista terapie
8. Verifica nel database che sia salvata
```

## 2. Test API Backend
```bash
# Inizializza tipi terapia (solo prima volta)
curl -X POST http://localhost:3100/api/therapies/initialize-types \
  -H "Authorization: Bearer [TOKEN]"

# Crea nuova terapia
curl -X POST http://localhost:3100/api/therapies \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-id",
    "clinicalRecordId": "record-id",
    "therapyTypeId": "magnetoterapia",
    "parameters": {
      "programma": 1,
      "hertz": 50,
      "intensita": 50,
      "tempo": 30
    },
    "prescribedSessions": 10
  }'
```

## 3. Test Componenti UI
- [ ] VASScale funziona con tutti i valori 0-10
- [ ] Ogni form salva correttamente i dati
- [ ] BodyMapper seleziona/deseleziona zone
- [ ] PDF si genera correttamente
- [ ] Upload file funziona

---

# 📝 DOCUMENTAZIONE DA AGGIORNARE

## DOPO OGNI MODIFICA, aggiorna:

### 1. README.md principale
```markdown
# Cartella Clinica - Medicina Ravenna

## Stato Progetto
- Completamento: XX% (aggiornare)
- Ultimo aggiornamento: [data]

## Features Completate
- ✅ Lista aggiornata...

## Features Mancanti
- ❌ Lista aggiornata...
```

### 2. Crea REPORT-SESSIONE-[DATA].md
```markdown
# Report Sessione [DATA]

## Lavori Completati
- Lista dettagliata...

## Problemi Risolti
- ...

## Test Eseguiti
- ...

## Prossimi Passi
- ...

## Tempo Impiegato
- X ore

## Percentuale Completamento
- Prima: XX%
- Dopo: XX%
```

### 3. Aggiorna CHANGELOG.md
```markdown
## [Data] - Versione X.X.X

### Aggiunti
- Feature X
- Componente Y

### Modificati
- ...

### Corretti
- Bug Z
```

---

# ⚠️ PROBLEMI COMUNI E SOLUZIONI

## 1. "Cannot find module" per i form
**Soluzione:** I form sono in `/frontend/src/components/therapy-forms/`
Importa così: `import MagnetoterapiaForm from '../therapy-forms/MagnetoterapiaForm';`

## 2. Porta 5173 invece di 5183
**Soluzione:** Verificare vite.config.ts, deve essere:
```javascript
export default {
  server: {
    port: 5183
  }
}
```

## 3. API non risponde
**Soluzione:** 
- Verificare che backend sia su porta 3100
- Verificare token JWT in localStorage
- Controllare CORS configuration

## 4. Form non salva
**Soluzione:**
- Verificare che therapyTypeId corrisponda al DB
- Controllare che tutti i campi required siano compilati
- Verificare console per errori di validazione

---

# 🎯 OBIETTIVI FINALI

## Per considerare il progetto COMPLETO (100%):

### Funzionalità Core (MUST HAVE):
- ✅ Gestione pazienti
- ✅ Cartelle cliniche
- ✅ Tutti i form terapie
- ⚠️ Salvataggio terapie nel DB
- ⚠️ Tracking progressi sedute
- ❌ Generazione PDF cartelle
- ❌ Calendario appuntamenti base

### Nice to Have (se c'è tempo):
- ❌ Dashboard analytics avanzate
- ❌ Export Excel
- ❌ Notifiche email
- ❌ App mobile

---

# 📞 INFORMAZIONI URGENTI

- **DEADLINE**: 25 Agosto 2025 (mancano 13 giorni)
- **Priorità**: COMPLETARE funzionalità core
- **NON perdere tempo su**: Grafica perfetta, features extra
- **FOCUS su**: Funzionalità che DEVONO funzionare

---

# 🚀 COMANDI RAPIDI

```bash
# Start tutto
cd /Users/lucamambelli/Desktop/Cartella-Clinica
npm run dev:all

# Solo backend
cd backend && npm run dev

# Solo frontend
cd frontend && npm run dev

# Git commit
git add -A && git commit -m "feat: [descrizione]" && git push

# Build produzione
npm run build

# Test
npm run test
```

---

# ✅ CHECKLIST FINALE

Prima di chiudere la sessione, assicurati di:

- [ ] Aver fatto commit su GitHub
- [ ] Aver aggiornato il README
- [ ] Aver creato il report sessione
- [ ] Aver aggiornato la % di completamento
- [ ] Aver testato le modifiche
- [ ] Aver documentato problemi non risolti
- [ ] Aver lasciato istruzioni chiare per la prossima sessione

---

**IMPORTANTE**: Questo progetto DEVE essere completato entro il 25 Agosto 2025!

Concentrati su far FUNZIONARE tutto, non su renderlo perfetto.

**Buon lavoro!** 💪
