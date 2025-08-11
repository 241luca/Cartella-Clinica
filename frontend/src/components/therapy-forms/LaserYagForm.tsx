import React, { useState } from 'react';
import { Zap, Target, Activity, MapPin } from 'lucide-react';

interface LaserYagFormData {
  watt: number;
  joulePerPulse: number;
  pulse: number;
  dose: number;
  distretto: string;
  sedute: number;
  note?: string;
}

interface LaserYagFormProps {
  onSubmit: (data: LaserYagFormData) => void;
  initialData?: Partial<LaserYagFormData>;
  onCancel?: () => void;
}

const LaserYagForm: React.FC<LaserYagFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<LaserYagFormData>({
    watt: initialData.watt || 10,
    joulePerPulse: initialData.joulePerPulse || 5,
    pulse: initialData.pulse || 100,
    dose: initialData.dose || 50,
    distretto: initialData.distretto || '',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const distretti = [
    'Spalla destra', 'Spalla sinistra',
    'Gomito destro', 'Gomito sinistro',
    'Polso destro', 'Polso sinistro',
    'Mano destra', 'Mano sinistra',
    'Anca destra', 'Anca sinistra',
    'Ginocchio destro', 'Ginocchio sinistro',
    'Caviglia destra', 'Caviglia sinistra',
    'Piede destro', 'Piede sinistro',
    'Rachide cervicale', 'Rachide dorsale', 'Rachide lombare',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof LaserYagFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Laser YAG 145
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Laser ad alta potenza per terapia antalgica e biostimolante
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Potenza (Watt) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="inline w-4 h-4 mr-1" />
            Potenza (W)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.watt}
              onChange={(e) => handleChange('watt', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={formData.watt}
                onChange={(e) => handleChange('watt', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-100 W</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• Bassa: 0-30W (superficiale)</span>
            <span className="block">• Media: 30-60W (medio)</span>
            <span className="block">• Alta: 60-100W (profondo)</span>
          </div>
        </div>

        {/* Joule per Pulse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Joule per Impulso (J)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={formData.joulePerPulse}
            onChange={(e) => handleChange('joulePerPulse', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Energia per singolo impulso (0-50 J)
          </p>
        </div>

        {/* Numero di impulsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero di impulsi
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={formData.pulse}
            onChange={(e) => handleChange('pulse', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Numero totale di impulsi per seduta
          </p>
        </div>

        {/* Dose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dose totale (J/cm²)
          </label>
          <input
            type="number"
            min="0"
            max="200"
            step="0.5"
            value={formData.dose}
            onChange={(e) => handleChange('dose', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Dose energetica totale per cm²
          </p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Seleziona distretto...</option>
            {distretti.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Inserisci eventuali note o osservazioni..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Potenza:</span>
            <span className="ml-1 font-medium">{formData.watt} W</span>
          </div>
          <div>
            <span className="text-gray-500">J/Impulso:</span>
            <span className="ml-1 font-medium">{formData.joulePerPulse} J</span>
          </div>
          <div>
            <span className="text-gray-500">Impulsi:</span>
            <span className="ml-1 font-medium">{formData.pulse}</span>
          </div>
          <div>
            <span className="text-gray-500">Dose:</span>
            <span className="ml-1 font-medium">{formData.dose} J/cm²</span>
          </div>
          <div>
            <span className="text-gray-500">Energia totale:</span>
            <span className="ml-1 font-medium">{(formData.joulePerPulse * formData.pulse).toFixed(1)} J</span>
          </div>
          <div>
            <span className="text-gray-500">Distretto:</span>
            <span className="ml-1 font-medium">{formData.distretto || 'Non selezionato'}</span>
          </div>
        </div>
      </div>

      {/* Avvertenze */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Avvertenze</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Utilizzare sempre gli occhiali protettivi</li>
          <li>• Non puntare il laser direttamente negli occhi</li>
          <li>• Verificare controindicazioni (pacemaker, gravidanza, tumori)</li>
          <li>• Pulire la zona da trattare prima dell'applicazione</li>
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
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default LaserYagForm;
