# 📡 API Documentation - Sistema Cartella Clinica

## 🔑 Autenticazione

### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.cartella-clinica.it/v1
```

### Headers Richiesti
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
X-API-Version: 1.0
```

### Autenticazione JWT
```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "mario.rossi",
  "password": "SecurePassword123!",
  "remember_me": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here",
    "user": {
      "id": 1,
      "username": "mario.rossi",
      "nome": "Mario",
      "cognome": "Rossi",
      "ruolo": "fisioterapista",
      "email": "mario.rossi@clinica.it",
      "permissions": ["read:patients", "write:therapies", "read:reports"]
    },
    "expires_in": 3600
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Credenziali non valide"
  }
}
```

## 👥 Endpoints Pazienti

### GET /patients - Lista Pazienti
```http
GET /patients?page=1&limit=20&search=rossi&sort=cognome:asc
```

**Query Parameters:**
- `page` (integer): Numero pagina (default: 1)
- `limit` (integer): Risultati per pagina (default: 20, max: 100)
- `search` (string): Ricerca per nome/cognome/CF
- `sort` (string): Campo:direzione (es. cognome:asc)
- `filter[stato]` (string): Filtra per stato (attivo|archiviato)
- `filter[terapista_id]` (integer): Filtra per terapista

**Response (200):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "numero_cartella": "2024-001",
        "cognome": "Rossi",
        "nome": "Mario",
        "data_nascita": "1980-05-15",
        "codice_fiscale": "RSSMRA80E15H501Z",
        "telefono": "+39 333 1234567",
        "email": "mario.rossi@email.it",
        "ultimo_accesso": "2024-03-15T10:30:00Z",
        "stato": "attivo",
        "cartelle_aperte": 1
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

### GET /patients/{id} - Dettaglio Paziente
```http
GET /patients/123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "numero_cartella": "2024-001",
    "cognome": "Rossi",
    "nome": "Mario",
    "data_nascita": "1980-05-15",
    "luogo_nascita": "Roma",
    "codice_fiscale": "RSSMRA80E15H501Z",
    "sesso": "M",
    "indirizzo": "Via Roma 10",
    "cap": "48121",
    "citta": "Ravenna",
    "provincia": "RA",
    "telefono": "+39 0544 123456",
    "cellulare": "+39 333 1234567",
    "email": "mario.rossi@email.it",
    "gruppo_sanguigno": "A+",
    "peso": 75.5,
    "altezza": 180,
    "bmi": 23.3,
    "medico_curante": {
      "id": 45,
      "nome": "Dr. Giuseppe Verdi"
    },
    "anamnesi": {
      "remota": "Appendicectomia 2010",
      "familiare": "Padre diabetico",
      "allergie": "Nessuna nota"
    },
    "consensi": {
      "privacy": true,
      "privacy_data": "2024-01-15",
      "marketing": false,
      "whatsapp": true
    },
    "cartelle_cliniche": [
      {
        "id": 567,
        "numero": "2024-001-01",
        "data_apertura": "2024-01-15",
        "diagnosi": "Lombalgia acuta",
        "stato": "aperta"
      }
    ]
  }
}
```

### POST /patients - Crea Paziente
```http
POST /patients
```

**Request Body:**
```json
{
  "cognome": "Bianchi",
  "nome": "Laura",
  "data_nascita": "1985-08-20",
  "codice_fiscale": "BNCLRA85M60H501Z",
  "sesso": "F",
  "indirizzo": "Via Garibaldi 25",
  "citta": "Ravenna",
  "telefono": "+39 333 9876543",
  "email": "laura.bianchi@email.it",
  "medico_curante_id": 45,
  "consenso_privacy": true,
  "consenso_whatsapp": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 124,
    "numero_cartella": "2024-124",
    "message": "Paziente creato con successo"
  }
}
```

### PUT /patients/{id} - Aggiorna Paziente
```http
PUT /patients/123
```

**Request Body:**
```json
{
  "peso": 76.0,
  "telefono": "+39 333 1234567",
  "email": "nuovo.email@email.it"
}
```

