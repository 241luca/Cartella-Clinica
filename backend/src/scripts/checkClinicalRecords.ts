import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClinicalRecords() {
  console.log('\n📁 Verifica Cartelle Cliniche nel Database\n');
  console.log('='.repeat(50));
  
  try {
    // Conta totale
    const totalCount = await prisma.clinicalRecord.count();
    console.log(`\n✅ Totale cartelle cliniche: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('\n⚠️  Nessuna cartella clinica trovata!');
      console.log('Esegui: npm run seed:complete per popolare il database');
      return;
    }
    
    // Mostra alcune cartelle
    const records = await prisma.clinicalRecord.findMany({
      take: 5,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            fiscalCode: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        },
        _count: {
          select: {
            therapies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\n📋 Prime 5 cartelle cliniche:\n');
    records.forEach((record, index) => {
      console.log(`${index + 1}. Cartella #${record.recordNumber}`);
      console.log(`   Paziente: ${record.patient.firstName} ${record.patient.lastName}`);
      console.log(`   Diagnosi: ${record.diagnosis}`);
      console.log(`   Creata da: ${record.createdBy.firstName} ${record.createdBy.lastName} (${record.createdBy.role})`);
      console.log(`   Terapie: ${record._count.therapies}`);
      console.log(`   Stato: ${record.isActive ? 'APERTA' : 'CHIUSA'}`);
      console.log('   ---');
    });
    
    // Statistiche
    const activeCount = await prisma.clinicalRecord.count({
      where: { isActive: true }
    });
    
    const closedCount = await prisma.clinicalRecord.count({
      where: { isActive: false }
    });
    
    console.log('\n📊 Statistiche:');
    console.log(`   Cartelle aperte: ${activeCount}`);
    console.log(`   Cartelle chiuse: ${closedCount}`);
    
  } catch (error) {
    console.error('\n❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClinicalRecords();