import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import therapyService from '../../services/therapyService';
import { clinicalRecordService } from '../../services/clinicalRecordService';

// Import tutti i form delle terapie
import MagnetoterapiaForm from '../../components/therapy-forms/MagnetoterapiaForm';
import LaserYagForm from '../../components/therapy-forms/LaserYagForm';
import Laser810980Form from '../../components/therapy-forms/Laser810980Form';
import LaserScannerForm from '../../components/therapy-forms/LaserScannerForm';
import UltrasuoniForm from '../../components/therapy-forms/UltrasuoniForm';
import TensForm from '../../components/therapy-forms/TensForm';
import ElettrostimolazioneForm from '../../components/therapy-forms/ElettrostimolazioneForm';
import TecarsinForm from '../../components/therapy-forms/TecarsinForm';
import MassoterapiaForm from '../../components/therapy-forms/MassoterapiaForm';
import MobilizzazioniForm from '../../components/therapy-forms/MobilizzazioniForm';
import LimfaterapyForm from '../../components/therapy-forms/LimfaterapyForm';
import SITForm from '../../components/therapy-forms/SITForm';
import TecalabForm from '../../components/therapy-forms/TecalabForm';

interface TherapyTypeOption {
  code: string;
  name: string;
  category: string;
  description: string;
  color: string;
  icon: string;
}

const therapyTypes: TherapyTypeOption[] = [
  {
    code: 'MAGNETOTERAPIA',
    name: 'Magnetoterapia',
    category: 'Terapia Fisica',
    description: 'Terapia con campi magnetici per rigenerazione tissutale',
    color: 'blue',
    icon: '🧲'
  },
  {
    code: 'LASER_YAG_145',
    name: 'Laser YAG 145',
    category: 'Laserterapia',
    description: 'Laser ad alta potenza per patologie profonde',
    color: 'purple',
    icon: '⚡'
  },
  {
    code: 'LASER_810_980',
    name: 'Laser 810+980',
    category: 'Laserterapia',
    description: 'Laser a doppia lunghezza d\'onda',
    color: 'red',
    icon: '💡'
  },
  {
    code: 'LASER_SCAN',
    name: 'Laser Scanner',
    category: 'Laserterapia',
    description: 'Laser scanner per trattamento aree estese',
    color: 'pink',
    icon: '📡'
  },
  {
    code: 'TENS',
    name: 'TENS',
    category: 'Elettroterapia',
    description: 'Elettrostimolazione antalgica',
    color: 'orange',
    icon: '⚡'
  },
  {
    code: 'ULTRASUONI',
    name: 'Ultrasuoni',
    category: 'Terapia Fisica',
    description: 'Terapia ad ultrasuoni per tessuti profondi',
    color: 'teal',
    icon: '🔊'
  },
  {
    code: 'ELETTROSTIMOLAZIONE',
    name: 'Elettrostimolazione',
    category: 'Elettroterapia',
    description: 'Stimolazione elettrica muscolare',
    color: 'amber',
    icon: '💪'
  },
  {
    code: 'TECARSIN',
    name: 'Tecarsin',
    category: 'Tecarterapia',
    description: 'Tecarterapia capacitiva e resistiva',
    color: 'indigo',
    icon: '🔥'
  },
  {
    code: 'MASSOTERAPIA',
    name: 'Massoterapia',
    category: 'Terapia Manuale',
    description: 'Massaggio terapeutico manuale',
    color: 'green',
    icon: '👐'
  },
  {
    code: 'MOBILIZZAZIONI',
    name: 'Mobilizzazioni',
    category: 'Terapia Manuale',
    description: 'Mobilizzazioni articolari passive e attive',
    color: 'sky',
    icon: '🤸'
  },
  {
    code: 'LIMFATERAPY',
    name: 'Linfaterapy',
    category: 'Drenaggio',
    description: 'Pressoterapia e drenaggio linfatico',
    color: 'cyan',
    icon: '💧'
  },
  {
    code: 'SIT',
    name: 'SIT',
    category: 'Terapia Infiltrativa',
    description: 'Sistema Infiltrativo Transcutaneo',
    color: 'violet',
    icon: '💉'
  },
  {
    code: 'TECALAB',
    name: 'Tecalab',
    category: 'Programma Riabilitativo',
    description: 'Programma riabilitativo multidisciplinare',
    color: 'emerald',
    icon: '🏥'
  }
];

const NewTherapyWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get('recordId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clinicalRecord, setClinicalRecord] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [therapyData, setTherapyData] = useState<any>({});

  useEffect(() => {
    if (recordId) {
      loadClinicalRecord();
    }
  }, [recordId]);

  const loadClinicalRecord = async () => {
    try {
      const record = await clinicalRecordService.getById(recordId!);
      setClinicalRecord(record);
    } catch (error) {
      toast.error('Errore nel caricamento della cartella clinica');
      navigate('/clinical-records');
    }
  };

  const handleTypeSelect = (typeCode: string) => {
    setSelectedType(typeCode);
    setCurrentStep(2);
  };

  const handleFormSubmit = (formData: any) => {
    setTherapyData(formData);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const therapyType = therapyTypes.find(t => t.code === selectedType);
      
      const payload = {
        clinicalRecordId: recordId!,
        therapyTypeCode: selectedType,
        prescribedSessions: therapyData.sedute || 10,
        startDate: new Date().toISOString(),
        frequency: therapyData.frequenza || '3 volte/settimana',
        district: therapyData.distretto || '',
        notes: therapyData.note || '',
        parameters: therapyData
      };

      await therapyService.create(payload);
      
      toast.success('Terapia creata con successo!');
      navigate(`/clinical-records/${recordId}`);
    } catch (error) {
      console.error('Errore nella creazione della terapia:', error);
      toast.error('Errore nella creazione della terapia');
    } finally {
      setLoading(false);
    }
  };

  const renderTherapyForm = () => {
    const props = {
      onSubmit: handleFormSubmit,
      initialData: therapyData,
      onCancel: () => setCurrentStep(1)
    };

    switch (selectedType) {
      case 'MAGNETOTERAPIA':
        return <MagnetoterapiaForm {...props} />;
      case 'LASER_YAG_145':
        return <LaserYagForm {...props} />;
      case 'LASER_810_980':
        return <Laser810980Form {...props} />;
      case 'LASER_SCAN':
        return <LaserScannerForm {...props} />;
      case 'TENS':
        return <TensForm {...props} />;
      case 'ULTRASUONI':
        return <UltrasuoniForm {...props} />;
      case 'ELETTROSTIMOLAZIONE':
        return <ElettrostimolazioneForm {...props} />;
      case 'TECARSIN':
        return <TecarsinForm {...props} />;
      case 'MASSOTERAPIA':
        return <MassoterapiaForm {...props} />;
      case 'MOBILIZZAZIONI':
        return <MobilizzazioniForm {...props} />;
      case 'LIMFATERAPY':
        return <LimfaterapyForm {...props} />;
      case 'SIT':
        return <SITForm {...props} />;
      case 'TECALAB':
        return <TecalabForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nuova Terapia
              </h1>
              {clinicalRecord && (
                <p className="text-sm text-gray-600 mt-1">
                  Paziente: {clinicalRecord.patient?.firstName} {clinicalRecord.patient?.lastName} - 
                  Cartella #{clinicalRecord.recordNumber}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                <li className={`relative ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep > 1 ? 'bg-indigo-600 text-white' : 
                        currentStep === 1 ? 'border-2 border-indigo-600 bg-white' : 
                        'border-2 border-gray-300 bg-white'}`}>
                      {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                    </span>
                    <span className="ml-2 text-sm font-medium">Tipo Terapia</span>
                  </div>
                </li>

                <li className={`relative ml-8 ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 mx-2" />
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep > 2 ? 'bg-indigo-600 text-white' : 
                        currentStep === 2 ? 'border-2 border-indigo-600 bg-white' : 
                        'border-2 border-gray-300 bg-white'}`}>
                      {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                    </span>
                    <span className="ml-2 text-sm font-medium">Parametri</span>
                  </div>
                </li>

                <li className={`relative ml-8 ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 mx-2" />
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep === 3 ? 'border-2 border-indigo-600 bg-white' : 
                        'border-2 border-gray-300 bg-white'}`}>
                      3
                    </span>
                    <span className="ml-2 text-sm font-medium">Conferma</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Step 1: Selezione Tipo */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Seleziona il tipo di terapia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {therapyTypes.map((type) => (
                  <button
                    key={type.code}
                    onClick={() => handleTypeSelect(type.code)}
                    className={`p-4 rounded-lg border-2 text-left hover:shadow-lg transition-all
                      border-gray-200 hover:border-${type.color}-500 hover:bg-${type.color}-50`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {type.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {type.category}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Form Parametri */}
          {currentStep === 2 && (
            <div className="p-6">
              {renderTherapyForm()}
            </div>
          )}

          {/* Step 3: Riepilogo e Conferma */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Riepilogo Terapia
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tipo Terapia</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {therapyTypes.find(t => t.code === selectedType)?.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Numero Sedute</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {therapyData.sedute || 10}
                    </p>
                  </div>

                  {therapyData.distretto && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Distretto</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {therapyData.distretto}
                      </p>
                    </div>
                  )}

                  {therapyData.frequenza && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Frequenza</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {therapyData.frequenza}
                      </p>
                    </div>
                  )}
                </div>

                {therapyData.note && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500">Note</h3>
                    <p className="mt-1 text-gray-900">{therapyData.note}</p>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Parametri Specifici</h3>
                  <div className="bg-white rounded p-4">
                    {Object.entries(therapyData).map(([key, value]) => {
                      if (['sedute', 'distretto', 'frequenza', 'note'].includes(key)) return null;
                      return (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {typeof value === 'boolean' ? (value ? 'Sì' : 'No') : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Modifica
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>Creazione in corso...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crea Terapia
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTherapyWizard;