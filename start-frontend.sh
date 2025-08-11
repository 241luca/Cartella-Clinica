#!/bin/bash

echo "🚀 Avvio Frontend Cartella Clinica..."
echo "=================================="

# Vai alla directory frontend
cd /Users/lucamambelli/Desktop/Cartella-Clinica/frontend

# Verifica che node_modules esista
if [ ! -d "node_modules" ]; then
    echo "📦 Installazione dipendenze..."
    npm install
fi

# Pulisci la cache di Vite
echo "🧹 Pulizia cache..."
rm -rf .vite

# Killa eventuali processi che usano le porte
echo "🔧 Liberazione porte..."
lsof -ti:5183 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Avvia il server
echo "🌐 Avvio server su http://localhost:5183..."
echo "=================================="
npm run dev

echo "✅ Server avviato sulla porta 5183!"
