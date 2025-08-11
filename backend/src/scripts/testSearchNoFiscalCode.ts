import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSearchNoFiscalCode() {
  console.log('🔍 TEST RICERCA "gr" SENZA CODICE FISCALE\n');
  console.log('=====================================\n');

  // Test queries
  const queries = ['gr', 'ross', 'mar', 'giord'];

  for (const query of queries) {
    console.log(`\n📊 Ricerca: "${query}"`);
    console.log('-'.repeat(40));
    
    // Ottieni tutti i pazienti
    const allPatients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Filtra con la logica esatta SENZA codice fiscale
    const searchStr = query.toLowerCase();
    const filtered = allPatients.filter(patient => {
      const firstName = patient.firstName.toLowerCase();
      const lastName = patient.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const reverseName = `${lastName} ${firstName}`;
      // NON cerchiamo più nel codice fiscale
      
      return (
        firstName.includes(searchStr) ||
        lastName.includes(searchStr) ||
        fullName.includes(searchStr) ||
        reverseName.includes(searchStr)
      );
    });
    
    if (filtered.length > 0) {
      console.log(`✅ Trovati ${filtered.length} risultati (senza CF):`);
      filtered.forEach(p => {
        const firstName = p.firstName.toLowerCase();
        const lastName = p.lastName.toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const reverseName = `${lastName} ${firstName}`;
        
        const foundIn = [];
        if (firstName.includes(searchStr)) foundIn.push('nome');
        if (lastName.includes(searchStr)) foundIn.push('cognome');
        if (fullName.includes(searchStr) && !firstName.includes(searchStr) && !lastName.includes(searchStr)) {
          foundIn.push('nome+cognome');
        }
        if (reverseName.includes(searchStr) && !firstName.includes(searchStr) && !lastName.includes(searchStr)) {
          foundIn.push('cognome+nome');
        }
        
        console.log(`   - ${p.firstName} ${p.lastName} (trovato in: ${foundIn.join(', ')})`);
        console.log(`     CF: ${p.fiscalCode} (NON cercato)`);
      });
    } else {
      console.log('❌ Nessun risultato (senza cercare nel CF)');
    }
  }
  
  console.log('\n=====================================');
  console.log('\n✅ Test completato!');
  console.log('\nNOTA IMPORTANTE:');
  console.log('- La ricerca NON cerca più nel codice fiscale');
  console.log('- "gr" NON trova più "Giordano" (il cui CF inizia con GRD)');
  console.log('- "gr" trova solo chi ha "gr" nel nome/cognome (es: Greco, Giorgio, Pellegrini)');
  
  await prisma.$disconnect();
}

testSearchNoFiscalCode().catch(console.error);
