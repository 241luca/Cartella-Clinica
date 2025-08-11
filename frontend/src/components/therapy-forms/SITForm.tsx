import React, { useState } from 'react';
import { Syringe, MapPin, Pill, Clock } from 'lucide-react';

interface SITFormData {
  distretto: string;
  farmaco: string;
  dosaggio: string;
  profondita: string;
  numeroInfiltrazioni: number;
  sedute: number;
  note?: string;
}

interface SITFormProps {
  onSubmit: (data: SITFormData) => void;
  initialData?: Partial<SITFormData>;
  onCancel?: () => void;
}

const SITForm: React.FC<SITFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<SITFormData>({
    distretto: initialData.distretto || '',
    farmaco: initialData.farmaco || '',
    dosaggio: initialData.dosaggio || '',
    profondita: initialData.profondita || 'superficiale',
    numeroInfiltrazioni: initialData.numeroInfiltrazioni || 1,
    sedute: initialData.sedute || 5,
    note: initialData.note || ''
  });

  const distretti = [
    'Spalla destra', 'Spalla sinistra',
    'Gomito destro', 'Gomito sinistro',
    'Polso destro', 'Polso sinistro',
    'Anca destra', 'Anca sinistra',
    'Ginocchio destro', 'Ginocchio sinistro',
    'Caviglia destra', 'Caviglia sinistra',
    'Rachide cervicale', 'Rachide dorsale', 'Rachide lombare',
    'Articolazione sacro-iliaca',
    'Tendine rotuleo', 'Tendine Achille',
    'Fascia plantare', 'Epicondilo', 'Epitroclea',
    'Borsa sottoacromiale',
    'Altro'
  ];

  const farmaciComuni = [
    'Cortisone',
    'Acido ialuronico',
    'Anestetici locali',
    'FANS',
    'Ozono',
    'PRP (Plasma Ricco di Piastrine)',
    'Collagene',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof SITFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-violet-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Syringe className="w-6 h-6 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            SIT - Sistema Infiltrativo Transcutaneo
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia infiltrativa guidata per il trattamento localizzato
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distretto corporeo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Distretto corporeo
          </label>
          <select
            value={formData.distretto}
            onChange={(e) => handleChange('distretto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          >
            <option value="">Seleziona distretto...</option>
            {distretti.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Farmaco */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Pill className="inline w-4 h-4 mr-1" />
            Farmaco/Sostanza
          </label>
          <select
            value={formData.farmaco}
            onChange={(e) => handleChange('farmaco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          >
            <option value="">Seleziona farmaco...</option>
            {farmaciComuni.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {formData.farmaco === 'Altro' && (
            <input
              type="text"
              placeholder="Specifica il farmaco..."
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              onChange={(e) => handleChange('farmaco', e.target.value)}
            />
          )}
        </div>

        {/* Dosaggio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosaggio
          </label>
          <input
            type="text"
            value={formData.dosaggio}
            onChange={(e) => handleChange('dosaggio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="es. 2ml, 40mg, etc..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Quantità e concentrazione del farmaco
          </p>
        </div>

        {/* Profondità infiltrazione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profondità infiltrazione
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="superficiale"
                checked={formData.profondita === 'superficiale'}
                onChange={(e) => handleChange('profondita', e.target.value)}
                className="mr-2 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm">
                <span className="font-medium">Superficiale</span>
                <span className="text-gray-500 ml-1">(&lt; 2 cm)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="media"
                checked={formData.profondita === 'media'}
                onChange={(e) => handleChange('profondita', e.target.value)}
                className="mr-2 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm">
                <span className="font-medium">Media</span>
                <span className="text-gray-500 ml-1">(2-5 cm)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="profonda"
                checked={formData.profondita === 'profonda'}
                onChange={(e) => handleChange('profondita', e.target.value)}
                className="mr-2 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm">
                <span className="font-medium">Profonda</span>
                <span className="text-gray-500 ml-1">(&gt; 5 cm)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Numero infiltrazioni per seduta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero infiltrazioni per seduta
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.numeroInfiltrazioni}
            onChange={(e) => handleChange('numeroInfiltrazioni', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Punti di infiltrazione per seduta
          </p>
        </div>

        {/* Numero sedute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Numero di sedute
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.sedute}
            onChange={(e) => handleChange('sedute', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Ciclo completo di infiltrazioni
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="Reazioni, allergie note, precauzioni particolari..."
          />
        </div>
      </div>

      {/* Riepilogo trattamento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo trattamento:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Farmaco:</span>
            <span className="ml-1 font-medium">{formData.farmaco || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Dosaggio:</span>
            <span className="ml-1 font-medium">{formData.dosaggio || 'Non specificato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Profondità:</span>
            <span className="ml-1 font-medium capitalize">{formData.profondita}</span>
          </div>
          <div>
            <span className="text-gray-500">Punti/seduta:</span>
            <span className="ml-1 font-medium">{formData.numeroInfiltrazioni}</span>
          </div>
          <div>
            <span className="text-gray-500">Sedute totali:</span>
            <span className="ml-1 font-medium">{formData.sedute}</span>
          </div>
          <div>
            <span className="text-gray-500">Distretto:</span>
            <span className="ml-1 font-medium">{formData.distretto || 'Non selezionato'}</span>
          </div>
        </div>
      </div>

      {/* Protocollo post-infiltrazione */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Protocollo post-infiltrazione</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Riposo articolare per 24-48 ore</li>
          <li>• Applicazione ghiaccio 15 min x 3 volte/die</li>
          <li>• Evitare carichi eccessivi per 72 ore</li>
          <li>• Monitorare segni di infezione</li>
          <li>• Controllo medico se dolore persistente</li>
        </ul>
      </div>

      {/* Controindicazioni */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-red-800 mb-2">⚠️ Controindicazioni</h4>
        <ul className="text-xs text-red-700 space-y-1">
          <li>• Infezioni locali o sistemiche</li>
          <li>• Allergie note al farmaco</li>
          <li>• Coagulopatie o terapia anticoagulante</li>
          <li>• Gravidanza (primo trimestre)</li>
          <li>• Immunodepressione grave</li>
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
          className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default SITForm;
