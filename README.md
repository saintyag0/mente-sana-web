# 🧠 MenteSana — Directorio de Psicólogos en Chile

Directorio web para buscar psicólogos en Chile, con filtros por previsión, especialidad, modalidad y precio. Construido con **Next.js 14** y conectado a **Airtable** como base de datos.

---

## 🚀 Guía de instalación paso a paso

### Paso 1 — Configura tu tabla en Airtable

1. Entra a [airtable.com](https://airtable.com) y crea una cuenta (o inicia sesión).
2. Crea una nueva **Base** y dentro de ella una **tabla** llamada exactamente `Psicólogos`.
3. La tabla debe tener las siguientes columnas (respeta los nombres exactos):

| Nombre del campo | Tipo en Airtable |
|---|---|
| `Nombre` | Texto (línea única) |
| `Especialidad` | Selección múltiple |
| `Previsión` | Selección múltiple |
| `Modalidad` | Selección múltiple |
| `Precio Particular` | Número |
| `Descripción` | Texto largo |
| `Foto` | Adjunto (imagen) |
| `Link Agendamiento` | URL |
| `Años de Experiencia` | Número |
| `Ciudad` | Texto (línea única) |

**Valores recomendados para "Previsión":** Fonasa A, Fonasa B, Fonasa C, Fonasa D, Isapre  
**Valores recomendados para "Modalidad":** Online, Presencial

4. Agrega algunos psicólogos de prueba.

### Paso 2 — Obtén tus credenciales de Airtable

1. Ve a [airtable.com/create/tokens](https://airtable.com/create/tokens).
2. Crea un **Personal Access Token** con alcance `data.records:read` y acceso a tu base.
3. Copia el token (empieza con `pat...`).
4. Para el **Base ID**: en tu base de Airtable, ve a Help → API Documentation. El Base ID es el código que aparece en la URL, empieza con `app...`.

### Paso 3 — Configura las variables de entorno locales

Renombra el archivo `.env.example` a `.env.local` y rellena los valores:

```
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Psicólogos
```

### Paso 4 — Instala y ejecuta localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Despliegue en Vercel + GitHub

### GitHub

1. Crea una cuenta en [github.com](https://github.com).
2. Crea un repositorio nuevo llamado `directorio-psicologos` (público o privado).
3. Sube todos estos archivos al repositorio. Puedes hacerlo desde la web de GitHub arrastrando los archivos, o con la terminal:

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/directorio-psicologos.git
git push -u origin main
```

> **Importante:** el archivo `.env.local` está en `.gitignore` y NO se sube a GitHub (correcto, tus claves deben mantenerse privadas).

### Vercel

1. Ve a [vercel.com](https://vercel.com) y regístrate con tu cuenta de GitHub.
2. Haz clic en **"Add New" → "Project"**.
3. Selecciona el repositorio `directorio-psicologos`.
4. Antes de hacer clic en Deploy, ve a la sección **"Environment Variables"** y agrega:
   - `AIRTABLE_API_KEY` → tu token de Airtable
   - `AIRTABLE_BASE_ID` → tu Base ID
   - `AIRTABLE_TABLE_NAME` → `Psicólogos`
5. Haz clic en **"Deploy"**.

En 2-3 minutos tendrás tu directorio en línea con una URL del tipo `directorio-psicologos.vercel.app`.

---

## 🔄 Cómo funciona el sistema de búsqueda

1. **Conexión a Airtable**: la API route `/api/psicologos` hace fetch a Airtable con paginación automática.
2. **Filtrado estricto**: solo aparecen psicólogos que cumplen TODOS los filtros seleccionados.
3. **Ordenamiento por score**: cada perfil recibe un puntaje según cuántos filtros coinciden (previsión 40pts, especialidad 30pts, modalidad 20pts, precio 10pts). Los mejores matches aparecen primero.
4. **Caché de 60 segundos**: Next.js cachea las respuestas de Airtable para evitar exceder el límite de la API gratuita.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/psicologos/route.ts   # Endpoint de búsqueda
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout con fuentes
│   └── page.tsx                  # Página principal
├── components/
│   ├── FilterPanel.tsx           # Panel de filtros
│   └── PsicologoCard.tsx         # Tarjeta de psicólogo
└── lib/
    └── airtable.ts               # Lógica de Airtable + búsqueda
```

---

## 🛠️ Personalización

- **Cambiar el nombre del sitio**: edita `site-title` en `page.tsx` y el `metadata` en `layout.tsx`.
- **Agregar campos**: añade el campo en Airtable y luego actualiza la interfaz `Psicologo` en `src/lib/airtable.ts`.
- **Cambiar colores**: edita las variables CSS en `:root` dentro de `globals.css`.
"# mente-sana-cl" 
