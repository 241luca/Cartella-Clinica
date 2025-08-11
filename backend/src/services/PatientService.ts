import { PrismaClient, Patient, Prisma } from '@prisma/client';
import { calculateAge, validateItalianFiscalCode } from '../utils/validators';

const prisma = new PrismaClient();

export interface PatientWithRelations extends Patient {
  clinicalRecords?: any[];
  therapies?: any[];
  documents?: any[];
  vitalSigns?: any[];
  consents?: any[];
}

export interface PatientSearchParams {
  searchTerm?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  hasActiveRecord?: boolean;
  hasConsent?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PatientStatistics {
  totalRecords: number;
  totalTherapies: number;
  completedTherapies: number;
  activeTherapies: number;
  totalSessions: number;
  completedSessions: number;
  lastVisit?: Date;
  nextAppointment?: Date;
  averageVAS?: number;
  documentsCount: number;
}

class PatientService {
  /**
   * Ottiene un paziente con tutte le relazioni
   */
  async getPatientWithFullHistory(id: string): Promise<PatientWithRelations | null> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          clinicalRecords: {
            include: {
              therapies: {
                include: {
                  sessions: true
                }
              },
              vitalSigns: true,
              bodyMappings: true
            },
            orderBy: { createdAt: 'desc' }
          },
          documents: {
            orderBy: { uploadedAt: 'desc' }
          },
          vitalSigns: {
            orderBy: { measuredAt: 'desc' },
            take: 10
          },
          consents: {
            orderBy: { consentDate: 'desc' }
          }
        }
      });

      return patient;
    } catch (error) {
      console.error('Error getting patient with full history:', error);
      throw error;
    }
  }

  /**
   * Ricerca avanzata pazienti con filtri multipli
   */
  async searchAdvanced(params: PatientSearchParams) {
    const {
      searchTerm = '',
      gender,
      minAge,
      maxAge,
      hasActiveRecord,
      hasConsent,
      sortBy = 'lastName',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = params;

    try {
      // Costruzione query di ricerca
      const where: Prisma.PatientWhereInput = {};

      // Ricerca testuale (nome, cognome, CF, email, telefono)
      if (searchTerm) {
        where.OR = [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { fiscalCode: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } }
        ];
      }

      // Filtro genere
      if (gender) {
        where.gender = gender as any;
      }

      // Filtro età
      if (minAge || maxAge) {
        const today = new Date();
        if (maxAge) {
          const minBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
          where.birthDate = { ...where.birthDate, gte: minBirthDate };
        }
        if (minAge) {
          const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
          where.birthDate = { ...where.birthDate, lte: maxBirthDate };
        }
      }

      // Filtro cartelle attive
      if (hasActiveRecord !== undefined) {
        where.clinicalRecords = hasActiveRecord 
          ? { some: { closedAt: null } }
          : { none: { closedAt: null } };
      }

      // Filtro consensi
      if (hasConsent !== undefined) {
        where.consents = hasConsent
          ? { some: { type: 'PRIVACY', given: true } }
          : { none: { type: 'PRIVACY', given: true } };
      }

      // Esecuzione query con paginazione
      const skip = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            clinicalRecords: {
              where: { closedAt: null },
              select: { id: true }
            },
            consents: {
              where: { type: 'PRIVACY' },
              select: { given: true }
            },
            _count: {
              select: {
                clinicalRecords: true,
                documents: true
              }
            }
          }
        }),
        prisma.patient.count({ where })
      ]);

      // Calcolo età per ogni paziente
      const patientsWithAge = patients.map(patient => ({
        ...patient,
        age: calculateAge(patient.birthDate)
      }));

      return {
        data: patientsWithAge,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in advanced patient search:', error);
      throw error;
    }
  }

  /**
   * Calcola statistiche complete del paziente
   */
  async getPatientStatistics(patientId: string): Promise<PatientStatistics> {
    try {
      // Recupera tutti i dati necessari
      const [
        recordsCount,
        therapiesData,
        sessionsData,
        documentsCount,
        lastVitalSigns,
        nextSession
      ] = await Promise.all([
        // Conta cartelle cliniche
        prisma.clinicalRecord.count({
          where: { patientId }
        }),
        
        // Conta e analizza terapie
        prisma.therapy.findMany({
          where: { 
            clinicalRecord: { patientId }
          },
          select: {
            status: true,
            sessions: {
              select: { status: true }
            }
          }
        }),
        
        // Analizza sessioni
        prisma.therapySession.findMany({
          where: {
            therapy: {
              clinicalRecord: { patientId }
            }
          },
          select: {
            status: true,
            scheduledAt: true,
            vasScore: true
          },
          orderBy: { scheduledAt: 'desc' }
        }),
        
        // Conta documenti
        prisma.document.count({
          where: { patientId }
        }),
        
        // Ultimi parametri vitali
        prisma.vitalSign.findFirst({
          where: { patientId },
          orderBy: { measuredAt: 'desc' }
        }),
        
        // Prossimo appuntamento
        prisma.therapySession.findFirst({
          where: {
            therapy: {
              clinicalRecord: { patientId }
            },
            status: 'SCHEDULED',
            scheduledAt: { gte: new Date() }
          },
          orderBy: { scheduledAt: 'asc' }
        })
      ]);

      // Calcola statistiche terapie
      const totalTherapies = therapiesData.length;
      const completedTherapies = therapiesData.filter(t => t.status === 'COMPLETED').length;
      const activeTherapies = therapiesData.filter(t => t.status === 'IN_PROGRESS').length;

      // Calcola statistiche sessioni
      const totalSessions = sessionsData.length;
      const completedSessions = sessionsData.filter(s => s.status === 'COMPLETED').length;
      
      // Calcola VAS media
      const vasScores = sessionsData
        .filter(s => s.vasScore !== null)
        .map(s => s.vasScore as number);
      const averageVAS = vasScores.length > 0 
        ? vasScores.reduce((a, b) => a + b, 0) / vasScores.length 
        : undefined;

      // Ultima visita
      const lastVisit = sessionsData.length > 0 && sessionsData[0].status === 'COMPLETED'
        ? sessionsData[0].scheduledAt
        : undefined;

      return {
        totalRecords: recordsCount,
        totalTherapies,
        completedTherapies,
        activeTherapies,
        totalSessions,
        completedSessions,
        lastVisit,
        nextAppointment: nextSession?.scheduledAt,
        averageVAS,
        documentsCount
      };
    } catch (error) {
      console.error('Error calculating patient statistics:', error);
      throw error;
    }
  }

  /**
   * Valida il codice fiscale italiano
   */
  validateFiscalCode(fiscalCode: string): boolean {
    return validateItalianFiscalCode(fiscalCode);
  }

  /**
   * Calcola l'età del paziente
   */
  calculatePatientAge(birthDate: Date): number {
    return calculateAge(birthDate);
  }

  /**
   * Crea un nuovo paziente con validazioni
   */
  async createPatient(data: Prisma.PatientCreateInput) {
    try {
      // Valida codice fiscale
      if (data.fiscalCode && !this.validateFiscalCode(data.fiscalCode)) {
        throw new Error('Codice fiscale non valido');
      }

      // Verifica unicità codice fiscale
      if (data.fiscalCode) {
        const existing = await prisma.patient.findUnique({
          where: { fiscalCode: data.fiscalCode }
        });
        if (existing) {
          throw new Error('Codice fiscale già presente nel sistema');
        }
      }

      // Crea il paziente
      const patient = await prisma.patient.create({
        data,
        include: {
          consents: true
        }
      });

      // Crea consensi di default (non dati)
      await prisma.consent.createMany({
        data: [
          {
            patientId: patient.id,
            type: 'PRIVACY',
            given: false,
            consentDate: new Date()
          },
          {
            patientId: patient.id,
            type: 'MARKETING',
            given: false,
            consentDate: new Date()
          }
        ]
      });

      return patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  /**
   * Aggiorna un paziente
   */
  async updatePatient(id: string, data: Prisma.PatientUpdateInput) {
    try {
      // Se si sta aggiornando il CF, validalo
      if (data.fiscalCode && typeof data.fiscalCode === 'string') {
        if (!this.validateFiscalCode(data.fiscalCode)) {
          throw new Error('Codice fiscale non valido');
        }

        // Verifica unicità
        const existing = await prisma.patient.findFirst({
          where: {
            fiscalCode: data.fiscalCode,
            id: { not: id }
          }
        });
        if (existing) {
          throw new Error('Codice fiscale già presente nel sistema');
        }
      }

      const patient = await prisma.patient.update({
        where: { id },
        data,
        include: {
          consents: true,
          _count: {
            select: {
              clinicalRecords: true,
              documents: true
            }
          }
        }
      });

      return patient;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  /**
   * Elimina un paziente (soft delete)
   */
  async deletePatient(id: string) {
    try {
      // Verifica che non ci siano cartelle cliniche aperte
      const openRecords = await prisma.clinicalRecord.count({
        where: {
          patientId: id,
          closedAt: null
        }
      });

      if (openRecords > 0) {
        throw new Error('Impossibile eliminare: il paziente ha cartelle cliniche aperte');
      }

      // Soft delete (marca come deleted)
      const patient = await prisma.patient.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });

      return patient;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  /**
   * Esporta i dati del paziente in formato JSON
   */
  async exportPatientData(patientId: string) {
    try {
      const patientData = await this.getPatientWithFullHistory(patientId);
      if (!patientData) {
        throw new Error('Paziente non trovato');
      }

      // Rimuovi dati sensibili se necessario
      const exportData = {
        ...patientData,
        createdAt: patientData.createdAt.toISOString(),
        updatedAt: patientData.updatedAt.toISOString(),
        birthDate: patientData.birthDate.toISOString()
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting patient data:', error);
      throw error;
    }
  }
}

export default new PatientService();