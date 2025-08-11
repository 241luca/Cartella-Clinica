import React, { useState } from 'react';
import { Activity, Clock, Calendar, FileText } from 'lucide-react';

interface TecalabFormData {
  sedute: number;
  programma: string;
  frequenzaSettimanale: number;
  durataCiclo: number;
  note?: string;
}

interface TecalabFormProps {
  onSubmit: (data: TecalabFormData) => void;
  initialData?: Partial<TecalabFormData>;
  onCancel?: () => void;
}

const TecalabForm: React.FC<TecalabFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<TecalabFormData>({
    sedute: initialData.sedute || 10,
    programma: initialData.programma || '',
    frequenzaSettimanale: initialData.frequenzaSettimanale || 2,
    durataCiclo: initialData.durataCiclo || 5,
    note: initialData.note || ''
  });

  const programmi = [
    'Riabilitazione post-chirurgica',
    'Riabilitazione post-traumatica',
    'Rieducazione funzionale',
    'Potenziamento muscolare',
    'Recupero articolare',
    'Programma antalgico',
    'Programma propriocettivo',
    'Programma posturale',
    'Programma sportivo',
    'Programma personalizzato'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof TecalabFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcola durata totale del trattamento
  const calcolaDurataTotale = () => {
    if (formData.frequenzaSettimanale > 0) {
      const settimane = Math.ceil(formData.sedute / formData.frequenzaSettimanale);
      return settimane;
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intestazione */}
      <div className="bg-emerald-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tecalab - Laboratorio Riabilitativo
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Programma riabilitativo personalizzato multidisciplinare
        </p>
      </div>

      {/* Grid di campi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Programma */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Programma riabilitativo
          </label>
          <select
            value={formData.programma}
            onChange={(e) => handleChange('programma', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Seleziona programma...</option>
            {programmi.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>

        {/* Numero sedute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numero totale di sedute
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.sedute}
            onChange={(e) => handleChange('sedute', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Numero complessivo di sedute del programma
          </p>
        </div>

        {/* Frequenza settimanale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Frequenza settimanale
          </label>
          <select
            value={formData.frequenzaSettimanale}
            onChange={(e) => handleChange('frequenzaSettimanale', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value={1}>1 volta a settimana</option>
            <option value={2}>2 volte a settimana</option>
            <option value={3}>3 volte a settimana</option>
            <option value={4}>4 volte a settimana</option>
            <option value={5}>5 volte a settimana</option>
            <option value={6}>Tutti i giorni (6 volte)</option>
          </select>
        </div>

        {/* Durata ciclo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Durata prevista (settimane)
          </label>
          <input
            type="number"
            min="1"
            max="52"
            value={formData.durataCiclo}
            onChange={(e) => handleChange('durataCiclo', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Durata complessiva del ciclo riabilitativo
          </p>
        </div>

        {/* Note */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note e obiettivi specifici (opzionale)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Obiettivi specifici, progressi attesi, integrazioni con altre terapie..."
          />
        </div>
      </div>

      {/* Riepilogo programma */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Riepilogo programma:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Programma:</span>
            <span className="ml-1 font-medium">{formData.programma || 'Non selezionato'}</span>
          </div>
          <div>
            <span className="text-gray-500">Sedute totali:</span>
            <span className="ml-1 font-medium">{formData.sedute}</span>
          </div>
          <div>
            <span className="text-gray-500">Frequenza:</span>
            <span className="ml-1 font-medium">{formData.frequenzaSettimanale}x/settimana</span>
          </div>
          <div>
            <span className="text-gray-500">Durata stimata:</span>
            <span className="ml-1 font-medium">{calcolaDurataTotale()} settimane</span>
          </div>
        </div>
      </div>

      {/* Fasi del programma */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Fasi tipiche del programma Tecalab</h4>
        <div className="space-y-3 text-xs text-blue-700">
          <div>
            <p className="font-medium">Fase 1 - Valutazione iniziale (1-2 sedute)</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Assessment funzionale completo</li>
              <li>• Definizione obiettivi personalizzati</li>
              <li>• Test di base e misurazioni</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Fase 2 - Intervento attivo (60-70% sedute)</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Esercizi terapeutici progressivi</li>
              <li>• Tecniche manuali integrate</li>
              <li>• Monitoraggio continuo progressi</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Fase 3 - Consolidamento (20-30% sedute)</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Stabilizzazione risultati</li>
              <li>• Incremento autonomia</li>
              <li>• Preparazione al mantenimento</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Fase 4 - Valutazione finale (1-2 sedute)</p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Test finali e confronto</li>
              <li>• Programma di mantenimento</li>
              <li>• Indicazioni per autogestione</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Integrazioni possibili */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">🔄 Integrazioni con altre terapie</h4>
        <p className="text-xs text-green-700 mb-2">
          Il programma Tecalab può essere integrato con:
        </p>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Terapie strumentali (Laser, TENS, Ultrasuoni)</li>
          <li>• Terapie manuali (Massoterapia, Mobilizzazioni)</li>
          <li>• Idrokinesiterapia in piscina</li>
          <li>• Supporto nutrizionale e psicologico</li>
          <li>• Training propriocettivo e posturale</li>
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
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Salva Programma
        </button>
      </div>
    </form>
  );
};

export default TecalabForm;
