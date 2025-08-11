// Tipi base per l'applicazione

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: 'admin' | 'medico' | 'terapista' | 'receptionist';
  token?: string;
}

export interface Patient {
  id: number;
  nome: string;
  cognome: string;
  dataNascita: string;
  luogoNascita?: string;
  codiceFiscale: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  telefono?: string;
  cellulare?: string;
  email?: string;
  medicoCurante?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalRecord {
  id: number;
  pazienteId: number;
  dataApertura: string;
  dataChiusura?: string;
  stato: 'aperta' | 'chiusa';
  diagnosi?: string;
  medicoPrescrittore?: string;
  sintomatologia?: string;
  esameObiettivo?: string;
  indaginiStrumentali?: string;
  dataIntervento?: string;
  medicoResponsabile?: string;
  note?: string;
  paziente?: Patient;
  terapie?: Therapy[];
  controlliClinici?: ClinicalCheck[];
}

export interface Therapy {
  id: number;
  cartellaId: number;
  tipo: string;
  descrizione?: string;
  parametri?: any;
  numeroSedute: number;
  seduteCompletate: number;
  dataInizio: string;
  dataFine?: string;
  stato: 'attiva' | 'completata' | 'sospesa';
  note?: string;
  sedute?: TherapySession[];
}

export interface TherapySession {
  id: number;
  terapiaId: number;
  data: string;
  numeroSeduta: number;
  variazioni?: string;
  noteDuranteTerapia?: string;
  firmaOperatore?: string;
  firmaPaziente?: string;
  vasIniziale?: number;
  vasFinale?: number;
  completata: boolean;
}

export interface ClinicalCheck {
  id: number;
  cartellaId: number;
  data: string;
  descrizione: string;
  medicoResponsabile?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any;
}
