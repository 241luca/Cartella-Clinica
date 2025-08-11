# 🎯 ISTRUZIONI PER SVILUPPO FRONTEND REACT - SISTEMA CARTELLA CLINICA

## 📁 INFORMAZIONI PROGETTO

### Directory Principali
- **Progetto**: `/Users/lucamambelli/Desktop/Cartella-Clinica`
- **Backend**: `/Users/lucamambelli/Desktop/Cartella-Clinica/backend` (COMPLETATO ✅)
- **Frontend**: `/Users/lucamambelli/Desktop/Cartella-Clinica/frontend` (DA CREARE)
- **Documentazione**: `/Users/lucamambelli/Desktop/Cartella-Clinica/Docs`

### Repository GitHub
- URL: `https://github.com/241luca/cartella-clinica`
- Credenziali Git:
  - User: `241luca`
  - Email: `lucamambelli@lmtecnologie.it`

### Porte Utilizzate
- **Backend API**: `http://localhost:3100` (già in esecuzione)
- **Frontend**: `http://localhost:5183` (da configurare)

---

## 🎨 SCALETTA SVILUPPO FRONTEND

### FASE 1: Setup Iniziale (Priorità: ALTA)
1. **Crea struttura progetto React**
   ```bash
   cd /Users/lucamambelli/Desktop/Cartella-Clinica
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   ```

2. **Installa dipendenze essenziali**
   ```bash
   npm install axios react-router-dom
   npm install @types/react-router-dom -D
   npm install tailwindcss postcss autoprefixer -D
   npm install @heroicons/react
   npm install react-hook-form zod @hookform/resolvers
   npm install date-fns
   npm install recharts
   npm install react-hot-toast
   ```

3. **Configura Tailwind CSS**
   - Inizializza Tailwind
   - Configura tailwind.config.js
   - Aggiorna index.css

4. **Configura Vite**
   - Imposta porta 5183 in vite.config.ts
   - Configura proxy per API backend

5. **Struttura cartelle**
   ```
   frontend/src/
   ├── components/     # Componenti riutilizzabili
   │   ├── common/    # Header, Footer, Layout
   │   ├── forms/     # Form components
   │   └── ui/        # Bottoni, Card, Modal
   ├── pages/         # Pagine dell'app
   ├── services/      # Chiamate API
   ├── hooks/         # Custom hooks
   ├── contexts/      # Context providers
   ├── types/         # TypeScript types
   ├── utils/         # Utility functions
   └── styles/        # CSS aggiuntivi
   ```

### FASE 2: Autenticazione (Priorità: ALTA)
1. **Crea AuthContext**
   - Gestione token JWT
   - Login/Logout
   - Refresh token automatico
   - Persistenza localStorage

2. **Pagina Login**
   - Form con validazione
   - Gestione errori
   - Redirect dopo login

3. **ProtectedRoute Component**
   - Verifica autenticazione
   - Redirect a login se non autenticato

4. **API Service**
   - Axios interceptors per token
   - Gestione refresh token
   - Error handling centralizzato

### FASE 3: Layout e Navigazione (Priorità: ALTA)
1. **Layout Principale**
   - Sidebar navigazione
   - Header con info utente
   - Breadcrumbs
   - Footer

2. **Dashboard**
   - Statistiche principali
   - Grafici riepilogativi
   - Attività recenti
   - Shortcuts principali

3. **React Router Setup**
   - Route configuration
   - Lazy loading pagine
   - 404 page

### FASE 4: Gestione Pazienti (Priorità: ALTA)
1. **Lista Pazienti**
   - Tabella con paginazione
   - Ricerca e filtri
   - Ordinamento colonne
   - Azioni rapide

2. **Dettaglio Paziente**
   - Info anagrafiche
   - Cartelle cliniche associate
   - Timeline attività
   - Documenti

3. **Form Paziente**
   - Creazione nuovo
   - Modifica esistente
   - Validazione campi
   - Upload foto

### FASE 5: Cartelle Cliniche (Priorità: ALTA)
1. **Lista Cartelle**
   - Filtri per stato
   - Ricerca avanzata
   - Export dati

2. **Dettaglio Cartella**
   - Info complete
   - Terapie associate
   - Controlli clinici
   - Relazione dimissione

3. **Gestione Cartella**
   - Apertura/Chiusura
   - Aggiunta terapie
   - Note e osservazioni

### FASE 6: Terapie e Sedute (Priorità: MEDIA)
1. **Gestione Terapie**
   - Lista terapie attive
   - Creazione nuova terapia
   - Parametri dinamici per tipo
   - Tracking progressi

2. **Calendario Sedute**
   - Vista calendario mensile
   - Drag & drop per spostare
   - Filtri per terapista
   - Vista giornaliera

3. **Seduta Terapia**
   - Form compilazione
   - VAS Scale interattive
   - Firma digitale (canvas)
   - Stampa riepilogo

### FASE 7: Componenti Avanzati (Priorità: MEDIA)
1. **Firma Digitale**
   - Canvas HTML5
   - Salvataggio base64
   - Reset e undo

2. **VAS Scale Component**
   - Slider 0-10 interattivo
   - Feedback visivo
   - Confronto pre/post

