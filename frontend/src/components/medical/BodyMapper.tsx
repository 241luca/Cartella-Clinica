import React, { useState } from 'react';
import { RotateCcw, Maximize2 } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  path: string;
  view: 'front' | 'back';
}

interface BodyMapperProps {
  selectedZones: string[];
  onZoneToggle: (zoneId: string) => void;
  view?: 'front' | 'back';
  onViewChange?: (view: 'front' | 'back') => void;
  multiple?: boolean;
  className?: string;
}

const zones: Zone[] = [
  // Vista Anteriore
  { id: 'head-front', name: 'Testa', path: 'M160,40 Q160,20 180,20 Q200,20 200,40 L200,60 Q200,80 180,80 Q160,80 160,60 Z', view: 'front' },
  { id: 'neck-front', name: 'Collo', path: 'M170,80 L190,80 L190,100 L170,100 Z', view: 'front' },
  { id: 'shoulder-left-front', name: 'Spalla Sinistra', path: 'M120,100 L170,100 L170,120 L120,120 Z', view: 'front' },
  { id: 'shoulder-right-front', name: 'Spalla Destra', path: 'M190,100 L240,100 L240,120 L190,120 Z', view: 'front' },
  { id: 'chest-front', name: 'Torace', path: 'M140,120 L220,120 L220,180 L140,180 Z', view: 'front' },
  { id: 'arm-left-upper-front', name: 'Braccio Sinistro', path: 'M110,120 L140,120 L140,180 L110,180 Z', view: 'front' },
  { id: 'arm-right-upper-front', name: 'Braccio Destro', path: 'M220,120 L250,120 L250,180 L220,180 Z', view: 'front' },
  { id: 'arm-left-lower-front', name: 'Avambraccio Sinistro', path: 'M110,180 L140,180 L140,240 L110,240 Z', view: 'front' },
  { id: 'arm-right-lower-front', name: 'Avambraccio Destro', path: 'M220,180 L250,180 L250,240 L220,240 Z', view: 'front' },
  { id: 'hand-left-front', name: 'Mano Sinistra', path: 'M110,240 L140,240 L140,270 L110,270 Z', view: 'front' },
  { id: 'hand-right-front', name: 'Mano Destra', path: 'M220,240 L250,240 L250,270 L220,270 Z', view: 'front' },
  { id: 'abdomen-front', name: 'Addome', path: 'M140,180 L220,180 L220,240 L140,240 Z', view: 'front' },
  { id: 'pelvis-front', name: 'Bacino', path: 'M140,240 L220,240 L220,280 L140,280 Z', view: 'front' },
  { id: 'thigh-left-front', name: 'Coscia Sinistra', path: 'M140,280 L170,280 L170,360 L140,360 Z', view: 'front' },
  { id: 'thigh-right-front', name: 'Coscia Destra', path: 'M190,280 L220,280 L220,360 L190,360 Z', view: 'front' },
  { id: 'knee-left-front', name: 'Ginocchio Sinistro', path: 'M140,360 L170,360 L170,380 L140,380 Z', view: 'front' },
  { id: 'knee-right-front', name: 'Ginocchio Destro', path: 'M190,360 L220,360 L220,380 L190,380 Z', view: 'front' },
  { id: 'leg-left-front', name: 'Gamba Sinistra', path: 'M140,380 L170,380 L170,460 L140,460 Z', view: 'front' },
  { id: 'leg-right-front', name: 'Gamba Destra', path: 'M190,380 L220,380 L220,460 L190,460 Z', view: 'front' },
  { id: 'foot-left-front', name: 'Piede Sinistro', path: 'M140,460 L170,460 L170,490 L140,490 Z', view: 'front' },
  { id: 'foot-right-front', name: 'Piede Destro', path: 'M190,460 L220,460 L220,490 L190,490 Z', view: 'front' },
  
  // Vista Posteriore
  { id: 'head-back', name: 'Testa', path: 'M160,40 Q160,20 180,20 Q200,20 200,40 L200,60 Q200,80 180,80 Q160,80 160,60 Z', view: 'back' },
  { id: 'neck-back', name: 'Collo', path: 'M170,80 L190,80 L190,100 L170,100 Z', view: 'back' },
  { id: 'shoulder-left-back', name: 'Spalla Sinistra', path: 'M120,100 L170,100 L170,120 L120,120 Z', view: 'back' },
  { id: 'shoulder-right-back', name: 'Spalla Destra', path: 'M190,100 L240,100 L240,120 L190,120 Z', view: 'back' },
  { id: 'upper-back', name: 'Dorsale Alto', path: 'M140,120 L220,120 L220,160 L140,160 Z', view: 'back' },
  { id: 'lower-back', name: 'Dorsale Basso', path: 'M140,160 L220,160 L220,200 L140,200 Z', view: 'back' },
  { id: 'lumbar', name: 'Lombare', path: 'M140,200 L220,200 L220,240 L140,240 Z', view: 'back' },
  { id: 'gluteus-left', name: 'Gluteo Sinistro', path: 'M140,240 L180,240 L180,280 L140,280 Z', view: 'back' },
  { id: 'gluteus-right', name: 'Gluteo Destro', path: 'M180,240 L220,240 L220,280 L180,280 Z', view: 'back' },
  { id: 'hamstring-left', name: 'Bicipite Femorale Sinistro', path: 'M140,280 L170,280 L170,360 L140,360 Z', view: 'back' },
  { id: 'hamstring-right', name: 'Bicipite Femorale Destro', path: 'M190,280 L220,280 L220,360 L190,360 Z', view: 'back' },
  { id: 'calf-left', name: 'Polpaccio Sinistro', path: 'M140,380 L170,380 L170,460 L140,460 Z', view: 'back' },
  { id: 'calf-right', name: 'Polpaccio Destro', path: 'M190,380 L220,380 L220,460 L190,460 Z', view: 'back' },
];

