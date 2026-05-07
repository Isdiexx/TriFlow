# TriFlow — Architecture Documentation

## Stack

| Layer | Tech | Details |
|-------|------|---------|
| Frontend | React 19 + Vite 8 | Single-page app, CSS-in-JS inline |
| Hosting | Vercel | Auto-deploy from `main` branch |
| Database | Supabase (PostgreSQL) | Free tier, hosted EU |
| Auth | Supabase Auth | Google, GitHub OAuth + email/password |
| AI | Anthropic Claude Haiku 4.5 | Via serverless proxy (`/api/*`) |
| Monitoring | Sentry | Error tracking, production only |
| Domain | triflow.cl | DNS via Vercel |

## Project Structure

```
triflow/
  src/
    App.jsx            # Main app (~1700 lines, all tabs)
    main.jsx           # Entry point + Sentry init
    designSystem.js    # Spacing, typography, colors, helpers
    LandingPage.jsx    # Public landing page
  api/
    chat.js            # AI assistant proxy
    generate-menu.js   # Menu generation endpoint
    generate-training.js # Training plan endpoint
  supabase/
    000_pending_migrations.sql
    001_rls_policies.sql
    002_indexes.sql
  server.js            # Local dev server (not deployed)
  vercel.json          # Vercel configuration
```

## Database Schema

### Tables (all have RLS enabled)

**profiles** — User identity and goals
- `id` UUID (PK, matches auth.uid())
- `email`, `nombre`, `apellido`
- `peso_actual`, `peso_meta` (float)
- `objetivo` (bajar_peso | ganar_musculo | rendimiento)
- `restricciones` (text[])
- `pais` (text, default 'Chile')
- `dias_entrenamiento` (int, default 3)

**agua_diaria** — Daily water tracking
- `user_id`, `fecha` (unique pair)
- `vasos` (int, 0-8)

**stock** — Pantry inventory
- `user_id`, `nombre`, `cantidad`, `unidad`
- `minimo` (reorder threshold)

**menu_semanal** — AI-generated weekly menu
- `user_id`, `dia` (Lunes-Domingo)
- `desayuno`, `almuerzo`, `snack`, `cena` (text)

**menu_diario** — Meal completion tracking
- `user_id`, `fecha`, `comida`
- `completada` (bool), `comentario` (text)

**sesiones** — Training sessions (4-week mesocycle)
- `user_id`, `dia`, `grupo`, `descripcion`
- `completada` (bool)
- `logs` (jsonb — reps/weight per set)
- `rpe` (int 0-10, perceived exertion)

**progreso_peso** — Weight history
- `user_id`, `peso`, `fecha`, `created_at`

**habitos** — Custom daily habits
- `user_id`, `nombre`, `emoji`, `descripcion`

**habito_diario** — Habit completion log
- `user_id`, `habito_id`, `fecha`, `completada`

## Data Flow

```
User action
  -> React state update (optimistic UI)
  -> Supabase client SDK (RLS-filtered)
  -> PostgreSQL

AI generation:
  User clicks "Generate"
  -> React fetch() to /api/generate-*
  -> Vercel serverless function
  -> Anthropic API (with ANTHROPIC_KEY from env)
  -> JSON response parsed
  -> Old data deleted, new data inserted via Supabase
  -> React state updated
```

## Security Model

1. **RLS (Row Level Security)**: Every table has policies ensuring `auth.uid() = user_id`. Users can only read/write their own data.

2. **API Key**: `ANTHROPIC_KEY` is stored ONLY in Vercel environment variables. Never in code, never in frontend bundle. The `/api/*` routes act as a proxy.

3. **Supabase anon key**: The publishable key in the client is designed to be public — it only works with RLS policies enforcing access.

4. **Input sanitization**: All user inputs are sanitized before DB writes (HTML stripped, length limited).

5. **Rate limiting**: Chat assistant limited to 10 requests/minute per session (client-side).

## Supabase Free Tier Limits

| Resource | Limit | Current Usage |
|----------|-------|---------------|
| Database size | 500 MB | ~5 MB |
| API requests | 500K/month | ~2K/month |
| Auth users | 50K MAU | <10 |
| Storage | 1 GB | 0 |
| Edge functions | 500K/month | 0 (using Vercel) |
| Realtime connections | 200 concurrent | 0 (not used) |

## Scaling Plan (1K Users)

### Database
- **Current**: Free tier handles 1K users easily (~50MB data)
- **At 5K users**: Upgrade to Supabase Pro ($25/mo) for:
  - 8GB database
  - Daily backups
  - No API rate limits
  - Priority support

### AI Costs (Anthropic)
- **Per user/month** (estimated):
  - 2 menu generations: ~$0.02
  - 1 training plan: ~$0.01
  - 20 chat messages: ~$0.04
  - **Total: ~$0.07/user/month**
