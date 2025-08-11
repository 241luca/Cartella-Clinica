# 📋 PIANO DI LAVORO DETTAGLIATO - CARTELLA CLINICA
## Data Inizio: 11 Agosto 2025 - ore 22:00
## Sviluppatore: Assistant Claude
## Cliente: Medicina Ravenna SRL

---

## 🎯 OBIETTIVO FINALE
Sistema completo e funzionante per la gestione delle cartelle cliniche di Medicina Ravenna con tutte le 13 tipologie di terapie specificate nel documento.

---

## 📅 FASE 1: STABILIZZAZIONE BASE (STASERA - 2 ORE)
### ✅ Checklist Immediata

#### 1.1 Verifica Sistema
- [ ] Controllare connessione database PostgreSQL
- [ ] Verificare che le migrazioni siano applicate
- [ ] Testare seed data
- [ ] Verificare login funzionante
- [ ] Fix errori TypeScript se presenti

#### 1.2 Fix Dipendenze Critiche
- [ ] Downgrade React 19 → React 18 (stabile)
- [ ] Verificare compatibilità tutte le dipendenze
- [ ] Pulire package-lock.json e node_modules se necessario

#### 1.3 Test Base Sistema
- [ ] Login con admin@medicinaravenna.it
- [ ] Navigazione dashboard
- [ ] Lista pazienti
- [ ] Creazione nuovo paziente

---

## 📅 FASE 2: BACKEND SERVICES (GIORNO 1-2)

### 2.1 PatientService Completo
```typescript
// backend/src/services/PatientService.ts
- [ ] getPatientWithFullHistory() - paziente con tutte le relazioni
- [ ] calculateAge() - calcolo età automatico
- [ ] validateCodiceFiscale() - validazione CF italiano
- [ ] searchAdvanced() - ricerca con filtri multipli
- [ ] getPatientStatistics() - statistiche paziente
- [ ] exportPatientDataPDF() - export PDF cartella completa
```

### 2.2 ClinicalRecordService
```typescript
// backend/src/services/ClinicalRecordService.ts
- [ ] createWithTemplate() - creazione con template
- [ ] updateSection() - aggiornamento per sezioni
- [ ] addTherapy() - collegamento terapie
- [ ] closeRecord() - chiusura cartella
- [ ] generatePDF() - generazione PDF
- [ ] getTimeline() - timeline eventi
```

### 2.3 TherapyService 
```typescript
// backend/src/services/TherapyService.ts
- [ ] createTherapyPlan() - piano terapeutico
- [ ] scheduleSession() - pianificazione sedute
- [ ] updateProgress() - aggiornamento progressi
- [ ] getParametersByType() - parametri per tipo terapia
- [ ] calculateVASScore() - calcolo scala VAS
- [ ] generateReport() - report terapia
```

### 2.4 Implementazione 13 Tipi Terapie
```typescript
// backend/src/services/therapies/
- [ ] LimfaterapyService.ts
- [ ] LaserYagService.ts  
- [ ] Laser810Service.ts
- [ ] LaserScanService.ts
- [ ] MagnetoterapiaService.ts
- [ ] TensService.ts
- [ ] UltrasuoniService.ts
- [ ] ElettrostimolazioneService.ts
- [ ] MassoterapiaService.ts
- [ ] MobilizzazioniService.ts
- [ ] TecarService.ts
- [ ] SITService.ts
- [ ] TecalabService.ts
```

---

## 📅 FASE 3: API ENDPOINTS (GIORNO 3)

### 3.1 Patients API
```
- [ ] GET /api/patients/search - ricerca avanzata
- [ ] GET /api/patients/:id/full - dettaglio completo
- [ ] GET /api/patients/:id/statistics - statistiche
- [ ] GET /api/patients/:id/timeline - timeline
- [ ] POST /api/patients/:id/export-pdf - export PDF
```

### 3.2 Clinical Records API
```
- [ ] POST /api/clinical-records/from-template - crea da template
- [ ] PUT /api/clinical-records/:id/section - aggiorna sezione
- [ ] POST /api/clinical-records/:id/close - chiudi cartella
- [ ] GET /api/clinical-records/:id/pdf - genera PDF
```

