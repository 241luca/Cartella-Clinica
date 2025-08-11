import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 VERIFICA DATI DATABASE - MEDICINA RAVENNA\n');
  console.log('=' .repeat(60));

  try {
    // Conta record per ogni tabella
    const counts = {
      users: await prisma.user.count(),
      patients: await prisma.patient.count(),
      clinicalRecords: await prisma.clinicalRecord.count(),
      therapyTypes: await prisma.therapyType.count(),
      therapies: await prisma.therapy.count(),
      therapySessions: await prisma.therapySession.count(),
      documents: await prisma.document.count(),
    };

    console.log('\n📈 CONTEGGIO RECORD PER TABELLA:\n');
    console.log(`👤 Utenti:              ${counts.users.toString().padStart(4)} record`);
    console.log(`👥 Pazienti:            ${counts.patients.toString().padStart(4)} record`);
    console.log(`📁 Cartelle Cliniche:   ${counts.clinicalRecords.toString().padStart(4)} record`);
    console.log(`💊 Tipi di Terapia:     ${counts.therapyTypes.toString().padStart(4)} record`);
    console.log(`💉 Terapie:             ${counts.therapies.toString().padStart(4)} record`);
    console.log(`📅 Sedute:              ${counts.therapySessions.toString().padStart(4)} record`);
    console.log(`📄 Documenti:           ${counts.documents.toString().padStart(4)} record`);
    console.log('-'.repeat(30));
    console.log(`📊 TOTALE:              ${Object.values(counts).reduce((a, b) => a + b, 0).toString().padStart(4)} record`);

    // Dettagli utenti
    console.log('\n👤 DETTAGLIO UTENTI:\n');
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    
    for (const group of usersByRole) {
      console.log(`   ${group.role.padEnd(10)}: ${group._count} utenti`);
    }

    // Alcuni utenti esempio
    console.log('\n🔑 CREDENZIALI DI ACCESSO:\n');
    const sampleUsers = await prisma.user.findMany({
      take: 5,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    for (const user of sampleUsers) {
      console.log(`   ${user.email.padEnd(35)} (${user.firstName} ${user.lastName} - ${user.role})`);
    }
    console.log('\n   Password per tutti (tranne admin): password123');
    console.log('   Password admin: admin123');

    // Statistiche pazienti
    console.log('\n👥 STATISTICHE PAZIENTI:\n');
    const patientsWithRecords = await prisma.patient.count({
      where: {
        clinicalRecords: {
          some: {},
        },
      },
    });
    
    const patientsWithoutRecords = counts.patients - patientsWithRecords;
    
    console.log(`   Con cartelle cliniche:    ${patientsWithRecords} pazienti`);
    console.log(`   Senza cartelle cliniche:  ${patientsWithoutRecords} pazienti`);

    // Top diagnosi
    console.log('\n🏥 TOP 5 DIAGNOSI PIÙ FREQUENTI:\n');
    const diagnoses = await prisma.clinicalRecord.groupBy({
      by: ['diagnosis'],
      _count: true,
      orderBy: {
        _count: {
          diagnosis: 'desc',
        },
      },
      take: 5,
    });

    for (let i = 0; i < diagnoses.length; i++) {
      console.log(`   ${(i + 1)}. ${diagnoses[i].diagnosis.padEnd(35)} (${diagnoses[i]._count} casi)`);
    }

    // Terapie per tipo
    console.log('\n💊 TERAPIE PER TIPO:\n');
    const therapiesByType = await prisma.therapy.groupBy({
      by: ['therapyTypeId'],
      _count: true,
    });

    for (const group of therapiesByType) {
      const therapyType = await prisma.therapyType.findUnique({
        where: { id: group.therapyTypeId },
        select: { name: true },
      });
      if (therapyType) {
        console.log(`   ${therapyType.name.padEnd(25)}: ${group._count} terapie`);
      }
    }

    // Statistiche sedute
    console.log('\n📅 STATISTICHE SEDUTE:\n');
    const sessionsByStatus = await prisma.therapySession.groupBy({
      by: ['status'],
      _count: true,
    });

    for (const group of sessionsByStatus) {
      console.log(`   ${group.status.padEnd(15)}: ${group._count} sedute`);
    }

    // Miglioramento VAS medio
    const sessionsWithVAS = await prisma.therapySession.findMany({
      where: {
        AND: [
          { vasScoreBefore: { not: null } },
          { vasScoreAfter: { not: null } },
        ],
      },
      select: {
        vasScoreBefore: true,
        vasScoreAfter: true,
      },
    });

    if (sessionsWithVAS.length > 0) {
      const totalImprovement = sessionsWithVAS.reduce((acc, session) => {
        return acc + ((session.vasScoreBefore || 0) - (session.vasScoreAfter || 0));
      }, 0);
      const avgImprovement = totalImprovement / sessionsWithVAS.length;
      
      console.log(`\n📊 MIGLIORAMENTO VAS MEDIO: ${avgImprovement.toFixed(2)} punti`);
    }

    // Cartelle aperte vs chiuse
    console.log('\n📁 STATO CARTELLE CLINICHE:\n');
    const openRecords = await prisma.clinicalRecord.count({
      where: { closedAt: null },
    });
    const closedRecords = await prisma.clinicalRecord.count({
      where: { closedAt: { not: null } },
    });

    console.log(`   Aperte:  ${openRecords} cartelle`);
    console.log(`   Chiuse:  ${closedRecords} cartelle`);

    // Ultimi 5 pazienti registrati
    console.log('\n🆕 ULTIMI 5 PAZIENTI REGISTRATI:\n');
    const lastPatients = await prisma.patient.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        lastName: true,
        fiscalCode: true,
        city: true,
        createdAt: true,
      },
    });

    for (const patient of lastPatients) {
      const date = new Date(patient.createdAt).toLocaleDateString('it-IT');
      console.log(`   ${patient.firstName} ${patient.lastName} - ${patient.fiscalCode} (${patient.city}) - ${date}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICA COMPLETATA CON SUCCESSO!');
    console.log('Il database contiene dati realistici pronti per il testing.');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();