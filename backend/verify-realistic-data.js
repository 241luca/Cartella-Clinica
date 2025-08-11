const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyRealisticData() {
  console.log('\n🔍 VERIFICA DATI REALISTICI NEL DATABASE\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Conta i record totali
    const counts = {
      patients: await prisma.patient.count(),
      clinicalRecords: await prisma.clinicalRecord.count(),
      therapies: await prisma.therapy.count(),
      sessions: await prisma.therapySession.count(),
      users: await prisma.user.count(),
      therapyTypes: await prisma.therapyType.count(),
    };
    
    console.log('\n📊 CONTEGGI TOTALI:');
    console.log(`├─ Pazienti: ${counts.patients}`);
    console.log(`├─ Cartelle cliniche: ${counts.clinicalRecords}`);
    console.log(`├─ Terapie: ${counts.therapies}`);
    console.log(`├─ Sessioni: ${counts.sessions}`);
    console.log(`├─ Utenti sistema: ${counts.users}`);
    console.log(`└─ Tipi di terapia: ${counts.therapyTypes}`);
    
    // 2. Verifica una terapia esempio con sessioni sequenziali
    console.log('\n🔬 ESEMPIO TERAPIA CON SESSIONI SEQUENZIALI:');
    console.log('-'.repeat(60));
    
    const exampleTherapy = await prisma.therapy.findFirst({
      where: {
        status: 'IN_PROGRESS',
        prescribedSessions: { gte: 10 }
      },
      include: {
        therapyType: true,
        clinicalRecord: {
          include: {
            patient: true
          }
        },
        sessions: {
          orderBy: { sessionNumber: 'asc' },
          take: 10
        }
      }
    });
    
    if (exampleTherapy) {
      console.log(`\nPAZIENTE: ${exampleTherapy.clinicalRecord.patient.firstName} ${exampleTherapy.clinicalRecord.patient.lastName}`);
      console.log(`TERAPIA: ${exampleTherapy.therapyType.name}`);
      console.log(`STATO: ${exampleTherapy.status}`);
      console.log(`SESSIONI: ${exampleTherapy.completedSessions}/${exampleTherapy.prescribedSessions} completate`);
      console.log(`FREQUENZA: ${exampleTherapy.frequency}`);
      
      console.log('\nDETTAGLIO PRIME 10 SESSIONI:');
      console.log('N°  | Data       | Stato      | VAS Pre | VAS Post | Miglioramento');
      console.log('-'.repeat(70));
      
      exampleTherapy.sessions.forEach(session => {
        const date = session.sessionDate.toLocaleDateString('it-IT');
        const improvement = session.vasScoreBefore && session.vasScoreAfter 
          ? session.vasScoreBefore - session.vasScoreAfter 
          : '-';
        
        console.log(
          `${session.sessionNumber.toString().padStart(3)} | ` +
          `${date.padEnd(10)} | ` +
          `${session.status.padEnd(10)} | ` +
          `${(session.vasScoreBefore || '-').toString().padStart(7)} | ` +
          `${(session.vasScoreAfter || '-').toString().padStart(8)} | ` +
          `${improvement.toString().padStart(13)}`
        );
      });
    }
    
    // 3. Statistiche VAS
    console.log('\n📈 ANALISI VAS SCORE:');
    console.log('-'.repeat(60));
    
    const completedSessionsWithVAS = await prisma.therapySession.findMany({
      where: {
        status: 'COMPLETED',
        vasScoreBefore: { not: null },
        vasScoreAfter: { not: null }
      },
      select: {
        vasScoreBefore: true,
        vasScoreAfter: true,
        sessionNumber: true
      },
      take: 100
    });
    
    if (completedSessionsWithVAS.length > 0) {
      const avgImprovement = completedSessionsWithVAS.reduce((sum, s) => 
        sum + ((s.vasScoreBefore || 0) - (s.vasScoreAfter || 0)), 0
      ) / completedSessionsWithVAS.length;
      
      const avgVASBefore = completedSessionsWithVAS.reduce((sum, s) => 
        sum + (s.vasScoreBefore || 0), 0
      ) / completedSessionsWithVAS.length;
      
      const avgVASAfter = completedSessionsWithVAS.reduce((sum, s) => 
        sum + (s.vasScoreAfter || 0), 0
      ) / completedSessionsWithVAS.length;
      
      console.log(`├─ Sessioni analizzate: ${completedSessionsWithVAS.length}`);
      console.log(`├─ VAS medio PRE trattamento: ${avgVASBefore.toFixed(1)}`);
      console.log(`├─ VAS medio POST trattamento: ${avgVASAfter.toFixed(1)}`);
      console.log(`└─ Miglioramento medio per seduta: ${avgImprovement.toFixed(1)} punti`);
    }
    
    // 4. Distribuzione stati terapie
    console.log('\n📊 DISTRIBUZIONE STATI TERAPIE:');
    console.log('-'.repeat(60));
    
    const therapyStatuses = await prisma.therapy.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    therapyStatuses.forEach(status => {
      const percentage = ((status._count.status / counts.therapies) * 100).toFixed(1);
      console.log(`├─ ${status.status.padEnd(15)}: ${status._count.status.toString().padStart(3)} (${percentage}%)`);
    });
    
    // 5. Verifica sequenzialità
    console.log('\n✅ VERIFICA SEQUENZIALITÀ SESSIONI:');
    console.log('-'.repeat(60));
    
    const randomTherapies = await prisma.therapy.findMany({
      take: 5,
      include: {
        sessions: {
          orderBy: { sessionNumber: 'asc' }
        }
      }
    });
    
    let allSequential = true;
    randomTherapies.forEach(therapy => {
      let isSequential = true;
      for (let i = 0; i < therapy.sessions.length; i++) {
        if (therapy.sessions[i].sessionNumber !== i + 1) {
          isSequential = false;
          allSequential = false;
          break;
        }
      }
      console.log(`├─ Terapia ${therapy.id.substring(0, 8)}...: ${isSequential ? '✅ Sequenziale' : '❌ NON sequenziale'} (${therapy.sessions.length} sessioni)`);
    });
    
    if (allSequential) {
      console.log('└─ 🎉 Tutte le terapie verificate hanno sessioni sequenziali!');
    }
    
    // 6. Top diagnosi
    console.log('\n🏥 TOP 5 DIAGNOSI PIÙ FREQUENTI:');
    console.log('-'.repeat(60));
    
    const topDiagnoses = await prisma.clinicalRecord.groupBy({
      by: ['diagnosis'],
      _count: {
        diagnosis: true
      },
      orderBy: {
        _count: {
          diagnosis: 'desc'
        }
      },
      take: 5
    });
    
    topDiagnoses.forEach((diag, index) => {
      console.log(`${index + 1}. ${diag.diagnosis} (${diag._count.diagnosis} casi)`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICA COMPLETATA CON SUCCESSO!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyRealisticData();
