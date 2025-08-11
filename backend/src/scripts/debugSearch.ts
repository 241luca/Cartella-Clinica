import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSearch() {
  console.log('🔍 DEBUG RICERCA "gr"\n');
  console.log('=====================================\n');

  // Cerca pazienti con "gr"
  const patients = await prisma.patient.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Giordano', mode: 'insensitive' } },
        { lastName: { contains: 'Giordano', mode: 'insensitive' } },
        { lastName: { contains: 'Carmela', mode: 'insensitive' } },
        { firstName: { contains: 'Carmela', mode: 'insensitive' } },
      ]
    }
  });

  console.log('📊 Pazienti trovati con nome Giordano o Carmela:');
  patients.forEach(p => {
    const firstName = p.firstName.toLowerCase();
    const lastName = p.lastName.toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    const hasGr = firstName.includes('gr') || lastName.includes('gr') || fullName.includes('gr');
    
    console.log(`\n- ${p.firstName} ${p.lastName}`);
    console.log(`  Nome: "${firstName}" - contiene "gr": ${firstName.includes('gr')}`);
    console.log(`  Cognome: "${lastName}" - contiene "gr": ${lastName.includes('gr')}`);
    console.log(`  Nome completo: "${fullName}" - contiene "gr": ${fullName.includes('gr')}`);
    console.log(`  ✅ Dovrebbe apparire con ricerca "gr": ${hasGr}`);
  });

  // Cerca terapie collegate
  console.log('\n\n📊 Verifica terapie:');
  const therapies = await prisma.therapy.findMany({
    include: {
      clinicalRecord: {
        include: {
          patient: true
        }
      },
      therapyType: true
    },
    take: 10
  });

  therapies.forEach(t => {
    const patient = t.clinicalRecord.patient;
    const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const therapyTypeName = t.therapyType.name.toLowerCase();
    const notes = (t.notes || '').toLowerCase();
    const district = (t.district || '').toLowerCase();
    
    const searchStr = 'gr';
    const foundInPatient = patientName.includes(searchStr);
    const foundInType = therapyTypeName.includes(searchStr);
    const foundInNotes = notes.includes(searchStr);
    const foundInDistrict = district.includes(searchStr);
    
    if (foundInPatient || foundInType || foundInNotes || foundInDistrict) {
      console.log(`\n✅ Terapia ${t.therapyType.name} - Paziente: ${patient.firstName} ${patient.lastName}`);
      if (foundInPatient) console.log(`   Trovato in paziente: "${patientName}"`);
      if (foundInType) console.log(`   Trovato in tipo: "${therapyTypeName}"`);
      if (foundInNotes) console.log(`   Trovato in note: "${notes}"`);
      if (foundInDistrict) console.log(`   Trovato in distretto: "${district}"`);
    }
  });

  // Cerca cartelle cliniche
  console.log('\n\n📊 Verifica cartelle cliniche:');
  const records = await prisma.clinicalRecord.findMany({
    include: {
      patient: true
    },
    take: 10
  });

  records.forEach(r => {
    const patient = r.patient;
    const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const diagnosis = r.diagnosis.toLowerCase();
    const recordNumber = r.recordNumber.toLowerCase();
    
    const searchStr = 'gr';
    const foundInPatient = patientName.includes(searchStr);
    const foundInDiagnosis = diagnosis.includes(searchStr);
    const foundInRecord = recordNumber.includes(searchStr);
    
    if (foundInPatient || foundInDiagnosis || foundInRecord) {
      console.log(`\n✅ Cartella ${r.recordNumber} - Paziente: ${patient.firstName} ${patient.lastName}`);
      if (foundInPatient) console.log(`   Trovato in paziente: "${patientName}"`);
      if (foundInDiagnosis) console.log(`   Trovato in diagnosi: "${diagnosis}"`);
      if (foundInRecord) console.log(`   Trovato in numero: "${recordNumber}"`);
    }
  });

  await prisma.$disconnect();
}

debugSearch().catch(console.error);
