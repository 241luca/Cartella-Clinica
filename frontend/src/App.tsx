import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load dei componenti per debugging
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PatientList = React.lazy(() => import('./pages/patients/PatientList'));
const PatientForm = React.lazy(() => import('./pages/patients/PatientForm'));
const PatientDetail = React.lazy(() => import('./pages/patients/PatientDetail'));
const ClinicalRecordList = React.lazy(() => import('./pages/clinical-records/ClinicalRecordList'));
const ClinicalRecordForm = React.lazy(() => import('./pages/clinical-records/ClinicalRecordForm'));
const ClinicalRecordDetail = React.lazy(() => import('./pages/clinical-records/ClinicalRecordDetail'));
const TherapyForm = React.lazy(() => import('./pages/therapies/TherapyForm'));
const TherapyList = React.lazy(() => import('./pages/therapies/TherapyList'));
const CalendarPage = React.lazy(() => import('./pages/calendar/CalendarPage'));
const TherapyCalendar = React.lazy(() => import('./pages/therapies/TherapyCalendar'));
const ReportCenter = React.lazy(() => import('./pages/reports/ReportCenter'));
const DocumentUpload = React.lazy(() => import('./pages/documents/DocumentUpload'));
const NewTherapyWizard = React.lazy(() => import('./components/therapy/NewTherapyWizard'));
const MainLayout = React.lazy(() => import('./components/layout/MainLayout'));

// Componente di fallback durante il caricamento
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Caricamento...</p>
    </div>
  </div>
);

// Error Boundary per catturare errori React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Si è verificato un errore
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Errore sconosciuto'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
          
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Route pubbliche */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Route protette con MainLayout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Pazienti */}
                  <Route path="/patients" element={<PatientList />} />
                  <Route path="/patients/new" element={<PatientForm />} />
                  <Route path="/patients/:id" element={<PatientDetail />} />
                  <Route path="/patients/:id/edit" element={<PatientForm />} />
                  
                  {/* Cartelle Cliniche */}
                  <Route path="/clinical-records" element={<ClinicalRecordList />} />
                  <Route path="/clinical-records/new" element={<ClinicalRecordForm />} />
                  <Route path="/clinical-records/:id" element={<ClinicalRecordDetail />} />
                  <Route path="/clinical-records/:id/edit" element={<ClinicalRecordForm />} />
                  <Route path="/clinical-records/:id/therapies/new" element={<TherapyForm />} />
                  
                  {/* Terapie */}
                  <Route path="/therapies" element={<TherapyList />} />
                  <Route path="/therapies/new" element={<TherapyForm />} />
                  <Route path="/therapies/:id/edit" element={<TherapyForm />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  
                  {/* Nuovo Wizard Terapie */}
                  <Route path="/patients/:patientId/therapies/new" element={<NewTherapyWizard />} />
                  <Route path="/patients/:patientId/records/:clinicalRecordId/therapies/new" element={<NewTherapyWizard />} />
                  
                  {/* Reports */}
                  <Route path="/reports" element={<ReportCenter />} />
                  
                  {/* Documents */}
                  <Route path="/clinical-records/:recordId/documents" element={<DocumentUpload />} />
                </Route>
              </Route>
              
              {/* Redirect dalla root */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Pagina non trovata</p>
                    <a 
                      href="/login" 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Torna al Login
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
