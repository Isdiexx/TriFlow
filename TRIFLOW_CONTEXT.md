# TriFlow — Contexto Completo para Chat

## Stack
- **Frontend**: React 19 + Vite, single-file `src/App.jsx` (~1700 líneas), CSS-in-JS inline
- **Backend**: Vercel Serverless Functions (`/api/chat.js`, `/api/generate-menu.js`, `/api/generate-training.js`)
- **DB**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Claude Haiku 4.5 vía Anthropic API
- **Dominio**: triflow.cl
- **Design System**: `src/designSystem.js` (spacing, border-radius, typography, shadows, transitions)

## Tablas Supabase
- `profiles` — id, nombre, apellido, peso_actual, peso_meta, objetivo, restricciones[], pais, dias_entrenamiento
- `agua_diaria` — user_id, fecha, vasos (upsert on user_id+fecha)
- `stock` — user_id, nombre, cantidad, unidad, minimo
- `menu_semanal` — user_id, dia, desayuno, almuerzo, snack, cena
- `menu_diario` — user_id, fecha, comida, completada, comentario (tracking de comidas)
- `sesiones` — user_id, dia, grupo, descripcion, completada, logs(jsonb), rpe(integer)
- `progreso_peso` — user_id, peso, fecha, created_at
- `habitos` — user_id, nombre, emoji, descripcion
- `habito_diario` — user_id, habito_id, fecha, completada

## Temas de Colores
```javascript
const LIGHT={bg:"#F7F5F0",surface:"#FDFCFA",card:"#FFFFFF",border:"#EAE4D8",border2:"#D8D0C0",sage:"#7C9E87",sageL:"#A8C4AF",sageD:"#5A7D65",sand:"#C4A882",clay:"#C4856A",sky:"#7EA8C4",violet:"#9B8EC4",violetL:"#C4B8E8",violetD:"#7060A8",charcoal:"#2C2C2C",textMid:"#6B6458",textSub:"#9C9284",muted:"#B8B0A0",scrollbar:"#C8C0B0"};
const DARK={bg:"#161C18",surface:"#1C2420",card:"#212B25",border:"#2A3830",border2:"#354540",sage:"#7EC494",sageL:"#5A9970",sageD:"#A8D4B4",sand:"#D4B48C",clay:"#D4956A",sky:"#8AB8D4",violet:"#B4A8D8",violetL:"#7868A8",violetD:"#CEC4EC",charcoal:"#EAE6DE",textMid:"#A8A090",textSub:"#6E6860",muted:"#4A4840",scrollbar:"#2A3830"};
```

## Fuentes
- **Space Grotesk** — Títulos, números grandes
- **DM Sans** — Body text, botones, labels
- **JetBrains Mono** — Labels tipo monospace (PESO ACTUAL, SEMANA 1, etc.)
- **Playfair Display** — Citas motivacionales (serif, italic)

## Estructura de Tabs
1. **Inicio** — Header con saludo + avatar, tracker de días (pill sage = hoy), hábitos del día con streak/progress ring, peso actual con sparkline/gráfico expandible, reporte semanal, agua, menú de hoy, alerta despensa, motivación
2. **Hábito** — Menú semanal con selector de días, tracking de comidas (completada/nota), lista de compra sugerida
3. **Despensa** — Stock actual, lista de compras, escáner de códigos de barras
4. **Entrena** — Mesociclo 4 semanas (Activación→Volumen→Intensidad→Descarga), vista detallada con inputs de reps/peso por serie, RPE slider 1-10
5. **Asistente** — Chat con IA (acciones: generar menú, entrenamiento, agregar a despensa)
6. **Perfil** — Datos del usuario, país, días entrenamiento, objetivo, logout

## Archivos Clave

### src/App.jsx (completo, ~1700 líneas)
Contiene TODO: estados, funciones, auth, UI de todas las tabs.

### src/designSystem.js
```javascript
export const SPACING = { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':28 };
export const BORDER_RADIUS = { sm:8, md:12, lg:16, full:99 };
export const FONTS = {
  display: "'Space Grotesk',sans-serif",
  serif: "'Playfair Display','Times New Roman',serif",
  body: "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",
  mono: "'JetBrains Mono',ui-monospace,monospace",
};
export const TYPOGRAPHY = {
  h1: { fontSize:32, fontWeight:600, fontFamily:FONTS.display, letterSpacing:"-0.035em" },
  h2: { fontSize:24, fontWeight:600, fontFamily:FONTS.display, letterSpacing:"-0.025em" },
  h3: { fontSize:20, fontWeight:600, fontFamily:FONTS.display, letterSpacing:"-0.02em" },
  body: { fontSize:14, fontWeight:400, fontFamily:FONTS.body },
  small: { fontSize:12, fontWeight:400, fontFamily:FONTS.body },
  label: { fontSize:11, fontWeight:500, fontFamily:FONTS.mono, letterSpacing:"0.04em", textTransform:"uppercase" },
};
export const SHADOWS = { sm:"0 2px 4px rgba(0,0,0,0.08)", md:"0 4px 12px rgba(0,0,0,0.12)", lg:"0 8px 24px rgba(0,0,0,0.15)" };
export const TRANSITIONS = { fast:"all 0.2s ease", normal:"all 0.3s ease", slow:"all 0.4s ease" };
// + helpers: cardStyle(), buttonStyle(), inputStyle(), chipStyle(), flexContainer(), gridLayout()
```

