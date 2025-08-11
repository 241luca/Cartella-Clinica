# Database Schema - Sistema Cartella Clinica

## 1. Schema PostgreSQL - Dati Strutturati

### 1.1 Tabelle Principali

```sql
-- =============================================
-- TABELLA PAZIENTI
-- =============================================
CREATE TABLE pazienti (
    id SERIAL PRIMARY KEY,
    numero_cartella VARCHAR(20) UNIQUE NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascita DATE NOT NULL,
    luogo_nascita VARCHAR(100),
    codice_fiscale VARCHAR(16) UNIQUE,
    sesso CHAR(1) CHECK (sesso IN ('M', 'F', 'A')),
    
    -- Contatti
    indirizzo VARCHAR(200),
    cap VARCHAR(5),
    citta VARCHAR(100),
    provincia VARCHAR(2),
    telefono VARCHAR(20),
    cellulare VARCHAR(20),
    email VARCHAR(100),
    pec VARCHAR(100),
    
    -- Dati clinici
    gruppo_sanguigno VARCHAR(5),
    peso DECIMAL(5,2),
    altezza INTEGER,
    bmi DECIMAL(4,2),
    
    -- Riferimenti
    medico_curante_id INTEGER REFERENCES medici(id),
    medico_prescrivente_id INTEGER REFERENCES medici(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES utenti(id),
    updated_by INTEGER REFERENCES utenti(id),
    stato ENUM('attivo', 'archiviato', 'deceduto') DEFAULT 'attivo',
    
    -- Privacy
    consenso_privacy BOOLEAN DEFAULT FALSE,
    consenso_privacy_data TIMESTAMP,
    consenso_marketing BOOLEAN DEFAULT FALSE,
    consenso_whatsapp BOOLEAN DEFAULT FALSE,
    
    -- Indici
    INDEX idx_cognome (cognome),
    INDEX idx_codice_fiscale (codice_fiscale),
    INDEX idx_numero_cartella (numero_cartella)
);

-- =============================================
-- TABELLA CARTELLE CLINICHE
-- =============================================
CREATE TABLE cartelle_cliniche (
    id SERIAL PRIMARY KEY,
    paziente_id INTEGER NOT NULL REFERENCES pazienti(id),
    numero_progressivo INTEGER NOT NULL,
    anno INTEGER NOT NULL,
    
    -- Date
    data_apertura DATE NOT NULL,
    data_chiusura DATE,
    data_ultimo_accesso TIMESTAMP,
    
    -- Diagnosi
    diagnosi_ingresso TEXT,
    diagnosi_dimissione TEXT,
    codice_icd10 VARCHAR(10),
    
    -- Stato
    stato ENUM('aperta', 'chiusa', 'sospesa') DEFAULT 'aperta',
    motivo_chiusura TEXT,
    
    -- Responsabili
    medico_responsabile_id INTEGER REFERENCES utenti(id),
    fisioterapista_principale_id INTEGER REFERENCES utenti(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_cartella (paziente_id, numero_progressivo, anno),
    INDEX idx_stato (stato),
    INDEX idx_data_apertura (data_apertura)
);

-- =============================================
-- TABELLA ANAMNESI
-- =============================================
CREATE TABLE anamnesi (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    tipo ENUM('remota', 'prossima', 'familiare', 'fisiologica', 'farmacologica') NOT NULL,
    
    -- Anamnesi remota
    malattie_infettive TEXT,
    interventi_chirurgici TEXT,
    traumi_pregressi TEXT,
    allergie TEXT,
    
    -- Anamnesi prossima
    sintomo_principale TEXT,
    data_insorgenza DATE,
    modalita_insorgenza TEXT,
    evoluzione TEXT,
    terapie_precedenti TEXT,
    
    -- Anamnesi familiare
    patologie_ereditarie TEXT,
    malattie_familiari TEXT,
    
    -- Anamnesi fisiologica
    stile_vita TEXT,
    attivita_fisica TEXT,
    alimentazione TEXT,
    fumo BOOLEAN,
    alcol BOOLEAN,
    
    -- Anamnesi farmacologica
    farmaci_attuali TEXT,
    integratori TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES utenti(id)
);

-- =============================================
-- TABELLA PARAMETRI VITALI
-- =============================================
CREATE TABLE parametri_vitali (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    data_rilevazione TIMESTAMP NOT NULL,
    
    -- Parametri
    temperatura DECIMAL(3,1),
    pressione_sistolica INTEGER,
    pressione_diastolica INTEGER,
    frequenza_cardiaca INTEGER,
    frequenza_respiratoria INTEGER,
    saturazione INTEGER,
    dolore_vas INTEGER CHECK (dolore_vas >= 0 AND dolore_vas <= 10),
    
    -- Antropometrici
    peso DECIMAL(5,2),
    altezza INTEGER,
    bmi DECIMAL(4,2),
    circonferenza_vita INTEGER,
    
    -- Note
    note TEXT,
    
    -- Metadata
    rilevato_da INTEGER REFERENCES utenti(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_data_rilevazione (data_rilevazione),
    INDEX idx_cartella_data (cartella_id, data_rilevazione)
);

-- =============================================
-- TABELLA VALUTAZIONI
-- =============================================
CREATE TABLE valutazioni (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    tipo ENUM('iniziale', 'intermedia', 'finale') NOT NULL,
    data_valutazione DATE NOT NULL,
    
    -- Valutazione oggettiva
    esame_obiettivo TEXT,
    cute_integrita BOOLEAN,
    cute_note TEXT,
    
    -- Valutazione funzionale
    rom_flessione INTEGER,
    rom_estensione INTEGER,
    rom_abduzione INTEGER,
    rom_adduzione INTEGER,
    rom_rotazione_int INTEGER,
    rom_rotazione_est INTEGER,
    
    -- Scale valutative
    scala_vas INTEGER CHECK (scala_vas >= 0 AND scala_vas <= 10),
    scala_oswestry INTEGER,
    scala_roland_morris INTEGER,
    scala_dash INTEGER,
    scala_koos INTEGER,
    
    -- Test specifici
    test_lasegue BOOLEAN,
    test_thomas BOOLEAN,
    test_neer BOOLEAN,
    test_jobe BOOLEAN,
    altri_test TEXT,
    
    -- Conclusioni
    diagnosi_funzionale TEXT,
    obiettivi TEXT,
    prognosi ENUM('favorevole', 'riservata', 'sfavorevole'),
    
    -- Metadata
    valutatore_id INTEGER REFERENCES utenti(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELLA TERAPIE
-- =============================================
CREATE TABLE terapie (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    tipo_terapia VARCHAR(100) NOT NULL,
    data_inizio DATE NOT NULL,
    data_fine DATE,
    numero_sedute_previste INTEGER,
    numero_sedute_effettuate INTEGER DEFAULT 0,
    frequenza VARCHAR(50),
    durata_seduta INTEGER, -- in minuti
    
    -- Dettagli terapia
    descrizione TEXT,
    parametri JSON, -- parametri specifici per tipo terapia
    controindicazioni TEXT,
    precauzioni TEXT,
    
    -- Stato
    stato ENUM('programmata', 'in_corso', 'completata', 'sospesa', 'annullata') DEFAULT 'programmata',
    motivo_sospensione TEXT,
    
    -- Responsabile
    terapista_id INTEGER REFERENCES utenti(id),
    prescrittore_id INTEGER REFERENCES utenti(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_stato_terapia (stato),
    INDEX idx_data_inizio (data_inizio)
);

-- =============================================
-- TABELLA SEDUTE TERAPIA
-- =============================================
CREATE TABLE sedute_terapia (
    id SERIAL PRIMARY KEY,
    terapia_id INTEGER NOT NULL REFERENCES terapie(id),
    numero_seduta INTEGER NOT NULL,
    data_seduta TIMESTAMP NOT NULL,
    durata_effettiva INTEGER, -- in minuti
    
    -- Dettagli seduta
    terapie_eseguite JSON,
    note_seduta TEXT,
    reazioni_avverse TEXT,
    
    -- Valutazioni pre/post
    vas_pre INTEGER CHECK (vas_pre >= 0 AND vas_pre <= 10),
    vas_post INTEGER CHECK (vas_post >= 0 AND vas_post <= 10),
    
    -- Stato
    stato ENUM('programmata', 'completata', 'annullata', 'riprogrammata') DEFAULT 'programmata',
    motivo_annullamento TEXT,
    
    -- Firma
    terapista_id INTEGER REFERENCES utenti(id),
    firma_digitale TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_seduta (terapia_id, numero_seduta),
    INDEX idx_data_seduta (data_seduta)
);

-- =============================================
-- TABELLA REFERTI
-- =============================================
CREATE TABLE referti (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    tipo_referto VARCHAR(50) NOT NULL,
    data_referto DATE NOT NULL,
    
    -- Contenuto
    anamnesi_funzionale TEXT,
    esame_obiettivo TEXT,
    test_valutativi TEXT,
    diagnosi_fisioterapica TEXT,
    piano_trattamento TEXT,
    prognosi TEXT,
    raccomandazioni TEXT,
    
    -- Allegati
    allegati JSON,
    
    -- Stato e firma
    stato ENUM('bozza', 'definitivo', 'modificato', 'annullato') DEFAULT 'bozza',
    redattore_id INTEGER REFERENCES utenti(id),
    validatore_id INTEGER REFERENCES utenti(id),
    data_validazione TIMESTAMP,
    firma_digitale TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo_referto (tipo_referto),
    INDEX idx_data_referto (data_referto)
);

-- =============================================
-- TABELLA BODY MAPPING
-- =============================================
CREATE TABLE body_maps (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER NOT NULL REFERENCES cartelle_cliniche(id),
    sessione_id INTEGER REFERENCES sedute_terapia(id),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Viste
    vista_anteriore JSON,
    vista_posteriore JSON,
    vista_laterale_dx JSON,
    vista_laterale_sx JSON,
    
    -- Marcatori
    marcatori JSON,
    
    -- Note
    note_cliniche TEXT,
    
    -- Metadata
    creato_da INTEGER REFERENCES utenti(id),
    modificato_da INTEGER REFERENCES utenti(id),
    modificato_il TIMESTAMP
);

-- =============================================
-- TABELLA CONSENSI
-- =============================================
CREATE TABLE consensi (
    id SERIAL PRIMARY KEY,
    paziente_id INTEGER NOT NULL REFERENCES pazienti(id),
    tipo_consenso VARCHAR(50) NOT NULL,
    versione_modulo VARCHAR(10) NOT NULL,
    
    -- Dettagli consenso
    testo_consenso TEXT,
    data_consenso TIMESTAMP NOT NULL,
    data_revoca TIMESTAMP,
    
    -- Firma
    firma_paziente TEXT,
    firma_digitale_paziente TEXT,
    firma_medico TEXT,
    firma_digitale_medico TEXT,
    
    -- Stato
    stato ENUM('attivo', 'revocato', 'scaduto', 'sostituito') DEFAULT 'attivo',
    consenso_sostituito_da INTEGER REFERENCES consensi(id),
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    operatore_id INTEGER REFERENCES utenti(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_paziente_tipo (paziente_id, tipo_consenso),
    INDEX idx_stato_consenso (stato)
);

-- =============================================
-- TABELLA DOCUMENTI
-- =============================================
CREATE TABLE documenti (
    id SERIAL PRIMARY KEY,
    cartella_id INTEGER REFERENCES cartelle_cliniche(id),
    paziente_id INTEGER NOT NULL REFERENCES pazienti(id),
    
    -- Dettagli documento
    tipo_documento VARCHAR(50) NOT NULL,
    nome_file VARCHAR(255) NOT NULL,
    percorso_file TEXT NOT NULL,
    dimensione_file INTEGER,
    mime_type VARCHAR(100),
    
    -- Metadata
    descrizione TEXT,
    data_documento DATE,
    
    -- Sicurezza
    criptato BOOLEAN DEFAULT FALSE,
    hash_file VARCHAR(64),
    
    -- Stato
    stato ENUM('attivo', 'archiviato', 'eliminato') DEFAULT 'attivo',
    
    caricato_da INTEGER REFERENCES utenti(id),
    caricato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo_documento (tipo_documento),
    INDEX idx_paziente_documenti (paziente_id)
);

-- =============================================
-- TABELLA UTENTI (Operatori)
-- =============================================
CREATE TABLE utenti (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Dati personali
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    codice_fiscale VARCHAR(16),
    
    -- Ruolo e permessi
    ruolo ENUM('admin', 'medico', 'fisioterapista', 'infermiere', 'segreteria', 'ospite') NOT NULL,
    permessi JSON,
    
    -- Professionale
    numero_albo VARCHAR(50),
    specializzazione VARCHAR(100),
    firma_digitale TEXT,
    
    -- Stato
    attivo BOOLEAN DEFAULT TRUE,
    data_ultimo_accesso TIMESTAMP,
    tentativi_falliti INTEGER DEFAULT 0,
    bloccato_fino TIMESTAMP,
    
    -- 2FA
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ruolo (ruolo),
    INDEX idx_attivo (attivo)
);

-- =============================================
-- TABELLA APPUNTAMENTI
-- =============================================
CREATE TABLE appuntamenti (
    id SERIAL PRIMARY KEY,
    paziente_id INTEGER NOT NULL REFERENCES pazienti(id),
    terapista_id INTEGER REFERENCES utenti(id),
    seduta_id INTEGER REFERENCES sedute_terapia(id),
    
    -- Timing
    data_appuntamento TIMESTAMP NOT NULL,
    durata_prevista INTEGER DEFAULT 30, -- minuti
    
    -- Dettagli
    tipo_prestazione VARCHAR(100),
    note TEXT,
    
    -- Stato
    stato ENUM('confermato', 'da_confermare', 'annullato', 'completato', 'no_show') DEFAULT 'da_confermare',
    
    -- Notifiche
    promemoria_inviato BOOLEAN DEFAULT FALSE,
    conferma_ricevuta BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_data_appuntamento (data_appuntamento),
    INDEX idx_paziente_data (paziente_id, data_appuntamento),
    INDEX idx_terapista_data (terapista_id, data_appuntamento)
);

-- =============================================
-- TABELLA COMUNICAZIONI
-- =============================================
CREATE TABLE comunicazioni (
    id SERIAL PRIMARY KEY,
    paziente_id INTEGER REFERENCES pazienti(id),
    
    -- Tipo e canale
    tipo ENUM('promemoria', 'referto', 'comunicazione', 'feedback') NOT NULL,
    canale ENUM('email', 'sms', 'whatsapp', 'notifica_app') NOT NULL,
    
    -- Contenuto
    destinatario VARCHAR(255) NOT NULL,
    oggetto VARCHAR(255),
    contenuto TEXT,
    allegati JSON,
    
    -- Stato invio
    stato ENUM('in_coda', 'inviato', 'consegnato', 'letto', 'fallito') DEFAULT 'in_coda',
    tentativi INTEGER DEFAULT 0,
    data_invio TIMESTAMP,
    data_consegna TIMESTAMP,
    data_lettura TIMESTAMP,
    errore TEXT,
    
    -- Metadata
    inviato_da INTEGER REFERENCES utenti(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_stato_comunicazione (stato),
    INDEX idx_paziente_comunicazioni (paziente_id)
);

-- =============================================
-- TABELLA AUDIT LOG
-- =============================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    utente_id INTEGER REFERENCES utenti(id),
    azione VARCHAR(100) NOT NULL,
    tabella VARCHAR(50),
    record_id INTEGER,
    
    -- Dettagli
    dati_precedenti JSON,
    dati_nuovi JSON,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_utente_audit (utente_id),
    INDEX idx_azione_audit (azione),
    INDEX idx_timestamp_audit (timestamp)
);
