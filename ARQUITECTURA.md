# 🏗️ Arquitectura del Sistema - Portfolio con Supabase

```
┌─────────────────────────────────────────────────────────────────┐
│                      INTERFAZ DE USUARIO                        │
│                    (React + TypeScript)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Hero   │  │  Brands  │  │  Logos   │  │ Contact  │      │
│  │Component │  │Component │  │Component │  │Component │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │              │
│       └─────────────┴─────────────┴─────────────┘              │
│                          │                                      │
│                   ┌──────▼──────┐                              │
│                   │   App.tsx   │                              │
│                   │  (Estado    │                              │
│                   │   Global)   │                              │
│                   └──────┬──────┘                              │
└──────────────────────────┼─────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│  syncHelper   │  │ supabaseServ  │  │githubService │
│      .ts      │  │     ice.ts    │  │     .ts      │
└───────┬───────┘  └───────┬───────┘  └──────┬───────┘
        │                  │                  │
        │    ┌─────────────┘                  │
        │    │                                │
        ▼    ▼                                ▼
┌──────────────────┐              ┌────────────────┐
│  localStorage    │              │  GitHub Repo   │
│  (Cache Local)   │              │  (Backup JSON) │
└──────────────────┘              └────────────────┘
        ▲
        │
        │ Fallback
        │
        ▼
┌──────────────────────────────────────────────┐
│           SUPABASE (Base de Datos)           │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐    ┌──────────────────┐  │
│  │  portfolio   │    │ contact_messages │  │
│  │   (tabla)    │    │     (tabla)      │  │
│  ├──────────────┤    ├──────────────────┤  │
│  │ experiences  │    │ name             │  │
│  │ education    │    │ email            │  │
│  │ skills       │    │ message          │  │
│  │ logos        │    │ created_at       │  │
│  │ brands       │    └──────────────────┘  │
│  │ socials      │                          │
│  │ hero_content │                          │
│  │ whatsapp     │                          │
│  │ pdf_data     │                          │
│  │ created_at   │                          │
│  │ updated_at   │                          │
│  └──────────────┘                          │
│                                              │
│  RLS Policies ✓  Triggers ✓  Indexes ✓     │
└──────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### 📤 Guardado (Write)
```
Usuario edita → Componente actualiza estado →
syncHelper.syncToSupabase() →
localStorage (cache) + Supabase (persistencia) →
✅ Confirmación en consola
```

### 📥 Carga (Read)
```
App inicia → loadPortfolioData() →
1. Intenta Supabase (fetchPortfolioFromSupabase)
   ✅ Success → Actualiza estado + localStorage
   ❌ Fail → Siguiente paso
2. Intenta GitHub (fetchPortfolioDataFromGitHub)
   ✅ Success → Actualiza estado + localStorage
   ❌ Fail → Siguiente paso
3. Lee localStorage
   ✅ Success → Actualiza estado
   ❌ Fail → Usa valores por defecto
```

## 🎯 Puntos de Integración

### Sincronización Automática
```typescript
// En cada componente
import { syncToSupabase } from '../services/syncHelper';

const handleSave = async () => {
  // Guardar localmente
  setSomeData(newData);
  
  // Sincronizar con Supabase
  await syncToSupabase('key', newData);
};
```

### Guardado Manual
```typescript
// En App.tsx (modo admin)
const handleSaveToSupabase = async () => {
  const allData = getAllPortfolioData();
  await savePortfolioToSupabase(allData);
};
```

## 📊 Estructura de Archivos

```
portafolio web/
├── services/
│   ├── supabaseService.ts    # 🔵 Cliente Supabase + CRUD
│   ├── syncHelper.ts          # 🔄 Auto-sync helpers
│   └── githubService.ts       # ☁️  Backup GitHub
├── components/
│   ├── Hero.tsx              # 👤 Info personal + socials
│   ├── Brands.tsx            # 🛠️  Stack tecnológico
│   ├── LogoGallery.tsx       # 🖼️  Proyectos/galería
│   ├── Resume.tsx            # 📝 Experiencia + skills
│   ├── Contact.tsx           # 📨 Formulario contacto
│   └── FloatingWhatsApp.tsx  # 📱 WhatsApp button
├── App.tsx                   # 🎮 Estado global + routing
├── supabase-schema.sql       # 🗄️  Script creación tablas
├── .env.local                # 🔐 Credenciales (no subir)
├── .env.example              # 📋 Template credenciales
├── SUPABASE_SETUP.md         # 📖 Guía detallada
├── CAMBIOS_SUPABASE.md       # 📝 Log de cambios
├── README_SUPABASE.md        # 🎉 Resumen completo
├── INICIO_RAPIDO.md          # ⚡ Quick start
└── ARQUITECTURA.md           # 🏗️  Este archivo
```

## 🔐 Seguridad

### Variables de Entorno
```
.env.local (local, no se sube)
├── VITE_SUPABASE_URL
└── VITE_SUPABASE_ANON_KEY

.env.example (template, sí se sube)
└── Plantilla sin credenciales reales
```

### Row Level Security (RLS)
```sql
-- Lectura pública del portfolio
POLICY "Allow public read" → cualquiera puede ver

-- Escritura pública (ajustable)
POLICY "Allow public write" → cualquiera puede editar
⚠️ En producción: restringir a usuarios autenticados

-- Contacto
POLICY "Allow public insert" → cualquiera puede enviar
POLICY "Allow auth read" → solo admin lee mensajes
```

## 📈 Escalabilidad

### Actual
- ✅ Base de datos Supabase (PostgreSQL)
- ✅ Almacenamiento en JSONB (flexible)
- ✅ Índices para rendimiento
- ✅ Triggers automáticos

### Futuro (opcional)
- 🔄 Real-time subscriptions
- 🔐 Autenticación de usuarios
- 📊 Analytics y métricas
- 🖼️  Storage para imágenes grandes
- 🌐 CDN para assets

## 🎯 Beneficios de esta Arquitectura

### 1. Persistencia Confiable
- ✅ Datos en la nube (Supabase)
- ✅ Cache local (localStorage)
- ✅ Backup opcional (GitHub)

### 2. Performance
- ⚡ Carga inicial desde cache
- ⚡ Sincronización en background
- ⚡ Índices en BD para queries rápidas

### 3. Experiencia de Usuario
- 🔄 Guardado automático
- 💾 Sin pérdida de datos
- ⚡ Interfaz responsive
- ✅ Feedback visual

### 4. Mantenibilidad
- 📦 Código modular
- 🎯 Separación de concerns
- 📝 Bien documentado
- 🧪 Fácil de testear

---

**Creado por:** GitHub Copilot  
**Fecha:** 6 de diciembre de 2025
