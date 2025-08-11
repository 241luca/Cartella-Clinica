import { PrismaClient, ClinicalRecord, Prisma } from '@prisma/client';
import { generateUniqueCode } from '../utils/validators';

const prisma = new PrismaClient();

export interface ClinicalRecordTemplate {
  name: string;
  diagnosis: string;
  objective: string;
  treatmentPlan: string;
  notes?: string;
}

// Template predefiniti per diagnosi comuni
export const CLINICAL_TEMPLATES: ClinicalRecordTemplate[] = [
  {
    name: 'Lombalgia acuta',
    diagnosis: 'Lombalgia acuta',
    objective: 'Riduzione del dolore e recupero funzionale',
    treatmentPlan: 'Terapia antalgica, mobilizzazione, rinforzo muscolare',
    notes: 'Valutare evoluzione dopo 5 sedute'
  },
  {
    name: 'Cervicalgia',
    diagnosis: 'Cervicalgia muscolo-tensiva',
    objective: 'Riduzione contratture e miglioramento mobilità cervicale',
    treatmentPlan: 'Massoterapia, mobilizzazioni, TENS',
    notes: 'Educare il paziente sulla postura corretta'
  },
  {
    name: 'Spalla dolorosa',
    diagnosis: 'Sindrome da conflitto sub-acromiale',
    objective: 'Recupero ROM articolare e riduzione dolore',
    treatmentPlan: 'Laser terapia, mobilizzazioni, esercizi pendolari',
    notes: 'Progressione graduale degli esercizi'
  },
  {
    name: 'Gonartrosi',
    diagnosis: 'Gonartrosi bilaterale',
    objective: 'Riduzione dolore e miglioramento funzionalità',
    treatmentPlan: 'Magnetoterapia, rinforzo quadricipite, mobilizzazioni',
    notes: 'Considerare idrokinesiterapia'
  },
  {
    name: 'Distorsione caviglia',
    diagnosis: 'Distorsione tibio-tarsica di I-II grado',
    objective: 'Riassorbimento edema e recupero propriocettivo',
    treatmentPlan: 'Laser, ultrasuoni, esercizi propriocettivi',
    notes: 'Bendaggio funzionale nelle prime sedute'
  },
  {
    name: 'Post-chirurgico ginocchio',
    diagnosis: 'Esiti di artroscopia/protesi ginocchio',
    objective: 'Recupero articolarità e forza muscolare',
    treatmentPlan: 'Mobilizzazione passiva/attiva, rinforzo, propriocezione',
    notes: 'Rispettare i tempi biologici di guarigione'
  },
  {
    name: 'Tendinite',
    diagnosis: 'Tendinite/tendinosi',
    objective: 'Riduzione flogosi e recupero funzionale',
    treatmentPlan: 'Tecar terapia, eccentrici, stretching',
    notes: 'Valutare carico progressivo'
  },
  {
    name: 'Sciatalgia',
    diagnosis: 'Lombosciatalgia',
    objective: 'Riduzione sintomatologia radicolare',
    treatmentPlan: 'Terapia antalgica, decompressione, rinforzo core',
    notes: 'Monitorare sintomi neurologici'
  },
  {
    name: 'Linfedema',
    diagnosis: 'Linfedema arto superiore/inferiore',
    objective: 'Riduzione edema e mantenimento risultati',
    treatmentPlan: 'Linfodrenaggio manuale, bendaggio, pressoterapia',
    notes: 'Educare all'auto-trattamento'
  },
  {
    name: 'Frattura',
    diagnosis: 'Esiti di frattura',
    objective: 'Recupero funzionale completo',
    treatmentPlan: 'Magnetoterapia, mobilizzazioni, rinforzo progressivo',
    notes: 'Verificare consolidamento radiografico'
  },
  {
    name: 'Emiplegia',
    diagnosis: 'Emiplegia/emiparesi',
    objective: 'Recupero neuromotorio e autonomia',
    treatmentPlan: 'Neuroriabilitazione, facilitazioni, training del passo',
    notes: 'Approccio multidisciplinare'
  },
  {
    name: 'Riabilitazione respiratoria',
    diagnosis: 'Insufficienza respiratoria',
    objective: 'Miglioramento funzione respiratoria',
    treatmentPlan: 'Ginnastica respiratoria, drenaggio, ricondizionamento',
    notes: 'Monitorare saturazione O2'
  }
];

