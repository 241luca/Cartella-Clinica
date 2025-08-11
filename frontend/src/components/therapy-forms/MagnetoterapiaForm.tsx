import React, { useState } from 'react';
import { Magnet, Clock, Zap, Activity } from 'lucide-react';

interface MagnetoterapiaFormData {
  programma: number;
  hertz: number;
  intensita: number;
  tempo: number;
  sedute: number;
  note?: string;
}

interface MagnetoterapiaFormProps {
  onSubmit: (data: MagnetoterapiaFormData) => void;
  initialData?: Partial<MagnetoterapiaFormData>;
  onCancel?: () => void;
}

const MagnetoterapiaForm: React.FC<MagnetoterapiaFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<MagnetoterapiaFormData>({
    programma: initialData.programma || 1,
    hertz: initialData.hertz || 50,
    intensita: initialData.intensita || 50,
    tempo: initialData.tempo || 30,
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MagnetoterapiaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Magnet className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Magnetoterapia
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia che utilizza campi magnetici per stimolare la rigenerazione cellulare
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Programma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programma
          </label>
          <select
            value={formData.programma}
            onChange={(e) => handleChange('programma', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Programma {i + 1}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Seleziona il programma preimpostato (1-20)
          </p>
        </div>

        {/* Frequenza (Hertz) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Frequenza (Hz)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="100"
              value={formData.hertz}
              onChange={(e) => handleChange('hertz', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="1"
                max="100"
                value={formData.hertz}
                onChange={(e) => handleChange('hertz', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">1-100 Hz</span>
            </div>
          </div>
        </div>

        {/* Intensità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="inline w-4 h-4 mr-1" />
            Intensità (%)
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
              <span className="text-sm text-gray-500">0-100%</span>
            </div>
          </div>
          <div className="mt-2 flex space-x-4 text-xs">
            <span className="text-green-600">• Bassa: 0-30%</span>
            <span className="text-yellow-600">• Media: 30-70%</span>
            <span className="text-red-600">• Alta: 70-100%</span>
          </div>
        </div>

        {/* Tempo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Durata seduta (minuti)
          </label>
          <select
            value={formData.tempo}
            onChange={(e) => handleChange('tempo', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value={15}>15 minuti</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Inserisci eventuali note o osservazioni..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Programma:</span>
            <span className="ml-1 font-medium">{formData.programma}</span>
          </div>
          <div>
            <span className="text-gray-500">Frequenza:</span>
            <span className="ml-1 font-medium">{formData.hertz} Hz</span>
          </div>
          <div>
            <span className="text-gray-500">Intensità:</span>
            <span className="ml-1 font-medium">{formData.intensita}%</span>
          </div>
          <div>
            <span className="text-gray-500">Durata:</span>
            <span className="ml-1 font-medium">{formData.tempo} min</span>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default MagnetoterapiaForm;
