# Manuale Utente - Sistema Cartella Clinica

## Indice
1. [Introduzione](#introduzione)
2. [Accesso al Sistema](#accesso-al-sistema)
3. [Dashboard](#dashboard)
4. [Gestione Pazienti](#gestione-pazienti)
5. [Cartelle Cliniche](#cartelle-cliniche)
6. [Terapie](#terapie)
7. [Calendario Sedute](#calendario-sedute)
8. [Report PDF](#report-pdf)
9. [Documenti](#documenti)
10. [FAQ](#faq)

---

## 1. Introduzione

Il Sistema Cartella Clinica di Medicina Ravenna è una piattaforma completa per la gestione digitale delle cartelle cliniche, terapie e documentazione medica.

### Requisiti Browser
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi Supportati
- Desktop/Laptop
- Tablet (iPad, Android)
- Smartphone (responsive)

---

## 2. Accesso al Sistema

### Login

1. Apri il browser e vai a: `http://localhost:5183`
2. Inserisci le credenziali:
   - **Email**: admin@medicinaravenna.it
   - **Password**: admin123
3. Click su "Accedi"

### Primo Accesso
Al primo accesso ti verrà richiesto di:
- Cambiare la password
- Configurare le preferenze
- Accettare i termini di utilizzo

### Logout
Click sul tuo nome in alto a destra → "Esci"

---

## 3. Dashboard

La dashboard è la schermata principale che mostra:

### Widget Principali
- **Pazienti Totali**: Numero totale pazienti registrati
- **Cartelle Attive**: Cartelle cliniche aperte
- **Sedute Oggi**: Appuntamenti giornalieri
- **Terapie in Corso**: Terapie attualmente attive

### Grafici
- **Trend Mensile**: Andamento pazienti/terapie
- **Distribuzione Terapie**: Grafico a torta per tipo
- **Calendario Settimanale**: Vista rapida appuntamenti

### Azioni Rapide
- ➕ Nuovo Paziente
- 📋 Nuova Cartella
- 📅 Vai al Calendario
- 📊 Genera Report

---

## 4. Gestione Pazienti

### Lista Pazienti

1. Dal menu laterale, click su **"Pazienti"**
2. Visualizza lista completa con:
   - Nome e Cognome
   - Codice Fiscale
   - Data di Nascita
   - Numero Cartelle
   - Azioni rapide

### Ricerca Paziente

- **Barra di ricerca**: Digita nome, cognome o CF
- **Filtri avanzati**: 
  - Per sesso
  - Per età
  - Per città
  - Con cartelle attive

### Nuovo Paziente

1. Click su **"+ Nuovo Paziente"**
2. Compila i campi obbligatori:
   - Nome e Cognome*
   - Codice Fiscale*
   - Data di Nascita*
   - Sesso*
   - Indirizzo*
   - Città*
3. Campi opzionali:
   - Telefono/Cellulare
   - Email
   - Professione
   - Note
4. Click **"Salva Paziente"**

### Scheda Paziente

Click sul nome del paziente per vedere:
- **Dati Anagrafici**: Info complete
- **Storico Cartelle**: Lista cartelle cliniche
- **Documenti**: Allegati del paziente
- **Azioni**:
  - ✏️ Modifica
  - 📋 Nuova Cartella
  - 📄 Stampa Scheda
  - 🗑️ Elimina

---

## 5. Cartelle Cliniche

### Lista Cartelle

1. Menu → **"Cartelle Cliniche"**
2. Visualizza:
   - Numero Cartella
   - Paziente
   - Diagnosi
   - Data Apertura
   - Stato (Aperta/Chiusa)
   - Medico

### Nuova Cartella Clinica

#### Step 1: Selezione Paziente
1. Click **"+ Nuova Cartella"**
2. Seleziona paziente esistente o creane uno nuovo
3. Click **"Avanti"**

#### Step 2: Diagnosi
1. **Diagnosi Principale*** (obbligatoria)
2. **Dettagli Diagnostici** (opzionale)
3. **ICD-10** (codice diagnosi)
4. Click **"Avanti"**

#### Step 3: Valutazione Clinica
1. **Sintomatologia**: Descrivi sintomi
2. **Esame Obiettivo**: Risultati visita
3. **Esami Strumentali**: RX, RMN, etc.
4. Click **"Avanti"**

#### Step 4: Piano Terapeutico
1. **Data Intervento** (se applicabile)
2. **Medico Responsabile**
3. **Note Iniziali**
4. Click **"Crea Cartella"**

### Dettaglio Cartella

Click sul numero cartella per accedere a 5 tab:

#### Tab Panoramica
- Riepilogo diagnosi
- Info paziente
- Stato cartella
- Azioni rapide

#### Tab Terapie
- Lista terapie prescritte
- Progress bar completamento
- Parametri configurati
- Azioni:
  - ➕ Nuova Terapia
  - 👁️ Dettagli
  - 📅 Sedute

#### Tab Controlli
- Storico controlli clinici
- Note mediche
- Date prossimi controlli
- ➕ Aggiungi Controllo

#### Tab Documenti
- Allegati caricati
- Categorie documenti
- Preview/Download
- ➕ Carica Documento

#### Tab Timeline
- Cronologia eventi
- Chi ha fatto cosa e quando
- Eventi colorati per tipo

### Chiusura Cartella

1. Click **"Chiudi Cartella"** 🔒
2. Inserisci note di chiusura
3. Conferma chiusura
4. La cartella diventa read-only

### Riapertura Cartella

1. Su cartella chiusa, click **"Riapri"** 🔓
2. Inserisci motivazione
3. Conferma riapertura

---

## 6. Terapie

### Tipi di Terapia Disponibili

#### Strumentali
- **Laser YAG**: Potenza, frequenza
- **Tecarterapia**: Capacitiva/resistiva
- **Magnetoterapia**: Gauss, Hz
- **TENS**: Intensità, programma
- **Ultrasuoni**: MHz, potenza

#### Manuali
- **Kinesiterapia**: Esercizi riabilitativi
- **Massoterapia**: Massaggio terapeutico

#### Riabilitazione
- **Idrokinesiterapia**: Terapia in acqua

### Nuova Terapia

1. Da cartella clinica → **"+ Aggiungi Terapia"**
2. **Seleziona Tipo**: Scegli dalla griglia
3. **Configura Parametri**:
   - Numero sedute*
   - Frequenza (es: 3x/settimana)
   - Distretto anatomico
   - Data inizio*
4. **Parametri Specifici** (per tipo):
   - Laser: Potenza (W), Frequenza (Hz)
   - Magneto: Intensità (Gauss)
   - Durata seduta (minuti)
5. **Note** aggiuntive
6. Click **"Crea Terapia"**

### Gestione Sedute

Per ogni terapia puoi:
- Vedere progress completamento
- Pianificare sedute
- Assegnare terapista
- Registrare VAS score
- Completare/Annullare sedute

---

## 7. Calendario Sedute

### Accesso
Menu → **"Calendario"** 📅

### Viste Disponibili
- **Giorno**: Dettaglio orario singolo giorno
- **Settimana**: Vista settimanale (default)
- **Mese**: Panoramica mensile

### Navigazione
- **Frecce** ← → : Naviga avanti/indietro
- **Oggi**: Torna a data corrente
- **Click su seduta**: Apre dettagli

### Filtri Sidebar
- **Per Terapista**: Vedi solo sedute di un terapista
- **Per Stato**: 
  - Programmate (giallo)
  - Completate (verde)
  - Annullate (rosso)
  - No Show (arancione)

### Nuova Seduta
1. Click su slot orario vuoto
2. O click **"+ Nuova Seduta"**
3. Seleziona:
   - Paziente
   - Terapia
   - Data/Ora
   - Durata
   - Terapista
4. **Salva**

### Azioni Rapide su Seduta
Click su seduta → Modal con opzioni:
- ✅ **Completa**: Registra come eseguita
- ✏️ **Modifica**: Cambia orario/terapista
- ❌ **Annulla**: Cancella seduta
- 👁️ **Dettagli**: Vedi info complete

---

## 8. Report PDF

### Centro Report
Menu → **"Report"** 📊

### Tipi di Report

#### 1. Cartella Clinica Completa
- Dati paziente completi
- Diagnosi e valutazione
- Terapie con progress
- Controlli clinici
- **Richiede**: Selezione paziente

#### 2. Report Terapia
- Dettaglio terapia specifica
- Registro sedute
- VAS score progressivo
- Parametri utilizzati
- **Richiede**: Selezione paziente

#### 3. Scheda Paziente
- Anagrafica completa
- Storico cartelle
- Riepilogo terapie
- **Richiede**: Selezione paziente

#### 4. Calendario Settimanale
- Planning sedute settimana
- Vista per terapista
- Orari 8:00-18:00
- **Non richiede** paziente

#### 5. Statistiche Mensili
- KPI del mese
- Grafici performance
- Trend analysis
- **Non richiede** paziente

#### 6. Riepilogo Terapie
- Panoramica terapie attive
- Distribuzione per tipo
- **Non richiede** paziente

### Generazione Report

1. **Seleziona Paziente** (se richiesto)
2. **Scegli Tipo Report** dalla griglia
3. Click **"Genera PDF"** 📥
4. Il file viene scaricato automaticamente

### Storico Report
Sidebar mostra ultimi 5 report generati con:
- Tipo
- Paziente
- Data/ora
- Status ✅

---

## 9. Documenti

### Upload Documenti

#### Accesso
1. Da cartella clinica → Tab **"Documenti"**
2. Click **"Gestisci Documenti"**

#### Metodi Upload
1. **Drag & Drop**: Trascina file nell'area
2. **Click Browse**: Seleziona da computer
3. **Formati supportati**:
   - PDF
   - Immagini (JPG, PNG)
   - Word (DOC, DOCX)
   - Excel (XLS, XLSX)
   - Testo (TXT)
4. **Max 10MB** per file

#### Categorizzazione
Seleziona categoria:
- **Referti**: Referti medici
- **Esami**: RX, RMN, TAC
- **Prescrizioni**: Ricette
- **Report**: Report esterni
- **Immagini**: Foto cliniche
- **Altro**: Varie

#### Procedura Upload
1. Seleziona/trascina file
2. **Categoria*** (auto-detect dal nome)
3. **Descrizione** (opzionale)
4. Click **"Carica"**
5. Progress bar upload
6. ✅ Conferma successo

### Gestione Documenti

#### Filtri
- **Per Categoria**: Click su categoria sidebar
- **Ricerca**: Digita nome file o descrizione
- **Counter**: Numero file per categoria

#### Azioni su Documento
- 👁️ **Anteprima**: Per immagini
- 📥 **Download**: Scarica file
- 🗑️ **Elimina**: Con conferma

#### Statistiche
Sidebar mostra:
- Totale documenti
- Spazio utilizzato (MB)
- Ultimo caricamento

---

## 10. FAQ

### Domande Frequenti

**Q: Come cambio la password?**
A: Menu utente (alto dx) → Impostazioni → Cambio Password

**Q: Posso annullare un'operazione?**
A: La maggior parte delle azioni ha un pulsante "Annulla" o richiede conferma

**Q: Come esporto i dati?**
A: Usa il Centro Report per generare PDF di qualsiasi dato

**Q: Il sistema funziona offline?**
A: Parzialmente - usa dati mock quando non c'è connessione

**Q: Posso usarlo da mobile?**
A: Sì, il sistema è completamente responsive

**Q: Come cerco un paziente velocemente?**
A: Usa la barra di ricerca globale (Ctrl+K)

**Q: Posso recuperare documenti eliminati?**
A: No, l'eliminazione è permanente - fare sempre backup

**Q: Chi può chiudere una cartella?**
A: Solo utenti con ruolo Medico o Admin

**Q: Quanti file posso caricare?**
A: Illimitati, ma max 10MB ciascuno

**Q: I PDF sono modificabili?**
A: No, i report PDF sono read-only per sicurezza

### Shortcuts Tastiera

- **Ctrl+K**: Ricerca globale
- **Ctrl+N**: Nuovo (paziente/cartella)
- **Ctrl+S**: Salva form
- **Esc**: Chiudi modal
- **Alt+P**: Vai a Pazienti
- **Alt+C**: Vai a Cartelle
- **Alt+T**: Vai a Calendario

### Troubleshooting

**Problema: Login non funziona**
- Verifica caps lock
- Controlla credenziali
- Pulisci cache browser

**Problema: Upload fallisce**
- Verifica dimensione < 10MB
- Controlla formato supportato
- Riprova con altro browser

**Problema: PDF non si scarica**
- Abilita popup browser
- Controlla spazio disco
- Prova "Salva con nome"

**Problema: Calendario vuoto**
- Ricarica pagina (F5)
- Verifica filtri attivi
- Controlla date selezionate

### Contatti Supporto

**Supporto Tecnico**
- 📧 support@medicinaravenna.it
- ☎️ 0544-456845
- 🕐 Lun-Ven 9:00-18:00

**Assistenza Urgente**
- 📱 333-1234567 (solo emergenze)

---

## Appendici

### A. Glossario Termini

- **VAS**: Visual Analog Scale (scala dolore 0-10)
- **CF**: Codice Fiscale
- **ICD-10**: Classificazione internazionale malattie
- **CRUD**: Create, Read, Update, Delete
- **PDF**: Portable Document Format
- **JWT**: JSON Web Token (autenticazione)

### B. Ruoli e Permessi

| Ruolo | Permessi |
|-------|----------|
| **Admin** | Accesso completo a tutto |
| **Medico** | Gestione cartelle, terapie, report |
| **Terapista** | Gestione sedute, visualizzazione cartelle |
| **Receptionist** | Gestione pazienti, appuntamenti |

### C. Limiti Sistema

- Max 10MB per file upload
- Max 100 sedute per terapia
- Max 1000 pazienti (versione base)
- Report PDF max 300 pagine
- Sessione timeout: 60 minuti

### D. Backup e Sicurezza

- Backup automatico: Ogni notte 02:00
- Crittografia: AES-256 per dati sensibili
- Password: Min 8 caratteri, 1 maiuscola, 1 numero
- 2FA: Disponibile per admin
- Log: Tutte le azioni tracciate

---

**Versione Manuale**: 1.0
**Data**: Agosto 2025
**© Medicina Ravenna SRL**
