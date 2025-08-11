#!/bin/bash

# Script di configurazione SSH per GitHub
echo "🔐 Configurazione SSH per GitHub"
echo "================================"

# Crea config SSH se non esiste
mkdir -p ~/.ssh

# Aggiungi configurazione per GitHub
cat >> ~/.ssh/config << 'EOF'

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  AddKeysToAgent yes
  UseKeychain yes
EOF

echo "✅ Config SSH aggiornata"

# Mostra la chiave pubblica da copiare
echo ""
echo "📋 COPIA QUESTA CHIAVE PUBBLICA:"
echo "================================"
cat ~/.ssh/id_ed25519_github.pub
echo "================================"
echo ""
echo "📌 ORA DEVI:"
echo "1. Copia la chiave sopra"
echo "2. Vai su: https://github.com/settings/keys"
echo "3. Clicca 'New SSH key'"
echo "4. Incolla la chiave e salva"
echo ""
echo "✅ Fatto? Premi ENTER per continuare..."
read

# Test connessione
echo "🧪 Test connessione SSH a GitHub..."
ssh -T git@github.com

# Cambia il remote del repository
echo ""
echo "🔄 Cambio remote repository a SSH..."
cd /Users/lucamambelli/Desktop/Cartella-Clinica
git remote set-url origin git@github.com:241luca/cartella-clinica.git
echo "✅ Remote aggiornato a SSH"

# Verifica
echo ""
echo "📍 Configurazione attuale:"
git remote -v

echo ""
echo "🎉 CONFIGURAZIONE COMPLETATA!"
echo "Ora puoi fare push senza inserire credenziali:"
echo "git push origin main"
