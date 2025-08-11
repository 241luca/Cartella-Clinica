# 📌 TODO LIST - Cartella Clinica v2.0

## 🚨 Priorità Alta (Da fare subito)

### Backend
- [ ] Implementare i metodi reali nel TherapyService (ora usa mock data)
- [ ] Completare seed database con dati di esempio realistici
- [ ] Implementare sistema di backup automatico
- [ ] Aggiungere validazione completa input con Zod
- [ ] Implementare rate limiting su API sensibili
- [ ] Sistema di log centralizzato con Winston

### Frontend
- [ ] Implementare form di modifica per tutte le entità
- [ ] Aggiungere pagine dettaglio complete
- [ ] Sistema di notifiche real-time con WebSocket
- [ ] Gestione errori globale migliorata
- [ ] Implementare lazy loading immagini
- [ ] Cache management con React Query

### Sicurezza
- [ ] Implementare 2FA (Two-Factor Authentication)
- [ ] Audit log completo per GDPR
- [ ] Crittografia dati sensibili nel database
- [ ] Session management migliorato
- [ ] Password policy più stringente
- [ ] CORS configuration per produzione

## 🎯 Priorità Media (Prossime 2-4 settimane)

### Features
- [ ] **Dark Mode**
  - Toggle in navbar
  - Persistenza preferenza
  - Transizione smooth

- [ ] **Export Avanzati**
  - Report PDF con template personalizzabili
  - Export Excel con formattazione
  - Stampa diretta da browser

- [ ] **Gestione Documenti**
  - Preview inline PDF
  - Gallery immagini con lightbox
  - Compressione automatica immagini
  - OCR per documenti scansionati

- [ ] **Calendario Avanzato**
  - Drag & drop appuntamenti
  - Ricorrenze automatiche
  - Invio reminder via email/SMS
  - Integrazione Google Calendar

- [ ] **Dashboard Personalizzabile**
  - Widget trascinabili
  - Metriche customizzabili
  - Salvataggio layout per utente

### Performance
- [ ] Implementare Service Worker per offline
- [ ] Bundle splitting più aggressivo
- [ ] Ottimizzare query database con indici
- [ ] Implementare Redis per caching
- [ ] CDN per assets statici
- [ ] Compressione gzip/brotli

### Testing
- [ ] Unit tests Frontend (min 80% coverage)
- [ ] Integration tests Backend
- [ ] E2E tests con Cypress/Playwright
- [ ] Performance testing con Lighthouse CI
- [ ] Security testing con OWASP ZAP
- [ ] Load testing con k6

## 💡 Priorità Bassa (Future releases)

### Mobile App
- [ ] React Native app
- [ ] Push notifications
- [ ] Offline sync
- [ ] Biometric authentication
- [ ] Camera integration per documenti
- [ ] GPS per visite domiciliari

### Integrazioni
- [ ] **Fatturazione Elettronica**
  - Integrazione Aruba/InfoCert
  - Generazione automatica fatture
  - Invio SDI

- [ ] **Email/SMS**
  - Template email personalizzabili
  - SMS reminder con Twilio
  - Newsletter pazienti

- [ ] **Hardware Medico**
  - Integrazione dispositivi VAS digitali
  - Import dati da macchinari terapia
  - Lettori badge/tessera sanitaria

### AI/ML Features
- [ ] Suggerimenti diagnosi basati su sintomi
- [ ] Predizione durata terapie
- [ ] Analisi trend pazienti
- [ ] OCR intelligente documenti
- [ ] Chatbot assistenza
- [ ] Voice-to-text per note

### Multi-tenancy
- [ ] Supporto multi-clinica
- [ ] Gestione franchising
- [ ] Dashboard amministratore centrale
- [ ] Billing per clinica
- [ ] White labeling

## 🐛 Bug Conosciuti

### Alta Priorità
- [ ] Form paziente non valida correttamente il codice fiscale
- [ ] Pagination non mantiene filtri dopo refresh
- [ ] Export Excel non include tutti i campi

### Media Priorità
- [ ] Tooltip non sempre visibili su mobile
- [ ] Date picker non localizzato correttamente
- [ ] Scroll infinito lista pazienti da implementare

### Bassa Priorità
- [ ] Animazioni potrebbero essere più fluide
- [ ] Focus trap nei modal non sempre funziona
- [ ] Print CSS da ottimizzare

## 📋 Refactoring Necessari

- [ ] Estrarre logica comune in custom hooks
- [ ] Centralizzare gestione stato con Zustand/Redux
- [ ] Migrare a CSS modules o styled-components
- [ ] Standardizzare naming conventions
- [ ] Rimuovere codice duplicato
- [ ] Ottimizzare bundle size

## 📚 Documentazione da Completare

- [ ] Video tutorial per utenti
- [ ] Swagger/OpenAPI spec per API
- [ ] Storybook per componenti UI
- [ ] Diagrammi architettura sistema
- [ ] Guida contribuzione
- [ ] Troubleshooting guide

## 🎨 UI/UX Improvements

- [ ] Micro-animazioni per feedback
- [ ] Skeleton loading per tutti i componenti
- [ ] Tour guidato primo accesso
- [ ] Tooltips informativi
- [ ] Keyboard shortcuts completi
- [ ] Accessibility audit (WCAG AAA)

## 🔧 DevOps

- [ ] CI/CD pipeline completa
- [ ] Docker compose per development
- [ ] Kubernetes manifests per produzione
- [ ] Monitoring con Grafana/Prometheus
- [ ] Error tracking con Sentry
- [ ] Automated backups

## 💰 Business Features

- [ ] Sistema abbonamenti/licenze
- [ ] Gestione multi-sede
- [ ] Statistiche avanzate dirigenza
- [ ] Integrazione contabilità
- [ ] Gestione magazzino materiali
- [ ] Booking online pazienti

---

## 📝 Note per lo Sviluppo

### Priorità Immediata per Produzione
1. Fix tutti i bug alta priorità
2. Implementare backup automatico
3. Security audit completo
4. Performance optimization
5. Documentazione utente finale

### Standard da Mantenere
- Code coverage minimo: 70%
- Lighthouse score minimo: 90
- Bundle size max: 500KB gzipped
- Time to interactive: < 3s
- Accessibility: WCAG 2.1 AA

### Processo Review
1. Ogni feature deve avere tests
2. Code review obbligatoria
3. Testing su staging prima di produzione
4. Documentazione aggiornata
5. Changelog entry

---

*Ultimo aggiornamento: 11 Agosto 2025*
*Maintainer: @lucamambelli*