### DELETE /patients/{id} - Archivia Paziente
```http
DELETE /patients/123
```

## 📋 Endpoints Cartelle Cliniche

### GET /clinical-records - Lista Cartelle
```http
GET /clinical-records?paziente_id=123&stato=aperta
```

### GET /clinical-records/{id} - Dettaglio Cartella
```http
GET /clinical-records/567
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 567,
    "paziente": {
      "id": 123,
      "nome_completo": "Mario Rossi"
    },
    "numero_progressivo": 1,
    "anno": 2024,
    "data_apertura": "2024-01-15",
    "diagnosi_ingresso": "Lombalgia acuta con irradiazione sciatica",
    "codice_icd10": "M54.4",
    "stato": "aperta",
    "medico_responsabile": {
      "id": 12,
      "nome": "Dr. Marco Verdi"
    },
    "anamnesi": {
      "sintomo_principale": "Dolore lombare acuto",
      "data_insorgenza": "2024-01-10",
      "modalita_insorgenza": "Sollevamento peso",
      "evoluzione": "Peggioramento progressivo"
    },
    "valutazioni": [
      {
        "id": 890,
        "tipo": "iniziale",
        "data": "2024-01-15",
        "scala_vas": 8,
        "rom_flessione": 45,
        "test_lasegue": true
      }
    ],
    "terapie": [
      {
        "id": 234,
        "tipo": "Laser Yag",
        "sedute_previste": 10,
        "sedute_effettuate": 3
      }
    ]
  }
}
```

### POST /clinical-records - Crea Cartella
```http
POST /clinical-records
```

**Request Body:**
```json
{
  "paziente_id": 123,
  "diagnosi_ingresso": "Cervicalgia post-traumatica",
  "codice_icd10": "M54.2",
  "medico_responsabile_id": 12,
  "anamnesi": {
    "sintomo_principale": "Dolore cervicale",
    "data_insorgenza": "2024-03-01",
    "modalita_insorgenza": "Incidente stradale"
  }
}
```

## 💊 Endpoints Terapie

### GET /therapies - Lista Terapie
```http
GET /therapies?cartella_id=567&stato=in_corso
```

### GET /therapies/{id} - Dettaglio Terapia
```http
GET /therapies/234
```

### POST /therapies - Crea Terapia
```http
POST /therapies
```

**Request Body:**
```json
{
  "cartella_id": 567,
  "tipo_terapia": "Laser Yag",
  "data_inizio": "2024-03-20",
  "numero_sedute_previste": 10,
  "frequenza": "Bisettimanale",
  "durata_seduta": 30,
  "parametri": {
    "potenza": "3W",
    "dose": "150 J/cm²",
    "modalita": "continuo"
  },
  "descrizione": "Laser terapia zona lombare",
  "terapista_id": 15
}
```

### POST /therapies/{id}/sessions - Registra Seduta
```http
POST /therapies/234/sessions
```

**Request Body:**
```json
{
  "numero_seduta": 4,
  "data_seduta": "2024-03-25T10:00:00Z",
  "durata_effettiva": 35,
  "terapie_eseguite": [
    {
      "tipo": "Laser Yag",
      "parametri": {
        "potenza": "3W",
        "durata": "10min",
        "zona": "L4-L5"
      }
    },
    {
      "tipo": "Massoterapia",
      "durata": "15min"
    }
  ],
  "vas_pre": 7,
  "vas_post": 4,
  "note_seduta": "Paziente riferisce miglioramento",
  "terapista_id": 15
}
```

## 📊 Endpoints Valutazioni

### GET /evaluations - Lista Valutazioni
```http
GET /evaluations?cartella_id=567
```

### POST /evaluations - Crea Valutazione
```http
POST /evaluations
```

**Request Body:**
```json
{
  "cartella_id": 567,
  "tipo": "intermedia",
  "data_valutazione": "2024-03-25",
  "esame_obiettivo": "Riduzione contrattura paravertebrale",
  "rom_flessione": 60,
  "rom_estensione": 20,
  "scala_vas": 5,
  "scala_oswestry": 30,
  "test_lasegue": false,
  "diagnosi_funzionale": "Miglioramento mobilità, persistenza dolore moderato",
  "obiettivi": "Completare recupero ROM, ridurre dolore a VAS 2-3",
  "prognosi": "favorevole",
  "valutatore_id": 15
}
```

