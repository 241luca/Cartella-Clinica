# Configurazione GitHub - Cartella Clinica

## ✅ CONFIGURAZIONE ATTUALE: SSH GIÀ CONFIGURATO!

**La configurazione SSH è già attiva e funzionante.**
**NON serve configurare nulla, NON serve password!**

## 🚀 COMANDI DA USARE (SENZA PASSWORD)

```bash
# Push semplice - NESSUNA PASSWORD RICHIESTA
git push origin main

# Pull semplice - NESSUNA PASSWORD RICHIESTA
git pull origin main
```

## ⚠️ IMPORTANTE

- **SSH è GIÀ configurato** - Non toccare nulla
- **Nessuna password necessaria** - Funziona automaticamente
- **Nessun token necessario** - Usa SSH

## Configurazione Attuale

### SSH Key (GIÀ CONFIGURATA)
```bash
# Remote già configurato come SSH
# URL: git@github.com:241luca/cartella-clinica.git
# Tutto funziona senza password!
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
