import api from './api';

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todaySessions: number;
  weekSessions: number;
  activeTherapies: number;
  completedTherapies: number;
  openRecords: number;
  totalRecords: number;
}

export interface TodaySession {
  id: string;
  time: string;
  patientName: string;
  therapyType: string;
  therapist: string;
  room: string;
  status: string;
}

export interface TherapyStats {
  name: string;
  count: number;
  percentage: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    } catch (error) {
      // Dati mock per sviluppo
      return {
        totalPatients: 152,
        activePatients: 47,
        todaySessions: 12,
        weekSessions: 58,
        activeTherapies: 34,
        completedTherapies: 128,
        openRecords: 23,
        totalRecords: 189,
      };
    }
  },

  async getTodaySessions(): Promise<TodaySession[]> {
    try {
      const response = await api.get('/dashboard/today-sessions');
      return response.data.data;
    } catch (error) {
      // Dati mock per sviluppo
      return [
        {
          id: '1',
          time: '09:00',
          patientName: 'Marco Rossini',
          therapyType: 'Laser YAG',
          therapist: 'Laura Bianchi',
          room: 'Sala 1',
          status: 'SCHEDULED',
        },
        {
          id: '2',
          time: '10:00',
          patientName: 'Laura Bianchi',
          therapyType: 'Tecar',
          therapist: 'Laura Bianchi',
          room: 'Sala Tecar',
          status: 'SCHEDULED',
        },
        {
          id: '3',
          time: '11:00',
          patientName: 'Giuseppe Verdi',
          therapyType: 'Idrokinesiterapia',
          therapist: 'Laura Bianchi',
          room: 'Piscina',
          status: 'IN_PROGRESS',
        },
        {
          id: '4',
          time: '14:30',
          patientName: 'Anna Neri',
          therapyType: 'Magnetoterapia',
          therapist: 'Mario Rossi',
          room: 'Sala 2',
          status: 'SCHEDULED',
        },
        {
          id: '5',
          time: '15:00',
          patientName: 'Paolo Bianchi',
          therapyType: 'TENS',
          therapist: 'Laura Bianchi',
          room: 'Sala 1',
          status: 'SCHEDULED',
        },
      ];
    }
  },

  async getTherapyStats(): Promise<TherapyStats[]> {
    try {
      const response = await api.get('/dashboard/therapy-stats');
      return response.data.data;
    } catch (error) {
      // Dati mock per sviluppo
      return [
        { name: 'Laser', count: 45, percentage: 22 },
        { name: 'Tecar', count: 38, percentage: 19 },
        { name: 'Magnetoterapia', count: 32, percentage: 16 },
        { name: 'Idrokinesiterapia', count: 28, percentage: 14 },
        { name: 'TENS', count: 25, percentage: 12 },
        { name: 'Massoterapia', count: 20, percentage: 10 },
        { name: 'Altri', count: 14, percentage: 7 },
      ];
    }
  },

  async getRecentActivities() {
    try {
      const response = await api.get('/dashboard/recent-activities');
      return response.data.data;
    } catch (error) {
      // Dati mock
      return [
        {
          id: 1,
          type: 'patient_added',
          description: 'Nuovo paziente: Mario Verdi',
          timestamp: new Date().toISOString(),
          user: 'Dr. Rossi',
        },
        {
          id: 2,
          type: 'therapy_completed',
          description: 'Terapia completata: Laura Bianchi - Laser YAG',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Laura Bianchi',
        },
        {
          id: 3,
          type: 'record_created',
          description: 'Nuova cartella clinica: Giuseppe Neri',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'Dr. Rossi',
        },
      ];
    }
  },
};