### api/generate-menu.js
- POST endpoint, recibe `{profile, stock}`
- System prompt con GUIAS_PAIS detalladas por país (Chile, Argentina, Perú, Colombia, Venezuela, México, España)
- Retorna `{menu: [{dia, desayuno, almuerzo, snack, cena}...7], lista_compra: [{nombre, cantidad, unidad, motivo}...]}`

### api/generate-training.js
- POST endpoint, recibe `{profile}`
- Genera mesociclo 4 semanas × N días/semana (2-6 configurable)
- HORARIO_DIAS mapping: 2→[Lun,Jue], 3→[Lun,Mié,Vie], 4→[Lun,Mar,Jue,Vie], etc.
- Retorna `{sesiones: [{semana, dia, grupo, descripcion}...]}`

### api/chat.js
- Proxy a Anthropic API
- System prompt incluye perfil, despensa, guías de país
- Acciones: [ACCION:menu], [ACCION:entrenamiento], [ACCION:despensa]{items}[/ACCION]

## Componentes Internos (dentro de App.jsx)
- `Chip` — Badge/tag con color
- `ProgressRing` — SVG circular progress
- `Avatar` — Iniciales con gradient
- `ThemeToggle` — Switch dark/light (persiste en localStorage)
- `TriFlowLogo` — Logo SVG + texto
- `WeightSparkline` — Mini gráfico de peso (línea + área)
- `WeightChart` — Gráfico completo con ejes, meta, tendencia, datos

## Funciones Principales
- `loadAll(uid)` — Carga todo desde Supabase al iniciar
- `handleAuth()` — Login/registro con email
- `loginGoogle()` / `loginGitHub()` — OAuth
- `registrarPeso()` — Con detección de duplicados por fecha (.slice(0,10))
- `generarMenu()` — Llama a /api/generate-menu, guarda en menu_semanal
- `generarEntrenamiento()` — Llama a /api/generate-training, guarda en sesiones
- `sendChat()` — Chat con IA, parsea acciones
- `toggleComidaCompleta()` / `guardarComentarioComida()` — Tracking de comidas
- `abrirSesion()` / `updateLog()` / `toggleSetDone()` / `finalizarSesion()` — Training logs
- `completarHabitoDia()` / `crearHabito()` / `eliminarHabito()` — Hábitos
- `updateAgua()` — Agua diaria
- `lookupProductByBarcode()` — Open Food Facts API
- `localDate()` — Helper timezone-safe para Chile

## Decisiones de Diseño
- Todo en un solo archivo App.jsx por simplicidad de iteración
- CSS-in-JS inline (no CSS modules, no Tailwind)
- Cada tab es un bloque condicional `{tab==="xxx"&&(...)}`
- Modales como overlays fixed dentro del return principal
- RPE slider usa onChange para UI + onMouseUp/onTouchEnd para DB save
- toggleSetDone captura logs del updater function para evitar stale closure
- Dark mode persiste en localStorage("triflow_dark")
- Día del menú en Hábito se inicializa al día actual
- menuHoy usa fallback null (no menu[0]) para no mostrar día incorrecto

## Bugs Conocidos Corregidos
1. App crash por tabla menu_diario faltante → try/catch individual
2. OAuth loading stuck → pageshow listener + setLoading outside catch
3. Timezone UTC → localDate() helper (14 ocurrencias)
4. Stale closure en toggleSetDone → savedLogs del updater
5. setState during render → return JSX fallback
6. Duplicate weight entries → .slice(0,10) date normalization
7. Insight flicker → seed by dayOfYear
8. RPE spam saves → onChange UI + onMouseUp DB
9. menuHoy wrong day fallback → null instead of menu[0]
10. Weight progress wrong for muscle gain → calculate from initial weight
11. Hábito showing wrong day → diaMenu initialized to today
12. Dark mode not persisting → localStorage

## Estado Actual (Mayo 2026)
- Phase 1 (Core) ✅ completado
- Phase 2 (AI features + polish) en progreso
- Pendiente: testing E2E completo, luego Phase 3 (Monetización/Stripe)
