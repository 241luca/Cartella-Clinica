import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';

const prisma = new PrismaClient();

// Schema per creare una seduta
const createSessionSchema = z.object({
  therapyId: z.string().uuid(),
  sessionDate: z.string().transform((str) => new Date(str)),
  duration: z.number().min(1),
  vasScoreBefore: z.number().min(0).max(10).optional(),
  vasScoreAfter: z.number().min(0).max(10).optional(),
  variations: z.string().optional(),
  notes: z.string().optional(),
  parameters: z.record(z.any()).optional(),
});

// Schema per aggiornare una seduta
const updateSessionSchema = createSessionSchema.partial().extend({
  therapistSignature: z.string().optional(),
  patientSignature: z.string().optional(),
});

// Schema per completare una seduta
const completeSessionSchema = z.object({
  vasScoreAfter: z.number().min(0).max(10),
  notes: z.string().optional(),
  therapistSignature: z.string(),
  patientSignature: z.string(),
});

export class TherapySessionController {
  // GET /api/therapy-sessions - Lista tutte le sedute
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10,
        therapyId,
        therapistId,
        status,
        startDate,
        endDate
      } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (therapyId) where.therapyId = therapyId;
      if (therapistId) where.therapistId = therapistId;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.sessionDate = {};
        if (startDate) where.sessionDate.gte = new Date(startDate as string);
        if (endDate) where.sessionDate.lte = new Date(endDate as string);
      }

      const [sessions, total] = await Promise.all([
        prisma.therapySession.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            therapy: {
              include: {
                therapyType: true,
                clinicalRecord: {
                  include: {
                    patient: {
                      select: {
                        firstName: true,
                        lastName: true,
                        fiscalCode: true,
                      }
                    }
                  }
                }
              }
            },
            therapist: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: { sessionDate: 'desc' },
        }),
        prisma.therapySession.count({ where }),
      ]);

      ResponseFormatter.successWithPagination(
        res,
        sessions,
        {
          page: Number(page),
          limit: Number(limit),
          total,
        },
        'Lista sedute recuperata con successo'
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapy-sessions/:id - Dettaglio seduta
  static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const session = await prisma.therapySession.findUnique({
        where: { id },
        include: {
          therapy: {
            include: {
              therapyType: true,
              clinicalRecord: {
                include: {
                  patient: true,
                }
              }
            }
          },
          therapist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
      });

      if (!session) {
        ResponseFormatter.notFound(res, 'Seduta non trovata');
        return;
      }

      ResponseFormatter.success(res, session, 'Seduta recuperata con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapy-sessions - Crea nuova seduta
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ResponseFormatter.unauthorized(res);
        return;
      }

      const validatedData = createSessionSchema.parse(req.body);

      // Verifica che la terapia esista e sia attiva
      const therapy = await prisma.therapy.findUnique({
        where: { id: validatedData.therapyId },
      });

      if (!therapy) {
        ResponseFormatter.notFound(res, 'Terapia non trovata');
        return;
      }

      if (therapy.status !== 'IN_PROGRESS' && therapy.status !== 'SCHEDULED') {
        ResponseFormatter.badRequest(res, 'La terapia non è attiva');
        return;
      }

      // Calcola il numero della seduta
      const sessionCount = await prisma.therapySession.count({
        where: { therapyId: validatedData.therapyId },
      });

      const sessionNumber = sessionCount + 1;

      // Verifica che non si superi il numero di sedute prescritte
      if (sessionNumber > therapy.prescribedSessions) {
        ResponseFormatter.badRequest(res, 'Numero massimo di sedute raggiunto');
        return;
      }

      const session = await prisma.therapySession.create({
        data: {
          ...validatedData,
          therapistId: req.user.id,
          sessionNumber,
          status: 'SCHEDULED',
        },
        include: {
          therapist: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
      });

      // Aggiorna il conteggio delle sedute nella terapia
      if (therapy.status === 'SCHEDULED') {
        await prisma.therapy.update({
          where: { id: validatedData.therapyId },
          data: { status: 'IN_PROGRESS' },
        });
      }

      ResponseFormatter.created(res, session, 'Seduta creata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati seduta non validi');
        return;
      }
      next(error);
    }
  }

  // PUT /api/therapy-sessions/:id - Aggiorna seduta
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateSessionSchema.parse(req.body);

      const existing = await prisma.therapySession.findUnique({
        where: { id },
      });

      if (!existing) {
        ResponseFormatter.notFound(res, 'Seduta non trovata');
        return;
      }

      if (existing.status === 'COMPLETED') {
        ResponseFormatter.badRequest(res, 'Impossibile modificare una seduta completata');
        return;
      }

      const session = await prisma.therapySession.update({
        where: { id },
        data: validatedData,
        include: {
          therapist: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
      });

      ResponseFormatter.updated(res, session, 'Seduta aggiornata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati seduta non validi');
        return;
      }
      next(error);
    }
  }

  // POST /api/therapy-sessions/:id/complete - Completa seduta
  static async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = completeSessionSchema.parse(req.body);

      const session = await prisma.therapySession.findUnique({
        where: { id },
        include: { therapy: true },
      });

      if (!session) {
        ResponseFormatter.notFound(res, 'Seduta non trovata');
        return;
      }

      if (session.status === 'COMPLETED') {
        ResponseFormatter.badRequest(res, 'Seduta già completata');
        return;
      }

      // Aggiorna la seduta
      const updated = await prisma.therapySession.update({
        where: { id },
        data: {
          ...validatedData,
          status: 'COMPLETED',
          signedAt: new Date(),
        },
      });

      // Aggiorna il conteggio delle sedute completate nella terapia
      const completedCount = await prisma.therapySession.count({
        where: {
          therapyId: session.therapyId,
          status: 'COMPLETED',
        },
      });

      await prisma.therapy.update({
        where: { id: session.therapyId },
        data: {
          completedSessions: completedCount,
          status: completedCount >= session.therapy.prescribedSessions ? 'COMPLETED' : 'IN_PROGRESS',
        },
      });

      ResponseFormatter.success(res, updated, 'Seduta completata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati completamento non validi');
        return;
      }
      next(error);
    }
  }

  // POST /api/therapy-sessions/:id/cancel - Annulla seduta
  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const session = await prisma.therapySession.findUnique({
        where: { id },
      });

      if (!session) {
        ResponseFormatter.notFound(res, 'Seduta non trovata');
        return;
      }

      if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
        ResponseFormatter.badRequest(res, 'Impossibile annullare questa seduta');
        return;
      }

      const updated = await prisma.therapySession.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `ANNULLATA: ${reason}` : 'ANNULLATA',
        },
      });

      ResponseFormatter.success(res, updated, 'Seduta annullata con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapy-sessions/:id/reschedule - Riprogramma seduta
  static async reschedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { newDate, reason } = req.body;

      if (!newDate) {
        ResponseFormatter.badRequest(res, 'Nuova data richiesta');
        return;
      }

      const session = await prisma.therapySession.findUnique({
        where: { id },
      });

      if (!session) {
        ResponseFormatter.notFound(res, 'Seduta non trovata');
        return;
      }

      if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
        ResponseFormatter.badRequest(res, 'Impossibile riprogrammare questa seduta');
        return;
      }

      const updated = await prisma.therapySession.update({
        where: { id },
        data: {
          sessionDate: new Date(newDate),
          status: 'RESCHEDULED',
          notes: reason ? `RIPROGRAMMATA: ${reason}` : 'RIPROGRAMMATA',
        },
      });

      ResponseFormatter.success(res, updated, 'Seduta riprogrammata con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapy-sessions/calendar - Calendario sedute
  static async getCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate, therapistId } = req.query;

      if (!startDate || !endDate) {
        ResponseFormatter.badRequest(res, 'Date di inizio e fine richieste');
        return;
      }

      const where: any = {
        sessionDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };

      if (therapistId) {
        where.therapistId = therapistId;
      }

      const sessions = await prisma.therapySession.findMany({
        where,
        include: {
          therapy: {
            include: {
              therapyType: true,
              clinicalRecord: {
                include: {
                  patient: {
                    select: {
                      firstName: true,
                      lastName: true,
                    }
                  }
                }
              }
            }
          },
          therapist: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: { sessionDate: 'asc' },
      });

      ResponseFormatter.success(res, sessions, `Trovate ${sessions.length} sedute nel periodo selezionato`);
    } catch (error) {
      next(error);
    }
  }
}
