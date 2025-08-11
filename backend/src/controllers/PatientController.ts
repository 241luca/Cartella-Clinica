import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';

const prisma = new PrismaClient();

// Schema di validazione per creare un paziente
const createPatientSchema = z.object({
  fiscalCode: z.string().length(16),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  birthDate: z.string().transform((str) => new Date(str)),
  birthPlace: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string(),
  city: z.string(),
  postalCode: z.string().length(5),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  generalPractitioner: z.string().optional(),
  prescribingDoctor: z.string().optional(),
  privacyConsent: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
});

// Schema per aggiornare un paziente
const updatePatientSchema = createPatientSchema.partial();

export class PatientController {
  // GET /api/patients - Lista tutti i pazienti
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const searchStr = String(search).trim().toLowerCase();
      
      let patients;
      let total;
      
      if (searchStr) {
        // Prima ottieni tutti i pazienti per fare un filtro più accurato
        const allPatients = await prisma.patient.findMany({
          orderBy: { createdAt: 'desc' },
        });
        
        // Filtra i pazienti che contengono ESATTAMENTE la substring cercata
        const filtered = allPatients.filter(patient => {
          // Crea stringhe combinate per la ricerca (tutto minuscolo per case-insensitive)
          const firstName = patient.firstName.toLowerCase();
          const lastName = patient.lastName.toLowerCase();
          const fullName = `${firstName} ${lastName}`;
          const reverseName = `${lastName} ${firstName}`;
          // RIMOSSO: fiscalCode dalla ricerca
          
          // Controlla se la stringa di ricerca è contenuta ESATTAMENTE in:
          return (
            firstName.includes(searchStr) ||           // substring esatta nel nome
            lastName.includes(searchStr) ||            // substring esatta nel cognome
            fullName.includes(searchStr) ||            // substring esatta in "nome cognome"
            reverseName.includes(searchStr)            // substring esatta in "cognome nome"
            // RIMOSSO: fiscalCode.includes(searchStr)
          );
        });
        
        // Applica paginazione
        patients = filtered.slice(skip, skip + Number(limit));
        total = filtered.length;
      } else {
        // Se non c'è ricerca, usa la query normale con paginazione
        [patients, total] = await Promise.all([
          prisma.patient.findMany({
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
          }),
          prisma.patient.count(),
        ]);
      }

      ResponseFormatter.successWithPagination(
        res,
        patients,
        {
          page: Number(page),
          limit: Number(limit),
          total,
        },
        'Lista pazienti recuperata con successo'
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/patients/:id - Ottieni un paziente specifico
  static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          clinicalRecords: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          anamnesis: {
            orderBy: { recordDate: 'desc' },
            take: 1,
          },
          vitalSigns: {
            orderBy: { measurementDate: 'desc' },
            take: 5,
          },
        },
      });

      if (!patient) {
        ResponseFormatter.notFound(res, 'Paziente non trovato');
        return;
      }

      ResponseFormatter.success(res, patient, 'Paziente recuperato con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/patients - Crea un nuovo paziente
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createPatientSchema.parse(req.body);

      // Verifica se il codice fiscale esiste già
      const existing = await prisma.patient.findUnique({
        where: { fiscalCode: validatedData.fiscalCode },
      });

      if (existing) {
        ResponseFormatter.conflict(res, 'Codice fiscale già registrato');
        return;
      }

      const patient = await prisma.patient.create({
        data: validatedData,
      });

      ResponseFormatter.created(res, patient, 'Paziente creato con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati paziente non validi');
        return;
      }
      next(error);
    }
  }

  // PUT /api/patients/:id - Aggiorna un paziente
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updatePatientSchema.parse(req.body);

      // Verifica che il paziente esista
      const existing = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existing) {
        ResponseFormatter.notFound(res, 'Paziente non trovato');
        return;
      }

      const patient = await prisma.patient.update({
        where: { id },
        data: validatedData,
      });

      ResponseFormatter.updated(res, patient, 'Paziente aggiornato con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati paziente non validi');
        return;
      }
      next(error);
    }
  }

  // DELETE /api/patients/:id - Elimina (soft delete) un paziente
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Verifica che il paziente esista
      const existing = await prisma.patient.findUnique({
        where: { id },
      });

      if (!existing) {
        ResponseFormatter.notFound(res, 'Paziente non trovato');
        return;
      }

      // Soft delete - imposta deletedAt
      await prisma.patient.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      ResponseFormatter.deleted(res, 'Paziente eliminato con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/patients/:id/clinical-records - Ottieni le cartelle cliniche di un paziente
  static async getClinicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Verifica che il paziente esista
      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!patient) {
        ResponseFormatter.notFound(res, 'Paziente non trovato');
        return;
      }

      const records = await prisma.clinicalRecord.findMany({
        where: { patientId: id },
        include: {
          therapies: {
            include: {
              therapyType: true,
            },
          },
          functionalEvaluations: true,
          clinicalControls: {
            include: {
              doctor: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      ResponseFormatter.success(
        res, 
        records, 
        `Trovate ${records.length} cartelle cliniche per il paziente`
      );
    } catch (error) {
      next(error);
    }
  }
}
