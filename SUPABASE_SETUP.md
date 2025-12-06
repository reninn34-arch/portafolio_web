# 📊 Configuración de Supabase para Portfolio Web

Este proyecto ahora utiliza **Supabase** como base de datos para almacenar toda la información del portafolio de forma persistente y sincronizada.

## 🚀 Configuración Rápida

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la **URL del proyecto** y la **anon key**

### 2. Configurar Variables de Entorno

Ya tienes el archivo `.env.local` configurado con:
```env
VITE_SUPABASE_URL = https://wsnccvnkwllbvqsdvdtx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Si estas son tus credenciales reales, ya está configurado.

### 3. Crear Tablas en Supabase

1. Abre tu proyecto en Supabase
2. Ve a la sección **SQL Editor**
3. Copia y pega el contenido del archivo `supabase-schema.sql`
4. Ejecuta el script (botón "Run")

Esto creará:
- ✅ Tabla `portfolio` - Para almacenar toda la información del portafolio
- ✅ Tabla `contact_messages` - Para mensajes del formulario de contacto
- ✅ Índices para mejorar el rendimiento
- ✅ Políticas de seguridad (RLS)
- ✅ Triggers para actualización automática de fechas

### 4. Verificar la Instalación

Ejecuta esta consulta en el SQL Editor para verificar:
```sql
SELECT * FROM portfolio;
SELECT * FROM contact_messages;
```

## 💾 Funcionamiento

### Guardado Automático

**Todo se guarda automáticamente en Supabase** cuando:
- ✏️ Editas experiencias, educación o habilidades
- 🖼️ Subes o eliminas proyectos en la galería
- 🛠️ Agregas o eliminas tecnologías del stack
- 👤 Actualizas la información del hero (foto, título, descripción)
- 📱 Configuras el número de WhatsApp
- 📄 Subes el CV en PDF
- 🔗 Modificas enlaces de redes sociales

### Sincronización en 3 Niveles

1. **Supabase (Base de datos)** - Almacenamiento persistente en la nube
2. **LocalStorage** - Cache local para acceso rápido
3. **GitHub** - Backup opcional en JSON

### Prioridad de Carga

Al abrir la página, intenta cargar datos en este orden:
1. 🥇 **Supabase** (prioridad principal)
2. 🥈 **GitHub JSON** (si Supabase falla)
3. 🥉 **LocalStorage** (último recurso)

## 🎮 Modo Administrador

**Contraseña:** `admin`

Una vez en modo admin, verás estos botones en el footer:

- 💾 **Guardar DB** - Guarda manualmente todo en Supabase
- 📥 **Cargar DB** - Recarga todos los datos desde Supabase
- 📤 **Exportar** - Descarga todo como JSON
- 📥 **Importar** - Sube un archivo JSON
- ☁️ **Guardar GitHub** - Sincroniza con GitHub
- ☁️ **Cargar GitHub** - Carga desde GitHub

## 📋 Estructura de Datos

### Tabla: `portfolio`

```typescript
{
  id: number;
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  logos: Array<{
    id: string;
    title: string;
    imageUrl: string;
    date: string;
    link?: string;
  }>;
  brands: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
  socials: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    email?: string;
  };
  hero_content: {
    title: string;
    name: string;
    description: string;
    profilePhoto: string;
    backgroundType: 'gradient' | 'image';
    gradientFrom: string;
    gradientVia: string;
    gradientTo: string;
    backgroundImage: string;
  };
  whatsapp: string;
  pdf_data: string; // Base64
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Tabla: `contact_messages`

```typescript
{
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: timestamp;
}
```

## 🔒 Seguridad

### Políticas RLS (Row Level Security)

Por defecto, el script SQL configura:

- ✅ **Lectura pública** del portfolio (cualquiera puede ver)
- ✅ **Escritura pública** del portfolio (permite ediciones desde el frontend)
- ✅ **Inserción pública** de mensajes de contacto
- ⚠️ **Lectura pública** de mensajes de contacto

### ⚠️ Importante para Producción

Si quieres restringir la edición solo a usuarios autenticados:

1. Ve a **Authentication** en Supabase y configura un método de auth
2. Modifica las políticas RLS en el SQL Editor:

```sql
-- Cambiar esta política
DROP POLICY "Allow authenticated insert/update on portfolio" ON portfolio;

CREATE POLICY "Allow authenticated insert/update on portfolio"
    ON portfolio
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
```

## 🛠️ Troubleshooting

### ❌ Error: "Failed to fetch from Supabase"

**Solución:**
1. Verifica que las credenciales en `.env.local` sean correctas
2. Asegúrate de que las tablas estén creadas
3. Revisa las políticas RLS en Supabase

### ❌ Error: "Permission denied for table portfolio"

**Solución:**
1. Ve a **Database → Tables → portfolio**
2. Click en "RLS" (Row Level Security)
3. Verifica que las políticas estén habilitadas

### 🔄 Forzar Recarga desde Supabase

Modo admin → Click en **"Cargar DB"** → Recarga la página

## 📦 Archivos Creados

```
services/
  ├── supabaseService.ts    # Cliente y funciones de Supabase
  ├── syncHelper.ts          # Helpers para sincronización automática
  └── githubService.ts       # (Ya existía) Backup en GitHub

supabase-schema.sql           # Script SQL para crear tablas
SUPABASE_SETUP.md            # Esta guía
```

## 🎯 Próximos Pasos

1. ✅ Ejecutar el script SQL en Supabase
2. ✅ Verificar que las tablas se crearon correctamente
3. ✅ Probar guardando datos en modo admin
4. ✅ Verificar en Supabase que los datos se guardaron
5. ✅ Recargar la página y confirmar que los datos persisten

## 💡 Características Adicionales

### Mensajes de Contacto

Si agregas un formulario de contacto al componente `Contact.tsx`, los mensajes se guardarán automáticamente en la tabla `contact_messages`.

Ejemplo de uso:
```typescript
import { saveContactMessage } from '../services/supabaseService';

const handleSubmit = async (data) => {
  const success = await saveContactMessage({
    name: data.name,
    email: data.email,
    message: data.message
  });
  
  if (success) {
    alert('¡Mensaje enviado!');
  }
};
```

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs en Supabase → Logs
3. Asegúrate de que las políticas RLS están bien configuradas

---

**✨ ¡Tu portafolio ahora tiene persistencia en la nube con Supabase!**
