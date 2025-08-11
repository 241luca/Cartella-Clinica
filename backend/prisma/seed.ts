import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays, subMonths } from 'date-fns';

const prisma = new PrismaClient();

// Helper per generare codice fiscale fittizio
function generateFiscalCode(firstName: string, lastName: string, index: number): string {
  const letters = lastName.substring(0, 3).toUpperCase();
  const firstLetters = firstName.substring(0, 3).toUpperCase();
  const year = (1940 + index * 2).toString().substring(2);
  const months = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  const month = months[index % 12];
  const day = (10 + (index % 20)).toString().padStart(2, '0');
  return `${letters}${firstLetters}${year}${month}${day}H501Z`;
}

// Lista di nomi e cognomi italiani
const firstNames = {
  male: ['Marco', 'Alessandro', 'Giuseppe', 'Antonio', 'Francesco', 'Giovanni', 'Roberto', 'Mario', 'Luigi', 'Angelo', 'Vincenzo', 'Pietro', 'Carlo', 'Salvatore', 'Franco'],
  female: ['Maria', 'Anna', 'Giuseppina', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia', 'Carmela', 'Laura', 'Silvia', 'Barbara', 'Francesca', 'Paola', 'Antonella']
};

const lastNames = ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti'];

const cities = ['Ravenna', 'Bologna', 'Ferrara', 'Forlì', 'Cesena', 'Rimini', 'Faenza', 'Imola', 'Lugo', 'Cervia'];

const streets = ['Via Roma', 'Via Garibaldi', 'Via Dante', 'Corso Matteotti', 'Via Mazzini', 'Via Verdi', 'Piazza della Libertà', 'Via Cavour', 'Via San Vitale', 'Via Maggiore'];

// Diagnosi comuni
const diagnoses = [
  'Lombalgia acuta',
  'Cervicalgia cronica',
  'Periartrite scapolo-omerale',
  'Gonartrosi bilaterale',
  'Coxartrosi destra',
  'Tendinite rotulea',
  'Epicondilite laterale',
  'Sindrome del tunnel carpale',
  'Fascite plantare',
  'Distorsione caviglia',
  'Ernia discale L4-L5',
  'Scoliosi idiopatica',
  'Frattura composta omero',
  'Lesione legamento crociato',
  'Borsite trocanterica'
];

async function main() {
  console.log('🌱 Inizio seed del database con 20+ pazienti...');

  // 1. Crea/aggiorna utenti
  console.log('Creazione utenti...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const therapistPassword = await bcrypt.hash('therapist123', 10);
  const nursePassword = await bcrypt.hash('nurse123', 10);

  await prisma.user.upsert({
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

  const doctor1 = await prisma.user.upsert({
    where: { email: 'dott.rossi@medicinaravenna.it' },
    update: {},
    create: {
      email: 'dott.rossi@medicinaravenna.it',
      username: 'dottrossi',
      password: doctorPassword,
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'DOCTOR',
      phone: '0544123456',
      isActive: true,
    },
  });

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dott.bianchi@medicinaravenna.it' },
    update: {},
    create: {
      email: 'dott.bianchi@medicinaravenna.it',
      username: 'dottbianchi',
      password: doctorPassword,
      firstName: 'Laura',
      lastName: 'Bianchi',
      role: 'DOCTOR',
      phone: '0544123457',
      isActive: true,
    },
  });

  const therapist1 = await prisma.user.upsert({
    where: { email: 'ft.verdi@medicinaravenna.it' },
    update: {},
    create: {
      email: 'ft.verdi@medicinaravenna.it',
      username: 'ftverdi',
      password: therapistPassword,
      firstName: 'Giuseppe',
      lastName: 'Verdi',
      role: 'THERAPIST',
      phone: '0544123458',
      isActive: true,
    },
  });

  const therapist2 = await prisma.user.upsert({
    where: { email: 'ft.neri@medicinaravenna.it' },
    update: {},
    create: {
      email: 'ft.neri@medicinaravenna.it',
      username: 'ftneri',
      password: therapistPassword,
      firstName: 'Anna',
      lastName: 'Neri',
      role: 'THERAPIST',
      phone: '0544123459',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'inf.gialli@medicinaravenna.it' },
    update: {},
    create: {
      email: 'inf.gialli@medicinaravenna.it',
      username: 'infgialli',
      password: nursePassword,
      firstName: 'Carla',
      lastName: 'Gialli',
      role: 'NURSE',
      phone: '0544123460',
      isActive: true,
    },
  });

  console.log('✅ Utenti creati');

  // 2. Crea 20 pazienti
  console.log('Creazione 20 pazienti...');

  const patients = [];
  for (let i = 0; i < 20; i++) {
    const isMale = i % 2 === 0;
    const firstName = isMale ? firstNames.male[i % firstNames.male.length] : firstNames.female[i % firstNames.female.length];
    const lastName = lastNames[i % lastNames.length];
    const city = cities[i % cities.length];
    const street = streets[i % streets.length];
    
    const patient = await prisma.patient.create({
      data: {
        fiscalCode: generateFiscalCode(firstName, lastName, i),
        firstName,
        lastName,
        birthDate: new Date(1940 + (i * 2), i % 12, 10 + (i % 20)),
        birthPlace: city,
        gender: isMale ? 'MALE' : 'FEMALE',
        address: `${street} ${Math.floor(Math.random() * 100) + 1}`,
        city,
        postalCode: `4812${i.toString().padStart(1, '0')}`,
        phone: `0544${(100000 + i).toString()}`,
        mobile: `333${(1000000 + i).toString()}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.it`,
        generalPractitioner: `Dott. ${lastNames[(i + 5) % lastNames.length]}`,
        prescribingDoctor: i % 3 === 0 ? 'Dott. Rossi' : 'Dott. Bianchi',
        privacyConsent: true,
        marketingConsent: i % 3 !== 0,
      },
    });
    patients.push(patient);
  }

  console.log('✅ 20 Pazienti creati');

  // 3. Crea tipi di terapia (se non esistono già)
  console.log('Creazione tipi di terapia...');

  const therapyTypes = [
    {
      code: 'LASER_YAG',
      name: 'Laser YAG 1064',
      category: 'INSTRUMENTAL',
      description: 'Laserterapia YAG ad alta potenza',
      defaultDuration: 20,
      defaultSessions: 10,
      isActive: true,
    },
    {
      code: 'TECAR',
      name: 'Tecarterapia',
      category: 'INSTRUMENTAL',
      description: 'Trasferimento Energetico Capacitivo Resistivo',
      defaultDuration: 30,
      defaultSessions: 8,
      isActive: true,
    },
    {
      code: 'MAGNETO',
      name: 'Magnetoterapia',
      category: 'INSTRUMENTAL',
      description: 'Terapia con campi magnetici pulsati',
      defaultDuration: 30,
      defaultSessions: 15,
      isActive: true,
    },
    {
      code: 'TENS',
      name: 'TENS',
      category: 'INSTRUMENTAL',
      description: 'Stimolazione Elettrica Nervosa Transcutanea',
      defaultDuration: 30,
      defaultSessions: 10,
      isActive: true,
    },
    {
      code: 'ULTRA',
      name: 'Ultrasuoni',
      category: 'INSTRUMENTAL',
      description: 'Ultrasuonoterapia',
      defaultDuration: 15,
      defaultSessions: 10,
      isActive: true,
    },
    {
      code: 'KINESI',
      name: 'Kinesiterapia',
      category: 'MANUAL',
      description: 'Terapia del movimento',
      defaultDuration: 45,
      defaultSessions: 10,
      isActive: true,
    },
    {
      code: 'MASSO',
      name: 'Massoterapia',
      category: 'MANUAL',
      description: 'Massaggio terapeutico',
      defaultDuration: 30,
      defaultSessions: 10,
      isActive: true,
    },
    {
      code: 'IDRO',
      name: 'Idrokinesiterapia',
      category: 'REHABILITATION',
      description: 'Riabilitazione in acqua',
      defaultDuration: 45,
      defaultSessions: 20,
      isActive: true,
    },
    {
      code: 'POSTURA',
      name: 'Ginnastica Posturale',
      category: 'REHABILITATION',
      description: 'Rieducazione posturale globale',
      defaultDuration: 45,
      defaultSessions: 15,
      isActive: true,
    },
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

  console.log('✅ Tipi di terapia creati');

  // 4. Crea cartelle cliniche per 15 pazienti (75% dei pazienti)
  console.log('Creazione cartelle cliniche...');

  const clinicalRecords = [];
  const doctors = [doctor1, doctor2];
  
  for (let i = 0; i < 15; i++) {
    const patient = patients[i];
    const doctor = doctors[i % 2];
    const acceptanceDate = subDays(new Date(), Math.floor(Math.random() * 60) + 1);
    
    const record = await prisma.clinicalRecord.create({
      data: {
        patientId: patient.id,
        recordNumber: `MR-2025-${(1000 + i).toString()}`,
        acceptanceDate,
        diagnosis: diagnoses[i % diagnoses.length],
        diagnosticDetails: `Paziente presenta sintomatologia da ${Math.floor(Math.random() * 12) + 1} mesi`,
        symptomatology: 'Dolore, limitazione funzionale, riduzione ROM',
        objectiveExamination: 'Test ortopedici positivi, dolorabilità alla palpazione',
        instrumentalExams: i % 3 === 0 ? 'RX: segni di artrosi' : i % 3 === 1 ? 'RMN: alterazioni degenerative' : null,
        interventionDate: i % 4 === 0 ? acceptanceDate : null,
        interventionDoctor: i % 4 === 0 ? doctor.firstName + ' ' + doctor.lastName : null,
        isActive: true,
        closedAt: i < 3 ? new Date() : null, // Chiudi le prime 3 cartelle
        createdById: doctor.id,
      },
    });
    clinicalRecords.push(record);
  }

  console.log('✅ 15 Cartelle cliniche create');

  // 5. Crea terapie per le cartelle cliniche
  console.log('Creazione terapie...');

  const therapies = [];
  const therapists = [therapist1, therapist2];
  
  for (let i = 0; i < clinicalRecords.length; i++) {
    const record = clinicalRecords[i];
    const numTherapies = Math.floor(Math.random() * 3) + 1; // 1-3 terapie per cartella
    
    for (let j = 0; j < numTherapies; j++) {
      const therapyType = createdTherapyTypes[(i + j) % createdTherapyTypes.length];
      const startDate = subDays(new Date(), Math.floor(Math.random() * 30) + 1);
      const prescribedSessions = therapyType.defaultSessions;
      const completedSessions = Math.floor(Math.random() * prescribedSessions);
      
      const therapy = await prisma.therapy.create({
        data: {
          clinicalRecordId: record.id,
          therapyTypeId: therapyType.id,
          prescribedSessions,
          completedSessions,
          startDate,
          endDate: completedSessions === prescribedSessions ? new Date() : null,
          status: completedSessions === prescribedSessions ? 'COMPLETED' : 
                  completedSessions > 0 ? 'IN_PROGRESS' : 'SCHEDULED',
          frequency: j === 0 ? '3x/week' : j === 1 ? '2x/week' : 'daily',
          district: 'Distretto ' + (j + 1),
          notes: completedSessions > 5 ? 'Paziente risponde bene al trattamento' : null,
          parameters: {
            intensity: Math.floor(Math.random() * 100),
            duration: therapyType.defaultDuration,
          },
        },
      });
      therapies.push(therapy);
    }
  }

  console.log(`✅ ${therapies.length} Terapie create`);

  // 6. Crea sedute per le terapie attive
  console.log('Creazione sedute di terapia...');

  let sessionsCreated = 0;
  const today = new Date();
  
  for (const therapy of therapies) {
    if (therapy.status === 'IN_PROGRESS' || therapy.status === 'SCHEDULED') {
      const therapist = therapists[sessionsCreated % 2];
      
      // Crea 3-5 sedute future per ogni terapia attiva
      const numSessions = Math.floor(Math.random() * 3) + 3;
      
      for (let s = 0; s < numSessions; s++) {
        const sessionDate = addDays(today, s * 2); // Ogni 2 giorni
        const hour = 8 + Math.floor(Math.random() * 10); // Tra le 8 e le 18
        sessionDate.setHours(hour, Math.random() > 0.5 ? 0 : 30, 0, 0);
        
        await prisma.therapySession.create({
          data: {
            therapyId: therapy.id,
            therapistId: therapist.id,
            sessionNumber: therapy.completedSessions + s + 1,
            sessionDate,
            duration: 30,
            status: s === 0 && Math.random() > 0.7 ? 'COMPLETED' : 'SCHEDULED',
            vasScoreBefore: s === 0 ? Math.floor(Math.random() * 10) : null,
            vasScoreAfter: s === 0 ? Math.floor(Math.random() * 10) : null,
            notes: s === 0 ? 'Seduta completata regolarmente' : null,
          },
        });
        sessionsCreated++;
      }
    }
  }

  console.log(`✅ ${sessionsCreated} Sedute create`);

  // 7. Aggiungi anamnesi per alcuni pazienti
  console.log('Creazione anamnesi...');

  for (let i = 0; i < 10; i++) {
    const patient = patients[i];
    
    await prisma.anamnesis.create({
      data: {
        patientId: patient.id,
        recordDate: subMonths(new Date(), 1),
        infectiousDiseases: i % 3 === 0 ? 'Varicella, Morbillo in età infantile' : null,
        previousSurgeries: i % 4 === 0 ? 'Appendicectomia 2010' : null,
        boneFractures: i % 5 === 0 ? 'Frattura radio 2015' : null,
        currentPathologies: i % 2 === 0 ? 'Ipertensione arteriosa' : 'Nessuna',
        geneticRisks: 'Non rilevanti',
        familyPredispositions: i % 3 === 0 ? 'Diabete tipo 2 (madre)' : null,
        lifestyle: 'Sedentario',
        allergies: i % 6 === 0 ? 'Pollini, Graminacee' : 'Nessuna nota',
      },
    });
  }

  console.log('✅ Anamnesi create');

  // 8. Aggiungi segni vitali recenti
  console.log('Creazione segni vitali...');

  for (let i = 0; i < 8; i++) {
    const patient = patients[i];
    
    await prisma.vitalSign.create({
      data: {
        patientId: patient.id,
        measurementDate: subDays(new Date(), Math.floor(Math.random() * 7)),
        temperature: 36 + Math.random() * 1.5,
        heartRate: 60 + Math.floor(Math.random() * 40),
        respiratoryRate: 12 + Math.floor(Math.random() * 8),
        bloodPressureSys: 110 + Math.floor(Math.random() * 40),
        bloodPressureDia: 70 + Math.floor(Math.random() * 20),
        oxygenSaturation: 95 + Math.random() * 5,
        weight: 60 + Math.floor(Math.random() * 40),
        height: 160 + Math.floor(Math.random() * 30),
      },
    });
  }

  console.log('✅ Segni vitali creati');

  // 9. Riepilogo finale
  console.log('\n🎉 Seed completato con successo!');
  console.log('\n📊 Riepilogo dati creati:');
  console.log(`- Utenti: 6 (admin, 2 dottori, 2 terapisti, 1 infermiere)`);
  console.log(`- Pazienti: ${patients.length}`);
  console.log(`- Cartelle cliniche: ${clinicalRecords.length} (3 chiuse, ${clinicalRecords.length - 3} aperte)`);
  console.log(`- Tipi di terapia: ${createdTherapyTypes.length}`);
  console.log(`- Terapie: ${therapies.length}`);
  console.log(`- Sedute programmate: ${sessionsCreated}`);
  console.log(`- Anamnesi: 10`);
  console.log(`- Segni vitali: 8`);
  
  console.log('\n🔐 Credenziali di accesso:');
  console.log('Admin: admin@medicinaravenna.it / admin123');
  console.log('Dottore 1: dott.rossi@medicinaravenna.it / doctor123');
  console.log('Dottore 2: dott.bianchi@medicinaravenna.it / doctor123');
  console.log('Terapista 1: ft.verdi@medicinaravenna.it / therapist123');
  console.log('Terapista 2: ft.neri@medicinaravenna.it / therapist123');
  console.log('Infermiere: inf.gialli@medicinaravenna.it / nurse123');
  
  console.log('\n📈 Statistiche:');
  console.log(`- 75% dei pazienti ha una cartella clinica`);
  console.log(`- Media di 2 terapie per cartella`);
  console.log(`- 20% delle cartelle sono chiuse`);
  console.log(`- Sedute programmate nei prossimi 10 giorni`);
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
