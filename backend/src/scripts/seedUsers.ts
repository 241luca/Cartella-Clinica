import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding utenti...');

  try {
    // Hash della password per l'admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crea utente admin se non esiste
    const adminEmail = 'admin@medicinaravenna.it';
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          username: 'admin',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Sistema',
          role: UserRole.ADMIN,
          isActive: true
        }
      });
      console.log('✅ Utente admin creato:', admin.email);
    } else {
      console.log('ℹ️ Utente admin già esistente');
      // Aggiorna la password se necessario
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword }
      });
      console.log('✅ Password admin aggiornata');
    }

    // Crea altri utenti di test
    const testUsers = [
      {
        email: 'medico@medicinaravenna.it',
        username: 'medico',
        password: 'medico123',
        firstName: 'Mario',
        lastName: 'Rossi',
        role: UserRole.DOCTOR
      },
      {
        email: 'terapista@medicinaravenna.it',
        username: 'terapista',
        password: 'terapista123',
        firstName: 'Laura',
        lastName: 'Bianchi',
        role: UserRole.THERAPIST
      },
      {
        email: 'receptionist@medicinaravenna.it',
        username: 'receptionist',
        password: 'reception123',
        firstName: 'Giulia',
        lastName: 'Verdi',
        role: UserRole.RECEPTIONIST
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPwd = await bcrypt.hash(userData.password, 10);
        const user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPwd,
            isActive: true
          }
        });
        console.log(`✅ Utente ${userData.role} creato:`, user.email);
      } else {
        console.log(`ℹ️ Utente ${userData.role} già esistente`);
      }
    }

    console.log('\n📋 Utenti disponibili per il login:');
    console.log('=====================================');
    console.log('Admin: admin@medicinaravenna.it / admin123');
    console.log('Medico: medico@medicinaravenna.it / medico123');
    console.log('Terapista: terapista@medicinaravenna.it / terapista123');
    console.log('Receptionist: receptionist@medicinaravenna.it / reception123');
    console.log('=====================================\n');

  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedUsers();
    console.log('✅ Seeding completato con successo!');
  } catch (error) {
    console.error('❌ Seeding fallito:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
