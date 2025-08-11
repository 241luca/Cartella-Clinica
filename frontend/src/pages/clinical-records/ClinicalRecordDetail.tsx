import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import {
  ArrowLeft,
  Edit,
  Download,
  Print,
  Calendar,
  User,
  FileText,
  Activity,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Users,
  FileCheck,
  Plus,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import toast from 'react-hot-toast';

const ClinicalRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'therapies' | 'documents' | 'history'>('info');

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
      } else {
        // Dati mock per sviluppo
        setRecord(getMockRecord());
      }
    } catch (error) {
      console.error('Errore caricamento cartella:', error);
      // Usa dati mock in caso di errore
      setRecord(getMockRecord());
    } finally {
      setLoading(false);
    }
  };

  const getMockRecord = () => ({
    id: id,
    recordNumber: 'REC-2024-0001',
    acceptanceDate: new Date().toISOString(),
    diagnosis: 'Lombalgia acuta',
    diagnosticDetails: 'Paziente presenta dolore acuto nella regione lombare con limitazione funzionale. Esame obiettivo evidenzia contrattura muscolare paravertebrale.',
    symptomatology: 'Dolore acuto nella regione lombare insorto 3 giorni fa dopo sforzo fisico. VAS 7/10. Limitazione nei movimenti di flessione ed estensione.',
    objectiveExamination: 'Paziente in discrete condizioni generali. Deambulazione antalgica. Colonna lombare rigida con contrattura muscolare paravertebrale bilaterale. Lasègue negativo bilateralmente. ROT simmetrici e normoevocabili.',
    instrumentalExams: 'RX colonna lombare: modesta riduzione dello spazio intersomatico L4-L5. Non lesioni ossee traumatiche.',
    interventionDate: new Date().toISOString(),
    interventionDoctor: 'Dott. Mario Bianchi',
    isActive: true,
    patient: {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rossi',
      fiscalCode: 'RSSMRA85M01H501Z',
      birthDate: '1985-08-01',
      birthPlace: 'Roma',
      phone: '+39 333 1234567',
      email: 'mario.rossi@email.com',
      address: 'Via Roma 123',
      city: 'Milano',
      province: 'MI',
      postalCode: '20100'
    },
    createdBy: {
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'ADMIN'
    },
    therapies: [
      {
        id: 'therapy-1',
        therapyType: { name: 'Massoterapia', category: 'MANUAL' },
        sessionsPlanned: 10,
        sessionsCompleted: 3,
        status: 'IN_PROGRESS',
        startDate: new Date().toISOString()
      },
      {
        id: 'therapy-2',
        therapyType: { name: 'TENS', category: 'INSTRUMENTAL' },
        sessionsPlanned: 8,
        sessionsCompleted: 2,
        status: 'IN_PROGRESS',
        startDate: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleCloseRecord = async () => {
    if (window.confirm('Sei sicuro di voler chiudere questa cartella clinica?')) {
      try {
        await clinicalRecordService.close(id!);
        toast.success('Cartella clinica chiusa con successo');
        loadRecord();
      } catch (error) {
        toast.error('Errore durante la chiusura');
      }
    }
  };

  const handleReopenRecord = async () => {
    if (window.confirm('Sei sicuro di voler riaprire questa cartella clinica?')) {
      try {
        await clinicalRecordService.reopen(id!);
        toast.success('Cartella clinica riaperta con successo');
        loadRecord();
      } catch (error) {
        toast.error('Errore durante la riapertura');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    try {
      const blob = await clinicalRecordService.generateReport(id!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cartella-${record.recordNumber}.pdf`;
      a.click();
      toast.success('Report generato con successo');
    } catch (error) {
      toast.error('Errore generazione report');
    }
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento cartella clinica...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!record) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-medium">Cartella clinica non trovata</p>
            <button
              onClick={() => navigate('/clinical-records')}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Torna alla lista
            </button>
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
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/clinical-records')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Cartella #{record.recordNumber}
                  </h1>
                  {record.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <Unlock className="w-3 h-3" />
                      Aperta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <Lock className="w-3 h-3" />
                      Chiusa
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {record.patient.firstName} {record.patient.lastName} - {record.patient.fiscalCode}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Print className="w-4 h-4" />
                Stampa
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta PDF
              </button>
              {record.isActive ? (
                <>
                  <button
                    onClick={() => navigate(`/clinical-records/${id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifica
                  </button>
                  <button
                    onClick={handleCloseRecord}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Chiudi Cartella
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReopenRecord}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <Unlock className="w-4 h-4" />
                  Riapri Cartella
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonna sinistra - Info paziente */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card Paziente */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dati Paziente</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium text-lg">
                      {record.patient.firstName.charAt(0)}{record.patient.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.patient.firstName} {record.patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{record.patient.fiscalCode}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 space-y-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Nato il:</span>
                      <span className="text-gray-900">
                        {record.patient.birthDate && format(new Date(record.patient.birthDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Luogo:</span>
                      <span className="text-gray-900">{record.patient.birthPlace || 'N/D'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{record.patient.phone || 'N/D'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-xs">{record.patient.email || 'N/D'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{record.patient.address || 'N/D'}</p>
                        <p className="text-gray-600">
                          {record.patient.postalCode} {record.patient.city} ({record.patient.province})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info Cartella */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Cartella</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Data Accettazione</p>
                    <p className="text-gray-900 font-medium">
                      {format(new Date(record.acceptanceDate), 'dd MMMM yyyy', { locale: it })}
                    </p>
                  </div>
                  {record.interventionDate && (
                    <div>
                      <p className="text-sm text-gray-600">Data Intervento</p>
                      <p className="text-gray-900 font-medium">
                        {format(new Date(record.interventionDate), 'dd MMMM yyyy', { locale: it })}
                      </p>
                    </div>
                  )}
                  {record.interventionDoctor && (
                    <div>
                      <p className="text-sm text-gray-600">Medico Intervento</p>
                      <p className="text-gray-900 font-medium">{record.interventionDoctor}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Creata da</p>
                    <p className="text-gray-900 font-medium">
                      {record.createdBy.firstName} {record.createdBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ultimo aggiornamento</p>
                    <p className="text-gray-900 font-medium">
                      {format(new Date(record.updatedAt), 'dd/MM/yyyy HH:mm', { locale: it })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonna destra - Dettagli clinici */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'info'
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Informazioni Cliniche
                    </button>
                    <button
                      onClick={() => setActiveTab('therapies')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'therapies'
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Terapie ({record.therapies?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'documents'
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Documenti
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'history'
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Cronologia
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Tab Info Cliniche */}
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          Diagnosi
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-900 font-medium">{record.diagnosis}</p>
                        </div>
                      </div>

                      {record.diagnosticDetails && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Dettagli Diagnostici</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{record.diagnosticDetails}</p>
                          </div>
                        </div>
                      )}

                      {record.symptomatology && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            Sintomatologia
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{record.symptomatology}</p>
                          </div>
                        </div>
                      )}

                      {record.objectiveExamination && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            Esame Obiettivo
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{record.objectiveExamination}</p>
                          </div>
                        </div>
                      )}

                      {record.instrumentalExams && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Esami Strumentali
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{record.instrumentalExams}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Terapie */}
                  {activeTab === 'therapies' && (
                    <div>
                      {record.therapies && record.therapies.length > 0 ? (
                        <div className="space-y-4">
                          {record.therapies.map((therapy: any) => (
                            <div key={therapy.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{therapy.therapyType.name}</h4>
                                  <p className="text-sm text-gray-500">{therapy.therapyType.category}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  therapy.status === 'COMPLETED' 
                                    ? 'bg-green-100 text-green-700'
                                    : therapy.status === 'IN_PROGRESS'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {therapy.status === 'COMPLETED' ? 'Completata' : 
                                   therapy.status === 'IN_PROGRESS' ? 'In corso' : 'Pianificata'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Sedute pianificate:</span>
                                  <span className="ml-2 font-medium">{therapy.sessionsPlanned}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Sedute completate:</span>
                                  <span className="ml-2 font-medium">{therapy.sessionsCompleted}</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{
                                      width: `${(therapy.sessionsCompleted / therapy.sessionsPlanned) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {record.isActive && (
                            <button
                              onClick={() => navigate(`/clinical-records/${id}/therapies/new`)}
                              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Aggiungi Terapia
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Nessuna terapia registrata</p>
                          {record.isActive && (
                            <button
                              onClick={() => navigate(`/clinical-records/${id}/therapies/new`)}
                              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                            >
                              Aggiungi Prima Terapia
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Documenti */}
                  {activeTab === 'documents' && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nessun documento caricato</p>
                      {record.isActive && (
                        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
                          Carica Documento
                        </button>
                      )}
                    </div>
                  )}

                  {/* Tab Cronologia */}
                  {activeTab === 'history' && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Cartella creata</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(record.createdAt), 'dd MMMM yyyy HH:mm', { locale: it })}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            da {record.createdBy.firstName} {record.createdBy.lastName}
                          </p>
                        </div>
                      </div>
                      {record.interventionDate && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <Stethoscope className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Intervento eseguito</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(record.interventionDate), 'dd MMMM yyyy', { locale: it })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {record.interventionDoctor}
                            </p>
                          </div>
                        </div>
                      )}
                      {!record.isActive && record.closedAt && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                            <Lock className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Cartella chiusa</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(record.closedAt), 'dd MMMM yyyy HH:mm', { locale: it })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClinicalRecordDetail;