### 3.3 Therapies API
```
- [ ] POST /api/therapies/plan - crea piano
- [ ] POST /api/therapies/:id/schedule - pianifica sedute
- [ ] PUT /api/therapies/:id/progress - aggiorna progressi
- [ ] GET /api/therapies/types/:type/parameters - parametri tipo
```

### 3.4 Documents API
```
- [ ] POST /api/documents/upload - upload file
- [ ] GET /api/documents/:id/download - download
- [ ] DELETE /api/documents/:id - elimina
```

---

## 📅 FASE 4: FRONTEND PAGES (GIORNO 4-7)

### 4.1 Paziente - Pagine Complete
```typescript
// frontend/src/pages/patients/
- [ ] PatientDetail.tsx - vista dettaglio completa
- [ ] PatientEdit.tsx - modifica paziente
- [ ] PatientHistory.tsx - storico visite
- [ ] PatientDocuments.tsx - documenti paziente
```

### 4.2 Cartelle Cliniche
```typescript
// frontend/src/pages/clinical-records/
- [ ] RecordEditor.tsx - editor completo cartella
- [ ] RecordView.tsx - visualizzazione cartella
- [ ] RecordPDF.tsx - anteprima PDF
- [ ] ConsentManager.tsx - gestione consensi
```

### 4.3 Terapie
```typescript
// frontend/src/pages/therapies/
- [ ] TherapyList.tsx - lista terapie
- [ ] TherapyForm.tsx - form creazione/modifica
- [ ] TherapyCalendar.tsx - calendario sedute
- [ ] SessionCheckin.tsx - check-in seduta
- [ ] ProgressChart.tsx - grafici progressi
```

### 4.4 Componenti Specifici Medicina Ravenna
```typescript
// frontend/src/components/therapy-forms/
- [ ] LimfaterapyForm.tsx
- [ ] LaserYagForm.tsx
- [ ] Laser810Form.tsx
- [ ] LaserScanForm.tsx
- [ ] MagnetoterapiaForm.tsx
- [ ] TensForm.tsx
- [ ] UltrasuoniForm.tsx
- [ ] ElettrostimolazioneForm.tsx
- [ ] MassoterapiaForm.tsx
- [ ] MobilizzazioniForm.tsx
- [ ] TecarForm.tsx
- [ ] SITForm.tsx
- [ ] TecalabForm.tsx
```

### 4.5 Componenti UI Specializzati
```typescript
// frontend/src/components/medical/
- [ ] VASScale.tsx - scala VAS interattiva
- [ ] BodyMapper.tsx - mappa zone corpo
- [ ] GoniometerInput.tsx - input goniometrico
- [ ] SignaturePad.tsx - firma digitale
- [ ] PoolActivityForm.tsx - form attività piscina
- [ ] GymActivityForm.tsx - form attività palestra
```

---

## 📅 FASE 5: FEATURES AVANZATE (GIORNO 8-10)

### 5.1 Sistema Report e PDF
- [ ] Template PDF cartella clinica
- [ ] Report mensili
- [ ] Statistiche terapie
- [ ] Export Excel
- [ ] Ricevute e fatture

### 5.2 Upload e Gestione Documenti
- [ ] Upload sicuro con validazione
- [ ] Organizzazione per paziente
- [ ] Anteprima documenti
- [ ] Gestione consensi firmati

### 5.3 Calendario Avanzato
- [ ] Vista multi-terapista
- [ ] Drag & drop appuntamenti
- [ ] Gestione conflitti
- [ ] Notifiche promemoria

---

## 📅 FASE 6: TESTING E OTTIMIZZAZIONE (GIORNO 11-12)

### 6.1 Testing
- [ ] Unit test services (Jest)
- [ ] Integration test API (Supertest)
- [ ] Component test frontend (Vitest)
- [ ] E2E test flussi principali (Playwright)

### 6.2 Ottimizzazioni
- [ ] Cache Redis per query frequenti
- [ ] Lazy loading componenti
- [ ] Ottimizzazione bundle size
- [ ] Compressione immagini

