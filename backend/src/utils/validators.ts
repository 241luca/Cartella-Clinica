/**
 * Utility functions per validazioni e calcoli
 */

/**
 * Calcola l'età data una data di nascita
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Valida un codice fiscale italiano
 */
export function validateItalianFiscalCode(cf: string): boolean {
  // Rimuovi spazi e converti in maiuscolo
  cf = cf.replace(/\s/g, '').toUpperCase();
  
  // Verifica lunghezza
  if (cf.length !== 16) {
    return false;
  }
  
  // Pattern base del codice fiscale
  const pattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  if (!pattern.test(cf)) {
    return false;
  }
  
  // Tabelle per il calcolo del carattere di controllo
  const setDispari: { [key: string]: number } = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13,
    '6': 15, '7': 17, '8': 19, '9': 21, 'A': 1, 'B': 0,
    'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17,
    'I': 19, 'J': 21, 'K': 2, 'L': 4, 'M': 18, 'N': 20,
    'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };
  
  const setPari: { [key: string]: number } = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9, 'A': 0, 'B': 1,
    'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7,
    'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13,
    'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  };
  
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const c = cf[i];
    if (i % 2 === 0) {
      sum += setDispari[c] || 0;
    } else {
      sum += setPari[c] || 0;
    }
  }
  
  const expectedCheck = String.fromCharCode(65 + (sum % 26));
  return cf[15] === expectedCheck;
}

/**
 * Valida un indirizzo email
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Valida un numero di telefono italiano
 */
export function validatePhoneNumber(phone: string): boolean {
  // Rimuovi spazi, trattini e altri caratteri
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Pattern per numeri italiani (fissi e cellulari)
  const patterns = [
    /^(\+39)?3\d{8,9}$/,  // Cellulari
    /^(\+39)?0\d{8,10}$/  // Fissi
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Formatta una data in formato italiano
 */
export function formatDateItalian(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatta data e ora in formato italiano
 */
export function formatDateTimeItalian(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Genera un codice univoco per documenti/cartelle
 */
export function generateUniqueCode(prefix: string = 'DOC'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Calcola il BMI (Body Mass Index)
 */
export function calculateBMI(weight: number, height: number): number {
  // height in cm, weight in kg
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * Classifica il BMI
 */
export function classifyBMI(bmi: number): string {
  if (bmi < 16) return 'Grave magrezza';
  if (bmi < 18.5) return 'Sottopeso';
  if (bmi < 25) return 'Normopeso';
  if (bmi < 30) return 'Sovrappeso';
  if (bmi < 35) return 'Obesità classe I';
  if (bmi < 40) return 'Obesità classe II';
  return 'Obesità classe III';
}

/**
 * Valida la pressione sanguigna
 */
export function validateBloodPressure(systolic: number, diastolic: number): {
  valid: boolean;
  classification: string;
} {
  if (systolic < 50 || systolic > 250 || diastolic < 30 || diastolic > 150) {
    return { valid: false, classification: 'Valori non validi' };
  }
  
  if (systolic < 120 && diastolic < 80) {
    return { valid: true, classification: 'Normale' };
  }
  if (systolic < 130 && diastolic < 80) {
    return { valid: true, classification: 'Elevata' };
  }
  if (systolic < 140 || diastolic < 90) {
    return { valid: true, classification: 'Ipertensione stadio 1' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { valid: true, classification: 'Ipertensione stadio 2' };
  }
  
  return { valid: true, classification: 'Da valutare' };
}

/**
 * Valida la scala VAS (0-10)
 */
export function validateVASScore(score: number): boolean {
  return score >= 0 && score <= 10;
}

/**
 * Calcola il punteggio funzionale (come da documento)
 */
export function calculateFunctionalScore(improvement: number): number {
  // improvement in percentuale
  if (improvement === 0) return 0;
  if (improvement <= 10) return 1;
  if (improvement <= 20) return 2;
  if (improvement <= 30) return 3;
  if (improvement <= 40) return 4;
  if (improvement <= 50) return 5;
  if (improvement <= 60) return 6;
  if (improvement <= 70) return 7;
  if (improvement <= 80) return 8;
  if (improvement <= 90) return 9;
  if (improvement <= 100) return 10;
  return 10;
}

/**
 * Calcola il punteggio globale finale (VAS + Funzionale)
 */
export function calculateGlobalScore(vasScore: number, functionalScore: number): {
  score: number;
  classification: string;
} {
  const total = vasScore + functionalScore;
  
  let classification = '';
  if (total >= 0 && total <= 4) classification = 'NULLO';
  else if (total <= 8) classification = 'SCARSO';
  else if (total <= 12) classification = 'SUFFICIENTE';
  else if (total <= 16) classification = 'BUONO';
  else if (total <= 20) classification = 'OTTIMO';
  
  return { score: total, classification };
}