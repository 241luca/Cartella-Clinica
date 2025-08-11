import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSearch() {
  console.log('🔍 TEST RICERCA SUBSTRING ESATTA\n');
  console.log('=====================================\n');

  // Test queries
  const queries = ['rs', 'ross', 'mar', 'io ro', 'and'];

  for (const query of queries) {
    console.log(`\n📊 Ricerca: "${query}"`);
    console.log('-'.repeat(40));
    
    // Ottieni tutti i pazienti
    const allPatients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Filtra con la logica esatta
    const searchStr = query.toLowerCase();
    const filtered = allPatients.filter(patient => {
      const firstName = patient.firstName.toLowerCase();
      const lastName = patient.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const reverseName = `${lastName} ${firstName}`;
      const fiscalCode = patient.fiscalCode.toLowerCase();
      
      return (
        firstName.includes(searchStr) ||
        lastName.includes(searchStr) ||
        fullName.includes(searchStr) ||
        reverseName.includes(searchStr) ||
        fiscalCode.includes(searchStr)
      );
    });
    
    if (filtered.length > 0) {
      console.log(`✅ Trovati ${filtered.length} risultati:`);
      filtered.forEach(p => {
        const firstName = p.firstName.toLowerCase();
        const lastName = p.lastName.toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const reverseName = `${lastName} ${firstName}`;
        
        let foundIn = [];
        if (firstName.includes(searchStr)) foundIn.push('nome');
        if (lastName.includes(searchStr)) foundIn.push('cognome');
        if (fullName.includes(searchStr) && !firstName.includes(searchStr) && !lastName.includes(searchStr)) {
          foundIn.push('nome+cognome');
        }
        
        console.log(`   - ${p.firstName} ${p.lastName} (trovato in: ${foundIn.join(', ')})`);
      });
    } else {
      console.log('❌ Nessun risultato');
    }
  }
  
  console.log('\n=====================================');
  console.log('\n✅ Test completato!');
  console.log('\nRicorda:');
  console.log('- "rs" trova solo chi ha esattamente "rs" (Anderson, Lars, Carsten)');
  console.log('- "ross" trova solo chi ha esattamente "ross" (Rossi se presente)');
  console.log('- "io ro" trova "Mario Rossi" perché cerca nella stringa completa');
  
  await prisma.$disconnect();
}

testSearch().catch(console.error);
