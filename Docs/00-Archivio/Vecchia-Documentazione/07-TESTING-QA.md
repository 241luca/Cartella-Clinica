# 🧪 Testing e Quality Assurance - Sistema Cartella Clinica

## 📋 Piano di Test Generale

### Obiettivi del Testing
- **Funzionalità**: Verificare che tutte le funzioni operino correttamente
- **Usabilità**: Garantire facilità d'uso per tutti gli utenti
- **Performance**: Assicurare tempi di risposta accettabili
- **Sicurezza**: Validare protezione dati e accessi
- **Compatibilità**: Testare su diversi dispositivi e browser
- **Affidabilità**: Verificare stabilità e recupero errori

## 🔬 Test Funzionali

### Checklist Test Pazienti
- [ ] Creazione nuovo paziente con tutti i campi
- [ ] Validazione codice fiscale
- [ ] Ricerca paziente per nome/CF/telefono
- [ ] Modifica dati anagrafici
- [ ] Upload documenti
- [ ] Gestione consensi privacy
- [ ] Merge pazienti duplicati
- [ ] Export dati paziente

### Checklist Test Cartella Clinica
- [ ] Apertura nuova cartella
- [ ] Compilazione anamnesi completa
- [ ] Inserimento parametri vitali
- [ ] Valutazione funzionale con scale
- [ ] Test clinici specifici
- [ ] Aggiornamento diagnosi
- [ ] Chiusura cartella
- [ ] Riapertura cartella chiusa

### Checklist Test Terapie
- [ ] Pianificazione ciclo terapeutico
- [ ] Registrazione seduta singola
- [ ] Modifica parametri terapia
- [ ] Annullamento seduta
- [ ] Riprogrammazione appuntamento
- [ ] Calcolo progressi (VAS, ROM)
- [ ] Report aderenza terapeutica
- [ ] Firma digitale seduta

## 🎯 Test di Performance

### Metriche Target
```yaml
response_times:
  page_load: < 2 secondi
  api_response: < 200ms
  search: < 500ms
  report_generation: < 5 secondi
  file_upload: < 10 secondi (per 10MB)

concurrent_users:
  minimum: 50
  target: 100
  stress: 200

availability:
  uptime: 99.9%
  max_downtime_month: 43 minuti
```

### Load Testing Script
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 50 },  // Ramp up
    { duration: '10m', target: 50 }, // Stay at 50 users
    { duration: '5m', target: 100 }, // Ramp to 100
    { duration: '10m', target: 100 }, // Stay at 100
    { duration: '5m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.1'],    // Error rate < 10%
  },
};

