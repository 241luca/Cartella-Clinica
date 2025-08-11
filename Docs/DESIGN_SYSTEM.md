# 🎨 DESIGN SYSTEM v2.0

## Filosofia di Design

Il nuovo design system si basa su principi di:
- **Chiarezza**: Informazioni sempre visibili e accessibili
- **Modernità**: UI contemporanea e accattivante
- **Professionalità**: Adatto all'ambiente medico
- **Accessibilità**: WCAG 2.1 AA compliant

## 🎨 Colori

### Palette Principale

```scss
// Primary Colors
$primary-50: #EEF2FF;   // Backgrounds
$primary-100: #E0E7FF;  // Hover states
$primary-200: #C7D2FE;  // Borders
$primary-300: #A5B4FC;  // Disabled
$primary-400: #818CF8;  // Links
$primary-500: #6366F1;  // Buttons
$primary-600: #4F46E5;  // Primary actions (Indigo)
$primary-700: #4338CA;  // Hover primary
$primary-800: #3730A3;  // Active states
$primary-900: #312E81;  // Dark mode

// Secondary Colors  
$secondary-500: #8B5CF6; // Purple accents
$secondary-600: #7C3AED; // Purple primary

// Status Colors
$success: #10B981;   // Green - Completato, successo
$warning: #F59E0B;   // Amber - Attenzione, in corso
$error: #EF4444;     // Red - Errori, cancellazioni
$info: #3B82F6;      // Blue - Informazioni
```

### Utilizzo Colori per Contesto

| Contesto | Colore | Hex | Uso |
|----------|--------|-----|-----|
| Primary Action | Indigo-600 | #4F46E5 | Bottoni principali, CTA |
| Secondary Action | Purple-600 | #7C3AED | Azioni secondarie |
| Success | Green-500 | #10B981 | Stati completati, conferme |
| Warning | Amber-500 | #F59E0B | Alert, attenzione |
| Danger | Red-500 | #EF4444 | Eliminazioni, errori |
| Neutral | Gray-500 | #6B7280 | Testi secondari |

## 📐 Tipografia

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Scale Tipografica

| Elemento | Size | Weight | Line Height | Uso |
|----------|------|--------|-------------|-----|
| H1 | 2.5rem (40px) | 700 | 1.2 | Titoli pagina |
| H2 | 2rem (32px) | 600 | 1.3 | Sezioni principali |
| H3 | 1.5rem (24px) | 600 | 1.4 | Card titles |
| H4 | 1.25rem (20px) | 500 | 1.5 | Sottosezioni |
| Body | 1rem (16px) | 400 | 1.6 | Testo normale |
| Small | 0.875rem (14px) | 400 | 1.5 | Labels, help text |
| XSmall | 0.75rem (12px) | 400 | 1.4 | Badges, meta info |

## 🗂️ Componenti

### Cards

```jsx
// Standard Card
<div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
  {/* Content */}
</div>

// Stats Card
<div className="bg-white rounded-xl p-6 border border-gray-200">
  <div className="flex items-center justify-between mb-3">
    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary-600" />
    </div>
  </div>
  <p className="text-sm text-gray-500 mb-1">Label</p>
  <p className="text-2xl font-bold text-gray-900">Value</p>
</div>
```

### Buttons

```jsx
// Primary Button
<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
  Primary Action
</button>

// Secondary Button
<button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
  Secondary
</button>

// Danger Button
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
  Delete
</button>

// Icon Button
<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### Form Elements

```jsx
// Input Field
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  <input
    type="text"
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    placeholder="Cerca..."
  />
</div>

// Select
<select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
  <option>Opzione 1</option>
  <option>Opzione 2</option>
</select>
```

### Badges

```jsx
// Status Badges
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
  <CheckCircle className="w-3 h-3" />
  Completato
</span>

// Count Badge
<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
  5
</span>
```

### Tables

```jsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Nome
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Contenuto
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 📱 Breakpoints

```scss
// Tailwind Default Breakpoints
$sm: 640px;   // Mobile landscape
$md: 768px;   // Tablet
$lg: 1024px;  // Desktop
$xl: 1280px;  // Large desktop
$2xl: 1536px; // Extra large

// Usage
@media (min-width: $md) {
  // Tablet and up
}
```

## 🎯 Spacing System

Usa la scala di spacing di Tailwind (base 4px):

| Class | Size | Pixels | Uso |
|-------|------|--------|-----|
| space-1 | 0.25rem | 4px | Micro spacing |
| space-2 | 0.5rem | 8px | Tight spacing |
| space-3 | 0.75rem | 12px | Small spacing |
| space-4 | 1rem | 16px | Default spacing |
| space-6 | 1.5rem | 24px | Medium spacing |
| space-8 | 2rem | 32px | Large spacing |
| space-12 | 3rem | 48px | Section spacing |

## 🌓 Shadows

```scss
// Elevation Levels
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
$shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## 🎨 Stati Interattivi

### Hover States
- Cards: `hover:shadow-lg`
- Buttons: Darken color by 10%
- Links: `hover:text-indigo-700`
- Rows: `hover:bg-gray-50`

### Focus States
- Inputs: `focus:ring-2 focus:ring-indigo-500`
- Buttons: `focus:outline-none focus:ring-2 focus:ring-offset-2`

### Active States
- Buttons: Scale down `active:scale-95`
- Navigation: Bold + colored background

### Disabled States
- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`
- No hover effects

## 🔄 Animazioni

### Transizioni Standard

```css
/* Default transition */
transition: all 0.2s ease-in-out;

/* Color transitions */
transition: color 0.15s ease-in-out;

/* Transform transitions */
transition: transform 0.2s ease-in-out;
```

### Loading States

```jsx
// Spinner
<div className="relative">
  <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
</div>

// Skeleton
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

## 🎯 Layout Patterns

### Dashboard Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stats cards */}
</div>
```

### Sidebar Layout
```jsx
<div className="flex">
  <aside className="w-64 bg-white border-r">
    {/* Sidebar content */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Card items */}
</div>
```

## 🎨 Icone

Utilizziamo **Lucide React** per consistenza:

```jsx
import { 
  User, 
  Calendar, 
  FileText, 
  Activity,
  ChevronRight,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';

// Standard size
<Icon className="w-5 h-5" />

// Small size
<Icon className="w-4 h-4" />

// Large size
<Icon className="w-6 h-6" />
```

## 📋 Best Practices

1. **Consistenza**: Usa sempre gli stessi componenti per funzioni simili
2. **Gerarchia**: Mantieni chiara la gerarchia visiva con size e weight
3. **Spacing**: Usa spacing consistente (multipli di 4px)
4. **Feedback**: Fornisci sempre feedback visivo per azioni utente
5. **Accessibilità**: Mantieni contrasto minimo 4.5:1 per testi
6. **Mobile First**: Progetta prima per mobile, poi espandi
7. **Performance**: Usa lazy loading per immagini e componenti pesanti

## 🔗 Risorse

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Figma Design File](link-to-figma) *(da creare)*

---
*Design System v2.0 - Agosto 2025*
