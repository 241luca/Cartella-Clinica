import axios from 'axios';
import type { AuthResponse, User } from '../types';

// Configura l'istanza di Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token ad ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire gli errori di risposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se il token è scaduto (401) e non è già un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Se siamo sulla pagina di login, non fare nulla
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // Altrimenti, pulisci tutto e reindirizza al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Servizi di autenticazione
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', {
      email,
      password,
    });
    
    // Il backend restituisce { success: true, data: { token, user } }
    const { token, user } = response.data.data;
    
    // Salva token e user info nel localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Pulisci localStorage indipendentemente dal risultato
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await api.post<{ success: boolean; data: { token: string } }>('/auth/refresh', {
      refreshToken,
    });
    const { token } = response.data.data;
    localStorage.setItem('token', token);
    return token;
  }
};

// Servizi per i pazienti (per dopo)
export const patientService = {
  async getPatients(page = 1, limit = 10) {
    const response = await api.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPatient(id: number) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(data: any) {
    const response = await api.post('/patients', data);
    return response.data;
  },

  async updatePatient(id: number, data: any) {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  async deletePatient(id: number) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};

export default api;
