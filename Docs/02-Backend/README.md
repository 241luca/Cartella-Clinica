# 🔧 BACKEND ARCHITECTURE
## Sistema Backend TypeScript - Cartella Clinica Digitale

---

## 📋 INDICE DOCUMENTAZIONE BACKEND

1. [TypeScript Configuration](./typescript-config.md) - Setup TypeScript strict
2. [Services Layer](./services.md) - Logica business e servizi
3. [Middleware](./middleware.md) - Auth, Rate Limit, Cache, Error Handler
4. [Response Formatting](./response-formatting.md) - Formato unificato risposte
5. [Error Handling](./error-handling.md) - Gestione errori centralizzata
6. [Database Layer](./database-layer.md) - Prisma e repository pattern
7. [Real-time](./realtime.md) - Socket.io configuration
8. [Testing](./testing.md) - Unit e integration tests

---

## 🏗️ ARCHITETTURA OVERVIEW

### Pattern Utilizzati
- **Service Layer Pattern** - Separazione business logic
- **Repository Pattern** - Astrazione database con Prisma
- **Middleware Pipeline** - Processamento richieste modulare
- **Dependency Injection** - Testabilità e modularità
- **Error Boundary Pattern** - Gestione errori centralizzata

### Struttura Directory
```
backend/
├── src/
│   ├── config/          # Configurazioni (DB, Redis, Socket)
│   ├── middleware/      # Middleware Express
│   ├── routes/          # Definizione routes API
│   ├── services/        # Business logic services
│   ├── controllers/     # Request handlers
│   ├── validators/      # Zod schemas validation
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utilities e helpers
│   ├── errors/          # Custom error classes
│   ├── jobs/            # Background jobs (cron, queue)
│   └── server.ts        # Entry point applicazione
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Seed data
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── fixtures/       # Test data
└── package.json
```

---

## 🎯 RESPONSE FORMAT UNIFICATO

### Success Response
```typescript
{
  success: true,
  data: T,
  meta?: {
    page?: number,
    limit?: number,
    total?: number,
    cached?: boolean
  },
  warnings?: string[]
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    field?: string,
    details?: any,
    suggestion?: string
  },
  timestamp: Date,
  requestId: string
}
```

---

## 🔐 MIDDLEWARE STACK

### Ordine Esecuzione
1. **Request ID** - Tracciamento richieste
2. **Logger** - Log richieste
3. **CORS** - Cross-origin configuration
4. **Helmet** - Security headers
5. **Rate Limiter** - Protezione DoS
6. **Authentication** - JWT validation
7. **Authorization** - Permessi ruolo
8. **Validation** - Input validation con Zod
9. **Cache** - Response caching
10. **Error Handler** - Gestione errori finale

---

## 💾 SERVICES PRINCIPALI

### PatientService
```typescript
class PatientService {
  // CRUD Operations
  async createPatient(data: CreatePatientDto): Promise<Patient>
  async getPatient(id: string): Promise<Patient>
  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient>
  async deletePatient(id: string): Promise<void>
  
  // Business Logic
  async getPatientHistory(id: string): Promise<PatientHistory>
  async calculateRiskScore(id: string): Promise<RiskScore>
  async checkDocumentCompleteness(id: string): Promise<DocumentStatus>
}
```

### ClinicalRecordService
```typescript
class ClinicalRecordService {
  async createRecord(data: CreateRecordDto): Promise<ClinicalRecord>
  async addAnamnesis(recordId: string, data: AnamnesisDto): Promise<void>
  async addVitalSigns(recordId: string, data: VitalSignsDto): Promise<void>
  async addTherapy(recordId: string, data: TherapyDto): Promise<void>
  async generateReport(recordId: string): Promise<PDF>
}
```

### TherapyService
```typescript
class TherapyService {
  async planTherapy(data: PlanTherapyDto): Promise<TherapyPlan>
  async recordSession(data: SessionDto): Promise<TherapySession>
  async trackProgress(therapyId: string): Promise<ProgressReport>
  async calculateCompliance(patientId: string): Promise<ComplianceScore>
}
```

### DocumentService
```typescript
class DocumentService {
  async uploadDocument(file: File, metadata: DocumentMetadata): Promise<Document>
  async verifyDocument(id: string): Promise<void>
  async checkExpiring(): Promise<ExpiringDocuments[]>
  async generateDocumentReport(patientId: string): Promise<Report>
}
```

---

## 🚦 ERROR HANDLING

### Error Classes Hierarchy
```typescript
AppError (base)
├── ValidationError (422)
├── BadRequestError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── TooManyRequestsError (429)
└── InternalServerError (500)
```

### Global Error Handler
```typescript
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(err);
  
  // Send appropriate response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ResponseFormatter.error(
        err.code,
        err.message,
        err.details
      )
    );
  }
  
  // Unhandled error
  return res.status(500).json(
    ResponseFormatter.error(
      'INTERNAL_ERROR',
      'Si è verificato un errore interno'
    )
  );
};
```

---

## 🔄 CACHE STRATEGY

### Cache Layers
1. **Redis Cache** - Dati frequenti
2. **Memory Cache** - Dati statici
3. **HTTP Cache** - Response caching

### Cache Keys Pattern
```
patients:list:{organizationId}:{filters}
patient:detail:{patientId}
therapies:patient:{patientId}
documents:patient:{patientId}
```

### Cache Invalidation
- On Create: Invalidate list caches
- On Update: Invalidate specific + list
- On Delete: Invalidate all related

---

## 🔔 REAL-TIME EVENTS

### Socket.io Events
```typescript
// Server -> Client
'patient:updated'
'document:expiring'
'therapy:reminder'
'notification:new'

// Client -> Server
'subscribe:patient'
'unsubscribe:patient'
'markAsRead:notification'
```

---

## 🧪 TESTING STRATEGY

### Test Coverage Requirements
- Services: > 90%
- Controllers: > 80%
- Utils: > 95%
- Overall: > 85%

### Test Types
1. **Unit Tests** - Services, Utils
2. **Integration Tests** - API endpoints
3. **Contract Tests** - External services
4. **Load Tests** - Performance

---

## 📊 PERFORMANCE OPTIMIZATIONS

### Database
- Indexed queries
- Connection pooling
- Query optimization
- Lazy loading relations

### API
- Response compression
- Pagination
- Field selection
- Batch operations

### Caching
- Smart invalidation
- TTL optimization
- Cache warming
- Edge caching

---

## 🔐 SECURITY IMPLEMENTATIONS

### Authentication
- JWT with refresh tokens
- 2FA support
- Session management
- Password policies

### Authorization
- Role-based (RBAC)
- Permission-based
- Resource ownership
- Multi-tenant isolation

### Data Protection
- Encryption at rest
- Encryption in transit
- Field-level encryption
- Audit logging

---

## 📝 API VERSIONING

### Strategy
- URL versioning: `/api/v1/`, `/api/v2/`
- Backward compatibility
- Deprecation notices
- Migration guides

---

## 🚀 DEPLOYMENT READY

### Health Checks
```typescript
GET /health
GET /health/db
GET /health/redis
GET /health/storage
```

### Monitoring
- Prometheus metrics
- Custom business metrics
- Error tracking (Sentry)
- APM (Application Performance Monitoring)

---

## 📚 BEST PRACTICES IMPLEMENTATE

1. ✅ **TypeScript Strict Mode** - Type safety garantita
2. ✅ **Consistent Response Format** - Formato unificato
3. ✅ **Error Handling Centralizzato** - Gestione errori robusta
4. ✅ **Input Validation** - Zod schemas ovunque
5. ✅ **Dependency Injection** - Testabilità
6. ✅ **Clean Architecture** - Separazione layer
7. ✅ **SOLID Principles** - Design robusto
8. ✅ **DRY Principle** - No duplicazione codice
9. ✅ **Security First** - Sicurezza by design
10. ✅ **Performance Optimized** - Cache e ottimizzazioni

---

*Backend Architecture v2.0 - Basato su pattern robusti e testati in produzione*
