import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/layout/NavigationBar';
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
} from 'lucide-react';
import therapyService from '../../services/therapyService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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
  const [filteredTherapies, setFilteredTherapies] = useState<TherapyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadTherapies();
  }, []);

  useEffect(() => {
    filterTherapies();
  }, [therapies, searchTerm, statusFilter, categoryFilter]);

  const loadTherapies = async () => {
    try {
      setLoading(true);
      // Per ora usiamo dati mock
      const mockTherapies = getMockTherapies();
      setTherapies(mockTherapies);
      setFilteredTherapies(mockTherapies);
    } catch (error) {
      console.error('Errore caricamento terapie:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMockTherapies = (): TherapyWithDetails[] => [
    {
      id: 'therapy-1',
      patient: {
        id: 'patient-1',
        firstName: 'Mario',
        lastName: 'Rossi',
        fiscalCode: 'RSSMRA85M01H501Z',
      },
      clinicalRecord: {
        id: 'record-1',
        recordNumber: 'MR-2025-1001',
      },
      therapyType: {
        id: 'laser-yag',
        name: 'Laser YAG',
        category: 'INSTRUMENTAL',
      },
      status: 'IN_PROGRESS',
      prescribedSessions: 10,
      completedSessions: 6,
      startDate: '2025-07-05T10:00:00Z',
      notes: 'Terapia per lombalgia acuta',
    },
    {
      id: 'therapy-2',
      patient: {
        id: 'patient-2',
        firstName: 'Anna',
        lastName: 'Bianchi',
        fiscalCode: 'BNCNNA90A41H501Z',
      },
      clinicalRecord: {
        id: 'record-2',
        recordNumber: 'MR-2025-1002',
      },
      therapyType: {
        id: 'tecar',
        name: 'Tecarterapia',
        category: 'INSTRUMENTAL',
      },
      status: 'SCHEDULED',
      prescribedSessions: 8,
      completedSessions: 0,
      startDate: '2025-08-15T10:00:00Z',
    },
    {
      id: 'therapy-3',
      patient: {
        id: 'patient-3',
        firstName: 'Luigi',
        lastName: 'Verdi',
        fiscalCode: 'VRDLGU75B15H501Z',
      },
      clinicalRecord: {
        id: 'record-3',
        recordNumber: 'MR-2025-0998',
      },
      therapyType: {
        id: 'magnetoterapia',
        name: 'Magnetoterapia',
        category: 'INSTRUMENTAL',
      },
      status: 'COMPLETED',
      prescribedSessions: 12,
      completedSessions: 12,
      startDate: '2025-06-01T10:00:00Z',
      endDate: '2025-07-20T10:00:00Z',
    },
    {
      id: 'therapy-4',
      patient: {
        id: 'patient-4',
        firstName: 'Giulia',
        lastName: 'Neri',
        fiscalCode: 'NRIGLI92C45H501Z',
      },
      clinicalRecord: {
        id: 'record-4',
        recordNumber: 'MR-2025-1003',
      },
      therapyType: {
        id: 'massoterapia',
        name: 'Massoterapia',
        category: 'MANUAL',
      },
      status: 'IN_PROGRESS',
      prescribedSessions: 15,
      completedSessions: 8,
      startDate: '2025-07-10T10:00:00Z',
    },
    {
      id: 'therapy-5',
      patient: {
        id: 'patient-5',
        firstName: 'Marco',
        lastName: 'Gialli',
        fiscalCode: 'GLLMRC88D10H501Z',
      },
      clinicalRecord: {
        id: 'record-5',
        recordNumber: 'MR-2025-1004',
      },
      therapyType: {
        id: 'ultrasuoni',
        name: 'Ultrasuoni',
        category: 'INSTRUMENTAL',
      },
      status: 'PAUSED',
      prescribedSessions: 10,
      completedSessions: 4,
      startDate: '2025-07-15T10:00:00Z',
      notes: 'Terapia sospesa per vacanze paziente',
    },
  ];

  const filterTherapies = () => {
    let filtered = [...therapies];

    // Filtro per ricerca
    if (searchTerm) {
      filtered = filtered.filter(therapy =>
        therapy.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.patient.fiscalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.therapyType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.clinicalRecord.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro per stato
    if (statusFilter !== 'all') {
      filtered = filtered.filter(therapy => therapy.status === statusFilter);
    }

    // Filtro per categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(therapy => therapy.therapyType.category === categoryFilter);
    }

    setFilteredTherapies(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'SCHEDULED':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PAUSED':
        return <PauseCircle className="w-5 h-5 text-orange-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completata';
      case 'IN_PROGRESS': return 'In Corso';
      case 'SCHEDULED': return 'Programmata';
      case 'PAUSED': return 'Sospesa';
      case 'CANCELLED': return 'Annullata';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'INSTRUMENTAL': return 'Strumentale';
      case 'MANUAL': return 'Manuale';
      case 'REHABILITATION': return 'Riabilitazione';
      default: return category;
    }
  };

  const calculateProgress = (completed: number, prescribed: number) => {
    return Math.round((completed / prescribed) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento terapie...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terapie</h1>
            <p className="mt-2 text-gray-600">
              Gestisci tutte le terapie dei pazienti
            </p>
          </div>
          <button
            onClick={() => navigate('/therapies/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuova Terapia
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca per paziente, codice fiscale, tipo terapia..."
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutti gli stati</option>
              <option value="IN_PROGRESS">In Corso</option>
              <option value="SCHEDULED">Programmate</option>
              <option value="COMPLETED">Completate</option>
              <option value="PAUSED">Sospese</option>
              <option value="CANCELLED">Annullate</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutte le categorie</option>
              <option value="INSTRUMENTAL">Strumentali</option>
              <option value="MANUAL">Manuali</option>
              <option value="REHABILITATION">Riabilitazione</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Totali</p>
              <p className="text-2xl font-bold text-gray-900">{therapies.length}</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Corso</p>
              <p className="text-2xl font-bold text-blue-600">
                {therapies.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completate</p>
              <p className="text-2xl font-bold text-green-600">
                {therapies.filter(t => t.status === 'COMPLETED').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Programmate</p>
              <p className="text-2xl font-bold text-yellow-600">
                {therapies.filter(t => t.status === 'SCHEDULED').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Therapies List */}
      {filteredTherapies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessuna terapia trovata
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Prova a modificare i filtri di ricerca'
                : 'Inizia creando una nuova terapia'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paziente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terapia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cartella
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Inizio
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Azioni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTherapies.map((therapy) => (
                  <tr 
                    key={therapy.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/therapies/${therapy.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {therapy.patient.lastName} {therapy.patient.firstName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {therapy.patient.fiscalCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {therapy.therapyType.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getCategoryLabel(therapy.therapyType.category)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        {therapy.clinicalRecord.recordNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {therapy.completedSessions}/{therapy.prescribedSessions} sedute
                        </div>
                        <div className="mt-1 w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${calculateProgress(therapy.completedSessions, therapy.prescribedSessions)}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(therapy.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(therapy.status)}`}>
                          {getStatusLabel(therapy.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {format(new Date(therapy.startDate), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default TherapyList;