const BodyMapper: React.FC<BodyMapperProps> = ({
  selectedZones,
  onZoneToggle,
  view = 'front',
  onViewChange,
  multiple = true,
  className = ''
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState(view);

  const handleZoneClick = (zoneId: string) => {
    if (!multiple && selectedZones.length > 0 && !selectedZones.includes(zoneId)) {
      // Se non è multipla, deseleziona tutte le zone prima
      selectedZones.forEach(zone => onZoneToggle(zone));
    }
    onZoneToggle(zoneId);
  };

  const handleViewChange = () => {
    const newView = currentView === 'front' ? 'back' : 'front';
    setCurrentView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const filteredZones = zones.filter(zone => zone.view === currentView);
  const hoveredZoneName = zones.find(z => z.id === hoveredZone)?.name;

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      {/* Header con controlli */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Mappa Anatomica
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {multiple ? 'Seleziona una o più zone' : 'Seleziona una zona'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleViewChange}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ruota vista"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* SVG Body Map */}
      <div className="relative">
        <svg
          viewBox="0 0 360 500"
          className="w-full h-auto max-w-md mx-auto"
          style={{ maxHeight: '500px' }}
        >
          {/* Contorno del corpo */}
          <path
            d={currentView === 'front' 
              ? "M180,20 Q160,20 160,40 L160,60 Q160,80 170,80 L170,100 L120,100 L120,120 L110,120 L110,270 L140,270 L140,490 L170,490 L170,460 L190,460 L190,490 L220,490 L220,270 L250,270 L250,120 L240,120 L240,100 L190,100 L190,80 Q200,80 200,60 L200,40 Q200,20 180,20 Z"
              : "M180,20 Q160,20 160,40 L160,60 Q160,80 170,80 L170,100 L120,100 L120,120 L110,120 L110,270 L140,270 L140,490 L170,490 L170,460 L190,460 L190,490 L220,490 L220,270 L250,270 L250,120 L240,120 L240,100 L190,100 L190,80 Q200,80 200,60 L200,40 Q200,20 180,20 Z"
            }
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Zone interattive */}
          {filteredZones.map(zone => {
            const isSelected = selectedZones.includes(zone.id);
            const isHovered = hoveredZone === zone.id;

            return (
              <g key={zone.id}>
                <path
                  d={zone.path}
                  fill={isSelected ? '#3b82f6' : isHovered ? '#93c5fd' : '#f3f4f6'}
                  fillOpacity={isSelected ? 0.6 : isHovered ? 0.4 : 0.3}
                  stroke={isSelected ? '#2563eb' : '#d1d5db'}
                  strokeWidth={isSelected ? '2' : '1'}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => handleZoneClick(zone.id)}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip con nome zona */}
        {hoveredZoneName && (
          <div className="absolute top-0 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {hoveredZoneName}
          </div>
        )}
      </div>

      {/* Vista corrente */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Vista {currentView === 'front' ? 'Anteriore' : 'Posteriore'}
        </span>
      </div>

      {/* Zone selezionate */}
      {selectedZones.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Zone selezionate:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedZones.map(zoneId => {
              const zone = zones.find(z => z.id === zoneId);
              return zone ? (
                <span
                  key={zoneId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {zone.name}
                  <button
                    onClick={() => handleZoneClick(zoneId)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMapper;