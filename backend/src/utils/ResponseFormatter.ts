import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp?: string;
}

export class ResponseFormatter {
  /**
   * Risposta di successo
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message: message || 'Operazione completata con successo',
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Risposta di successo con paginazione
   */
  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message?: string
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      message: message || 'Dati recuperati con successo',
      data,
      pagination: {
        ...pagination,
        pages: Math.ceil(pagination.total / pagination.limit),
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Risposta creazione risorsa
   */
  static created<T>(
    res: Response,
    data: T,
    message?: string
  ): Response {
    return ResponseFormatter.success(res, data, message || 'Risorsa creata con successo', 201);
  }

  /**
   * Risposta aggiornamento risorsa
   */
  static updated<T>(
    res: Response,
    data: T,
    message?: string
  ): Response {
    return ResponseFormatter.success(res, data, message || 'Risorsa aggiornata con successo', 200);
  }

  /**
   * Risposta eliminazione risorsa
   */
  static deleted(
    res: Response,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: true,
      message: message || 'Risorsa eliminata con successo',
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Risposta senza contenuto
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Errore generico
   */
  static error(
    res: Response,
    error: any,
    statusCode?: number,
    errors?: any[]
  ): Response {
    // Se è un AppError, usa i suoi valori
    if (error && error.statusCode) {
      statusCode = error.statusCode;
    }
    
    const message = error?.message || 'Errore interno del server';
    const status = statusCode || 500;
    
    const response: ApiResponse = {
      success: false,
      message,
      errors: errors || (error?.errors ? error.errors : undefined),
      timestamp: new Date().toISOString(),
    };

    return res.status(status).json(response);
  }

  /**
   * Errore di validazione
   */
  static validationError(
    res: Response,
    errors: any[],
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Errore di validazione',
      errors,
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(response);
  }

  /**
   * Risorsa non trovata
   */
  static notFound(
    res: Response,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Risorsa non trovata',
      timestamp: new Date().toISOString(),
    };
    return res.status(404).json(response);
  }

  /**
   * Non autorizzato
   */
  static unauthorized(
    res: Response,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Non autorizzato',
      timestamp: new Date().toISOString(),
    };
    return res.status(401).json(response);
  }

  /**
   * Accesso negato
   */
  static forbidden(
    res: Response,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Accesso negato',
      timestamp: new Date().toISOString(),
    };
    return res.status(403).json(response);
  }

  /**
   * Conflitto (es. risorsa già esistente)
   */
  static conflict(
    res: Response,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Conflitto con lo stato attuale della risorsa',
      timestamp: new Date().toISOString(),
    };
    return res.status(409).json(response);
  }

  /**
   * Bad request
   */
  static badRequest(
    res: Response,
    message?: string,
    errors?: any[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      message: message || 'Richiesta non valida',
      errors,
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(response);
  }

  /**
   * Errore interno del server
   */
  static internalError(
    res: Response,
    message?: string,
    error?: any
  ): Response {
    // In produzione, non esporre dettagli dell'errore
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return ResponseFormatter.error(
      res,
      message || 'Errore interno del server',
      500,
      isDevelopment && error ? [error.toString()] : undefined
    );
  }

  /**
   * Too Many Requests
   */
  static tooManyRequests(
    res: Response,
    message?: string
  ): Response {
    return ResponseFormatter.error(
      res,
      message || 'Troppe richieste. Riprova più tardi.',
      429
    );
  }

  /**
   * Service Unavailable
   */
  static serviceUnavailable(
    res: Response,
    message?: string
  ): Response {
    return ResponseFormatter.error(
      res,
      message || 'Servizio temporaneamente non disponibile',
      503
    );
  }
}

export default ResponseFormatter;
