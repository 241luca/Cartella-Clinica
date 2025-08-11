import React, { useState } from 'react';
import { Zap, Activity, Clock, MapPin } from 'lucide-react';

interface ElettrostimolazioneFormData {
  distretto: string;
  programma: string;
  intensita: number;
  frequenza: number;
  larghezzaImpulso: number;
  tempoContr: number;
  tempoRiposo: number;
  tempo: number;
  sedute: number;
  note?: string;
}

interface ElettrostimolazioneFormProps {
  onSubmit: (data: ElettrostimolazioneFormData) => void;
  initialData?: Partial<ElettrostimolazioneFormData>;
  onCancel?: () => void;
}

const ElettrostimolazioneForm: React.FC<ElettrostimolazioneFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<ElettrostimolazioneFormData>({
    distretto: initialData.distretto || '',
    programma: initialData.programma || '',
    intensita: initialData.intensita || 30,
    frequenza: initialData.frequenza || 50,
    larghezzaImpulso: initialData.larghezzaImpulso || 300,
    tempoContr: initialData.tempoContr || 6,
    tempoRiposo: initialData.tempoRiposo || 10,
    tempo: initialData.tempo || 20,
    sedute: initialData.sedute || 15,
    note: initialData.note || ''
  });

  const programmi = [
    'Rafforzamento muscolare',
    'Resistenza muscolare',
    'Forza esplosiva',
    'Recupero attivo',
    'Capillarizzazione',
    'Decontratturante',
    'Agonista/Antagonista',
    'Rieducazione muscolare',
    'Prevenzione atrofia',
    'Drenaggio',
    'Lipolisi',
    'Altro'
  ];

  const distretti = [
    'Quadricipite destro', 'Quadricipite sinistro',
    'Bicipite femorale destro', 'Bicipite femorale sinistro',
    'Polpaccio destro', 'Polpaccio sinistro',
    'Addominali', 'Dorsali', 'Lombari',
    'Deltoide destro', 'Deltoide sinistro',
    'Bicipite destro', 'Bicipite sinistro',
    'Tricipite destro', 'Tricipite sinistro',
    'Glutei', 'Adduttori', 'Abduttori',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ElettrostimolazioneFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Preimposta parametri in base al programma
  const handleProgrammaChange = (programma: string) => {
    handleChange('programma', programma);
    
    switch(programma) {
      case 'Rafforzamento muscolare':
        handleChange('frequenza', 50);
        handleChange('larghezzaImpulso', 350);
        handleChange('tempoContr', 6);
        handleChange('tempoRiposo', 10);
        break;
      case 'Resistenza muscolare':
        handleChange('frequenza', 30);
        handleChange('larghezzaImpulso', 250);
        handleChange('tempoContr', 10);
        handleChange('tempoRiposo', 5);
        break;
      case 'Forza esplosiva':
        handleChange('frequenza', 100);
        handleChange('larghezzaImpulso', 400);
        handleChange('tempoContr', 3);
        handleChange('tempoRiposo', 20);
        break;
      case 'Recupero attivo':
        handleChange('frequenza', 5);
        handleChange('larghezzaImpulso', 200);
        handleChange('tempoContr', 1);
        handleChange('tempoRiposo', 1);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-amber-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Elettrostimolazione Muscolare (EMS)
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Stimolazione elettrica per rafforzamento e recupero muscolare
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Programma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Programma di allenamento
          </label>
          <select
            value={formData.programma}
            onChange={(e) => handleProgrammaChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Seleziona programma...</option>
            {programmi.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>

        {/* Distretto muscolare */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Distretto muscolare
          </label>
          <select
            value={formData.distretto}
            onChange={(e) => handleChange('distretto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Seleziona muscolo...</option>
            {distretti.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Intensità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="inline w-4 h-4 mr-1" />
            Intensità (mA)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.intensita}
              onChange={(e) => handleChange('intensita', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.intensita}
                onChange={(e) => handleChange('intensita', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-100 mA</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Regolare fino a contrazione muscolare visibile e tollerabile
          </p>
        </div>

        {/* Frequenza */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequenza (Hz)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="120"
              value={formData.frequenza}
              onChange={(e) => handleChange('frequenza', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="1"
                max="120"
                value={formData.frequenza}
                onChange={(e) => handleChange('frequenza', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">1-120 Hz</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• 1-15 Hz: Recupero</span>
            <span className="block">• 20-50 Hz: Forza</span>
            <span className="block">• 50-120 Hz: Esplosività</span>
          </div>
        </div>

        {/* Larghezza impulso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Larghezza impulso (μs)
          </label>
          <input
            type="number"
            min="50"
            max="500"
            step="10"
            value={formData.larghezzaImpulso}
            onChange={(e) => handleChange('larghezzaImpulso', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Tempo contrazione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo contrazione (sec)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.tempoContr}
            onChange={(e) => handleChange('tempoContr', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Tempo riposo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo riposo (sec)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={formData.tempoRiposo}
            onChange={(e) => handleChange('tempoRiposo', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Durata seduta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Durata seduta (minuti)
          </label>
          <select
            value={formData.tempo}
            onChange={(e) => handleChange('tempo', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value={10}>10 minuti</option>
            <option value={15}>15 minuti</option>
            <option value={20}>20 minuti</option>
            <option value={30}>30 minuti</option>
            <option value={45}>45 minuti</option>
          </select>
        </div>

        {/* Numero sedute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero di sedute
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={formData.sedute}
            onChange={(e) => handleChange('sedute', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        {/* Note */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note aggiuntive (opzionale)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Posizionamento elettrodi, sensazioni del paziente..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Frequenza:</span>
            <span className="ml-1 font-medium">{formData.frequenza} Hz</span>
          </div>
          <div>
            <span className="text-gray-500">Intensità:</span>
            <span className="ml-1 font-medium">{formData.intensita} mA</span>
          </div>
          <div>
            <span className="text-gray-500">Impulso:</span>
            <span className="ml-1 font-medium">{formData.larghezzaImpulso} μs</span>
          </div>
          <div>
            <span className="text-gray-500">Ciclo:</span>
            <span className="ml-1 font-medium">{formData.tempoContr}s/{formData.tempoRiposo}s</span>
          </div>
        </div>
      </div>

      {/* Posizionamento elettrodi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📍 Posizionamento elettrodi</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Elettrodo prossimale sul punto motore del muscolo</li>
          <li>• Elettrodo distale sulla porzione distale del ventre muscolare</li>
          <li>• Cute pulita e sgrassata</li>
          <li>• Gel conduttore sotto gli elettrodi</li>
          <li>• Fissaggio sicuro con fasce elastiche</li>
        </ul>
      </div>

      {/* Pulsanti */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default ElettrostimolazioneForm;
