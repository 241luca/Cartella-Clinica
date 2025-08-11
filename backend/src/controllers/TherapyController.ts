import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';

const prisma = new PrismaClient();

// Schema validazione per creare una terapia
const createTherapySchema = z.object({
  clinicalRecordId: z.string().uuid(),
  therapyTypeId: z.string().uuid(),
  prescribedSessions: z.number().int().positive(),
  startDate: z.string().transform((str) => new Date(str)),
  frequency: z.string().optional(),
  district: z.string().optional(),
  notes: z.string().optional(),
  parameters: z.any().optional(),
});

// Schema per aggiornare una terapia
const updateTherapySchema = createTherapySchema.partial();

// Schema per creare una sessione
const createSessionSchema = z.object({
  therapistId: z.string().uuid(),
  sessionDate: z.string().transform((str) => new Date(str)),
  duration: z.number().int().positive(),
  vasScoreBefore: z.number().int().min(0).max(10).optional(),
  vasScoreAfter: z.number().int().min(0).max(10).optional(),
  notes: z.string().optional(),
  parameters: z.any().optional(),
});

// Schema per aggiornare una sessione
const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', 'RESCHEDULED']).optional(),
  vasScoreBefore: z.number().int().min(0).max(10).optional(),
  vasScoreAfter: z.number().int().min(0).max(10).optional(),
  notes: z.string().optional(),
  parameters: z.any().optional(),
  therapistSignature: z.string().optional(),
  patientSignature: z.string().optional(),
});

