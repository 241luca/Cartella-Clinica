import React, { useState } from 'react';
import { Move, MapPin, Clock, Activity } from 'lucide-react';

interface MobilizzazioniFormData {
  distretto: string;
  tipo: string;
  gradi: number;
  serie: number;
  ripetizioni: number;
  tempo: number;
  sedute: number;
  note?: string;
}

interface MobilizzazioniFormProps {
  onSubmit: (data: MobilizzazioniFormData) => void;
  initialData?: Partial<MobilizzazioniFormData>;
  onCancel?: () => void;
}

const MobilizzazioniForm: React.FC<MobilizzazioniFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<MobilizzazioniFormData>({
    distretto: initialData.distretto || '',
    tipo: initialData.tipo || '',
    gradi: initialData.gradi || 90,
    serie: initialData.serie || 3,
    ripetizioni: initialData.ripetizioni || 10,
    tempo: initialData.tempo || 30,
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const articolazioni = [
    'Spalla destra', 'Spalla sinistra',
    'Gomito destro', 'Gomito sinistro',
    'Polso destro', 'Polso sinistro',
    'Anca destra', 'Anca sinistra',
    'Ginocchio destro', 'Ginocchio sinistro',
    'Caviglia destra', 'Caviglia sinistra',
    'Rachide cervicale', 'Rachide dorsale', 'Rachide lombare',
    'Articolazione temporo-mandibolare',
    'Dita mano', 'Dita piede',
    'Altro'
  ];

  const tipiMobilizzazione = [
    'Passiva', 
    'Attiva assistita', 
    'Attiva', 
    'Attiva contro resistenza',
    'Stretching passivo',
    'Stretching attivo',
    'PNF (Facilitazione Propriocettiva)',
    'Pompage articolare',
    'Trazioni',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MobilizzazioniFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-sky-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Move className="w-6 h-6 text-sky-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Mobilizzazioni Articolari
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia manuale per il recupero della mobilità articolare
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Articolazione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Articolazione
          </label>
          <select
            value={formData.distretto}
            onChange={(e) => handleChange('distretto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Seleziona articolazione...</option>
            {articolazioni.map(art => (
              <option key={art} value={art}>{art}</option>
            ))}
          </select>
        </div>

        {/* Tipo di mobilizzazione */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Tipo di mobilizzazione
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Seleziona tipo...</option>
            {tipiMobilizzazione.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Gradi di movimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ampiezza movimento (gradi)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={formData.gradi}
              onChange={(e) => handleChange('gradi', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="180"
                step="5"
                value={formData.gradi}
                onChange={(e) => handleChange('gradi', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-180°</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ampiezza del movimento articolare da raggiungere
          </p>
        </div>

        {/* Serie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero di serie
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.serie}
            onChange={(e) => handleChange('serie', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Set di esercizi da ripetere
          </p>
        </div>

        {/* Ripetizioni */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ripetizioni per serie
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.ripetizioni}
            onChange={(e) => handleChange('ripetizioni', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Numero di movimenti per serie
          </p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Limitazioni, dolore, progressi attesi..."
          />
        </div>
      </div>

      {/* Riepilogo esercizio */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo esercizio:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Tipo:</span>
            <span className="ml-1 font-medium">{formData.tipo || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Ampiezza:</span>
            <span className="ml-1 font-medium">{formData.gradi}°</span>
          </div>
          <div>
            <span className="text-gray-500">Volume:</span>
            <span className="ml-1 font-medium">{formData.serie}x{formData.ripetizioni}</span>
          </div>
          <div>
            <span className="text-gray-500">Totale rip.:</span>
            <span className="ml-1 font-medium">{formData.serie * formData.ripetizioni}</span>
          </div>
        </div>
      </div>

      {/* Progressione */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">📈 Progressione consigliata</h4>
        <div className="text-xs text-green-700 space-y-2">
          <div>
            <p className="font-medium">Settimana 1-2:</p>
            <p>Mobilizzazione passiva, ROM limitato, focus su controllo del dolore</p>
          </div>
          <div>
            <p className="font-medium">Settimana 3-4:</p>
            <p>Mobilizzazione attiva assistita, aumento graduale ROM</p>
          </div>
          <div>
            <p className="font-medium">Settimana 5-6:</p>
            <p>Mobilizzazione attiva, ROM completo, inizio resistenza leggera</p>
          </div>
        </div>
      </div>

      {/* Precauzioni */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Precauzioni</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Rispettare sempre la soglia del dolore</li>
          <li>• Movimento lento e controllato</li>
          <li>• Evitare compensi articolari</li>
          <li>• Monitorare gonfiore post-esercizio</li>
          <li>• Interrompere se dolore acuto</li>
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
          className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default MobilizzazioniForm;
