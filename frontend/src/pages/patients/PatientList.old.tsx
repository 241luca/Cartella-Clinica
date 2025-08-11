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
} from 'lucide-react';
import { format } from 'date-fns';
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
        setPatients(response.data.data.patients || []);
        setTotalPages(response.data.data.totalPages || 1);
        setTotalPatients(response.data.data.total || 0);
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
        postalCode: `4812${i}`,
        phone: `0544${100000 + i}`,
        mobile: `333${1000000 + i}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.it`,
        generalPractitioner: 'Dott. Bianchi',
        prescribingDoctor: 'Dott. Rossi',
        privacyConsent: true,
        marketingConsent: i % 3 !== 0,
        createdAt: new Date().toISOString(),
        _count: {
          clinicalRecords: Math.floor(Math.random() * 5),
        },
      });
    }
    return mockPatients;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo paziente?')) return;
    
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Paziente eliminato con successo');
      loadPatients();
    } catch (error) {
      toast.error('Errore durante l\'eliminazione');
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
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
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">Caricamento...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header with Search */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cerca per nome, cognome o codice fiscale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 inline mr-2" />
              Filtri
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => toast.info('Export in sviluppo')}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Esporta
            </button>
            <button
              onClick={() => navigate('/patients/new')}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nuovo Paziente
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Codice Fiscale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Età
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Città
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cartelle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.lastName} {patient.firstName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.fiscalCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {calculateAge(patient.birthDate)} anni
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.mobile || patient.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {patient._count?.clinicalRecords || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Visualizza"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => navigate(`/patients/${patient.id}/edit`)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                      title="Modifica"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 mt-4">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * patientsPerPage + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * patientsPerPage, totalPatients)}
            </span>{' '}
            di <span className="font-medium">{totalPatients}</span> risultati
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PatientList;