export default function() {
  // Test login
  let loginRes = http.post('https://api.example.com/auth/login', {
    username: 'test_user',
    password: 'test_pass'
  });
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'token received': (r) => r.json('token') !== undefined,
  });
  
  let token = loginRes.json('token');
  
  // Test get patients
  let patientsRes = http.get('https://api.example.com/patients', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  check(patientsRes, {
    'patients loaded': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## 🔒 Security Testing

### Checklist Sicurezza
- [ ] SQL Injection test su tutti i form
- [ ] XSS (Cross-Site Scripting) test
- [ ] CSRF (Cross-Site Request Forgery) protection
- [ ] Authentication bypass attempts
- [ ] Authorization matrix validation
- [ ] Session management security
- [ ] Password strength enforcement
- [ ] Encryption of sensitive data
- [ ] HTTPS enforcement
- [ ] Security headers validation

### Penetration Testing
```bash
# OWASP ZAP Scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://cartella-clinica.example.com

# Nikto Web Scanner
nikto -h https://cartella-clinica.example.com

# SQLMap for SQL Injection
sqlmap -u "https://api.example.com/patients?id=1" \
  --cookie="session=abc123" --level=5 --risk=3
```

## 📱 Test Multi-Dispositivo

### Browser Matrix
| Browser | Versione Min | Test Status |
|---------|-------------|-------------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ⚠️ |

### Device Testing
| Dispositivo | OS | Risoluzione | Test Status |
|------------|-----|-------------|-------------|
| iPhone 12+ | iOS 14+ | 390x844 | ✅ |
| iPhone SE | iOS 14+ | 375x667 | ✅ |
| iPad Pro | iPadOS 14+ | 1024x1366 | ✅ |
| Samsung S21 | Android 11+ | 384x854 | ✅ |
| Pixel 5 | Android 11+ | 393x851 | ✅ |

## 🧪 UAT (User Acceptance Testing)

### Scenari Utente

#### Scenario 1: Segretaria - Nuovo Paziente
```
GIVEN sono loggata come segretaria
WHEN creo un nuovo paziente
  AND inserisco tutti i dati anagrafici
  AND richiedo i consensi privacy
THEN il paziente viene creato con successo
  AND viene generato il numero cartella
  AND posso stampare i moduli consenso
```

#### Scenario 2: Fisioterapista - Seduta Terapia
```
GIVEN sono loggato come fisioterapista
  AND ho un paziente con terapia pianificata
WHEN apro la seduta del giorno
  AND registro i parametri pre-seduta
  AND eseguo la terapia
  AND registro i parametri post-seduta
THEN la seduta viene salvata
  AND il contatore sedute si aggiorna
  AND il paziente riceve il promemoria prossima seduta
```

#### Scenario 3: Medico - Referto
```
GIVEN sono loggato come medico
  AND devo redigere un referto
WHEN apro la cartella del paziente
  AND creo nuovo referto
  AND compilo tutte le sezioni
  AND firmo digitalmente
THEN il referto viene generato in PDF
  AND viene inviato al medico curante
  AND il paziente riceve notifica
```

## 📊 Test Report Template

### Executive Summary
```markdown
# Test Report - Sprint X

## Overview
- **Period**: 01/03/2024 - 15/03/2024
- **Build**: v1.2.3
- **Environment**: Staging

## Results Summary
- **Total Tests**: 245
- **Passed**: 232 (94.7%)
- **Failed**: 8 (3.3%)
- **Skipped**: 5 (2.0%)

## Critical Issues
1. [BUG-123] Login fails with special characters
2. [BUG-124] PDF generation timeout on large reports

## Performance Metrics
- Average Response Time: 187ms
- 95th Percentile: 445ms
- Error Rate: 0.3%
```

## 🐛 Bug Tracking

### Bug Report Template
```yaml
bug_id: BUG-2024-001
title: "Errore validazione CF con omocodia"
severity: High
priority: P1
status: Open
reporter: Mario Rossi
assigned_to: Dev Team

description: |
  Il sistema non valida correttamente i codici fiscali
  con caratteri di controllo per omocodia.

steps_to_reproduce:
  1. Vai in Nuovo Paziente
  2. Inserisci CF con omocodia: RSSMRA80A01H50MZ
  3. Clicca Salva
  
expected_result: |
  Il CF dovrebbe essere accettato

actual_result: |
  Errore: "Codice fiscale non valido"

environment:
  - browser: Chrome 120
  - os: Windows 11
  - version: 1.2.3

attachments:
  - screenshot.png
  - console_log.txt
```

## 🔄 Regression Testing

### Regression Test Suite
```javascript
describe('Regression Tests v1.2.3', () => {
  test('Previous bugs should not reappear', () => {
    // BUG-001: Login with email
    expect(login('user@example.com', 'pass')).toBeTruthy();
    
    // BUG-002: Date picker on Safari
    expect(datePicker.works_on_safari).toBeTruthy();
    
    // BUG-003: Upload files > 10MB
    expect(uploadLargeFile(15)).toBeTruthy();
  });
});
```

## 📈 Metriche QA

### KPI Dashboard
```
Test Coverage: 85%
Code Coverage: 78%
Bug Detection Rate: 92%
Bug Fix Rate: 87%
Average Bug Age: 3.2 days
Automation Rate: 65%
Test Execution Time: 45 min
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm test
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Code coverage
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
    
    - name: Build
      run: npm run build
    
    - name: E2E tests
      run: npm run test:e2e
    
    - name: Security scan
      run: npm audit
    
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: npm run deploy:staging
```

## ✅ QA Checklist Pre-Release

### Funzionalità
- [ ] Tutti i test automatici passano
- [ ] Nessun bug critico aperto
- [ ] UAT completato con successo
- [ ] Documentazione aggiornata

### Performance
- [ ] Tempi di risposta entro i limiti
- [ ] Test di carico superati
- [ ] Nessun memory leak rilevato
- [ ] Database ottimizzato

### Sicurezza
- [ ] Penetration test eseguito
- [ ] Vulnerabilità risolte
- [ ] GDPR compliance verificata
- [ ] Backup testati

### Deployment
- [ ] Migration scripts testati
- [ ] Rollback procedure verificata
- [ ] Monitoring configurato
- [ ] Alert sistema attivi

## 📝 Test Documentation

### Test Case Documentation
```markdown
## TC-001: Login Utente

**Prerequisiti**: 
- Utente registrato nel sistema
- Browser supportato

**Steps**:
1. Navigare a /login
2. Inserire username
3. Inserire password
4. Cliccare "Accedi"

**Expected Results**:
- Redirect a dashboard
- Token JWT salvato
- Menu utente visibile

**Actual Results**: [Da compilare]
**Status**: [Pass/Fail]
**Notes**: [Eventuali note]
```

## 🎯 Best Practices

### Testing Guidelines
1. **Write tests first** (TDD approach)
2. **Keep tests isolated** and independent
3. **Use meaningful test names**
4. **Test one thing at a time**
5. **Mock external dependencies**
6. **Clean up after tests**
7. **Use realistic test data**
8. **Document edge cases**
9. **Automate repetitive tests**
10. **Review test code** like production code

---

**Quality Gate Criteria**:
- Code Coverage > 80%
- All critical paths tested
- Zero high-severity bugs
- Performance SLA met
- Security scan passed
