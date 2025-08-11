import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('\n🔍 Verifica Utenti nel Database\n');
  console.log('='.repeat(50));
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
    
    console.log(`\n👥 Totale utenti: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ruolo: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log('   ---');
    });
    
    const doctors = users.filter(u => u.role === 'DOCTOR' || u.role === 'ADMIN');
    console.log(`\n✅ Medici/Admin disponibili: ${doctors.length}`);
    
    if (doctors.length > 0) {
      console.log('\n🩺 Primo medico disponibile:');
      console.log(`   ${doctors[0].firstName} ${doctors[0].lastName} (${doctors[0].role})`);
    }
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
