import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Calendar,
  User,
  Activity,
  FileText,
  CheckCircle2
} from 'lucide-react';

// Import di tutti i form delle terapie
import MagnetoterapiaForm from '../therapy-forms/MagnetoterapiaForm';
import LaserYagForm from '../therapy-forms/LaserYagForm';
import Laser810980Form from '../therapy-forms/Laser810980Form';
import LaserScannerForm from '../therapy-forms/LaserScannerForm';
import UltrasuoniForm from '../therapy-forms/UltrasuoniForm';
import TensForm from '../therapy-forms/TensForm';
import ElettrostimolazioneForm from '../therapy-forms/ElettrostimolazioneForm';
import TecarsinForm from '../therapy-forms/TecarsinForm';
import MassoterapiaForm from '../therapy-forms/MassoterapiaForm';
import MobilizzazioniForm from '../therapy-forms/MobilizzazioniForm';
import LimfaterapyForm from '../therapy-forms/LimfaterapyForm';
import SITForm from '../therapy-forms/SITForm';
import TecalabForm from '../therapy-forms/TecalabForm';

// Import servizi
import { therapyService } from '../../services/therapyService';
import { patientService } from '../../services/patientService';
import PatientSearchInput from './PatientSearchInput';

interface NewTherapyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  clinicalRecordId?: string;
  onSuccess?: (therapy: any) => void;
}

interface TherapyType {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  defaultDuration: number;
  defaultSessions: number;
}

const THERAPY_CATEGORIES = [
  { id: 'STRUMENTALE', name: 'Terapie Strumentali', icon: Activity, color: 'blue' },
  { id: 'MANUALE', name: 'Terapie Manuali', icon: User, color: 'green' },
  { id: 'SPECIALE', name: 'Terapie Speciali', icon: FileText, color: 'purple' },
];

