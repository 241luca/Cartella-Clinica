import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  FileText,
  ClipboardList,
  Home,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Stethoscope,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    },
    {
      name: 'Pazienti',
      path: '/patients',
      icon: Users,
    },
    {
      name: 'Cartelle Cliniche',
      path: '/clinical-records',
      icon: FileText,
    },
    {
      name: 'Terapie',
      path: '/therapies',
      icon: Activity,
    },
    {
      name: 'Calendario',
      path: '/calendar',
      icon: Calendar,
    },
    {
      name: 'Report',
      path: '/reports',
      icon: ClipboardList,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-800">
            <Stethoscope className="w-8 h-8 text-blue-400" />
            <span className="ml-3 text-xl font-bold text-white">
              Medicina Ravenna
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const isCurrentPath = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isCurrentPath
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6 transition-colors
                      ${isCurrentPath ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}
                    `}
                  />
                  <span className="flex-1 text-left">{item.name}</span>

                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {currentUser.nome || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">
                  {currentUser.email || 'admin@medicinaravenna.it'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Mobile logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-800">
              <Stethoscope className="w-8 h-8 text-blue-400" />
              <span className="ml-3 text-xl font-bold text-white">
                Medicina Ravenna
              </span>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => {
                const isCurrentPath = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors
                      ${isCurrentPath
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-4 flex-shrink-0 h-6 w-6 transition-colors
                        ${isCurrentPath ? 'text-blue-400' : 'text-gray-400'}
                      `}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 w-14" />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Search bar */}
              <div className="flex-1 flex">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Cerca
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Cerca pazienti, cartelle..."
                      type="search"
                    />
                  </div>
                </div>
              </div>

              {/* Right side buttons */}
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

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {currentUser.nome ? currentUser.nome[0].toUpperCase() : 'A'}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
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
                        onClick={handleLogout}
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

        {/* Main content area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
