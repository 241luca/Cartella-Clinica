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
      const searchStr = String(search).trim().toLowerCase();

      // Prima ottieni tutte le terapie con i dati inclusi
      const allTherapies = await prisma.therapy.findMany({
        include: {
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
          therapyType: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
            }
          },
          prescribedBy: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          sessions: {
            select: {
              id: true,
              status: true,
              sessionDate: true,
            }
          },
          _count: {
            select: { sessions: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      // Applica filtri
      let filtered = allTherapies;

      // Filtro per stato
      if (status !== 'all') {
        if (status === 'active') {
          filtered = filtered.filter(t => t.status === 'IN_PROGRESS');
        } else if (status === 'completed') {
          filtered = filtered.filter(t => t.status === 'COMPLETED');
        } else if (status === 'suspended') {
          filtered = filtered.filter(t => t.status === 'CANCELLED');
        }
      }

      // Filtro per paziente
      if (patientId) {
        filtered = filtered.filter(t => t.clinicalRecord.patientId === String(patientId));
      }

      // Filtro per cartella clinica
      if (clinicalRecordId) {
        filtered = filtered.filter(t => t.clinicalRecordId === String(clinicalRecordId));
      }

      // Ricerca con substring esatta
      if (searchStr) {
        filtered = filtered.filter(therapy => {
          // Cerca nelle note
          if (therapy.notes) {
            const notes = therapy.notes.toLowerCase();
            if (notes.includes(searchStr)) return true;
          }
          
          // Cerca nel distretto
          if (therapy.district) {
            const district = therapy.district.toLowerCase();
            if (district.includes(searchStr)) return true;
          }
          
          // Cerca nel tipo di terapia
          if (therapy.therapyType) {
            const typeName = therapy.therapyType.name.toLowerCase();
            if (typeName.includes(searchStr)) return true;
          }
          
          // Cerca nei dati del paziente
          if (therapy.clinicalRecord?.patient) {
            const patient = therapy.clinicalRecord.patient;
            const firstName = patient.firstName.toLowerCase();
            const lastName = patient.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            const reverseName = `${lastName} ${firstName}`;
            const fiscalCode = patient.fiscalCode.toLowerCase();
            
            if (
              firstName.includes(searchStr) ||
              lastName.includes(searchStr) ||
              fullName.includes(searchStr) ||
              reverseName.includes(searchStr) ||
              fiscalCode.includes(searchStr)
            ) {
              return true;
            }
          }
          
          return false;
        });
      }

      // Applica paginazione
      const therapies = filtered.slice(skip, skip + Number(limit));
      const total = filtered.length;

      ResponseFormatter.successWithPagination(
        res,
        therapies,
        {
          page: Number(page),
          limit: Number(limit),
          total
        },
        'Terapie recuperate con successo'
      );
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
        ResponseFormatter.notFound(res, 'Terapia non trovata');
        return;
      }

      ResponseFormatter.success(res, { therapy }, 'Terapia recuperata con successo');
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
        ResponseFormatter.notFound(res, 'Cartella clinica non trovata');
        return;
      }

      // Verifica che il tipo di terapia esista
      const therapyType = await prisma.therapyType.findUnique({
        where: { id: validatedData.therapyTypeId }
      });

      if (!therapyType) {
        ResponseFormatter.notFound(res, 'Tipo di terapia non trovato');
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

      ResponseFormatter.created(res, therapy, 'Terapia creata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati non validi');
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

      ResponseFormatter.updated(res, therapy, 'Terapia aggiornata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati non validi');
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

      ResponseFormatter.deleted(res, 'Terapia eliminata con successo');
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

      ResponseFormatter.success(res, { sessions }, 'Sessioni recuperate con successo');
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
        ResponseFormatter.notFound(res, 'Terapia non trovata');
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

      ResponseFormatter.created(res, session, 'Sessione creata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati non validi');
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

      ResponseFormatter.updated(res, session, 'Sessione aggiornata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati non validi');
        return;
      }
      next(error);
    }
  }

  // GET /api/therapy-types - Lista tipi di terapia
  static async getTherapyTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const therapyTypes = await prisma.therapyType.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      ResponseFormatter.success(res, { therapyTypes }, 'Tipi di terapia recuperati con successo');
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
        ResponseFormatter.badRequest(res, 'Stato non valido');
        return;
      }

      const therapy = await prisma.therapy.update({
        where: { id },
        data: { 
          status,
          endDate: status === 'COMPLETED' ? new Date() : undefined
        }
      });

      ResponseFormatter.updated(res, therapy, 'Stato aggiornato con successo');
    } catch (error) {
      next(error);
    }
  }
}

export default TherapyController;