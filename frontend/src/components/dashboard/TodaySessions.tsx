import React from 'react';
import { Clock, User, MapPin, Activity } from 'lucide-react';
import type { TodaySession } from '../../services/dashboardService';

interface TodaySessionsProps {
  sessions: TodaySession[];
}

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  SCHEDULED: 'Programmata',
  IN_PROGRESS: 'In corso',
  COMPLETED: 'Completata',
  CANCELLED: 'Annullata',
};

const TodaySessions: React.FC<TodaySessionsProps> = ({ sessions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sedute di Oggi
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nessuna seduta programmata per oggi
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-semibold text-gray-800">
                    {session.time}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[session.status as keyof typeof statusColors]
                  }`}
                >
                  {statusLabels[session.status as keyof typeof statusLabels]}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-3 h-3 mr-2" />
                  <span className="font-medium">{session.patientName}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Activity className="w-3 h-3 mr-2" />
                  <span>{session.therapyType}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    <span>{session.room}</span>
                  </div>
                  <span className="text-xs">
                    Terapista: {session.therapist}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaySessions;
