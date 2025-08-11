import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Calendar,
  ClipboardList,
  LogOut,
  Menu,
} from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
