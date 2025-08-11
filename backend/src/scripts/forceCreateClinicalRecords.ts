import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceCreateClinicalRecords() {
  console.log('\n🔧 CREAZIONE FORZATA Cartelle Cliniche\n');
  console.log('='.repeat(50));
  
  try {
    // Prima elimina eventuali cartelle esistenti
    console.log('🗑️  Eliminazione cartelle esistenti...');
    await prisma.clinicalRecord.deleteMany({});
    console.log('✅ Cartelle eliminate\n');
    
    // Prendi i pazienti
    const patients = await prisma.patient.findMany({
      take: 15
    });
    
    if (patients.length === 0) {
      console.log('❌ ERRORE: Nessun paziente nel database!');
      console.log('Impossibile creare cartelle senza pazienti.');
      return;
    }
    
    console.log(`👥 Pazienti trovati: ${patients.length}`);
    
    // Prendi o crea un utente medico
    let doctor = await prisma.user.findFirst({
      where: {
        role: { in: ['ADMIN', 'DOCTOR'] }
      }
    });
    
    if (!doctor) {
      console.log('⚠️  Nessun medico trovato. Creazione medico di default...');
      doctor = await prisma.user.create({
        data: {
          email: 'medico@clinic.com',
          password: '$2a$10$X7qZvLhHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXHXH', // password: medico123
          firstName: 'Mario',
          lastName: 'Rossi',
          role: 'DOCTOR',
          isActive: true
        }
      });
      console.log('✅ Medico creato');
    }
    
    console.log(`👨‍⚕️ Medico: ${doctor.firstName} ${doctor.lastName} (${doctor.role})\n`);
    
    // Array di diagnosi realistiche
    const diagnosi = [
      'Lombalgia acuta',
      'Cervicalgia cronica',
      'Distorsione caviglia destra',
      'Tendinite sovraspinoso',
      'Sindrome tunnel carpale',
      'Epicondilite laterale',
      'Sciatalgia L5-S1',
      'Periartrite scapolo-omerale',
      'Gonartrosi bilaterale',
      'Fascite plantare',
      'Ernia discale L4-L5',
      'Lesione meniscale',
      'Frattura radio distale',
      'Contrattura trapezio',
      'Borsite trocanterica'
    ];
    
    // Crea le cartelle
    console.log('📝 Creazione cartelle cliniche...\n');
    
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const diagnosis = diagnosi[i % diagnosi.length];
      
      const record = await prisma.clinicalRecord.create({
        data: {
          patientId: patient.id,
          recordNumber: `REC-2024-${String(i + 1).padStart(4, '0')}`,
          acceptanceDate: new Date(),
          diagnosis: diagnosis,
          diagnosticDetails: `Dettagli per ${diagnosis}`,
          symptomatology: `Sintomatologia tipica di ${diagnosis}`,
          objectiveExamination: 'Esame obiettivo nella norma',
          isActive: i > 3, // Le prime 4 sono chiuse
          createdById: doctor.id
        }
      });
      
      console.log(`✅ Cartella ${record.recordNumber} - ${patient.firstName} ${patient.lastName} - ${diagnosis}`);
    }
    
    // Verifica finale
    const total = await prisma.clinicalRecord.count();
    console.log(`\n✨ COMPLETATO! Create ${total} cartelle cliniche`);
    
  } catch (error) {
    console.error('\n❌ ERRORE:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceCreateClinicalRecords();
