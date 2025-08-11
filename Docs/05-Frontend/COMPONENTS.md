# Componenti Frontend - Documentazione

## 📦 Componenti Creati

### 1. Loading
**Path**: `/src/components/ui/Loading.tsx`

**Props**:
- `size?: 'small' | 'medium' | 'large'` - Dimensione dello spinner
- `fullScreen?: boolean` - Se mostrare a schermo intero

**Utilizzo**:
```tsx
// Spinner normale
<Loading size="medium" />

// Loading a schermo intero
<Loading fullScreen />
```

---

### 2. ProtectedRoute
**Path**: `/src/components/ProtectedRoute.tsx`

**Props**:
- `requiredRole?: string[]` - Ruoli richiesti per accedere

**Utilizzo**:
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>

// Con ruolo specifico
<Route element={<ProtectedRoute requiredRole={['admin', 'medico']} />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>
```

---

### 3. LoginPage
**Path**: `/src/pages/LoginPage.tsx`

**Features**:
- Validazione form con react-hook-form e Zod
- Gestione errori con toast notifications
- Credenziali di test visibili in sviluppo
- Auto-redirect se già autenticato

**Credenziali Test**:
- Admin: `admin@medicinaravenna.it` / `admin123`
- Terapista: `terapista@medicinaravenna.it` / `therapist123`

---

### 4. DashboardPage
**Path**: `/src/pages/DashboardPage.tsx`

**Features**:
- Statistiche principali (placeholder)
- Azioni rapide
- Attività recenti
- Welcome message personalizzato

---

## 🎨 Componenti UI Base (Tailwind Classes)

### Bottoni
```css
.btn - Base button class
.btn-primary - Primary colored button
.btn-secondary - Secondary colored button
.btn-outline - Outlined button
```

### Card
```css
.card - Card container con ombra e bordi
```

### Input
```css
.input - Input field styled
.label - Label for inputs
```

---

## 🔧 Servizi

### API Service
**Path**: `/src/services/api.ts`

**Features**:
- Configurazione Axios con baseURL
- Interceptors per token JWT
- Auto-refresh token
- Gestione errori centralizzata

**Metodi**:
```typescript
authService.login(email, password)
authService.logout()
authService.getCurrentUser()
authService.getStoredUser()
authService.isAuthenticated()
```

---

## 🌐 Context

### AuthContext
**Path**: `/src/contexts/AuthContext.tsx`

**Provides**:
```typescript
{
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
```

**Hook**:
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

---

## 📁 Struttura File

```
frontend/src/
├── components/
│   ├── common/        # (da popolare)
│   ├── forms/         # (da popolare)
│   ├── ui/
│   │   └── Loading.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── utils/            # (da popolare)
├── App.tsx
├── index.css         # Tailwind styles
└── main.tsx
```

---

## 🎨 Tema e Colori

### Colori Principali
- **Primary**: Blue (#3B82F6)
- **Secondary**: Indigo (#6366F1)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Font
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Monospace**: Fira Code

---

## 📝 Note di Sviluppo

1. **TypeScript**: Tutti i componenti usano TypeScript per type safety
2. **Tailwind**: Styling fatto principalmente con utility classes
3. **Form Validation**: Utilizzo di react-hook-form + Zod
4. **State Management**: Context API per stato globale
5. **Routing**: React Router v6 con route protette
6. **API Calls**: Axios con interceptors per auth
7. **Notifications**: react-hot-toast per feedback utente

---

*Documento aggiornato: 10 Agosto 2025*
