# 📡 API DOCUMENTATION

## Base URL
```
Development: http://localhost:3100/api
Production: https://api.cartella-clinica.com/api
```

## Authentication

### Headers Required
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@medicinaravenna.it",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@medicinaravenna.it",
      "role": "ADMIN",
      "firstName": "Admin",
      "lastName": "User"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

## 👥 Patients API

### Get All Patients
```http
GET /api/patients?page=1&limit=10&search=mario
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by name or fiscal code
- `status` (string): Filter by status (active/inactive)

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "firstName": "Mario",
        "lastName": "Rossi",
        "fiscalCode": "RSSMRA85M01H501Z",
        "birthDate": "1985-08-01",
        "email": "mario.rossi@email.com",
        "mobile": "+39 333 1234567",
        "status": "ACTIVE",
        "_count": {
          "clinicalRecords": 3,
          "appointments": 12
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "totalPages": 15
    }
  }
}
```

### Get Patient by ID
```http
GET /api/patients/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Mario",
    "lastName": "Rossi",
    "fiscalCode": "RSSMRA85M01H501Z",
    "birthDate": "1985-08-01",
    "birthPlace": "Roma",
    "gender": "MALE",
    "address": "Via Roma 1",
    "city": "Ravenna",
    "province": "RA",
    "postalCode": "48121",
    "email": "mario.rossi@email.com",
    "mobile": "+39 333 1234567",
    "phone": "+39 0544 123456",
    "status": "ACTIVE",
    "medicalHistory": "...",
    "allergies": "...",
    "medications": "...",
    "clinicalRecords": [],
    "appointments": []
  }
}
```

### Create Patient
```http
POST /api/patients
```

