import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Users,
  Activity,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  BarChart2,
  PieChart,
  FileDown,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { pdfReportService } from '../../services/pdfReportService';
import { patientService } from '../../services/patientService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import { therapyService } from '../../services/therapyService';
import toast from 'react-hot-toast';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'clinical' | 'therapy' | 'administrative' | 'statistical';
}

const ReportCenter: React.FC = () => {
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const reportTypes: ReportType[] = [
    {
      id: 'clinical-record',
      name: 'Cartella Clinica Completa',
      description: 'Report dettagliato con diagnosi, terapie e controlli',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-500',
      category: 'clinical',
    },
    {
      id: 'therapy-report',
      name: 'Report Terapia',
      description: 'Dettaglio terapia con registro sedute e progressi',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-green-500',
      category: 'therapy',
    },
    {
      id: 'patient-summary',
      name: 'Scheda Paziente',
      description: 'Riepilogo completo del paziente con storico',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
      category: 'clinical',
    },
    {
      id: 'weekly-calendar',
      name: 'Calendario Settimanale',
      description: 'Planning sedute della settimana',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-orange-500',
      category: 'administrative',
    },
    {
      id: 'monthly-statistics',
      name: 'Statistiche Mensili',
      description: 'Report statistico delle attività del mese',
      icon: <BarChart2 className="w-6 h-6" />,
      color: 'bg-indigo-500',
      category: 'statistical',
    },
    {
      id: 'therapy-summary',
      name: 'Riepilogo Terapie',
      description: 'Panoramica di tutte le terapie attive',
      icon: <PieChart className="w-6 h-6" />,
      color: 'bg-pink-500',
      category: 'statistical',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tutti', count: reportTypes.length },
    { id: 'clinical', name: 'Clinici', count: reportTypes.filter(r => r.category === 'clinical').length },
    { id: 'therapy', name: 'Terapie', count: reportTypes.filter(r => r.category === 'therapy').length },
    { id: 'administrative', name: 'Amministrativi', count: reportTypes.filter(r => r.category === 'administrative').length },
    { id: 'statistical', name: 'Statistici', count: reportTypes.filter(r => r.category === 'statistical').length },
  ];

  useEffect(() => {
    loadPatients();
    loadRecentReports();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll({ limit: 100 });
      if (response.success) {
        setPatients(response.data.data || []);
      }
    } catch (error) {
      console.error('Errore caricamento pazienti:', error);
      // Usa dati mock
      setPatients([
        { id: '1', firstName: 'Mario', lastName: 'Rossi', fiscalCode: 'RSSMRA85M01H501Z' },
        { id: '2', firstName: 'Laura', lastName: 'Bianchi', fiscalCode: 'BNCLRA90F41H501Z' },
      ]);
    }
  };

  const loadRecentReports = () => {
    // Simula report recenti dal localStorage
    const stored = localStorage.getItem('recentReports');
    if (stored) {
      setRecentReports(JSON.parse(stored));
    } else {
      // Mock data
      setRecentReports([
        {
          id: '1',
          type: 'Cartella Clinica',
          patient: 'Rossi Mario',
          date: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          type: 'Report Terapia',
          patient: 'Bianchi Laura',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
      ]);
    }
  };

  const saveRecentReport = (type: string, patient: string) => {
    const newReport = {
      id: Date.now().toString(),
      type,
      patient,
      date: new Date().toISOString(),
      status: 'completed',
    };
    
    const updated = [newReport, ...recentReports.slice(0, 9)];
    setRecentReports(updated);
    localStorage.setItem('recentReports', JSON.stringify(updated));
  };

  const handleGenerateReport = async (reportType: ReportType) => {
    if (!selectedPatient && ['clinical-record', 'therapy-report', 'patient-summary'].includes(reportType.id)) {
      toast.error('Seleziona un paziente');
      return;
    }

    setLoading(true);
    try {
      let pdf: any;
      const patient = patients.find(p => p.id === selectedPatient);
      
      switch (reportType.id) {
        case 'clinical-record':
          // Carica cartella clinica del paziente
          const records = await clinicalRecordService.getByPatient(selectedPatient);
          if (records.success && records.data.length > 0) {
            pdf = pdfReportService.generateClinicalRecordReport(records.data[0]);
            saveRecentReport('Cartella Clinica', `${patient.lastName} ${patient.firstName}`);
          } else {
            // Usa dati mock
            const mockRecord = {
              recordNumber: 'MR-2025-1001',
              acceptanceDate: new Date().toISOString(),
              diagnosis: 'Lombalgia acuta',
              diagnosticDetails: 'Dolore lombare con irradiazione',
              symptomatology: 'Dolore VAS 7/10',
              objectiveExamination: 'Lasègue positivo',
              patient: patient || patients[0],
              therapies: [],
              clinicalControls: [],
            };
            pdf = pdfReportService.generateClinicalRecordReport(mockRecord);
            saveRecentReport('Cartella Clinica', `${patient?.lastName || 'Test'} ${patient?.firstName || 'Test'}`);
          }
          break;
          
        case 'therapy-report':
          // Mock therapy data
          const mockTherapy = {
            therapyType: {
              name: 'Laser YAG',
              category: 'INSTRUMENTAL',
            },
            prescribedSessions: 10,
            completedSessions: 6,
            frequency: '3x/settimana',
            district: 'Lombare',
            startDate: new Date().toISOString(),
            status: 'IN_PROGRESS',
            sessions: Array.from({ length: 6 }, (_, i) => ({
              sessionDate: new Date(Date.now() - (i * 86400000)).toISOString(),
              duration: 30,
              vasScoreBefore: 7 - i,
              vasScoreAfter: 5 - i,
              status: 'COMPLETED',
            })),
          };
          pdf = pdfReportService.generateTherapyReport(mockTherapy, patient || patients[0]);
          saveRecentReport('Report Terapia', `${patient?.lastName || 'Test'} ${patient?.firstName || 'Test'}`);
          break;
          
        case 'patient-summary':
          // Mock records
          const mockRecords = [
            {
              recordNumber: 'MR-2025-1001',
              acceptanceDate: new Date().toISOString(),
              diagnosis: 'Lombalgia acuta',
              closedAt: new Date().toISOString(),
            },
            {
              recordNumber: 'MR-2024-0850',
              acceptanceDate: new Date(Date.now() - 30 * 86400000).toISOString(),
              diagnosis: 'Cervicalgia',
              closedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
            },
          ];
          pdf = pdfReportService.generatePatientSummary(patient || patients[0], mockRecords);
          saveRecentReport('Scheda Paziente', `${patient?.lastName || 'Test'} ${patient?.firstName || 'Test'}`);
          break;
          
        case 'weekly-calendar':
          // Mock sessions
          const mockSessions = Array.from({ length: 20 }, (_, i) => ({
            sessionDate: new Date(Date.now() + (Math.floor(i/3) * 86400000)).toISOString(),
            therapy: {
              therapyType: { name: 'Laser YAG' },
              clinicalRecord: {
                patient: {
                  lastName: ['Rossi', 'Bianchi', 'Verdi'][i % 3],
                  firstName: ['Mario', 'Laura', 'Giuseppe'][i % 3],
                },
              },
            },
          }));
          pdf = pdfReportService.generateWeeklyCalendar(mockSessions, startOfWeek(new Date(), { locale: it }));
          saveRecentReport('Calendario Settimanale', 'Settimana corrente');
          break;
          
        default:
          toast.error('Report non ancora implementato');
          setLoading(false);
          return;
      }
      
      if (pdf) {
        pdf.save(`report-${reportType.id}-${Date.now()}.pdf`);
        toast.success('Report generato con successo');
      }
    } catch (error) {
      console.error('Errore generazione report:', error);
      toast.error('Errore nella generazione del report');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = selectedCategory === 'all' 
    ? reportTypes 
    : reportTypes.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Centro Report
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Genera e gestisci tutti i report del sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filtri */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categorie
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selezione Paziente */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Paziente
              </h3>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Seleziona paziente...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.lastName} {patient.firstName}
                  </option>
                ))}
              </select>
            </div>

            {/* Periodo */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Periodo
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="week">Settimana corrente</option>
                <option value="month">Mese corrente</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Anno</option>
                <option value="custom">Personalizzato</option>
              </select>
            </div>

            {/* Report Recenti */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Report Recenti
              </h3>
              {recentReports.length === 0 ? (
                <p className="text-xs text-gray-500">Nessun report recente</p>
              ) : (
                <div className="space-y-2">
                  {recentReports.slice(0, 5).map(report => (
                    <div key={report.id} className="text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{report.type}</p>
                          <p className="text-gray-500">{report.patient}</p>
                        </div>
                        <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                      </div>
                      <p className="text-gray-400 mt-1">
                        {format(new Date(report.date), 'dd/MM HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Report Oggi</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentReports.filter(r => 
                        format(new Date(r.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ).length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Questa Settimana</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentReports.filter(r => {
                        const reportDate = new Date(r.date);
                        const weekStart = startOfWeek(new Date(), { locale: it });
                        const weekEnd = endOfWeek(new Date(), { locale: it });
                        return reportDate >= weekStart && reportDate <= weekEnd;
                      }).length}
                    </p>
                  </div>
                  <BarChart2 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totale Mese</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentReports.filter(r => {
                        const reportDate = new Date(r.date);
                        const monthStart = startOfMonth(new Date());
                        const monthEnd = endOfMonth(new Date());
                        return reportDate >= monthStart && reportDate <= monthEnd;
                      }).length}
                    </p>
                  </div>
                  <PieChart className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${report.color} bg-opacity-10`}>
                        <div className={`${report.color} text-white p-2 rounded`}>
                          {report.icon}
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {report.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {report.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleGenerateReport(report)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Genera PDF
                      </button>
                      <button
                        onClick={() => {
                          handleGenerateReport(report);
                          // Qui potresti aprire in anteprima
                        }}
                        disabled={loading}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Informazioni sui Report
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    I report vengono generati in formato PDF e possono essere scaricati o stampati direttamente.
                    Per i report clinici e terapeutici è necessario selezionare un paziente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
