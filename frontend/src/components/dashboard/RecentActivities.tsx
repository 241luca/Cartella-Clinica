import React from 'react';
import { Clock, User, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const activityIcons = {
  patient_added: User,
  therapy_completed: Activity,
  record_created: FileText,
  session_scheduled: Clock,
};

const activityColors = {
  patient_added: 'text-blue-600 bg-blue-100',
  therapy_completed: 'text-green-600 bg-green-100',
  record_created: 'text-purple-600 bg-purple-100',
  session_scheduled: 'text-orange-600 bg-orange-100',
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Ora';
    if (diffInMinutes < 60) return `${diffInMinutes} min fa`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'ora' : 'ore'} fa`;
    }
    return format(date, 'dd MMM HH:mm', { locale: it });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Attività Recenti
      </h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nessuna attività recente
          </p>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Activity;
            const colorClass = activityColors[activity.type as keyof typeof activityColors] || 'text-gray-600 bg-gray-100';
            
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {activities.length > 0 && (
        <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
          Vedi tutte le attività →
        </button>
      )}
    </div>
  );
};

export default RecentActivities;
