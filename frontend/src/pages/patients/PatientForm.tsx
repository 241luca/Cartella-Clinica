import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import {
  Save,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface PatientFormData {
  fiscalCode: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  mobile: string;
  email: string;
  occupation: string;
  generalPractitioner: string;
  prescribingDoctor: string;
  notes: string;
  privacyConsent: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
}

const PatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    fiscalCode: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: 'MALE',
    address: '',
    city: '',
    province: 'RA',
    postalCode: '',
    phone: '',
    mobile: '',
    email: '',
    occupation: '',
    generalPractitioner: '',
    prescribingDoctor: '',
    notes: '',
    privacyConsent: false,
    dataProcessingConsent: false,
    marketingConsent: false,
  });

  const [errors, setErrors] = useState<Partial<PatientFormData>>({});

  useEffect(() => {
    if (isEditMode) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patients/${id}`);
      if (response.data.success) {
        const patient = response.data.data;
        setFormData({
          ...patient,
          birthDate: format(new Date(patient.birthDate), 'yyyy-MM-dd'),
        });
      }
    } catch (error) {
      toast.error('Errore nel caricamento del paziente');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    // Validazione Codice Fiscale
    if (!formData.fiscalCode) {
      newErrors.fiscalCode = 'Codice fiscale obbligatorio';
    } else if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(formData.fiscalCode)) {
      newErrors.fiscalCode = 'Codice fiscale non valido';
    }

    // Campi obbligatori
    if (!formData.firstName) newErrors.firstName = 'Nome obbligatorio';
    if (!formData.lastName) newErrors.lastName = 'Cognome obbligatorio';
    if (!formData.birthDate) newErrors.birthDate = 'Data di nascita obbligatoria';
    if (!formData.birthPlace) newErrors.birthPlace = 'Luogo di nascita obbligatorio';
    if (!formData.address) newErrors.address = 'Indirizzo obbligatorio';
    if (!formData.city) newErrors.city = 'Città obbligatoria';
    if (!formData.postalCode) newErrors.postalCode = 'CAP obbligatorio';

    // Validazione email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    // Validazione telefono
    if (formData.mobile && !/^[0-9+\s-]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Numero di telefono non valido';
    }

    // Consensi obbligatori
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Il consenso privacy è obbligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Correggi gli errori nel form');
      return;
    }

    try {
      setSaving(true);
      
      const dataToSend = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
      };

      if (isEditMode) {
        await api.put(`/patients/${id}`, dataToSend);
        toast.success('Paziente aggiornato con successo');
      } else {
        await api.post('/patients', dataToSend);
        toast.success('Paziente creato con successo');
      }
      
      navigate('/patients');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Rimuovi errore quando l'utente modifica il campo
    if (errors[name as keyof PatientFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Modifica Paziente' : 'Nuovo Paziente'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode 
              ? 'Modifica i dati del paziente esistente' 
              : 'Inserisci i dati per registrare un nuovo paziente'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dati Anagrafici */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Dati Anagrafici</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Codice Fiscale *
                </label>
                <input
                  type="text"
                  name="fiscalCode"
                  value={formData.fiscalCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fiscalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="RSSMRA85M01H501Z"
                  maxLength={16}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.fiscalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.fiscalCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genere *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MALE">Maschio</option>
                  <option value="FEMALE">Femmina</option>
                  <option value="OTHER">Altro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cognome *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data di Nascita *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Luogo di Nascita *
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthPlace && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthPlace}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professione
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Indirizzo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Indirizzo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Città *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CAP *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={5}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contatti */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Contatti</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cellulare
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informazioni Mediche */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Informazioni Mediche</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medico Curante
                </label>
                <input
                  type="text"
                  name="generalPractitioner"
                  value={formData.generalPractitioner}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medico Prescrittore
                </label>
                <input
                  type="text"
                  name="prescribingDoctor"
                  value={formData.prescribingDoctor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Consensi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Consensi e Privacy</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consenso Privacy *
                  </label>
                  <p className="text-xs text-gray-500">
                    Il paziente acconsente al trattamento dei dati personali secondo la normativa GDPR
                  </p>
                  {errors.privacyConsent && (
                    <p className="text-red-500 text-xs mt-1">{errors.privacyConsent}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="dataProcessingConsent"
                  checked={formData.dataProcessingConsent}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consenso Trattamento Dati
                  </label>
                  <p className="text-xs text-gray-500">
                    Il paziente acconsente al trattamento dei dati per finalità sanitarie
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Consenso Marketing
                  </label>
                  <p className="text-xs text-gray-500">
                    Il paziente acconsente a ricevere comunicazioni promozionali
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvataggio...' : (isEditMode ? 'Aggiorna' : 'Salva')}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AppLayout>
  );
};

export default PatientForm;
