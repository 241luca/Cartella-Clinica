import React, { useState } from 'react';
import { Zap, Target, Activity, MapPin } from 'lucide-react';

interface Laser810980FormData {
  watt: number;
  joulePerPulse: number;
  pulse: number;
  dose: number;
  distretto: string;
  lunghezzaOnda: '810' | '980' | 'combinata';
  sedute: number;
  note?: string;
}

interface Laser810980FormProps {
  onSubmit: (data: Laser810980FormData) => void;
  initialData?: Partial<Laser810980FormData>;
  onCancel?: () => void;
}

const Laser810980Form: React.FC<Laser810980FormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<Laser810980FormData>({
    watt: initialData.watt || 8,
    joulePerPulse: initialData.joulePerPulse || 3,
    pulse: initialData.pulse || 150,
    dose: initialData.dose || 60,
    distretto: initialData.distretto || '',
    lunghezzaOnda: initialData.lunghezzaOnda || 'combinata',
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
    'Tendine Achille', 'Fascia plantare',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Laser810980FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Laser 810+980 nm
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Laser a doppia lunghezza d'onda per terapia profonda
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lunghezza d'onda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lunghezza d'onda
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="810"
                checked={formData.lunghezzaOnda === '810'}
                onChange={(e) => handleChange('lunghezzaOnda', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">
                <span className="font-medium">810 nm</span>
                <span className="text-gray-500 block text-xs">Superficiale</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="980"
                checked={formData.lunghezzaOnda === '980'}
                onChange={(e) => handleChange('lunghezzaOnda', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">
                <span className="font-medium">980 nm</span>
                <span className="text-gray-500 block text-xs">Profonda</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="combinata"
                checked={formData.lunghezzaOnda === 'combinata'}
                onChange={(e) => handleChange('lunghezzaOnda', e.target.value)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">
                <span className="font-medium">Combinata</span>
                <span className="text-gray-500 block text-xs">810+980 nm</span>
              </span>
            </label>
          </div>
        </div>

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
              max="30"
              step="0.5"
              value={formData.watt}
              onChange={(e) => handleChange('watt', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={formData.watt}
                onChange={(e) => handleChange('watt', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-30 W</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• Bassa: 0-10W (antalgico)</span>
            <span className="block">• Media: 10-20W (biostimolante)</span>
            <span className="block">• Alta: 20-30W (decontratturante)</span>
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
            max="20"
            step="0.1"
            value={formData.joulePerPulse}
            onChange={(e) => handleChange('joulePerPulse', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Energia per singolo impulso (0-20 J)
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
            max="500"
            value={formData.pulse}
            onChange={(e) => handleChange('pulse', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            max="150"
            step="0.5"
            value={formData.dose}
            onChange={(e) => handleChange('dose', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Inserisci eventuali note o osservazioni..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Lunghezza:</span>
            <span className="ml-1 font-medium">{formData.lunghezzaOnda} nm</span>
          </div>
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
        </div>
      </div>

      {/* Caratteristiche lunghezze d'onda */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">📊 Caratteristiche lunghezze d'onda</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-700">
          <div>
            <p className="font-medium mb-1">810 nm:</p>
            <ul className="space-y-1">
              <li>• Penetrazione: 2-3 cm</li>
              <li>• Assorbimento da emoglobina</li>
              <li>• Effetto antalgico rapido</li>
              <li>• Ideale per tessuti superficiali</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">980 nm:</p>
            <ul className="space-y-1">
              <li>• Penetrazione: 5-7 cm</li>
              <li>• Assorbimento da acqua</li>
              <li>• Effetto biostimolante</li>
              <li>• Ideale per tessuti profondi</li>
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
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default Laser810980Form;
