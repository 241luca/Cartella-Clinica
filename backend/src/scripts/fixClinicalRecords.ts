import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixClinicalRecords() {
  console.log('\n🔧 Creazione Cartelle Cliniche\n');
  console.log('='.repeat(50));
  
  try {
    // Verifica cartelle esistenti
    const existingCount = await prisma.clinicalRecord.count();
    console.log(`📊 Cartelle cliniche esistenti: ${existingCount}`);
    
    if (existingCount === 0) {
      console.log('\n⚠️  Nessuna cartella trovata! Creazione in corso...\n');
      
      // Prendi tutti i pazienti
      const patients = await prisma.patient.findMany({
        take: 20
      });
      
      if (patients.length === 0) {
        console.log('❌ Nessun paziente trovato! Esegui prima il seed dei pazienti.');
        return;
      }
      
      // Prendi un utente medico/admin
      const doctor = await prisma.user.findFirst({
        where: {
          role: { in: ['ADMIN', 'DOCTOR'] }
        }
      });
      
      if (!doctor) {
        console.log('❌ Nessun medico trovato! Esegui prima il seed degli utenti.');
        return;
      }
      
      console.log(`👨‍⚕️ Medico trovato: ${doctor.firstName} ${doctor.lastName}`);
      console.log(`👥 Pazienti trovati: ${patients.length}`);
      
      // Array di diagnosi realistiche italiane
      const diagnosi = [
        'Lombalgia acuta',
        'Cervicalgia',
        'Distorsione caviglia destra',
        'Tendinite del sovraspinoso',
        'Sindrome del tunnel carpale',
        'Epicondilite laterale',
        'Sciatalgia',
        'Periartrite scapolo-omerale',
        'Gonartrosi bilaterale',
        'Fascite plantare',
        'Ernia discale L4-L5',
        'Lesione meniscale ginocchio sx',
        'Frattura composta radio distale',
        'Contrattura muscolare trapezio',
        'Borsite trocanterica'
      ];
      
      const sintomatologie = [
        'Dolore acuto nella regione lombare con limitazione funzionale',
        'Dolore cervicale con irradiazione al braccio destro',
        'Edema e dolore alla caviglia dopo trauma distorsivo',
        'Dolore alla spalla durante i movimenti di abduzione',
        'Parestesie e formicolio alle prime tre dita della mano',
        'Dolore al gomito durante la prensione',
        'Dolore irradiato lungo l\'arto inferiore destro',
        'Limitazione funzionale e dolore alla spalla',
        'Dolore bilaterale alle ginocchia, maggiore a dx',
        'Dolore plantare al risveglio',
        'Lombosciatalgia con deficit sensitivo',
        'Dolore e versamento articolare al ginocchio',
        'Dolore e limitazione funzionale post-traumatica',
        'Tensione muscolare e cefalea tensiva',
        'Dolore laterale all\'anca con zoppia'
      ];
      
      // Crea cartelle cliniche
      const records = [];
      for (let i = 0; i < Math.min(patients.length, 15); i++) {
        const patient = patients[i];
        const diagnosisIndex = i % diagnosi.length;
        
        // Genera date casuali
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60)); // Ultimi 60 giorni
        
        const acceptanceDate = new Date(createdDate);
        acceptanceDate.setDate(acceptanceDate.getDate() + 1);
        
        const record = await prisma.clinicalRecord.create({
          data: {
            patientId: patient.id,
            recordNumber: `CR-2024-${String(i + 1).padStart(4, '0')}`,
            acceptanceDate: acceptanceDate,
            diagnosis: diagnosi[diagnosisIndex],
            diagnosticDetails: `Paziente presenta ${sintomatologie[diagnosisIndex]}. Esame obiettivo evidenzia limitazione funzionale e dolore alla palpazione.`,
            symptomatology: sintomatologie[diagnosisIndex],
            objectiveExamination: 'Esame obiettivo: Paziente in buone condizioni generali. Deambulazione alterata. Dolore alla palpazione e limitazione del ROM.',
            instrumentalExams: i % 3 === 0 ? 'RX: negativo per fratture. RMN: evidenzia alterazioni degenerative' : undefined,
            interventionDate: i % 2 === 0 ? new Date() : undefined,
            interventionDoctor: i % 2 === 0 ? 'Dott. Mario Bianchi' : undefined,
            isActive: i > 2, // Le prime 3 sono chiuse
            closedAt: i <= 2 ? new Date() : undefined,
            createdById: doctor.id,
            createdAt: createdDate,
            updatedAt: new Date()
          }
        });
        
        records.push(record);
        console.log(`✅ Creata cartella ${record.recordNumber} per ${patient.firstName} ${patient.lastName}`);
      }
      
      console.log(`\n✨ Create ${records.length} cartelle cliniche!`);
      
    } else {
      console.log('\n✅ Cartelle cliniche già presenti nel database');
      
      // Mostra un esempio
      const sample = await prisma.clinicalRecord.findFirst({
        include: {
          patient: true,
          createdBy: true
        }
      });
      
      if (sample) {
        console.log('\n📋 Esempio cartella:');
        console.log(`   Numero: ${sample.recordNumber}`);
        console.log(`   Paziente: ${sample.patient.firstName} ${sample.patient.lastName}`);
        console.log(`   Diagnosi: ${sample.diagnosis}`);
        console.log(`   Creata da: ${sample.createdBy.firstName} ${sample.createdBy.lastName}`);
        console.log(`   Stato: ${sample.isActive ? 'APERTA' : 'CHIUSA'}`);
      }
    }
    
    // Verifica finale
    const finalCount = await prisma.clinicalRecord.count();
    const activeCount = await prisma.clinicalRecord.count({ where: { isActive: true } });
    const closedCount = await prisma.clinicalRecord.count({ where: { isActive: false } });
    
    console.log('\n📊 Riepilogo finale:');
    console.log(`   Totale cartelle: ${finalCount}`);
    console.log(`   Cartelle aperte: ${activeCount}`);
    console.log(`   Cartelle chiuse: ${closedCount}`);
    
  } catch (error) {
    console.error('\n❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixClinicalRecords();
