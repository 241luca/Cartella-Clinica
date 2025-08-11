import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Activity,
  Clock,
  User,
  Shield,
  Download,
  Plus,
  Printer,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Heart,
  Stethoscope,
} from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../../services/api';
import toast from 'react-hot-toast';
import NewTherapyWizard from '../../components/therapy/NewTherapyWizard';

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
  province?: string;
  postalCode: string;
  phone?: string;
  mobile?: string;
  email?: string;
  occupation?: string;
  generalPractitioner?: string;
  prescribingDoctor?: string;
  notes?: string;
  privacyConsent: boolean;
  dataProcessingConsent?: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ClinicalRecord {
  id: string;
  recordNumber: string;
  acceptanceDate: string;
  diagnosis: string;
  status: string;
  closedAt?: string;
  _count?: {
    therapies: number;
  };
}

interface Therapy {
  id: string;
  therapyType: {
    name: string;
    category: string;
  };
  status: string;
  prescribedSessions: number;
  completedSessions: number;
  startDate: string;
  endDate?: string;
}

interface VitalSign {
  id: string;
  measurementDate: string;
  temperature?: number;
  heartRate?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

interface TimelineEvent {
  id: string;
  type: 'record' | 'therapy' | 'session' | 'vital' | 'document';
  date: string;
  title: string;
  description?: string;
  status?: string;
  icon: React.ReactNode;
  color: string;
}

const PatientDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'therapies' | 'timeline'>('overview');
  const [showTherapyWizard, setShowTherapyWizard] = useState(false);
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (id) {
      loadPatientData();
    }
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      
      // Carica dati paziente
      const patientRes = await api.get(`/patients/${id}`);
      