**Request Body:**
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "fiscalCode": "RSSMRA85M01H501Z",
  "birthDate": "1985-08-01",
  "birthPlace": "Roma",
  "gender": "MALE",
  "address": "Via Roma 1",
  "city": "Ravenna",
  "province": "RA",
  "postalCode": "48121",
  "email": "mario.rossi@email.com",
  "mobile": "+39 333 1234567"
}
```

### Update Patient
```http
PUT /api/patients/:id
```

### Delete Patient
```http
DELETE /api/patients/:id
```

## 📋 Clinical Records API

### Get All Clinical Records
```http
GET /api/clinical-records?page=1&limit=10&status=open
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): open/closed/all
- `patientId` (uuid): Filter by patient

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "uuid",
        "recordNumber": "CR-2025-1001",
        "patientId": "uuid",
        "patient": {
          "firstName": "Mario",
          "lastName": "Rossi"
        },
        "diagnosis": "Lombalgia acuta",
        "anamnesis": "...",
        "symptomatology": "...",
        "status": "OPEN",
        "createdAt": "2025-01-01T10:00:00Z",
        "_count": {
          "therapies": 5,
          "documents": 3
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "totalPages": 5
    }
  }
}
```

### Create Clinical Record
```http
POST /api/clinical-records
```

**Request Body:**
```json
{
  "patientId": "uuid",
  "diagnosis": "Lombalgia acuta",
  "anamnesis": "Paziente riferisce dolore lombare da 2 settimane",
  "symptomatology": "Dolore acuto zona L4-L5",
  "objectiveExamination": "Limitazione funzionale in flessione",
  "instrumentalExaminations": "RX colonna: normale",
  "prescribingDoctor": "Dott. Bianchi",
  "attendingDoctor": "Dott. Rossi"
}
```

## 💊 Therapies API

### Get All Therapies
```http
GET /api/therapies?page=1&limit=12&status=ACTIVE
```

**Response:**
```json
{
  "success": true,
  "data": {
    "therapies": [
      {
        "id": "uuid",
        "patient": {
          "firstName": "Mario",
          "lastName": "Rossi"
        },
        "clinicalRecord": {
          "recordNumber": "CR-2025-1001"
        },
        "therapyType": {
          "name": "Fisioterapia",
          "category": "PHYSICAL"
        },
        "status": "ACTIVE",
        "prescribedSessions": 10,
        "completedSessions": 3,
        "startDate": "2025-01-15",
        "parameters": {
          "district": "Lombare",
          "frequency": "2/settimana"
        }
      }
    ],
    "totalPages": 2
  }
}
```

### Create Therapy
```http
POST /api/therapies
```

**Request Body:**
```json
{
  "clinicalRecordId": "uuid",
  "therapyType": "FISIOTERAPIA",
  "prescribedSessions": 10,
  "startDate": "2025-01-15",
  "frequency": "2/settimana",
  "district": "Lombare",
  "notes": "Iniziare con mobilizzazione dolce",
  "parameters": {
    "tipo": "Manuale",
    "durata": 45,
    "intensita": "Media"
  }
}
```

### Therapy Types Available

| Code | Name | Category |
|------|------|----------|
| LIMFATERAPY | Linfaterapia | PHYSICAL |
| LASER_YAG_145 | Laser YAG 145 | INSTRUMENTAL |
| LASER_810_980 | Laser 810+980 | INSTRUMENTAL |
| LASER_SCAN | Laser Scanner | INSTRUMENTAL |
| MAGNETOTERAPIA | Magnetoterapia | INSTRUMENTAL |
| TENS | TENS | INSTRUMENTAL |
| ULTRASUONI | Ultrasuoni | INSTRUMENTAL |
| ELETTROSTIMOLAZIONE | Elettrostimolazione | INSTRUMENTAL |
| MASSOTERAPIA | Massoterapia | MANUAL |
| MOBILIZZAZIONI | Mobilizzazioni | MANUAL |
| TECARSIN | Tecar Sin | INSTRUMENTAL |
| SIT | SIT | PHARMACOLOGICAL |
| TECALAB | Teca Lab | INSTRUMENTAL |

## 📅 Therapy Sessions API

### Schedule Session
```http
POST /api/therapies/schedule-session
```

**Request Body:**
```json
{
  "therapyId": "uuid",
  "therapistId": "uuid",
  "sessionDate": "2025-01-20T10:00:00Z",
  "duration": 45
}
```

### Update Session Progress
```http
PUT /api/therapies/sessions/:sessionId/progress
```

**Request Body:**
```json
{
  "vasScoreBefore": 7,
  "vasScoreAfter": 4,
  "variations": "Paziente riferisce miglioramento",
  "notes": "Proseguire con stesso protocollo",
  "status": "COMPLETED"
}
```

### Cancel Session
```http
POST /api/therapies/sessions/:sessionId/cancel
```

**Request Body:**
```json
{
  "reason": "Paziente indisposto"
}
```

## 📊 Dashboard API

### Get Dashboard Stats
```http
GET /api/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": {
      "total": 156,
      "new": 12,
      "active": 89
    },
    "appointments": {
      "today": 18,
      "week": 95,
      "completed": 82
    },
    "therapies": {
      "active": 45,
      "completed": 234,
      "completionRate": 87
    },
    "revenue": {
      "month": 15420,
      "growth": 8.5
    }
  }
}
```

### Get Activity Chart Data
```http
GET /api/dashboard/activity?period=week
```

## 📈 Reports API

### Generate Therapy Report
```http
GET /api/therapies/:id/report
```

**Response:** PDF file

### Get VAS Improvement
```http
GET /api/therapies/:id/vas-improvement
```

**Response:**
```json
{
  "success": true,
  "data": {
    "therapyId": "uuid",
    "vasImprovement": 3.5,
    "startScore": 7,
    "currentScore": 3.5,
    "sessions": 10
  }
}
```

## 🔍 Search API

### Global Search
```http
GET /api/search?q=mario&type=all
```

**Query Parameters:**
- `q` (string): Search query
- `type` (string): all/patients/records/therapies

## 📎 Documents API

### Upload Document
```http
POST /api/clinical-records/:recordId/documents
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload
- `type`: Type of document (report/image/prescription)
- `description`: Optional description

### Get Documents
```http
GET /api/clinical-records/:recordId/documents
```

### Download Document
```http
GET /api/documents/:id/download
```

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| DUPLICATE_ENTRY | 409 | Resource already exists |
| SERVER_ERROR | 500 | Internal server error |

## 🔒 Rate Limiting

- **Default**: 100 requests per minute per IP
- **Auth endpoints**: 5 requests per minute per IP
- **File uploads**: 10 requests per minute per user

## 📝 Pagination

All list endpoints support pagination:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🧪 Testing

### Test Endpoints with cURL

```bash
# Login
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"Admin123!"}'

# Get patients with token
curl http://localhost:3100/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman Collection

Import the collection from `/Docs/postman-collection.json`

---
*API Documentation v2.0 - Agosto 2025*
