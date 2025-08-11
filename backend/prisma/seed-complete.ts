import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lista di nomi e cognomi italiani comuni
const nomi = [
  'Mario', 'Luigi', 'Giovanni', 'Roberto', 'Paolo', 'Marco', 'Alessandro', 'Luca', 'Andrea', 'Giuseppe',
  'Maria', 'Anna', 'Paola', 'Laura', 'Giulia', 'Francesca', 'Sara', 'Elena', 'Chiara', 'Valentina',
  'Antonio', 'Francesco', 'Sergio', 'Pietro', 'Carlo', 'Vincenzo', 'Salvatore', 'Domenico', 'Michele', 'Angelo',
  'Rosa', 'Angela', 'Teresa', 'Rita', 'Lucia', 'Carmela', 'Caterina', 'Monica', 'Simona', 'Roberta',
  'Stefano', 'Davide', 'Fabio', 'Matteo', 'Giorgio', 'Alberto', 'Massimo', 'Nicola', 'Enrico', 'Daniele'
];

const cognomi = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
  'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
  'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', 'Marchetti', 'Parisi',
  'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina'
];

// Città della Romagna
const citta = [
  'Ravenna', 'Faenza', 'Lugo', 'Cervia', 'Russi', 'Alfonsine', 'Bagnacavallo', 'Cotignola',
  'Forlì', 'Cesena', 'Rimini', 'Riccione', 'Cattolica', 'Bellaria', 'Santarcangelo',
  'Cesenatico', 'Savignano', 'Gambettola', 'San Mauro Pascoli', 'Gatteo'
];

// Diagnosi comuni in fisioterapia
const diagnosi = [
  'Lombalgia acuta', 'Cervicalgia cronica', 'Lombosciatalgia', 'Ernia discale L4-L5', 'Ernia discale L5-S1',
  'Periartrite scapolo-omerale', 'Tendinite della cuffia dei rotatori', 'Epicondilite laterale',
  'Epitrocleite', 'Sindrome del tunnel carpale', 'Rizartrosi', 'Gonartrosi bilaterale',
  'Coxartrosi destra', 'Coxartrosi sinistra', 'Distorsione caviglia', 'Tendinite achillea',
  'Fascite plantare', 'Metatarsalgia', 'Alluce valgo', 'Scoliosi idiopatica',
  'Dorsalgia posturale', 'Sindrome da impingement', 'Lesione meniscale', 'Rottura LCA',
  'Frattura polso (post-rimozione gesso)', 'Frattura omero (consolidata)', 'Protesi anca (riabilitazione)',
  'Protesi ginocchio (riabilitazione)', 'Ictus (emiparesi destra)', 'Ictus (emiparesi sinistra)',
  'Parkinson (stadio iniziale)', 'Sclerosi multipla', 'Fibromialgia', 'Artrite reumatoide',
  'Spondilite anchilosante', 'Osteoporosi severa', 'Frattura vertebrale', 'Colpo di frusta',
  'Sindrome miofasciale', 'Borsite trocanterica', 'Pubalgia', 'Sindrome piriforme'
];

// Note e osservazioni mediche
const noteClinice = [
  'Paziente collaborante, riferisce miglioramento della sintomatologia',
  'Dolore in riduzione, mobilità articolare in miglioramento',
  'Buona compliance al trattamento, esegue regolarmente esercizi a domicilio',
  'Sintomatologia stazionaria, rivalutare piano terapeutico',
  'Ottima risposta al trattamento, proseguire con il protocollo',
  'Riferisce dolore notturno, consigliata valutazione ortopedica',
  'Miglioramento della forza muscolare, continuare rinforzo',
  'Riduzione dell\'edema, buon recupero funzionale',
  'Paziente anziano, procedere con cautela negli esercizi',
  'Sportivo agonista, necessario recupero completo prima del ritorno all\'attività',
  'Presenza di contratture muscolari, focus su rilassamento',
  'Deficit propriocettivo importante, intensificare esercizi specifici',
  'Paziente ansioso, necessario approccio rassicurante',
  'Buon tono muscolare, proseguire con mantenimento',
  'Limitazione funzionale importante, obiettivi a breve termine',
  'Dolore cronico, approccio multidisciplinare consigliato',
  'Post-chirurgico, rispettare tempi biologici di guarigione',
  'Recidiva sintomatologia, modificare approccio terapeutico',
  'Ottimi progressi, ridurre frequenza sedute',
  'Necessaria educazione posturale per prevenzione recidive'
];

