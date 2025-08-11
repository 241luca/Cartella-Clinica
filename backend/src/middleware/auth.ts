import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { ResponseFormatter } from '../utils/ResponseFormatter';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// NON ridichiarare global qui - già dichiarato in AuthMiddleware.ts

/**
 * Middleware per verificare il JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // Ottieni il token dall'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('Token non fornito', 401);
    }

    // Il formato dovrebbe essere "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('Formato token non valido', 401);
    }

    const token = parts[1];

    // Verifica il token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Aggiungi l'utente al request
    req.user = decoded;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return ResponseFormatter.error(res, new AppError('Token scaduto', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return ResponseFormatter.error(res, new AppError('Token non valido', 401));
    }
    return ResponseFormatter.error(res, error);
  }
};

/**
 * Middleware per verificare il ruolo dell'utente
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return ResponseFormatter.error(
        res,
        new AppError('Utente non autenticato', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return ResponseFormatter.error(
        res,
        new AppError('Non hai i permessi per questa operazione', 403)
      );
    }

    return next();
  };
};

/**
 * Middleware opzionale - non blocca se non autenticato
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const parts = authHeader.split(' ');
      
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
          ) as JWTPayload;
          
          req.user = decoded;
        } catch {
          // Ignora errori di token, continua senza autenticazione
        }
      }
    }
    
    return next();
  } catch (error) {
    return next();
  }
};
