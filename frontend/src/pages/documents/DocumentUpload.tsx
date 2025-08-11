import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Image,
  Download,
  Eye,
  Trash2,
  Edit,
  X,
  Check,
  AlertCircle,
  Filter,
  Search,
  File,
  FileImage,
  FileSpreadsheet,
  FilePlus,
  Paperclip,
  FolderOpen,
  Calendar,
  User,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { documentService } from '../../services/documentService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import type { Document, UploadDocumentDto } from '../../services/documentService';
import toast from 'react-hot-toast';

interface ClinicalRecord {
  id: string;
  recordNumber: string;
  patient: {
    firstName: string;
    lastName: string;
    fiscalCode: string;
  };
}

const DocumentUpload: React.FC = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clinicalRecord, setClinicalRecord] = useState<ClinicalRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('OTHER');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Tutti', icon: <FolderOpen className="w-4 h-4" /> },
    { value: 'REFERRAL', label: 'Referti', icon: <FileText className="w-4 h-4" /> },
    { value: 'EXAM', label: 'Esami', icon: <FileImage className="w-4 h-4" /> },
    { value: 'PRESCRIPTION', label: 'Prescrizioni', icon: <File className="w-4 h-4" /> },
    { value: 'REPORT', label: 'Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { value: 'IMAGE', label: 'Immagini', icon: <Image className="w-4 h-4" /> },
    { value: 'OTHER', label: 'Altro', icon: <Paperclip className="w-4 h-4" /> },
  ];

  useEffect(() => {
    if (recordId) {
      loadClinicalRecord();
      loadDocuments();
    }
  }, [recordId]);

  useEffect(() => {
    return () => {
      // Cleanup preview URL quando il componente viene smontato
      if (previewUrl) {
        documentService.revokePreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadClinicalRecord = async () => {
    try {
      const response = await clinicalRecordService.getById(recordId!);
      if (response.success) {
        setClinicalRecord(response.data);
      }
    } catch (error) {
      console.error('Errore caricamento cartella:', error);
      // Mock data
      setClinicalRecord({
        id: recordId!,
        recordNumber: 'MR-2025-1001',
        patient: {
          firstName: 'Mario',
          lastName: 'Rossi',
          fiscalCode: 'RSSMRA85M01H501Z',
        },
      });
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocuments({
        clinicalRecordId: recordId,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      });
      
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (error) {
      console.error('Errore caricamento documenti:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Valida tipo file
    if (!documentService.validateFileType(file)) {
      toast.error('Tipo di file non supportato');
      return;
    }
    
    // Valida dimensione (max 10MB)
    if (!documentService.validateFileSize(file, 10)) {
      toast.error('File troppo grande (max 10MB)');
      return;
    }
    
    setUploadFile(file);
    
    // Crea preview URL per immagini
    if (file.type.startsWith('image/')) {
      const url = documentService.createPreviewUrl(file);
      setPreviewUrl(url);
    }
    
    // Auto-detect categoria
    if (file.type.includes('image')) {
      setUploadCategory('IMAGE');
    } else if (file.name.toLowerCase().includes('referto')) {
      setUploadCategory('REFERRAL');
    } else if (file.name.toLowerCase().includes('prescrizione')) {
      setUploadCategory('PRESCRIPTION');
    } else if (file.name.toLowerCase().includes('esame') || file.name.toLowerCase().includes('rx')) {
      setUploadCategory('EXAM');
    }
    
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Seleziona un file');
      return;
    }
    
    try {
      setUploading(true);
      
      const uploadData: UploadDocumentDto = {
        file: uploadFile,
        description: uploadDescription,
        category: uploadCategory,
        clinicalRecordId: recordId,
      };
      
      const response = await documentService.uploadDocument(uploadData);
      
      if (response.success) {
        toast.success('Documento caricato con successo');
        setShowUploadModal(false);
        resetUploadForm();
        loadDocuments();
      }
    } catch (error) {
      toast.error('Errore durante il caricamento');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadDescription('');
    setUploadCategory('OTHER');
    if (previewUrl) {
      documentService.revokePreviewUrl(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await documentService.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Download avviato');
    } catch (error) {
      toast.error('Errore durante il download');
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Sei sicuro di voler eliminare "${doc.originalName}"?`)) {
      return;
    }
    
    try {
      await documentService.deleteDocument(doc.id);
      toast.success('Documento eliminato');
      loadDocuments();
    } catch (error) {
      toast.error('Errore durante l\'eliminazione');
    }
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('image')) return <Image className="w-8 h-8 text-blue-500" />;
    if (mimeType.includes('word')) return <FileText className="w-8 h-8 text-blue-600" />;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Paperclip className="w-6 h-6 mr-2" />
                Documenti e Allegati
              </h1>
              {clinicalRecord && (
                <p className="mt-1 text-sm text-gray-600">
                  Cartella #{clinicalRecord.recordNumber} - {clinicalRecord.patient.lastName} {clinicalRecord.patient.firstName}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/clinical-records/${recordId}`)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Torna alla Cartella
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Carica Documento
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filtri Categoria */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categorie
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.value
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm">{category.label}</span>
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {category.value === 'all' 
                        ? documents.length
                        : documents.filter(d => d.category === category.value).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Statistiche */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Statistiche
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totale documenti</span>
                  <span className="font-medium">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spazio utilizzato</span>
                  <span className="font-medium">
                    {documentService.formatFileSize(
                      documents.reduce((acc, doc) => acc + doc.fileSize, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ultimo caricamento</span>
                  <span className="font-medium">
                    {documents.length > 0 
                      ? format(new Date(documents[0].uploadDate), 'dd/MM', { locale: it })
                      : '-'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Formati Supportati
                  </h3>
                  <p className="mt-1 text-xs text-blue-700">
                    PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    Max 10MB per file
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca documenti..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`bg-white rounded-lg shadow-sm border-2 border-dashed p-8 mb-6 text-center transition-all ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Trascina qui i file o{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  sfoglia
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Formati supportati: PDF, immagini, documenti Office (max 10MB)
              </p>
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Nessun documento trovato' : 'Nessun documento caricato'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        {getFileIcon(doc.mimeType)}
                        <span className={`px-2 py-1 text-xs rounded-full ${documentService.getCategoryColor(doc.category)}`}>
                          {documentService.getCategoryLabel(doc.category)}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                        {doc.originalName}
                      </h3>
                      
                      {doc.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{documentService.formatFileSize(doc.fileSize)}</span>
                        <span>{format(new Date(doc.uploadDate), 'dd/MM/yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <User className="w-3 h-3 mr-1" />
                        <span>{doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Anteprima
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex-1 flex items-center justify-center px-3 py-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Scarica
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt"
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Carica Documento
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {uploadFile && (
              <div className="mb-4">
                {previewUrl && uploadFile.type.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center">
                    {getFileIcon(uploadFile.type)}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{uploadFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {documentService.formatFileSize(uploadFile.size)}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REFERRAL">Referto</option>
                      <option value="EXAM">Esame</option>
                      <option value="PRESCRIPTION">Prescrizione</option>
                      <option value="REPORT">Report</option>
                      <option value="IMAGE">Immagine</option>
                      <option value="OTHER">Altro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrizione
                    </label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Aggiungi una descrizione..."
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Caricamento...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Carica
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDocument.originalName}
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {selectedDocument.mimeType.startsWith('image/') ? (
                <img
                  src={selectedDocument.url || `/api/documents/${selectedDocument.id}/preview`}
                  alt={selectedDocument.originalName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : selectedDocument.mimeType === 'application/pdf' ? (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Anteprima PDF non disponibile
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Scarica per visualizzare
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  {getFileIcon(selectedDocument.mimeType)}
                  <p className="text-gray-600 mt-4 mb-2">
                    {selectedDocument.originalName}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {documentService.formatFileSize(selectedDocument.fileSize)}
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Scarica Documento
                  </button>
                </div>
              )}
              
              {selectedDocument.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Descrizione</h4>
                  <p className="text-sm text-gray-600">{selectedDocument.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
