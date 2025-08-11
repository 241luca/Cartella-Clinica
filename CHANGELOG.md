# 📝 CHANGELOG

Tutti i cambiamenti significativi del progetto sono documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-08-11

### 🎨 Redesign Completo UI/UX

#### ✨ Aggiunte
- **Nuovo Design System v2.0**
  - Colori chiari e professionali (Indigo, Purple, Green, Amber)
  - Componenti UI moderni e consistenti
  - Icone Lucide React per tutto il sistema
  - Typography scale ottimizzata
  
- **Dashboard Rinnovata**
  - 4 Stats cards con trend indicators
  - Grafici attività settimanale e mensile interattivi
  - Widget ultimi pazienti con avatar colorati
  - Sezione appuntamenti del giorno
  - Notifiche e avvisi in sidebar

- **Pagina Calendario** 
  - Nuova pagina dedicata `/calendar`
  - Vista settimana/mese/giorno
  - Sidebar con riepilogo giornaliero
  - Filtri per terapista e tipo terapia
  - Export calendario

- **Report & Analytics**
  - Dashboard analytics completa
  - KPI cards con metriche real-time
  - Grafici fatturato (bar chart)
  - Distribuzione terapie (pie chart)
  - Top performers terapisti
  - Export PDF/Excel

#### 🔄 Modificate
- **Pazienti**
  - Tabella modernizzata con avatar e badges
  - Search bar con icona integrata
  - Pagination elegante
  - Export buttons prominent

- **Cartelle Cliniche**
  - Da tabella a grid cards
  - Progress tracking visuale
  - Quick actions su ogni card
  - Stati con badges colorati

- **Terapie**
  - Grid layout 4 colonne responsive
  - Progress bars per completamento
  - Status badges distintivi
  - 5 stats cards in header

- **Sidebar Navigation**
  - Design più chiaro e pulito
  - Hover effects migliorati
  - Badge per notifiche
  - User profile section

#### 🐛 Corrette
- Menu sidebar mancante in Cartelle Cliniche
- Errore 404 endpoint `/api/therapies`
- TypeScript errors per variabili non utilizzate
- Metodo `getAll` mancante in therapyService

#### 📚 Documentazione
- README principale aggiornato
- Setup guide completa
- Design System documentation
- API documentation dettagliata
- User Manual per utenti finali
- Report redesign completo

#### 🏗️ Tecniche
- Implementato `AppLayout` wrapper component
- Lazy loading per tutti i componenti
- Loading states con spinner custom
- Mock data per development
- Responsive breakpoints ottimizzati

## [1.0.0] - 2025-08-10

### 🚀 Release Iniziale

#### ✨ Features
- **Gestione Pazienti**
  - CRUD completo anagrafica
  - Ricerca e filtri
  - Storia clinica

- **Cartelle Cliniche**  
  - Creazione e gestione
  - Allegati documenti
  - Stati aperta/chiusa

- **Gestione Terapie**
  - 13 tipologie disponibili
  - Tracking sedute
  - Valutazione VAS

- **Autenticazione**
  - JWT con refresh token
  - Role-based access control
  - Password recovery

#### 🛠️ Infrastruttura
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL
- Styling: Tailwind CSS

## [0.9.0] - 2025-08-05 (Beta)

### 🧪 Beta Testing

#### ✨ Features
- Sistema base funzionante
- CRUD operations
- Basic authentication
- Prima versione UI

#### 🐛 Known Issues
- Performance da ottimizzare
- UI da migliorare
- Mancano features avanzate

---

## Roadmap Futura

### [2.1.0] - Pianificato Q3 2025
- [ ] Dark mode
- [ ] Multi-language (IT/EN)
- [ ] App mobile (iOS/Android)
- [ ] Notifiche push
- [ ] Video consultazioni

### [2.2.0] - Pianificato Q4 2025
- [ ] AI assistente diagnostico
- [ ] Integrazione fatturazione elettronica
- [ ] Firma digitale documenti
- [ ] Backup automatico cloud
- [ ] Dashboard personalizzabili

### [3.0.0] - Pianificato 2026
- [ ] Multi-clinica support
- [ ] Telemedicina integrata
- [ ] Machine learning per predizioni
- [ ] Blockchain per documenti
- [ ] API pubblica

---

## Versioning

Usiamo [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, incompatibilità
- **MINOR** (0.X.0): Nuove features, retrocompatibili
- **PATCH** (0.0.X): Bug fixes, piccoli miglioramenti

## Come Contribuire

1. Fork il repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add: AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## Convenzioni Commit

Usiamo [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nuova feature
- `fix:` Bug fix
- `docs:` Solo documentazione
- `style:` Formattazione, no logic changes
- `refactor:` Refactoring codice
- `test:` Aggiunta test
- `chore:` Maintenance

---

*Per maggiori dettagli sui cambiamenti, vedi i [commit su GitHub](https://github.com/241luca/cartella-clinica/commits/main)*
