import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save,
  X,
  Activity,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format, addDays, addWeeks } from 'date-fns';
import { it } from 'date-fns/locale';
import therapyService from '../../services/therapyService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import type { TherapyType, CreateTherapyDto } from '../../services/therapyService';
import toast from 'react-hot-toast';

interface ClinicalRecord {
  id: string;
  recordNumber: string;
  diagnosis: string;
  patient: {
    firstName: string;
    lastName: string;
    fiscalCode: string;
  };
}

const TherapyForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('recordId');
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [therapyTypes, setTherapyTypes] = useState<TherapyType[]>([]);
  const [clinicalRecord, setClinicalRecord] = useState<ClinicalRecord | null>(null);
  const [selectedType, setSelectedType] = useState<TherapyType | null>(null);
  const [showParameters, setShowParameters] = useState(false);

  const [formData, setFormData] = useState<CreateTherapyDto>({
    clinicalRecordId: recordId || '',
    therapyTypeId: '',
    prescribedSessions: 10,
    frequency: '3x/settimana',
    district: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    parameters: {},
  });

  const [errors, setErrors] = useState<Partial<CreateTherapyDto>>({});

  // Frequenze predefinite
  const frequencies = [
    { value: 'daily', label: 'Quotidiana' },
    { value: '2x/day', label: '2 volte al giorno' },
    { value: '3x/week', label: '3 volte a settimana' },
    { value: '2x/week', label: '2 volte a settimana' },
    { value: 'weekly', label: 'Settimanale' },
    { value: 'biweekly', label: 'Bisettimanale' },
    { value: 'custom', label: 'Personalizzata' },
  ];

  // Distretti anatomici
  const districts = [
    'Cervicale',
    'Dorsale',
    'Lombare',
    'Spalla destra',
    'Spalla sinistra',
    'Gomito destro',
    'Gomito sinistro',
    'Polso destro',
    'Polso sinistro',
    'Mano destra',
    'Mano sinistra',
    'Anca destra',
    'Anca sinistra',
    'Ginocchio destro',
    'Ginocchio sinistro',
    'Caviglia destra',
    'Caviglia sinistra',
    'Piede destro',
    'Piede sinistro',
  ];

  useEffect(() => {
    loadTherapyTypes();
    if (recordId) {
      loadClinicalRecord(recordId);
    }
    if (isEditMode) {
      loadTherapy();
    }
  }, [id, recordId]);

  const loadTherapyTypes = async () => {
    try {
      const response = await therapyService.getTherapyTypes();
      // Gestisci sia array diretto che oggetto con success/data
      if (Array.isArray(response)) {
        setTherapyTypes(response);
      } else if (response?.success && Array.isArray(response.data)) {
        setTherapyTypes(response.data);
      } else if (response?.data && Array.isArray(response.data)) {
        setTherapyTypes(response.data);
      } else {
        // Se la risposta non è nel formato atteso, usa mock
        console.warn('Formato risposta non atteso:', response);
        setTherapyTypes(getMockTherapyTypes());
      }
    } catch (error) {
      console.error('Errore caricamento tipi terapia:', error);
      // Usa dati mock se l'API fallisce
      setTherapyTypes(getMockTherapyTypes());
    }
  };

  const getMockTherapyTypes = (): TherapyType[] => [
    {
      id: 'type-1',
      code: 'LASER_YAG',
      name: 'Laser YAG 1064',
      category: 'INSTRUMENTAL',
      description: 'Laserterapia ad alta potenza per tessuti profondi',
      defaultDuration: 20,
      defaultSessions: 10,
      isActive: true,
    },
    {
      id: 'type-2',
      code: 'TECAR',
      name: 'Tecarterapia',
      category: 'INSTRUMENTAL',
      description: 'Trasferimento Energetico Capacitivo Resistivo',
      defaultDuration: 30,
      defaultSessions: 8,
      isActive: true,
    },
    {
      id: 'type-3',
      code: 'MAGNETO',
      name: 'Magnetoterapia',
      category: 'INSTRUMENTAL',
      description: 'Terapia con campi magnetici pulsati',
      defaultDuration: 30,
      defaultSessions: 15,
      isActive: true,
    },
    {
      id: 'type-4',
      code: 'TENS',
      name: 'TENS',
      category: 'INSTRUMENTAL',
      description: 'Stimolazione Elettrica Nervosa Transcutanea',
      defaultDuration: 30,
      defaultSessions: 10,
      isActive: true,
    },
    {
      id: 'type-5',
      code: 'ULTRA',
      name: 'Ultrasuoni',
      category: 'INSTRUMENTAL',
      description: 'Ultrasuonoterapia',
      defaultDuration: 15,
      defaultSessions: 10,
      isActive: true,
    },
    {
      id: 'type-6',
      code: 'KINESI',
      name: 'Kinesiterapia',
      category: 'MANUAL',
      description: 'Terapia del movimento e riabilitazione funzionale',
      defaultDuration: 45,
      defaultSessions: 10,
      isActive: true,
    },
    {
      id: 'type-7',
      code: 'MASSO',
      name: 'Massoterapia',
      category: 'MANUAL',
      description: 'Massaggio terapeutico decontratturante',
      defaultDuration: 30,
      defaultSessions: 10,
      isActive: true,
    },
    {
      id: 'type-8',
      code: 'IDRO',
      name: 'Idrokinesiterapia',
      category: 'REHABILITATION',
      description: 'Riabilitazione in acqua',
      defaultDuration: 45,
      defaultSessions: 20,
      isActive: true,
    },
  ];

  const loadClinicalRecord = async (recordId: string) => {
    try {
      const response = await clinicalRecordService.getById(recordId);
      if (response.success) {
        setClinicalRecord(response.data);
      }
    } catch (error) {
      console.error('Errore caricamento cartella:', error);
      // Usa dati mock
      setClinicalRecord({
        id: recordId,
        recordNumber: 'MR-2025-1001',
        diagnosis: 'Lombalgia acuta',
        patient: {
          firstName: 'Mario',
          lastName: 'Rossi',
          fiscalCode: 'RSSMRA85M01H501Z',
        },
      });
    }
  };

  const loadTherapy = async () => {
    try {
      setLoading(true);
      const response = await therapyService.getById(id!);
      if (response.success) {
        const therapy = response.data;
        setFormData({
          clinicalRecordId: therapy.clinicalRecordId,
          therapyTypeId: therapy.therapyTypeId,
          prescribedSessions: therapy.prescribedSessions,
          frequency: therapy.frequency || '',
          district: therapy.district || '',
          startDate: format(new Date(therapy.startDate), 'yyyy-MM-dd'),
          notes: therapy.notes || '',
          parameters: therapy.parameters || {},
        });
        
        const type = therapyTypes.find(t => t.id === therapy.therapyTypeId);
        if (type) setSelectedType(type);
        
        if (therapy.clinicalRecord) {
          setClinicalRecord(therapy.clinicalRecord);
        }
      }
    } catch (error) {
      toast.error('Errore nel caricamento della terapia');
      navigate('/therapies');
    } finally {
      setLoading(false);
    }
  };

  const handleTherapyTypeChange = (typeId: string) => {
    const type = therapyTypes.find(t => t.id === typeId);
    if (type) {
      setSelectedType(type);
      setFormData(prev => ({
        ...prev,
        therapyTypeId: typeId,
        prescribedSessions: type.defaultSessions,
      }));
      setErrors(prev => ({ ...prev, therapyTypeId: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTherapyDto> = {};

    if (!formData.clinicalRecordId) {
      newErrors.clinicalRecordId = 'Seleziona una cartella clinica';
    }
    if (!formData.therapyTypeId) {
      newErrors.therapyTypeId = 'Seleziona un tipo di terapia';
    }
    if (!formData.prescribedSessions || formData.prescribedSessions < 1) {
      newErrors.prescribedSessions = 'Numero sedute non valido';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Data inizio obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Correggi gli errori nel form');
      return;
    }

    try {
      setSaving(true);
      
      // Aggiungi parametri specifici per tipo terapia
      const parameters = { ...formData.parameters };
      if (selectedType?.category === 'INSTRUMENTAL') {
        // Parametri default per terapie strumentali
        if (!parameters.intensity) parameters.intensity = 50;
        if (!parameters.duration) parameters.duration = selectedType.defaultDuration;
      }

      const dataToSend = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        parameters,
      };

      if (isEditMode) {
        await therapyService.update(id!, dataToSend);
        toast.success('Terapia aggiornata con successo');
      } else {
        await therapyService.create(dataToSend);
        toast.success('Terapia creata con successo');
      }
      
      // Torna alla cartella clinica o alla lista terapie
      if (recordId) {
        navigate(`/clinical-records/${recordId}`);
      } else {
        navigate('/therapies');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('parameters.')) {
      const paramName = name.replace('parameters.', '');
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [paramName]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value,
      }));
    }
    
    // Rimuovi errore quando l'utente modifica il campo
    if (errors[name as keyof CreateTherapyDto]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const calculateEndDate = () => {
    if (!formData.startDate || !formData.frequency || !formData.prescribedSessions) {
      return null;
    }

    const startDate = new Date(formData.startDate);
    let endDate = startDate;

    switch (formData.frequency) {
      case 'daily':
        endDate = addDays(startDate, formData.prescribedSessions);
        break;
      case '3x/week':
        endDate = addWeeks(startDate, Math.ceil(formData.prescribedSessions / 3));
        break;
      case '2x/week':
        endDate = addWeeks(startDate, Math.ceil(formData.prescribedSessions / 2));
        break;
      case 'weekly':
        endDate = addWeeks(startDate, formData.prescribedSessions);
        break;
      default:
        endDate = addWeeks(startDate, Math.ceil(formData.prescribedSessions / 2));
    }

    return endDate;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'INSTRUMENTAL': return 'Strumentale';
      case 'MANUAL': return 'Manuale';
      case 'REHABILITATION': return 'Riabilitazione';
      default: return 'Altro';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INSTRUMENTAL': return 'bg-blue-100 text-blue-800';
      case 'MANUAL': return 'bg-green-100 text-green-800';
      case 'REHABILITATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Modifica Terapia' : 'Nuova Terapia'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode 
              ? 'Modifica i parametri della terapia' 
              : 'Configura una nuova terapia per il paziente'}
          </p>
        </div>

        {/* Info Cartella Clinica */}
        {clinicalRecord && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  Cartella Clinica #{clinicalRecord.recordNumber}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Paziente: {clinicalRecord.patient.lastName} {clinicalRecord.patient.firstName} - 
                  CF: {clinicalRecord.patient.fiscalCode}
                </p>
                <p className="text-sm text-blue-700">
                  Diagnosi: {clinicalRecord.diagnosis}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selezione Tipo Terapia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Tipo di Terapia</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(therapyTypes) && therapyTypes.length > 0 ? therapyTypes.map(type => (
                <div
                  key={type.id}
                  onClick={() => handleTherapyTypeChange(type.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.therapyTypeId === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(type.category)}`}>
                      {getCategoryLabel(type.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>⏱ {type.defaultDuration} min</span>
                    <span>📅 {type.defaultSessions} sedute</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>Nessun tipo di terapia disponibile</p>
                  <button 
                    type="button"
                    onClick={() => setTherapyTypes(getMockTherapyTypes())}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Usa dati di esempio
                  </button>
                </div>
              )}
            </div>
            
            {errors.therapyTypeId && (
              <p className="text-red-500 text-xs mt-2">{errors.therapyTypeId}</p>
            )}
          </div>

          {/* Configurazione Terapia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Configurazione</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numero Sedute *
                </label>
                <input
                  type="number"
                  name="prescribedSessions"
                  value={formData.prescribedSessions}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.prescribedSessions ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.prescribedSessions && (
                  <p className="text-red-500 text-xs mt-1">{errors.prescribedSessions}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequenza
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona frequenza</option>
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inizio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fine Prevista
                </label>
                <input
                  type="date"
                  value={calculateEndDate() ? format(calculateEndDate()!, 'yyyy-MM-dd') : ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distretto Anatomico
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona distretto</option>
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Parametri Specifici */}
          {selectedType && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                type="button"
                onClick={() => setShowParameters(!showParameters)}
                className="flex items-center justify-between w-full mb-4"
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-500 mr-2" />
                  <h2 className="text-lg font-semibold">Parametri Specifici</h2>
                </div>
                {showParameters ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {showParameters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedType.category === 'INSTRUMENTAL' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Intensità (%)
                        </label>
                        <input
                          type="number"
                          name="parameters.intensity"
                          value={formData.parameters?.intensity || 50}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durata (minuti)
                        </label>
                        <input
                          type="number"
                          name="parameters.duration"
                          value={formData.parameters?.duration || selectedType.defaultDuration}
                          onChange={handleChange}
                          min="5"
                          max="60"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {selectedType.code === 'LASER_YAG' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Potenza (W)
                            </label>
                            <input
                              type="number"
                              name="parameters.power"
                              value={formData.parameters?.power || 10}
                              onChange={handleChange}
                              min="1"
                              max="30"
                              step="0.5"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequenza (Hz)
                            </label>
                            <input
                              type="number"
                              name="parameters.frequency"
                              value={formData.parameters?.frequency || 10}
                              onChange={handleChange}
                              min="1"
                              max="10000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedType.code === 'MAGNETO' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequenza (Hz)
                            </label>
                            <select
                              name="parameters.magnetFrequency"
                              value={formData.parameters?.magnetFrequency || '50'}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="10">10 Hz</option>
                              <option value="25">25 Hz</option>
                              <option value="50">50 Hz</option>
                              <option value="100">100 Hz</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Intensità (Gauss)
                            </label>
                            <input
                              type="number"
                              name="parameters.gaussIntensity"
                              value={formData.parameters?.gaussIntensity || 100}
                              onChange={handleChange}
                              min="10"
                              max="200"
                              step="10"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  
                  {selectedType.category === 'MANUAL' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tecnica Specifica
                        </label>
                        <input
                          type="text"
                          name="parameters.technique"
                          value={formData.parameters?.technique || ''}
                          onChange={handleChange}
                          placeholder="Es: Mobilizzazione articolare, stretching..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Note</h2>
            </div>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Note aggiuntive, precauzioni, indicazioni particolari..."
            />
          </div>

          {/* Alert informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Informazione
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Dopo la creazione della terapia, potrai pianificare le singole sedute 
                  e assegnarle ai terapisti disponibili.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (recordId) {
                  navigate(`/clinical-records/${recordId}`);
                } else {
                  navigate('/therapies');
                }
              }}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvataggio...' : (isEditMode ? 'Aggiorna Terapia' : 'Crea Terapia')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapyForm;
