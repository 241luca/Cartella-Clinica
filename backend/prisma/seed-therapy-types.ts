import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTherapyTypes() {
  console.log('🌱 Seeding therapy types...');

  const therapyTypes = [
    {
      code: 'TENS',
      name: 'TENS (Transcutaneous Electrical Nerve Stimulation)',
      category: 'ELETTROTERAPIA',
      description: 'Elettroterapia antalgica per il controllo del dolore',
      defaultDuration: 20,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        intensity: { type: 'string', label: 'Intensità (mA)' },
        frequency: { type: 'string', label: 'Frequenza (Hz)' },
        pulseWidth: { type: 'string', label: 'Larghezza impulso' }
      }
    },
    {
      code: 'LASER',
      name: 'Laser Yag',
      category: 'LASERTERAPIA',
      description: 'Terapia laser ad alta potenza per patologie muscoloscheletriche',
      defaultDuration: 15,
      defaultSessions: 8,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        power: { type: 'string', label: 'Potenza (W)' },
        frequency: { type: 'string', label: 'Frequenza (Hz)' },
        dose: { type: 'string', label: 'Dose (J/cm²)' }
      }
    },
    {
      code: 'TECAR',
      name: 'Tecarterapia',
      category: 'DIATERMIA',
      description: 'Terapia endogena che riattiva i processi riparativi',
      defaultDuration: 30,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        mode: { type: 'string', label: 'Modalità (Capacitivo/Resistivo)' },
        power: { type: 'string', label: 'Potenza (%)' },
        frequency: { type: 'string', label: 'Frequenza (kHz)' }
      }
    },
    {
      code: 'US',
      name: 'Ultrasuoni',
      category: 'ULTRASUONOTERAPIA',
      description: 'Terapia con onde sonore ad alta frequenza',
      defaultDuration: 10,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        intensity: { type: 'string', label: 'Intensità (W/cm²)' },
        frequency: { type: 'string', label: 'Frequenza (MHz)' },
        mode: { type: 'string', label: 'Modalità (Continuo/Pulsato)' }
      }
    },
    {
      code: 'MAGNET',
      name: 'Magnetoterapia',
      category: 'MAGNETOTERAPIA',
      description: 'Terapia con campi magnetici pulsati',
      defaultDuration: 30,
      defaultSessions: 15,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        intensity: { type: 'string', label: 'Intensità (Gauss)' },
        frequency: { type: 'string', label: 'Frequenza (Hz)' },
        waveform: { type: 'string', label: 'Forma d\'onda' }
      }
    },
    {
      code: 'MASSAGE',
      name: 'Massoterapia',
      category: 'TERAPIA_MANUALE',
      description: 'Massaggio terapeutico manuale',
      defaultDuration: 45,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: false,
      parametersSchema: {
        type: { type: 'string', label: 'Tipo massaggio' },
        pressure: { type: 'string', label: 'Pressione' },
        technique: { type: 'string', label: 'Tecnica' }
      }
    },
    {
      code: 'IONO',
      name: 'Ionoforesi',
      category: 'ELETTROTERAPIA',
      description: 'Somministrazione di farmaci attraverso corrente continua',
      defaultDuration: 20,
      defaultSessions: 10,
      requiresDoctor: true,
      requiresEquipment: true,
      parametersSchema: {
        drug: { type: 'string', label: 'Farmaco' },
        intensity: { type: 'string', label: 'Intensità (mA)' },
        polarity: { type: 'string', label: 'Polarità' }
      }
    },
    {
      code: 'INFRARED',
      name: 'Infrarossi',
      category: 'TERMOTERAPIA',
      description: 'Terapia con raggi infrarossi',
      defaultDuration: 15,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        power: { type: 'string', label: 'Potenza (W)' },
        distance: { type: 'string', label: 'Distanza (cm)' }
      }
    },
    {
      code: 'EMS',
      name: 'Elettrostimolazione',
      category: 'ELETTROTERAPIA',
      description: 'Stimolazione elettrica muscolare',
      defaultDuration: 25,
      defaultSessions: 12,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        program: { type: 'string', label: 'Programma' },
        intensity: { type: 'string', label: 'Intensità (mA)' },
        frequency: { type: 'string', label: 'Frequenza (Hz)' }
      }
    },
    {
      code: 'CRYO',
      name: 'Crioterapia',
      category: 'TERMOTERAPIA',
      description: 'Terapia del freddo per ridurre infiammazione',
      defaultDuration: 10,
      defaultSessions: 8,
      requiresDoctor: false,
      requiresEquipment: true,
      parametersSchema: {
        temperature: { type: 'string', label: 'Temperatura (°C)' },
        method: { type: 'string', label: 'Metodo applicazione' }
      }
    },
    {
      code: 'KINESI',
      name: 'Kinesiterapia',
      category: 'TERAPIA_MANUALE',
      description: 'Riabilitazione attraverso il movimento',
      defaultDuration: 45,
      defaultSessions: 12,
      requiresDoctor: false,
      requiresEquipment: false,
      parametersSchema: {
        exercises: { type: 'array', label: 'Esercizi' },
        intensity: { type: 'string', label: 'Intensità' },
        repetitions: { type: 'string', label: 'Ripetizioni' }
      }
    },
    {
      code: 'LINFODREN',
      name: 'Linfodrenaggio',
      category: 'TERAPIA_MANUALE',
      description: 'Drenaggio linfatico manuale',
      defaultDuration: 60,
      defaultSessions: 10,
      requiresDoctor: false,
      requiresEquipment: false,
      parametersSchema: {
        technique: { type: 'string', label: 'Tecnica' },
        pressure: { type: 'string', label: 'Pressione' },
        direction: { type: 'string', label: 'Direzione' }
      }
    }
  ];

  for (const therapyType of therapyTypes) {
    await prisma.therapyType.upsert({
      where: { code: therapyType.code },
      update: therapyType,
      create: therapyType,
    });
    console.log(`✅ Created/Updated therapy type: ${therapyType.name}`);
  }

  console.log('✅ Therapy types seeded successfully!');
}

async function main() {
  try {
    await seedTherapyTypes();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
