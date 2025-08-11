import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
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
  Clock,
  CheckCircle,
  FileCheck,
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
      
      setRecords(response.records || []);
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.total || 0);
    } catch (error) {
      console.error('Errore caricamento cartelle:', error);
      // Mock data per sviluppo
      setRecords(getMockRecords());
      setTotalPages(2);
      setTotalRecords(15);
    } finally {
      setLoading(false);
    }
  };

  const getMockRecords = (): ClinicalRecord[] => {
    const mockRecords: ClinicalRecord[] = [];
    const patients = ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri'];
    const diagnoses = ['Lombalgia', 'Cervicalgia', 'Distorsione caviglia', 'Tendinite'];
    
    for (let i = 0; i < 10; i++) {
      const patientName = patients[i % patients.length];
      mockRecords.push({
        id: `record-${i + 1}`,
        patientId: `patient-${i + 1}`,
        patient: {
          firstName: patientName.split(' ')[0],
          lastName: patientName.split(' ')[1],
          fiscalCode: `RSSMRA${85 - i}M01H501Z`,
        },
        diagnosis: diagnoses[i % diagnoses.length],
        anamnesis: `Anamnesi del paziente ${i + 1}`,
        symptomatology: `Sintomatologia descritta...`,
        status: i % 3 === 0 ? 'CLOSED' : 'OPEN',
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        _count: {
          therapies: Math.floor(Math.random() * 5) + 1,
          documents: Math.floor(Math.random() * 3),
        },
      } as any);
    }
    return mockRecords;
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa cartella clinica?')) {
      try {
        await clinicalRecordService.delete(id);
        toast.success('Cartella clinica eliminata con successo');
        loadRecords();
      } catch (error) {
        toast.error('Errore durante l\'eliminazione');
      }
    }
  };

  const handleExport = () => {
    toast.success('Esportazione in corso...');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'OPEN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          <Unlock className="w-3 h-3" />
          Aperta
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <Lock className="w-3 h-3" />
        Chiusa
      </span>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento cartelle cliniche...</p>
        </div>
      </div>
      </AppLayout>
    );
  }

  const openRecords = records.filter(r => r.status === 'OPEN').length;
  const closedRecords = records.filter(r => r.status === 'CLOSED').length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cartelle Cliniche</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestisci le cartelle cliniche dei pazienti
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              Esporta
            </button>
            <button
              onClick={() => navigate('/clinical-records/new')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Nuova Cartella
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Totale Cartelle</p>
            <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Aperte</p>
            <p className="text-2xl font-bold text-gray-900">{openRecords}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Chiuse</p>
            <p className="text-2xl font-bold text-gray-900">{closedRecords}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Da Completare</p>
            <p className="text-2xl font-bold text-gray-900">
              {records.filter(r => r.status === 'OPEN' && (!r.diagnosis || !r.anamnesis)).length}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca per paziente, diagnosi o codice fiscale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tutte</option>
              <option value="open">Aperte</option>
              <option value="closed">Chiuse</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
              <Filter className="w-4 h-4" />
              Altri Filtri
            </button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/clinical-records/${record.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                    {record.patient?.firstName?.charAt(0)}{record.patient?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.patient?.firstName} {record.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{record.patient?.fiscalCode}</p>
                  </div>
                </div>
                {getStatusBadge(record.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Diagnosi</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {record.diagnosis || 'Non specificata'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(record.createdAt), 'dd MMM yyyy', { locale: it })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {record._count?.therapies || 0} terapie
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clinical-records/${record.id}/edit`);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                    title="Modifica"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecord(record.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Elimina"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * recordsPerPage, totalRecords)}
            </span>{' '}
            di <span className="font-medium">{totalRecords}</span> risultati
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClinicalRecordList;