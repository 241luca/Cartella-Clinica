import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  FileText, 
  Activity, 
  Calendar,
  Loader2,
  Command
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { clinicalRecordService } from '../../services/clinicalRecordService';
import { therapyService } from '../../services/therapyService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface SearchResult {
  id: string;
  type: 'patient' | 'record' | 'therapy';
  title: string;
  subtitle: string;
  meta?: string;
  url: string;
}

export const GlobalSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchTimeout = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Aggiungi shortcut Cmd+K o Ctrl+K
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  // Cerca mentre l'utente digita
  useEffect(() => {
    if (searchQuery.length >= 2) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestione keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowDropdown(false);
          setSelectedIndex(-1);
          break;
      }
    };

    if (showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDropdown, results, selectedIndex]);

  const performSearch = async () => {
    setIsSearching(true);
    const searchResults: SearchResult[] = [];

    try {
      // Cerca pazienti
      const patientsResponse = await patientService.search(searchQuery);
      const patients = patientsResponse?.data?.data || patientsResponse?.data || [];
      
      patients.slice(0, 5).forEach((patient: any) => {
        // Formatta la data di nascita
        const birthDate = patient.birthDate ? 
          format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: it }) : 
          '';
        
        // Calcola l'età
        const age = patient.birthDate ? calculateAge(patient.birthDate) : null;
        
        searchResults.push({
          id: patient.id,
          type: 'patient',
          title: `${patient.lastName} ${patient.firstName}`,
          subtitle: birthDate ? 
            `Nato/a il ${birthDate}${age !== null ? ` (${age} anni)` : ''}` : 
            'Data di nascita non disponibile',
          meta: `CF: ${patient.fiscalCode} • ${patient.city || 'Città non specificata'}`,
          url: `/patients/${patient.id}`
        });
      });

      // Cerca cartelle cliniche
      try {
        const recordsResponse = await clinicalRecordService.getAll({ 
          search: searchQuery, 
          limit: 5 
        });
        const records = recordsResponse?.data?.data || recordsResponse?.data || [];
        
        records.forEach((record: any) => {
          const patient = record.patient;
          const patientName = patient ? 
            `${patient.lastName} ${patient.firstName}` : 
            'Paziente sconosciuto';
          
          // Formatta la data di nascita se disponibile
          const birthDate = patient?.birthDate ? 
            format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: it }) : 
            '';
          
          searchResults.push({
            id: record.id,
            type: 'record',
            title: `Cartella #${record.recordNumber}`,
            subtitle: record.diagnosis,
            meta: birthDate ? `${patientName} • ${birthDate}` : patientName,
            url: `/clinical-records/${record.id}`
          });
        });
      } catch (error) {
        console.error('Errore ricerca cartelle:', error);
      }

      // Cerca terapie
      try {
        const therapiesResponse = await therapyService.getAll({ 
          search: searchQuery, 
          limit: 5 
        });
        const therapies = therapiesResponse?.data?.data || therapiesResponse?.data || [];
        
        therapies.forEach((therapy: any) => {
          const patientName = therapy.clinicalRecord?.patient ? 
            `${therapy.clinicalRecord.patient.lastName} ${therapy.clinicalRecord.patient.firstName}` : 
            'Paziente sconosciuto';
          
          searchResults.push({
            id: therapy.id,
            type: 'therapy',
            title: therapy.therapyType?.name || 'Terapia',
            subtitle: `${therapy.completedSessions}/${therapy.prescribedSessions} sedute`,
            meta: patientName,
            url: `/therapies/${therapy.id}`
          });
        });
      } catch (error) {
        console.error('Errore ricerca terapie:', error);
      }

      setResults(searchResults);
      setShowDropdown(searchResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setSearchQuery('');
    setShowDropdown(false);
    setSelectedIndex(-1);
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient':
        return <User className="w-4 h-4" />;
      case 'record':
        return <FileText className="w-4 h-4" />;
      case 'therapy':
        return <Activity className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'patient':
        return 'Paziente';
      case 'record':
        return 'Cartella';
      case 'therapy':
        return 'Terapia';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca pazienti, cartelle cliniche, terapie..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {/* Shortcut hint */}
        <div className="absolute right-3 top-2.5 flex items-center space-x-1 text-gray-400">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center space-x-1 text-xs">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown risultati */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">
              {results.length} risultati trovati
            </div>
            
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                  index === selectedIndex
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    index === selectedIndex
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                        result.type === 'patient' ? 'bg-blue-100 text-blue-700' :
                        result.type === 'record' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {result.subtitle}
                    </p>
                    {result.meta && (
                      <p className="text-xs text-gray-500 mt-1">
                        {result.meta}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nessun risultato */}
      {showDropdown && results.length === 0 && !isSearching && searchQuery.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-8">
          <div className="text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nessun risultato trovato per "{searchQuery}"</p>
            <p className="text-sm text-gray-400 mt-1">Prova con altri termini di ricerca</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;