const NewTherapyWizard: React.FC<NewTherapyWizardProps> = ({
  isOpen,
  onClose,
  patientId,
  clinicalRecordId,
  onSuccess
}) => {
  // Se non c'è patientId, aggiungiamo uno step per la selezione paziente
  const needsPatientSelection = !patientId && !clinicalRecordId;
  const [currentStep, setCurrentStep] = useState(needsPatientSelection ? 0 : 1);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTherapyType, setSelectedTherapyType] = useState<TherapyType | null>(null);
  const [therapyTypes, setTherapyTypes] = useState<TherapyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Dati del form
  const [formData, setFormData] = useState<any>({
    clinicalRecordId: clinicalRecordId || '',
    therapyTypeId: '',
    prescribedSessions: 10,
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'GIORNALIERA',
    district: '',
    notes: '',
    parameters: {}
  });

  // Carica i tipi di terapia
  useEffect(() => {
    // Usa direttamente i tipi predefiniti per ora
    const defaultTypes: TherapyType[] = [
      { id: '1', name: 'Magnetoterapia', code: 'MAGNETO', category: 'STRUMENTALE', description: 'Terapia con campi magnetici', defaultDuration: 30, defaultSessions: 10 },
      { id: '2', name: 'Laser YAG', code: 'LASER_YAG', category: 'STRUMENTALE', description: 'Laser ad alta potenza', defaultDuration: 20, defaultSessions: 8 },
      { id: '3', name: 'Laser 810+980', code: 'LASER_810_980', category: 'STRUMENTALE', description: 'Laser a doppia lunghezza d\'onda', defaultDuration: 20, defaultSessions: 8 },
      { id: '4', name: 'Laser Scanner', code: 'LASER_SCAN', category: 'STRUMENTALE', description: 'Laser scanner automatico', defaultDuration: 15, defaultSessions: 10 },
      { id: '5', name: 'Ultrasuoni', code: 'ULTRASUONI', category: 'STRUMENTALE', description: 'Terapia ad ultrasuoni', defaultDuration: 15, defaultSessions: 10 },
      { id: '6', name: 'TENS', code: 'TENS', category: 'STRUMENTALE', description: 'Elettrostimolazione antalgica', defaultDuration: 30, defaultSessions: 10 },
      { id: '7', name: 'Elettrostimolazione', code: 'ELETTROSTIM', category: 'STRUMENTALE', description: 'Stimolazione muscolare', defaultDuration: 30, defaultSessions: 12 },
      { id: '8', name: 'Tecarsin', code: 'TECAR', category: 'STRUMENTALE', description: 'Tecarterapia', defaultDuration: 30, defaultSessions: 8 },
      { id: '9', name: 'Massoterapia', code: 'MASSOTERAPIA', category: 'MANUALE', description: 'Massaggio terapeutico', defaultDuration: 45, defaultSessions: 10 },
      { id: '10', name: 'Mobilizzazioni', code: 'MOBILIZZAZIONI', category: 'MANUALE', description: 'Mobilizzazione articolare', defaultDuration: 30, defaultSessions: 10 },
      { id: '11', name: 'Limfaterapy', code: 'LIMFATERAPY', category: 'SPECIALE', description: 'Drenaggio linfatico', defaultDuration: 45, defaultSessions: 10 },
      { id: '12', name: 'SIT', code: 'SIT', category: 'SPECIALE', description: 'Sistema infiltrativo transcutaneo', defaultDuration: 20, defaultSessions: 6 },
      { id: '13', name: 'Tecalab', code: 'TECALAB', category: 'SPECIALE', description: 'Tecarterapia avanzata', defaultDuration: 40, defaultSessions: 8 }
    ];
    
    setTherapyTypes(defaultTypes);
    console.log('Therapy types loaded:', defaultTypes.length, 'types');
    
    // NON chiamare loadTherapyTypes che sovrascrive con array vuoto
    // loadTherapyTypes();
  }, []);

  const loadTherapyTypes = async () => {
    try {
      const response = await therapyService.getTherapyTypes();
      console.log('Raw therapy types response:', response);
      
      // Gestisci diverse strutture di risposta
      let types = [];
      
      // Log per debug
      console.log('response structure:', {
        hasData: !!response.data,
        hasTherapyTypes: !!response.data?.therapyTypes,
        hasDataData: !!response.data?.data,
        isArray: Array.isArray(response.data),
        directTherapyTypes: !!response.therapyTypes
      });
      
      if (response.data?.therapyTypes && Array.isArray(response.data.therapyTypes)) {
        types = response.data.therapyTypes;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        types = response.data.data;
      } else if (Array.isArray(response.data)) {
        types = response.data;
      } else if (response.therapyTypes && Array.isArray(response.therapyTypes)) {
        types = response.therapyTypes;
      } else if (response.data) {
        // Se response.data è un oggetto, potrebbe avere i dati in una proprietà diversa
        console.log('response.data keys:', Object.keys(response.data));
        // Cerca un array nei valori dell'oggetto
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          types = possibleArrays[0] as TherapyType[];
        }
      }
      
      console.log('Extracted therapy types:', types);
      console.log('Is array?', Array.isArray(types));
      
      // Assicurati che sia un array
      if (!Array.isArray(types)) {
        console.warn('Types is not an array, using fallback');
        throw new Error('Invalid therapy types format');
      }
      
      setTherapyTypes(types);
    } catch (error) {
      console.error('Errore caricamento tipi terapia:', error);
      
      // Usa tipi di terapia di fallback se l'API fallisce
      const fallbackTypes: TherapyType[] = [
        { id: '1', name: 'Magnetoterapia', code: 'MAGNETO', category: 'STRUMENTALE', description: 'Terapia con campi magnetici', defaultDuration: 30, defaultSessions: 10 },
        { id: '2', name: 'Laser YAG', code: 'LASER_YAG', category: 'STRUMENTALE', description: 'Laser ad alta potenza', defaultDuration: 20, defaultSessions: 8 },
        { id: '3', name: 'Laser 810+980', code: 'LASER_810_980', category: 'STRUMENTALE', description: 'Laser a doppia lunghezza d\'onda', defaultDuration: 20, defaultSessions: 8 },
        { id: '4', name: 'Laser Scanner', code: 'LASER_SCAN', category: 'STRUMENTALE', description: 'Laser scanner automatico', defaultDuration: 15, defaultSessions: 10 },
        { id: '5', name: 'Ultrasuoni', code: 'ULTRASUONI', category: 'STRUMENTALE', description: 'Terapia ad ultrasuoni', defaultDuration: 15, defaultSessions: 10 },
        { id: '6', name: 'TENS', code: 'TENS', category: 'STRUMENTALE', description: 'Elettrostimolazione antalgica', defaultDuration: 30, defaultSessions: 10 },
        { id: '7', name: 'Elettrostimolazione', code: 'ELETTROSTIM', category: 'STRUMENTALE', description: 'Stimolazione muscolare', defaultDuration: 30, defaultSessions: 12 },
        { id: '8', name: 'Tecarsin', code: 'TECAR', category: 'STRUMENTALE', description: 'Tecarterapia', defaultDuration: 30, defaultSessions: 8 },
        { id: '9', name: 'Massoterapia', code: 'MASSOTERAPIA', category: 'MANUALE', description: 'Massaggio terapeutico', defaultDuration: 45, defaultSessions: 10 },
        { id: '10', name: 'Mobilizzazioni', code: 'MOBILIZZAZIONI', category: 'MANUALE', description: 'Mobilizzazione articolare', defaultDuration: 30, defaultSessions: 10 },
        { id: '11', name: 'Limfaterapy', code: 'LIMFATERAPY', category: 'SPECIALE', description: 'Drenaggio linfatico', defaultDuration: 45, defaultSessions: 10 },
        { id: '12', name: 'SIT', code: 'SIT', category: 'SPECIALE', description: 'Sistema infiltrativo transcutaneo', defaultDuration: 20, defaultSessions: 6 },
        { id: '13', name: 'Tecalab', code: 'TECALAB', category: 'SPECIALE', description: 'Tecarterapia avanzata', defaultDuration: 40, defaultSessions: 8 }
      ];
      
      console.log('Using fallback therapy types');
      setTherapyTypes(fallbackTypes);
    }
  };

  // Filtra tipi per categoria
  const getFilteredTherapyTypes = () => {
    console.log('getFilteredTherapyTypes called:', {
      selectedCategory,
      therapyTypes,
      isArray: Array.isArray(therapyTypes),
      length: therapyTypes?.length
    });
    
    if (!selectedCategory) return [];
    
    // Assicurati che therapyTypes sia un array
    if (!Array.isArray(therapyTypes)) {
      console.error('therapyTypes is not an array:', therapyTypes);
      return [];
    }
    
    if (therapyTypes.length === 0) {
      console.warn('therapyTypes is empty');
      return [];
    }
    
    const filtered = therapyTypes.filter(t => t.category === selectedCategory);
    console.log('Filtered therapy types:', filtered);
    return filtered;
  };

  // Gestione step
  const nextStep = () => {
    if (currentStep === 0) {
      if (!selectedPatient || !selectedRecord) {
        setError('Seleziona un paziente e una cartella clinica');
        return;
      }
      // Imposta i dati selezionati
      setFormData({ ...formData, clinicalRecordId: selectedRecord.id });
    }
    if (currentStep === 1 && !selectedCategory) {
      setError('Seleziona una categoria');
      return;
    }
    if (currentStep === 2 && !selectedTherapyType) {
      setError('Seleziona un tipo di terapia');
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  // Salvataggio terapia
  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        ...formData,
        therapyTypeId: selectedTherapyType?.id,
        clinicalRecordId: clinicalRecordId || selectedRecord?.id || formData.clinicalRecordId,
      };

      const response = await therapyService.create(dataToSave);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Reset e chiudi
      setCurrentStep(1);
      setSelectedCategory('');
      setSelectedTherapyType(null);
      setFormData({
        clinicalRecordId: clinicalRecordId || '',
        therapyTypeId: '',
        prescribedSessions: 10,
        startDate: new Date().toISOString().split('T')[0],
        frequency: 'GIORNALIERA',
        district: '',
        notes: '',
        parameters: {}
      });
      
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Errore nel salvataggio della terapia');
    } finally {
      setLoading(false);
    }
  };

  // Render del form specifico per tipo di terapia
  const renderTherapyForm = () => {
    if (!selectedTherapyType) return null;

    const commonProps = {
      onSubmit: (data: any) => {
        setFormData({ ...formData, parameters: data });
        nextStep();
      }
    };

    switch (selectedTherapyType.code) {
      case 'MAGNETO':
        return <MagnetoterapiaForm {...commonProps} />;
      case 'LASER_YAG':
        return <LaserYagForm {...commonProps} />;
      case 'LASER_810_980':
        return <Laser810980Form {...commonProps} />;
      case 'LASER_SCAN':
        return <LaserScannerForm {...commonProps} />;
      case 'ULTRASUONI':
        return <UltrasuoniForm {...commonProps} />;
      case 'TENS':
        return <TensForm {...commonProps} />;
      case 'ELETTROSTIM':
        return <ElettrostimolazioneForm {...commonProps} />;
      case 'TECAR':
        return <TecarsinForm {...commonProps} />;
      case 'MASSOTERAPIA':
        return <MassoterapiaForm {...commonProps} />;
      case 'MOBILIZZAZIONI':
        return <MobilizzazioniForm {...commonProps} />;
      case 'LIMFATERAPY':
        return <LimfaterapyForm {...commonProps} />;
      case 'SIT':
        return <SITForm {...commonProps} />;
      case 'TECALAB':
        return <TecalabForm {...commonProps} />;
      default:
        return <div>Form non disponibile per questo tipo di terapia</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Nuova Terapia</h2>
              <p className="text-blue-100 mt-1">
                Passo {needsPatientSelection ? currentStep + 1 : currentStep} di {needsPatientSelection ? 5 : 4}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-6 flex space-x-2">
            {(needsPatientSelection ? [0, 1, 2, 3, 4] : [1, 2, 3, 4]).map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 0: Selezione Paziente (se necessario) */}
          {currentStep === 0 && needsPatientSelection && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Seleziona paziente e cartella clinica</h3>
              <PatientSearchInput
                onPatientSelect={(patient) => setSelectedPatient(patient)}
                onRecordSelect={(record) => setSelectedRecord(record)}
                selectedPatient={selectedPatient}
                selectedRecord={selectedRecord}
              />
            </div>
          )}

          {/* Step 1: Selezione Categoria */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Seleziona la categoria di terapia</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THERAPY_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedCategory === category.id
                          ? `border-${category.color}-500 bg-${category.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-12 w-12 mx-auto mb-3 text-${category.color}-600`} />
                      <h4 className="font-semibold">{category.name}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Selezione Tipo Terapia */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Seleziona il tipo di terapia</h3>
              
              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <p>Categoria selezionata: {selectedCategory}</p>
                <p>Tipi totali: {therapyTypes.length}</p>
                <p>Tipi filtrati: {getFilteredTherapyTypes().length}</p>
              </div>
              
              {getFilteredTherapyTypes().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nessun tipo di terapia disponibile per questa categoria.</p>
                  <p className="text-sm mt-2">Categoria: {selectedCategory}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredTherapyTypes().map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTherapyType(type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTherapyType?.id === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold">{type.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Durata: {type.defaultDuration} min | Sedute: {type.defaultSessions}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Parametri Specifici */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-6">
                Configura i parametri per {selectedTherapyType?.name}
              </h3>
              {renderTherapyForm()}
            </div>
          )}

          {/* Step 4: Dettagli Generali */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Dettagli della terapia</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numero di sedute prescritte
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.prescribedSessions}
                      onChange={(e) => setFormData({ ...formData, prescribedSessions: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data di inizio
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequenza
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="GIORNALIERA">Giornaliera</option>
                      <option value="BISETTIMANALE">Bisettimanale</option>
                      <option value="TRISETTIMANALE">Trisettimanale</option>
                      <option value="SETTIMANALE">Settimanale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distretto anatomico
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="es. Spalla destra, Ginocchio sinistro..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note aggiuntive
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Inserisci eventuali note o precauzioni..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Riepilogo */}
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Riepilogo Terapia</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{selectedTherapyType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sedute prescritte:</span>
                      <span className="font-medium">{formData.prescribedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data inizio:</span>
                      <span className="font-medium">{formData.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequenza:</span>
                      <span className="font-medium">{formData.frequency}</span>
                    </div>
                    {formData.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distretto:</span>
                        <span className="font-medium">{formData.district}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === (needsPatientSelection ? 0 : 1)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentStep === (needsPatientSelection ? 0 : 1)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annulla
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Avanti
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>Salvataggio...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salva Terapia
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTherapyWizard;
