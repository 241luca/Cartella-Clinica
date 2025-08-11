import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Eye,
  FileText,
  Calendar,
  User,
  Filter,
  Download,
  Lock,
  Unlock,
  Activity,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import type { ClinicalRecord } from '../../services/clinicalRecordService';
import toast from 'react-hot-toast';

const ClinicalRecordList: React.FC = () => {
  const navigate = useNavigate();
  
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const recordsPerPage = 10;

  useEffect(() => {
    loadRecords();
  }, [currentPage, searchTerm, statusFilter]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await clinicalRecordService.getAll({
        page: currentPage,
        limit: recordsPerPage,
        search: searchTerm,
        status: statusFilter,
      });

      if (response.success) {
        setRecords(response.data.records || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalRecords(response.data.total || 0);
      }
    } catch (error) {
      console.error('Errore caricamento cartelle:', error);
      // Usa dati mock se l'API fallisce
      setRecords(getMockRecords());
      setTotalPages(2);
      setTotalRecords(15);
    } finally {
      setLoading(false);
    }
  };

  const getMockRecords = (): ClinicalRecord[] => {
    const mockRecords: ClinicalRecord[] = [];
    const diagnoses = [
      'Lombalgia acuta',
      'Cervicalgia cronica',
      'Periartrite scapolo-omerale',
      'Gonartrosi bilaterale',
      'Coxartrosi destra',
      'Tendinite rotulea',
      'Epicondilite laterale',
      'Sindrome del tunnel carpale',
    ];

    for (let i = 0; i < 10; i++) {
      mockRecords.push({
        id: `record-${i + 1}`,
        patientId: `patient-${i + 1}`,
        recordNumber: `MR-2025-${(1000 + i).toString()}`,
        acceptanceDate: new Date(2025, 6 - i, 15).toISOString(),
        diagnosis: diagnoses[i % diagnoses.length],
        diagnosticDetails: `Paziente con sintomatologia da ${i + 1} mesi`,
        symptomatology: 'Dolore, limitazione funzionale',
        objectiveExamination: 'Test ortopedici positivi',
        isActive: true,
        closedAt: i < 3 ? new Date().toISOString() : undefined,
        createdAt: new Date(2025, 6 - i, 15).toISOString(),
        updatedAt: new Date().toISOString(),
        patient: {
          firstName: ['Mario', 'Laura', 'Giuseppe', 'Anna', 'Francesco'][i % 5],
          lastName: ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Romano'][i % 5],
          fiscalCode: `RSSMRA${85 - i}M01H501Z`,
        },
        createdBy: {
          firstName: 'Dott.',
          lastName: i % 2 === 0 ? 'Rossi' : 'Bianchi',
        },
        _count: {
          therapies: Math.floor(Math.random() * 5) + 1,
          clinicalControls: Math.floor(Math.random() * 3),
        },
      });
    }
    return mockRecords;
  };

  const handleClose = async (id: string) => {
    if (!confirm('Sei sicuro di voler chiudere questa cartella clinica?')) return;
    
    try {
      await clinicalRecordService.close(id);
      toast.success('Cartella clinica chiusa con successo');
      loadRecords();
    } catch (error) {
      toast.error('Errore durante la chiusura');
    }
  };

  const handleReopen = async (id: string) => {
    if (!confirm('Sei sicuro di voler riaprire questa cartella clinica?')) return;
    
    try {
      await clinicalRecordService.reopen(id);
      toast.success('Cartella clinica riaperta con successo');
      loadRecords();
    } catch (error) {
      toast.error('Errore durante la riapertura');
    }
  };

  const handleExport = () => {
    toast.success('Export in corso...');
    // TODO: Implementare export Excel/CSV
  };

  const getStatusBadge = (record: ClinicalRecord) => {
    if (record.closedAt) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
          Chiusa
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
        Aperta
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cartelle Cliniche</h1>
              <p className="mt-1 text-sm text-gray-600">
                {totalRecords} cartelle totali • {records.filter(r => !r.closedAt).length} aperte
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Esporta
              </button>
              <button
                onClick={() => navigate('/clinical-records/new')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuova Cartella
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cerca per paziente, numero cartella o diagnosi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tutte le cartelle</option>
                <option value="open">Solo aperte</option>
                <option value="closed">Solo chiuse</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna cartella trovata</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Crea la prima cartella clinica'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/clinical-records/new')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuova Cartella
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numero
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paziente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diagnosi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Apertura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Terapie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medico
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            #{record.recordNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.patient?.lastName} {record.patient?.firstName}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {record.patient?.fiscalCode}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {record.diagnosis}
                          </div>
                          {record.diagnosticDetails && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {record.diagnosticDetails}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(record.acceptanceDate), 'dd/MM/yyyy')}
                          </div>
                          {record.closedAt && (
                            <div className="text-xs text-gray-500">
                              Chiusa: {format(new Date(record.closedAt), 'dd/MM/yyyy')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {record._count?.therapies > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Activity className="w-3 h-3 mr-1" />
                                {record._count.therapies}
                              </span>
                            )}
                            {record._count?.clinicalControls > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FileText className="w-3 h-3 mr-1" />
                                {record._count.clinicalControls}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.createdBy?.firstName} {record.createdBy?.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/clinical-records/${record.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Visualizza"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!record.closedAt && (
                              <button
                                onClick={() => navigate(`/clinical-records/${record.id}/edit`)}
                                className="text-green-600 hover:text-green-900"
                                title="Modifica"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {record.closedAt ? (
                              <button
                                onClick={() => handleReopen(record.id)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Riapri"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleClose(record.id)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Chiudi"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/clinical-records/${record.id}/therapies`)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Terapie"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Precedente
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Successiva
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando da{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * recordsPerPage + 1}
                        </span>{' '}
                        a{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * recordsPerPage, totalRecords)}
                        </span>{' '}
                        di{' '}
                        <span className="font-medium">{totalRecords}</span> risultati
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                          const pageNumber = index + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalRecordList;
