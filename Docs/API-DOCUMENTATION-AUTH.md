# 📚 API DOCUMENTATION - CARTELLA CLINICA

## Base URL
```
http://localhost:3100/api
```

---

## 🔐 **AUTENTICAZIONE JWT**

### Come funziona
1. **Login**: Invia credenziali a `/api/auth/login`
2. **Ricevi Token**: Ottieni `accessToken` e `refreshToken`
3. **Usa Token**: Includi in ogni richiesta: `Authorization: Bearer <accessToken>`
4. **Refresh**: Quando scade, usa `/api/auth/refresh` con il `refreshToken`

### Endpoints Autenticazione

#### POST /api/auth/login
**Pubblico** - Login utente
```bash
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicinaravenna.it",
    "password": "admin123"
  }'
```

**Risposta:**
```json
{
  "success": true,
  "message": "Login effettuato con successo",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@medicinaravenna.it",
      "username": "admin",
      "firstName": "Admin",
      "lastName": "Sistema",
      "role": "ADMIN",
      "phone": "0544456845"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h"
  }
}
```

#### POST /api/auth/refresh
**Pubblico** - Rinnova access token
```bash
curl -X POST http://localhost:3100/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

#### GET /api/auth/me
**Protetto** - Profilo utente corrente
```bash
curl -X GET http://localhost:3100/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

#### PUT /api/auth/me
**Protetto** - Aggiorna profilo
```bash
curl -X PUT http://localhost:3100/api/auth/me \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mario",
    "lastName": "Rossi",
    "phone": "3331234567"
  }'
```

#### POST /api/auth/change-password
**Protetto** - Cambia password
```bash
curl -X POST http://localhost:3100/api/auth/change-password \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "nuovaPassword123"
  }'
```

#### POST /api/auth/register
**Protetto (solo ADMIN)** - Registra nuovo utente
```bash
curl -X POST http://localhost:3100/api/auth/register \
  -H "Authorization: Bearer <adminToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuovo@medicinaravenna.it",
    "username": "nuovo_utente",
    "password": "password123",
    "firstName": "Nuovo",
    "lastName": "Utente",
    "role": "THERAPIST",
    "phone": "3339876543"
  }'
```

#### POST /api/auth/logout
**Pubblico** - Logout (elimina token lato client)
```bash
curl -X POST http://localhost:3100/api/auth/logout
```

---

## 🛡️ **RUOLI E PERMESSI**

### Ruoli Disponibili
- **ADMIN**: Accesso completo
- **DOCTOR**: Gestione clinica completa
- **THERAPIST**: Gestione terapie e sedute
- **RECEPTIONIST**: Gestione appuntamenti e pazienti
- **NURSE**: Supporto clinico

### Matrice Permessi

| Endpoint | ADMIN | DOCTOR | THERAPIST | RECEPTIONIST | NURSE |
|----------|-------|--------|-----------|--------------|-------|
| **Pazienti** |
| Visualizza | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crea | ✅ | ✅ | ✅ | ✅ | ❌ |
| Modifica | ✅ | ✅ | ✅ | ✅ | ❌ |
| Elimina | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Cartelle Cliniche** |
| Visualizza | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crea | ✅ | ✅ | ✅ | ❌ | ❌ |
| Modifica | ✅ | ✅ | ✅ | ❌ | ❌ |
| Chiudi/Riapri | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Utenti** |
| Registra nuovo | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🏥 **ENDPOINTS PROTETTI**

Tutti gli endpoint seguenti richiedono autenticazione JWT.

### Pazienti
```bash
# Header richiesto per tutte le richieste
-H "Authorization: Bearer <accessToken>"
```

- `GET /api/patients` - Lista pazienti
- `GET /api/patients/:id` - Dettaglio paziente
- `POST /api/patients` - Crea paziente
- `PUT /api/patients/:id` - Aggiorna paziente
- `DELETE /api/patients/:id` - Elimina paziente (solo ADMIN/DOCTOR)
- `GET /api/patients/:id/clinical-records` - Cartelle del paziente

### Cartelle Cliniche
- `GET /api/clinical-records` - Lista cartelle
- `GET /api/clinical-records/:id` - Dettaglio cartella
- `POST /api/clinical-records` - Crea cartella (ADMIN/DOCTOR/THERAPIST)
- `PUT /api/clinical-records/:id` - Aggiorna cartella (ADMIN/DOCTOR/THERAPIST)
- `POST /api/clinical-records/:id/close` - Chiudi cartella (ADMIN/DOCTOR)
- `POST /api/clinical-records/:id/reopen` - Riapri cartella (ADMIN/DOCTOR)
- `GET /api/clinical-records/:id/therapies` - Terapie della cartella

---

## 📝 **ESEMPI COMPLETI**

### Flusso Completo di Autenticazione e Uso

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicinaravenna.it","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# 2. Usa il token per accedere alle API
curl -X GET http://localhost:3100/api/patients \
  -H "Authorization: Bearer $TOKEN"

# 3. Crea un nuovo paziente
curl -X POST http://localhost:3100/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fiscalCode": "VRDGPP85M15H501Z",
    "firstName": "Giuseppe",
    "lastName": "Verdi",
    "birthDate": "1985-08-15",
    "birthPlace": "Roma",
    "gender": "MALE",
    "address": "Via Milano 10",
    "city": "Ravenna",
    "postalCode": "48121"
  }'
```

---

## 🔍 **GESTIONE ERRORI**

### Errori di Autenticazione

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token non fornito" // o "Token scaduto" o "Token non valido"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Non autorizzato per questa operazione"
}
```

---

## 🧪 **CREDENZIALI DI TEST**

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@medicinaravenna.it | admin123 |
| Terapista | terapista@medicinaravenna.it | therapist123 |

---

## 📊 **TOKEN DETAILS**

### Access Token
- **Durata**: 24 ore
- **Tipo**: JWT
- **Algoritmo**: HS256
- **Payload**: id, email, role, firstName, lastName

### Refresh Token
- **Durata**: 7 giorni
- **Tipo**: JWT
- **Algoritmo**: HS256
- **Payload**: id

---

*Documentazione API v2.0 - Con Autenticazione JWT*
*Aggiornata: 10 Agosto 2025*