class ClinicalRecordService {
  /**
   * Crea una nuova cartella clinica
   */
  async createRecord(data: {
    patientId: string;
    diagnosis: string;
    objective?: string;
    anamnesis?: string;
    clinicalExamination?: string;
    treatmentPlan?: string;
    notes?: string;
    recordNumber?: string;
  }) {
    try {
      // Genera numero cartella se non fornito
      const recordNumber = data.recordNumber || generateUniqueCode('CC');

      // Verifica che non ci siano altre cartelle aperte per il paziente
      const openRecords = await prisma.clinicalRecord.findFirst({
        where: {
          patientId: data.patientId,
          closedAt: null
        }
      });

      if (openRecords) {
        throw new Error('Il paziente ha già una cartella clinica aperta');
      }

      const record = await prisma.clinicalRecord.create({
        data: {
          ...data,
          recordNumber,
          status: 'ACTIVE'
        },
        include: {
          patient: true,
          therapies: true
        }
      });

      return record;
    } catch (error) {
      console.error('Error creating clinical record:', error);
      throw error;
    }
  }

  /**
   * Crea una cartella clinica da template
   */
  async createFromTemplate(patientId: string, templateName: string, customData?: any) {
    try {
      const template = CLINICAL_TEMPLATES.find(t => t.name === templateName);
      if (!template) {
        throw new Error('Template non trovato');
      }

      const recordData = {
        patientId,
        diagnosis: template.diagnosis,
        objective: template.objective,
        treatmentPlan: template.treatmentPlan,
        notes: template.notes,
        ...customData
      };

      return this.createRecord(recordData);
    } catch (error) {
      console.error('Error creating record from template:', error);
      throw error;
    }
  }

  /**
   * Aggiorna una sezione specifica della cartella
   */
  async updateSection(
    recordId: string,
    section: 'anamnesis' | 'clinicalExamination' | 'diagnosis' | 'objective' | 'treatmentPlan' | 'notes',
    content: string
  ) {
    try {
      const updateData: any = {};
      updateData[section] = content;

      const record = await prisma.clinicalRecord.update({
        where: { id: recordId },
        data: updateData
      });

      return record;
    } catch (error) {
      console.error('Error updating record section:', error);
      throw error;
    }
  }

  /**
   * Aggiunge una terapia alla cartella
   */
  async addTherapy(recordId: string, therapyData: {
    type: string;
    objective: string;
    parameters?: any;
    sessionsPlanned: number;
    frequency?: string;
    startDate: Date;
    endDate?: Date;
  }) {
    try {
      const therapy = await prisma.therapy.create({
        data: {
          clinicalRecordId: recordId,
          ...therapyData,
          status: 'SCHEDULED'
        },
        include: {
          sessions: true
        }
      });

      return therapy;
    } catch (error) {
      console.error('Error adding therapy to record:', error);
      throw error;
    }
  }

  /**
   * Chiude una cartella clinica
   */
  async closeRecord(recordId: string, closureNotes?: string) {
    try {
      // Verifica che tutte le terapie siano completate o cancellate
      const activeTherapies = await prisma.therapy.count({
        where: {
          clinicalRecordId: recordId,
          status: {
            in: ['IN_PROGRESS', 'SCHEDULED']
          }
        }
      });

      if (activeTherapies > 0) {
        throw new Error('Impossibile chiudere: ci sono terapie ancora attive');
      }

      const record = await prisma.clinicalRecord.update({
        where: { id: recordId },
        data: {
          closedAt: new Date(),
          status: 'CLOSED',
          notes: closureNotes ? 
            prisma.raw(`COALESCE(notes, '') || E'\\n\\nNote di chiusura: ${closureNotes}'`) : 
            undefined
        }
      });

      return record;
    } catch (error) {
      console.error('Error closing record:', error);
      throw error;
    }
  }

  /**
   * Riapre una cartella clinica chiusa
   */
  async reopenRecord(recordId: string, reason: string) {
    try {
      const record = await prisma.clinicalRecord.update({
        where: { id: recordId },
        data: {
          closedAt: null,
          status: 'ACTIVE',
          notes: prisma.raw(`COALESCE(notes, '') || E'\\n\\nRiaperta il ${new Date().toISOString()}: ${reason}'`)
        }
      });

      return record;
    } catch (error) {
      console.error('Error reopening record:', error);
      throw error;
    }
  }

