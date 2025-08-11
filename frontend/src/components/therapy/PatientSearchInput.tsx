import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, Loader2, Calendar, FileText } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
}

interface ClinicalRecord {
  id: string;
  recordNumber: string;
  diagnosis: string;
  status: string;
  acceptanceDate: string;
}

interface PatientSearchInputProps {
  onPatientSelect: (patient: Patient | null) => void;
  onRecordSelect: (record: ClinicalRecord | null) => void;
  selectedPatient?: Patient | null;
  selectedRecord?: ClinicalRecord | null;
}

export const PatientSearchInput: React.FC<PatientSearchInputProps> = ({
  onPatientSelect,
  onRecordSelect,
  selectedPatient: initialPatient,
  selectedRecord: initialRecord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showRecordDropdown, setShowRecordDropdown] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient || null);
  const [selectedRecord, setSelectedRecord] = useState<ClinicalRecord | null>(initialRecord || null);
  
  const searchTimeout = useRef<NodeJS.Timeout>();
  const patientDropdownRef = useRef<HTMLDivElement>(null);
  const recordDropdownRef = useRef<HTMLDivElement>(null);

  // Cerca pazienti mentre l'utente digita
  useEffect(() => {
    if (searchQuery.length >= 2) {
      // Cancella il timeout precedente
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Imposta un nuovo timeout per evitare troppe chiamate
      searchTimeout.current = setTimeout(() => {
        searchPatients();
      }, 300);
    } else {
      setPatients([]);
      setShowPatientDropdown(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(event.target as Node)) {
        setShowPatientDropdown(false);
      }
      if (recordDropdownRef.current && !recordDropdownRef.current.contains(event.target as Node)) {
        setShowRecordDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPatients = async () => {
    setIsSearching(true);
    try {
      // Usa il metodo getAll con query di ricerca
      const response = await patientService.getAll({ search: searchQuery });
      const patientsData = response.data?.data || response.data || [];
      
      // NON filtrare ulteriormente - il backend dovrebbe già filtrare correttamente
      // Limitiamo solo il numero di risultati visualizzati
      setPatients(patientsData.slice(0, 10));
      setShowPatientDropdown(true);
    } catch (error) {
      console.error('Errore ricerca pazienti:', error);
      setPatients([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient);
    setSearchQuery('');
    setShowPatientDropdown(false);
    
    // Carica automaticamente le cartelle cliniche del paziente
    setLoadingRecords(true);
    try {
      const response = await clinicalRecordService.getByPatient(patient.id);
      
      // Gestisci diversi formati di risposta
      let records = [];
      if (response.data?.success && response.data?.data) {
        records = response.data.data;
      } else if (Array.isArray(response.data)) {
        records = response.data;
      } else if (response.data) {
        records = response.data;
      }
      
      // Filtra solo le cartelle aperte (isActive o status === 'OPEN')
      const openRecords = records.filter((r: any) => 
        r.isActive === true || r.status === 'OPEN' || r.status === 'open'
      );
      
      setClinicalRecords(openRecords);
      
      // Se c'è solo una cartella aperta, selezionala automaticamente
      if (openRecords.length === 1) {
        setSelectedRecord(openRecords[0]);
        onRecordSelect(openRecords[0]);
      } else if (openRecords.length > 1) {
        setShowRecordDropdown(true);
      } else if (openRecords.length === 0 && records.length > 0) {
        // Se ci sono cartelle ma nessuna aperta, mostra comunque
        setClinicalRecords(records);
      }
    } catch (error) {
      console.error('Errore caricamento cartelle:', error);
      setClinicalRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleRecordSelect = (record: ClinicalRecord) => {
    setSelectedRecord(record);
    onRecordSelect(record);
    setShowRecordDropdown(false);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setSelectedRecord(null);
    onPatientSelect(null);
    setClinicalRecords([]);
    onRecordSelect(null);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-4">
      {/* Ricerca Paziente */}
      <div className="relative" ref={patientDropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paziente *
        </label>
        
        {!selectedPatient ? (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, cognome o codice fiscale..."
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {selectedPatient.lastName} {selectedPatient.firstName}
                </p>
                <p className="text-sm text-gray-600">
                  CF: {selectedPatient.fiscalCode} • {calculateAge(selectedPatient.birthDate)} anni
                </p>
              </div>
            </div>
            <button
              onClick={clearPatient}
              className="p-1 hover:bg-blue-100 rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Dropdown risultati pazienti */}
        {showPatientDropdown && patients.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handlePatientSelect(patient)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.lastName} {patient.firstName}
                    </p>
                    <p className="text-sm text-gray-600">
                      CF: {patient.fiscalCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {calculateAge(patient.birthDate)} anni
                    </p>
                    <p className="text-xs text-gray-400">
                      Nato il {format(new Date(patient.birthDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showPatientDropdown && patients.length === 0 && !isSearching && searchQuery.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-gray-500 text-center">Nessun paziente trovato</p>
          </div>
        )}
      </div>

      {/* Selezione Cartella Clinica */}
      {selectedPatient && (
        <div className="relative" ref={recordDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cartella Clinica *
          </label>
          
          {loadingRecords ? (
            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">Caricamento cartelle...</span>
            </div>
          ) : clinicalRecords.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Nessuna cartella clinica aperta per questo paziente.
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                È necessario creare prima una cartella clinica.
              </p>
            </div>
          ) : selectedRecord ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Cartella #{selectedRecord.recordNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedRecord.diagnosis}
                  </p>
                </div>
              </div>
              {clinicalRecords.length > 1 && (
                <button
                  onClick={() => setShowRecordDropdown(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Cambia
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowRecordDropdown(true)}
              className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-gray-500">Seleziona una cartella clinica...</span>
            </button>
          )}

          {/* Dropdown cartelle cliniche */}
          {showRecordDropdown && clinicalRecords.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {clinicalRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => handleRecordSelect(record)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Cartella #{record.recordNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.diagnosis}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.isActive === true || record.status === 'OPEN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.isActive === true || record.status === 'OPEN' ? 'Aperta' : 'Chiusa'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Dal {format(new Date(record.acceptanceDate || record.createdAt), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearchInput;