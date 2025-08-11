# 📤 RESPONSE FORMATTING & ERROR HANDLING
## Sistema Unificato di Gestione Risposte ed Errori

---

## 🎯 RESPONSE FORMATTER

### Implementazione Completa

```typescript
// src/utils/responseFormatter.ts
import { v4 as uuidv4 } from 'uuid';

export class ResponseFormatter {
  private static requestId: string;

  /**
   * Set request ID for tracking
   */
  static setRequestId(id: string) {
    this.requestId = id;
  }

  /**
   * Format successful response
   */
  static success<T>(
    data: T,
    meta?: any,
    warnings?: string[]
  ) {
    return {
      success: true,
      data,
      ...(meta && { meta }),
      ...(warnings && warnings.length > 0 && { warnings }),
      timestamp: new Date().toISOString(),
      requestId: this.requestId || uuidv4()
    };
  }

  /**
   * Format error response
   */
  static error(
    code: string,
    message: string,
    details?: any,
    field?: string,
    suggestion?: string
  ) {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
        ...(field && { field }),
        ...(suggestion && { suggestion })
      },
      timestamp: new Date().toISOString(),
      requestId: this.requestId || uuidv4()
    };
  }

  /**
   * Format paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    cached = false,
    cacheExpiry?: Date
  ) {
    return {
      success: true,
      data,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        cached,
        ...(cacheExpiry && { cacheExpiry: cacheExpiry.toISOString() })
      },
      timestamp: new Date().toISOString(),
      requestId: this.requestId || uuidv4()
    };
  }

  /**
   * Format validation error response
   */
  static validationError(errors: any[]) {
    const formattedErrors = errors.map(err => ({
      field: err.path?.join('.') || err.field,
      message: err.message,
      code: err.code || 'VALIDATION_ERROR'
    }));

    return this.error(
      'VALIDATION_ERROR',
      'I dati inseriti non sono validi',
      formattedErrors,
      formattedErrors[0]?.field,
      'Controlla i campi evidenziati e riprova'
    );
  }
}
```

---

## 🚨 ERROR CLASSES

### Implementazione Error Classes

```typescript
// src/errors/AppError.ts

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error - 422
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 422, 'VALIDATION_ERROR', true, details);
  }
}

/**
 * Bad Request Error - 400
 */
export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'BAD_REQUEST', true, details);
  }
}

/**
 * Unauthorized Error - 401
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Non autorizzato', details?: any) {
    super(message, 401, 'UNAUTHORIZED', true, details);
  }
}

/**
 * Forbidden Error - 403
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Accesso negato', details?: any) {
    super(message, 403, 'FORBIDDEN', true, details);
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 404, 'NOT_FOUND', true, details);
  }
}

/**
 * Conflict Error - 409
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT', true, details);
  }
}
```

---

## 🛡️ ERROR HANDLER MIDDLEWARE

### Global Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ResponseFormatter } from '../utils/responseFormatter';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set request ID for tracking
  ResponseFormatter.setRequestId(req.id);

  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: (req as any).user?.id
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code
    }));
    
    return res.status(422).json(
      ResponseFormatter.validationError(errors)
    );
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.[0];
      return res.status(409).json(
        ResponseFormatter.conflict('Record', field)
      );
    }
    
    if (err.code === 'P2025') {
      // Record not found
      return res.status(404).json(
        ResponseFormatter.notFound('Record')
      );
    }
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    const response = ResponseFormatter.error(
      err.code,
      err.message,
      err.details
    );

    return res.status(err.statusCode).json(response);
  }

  // Default error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  const message = isDevelopment ? err.message : 'Si è verificato un errore';

  return res.status(500).json(
    ResponseFormatter.error(
      'INTERNAL_ERROR',
      message
    )
  );
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

## 📊 ESEMPI DI UTILIZZO

### Controller Example

```typescript
// src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { ResponseFormatter } from '../utils/responseFormatter';
import { asyncHandler } from '../middleware/errorHandler';
import { NotFoundError, BadRequestError } from '../errors/AppError';

export class PatientController {
  private patientService = new PatientService();

  /**
   * Get all patients
   */
  getAllPatients = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, search } = req.query;
    
    const result = await this.patientService.getPatients({
      page: Number(page),
      limit: Number(limit),
      search: search as string
    });

    res.json(
      ResponseFormatter.paginated(
        result.data,
        result.page,
        result.limit,
        result.total
      )
    );
  });

  /**
   * Get patient by ID
   */
  getPatientById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const patient = await this.patientService.getPatientById(id);
    
    if (!patient) {
      throw new NotFoundError('Paziente non trovato');
    }

    res.json(ResponseFormatter.success(patient));
  });

  /**
   * Create new patient
   */
  createPatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = await this.patientService.createPatient(req.body);
    
    res.status(201).json(
      ResponseFormatter.success(
        patient,
        { message: 'Paziente creato con successo' }
      )
    );
  });

  /**
   * Update patient
   */
  updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const patient = await this.patientService.updatePatient(id, req.body);
    
    res.json(
      ResponseFormatter.success(
        patient,
        { message: 'Paziente aggiornato con successo' }
      )
    );
  });

  /**
   * Delete patient
   */
  deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Check if patient has active records
    const hasActiveRecords = await this.patientService.hasActiveRecords(id);
    
    if (hasActiveRecords) {
      throw new BadRequestError(
        'Non puoi eliminare un paziente con cartelle cliniche attive'
      );
    }
    
    await this.patientService.deletePatient(id);
    
    res.json(
      ResponseFormatter.success(
        null,
        { message: 'Paziente eliminato con successo' }
      )
    );
  });
}
```

---

## 🧪 TESTING ERROR HANDLING

### Test Examples

```typescript
// tests/errorHandling.test.ts
import request from 'supertest';
import { app } from '../src/server';

describe('Error Handling', () => {
  describe('404 Errors', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/v1/unknown-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: expect.any(String)
        }
      });
    });
  });

  describe('Validation Errors', () => {
    it('should return 422 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/patients')
        .send({ invalid: 'data' })
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          details: expect.any(Array)
        }
      });
    });
  });

  describe('Authentication Errors', () => {
    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/v1/patients')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED'
        }
      });
    });
  });
});
```

---

## 📝 RESPONSE EXAMPLES

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "firstName": "Mario",
    "lastName": "Rossi"
  },
  "timestamp": "2025-08-10T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "cached": false
  },
  "timestamp": "2025-08-10T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "I dati inseriti non sono validi",
    "details": [
      {
        "field": "email",
        "message": "Email non valida",
        "code": "invalid_string"
      }
    ],
    "field": "email",
    "suggestion": "Controlla i campi evidenziati e riprova"
  },
  "timestamp": "2025-08-10T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## ✅ BEST PRACTICES

1. **Sempre usare ResponseFormatter** per consistenza
2. **Throw custom errors** nei services
3. **Catch errors** nel controller con asyncHandler
4. **Log tutti gli errori** per debugging
5. **Non esporre stack traces** in produzione
6. **Usare status codes appropriati**
7. **Fornire messaggi utili** all'utente
8. **Includere suggestions** per risolvere l'errore
9. **Tracciare con requestId** per debugging
10. **Testare error paths** con unit tests

---

*Response Formatting & Error Handling v2.0 - Sistema robusto e consistente*
