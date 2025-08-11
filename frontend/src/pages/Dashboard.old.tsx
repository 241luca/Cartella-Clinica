import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
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
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">Caricamento...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Benvenuto nel sistema di gestione cartelle cliniche</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {/* Pazienti Totali */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/patients')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Pazienti Totali</p>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalPatients || 0}</p>
          </div>

          {/* Pazienti Attivi */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/patients')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Pazienti Attivi</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.activePatients || 0}</p>
          </div>

          {/* Cartelle Aperte */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/clinical-records')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Cartelle Aperte</p>
              <FileText className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.openRecords || 0}</p>
          </div>

          {/* Terapie in Corso */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/therapies')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Terapie in Corso</p>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeTherapies || 0}</p>
          </div>

          {/* Sedute Oggi */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/calendar')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Sedute Oggi</p>
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.todaySessions || 0}</p>
          </div>

          {/* Appuntamenti Settimana */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/calendar')}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-gray-600">Appuntamenti Settimana</p>
              <Clock className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.weekSessions || 0}</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sedute di Oggi */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Sedute di Oggi</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              {todaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nessuna seduta programmata</p>
                  <button 
                    onClick={() => navigate('/calendar')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Vai al calendario →
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {todaySessions.slice(0, 5).map((session, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/patients/${session.patientId}`)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{session.patientName}</p>
                          <p className="text-sm text-gray-500">{session.therapyType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{session.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate('/calendar')}
                    className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Vedi tutte →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Statistiche Rapide */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Statistiche del Mese</h2>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nuovi pazienti</span>
                  <span className="font-semibold text-gray-900">+12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sedute completate</span>
                  <span className="font-semibold text-gray-900">145</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Terapie iniziate</span>
                  <span className="font-semibold text-gray-900">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasso completamento</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo medio seduta</span>
                  <span className="font-semibold text-gray-900">35 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avvisi e Promemoria */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Promemoria</h2>
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(stats?.openRecords || 0) > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">Cartelle da completare</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Hai {stats?.openRecords} cartelle cliniche aperte
                        </p>
                        <button 
                          onClick={() => navigate('/clinical-records')}
                          className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-900"
                        >
                          Gestisci →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Prossimi appuntamenti</p>
                      <p className="text-sm text-blue-700 mt-1">
                        {stats?.weekSessions || 0} appuntamenti questa settimana
                      </p>
                      <button 
                        onClick={() => navigate('/calendar')}
                        className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        Visualizza →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
