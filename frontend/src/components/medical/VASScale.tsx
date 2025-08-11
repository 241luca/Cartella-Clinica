import React from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface VASScaleProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showFaces?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  previousValue?: number;
  showTrend?: boolean;
}

const VASScale: React.FC<VASScaleProps> = ({
  value = 0,
  onChange,
  label = 'Scala del Dolore (VAS)',
  showFaces = true,
  showLabels = true,
  disabled = false,
  previousValue,
  showTrend = false,
}) => {
  // Colore basato sul valore
  const getColor = (val: number) => {
    if (val <= 3) return 'green';
    if (val <= 6) return 'yellow';
    return 'red';
  };

  // Emoji basate sul valore
  const getFaceIcon = (val: number) => {
    if (val <= 3) return <Smile className="w-8 h-8" />;
    if (val <= 6) return <Meh className="w-8 h-8" />;
    return <Frown className="w-8 h-8" />;
  };

  // Etichetta testuale del dolore
  const getPainLabel = (val: number) => {
    if (val === 0) return 'Nessun dolore';
    if (val <= 2) return 'Dolore lieve';
    if (val <= 4) return 'Dolore moderato';
    if (val <= 6) return 'Dolore forte';
    if (val <= 8) return 'Dolore molto forte';
    return 'Dolore insopportabile';
  };

  // Calcola il trend rispetto al valore precedente
  const getTrend = () => {
    if (!previousValue || previousValue === value) return null;
    if (value < previousValue) {
      return {
        icon: <TrendingDown className="w-5 h-5 text-green-600" />,
        text: `Miglioramento (-${previousValue - value})`,
        color: 'text-green-600'
      };
    }
    return {
      icon: <TrendingUp className="w-5 h-5 text-red-600" />,
      text: `Peggioramento (+${value - previousValue})`,
      color: 'text-red-600'
    };
  };

  const currentColor = getColor(value);
  const trend = getTrend();

  // Stili per lo slider basati sul colore
  const sliderStyles = {
    green: {
      track: 'bg-green-200',
      thumb: 'bg-green-500 hover:bg-green-600',
      face: 'text-green-500',
      label: 'text-green-700'
    },
    yellow: {
      track: 'bg-yellow-200',
      thumb: 'bg-yellow-500 hover:bg-yellow-600',
      face: 'text-yellow-500',
      label: 'text-yellow-700'
    },
    red: {
      track: 'bg-red-200',
      thumb: 'bg-red-500 hover:bg-red-600',
      face: 'text-red-500',
      label: 'text-red-700'
    }
  };

  const style = sliderStyles[currentColor as keyof typeof sliderStyles];

  return (
    <div className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      {/* Header con label e trend */}
      <div className="flex justify-between items-start mb-4">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showTrend && trend && (
          <div className={`flex items-center space-x-1 ${trend.color}`}>
            {trend.icon}
            <span className="text-sm font-medium">{trend.text}</span>
          </div>
        )}
      </div>

      {/* Container principale */}
      <div className="space-y-4">
        {/* Faccina e valore numerico */}
        {showFaces && (
          <div className="flex items-center justify-center space-x-4">
            <div className={style.face}>
              {getFaceIcon(value)}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              {showLabels && (
                <div className={`text-sm font-medium ${style.label}`}>
                  {getPainLabel(value)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Slider */}
        <div className="relative">
          {/* Track */}
          <div className={`h-3 rounded-full ${style.track} relative`}>
            {/* Progress */}
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                currentColor === 'green' ? 'bg-green-500' :
                currentColor === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${value * 10}%` }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ zIndex: 10 }}
          />

          {/* Thumb personalizzato */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-lg ${style.thumb} pointer-events-none transition-all duration-300`}
            style={{ left: `calc(${value * 10}% - 12px)` }}
          />
        </div>

        {/* Etichette numeriche */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
        </div>

        {/* Legenda */}
        {showLabels && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">0-3: Lieve</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">4-6: Moderato</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">7-10: Forte</span>
            </div>
          </div>
        )}

        {/* Info aggiuntiva */}
        {previousValue !== undefined && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-xs text-gray-600">
                <p>Valore precedente: <span className="font-medium">{previousValue}</span></p>
                <p>Valore attuale: <span className="font-medium">{value}</span></p>
                {trend && (
                  <p className={`font-medium ${trend.color}`}>
                    {trend.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VASScale;
