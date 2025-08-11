import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalSearchBar from '../common/GlobalSearchBar';
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Calendar,
  ClipboardList,
  LogOut,
  Menu,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pazienti', path: '/patients', icon: Users },
    { name: 'Cartelle Cliniche', path: '/clinical-records', icon: FileText },
    { name: 'Terapie', path: '/therapies', icon: Activity },
    { name: 'Calendario', path: '/calendar', icon: Calendar },
    { name: 'Report', path: '/reports', icon: ClipboardList },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className={`font-semibold text-gray-800 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Medicina Ravenna
          </h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm transition-colors relative
                  ${active 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600"></div>
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-700">
                {currentUser.nome?.charAt(0) || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Utente</p>
                  <p className="text-xs text-gray-500">{currentUser.email || 'admin@medicinaravenna.it'}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center justify-center px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Search bar */}
              <div className="flex-1 flex">
                <div className="w-full max-w-2xl">
                  <GlobalSearchBar />
                </div>
              </div>

              {/* Right side icons */}
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>

                {/* Help */}
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-6 w-6" />
                </button>

                {/* Settings */}
                <button 
                  className="p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-6 w-6" />
                </button>

                {/* User menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      {currentUser.nome ? currentUser.nome[0].toUpperCase() : 'A'}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Il tuo profilo
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Impostazioni
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
