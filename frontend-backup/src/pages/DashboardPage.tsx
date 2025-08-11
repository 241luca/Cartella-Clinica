import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Medicina Ravenna - Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Benvenuto, {user?.nome} {user?.cognome}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Pazienti */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Pazienti</h2>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-sm text-gray-500">Totale registrati</p>
              </div>
            </div>
          </div>

          {/* Card Cartelle Cliniche */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Cartelle Cliniche</h2>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-sm text-gray-500">Cartelle attive</p>
              </div>
            </div>
          </div>

          {/* Card Appuntamenti */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Appuntamenti</h2>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-sm text-gray-500">Oggi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sezione azioni rapide */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Azioni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left">
              <h3 className="font-medium text-gray-900">Nuovo Paziente</h3>
              <p className="text-sm text-gray-500 mt-1">Registra un nuovo paziente</p>
            </button>
            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left">
              <h3 className="font-medium text-gray-900">Nuova Cartella</h3>
              <p className="text-sm text-gray-500 mt-1">Crea una nuova cartella clinica</p>
            </button>
            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left">
              <h3 className="font-medium text-gray-900">Pianifica Terapia</h3>
              <p className="text-sm text-gray-500 mt-1">Imposta una nuova terapia</p>
            </button>
            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left">
              <h3 className="font-medium text-gray-900">Report</h3>
              <p className="text-sm text-gray-500 mt-1">Visualizza statistiche</p>
            </button>
          </div>
        </div>

        {/* Info sistema */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Sistema in sviluppo:</strong> Questa è una versione di test. 
            Ruolo utente: {user?.ruolo}
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
