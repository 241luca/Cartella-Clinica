import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testSystem() {
  console.log('🧪 INIZIO TEST COMPLETO DEL SISTEMA');
  console.log('=====================================\n');

  try {
    // 1. Test Connessione Database
    console.log('1️⃣ Test Connessione Database...');
    await prisma.$connect();
    console.log('✅ Database connesso correttamente\n');

    // 2. Verifica Utenti
    console.log('2️⃣ Verifica Utenti...');
    const users = await prisma.user.findMany();
    console.log(`   Trovati ${users.length} utenti`);
    
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@medicinaravenna.it' }
    });
    
    if (admin) {
      console.log('✅ Admin trovato:', admin.email);
      // Test password
      const validPassword = await bcrypt.compare('admin123', admin.password);
      console.log(`   Password admin valida: ${validPassword ? '✅' : '❌'}`);
    } else {
      console.log('❌ Admin NON trovato!');
    }
    console.log('');

    // 3. Verifica Pazienti
    console.log('3️⃣ Verifica Pazienti...');
    const patients = await prisma.patient.findMany();
    console.log(`   Trovati ${patients.length} pazienti`);
    if (patients.length > 0) {
      console.log(`   Primo paziente: ${patients[0].firstName} ${patients[0].lastName}`);
    }
    console.log('');

    // 4. Verifica Cartelle Cliniche
    console.log('4️⃣ Verifica Cartelle Cliniche...');
    const clinicalRecords = await prisma.clinicalRecord.findMany({
      include: {
        patient: true,
        _count: {
          select: { therapies: true }
        }
      }
    });
    console.log(`   Trovate ${clinicalRecords.length} cartelle cliniche`);
    
    const openRecords = clinicalRecords.filter(r => r.status === 'OPEN');
    console.log(`   Cartelle aperte: ${openRecords.length}`);
    console.log(`   Cartelle chiuse: ${clinicalRecords.length - openRecords.length}`);
    
    if (clinicalRecords.length > 0) {
      const recordWithTherapies = clinicalRecords.filter(r => r._count.therapies > 0);
      console.log(`   Cartelle con terapie: ${recordWithTherapies.length}`);
    }
    console.log('');

    // 5. Verifica Tipi di Terapia
    console.log('5️⃣ Verifica Tipi di Terapia...');
    const therapyTypes = await prisma.therapyType.findMany();
    console.log(`   Trovati ${therapyTypes.length} tipi di terapia`);
    
    if (therapyTypes.length === 0) {
      console.log('⚠️  ATTENZIONE: Nessun tipo di terapia nel database!');
      console.log('   Inizializzo i tipi di terapia...');
      
      // Inizializza i tipi
      const defaultTypes = [
        { code: 'MAGNETOTERAPIA', name: 'Magnetoterapia', category: 'INSTRUMENTAL', defaultDuration: 30, defaultSessions: 10 },
        { code: 'LASER_YAG', name: 'Laser YAG 145', category: 'INSTRUMENTAL', defaultDuration: 20, defaultSessions: 8 },
        { code: 'LASER_810_980', name: 'Laser 810+980', category: 'INSTRUMENTAL', defaultDuration: 20, defaultSessions: 8 },
        { code: 'LASER_SCANNER', name: 'Laser Scanner', category: 'INSTRUMENTAL', defaultDuration: 15, defaultSessions: 8 },
        { code: 'TENS', name: 'TENS', category: 'INSTRUMENTAL', defaultDuration: 30, defaultSessions: 10 },
        { code: 'ULTRASUONI', name: 'Ultrasuoni', category: 'INSTRUMENTAL', defaultDuration: 20, defaultSessions: 10 },
        { code: 'ELETTROSTIMOLAZIONE', name: 'Elettrostimolazione', category: 'INSTRUMENTAL', defaultDuration: 30, defaultSessions: 10 },
        { code: 'TECARSIN', name: 'Tecarsin', category: 'INSTRUMENTAL', defaultDuration: 30, defaultSessions: 8 },
        { code: 'MASSOTERAPIA', name: 'Massoterapia', category: 'MANUAL', defaultDuration: 30, defaultSessions: 10 },
        { code: 'MOBILIZZAZIONI', name: 'Mobilizzazioni', category: 'MANUAL', defaultDuration: 30, defaultSessions: 10 },
        { code: 'LINFATERAPY', name: 'Linfaterapy', category: 'MANUAL', defaultDuration: 45, defaultSessions: 10 },
        { code: 'SIT', name: 'SIT', category: 'SPECIAL', defaultDuration: 30, defaultSessions: 5 },
        { code: 'TECALAB', name: 'Tecalab', category: 'SPECIAL', defaultDuration: 60, defaultSessions: 12 }
      ];

      for (const type of defaultTypes) {
        await prisma.therapyType.create({
          data: {
            ...type,
            description: `Terapia ${type.name}`,
            parametersSchema: {}
          }
        });
      }
      
      const newTypes = await prisma.therapyType.findMany();
      console.log(`✅ Creati ${newTypes.length} tipi di terapia`);
    } else {
      console.log('✅ Tipi di terapia già presenti:');
      therapyTypes.forEach(t => {
        console.log(`   - ${t.name} (${t.category})`);
      });
    }
    console.log('');

    // 6. Verifica Terapie
    console.log('6️⃣ Verifica Terapie...');
    const therapies = await prisma.therapy.findMany({
      include: {
        therapyType: true,
        clinicalRecord: {
          include: { patient: true }
        },
        _count: {
          select: { sessions: true }
        }
      }
    });
    console.log(`   Trovate ${therapies.length} terapie`);
    
    if (therapies.length > 0) {
      const activeTherapies = therapies.filter(t => t.status === 'IN_PROGRESS');
      console.log(`   Terapie attive: ${activeTherapies.length}`);
      console.log(`   Terapie completate: ${therapies.filter(t => t.status === 'COMPLETED').length}`);
      
      // Mostra dettagli prima terapia
      const firstTherapy = therapies[0];
      console.log(`\n   Esempio terapia:`);
      console.log(`   - Paziente: ${firstTherapy.clinicalRecord.patient.firstName} ${firstTherapy.clinicalRecord.patient.lastName}`);
      console.log(`   - Tipo: ${firstTherapy.therapyType.name}`);
      console.log(`   - Sedute: ${firstTherapy.completedSessions}/${firstTherapy.prescribedSessions}`);
      console.log(`   - Sessioni registrate: ${firstTherapy._count.sessions}`);
    }
    console.log('');

    // 7. Verifica Sessioni
    console.log('7️⃣ Verifica Sessioni Terapeutiche...');
    const sessions = await prisma.therapySession.findMany();
    console.log(`   Trovate ${sessions.length} sessioni`);
    
    if (sessions.length > 0) {
      const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
      console.log(`   Sessioni completate: ${completedSessions.length}`);
      console.log(`   Sessioni programmate: ${sessions.filter(s => s.status === 'SCHEDULED').length}`);
      
      // Verifica VAS scores
      const withVAS = sessions.filter(s => s.vasScoreBefore !== null || s.vasScoreAfter !== null);
      console.log(`   Sessioni con VAS score: ${withVAS.length}`);
    }
    console.log('');

    // 8. Report Finale
    console.log('📊 REPORT FINALE');
    console.log('================');
    
    const systemHealth = {
      database: true,
      users: users.length > 0,
      admin: !!admin,
      patients: patients.length > 0,
      clinicalRecords: clinicalRecords.length > 0,
      therapyTypes: therapyTypes.length > 0 || (await prisma.therapyType.findMany()).length > 0,
      therapies: therapies.length > 0,
      sessions: sessions.length > 0
    };

    const healthScore = Object.values(systemHealth).filter(v => v).length;
    const totalChecks = Object.keys(systemHealth).length;
    const percentage = Math.round((healthScore / totalChecks) * 100);

    console.log(`\n🏥 STATO SISTEMA: ${percentage}% OPERATIVO`);
    console.log('');
    
    Object.entries(systemHealth).forEach(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      console.log(`${value ? '✅' : '❌'} ${label}`);
    });

    if (percentage === 100) {
      console.log('\n🎉 SISTEMA COMPLETAMENTE OPERATIVO!');
    } else if (percentage >= 75) {
      console.log('\n✅ Sistema operativo con alcune mancanze');
    } else if (percentage >= 50) {
      console.log('\n⚠️ Sistema parzialmente operativo');
    } else {
      console.log('\n❌ Sistema non operativo - necessaria configurazione');
    }

    // Suggerimenti
    if (!systemHealth.therapyTypes) {
      console.log('\n💡 Suggerimento: Esegui inizializzazione tipi terapia');
    }
    if (!systemHealth.therapies || !systemHealth.sessions) {
      console.log('\n💡 Suggerimento: Crea alcune terapie di test dal frontend');
    }

  } catch (error) {
    console.error('❌ ERRORE DURANTE IL TEST:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🏁 TEST COMPLETATO');
  }
}

// Esegui il test
testSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
