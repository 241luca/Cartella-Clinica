import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestPatients() {
  try {
    // Aggiungi pazienti con 'rs' nel nome per testare la ricerca esatta
    const testPatients = [
      {
        firstName: 'Anderson',
        lastName: 'Smith',
        fiscalCode: 'NDRSMH85M01H501A',
        birthDate: new Date('1985-08-01'),
        birthPlace: 'Roma',
        gender: 'MALE' as const,
        address: 'Via Test 1',
        city: 'Ravenna',
        postalCode: '48121',
        privacyConsent: true
      },
      {
        firstName: 'Lars',
        lastName: 'Petersen',
        fiscalCode: 'LRSPTR90L15H501B',
        birthDate: new Date('1990-07-15'),
        birthPlace: 'Milano',
        gender: 'MALE' as const,
        address: 'Via Test 2',
        city: 'Ravenna',
        postalCode: '48121',
        privacyConsent: true
      },
      {
        firstName: 'Carsten',
        lastName: 'Nielsen',
        fiscalCode: 'CRSTNLS88D20H501C',
        birthDate: new Date('1988-04-20'),
        birthPlace: 'Bologna',
        gender: 'MALE' as const,
        address: 'Via Test 3',
        city: 'Ravenna',
        postalCode: '48121',
        privacyConsent: true
      },
      {
        firstName: 'Marson',
        lastName: 'Jones',
        fiscalCode: 'MRSJNS75T10H501D',
        birthDate: new Date('1975-12-10'),
        birthPlace: 'Firenze',
        gender: 'MALE' as const,
        address: 'Via Test 4',
        city: 'Ravenna',
        postalCode: '48121',
        privacyConsent: true
      }
    ];

    console.log('Aggiunta pazienti di test con "rs" nel nome...\n');

    for (const patient of testPatients) {
      const existing = await prisma.patient.findUnique({
        where: { fiscalCode: patient.fiscalCode }
      });
      
      if (!existing) {
        await prisma.patient.create({ data: patient });
        console.log(`✅ Creato: ${patient.firstName} ${patient.lastName}`);
      } else {
        console.log(`⏭️  Già esistente: ${patient.firstName} ${patient.lastName}`);
      }
    }
    
    console.log('\n📊 Test ricerca "rs"...');
    const withRs = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: 'rs', mode: 'insensitive' } },
          { lastName: { contains: 'rs', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`Trovati ${withRs.length} pazienti con "rs":`);
    withRs.forEach(p => console.log(`  - ${p.firstName} ${p.lastName} (rs in: ${
      p.firstName.toLowerCase().includes('rs') ? 'nome' : 'cognome'
    })`));
    
    console.log('\n📊 Test ricerca "ross" (NON dovrebbe trovare nulla se non ci sono Rossi)...');
    const withRoss = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: 'ross', mode: 'insensitive' } },
          { lastName: { contains: 'ross', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`Trovati ${withRoss.length} pazienti con "ross":`);
    withRoss.forEach(p => console.log(`  - ${p.firstName} ${p.lastName}`));
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestPatients();
