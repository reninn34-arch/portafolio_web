# ⚡ Inicio Rápido - Supabase

## 🎯 Para activar Supabase en tu proyecto:

### 1️⃣ Abre Supabase Dashboard
```
https://supabase.com → Tu Proyecto
```

### 2️⃣ Ve al SQL Editor
```
Dashboard → SQL Editor → New Query
```

### 3️⃣ Copia y Pega el Script
```
Abre el archivo: supabase-schema.sql
Copia TODO el contenido
Pega en el SQL Editor de Supabase
```

### 4️⃣ Ejecuta el Script
```
Click en "Run" (botón verde)
Espera el mensaje: "Success. No rows returned"
```

### 5️⃣ Verifica las Tablas
```sql
SELECT * FROM portfolio;
SELECT * FROM contact_messages;
```

### 6️⃣ ¡Listo! 🎉
```bash
npm run dev
```

---

## 🧪 Prueba Rápida

1. Abre el navegador en `http://localhost:3000`
2. Abre la consola (F12)
3. Busca mensajes como:
   - "✅ Datos cargados desde Supabase"
   - "✅ [sección] sincronizado con Supabase"

4. Entra en modo admin (contraseña: `admin`)
5. Edita algo (experiencia, skill, etc.)
6. Ve a Supabase → Table Editor → portfolio
7. ¡Verás tus datos guardados!

---

## 🆘 Si algo falla

1. Verifica que el script SQL se ejecutó correctamente
2. Revisa que las credenciales en `.env.local` sean correctas
3. Asegúrate de que las tablas existen en Supabase
4. Revisa la consola del navegador para ver errores

---

**Tiempo estimado:** 2-3 minutos ⏱️

Para más detalles, lee: `SUPABASE_SETUP.md`
