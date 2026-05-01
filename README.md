# TriFlow - Asistente IA de Salud y Fitness

Una aplicación personal de fitness con asistente IA integrado que te ayuda a alcanzar tus objetivos de salud.

## Características

- 🎯 Seguimiento de peso y progreso
- 💧 Control de consumo de agua
- 🏋️ Plan de entrenamiento personalizado
- 📦 Gestión de despensa
- 🍽️ Menú semanal personalizado
- ✦ Asistente IA con Claude 3 Opus

## Stack Tecnológico

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express (Vercel Serverless)
- **Base de Datos**: Supabase
- **IA**: Anthropic Claude 3 Opus
- **Hosting**: Vercel

## Instalación Local

### Requisitos
- Node.js 18+
- npm o yarn

### Setup

\`\`\`bash
# Clonar repositorio
git clone https://github.com/tu-usuario/triflow.git
cd triflow

# Instalar dependencias
npm install

# Configurar API key
PowerShell .\setup-api-key.ps1

# Ejecutar en desarrollo
npm run dev
\`\`\`

## Deployment en Vercel

### 1. Conectar repositorio

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

### 2. Configurar variables de entorno en Vercel

- Vercel Dashboard → Project → Settings → Environment Variables
- Agrega: \`ANTHROPIC_KEY\` con tu API key

### 3. Configurar dominio

- Vercel Settings → Domains
- Agrega tu dominio (ej: triflow.cl)

## Endpoints API

- \`POST /api/chat\` - Chat con asistente IA

## Seguridad

⚠️ **IMPORTANTE:**
- **Nunca** commits el archivo \`.env\` con tu API key
- Usa variables de entorno en Vercel
- El archivo \`.gitignore\` protege archivos sensibles

## Versión

✓ Producción lista para desplegar
