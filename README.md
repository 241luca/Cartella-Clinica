# 🏥 Sistema Gestione Cartelle Cliniche - Medicina Ravenna

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/241luca/cartella-clinica)
[![Status](https://img.shields.io/badge/status-production_ready-green.svg)]()
[![License](https://img.shields.io/badge/license-proprietary-red.svg)]()

## 📊 Stato del Progetto

### ✅ FASE 1 - COMPLETATA (100%)
Sistema base completamente funzionante con tutte le funzionalità core implementate.

### 🚀 FASE 2 - IN PIANIFICAZIONE
Evoluzione verso sistema multi-società con IA integrata.

## 🎯 Caratteristiche Principali

### Implementate (Fase 1) ✅
- **Gestione Pazienti** - Anagrafica completa con storico clinico
- **Cartelle Cliniche** - Gestione diagnosi, anamnesi, documenti
- **Gestione Terapie** - 15 tipi di terapia con parametri specifici
- **Sessioni Terapeutiche** - Tracciamento VAS score e progressi
- **Dashboard Analytics** - Statistiche real-time
- **Calendario** - Gestione appuntamenti
- **Autenticazione** - Sistema ruoli (Admin, Dottore, Terapista)
- **Database Realistico** - 384 terapie, 3718 sessioni

### In Sviluppo (Fase 2) 🔄
- **Sistema Multi-Società** - Gestione multiple cliniche
- **IA Contestuale** - Supporto decisionale intelligente
- **Cartelle Specialistiche** - Fisioterapia, Riabilitazione, Infermieristica
- **Refertazione Consulenze** - Workflow consulenze specialistiche
- **Moduli Dinamici** - Personalizzazione cartelle
- **Gestione Tipi Terapia** - Creazione dinamica tipi

## 🛠️ Stack Tecnologico

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router v6
- React Hook Form
- Recharts
- Lucide Icons

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- PostgreSQL 14+
- Git

### Installazione

```bash
# Clone repository
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica

# Setup backend
cd backend
npm install
cp .env.example .env  # Configura le variabili ambiente
npx prisma migrate dev
npx prisma db seed

# Setup frontend
cd ../frontend
npm install
```

### Avvio

```bash
# Terminal 1 - Backend (porta 3100)
cd backend
npm run dev

# Terminal 2 - Frontend (porta 5183)
cd frontend
npm run dev
```

Accedi a: http://localhost:5183

## 🔐 Credenziali Demo

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@medicinaravenna.it | admin123 |
| Dottore | dott.rossi@medicinaravenna.it | doctor123 |
| Terapista | ft.verdi@medicinaravenna.it | therapist123 |

## 📁 Struttura Progetto

```
cartella-clinica/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Componenti riutilizzabili
│   │   ├── pages/      # Pagine applicazione
│   │   ├── services/   # API services
│   │   ├── contexts/   # React contexts
│   │   └── utils/      # Utilities
│   └── package.json
├── backend/            # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
└── Docs/              # Documentazione
    ├── PROGETTO_COMPLETATO.md
    └── ROADMAP_FASE_2.md
```

## 📊 Database Schema

Il sistema utilizza 15+ tabelle per gestire:
- Pazienti e anamnesi
- Cartelle cliniche
- Terapie e sessioni
- Utenti e autorizzazioni
- Documenti e consensi
- Appuntamenti e calendario

## 🔄 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Profilo corrente

### Pazienti
- `GET /api/patients` - Lista pazienti
- `POST /api/patients` - Crea paziente
- `GET /api/patients/:id` - Dettaglio paziente
- `PUT /api/patients/:id` - Aggiorna paziente

### Terapie
- `GET /api/therapies` - Lista terapie
- `POST /api/therapies` - Crea terapia
- `GET /api/therapies/:id` - Dettaglio terapia
- `PUT /api/therapies/:id/sessions/:sessionId` - Aggiorna sessione

[Documentazione API completa →](./Docs/API.md)

## 📈 Metriche Performance

- **Tempo caricamento**: < 1 secondo
- **Database**: 100 pazienti, 384 terapie, 3718 sessioni
- **Uptime target**: 99.9%
- **Concurrent users**: 50+

## 🧪 Testing

```bash
# Run tests
cd backend
npm test

cd frontend
npm test
```

## 🚢 Deploy

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up -d
```

## 📝 Documentazione

- [Progetto Completato](./Docs/PROGETTO_COMPLETATO.md)
- [Roadmap Fase 2](./Docs/ROADMAP_FASE_2.md)
- [Changelog](./CHANGELOG.md)
- [API Documentation](./Docs/API.md)

## 🤝 Contributing

Il progetto è proprietario di Medicina Ravenna SRL.
Per contribuire, contattare il team di sviluppo.

## 📄 Licenza

Software proprietario - Tutti i diritti riservati a Medicina Ravenna SRL

## 👥 Team

- **Luca Mambelli** - Full Stack Developer
- **Medicina Ravenna** - Cliente/Owner

## 📞 Supporto

- Email: lucamambelli@lmtecnologie.it
- GitHub Issues: [Issues](https://github.com/241luca/cartella-clinica/issues)

---

**© 2025 Medicina Ravenna SRL - v1.0.0**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![Powered by React](https://img.shields.io/badge/Powered%20by-React-blue.svg)
![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue.svg)