  /**
   * Ottiene la timeline degli eventi della cartella
   */
  async getRecordTimeline(recordId: string) {
    try {
      const record = await prisma.clinicalRecord.findUnique({
        where: { id: recordId },
        include: {
          therapies: {
            include: {
              sessions: {
                orderBy: { scheduledAt: 'desc' }
              }
            }
          },
          vitalSigns: {
            orderBy: { measuredAt: 'desc' }
          },
          bodyMappings: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!record) {
        throw new Error('Cartella clinica non trovata');
      }

      // Costruisci timeline unificata
      const events = [];

      // Aggiungi apertura cartella
      events.push({
        type: 'RECORD_CREATED',
        date: record.createdAt,
        description: 'Apertura cartella clinica',
        data: { diagnosis: record.diagnosis }
      });

      // Aggiungi terapie
      record.therapies.forEach(therapy => {
        events.push({
          type: 'THERAPY_ADDED',
          date: therapy.createdAt,
          description: `Aggiunta terapia: ${therapy.type}`,
          data: therapy
        });

        // Aggiungi sessioni
        therapy.sessions.forEach(session => {
          events.push({
            type: 'SESSION',
            date: session.scheduledAt,
            description: `Seduta ${therapy.type}`,
            status: session.status,
            data: session
          });
        });
      });

      // Aggiungi parametri vitali
      record.vitalSigns.forEach(vital => {
        events.push({
          type: 'VITAL_SIGNS',
          date: vital.measuredAt,
          description: 'Rilevazione parametri vitali',
          data: vital
        });
      });

      // Aggiungi mappature corpo
      record.bodyMappings.forEach(mapping => {
        events.push({
          type: 'BODY_MAPPING',
          date: mapping.createdAt,
          description: `Mappatura zona: ${mapping.zone}`,
          data: mapping
        });
      });

      // Se chiusa, aggiungi evento chiusura
      if (record.closedAt) {
        events.push({
          type: 'RECORD_CLOSED',
          date: record.closedAt,
          description: 'Chiusura cartella clinica'
        });
      }

      // Ordina per data decrescente
      events.sort((a, b) => b.date.getTime() - a.date.getTime());

      return events;
    } catch (error) {
      console.error('Error getting record timeline:', error);
      throw error;
    }
  }

  /**
   * Ottiene statistiche della cartella
   */
  async getRecordStatistics(recordId: string) {
    try {
      const record = await prisma.clinicalRecord.findUnique({
        where: { id: recordId },
        include: {
          therapies: {
            include: {
              sessions: true
            }
          },
          vitalSigns: true
        }
      });

      if (!record) {
        throw new Error('Cartella clinica non trovata');
      }

      // Calcola statistiche
      const totalTherapies = record.therapies.length;
      const completedTherapies = record.therapies.filter(t => t.status === 'COMPLETED').length;
      const activeTherapies = record.therapies.filter(t => t.status === 'IN_PROGRESS').length;
      
      let totalSessions = 0;
      let completedSessions = 0;
      let cancelledSessions = 0;
      let averageVAS = 0;
      let vasCount = 0;

      record.therapies.forEach(therapy => {
        totalSessions += therapy.sessions.length;
        completedSessions += therapy.sessions.filter(s => s.status === 'COMPLETED').length;
        cancelledSessions += therapy.sessions.filter(s => s.status === 'CANCELLED').length;
        
        therapy.sessions.forEach(session => {
          if (session.vasScore !== null) {
            averageVAS += session.vasScore;
            vasCount++;
          }
        });
      });

      if (vasCount > 0) {
        averageVAS = averageVAS / vasCount;
      }

      // Calcola durata
      const startDate = record.createdAt;
      const endDate = record.closedAt || new Date();
      const durationDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        recordNumber: record.recordNumber,
        status: record.status,
        durationDays,
        totalTherapies,
        completedTherapies,
        activeTherapies,
        totalSessions,
        completedSessions,
        cancelledSessions,
        sessionCompletionRate: totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(1) : 0,
        averageVAS: averageVAS.toFixed(1),
        vitalSignsCount: record.vitalSigns.length,
        lastUpdate: record.updatedAt
      };
    } catch (error) {
      console.error('Error getting record statistics:', error);
      throw error;
    }
  }

  /**
   * Cerca cartelle cliniche
   */
  async searchRecords(params: {
    patientId?: string;
    status?: 'ACTIVE' | 'CLOSED';
    diagnosis?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    try {
      const where: Prisma.ClinicalRecordWhereInput = {};

      if (params.patientId) where.patientId = params.patientId;
      if (params.status) where.status = params.status;
      if (params.diagnosis) {
        where.diagnosis = {
          contains: params.diagnosis,
          mode: 'insensitive'
        };
      }
      if (params.dateFrom || params.dateTo) {
        where.createdAt = {};
        if (params.dateFrom) where.createdAt.gte = params.dateFrom;
        if (params.dateTo) where.createdAt.lte = params.dateTo;
      }

      const page = params.page || 1;
      const limit = params.limit || 10;
      const skip = (page - 1) * limit;

      const [records, total] = await Promise.all([
        prisma.clinicalRecord.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: true,
            therapies: {
              select: {
                id: true,
                type: true,
                status: true
              }
            },
            _count: {
              select: {
                therapies: true,
                vitalSigns: true
              }
            }
          }
        }),
        prisma.clinicalRecord.count({ where })
      ]);

      return {
        data: records,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error searching records:', error);
      throw error;
    }
  }
}

export default new ClinicalRecordService();