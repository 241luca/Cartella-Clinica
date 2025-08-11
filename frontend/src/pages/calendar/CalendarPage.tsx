import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Filter,
  Download,
  Grid3x3,
  List,
  BarChart3,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  patientName: string;
  therapyType: string;
  time: string;
  duration: number;
  therapist: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  color: string;
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [currentDate, viewMode]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Simula caricamento eventi
      setTimeout(() => {
        setEvents(getMockEvents());
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
      setEvents(getMockEvents());
      setLoading(false);
    }
  };

  const getMockEvents = (): Event[] => {
    const mockEvents: Event[] = [];
    const therapyTypes = ['Fisioterapia', 'Laserterapia', 'Tecarterapia', 'Ultrasuoni'];
    const patients = ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri'];
    const therapists = ['Dott. Bianchi', 'Dott.ssa Rossi', 'Dott. Verdi'];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    for (let i = 0; i < 15; i++) {
      mockEvents.push({
        id: `event-${i}`,
        title: `${therapyTypes[i % therapyTypes.length]} - ${patients[i % patients.length]}`,
        patientName: patients[i % patients.length],
        therapyType: therapyTypes[i % therapyTypes.length],
        time: times[i % times.length],
        duration: 30 + (i % 3) * 15,
        therapist: therapists[i % therapists.length],
        status: i % 5 === 0 ? 'cancelled' : i % 3 === 0 ? 'completed' : 'scheduled',
        color: colors[i % colors.length],
      });
    }
    return mockEvents;
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      });
    }
  };

  const getDateRangeText = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'EEEE, d MMMM yyyy', { locale: it });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'd MMM', { locale: it })} - ${format(end, 'd MMM yyyy', { locale: it })}`;
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: it });
    }
  };

  const handleExport = () => {
    toast.success('Esportazione calendario in corso...');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento calendario...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const todayEvents = events.filter(e => e.status === 'scheduled').slice(0, 5);
  const completedToday = events.filter(e => e.status === 'completed').length;
  const scheduledToday = events.filter(e => e.status === 'scheduled').length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Calendario</h1>
              <p className="text-sm text-gray-500 mt-1">
                Visualizza e gestisci gli appuntamenti
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta
              </button>
              <button
                onClick={() => navigate('/therapies/new')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuovo Appuntamento
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Calendar Area */}
            <div className="lg:col-span-3">
              {/* Calendar Controls */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Oggi
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigatePeriod('prev')}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-3 text-sm font-medium text-gray-900 min-w-[200px] text-center">
                        {getDateRangeText()}
                      </span>
                      <button
                        onClick={() => navigatePeriod('next')}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('day')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        viewMode === 'day'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Giorno
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        viewMode === 'week'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Settimana
                    </button>
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        viewMode === 'month'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Mese
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ minHeight: '600px' }}>
                {viewMode === 'week' && (
                  <div className="grid grid-cols-8 gap-px bg-gray-200">
                    <div className="bg-gray-50 p-2 text-xs font-medium text-gray-500"></div>
                    {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                      const day = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), dayOffset);
                      const dayEvents = events.filter(e => e.status === 'scheduled').slice(0, 3);
                      return (
                        <div key={dayOffset} className="bg-white">
                          <div className={`p-3 text-center border-b border-gray-100 ${isToday(day) ? 'bg-indigo-50' : ''}`}>
                            <p className="text-xs text-gray-500">{format(day, 'EEE', { locale: it })}</p>
                            <p className={`text-lg font-semibold ${isToday(day) ? 'text-indigo-600' : 'text-gray-900'}`}>
                              {format(day, 'd')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Time slots */}
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                      <React.Fragment key={time}>
                        <div className="bg-gray-50 p-2 text-xs text-gray-500 text-right pr-3">{time}</div>
                        {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => (
                          <div key={`${time}-${dayOffset}`} className="bg-white p-1 min-h-[60px] border-t border-gray-100">
                            {dayOffset % 3 === 0 && time === '10:00' && (
                              <div className="bg-blue-100 text-blue-700 p-1 rounded text-xs">
                                <p className="font-medium truncate">Mario Rossi</p>
                                <p className="text-xs opacity-75">Fisioterapia</p>
                              </div>
                            )}
                            {dayOffset % 2 === 1 && time === '15:00' && (
                              <div className="bg-green-100 text-green-700 p-1 rounded text-xs">
                                <p className="font-medium truncate">Laura Bianchi</p>
                                <p className="text-xs opacity-75">Laserterapia</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {viewMode === 'month' && (
                  <div className="text-center text-gray-500 py-20">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Vista mensile in sviluppo</p>
                  </div>
                )}

                {viewMode === 'day' && (
                  <div className="text-center text-gray-500 py-20">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Vista giornaliera in sviluppo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo Oggi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Appuntamenti</span>
                    <span className="text-lg font-bold text-gray-900">{scheduledToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completati</span>
                    <span className="text-lg font-bold text-green-600">{completedToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Durata media</span>
                    <span className="text-lg font-bold text-gray-900">45 min</span>
                  </div>
                </div>
              </div>

              {/* Prossimi Appuntamenti */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossimi Appuntamenti</h3>
                <div className="space-y-3">
                  {todayEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className={`w-2 h-8 ${event.color} rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.time}</p>
                        <p className="text-xs text-gray-500">{event.patientName}</p>
                        <p className="text-xs text-gray-400">{event.therapyType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtri */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtri</h3>
                <div className="space-y-3">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Tutti i terapisti</option>
                    <option>Dott. Bianchi</option>
                    <option>Dott.ssa Rossi</option>
                  </select>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Tutte le terapie</option>
                    <option>Fisioterapia</option>
                    <option>Laserterapia</option>
                    <option>Tecarterapia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;