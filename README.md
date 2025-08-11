# 🏥 Cartella Clinica - Sistema Gestione Medicina Ravenna

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-18.3-61dafb)

Sistema completo per la gestione digitale delle cartelle cliniche e terapie riabilitative, sviluppato specificamente per **Medicina Ravenna SRL**.

## ✨ Features Principali

- 🎨 **UI/UX Moderna** - Design completamente rinnovato con colori accoglienti
- 👥 **Gestione Pazienti** - Anagrafica completa con ricerca avanzata
- 📋 **Cartelle Cliniche** - Digitali con allegati e timeline
- 💊 **13 Tipi di Terapie** - Gestione completa sedute e progressi
- 📅 **Calendario Integrato** - Vista multi-formato con drag & drop
- 📊 **Analytics Avanzate** - Dashboard con KPI e grafici real-time
- 🔐 **Sicurezza** - JWT auth, GDPR compliant, audit log
- 📱 **Responsive** - Ottimizzato per desktop, tablet e mobile

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/241luca/cartella-clinica.git
cd cartella-clinica

# Setup backend
cd backend
npm install
cp .env.example .env
# Configura DATABASE_URL nel .env
npx prisma migrate dev
npm run dev

# Setup frontend (nuovo terminal)
cd ../frontend
npm install
npm run dev
```

Apri browser su: **http://localhost:5183**

## 📚 Documentazione

Tutta la documentazione è disponibile nella cartella `/Docs`:

- 📖 [Setup Completo](./Docs/SETUP.md) - Guida installazione dettagliata
- 🎨 [Design System](./Docs/DESIGN_SYSTEM.md) - Componenti e stili UI
- 📡 [API Documentation](./Docs/API.md) - Endpoints e esempi
- 📘 [Manuale Utente](./Docs/USER_MANUAL.md) - Guida per gli utenti
- 📊 [Report Redesign](./Docs/REPORT_REDESIGN_UI_COMPLETATO.md) - Dettagli nuovo design

## 🛠️ Tech Stack

### Frontend
- React 18.3 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide React Icons

### Backend  
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## 📸 Screenshots

### Dashboard
![Dashboard](./Docs/screenshots/dashboard.png)

### Gestione Pazienti
![Pazienti](./Docs/screenshots/patients.png)

### Calendario Terapie
![Calendario](./Docs/screenshots/calendar.png)

## 👨‍💻 Sviluppo

```bash
# Test frontend
cd frontend
npm run test

# Test backend
cd backend
npm run test

# Build produzione
npm run build
```

## 📄 Licenza

Software proprietario - © 2025 Medicina Ravenna SRL. Tutti i diritti riservati.

## 🤝 Contatti

- **Sviluppatore**: Luca Mambelli
- **Email**: lucamambelli@lmtecnologie.it
- **GitHub**: [@241luca](https://github.com/241luca)

## 🙏 Acknowledgments

Sviluppato con ❤️ per **Medicina Ravenna SRL** con l'assistenza di Claude AI.

---

*Per maggiori informazioni, consulta la [documentazione completa](./Docs/README.md).*
