# Istruzioni per la Prossima Sessione - 14 Gennaio 2025

## 🎯 Priorità 1: Verifica Coerenza Database

### Problema Attuale
Il dettaglio terapia non mostra sessioni, probabilmente per mancanza di coerenza nei dati del seed.

### Azioni da Fare:
1. **Verificare il seed data**
   ```bash
   cd backend
   npx prisma studio  # Per vedere i dati nel DB
   ```

2. **Controllare relazioni**
   - Verificare che ogni terapia abbia sessioni associate
   - Controllare che therapyId nelle sessioni corrisponda a terapie esistenti
   - Verificare che tutti i campi required siano popolati

3. **Se necessario, rigenerare il seed**
   ```bash
   npx prisma db seed
   ```

## 🎯 Priorità 2: Completare UI Creazione/Modifica Terapie

### Componenti da Completare:
1. **Form Creazione Terapia** (`/therapies/new`)
   - Selezione paziente
   - Selezione cartella clinica
   - Selezione tipo terapia
   - Parametri specifici per tipo

2. **Form Modifica Terapia** (`/therapies/:id/edit`)
   - Caricamento dati esistenti
   - Modifica parametri
   - Aggiornamento stato

3. **Gestione Sessioni**
   - Creazione nuova sessione
   - Registrazione parametri sessione
   - Firma digitale

## 🎯 Priorità 3: Testing Completo

### Flussi da Testare:
1. **Flusso Paziente**
   - ✅ Lista pazienti
   - ✅ Dettaglio paziente
   - ⚠️ Creazione paziente
   - ⚠️ Modifica paziente

2. **Flusso Terapia**
   - ✅ Lista terapie
   - ✅ Dettaglio terapia (parziale)
   - ❌ Creazione terapia
   - ❌ Modifica terapia
   - ❌ Gestione sessioni

3. **Flusso Cartella Clinica**
   - ⚠️ Lista cartelle
   - ⚠️ Dettaglio cartella
   - ❌ Creazione cartella
   - ❌ Modifica cartella

## 📝 Note Tecniche

### Struttura API Corretta
```javascript
// GET /api/therapies/:id
response.data.data = {
  therapy: {
    // dati terapia con relazioni
  }
}

// GET /api/therapies
response.data.data = [
  // array di terapie
]
```

### Relazioni Database
```
Patient -> ClinicalRecord -> Therapy -> TherapySession
                                     -> TherapyType
```

## 🐛 Bug Noti da Fixare

1. **Sessioni non visibili nel dettaglio terapia**
   - Verificare che l'API includa le sessioni
   - Controllare il seed data

2. **Campi mancanti**
   - `therapy.objectives` non nel modello Prisma
   - `therapy.frequency` gestito via parameters
   - Mappare correttamente therapist/prescribedBy

## ✅ Checklist Pre-Deploy

- [ ] Tutti i dati mock rimossi
- [ ] Nessun errore in console
- [ ] Tutti i warning risolti
- [ ] Database con dati coerenti
- [ ] Form di creazione funzionanti
- [ ] Form di modifica funzionanti
- [ ] Testing manuale completato
- [ ] Documentazione aggiornata

## 🚀 Comandi Utili

```bash
# Verificare database
npx prisma studio

# Rigenerare seed se necessario
npx prisma migrate reset
npx prisma db seed

# Test API
curl http://localhost:3100/api/therapies

# Build produzione
cd frontend && npm run build
cd backend && npm run build
```

## 📊 Tempo Stimato

- Verifica DB: 30 minuti
- Fix coerenza dati: 30 minuti
- UI Creazione terapie: 2 ore
- UI Modifica terapie: 1 ora
- Testing: 2 ore
- Bug fixing: 1 ora

**Totale: ~6-7 ore**

## 🎯 Obiettivo Finale

Sistema completamente funzionante con:
- ✅ Dati reali e coerenti
- ✅ CRUD completo per tutte le entità
- ✅ Zero errori/warning
- ✅ Pronto per produzione

---

**Buon lavoro per domani!** 💪
