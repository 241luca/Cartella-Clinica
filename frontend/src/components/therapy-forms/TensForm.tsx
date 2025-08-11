import React, { useState } from 'react';
import { Zap, Clock, MapPin, Activity } from 'lucide-react';

interface TensFormData {
  tempo: number;
  tipo: string;
  distretto: string;
  frequenza: number;
  larghezzaImpulso: number;
  intensita: number;
  sedute: number;
  note?: string;
}

interface TensFormProps {
  onSubmit: (data: TensFormData) => void;
  initialData?: Partial<TensFormData>;
  onCancel?: () => void;
}

const TensForm: React.FC<TensFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<TensFormData>({
    tempo: initialData.tempo || 30,
    tipo: initialData.tipo || '',
    distretto: initialData.distretto || '',
    frequenza: initialData.frequenza || 80,
    larghezzaImpulso: initialData.larghezzaImpulso || 200,
    intensita: initialData.intensita || 20,
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const tipiProgramma = [
    'TENS Convenzionale (alta frequenza)',
    'TENS Endorfinica (bassa frequenza)',
    'TENS Burst',
    'TENS Modulata',
    'Antalgico rapido',
    'Antalgico profondo',
    'Decontratturante',
    'Drenante',
    'Stimolazione muscolare',
    'Altro'
  ];

  const distretti = [
    'Rachide cervicale', 'Rachide dorsale', 'Rachide lombare',
    'Spalla destra', 'Spalla sinistra',
    'Gomito destro', 'Gomito sinistro',
    'Polso destro', 'Polso sinistro',
    'Anca destra', 'Anca sinistra',
    'Ginocchio destro', 'Ginocchio sinistro',
    'Caviglia destra', 'Caviglia sinistra',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof TensFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Aggiorna automaticamente i parametri in base al tipo di programma
  const handleTipoChange = (tipo: string) => {
    handleChange('tipo', tipo);
    
    // Preimposta i parametri in base al tipo selezionato
    switch(tipo) {
      case 'TENS Convenzionale (alta frequenza)':
        handleChange('frequenza', 80);
        handleChange('larghezzaImpulso', 60);
        break;
      case 'TENS Endorfinica (bassa frequenza)':
        handleChange('frequenza', 2);
        handleChange('larghezzaImpulso', 250);
        break;
      case 'TENS Burst':
        handleChange('frequenza', 100);
        handleChange('larghezzaImpulso', 200);
        break;
      case 'Decontratturante':
        handleChange('frequenza', 50);
        handleChange('larghezzaImpulso', 150);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            TENS - Stimolazione Elettrica Nervosa Transcutanea
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Elettroterapia antalgica per il controllo del dolore
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo di programma */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Tipo di programma
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => handleTipoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Seleziona programma...</option>
            {tipiProgramma.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Distretto corporeo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Distretto corporeo
          </label>
          <select
            value={formData.distretto}
            onChange={(e) => handleChange('distretto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Seleziona distretto...</option>
            {distretti.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value={15}>15 minuti</option>
            <option value={20}>20 minuti</option>
            <option value={30}>30 minuti</option>
            <option value={45}>45 minuti</option>
            <option value={60}>60 minuti</option>
          </select>
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
              max="150"
              value={formData.frequenza}
              onChange={(e) => handleChange('frequenza', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="1"
                max="150"
                value={formData.frequenza}
                onChange={(e) => handleChange('frequenza', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">1-150 Hz</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Bassa freq. (1-10Hz): endorfinico | Alta freq. (50-150Hz): gate control
          </p>
        </div>

        {/* Larghezza impulso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Larghezza impulso (μs)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={formData.larghezzaImpulso}
              onChange={(e) => handleChange('larghezzaImpulso', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="50"
                max="400"
                step="10"
                value={formData.larghezzaImpulso}
                onChange={(e) => handleChange('larghezzaImpulso', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">50-400 μs</span>
            </div>
          </div>
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
              max="60"
              value={formData.intensita}
              onChange={(e) => handleChange('intensita', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="60"
                value={formData.intensita}
                onChange={(e) => handleChange('intensita', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-60 mA</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Regolare fino a sensazione di formicolio piacevole
          </p>
        </div>

        {/* Numero sedute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero di sedute
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.sedute}
            onChange={(e) => handleChange('sedute', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Numero totale di sedute prescritte
          </p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Posizionamento elettrodi, reazioni del paziente, etc..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Programma:</span>
            <span className="ml-1 font-medium">{formData.tipo || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Frequenza:</span>
            <span className="ml-1 font-medium">{formData.frequenza} Hz</span>
          </div>
          <div>
            <span className="text-gray-500">Impulso:</span>
            <span className="ml-1 font-medium">{formData.larghezzaImpulso} μs</span>
          </div>
          <div>
            <span className="text-gray-500">Intensità:</span>
            <span className="ml-1 font-medium">{formData.intensita} mA</span>
          </div>
        </div>
      </div>

      {/* Posizionamento elettrodi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📍 Indicazioni per il posizionamento elettrodi</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Posizionare gli elettrodi sulla cute pulita e integra</li>
          <li>• Elettrodo negativo (nero) sul punto doloroso</li>
          <li>• Elettrodo positivo (rosso) prossimale o controlaterale</li>
          <li>• Distanza minima tra elettrodi: 5 cm</li>
          <li>• Verificare buon contatto con gel conduttore</li>
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
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default TensForm;
