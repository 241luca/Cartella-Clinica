import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pazienti', path: '/patients' },
    { name: 'Cartelle', path: '/clinical-records' },
    { name: 'Terapie', path: '/therapies' },
    { name: 'Calendario', path: '/calendar' },
    { name: 'Report', path: '/reports' },
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
    <nav className="bg-white border-b border-slate-200">
      <div className="px-3">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-sm font-semibold text-slate-700 mr-6">
              Medicina Ravenna
            </h1>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded transition-all
                    ${isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
            >
              <span>{currentUser.nome || 'Admin'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg z-20">
                  <div className="py-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-700">
                        {currentUser.nome || 'Admin'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {currentUser.email || 'admin@medicinaravenna.it'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center space-x-1 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Esci</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
