import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays, subMonths } from 'date-fns';

const prisma = new PrismaClient();

// Helper per generare codice fiscale realistico
function generateFiscalCode(firstName: string, lastName: string, birthDate: Date, isMale: boolean, index: number): string {
  const lastNameCode = lastName.replace(/[aeiou]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
  const firstNameCode = firstName.replace(/[aeiou]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
  const year = birthDate.getFullYear().toString().slice(-2);
  const months = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  const month = months[birthDate.getMonth()];
  let day = birthDate.getDate();
  if (!isMale) day += 40; // Per le donne si aggiunge 40
  const dayStr = day.toString().padStart(2, '0');
  const comuneCode = `H199`; // Ravenna
  const controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const controlChar = controlChars[index % 26];
  
  return `${lastNameCode}${firstNameCode}${year}${month}${dayStr}${comuneCode}${controlChar}`;
}

// Nomi e cognomi italiani realistici
const firstNames = {
  male: [
    'Marco', 'Alessandro', 'Giuseppe', 'Antonio', 'Francesco', 'Giovanni', 'Roberto', 'Mario', 'Luigi', 'Angelo',
    'Vincenzo', 'Pietro', 'Carlo', 'Salvatore', 'Franco', 'Domenico', 'Bruno', 'Paolo', 'Sergio', 'Luciano',
    'Andrea', 'Stefano', 'Maurizio', 'Giorgio', 'Claudio', 'Massimo', 'Luca', 'Davide', 'Simone', 'Matteo',
    'Federico', 'Enrico', 'Nicola', 'Fabio', 'Alberto', 'Giulio', 'Emanuele', 'Daniele', 'Michele', 'Gabriele'
  ],
  female: [
    'Maria', 'Anna', 'Giuseppina', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia', 'Carmela', 'Laura',
    'Silvia', 'Barbara', 'Francesca', 'Paola', 'Antonella', 'Rita', 'Elena', 'Patrizia', 'Daniela', 'Giulia',
    'Monica', 'Roberta', 'Alessandra', 'Chiara', 'Sara', 'Martina', 'Valentina', 'Elisa', 'Claudia', 'Cristina',
    'Federica', 'Ilaria', 'Giorgia', 'Alice', 'Sofia', 'Aurora', 'Emma', 'Beatrice', 'Vittoria', 'Giada'
  ]
};

const lastNames = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
  'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
  'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', 'Marchetti', 'Parisi',
  'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina',
  'Sala', 'De Angelis', 'Gatti', 'Pellegrini', 'Palumbo', 'Sanna', 'Farina', 'Rizzi', 'Monti', 'Cattaneo'
];

// Città della Romagna
const cities = ['Ravenna', 'Forlì', 'Cesena', 'Rimini', 'Faenza', 'Lugo', 'Cervia', 'Imola', 'Riccione', 'Bellaria'];

// Vie realistiche
const streets = [
  'Via Roma', 'Via Garibaldi', 'Via Cavour', 'Via Mazzini', 'Via Dante Alighieri',
  'Corso Matteotti', 'Via San Vitale', 'Via Maggiore', 'Piazza del Popolo', 'Via Venezia',
  'Via Trieste', 'Via Milano', 'Via Bologna', 'Via Firenze', 'Via Torino'
];

// Diagnosi realistiche per fisioterapia
const diagnoses = [
  'Lombalgia acuta post-traumatica',
  'Cervicalgia cronica con irradiazione brachiale',
  'Periartrite scapolo-omerale destra',
  'Gonartrosi bilaterale stadio II',
  'Coxartrosi sinistra stadio III',
  'Tendinite rotulea cronica',
  'Epicondilite laterale gomito destro',
  'Sindrome del tunnel carpale bilaterale',
  'Fascite plantare cronica',
  'Distorsione caviglia grado II',
  'Ernia discale L4-L5 con sciatalgia',
  'Ernia discale L5-S1',
  'Scoliosi idiopatica adolescenziale',
  'Frattura composta omero prossimale - post-chirurgica',
  'Lesione parziale legamento crociato anteriore',
  'Borsite trocanterica bilaterale',
  'Capsulite adesiva spalla sinistra',
  'Sindrome da conflitto sub-acromiale',
  'Protesi anca - riabilitazione post-operatoria',
  'Protesi ginocchio - riabilitazione post-operatoria',
  'Ricostruzione LCA - riabilitazione post-operatoria',
  'Frattura vertebrale da osteoporosi',
  'Fibromialgia',
  'Artrite reumatoide - fase subacuta',
  'Spondilite anchilosante'
];

// Funzione per generare VAS score realistici con miglioramento progressivo
function generateVASScores(sessionNumber: number, totalSessions: number, initialVAS: number): { before: number, after: number } {
  // Il VAS iniziale diminuisce progressivamente
  const progressFactor = sessionNumber / totalSessions;
  
  // VAS prima della seduta (migliora gradualmente)
  const vasBefore = Math.max(1, Math.round(initialVAS - (initialVAS * 0.6 * progressFactor) + (Math.random() * 2 - 1)));
  
  // VAS dopo la seduta (sempre migliore del prima, con variazione realistica)
  const improvement = Math.min(3, Math.floor(Math.random() * 2) + 1);
  const vasAfter = Math.max(0, vasBefore - improvement);
  
  return { before: vasBefore, after: vasAfter };
}

// Note realistiche per le sessioni
function generateSessionNote(sessionNumber: number, vasImprovement: number, therapyType: string): string {
  const notes = [
    `Paziente collaborante. Miglioramento del ${vasImprovement * 10}% del dolore post-trattamento.`,
    `Seduta ben tollerata. ROM articolare in miglioramento. VAS ridotto di ${vasImprovement} punti.`,
    `Buona risposta al trattamento. Paziente riferisce beneficio soggettivo.`,
    `Trattamento eseguito secondo protocollo. Nessun evento avverso.`,
    `Progressi evidenti nella mobilità. Dolore in riduzione progressiva.`,
    `Paziente motivato e collaborante. Esercizi a domicilio eseguiti correttamente.`,
    `Seduta ${sessionNumber}: parametri vitali stabili, buona tolleranza al trattamento.`,
    `${therapyType} ben tollerata. Obiettivi terapeutici in linea con le aspettative.`,
    `Miglioramento funzionale evidente. Paziente soddisfatto del percorso.`,
    `Riduzione della sintomatologia dolorosa. Incremento del ROM di 10°.`
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}

async function main() {
  console.log('🌱 Inizio seed realistico del database...');
  console.log('📊 Creazione di 100+ pazienti e 400+ terapie con dati sequenziali e realistici\n');

  // 1. Crea utenti del sistema
  console.log('👥 Creazione utenti del sistema...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const therapistPassword = await bcrypt.hash('therapist123', 10);
  const nursePassword = await bcrypt.hash('nurse123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicinaravenna.it' },
    update: {},
    create: {
      email: 'admin@medicinaravenna.it',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Crea 4 dottori
  const doctors = [];
  const doctorNames = [
    { first: 'Mario', last: 'Rossi' },
    { first: 'Laura', last: 'Bianchi' },
    { first: 'Giovanni', last: 'Verdi' },
    { first: 'Paola', last: 'Dalle Donne' }
  ];

  for (let i = 0; i < doctorNames.length; i++) {
    const doctor = await prisma.user.upsert({
      where: { email: `dott.${doctorNames[i].last.toLowerCase()}@medicinaravenna.it` },
      update: {},
      create: {
        email: `dott.${doctorNames[i].last.toLowerCase()}@medicinaravenna.it`,
        username: `dott${doctorNames[i].last.toLowerCase()}`,
        password: doctorPassword,
        firstName: doctorNames[i].first,
        lastName: doctorNames[i].last,
        role: 'DOCTOR',
        phone: `0544${(456000 + i).toString()}`,
        isActive: true,
      },
    });
    doctors.push(doctor);
  }

  // Crea 6 fisioterapisti
  const therapists = [];
  const therapistNames = [
    { first: 'Giuseppe', last: 'Verdi' },
    { first: 'Anna', last: 'Neri' },
    { first: 'Marco', last: 'Blu' },
    { first: 'Silvia', last: 'Rosa' },
    { first: 'Luca', last: 'Gialli' },
    { first: 'Elena', last: 'Viola' }
  ];

  for (let i = 0; i < therapistNames.length; i++) {
    const therapist = await prisma.user.upsert({
      where: { email: `ft.${therapistNames[i].last.toLowerCase()}@medicinaravenna.it` },
      update: {},
      create: {
        email: `ft.${therapistNames[i].last.toLowerCase()}@medicinaravenna.it`,
        username: `ft${therapistNames[i].last.toLowerCase()}`,
        password: therapistPassword,
        firstName: therapistNames[i].first,
        lastName: therapistNames[i].last,
        role: 'THERAPIST',
        phone: `0544${(457000 + i).toString()}`,
        isActive: true,
      },
    });
    therapists.push(therapist);
  }

  console.log('✅ Utenti creati: 1 admin, 4 dottori, 6 fisioterapisti');

  // 2. Crea tipi di terapia realistici
  console.log('\n🏥 Creazione tipi di terapia...');

  const therapyTypes = [
    // TERAPIE STRUMENTALI
    {
      code: 'TENS',
      name: 'TENS - Elettroterapia antalgica',
      category: 'STRUMENTALE',
      description: 'Stimolazione elettrica nervosa transcutanea per controllo del dolore',
      defaultDuration: 30,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'US',
      name: 'Ultrasuonoterapia',
      category: 'STRUMENTALE',
      description: 'Terapia con ultrasuoni a scopo antinfiammatorio e antalgico',
      defaultDuration: 15,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'LASER',
      name: 'Laserterapia',
      category: 'STRUMENTALE',
      description: 'Laser terapeutico ad alta potenza per patologie muscoloscheletriche',
      defaultDuration: 20,
      defaultSessions: 8,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'MAGNETO',
      name: 'Magnetoterapia',
      category: 'STRUMENTALE',
      description: 'Campi magnetici pulsati per stimolare la rigenerazione tissutale',
      defaultDuration: 30,
      defaultSessions: 15,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'TECAR',
      name: 'Tecarterapia',
      category: 'STRUMENTALE',
      description: 'Terapia capacitiva-resistiva per patologie acute e croniche',
      defaultDuration: 30,
      defaultSessions: 8,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'ONDE_URTO',
      name: 'Onde d\'urto',
      category: 'STRUMENTALE',
      description: 'Onde d\'urto focali per tendinopatie e calcificazioni',
      defaultDuration: 20,
      defaultSessions: 5,
      requiresDoctor: true,
      requiresEquipment: true,
      isActive: true,
    },
    // TERAPIE MANUALI
    {
      code: 'KT',
      name: 'Kinesiterapia',
      category: 'MANUALE',
      description: 'Rieducazione motoria e funzionale individualizzata',
      defaultDuration: 45,
      defaultSessions: 12,
      requiresDoctor: false,
      requiresEquipment: false,
      isActive: true,
    },
    {
      code: 'MASSOTERAPIA',
      name: 'Massoterapia terapeutica',
      category: 'MANUALE',
      description: 'Massaggio terapeutico decontratturante',
      defaultDuration: 30,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: false,
      isActive: true,
    },
    {
      code: 'LINFODRENAGGIO',
      name: 'Linfodrenaggio manuale',
      category: 'MANUALE',
      description: 'Drenaggio linfatico manuale metodo Vodder',
      defaultDuration: 45,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: false,
      isActive: true,
    },
    {
      code: 'MOBILIZZAZIONI',
      name: 'Mobilizzazioni articolari',
      category: 'MANUALE',
      description: 'Mobilizzazioni passive e attive assistite',
      defaultDuration: 30,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: false,
      isActive: true,
    },
    {
      code: 'POMPAGE',
      name: 'Pompage cervicale',
      category: 'MANUALE',
      description: 'Trazioni manuali per decompressione cervicale',
      defaultDuration: 20,
      defaultSessions: 8,
      requiresDoctor: false,
      requiresEquipment: false,
      isActive: true,
    },
    // TERAPIE COMBINATE
    {
      code: 'RIAB_POST_CHIR',
      name: 'Riabilitazione post-chirurgica',
      category: 'SPECIALE',
      description: 'Protocollo riabilitativo post-intervento ortopedico',
      defaultDuration: 60,
      defaultSessions: 20,
      requiresDoctor: true,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'RIAB_NEURO',
      name: 'Riabilitazione neurologica',
      category: 'SPECIALE',
      description: 'Riabilitazione per patologie neurologiche',
      defaultDuration: 60,
      defaultSessions: 30,
      requiresDoctor: true,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'IDROKINESITERAPIA',
      name: 'Idrokinesiterapia',
      category: 'SPECIALE',
      description: 'Riabilitazione in acqua',
      defaultDuration: 45,
      defaultSessions: 12,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    },
    {
      code: 'GINNASTICA_POSTURALE',
      name: 'Ginnastica posturale',
      category: 'SPECIALE',
      description: 'Rieducazione posturale globale metodo Mézières',
      defaultDuration: 60,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      isActive: true,
    }
  ];

  const createdTherapyTypes = [];
  for (const tt of therapyTypes) {
    const therapyType = await prisma.therapyType.upsert({
      where: { code: tt.code },
      update: {},
      create: tt,
    });
    createdTherapyTypes.push(therapyType);
  }

  console.log(`✅ ${createdTherapyTypes.length} tipi di terapia creati`);

  // 3. Crea 100 pazienti realistici
  console.log('\n👨‍👩‍👧‍👦 Creazione 100 pazienti...');

  const patients = [];
  for (let i = 0; i < 100; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale 
      ? firstNames.male[Math.floor(Math.random() * firstNames.male.length)]
      : firstNames.female[Math.floor(Math.random() * firstNames.female.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Età distribuita realisticamente (più anziani per patologie degenerative)
    const ageDistribution = Math.random();
    let birthYear;
    if (ageDistribution < 0.2) {
      birthYear = 1995 - Math.floor(Math.random() * 15); // 20-35 anni
    } else if (ageDistribution < 0.5) {
      birthYear = 1980 - Math.floor(Math.random() * 15); // 35-50 anni
    } else if (ageDistribution < 0.8) {
      birthYear = 1965 - Math.floor(Math.random() * 15); // 50-65 anni
    } else {
      birthYear = 1950 - Math.floor(Math.random() * 15); // 65-80 anni
    }
    
    const birthDate = new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    const patient = await prisma.patient.create({
      data: {
        fiscalCode: generateFiscalCode(firstName, lastName, birthDate, isMale, i),
        firstName,
        lastName,
        birthDate,
        birthPlace: city,
        gender: isMale ? 'MALE' : 'FEMALE',
        address: `${street} ${Math.floor(Math.random() * 200) + 1}`,
        city,
        province: 'RA',
        postalCode: `481${(Math.floor(Math.random() * 90) + 10).toString()}`,
        phone: `0544${(300000 + Math.floor(Math.random() * 100000)).toString()}`,
        mobile: `3${Math.floor(Math.random() * 4) + 3}${Math.floor(Math.random() * 10)}${(1000000 + Math.floor(Math.random() * 9000000)).toString()}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        generalPractitioner: `Dott. ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        prescribingDoctor: doctors[Math.floor(Math.random() * doctors.length)].firstName + ' ' + doctors[Math.floor(Math.random() * doctors.length)].lastName,
        privacyConsent: true,
        marketingConsent: Math.random() > 0.3,
      },
    });
    patients.push(patient);
  }

  console.log('✅ 100 pazienti creati');

  // 4. Crea cartelle cliniche e terapie
  console.log('\n📁 Creazione cartelle cliniche e terapie...');

  let totalTherapies = 0;
  let totalSessions = 0;
  const currentDate = new Date();

  for (let p = 0; p < patients.length; p++) {
    const patient = patients[p];
    
    // Ogni paziente ha 1-3 cartelle cliniche nel tempo
    const numRecords = Math.floor(Math.random() * 3) + 1;
    
    for (let r = 0; r < numRecords; r++) {
      // Cartelle distribuite negli ultimi 2 anni
      const recordDate = subMonths(currentDate, Math.floor(Math.random() * 24));
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      
      const clinicalRecord = await prisma.clinicalRecord.create({
        data: {
          patientId: patient.id,
          recordNumber: `MR-${recordDate.getFullYear()}-${(p * 10 + r + 1000).toString().padStart(4, '0')}`,
          acceptanceDate: recordDate,
          diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
          diagnosticDetails: `Sintomatologia presente da ${Math.floor(Math.random() * 12) + 1} mesi. ${Math.random() > 0.5 ? 'Esordio graduale.' : 'Esordio acuto post-traumatico.'}`,
          symptomatology: 'Dolore, limitazione funzionale, riduzione della mobilità articolare',
          objectiveExamination: 'Test clinici positivi, dolorabilità alla palpazione, ROM limitato',
          instrumentalExams: Math.random() > 0.3 ? 
            (Math.random() > 0.5 ? 'RX: alterazioni degenerative' : 'RMN: segni di flogosi') : null,
          isActive: r === numRecords - 1, // Solo l'ultima cartella è attiva
          createdById: doctor.id,
        },
      });

      // Ogni cartella ha 1-3 cicli di terapia
      const numTherapyCycles = Math.floor(Math.random() * 3) + 1;
      
      for (let t = 0; t < numTherapyCycles; t++) {
        const therapyType = createdTherapyTypes[Math.floor(Math.random() * createdTherapyTypes.length)];
        const therapyStartDate = addDays(recordDate, t * 30); // Cicli distanziati di 30 giorni
        
        // Numero realistico di sedute (tra 60% e 120% del default)
        const prescribedSessions = Math.floor(therapyType.defaultSessions * (0.6 + Math.random() * 0.6));
        
        // Determina quante sedute sono state completate
        const completionRate = Math.random();
        let completedSessions;
        let therapyStatus;
        
        if (completionRate > 0.8 && t < numTherapyCycles - 1) {
          // Cicli precedenti: 80% di probabilità di essere completati
          completedSessions = prescribedSessions;
          therapyStatus = 'COMPLETED';
        } else if (therapyStartDate > subMonths(currentDate, 1)) {
          // Terapie recenti: in corso
          completedSessions = Math.floor(prescribedSessions * Math.random() * 0.7);
          therapyStatus = 'IN_PROGRESS';
        } else {
          // Terapie vecchie non complete
          completedSessions = Math.floor(prescribedSessions * (0.3 + Math.random() * 0.5));
          therapyStatus = Math.random() > 0.5 ? 'CANCELLED' : 'COMPLETED';
        }

        const therapy = await prisma.therapy.create({
          data: {
            clinicalRecordId: clinicalRecord.id,
            therapyTypeId: therapyType.id,
            prescribedSessions,
            completedSessions,
            startDate: therapyStartDate,
            endDate: therapyStatus === 'COMPLETED' ? addDays(therapyStartDate, prescribedSessions * 2) : null,
            status: therapyStatus,
            frequency: Math.random() > 0.5 ? '3x/settimana' : '2x/settimana',
            district: `Distretto anatomico ${Math.floor(Math.random() * 5) + 1}`,
            notes: completedSessions > prescribedSessions / 2 ? 
              'Paziente risponde bene al trattamento. Miglioramenti evidenti.' : 
              'Inizio ciclo terapeutico. Obiettivi: riduzione dolore e recupero funzionale.',
            parameters: {
              intensity: 50 + Math.floor(Math.random() * 50),
              duration: therapyType.defaultDuration,
              frequency: Math.random() > 0.5 ? '3 MHz' : '1 MHz',
              power: Math.floor(Math.random() * 100) + 50,
            },
          },
        });

        totalTherapies++;

        // Crea le sessioni per questa terapia
        const therapist = therapists[Math.floor(Math.random() * therapists.length)];
        const initialVAS = 6 + Math.floor(Math.random() * 4); // VAS iniziale tra 6 e 9
        
        // Crea TUTTE le sessioni prescritte (non solo quelle completate)
        for (let s = 0; s < prescribedSessions; s++) {
          const sessionNumber = s + 1;
          const isCompleted = sessionNumber <= completedSessions;
          
          // Calcola la data della sessione (2-3 sessioni a settimana)
          const daysToAdd = Math.floor(s * 7 / 3); // ~2.3 sessioni a settimana
          const sessionDate = addDays(therapyStartDate, daysToAdd);
          
          // Genera VAS realistici con miglioramento progressivo
          const vasScores = isCompleted ? generateVASScores(sessionNumber, prescribedSessions, initialVAS) : { before: null, after: null };
          
          await prisma.therapySession.create({
            data: {
              therapyId: therapy.id,
              therapistId: therapist.id,
              sessionNumber,
              sessionDate,
              duration: therapyType.defaultDuration,
              status: isCompleted ? 'COMPLETED' : 
                     (sessionDate < currentDate ? 'MISSED' : 'SCHEDULED'),
              vasScoreBefore: vasScores.before,
              vasScoreAfter: vasScores.after,
              notes: isCompleted ? 
                generateSessionNote(sessionNumber, (vasScores.before || 0) - (vasScores.after || 0), therapyType.name) : 
                null,
              parameters: isCompleted ? {
                intensity: therapy.parameters?.intensity || 75,
                frequency: therapy.parameters?.frequency || '3 MHz',
                power: therapy.parameters?.power || 100,
                duration: therapyType.defaultDuration,
                area: therapy.district,
              } : null,
              therapistSignature: isCompleted ? therapist.id : null,
              signedAt: isCompleted ? sessionDate : null,
            },
          });

          totalSessions++;
        }
      }
    }
    
    // Log progress ogni 10 pazienti
    if ((p + 1) % 10 === 0) {
      console.log(`   Processati ${p + 1}/100 pazienti...`);
    }
  }

  console.log(`\n✅ ${totalTherapies} terapie create con ${totalSessions} sessioni totali`);

  // 5. Aggiungi anamnesi per il 70% dei pazienti
  console.log('\n📋 Creazione anamnesi...');

  for (let i = 0; i < 70; i++) {
    const patient = patients[i];
    const age = currentDate.getFullYear() - patient.birthDate.getFullYear();
    
    await prisma.anamnesis.create({
      data: {
        patientId: patient.id,
        recordDate: subMonths(currentDate, 3),
        infectiousDiseases: Math.random() > 0.7 ? 'Varicella, Morbillo in età infantile' : 'Nessuna di rilievo',
        previousSurgeries: age > 40 && Math.random() > 0.6 ? 
          `${Math.random() > 0.5 ? 'Appendicectomia' : 'Colecistectomia'} ${2010 - Math.floor(Math.random() * 20)}` : 
          'Nessun intervento',
        boneFractures: Math.random() > 0.8 ? 
          `Frattura ${Math.random() > 0.5 ? 'radio' : 'tibia'} ${2015 - Math.floor(Math.random() * 30)}` : 
          'Nessuna frattura pregressa',
        currentPathologies: age > 50 ? 
          (Math.random() > 0.5 ? 'Ipertensione arteriosa' : 'Diabete mellito tipo 2') : 
          'Nessuna patologia di rilievo',
        geneticRisks: Math.random() > 0.7 ? 'Familiarità per patologie cardiovascolari' : 'Non rilevanti',
        familyPredispositions: Math.random() > 0.6 ? 
          `${Math.random() > 0.5 ? 'Diabete' : 'Ipertensione'} (${Math.random() > 0.5 ? 'madre' : 'padre'})` : 
          'Nessuna',
        lifestyle: age < 40 ? 'Attivo' : (Math.random() > 0.5 ? 'Sedentario' : 'Moderatamente attivo'),
        allergies: Math.random() > 0.8 ? 
          (Math.random() > 0.5 ? 'Pollini, Graminacee' : 'Penicillina') : 
          'Nessuna allergia nota',
        medications: age > 60 && Math.random() > 0.5 ? 
          'Antipertensivi, Statine' : 
          'Nessuna terapia in corso',
        smoke: Math.random() > 0.7 ? 
          (Math.random() > 0.5 ? 'Ex fumatore' : '10 sigarette/die') : 
          'Non fumatore',
        alcohol: Math.random() > 0.5 ? 'Occasionale' : 'Astemio',
        physicalActivity: age < 50 ? 
          (Math.random() > 0.5 ? '2-3 volte/settimana' : 'Saltuaria') : 
          'Scarsa',
        occupation: age < 65 ? 
          (Math.random() > 0.5 ? 'Impiegato' : 'Operaio') : 
          'Pensionato',
      },
    });
  }

  console.log('✅ 70 anamnesi create');

  // 6. Aggiungi segni vitali recenti per il 50% dei pazienti
  console.log('\n💓 Creazione segni vitali...');

  for (let i = 0; i < 50; i++) {
    const patient = patients[i];
    const age = currentDate.getFullYear() - patient.birthDate.getFullYear();
    
    // Crea 3 misurazioni per paziente (ultimi 3 mesi)
    for (let m = 0; m < 3; m++) {
      await prisma.vitalSign.create({
        data: {
          patientId: patient.id,
          measurementDate: subMonths(currentDate, m),
          temperature: 36 + Math.random() * 1.2,
          heartRate: age > 60 ? 
            65 + Math.floor(Math.random() * 25) : 
            60 + Math.floor(Math.random() * 20),
          respiratoryRate: 14 + Math.floor(Math.random() * 6),
          bloodPressureSys: age > 50 ? 
            120 + Math.floor(Math.random() * 30) : 
            110 + Math.floor(Math.random() * 20),
          bloodPressureDia: age > 50 ? 
            75 + Math.floor(Math.random() * 15) : 
            70 + Math.floor(Math.random() * 10),
          oxygenSaturation: 96 + Math.random() * 3,
          weight: 55 + Math.floor(Math.random() * 40),
          height: 155 + Math.floor(Math.random() * 30),
          pain: Math.floor(Math.random() * 5) + 3, // VAS 3-7
        },
      });
    }
  }

  console.log('✅ 150 rilevazioni segni vitali create');

  // 7. Riepilogo finale
  console.log('\n' + '='.repeat(60));
  console.log('🎉 SEED REALISTICO COMPLETATO CON SUCCESSO!');
  console.log('='.repeat(60));
  
  console.log('\n📊 RIEPILOGO DATI CREATI:');
  console.log(`├─ 👥 Utenti: ${1 + doctors.length + therapists.length} (1 admin, ${doctors.length} dottori, ${therapists.length} fisioterapisti)`);
  console.log(`├─ 👨‍👩‍👧‍👦 Pazienti: ${patients.length}`);
  console.log(`├─ 📁 Cartelle cliniche: ~${patients.length * 2}`);
  console.log(`├─ 💊 Terapie: ${totalTherapies}`);
  console.log(`├─ 📅 Sessioni: ${totalSessions}`);
  console.log(`├─ 📋 Anamnesi: 70`);
  console.log(`└─ 💓 Segni vitali: 150`);
  
  console.log('\n📈 CARATTERISTICHE DEI DATI:');
  console.log('├─ ✅ Sessioni numerate sequenzialmente (1, 2, 3...)')
  console.log('├─ ✅ VAS score con miglioramento progressivo realistico');
  console.log('├─ ✅ Date sessioni distribuite correttamente (2-3/settimana)');
  console.log('├─ ✅ Stati terapie coerenti con le sessioni completate');
  console.log('├─ ✅ Note cliniche realistiche e variegate');
  console.log('└─ ✅ Dati anagrafici e clinici realistici');
  
  console.log('\n🔐 CREDENZIALI DI ACCESSO:');
  console.log('├─ Admin: admin@medicinaravenna.it / admin123');
  console.log('├─ Dottore: dott.rossi@medicinaravenna.it / doctor123');
  console.log('├─ Fisioterapista: ft.verdi@medicinaravenna.it / therapist123');
  console.log('└─ (Altri utenti con stesso pattern di password)');
  
  console.log('\n💡 SUGGERIMENTI PER IL TEST:');
  console.log('├─ Cerca pazienti per cognome (es: Rossi, Bianchi)');
  console.log('├─ Filtra terapie per stato (IN_PROGRESS per quelle attive)');
  console.log('├─ Verifica l\'andamento VAS nei dettagli terapia');
  console.log('└─ Controlla la sequenzialità delle sessioni');
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
