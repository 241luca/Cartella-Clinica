import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  FileText,
  Clock,
  TrendingUp,
  ChevronRight,
  Plus,
  UserCheck,
  CalendarCheck,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  dashboardService,
  type DashboardStats,
  type TodaySession,
} from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, sessions] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodaySessions(),
      ]);

      setStats(statsData);
      setTodaySessions(sessions);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
    } finally {
      setLoading(false);
    }
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calcolo statistiche aggiuntive
  const completionRate = stats?.totalPatients ? Math.round((stats.activePatients / stats.totalPatients) * 100) : 0;
  const weeklyGrowth = 12; // Placeholder - da calcolare dal backend

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Benvenuto nel sistema di gestione cartelle cliniche
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/patients/new')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuovo Paziente
              </button>
              <button
                onClick={() => navigate('/clinical-records/new')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                <FileText className="w-4 h-4" />
                Nuova Cartella
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Calendar className="w-4 h-4" />
                Calendario
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {/* Pazienti Totali */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/patients')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Pazienti Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPatients || 0}</p>
              <div className="flex items-center mt-3 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+{weeklyGrowth}%</span>
                <span className="text-gray-400 ml-1">questa settimana</span>
              </div>
            </div>

            {/* Pazienti Attivi */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/patients?status=active')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Pazienti Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activePatients || 0}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Tasso attività</span>
                  <span className="text-gray-600 font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Cartelle Aperte */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/clinical-records')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Cartelle Aperte</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.openRecords || 0}</p>
              <div className="flex items-center mt-3 text-xs">
                <AlertTriangle className="w-3 h-3 text-amber-500 mr-1" />
                <span className="text-amber-600 font-medium">Da completare</span>
              </div>
            </div>

            {/* Terapie in Corso */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/therapies')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Terapie in Corso</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeTherapies || 0}</p>
              <div className="flex items-center mt-3 text-xs text-gray-400">
                <span>23 completate questo mese</span>
              </div>
            </div>

            {/* Sedute Oggi */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/calendar')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Sedute Oggi</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.todaySessions || 0}</p>
              <div className="flex items-center mt-3 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>Prossima alle 14:30</span>
              </div>
            </div>

            {/* Appuntamenti Settimana */}
            <div 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/calendar')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Questa Settimana</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.weekSessions || 0}</p>
              <div className="flex items-center mt-3 text-xs text-gray-400">
                <span>Appuntamenti totali</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Programma Giornaliero */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Programma di Oggi</h2>
                      <p className="text-xs text-gray-500">Lunedì, 11 Agosto 2025</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/calendar')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Vedi tutto
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {todaySessions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">Nessuna seduta programmata per oggi</p>
                    <button 
                      onClick={() => navigate('/calendar')}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Aggiungi appuntamento →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySessions.slice(0, 5).map((session, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/patients/${session.patientId}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{session.time.split(':')[0]}</p>
                            <p className="text-xs text-gray-400">{session.time.split(':')[1]}</p>
                          </div>
                          <div className="w-px h-10 bg-gray-200"></div>
                          <div>
                            <p className="font-medium text-gray-900">{session.patientName}</p>
                            <p className="text-sm text-gray-500">{session.therapyType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Confermato
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Riepilogo Attività */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Riepilogo Attività</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* Statistiche del mese */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Nuovi pazienti</span>
                      <span className="text-sm font-semibold text-gray-900">+12</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Sedute completate</span>
                      <span className="text-sm font-semibold text-gray-900">145</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Terapie iniziate</span>
                      <span className="text-sm font-semibold text-gray-900">23</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Tasso completamento</span>
                      <span className="text-lg font-bold text-green-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tempo medio seduta</span>
                      <span className="text-lg font-bold text-gray-900">35 min</span>
                    </div>
                  </div>
                </div>

                {/* Azioni rapide */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Azioni Rapide</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('/patients/new')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Nuovo Paziente
                    </button>
                    <button
                      onClick={() => navigate('/therapies/new')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Nuova Terapia
                    </button>
                    <button
                      onClick={() => navigate('/clinical-records/new')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Nuova Cartella
                    </button>
                    <button
                      onClick={() => navigate('/reports')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifiche e Alert */}
          {(stats?.openRecords || 0) > 0 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">
                    Attenzione: Cartelle cliniche da completare
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Hai {stats?.openRecords} cartelle cliniche aperte che richiedono la tua attenzione. 
                    È importante completarle per mantenere aggiornata la documentazione clinica.
                  </p>
                  <button
                    onClick={() => navigate('/clinical-records')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900"
                  >
                    Gestisci cartelle
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;