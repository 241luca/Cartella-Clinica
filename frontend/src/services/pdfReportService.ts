import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Estendi il tipo jsPDF per includere autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface PatientData {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  phone?: string;
  mobile?: string;
  email?: string;
}

interface ClinicalRecordData {
  recordNumber: string;
  acceptanceDate: string;
  diagnosis: string;
  diagnosticDetails?: string;
  symptomatology?: string;
  objectiveExamination?: string;
  instrumentalExams?: string;
  interventionDate?: string;
  interventionDoctor?: string;
  closedAt?: string;
  closureNotes?: string;
  patient: PatientData;
  therapies?: any[];
  clinicalControls?: any[];
}

interface TherapyData {
  therapyType: {
    name: string;
    category: string;
  };
  prescribedSessions: number;
  completedSessions: number;
  frequency?: string;
  district?: string;
  startDate: string;
  endDate?: string;
  status: string;
  notes?: string;
  sessions?: any[];
}

class PDFReportService {
  private primaryColor = [41, 98, 255]; // RGB for blue
  private secondaryColor = [243, 244, 246]; // RGB for light gray
  
  // Genera report cartella clinica completo
  generateClinicalRecordReport(record: ClinicalRecordData): jsPDF {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    this.addHeader(doc);
    yPosition = 60;

    // Titolo
    doc.setFontSize(18);
    doc.setTextColor(41, 98, 255);
    doc.text('CARTELLA CLINICA', 105, yPosition, { align: 'center' });
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`N° ${record.recordNumber}`, 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Info Paziente
    this.addSectionTitle(doc, 'DATI PAZIENTE', yPosition);
    yPosition += 10;

    doc.autoTable({
      startY: yPosition,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 70 },
        2: { fontStyle: 'bold', cellWidth: 40 },
        3: { cellWidth: 50 },
      },
      body: [
        ['Nome:', `${record.patient.lastName} ${record.patient.firstName}`, 'Codice Fiscale:', record.patient.fiscalCode],
        ['Data di Nascita:', format(new Date(record.patient.birthDate), 'dd/MM/yyyy'), 'Sesso:', record.patient.gender === 'MALE' ? 'Maschio' : 'Femmina'],
        ['Indirizzo:', record.patient.address, 'Città:', record.patient.city],
        ['Telefono:', record.patient.phone || '-', 'Cellulare:', record.patient.mobile || '-'],
        ['Email:', record.patient.email || '-', '', ''],
      ],
    });
    yPosition = doc.lastAutoTable.finalY + 10;

    // Diagnosi
    this.addSectionTitle(doc, 'DIAGNOSI', yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const diagnosisText = this.splitText(doc, record.diagnosis, 180);
    diagnosisText.forEach((line: string) => {
      doc.text(line, 15, yPosition);
      yPosition += 5;
    });

    if (record.diagnosticDetails) {
      yPosition += 5;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Dettagli diagnostici:', 15, yPosition);
      yPosition += 5;
      const detailsText = this.splitText(doc, record.diagnosticDetails, 180);
      detailsText.forEach((line: string) => {
        doc.text(line, 15, yPosition);
        yPosition += 4;
      });
    }
    yPosition += 10;

    // Valutazione Clinica
    if (record.symptomatology || record.objectiveExamination) {
      this.addSectionTitle(doc, 'VALUTAZIONE CLINICA', yPosition);
      yPosition += 10;

      if (record.symptomatology) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Sintomatologia:', 15, yPosition);
        yPosition += 5;
        doc.setTextColor(0, 0, 0);
        const symptomText = this.splitText(doc, record.symptomatology, 180);
        symptomText.forEach((line: string) => {
          doc.text(line, 15, yPosition);
          yPosition += 4;
        });
        yPosition += 5;
      }

      if (record.objectiveExamination) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Esame obiettivo:', 15, yPosition);
        yPosition += 5;
        doc.setTextColor(0, 0, 0);
        const examText = this.splitText(doc, record.objectiveExamination, 180);
        examText.forEach((line: string) => {
          doc.text(line, 15, yPosition);
          yPosition += 4;
        });
      }
      yPosition += 10;
    }

    // Nuova pagina per terapie
    if (record.therapies && record.therapies.length > 0) {
      doc.addPage();
      this.addHeader(doc);
      yPosition = 60;

      this.addSectionTitle(doc, 'TERAPIE PRESCRITTE', yPosition);
      yPosition += 10;

      const therapyData = record.therapies.map((therapy: any) => [
        therapy.therapyType.name,
        this.getCategoryLabel(therapy.therapyType.category),
        `${therapy.completedSessions}/${therapy.prescribedSessions}`,
        therapy.frequency || '-',
        therapy.district || '-',
        this.getStatusLabel(therapy.status),
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Terapia', 'Tipo', 'Sedute', 'Frequenza', 'Distretto', 'Stato']],
        body: therapyData,
        theme: 'striped',
        headStyles: {
          fillColor: this.primaryColor,
          textColor: 255,
          fontSize: 10,
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
      });
      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Controlli clinici
    if (record.clinicalControls && record.clinicalControls.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        this.addHeader(doc);
        yPosition = 60;
      }

      this.addSectionTitle(doc, 'CONTROLLI CLINICI', yPosition);
      yPosition += 10;

      record.clinicalControls.forEach((control: any) => {
        doc.setFontSize(9);
        doc.setTextColor(41, 98, 255);
        doc.text(format(new Date(control.controlDate), 'dd/MM/yyyy'), 15, yPosition);
        yPosition += 5;
        doc.setTextColor(0, 0, 0);
        const noteText = this.splitText(doc, control.notes, 180);
        noteText.forEach((line: string) => {
          doc.text(line, 15, yPosition);
          yPosition += 4;
        });
        yPosition += 5;
      });
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  // Genera report terapia con sedute
  generateTherapyReport(therapy: TherapyData, patient: PatientData): jsPDF {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    this.addHeader(doc);
    yPosition = 60;

    // Titolo
    doc.setFontSize(18);
    doc.setTextColor(41, 98, 255);
    doc.text('REPORT TERAPIA', 105, yPosition, { align: 'center' });
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(therapy.therapyType.name, 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Info Paziente (compatta)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Paziente: ${patient.lastName} ${patient.firstName} - CF: ${patient.fiscalCode}`, 15, yPosition);
    yPosition += 10;

    // Info Terapia
    this.addSectionTitle(doc, 'DETTAGLI TERAPIA', yPosition);
    yPosition += 10;

    doc.autoTable({
      startY: yPosition,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 140 },
      },
      body: [
        ['Tipo:', this.getCategoryLabel(therapy.therapyType.category)],
        ['Sedute prescritte:', therapy.prescribedSessions.toString()],
        ['Sedute completate:', therapy.completedSessions.toString()],
        ['Frequenza:', therapy.frequency || '-'],
        ['Distretto:', therapy.district || '-'],
        ['Data inizio:', format(new Date(therapy.startDate), 'dd/MM/yyyy')],
        ['Data fine prevista:', therapy.endDate ? format(new Date(therapy.endDate), 'dd/MM/yyyy') : '-'],
        ['Stato:', this.getStatusLabel(therapy.status)],
      ],
    });
    yPosition = doc.lastAutoTable.finalY + 10;

    // Progress bar
    const progressPercent = (therapy.completedSessions / therapy.prescribedSessions) * 100;
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, yPosition, 180, 10);
    doc.setFillColor(41, 98, 255);
    doc.rect(15, yPosition, (180 * progressPercent) / 100, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${Math.round(progressPercent)}%`, 105, yPosition + 7, { align: 'center' });
    yPosition += 20;

    // Sedute
    if (therapy.sessions && therapy.sessions.length > 0) {
      this.addSectionTitle(doc, 'REGISTRO SEDUTE', yPosition);
      yPosition += 10;

      const sessionData = therapy.sessions.map((session: any, index: number) => [
        (index + 1).toString(),
        format(new Date(session.sessionDate), 'dd/MM/yyyy'),
        format(new Date(session.sessionDate), 'HH:mm'),
        `${session.duration} min`,
        session.vasScoreBefore ? `${session.vasScoreBefore} → ${session.vasScoreAfter || '-'}` : '-',
        this.getSessionStatusLabel(session.status),
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['#', 'Data', 'Ora', 'Durata', 'VAS', 'Stato']],
        body: sessionData,
        theme: 'striped',
        headStyles: {
          fillColor: this.primaryColor,
          textColor: 255,
          fontSize: 9,
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
        },
      });
    }

    // Note
    if (therapy.notes) {
      yPosition = doc.lastAutoTable.finalY + 10;
      this.addSectionTitle(doc, 'NOTE', yPosition);
      yPosition += 10;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const noteText = this.splitText(doc, therapy.notes, 180);
      noteText.forEach((line: string) => {
        doc.text(line, 15, yPosition);
        yPosition += 4;
      });
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  // Genera riepilogo paziente
  generatePatientSummary(patient: PatientData, records: ClinicalRecordData[]): jsPDF {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    this.addHeader(doc);
    yPosition = 60;

    // Titolo
    doc.setFontSize(18);
    doc.setTextColor(41, 98, 255);
    doc.text('SCHEDA PAZIENTE', 105, yPosition, { align: 'center' });
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`${patient.lastName} ${patient.firstName}`, 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Anagrafica
    this.addSectionTitle(doc, 'DATI ANAGRAFICI', yPosition);
    yPosition += 10;

    doc.autoTable({
      startY: yPosition,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 70 },
        2: { fontStyle: 'bold', cellWidth: 40 },
        3: { cellWidth: 50 },
      },
      body: [
        ['Codice Fiscale:', patient.fiscalCode, 'Data di Nascita:', format(new Date(patient.birthDate), 'dd/MM/yyyy')],
        ['Sesso:', patient.gender === 'MALE' ? 'Maschio' : 'Femmina', 'Età:', this.calculateAge(patient.birthDate) + ' anni'],
        ['Indirizzo:', patient.address, 'Città:', patient.city],
        ['Telefono:', patient.phone || '-', 'Cellulare:', patient.mobile || '-'],
        ['Email:', patient.email || '-', '', ''],
      ],
    });
    yPosition = doc.lastAutoTable.finalY + 15;

    // Storico Cartelle Cliniche
    if (records && records.length > 0) {
      this.addSectionTitle(doc, 'STORICO CARTELLE CLINICHE', yPosition);
      yPosition += 10;

      const recordData = records.map((record: ClinicalRecordData) => [
        record.recordNumber,
        format(new Date(record.acceptanceDate), 'dd/MM/yyyy'),
        record.diagnosis.substring(0, 40) + (record.diagnosis.length > 40 ? '...' : ''),
        record.closedAt ? format(new Date(record.closedAt), 'dd/MM/yyyy') : 'Aperta',
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Numero', 'Data Apertura', 'Diagnosi', 'Stato']],
        body: recordData,
        theme: 'striped',
        headStyles: {
          fillColor: this.primaryColor,
          textColor: 255,
          fontSize: 10,
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 35 },
          2: { cellWidth: 85 },
          3: { cellWidth: 30 },
        },
      });
      yPosition = doc.lastAutoTable.finalY + 10;

      // Riepilogo terapie totali
      let totalTherapies = 0;
      let completedTherapies = 0;
      records.forEach(record => {
        if (record.therapies) {
          totalTherapies += record.therapies.length;
          completedTherapies += record.therapies.filter((t: any) => t.status === 'COMPLETED').length;
        }
      });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Totale terapie: ${totalTherapies}`, 15, yPosition);
      yPosition += 5;
      doc.text(`Terapie completate: ${completedTherapies}`, 15, yPosition);
      yPosition += 5;
      doc.text(`Cartelle cliniche: ${records.length}`, 15, yPosition);
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  // Genera calendario sedute settimanale
  generateWeeklyCalendar(sessions: any[], startDate: Date): jsPDF {
    const doc = new jsPDF('landscape');
    let yPosition = 20;

    // Header
    this.addHeaderLandscape(doc);
    yPosition = 50;

    // Titolo
    doc.setFontSize(16);
    doc.setTextColor(41, 98, 255);
    const weekEnd = new Date(startDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    doc.text(
      `CALENDARIO SEDUTE - ${format(startDate, 'dd/MM', { locale: it })} - ${format(weekEnd, 'dd/MM/yyyy', { locale: it })}`,
      148,
      yPosition,
      { align: 'center' }
    );
    yPosition += 15;

    // Crea griglia settimanale
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const hours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`); // 8:00 - 18:00

    // Header giorni
    const cellWidth = 38;
    const cellHeight = 15;
    const startX = 20;
    
    doc.setFillColor(...this.primaryColor);
    doc.rect(startX, yPosition, cellWidth * 7, cellHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    days.forEach((day, index) => {
      doc.text(day, startX + (index * cellWidth) + cellWidth/2, yPosition + 10, { align: 'center' });
    });
    yPosition += cellHeight;

    // Griglia orari
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    
    // Organizza sessioni per giorno e ora
    const sessionsByDayHour: any = {};
    sessions.forEach(session => {
      const date = new Date(session.sessionDate);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Lunedì = 0
      const hour = date.getHours();
      
      const key = `${dayIndex}-${hour}`;
      if (!sessionsByDayHour[key]) {
        sessionsByDayHour[key] = [];
      }
      sessionsByDayHour[key].push(session);
    });

    // Disegna celle con sedute
    for (let hour = 8; hour <= 18; hour++) {
      for (let day = 0; day < 7; day++) {
        const x = startX + (day * cellWidth);
        const y = yPosition + ((hour - 8) * cellHeight);
        
        // Bordo cella
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, y, cellWidth, cellHeight);
        
        // Controlla se ci sono sedute
        const key = `${day}-${hour}`;
        if (sessionsByDayHour[key]) {
          doc.setFillColor(230, 240, 255);
          doc.rect(x, y, cellWidth, cellHeight, 'F');
          doc.rect(x, y, cellWidth, cellHeight); // Ridisegna bordo
          
          doc.setFontSize(7);
          doc.setTextColor(0, 0, 0);
          const session = sessionsByDayHour[key][0]; // Prima seduta
          const patientName = `${session.therapy.clinicalRecord.patient.lastName}`;
          const therapyName = session.therapy.therapyType.name.substring(0, 10);
          
          doc.text(patientName, x + 2, y + 6);
          doc.text(therapyName, x + 2, y + 10);
          
          if (sessionsByDayHour[key].length > 1) {
            doc.setTextColor(41, 98, 255);
            doc.text(`+${sessionsByDayHour[key].length - 1}`, x + cellWidth - 8, y + 12);
          }
        }
      }
    }

    // Legenda
    yPosition = 70 + (11 * cellHeight) + 10;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Legenda:', 20, yPosition);
    doc.setFillColor(230, 240, 255);
    doc.rect(50, yPosition - 4, 10, 5, 'F');
    doc.text('Seduta programmata', 62, yPosition);

    // Footer
    this.addFooterLandscape(doc);

    return doc;
  }

  // Metodi helper privati
  private addHeader(doc: jsPDF) {
    // Logo/Intestazione
    doc.setFillColor(...this.primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('MEDICINA RAVENNA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Via Porto Coriandro, 7 - 48121 Ravenna', 105, 28, { align: 'center' });
    doc.text('Tel. 0544-456845 - info@medicinaravenna.it', 105, 34, { align: 'center' });
  }

  private addHeaderLandscape(doc: jsPDF) {
    doc.setFillColor(...this.primaryColor);
    doc.rect(0, 0, 297, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('MEDICINA RAVENNA', 148, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Via Porto Coriandro, 7 - 48121 Ravenna - Tel. 0544-456845', 148, 26, { align: 'center' });
  }

  private addFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 280, 195, 280);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Documento generato il ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        15,
        285
      );
      doc.text(
        `Pagina ${i} di ${pageCount}`,
        195,
        285,
        { align: 'right' }
      );
    }
  }

  private addFooterLandscape(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 195, 282, 195);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Documento generato il ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        15,
        200
      );
      doc.text(
        `Pagina ${i} di ${pageCount}`,
        282,
        200,
        { align: 'right' }
      );
    }
  }

  private addSectionTitle(doc: jsPDF, title: string, y: number) {
    doc.setFillColor(...this.secondaryColor);
    doc.rect(10, y - 5, 190, 8, 'F');
    doc.setFontSize(11);
    doc.setTextColor(41, 98, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y);
    doc.setFont('helvetica', 'normal');
  }

  private splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
    return doc.splitTextToSize(text, maxWidth);
  }

  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private getCategoryLabel(category: string): string {
    switch (category) {
      case 'INSTRUMENTAL': return 'Strumentale';
      case 'MANUAL': return 'Manuale';
      case 'REHABILITATION': return 'Riabilitazione';
      default: return 'Altro';
    }
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Programmata';
      case 'IN_PROGRESS': return 'In Corso';
      case 'COMPLETED': return 'Completata';
      case 'CANCELLED': return 'Annullata';
      case 'SUSPENDED': return 'Sospesa';
      default: return status;
    }
  }

  private getSessionStatusLabel(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Programmata';
      case 'COMPLETED': return 'Completata';
      case 'CANCELLED': return 'Annullata';
      case 'NO_SHOW': return 'Assente';
      default: return status;
    }
  }
}

export const pdfReportService = new PDFReportService();
