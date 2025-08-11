import api from './api';

export interface TherapyType {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  defaultDuration: number;
  defaultSessions: number;
  parametersSchema: any;
}

export interface Therapy {
  id: string;
  clinicalRecordId: string;
  therapyTypeId: string;
  prescribedSessions: number;
  completedSessions: number;
  startDate: Date;
  endDate?: Date;
  frequency?: string;
  district?: string;
  status: string;
  notes?: string;
  parameters: any;
  therapyType?: TherapyType;
  clinicalRecord?: any;
  sessions?: TherapySession[];
}

export interface TherapySession {
  id: string;
  therapyId: string;
  therapistId: string;
  sessionNumber: number;
  sessionDate: Date;
  duration: number;
  status: string;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  parameters?: any;
  therapistSignature?: string;
  patientSignature?: string;
  signedAt?: Date;
  therapist?: any;
}

export interface CreateTherapyDto {
  clinicalRecordId: string;
  therapyTypeId: string;
  prescribedSessions: number;
  startDate: string;
  frequency?: string;
  district?: string;
  notes?: string;
  parameters?: any;
}

export interface UpdateTherapyDto {
  prescribedSessions?: number;
  startDate?: string;
  frequency?: string;
  district?: string;
  notes?: string;
  parameters?: any;
}

export interface CreateSessionDto {
  therapistId: string;
  sessionDate: string;
  duration: number;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  parameters?: any;
}

export interface UpdateSessionDto {
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'MISSED' | 'RESCHEDULED';
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  parameters?: any;
  therapistSignature?: string;
  patientSignature?: string;
}

class TherapyService {
  // Terapie
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    patientId?: string;
    clinicalRecordId?: string;
  }) {
    return api.get('/therapies', { params });
  }

  async getById(id: string) {
    return api.get(`/therapies/${id}`);
  }

  async create(data: CreateTherapyDto) {
    return api.post('/therapies', data);
  }

  async update(id: string, data: UpdateTherapyDto) {
    return api.put(`/therapies/${id}`, data);
  }

  async delete(id: string) {
    return api.delete(`/therapies/${id}`);
  }

  async updateStatus(id: string, status: string) {
    return api.put(`/therapies/${id}/status`, { status });
  }

  // Tipi di terapia
  async getTherapyTypes() {
    return api.get('/therapy-types');
  }

  async getParameterSchema(typeCode: string) {
    return api.get(`/therapies/types/${typeCode}/parameters`);
  }

  // Sessioni
  async getSessions(therapyId: string) {
    return api.get(`/therapies/${therapyId}/sessions`);
  }

  async createSession(therapyId: string, data: CreateSessionDto) {
    return api.post(`/therapies/${therapyId}/sessions`, data);
  }

  async updateSession(therapyId: string, sessionId: string, data: UpdateSessionDto) {
    return api.put(`/therapies/${therapyId}/sessions/${sessionId}`, data);
  }

  async cancelSession(sessionId: string) {
    return api.post(`/therapies/sessions/${sessionId}/cancel`);
  }

  async rescheduleSession(sessionId: string, newDate: string) {
    return api.post(`/therapies/sessions/${sessionId}/reschedule`, { newDate });
  }

  // Statistiche e report
  async getVASImprovement(therapyId: string) {
    return api.get(`/therapies/${therapyId}/vas-improvement`);
  }

  async getStatistics(therapyId: string) {
    return api.get(`/therapies/${therapyId}/statistics`);
  }

  async generateReport(therapyId: string) {
    return api.get(`/therapies/${therapyId}/report`);
  }

  // Per cartella clinica
  async getByClinicalRecord(recordId: string) {
    return api.get(`/therapies/clinical-record/${recordId}`);
  }

  // Per terapista
  async getTodaySessionsForTherapist(therapistId: string) {
    return api.get(`/therapies/therapist/${therapistId}/today`);
  }

  // Metodi di supporto per azioni rapide
  async suspend(id: string) {
    return this.updateStatus(id, 'CANCELLED');
  }

  async complete(id: string) {
    return this.updateStatus(id, 'COMPLETED');
  }
}

export const therapyService = new TherapyService();
export default therapyService;