### 6.3 Sicurezza
- [ ] Audit sicurezza dipendenze
- [ ] Sanitizzazione input
- [ ] Rate limiting API
- [ ] Backup automatici

---

## 📅 FASE 7: DEPLOYMENT (GIORNO 13-14)

### 7.1 Preparazione
- [ ] Environment production
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Monitoring setup

### 7.2 Deploy
- [ ] Setup server production
- [ ] Deploy database
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production

---

## 🎯 ORDINE DI ESECUZIONE PRIORITIZZATO

### SETTIMANA 1 (Lun 12 - Dom 18 Agosto)
1. **Lunedì**: Stabilizzazione + PatientService
2. **Martedì**: ClinicalRecordService + TherapyService
3. **Mercoledì**: API Endpoints + Validazioni
4. **Giovedì**: Frontend Patient pages
5. **Venerdì**: Frontend Clinical Record pages
6. **Sabato**: Frontend Therapy pages
7. **Domenica**: Test integrazione + Fix bug

### SETTIMANA 2 (Lun 19 - Dom 25 Agosto)
8. **Lunedì**: Componenti terapie specifiche (1-7)
9. **Martedì**: Componenti terapie specifiche (8-13)
10. **Mercoledì**: VAS Scale + Body Mapper
11. **Giovedì**: Sistema PDF + Report
12. **Venerdì**: Upload documenti
13. **Sabato**: Testing completo
14. **Domenica**: Deployment + Go Live

---

## 📊 METRICHE DI COMPLETAMENTO

### Checkpoint Giornalieri
- [ ] Giorno 1: Backend services 100%
- [ ] Giorno 2: API endpoints 100%
- [ ] Giorno 3: Patient module 100%
- [ ] Giorno 4: Clinical records 100%
- [ ] Giorno 5: Therapy base 100%
- [ ] Giorno 6: Therapy forms 50%
- [ ] Giorno 7: Therapy forms 100%
- [ ] Giorno 8: Special components 100%
- [ ] Giorno 9: PDF/Reports 100%
- [ ] Giorno 10: Documents 100%
- [ ] Giorno 11: Testing 80%
- [ ] Giorno 12: Bug fixes 100%
- [ ] Giorno 13: Deployment prep 100%
- [ ] Giorno 14: Go Live ✅

---

## 🚀 INIZIO IMMEDIATO - PROSSIMI 30 MINUTI

### Step 1: Fix React Version (5 min)
```bash
cd frontend
npm uninstall react react-dom
npm install react@18.3.1 react-dom@18.3.1
npm install --save-dev @types/react@18.3.5 @types/react-dom@18.3.0
```

### Step 2: Verifica Database (5 min)
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
npx prisma studio # per verificare dati
```

### Step 3: Test Sistema Base (10 min)
- Avviare backend: `npm run dev`
- Avviare frontend: `npm run dev`
- Login con admin@medicinaravenna.it
- Creare un paziente test
- Verificare che si salvi

### Step 4: Iniziare PatientService (10 min)
```typescript
// Creare backend/src/services/PatientService.ts
// Implementare prima funzione: getPatientWithFullHistory
```

---

## 📝 NOTE IMPORTANTI

1. **Commit frequenti**: Ogni feature completata = 1 commit
2. **Test mentre sviluppo**: Non rimandare i test
3. **Documentazione inline**: Commentare codice complesso
4. **Report giornaliero**: Aggiornare questo documento ogni sera
5. **Backup**: Push su GitHub ogni 2 ore

---

## ✅ CRITERIO DI COMPLETAMENTO

Il sistema sarà considerato completo quando:
1. Tutte le 13 terapie sono implementate
2. CRUD completo per pazienti, cartelle, terapie
3. Sistema PDF funzionante
4. Login e permessi funzionanti
5. Zero errori TypeScript
6. Test coverage > 60%
7. Documentazione API completa
8. Deploy in produzione riuscito

---

*Piano creato: 11 Agosto 2025 - ore 22:00*
*Sviluppatore assegnato: Assistant Claude*
*Tempo stimato totale: 14 giorni lavorativi*
*Data completamento prevista: 25 Agosto 2025*