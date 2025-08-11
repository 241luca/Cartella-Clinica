import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseFormatter } from '../utils/ResponseFormatter';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Estendi l'interfaccia Request per includere l'utente
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

class AuthMiddleware {
  /**
   * Middleware per verificare il JWT token
   */
  static authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      // Ottieni il token dall'header Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return ResponseFormatter.unauthorized(res, 'Token non fornito');
      }

      // Il formato dovrebbe essere "Bearer TOKEN"
      const parts = authHeader.split(' ');
      
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return ResponseFormatter.unauthorized(res, 'Formato token non valido');
      }

      const token = parts[1];

      try {
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
          return ResponseFormatter.unauthorized(res, 'Token scaduto');
        }
        if (error instanceof jwt.JsonWebTokenError) {
          return ResponseFormatter.unauthorized(res, 'Token non valido');
        }
        return ResponseFormatter.unauthorized(res, 'Errore autenticazione');
      }
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  };

  /**
   * Middleware per verificare il ruolo dell'utente
   */
  static authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
      if (!req.user) {
        return ResponseFormatter.unauthorized(res, 'Utente non autenticato');
      }

      if (!roles.includes(req.user.role)) {
        return ResponseFormatter.forbidden(res, 'Non hai i permessi per questa operazione');
      }

      return next();
    };
  };
}

export default AuthMiddleware;
export { AuthMiddleware };
