import React, { useState } from 'react';
import { Volume2, Clock, Droplets, MapPin } from 'lucide-react';

interface UltrasuoniFormData {
  mhz: number;
  watt: number;
  tempo: number;
  inAcqua: boolean;
  modalita: 'continua' | 'pulsata';
  dutyCycle?: number;
  distretto: string;
  sedute: number;
  note?: string;
}

interface UltrasuoniFormProps {
  onSubmit: (data: UltrasuoniFormData) => void;
  initialData?: Partial<UltrasuoniFormData>;
  onCancel?: () => void;
}

const UltrasuoniForm: React.FC<UltrasuoniFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<UltrasuoniFormData>({
    mhz: initialData.mhz || 1,
    watt: initialData.watt || 1.5,
    tempo: initialData.tempo || 10,
    inAcqua: initialData.inAcqua || false,
    modalita: initialData.modalita || 'continua',
    dutyCycle: initialData.dutyCycle || 50,
    distretto: initialData.distretto || '',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const distretti = [
    'Spalla', 'Gomito', 'Polso', 'Mano',
    'Anca', 'Ginocchio', 'Caviglia', 'Piede',
    'Tendine Achille', 'Fascia plantare',
    'Epicondilo', 'Epitroclea',
    'Borsa sottoacromiale', 'Cuffia dei rotatori',
    'Legamenti ginocchio', 'Menisco',
    'Tunnel carpale', 'Dito a scatto',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof UltrasuoniFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-teal-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Volume2 className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Ultrasuonoterapia
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia con onde sonore ad alta frequenza per effetto meccanico e termico
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frequenza */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequenza
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value={1}
                checked={formData.mhz === 1}
                onChange={(e) => handleChange('mhz', Number(e.target.value))}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">1 MHz</span>
                <span className="text-gray-500 ml-1">(profondo, 4-5 cm)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={3}
                checked={formData.mhz === 3}
                onChange={(e) => handleChange('mhz', Number(e.target.value))}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">3 MHz</span>
                <span className="text-gray-500 ml-1">(superficiale, 1-2 cm)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Modalità */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalità di emissione
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="continua"
                checked={formData.modalita === 'continua'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">Continua</span>
                <span className="text-gray-500 ml-1">(effetto termico)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="pulsata"
                checked={formData.modalita === 'pulsata'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">Pulsata</span>
                <span className="text-gray-500 ml-1">(effetto meccanico)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Potenza */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Potenza (W/cm²)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={formData.watt}
              onChange={(e) => handleChange('watt', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0.1"
                max="3"
                step="0.1"
                value={formData.watt}
                onChange={(e) => handleChange('watt', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0.1-3 W/cm²</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• Bassa: 0.1-0.8 W/cm² (acuto)</span>
            <span className="block">• Media: 0.8-1.5 W/cm² (subacuto)</span>
            <span className="block">• Alta: 1.5-3 W/cm² (cronico)</span>
          </div>
        </div>

        {/* Duty Cycle (solo per pulsata) */}
        {formData.modalita === 'pulsata' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duty Cycle (%)
            </label>
            <select
              value={formData.dutyCycle}
              onChange={(e) => handleChange('dutyCycle', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={10}>10% (molto pulsato)</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={50}>50% (standard)</option>
              <option value={75}>75%</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Rapporto on/off dell'emissione pulsata
            </p>
          </div>
        )}

        {/* Applicazione in acqua */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Droplets className="inline w-4 h-4 mr-1" />
            Modalità di applicazione
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="false"
                checked={!formData.inAcqua}
                onChange={() => handleChange('inAcqua', false)}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">Diretta con gel</span>
                <span className="text-gray-500 ml-1">(standard)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="true"
                checked={formData.inAcqua}
                onChange={() => handleChange('inAcqua', true)}
                className="mr-2 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">
                <span className="font-medium">In acqua</span>
                <span className="text-gray-500 ml-1">(zone irregolari)</span>
              </span>
            </label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value={5}>5 minuti</option>
            <option value={10}>10 minuti</option>
            <option value={15}>15 minuti</option>
            <option value={20}>20 minuti</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Tecnica di applicazione, reazioni del paziente..."
          />
        </div>
      </div>

      {/* Riepilogo parametri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo parametri:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Frequenza:</span>
            <span className="ml-1 font-medium">{formData.mhz} MHz</span>
          </div>
          <div>
            <span className="text-gray-500">Modalità:</span>
            <span className="ml-1 font-medium capitalize">{formData.modalita}</span>
          </div>
          <div>
            <span className="text-gray-500">Potenza:</span>
            <span className="ml-1 font-medium">{formData.watt} W/cm²</span>
          </div>
          <div>
            <span className="text-gray-500">Durata:</span>
            <span className="ml-1 font-medium">{formData.tempo} min</span>
          </div>
          {formData.modalita === 'pulsata' && (
            <div>
              <span className="text-gray-500">Duty Cycle:</span>
              <span className="ml-1 font-medium">{formData.dutyCycle}%</span>
            </div>
          )}
          <div>
            <span className="text-gray-500">Applicazione:</span>
            <span className="ml-1 font-medium">{formData.inAcqua ? 'In acqua' : 'Con gel'}</span>
          </div>
        </div>
      </div>

      {/* Tecnica di applicazione */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">🎯 Tecnica di applicazione</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Movimento circolare lento e continuo del manipolo</li>
          <li>• Mantenere sempre il contatto con la cute</li>
          <li>• Applicare gel conduttore abbondante</li>
          <li>• Area di trattamento: 2-3 volte la testina</li>
          <li>• Velocità: 2-4 cm/secondo</li>
          <li>• Per zone irregolari: usare applicazione in acqua</li>
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
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default UltrasuoniForm;
