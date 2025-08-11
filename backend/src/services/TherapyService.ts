import { PrismaClient, Therapy, TherapySession, TherapyStatus, SessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ================== INTERFACCE PER I PARAMETRI SPECIFICI DI OGNI TERAPIA ==================

export interface LimfaterapyParams {
  sedute: number;
  programma: string;
  modalita: 'auto' | 'manuale';
  descrizione: string;
}

export interface LaserYag145Params {
  watt: number;
  joulePerPulse: number;
  pulse: number;
  dose: number;
  distretto: string;
}

export interface Laser810980Params {
  watt: number;
  joulePerPulse: number;
  pulse: number;
  dose: number;
  distretto: string;
}

export interface LaserScanParams {
  potenza: number;
  drenaggio: boolean;
  normale: boolean;
  radiofrequenza: number;
  temperatura: number;
  distretto: string;
}

export interface MagnetoterapiaParams {
  programma: number;
  hertz: number;
  intensita: number;
  tempo: number;
}

export interface TensParams {
  tempo: number;
  tipo: string;
  distretto: string;
}

export interface UltrasuoniParams {
  mhz: number;
  watt: number;
  tempo: number;
  inAcqua: boolean;
}

export interface ElettrostimolazioneParams {
  distretto: string;
  programma: string;
  intensita: number;
}

export interface MassoterapiaParams {
  tipo: string;
  distretto: string;
  durata: number;
}

export interface MobilizzazioniParams {
  distretto: string;
  tipo: string;
  note: string;
}

export interface TecarsinParams {
  programma: string;
  potenza: number;
  tempo: number;
}

export interface SITParams {
  distretto: string;
  farmaco: string;
}

export interface TecalabParams {
  sedute: number;
  programma: string;
}

// ================== ENUM PER I TIPI DI TERAPIA ==================

export enum TherapyTypeCode {
  LIMFATERAPY = 'LIMFATERAPY',
  LASER_YAG_145 = 'LASER_YAG_145',
  LASER_810_980 = 'LASER_810_980',
  LASER_SCAN = 'LASER_SCAN',
  MAGNETOTERAPIA = 'MAGNETOTERAPIA',
  TENS = 'TENS',
  ULTRASUONI = 'ULTRASUONI',
  ELETTROSTIMOLAZIONE = 'ELETTROSTIMOLAZIONE',
  MASSOTERAPIA = 'MASSOTERAPIA',
  MOBILIZZAZIONI = 'MOBILIZZAZIONI',
  TECARSIN = 'TECARSIN',
  SIT = 'SIT',
  TECALAB = 'TECALAB'
}

// ================== INTERFACCE GENERALI ==================

export interface CreateTherapyPlanData {
  clinicalRecordId: string;
  therapyTypeCode: TherapyTypeCode;
  prescribedSessions: number;
  startDate: Date;
  frequency?: string;
  district?: string;
  notes?: string;
  parameters: any; // Parametri specifici per tipo di terapia
}

export interface ScheduleSessionData {
  therapyId: string;
  therapistId: string;
  sessionDate: Date;
  duration?: number;
}

export interface UpdateSessionProgressData {
  sessionId: string;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  variations?: string;
  notes?: string;
  parameters?: any;
  status?: SessionStatus;
}

export interface TherapyStatistics {
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  averageVASImprovement: number;
  completionRate: number;
  nextSession?: Date;
  lastSession?: Date;
}

// ================== CLASSE PRINCIPALE DEL SERVIZIO ==================

class TherapyService {
  
  /**
   * Inizializza i tipi di terapia nel database
   */
  async initializeTherapyTypes(): Promise<void> {
    const therapyTypes = [
      {
        code: TherapyTypeCode.LIMFATERAPY,
        name: 'Linfaterapy',
        category: 'DRENAGGIO',
        description: 'Terapia di drenaggio linfatico',
        defaultDuration: 45,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          sedute: { type: 'number', required: true },
          programma: { type: 'string', required: true },
          modalita: { type: 'enum', values: ['auto', 'manuale'], required: true },
          descrizione: { type: 'string', required: false }
        }
      },
      {
        code: TherapyTypeCode.LASER_YAG_145,
        name: 'Laser YAG 145',
        category: 'LASERTERAPIA',
        description: 'Laserterapia YAG ad alta potenza',
        defaultDuration: 20,
        defaultSessions: 10,
        requiresDoctor: true,
        requiresEquipment: true,
        parametersSchema: {
          watt: { type: 'number', required: true },
          joulePerPulse: { type: 'number', required: true },
          pulse: { type: 'number', required: true },
          dose: { type: 'number', required: true },
          distretto: { type: 'string', required: true }
        }
      },
      {
        code: TherapyTypeCode.LASER_810_980,
        name: 'Laser 810+980',
        category: 'LASERTERAPIA',
        description: 'Laserterapia a doppia lunghezza d\'onda',
        defaultDuration: 20,
        defaultSessions: 10,
        requiresDoctor: true,
        requiresEquipment: true,
        parametersSchema: {
          watt: { type: 'number', required: true },
          joulePerPulse: { type: 'number', required: true },
          pulse: { type: 'number', required: true },
          dose: { type: 'number', required: true },
          distretto: { type: 'string', required: true }
        }
      },
      {
        code: TherapyTypeCode.LASER_SCAN,
        name: 'Laser Scanner',
        category: 'LASERTERAPIA',
        description: 'Laserterapia a scansione',
        defaultDuration: 15,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          potenza: { type: 'number', required: true },
          drenaggio: { type: 'boolean', required: true },
          normale: { type: 'boolean', required: true },
          radiofrequenza: { type: 'number', required: false },
          temperatura: { type: 'number', required: false },
          distretto: { type: 'string', required: true }
        }
      },
      {
        code: TherapyTypeCode.MAGNETOTERAPIA,
        name: 'Magnetoterapia',
        category: 'TERAPIA_FISICA',
        description: 'Terapia con campi magnetici',
        defaultDuration: 30,
        defaultSessions: 15,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          programma: { type: 'number', required: true },
          hertz: { type: 'number', required: true },
          intensita: { type: 'number', required: true },
          tempo: { type: 'number', required: true }
        }
      },
      {
        code: TherapyTypeCode.TENS,
        name: 'TENS',
        category: 'ELETTROTERAPIA',
        description: 'Elettrostimolazione antalgica',
        defaultDuration: 20,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          tempo: { type: 'number', required: true },
          tipo: { type: 'string', required: true },
          distretto: { type: 'string', required: true }
        }
      },
      {
        code: TherapyTypeCode.ULTRASUONI,
        name: 'Ultrasuoni',
        category: 'TERAPIA_FISICA',
        description: 'Terapia ad ultrasuoni',
        defaultDuration: 15,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          mhz: { type: 'number', required: true },
          watt: { type: 'number', required: true },
          tempo: { type: 'number', required: true },
          inAcqua: { type: 'boolean', required: true }
        }
      },
      {
        code: TherapyTypeCode.ELETTROSTIMOLAZIONE,
        name: 'Elettrostimolazione',
        category: 'ELETTROTERAPIA',
        description: 'Elettrostimolazione muscolare',
        defaultDuration: 30,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          distretto: { type: 'string', required: true },
          programma: { type: 'string', required: true },
          intensita: { type: 'number', required: true }
        }
      },
      {
        code: TherapyTypeCode.MASSOTERAPIA,
        name: 'Massoterapia',
        category: 'TERAPIA_MANUALE',
        description: 'Terapia manuale massoterapica',
        defaultDuration: 30,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: false,
        parametersSchema: {
          tipo: { type: 'string', required: true },
          distretto: { type: 'string', required: true },
          durata: { type: 'number', required: true }
        }
      },
      {
        code: TherapyTypeCode.MOBILIZZAZIONI,
        name: 'Mobilizzazioni',
        category: 'TERAPIA_MANUALE',
        description: 'Mobilizzazioni articolari',
        defaultDuration: 30,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: false,
        parametersSchema: {
          distretto: { type: 'string', required: true },
          tipo: { type: 'string', required: true },
          note: { type: 'string', required: false }
        }
      },
      {
        code: TherapyTypeCode.TECARSIN,
        name: 'Tecarsin',
        category: 'TECARTERAPIA',
        description: 'Tecarterapia capacitiva e resistiva',
        defaultDuration: 30,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          programma: { type: 'string', required: true },
          potenza: { type: 'number', required: true },
          tempo: { type: 'number', required: true }
        }
      },
      {
        code: TherapyTypeCode.SIT,
        name: 'SIT',
        category: 'TERAPIA_INFILTRATIVA',
        description: 'Sistema Infiltrativo Transcutaneo',
        defaultDuration: 15,
        defaultSessions: 5,
        requiresDoctor: true,
        requiresEquipment: true,
        parametersSchema: {
          distretto: { type: 'string', required: true },
          farmaco: { type: 'string', required: true }
        }
      },
      {
        code: TherapyTypeCode.TECALAB,
        name: 'Tecalab',
        category: 'TECARTERAPIA',
        description: 'Tecarterapia avanzata',
        defaultDuration: 30,
        defaultSessions: 10,
        requiresDoctor: false,
        requiresEquipment: true,
        parametersSchema: {
          sedute: { type: 'number', required: true },
          programma: { type: 'string', required: true }
        }
      }
    ];

    for (const therapyType of therapyTypes) {
      await prisma.therapyType.upsert({
        where: { code: therapyType.code },
        update: therapyType,
        create: therapyType
      });
    }
  }

  /**
   * Crea un nuovo piano terapeutico
   */
  async createTherapyPlan(data: CreateTherapyPlanData): Promise<Therapy> {
    try {
      // Verifica che il tipo di terapia esista
      const therapyType = await prisma.therapyType.findUnique({
        where: { code: data.therapyTypeCode }
      });

      if (!therapyType) {
        throw new Error(`Tipo di terapia ${data.therapyTypeCode} non trovato`);
      }

      // Verifica che la cartella clinica esista
      const clinicalRecord = await prisma.clinicalRecord.findUnique({
        where: { id: data.clinicalRecordId }
      });

      if (!clinicalRecord) {
        throw new Error('Cartella clinica non trovata');
      }

      // Valida i parametri specifici per il tipo di terapia
      this.validateTherapyParameters(data.therapyTypeCode, data.parameters);

      // Crea la terapia
      const therapy = await prisma.therapy.create({
        data: {
          clinicalRecordId: data.clinicalRecordId,
          therapyTypeId: therapyType.id,
          prescribedSessions: data.prescribedSessions,
          startDate: data.startDate,
          frequency: data.frequency,
          district: data.district,
          notes: data.notes,
          parameters: data.parameters,
          status: TherapyStatus.SCHEDULED
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

      return therapy;
    } catch (error) {
      console.error('Errore nella creazione del piano terapeutico:', error);
      throw error;
    }
  }

  /**
   * Pianifica una seduta terapeutica
   */
  async scheduleSession(data: ScheduleSessionData): Promise<TherapySession> {
    try {
      // Verifica che la terapia esista
      const therapy = await prisma.therapy.findUnique({
        where: { id: data.therapyId },
        include: {
          sessions: true,
          therapyType: true
        }
      });

      if (!therapy) {
        throw new Error('Terapia non trovata');
      }

      // Calcola il numero della seduta
      const sessionNumber = therapy.sessions.length + 1;

      if (sessionNumber > therapy.prescribedSessions) {
        throw new Error('Numero massimo di sedute raggiunto');
      }

      // Crea la seduta
      const session = await prisma.therapySession.create({
        data: {
          therapyId: data.therapyId,
          therapistId: data.therapistId,
          sessionNumber: sessionNumber,
          sessionDate: data.sessionDate,
          duration: data.duration || therapy.therapyType.defaultDuration,
          status: SessionStatus.SCHEDULED
        }
      });

      // Aggiorna lo stato della terapia se necessario
      if (therapy.status === TherapyStatus.SCHEDULED && sessionNumber === 1) {
        await prisma.therapy.update({
          where: { id: data.therapyId },
          data: { status: TherapyStatus.IN_PROGRESS }
        });
      }

      return session;
    } catch (error) {
      console.error('Errore nella pianificazione della seduta:', error);
      throw error;
    }
  }

  /**
   * Aggiorna i progressi di una seduta
   */
  async updateSessionProgress(data: UpdateSessionProgressData): Promise<TherapySession> {
    try {
      const session = await prisma.therapySession.update({
        where: { id: data.sessionId },
        data: {
          vasScoreBefore: data.vasScoreBefore,
          vasScoreAfter: data.vasScoreAfter,
          variations: data.variations,
          notes: data.notes,
          parameters: data.parameters,
          status: data.status || SessionStatus.COMPLETED,
          signedAt: data.status === SessionStatus.COMPLETED ? new Date() : undefined
        },
        include: {
          therapy: true
        }
      });

      // Se la seduta è completata, aggiorna il conteggio nella terapia
      if (data.status === SessionStatus.COMPLETED) {
        await prisma.therapy.update({
          where: { id: session.therapyId },
          data: {
            completedSessions: {
              increment: 1
            }
          }
        });

        // Verifica se tutte le sedute sono complete
        const therapy = await prisma.therapy.findUnique({
          where: { id: session.therapyId }
        });

        if (therapy && therapy.completedSessions >= therapy.prescribedSessions) {
          await prisma.therapy.update({
            where: { id: session.therapyId },
            data: {
              status: TherapyStatus.COMPLETED,
              endDate: new Date()
            }
          });
        }
      }

      return session;
    } catch (error) {
      console.error('Errore nell\'aggiornamento dei progressi:', error);
      throw error;
    }
  }

  /**
   * Calcola il miglioramento VAS per una terapia
   */
  async calculateVASImprovement(therapyId: string): Promise<number> {
    try {
      const sessions = await prisma.therapySession.findMany({
        where: {
          therapyId: therapyId,
          status: SessionStatus.COMPLETED,
          vasScoreBefore: { not: null },
          vasScoreAfter: { not: null }
        },
        orderBy: {
          sessionNumber: 'asc'
        }
      });

      if (sessions.length === 0) {
        return 0;
      }

      // Calcola il miglioramento medio
      let totalImprovement = 0;
      let validSessions = 0;

      for (const session of sessions) {
        if (session.vasScoreBefore !== null && session.vasScoreAfter !== null) {
          const improvement = session.vasScoreBefore - session.vasScoreAfter;
          totalImprovement += improvement;
          validSessions++;
        }
      }

      if (validSessions === 0) {
        return 0;
      }

      // Calcola anche il miglioramento tra prima e ultima seduta
      const firstSession = sessions[0];
      const lastSession = sessions[sessions.length - 1];
      
      let overallImprovement = 0;
      if (firstSession.vasScoreBefore !== null && lastSession.vasScoreAfter !== null) {
        overallImprovement = firstSession.vasScoreBefore - lastSession.vasScoreAfter;
      }

      // Ritorna la media tra miglioramento medio per seduta e miglioramento totale
      const averagePerSession = totalImprovement / validSessions;
      return (averagePerSession + overallImprovement) / 2;
    } catch (error) {
      console.error('Errore nel calcolo del miglioramento VAS:', error);
      throw error;
    }
  }

  /**
   * Ottiene i parametri specifici per tipo di terapia
   */
  async getParametersByType(type: TherapyTypeCode): Promise<any> {
    const therapyType = await prisma.therapyType.findUnique({
      where: { code: type }
    });

    if (!therapyType) {
      throw new Error(`Tipo di terapia ${type} non trovato`);
    }

    return therapyType.parametersSchema;
  }

  /**
   * Genera un report PDF per una terapia
   */
  async generateTherapyReport(therapyId: string): Promise<Buffer> {
    try {
      const therapy = await prisma.therapy.findUnique({
        where: { id: therapyId },
        include: {
          therapyType: true,
          clinicalRecord: {
            include: {
              patient: true
            }
          },
          sessions: {
            orderBy: {
              sessionNumber: 'asc'
            }
          }
        }
      });

      if (!therapy) {
        throw new Error('Terapia non trovata');
      }

      // TODO: Implementare generazione PDF con pdfkit
      // Per ora ritorniamo un buffer vuoto
      return Buffer.from('Report PDF da implementare');
    } catch (error) {
      console.error('Errore nella generazione del report:', error);
      throw error;
    }
  }

  /**
   * Ottiene le statistiche di una terapia
   */
  async getTherapyStatistics(therapyId: string): Promise<TherapyStatistics> {
    try {
      const therapy = await prisma.therapy.findUnique({
        where: { id: therapyId },
        include: {
          sessions: true
        }
      });

      if (!therapy) {
        throw new Error('Terapia non trovata');
      }

      const completedSessions = therapy.sessions.filter(s => s.status === SessionStatus.COMPLETED);
      const missedSessions = therapy.sessions.filter(s => s.status === SessionStatus.MISSED);
      const scheduledSessions = therapy.sessions.filter(s => s.status === SessionStatus.SCHEDULED);

      // Calcola miglioramento VAS medio
      const vasImprovement = await this.calculateVASImprovement(therapyId);

      // Trova prossima e ultima seduta
      const nextSession = scheduledSessions
        .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime())[0];
      const lastSession = completedSessions
        .sort((a, b) => b.sessionDate.getTime() - a.sessionDate.getTime())[0];

      return {
        totalSessions: therapy.prescribedSessions,
        completedSessions: completedSessions.length,
        missedSessions: missedSessions.length,
        averageVASImprovement: vasImprovement,
        completionRate: (completedSessions.length / therapy.prescribedSessions) * 100,
        nextSession: nextSession?.sessionDate,
        lastSession: lastSession?.sessionDate
      };
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
      throw error;
    }
  }

  // ================== METODI SPECIFICI PER OGNI TIPO DI TERAPIA ==================

  /**
   * Crea una terapia Limfaterapy
   */
  async createLimfaterapy(
    clinicalRecordId: string,
    params: LimfaterapyParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.LIMFATERAPY,
      prescribedSessions: params.sedute,
      startDate: new Date(),
      parameters: params
    });
  }

  /**
   * Crea una terapia Laser YAG 145
   */
  async createLaserYag(
    clinicalRecordId: string,
    params: LaserYag145Params
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.LASER_YAG_145,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Laser 810+980
   */
  async createLaser810980(
    clinicalRecordId: string,
    params: Laser810980Params
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.LASER_810_980,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Laser Scan
   */
  async createLaserScan(
    clinicalRecordId: string,
    params: LaserScanParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.LASER_SCAN,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Magnetoterapia
   */
  async createMagnetoterapia(
    clinicalRecordId: string,
    params: MagnetoterapiaParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.MAGNETOTERAPIA,
      prescribedSessions: 15, // Default
      startDate: new Date(),
      parameters: params
    });
  }

  /**
   * Crea una terapia TENS
   */
  async createTens(
    clinicalRecordId: string,
    params: TensParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.TENS,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Ultrasuoni
   */
  async createUltrasuoni(
    clinicalRecordId: string,
    params: UltrasuoniParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.ULTRASUONI,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      parameters: params
    });
  }

  /**
   * Crea una terapia Elettrostimolazione
   */
  async createElettrostimolazione(
    clinicalRecordId: string,
    params: ElettrostimolazioneParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.ELETTROSTIMOLAZIONE,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Massoterapia
   */
  async createMassoterapia(
    clinicalRecordId: string,
    params: MassoterapiaParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.MASSOTERAPIA,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Mobilizzazioni
   */
  async createMobilizzazioni(
    clinicalRecordId: string,
    params: MobilizzazioniParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.MOBILIZZAZIONI,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      district: params.distretto,
      notes: params.note,
      parameters: params
    });
  }

  /**
   * Crea una terapia Tecarsin
   */
  async createTecarsin(
    clinicalRecordId: string,
    params: TecarsinParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.TECARSIN,
      prescribedSessions: 10, // Default
      startDate: new Date(),
      parameters: params
    });
  }

  /**
   * Crea una terapia SIT
   */
  async createSIT(
    clinicalRecordId: string,
    params: SITParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.SIT,
      prescribedSessions: 5, // Default per SIT
      startDate: new Date(),
      district: params.distretto,
      parameters: params
    });
  }

  /**
   * Crea una terapia Tecalab
   */
  async createTecalab(
    clinicalRecordId: string,
    params: TecalabParams
  ): Promise<Therapy> {
    return this.createTherapyPlan({
      clinicalRecordId,
      therapyTypeCode: TherapyTypeCode.TECALAB,
      prescribedSessions: params.sedute,
      startDate: new Date(),
      parameters: params
    });
  }

  // ================== METODI DI UTILITÀ ==================

  /**
   * Valida i parametri specifici per tipo di terapia
   */
  private validateTherapyParameters(type: TherapyTypeCode, parameters: any): void {
    switch (type) {
      case TherapyTypeCode.LIMFATERAPY:
        if (!parameters.sedute || !parameters.programma || !parameters.modalita) {
          throw new Error('Parametri Limfaterapy incompleti');
        }
        if (parameters.modalita !== 'auto' && parameters.modalita !== 'manuale') {
          throw new Error('Modalità Limfaterapy non valida');
        }
        break;

      case TherapyTypeCode.LASER_YAG_145:
      case TherapyTypeCode.LASER_810_980:
        if (!parameters.watt || !parameters.joulePerPulse || !parameters.pulse || 
            !parameters.dose || !parameters.distretto) {
          throw new Error('Parametri Laser incompleti');
        }
        break;

      case TherapyTypeCode.LASER_SCAN:
        if (parameters.potenza === undefined || parameters.drenaggio === undefined || 
            parameters.normale === undefined || !parameters.distretto) {
          throw new Error('Parametri Laser Scan incompleti');
        }
        break;

      case TherapyTypeCode.MAGNETOTERAPIA:
        if (!parameters.programma || !parameters.hertz || !parameters.intensita || !parameters.tempo) {
          throw new Error('Parametri Magnetoterapia incompleti');
        }
        break;

      case TherapyTypeCode.TENS:
        if (!parameters.tempo || !parameters.tipo || !parameters.distretto) {
          throw new Error('Parametri TENS incompleti');
        }
        break;

      case TherapyTypeCode.ULTRASUONI:
        if (!parameters.mhz || !parameters.watt || !parameters.tempo || 
            parameters.inAcqua === undefined) {
          throw new Error('Parametri Ultrasuoni incompleti');
        }
        break;

      case TherapyTypeCode.ELETTROSTIMOLAZIONE:
        if (!parameters.distretto || !parameters.programma || !parameters.intensita) {
          throw new Error('Parametri Elettrostimolazione incompleti');
        }
        break;

      case TherapyTypeCode.MASSOTERAPIA:
        if (!parameters.tipo || !parameters.distretto || !parameters.durata) {
          throw new Error('Parametri Massoterapia incompleti');
        }
        break;

      case TherapyTypeCode.MOBILIZZAZIONI:
        if (!parameters.distretto || !parameters.tipo) {
          throw new Error('Parametri Mobilizzazioni incompleti');
        }
        break;

      case TherapyTypeCode.TECARSIN:
        if (!parameters.programma || !parameters.potenza || !parameters.tempo) {
          throw new Error('Parametri Tecarsin incompleti');
        }
        break;

      case TherapyTypeCode.SIT:
        if (!parameters.distretto || !parameters.farmaco) {
          throw new Error('Parametri SIT incompleti');
        }
        break;

      case TherapyTypeCode.TECALAB:
        if (!parameters.sedute || !parameters.programma) {
          throw new Error('Parametri Tecalab incompleti');
        }
        break;

      default:
        throw new Error(`Tipo di terapia ${type} non riconosciuto`);
    }
  }

  /**
   * Ottiene tutte le terapie di una cartella clinica
   */
  async getTherapiesByClinicalRecord(clinicalRecordId: string): Promise<Therapy[]> {
    return prisma.therapy.findMany({
      where: { clinicalRecordId },
      include: {
        therapyType: true,
        sessions: {
          orderBy: {
            sessionNumber: 'asc'
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  /**
   * Ottiene le sedute di oggi per un terapista
   */
  async getTodaySessionsForTherapist(therapistId: string): Promise<TherapySession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.therapySession.findMany({
      where: {
        therapistId,
        sessionDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        therapy: {
          include: {
            therapyType: true,
            clinicalRecord: {
              include: {
                patient: true
              }
            }
          }
        }
      },
      orderBy: {
        sessionDate: 'asc'
      }
    });
  }

  /**
   * Cancella una seduta
   */
  async cancelSession(sessionId: string, reason?: string): Promise<TherapySession> {
    return prisma.therapySession.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.CANCELLED,
        notes: reason || 'Seduta cancellata'
      }
    });
  }

  /**
   * Riprogramma una seduta
   */
  async rescheduleSession(sessionId: string, newDate: Date): Promise<TherapySession> {
    return prisma.therapySession.update({
      where: { id: sessionId },
      data: {
        sessionDate: newDate,
        status: SessionStatus.RESCHEDULED
      }
    });
  }
}

export default new TherapyService();
