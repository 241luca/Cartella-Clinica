import api from './api';

export interface ClinicalRecord {
  id: string;
  patientId: string;
  recordNumber: string;
  acceptanceDate: string;
  diagnosis: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: string;
  interventionDoctor?: string;
  isActive: boolean;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    firstName: string;
    lastName: string;
    fiscalCode: string;
  };
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  therapies?: any[];
  _count?: {
    therapies: number;
    clinicalControls: number;
  };
}

export interface CreateClinicalRecordDto {
  patientId: string;
  diagnosis: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: string;
  interventionDoctor?: string;
}

class ClinicalRecordService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'open' | 'closed' | 'all';
    patientId?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params?.patientId) queryParams.append('patientId', params.patientId);

      const response = await api.get(`/clinical-records?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clinical records:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const response = await api.get(`/clinical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clinical record:', error);
      throw error;
    }
  }

  async create(data: CreateClinicalRecordDto) {
    try {
      const response = await api.post('/clinical-records', data);
      return response.data;
    } catch (error) {
      console.error('Error creating clinical record:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<CreateClinicalRecordDto>) {
    try {
      const response = await api.put(`/clinical-records/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating clinical record:', error);
      throw error;
    }
  }

  async close(id: string, closureNotes?: string) {
    try {
      const response = await api.post(`/clinical-records/${id}/close`, { closureNotes });
      return response.data;
    } catch (error) {
      console.error('Error closing clinical record:', error);
      throw error;
    }
  }

  async reopen(id: string, reason?: string) {
    try {
      const response = await api.post(`/clinical-records/${id}/reopen`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error reopening clinical record:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const response = await api.delete(`/clinical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting clinical record:', error);
      throw error;
    }
  }

  async getTherapies(recordId: string) {
    try {
      const response = await api.get(`/clinical-records/${recordId}/therapies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching therapies:', error);
      throw error;
    }
  }

  async generateReport(id: string) {
    try {
      const response = await api.get(`/clinical-records/${id}/report`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

const clinicalRecordService = new ClinicalRecordService();

export { clinicalRecordService };
export type { ClinicalRecord, CreateClinicalRecordDto };
