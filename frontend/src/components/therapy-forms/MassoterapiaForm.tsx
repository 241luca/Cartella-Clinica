import React, { useState } from 'react';
import { Hand, Clock, MapPin, Heart } from 'lucide-react';

interface MassoterapiaFormData {
  tipo: string;
  distretto: string;
  durata: number;
  tecniche: string[];
  intensita: string;
  sedute: number;
  note?: string;
}

interface MassoterapiaFormProps {
  onSubmit: (data: MassoterapiaFormData) => void;
  initialData?: Partial<MassoterapiaFormData>;
  onCancel?: () => void;
}

const MassoterapiaForm: React.FC<MassoterapiaFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<MassoterapiaFormData>({
    tipo: initialData.tipo || '',
    distretto: initialData.distretto || '',
    durata: initialData.durata || 30,
    tecniche: initialData.tecniche || [],
    intensita: initialData.intensita || 'media',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const tipiMassaggio = [
    'Decontratturante',
    'Drenante/Linfodrenaggio',
    'Sportivo',
    'Rilassante',
    'Connettivale',
    'Miofasciale',
    'Trigger point',
    'Terapeutico generale',
    'Pre-gara',
    'Post-gara',
    'Altro'
  ];

  const distretti = [
    'Collo e spalle',
    'Schiena completa',
    'Zona lombare',
    'Zona dorsale',
    'Zona cervicale',
    'Arti superiori',
    'Arti inferiori',
    'Gambe',
    'Braccia',
    'Addome',
    'Torace',
    'Viso e testa',
    'Total body',
    'Altro'
  ];

  const tecnicheManuali = [
    'Sfioramento',
    'Frizione',
    'Impastamento',
    'Percussione',
    'Vibrazione',
    'Pressione',
    'Stiramento',
    'Scollamento',
    'Pompaggio',
    'Mobilizzazione'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MassoterapiaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTecnicheChange = (tecnica: string) => {
    setFormData(prev => ({
      ...prev,
      tecniche: prev.tecniche.includes(tecnica)
        ? prev.tecniche.filter(t => t !== tecnica)
        : [...prev.tecniche, tecnica]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Hand className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Massoterapia
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia manuale per il trattamento dei tessuti molli
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo di massaggio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="inline w-4 h-4 mr-1" />
            Tipo di massaggio
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Seleziona tipo...</option>
            {tipiMassaggio.map(tipo => (
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Seleziona zona...</option>
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
            value={formData.durata}
            onChange={(e) => handleChange('durata', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value={15}>15 minuti</option>
            <option value={30}>30 minuti</option>
            <option value={45}>45 minuti</option>
            <option value={60}>60 minuti</option>
            <option value={90}>90 minuti</option>
          </select>
        </div>

        {/* Intensità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensità del trattamento
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="leggera"
                checked={formData.intensita === 'leggera'}
                onChange={(e) => handleChange('intensita', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Leggera (rilassante)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="media"
                checked={formData.intensita === 'media'}
                onChange={(e) => handleChange('intensita', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Media (terapeutica)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="profonda"
                checked={formData.intensita === 'profonda'}
                onChange={(e) => handleChange('intensita', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Profonda (decontratturante)</span>
            </label>
          </div>
        </div>

        {/* Tecniche manuali */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tecniche manuali utilizzate
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tecnicheManuali.map(tecnica => (
              <label key={tecnica} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tecniche.includes(tecnica)}
                  onChange={() => handleTecnicheChange(tecnica)}
                  className="mr-2 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm">{tecnica}</span>
              </label>
            ))}
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Aree di maggior tensione, controindicazioni, preferenze del paziente..."
          />
        </div>
      </div>

      {/* Riepilogo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo trattamento:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Tipo:</span>
            <span className="ml-1 font-medium">{formData.tipo || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Zona:</span>
            <span className="ml-1 font-medium">{formData.distretto || 'Non selezionata'}</span>
          </div>
          <div>
            <span className="text-gray-500">Durata:</span>
            <span className="ml-1 font-medium">{formData.durata} minuti</span>
          </div>
          <div>
            <span className="text-gray-500">Intensità:</span>
            <span className="ml-1 font-medium">{formData.intensita}</span>
          </div>
          <div>
            <span className="text-gray-500">Sedute:</span>
            <span className="ml-1 font-medium">{formData.sedute}</span>
          </div>
          {formData.tecniche.length > 0 && (
            <div className="md:col-span-3">
              <span className="text-gray-500">Tecniche:</span>
              <span className="ml-1 font-medium">{formData.tecniche.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Indicazioni */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Indicazioni terapeutiche</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <p className="font-medium mb-1">Indicazioni:</p>
            <ul className="space-y-1">
              <li>• Contratture muscolari</li>
              <li>• Edemi e gonfiori</li>
              <li>• Stress e tensioni</li>
              <li>• Preparazione sportiva</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Controindicazioni:</p>
            <ul className="space-y-1">
              <li>• Stati febbrili</li>
              <li>• Lesioni cutanee aperte</li>
              <li>• Trombosi venose</li>
              <li>• Gravidanza (primo trimestre)</li>
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default MassoterapiaForm;
