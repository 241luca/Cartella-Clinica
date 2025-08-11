import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import TherapyService, { TherapyTypeCode } from '../services/TherapyService';

// Schema per creare una terapia usando il servizio
const createTherapyWithServiceSchema = z.object({
  clinicalRecordId: z.string().uuid(),
  therapyType: z.nativeEnum(TherapyTypeCode),
  prescribedSessions: z.number().min(1).optional(),
  startDate: z.string().transform((str) => new Date(str)).optional(),
  frequency: z.string().optional(),
  district: z.string().optional(),
  notes: z.string().optional(),
  parameters: z.record(z.any())
});

// Schema per pianificare una seduta
const scheduleSessionSchema = z.object({
  therapyId: z.string().uuid(),
  therapistId: z.string().uuid(),
  sessionDate: z.string().transform((str) => new Date(str)),
  duration: z.number().min(15).max(120).optional()
});

// Schema per aggiornare progressi seduta
const updateSessionProgressSchema = z.object({
  vasScoreBefore: z.number().min(0).max(10).optional(),
  vasScoreAfter: z.number().min(0).max(10).optional(),
  variations: z.string().optional(),
  notes: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', 'RESCHEDULED']).optional()
});

// Schema specifici per ogni tipo di terapia
const therapyParametersSchemas = {
  [TherapyTypeCode.LIMFATERAPY]: z.object({
    sedute: z.number().min(1),
    programma: z.string(),
    modalita: z.enum(['auto', 'manuale']),
    descrizione: z.string().optional()
  }),
  [TherapyTypeCode.LASER_YAG_145]: z.object({
    watt: z.number().positive(),
    joulePerPulse: z.number().positive(),
    pulse: z.number().positive(),
    dose: z.number().positive(),
    distretto: z.string()
  }),
  [TherapyTypeCode.LASER_810_980]: z.object({
    watt: z.number().positive(),
    joulePerPulse: z.number().positive(),
    pulse: z.number().positive(),
    dose: z.number().positive(),
    distretto: z.string()
  }),
  [TherapyTypeCode.LASER_SCAN]: z.object({
    potenza: z.number().positive(),
    drenaggio: z.boolean(),
    normale: z.boolean(),
    radiofrequenza: z.number().optional(),
    temperatura: z.number().optional(),
    distretto: z.string()
  }),
  [TherapyTypeCode.MAGNETOTERAPIA]: z.object({
    programma: z.number(),
    hertz: z.number().positive(),
    intensita: z.number().positive(),
    tempo: z.number().positive()
  }),
  [TherapyTypeCode.TENS]: z.object({
    tempo: z.number().positive(),
    tipo: z.string(),
    distretto: z.string()
  }),
  [TherapyTypeCode.ULTRASUONI]: z.object({
    mhz: z.number().positive(),
    watt: z.number().positive(),
    tempo: z.number().positive(),
    inAcqua: z.boolean()
  }),
  [TherapyTypeCode.ELETTROSTIMOLAZIONE]: z.object({
    distretto: z.string(),
    programma: z.string(),
    intensita: z.number().positive()
  }),
  [TherapyTypeCode.MASSOTERAPIA]: z.object({
    tipo: z.string(),
    distretto: z.string(),
    durata: z.number().positive()
  }),
  [TherapyTypeCode.MOBILIZZAZIONI]: z.object({
    distretto: z.string(),
    tipo: z.string(),
    note: z.string().optional()
  }),
  [TherapyTypeCode.TECARSIN]: z.object({
    programma: z.string(),
    potenza: z.number().positive(),
    tempo: z.number().positive()
  }),
  [TherapyTypeCode.SIT]: z.object({
    distretto: z.string(),
    farmaco: z.string()
  }),
  [TherapyTypeCode.TECALAB]: z.object({
    sedute: z.number().min(1),
    programma: z.string()
  })
};

export class TherapyController {
  
