import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Activity,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
} from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/it';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Setup localizzazione italiana
moment.locale('it');
const localizer = momentLocalizer(moment);

interface TherapySession {
  id: string;
  therapyId: string;
  therapistId: string;
  sessionNumber: number;
  sessionDate: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  notes?: string;
  therapy: {
    id: string;
    therapyType: {
      name: string;
      category: string;
      color?: string;
    };
    district?: string;
    clinicalRecord: {
      patient: {
        id: string;
        firstName: string;
        lastName: string;
        mobile?: string;
      };
    };
  };
  therapist: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface CalendarEventType {
  id: string;
  title?: string;
  start: Date;
  end: Date;
  sessionId: string;
  patientName: string;
  therapyName: string;
  therapistName: string;
  status: string;
  district?: string;
  mobile?: string;
  color?: string;
}

interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  color: string;
}

const TherapyCalendar: React.FC = () => {
  const navigate = useNavigate();
  
  const [view, setView] = useState<string>('week');
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Colori per categorie terapie
  const categoryColors = {
    INSTRUMENTAL: '#3B82F6', // blu
    MANUAL: '#10B981', // verde
    REHABILITATION: '#8B5CF6', // viola
    OTHER: '#6B7280', // grigio
  };

  // Colori per stati
  const statusColors = {
    SCHEDULED: '#FCD34D', // giallo
    COMPLETED: '#10B981', // verde
    CANCELLED: '#EF4444', // rosso
    NO_SHOW: '#F97316', // arancione
  };

  useEffect(() => {
    loadSessions();
    loadTherapists();
  }, [date, view, selectedTherapist, selectedStatus]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      
      // Calcola range date basato sulla vista
      const startDate = getStartDate();
      const endDate = getEndDate();
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      if (selectedTherapist !== 'all') {
        params.append('therapistId', selectedTherapist);
      }
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const response = await api.get(`/therapy-sessions?${params}`);
      
      if (response.data.success) {
        const sessionsData = response.data.data || [];
        setSessions(sessionsData);
        convertSessionsToEvents(sessionsData);
      }
    } catch (error) {
      console.error('Errore caricamento sedute:', error);
      // Usa dati mock se l'API fallisce
      const mockSessions = getMockSessions();
      setSessions(mockSessions);
      convertSessionsToEvents(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  const getMockSessions = (): TherapySession[] => {
    const mockSessions: TherapySession[] = [];
    const therapyTypes = ['Laser YAG', 'Tecarterapia', 'Kinesiterapia', 'Magnetoterapia'];
    const therapistNames = [
      { id: 'therapist-1', firstName: 'Giuseppe', lastName: 'Verdi' },
      { id: 'therapist-2', firstName: 'Anna', lastName: 'Neri' },
    ];
    const patientNames = [
      { firstName: 'Mario', lastName: 'Rossi', mobile: '333-1234567' },
      { firstName: 'Laura', lastName: 'Bianchi', mobile: '333-2345678' },
      { firstName: 'Giovanni', lastName: 'Romano', mobile: '333-3456789' },
    ];
    const statuses: TherapySession['status'][] = ['SCHEDULED', 'COMPLETED', 'SCHEDULED', 'SCHEDULED'];
    
    // Genera sedute per la settimana corrente
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const sessionDate = new Date(date);
      sessionDate.setDate(date.getDate() - date.getDay() + dayOffset);
      
      // 4-6 sedute al giorno
      const sessionsPerDay = Math.floor(Math.random() * 3) + 4;
      
      for (let i = 0; i < sessionsPerDay; i++) {
        const hour = 8 + Math.floor(Math.random() * 10); // 8:00 - 18:00
        const minute = Math.random() > 0.5 ? 0 : 30;
        const therapist = therapistNames[Math.floor(Math.random() * therapistNames.length)];
        const patient = patientNames[Math.floor(Math.random() * patientNames.length)];
        const therapyType = therapyTypes[Math.floor(Math.random() * therapyTypes.length)];
        
        sessionDate.setHours(hour, minute, 0, 0);
        
        mockSessions.push({
          id: `session-${dayOffset}-${i}`,
          therapyId: `therapy-${i}`,
          therapistId: therapist.id,
          sessionNumber: i + 1,
          sessionDate: new Date(sessionDate).toISOString(),
          duration: 30,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          therapy: {
            id: `therapy-${i}`,
            therapyType: {
              name: therapyType,
              category: therapyType.includes('Kines') ? 'MANUAL' : 'INSTRUMENTAL',
            },
            district: 'Lombare',
            clinicalRecord: {
              patient: {
                id: `patient-${i}`,
                firstName: patient.firstName,
                lastName: patient.lastName,
                mobile: patient.mobile,
              },
            },
          },
          therapist: {
            id: therapist.id,
            firstName: therapist.firstName,
            lastName: therapist.lastName,
          },
        });
      }
    }
    
    return mockSessions;
  };

  const loadTherapists = async () => {
    try {
      const response = await api.get('/users?role=THERAPIST');
      if (response.data.success) {
        const therapistsData = response.data.data.map((t: any, index: number) => ({
          ...t,
          color: `hsl(${index * 60}, 70%, 50%)`, // Colori diversi per ogni terapista
        }));
        setTherapists(therapistsData);
      }
    } catch (error) {
      console.error('Errore caricamento terapisti:', error);
      // Usa dati mock
      setTherapists([
        { id: 'therapist-1', firstName: 'Giuseppe', lastName: 'Verdi', color: '#3B82F6' },
        { id: 'therapist-2', firstName: 'Anna', lastName: 'Neri', color: '#10B981' },
      ]);
    }
  };

  const getStartDate = () => {
    const start = new Date(date);
    if (view === 'month') {
      start.setDate(1);
    } else if (view === 'week') {
      start.setDate(date.getDate() - date.getDay());
    } else if (view === 'day') {
      // Già impostato
    }
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getEndDate = () => {
    const end = new Date(date);
    if (view === 'month') {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (view === 'week') {
      end.setDate(date.getDate() - date.getDay() + 6);
    } else if (view === 'day') {
      // Stesso giorno
    }
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const convertSessionsToEvents = (sessionsData: TherapySession[]) => {
    const calendarEvents: CalendarEventType[] = sessionsData.map(session => {
      const startDate = new Date(session.sessionDate);
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + session.duration);
      
      const therapist = therapists.find(t => t.id === session.therapistId);
      const color = therapist?.color || categoryColors[session.therapy.therapyType.category as keyof typeof categoryColors] || '#6B7280';
      
      return {
        id: session.id,
        sessionId: session.id,
        title: `${session.therapy.clinicalRecord.patient.lastName} - ${session.therapy.therapyType.name}`,
        start: startDate,
        end: endDate,
        patientName: `${session.therapy.clinicalRecord.patient.lastName} ${session.therapy.clinicalRecord.patient.firstName}`,
        therapyName: session.therapy.therapyType.name,
        therapistName: `${session.therapist.firstName} ${session.therapist.lastName}`,
        status: session.status,
        district: session.therapy.district,
        mobile: session.therapy.clinicalRecord.patient.mobile,
        color,
      };
    });
    
    setEvents(calendarEvents);
  };

  const handleSelectSlot = useCallback((slotInfo: any) => {
    // Naviga al form per creare una nuova seduta
    const dateStr = format(slotInfo.start, 'yyyy-MM-dd');
    const timeStr = format(slotInfo.start, 'HH:mm');
    navigate(`/therapy-sessions/new?date=${dateStr}&time=${timeStr}`);
  }, [navigate]);

  const handleSelectEvent = useCallback((event: CalendarEventType) => {
    const session = sessions.find(s => s.id === event.sessionId);
    if (session) {
      setSelectedSession(session);
      setShowSessionModal(true);
    }
  }, [sessions]);

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await api.post(`/therapy-sessions/${sessionId}/complete`, {
        vasScoreBefore: 5,
        vasScoreAfter: 3,
        notes: 'Seduta completata regolarmente',
      });
      toast.success('Seduta completata');
      loadSessions();
      setShowSessionModal(false);
    } catch (error) {
      toast.error('Errore nel completamento della seduta');
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Sei sicuro di voler annullare questa seduta?')) return;
    
    try {
      await api.post(`/therapy-sessions/${sessionId}/cancel`, {
        reason: 'Paziente assente',
      });
      toast.success('Seduta annullata');
      loadSessions();
      setShowSessionModal(false);
    } catch (error) {
      toast.error('Errore nell\'annullamento della seduta');
    }
  };

  const eventStyleGetter = (event: CalendarEventType) => {
    let backgroundColor = event.color || '#3B82F6';
    let borderColor = backgroundColor;
    
    // Modifica opacità per stati diversi
    if (event.status === 'COMPLETED') {
      backgroundColor = '#10B981';
    } else if (event.status === 'CANCELLED') {
      backgroundColor = '#EF4444';
      
    } else if (event.status === 'NO_SHOW') {
      backgroundColor = '#F97316';
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid ' + borderColor,
        display: 'block',
      },
    };
  };

  const CustomEvent = ({ event }: { event: CalendarEventType }) => (
    <div className="p-1 text-xs">
      <div className="font-semibold truncate">{event.patientName}</div>
      <div className="truncate opacity-90">{event.therapyName}</div>
      {view !== 'month' && (
        <div className="truncate opacity-75">{event.therapistName}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2" />
                Calendario Sedute
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Visualizza e gestisci tutte le sedute di terapia
              </p>
            </div>
            <button
              onClick={() => navigate('/therapy-sessions/new')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Seduta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filtri */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filtro Terapista */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Terapista
              </h3>
              <select
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tutti i terapisti</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.firstName} {therapist.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Stato */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Stato Seduta
              </h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tutti gli stati</option>
                <option value="SCHEDULED">Programmate</option>
                <option value="COMPLETED">Completate</option>
                <option value="CANCELLED">Annullate</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>

            {/* Legenda */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Legenda</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
                  <span className="ml-2 text-sm text-gray-600">Programmata</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
                  <span className="ml-2 text-sm text-gray-600">Completata</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                  <span className="ml-2 text-sm text-gray-600">Annullata</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F97316' }}></div>
                  <span className="ml-2 text-sm text-gray-600">No Show</span>
                </div>
              </div>
            </div>

            {/* Statistiche Giornaliere */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Oggi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Totale sedute</span>
                  <span className="font-medium">
                    {events.filter(e => 
                      format(e.start as Date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completate</span>
                  <span className="font-medium text-green-600">
                    {events.filter(e => 
                      format(e.start as Date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
                      e.status === 'COMPLETED'
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In attesa</span>
                  <span className="font-medium text-yellow-600">
                    {events.filter(e => 
                      format(e.start as Date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
                      e.status === 'SCHEDULED'
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="lg:col-span-3">
            {/* Toolbar Personalizzata */}
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDate(new Date(date.setDate(date.getDate() - 7)))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDate(new Date())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Oggi
                </button>
                <button
                  onClick={() => setDate(new Date(date.setDate(date.getDate() + 7)))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 ml-4">
                  {format(date, 'MMMM yyyy', { locale: it })}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    view === 'day'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Giorno
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    view === 'week'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Settimana
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    view === 'month'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Mese
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" style={{ height: '600px' }}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  view={view as any}
                  date={date}
                  onView={(newView: any) => setView(newView)}
                  onNavigate={(newDate: Date) => setDate(newDate)}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  components={{
                    event: CustomEvent,
                  }}
                  eventPropGetter={eventStyleGetter}
                  messages={{
                    next: 'Successivo',
                    previous: 'Precedente',
                    today: 'Oggi',
                    month: 'Mese',
                    week: 'Settimana',
                    day: 'Giorno',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Ora',
                    event: 'Evento',
                    noEventsInRange: 'Nessuna seduta in questo periodo',
                    showMore: (total: number) => `+ Altri ${total}`,
                  }}
                  formats={{
                    dayFormat: 'DD',
                    dayHeaderFormat: 'dddd DD/MM',
                    monthHeaderFormat: 'MMMM yyyy',
                  }}
                  toolbar={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dettaglio Seduta */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Dettaglio Seduta
              </h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Info Paziente */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedSession.therapy.clinicalRecord.patient.lastName} {selectedSession.therapy.clinicalRecord.patient.firstName}
                  </p>
                  {selectedSession.therapy.clinicalRecord.patient.mobile && (
                    <p className="text-sm text-gray-600">
                      Tel: {selectedSession.therapy.clinicalRecord.patient.mobile}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Info Terapia */}
              <div className="flex items-start space-x-3">
                <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedSession.therapy.therapyType.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Seduta {selectedSession.sessionNumber} • {selectedSession.therapy.district}
                  </p>
                </div>
              </div>
              
              {/* Info Terapista */}
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedSession.therapist.firstName} {selectedSession.therapist.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Terapista</p>
                </div>
              </div>
              
              {/* Info Orario */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(selectedSession.sessionDate), 'EEEE dd MMMM yyyy', { locale: it })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedSession.sessionDate), 'HH:mm')} - 
                    {' '}{selectedSession.duration} minuti
                  </p>
                </div>
              </div>
              
              {/* Stato */}
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedSession.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                    selectedSession.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    selectedSession.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedSession.status === 'SCHEDULED' && 'Programmata'}
                    {selectedSession.status === 'COMPLETED' && 'Completata'}
                    {selectedSession.status === 'CANCELLED' && 'Annullata'}
                    {selectedSession.status === 'NO_SHOW' && 'No Show'}
                  </span>
                </div>
              </div>
              
              {/* Note */}
              {selectedSession.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{selectedSession.notes}</p>
                </div>
              )}
            </div>
            
            {/* Azioni */}
            <div className="mt-6 flex space-x-3">
              {selectedSession.status === 'SCHEDULED' && (
                <>
                  <button
                    onClick={() => navigate(`/therapy-sessions/${selectedSession.id}/edit`)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica
                  </button>
                  <button
                    onClick={() => handleCompleteSession(selectedSession.id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completa
                  </button>
                  <button
                    onClick={() => handleCancelSession(selectedSession.id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Annulla
                  </button>
                </>
              )}
              {selectedSession.status !== 'SCHEDULED' && (
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Chiudi
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyCalendar;
