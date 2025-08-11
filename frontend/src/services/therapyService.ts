import api from './api';

export interface TherapyType {
  id: string;
  name: string;
  description?: string;
  fields: any;
}

export interface Therapy {
  id: string;
  patientId: string;
  clinicalRecordId: string;
  therapyTypeId: string;
  therapyType?: TherapyType;
  parameters: any;
  prescribedSessions: number;
  completedSessions: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  therapyId: string;
  sessionNumber: number;
  date: string;
  completed: boolean;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  therapistId?: string;
  therapist?: any;
}

export interface CreateTherapyDto {
  patientId: string;
  clinicalRecordId: string;
  therapyTypeId: string;
  parameters: any;
  prescribedSessions: number;
  notes?: string;
}

export interface UpdateSessionDto {
  completed: boolean;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
}

class TherapyService {
  /**
   * Inizializza i tipi di terapia nel database
   * Da chiamare solo la prima volta per popolare il DB
   */
  async initializeTherapyTypes(): Promise<void> {
    try {
      await api.post('/therapies/initialize-types');
      console.log('Tipi di terapia inizializzati con successo');
    } catch (error) {
      console.error('Errore nell\'inizializzazione dei tipi di terapia:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutte le terapie con paginazione e filtri
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ therapies: any[]; totalPages: number }> {
    try {
      const response = await api.get('/therapies', { params });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle terapie:', error);
      // Ritorna dati mock in caso di errore
      return { therapies: [], totalPages: 1 };
    }
  }

  /**
   * Ottiene tutti i tipi di terapia disponibili
   */
  async getTherapyTypes(): Promise<TherapyType[]> {
    try {
      const response = await api.get('/therapies/types');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero dei tipi di terapia:', error);
      throw error;
    }
  }

  /**
   * Crea una nuova terapia per un paziente
   */
  async createTherapy(data: CreateTherapyDto): Promise<Therapy> {
    try {
      const response = await api.post('/therapies', data);
      return response.data;
    } catch (error) {
      console.error('Errore nella creazione della terapia:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutte le terapie di un paziente
   */
  async getByPatient(patientId: string): Promise<Therapy[]> {
    try {
      const response = await api.get(`/patients/${patientId}/therapies`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle terapie del paziente:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutte le terapie di una cartella clinica
   */
  async getByClinicalRecord(clinicalRecordId: string): Promise<Therapy[]> {
    try {
      const response = await api.get(`/clinical-records/${clinicalRecordId}/therapies`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle terapie della cartella clinica:', error);
      throw error;
    }
  }

  /**
   * Ottiene i dettagli di una singola terapia
   */
  async getById(therapyId: string): Promise<Therapy> {
    try {
      const response = await api.get(`/therapies/${therapyId}`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero della terapia:', error);
      throw error;
    }
  }

  /**
   * Aggiorna una terapia esistente
   */
  async updateTherapy(therapyId: string, data: Partial<CreateTherapyDto>): Promise<Therapy> {
    try {
      const response = await api.put(`/therapies/${therapyId}`, data);
      return response.data;
    } catch (error) {
      console.error('Errore nell\'aggiornamento della terapia:', error);
      throw error;
    }
  }

  /**
   * Elimina una terapia
   */
  async deleteTherapy(therapyId: string): Promise<void> {
    try {
      await api.delete(`/therapies/${therapyId}`);
    } catch (error) {
      console.error('Errore nell\'eliminazione della terapia:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutte le sessioni di una terapia
   */
  async getSessions(therapyId: string): Promise<Session[]> {
    try {
      const response = await api.get(`/therapies/${therapyId}/sessions`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle sessioni:', error);
      throw error;
    }
  }

  /**
   * Crea una nuova sessione per una terapia
   */
  async createSession(therapyId: string, data?: Partial<UpdateSessionDto>): Promise<Session> {
    try {
      const response = await api.post(`/therapies/${therapyId}/sessions`, data || {});
      return response.data;
    } catch (error) {
      console.error('Errore nella creazione della sessione:', error);
      throw error;
    }
  }

  /**
   * Aggiorna una sessione esistente
   */
  async updateSession(sessionId: string, data: UpdateSessionDto): Promise<Session> {
    try {
      const response = await api.put(`/sessions/${sessionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Errore nell\'aggiornamento della sessione:', error);
      throw error;
    }
  }

  /**
   * Segna una sessione come completata
   */
  async completeSession(sessionId: string, vasScores?: { before?: number; after?: number; notes?: string }): Promise<Session> {
    try {
      const data: UpdateSessionDto = {
        completed: true,
        vasScoreBefore: vasScores?.before,
        vasScoreAfter: vasScores?.after,
        notes: vasScores?.notes
      };
      return await this.updateSession(sessionId, data);
    } catch (error) {
      console.error('Errore nel completamento della sessione:', error);
      throw error;
    }
  }

  /**
   * Ottiene le statistiche delle terapie di un paziente
   */
  async getPatientStats(patientId: string): Promise<any> {
    try {
      const response = await api.get(`/patients/${patientId}/therapy-stats`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
      throw error;
    }
  }

  /**
   * Ottiene le terapie in corso (non completate)
   */
  async getActiveTherapies(patientId?: string): Promise<Therapy[]> {
    try {
      const url = patientId 
        ? `/patients/${patientId}/therapies/active`
        : '/therapies/active';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle terapie attive:', error);
      throw error;
    }
  }

  /**
   * Genera un report PDF delle terapie
   */
  async generateReport(therapyId: string): Promise<Blob> {
    try {
      const response = await api.get(`/therapies/${therapyId}/report`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Errore nella generazione del report:', error);
      throw error;
    }
  }
}

// Esporta un'istanza singleton del servizio
const therapyService = new TherapyService();
export default therapyService;
