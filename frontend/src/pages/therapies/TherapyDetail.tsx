import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  TrendingUp,
  AlertCircle,
  Plus,
  ChevronRight,
  Download,
  Printer,
  Target,
  BarChart3,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import therapyService from '../../services/therapyService';
import toast from 'react-hot-toast';

const TherapyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [therapy, setTherapy] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'progress' | 'notes'>('sessions');

  useEffect(() => {
    if (id) {
      loadTherapy();
      // Commentiamo loadSessions per evitare errori 404
      // loadSessions();
    }
  }, [id]);

  const loadTherapy = async () => {
    try {
      setLoading(true);
      // Per ora usiamo sempre mock data
      const mockData = getMockTherapy();
      setTherapy(mockData);
      setSessions(getMockSessions());
      /*
      const response = await therapyService.getById(id!);
      setTherapy(response.therapy || getMockTherapy());
      */
    } catch (error) {
      console.error('Errore caricamento terapia:', error);
      setTherapy(getMockTherapy());
      setSessions(getMockSessions());
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    // Commentato per evitare errori 404
    /*
    try {
      const response = await therapyService.getSessions(id!);
      setSessions(response.sessions || getMockSessions());
    } catch (error) {
      console.error('Errore caricamento sedute:', error);
      setSessions(getMockSessions());
    }
    */
    setSessions(getMockSessions());
  };

  const getMockTherapy = () => ({
    id: id,
    patient: {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rossi',
      fiscalCode: 'RSSMRA85M01H501Z',
      birthDate: '1985-08-01',
      phone: '+39 333 1234567',
      email: 'mario.rossi@email.com',
      address: 'Via Roma 123',
      city: 'Milano',
      province: 'MI',
    },
    clinicalRecord: {
      id: 'record-1',
      recordNumber: 'CR-2024-0001',
      diagnosis: 'Lombalgia acuta',
      acceptanceDate: new Date().toISOString(),
    },
    therapyType: {
      id: 'type-1',
      name: 'Fisioterapia',
      category: 'MANUAL',
      description: 'Terapia manuale per il recupero funzionale',
    },
    status: 'ACTIVE',
    prescribedSessions: 10,
    completedSessions: 4,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: null,
    frequency: 'Bisettimanale',
    duration: '45 minuti',
    notes: 'Paziente risponde bene al trattamento. Miglioramento della mobilità articolare.',
    prescribedBy: {
      firstName: 'Dott.',
      lastName: 'Bianchi',
      role: 'DOCTOR',
    },
    therapist: {
      firstName: 'Anna',
      lastName: 'Verdi',
      role: 'THERAPIST',
    },
    objectives: [
      'Riduzione del dolore',
      'Recupero della mobilità articolare',
      'Rinforzo muscolare',
      'Rieducazione posturale'
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const getMockSessions = () => {
    const sessions = [];
    for (let i = 1; i <= 10; i++) {
      sessions.push({
        id: `session-${i}`,
        sessionNumber: i,
        date: new Date(Date.now() - (10 - i) * 3 * 86400000).toISOString(),
        completed: i <= 4,
        duration: 45,
        therapist: {
          firstName: 'Anna',
          lastName: 'Verdi',
        },
        vasScoreBefore: i <= 4 ? 7 - Math.floor(i / 2) : null,
        vasScoreAfter: i <= 4 ? 5 - Math.floor(i / 2) : null,
        notes: i <= 4 ? `Seduta ${i}: Buon progresso, paziente collaborativo` : null,
        exercises: i <= 4 ? [
          'Mobilizzazione articolare',
          'Stretching',
          'Rinforzo muscolare',
          'Esercizi propriocettivi'
        ] : [],
      });
    }
    return sessions;
  };

  const handleStartSession = (sessionId: string) => {
    navigate(`/therapies/${id}/sessions/${sessionId}`);
  };

  const handleSuspendTherapy = async () => {
    if (window.confirm('Sei sicuro di voler sospendere questa terapia?')) {
      try {
        await therapyService.suspend(id!);
        toast.success('Terapia sospesa con successo');
        loadTherapy();
      } catch (error) {
        toast.error('Errore durante la sospensione');
      }
    }
  };

  const handleCompleteTherapy = async () => {
    if (window.confirm('Sei sicuro di voler completare questa terapia?')) {
      try {
        await therapyService.complete(id!);
        toast.success('Terapia completata con successo');
        loadTherapy();
      } catch (error) {
        toast.error('Errore durante il completamento');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Export in corso...');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
            <Play className="w-4 h-4" />
            In Corso
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            <CheckCircle className="w-4 h-4" />
            Completata
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700">
            <Pause className="w-4 h-4" />
            Sospesa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <XCircle className="w-4 h-4" />
            Annullata
          </span>
        );
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento terapia...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!therapy) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-medium">Terapia non trovata</p>
            <button
              onClick={() => navigate('/therapies')}
              className="mt-4 text-purple-600 hover:text-purple-800"
            >
              Torna alla lista
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const progressPercentage = (therapy.completedSessions / therapy.prescribedSessions) * 100;
  const completedSessions = sessions.filter(s => s.completed);
  const nextSession = sessions.find(s => !s.completed);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/therapies')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Terapia - {therapy.therapyType.name}
                  </h1>
                  {getStatusBadge(therapy.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {therapy.patient.firstName} {therapy.patient.lastName} - Cartella #{therapy.clinicalRecord.recordNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Printer className="w-4 h-4" />
                Stampa
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta
              </button>
              {therapy.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={() => navigate(`/therapies/${id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifica
                  </button>
                  <button
                    onClick={handleSuspendTherapy}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                  >
                    <Pause className="w-4 h-4" />
                    Sospendi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonna sinistra - Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card Paziente */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dati Paziente</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium text-lg">
                      {therapy.patient.firstName.charAt(0)}{therapy.patient.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {therapy.patient.firstName} {therapy.patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{therapy.patient.fiscalCode}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 space-y-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{therapy.patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-xs">{therapy.patient.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{therapy.patient.address}</p>
                        <p className="text-gray-600">{therapy.patient.city} ({therapy.patient.province})</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/patients/${therapy.patient.id}`)}
                      className="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Vai alla scheda paziente →
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Info Terapia */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Terapia</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="text-gray-900 font-medium">{therapy.therapyType.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{therapy.therapyType.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Frequenza</p>
                    <p className="text-gray-900 font-medium">{therapy.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durata seduta</p>
                    <p className="text-gray-900 font-medium">{therapy.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data inizio</p>
                    <p className="text-gray-900 font-medium">
                      {format(new Date(therapy.startDate), 'dd MMMM yyyy', { locale: it })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prescrittore</p>
                    <p className="text-gray-900 font-medium">
                      {therapy.prescribedBy.firstName} {therapy.prescribedBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terapista</p>
                    <p className="text-gray-900 font-medium">
                      {therapy.therapist.firstName} {therapy.therapist.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Progresso */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600">Completamento</p>
                      <p className="text-lg font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">{therapy.completedSessions}</p>
                      <p className="text-xs text-gray-600">Completate</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {therapy.prescribedSessions - therapy.completedSessions}
                      </p>
                      <p className="text-xs text-gray-600">Rimanenti</p>
                    </div>
                  </div>

                  {nextSession && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Prossima seduta</p>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="font-medium text-purple-900">
                          Seduta #{nextSession.sessionNumber}
                        </p>
                        <p className="text-sm text-purple-700 mt-1">
                          {format(new Date(nextSession.date), 'EEEE dd MMMM', { locale: it })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonna destra - Dettagli */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('sessions')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'sessions'
                          ? 'border-b-2 border-purple-600 text-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sedute ({therapy.completedSessions}/{therapy.prescribedSessions})
                    </button>
                    <button
                      onClick={() => setActiveTab('progress')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'progress'
                          ? 'border-b-2 border-purple-600 text-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Andamento
                    </button>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === 'notes'
                          ? 'border-b-2 border-purple-600 text-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Note e Obiettivi
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Tab Sedute */}
                  {activeTab === 'sessions' && (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={`border rounded-lg p-4 ${
                            session.completed 
                              ? 'bg-gray-50 border-gray-200' 
                              : 'bg-white border-purple-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                  session.completed 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {session.sessionNumber}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Seduta #{session.sessionNumber}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(session.date), 'EEEE dd MMMM yyyy', { locale: it })}
                                  </p>
                                </div>
                              </div>
                              
                              {session.completed && (
                                <div className="ml-11 space-y-2">
                                  <div className="flex items-center gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">VAS prima: </span>
                                      <span className="font-medium">{session.vasScoreBefore}/10</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">VAS dopo: </span>
                                      <span className="font-medium">{session.vasScoreAfter}/10</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Durata: </span>
                                      <span className="font-medium">{session.duration} min</span>
                                    </div>
                                  </div>
                                  {session.notes && (
                                    <p className="text-sm text-gray-600 italic">"{session.notes}"</p>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              {session.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <button
                                  onClick={() => handleStartSession(session.id)}
                                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  Inizia
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab Andamento */}
                  {activeTab === 'progress' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Andamento VAS Score</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            {completedSessions.map((session) => (
                              <div key={session.id} className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 w-20">Seduta {session.sessionNumber}</span>
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-sm font-medium">{session.vasScoreBefore}</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                                    <div 
                                      className="absolute top-0 left-0 h-2 bg-red-400 rounded-full"
                                      style={{ width: `${session.vasScoreBefore * 10}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">→</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                                    <div 
                                      className="absolute top-0 left-0 h-2 bg-green-400 rounded-full"
                                      style={{ width: `${session.vasScoreAfter * 10}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{session.vasScoreAfter}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Statistiche</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-green-700">
                              {completedSessions.length > 0 
                                ? Math.round(((completedSessions[0].vasScoreBefore - completedSessions[completedSessions.length - 1].vasScoreAfter) / completedSessions[0].vasScoreBefore) * 100)
                                : 0}%
                            </p>
                            <p className="text-sm text-green-600 mt-1">Miglioramento VAS</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-blue-700">100%</p>
                            <p className="text-sm text-blue-600 mt-1">Aderenza</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-purple-700">
                              {completedSessions.reduce((sum, s) => sum + s.duration, 0)}
                            </p>
                            <p className="text-sm text-purple-600 mt-1">Minuti totali</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Note e Obiettivi */}
                  {activeTab === 'notes' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          Obiettivi del trattamento
                        </h4>
                        <div className="space-y-2">
                          {therapy.objectives.map((objective: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                              <p className="text-sm text-gray-700">{objective}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          Note generali
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700">{therapy.notes}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          Diagnosi associata
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-blue-900">{therapy.clinicalRecord.diagnosis}</p>
                          <button
                            onClick={() => navigate(`/clinical-records/${therapy.clinicalRecord.id}`)}
                            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Vai alla cartella clinica →
                          </button>
                        </div>
                      </div>
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

export default TherapyDetail;