## 🗺️ Endpoints Body Mapping

### GET /body-maps/{cartella_id} - Lista Mappe
```http
GET /body-maps/567
```

### POST /body-maps - Crea Mappa
```http
POST /body-maps
```

**Request Body:**
```json
{
  "cartella_id": 567,
  "vista_anteriore": {
    "markers": [
      {
        "x": 250,
        "y": 400,
        "type": "pain",
        "intensity": 7,
        "notes": "Dolore puntorio"
      }
    ]
  },
  "vista_posteriore": {
    "markers": [
      {
        "x": 200,
        "y": 350,
        "type": "trigger_point",
        "notes": "TP attivo"
      }
    ]
  },
  "note_cliniche": "Dolore riferito lungo decorso sciatico"
}
```

## 📄 Endpoints Documenti

### GET /documents - Lista Documenti
```http
GET /documents?paziente_id=123&tipo=referto
```

### POST /documents/upload - Upload Documento
```http
POST /documents/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File binario
- `paziente_id`: 123
- `cartella_id`: 567
- `tipo_documento`: "referto_rx"
- `descrizione`: "RX colonna lombare"

### GET /documents/{id}/download - Download Documento
```http
GET /documents/789/download
```

### POST /documents/{id}/share - Condividi Documento
```http
POST /documents/789/share
```

**Request Body:**
```json
{
  "method": "email",
  "recipient": "paziente@email.it",
  "expiry": "7d",
  "password_protected": true,
  "message": "In allegato il referto richiesto"
}
```

## 📅 Endpoints Appuntamenti

### GET /appointments - Lista Appuntamenti
```http
GET /appointments?date_from=2024-03-25&date_to=2024-03-31&terapista_id=15
```

### POST /appointments - Crea Appuntamento
```http
POST /appointments
```

**Request Body:**
```json
{
  "paziente_id": 123,
  "terapista_id": 15,
  "data_appuntamento": "2024-03-28T15:00:00Z",
  "durata_prevista": 30,
  "tipo_prestazione": "Fisioterapia",
  "note": "Portare referti precedenti",
  "send_reminder": true
}
```

### PUT /appointments/{id}/confirm - Conferma Appuntamento
```http
PUT /appointments/456/confirm
```

## 📧 Endpoints Comunicazioni

### POST /communications/send - Invia Comunicazione
```http
POST /communications/send
```

**Request Body:**
```json
{
  "paziente_id": 123,
  "tipo": "promemoria",
  "canale": "whatsapp",
  "template": "appointment_reminder",
  "data": {
    "appointment_date": "2024-03-28",
    "appointment_time": "15:00",
    "therapist": "Dr. Marco Verdi"
  }
}
```

### GET /communications/history - Storico Comunicazioni
```http
GET /communications/history?paziente_id=123
```

## 📊 Endpoints Report e Statistiche

### GET /reports/patient-summary - Report Paziente
```http
GET /reports/patient-summary/123?from=2024-01-01&to=2024-03-31
```

### GET /reports/clinic-statistics - Statistiche Clinica
```http
GET /reports/clinic-statistics?period=month&year=2024&month=3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2024-03",
    "patients": {
      "total": 150,
      "new": 12,
      "active": 89
    },
    "therapies": {
      "sessions_total": 456,
      "sessions_completed": 412,
      "cancellation_rate": 0.05
    },
    "outcomes": {
      "average_vas_reduction": 4.2,
      "satisfaction_score": 4.6,
      "treatment_success_rate": 0.82
    }
  }
}
```

## 🔐 Endpoints Consensi

### GET /consents/{paziente_id} - Lista Consensi
```http
GET /consents/123
```

### POST /consents - Registra Consenso
```http
POST /consents
```

**Request Body:**
```json
{
  "paziente_id": 123,
  "tipo_consenso": "trattamento_dati",
  "versione_modulo": "2.0",
  "firma_paziente": "base64_signature_data",
  "ip_address": "192.168.1.100"
}
```

## 🤖 Endpoints AI/Suggerimenti

### POST /ai/suggest-diagnosis - Suggerisci Diagnosi
```http
POST /ai/suggest-diagnosis
```

**Request Body:**
```json
{
  "symptoms": ["dolore lombare", "irradiazione gamba dx", "parestesie"],
  "tests": {
    "lasegue": true,
    "wasserman": false
  },
  "patient_age": 45,
  "patient_sex": "M"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "diagnosis": "Ernia discale L5-S1",
        "icd10": "M51.2",
        "confidence": 0.78,
        "recommended_tests": ["RMN lombare", "EMG"],
        "recommended_protocol": "protocol_ernia_discale"
      }
    ]
  }
}
```

## 🔄 WebSocket Events

### Connection
```javascript
const socket = io('https://api.cartella-clinica.it', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Events
```javascript
// Subscribe to patient updates
socket.on('patient:updated', (data) => {
  console.log('Patient updated:', data);
});

// Subscribe to new appointments
socket.on('appointment:new', (data) => {
  console.log('New appointment:', data);
});

// Subscribe to therapy sessions
socket.on('therapy:session:completed', (data) => {
  console.log('Session completed:', data);
});
```

## 🔧 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errore di validazione",
    "details": [
      {
        "field": "email",
        "message": "Email non valida"
      }
    ]
  }
}
```

### Error Codes
- `AUTH_REQUIRED`: Autenticazione richiesta
- `AUTH_FAILED`: Autenticazione fallita
- `TOKEN_EXPIRED`: Token scaduto
- `PERMISSION_DENIED`: Permessi insufficienti
- `NOT_FOUND`: Risorsa non trovata
- `VALIDATION_ERROR`: Errore validazione
- `DUPLICATE_ENTRY`: Voce duplicata
- `RATE_LIMIT`: Rate limit superato
- `SERVER_ERROR`: Errore interno server

## 📈 Rate Limiting

```
Default: 100 requests per minute per IP
Authenticated: 1000 requests per minute per user
Upload: 10 requests per minute per user
```

## 🔍 Filtering & Sorting

### Filter Syntax
```
GET /patients?filter[stato]=attivo&filter[citta]=Ravenna
```

### Sort Syntax
```
GET /patients?sort=cognome:asc,created_at:desc
```

### Search Syntax
```
GET /patients?search=rossi&search_fields=cognome,nome,codice_fiscale
```

## 📃 Pagination

### Offset Pagination
```
GET /patients?page=2&limit=20
```

### Cursor Pagination
```
GET /patients?cursor=eyJpZCI6MTAwfQ&limit=20
```

## 🧪 API Testing

### Postman Collection
Download: https://api.cartella-clinica.it/postman-collection.json

### cURL Examples
```bash
# Login
curl -X POST https://api.cartella-clinica.it/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Get patients
curl -X GET https://api.cartella-clinica.it/v1/patients \
  -H "Authorization: Bearer {token}"

# Create patient
curl -X POST https://api.cartella-clinica.it/v1/patients \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mario","cognome":"Rossi"}'
```

## 📚 SDK

### JavaScript/TypeScript
```javascript
import { CartellaClinicaAPI } from '@cartella-clinica/sdk';

const api = new CartellaClinicaAPI({
  baseURL: 'https://api.cartella-clinica.it/v1',
  token: 'your_token'
});

// Get patients
const patients = await api.patients.list({ page: 1, limit: 20 });

// Create patient
const newPatient = await api.patients.create({
  nome: 'Mario',
  cognome: 'Rossi'
});
```

### Python
```python
from cartella_clinica import API

api = API(
    base_url='https://api.cartella-clinica.it/v1',
    token='your_token'
)

# Get patients
patients = api.patients.list(page=1, limit=20)

# Create patient
new_patient = api.patients.create(
    nome='Mario',
    cognome='Rossi'
)
```
