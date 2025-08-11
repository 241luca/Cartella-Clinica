import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';

const prisma = new PrismaClient();

// Schema validazione per creare una cartella clinica
const createClinicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  diagnosis: z.string().min(3),
  diagnosticDetails: z.string().optional(),
  symptomatology: z.string().optional(),
  objectiveExamination: z.string().optional(),
  instrumentalExams: z.string().optional(),
  interventionDate: z.string().transform((str) => new Date(str)).optional(),
  interventionDoctor: z.string().optional(),
});

// Schema per aggiornare una cartella clinica
const updateClinicalRecordSchema = createClinicalRecordSchema.partial();

export class ClinicalRecordController {
  // GET /api/clinical-records - Lista tutte le cartelle cliniche
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        status = 'all' // all, active, closed
      } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};

      // Filtro per stato
      if (status === 'active' || status === 'open') {
        where.isActive = true;
      } else if (status === 'closed') {
        where.isActive = false;
      }

      // Ricerca
      if (search) {
        where.OR = [
          { recordNumber: { contains: String(search), mode: 'insensitive' } },
          { diagnosis: { contains: String(search), mode: 'insensitive' } },
          { 
            patient: {
              OR: [
                { firstName: { contains: String(search), mode: 'insensitive' } },
                { lastName: { contains: String(search), mode: 'insensitive' } },
                { fiscalCode: { contains: String(search), mode: 'insensitive' } },
              ]
            }
          }
        ];
      }

      const [records, total] = await Promise.all([
        prisma.clinicalRecord.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fiscalCode: true,
              }
            },
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            therapies: {
              select: {
                id: true,
                status: true,
                therapyType: {
                  select: {
                    name: true,
                    category: true,
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.clinicalRecord.count({ where }),
      ]);

      ResponseFormatter.successWithPagination(
        res,
        records,
        {
          page: Number(page),
          limit: Number(limit),
          total,
        },
        'Lista cartelle cliniche recuperata con successo'
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/clinical-records/:id - Ottieni una cartella clinica specifica
  static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const record = await prisma.clinicalRecord.findUnique({
        where: { id },
        include: {
          patient: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            }
          },
          therapies: {
            include: {
              therapyType: true,
              sessions: {
                orderBy: { sessionDate: 'desc' },
                take: 5,
              }
            }
          },
          functionalEvaluations: {
            orderBy: { evaluationDate: 'desc' },
          },
          clinicalControls: {
            include: {
              doctor: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            },
            orderBy: { controlDate: 'desc' },
          },
          dischargeReport: true,
        },
      });

      if (!record) {
        ResponseFormatter.notFound(res, 'Cartella clinica non trovata');
        return;
      }

      ResponseFormatter.success(res, record, 'Cartella clinica recuperata con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/clinical-records - Crea una nuova cartella clinica
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createClinicalRecordSchema.parse(req.body);
      
      // Genera numero cartella progressivo
      const year = new Date().getFullYear();
      const lastRecord = await prisma.clinicalRecord.findFirst({
        where: {
          recordNumber: {
            startsWith: `CR-${year}-`
          }
        },
        orderBy: { recordNumber: 'desc' },
      });

      let nextNumber = 1;
      if (lastRecord) {
        const lastNumber = parseInt(lastRecord.recordNumber.split('-')[2]);
        nextNumber = lastNumber + 1;
      }

      const recordNumber = `CR-${year}-${String(nextNumber).padStart(3, '0')}`;

      // TODO: Prendere createdById dall'utente autenticato
      // Per ora usiamo l'admin di default
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });

      const record = await prisma.clinicalRecord.create({
        data: {
          ...validatedData,
          recordNumber,
          acceptanceDate: new Date(),
          createdById: adminUser?.id || '', // In produzione verrà dal JWT
        },
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              fiscalCode: true,
            }
          }
        }
      });

      ResponseFormatter.created(res, record, 'Cartella clinica creata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati cartella non validi');
        return;
      }
      next(error);
    }
  }

  // PUT /api/clinical-records/:id - Aggiorna una cartella clinica
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateClinicalRecordSchema.parse(req.body);

      const record = await prisma.clinicalRecord.update({
        where: { id },
        data: validatedData,
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              fiscalCode: true,
            }
          }
        }
      });

      ResponseFormatter.updated(res, record, 'Cartella clinica aggiornata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Dati non validi',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  // POST /api/clinical-records/:id/close - Chiudi una cartella clinica
  static async close(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const record = await prisma.clinicalRecord.update({
        where: { id },
        data: {
          isActive: false,
          closedAt: new Date(),
        },
      });

      ResponseFormatter.success(res, record, 'Cartella clinica chiusa con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/clinical-records/:id/reopen - Riapri una cartella clinica
  static async reopen(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const record = await prisma.clinicalRecord.update({
        where: { id },
        data: {
          isActive: true,
          closedAt: null,
        },
      });

      ResponseFormatter.success(res, record, 'Cartella clinica riaperta con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/clinical-records/:id/therapies - Ottieni le terapie di una cartella
  static async getTherapies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const therapies = await prisma.therapy.findMany({
        where: { clinicalRecordId: id },
        include: {
          therapyType: true,
          sessions: {
            include: {
              therapist: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            },
            orderBy: { sessionDate: 'desc' },
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      ResponseFormatter.success(res, therapies, `Trovate ${therapies.length} terapie per questa cartella`);
    } catch (error) {
      next(error);
    }
  }
}
