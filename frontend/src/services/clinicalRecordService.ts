import api from './api';

export interface ClinicalRecord {
  id: string;
  patientId: string;
  recordNumber: string;
  acceptanceDate: Date;
  diagnosis: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: Date;
  interventionDoctor?: string;
  isActive: boolean;
  closedAt?: Date;
  createdById: string;
  patient?: any;
  createdBy?: any;
  therapies?: any[];
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

export interface UpdateClinicalRecordDto {
  diagnosis?: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: string;
  interventionDoctor?: string;
  isActive?: boolean;
}

class ClinicalRecordService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    patientId?: string;
  }) {
    return api.get('/clinical-records', { params });
  }

  async getById(id: string) {
    return api.get(`/clinical-records/${id}`);
  }

  async getByPatient(patientId: string) {
    return api.get('/clinical-records', { params: { patientId } });
  }

  async create(data: CreateClinicalRecordDto) {
    return api.post('/clinical-records', data);
  }

  async update(id: string, data: UpdateClinicalRecordDto) {
    return api.put(`/clinical-records/${id}`, data);
  }

  async delete(id: string) {
    return api.delete(`/clinical-records/${id}`);
  }

  async close(id: string) {
    return api.put(`/clinical-records/${id}/close`);
  }

  async reopen(id: string) {
    return api.put(`/clinical-records/${id}/reopen`);
  }

  // Documenti
  async uploadDocument(recordId: string, file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return api.post(`/clinical-records/${recordId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getDocuments(recordId: string) {
    return api.get(`/clinical-records/${recordId}/documents`);
  }

  async deleteDocument(recordId: string, documentId: string) {
    return api.delete(`/clinical-records/${recordId}/documents/${documentId}`);
  }

  // Report
  async generateReport(id: string) {
    return api.get(`/clinical-records/${id}/report`, {
      responseType: 'blob',
    });
  }

  // Controlli clinici
  async addClinicalControl(recordId: string, data: {
    controlDate: string;
    findings: string;
    recommendations?: string;
    nextControlDate?: string;
  }) {
    return api.post(`/clinical-records/${recordId}/controls`, data);
  }

  async getClinicalControls(recordId: string) {
    return api.get(`/clinical-records/${recordId}/controls`);
  }

  // Valutazioni funzionali
  async addFunctionalEvaluation(recordId: string, data: any) {
    return api.post(`/clinical-records/${recordId}/evaluations`, data);
  }

  async getFunctionalEvaluations(recordId: string) {
    return api.get(`/clinical-records/${recordId}/evaluations`);
  }
}

export const clinicalRecordService = new ClinicalRecordService();
export default clinicalRecordService;
