import React, { useState } from 'react';
import { Radio, Zap, Clock, MapPin, Thermometer } from 'lucide-react';

interface TecarsinFormData {
  programma: string;
  modalita: 'capacitiva' | 'resistiva';
  potenza: number;
  tempo: number;
  temperatura: number;
  distretto: string;
  sedute: number;
  note?: string;
}

interface TecarsinFormProps {
  onSubmit: (data: TecarsinFormData) => void;
  initialData?: Partial<TecarsinFormData>;
  onCancel?: () => void;
}

const TecarsinForm: React.FC<TecarsinFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<TecarsinFormData>({
    programma: initialData.programma || '',
    modalita: initialData.modalita || 'capacitiva',
    potenza: initialData.potenza || 50,
    tempo: initialData.tempo || 30,
    temperatura: initialData.temperatura || 40,
    distretto: initialData.distretto || '',
    sedute: initialData.sedute || 10,
    note: initialData.note || ''
  });

  const programmi = [
    'Antalgico',
    'Decontratturante',
    'Drenante',
    'Biostimolante',
    'Antinfiammatorio',
    'Riassorbimento ematomi',
    'Cicatrizzazione',
    'Preparazione sportiva',
    'Recupero post-attività',
    'Altro'
  ];

  const distretti = [
    'Spalla destra', 'Spalla sinistra',
    'Gomito destro', 'Gomito sinistro',
    'Polso destro', 'Polso sinistro',
    'Anca destra', 'Anca sinistra',
    'Ginocchio destro', 'Ginocchio sinistro',
    'Caviglia destra', 'Caviglia sinistra',
    'Rachide cervicale', 'Rachide dorsale', 'Rachide lombare',
    'Muscoli paravertebrali',
    'Quadricipite', 'Bicipite femorale',
    'Polpaccio', 'Fascia plantare',
    'Altro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof TecarsinFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Radio className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tecarsin - Tecarterapia
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Terapia con radiofrequenza per stimolare il metabolismo cellulare
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Programma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programma terapeutico
          </label>
          <select
            value={formData.programma}
            onChange={(e) => handleChange('programma', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            Modalità di applicazione
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="capacitiva"
                checked={formData.modalita === 'capacitiva'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">
                <span className="font-medium">Capacitiva</span>
                <span className="text-gray-500 ml-1">(tessuti molli, superficiale)</span>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="resistiva"
                checked={formData.modalita === 'resistiva'}
                onChange={(e) => handleChange('modalita', e.target.value)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">
                <span className="font-medium">Resistiva</span>
                <span className="text-gray-500 ml-1">(tessuti ossei, profonda)</span>
              </span>
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
              max="200"
              value={formData.potenza}
              onChange={(e) => handleChange('potenza', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="0"
                max="200"
                value={formData.potenza}
                onChange={(e) => handleChange('potenza', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">0-200 W</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="block">• Atermica: 0-50W</span>
            <span className="block">• Termica leggera: 50-100W</span>
            <span className="block">• Termica media: 100-150W</span>
            <span className="block">• Termica alta: 150-200W</span>
          </div>
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Thermometer className="inline w-4 h-4 mr-1" />
            Temperatura target (°C)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="35"
              max="45"
              step="0.5"
              value={formData.temperatura}
              onChange={(e) => handleChange('temperatura', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <input
                type="number"
                min="35"
                max="45"
                step="0.5"
                value={formData.temperatura}
                onChange={(e) => handleChange('temperatura', Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                required
              />
              <span className="text-sm text-gray-500">35-45°C</span>
            </div>
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value={15}>15 minuti</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            <span className="ml-1 font-medium">{formData.programma || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Modalità:</span>
            <span className="ml-1 font-medium capitalize">{formData.modalita}</span>
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
            <span className="text-gray-500">Durata:</span>
            <span className="ml-1 font-medium">{formData.tempo} min</span>
          </div>
          <div>
            <span className="text-gray-500">Sedute:</span>
            <span className="ml-1 font-medium">{formData.sedute}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Distretto:</span>
            <span className="ml-1 font-medium">{formData.distretto || 'Non selezionato'}</span>
          </div>
        </div>
      </div>

      {/* Indicazioni d'uso */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">📋 Indicazioni per l'applicazione</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-700">
          <div>
            <p className="font-medium mb-1">Preparazione:</p>
            <ul className="space-y-1">
              <li>• Pulire e asciugare la zona</li>
              <li>• Applicare gel conduttore abbondante</li>
              <li>• Posizionare la piastra di ritorno</li>
              <li>• Iniziare con potenza bassa</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Durante il trattamento:</p>
            <ul className="space-y-1">
              <li>• Movimento continuo del manipolo</li>
              <li>• Verificare comfort termico del paziente</li>
              <li>• Mantenere contatto costante</li>
              <li>• Aggiungere gel se necessario</li>
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
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Salva Terapia
        </button>
      </div>
    </form>
  );
};

export default TecarsinForm;
