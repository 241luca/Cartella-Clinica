# 📊 DATABASE POPOLATO - MEDICINA RAVENNA
## Data: 11 Agosto 2025
## Stato: Database popolato con dati realistici

---

## ✅ DATI INSERITI CON SUCCESSO

Il database è stato popolato con **oltre 200 record** di dati realistici per il testing:

### 📈 Riepilogo Dati Inseriti:

| Tabella | Record | Descrizione |
|---------|--------|-------------|
| **Utenti** | 8 | 1 Admin, 3 Medici, 4 Fisioterapisti |
| **Pazienti** | 50 | Pazienti con dati anagrafici completi |
| **Cartelle Cliniche** | 40 | Cartelle con anamnesi e diagnosi |
| **Tipi di Terapia** | 13 | Tutti i tipi di terapia disponibili |
| **Terapie** | 45 | Piani terapeutici assegnati |
| **Sedute** | 50 | Sedute terapeutiche programmate |
| **Documenti** | 30 | Referti e documenti allegati |
| **TOTALE** | **226** | Record totali nel database |

---

## 🔑 CREDENZIALI DI ACCESSO

### Account Amministratore:
```
Email: admin@medicinaravenna.it
Password: admin123
```

### Account Medici:
```
Email: dott.rossi@medicinaravenna.it
Password: password123

Email: dott.bianchi@medicinaravenna.it
Password: password123

Email: dott.verdi@medicinaravenna.it
Password: password123
```

### Account Fisioterapisti:
```
Email: ft.ferrari@medicinaravenna.it
Password: password123

Email: ft.romano@medicinaravenna.it
Password: password123

Email: ft.marino@medicinaravenna.it
Password: password123

Email: ft.gallo@medicinaravenna.it
Password: password123
```

---

## 📊 CARATTERISTICHE DEI DATI

### Pazienti (50 record):
- ✅ Nomi e cognomi italiani realistici
- ✅ Codici fiscali validi generati automaticamente
- ✅ Indirizzi di città della Romagna (Ravenna, Faenza, Lugo, Forlì, Cesena, Rimini)
- ✅ Numeri di telefono italiani validi
- ✅ Date di nascita distribuite (1940-2005)
- ✅ Email personali generate
- ✅ Professioni varie

### Cartelle Cliniche (40 record):
- ✅ Numeri progressivi (2024-0001 a 2024-0040)
- ✅ Diagnosi realistiche di fisioterapia:
  - Lombalgia, Cervicalgia
  - Ernie discali
  - Tendiniti varie
  - Artrosi
  - Post-chirurgico
  - Patologie neurologiche
- ✅ Anamnesi dettagliate
- ✅ Piani terapeutici strutturati
- ✅ 30% delle cartelle sono chiuse

### Terapie (45 record):
- ✅ Distribuite su tutti i 13 tipi:
  - Magnetoterapia
  - Laser (YAG, 810+980, Scanner)
  - TENS
  - Ultrasuoni
  - Elettrostimolazione
  - Massoterapia
  - Mobilizzazioni
  - Tecarsin
  - Linfaterapy
  - SIT
  - Tecalab
- ✅ Frequenze realistiche (quotidiana, settimanale, etc.)
- ✅ Stati vari (in corso, completate, sospese)
- ✅ Distretti anatomici specificati

### Sedute (50 record):
- ✅ Collegate alle terapie
- ✅ Date distribuite nel 2024-2025
- ✅ Valutazioni VAS prima/dopo
- ✅ Note cliniche dettagliate
- ✅ Stati realistici (programmate, completate, mancate)

### Documenti (30 record):
- ✅ Tipologie varie:
  - Referti RX
  - Referti RMN
  - Referti ECO
  - Referti EMG
  - Prescrizioni mediche
  - Relazioni specialistiche
  - Esami del sangue
- ✅ File PDF simulati
- ✅ Dimensioni realistiche (100KB - 5MB)

---

## 🚀 COME UTILIZZARE I DATI

### 1. Verificare i dati inseriti:
```bash
cd backend
npm run db:verify
```

