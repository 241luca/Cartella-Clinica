# Configurazione GitHub - Cartella Clinica

## ⚠️ IMPORTANTE: SICUREZZA CREDENZIALI

**MAI** includere token o password nel codice o nei commit!

## Configurazione Raccomandata

### Opzione 1: GitHub CLI (Consigliata)
```bash
# Installa GitHub CLI
brew install gh

# Autenticati
gh auth login

# Segui le istruzioni interattive
```

### Opzione 2: SSH Key
```bash
# Genera chiave SSH
ssh-keygen -t ed25519 -C "your-email@example.com"

# Aggiungi a GitHub: Settings → SSH Keys

# Configura remote
git remote set-url origin git@github.com:241luca/cartella-clinica.git
```

### Opzione 3: Personal Access Token
1. Crea token su GitHub: Settings → Developer settings → Personal access tokens
2. Usa con: `git push https://USERNAME:TOKEN@github.com/241luca/cartella-clinica.git main`
3. **NON** salvare il token in file del progetto!

## Repository

- **URL HTTPS**: https://github.com/241luca/cartella-clinica.git
- **URL SSH**: git@github.com:241luca/cartella-clinica.git
- **Owner**: 241luca

## Best Practices

1. Usa `.env` per credenziali locali (MAI commitarlo)
2. Usa `.env.example` per template senza valori sensibili
3. Configura GitHub CLI o SSH per autenticazione
4. Mai includere token nei commit
5. GitHub revoca automaticamente token esposti pubblicamente

## Troubleshooting

Se ricevi errore di autenticazione:
1. Verifica che non ci siano token nel codice
2. Genera un nuovo token
3. Usa `gh auth login` per autenticazione sicura