3. **Grafici Progressi**
   - Line chart evoluzione
   - Bar chart confronti
   - Export immagine

### FASE 8: Features Aggiuntive (Priorità: BASSA)
1. **Notifiche**
   - Toast notifications
   - Badge contatori
   - Centro notifiche

2. **Ricerca Globale**
   - Command palette (Cmd+K)
   - Ricerca fuzzy
   - Risultati categorizzati

3. **Temi e Personalizzazione**
   - Dark mode
   - Dimensione font
   - Colori accent

4. **Export e Report**
   - Export PDF
   - Export Excel
   - Stampa cartella

---

## 💻 COMANDI DA ESEGUIRE

### Per ogni componente/pagina creata:
1. **Crea il file component**
2. **Aggiungi types TypeScript**
3. **Implementa logica**
4. **Aggiungi stili Tailwind**
5. **Testa funzionalità**
6. **Documenta nel README**

### Git workflow per ogni feature:
```bash
git add .
git commit -m "feat(frontend): [descrizione feature]"
git push origin main
```

---

## 📝 DOCUMENTAZIONE DA AGGIORNARE

### Dopo ogni fase completata, aggiorna:

1. **File**: `/Docs/05-Frontend/PROGRESS.md`
   ```markdown
   # Frontend Progress Tracker
   
   ## ✅ Completato
   - [x] Setup iniziale
   - [x] Autenticazione
   - [ ] Dashboard
   ...
   
   ## 📊 Statistiche
   - Componenti creati: X
   - Pagine completate: Y
   - Coverage features: Z%
   ```

2. **File**: `/Docs/05-Frontend/COMPONENTS.md`
   - Lista componenti creati
   - Props e utilizzo
   - Esempi codice

3. **File**: `/Docs/SESSION-REPORT-[DATA].md`
   ```markdown
   # Report Sessione [DATA]
   
   ## Obiettivi Sessione
   - [ ] Task 1
   - [ ] Task 2
   
   ## Lavoro Completato
   - ✅ Descrizione...
   
   ## File Creati/Modificati
   - /frontend/src/...
   
   ## Prossimi Passi
   - ...
   
   ## Note e Issues
   - ...
   ```

---

## 🔍 TESTING E VALIDAZIONE

### Dopo ogni componente:
1. Verifica rendering corretto
2. Test interazioni utente
3. Verifica chiamate API
4. Test responsive design
5. Verifica accessibilità

### Comandi test:
```bash
# Avvia frontend
cd frontend && npm run dev

# Test nel browser
open http://localhost:5183

# Verifica API
curl http://localhost:3100/health
```

---

## 🎯 CRITERI DI SUCCESSO

### Per considerare una fase completa:
- [ ] Tutti i componenti funzionanti
- [ ] Integrazione API completata
- [ ] Responsive design implementato
- [ ] Gestione errori presente
- [ ] Loading states implementati
- [ ] Documentazione aggiornata
- [ ] Commit su GitHub

---

## 🚨 NOTE IMPORTANTI

1. **Backend già operativo** su porta 3100
2. **Credenziali test**:
   - admin@medicinaravenna.it / admin123
   - terapista@medicinaravenna.it / therapist123
3. **Non usare** localStorage/sessionStorage negli artifacts Claude
4. **Sempre aggiornare** documentazione
5. **Test ogni feature** prima di procedere
6. **Commit frequenti** su GitHub

---

## 📊 TRACKING TEMPLATE

Usa questo template per ogni sessione:

```markdown
SESSIONE: [DATA] [ORA]
========================

OBIETTIVO PRINCIPALE:
[ ] Fase X: [Descrizione]

TASKS SPECIFICI:
[ ] Task 1
[ ] Task 2
[ ] Task 3

COMPLETATO:
✅ Task completato 1
✅ Task completato 2

IN PROGRESS:
⏳ Task in corso

BLOCCATO:
❌ Task bloccato (motivo)

FILE CREATI:
- /path/to/file1
- /path/to/file2

PROSSIMA SESSIONE:
- Continuare con...
- Iniziare...

TEMPO STIMATO RIMANENTE:
- Fase corrente: X ore
- Totale progetto: Y ore
```

---

## 🎨 LINEE GUIDA UI/UX

### Colori Brand
- Primary: Blue (#3B82F6)
- Secondary: Indigo (#6366F1)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Font
- Headings: Inter Bold
- Body: Inter Regular
- Monospace: Fira Code

### Spacing
- Usa multipli di 4px (Tailwind: 1 = 4px)
- Container max-width: 1280px
- Padding standard: 16px mobile, 24px desktop

### Componenti
- Bordi arrotondati (rounded-lg)
- Ombre sottili (shadow-sm, shadow-md)
- Transizioni smooth (transition-all duration-200)
- Stati hover evidenti

---

## 🏁 OBIETTIVO FINALE

Creare un'applicazione frontend React moderna, performante e user-friendly che:
1. Si integri perfettamente con il backend esistente
2. Offra un'esperienza utente eccellente
3. Sia facilmente manutenibile e scalabile
4. Rispetti gli standard di accessibilità
5. Funzioni su tutti i dispositivi

---

*Documento creato: 10 Agosto 2025*
*Backend completato: ✅*
*Frontend da sviluppare: ⏳*