### 2. Visualizzare i dati con Prisma Studio:
```bash
cd backend
npx prisma studio
# Si apre su http://localhost:5555
```

### 3. Accedere al sistema:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Browser
http://localhost:5183
```

### 4. Test funzionalità con dati reali:
1. Login con uno degli account forniti
2. Navigare tra i pazienti (50 disponibili)
3. Aprire cartelle cliniche (40 disponibili)
4. Visualizzare terapie (45 disponibili)
5. Controllare calendario sedute (50 sedute)

---

## 📋 ESEMPI DI QUERY UTILI

### Trovare pazienti con cartelle aperte:
```sql
SELECT p.*, cr.diagnosis 
FROM patients p
JOIN clinical_records cr ON cr.patient_id = p.id
WHERE cr.closed_at IS NULL;
```

### Top 5 diagnosi più frequenti:
```sql
SELECT diagnosis, COUNT(*) as count
FROM clinical_records
GROUP BY diagnosis
ORDER BY count DESC
LIMIT 5;
```

### Sedute di oggi:
```sql
SELECT ts.*, t.district, p.first_name, p.last_name
FROM therapy_sessions ts
JOIN therapies t ON t.id = ts.therapy_id
JOIN clinical_records cr ON cr.id = t.clinical_record_id
JOIN patients p ON p.id = cr.patient_id
WHERE DATE(ts.session_date) = CURRENT_DATE;
```

### Miglioramento VAS medio:
```sql
SELECT AVG(vas_score_before - vas_score_after) as avg_improvement
FROM therapy_sessions
WHERE vas_score_before IS NOT NULL 
AND vas_score_after IS NOT NULL;
```

---

## 🎯 SCENARI DI TEST CONSIGLIATI

### Test 1: Flusso Completo Nuovo Paziente
1. Creare nuovo paziente
2. Aprire cartella clinica
3. Aggiungere diagnosi
4. Creare piano terapeutico
5. Schedulare sedute
6. Registrare progressi VAS

### Test 2: Gestione Terapie Multiple
1. Selezionare paziente esistente (es: Mario Rossi)
2. Visualizzare cartella clinica
3. Aggiungere nuova terapia con wizard
4. Verificare calendario sedute
5. Completare una seduta

### Test 3: Ricerca e Filtri
1. Cercare pazienti per nome
2. Filtrare per città (Ravenna, Faenza, etc.)
3. Ordinare per data
4. Esportare lista

### Test 4: Reportistica
1. Dashboard con statistiche
2. Grafici terapie
3. Report pazienti
4. Analisi miglioramenti VAS

---

## ⚠️ NOTE IMPORTANTI

### Dati di Test
- Tutti i dati sono **fittizi** ma realistici
- I codici fiscali sono generati ma non reali
- Le email sono fittizie (@email.it)
- I numeri di telefono sono validi ma non assegnati

### Reset Database
Per resettare e ripopolare:
```bash
cd backend
npx prisma migrate reset
npm run seed:complete
```

### Backup
Per fare backup dei dati:
```bash
pg_dump cartella_clinica > backup_$(date +%Y%m%d).sql
```

---

## ✅ VANTAGGI DEL DATABASE POPOLATO

1. **Testing Realistico**: Dati sufficienti per testare tutte le funzionalità
2. **Demo Efficace**: Perfetto per dimostrazioni al cliente
3. **Sviluppo Facilitato**: Non serve creare dati manualmente
4. **Varietà di Casi**: Copre molti scenari clinici reali
5. **Performance Testing**: Abbastanza dati per testare le performance

---

## 📞 SUPPORTO

Per problemi con il database:
1. Verificare che PostgreSQL sia attivo
2. Controllare le migrazioni: `npx prisma migrate status`
3. Vedere log: `tail -f backend/logs/error.log`
4. Reset completo: `npx prisma migrate reset`

---

**Database pronto per l'uso!** 🎉

Il sistema ora contiene dati realistici sufficienti per:
- Testing completo
- Demo al cliente
- Sviluppo features
- Training utenti

---

*Documento creato: 11 Agosto 2025*
*Dati inseriti: 226 record totali*
*Prossimo step: Testing con dati reali*