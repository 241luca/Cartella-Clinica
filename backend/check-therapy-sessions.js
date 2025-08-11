const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Verifica dati nel database...\n');
    
    // Conta i record
    const therapyCount = await prisma.therapy.count();
    const sessionCount = await prisma.therapySession.count();
    
    console.log(`📊 Totale terapie: ${therapyCount}`);
    console.log(`📊 Totale sessioni: ${sessionCount}\n`);
    
    // Prendi una terapia con stato IN_PROGRESS o SCHEDULED
    const activeTherapy = await prisma.therapy.findFirst({
      where: {
        OR: [
          { status: 'IN_PROGRESS' },
          { status: 'SCHEDULED' }
        ]
      },
      include: {
        therapyType: true,
        clinicalRecord: {
          include: {
            patient: true
          }
        },
        sessions: {
          orderBy: { sessionNumber: 'asc' }
        }
      }
    });
    
    if (activeTherapy) {
      console.log('✅ Esempio di terapia attiva trovata:');
      console.log(`   ID: ${activeTherapy.id}`);
      console.log(`   Tipo: ${activeTherapy.therapyType.name}`);
      console.log(`   Paziente: ${activeTherapy.clinicalRecord.patient.firstName} ${activeTherapy.clinicalRecord.patient.lastName}`);
      console.log(`   Stato: ${activeTherapy.status}`);
      console.log(`   Sessioni prescritte: ${activeTherapy.prescribedSessions}`);
      console.log(`   Sessioni completate: ${activeTherapy.completedSessions}`);
      console.log(`   Numero di sessioni trovate: ${activeTherapy.sessions.length}`);
      
      if (activeTherapy.sessions.length > 0) {
        console.log('\n   📅 Prime 3 sessioni:');
        activeTherapy.sessions.slice(0, 3).forEach(session => {
          console.log(`   - Sessione #${session.sessionNumber}: ${session.sessionDate.toLocaleDateString()} - Stato: ${session.status}`);
        });
      }
    }
    
    // Verifica se ci sono terapie senza sessioni
    const therapiesWithoutSessions = await prisma.therapy.findMany({
      where: {
        sessions: {
          none: {}
        }
      },
      select: {
        id: true,
        status: true
      }
    });
    
    console.log(`\n⚠️  Terapie senza sessioni: ${therapiesWithoutSessions.length}`);
    if (therapiesWithoutSessions.length > 0) {
      console.log('   Stati delle terapie senza sessioni:');
      const statusCounts = {};
      therapiesWithoutSessions.forEach(t => {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      });
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
