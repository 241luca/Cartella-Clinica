import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Lock,
  Unlock,
  FileText,
  Calendar,
  User,
  Activity,
  Clock,
  Download,
  Plus,
  Printer,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Heart,
  Clipboard,
  Package,
  TrendingUp,
  X,
  Eye,
  Trash2,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import { pdfReportService } from '../../services/pdfReportService';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ClinicalRecord {
  id: string;
  patientId: string;
  recordNumber: string;
  acceptanceDate: string;
  diagnosis: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: string;
  interventionDoctor?: string;
  isActive: boolean;
  closedAt?: string;
  closureNotes?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    fiscalCode: string;
    birthDate: string;
    gender: string;
    phone?: string;
    mobile?: string;
    email?: string;
    address: string;
    city: string;
  };
  createdBy: {
    firstName: string;
    lastName: string;
    role: string;
  };
  therapies?: Therapy[];
  clinicalControls?: ClinicalControl[];
  documents?: Document[];
}

interface Therapy {
  id: string;
  therapyType: {
    name: string;
    category: string;
    defaultDuration: number;
  };
  prescribedSessions: number;
  completedSessions: number;
  frequency?: string;
  status: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  district?: string;
}

interface ClinicalControl {
  id: string;
  controlDate: string;
  notes: string;
  nextControlDate?: string;
  performedBy: {
    firstName: string;
    lastName: string;
  };
}

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  description?: string;
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
}

interface TimelineEvent {
  id: string;
  type: 'creation' | 'therapy' | 'control' | 'document' | 'closure' | 'reopening';
  date: string;
  title: string;
  description?: string;
  user?: string;
  icon: React.ReactNode;
  color: string;
}

const ClinicalRecordDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'therapies' | 'controls' | 'documents' | 'timeline'>('overview');
  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closureNotes, setClosureNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadRecord();
    }
  }, [id]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      const response = await clinicalRecordService.getById(id!);
      
      if (response.success) {
        setRecord(response.data);
        generateTimeline(response.data);
      }
    } catch (error) {
      console.error('Errore caricamento cartella:', error);
      // Usa dati mock se l'API fallisce
      const mockRecord = getMockRecord();
      setRecord(mockRecord);
      generateTimeline(mockRecord);
    } finally {
      setLoading(false);
    }
  };

  const getMockRecord = (): ClinicalRecord => ({
    id: 'record-1',
    patientId: 'patient-1',
    recordNumber: 'MR-2025-1001',
    acceptanceDate: '2025-07-01T10:00:00Z',
    diagnosis: 'Lombalgia acuta con irradiazione sciatica',
    diagnosticDetails: 'Paziente presenta sintomatologia da 3 mesi, dolore acuto in regione lombare con irradiazione all\'arto inferiore destro',
    symptomatology: 'Dolore lombare acuto (VAS 7/10), limitazione funzionale nella flessione anteriore del tronco, parestesie arto inferiore destro',
    objectiveExamination: 'Lasègue positivo a 45°, Wasserman negativo, ROT simmetrici e normoevocabili, forza muscolare conservata',
    instrumentalExams: 'RMN lombo-sacrale: protrusione discale L4-L5 con impronta sul sacco durale',
    interventionDate: '2025-07-05T10:00:00Z',
    interventionDoctor: 'Dott. Mario Rossi',
    isActive: true,
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-08-10T15:00:00Z',
    patient: {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rossi',
      fiscalCode: 'RSSMRA85M01H501Z',
      birthDate: '1985-08-01',
      gender: 'MALE',
      phone: '0544123456',
      mobile: '3331234567',
      email: 'mario.rossi@email.it',
      address: 'Via Roma 123',
      city: 'Ravenna',
    },
    createdBy: {
      firstName: 'Dott.',
      lastName: 'Bianchi',
      role: 'DOCTOR',
    },
    therapies: [
      {
        id: 'therapy-1',
        therapyType: {
          name: 'Laser YAG',
          category: 'INSTRUMENTAL',
          defaultDuration: 20,
        },
        prescribedSessions: 10,
        completedSessions: 6,
        frequency: '3 volte/settimana',
        status: 'IN_PROGRESS',
        startDate: '2025-07-05T10:00:00Z',
        district: 'Lombare',
        notes: 'Paziente risponde bene al trattamento',
      },
      {
        id: 'therapy-2',
        therapyType: {
          name: 'Kinesiterapia',
          category: 'MANUAL',
          defaultDuration: 45,
        },
        prescribedSessions: 15,
        completedSessions: 8,
        frequency: '2 volte/settimana',
        status: 'IN_PROGRESS',
        startDate: '2025-07-10T10:00:00Z',
        district: 'Rachide lombare',
      },
    ],
    clinicalControls: [
      {
        id: 'control-1',
        controlDate: '2025-07-20T10:00:00Z',
        notes: 'Miglioramento sintomatologia, VAS 5/10, proseguire con terapia',
        nextControlDate: '2025-08-20T10:00:00Z',
        performedBy: {
          firstName: 'Dott.',
          lastName: 'Bianchi',
        },
      },
    ],
    documents: [],
  });

  const generateTimeline = (recordData: ClinicalRecord) => {
    const events: TimelineEvent[] = [];
    
    // Creazione cartella
    events.push({
      id: 'event-creation',
      type: 'creation',
      date: recordData.createdAt,
      title: 'Cartella clinica creata',
      description: `Diagnosi: ${recordData.diagnosis}`,
      user: `${recordData.createdBy.firstName} ${recordData.createdBy.lastName}`,
      icon: <FileText className="w-4 h-4" />,
      color: 'blue',
    });
    
    // Intervento
    if (recordData.interventionDate) {
      events.push({
        id: 'event-intervention',
        type: 'control',
        date: recordData.interventionDate,
        title: 'Intervento medico',
        description: `Eseguito da ${recordData.interventionDoctor}`,
        icon: <Stethoscope className="w-4 h-4" />,
        color: 'purple',
      });
    }
    
    // Terapie
    recordData.therapies?.forEach(therapy => {
      events.push({
        id: `event-therapy-${therapy.id}`,
        type: 'therapy',
        date: therapy.startDate,
        title: `Iniziata terapia: ${therapy.therapyType.name}`,
        description: `${therapy.prescribedSessions} sedute prescritte`,
        icon: <Activity className="w-4 h-4" />,
        color: 'green',
      });
    });
    
    // Controlli
    recordData.clinicalControls?.forEach(control => {
      events.push({
        id: `event-control-${control.id}`,
        type: 'control',
        date: control.controlDate,
        title: 'Controllo clinico',
        description: control.notes,
        user: `${control.performedBy.firstName} ${control.performedBy.lastName}`,
        icon: <Clipboard className="w-4 h-4" />,
        color: 'orange',
      });
    });
    
    // Chiusura
    if (recordData.closedAt) {
      events.push({
        id: 'event-closure',
        type: 'closure',
        date: recordData.closedAt,
        title: 'Cartella chiusa',
        description: recordData.closureNotes,
        icon: <Lock className="w-4 h-4" />,
        color: 'gray',
      });
    }
    
    // Ordina per data decrescente
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTimelineEvents(events);
  };

  const handleClose = async () => {
    if (!closureNotes.trim()) {
      toast.error('Inserisci le note di chiusura');
      return;
    }
    
    try {
      await clinicalRecordService.close(id!, closureNotes);
      toast.success('Cartella clinica chiusa con successo');
      setShowCloseModal(false);
      loadRecord();
    } catch (error) {
      toast.error('Errore durante la chiusura');
    }
  };

  const handleReopen = async () => {
    if (!confirm('Sei sicuro di voler riaprire questa cartella clinica?')) return;
    
    try {
      await clinicalRecordService.reopen(id!, 'Riapertura per ulteriori trattamenti');
      toast.success('Cartella clinica riaperta con successo');
      loadRecord();
    } catch (error) {
      toast.error('Errore durante la riapertura');
    }
  };

  const handlePrint = () => {
    if (record) {
      const pdf = pdfReportService.generateClinicalRecordReport(record);
      // Apri in nuova finestra per stampa
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    }
  };

  const handleExport = async () => {
    if (record) {
      try {
        const pdf = pdfReportService.generateClinicalRecordReport(record);
        pdf.save(`cartella-clinica-${record.recordNumber}.pdf`);
        toast.success('Report PDF generato con successo');
      } catch (error) {
        toast.error('Errore generazione report');
      }
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'INSTRUMENTAL': return 'Strumentale';
      case 'MANUAL': return 'Manuale';
      case 'REHABILITATION': return 'Riabilitazione';
      default: return category;
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

  const getDaysOpen = () => {
    if (!record) return 0;
    const start = new Date(record.acceptanceDate);
    const end = record.closedAt ? new Date(record.closedAt) : new Date();
    return differenceInDays(end, start);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Cartella non trovata</h2>
          <button
            onClick={() => navigate('/clinical-records')}
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
                onClick={() => navigate('/clinical-records')}
                className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Cartella #{record.recordNumber}
                  </h1>
                  {record.closedAt ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                      Chiusa
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                      Aperta
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    Paziente: <span className="font-medium text-gray-900">
                      {record.patient.lastName} {record.patient.firstName}
                    </span>
                  </span>
                  <span>•</span>
                  <span>CF: {record.patient.fiscalCode}</span>
                  <span>•</span>
                  <span>{getDaysOpen()} giorni</span>
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
              {!record.closedAt && (
                <>
                  <button
                    onClick={() => navigate(`/clinical-records/${id}/edit`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica
                  </button>
                  <button
                    onClick={() => setShowCloseModal(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chiudi cartella"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                </>
              )}
              {record.closedAt && (
                <button
                  onClick={handleReopen}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Riapri
                </button>
              )}
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
                onClick={() => setActiveTab('therapies')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'therapies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Terapie ({record.therapies?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('controls')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'controls'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Controlli ({record.clinicalControls?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documenti ({record.documents?.length || 0})
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
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Diagnosi */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2 text-gray-500" />
                      Diagnosi
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Diagnosi principale</dt>
                        <dd className="mt-1 text-sm text-gray-900">{record.diagnosis}</dd>
                      </div>
                      {record.diagnosticDetails && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Dettagli diagnostici</dt>
                          <dd className="mt-1 text-sm text-gray-900">{record.diagnosticDetails}</dd>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Valutazione Clinica */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clipboard className="w-5 h-5 mr-2 text-gray-500" />
                      Valutazione Clinica
                    </h3>
                    <div className="space-y-3">
                      {record.symptomatology && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Sintomatologia</dt>
                          <dd className="mt-1 text-sm text-gray-900">{record.symptomatology}</dd>
                        </div>
                      )}
                      {record.objectiveExamination && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Esame obiettivo</dt>
                          <dd className="mt-1 text-sm text-gray-900">{record.objectiveExamination}</dd>
                        </div>
                      )}
                      {record.instrumentalExams && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Esami strumentali</dt>
                          <dd className="mt-1 text-sm text-gray-900">{record.instrumentalExams}</dd>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Intervento */}
                  {record.interventionDate && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-gray-500" />
                        Intervento
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data intervento</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {format(new Date(record.interventionDate), 'dd MMMM yyyy', { locale: it })}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Medico</dt>
                          <dd className="mt-1 text-sm text-gray-900">{record.interventionDoctor}</dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Info Paziente */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      Paziente
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Nome:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {record.patient.lastName} {record.patient.firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Età:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {calculateAge(record.patient.birthDate)} anni
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sesso:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {record.patient.gender === 'MALE' ? 'Maschio' : 'Femmina'}
                        </span>
                      </div>
                      {record.patient.mobile && (
                        <div>
                          <span className="text-gray-500">Tel:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {record.patient.mobile}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/patients/${record.patient.id}`)}
                        className="mt-3 w-full text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        Vedi Scheda Paziente
                      </button>
                    </div>
                  </div>

                  {/* Info Cartella */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-500" />
                      Informazioni Cartella
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Aperta il:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {format(new Date(record.acceptanceDate), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Creata da:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {record.createdBy.firstName} {record.createdBy.lastName}
                        </span>
                      </div>
                      {record.closedAt && (
                        <>
                          <div>
                            <span className="text-gray-500">Chiusa il:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {format(new Date(record.closedAt), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          {record.closureNotes && (
                            <div>
                              <span className="text-gray-500">Note chiusura:</span>
                              <p className="mt-1 text-gray-900">{record.closureNotes}</p>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        <span className="text-gray-500">Durata:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {getDaysOpen()} giorni
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Azioni Rapide */}
                  {!record.closedAt && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate(`/clinical-records/${id}/therapies/new`)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Aggiungi Terapia
                        </button>
                        <button
                          onClick={() => navigate(`/clinical-records/${id}/controls/new`)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Aggiungi Controllo
                        </button>
                        <button
                          onClick={() => navigate(`/clinical-records/${id}/documents`)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Carica Documento
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Therapies Tab */}
            {activeTab === 'therapies' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Terapie Prescritte</h3>
                  {!record.closedAt && (
                    <button
                      onClick={() => navigate(`/clinical-records/${id}/therapies/new`)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuova Terapia
                    </button>
                  )}
                </div>
                
                {!record.therapies || record.therapies.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessuna terapia prescritta</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.therapies.map(therapy => (
                      <div
                        key={therapy.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {therapy.therapyType.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {getCategoryLabel(therapy.therapyType.category)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(therapy.status)}`}>
                            {therapy.status === 'COMPLETED' && 'Completata'}
                            {therapy.status === 'IN_PROGRESS' && 'In Corso'}
                            {therapy.status === 'SCHEDULED' && 'Programmata'}
                            {therapy.status === 'CANCELLED' && 'Annullata'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sedute:</span>
                            <span className="font-medium">
                              {therapy.completedSessions}/{therapy.prescribedSessions}
                            </span>
                          </div>
                          {therapy.frequency && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Frequenza:</span>
                              <span className="font-medium">{therapy.frequency}</span>
                            </div>
                          )}
                          {therapy.district && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Distretto:</span>
                              <span className="font-medium">{therapy.district}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Inizio:</span>
                            <span className="font-medium">
                              {format(new Date(therapy.startDate), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${(therapy.completedSessions / therapy.prescribedSessions) * 100}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((therapy.completedSessions / therapy.prescribedSessions) * 100)}% completato
                          </p>
                        </div>
                        
                        {therapy.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">{therapy.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => navigate(`/therapies/${therapy.id}`)}
                            className="flex-1 text-center px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                          >
                            Dettagli
                          </button>
                          <button
                            onClick={() => navigate(`/therapies/${therapy.id}/sessions`)}
                            className="flex-1 text-center px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm"
                          >
                            Sedute
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Controls Tab */}
            {activeTab === 'controls' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Controlli Clinici</h3>
                  {!record.closedAt && (
                    <button
                      onClick={() => navigate(`/clinical-records/${id}/controls/new`)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuovo Controllo
                    </button>
                  )}
                </div>
                
                {!record.clinicalControls || record.clinicalControls.length === 0 ? (
                  <div className="text-center py-12">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessun controllo clinico registrato</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {record.clinicalControls.map(control => (
                      <div
                        key={control.id}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <span className="text-sm font-semibold text-gray-900">
                                {format(new Date(control.controlDate), 'dd MMMM yyyy', { locale: it })}
                              </span>
                              <span className="text-sm text-gray-500">
                                {control.performedBy.firstName} {control.performedBy.lastName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{control.notes}</p>
                            {control.nextControlDate && (
                              <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                Prossimo controllo: {format(new Date(control.nextControlDate), 'dd/MM/yyyy')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Documenti</h3>
                  {!record.closedAt && (
                    <button
                      onClick={() => navigate(`/clinical-records/${id}/documents`)}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Gestisci Documenti
                    </button>
                  )}
                </div>
                
                {!record.documents || record.documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessun documento caricato</p>
                    {!record.closedAt && (
                      <button
                        onClick={() => navigate(`/clinical-records/${id}/documents`)}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Carica il primo documento
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {record.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.fileType} • {format(new Date(doc.uploadDate), 'dd/MM/yyyy')}
                            </p>
                            {doc.description && (
                              <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button className="flex-1 text-center px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs">
                            <Eye className="w-3 h-3 inline mr-1" />
                            Visualizza
                          </button>
                          <button className="flex-1 text-center px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-xs">
                            <Download className="w-3 h-3 inline mr-1" />
                            Scarica
                          </button>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Eventi</h3>
                
                {timelineEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nessun evento registrato</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {/* Timeline events */}
                    <div className="space-y-6">
                      {timelineEvents.map((event) => (
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
                                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                    <span>
                                      {format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: it })}
                                    </span>
                                    {event.user && (
                                      <>
                                        <span>•</span>
                                        <span>{event.user}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
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

      {/* Modal Chiusura Cartella */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chiudi Cartella Clinica
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Stai per chiudere questa cartella clinica. Inserisci le note di chiusura:
            </p>
            <textarea
              value={closureNotes}
              onChange={(e) => setClosureNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Note di chiusura, esito del trattamento, raccomandazioni..."
            />
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Chiudi Cartella
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalRecordDetail;