- **1K users: ~$70/month** on Haiku 4.5

### Vercel
- **Free tier**: 100GB bandwidth, 100K function invocations
- **At 1K users**: May need Pro ($20/mo) for bandwidth

### Total estimated cost at 1K users
- Supabase Pro: $25/mo
- Anthropic API: $70/mo
- Vercel Pro: $20/mo
- **Total: ~$115/month**

## Roadmap

### Phase 1 — MVP (Completada)
- Onboarding con perfil personalizado
- Hábitos diarios con tracking semanal
- Despensa (stock) con alertas de mínimo
- Menú semanal generado por IA (Claude Haiku 4.5)
- Plan de entrenamiento (mesociclo 4 semanas)
- Registro de peso con historial
- Asistente IA conversacional
- Tracking de agua diaria

### Phase 2 — Beta con usuarios reales (Actual)
- RLS policies en todas las tablas
- Sentry error monitoring
- Rate limiting + input sanitization
- Auto-descuento de despensa al completar comidas
- Lista de compras inteligente
- Escáner de código de barras (Open Food Facts)
- Landing page profesional con marketplace preview
- Dark mode persistente
- Documentación técnica (ARCHITECTURE.md)

### Phase 3 — Plataforma de Profesionales
**Objetivo**: Conectar usuarios con profesionales de salud verificados.

#### 3.1 Pre-registro (actual)
- Formulario de interés en landing ("Únete como profesional")
- Tabla `profesionales_preregistro` para validar demanda
- Meta: 50+ pre-registros antes de construir

#### 3.2 Portal del Profesional
- Dashboard propio: pacientes activos, sesiones del día, ingresos
- Perfil público: foto, bio, especialidades, certificaciones, precios, horarios
- Gestión de pacientes: ver progreso (peso, menú, entrenamiento) con permiso
- Agenda: disponibilidad, reservas, confirmaciones
- Chat directo con pacientes dentro de TriFlow
- Planes personalizados: menús/rutinas custom por paciente (reemplaza IA)
- Facturación: historial de pagos, estadísticas

#### 3.3 Conexión Usuario ↔ Profesional
- Marketplace: buscar, filtrar, ver perfiles de profesionales
- Reserva de sesión: agendar, pagar, confirmar
- Vinculación: usuario contrata profesional → acceso a datos autorizados
- Sistema de permisos: usuario elige qué datos comparte
- Rating y reseñas post-sesión

#### 3.4 Backend necesario
- Tablas: `profesionales`, `especialidades`, `disponibilidad`, `reservas`, `pagos`, `vinculos_paciente`, `resenas`
- Auth con roles diferenciados (usuario vs profesional)
- Pasarela de pagos (Mercado Pago / Stripe)
- Notificaciones (email, push)

#### 3.5 Estimación de costos adicionales
- Pasarela de pagos: comisión por transacción (~3-4%)
- Supabase Pro: necesario para volumen de datos
- Notificaciones push: servicio externo (OneSignal free tier)
- Verificación de profesionales: proceso manual inicial

### Phase 4 — Escalamiento
- App nativa (React Native / Expo)
- Gamificación (logros, streaks, desafíos)
- Comunidad entre usuarios
- Integraciones (Apple Health, Google Fit, wearables)
- Internacionalización (portugués, inglés)
- Programa de referidos

## Backup & Recovery

### Automated (Supabase Pro)
- Daily automated backups (7-day retention)
- Point-in-time recovery (PITR)

### Manual Backup (Free Tier)
1. Go to Supabase Dashboard > Settings > Database
2. Click "Download backup" under Backups section
3. Or use pg_dump:
   ```bash
   pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" > backup.sql
   ```
4. Store backups in a secure location (Google Drive, S3)

### Recovery Plan
1. **Database corruption**: Restore from latest backup via Supabase dashboard
2. **Accidental data deletion**: RLS prevents cross-user deletion. For single-user recovery, restore from backup.
3. **Supabase outage**: App shows loading state. No data loss (Supabase has its own HA).
4. **Vercel outage**: Static assets cached in CDN. API functions unavailable until resolved.
5. **Anthropic outage**: AI features fail gracefully with error messages. Core app (tracking, habits) works independently.

### Recommended Backup Schedule (Pre-Pro)
- Weekly manual export via pg_dump
- Before any schema migration
- Before any bulk data operation

## Environment Variables

### Vercel (Production)
- `ANTHROPIC_KEY` — Anthropic API key (required)
- `VITE_SENTRY_DSN` — Sentry DSN for error monitoring (optional)

### Local Development (.env)
- `ANTHROPIC_KEY` — For local server.js proxy
- Never commit `.env` to git (in .gitignore)
