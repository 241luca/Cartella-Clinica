import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  FileText,
  Activity,
  Calendar,
  Download,
  Filter,
  ChevronUp,
  ChevronDown,
  Euro,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ChartData {
  labels: string[];
  values: number[];
}

const ReportCenter: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 15420,
    totalPatients: 156,
    totalSessions: 432,
    averageSessionTime: 45,
    completionRate: 92,
    newPatients: 23,
    revenueGrowth: 8.5,
    sessionsGrowth: 12.3,
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    // Simula caricamento dati
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleExport = (type: string) => {
    toast.success(`Esportazione ${type} in corso...`);
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
            <p className="mt-4 text-gray-500 text-sm font-medium">Caricamento report...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mock data per i grafici
  const therapyData = {
    labels: ['Fisioterapia', 'Laserterapia', 'Tecarterapia', 'Ultrasuoni', 'Altro'],
    values: [145, 89, 76, 65, 57],
  };

  const monthlyRevenue = {
    labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
    values: [12500, 13200, 14100, 13800, 15200, 15420],
  };

  const patientAge = {
    labels: ['18-30', '31-45', '46-60', '61-75', '75+'],
    values: [15, 28, 35, 32, 12],
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Report e Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">
                Analisi dettagliate delle performance della clinica
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="week">Ultima Settimana</option>
                <option value="month">Ultimo Mese</option>
                <option value="quarter">Ultimo Trimestre</option>
                <option value="year">Ultimo Anno</option>
              </select>
              <button
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Esporta Excel
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenueGrowth > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {Math.abs(stats.revenueGrowth)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Fatturato Totale</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString('it-IT')}</p>
              <p className="text-xs text-gray-400 mt-2">Ultimo mese</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600">
                  +{stats.newPatients} nuovi
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Pazienti Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              <p className="text-xs text-gray-400 mt-2">Attivi nel periodo</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stats.sessionsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.sessionsGrowth > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {Math.abs(stats.sessionsGrowth)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Sedute Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              <p className="text-xs text-gray-400 mt-2">Nel periodo selezionato</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Tasso Completamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              <p className="text-xs text-gray-400 mt-2">Terapie completate</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Andamento Fatturato</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyRevenue.labels.map((label, index) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                        style={{ height: `${(monthlyRevenue.values[index] / Math.max(...monthlyRevenue.values)) * 100}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                          €{(monthlyRevenue.values[index] / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Therapy Types Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tipologie Terapie</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    {(() => {
                      const total = therapyData.values.reduce((a, b) => a + b, 0);
                      let cumulativePercentage = 0;
                      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#6B7280'];
                      
                      return therapyData.values.map((value, index) => {
                        const percentage = (value / total) * 100;
                        const strokeDasharray = `${percentage * 3.14} ${314 - percentage * 3.14}`;
                        const strokeDashoffset = -(cumulativePercentage * 3.14);
                        cumulativePercentage += percentage;
                        
                        return (
                          <circle
                            key={index}
                            cx="96"
                            cy="96"
                            r="50"
                            stroke={colors[index]}
                            strokeWidth="32"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all hover:opacity-80"
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{therapyData.values.reduce((a, b) => a + b, 0)}</p>
                      <p className="text-xs text-gray-500">Totale</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {therapyData.labels.map((label, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-gray-500'];
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{label}</p>
                          <p className="text-xs text-gray-500">{therapyData.values[index]} sedute</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pazienti per Età */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Età Pazienti</h3>
              <div className="space-y-3">
                {patientAge.labels.map((label, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{label} anni</span>
                      <span className="text-sm font-medium text-gray-900">{patientAge.values[index]}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${patientAge.values[index]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Terapisti */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Terapisti</h3>
              <div className="space-y-3">
                {['Dott. Bianchi', 'Dott.ssa Rossi', 'Dott. Verdi', 'Dott.ssa Neri'].map((name, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-medium">
                        {name.split(' ')[1].charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500">{95 - index * 5} sedute</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">+{12 - index * 2}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiche Rapide */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metriche Chiave</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Tempo medio seduta</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.averageSessionTime} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Ricavo medio seduta</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">€35</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Pazienti/giorno</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Tasso occupazione</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportCenter;