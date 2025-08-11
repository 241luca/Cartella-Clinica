# Documentazione API - Sistema Cartella Clinica

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.medicinaravenna.it
```

## Autenticazione

Tutte le API richiedono autenticazione JWT tranne `/auth/login`.

### Headers Richiesti
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### 🔐 Autenticazione

#### POST `/auth/login`
Login utente e generazione token.

**Request:**
```json
{
  "email": "admin@medicinaravenna.it",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-1",
      "email": "admin@medicinaravenna.it",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

#### POST `/auth/refresh`
Refresh del token JWT.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/auth/logout`
Logout e invalidazione token.

---

### 👥 Pazienti

#### GET `/patients`
Lista pazienti con paginazione e filtri.

**Query Parameters:**
- `page` (number): Pagina corrente (default: 1)
- `limit` (number): Risultati per pagina (default: 10)
- `search` (string): Ricerca per nome/cognome/CF
- `sortBy` (string): Campo ordinamento
- `sortOrder` (string): asc/desc

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "patient-1",
        "firstName": "Mario",
        "lastName": "Rossi",
        "fiscalCode": "RSSMRA85M01H501Z",
        "birthDate": "1985-08-01",
        "gender": "MALE",
        "address": "Via Roma 123",
        "city": "Ravenna",
        "_count": {
          "clinicalRecords": 2
        }
      }
    ],
    "total": 20,
    "page": 1,
    "totalPages": 2
  }
}
```

#### GET `/patients/:id`
Dettaglio singolo paziente.

#### POST `/patients`
Crea nuovo paziente.

**Request:**
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "fiscalCode": "RSSMRA85M01H501Z",
  "birthDate": "1985-08-01",
  "gender": "MALE",
  "address": "Via Roma 123",
  "city": "Ravenna",
  "phone": "0544123456",
  "mobile": "3331234567",
  "email": "mario.rossi@email.it"
}
```

#### PUT `/patients/:id`
Aggiorna paziente esistente.

#### DELETE `/patients/:id`
Elimina paziente (soft delete).

---

### 📋 Cartelle Cliniche

#### GET `/clinical-records`
Lista cartelle cliniche.

**Query Parameters:**
- `patientId` (string): Filtra per paziente
- `status` (string): active/closed
- `search` (string): Ricerca diagnosi

#### GET `/clinical-records/:id`
Dettaglio cartella con terapie e controlli.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "record-1",
    "recordNumber": "MR-2025-1001",
    "patientId": "patient-1",
    "acceptanceDate": "2025-07-01T10:00:00Z",
    "diagnosis": "Lombalgia acuta",
    "symptomatology": "Dolore VAS 7/10",
    "isActive": true,
    "patient": {
      "firstName": "Mario",
      "lastName": "Rossi"
    },
    "therapies": [...],
    "clinicalControls": [...],
    "documents": [...]
  }
}
```

#### POST `/clinical-records`
Crea nuova cartella clinica.

**Request:**
```json
{
  "patientId": "patient-1",
  "diagnosis": "Lombalgia acuta",
  "diagnosticDetails": "Dolore lombare con irradiazione",
  "symptomatology": "VAS 7/10",
  "objectiveExamination": "Lasègue positivo",
  "instrumentalExams": "RMN lombo-sacrale"
}
```

#### PUT `/clinical-records/:id`
Aggiorna cartella clinica.

#### POST `/clinical-records/:id/close`
Chiude cartella clinica.

**Request:**
```json
{
  "closureNotes": "Paziente guarito, terapia conclusa con successo"
}
```

#### POST `/clinical-records/:id/reopen`
Riapre cartella chiusa.

---

### 💊 Terapie

#### GET `/therapies`
Lista terapie con filtri.

**Query Parameters:**
- `clinicalRecordId` (string): Per cartella
- `patientId` (string): Per paziente
- `status` (string): SCHEDULED/IN_PROGRESS/COMPLETED
- `therapistId` (string): Per terapista

#### GET `/therapies/:id`
Dettaglio terapia con sedute.

#### POST `/therapies`
Crea nuova terapia.

**Request:**
```json
{
  "clinicalRecordId": "record-1",
  "therapyTypeId": "type-1",
  "prescribedSessions": 10,
  "frequency": "3x/settimana",
  "district": "Lombare",
  "startDate": "2025-08-01T10:00:00Z",
  "parameters": {
    "intensity": 50,
    "duration": 30,
    "power": 10
  }
}
```

#### PUT `/therapies/:id`
Aggiorna terapia.

#### PATCH `/therapies/:id/status`
Aggiorna stato terapia.

**Request:**
```json
{
  "status": "COMPLETED",
  "notes": "Terapia conclusa con successo"
}
```

---

### 📅 Sedute Terapia

#### GET `/therapy-sessions`
Lista sedute con calendario.

**Query Parameters:**
- `startDate` (date): Data inizio range
- `endDate` (date): Data fine range
- `therapistId` (string): Per terapista
- `status` (string): SCHEDULED/COMPLETED/CANCELLED

#### GET `/therapy-sessions/:id`
Dettaglio singola seduta.

