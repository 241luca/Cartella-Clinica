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
    loadTherapyTypes();
  }, []);

  const loadTherapyTypes = async () => {
    try {
      const response = await therapyService.getTherapyTypes();
      setTherapyTypes(response.data.therapyTypes);
    } catch (error) {
      console.error('Errore caricamento tipi terapia:', error);
      setError('Errore nel caricamento dei tipi di terapia');
    }
  };

  // Filtra tipi per categoria
  const getFilteredTherapyTypes = () => {
    if (!selectedCategory) return [];
    return therapyTypes.filter(t => t.category === selectedCategory);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
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
