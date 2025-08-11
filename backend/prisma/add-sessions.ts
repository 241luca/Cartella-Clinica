import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

async function addMoreSessions() {
  console.log('🔧 Aggiunta di sessioni alle terapie esistenti...\n');
  
  try {
    // Trova tutte le terapie
    const therapies = await prisma.therapy.findMany({
      include: {
        sessions: true
      }
    });
    
    console.log(`📊 Trovate ${therapies.length} terapie\n`);
    
    let totalSessionsCreated = 0;
    
    // Per ogni terapia, verifica se ha sessioni
    for (const therapy of therapies) {
      if (therapy.sessions.length === 0) {
        console.log(`➕ Aggiunta sessioni per terapia ${therapy.id}`);
        
        // Ottieni un terapista random
        const therapists = await prisma.user.findMany({
          where: { role: 'THERAPIST' }
        });
        
        if (therapists.length === 0) {
          console.log('❌ Nessun terapista trovato nel database');
          continue;
        }
        
        const therapist = therapists[Math.floor(Math.random() * therapists.length)];
        
        // Crea sessioni basate sul numero prescritto
        const numSessionsToCreate = Math.min(therapy.prescribedSessions, 10); // Max 10 sessioni per non sovraccaricare
        const today = new Date();
        
        for (let i = 0; i < numSessionsToCreate; i++) {
          const sessionDate = addDays(today, i * 2); // Una ogni 2 giorni
          sessionDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // Orario tra 9:00 e 17:00
          
          const isCompleted = i < therapy.completedSessions;
          
          await prisma.therapySession.create({
            data: {
              therapyId: therapy.id,
              therapistId: therapist.id,
              sessionNumber: i + 1,
              sessionDate,
              duration: 30,
              status: isCompleted ? 'COMPLETED' : 'SCHEDULED',
              vasScoreBefore: isCompleted ? Math.floor(Math.random() * 5) + 5 : null,
              vasScoreAfter: isCompleted ? Math.floor(Math.random() * 5) + 2 : null,
              notes: isCompleted ? `Seduta ${i + 1} completata regolarmente` : null,
            }
          });
          totalSessionsCreated++;
        }
        
        console.log(`   ✅ Create ${numSessionsToCreate} sessioni`);
      } else {
        console.log(`⏭️  Terapia ${therapy.id} ha già ${therapy.sessions.length} sessioni`);
      }
    }
    
    console.log(`\n✅ Totale sessioni create: ${totalSessionsCreated}`);
    
    // Verifica finale
    const finalCheck = await prisma.therapy.findMany({
      include: {
        _count: {
          select: { sessions: true }
        }
      }
    });
    
    const withSessions = finalCheck.filter(t => t._count.sessions > 0).length;
    const withoutSessions = finalCheck.filter(t => t._count.sessions === 0).length;
    
    console.log('\n📊 Statistiche finali:');
    console.log(`   - Terapie con sessioni: ${withSessions}`);
    console.log(`   - Terapie senza sessioni: ${withoutSessions}`);
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreSessions();