export class TherapyController {
  // GET /api/therapies - Lista tutte le terapie
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        status = 'all',
        patientId,
        clinicalRecordId
      } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};

      // Filtro per stato
      if (status !== 'all') {
        if (status === 'active') {
          where.status = 'IN_PROGRESS';
        } else if (status === 'completed') {
          where.status = 'COMPLETED';
        } else if (status === 'suspended') {
          where.status = 'CANCELLED';
        }
      }

      // Filtro per paziente
      if (patientId) {
        where.clinicalRecord = {
          patientId: String(patientId)
        };
      }

      // Filtro per cartella clinica
      if (clinicalRecordId) {
        where.clinicalRecordId = String(clinicalRecordId);
      }

      // Ricerca
      if (search) {
        where.OR = [
          { notes: { contains: String(search), mode: 'insensitive' } },
          { district: { contains: String(search), mode: 'insensitive' } },
          { 
            clinicalRecord: {
              patient: {
                OR: [
                  { firstName: { contains: String(search), mode: 'insensitive' } },
                  { lastName: { contains: String(search), mode: 'insensitive' } },
                  { fiscalCode: { contains: String(search), mode: 'insensitive' } },
                ]
              }
            }
          },
          {
            therapyType: {
              name: { contains: String(search), mode: 'insensitive' }
            }
          }
        ];
      }

      const [therapies, total] = await Promise.all([
        prisma.therapy.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            therapyType: true,
            clinicalRecord: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    fiscalCode: true,
                  }
                }
              }
            },
            sessions: {
              orderBy: { sessionNumber: 'asc' }
            },
            _count: {
              select: { sessions: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.therapy.count({ where })
      ]);

      res.json(ResponseFormatter.success({
        therapies,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/:id - Ottieni dettaglio terapia
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const therapy = await prisma.therapy.findUnique({
        where: { id },
        include: {
          therapyType: true,
          clinicalRecord: {
            include: {
              patient: true,
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true
                }
              }
            }
          },
          sessions: {
            include: {
              therapist: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true
                }
              }
            },
            orderBy: { sessionNumber: 'asc' }
          }
        }
      });

      if (!therapy) {
        res.status(404).json(ResponseFormatter.error('Terapia non trovata'));
        return;
      }

      res.json(ResponseFormatter.success({ therapy }));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapies - Crea nuova terapia
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createTherapySchema.parse(req.body);
      
      // Verifica che la cartella clinica esista
      const clinicalRecord = await prisma.clinicalRecord.findUnique({
        where: { id: validatedData.clinicalRecordId }
      });

      if (!clinicalRecord) {
        res.status(404).json(ResponseFormatter.error('Cartella clinica non trovata'));
        return;
      }

      // Verifica che il tipo di terapia esista
      const therapyType = await prisma.therapyType.findUnique({
        where: { id: validatedData.therapyTypeId }
      });

      if (!therapyType) {
        res.status(404).json(ResponseFormatter.error('Tipo di terapia non trovato'));
        return;
      }

      const therapy = await prisma.therapy.create({
        data: {
          ...validatedData,
          status: 'SCHEDULED'
        },
        include: {
          therapyType: true,
          clinicalRecord: {
            include: {
              patient: true
            }
          }
        }
      });

      res.status(201).json(ResponseFormatter.success(therapy, 'Terapia creata con successo'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ResponseFormatter.error('Dati non validi', error.errors));
        return;
      }
      next(error);
    }
  }

  // PUT /api/therapies/:id - Aggiorna terapia
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateTherapySchema.parse(req.body);
      
      const therapy = await prisma.therapy.update({
        where: { id },
        data: validatedData,
        include: {
          therapyType: true,
          clinicalRecord: {
            include: {
              patient: true
            }
          },
          sessions: true
        }
      });

      res.json(ResponseFormatter.success(therapy, 'Terapia aggiornata con successo'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ResponseFormatter.error('Dati non validi', error.errors));
        return;
      }
      next(error);
    }
  }

  // DELETE /api/therapies/:id - Elimina terapia
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Prima elimina tutte le sessioni
      await prisma.therapySession.deleteMany({
        where: { therapyId: id }
      });

      // Poi elimina la terapia
      await prisma.therapy.delete({
        where: { id }
      });

      res.json(ResponseFormatter.success(null, 'Terapia eliminata con successo'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/:id/sessions - Lista sessioni di una terapia
  static async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const sessions = await prisma.therapySession.findMany({
        where: { therapyId: id },
        include: {
          therapist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        orderBy: { sessionNumber: 'asc' }
      });

      res.json(ResponseFormatter.success({ sessions }));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapies/:id/sessions - Crea nuova sessione
  static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = createSessionSchema.parse(req.body);
      
      // Verifica che la terapia esista
      const therapy = await prisma.therapy.findUnique({
        where: { id }
      });

      if (!therapy) {
        res.status(404).json(ResponseFormatter.error('Terapia non trovata'));
        return;
      }

      // Calcola il numero della sessione
      const lastSession = await prisma.therapySession.findFirst({
        where: { therapyId: id },
        orderBy: { sessionNumber: 'desc' }
      });

      const sessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1;

      const session = await prisma.therapySession.create({
        data: {
          ...validatedData,
          therapyId: id,
          sessionNumber,
          status: 'SCHEDULED'
        },
        include: {
          therapist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });

      res.status(201).json(ResponseFormatter.success(session, 'Sessione creata con successo'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ResponseFormatter.error('Dati non validi', error.errors));
        return;
      }
      next(error);
    }
  }

  // PUT /api/therapies/:id/sessions/:sessionId - Aggiorna sessione
  static async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const validatedData = updateSessionSchema.parse(req.body);
      
      const session = await prisma.therapySession.update({
        where: { id: sessionId },
        data: {
          ...validatedData,
          signedAt: validatedData.therapistSignature ? new Date() : undefined
        },
        include: {
          therapist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });

      // Se la sessione è completata, aggiorna il contatore nella terapia
      if (validatedData.status === 'COMPLETED') {
        await prisma.therapy.update({
          where: { id: session.therapyId },
          data: {
            completedSessions: {
              increment: 1
            },
            status: 'IN_PROGRESS'
          }
        });
      }

      res.json(ResponseFormatter.success(session, 'Sessione aggiornata con successo'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ResponseFormatter.error('Dati non validi', error.errors));
        return;
      }
      next(error);
    }
  }

  // GET /api/therapy-types - Lista tipi di terapia
  static async getTherapyTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const therapyTypes = await prisma.therapyType.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      res.json(ResponseFormatter.success({ therapyTypes }));
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/therapies/:id/status - Cambia stato terapia
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED'];
      if (!validStatuses.includes(status)) {
        res.status(400).json(ResponseFormatter.error('Stato non valido'));
        return;
      }

      const therapy = await prisma.therapy.update({
        where: { id },
        data: { 
          status,
          endDate: status === 'COMPLETED' ? new Date() : undefined
        }
      });

      res.json(ResponseFormatter.success(therapy, 'Stato aggiornato con successo'));
    } catch (error) {
      next(error);
    }
  }
}