// Funzione per generare codice fiscale fittizio ma valido
function generateCodiceFiscale(nome: string, cognome: string, dataNascita: Date, sesso: string): string {
  const consonantiCognome = cognome.replace(/[aeiou]/gi, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const consonantiNome = nome.replace(/[aeiou]/gi, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const anno = dataNascita.getFullYear().toString().slice(-2);
  const mese = 'ABCDEHLMPRST'[dataNascita.getMonth()];
  const giorno = (sesso === 'F' ? 40 : 0) + dataNascita.getDate();
  const comune = 'H199'; // Codice Ravenna
  const controllo = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  
  return `${consonantiCognome}${consonantiNome}${anno}${mese}${giorno.toString().padStart(2, '0')}${comune}${controllo}`;
}

// Funzione per generare data casuale
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Funzione per generare numero di telefono italiano
function generatePhoneNumber(): string {
  const prefixes = ['333', '334', '335', '336', '337', '338', '339', '340', '342', '343', '344', '345', '346', '347', '348', '349'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `+39${prefix}${number}`;
}

async function main() {
  console.log('🌱 Inizio popolamento database con dati realistici...');

  try {
    // Pulizia database (opzionale, commentare se si vogliono mantenere i dati esistenti)
    console.log('🧹 Pulizia database...');
    await prisma.therapySession.deleteMany();
    await prisma.therapy.deleteMany();
    await prisma.therapyType.deleteMany();
    await prisma.document.deleteMany();
    await prisma.clinicalRecord.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();

    // 1. Creazione Utenti (medici e fisioterapisti)
    console.log('👤 Creazione utenti...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await Promise.all([
      // Admin
      prisma.user.create({
        data: {
          email: 'admin@medicinaravenna.it',
          password: await bcrypt.hash('admin123', 10),
          firstName: 'Admin',
          lastName: 'Sistema',
          role: 'ADMIN',
          specialization: 'Amministrazione',
          licenseNumber: 'ADMIN001',
          phoneNumber: '+390544456845',
        },
      }),
      // Medici
      prisma.user.create({
        data: {
          email: 'dott.rossi@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Mario',
          lastName: 'Rossi',
          role: 'DOCTOR',
          specialization: 'Medicina Fisica e Riabilitativa',
          licenseNumber: 'RA12345',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      prisma.user.create({
        data: {
          email: 'dott.bianchi@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Laura',
          lastName: 'Bianchi',
          role: 'DOCTOR',
          specialization: 'Ortopedia',
          licenseNumber: 'RA23456',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      prisma.user.create({
        data: {
          email: 'dott.verdi@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Giuseppe',
          lastName: 'Verdi',
          role: 'DOCTOR',
          specialization: 'Neurologia',
          licenseNumber: 'RA34567',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      // Fisioterapisti
      prisma.user.create({
        data: {
          email: 'ft.ferrari@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Anna',
          lastName: 'Ferrari',
          role: 'THERAPIST',
          specialization: 'Fisioterapia',
          licenseNumber: 'FT001',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      prisma.user.create({
        data: {
          email: 'ft.romano@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Marco',
          lastName: 'Romano',
          role: 'THERAPIST',
          specialization: 'Fisioterapia Sportiva',
          licenseNumber: 'FT002',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      prisma.user.create({
        data: {
          email: 'ft.marino@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Giulia',
          lastName: 'Marino',
          role: 'THERAPIST',
          specialization: 'Fisioterapia Neurologica',
          licenseNumber: 'FT003',
          phoneNumber: generatePhoneNumber(),
        },
      }),
      prisma.user.create({
        data: {
          email: 'ft.gallo@medicinaravenna.it',
          password: hashedPassword,
          firstName: 'Roberto',
          lastName: 'Gallo',
          role: 'THERAPIST',
          specialization: 'Osteopatia',
          licenseNumber: 'FT004',
          phoneNumber: generatePhoneNumber(),
        },
      }),
    ]);

    console.log(`✅ Creati ${users.length} utenti`);

    // 2. Creazione Tipi di Terapia
    console.log('💊 Creazione tipi di terapia...');
    const therapyTypes = await Promise.all([
      prisma.therapyType.create({
        data: {
          code: 'MAGNETOTERAPIA',
          name: 'Magnetoterapia',
          category: 'TERAPIA_FISICA',
          description: 'Terapia con campi magnetici pulsati',
          defaultDuration: 30,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'LASER_YAG_145',
          name: 'Laser YAG 145',
          category: 'LASERTERAPIA',
          description: 'Laserterapia ad alta potenza',
          defaultDuration: 20,
          defaultSessions: 10,
          requiresDoctor: true,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'LASER_810_980',
          name: 'Laser 810+980',
          category: 'LASERTERAPIA',
          description: 'Laser a doppia lunghezza d\'onda',
          defaultDuration: 20,
          defaultSessions: 10,
          requiresDoctor: true,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'LASER_SCAN',
          name: 'Laser Scanner',
          category: 'LASERTERAPIA',
          description: 'Laser scanner per aree estese',
          defaultDuration: 15,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'TENS',
          name: 'TENS',
          category: 'ELETTROTERAPIA',
          description: 'Elettrostimolazione antalgica',
          defaultDuration: 20,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'ULTRASUONI',
          name: 'Ultrasuoni',
          category: 'TERAPIA_FISICA',
          description: 'Terapia ad ultrasuoni',
          defaultDuration: 15,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'ELETTROSTIMOLAZIONE',
          name: 'Elettrostimolazione',
          category: 'ELETTROTERAPIA',
          description: 'Elettrostimolazione muscolare',
          defaultDuration: 30,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'MASSOTERAPIA',
          name: 'Massoterapia',
          category: 'TERAPIA_MANUALE',
          description: 'Massaggio terapeutico',
          defaultDuration: 30,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: false,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'MOBILIZZAZIONI',
          name: 'Mobilizzazioni',
          category: 'TERAPIA_MANUALE',
          description: 'Mobilizzazioni articolari',
          defaultDuration: 30,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: false,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'TECARSIN',
          name: 'Tecarsin',
          category: 'TECARTERAPIA',
          description: 'Tecarterapia capacitiva e resistiva',
          defaultDuration: 30,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'LIMFATERAPY',
          name: 'Linfaterapy',
          category: 'DRENAGGIO',
          description: 'Pressoterapia e drenaggio linfatico',
          defaultDuration: 45,
          defaultSessions: 10,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'SIT',
          name: 'SIT',
          category: 'TERAPIA_INFILTRATIVA',
          description: 'Sistema Infiltrativo Transcutaneo',
          defaultDuration: 15,
          defaultSessions: 5,
          requiresDoctor: true,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
      prisma.therapyType.create({
        data: {
          code: 'TECALAB',
          name: 'Tecalab',
          category: 'RIABILITAZIONE',
          description: 'Programma riabilitativo integrato',
          defaultDuration: 60,
          defaultSessions: 20,
          requiresDoctor: false,
          requiresEquipment: true,
          parametersSchema: {}
        }
      }),
    ]);

    console.log(`✅ Creati ${therapyTypes.length} tipi di terapia`);

    // 3. Creazione Pazienti (50 pazienti)
    console.log('👥 Creazione pazienti...');
    const patients = [];
    
    for (let i = 0; i < 50; i++) {
      const nome = nomi[Math.floor(Math.random() * nomi.length)];
      const cognome = cognomi[Math.floor(Math.random() * cognomi.length)];
      const sesso = i % 2 === 0 ? 'M' : 'F';
      const dataNascita = randomDate(new Date(1940, 0, 1), new Date(2005, 0, 1));
      const città = citta[Math.floor(Math.random() * citta.length)];
      
      const patient = await prisma.patient.create({
        data: {
          firstName: nome,
          lastName: cognome,
          fiscalCode: generateCodiceFiscale(nome, cognome, dataNascita, sesso),
          birthDate: dataNascita,
          birthPlace: città,
          gender: sesso,
          address: `Via ${cognomi[Math.floor(Math.random() * cognomi.length)]}, ${Math.floor(Math.random() * 100) + 1}`,
          city: città,
          province: città === 'Ravenna' || città === 'Faenza' || città === 'Lugo' ? 'RA' : 
                    città === 'Forlì' || città === 'Cesena' ? 'FC' : 'RN',
          postalCode: `48${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
          phoneNumber: generatePhoneNumber(),
          email: `${nome.toLowerCase()}.${cognome.toLowerCase()}${i}@email.it`,
          occupation: ['Impiegato', 'Operaio', 'Insegnante', 'Pensionato', 'Libero professionista', 'Studente', 'Casalinga', 'Commerciante'][Math.floor(Math.random() * 8)],
          notes: Math.random() > 0.7 ? noteClinice[Math.floor(Math.random() * noteClinice.length)] : null,
        },
      });
      patients.push(patient);
    }

    console.log(`✅ Creati ${patients.length} pazienti`);

    // 4. Creazione Cartelle Cliniche (40 cartelle)
    console.log('📁 Creazione cartelle cliniche...');
    const clinicalRecords = [];
    const medici = users.filter(u => u.role === 'DOCTOR');
    
    for (let i = 0; i < 40; i++) {
      const patient = patients[i]; // Primi 40 pazienti hanno cartelle
      const medico = medici[Math.floor(Math.random() * medici.length)];
      const dataApertura = randomDate(new Date(2024, 0, 1), new Date());
      
      const record = await prisma.clinicalRecord.create({
        data: {
          patientId: patient.id,
          doctorId: medico.id,
          recordNumber: `2024-${(i + 1).toString().padStart(4, '0')}`,
          openedAt: dataApertura,
          diagnosis: diagnosi[Math.floor(Math.random() * diagnosi.length)],
          anamnesis: `Paziente di ${new Date().getFullYear() - patient.birthDate.getFullYear()} anni. ${noteClinice[Math.floor(Math.random() * noteClinice.length)]}`,
          objectiveExamination: 'Esame obiettivo: ' + ['Dolore alla palpazione', 'Limitazione funzionale', 'Edema presente', 'Contrattura muscolare', 'Ipotrofia muscolare'][Math.floor(Math.random() * 5)],
          treatmentPlan: 'Piano terapeutico: ' + ['Riduzione dolore', 'Recupero mobilità', 'Rinforzo muscolare', 'Rieducazione funzionale', 'Prevenzione recidive'][Math.floor(Math.random() * 5)],
          notes: Math.random() > 0.5 ? noteClinice[Math.floor(Math.random() * noteClinice.length)] : null,
          closedAt: Math.random() > 0.7 ? randomDate(dataApertura, new Date()) : null,
        },
      });
      clinicalRecords.push(record);
    }

    console.log(`✅ Create ${clinicalRecords.length} cartelle cliniche`);

    // 5. Creazione Terapie (45 terapie)
    console.log('💉 Creazione terapie...');
    const therapies = [];
    const terapisti = users.filter(u => u.role === 'THERAPIST');
    
    for (let i = 0; i < 45; i++) {
      const record = clinicalRecords[Math.floor(Math.random() * clinicalRecords.length)];
      const therapyType = therapyTypes[Math.floor(Math.random() * therapyTypes.length)];
      const dataInizio = randomDate(new Date(record.openedAt), new Date());
      
      const therapy = await prisma.therapy.create({
        data: {
          clinicalRecordId: record.id,
          therapyTypeId: therapyType.id,
          prescribedSessions: therapyType.defaultSessions || 10,
          completedSessions: Math.floor(Math.random() * (therapyType.defaultSessions || 10)),
          frequency: ['Quotidiana', '3 volte/settimana', '2 volte/settimana', 'Settimanale'][Math.floor(Math.random() * 4)],
          startDate: dataInizio,
          endDate: Math.random() > 0.5 ? randomDate(dataInizio, new Date()) : null,
          status: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED'][Math.floor(Math.random() * 4)],
          district: ['Cervicale', 'Dorsale', 'Lombare', 'Spalla dx', 'Spalla sx', 'Ginocchio dx', 'Ginocchio sx', 'Caviglia dx', 'Caviglia sx'][Math.floor(Math.random() * 9)],
          notes: Math.random() > 0.6 ? noteClinice[Math.floor(Math.random() * noteClinice.length)] : null,
          parameters: {
            sedute: therapyType.defaultSessions,
            intensita: Math.floor(Math.random() * 10) + 1,
            durata: therapyType.defaultDuration,
          },
        },
      });
      therapies.push(therapy);
    }

    console.log(`✅ Create ${therapies.length} terapie`);

    // 6. Creazione Sedute Terapeutiche (50 sedute)
    console.log('📅 Creazione sedute terapeutiche...');
    const sessions = [];
    
    for (let i = 0; i < 50; i++) {
      const therapy = therapies[Math.floor(Math.random() * therapies.length)];
      const terapista = terapisti[Math.floor(Math.random() * terapisti.length)];
      const dataSessione = randomDate(new Date(therapy.startDate), new Date());
      
      const session = await prisma.therapySession.create({
        data: {
          therapyId: therapy.id,
          therapistId: terapista.id,
          sessionNumber: Math.floor(Math.random() * 10) + 1,
          sessionDate: dataSessione,
          duration: therapyTypes.find(t => t.id === therapy.therapyTypeId)?.defaultDuration || 30,
          status: ['SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED'][Math.floor(Math.random() * 4)],
          vasScoreBefore: Math.floor(Math.random() * 10),
          vasScoreAfter: Math.floor(Math.random() * 8),
          notes: Math.random() > 0.5 ? noteClinice[Math.floor(Math.random() * noteClinice.length)] : null,
          variations: Math.random() > 0.7 ? 'Variazione: ' + ['Ridotta intensità', 'Aumentata durata', 'Modificato distretto', 'Aggiunto esercizio'][Math.floor(Math.random() * 4)] : null,
          parameters: {
            intensita: Math.floor(Math.random() * 10) + 1,
            durata: Math.floor(Math.random() * 30) + 15,
          },
          signedAt: Math.random() > 0.5 ? dataSessione : null,
        },
      });
      sessions.push(session);
    }

    console.log(`✅ Create ${sessions.length} sedute terapeutiche`);

    // 7. Creazione Documenti (30 documenti)
    console.log('📄 Creazione documenti...');
    const documents = [];
    
    for (let i = 0; i < 30; i++) {
      const record = clinicalRecords[Math.floor(Math.random() * clinicalRecords.length)];
      const tipoDocumento = ['Referto RX', 'Referto RMN', 'Referto ECO', 'Referto EMG', 'Prescrizione medica', 'Relazione specialistica', 'Esami del sangue'][Math.floor(Math.random() * 7)];
      
      const document = await prisma.document.create({
        data: {
          clinicalRecordId: record.id,
          fileName: `${tipoDocumento.replace(' ', '_')}_${i + 1}.pdf`,
          fileType: 'application/pdf',
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB - 5MB
          fileUrl: `/uploads/documents/${record.id}/${tipoDocumento.replace(' ', '_')}_${i + 1}.pdf`,
          description: tipoDocumento,
          uploadedBy: users[Math.floor(Math.random() * users.length)].id,
        },
      });
      documents.push(document);
    }

    console.log(`✅ Creati ${documents.length} documenti`);

    // Riepilogo finale
    console.log('\n✨ Popolamento database completato con successo!');
    console.log('📊 Riepilogo dati inseriti:');
    console.log(`   - ${users.length} Utenti (admin, medici, fisioterapisti)`);
    console.log(`   - ${patients.length} Pazienti`);
    console.log(`   - ${clinicalRecords.length} Cartelle cliniche`);
    console.log(`   - ${therapyTypes.length} Tipi di terapia`);
    console.log(`   - ${therapies.length} Terapie`);
    console.log(`   - ${sessions.length} Sedute terapeutiche`);
    console.log(`   - ${documents.length} Documenti`);
    
    console.log('\n🔑 Credenziali di accesso:');
    console.log('   Admin: admin@medicinaravenna.it / admin123');
    console.log('   Medici: dott.rossi@medicinaravenna.it / password123');
    console.log('   Fisioterapisti: ft.ferrari@medicinaravenna.it / password123');

  } catch (error) {
    console.error('❌ Errore durante il popolamento del database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });