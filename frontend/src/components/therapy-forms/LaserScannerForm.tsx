import React, { useState } from 'react';
import { Scan, Zap, Thermometer, MapPin } from 'lucide-react';

interface LaserScannerFormData {
  potenza: number;
  drenaggio: boolean;
  normale: boolean;
  radiofrequenza: number;
  temperatura: number;
  distretto: string;
  areaScan: number;
  velocitaScan: string;
  sedute: number;
  note?: string;
}

interface LaserScannerFormProps {
  onSubmit: (data: LaserScannerFormData) => void;
  initialData?: Partial<LaserScannerFormData>;
  onCancel?: () => void;
}

const LaserScannerForm: React.FC<LaserScannerFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<LaserScannerFormData>({
    potenza: initialData.potenza || 15,
    drenaggio: initialData.drenaggio || false,
    normale: initialData.normale || true,
    radiofrequenza: initialData.radiofrequenza || 0,
    temperatura: initialData.temperatura || 38,
    distretto: initialData.distretto || '',
    areaScan: initialData.areaScan || 100,
    velocitaScan: initialData.velocitaScan || 'media',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const distretti = [
    'Zona cervicale ampia',
    'Zona dorsale ampia',
    'Zona lombare ampia',
    'Spalle bilaterali',
    'Schiena completa',
    'Arti inferiori',
    'Arti superiori',
    'Addome',
    'Cosce',
    'Polpacci',
    'Area cicatriziale',
    'Altro'
  ];

  const velocitaScan = [
    { value: 'lenta', label: 'Lenta (profonda)' },
    { value: 'media', label: 'Media (standard)' },
    { value: 'veloce', label: 'Veloce (superficiale)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof LaserScannerFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-pink-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Scan className="w-6 h-6 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Laser Scanner
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Laser a scansione automatica per trattamento di aree estese
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modalità di trattamento */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalità di trattamento
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.normale}
                onChange={(e) => handleChange('normale', e.target.checked)}
                className="mr-3 text-pink-600 focus:ring-pink-500 rounded"
              />
              <div>
                <span className="text-sm font-medium">Normale</span>
                <span className="text-xs text-gray-500 block">Trattamento standard</span>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.drenaggio}
                onChange={(e) => handleChange('drenaggio', e.target.checked)}
                className="mr-3 text-pink-600 focus:ring-pink-500 rounded"
              />
              <div>
                <span className="text-sm font-medium">Drenaggio</span>
                <span className="text-xs text-gray-500 block">Effetto drenante</span>
              </div>
            </label>
          </div>
        </div>

        {/* Potenza */}
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
              value={formData.potenza}
              onChange={(e) => handleChange('potenza', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={formData.potenza}
                onChange={(e) => handleChange('potenza', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-30 W</span>
            </div>
          </div>
        </div>

        {/* Radiofrequenza (opzionale) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radiofrequenza (MHz) - Opzionale
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.radiofrequenza}
            onChange={(e) => handleChange('radiofrequenza', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            0 = disattivata, 1-10 MHz se disponibile
          </p>
        </div>

        {/* Temperatura target */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Thermometer className="inline w-4 h-4 mr-1" />
            Temperatura target (°C)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="35"
              max="42"
              step="0.5"
              value={formData.temperatura}
              onChange={(e) => handleChange('temperatura', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="35"
                max="42"
                step="0.5"
                value={formData.temperatura}
                onChange={(e) => handleChange('temperatura', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span className="text-sm text-gray-500">35-42°C</span>
            </div>
          </div>
        </div>

        {/* Area di scansione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area di scansione (cm²)
          </label>
          <input
            type="number"
            min="10"
            max="500"
            value={formData.areaScan}
            onChange={(e) => handleChange('areaScan', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Superficie totale da trattare in cm²
          </p>
        </div>

        {/* Velocità di scansione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Velocità di scansione
          </label>
          <select
            value={formData.velocitaScan}
            onChange={(e) => handleChange('velocitaScan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          >
            {velocitaScan.map(vel => (
              <option key={vel.value} value={vel.value}>{vel.label}</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Pattern di scansione, zone da evitare, etc..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Modalità:</span>
            <span className="ml-1 font-medium">
              {[formData.normale && 'Normale', formData.drenaggio && 'Drenaggio'].filter(Boolean).join(' + ') || 'Nessuna'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Potenza:</span>
            <span className="ml-1 font-medium">{formData.potenza} W</span>
          </div>
          <div>
            <span className="text-gray-500">Temperatura:</span>
            <span className="ml-1 font-medium">{formData.temperatura}°C</span>
          </div>
          <div>
            <span className="text-gray-500">Area:</span>
            <span className="ml-1 font-medium">{formData.areaScan} cm²</span>
          </div>
          <div>
            <span className="text-gray-500">Velocità:</span>
            <span className="ml-1 font-medium capitalize">{formData.velocitaScan}</span>
          </div>
          {formData.radiofrequenza > 0 && (
            <div>
              <span className="text-gray-500">RF:</span>
              <span className="ml-1 font-medium">{formData.radiofrequenza} MHz</span>
            </div>
          )}
        </div>
      </div>

      {/* Vantaggi dello scanner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">✨ Vantaggi del laser scanner</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Trattamento uniforme di aree estese</li>
          <li>• Scansione automatica senza operatore</li>
          <li>• Distribuzione omogenea dell'energia</li>
          <li>• Riduzione dei tempi di trattamento</li>
          <li>• Ideale per patologie diffuse</li>
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
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default LaserScannerForm;