  // GET /api/therapies - Ottiene tutte le terapie con paginazione
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 12, search: _search = '', status: _status = 'all' } = req.query;
      
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      
      // Mock data per ora
      const mockTherapies = [];
      for (let i = 0; i < limitNum; i++) {
        mockTherapies.push({
          id: `therapy-${i + 1}`,
          patient: {
            id: `patient-${i + 1}`,
            firstName: ['Mario', 'Laura', 'Giuseppe', 'Anna'][i % 4],
            lastName: ['Rossi', 'Bianchi', 'Verdi', 'Neri'][i % 4],
            fiscalCode: `RSSMRA${85 - i}M01H501Z`
          },
          clinicalRecord: {
            id: `record-${i + 1}`,
            recordNumber: `CR-2025-${1000 + i}`
          },
          therapyType: {
            id: `type-${i + 1}`,
            name: ['Fisioterapia', 'Laserterapia', 'Tecarterapia', 'Ultrasuoni'][i % 4],
            category: 'PHYSICAL'
          },
          status: ['ACTIVE', 'COMPLETED', 'SUSPENDED'][i % 3],
          prescribedSessions: 10 + (i % 5) * 2,
          completedSessions: Math.floor((10 + (i % 5) * 2) * (0.3 + (i % 7) * 0.1)),
          startDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
          endDate: i % 3 === 0 ? new Date(Date.now() + i * 86400000 * 3).toISOString() : undefined,
          notes: i % 2 === 0 ? 'Paziente risponde bene al trattamento' : undefined
        });
      }
      
      ResponseFormatter.success(res, {
        therapies: mockTherapies,
        totalPages: 2,
        currentPage: pageNum,
        total: 24
      }, 'Terapie recuperate con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/:id - Ottiene una terapia specifica
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Mock data per ora
      const mockTherapy = {
        id,
        patient: {
          id: `patient-1`,
          firstName: 'Mario',
          lastName: 'Rossi',
          fiscalCode: `RSSMRA85M01H501Z`
        },
        clinicalRecord: {
          id: `record-1`,
          recordNumber: `CR-2025-1001`
        },
        therapyType: {
          id: `type-1`,
          name: 'Fisioterapia',
          category: 'PHYSICAL'
        },
        status: 'ACTIVE',
        prescribedSessions: 10,
        completedSessions: 3,
        startDate: new Date().toISOString(),
        notes: 'Paziente risponde bene al trattamento'
      };
      
      ResponseFormatter.success(res, mockTherapy, 'Terapia recuperata con successo');
    } catch (error) {
      next(error);
    }
  }
  
  // POST /api/therapies/initialize-types - Inizializza i tipi di terapia nel database
  static async initializeTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await TherapyService.initializeTherapyTypes();
      ResponseFormatter.success(res, null, 'Tipi di terapia inizializzati con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapies - Crea nuova terapia usando il servizio
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createTherapyWithServiceSchema.parse(req.body);
      
      // Valida i parametri specifici per il tipo di terapia
      const paramSchema = therapyParametersSchemas[validatedData.therapyType];
      if (!paramSchema) {
        ResponseFormatter.badRequest(res, 'Tipo di terapia non valido');
        return;
      }
      
      const validatedParams = paramSchema.parse(validatedData.parameters);
      
      // Usa il metodo specifico del servizio in base al tipo
      let therapy;
      switch (validatedData.therapyType) {
        case TherapyTypeCode.LIMFATERAPY:
          therapy = await TherapyService.createLimfaterapy(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.LASER_YAG_145:
          therapy = await TherapyService.createLaserYag(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.LASER_810_980:
          therapy = await TherapyService.createLaser810980(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.LASER_SCAN:
          therapy = await TherapyService.createLaserScan(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.MAGNETOTERAPIA:
          therapy = await TherapyService.createMagnetoterapia(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.TENS:
          therapy = await TherapyService.createTens(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.ULTRASUONI:
          therapy = await TherapyService.createUltrasuoni(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.ELETTROSTIMOLAZIONE:
          therapy = await TherapyService.createElettrostimolazione(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.MASSOTERAPIA:
          therapy = await TherapyService.createMassoterapia(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.MOBILIZZAZIONI:
          therapy = await TherapyService.createMobilizzazioni(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.TECARSIN:
          therapy = await TherapyService.createTecarsin(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.SIT:
          therapy = await TherapyService.createSIT(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        case TherapyTypeCode.TECALAB:
          therapy = await TherapyService.createTecalab(
            validatedData.clinicalRecordId,
            validatedParams as any
          );
          break;
        default:
          ResponseFormatter.badRequest(res, 'Tipo di terapia non supportato');
          return;
      }
      
      ResponseFormatter.created(res, therapy, 'Terapia creata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Parametri terapia non validi');
        return;
      }
      next(error);
    }
  }

  // POST /api/therapies/schedule-session - Pianifica una seduta
  static async scheduleSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = scheduleSessionSchema.parse(req.body);
      
      const session = await TherapyService.scheduleSession(validatedData);
      
      ResponseFormatter.created(res, session, 'Seduta pianificata con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati seduta non validi');
        return;
      }
      next(error);
    }
  }

  // PUT /api/therapies/sessions/:sessionId/progress - Aggiorna progressi seduta
  static async updateSessionProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const validatedData = updateSessionProgressSchema.parse(req.body);
      
      const session = await TherapyService.updateSessionProgress({
        sessionId,
        ...validatedData
      });
      
      ResponseFormatter.updated(res, session, 'Progressi seduta aggiornati con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati progressi non validi');
        return;
      }
      next(error);
    }
  }

  // GET /api/therapies/:id/vas-improvement - Calcola miglioramento VAS
  static async getVASImprovement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const improvement = await TherapyService.calculateVASImprovement(id);
      
      ResponseFormatter.success(
        res, 
        { therapyId: id, vasImprovement: improvement },
        `Miglioramento VAS: ${improvement.toFixed(1)} punti`
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/:id/statistics - Ottiene statistiche terapia
  static async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const statistics = await TherapyService.getTherapyStatistics(id);
      
      ResponseFormatter.success(res, statistics, 'Statistiche terapia recuperate con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/clinical-record/:recordId - Terapie per cartella clinica
  static async getByClinicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { recordId } = req.params;
      
      const therapies = await TherapyService.getTherapiesByClinicalRecord(recordId);
      
      ResponseFormatter.success(
        res, 
        therapies,
        `Trovate ${therapies.length} terapie per questa cartella clinica`
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/therapist/:therapistId/today - Sedute di oggi per terapista
  static async getTodaySessionsForTherapist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { therapistId } = req.params;
      
      const sessions = await TherapyService.getTodaySessionsForTherapist(therapistId);
      
      ResponseFormatter.success(
        res,
        sessions,
        `${sessions.length} sedute programmate per oggi`
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapies/sessions/:sessionId/cancel - Cancella seduta
  static async cancelSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { reason } = req.body;
      
      const session = await TherapyService.cancelSession(sessionId, reason);
      
      ResponseFormatter.success(res, session, 'Seduta cancellata con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapies/sessions/:sessionId/reschedule - Riprogramma seduta
  static async rescheduleSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { newDate } = req.body;
      
      if (!newDate) {
        ResponseFormatter.badRequest(res, 'Nuova data richiesta');
        return;
      }
      
      const session = await TherapyService.rescheduleSession(
        sessionId,
        new Date(newDate)
      );
      
      ResponseFormatter.success(res, session, 'Seduta riprogrammata con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/types/:typeCode/parameters - Schema parametri per tipo
  static async getParameterSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { typeCode } = req.params;
      
      if (!Object.values(TherapyTypeCode).includes(typeCode as TherapyTypeCode)) {
        ResponseFormatter.badRequest(res, 'Tipo di terapia non valido');
        return;
      }
      
      const schema = await TherapyService.getParametersByType(typeCode as TherapyTypeCode);
      
      ResponseFormatter.success(res, schema, 'Schema parametri recuperato con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapies/:id/report - Genera report PDF
  static async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const reportBuffer = await TherapyService.generateTherapyReport(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="therapy-report-${id}.pdf"`);
      res.send(reportBuffer);
    } catch (error) {
      next(error);
    }
  }
}
