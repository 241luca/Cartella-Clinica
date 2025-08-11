import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import { AppError } from '../errors/AppError';

const prisma = new PrismaClient();

// Tipo per il JWT payload
interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthController {
  /**
   * Login utente
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validazione input
      if (!email || !password) {
        throw new AppError('Email e password sono richiesti', 400);
      }

      // Cerca l'utente nel database
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        }
      });

      // Verifica se l'utente esiste
      if (!user) {
        throw new AppError('Credenziali non valide', 401);
      }

      // Verifica se l'utente è attivo
      if (!user.isActive) {
        throw new AppError('Account non attivo', 403);
      }

      // Verifica la password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Credenziali non valide', 401);
      }

      // Genera JWT token
      const payload: JWTPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: '24h'
        } as jwt.SignOptions
      );

      // Rimuovi la password dalla risposta e mappa i campi per il frontend
      const { password: _, ...userWithoutPassword } = user;
      
      // Mappa i campi per compatibilità con il frontend
      const mappedUser = {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        nome: userWithoutPassword.firstName,
        cognome: userWithoutPassword.lastName,
        ruolo: userWithoutPassword.role.toLowerCase(),
        attivo: userWithoutPassword.isActive
      };

      // Invia risposta di successo
      return ResponseFormatter.success(res, {
        token,
        user: mappedUser
      }, 'Login effettuato con successo');

    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Logout utente
   */
  static async logout(_req: Request, res: Response) {
    try {
      // In un'implementazione più complessa, potresti:
      // 1. Invalidare il token nel database
      // 2. Aggiungere il token a una blacklist
      // 3. Gestire refresh tokens

      return ResponseFormatter.success(res, null, 'Logout effettuato con successo');
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(req: Request, res: Response) {
    try {
      // L'utente viene aggiunto al request dal middleware di autenticazione
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new AppError('Utente non autenticato', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Mappa i campi per compatibilità con il frontend
      const mappedUser = {
        id: user.id,
        email: user.email,
        nome: user.firstName,
        cognome: user.lastName,
        ruolo: user.role.toLowerCase(),
        attivo: user.isActive
      };

      return ResponseFormatter.success(res, mappedUser);
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Refresh token
   */
  static async refresh(req: Request, res: Response) {
    return AuthController.refreshToken(req, res);
  }

  /**
   * Get user profile
   */
  static async getProfile(req: Request, res: Response) {
    return AuthController.getCurrentUser(req, res);
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { firstName, lastName, phone } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phone
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true
        }
      });

      return ResponseFormatter.success(res, updatedUser, 'Profilo aggiornato con successo');
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { oldPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Password attuale non corretta', 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return ResponseFormatter.success(res, null, 'Password cambiata con successo');
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Refresh token implementation
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token richiesto', 400);
      }

      // Verifica il refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      ) as JWTPayload;

      // Genera nuovo access token
      const payload: JWTPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      const newToken = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: '24h'
        } as jwt.SignOptions
      );

      return ResponseFormatter.success(res, { token: newToken });
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Registrazione nuovo utente (solo admin)
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, nome, cognome, ruolo, username } = req.body;

      // Validazione input
      if (!email || !password || !nome || !cognome) {
        throw new AppError('Tutti i campi sono richiesti', 400);
      }

      // Verifica se l'email esiste già
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new AppError('Email già registrata', 409);
      }

      // Hash della password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mappa il ruolo al formato enum
      const roleMap: any = {
        'admin': 'ADMIN',
        'medico': 'DOCTOR',
        'doctor': 'DOCTOR',
        'terapista': 'THERAPIST',
        'therapist': 'THERAPIST',
        'receptionist': 'RECEPTIONIST',
        'nurse': 'NURSE'
      };

      const mappedRole = roleMap[ruolo?.toLowerCase()] || 'RECEPTIONIST';

      // Crea il nuovo utente
      const newUser = await prisma.user.create({
        data: {
          email,
          username: username || email.split('@')[0],
          password: hashedPassword,
          firstName: nome,
          lastName: cognome,
          role: mappedRole,
          isActive: true
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true
        }
      });

      // Mappa i campi per compatibilità con il frontend
      const mappedUser = {
        id: newUser.id,
        email: newUser.email,
        nome: newUser.firstName,
        cognome: newUser.lastName,
        ruolo: newUser.role.toLowerCase()
      };

      return ResponseFormatter.success(res, mappedUser, 'Utente creato con successo', 201);
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }
}
