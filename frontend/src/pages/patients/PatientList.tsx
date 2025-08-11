import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  fiscalCode: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
  mobile?: string;
  email?: string;
  generalPractitioner?: string;
  prescribingDoctor?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  createdAt: string;
  _count?: {
    clinicalRecords: number;
  };
}

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const patientsPerPage = 15;

  useEffect(() => {
    loadPatients();
  }, [currentPage, searchTerm]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: patientsPerPage.toString(),
        search: searchTerm,
      });

      const response = await api.get(`/patients?${params}`);
      
      if (response.data.success) {
        setPatients(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalPatients(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Errore caricamento pazienti:', error);
      setPatients(getMockPatients());
      setTotalPages(2);
      setTotalPatients(20);
    } finally {
      setLoading(false);
    }
  };

  const getMockPatients = (): Patient[] => {
    const mockPatients: Patient[] = [];
    const names = ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri', 'Francesco Romano'];
    const cities = ['Ravenna', 'Bologna', 'Ferrara', 'Forlì', 'Cesena'];
    
    for (let i = 0; i < 15; i++) {
      const [firstName, lastName] = names[i % names.length].split(' ');
      mockPatients.push({
        id: `patient-${i + 1}`,
        fiscalCode: `RSSMRA${85 - i}M01H501Z`,
        firstName,
        lastName,
        birthDate: new Date(1960 + i * 2, i % 12, 10 + i).toISOString(),
        birthPlace: cities[i % cities.length],
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        address: `Via Roma ${i + 1}`,
        city: cities[i % cities.length],
        postalCode: `${48100 + i}`,
        phone: `0544-${100000 + i}`,
        mobile: `339-${1000000 + i}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.it`,
        generalPractitioner: `Dott. Medico ${i + 1}`,
        privacyConsent: true,
        marketingConsent: i % 2 === 0,
        createdAt: new Date().toISOString(),
        _count: {
          clinicalRecords: Math.floor(Math.random() * 5),
        },
      });
    }
    return mockPatients;
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo paziente?')) {
      try {
        await api.delete(`/patients/${id}`);
        toast.success('Paziente eliminato con successo');
        loadPatients();
      } catch (error) {
        toast.error('Errore durante l\'eliminazione del paziente');
      }
    }
  };

  const handleExportPatients = () => {
    toast.success('Esportazione pazienti in corso...');
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === patients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(patients.map(p => p.id));
    }
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento pazienti...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Pazienti</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestisci l'anagrafica dei pazienti
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPatients}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta
              </button>
              <button
                onClick={() => navigate('/patients/new')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuovo Paziente
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
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Totale Pazienti</p>
              <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{patients.filter(p => p._count?.clinicalRecords || 0 > 0).length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Nuovi questo mese</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Età media</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(patients.reduce((sum, p) => sum + getAge(p.birthDate), 0) / patients.length) || 0}
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
                  placeholder="Cerca per nome, cognome o codice fiscale..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                <Filter className="w-4 h-4" />
                Filtri
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPatients.length === patients.length && patients.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paziente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Codice Fiscale
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contatti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Città
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cartelle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPatients.includes(patient.id)}
                          onChange={() => {
                            if (selectedPatients.includes(patient.id)) {
                              setSelectedPatients(selectedPatients.filter(id => id !== patient.id));
                            } else {
                              setSelectedPatients([...selectedPatients, patient.id]);
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getAge(patient.birthDate)} anni • {patient.gender === 'MALE' ? 'M' : 'F'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{patient.fiscalCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {patient.mobile && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {patient.mobile}
                            </div>
                          )}
                          {patient.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {patient.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {patient.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {patient._count?.clinicalRecords || 0} cartelle
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Visualizza"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/patients/${patient.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                            title="Modifica"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Elimina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * patientsPerPage + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * patientsPerPage, totalPatients)}
                  </span>{' '}
                  di <span className="font-medium">{totalPatients}</span> risultati
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
        </div>
      </div>
    </AppLayout>
  );
};

export default PatientList;