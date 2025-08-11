import React, { useState } from 'react';
import { Droplets, Clock, Activity, Gauge } from 'lucide-react';

interface LimfaterapyFormData {
  programma: string;
  modalita: 'auto' | 'manuale';
  pressione: number;
  tempo: number;
  sequenza: string;
  sedute: number;
  note?: string;
}

interface LimfaterapyFormProps {
  onSubmit: (data: LimfaterapyFormData) => void;
  initialData?: Partial<LimfaterapyFormData>;
  onCancel?: () => void;
}

const LimfaterapyForm: React.FC<LimfaterapyFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<LimfaterapyFormData>({
    programma: initialData.programma || '',
    modalita: initialData.modalita || 'auto',
    pressione: initialData.pressione || 40,
    tempo: initialData.tempo || 30,
    sequenza: initialData.sequenza || '',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const programmi = [
    'Drenaggio linfatico arti inferiori',
    'Drenaggio linfatico arti superiori',
    'Linfodrenaggio post-operatorio',
    'Trattamento edema',
    'Trattamento cellulite',
    'Insufficienza venosa',
    'Recupero sportivo',
    'Trattamento linfedema',
    'Prevenzione trombosi',
    'Altro'
  ];

  const sequenze = [
    'Prossimo-distale',
    'Distale-prossimale',
    'Sequenziale completa',
    'Solo compressione',
    'Onda peristaltica',
    'Personalizzata'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof LimfaterapyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-cyan-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Droplets className="w-6 h-6 text-cyan-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Linfaterapy - Pressoterapia
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia di compressione pneumatica per il drenaggio linfatico
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Programma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Programma terapeutico
          </label>
          <select
            value={formData.programma}
            onChange={(e) => handleChange('programma', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            required
          >
            <option value="">Seleziona programma...</option>
            {programmi.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>

        {/* Modalità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalità di funzionamento
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="auto"
                checked={formData.modalita === 'auto'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm">
                <span className="font-medium">Automatica</span>
                <span className="text-gray-500 ml-1">(programma preimpostato)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="manuale"
                checked={formData.modalita === 'manuale'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm">
                <span className="font-medium">Manuale</span>
                <span className="text-gray-500 ml-1">(parametri personalizzati)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Pressione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Gauge className="inline w-4 h-4 mr-1" />
            Pressione (mmHg)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="20"
              max="120"
              value={formData.pressione}
              onChange={(e) => handleChange('pressione', Number(e.target.value))}
              className="w-full"
              disabled={formData.modalita === 'auto'}
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="20"
                max="120"
                value={formData.pressione}
                onChange={(e) => handleChange('pressione', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                disabled={formData.modalita === 'auto'}
                required
              />
              <span className="text-sm text-gray-500">20-120 mmHg</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• Leggera: 20-40 mmHg</span>
            <span className="block">• Media: 40-80 mmHg</span>
            <span className="block">• Forte: 80-120 mmHg</span>
          </div>
        </div>

        {/* Sequenza di compressione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sequenza di compressione
          </label>
          <select
            value={formData.sequenza}
            onChange={(e) => handleChange('sequenza', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            disabled={formData.modalita === 'auto'}
            required
          >
            <option value="">Seleziona sequenza...</option>
            {sequenze.map(seq => (
              <option key={seq} value={seq}>{seq}</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            required
          >
            <option value={20}>20 minuti</option>
            <option value={30}>30 minuti</option>
            <option value={45}>45 minuti</option>
            <option value={60}>60 minuti</option>
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
            max="30"
            value={formData.sedute}
            onChange={(e) => handleChange('sedute', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Inserisci eventuali note o osservazioni..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Modalità:</span>
            <span className="ml-1 font-medium capitalize">{formData.modalita}</span>
          </div>
          <div>
            <span className="text-gray-500">Pressione:</span>
            <span className="ml-1 font-medium">{formData.pressione} mmHg</span>
          </div>
          <div>
            <span className="text-gray-500">Durata:</span>
            <span className="ml-1 font-medium">{formData.tempo} min</span>
          </div>
          <div>
            <span className="text-gray-500">Sedute:</span>
            <span className="ml-1 font-medium">{formData.sedute}</span>
          </div>
        </div>
      </div>

      {/* Indicazioni */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Indicazioni e controindicazioni</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <p className="font-medium mb-1">Indicazioni:</p>
            <ul className="space-y-1">
              <li>• Insufficienza venosa e linfatica</li>
              <li>• Edemi post-traumatici</li>
              <li>• Cellulite e adiposità localizzate</li>
              <li>• Gambe pesanti e gonfie</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Controindicazioni:</p>
            <ul className="space-y-1">
              <li>• Trombosi venosa profonda</li>
              <li>• Insufficienza cardiaca grave</li>
              <li>• Infezioni acute</li>
              <li>• Gravidanza (consultare medico)</li>
            </ul>
          </div>
        </div>
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
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default LimfaterapyForm;
