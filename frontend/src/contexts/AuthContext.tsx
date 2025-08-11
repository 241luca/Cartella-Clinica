import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è un utente salvato al caricamento
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Prima prova a usare l'utente salvato localmente
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
          
          // Poi verifica che il token sia ancora valido con il backend
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            // Aggiorna anche il localStorage con i dati più recenti
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            console.error('Token non valido, pulisco la sessione');
            // Token non valido, pulisci tutto
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Errore controllo autenticazione:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Usa il servizio API reale
      const response = await authService.login(email, password);
      setUser(response.user);
      toast.success('Login effettuato con successo!');
    } catch (error: any) {
      console.error('Errore login:', error);
      
      // Gestisci diversi tipi di errore
      let message = 'Errore durante il login';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = 'Credenziali non valide';
      } else if (error.response?.status === 403) {
        message = 'Account non attivo';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Errore di connessione al server';
      }
      
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logout effettuato');
      // Il redirect al login è gestito dall'interceptor in api.ts
    } catch (error) {
      console.error('Errore durante logout:', error);
      // Anche se c'è un errore, pulisci lo stato locale
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
