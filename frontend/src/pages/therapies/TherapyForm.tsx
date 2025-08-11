import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AppLayout from '../../components/layout/AppLayout';
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  FileText,
  Activity,
  Clock,
  Hash,
  MapPin,
  AlertCircle,
  Check,
  Search,
  X
} from 'lucide-react';
import { therapyService } from '../../services/therapyService';
import { patientService } from '../../services/patientService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface TherapyFormData {
  clinicalRecordId: string;
  therapyTypeId: string;
  prescribedSessions: number;
  startDate: string;
  frequency: string;
  district: string;
  notes: string;
  parameters: {
    intensity?: number;
    power?: number;
    frequency?: string;
    duration?: number;
  };
}

const TherapyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [clinicalRecords, setClinicalRecords] = useState<any[]>([]);
  const [therapyTypes, setTherapyTypes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TherapyFormData>();
  
  const selectedTherapyTypeId = watch('therapyTypeId');
  const selectedTherapyType = therapyTypes.find(t => t.id === selectedTherapyTypeId);

  useEffect(() => {
    loadTherapyTypes();
    if (isEditMode) {
      loadTherapy();
    }
  }, [id]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchPatients();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedPatient) {
      loadClinicalRecords(selectedPatient.id);
    }
  }, [selectedPatient]);

  const loadTherapy = async () => {
    try {
      setLoading(true);
      const response = await therapyService.getById(id!);
      const therapy = response.data.data.therapy;
      
      // Imposta i valori del form
      reset({
        clinicalRecordId: therapy.clinicalRecordId,
        therapyTypeId: therapy.therapyTypeId,
        prescribedSessions: therapy.prescribedSessions,
        startDate: format(new Date(therapy.startDate), 'yyyy-MM-dd'),
        frequency: therapy.frequency || '3x/settimana',
        district: therapy.district || '',
        notes: therapy.notes || '',
        parameters: therapy.parameters || {}
      });
      
      // Imposta il paziente selezionato
      setSelectedPatient(therapy.clinicalRecord.patient);
      await loadClinicalRecords(therapy.clinicalRecord.patient.id);
      
    } catch (error) {
      console.error('Errore caricamento terapia:', error);
      toast.error('Errore nel caricamento della terapia');
      navigate('/therapies');
    } finally {
      setLoading(false);
    }
  };

  const loadTherapyTypes = async () => {
    try {
      const response = await therapyService.getTherapyTypes();
      setTherapyTypes(response.data.data.therapyTypes || []);
    } catch (error) {
      console.error('Errore caricamento tipi terapia:', error);
      toast.error('Errore nel caricamento dei tipi di terapia');
    }
  };

  const searchPatients = async () => {
    try {
      const response = await patientService.getAll({ search: searchQuery, limit: 10 });
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Errore ricerca pazienti:', error);
    }
  };

  const loadClinicalRecords = async (patientId: string) => {
    try {
      const response = await clinicalRecordService.getByPatient(patientId);
      const records = response.data.data || [];
      setClinicalRecords(records.filter((r: any) => r.isActive));
    } catch (error) {
      console.error('Errore caricamento cartelle:', error);
      toast.error('Errore nel caricamento delle cartelle cliniche');
    }
  };

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientSearch(false);
    setSearchQuery('');
    setPatients([]);
  };

  const onSubmit = async (data: TherapyFormData) => {
    try {
      setLoading(true);
      
      // Prepara i dati
      const therapyData = {
        ...data,
        prescribedSessions: parseInt(data.prescribedSessions.toString()),
        parameters: {
          ...data.parameters,
          intensity: data.parameters.intensity ? parseInt(data.parameters.intensity.toString()) : undefined,
          power: data.parameters.power ? parseInt(data.parameters.power.toString()) : undefined,
          duration: data.parameters.duration ? parseInt(data.parameters.duration.toString()) : 30
        }
      };
      
      if (isEditMode) {
        await therapyService.update(id!, therapyData);
        toast.success('Terapia aggiornata con successo');
      } else {
        await therapyService.create(therapyData);
        toast.success('Terapia creata con successo');
      }
      
      navigate('/therapies');
    } catch (error) {
      console.error('Errore salvataggio terapia:', error);
      toast.error('Errore nel salvataggio della terapia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/therapies')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditMode ? 'Modifica Terapia' : 'Nuova Terapia'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? 'Modifica i dati della terapia' : 'Inserisci i dati per creare una nuova terapia'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              
              {/* Selezione Paziente */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Paziente *
                  </label>
                  
                  {!selectedPatient ? (
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setShowPatientSearch(true)}
                          placeholder="Cerca paziente per nome, cognome o codice fiscale..."
                          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      </div>
                      
                      {showPatientSearch && patients.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                          {patients.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => selectPatient(patient)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                CF: {patient.fiscalCode} • {patient.city}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-sm text-purple-700">
                          CF: {selectedPatient.fiscalCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatient(null);
                          setClinicalRecords([]);
                          setValue('clinicalRecordId', '');
                        }}
                        className="p-1 hover:bg-purple-100 rounded"
                      >
                        <X className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Selezione Cartella Clinica */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Cartella Clinica *
                </label>
                <select
                  {...register('clinicalRecordId', { required: 'Seleziona una cartella clinica' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!selectedPatient || isEditMode}
                >
                  <option value="">Seleziona una cartella...</option>
                  {clinicalRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      #{record.recordNumber} - {record.diagnosis} ({format(new Date(record.acceptanceDate), 'dd/MM/yyyy')})
                    </option>
                  ))}
                </select>
                {errors.clinicalRecordId && (
                  <p className="mt-1 text-sm text-red-600">{errors.clinicalRecordId.message}</p>
                )}
              </div>

              {/* Tipo di Terapia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-2" />
                  Tipo di Terapia *
                </label>
                <select
                  {...register('therapyTypeId', { required: 'Seleziona un tipo di terapia' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleziona tipo terapia...</option>
                  {therapyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.category})
                    </option>
                  ))}
                </select>
                {errors.therapyTypeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.therapyTypeId.message}</p>
                )}
                
                {selectedTherapyType && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">{selectedTherapyType.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-blue-700">
                      <span>Durata default: {selectedTherapyType.defaultDuration} min</span>
                      <span>Sedute consigliate: {selectedTherapyType.defaultSessions}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Numero Sedute */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-2" />
                    Numero Sedute *
                  </label>
                  <input
                    type="number"
                    {...register('prescribedSessions', { 
                      required: 'Inserisci il numero di sedute',
                      min: { value: 1, message: 'Minimo 1 seduta' },
                      max: { value: 50, message: 'Massimo 50 sedute' }
                    })}
                    defaultValue={selectedTherapyType?.defaultSessions || 10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.prescribedSessions && (
                    <p className="mt-1 text-sm text-red-600">{errors.prescribedSessions.message}</p>
                  )}
                </div>

                {/* Data Inizio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data Inizio *
                  </label>
                  <input
                    type="date"
                    {...register('startDate', { required: 'Inserisci la data di inizio' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                {/* Frequenza */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Frequenza *
                  </label>
                  <select
                    {...register('frequency', { required: 'Seleziona la frequenza' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Giornaliera">Giornaliera</option>
                    <option value="3x/settimana">3 volte a settimana</option>
                    <option value="2x/settimana">2 volte a settimana</option>
                    <option value="1x/settimana">1 volta a settimana</option>
                    <option value="Personalizzata">Personalizzata</option>
                  </select>
                  {errors.frequency && (
                    <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
                  )}
                </div>

                {/* Distretto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Distretto/Area
                  </label>
                  <input
                    type="text"
                    {...register('district')}
                    placeholder="es. Spalla destra, Ginocchio sinistro..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Parametri Specifici */}
              {selectedTherapyType && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Parametri Terapia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedTherapyType.category === 'STRUMENTALE' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Intensità (%)</label>
                          <input
                            type="number"
                            {...register('parameters.intensity')}
                            min="0"
                            max="100"
                            placeholder="0-100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Potenza (W)</label>
                          <input
                            type="number"
                            {...register('parameters.power')}
                            min="0"
                            placeholder="Watt"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Frequenza</label>
                          <input
                            type="text"
                            {...register('parameters.frequency')}
                            placeholder="es. 1 MHz, 3 MHz"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Durata seduta (min)</label>
                      <input
                        type="number"
                        {...register('parameters.duration')}
                        defaultValue={selectedTherapyType?.defaultDuration || 30}
                        min="5"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Note e Obiettivi
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  placeholder="Inserisci note sulla terapia, obiettivi del trattamento, precauzioni..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/therapies')}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditMode ? 'Aggiorna' : 'Crea'} Terapia
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default TherapyForm;