      if (patientRes.data.success && patientRes.data.data) {
        setPatient(patientRes.data.data);
        
        // Carica cartelle cliniche se il paziente esiste
        try {
          const recordsRes = await api.get(`/patients/${id}/clinical-records`);
          if (recordsRes.data.success) {
            setClinicalRecords(recordsRes.data.data || []);
          }
        } catch (err) {
          setClinicalRecords([]);
        }
        
        // Carica terapie per le cartelle cliniche del paziente
        try {
          // Ottieni prima le cartelle cliniche
          const recordsRes = await api.get(`/patients/${id}/clinical-records`);
          if (recordsRes.data.success && recordsRes.data.data.length > 0) {
            // Per ogni cartella clinica, carica le terapie
            const allTherapies = [];
            for (const record of recordsRes.data.data) {
              const therapiesRes = await api.get(`/therapies?clinicalRecordId=${record.id}`);
              if (therapiesRes.data.success && therapiesRes.data.data) {
                allTherapies.push(...therapiesRes.data.data);
              }
            }
            setTherapies(allTherapies);
          }
        } catch (err) {
          console.log('Error loading therapies:', err);
          setTherapies([]);
        }
        
        // I vital signs potrebbero non esistere ancora come endpoint
        setVitalSigns([]);
        
        // Genera timeline con i dati reali
        generateTimeline(
          clinicalRecords,
          therapies,
          []
        );
      } else {
        // Paziente non trovato
        console.error('Paziente non trovato nel database');
        setPatient(null);
      }
      
    } catch (error) {
      console.error('Errore caricamento dati paziente:', error);
      toast.error('Errore nel caricamento dei dati del paziente');
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };


  const generateTimeline = (records: ClinicalRecord[], therapies: Therapy[], vitals: VitalSign[]) => {
    const events: TimelineEvent[] = [];
    
    // Aggiungi cartelle cliniche
    records.forEach(record => {
      events.push({
        id: `record-${record.id}`,
        type: 'record',
        date: record.acceptanceDate,
        title: `Cartella Clinica #${record.recordNumber}`,
        description: record.diagnosis,
        status: record.status,
        icon: <FileText className="w-4 h-4" />,
        color: record.status === 'OPEN' ? 'blue' : 'gray',
      });
    });
    
    // Aggiungi terapie
    therapies.forEach(therapy => {
      events.push({
        id: `therapy-${therapy.id}`,
        type: 'therapy',
        date: therapy.startDate,
        title: therapy.therapyType.name,
        description: `${therapy.completedSessions}/${therapy.prescribedSessions} sedute completate`,
        status: therapy.status,
        icon: <Activity className="w-4 h-4" />,
        color: therapy.status === 'COMPLETED' ? 'green' : 'purple',
      });
    });
    
    // Aggiungi segni vitali
    vitals.forEach(vital => {
      events.push({
        id: `vital-${vital.id}`,
        type: 'vital',
        date: vital.measurementDate,
        title: 'Misurazione parametri vitali',
        description: `PA: ${vital.bloodPressureSys}/${vital.bloodPressureDia}, FC: ${vital.heartRate}`,
        icon: <Heart className="w-4 h-4" />,
        color: 'red',
      });
    });
    
    // Ordina per data decrescente
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTimelineEvents(events);
  };

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo paziente? Questa azione non può essere annullata.')) {
      return;
    }
    
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Paziente eliminato con successo');
      navigate('/patients');
    } catch (error) {
      toast.error('Errore durante l\'eliminazione del paziente');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Export in corso...');
    // TODO: Implementare export PDF
  };

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Maschio';
      case 'FEMALE': return 'Femmina';
      default: return 'Altro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'SCHEDULED': return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Paziente non trovato</h2>
          <button
            onClick={() => navigate('/patients')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Torna alla lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <button
                onClick={() => navigate('/patients')}
                className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.lastName} {patient.firstName}
                </h1>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-mono">{patient.fiscalCode}</span>
                  <span>•</span>
                  <span>{calculateAge(patient.birthDate)} anni</span>
                  <span>•</span>
                  <span>{getGenderLabel(patient.gender)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Stampa"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Esporta PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/patients/${id}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifica
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Elimina"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Panoramica
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cartelle Cliniche ({clinicalRecords.length})
              </button>
              <button
                onClick={() => setActiveTab('therapies')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'therapies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Terapie ({therapies.length})
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Timeline
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informazioni Personali */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      Informazioni Personali
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Data di Nascita</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {format(new Date(patient.birthDate), 'dd MMMM yyyy', { locale: it })}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Luogo di Nascita</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.birthPlace}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Professione</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {patient.occupation || 'Non specificata'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Registrato il</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {format(new Date(patient.createdAt), 'dd/MM/yyyy')}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      Contatti e Residenza
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Indirizzo</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {patient.address}<br />
                          {patient.postalCode} {patient.city} ({patient.province})
                        </dd>
                      </div>
                      {patient.phone && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Telefono</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.phone}
                          </dd>
                        </div>
                      )}
                      {patient.mobile && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Cellulare</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.mobile}
                          </dd>
                        </div>
                      )}
                      {patient.email && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.email}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2 text-gray-500" />
                      Informazioni Mediche
                    </h3>
                    <dl className="space-y-3">
                      {patient.generalPractitioner && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Medico Curante</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patient.generalPractitioner}</dd>
                        </div>
                      )}
                      {patient.prescribingDoctor && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Medico Prescrittore</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patient.prescribingDoctor}</dd>
                        </div>
                      )}
                      {patient.notes && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Note</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patient.notes}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`/patients/${id}/records/new`)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuova Cartella
                      </button>
                      <button
                        onClick={() => setShowTherapyWizard(true)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuova Terapia
                      </button>
                      <button
                        onClick={() => navigate(`/patients/${id}/appointments/new`)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Prenota Appuntamento
                      </button>
                    </div>
                  </div>

                  {/* Consensi */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-gray-500" />
                      Consensi
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Privacy</span>
                        {patient.privacyConsent ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trattamento Dati</span>
                        {patient.dataProcessingConsent ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Marketing</span>
                        {patient.marketingConsent ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ultimi Parametri Vitali */}
                  {vitalSigns.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        Ultimi Parametri Vitali
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pressione</span>
                          <span className="font-medium">
                            {vitalSigns[0].bloodPressureSys}/{vitalSigns[0].bloodPressureDia} mmHg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequenza Cardiaca</span>
                          <span className="font-medium">{vitalSigns[0].heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Saturazione O₂</span>
                          <span className="font-medium">{vitalSigns[0].oxygenSaturation}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peso</span>
                          <span className="font-medium">{vitalSigns[0].weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BMI</span>
                          <span className="font-medium">{vitalSigns[0].bmi}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Misurato il {format(new Date(vitalSigns[0].measurementDate), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clinical Records Tab */}
            {activeTab === 'records' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Cartelle Cliniche</h3>
                  <button
                    onClick={() => navigate(`/patients/${id}/records/new`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuova Cartella
                  </button>
                </div>
                
                {clinicalRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessuna cartella clinica presente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clinicalRecords.map(record => (
                      <div
                        key={record.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/clinical-records/${record.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Cartella #{record.recordNumber}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{record.diagnosis}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Aperta il {format(new Date(record.acceptanceDate), 'dd/MM/yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              record.status === 'OPEN' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {record.status === 'OPEN' ? 'Aperta' : 'Chiusa'}
                            </span>
                            {record._count && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {record._count.therapies} terapie
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Therapies Tab */}
            {activeTab === 'therapies' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Terapie</h3>
                  <button
                    onClick={() => setShowTherapyWizard(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuova Terapia
                  </button>
                </div>
                
                {therapies.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessuna terapia presente</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {therapies.map(therapy => (
                      <div
                        key={therapy.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900">
                            {therapy.therapyType.name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(therapy.status)}`}>
                            {therapy.status === 'COMPLETED' && 'Completata'}
                            {therapy.status === 'IN_PROGRESS' && 'In Corso'}
                            {therapy.status === 'SCHEDULED' && 'Programmata'}
                            {therapy.status === 'CANCELLED' && 'Annullata'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Categoria</span>
                            <span className="font-medium">
                              {therapy.therapyType.category === 'INSTRUMENTAL' && 'Strumentale'}
                              {therapy.therapyType.category === 'MANUAL' && 'Manuale'}
                              {therapy.therapyType.category === 'REHABILITATION' && 'Riabilitazione'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Progresso</span>
                            <span className="font-medium">
                              {therapy.completedSessions}/{therapy.prescribedSessions} sedute
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Inizio</span>
                            <span className="font-medium">
                              {format(new Date(therapy.startDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(therapy.completedSessions / therapy.prescribedSessions) * 100}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((therapy.completedSessions / therapy.prescribedSessions) * 100)}% completato
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Attività</h3>
                
                {timelineEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessuna attività registrata</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {/* Timeline events */}
                    <div className="space-y-6">
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className="relative flex items-start">
                          {/* Timeline dot */}
                          <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white bg-${event.color}-500`} />
                          
                          {/* Event content */}
                          <div className="ml-16 bg-white border border-gray-200 rounded-lg p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg bg-${event.color}-100 text-${event.color}-600`}>
                                  {event.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                  {event.description && (
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-2">
                                    {format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: it })}
                                  </p>
                                </div>
                              </div>
                              {event.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                  {event.status === 'OPEN' && 'Aperta'}
                                  {event.status === 'CLOSED' && 'Chiusa'}
                                  {event.status === 'COMPLETED' && 'Completata'}
                                  {event.status === 'IN_PROGRESS' && 'In Corso'}
                                  {event.status === 'SCHEDULED' && 'Programmata'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Therapy Wizard */}
      <NewTherapyWizard
        isOpen={showTherapyWizard}
        onClose={() => setShowTherapyWizard(false)}
        patientId={patient.id}
        clinicalRecordId={clinicalRecords.find(r => r.status === 'OPEN')?.id}
        onSuccess={(therapy) => {
          toast.success('Terapia creata con successo!');
          loadPatientData(); // Ricarica i dati
          setActiveTab('therapies'); // Passa al tab terapie
        }}
      />
    </div>
  );
};

export default PatientDetail;
