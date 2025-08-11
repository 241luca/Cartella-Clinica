# 📖 USER MANUAL - Sistema Cartella Clinica

## Indice
1. [Accesso al Sistema](#accesso-al-sistema)
2. [Dashboard](#dashboard)
3. [Gestione Pazienti](#gestione-pazienti)
4. [Cartelle Cliniche](#cartelle-cliniche)
5. [Terapie](#terapie)
6. [Calendario](#calendario)
7. [Report e Analytics](#report-e-analytics)
8. [FAQ](#faq)

---

## 🔐 Accesso al Sistema

### Login
1. Apri il browser e vai all'indirizzo: `http://localhost:5183`
2. Inserisci le tue credenziali:
   - **Email**: La tua email aziendale
   - **Password**: La password fornita dall'amministratore
3. Clicca su **"Accedi"**

### Primo Accesso
Al primo accesso ti verrà richiesto di:
1. Cambiare la password temporanea
2. Completare il tuo profilo
3. Accettare i termini di utilizzo

### Logout
- Clicca sull'icona del profilo in basso a sinistra
- Seleziona **"Esci"**

---

## 📊 Dashboard

La Dashboard è la pagina principale che mostra una panoramica completa della clinica.

### Elementi Principali

#### Stats Cards (In Alto)
- **Pazienti Totali**: Numero totale di pazienti registrati
- **Nuovi Pazienti**: Pazienti aggiunti questo mese
- **Appuntamenti Oggi**: Sedute programmate per oggi
- **Tasso Completamento**: Percentuale terapie completate

#### Grafici Attività
- **Grafico Settimanale**: Mostra l'andamento delle sedute negli ultimi 7 giorni
- **Grafico Mensile**: Confronto mese corrente vs precedente

#### Ultimi Pazienti
Lista dei pazienti aggiunti di recente con:
- Avatar con iniziali
- Nome completo
- Ultima visita
- Azioni rapide (visualizza/modifica)

#### Appuntamenti di Oggi
Calendario giornaliero con:
- Orario
- Nome paziente
- Tipo terapia
- Terapista assegnato

---

## 👥 Gestione Pazienti

### Visualizzare Pazienti
1. Dal menu laterale, clicca su **"Pazienti"**
2. Vedrai la lista completa con:
   - Informazioni anagrafiche
   - Codice fiscale
   - Contatti
   - Stato (Attivo/Inattivo)

### Cercare un Paziente
- Usa la **barra di ricerca** in alto
- Puoi cercare per:
  - Nome e cognome
  - Codice fiscale
  - Email
  - Telefono

### Aggiungere Nuovo Paziente
1. Clicca sul bottone **"+ Nuovo Paziente"** (verde, in alto a destra)
2. Compila il form con:
   - **Dati Anagrafici** (obbligatori)
     - Nome e Cognome
     - Codice Fiscale
     - Data e Luogo di nascita
   - **Contatti**
     - Email
     - Cellulare
     - Telefono fisso
   - **Indirizzo**
     - Via e numero civico
     - CAP, Città, Provincia
   - **Informazioni Mediche** (opzionali)
     - Anamnesi
     - Allergie
     - Farmaci in uso
3. Clicca **"Salva"**

### Modificare Paziente
1. Trova il paziente nella lista
2. Clicca sull'icona **matita** (modifica)
3. Aggiorna i dati necessari
4. Clicca **"Salva Modifiche"**

### Visualizzare Dettagli Paziente
1. Clicca sul nome del paziente
2. Vedrai:
   - Informazioni complete
   - Storia clinica
   - Cartelle cliniche associate
   - Terapie in corso e passate
   - Documenti allegati

---

## 📋 Cartelle Cliniche

### Creare Nuova Cartella
1. Dal menu, vai a **"Cartelle Cliniche"**
2. Clicca **"+ Nuova Cartella"** (bottone verde)
3. Compila:
   - **Paziente**: Seleziona dalla lista
   - **Diagnosi**: Diagnosi principale
   - **Anamnesi**: Storia clinica rilevante
   - **Sintomatologia**: Sintomi presentati
   - **Esame Obiettivo**: Risultati visita
   - **Esami Strumentali**: RX, TAC, etc.
   - **Medico Prescrivente**
   - **Medico Curante**
4. Clicca **"Crea Cartella"**

### Stati Cartella
- **🔓 Aperta**: Cartella attiva, modificabile
- **🔒 Chiusa**: Cartella archiviata, solo lettura

### Gestire Documenti
1. Apri la cartella clinica
2. Vai alla sezione **"Documenti"**
3. Clicca **"+ Carica Documento"**
4. Seleziona il file (PDF, immagini)
5. Aggiungi descrizione (opzionale)
6. Clicca **"Carica"**

---

## 💊 Terapie

### Creare Nuova Terapia
1. Vai a **"Terapie"** dal menu
2. Clicca **"+ Nuova Terapia"** (bottone viola)
3. Seleziona:
   - **Paziente**
   - **Cartella Clinica** associata
   - **Tipo Terapia** (es. Fisioterapia, Laser, etc.)
4. Configura parametri specifici:
   - Numero sedute prescritte
   - Frequenza settimanale
   - Data inizio
   - Distretto corporeo
5. Aggiungi eventuali note
6. Clicca **"Crea Terapia"**

### Tipi di Terapia Disponibili

#### Terapie Fisiche
- **Fisioterapia**: Manuale, mobilizzazioni
- **Massoterapia**: Massaggi terapeutici
- **Mobilizzazioni**: Articolari passive/attive

#### Terapie Strumentali
- **Laser YAG**: Per patologie profonde
- **Laser Scanner**: Trattamenti superficiali
- **Magnetoterapia**: Campi magnetici
- **TENS**: Elettrostimolazione antalgica
- **Ultrasuoni**: Terapia ultrasonica
- **Tecar**: Tecarterapia

#### Altre Terapie
- **Linfodrenaggio**: Drenaggio linfatico
- **SIT**: Terapia infiltrativa
- **Idrokinesiterapia**: Terapia in acqua

### Gestire Sedute
1. Apri la terapia dalla lista
2. Vedrai il calendario sedute
3. Per ogni seduta puoi:
   - **Completare**: Segna come eseguita
   - **Riprogrammare**: Cambia data/ora
   - **Cancellare**: Con motivazione
4. Registra parametri:
   - **VAS Pre**: Dolore prima (0-10)
   - **VAS Post**: Dolore dopo (0-10)
   - **Note**: Osservazioni
   - **Variazioni**: Modifiche al protocollo

### Monitorare Progressi
- La barra di progresso mostra sedute completate/totali
- Il grafico VAS mostra l'andamento del dolore
- Badge colorati indicano lo stato:
  - 🟢 **Verde**: In corso
  - 🔵 **Blu**: Completata
  - 🟡 **Giallo**: Sospesa
  - 🔴 **Rosso**: Annullata

---

## 📅 Calendario

### Visualizzazioni Disponibili
- **Giorno**: Vista dettagliata giornaliera
- **Settimana**: Panoramica settimanale (default)
- **Mese**: Vista mensile completa

### Navigazione
- Usa le **frecce** (◀ ▶) per cambiare periodo
- Clicca **"Oggi"** per tornare alla data corrente
- Seleziona vista con i bottoni in alto a destra

### Gestire Appuntamenti
1. **Creare**: Clicca **"+ Nuovo Appuntamento"**
2. **Modificare**: Clicca sull'appuntamento
3. **Spostare**: Drag & drop su nuovo orario
4. **Cancellare**: Click destro > Cancella

### Filtri
Usa i filtri nella sidebar destra:
- **Per Terapista**: Mostra solo un operatore
- **Per Tipo Terapia**: Filtra per tipologia
- **Per Stato**: Programmati/Completati/Cancellati

### Colori Appuntamenti
- 🔵 **Blu**: Fisioterapia
- 🟢 **Verde**: Laser terapia
- 🟣 **Viola**: Tecar
- 🟡 **Giallo**: Magnetoterapia

---

## 📈 Report e Analytics

### Dashboard Analytics
Mostra metriche chiave della clinica:

#### KPI Cards
- **Fatturato Totale**: Revenue del periodo
- **Pazienti Totali**: Attivi nel periodo
- **Sedute Totali**: Numero terapie erogate
- **Tasso Completamento**: % terapie completate

#### Grafici
- **Andamento Fatturato**: Bar chart mensile
- **Tipologie Terapie**: Pie chart distribuzione
- **Età Pazienti**: Distribuzione demografica
- **Top Terapisti**: Performance operatori

### Generare Report

#### Report Paziente
1. Vai al profilo paziente
2. Clicca **"Genera Report"**
3. Seleziona:
   - Periodo temporale
   - Tipo report (Clinico/Amministrativo)
   - Formato (PDF/Excel)
4. Clicca **"Genera"**

#### Report Terapia
1. Apri la terapia
2. Clicca **"Report Terapia"**
3. Il report includerà:
   - Dati paziente
   - Diagnosi e anamnesi
   - Sedute effettuate
   - Progressi VAS
   - Note terapisti

### Export Dati
Puoi esportare in:
- **PDF**: Per stampa e archiviazione
- **Excel**: Per analisi avanzate
- **CSV**: Per importazione altri sistemi

---

## ❓ FAQ

### Come recupero la password?
1. Nella pagina login, clicca "Password dimenticata"
2. Inserisci la tua email
3. Riceverai istruzioni per il reset

### Posso cancellare un paziente?
Solo gli amministratori possono cancellare pazienti. La cancellazione è soft-delete (il dato rimane nel database ma non è più visibile).

### Come modifico una seduta già completata?
Le sedute completate possono essere modificate solo da utenti con ruolo Admin o Doctor entro 48 ore.

### Posso allegare più documenti?
Sì, non c'è limite al numero di documenti. Formati supportati: PDF, JPG, PNG, DOCX.

### Come esporto i dati per il commercialista?
Vai in Report > Amministrativi > Seleziona periodo > Esporta Excel

### Il sistema funziona offline?
No, è necessaria connessione internet per accedere al sistema.

### Posso accedere da mobile?
Sì, il sistema è responsive ma alcune funzionalità sono ottimizzate per desktop.

### Come contatto il supporto?
- Email: support@medicinaravenna.it
- Telefono: 0544-456845
- In-app: Icona "?" in basso a destra

---

## 🎯 Shortcuts Tastiera

| Comando | Windows | Mac | Azione |
|---------|---------|-----|--------|
| Nuovo Paziente | Ctrl+N | ⌘+N | Crea nuovo paziente |
| Ricerca | Ctrl+K | ⌘+K | Focus su ricerca |
| Salva | Ctrl+S | ⌘+S | Salva modifiche |
| Calendario | Ctrl+Shift+C | ⌘+Shift+C | Vai al calendario |
| Dashboard | Ctrl+D | ⌘+D | Torna alla dashboard |
| Logout | Ctrl+Shift+L | ⌘+Shift+L | Esci dal sistema |

---

## 📱 App Mobile (Coming Soon)

Stiamo sviluppando l'app mobile per:
- iOS (iPhone/iPad)
- Android

Funzionalità previste:
- Visualizzazione appuntamenti
- Consultazione cartelle
- Notifiche push
- Firma digitale documenti

---

*Manuale Utente v2.0 - Agosto 2025*
*Per assistenza: lucamambelli@lmtecnologie.it*
