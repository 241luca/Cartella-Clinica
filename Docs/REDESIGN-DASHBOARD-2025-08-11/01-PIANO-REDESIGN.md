# 🎨 Piano di Redesign Dashboard - Cartella Clinica
## Data: 11 Agosto 2025

---

## 📋 OBIETTIVI DEL REDESIGN

### Principi di Design
1. **Minimalismo**: Interfaccia pulita e senza elementi superflui
2. **Chiarezza**: Informazioni immediate e facilmente leggibili
3. **Professionalità**: Aspetto medico/clinico professionale
4. **Usabilità**: Navigazione intuitiva e azioni chiare
5. **Responsività**: Perfetta visualizzazione su tutti i dispositivi

### Ispirazione
- Design simile a Soccer Manager (riferimento allegato)
- Cards flat con ombre leggere
- Colori sobri e professionali
- Icone monocromatiche
- Spazi bianchi ben bilanciati

---

## 🎨 NUOVO DESIGN SYSTEM

### Palette Colori
```css
/* Colori Primari */
--primary: #4F46E5;      /* Indigo principale */
--primary-light: #818CF8; /* Indigo chiaro */
--primary-dark: #3730A3;  /* Indigo scuro */

/* Colori Neutri */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Colori Semantici */
--success: #10B981;  /* Verde */
--warning: #F59E0B;  /* Ambra */
--danger: #EF4444;   /* Rosso */
--info: #3B82F6;     /* Blu */

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
```

### Tipografia
```css
/* Font Family */
--font-primary: 'Inter', -apple-system, system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Componenti Base

#### Card
```css
.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### Buttons
```css
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}
```

---

## 🏗️ STRUTTURA LAYOUT

### 1. Header
- Logo a sinistra con nome applicazione
- Area notifiche e profilo utente a destra
- Altezza: 64px
- Background: Bianco con bordo inferiore sottile

### 2. Sidebar
- Larghezza: 260px (collassabile a 64px)
- Background: Bianco con bordo destro
- Menu items con icone monocromatiche
- Hover states sottili
- Indicatore attivo con colore primario

### 3. Main Content Area
- Background: #F9FAFB
- Padding: 32px
- Contenuto responsive

### 4. Dashboard Components

#### Sezione Statistiche Principali
- 6 cards in griglia responsive
- Ogni card mostra:
  - Icona monocromatica
  - Label descrittiva
  - Valore numerico prominente
  - Trend indicator (opzionale)

#### Sezione Attività Giornaliera
- Card con lista sedute del giorno
- Visualizzazione compatta con:
  - Orario
  - Nome paziente
  - Tipo terapia
  - Stato

#### Sezione Riepilogo Mensile
- Grafici minimali
- Statistiche chiave
- Progress bars per completamento obiettivi

#### Sezione Azioni Rapide
- Bottoni per azioni frequenti
- Accesso rapido a funzioni principali

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
/* Base: 0-639px */

/* Tablet */
@media (min-width: 640px) { }

/* Desktop Small */
@media (min-width: 1024px) { }

/* Desktop Large */
@media (min-width: 1280px) { }

/* Desktop XL */
@media (min-width: 1536px) { }
```

---

## 🔄 FASI DI IMPLEMENTAZIONE

### Fase 1: Setup Base (In corso)
- [x] Analisi dashboard esistente
- [x] Definizione design system
- [ ] Creazione componenti base

### Fase 2: Componenti UI
- [ ] Nuovo Header
- [ ] Nuovo Sidebar
- [ ] Card components
- [ ] Tabelle e liste

### Fase 3: Dashboard Page
- [ ] Layout responsive
- [ ] Sezione statistiche
- [ ] Sezione attività
- [ ] Sezione grafici

### Fase 4: Polishing
- [ ] Animazioni e transizioni
- [ ] Dark mode (opzionale)
- [ ] Ottimizzazione performance
- [ ] Testing responsive

---

## 📊 METRICHE DI SUCCESSO

1. **Performance**
   - Tempo caricamento < 1s
   - First Contentful Paint < 500ms
   - Lighthouse score > 95

2. **Usabilità**
   - Navigazione intuitiva
   - Informazioni trovabili in < 3 click
   - Leggibilità ottimale

3. **Estetica**
   - Design coerente
   - Gerarchia visiva chiara
   - Spazi bianchi bilanciati

---

## 🚀 PROSSIMI PASSI

1. Backup del codice esistente ✓
2. Creazione nuovi componenti base
3. Implementazione nuovo layout
4. Migrazione contenuti esistenti
5. Testing e ottimizzazione
6. Documentazione finale

---

*Documento creato da: Assistant AI*
*Data: 11 Agosto 2025*
*Versione: 1.0*
