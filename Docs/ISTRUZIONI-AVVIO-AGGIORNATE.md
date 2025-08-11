# 🚀 ISTRUZIONI AVVIO PROGETTO - AGGIORNATE

## 📍 PORTE UTILIZZATE
- **Backend**: `3100`
- **Frontend**: `5183` ⚠️ (IMPORTANTE: non 5173!)

---

## 🔧 AVVIO RAPIDO

### Backend (Terminal 1)
```bash
cd backend
npm run dev
# Server API su http://localhost:3100
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# UI su http://localhost:5183
```

### Oppure usa lo script automatico:
```bash
./start-frontend.sh
```

---

## ⚠️ IMPORTANTE - CONFIGURAZIONE PORTA

Il file `vite.config.ts` DEVE avere:
```typescript
server: {
  port: 5183,
  strictPort: true, // Forza l'uso della porta 5183
}
```

Se Vite dice "Port 5173 is in use, trying another one..." è NORMALE.
Il server si avvierà correttamente su **http://localhost:5183**

---

## 🧪 TEST ACCESSO

1. **Frontend**: http://localhost:5183
2. **Backend API**: http://localhost:3100/health
3. **Login Test**:
   - Email: admin@medicinaravenna.it
   - Password: admin123

---

## 🔍 TROUBLESHOOTING

### Se la porta 5183 è occupata:
```bash
# Trova il processo
lsof -i :5183

# Killa il processo
kill -9 [PID]

# O usa il comando automatico
pkill -f "node.*5183"
```

### Se vedi errori di Tailwind CSS:
Il progetto NON usa Tailwind. Usa CSS vanilla in `src/index.css`

### Se la pagina è bianca:
1. Controlla la console del browser (F12)
2. Verifica che il server sia su porta 5183
3. Pulisci la cache: `rm -rf .vite`

---

## 📊 STATO SERVIZI

| Servizio | URL | Porta | Status |
|----------|-----|-------|--------|
| Backend API | http://localhost:3100 | 3100 | ✅ Configurato |
| Frontend | http://localhost:5183 | 5183 | ✅ IMPORTANTE |
| PostgreSQL | localhost | 5432 | ✅ Standard |
| Prisma Studio | http://localhost:5555 | 5555 | ✅ Standard |

---

## 🛡️ CONFIGURAZIONE CORRETTA

### vite.config.ts
```typescript
export default defineConfig({
  server: {
    port: 5183,        // Porta custom
    strictPort: true,  // Forza questa porta
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
      }
    }
  }
})
```

---

*Documento aggiornato: 10 Agosto 2025 - PORTA FRONTEND: 5183*