#### POST `/therapy-sessions`
Crea nuova seduta.

**Request:**
```json
{
  "therapyId": "therapy-1",
  "therapistId": "user-2",
  "sessionDate": "2025-08-15T10:00:00Z",
  "duration": 30
}
```

#### POST `/therapy-sessions/:id/complete`
Completa seduta con VAS score.

**Request:**
```json
{
  "vasScoreBefore": 7,
  "vasScoreAfter": 4,
  "notes": "Paziente risponde bene",
  "executedParameters": {
    "actualDuration": 35,
    "actualIntensity": 60
  }
}
```

#### POST `/therapy-sessions/:id/cancel`
Annulla seduta.

**Request:**
```json
{
  "reason": "Paziente assente"
}
```

---

### 📎 Documenti

#### GET `/documents`
Lista documenti allegati.

**Query Parameters:**
- `clinicalRecordId` (string): Per cartella
- `patientId` (string): Per paziente
- `category` (string): REFERRAL/EXAM/PRESCRIPTION

#### GET `/documents/:id`
Dettaglio documento.

#### POST `/documents/upload`
Upload nuovo documento (multipart/form-data).

**Form Data:**
- `file` (File): File da caricare
- `clinicalRecordId` (string): ID cartella
- `category` (string): Categoria documento
- `description` (string): Descrizione opzionale

#### GET `/documents/:id/download`
Download file documento.

**Response:** Binary file stream

#### DELETE `/documents/:id`
Elimina documento.

---

### 📊 Statistiche

#### GET `/statistics/dashboard`
Statistiche dashboard principale.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPatients": 150,
    "activeRecords": 23,
    "scheduledSessions": 45,
    "completedToday": 12,
    "monthlyTrend": [...],
    "therapyDistribution": [...]
  }
}
```

#### GET `/statistics/patients`
Statistiche pazienti.

#### GET `/statistics/therapies`
Statistiche terapie.

---

### 👤 Utenti

#### GET `/users`
Lista utenti sistema.

**Query Parameters:**
- `role` (string): ADMIN/DOCTOR/THERAPIST/RECEPTIONIST

#### GET `/users/:id`
Dettaglio utente.

#### POST `/users`
Crea nuovo utente.

**Request:**
```json
{
  "email": "nuovo@medicinaravenna.it",
  "password": "password123",
  "firstName": "Nome",
  "lastName": "Cognome",
  "role": "THERAPIST"
}
```

#### PUT `/users/:id`
Aggiorna utente.

#### POST `/users/:id/change-password`
Cambia password utente.

---

### 🏥 Tipi Terapia

#### GET `/therapy-types`
Lista tipi di terapia disponibili.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "type-1",
      "code": "LASER_YAG",
      "name": "Laser YAG 1064",
      "category": "INSTRUMENTAL",
      "description": "Laserterapia ad alta potenza",
      "defaultDuration": 20,
      "defaultSessions": 10,
      "isActive": true
    }
  ]
}
```

#### POST `/therapy-types`
Crea nuovo tipo terapia.

#### PUT `/therapy-types/:id`
Aggiorna tipo terapia.

---

## Status Codes

| Code | Descrizione |
|------|-------------|
| 200 | OK - Richiesta completata |
| 201 | Created - Risorsa creata |
| 400 | Bad Request - Parametri non validi |
| 401 | Unauthorized - Token mancante/invalido |
| 403 | Forbidden - Permessi insufficienti |
| 404 | Not Found - Risorsa non trovata |
| 409 | Conflict - Conflitto (es. email duplicata) |
| 422 | Unprocessable Entity - Validazione fallita |
| 500 | Server Error - Errore interno |

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email non valida"
      }
    ]
  }
}
```

## Rate Limiting

- **Default**: 100 richieste per minuto per IP
- **Upload**: 10 file per minuto per utente
- **Report**: 20 generazioni PDF per ora

## Paginazione

Tutti gli endpoint che ritornano liste supportano paginazione:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtri e Ordinamento

### Filtri
Usa query parameters per filtrare:
```
GET /patients?gender=MALE&city=Ravenna
```

### Ordinamento
Usa `sortBy` e `sortOrder`:
```
GET /patients?sortBy=lastName&sortOrder=asc
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'jwt-token' }
});
```

### Events
- `therapy:updated` - Terapia aggiornata
- `session:completed` - Seduta completata
- `document:uploaded` - Documento caricato
- `notification:new` - Nuova notifica

## Testing

### Postman Collection
Importa `postman-collection.json` dalla cartella `/Docs`.

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}'

# Get Patients
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer <token>"

# Create Patient
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","fiscalCode":"TSTUSR90A01H501Z"}'
```

## Versioning

L'API usa versioning nell'URL:
- v1: `/api/v1/...` (current)
- v2: `/api/v2/...` (future)

## Changelog

### v1.0.0 (Agosto 2025)
- Initial release
- Tutti gli endpoint base
- Autenticazione JWT
- Upload documenti
- Generazione report

---

**Ultimo aggiornamento**: Agosto 2025
**Versione API**: 1.0.0
