import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, Zap, Waves, Brain, Hand, Heart, Droplets, Shield, Cpu, Stethoscope, Move, Syringe } from 'lucide-react';
import therapyService from '../../services/therapyService';

// Import di tutti i 13 form delle terapie
import MagnetoterapiaForm from '../therapy-forms/MagnetoterapiaForm';
import LaserYagForm from '../therapy-forms/LaserYagForm';
import Laser810980Form from '../therapy-forms/Laser810980Form';
import LaserScannerForm from '../therapy-forms/LaserScannerForm';
import TensForm from '../therapy-forms/TensForm';
import UltrasuoniForm from '../therapy-forms/UltrasuoniForm';
import ElettrostimolazioneForm from '../therapy-forms/ElettrostimolazioneForm';
import MassoterapiaForm from '../therapy-forms/MassoterapiaForm';
import TecarsinForm from '../therapy-forms/TecarsinForm';
import LimfaterapyForm from '../therapy-forms/LimfaterapyForm';
import MobilizzazioniForm from '../therapy-forms/MobilizzazioniForm';
import SITForm from '../therapy-forms/SITForm';
import TecalabForm from '../therapy-forms/TecalabForm';

// Definizione dei tipi di terapia disponibili
const therapyTypes = [
  { 
    id: 'magnetoterapia', 
    name: 'Magnetoterapia', 
    icon: Waves,
    color: 'bg-purple-500',
    description: 'Terapia con campi magnetici',
    component: MagnetoterapiaForm 
  },
  { 
    id: 'laser-yag', 
    name: 'Laser YAG 145', 
    icon: Zap,
    color: 'bg-red-500',
    description: 'Laser ad alta potenza',
    component: LaserYagForm 
  },
  { 
    id: 'laser-810-980', 
    name: 'Laser 810+980', 
    icon: Zap,
    color: 'bg-orange-500',
    description: 'Laser a doppia lunghezza d\'onda',
    component: Laser810980Form 
  },
  { 
    id: 'laser-scanner', 
    name: 'Laser Scanner', 
    icon: Activity,
    color: 'bg-yellow-500',
    description: 'Laser a scansione',
    component: LaserScannerForm 
  },
  { 
    id: 'tens', 
    name: 'TENS', 
    icon: Brain,
    color: 'bg-blue-500',
    description: 'Elettrostimolazione antalgica',
    component: TensForm 
  },
  { 
    id: 'ultrasuoni', 
    name: 'Ultrasuoni', 
    icon: Waves,
    color: 'bg-indigo-500',
    description: 'Terapia ad ultrasuoni',
    component: UltrasuoniForm 
  },
  { 
    id: 'elettrostimolazione', 
    name: 'Elettrostimolazione', 
    icon: Cpu,
    color: 'bg-pink-500',
    description: 'Stimolazione elettrica muscolare',
    component: ElettrostimolazioneForm 
  },
  { 
    id: 'massoterapia', 
    name: 'Massoterapia', 
    icon: Hand,
    color: 'bg-green-500',
    description: 'Terapia manuale',
    component: MassoterapiaForm 
  },
  { 
    id: 'tecarsin', 
    name: 'Tecarsin', 
    icon: Heart,
    color: 'bg-red-600',
    description: 'Tecarterapia sincrona',
    component: TecarsinForm 
  },
  { 
    id: 'limfaterapy', 
    name: 'Limfaterapy', 
    icon: Droplets,
    color: 'bg-cyan-500',
    description: 'Drenaggio linfatico',
    component: LimfaterapyForm 
  },
  { 
    id: 'mobilizzazioni', 
    name: 'Mobilizzazioni', 
    icon: Move,
    color: 'bg-teal-500',
    description: 'Mobilizzazione articolare',
    component: MobilizzazioniForm 
  },
  { 
    id: 'sit', 
    name: 'SIT', 
    icon: Syringe,
    color: 'bg-amber-500',
    description: 'Sistema infiltrativo transdermico',
    component: SITForm 
  },
  { 
    id: 'tecalab', 
    name: 'Tecalab', 
    icon: Stethoscope,
    color: 'bg-emerald-500',
    description: 'Tecarterapia avanzata',
    component: TecalabForm 
  }
];

interface NewTherapyWizardProps {
  patientId?: string;
  clinicalRecordId?: string;
}

const NewTherapyWizard: React.FC<NewTherapyWizardProps> = ({ 
  patientId: propPatientId, 
  clinicalRecordId: propClinicalRecordId 
}) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Usa i props se forniti, altrimenti prendi dai parametri URL
  const patientId = propPatientId || params.patientId;
  const clinicalRecordId = propClinicalRecordId || params.clinicalRecordId;
  
  const [selectedType, setSelectedType] = useState<typeof therapyTypes[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestisce il salvataggio della terapia
  const handleSubmit = async (formData: any) => {
    if (!selectedType || !patientId || !clinicalRecordId) {
      setError('Dati mancanti per il salvataggio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepara i dati per l'API
      const therapyData = {
        patientId,
        clinicalRecordId,
        therapyTypeId: selectedType.id,
        parameters: formData,
        prescribedSessions: formData.sedute || formData.numeroSedute || 10,
        notes: formData.note || ''
      };

      // Salva la terapia tramite il servizio
      await therapyService.createTherapy(therapyData);

      // Torna alla pagina del paziente
      navigate(`/patients/${patientId}`);
    } catch (err: any) {
      console.error('Errore nel salvataggio della terapia:', err);
      setError(err.response?.data?.message || 'Errore nel salvataggio della terapia');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestisce l'annullamento
  const handleCancel = () => {
    if (selectedType) {
      // Se è stato selezionato un tipo, torna alla selezione
      setSelectedType(null);
      setError(null);
    } else {
      // Altrimenti torna alla pagina del paziente
      navigate(`/patients/${patientId}`);
    }
  };

  // Step 1: Selezione del tipo di terapia
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/patients/${patientId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Torna al paziente
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900">
              Nuova Terapia
            </h1>
            <p className="mt-2 text-gray-600">
              Seleziona il tipo di terapia da prescrivere
            </p>
          </div>

          {/* Grid delle terapie */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {therapyTypes.map((therapy) => {
              const Icon = therapy.icon;
              return (
                <button
                  key={therapy.id}
                  onClick={() => setSelectedType(therapy)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  <div className={`w-16 h-16 ${therapy.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {therapy.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {therapy.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Compilazione del form specifico
  const FormComponent = selectedType.component;
  const Icon = selectedType.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con tipo di terapia selezionata */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Torna alla selezione
          </button>
          
          <div className="flex items-center">
            <div className={`w-12 h-12 ${selectedType.color} rounded-lg flex items-center justify-center mr-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedType.name}
              </h1>
              <p className="text-gray-600">
                Compila i parametri della terapia
              </p>
            </div>
          </div>
        </div>

        {/* Messaggio di errore */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form della terapia selezionata */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <FormComponent 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default NewTherapyWizard;
