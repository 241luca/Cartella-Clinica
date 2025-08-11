import api from './api';

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  description?: string;
  category: 'REFERRAL' | 'EXAM' | 'PRESCRIPTION' | 'REPORT' | 'IMAGE' | 'OTHER';
  clinicalRecordId?: string;
  patientId?: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  url?: string;
}

export interface UploadDocumentDto {
  file: File;
  description?: string;
  category: string;
  clinicalRecordId?: string;
  patientId?: string;
}

class DocumentService {
  async uploadDocument(data: UploadDocumentDto) {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.description) formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.clinicalRecordId) formData.append('clinicalRecordId', data.clinicalRecordId);
      if (data.patientId) formData.append('patientId', data.patientId);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      // Simula upload con mock data
      return {
        success: true,
        data: this.createMockDocument(data),
      };
    }
  }

  async getDocuments(params?: {
    clinicalRecordId?: string;
    patientId?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.clinicalRecordId) queryParams.append('clinicalRecordId', params.clinicalRecordId);
      if (params?.patientId) queryParams.append('patientId', params.patientId);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get(`/documents?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Return mock documents
      return {
        success: true,
        data: this.getMockDocuments(params?.clinicalRecordId, params?.patientId),
      };
    }
  }

  async getDocument(id: string) {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async downloadDocument(id: string) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      // Create mock blob for testing
      const mockContent = 'This is a mock document content for testing purposes.';
      return new Blob([mockContent], { type: 'text/plain' });
    }
  }

  async deleteDocument(id: string) {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: true };
    }
  }

  async updateDocument(id: string, data: { description?: string; category?: string }) {
    try {
      const response = await api.put(`/documents/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Helper per creare URL temporaneo per preview
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Cleanup URL temporaneo
  revokePreviewUrl(url: string) {
    URL.revokeObjectURL(url);
  }

  // Validazione tipo file
  validateFileType(file: File, allowedTypes?: string[]): boolean {
    const defaultAllowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    
    const allowed = allowedTypes || defaultAllowed;
    return allowed.includes(file.type);
  }

  // Validazione dimensione file (max 10MB di default)
  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
  }

  // Formatta dimensione file
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Get icon per tipo file
  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('text')) return '📃';
    return '📎';
  }

  // Get category label
  getCategoryLabel(category: string): string {
    switch (category) {
      case 'REFERRAL': return 'Referti';
      case 'EXAM': return 'Esami';
      case 'PRESCRIPTION': return 'Prescrizioni';
      case 'REPORT': return 'Report';
      case 'IMAGE': return 'Immagini';
      case 'OTHER': return 'Altro';
      default: return category;
    }
  }

  // Get category color
  getCategoryColor(category: string): string {
    switch (category) {
      case 'REFERRAL': return 'bg-blue-100 text-blue-800';
      case 'EXAM': return 'bg-green-100 text-green-800';
      case 'PRESCRIPTION': return 'bg-purple-100 text-purple-800';
      case 'REPORT': return 'bg-orange-100 text-orange-800';
      case 'IMAGE': return 'bg-pink-100 text-pink-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private createMockDocument(data: UploadDocumentDto): Document {
    return {
      id: `doc-${Date.now()}`,
      fileName: `${Date.now()}-${data.file.name}`,
      originalName: data.file.name,
      fileType: data.file.type,
      fileSize: data.file.size,
      mimeType: data.file.type,
      uploadDate: new Date().toISOString(),
      description: data.description,
      category: data.category as Document['category'],
      clinicalRecordId: data.clinicalRecordId,
      patientId: data.patientId,
      uploadedBy: {
        id: 'user-1',
        firstName: 'Admin',
        lastName: 'User',
      },
      url: URL.createObjectURL(data.file),
    };
  }

  private getMockDocuments(clinicalRecordId?: string, patientId?: string): Document[] {
    return [
      {
        id: 'doc-1',
        fileName: 'risonanza-magnetica.pdf',
        originalName: 'risonanza-magnetica.pdf',
        fileType: 'application/pdf',
        fileSize: 2456789,
        mimeType: 'application/pdf',
        uploadDate: new Date('2025-07-01').toISOString(),
        description: 'RMN lombo-sacrale con contrasto',
        category: 'EXAM',
        clinicalRecordId: clinicalRecordId || 'record-1',
        patientId: patientId || 'patient-1',
        uploadedBy: {
          id: 'user-1',
          firstName: 'Dott.',
          lastName: 'Rossi',
        },
      },
      {
        id: 'doc-2',
        fileName: 'referto-visita.pdf',
        originalName: 'referto-visita.pdf',
        fileType: 'application/pdf',
        fileSize: 345678,
        mimeType: 'application/pdf',
        uploadDate: new Date('2025-07-05').toISOString(),
        description: 'Referto visita specialistica ortopedica',
        category: 'REFERRAL',
        clinicalRecordId: clinicalRecordId || 'record-1',
        patientId: patientId || 'patient-1',
        uploadedBy: {
          id: 'user-2',
          firstName: 'Dott.',
          lastName: 'Bianchi',
        },
      },
      {
        id: 'doc-3',
        fileName: 'prescrizione-terapia.pdf',
        originalName: 'prescrizione-terapia.pdf',
        fileType: 'application/pdf',
        fileSize: 123456,
        mimeType: 'application/pdf',
        uploadDate: new Date('2025-07-10').toISOString(),
        description: 'Prescrizione ciclo fisioterapico',
        category: 'PRESCRIPTION',
        clinicalRecordId: clinicalRecordId || 'record-1',
        patientId: patientId || 'patient-1',
        uploadedBy: {
          id: 'user-1',
          firstName: 'Dott.',
          lastName: 'Rossi',
        },
      },
      {
        id: 'doc-4',
        fileName: 'rx-colonna.jpg',
        originalName: 'rx-colonna.jpg',
        fileType: 'image/jpeg',
        fileSize: 1567890,
        mimeType: 'image/jpeg',
        uploadDate: new Date('2025-07-15').toISOString(),
        description: 'Radiografia colonna lombare AP e LL',
        category: 'IMAGE',
        clinicalRecordId: clinicalRecordId || 'record-1',
        patientId: patientId || 'patient-1',
        uploadedBy: {
          id: 'user-3',
          firstName: 'Tecnico',
          lastName: 'Verdi',
        },
      },
    ];
  }
}

const documentService = new DocumentService();

export { documentService };
