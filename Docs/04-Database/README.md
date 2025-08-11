# 📊 DATABASE ARCHITECTURE
## Schema Database Cartella Clinica Digitale

---

## 📋 PANORAMICA

Il database utilizza PostgreSQL con Prisma ORM per gestire:
- 30+ tabelle
- 15+ enum types
- Relazioni complesse
- Audit trail completo
- GDPR compliance

---

## 🗂️ ENTITÀ PRINCIPALI

### Core Entities
1. **User** - Utenti del sistema
2. **Patient** - Anagrafica pazienti
3. **ClinicalRecord** - Cartelle cliniche
4. **Therapy** - Terapie pianificate
5. **TherapySession** - Sedute terapia
6. **TherapyType** - Tipi di terapia configurabili

### Supporting Entities
- **Anamnesis** - Storia clinica
- **VitalSign** - Parametri vitali
- **FunctionalEvaluation** - Valutazioni funzionali
- **Document** - Documenti allegati
- **Consent** - Consensi tracciati
- **Invoice** - Fatturazione

### Professional Entities
- **Doctor** - Medici
- **Therapist** - Terapisti
- **ClinicalControl** - Controlli clinici
- **DischargeReport** - Relazioni dimissione

---

## 🔧 CARATTERISTICHE TECNICHE

### Indici Ottimizzati
- Ricerca pazienti per codice fiscale
- Query terapie per stato
- Calendario appuntamenti
- Audit log temporale

### Sicurezza
- Password hash con bcrypt
- Soft delete per dati sensibili
- Audit trail completo
- Crittografia campi sensibili

### Performance
- Connection pooling
- Query optimization
- Lazy loading relations
- Cache strategy

---

## 📈 MIGRATIONS

```bash
# Crea nuova migration
npx prisma migrate dev --name init

# Applica migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Genera client
npx prisma generate
```

---

## 🌱 SEED DATA

Il file `prisma/seed.ts` popola:
- Utenti di test
- Tipi di terapia standard
- Pazienti demo
- Cartelle cliniche esempio

---

## 📊 STRUTTURA TABELLE PRINCIPALI

### Tabella User
- Gestisce utenti del sistema (admin, medici, terapisti, reception)
- Ruoli e permessi
- Tracking accessi

### Tabella Patient
- Anagrafica completa paziente
- GDPR compliant con consensi
- Soft delete per privacy

### Tabella ClinicalRecord
- Cartella clinica principale
- Collega tutte le terapie e valutazioni
- Tracking stato attivo/chiuso

### Tabella Therapy
- Definisce ciclo terapeutico
- Parametri specifici in JSON
- Tracking sedute completate

### Tabella TherapySession
- Singola seduta di terapia
- VAS scale pre/post
- Firma digitale doppia

### Tabella TherapyType
- Configurazione tipi di terapia
- Schema JSON per parametri
- Durata e sessioni default

---

## 🔐 SICUREZZA E PRIVACY

1. **Crittografia**: Dati sensibili crittografati at-rest
2. **Audit Log**: Ogni operazione tracciata
3. **Consensi**: Gestione consensi GDPR
4. **Soft Delete**: Dati mai cancellati fisicamente
5. **Backup**: Strategy di backup incrementale

---

## 📝 QUERY COMUNI

### Ricerca Paziente
```sql
SELECT * FROM patients 
WHERE fiscal_code = ? 
OR (last_name ILIKE ? AND first_name ILIKE ?);
```

### Terapie Attive
```sql
SELECT t.*, tt.name, tt.category 
FROM therapies t
JOIN therapy_types tt ON t.therapy_type_id = tt.id
WHERE t.status = 'IN_PROGRESS'
AND t.clinical_record_id = ?;
```

### Report Sedute
```sql
SELECT 
  COUNT(*) as total_sessions,
  AVG(vas_score_after - vas_score_before) as avg_improvement
FROM therapy_sessions
WHERE therapy_id = ?
AND status = 'COMPLETED';
```

---

*Database Schema v1.0 - Agosto 2025*
