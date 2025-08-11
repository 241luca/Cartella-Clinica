import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log('🔍 Test connessione database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    // Testa la connessione
    await prisma.$connect();
    console.log('✅ Connessione al database riuscita!');
    
    // Conta gli utenti
    const userCount = await prisma.user.count();
    console.log(`👥 Utenti nel database: ${userCount}`);
    
    // Conta i pazienti
    const patientCount = await prisma.patient.count();
    console.log(`🏥 Pazienti nel database: ${patientCount}`);
    
    // Conta i tipi di terapia
    const therapyTypeCount = await prisma.therapyType.count();
    console.log(`💊 Tipi di terapia: ${therapyTypeCount}`);
    
    // Verifica se c'è l'utente admin
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@medicinaravenna.it' },
      select: { id: true, email: true, role: true },
    });
    
    if (admin) {
      console.log('✅ Utente admin trovato:', admin.email);
    } else {
      console.log('❌ Utente admin non trovato');
    }
    
  } catch (error) {
    console.error('❌ Errore connessione database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnesso dal database');
  }
}

testConnection();
