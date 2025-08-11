import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import {
  ArrowLeft,
  Save,
  Clock,
  User,
  Activity,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Stethoscope,
  ClipboardCheck,
  Edit3
} from 'lucide-react';
import therapyService from '../../services/therapyService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const SessionDetail: React.FC = () => {
  const { therapyId, sessionId } = useParams<{ therapyId: string; sessionId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [therapy, setTherapy] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [vasScoreBefore, setVasScoreBefore] = useState<number>(5);
  const [vasScoreAfter, setVasScoreAfter] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [parameters, setParameters] = useState<any>({});
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    if (therapyId && sessionId) {
      loadData();
    }
  }, [therapyId, sessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carica terapia
      const therapyResponse = await therapyService.getById(therapyId!);
      const therapyData = therapyResponse.data.data.therapy;
      setTherapy(therapyData);
      
      // Trova la sessione
      const sessionData = therapyData.sessions.find((s: any) => s.id === sessionId);
      if (sessionData) {
        setSession(sessionData);
        setVasScoreBefore(sessionData.vasScoreBefore || 5);
        setVasScoreAfter(sessionData.vasScoreAfter || 3);
        setNotes(sessionData.notes || '');
        setParameters(sessionData.parameters || therapyData.parameters || {});
      } else {
        toast.error('Sessione non trovata');
        navigate(`/therapies/${therapyId}`);
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error);
      toast.error('Errore nel caricamento dei dati');
      navigate('/therapies');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        status: 'COMPLETED',
        vasScoreBefore,
        vasScoreAfter,
        notes,
        parameters,
        therapistSignature: 'signed', // In produzione, implementare firma digitale reale
        patientSignature: showSignature ? 'signed' : null
      };
      
      await therapyService.updateSession(therapyId!, sessionId!, updateData);
      
      toast.success('Sessione completata con successo');
      navigate(`/therapies/${therapyId}`);
    } catch (error) {
      console.error('Errore salvataggio sessione:', error);
      toast.error('Errore nel salvataggio della sessione');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Sei sicuro di voler annullare questa sessione?')) {
      try {
        setSaving(true);
        await therapyService.updateSession(therapyId!, sessionId!, {
          status: 'CANCELLED',
          notes: `Sessione annullata il ${format(new Date(), 'dd/MM/yyyy HH:mm')}`
        });
        toast.success('Sessione annullata');
        navigate(`/therapies/${therapyId}`);
      } catch (error) {
        console.error('Errore annullamento sessione:', error);
        toast.error('Errore nell\'annullamento della sessione');
      } finally {
        setSaving(false);
      }
    }
  };

  const getVASColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVASDescription = (score: number) => {
    if (score === 0) return 'Nessun dolore';
    if (score <= 2) return 'Dolore lieve';
    if (score <= 4) return 'Dolore moderato';
    if (score <= 6) return 'Dolore moderato-severo';
    if (score <= 8) return 'Dolore severo';
    return 'Dolore insopportabile';
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento sessione...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!session || !therapy) {
    return null;
  }

  const vasImprovement = vasScoreBefore - vasScoreAfter;
  const improvementPercentage = vasScoreBefore > 0 ? (vasImprovement / vasScoreBefore) * 100 : 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/therapies/${therapyId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sessione #{session.sessionNumber}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {therapy.therapyType.name} • {therapy.clinicalRecord.patient.firstName} {therapy.clinicalRecord.patient.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.status === 'COMPLETED' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Completata
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700">
                  <Clock className="w-4 h-4" />
                  In Corso
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonna sinistra - Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Card Paziente */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Dati Paziente
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium text-gray-900">
                      {therapy.clinicalRecord.patient.firstName} {therapy.clinicalRecord.patient.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Codice Fiscale</p>
                    <p className="font-medium text-gray-900">{therapy.clinicalRecord.patient.fiscalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosi</p>
                    <p className="font-medium text-gray-900">{therapy.clinicalRecord.diagnosis}</p>
                  </div>
                </div>
              </div>

              {/* Card Terapia */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  Informazioni Terapia
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="font-medium text-gray-900">{therapy.therapyType.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data sessione</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(session.sessionDate), 'EEEE dd MMMM yyyy', { locale: it })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Orario</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(session.sessionDate), 'HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durata</p>
                    <p className="font-medium text-gray-900">{session.duration || 30} minuti</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terapista</p>
                    <p className="font-medium text-gray-900">
                      {session.therapist?.firstName} {session.therapist?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonna centrale e destra - Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* VAS Score */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  Valutazione VAS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* VAS Prima */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      VAS Pre-trattamento
                    </label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={vasScoreBefore}
                        onChange={(e) => setVasScoreBefore(parseInt(e.target.value))}
                        className="w-full"
                        disabled={session.status === 'COMPLETED'}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                      <div className="text-center">
                        <p className={`text-3xl font-bold ${getVASColor(vasScoreBefore)}`}>
                          {vasScoreBefore}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getVASDescription(vasScoreBefore)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VAS Dopo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      VAS Post-trattamento
                    </label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={vasScoreAfter}
                        onChange={(e) => setVasScoreAfter(parseInt(e.target.value))}
                        className="w-full"
                        disabled={session.status === 'COMPLETED'}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                      <div className="text-center">
                        <p className={`text-3xl font-bold ${getVASColor(vasScoreAfter)}`}>
                          {vasScoreAfter}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getVASDescription(vasScoreAfter)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Miglioramento */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-900">Miglioramento</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">
                        {vasImprovement > 0 ? '-' : '+'}{Math.abs(vasImprovement)} punti
                      </p>
                      <p className="text-sm text-green-600">
                        ({improvementPercentage.toFixed(0)}% di riduzione)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parametri Terapia */}
              {therapy.therapyType.category === 'STRUMENTALE' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-gray-400" />
                    Parametri Utilizzati
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Intensità (%)</label>
                      <input
                        type="number"
                        value={parameters.intensity || 75}
                        onChange={(e) => setParameters({...parameters, intensity: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={session.status === 'COMPLETED'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Potenza (W)</label>
                      <input
                        type="number"
                        value={parameters.power || 100}
                        onChange={(e) => setParameters({...parameters, power: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={session.status === 'COMPLETED'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Frequenza</label>
                      <input
                        type="text"
                        value={parameters.frequency || '3 MHz'}
                        onChange={(e) => setParameters({...parameters, frequency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={session.status === 'COMPLETED'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Durata (min)</label>
                      <input
                        type="number"
                        value={parameters.duration || session.duration || 30}
                        onChange={(e) => setParameters({...parameters, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={session.status === 'COMPLETED'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Note della Sessione
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Inserisci note sulla sessione, reazioni del paziente, osservazioni..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={session.status === 'COMPLETED'}
                />
              </div>

              {/* Firma */}
              {session.status !== 'COMPLETED' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-gray-400" />
                    Firma Digitale
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showSignature}
                        onChange={(e) => setShowSignature(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Il paziente ha firmato il consenso per questa sessione
                      </span>
                    </label>
                    {showSignature && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Firma del terapista:</p>
                        <p className="font-medium text-gray-900">
                          {session.therapist?.firstName} {session.therapist?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Firmato digitalmente il {format(new Date(), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              {session.status !== 'COMPLETED' && (
                <div className="flex justify-between">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Annulla Sessione
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/therapies/${therapyId}`)}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Torna alla Terapia
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Salvataggio...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completa Sessione
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SessionDetail;
