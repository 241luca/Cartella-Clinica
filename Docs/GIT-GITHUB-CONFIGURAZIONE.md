# 🔐 CONFIGURAZIONE GIT/GITHUB - IMPORTANTE!
## Sistema Cartella Clinica - SSH già configurato

---

## ✅ CONFIGURAZIONE ATTUALE

### GitHub è configurato con autenticazione SSH
- **Username**: 241luca
- **Email**: lucamambelli@lmtecnologie.it
- **Repository**: https://github.com/241luca/cartella-clinica
- **Autenticazione**: SSH (chiave già configurata)

## 🚀 COMANDI GIT - NESSUNA PASSWORD RICHIESTA!

### Per salvare le modifiche su GitHub:
```bash
# 1. Vai nella directory del progetto
cd /Users/lucamambelli/Desktop/Cartella-Clinica

# 2. Aggiungi tutti i file modificati
git add -A

# 3. Crea un commit con descrizione
git commit -m "feat: descrizione delle modifiche"

# 4. Push su GitHub - NESSUNA PASSWORD!
git push origin main
```

### Per scaricare le ultime modifiche:
```bash
# Pull da GitHub - NESSUNA PASSWORD!
git pull origin main
```

### Esempi di commit message:
```bash
git commit -m "feat: aggiunto nuovo componente"
git commit -m "fix: corretto bug nel salvataggio"
git commit -m "docs: aggiornata documentazione"
git commit -m "test: aggiunti test per terapie"
git commit -m "refactor: ottimizzato codice dashboard"
```

---

## ⚠️ IMPORTANTE

### ✅ COSA FUNZIONA:
- `git push origin main` - **Funziona senza password**
- `git pull origin main` - **Funziona senza password**
- SSH è già configurato e funzionante

### ❌ NON USARE:
- NON usare token di accesso
- NON inserire password
- NON usare HTTPS per il remote

### 🔍 Per verificare la configurazione:
```bash
# Verifica il remote URL (deve essere SSH)
git remote -v

# Output atteso:
# origin  git@github.com:241luca/cartella-clinica.git (fetch)
# origin  git@github.com:241luca/cartella-clinica.git (push)
```

---

## 📝 WORKFLOW CONSIGLIATO

### Ogni ora durante lo sviluppo:
```bash
git add -A
git commit -m "wip: salvataggio progressi"
git push origin main
```

### A fine sessione:
```bash
git add -A
git commit -m "feat: completato [descrizione lavoro fatto]"
git push origin main
```

### All'inizio di una nuova sessione:
```bash
# Per essere sicuri di avere l'ultima versione
git pull origin main
```

---

## 🆘 TROUBLESHOOTING

### Se dovesse chiedere la password:
1. Verifica che il remote sia SSH: `git remote -v`
2. Se è HTTPS, cambialo in SSH:
```bash
git remote set-url origin git@github.com:241luca/cartella-clinica.git
```

### Se ci sono conflitti durante il pull:
```bash
# Salva le tue modifiche
git stash

# Scarica le ultime modifiche
git pull origin main

# Riapplica le tue modifiche
git stash pop
```

---

## 📌 NOTA FINALE

**La configurazione SSH è già attiva e funzionante.**
Non c'è bisogno di configurare nulla, basta usare i comandi git normalmente senza preoccuparsi di password o token.

Ogni `git push origin main` salverà automaticamente il lavoro su GitHub senza richiedere credenziali!

---

*Documento creato: 11 Agosto 2025*
*Autore: Claude Assistant*
*Configurazione: SSH attiva e funzionante*
