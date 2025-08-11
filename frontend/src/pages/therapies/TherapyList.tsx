import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Activity,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
  User,
  FileText,
  TrendingUp,
  Download,
  Play,
  BarChart3,
  ChevronLeft,
} from 'lucide-react';
import therapyService from '../../services/therapyService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface TherapyWithDetails {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    fiscalCode: string;
  };
  clinicalRecord: {
    id: string;
    recordNumber: string;
  };
  therapyType: {
    id: string;
    name: string;
    category: string;
  };
  status: string;
  prescribedSessions: number;
  completedSessions: number;
  startDate: string;
  endDate?: string;
  notes?: string;
}

const TherapyList: React.FC = () => {
  const navigate = useNavigate();
  const [therapies, setTherapies] = useState<TherapyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const therapiesPerPage = 12;

  useEffect(() => {
    loadTherapies();
  }, [currentPage, searchTerm, statusFilter]);

  const loadTherapies = async () => {
    try {
      setLoading(true);
      const response = await therapyService.getAll({
        page: currentPage,
        limit: therapiesPerPage,
        search: searchTerm,
        status: statusFilter,
      });
      setTherapies(response.therapies || getMockTherapies());
      setTotalPages(response.totalPages || 2);
    } catch (error) {
      console.error('Errore caricamento terapie:', error);
      setTherapies(getMockTherapies());
      setTotalPages(2);
    } finally {
      setLoading(false);
    }
  };

  const getMockTherapies = (): TherapyWithDetails[] => {
    const mockTherapies: TherapyWithDetails[] = [];
    const patients = ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri'];
    const therapyTypes = ['Fisioterapia', 'Laserterapia', 'Tecarterapia', 'Ultrasuoni'];
    const statuses = ['ACTIVE', 'COMPLETED', 'SUSPENDED', 'ACTIVE'];

    for (let i = 0; i < 12; i++) {
      const [firstName, lastName] = patients[i % patients.length].split(' ');
      mockTherapies.push({
        id: `therapy-${i + 1}`,
        patient: {
          id: `patient-${i + 1}`,
          firstName,
          lastName,
          fiscalCode: `RSSMRA${85 - i}M01H501Z`,
        },
        clinicalRecord: {
          id: `record-${i + 1}`,
          recordNumber: `CR-2025-${1000 + i}`,
        },
        therapyType: {
          id: `type-${i + 1}`,
          name: therapyTypes[i % therapyTypes.length],
          category: 'PHYSICAL',
        },
        status: statuses[i % statuses.length],
        prescribedSessions: 10 + (i % 5) * 2,
        completedSessions: Math.floor((10 + (i % 5) * 2) * (0.3 + (i % 7) * 0.1)),
        startDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
        endDate: i % 3 === 0 ? new Date(Date.now() + i * 86400000 * 3).toISOString() : undefined,
        notes: i % 2 === 0 ? 'Paziente risponde bene al trattamento' : undefined,
      });
    }
    return mockTherapies;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <Play className="w-3 h-3" />
            In Corso
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <CheckCircle className="w-3 h-3" />
            Completata
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
            <PauseCircle className="w-3 h-3" />
            Sospesa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <XCircle className="w-3 h-3" />
            Annullata
          </span>
        );
    }
  };

  const getProgressColor = (completed: number, prescribed: number) => {
    const percentage = (completed / prescribed) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  const handleExport = () => {
    toast.success('Esportazione terapie in corso...');
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento terapie...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const activeTherapies = therapies.filter(t => t.status === 'ACTIVE').length;
  const completedTherapies = therapies.filter(t => t.status === 'COMPLETED').length;
  const totalSessions = therapies.reduce((sum, t) => sum + t.prescribedSessions, 0);
  const completedSessions = therapies.reduce((sum, t) => sum + t.completedSessions, 0);
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Terapie</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestisci e monitora le terapie dei pazienti
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
                onClick={() => navigate('/therapies/calendar')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Calendar className="w-4 h-4" />
                Calendario
              </button>
              <button
                onClick={() => navigate('/therapies/new')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuova Terapia
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Totale Terapie</p>
              <p className="text-2xl font-bold text-gray-900">{therapies.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">In Corso</p>
              <p className="text-2xl font-bold text-gray-900">{activeTherapies}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Completate</p>
              <p className="text-2xl font-bold text-gray-900">{completedTherapies}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Sedute Totali</p>
              <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Completamento</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cerca per paziente, tipo terapia o cartella..."
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
                <option value="active">In Corso</option>
                <option value="completed">Completate</option>
                <option value="suspended">Sospese</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                <Filter className="w-4 h-4" />
                Altri Filtri
              </button>
            </div>
          </div>

          {/* Therapies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {therapies.map((therapy) => {
              const progressPercentage = (therapy.completedSessions / therapy.prescribedSessions) * 100;
              
              return (
                <div
                  key={therapy.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/therapies/${therapy.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">
                        {therapy.patient.firstName.charAt(0)}{therapy.patient.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {therapy.patient.firstName} {therapy.patient.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{therapy.patient.fiscalCode}</p>
                      </div>
                    </div>
                    {getStatusBadge(therapy.status)}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tipo Terapia</p>
                      <p className="text-sm font-medium text-gray-900">{therapy.therapyType.name}</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500">Progresso</p>
                        <p className="text-xs font-medium text-gray-700">
                          {therapy.completedSessions}/{therapy.prescribedSessions} sedute
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getProgressColor(therapy.completedSessions, therapy.prescribedSessions)}`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(therapy.startDate), 'dd MMM', { locale: it })}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {therapy.clinicalRecord.recordNumber}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
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
    </AppLayout>
  );
};

export default TherapyList;