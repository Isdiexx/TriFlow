// onboarding-screens.jsx
// All TriFlow onboarding step screens.
// Each screen receives: { T, dark, state, setState, next, back }
// state holds the user's progress across the flow.

const COUNTRIES = [
  { c: "ES", n: "España",     f: "🇪🇸" },
  { c: "MX", n: "México",     f: "🇲🇽" },
  { c: "AR", n: "Argentina",  f: "🇦🇷" },
  { c: "CL", n: "Chile",      f: "🇨🇱" },
  { c: "CO", n: "Colombia",   f: "🇨🇴" },
  { c: "PE", n: "Perú",       f: "🇵🇪" },
  { c: "UY", n: "Uruguay",    f: "🇺🇾" },
  { c: "US", n: "EE.UU.",     f: "🇺🇸" },
];

const RESTRICTIONS = [
  { id: "lactosa",     label: "Sin lactosa",  icon: "🥛" },
  { id: "gluten",      label: "Sin gluten",   icon: "🌾" },
  { id: "vegano",      label: "Vegano",       icon: "🌱" },
  { id: "vegetariano", label: "Vegetariano",  icon: "🥗" },
  { id: "frutos_secos",label: "Sin frutos secos", icon: "🥜" },
  { id: "azucar",      label: "Sin azúcar añadido", icon: "🍬" },
];

const PANTRY_PRESETS = [
  { id: "huevos",  label: "Huevos",   icon: "🥚" },
  { id: "pollo",   label: "Pollo",    icon: "🍗" },
  { id: "arroz",   label: "Arroz",    icon: "🍚" },
  { id: "avena",   label: "Avena",    icon: "🌾" },
  { id: "atun",    label: "Atún",     icon: "🐟" },
  { id: "yogur",   label: "Yogur",    icon: "🥛" },
  { id: "tomate",  label: "Tomate",   icon: "🍅" },
  { id: "aguacate",label: "Aguacate", icon: "🥑" },
  { id: "platano", label: "Plátano",  icon: "🍌" },
  { id: "pasta",   label: "Pasta",    icon: "🍝" },
  { id: "almendras",label: "Almendras", icon: "🥜" },
  { id: "espinacas",label: "Espinacas", icon: "🥬" },
];

// ─── Shared atoms ────────────────────────────────────────────
function Eyebrow({ T, children }) {
  return (
    <div style={{
      fontSize: 11, color: T.textSub, letterSpacing: "0.14em",
      textTransform: "uppercase", fontWeight: 500, marginBottom: 10,
    }}>{children}</div>
  );
}

function ScreenTitle({ T, children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{
        fontFamily: window.TRIFLOW_FONTS.serif,
        fontSize: 30, fontWeight: 600, lineHeight: 1.15,
        color: T.charcoal, letterSpacing: "-0.015em",
        marginBottom: 8,
      }}>{children}</h1>
      {sub && <p style={{ fontSize: 15, lineHeight: 1.45, color: T.textMid }}>{sub}</p>}
    </div>
  );
}

function PrimaryBtn({ T, children, onClick, disabled, full = true }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      padding: "16px 24px",
      borderRadius: 99,
      background: disabled ? T.muted : T.sageD,
      color: "#fff", border: "none",
      fontSize: 15, fontWeight: 600,
      fontFamily: window.TRIFLOW_FONTS.body,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "transform .15s ease, background .2s ease",
      boxShadow: disabled ? "none" : `0 6px 18px ${T.sageD}33`,
    }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.98)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
      {children}
    </button>
  );
}

function GhostBtn({ T, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 24px",
      borderRadius: 99, background: "transparent",
      color: T.textMid, border: `1px solid ${T.border2}`,
      fontSize: 14, fontWeight: 500,
      fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
      transition: "all .2s ease",
    }}>{children}</button>
  );
}

function FieldLabel({ T, children }) {
  return (
    <div style={{
      fontSize: 11, color: T.textSub, letterSpacing: "0.12em",
      textTransform: "uppercase", fontWeight: 500, marginBottom: 8, marginTop: 4,
    }}>{children}</div>
  );
}

function TextInput({ T, value, onChange, placeholder, type = "text", autoFocus, suffix }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoFocus={autoFocus}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "16px 18px",
          paddingRight: suffix ? 56 : 18,
          borderRadius: 14,
          border: `1.5px solid ${focus ? T.sage : T.border}`,
          background: T.card,
          color: T.charcoal,
          fontSize: 16, fontWeight: 400,
          fontFamily: window.TRIFLOW_FONTS.body,
          outline: "none",
          boxShadow: focus ? `0 0 0 4px ${T.sage}22` : "none",
          transition: "all .25s ease",
        }}
      />
      {suffix && (
        <div style={{
          position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: T.textSub, fontWeight: 500,
          fontFamily: window.TRIFLOW_FONTS.body, pointerEvents: "none",
        }}>{suffix}</div>
      )}
    </div>
  );
}

// Screen container — fills the iPhone viewport with consistent padding
function Screen({ T, children, footer, scroll = true }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: T.bg, transition: "background .35s ease",
    }}>
      <div style={{
        flex: 1, overflowY: scroll ? "auto" : "hidden",
        padding: "24px 24px 12px",
      }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: "12px 24px 28px",
          background: T.bg,
          borderTop: `1px solid ${T.border}10`,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ─── 0. WELCOME / SPLASH ─────────────────────────────────────
function ScreenWelcome({ T, next }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.surface} 100%)`,
      display: "flex", flexDirection: "column",
      padding: "60px 28px 32px",
      transition: "background .35s ease",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Animated logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <window.AnimatedLogo T={T} size={84}/>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: window.TRIFLOW_FONTS.display, fontSize: 38, fontWeight: 500,
              color: T.charcoal, letterSpacing: "-0.04em", lineHeight: 1,
            }}>TriFlow</div>
            <div style={{
              fontFamily: window.TRIFLOW_FONTS.serif, fontSize: 17, fontStyle: "italic",
              color: T.sage, marginTop: 8,
            }}>encuentra tu flow</div>
          </div>
        </div>
        <div style={{
          marginTop: 56, padding: "0 12px",
          textAlign: "center",
          fontSize: 15, color: T.textMid, lineHeight: 1.5,
        }}>
          Tres pilares para cambiar tus hábitos:<br/>
          <span style={{ color: T.charcoal, fontWeight: 500 }}>orden</span>, alimentación y entrenamiento.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryBtn T={T} onClick={next}>Comenzar</PrimaryBtn>
        <button style={{
          background: "none", border: "none", color: T.textMid,
          fontSize: 14, fontFamily: window.TRIFLOW_FONTS.body,
          padding: "10px", cursor: "pointer",
        }}>Ya tengo cuenta · Iniciar sesión</button>
      </div>
    </div>
  );
}

// ─── 1. ACCOUNT (email + password) ───────────────────────────
function ScreenAccount({ T, state, setState, next }) {
  const valid = /^\S+@\S+\.\S+$/.test(state.email) && state.password.length >= 6;
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next} disabled={!valid}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 1 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Sólo necesitamos un email y una contraseña. Tus datos son privados.">
        Crea tu cuenta
      </ScreenTitle>
      <FieldLabel T={T}>Email</FieldLabel>
      <TextInput T={T} type="email" placeholder="tu@email.com"
        value={state.email} onChange={v => setState({ ...state, email: v })} autoFocus/>
      <FieldLabel T={T}>Contraseña</FieldLabel>
      <TextInput T={T} type="password" placeholder="Mínimo 6 caracteres"
        value={state.password} onChange={v => setState({ ...state, password: v })}/>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{
          padding: "13px 20px", borderRadius: 99, background: T.card,
          border: `1px solid ${T.border}`, color: T.charcoal, fontSize: 14,
          fontFamily: window.TRIFLOW_FONTS.body, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.4z"/>
            <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z"/>
            <path fill="#FBBC05" d="M3.9 10.7c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V5H.9C.3 6.2 0 7.6 0 9s.3 2.8.9 4l3-2.3z"/>
            <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.4 2.1.9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/>
          </svg>
          Continuar con Google
        </button>
        <button style={{
          padding: "13px 20px", borderRadius: 99, background: T.card,
          border: `1px solid ${T.border}`, color: T.charcoal, fontSize: 14,
          fontFamily: window.TRIFLOW_FONTS.body, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <svg width="16" height="18" viewBox="0 0 16 18">
            <path fill={T.charcoal} d="M13.4 9.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.6.9-.7 0-1.9-.9-3.1-.8C3.6 4.3 2 5.3 1.1 7c-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3 2.4 1.2-.1 1.7-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.8.1-2.4 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.6.9z M11 2.6c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.5 2.8-1.3z"/>
          </svg>
          Continuar con Apple
        </button>
      </div>
    </Screen>
  );
}

// ─── 2. NAME ─────────────────────────────────────────────────
function ScreenName({ T, state, setState, next }) {
  const valid = state.firstName.trim().length >= 2;
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next} disabled={!valid}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 2 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Lo usaremos para personalizar tu app y los mensajes de tu asistente IA.">
        ¿Cómo te llamas?
      </ScreenTitle>
      <FieldLabel T={T}>Nombre</FieldLabel>
      <TextInput T={T} placeholder="Diego"
        value={state.firstName} onChange={v => setState({ ...state, firstName: v })} autoFocus/>
      <FieldLabel T={T}>Apellido (opcional)</FieldLabel>
      <TextInput T={T} placeholder="Pérez"
        value={state.lastName} onChange={v => setState({ ...state, lastName: v })}/>
      {state.firstName && (
        <div style={{
          marginTop: 8, padding: "14px 16px", borderRadius: 14,
          background: T.sage + "12", border: `1px solid ${T.sage}33`,
          fontSize: 14, color: T.sageD,
          fontFamily: window.TRIFLOW_FONTS.body,
          animation: "tfFadeUp .3s ease both",
        }}>
          ¡Hola, <strong>{state.firstName}</strong>! Encantado de conocerte. ✦
        </div>
      )}
    </Screen>
  );
}

// ─── 3. COUNTRY ──────────────────────────────────────────────
function ScreenCountry({ T, state, setState, next }) {
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next} disabled={!state.country}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 3 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Adaptamos tu menú con ingredientes y platos típicos de tu país.">
        ¿Dónde vives?
      </ScreenTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COUNTRIES.map(c => {
          const sel = state.country === c.c;
          return (
            <button key={c.c} onClick={() => setState({ ...state, country: c.c })} style={{
              padding: "16px 14px", borderRadius: 14,
              border: `1.5px solid ${sel ? T.sage : T.border}`,
              background: sel ? T.sage + "15" : T.card,
              color: sel ? T.sageD : T.charcoal,
              fontSize: 14, fontWeight: sel ? 600 : 500,
              fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              transition: "all .2s ease",
              transform: sel ? "scale(1.02)" : "scale(1)",
            }}>
              <span style={{ fontSize: 22 }}>{c.f}</span>
              <span>{c.n}</span>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

// ─── 4. GOAL ─────────────────────────────────────────────────
function ScreenGoal({ T, state, setState, next }) {
  const goals = [
    { id: "bajar_peso",    title: "Bajar de peso",    sub: "Déficit calórico controlado",  icon: "↓", color: T.sky },
    { id: "ganar_musculo", title: "Ganar músculo",    sub: "Superávit + entrenamiento de fuerza", icon: "↑", color: T.violet },
    { id: "rendimiento",   title: "Mejorar rendimiento", sub: "Energía sostenida y recuperación", icon: "✦", color: T.sage },
    { id: "mantener",      title: "Mantenerme y sentirme bien", sub: "Hábitos sostenibles", icon: "≈", color: T.sand },
  ];
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next} disabled={!state.goal}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 4 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Tu objetivo define el menú, las kcal y el plan de entrenamiento.">
        ¿Cuál es tu objetivo?
      </ScreenTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {goals.map(g => {
          const sel = state.goal === g.id;
          return (
            <button key={g.id} onClick={() => setState({ ...state, goal: g.id })} style={{
              padding: "18px 18px", borderRadius: 16,
              border: `1.5px solid ${sel ? g.color : T.border}`,
              background: sel ? g.color + "15" : T.card,
              cursor: "pointer", textAlign: "left",
              fontFamily: window.TRIFLOW_FONTS.body,
              display: "flex", alignItems: "center", gap: 14,
              transition: "all .2s ease",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 99,
                background: sel ? g.color : g.color + "22",
                color: sel ? "#fff" : g.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, flexShrink: 0,
                transition: "all .2s ease",
              }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.charcoal, marginBottom: 2 }}>{g.title}</div>
                <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.4 }}>{g.sub}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 99,
                border: `2px solid ${sel ? g.color : T.border2}`,
                background: sel ? g.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {sel && (
                  <svg width="11" height="9" viewBox="0 0 11 9">
                    <path d="M1 4.5L4 7.5L10 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

// ─── 5. BODY (height + weights) ──────────────────────────────
function ScreenBody({ T, state, setState, next }) {
  const valid = state.height && state.weight && state.targetWeight;
  const diff = parseFloat(state.targetWeight || 0) - parseFloat(state.weight || 0);
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next} disabled={!valid}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 5 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Calculamos tus kcal diarias con la fórmula Mifflin-St Jeor + tu objetivo.">
        Tus medidas
      </ScreenTitle>
      <FieldLabel T={T}>Altura</FieldLabel>
      <TextInput T={T} type="number" placeholder="170"
        value={state.height} onChange={v => setState({ ...state, height: v })}
        suffix="cm"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <FieldLabel T={T}>Peso actual</FieldLabel>
          <TextInput T={T} type="number" placeholder="75"
            value={state.weight} onChange={v => setState({ ...state, weight: v })}
            suffix="kg"/>
        </div>
        <div>
          <FieldLabel T={T}>Peso objetivo</FieldLabel>
          <TextInput T={T} type="number" placeholder="70"
            value={state.targetWeight} onChange={v => setState({ ...state, targetWeight: v })}
            suffix="kg"/>
        </div>
      </div>
      {valid && (
        <div style={{
          marginTop: 6, padding: "16px 18px", borderRadius: 14,
          background: T.sage + "12", border: `1px solid ${T.sage}33`,
          animation: "tfFadeUp .3s ease both",
        }}>
          <div style={{ fontSize: 12, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            Diferencia
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: T.sageD,
            fontFamily: window.TRIFLOW_FONTS.serif }}>
            {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
          </div>
          <div style={{ fontSize: 13, color: T.textMid, marginTop: 4, lineHeight: 1.4 }}>
            {Math.abs(diff) <= 1
              ? "Estás muy cerca de tu objetivo. Trabajaremos en mantenerlo y mejorar tu composición corporal."
              : `Plan estimado: ${Math.ceil(Math.abs(diff) / 0.4)} semanas a ${diff < 0 ? "0,4 kg" : "0,4 kg"}/sem.`}
          </div>
        </div>
      )}
    </Screen>
  );
}

// ─── 6. RESTRICTIONS ─────────────────────────────────────────
function ScreenRestrictions({ T, state, setState, next }) {
  const toggle = id => {
    const has = state.restrictions.includes(id);
    setState({
      ...state,
      restrictions: has ? state.restrictions.filter(x => x !== id) : [...state.restrictions, id],
    });
  };
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 6 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Selecciona todas las que apliquen. Puedes cambiarlas más adelante.">
        ¿Tienes alguna restricción?
      </ScreenTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {RESTRICTIONS.map(r => {
          const sel = state.restrictions.includes(r.id);
          return (
            <button key={r.id} onClick={() => toggle(r.id)} style={{
              padding: "12px 16px", borderRadius: 99,
              border: `1.5px solid ${sel ? T.sand : T.border}`,
              background: sel ? T.sand + "1f" : T.card,
              color: sel ? T.sand : T.charcoal,
              fontSize: 14, fontWeight: sel ? 600 : 500,
              fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all .2s ease",
            }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <span>{r.label}</span>
              {sel && (
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginLeft: 2 }}>
                  <path d="M2 7L6 11L12 3" stroke={T.sand} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>
      <button onClick={() => { setState({ ...state, restrictions: [] }); next(); }} style={{
        marginTop: 24, background: "none", border: "none",
        color: T.textMid, fontSize: 14, fontWeight: 500,
        fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
        textDecoration: "underline", textUnderlineOffset: 4,
      }}>No tengo ninguna restricción · Saltar</button>
    </Screen>
  );
}

// ─── 7. TRAINING DAYS ────────────────────────────────────────
function ScreenTraining({ T, state, setState, next }) {
  const days = [2, 3, 4, 5, 6];
  const labels = {
    2: "Empezando suave", 3: "Equilibrado", 4: "Constante", 5: "Comprometido", 6: "Atleta",
  };
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next}>Continuar</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 7 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Tu plan se adapta a la frecuencia que puedas mantener.">
        ¿Cuántos días entrenas?
      </ScreenTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {days.map(d => {
          const sel = state.trainingDays === d;
          return (
            <button key={d} onClick={() => setState({ ...state, trainingDays: d })} style={{
              flex: 1, aspectRatio: "1/1.1",
              borderRadius: 14,
              border: `2px solid ${sel ? T.violet : T.border}`,
              background: sel ? T.violet + "1a" : T.card,
              color: sel ? T.violet : T.charcoal,
              fontSize: 28, fontWeight: 600,
              fontFamily: window.TRIFLOW_FONTS.serif,
              cursor: "pointer",
              transition: "all .2s ease",
              transform: sel ? "scale(1.05)" : "scale(1)",
            }}>{d}</button>
          );
        })}
      </div>
      <div style={{
        textAlign: "center", fontSize: 13, color: T.textMid,
        fontFamily: window.TRIFLOW_FONTS.body, marginBottom: 24,
      }}>
        días por semana · <span style={{ color: T.violet, fontWeight: 600 }}>{labels[state.trainingDays] || "Elige tu ritmo"}</span>
      </div>

      <FieldLabel T={T}>Tipo de entrenamiento favorito</FieldLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          { id: "fuerza", label: "Fuerza", icon: "🏋️" },
          { id: "cardio", label: "Cardio", icon: "🏃" },
          { id: "hiit", label: "HIIT", icon: "🔥" },
          { id: "yoga", label: "Yoga / Mobility", icon: "🧘" },
          { id: "mix", label: "Mixto", icon: "✦" },
        ].map(t => {
          const sel = state.trainingType === t.id;
          return (
            <button key={t.id} onClick={() => setState({ ...state, trainingType: t.id })} style={{
              padding: "10px 14px", borderRadius: 99,
              border: `1.5px solid ${sel ? T.violet : T.border}`,
              background: sel ? T.violet + "18" : T.card,
              color: sel ? T.violet : T.charcoal,
              fontSize: 13, fontWeight: sel ? 600 : 500,
              fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all .2s ease",
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

// ─── 8. PANTRY KICKSTART ─────────────────────────────────────
function ScreenPantry({ T, state, setState, next }) {
  const togglePantry = id => {
    const has = state.pantry.includes(id);
    setState({
      ...state,
      pantry: has ? state.pantry.filter(x => x !== id) : [...state.pantry, id],
    });
  };
  return (
    <Screen T={T} footer={<PrimaryBtn T={T} onClick={next}>Continuar · {state.pantry.length} items</PrimaryBtn>}>
      <Eyebrow T={T}>Paso 8 de 9</Eyebrow>
      <ScreenTitle T={T} sub="Marca lo que ya tienes y construiremos tu primer menú alrededor de ello. Ahorra tiempo y dinero.">
        ¿Qué tienes en tu despensa?
      </ScreenTitle>
      <div style={{
        padding: "12px 14px", borderRadius: 12, marginBottom: 14,
        background: T.clay + "12", border: `1px solid ${T.clay}33`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 99, background: T.clay + "22",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>📷</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.charcoal }}>O escanea tu nevera</div>
          <div style={{ fontSize: 12, color: T.textMid, marginTop: 1 }}>
            La IA detecta los productos automáticamente
          </div>
        </div>
        <button style={{
          padding: "8px 14px", borderRadius: 99, background: T.clay,
          color: "#fff", border: "none", fontSize: 12, fontWeight: 600,
          fontFamily: window.TRIFLOW_FONTS.body, cursor: "pointer",
        }}>Escanear</button>
      </div>

      <FieldLabel T={T}>O selecciona lo que tienes</FieldLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {PANTRY_PRESETS.map(p => {
          const sel = state.pantry.includes(p.id);
          return (
            <button key={p.id} onClick={() => togglePantry(p.id)} style={{
              padding: "12px 8px", borderRadius: 12,
              border: `1.5px solid ${sel ? T.sage : T.border}`,
              background: sel ? T.sage + "15" : T.card,
              cursor: "pointer", position: "relative",
              fontFamily: window.TRIFLOW_FONTS.body,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              transition: "all .15s ease",
              transform: sel ? "scale(1.04)" : "scale(1)",
            }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <span style={{
                fontSize: 12, fontWeight: sel ? 600 : 500,
                color: sel ? T.sageD : T.charcoal,
              }}>{p.label}</span>
              {sel && (
                <div style={{
                  position: "absolute", top: 4, right: 4,
                  width: 16, height: 16, borderRadius: 99, background: T.sage,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

// ─── 9. GENERATING (loading state) ───────────────────────────
function ScreenGenerating({ T, state, next }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    "Analizando tu perfil...",
    "Calculando macros y kcal...",
    "Eligiendo ingredientes locales...",
    "Diseñando tu menú semanal...",
    "Adaptando tu plan de entrenamiento...",
    "Listo ✦",
  ];
  React.useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => next(), 800);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div style={{
      width: "100%", height: "100%",
      background: T.bg, padding: "60px 28px",
      display: "flex", flexDirection: "column", alignItems: "center",
      transition: "background .35s ease",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <window.AnimatedLogo T={T} size={72} pulse/>
        <div style={{
          fontFamily: window.TRIFLOW_FONTS.serif,
          fontSize: 26, fontWeight: 600, color: T.charcoal,
          marginTop: 32, textAlign: "center", letterSpacing: "-0.015em",
        }}>Estamos creando tu plan, {state.firstName || "amigo"}</div>
        <div style={{
          fontSize: 14, color: T.textMid, marginTop: 8, textAlign: "center",
        }}>Tu IA personal está armando todo a tu medida</div>

        <div style={{ marginTop: 40, width: "100%", maxWidth: 320 }}>
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                opacity: done || active ? 1 : 0.35,
                transition: "opacity .3s ease",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 99,
                  background: done ? T.sage : active ? T.sage + "22" : "transparent",
                  border: done ? "none" : `1.5px solid ${active ? T.sage : T.border2}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {done && (
                    <svg width="11" height="9" viewBox="0 0 11 9">
                      <path d="M1 4.5L4 7.5L10 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {active && (
                    <div style={{
                      width: 8, height: 8, borderRadius: 99, background: T.sage,
                      animation: "tfPulse 1s ease infinite",
                    }}/>
                  )}
                </div>
                <span style={{
                  fontSize: 14, color: done ? T.charcoal : active ? T.sageD : T.textMid,
                  fontWeight: active ? 600 : 400,
                  fontFamily: window.TRIFLOW_FONTS.body,
                }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 10. READY ───────────────────────────────────────────────
function ScreenReady({ T, state, next }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.sage}10 100%)`,
      padding: "48px 28px 32px",
      display: "flex", flexDirection: "column",
      transition: "background .35s ease",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 92, height: 92, borderRadius: 99,
          background: T.sage,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 14px 40px ${T.sage}55`,
          animation: "tfFadeUp .4s ease both",
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M10 24L20 34L38 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{
          fontFamily: window.TRIFLOW_FONTS.serif,
          fontSize: 32, fontWeight: 600, color: T.charcoal,
          marginTop: 28, textAlign: "center", letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}>Bienvenido a TriFlow,<br/><span style={{ color: T.sageD, fontStyle: "italic" }}>{state.firstName || "amigo"}</span></div>
        <div style={{
          fontSize: 15, color: T.textMid, marginTop: 14, textAlign: "center",
          lineHeight: 1.5, maxWidth: 300,
        }}>Tu menú semanal, despensa y plan de entrenamiento están listos. Vamos a empezar.</div>

        <div style={{
          marginTop: 36, width: "100%",
          padding: "18px", borderRadius: 16,
          background: T.card, border: `1px solid ${T.border}`,
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textSub, marginBottom: 10, fontWeight: 500 }}>
            Tu plan resumido
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              ["🎯", "Objetivo", { bajar_peso: "Bajar de peso", ganar_musculo: "Ganar músculo", rendimiento: "Rendimiento", mantener: "Mantenerme" }[state.goal] || "—"],
              ["⚡", "Calorías diarias", `${Math.round(((parseFloat(state.weight) || 70) * 22 + 500) * (state.goal === "bajar_peso" ? 0.85 : state.goal === "ganar_musculo" ? 1.15 : 1))} kcal`],
              ["🏋️", "Entrenamientos", `${state.trainingDays || 3} días/semana`],
              ["🥗", "Items en despensa", `${state.pantry.length} ingredientes`],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: T.textMid, fontFamily: window.TRIFLOW_FONTS.body }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.charcoal, fontFamily: window.TRIFLOW_FONTS.body }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PrimaryBtn T={T} onClick={next}>Entrar a TriFlow ✦</PrimaryBtn>
    </div>
  );
}

// ─── Final/home preview (just shows we landed somewhere) ──────
function ScreenHome({ T, state }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: T.bg, padding: "60px 24px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "background .35s ease",
    }}>
      <div style={{ fontFamily: window.TRIFLOW_FONTS.serif, fontSize: 26, fontWeight: 600, color: T.charcoal, textAlign: "center" }}>
        Hola, {state.firstName || "amigo"} ✦
      </div>
      <div style={{ marginTop: 8, color: T.textMid, fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>
        Aquí entrarías a tu Inicio de TriFlow:<br/>menú del día, asistente IA, despensa y entrenamiento.
      </div>
    </div>
  );
}

// ─── Animated logo (used in welcome + generating) ────────────
function AnimatedLogo({ T, size = 84, pulse = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{
      animation: pulse ? "tfFloat 1.6s ease-in-out infinite" : "none",
    }}>
      <rect x="2"     y="5" width="8.5" height="6" rx="2.2" fill={T.sageL}>
        {!pulse && <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0s" fill="freeze"/>}
      </rect>
      <rect x="11.75" y="5" width="8.5" height="6" rx="2.2" fill={T.sage}>
        {!pulse && <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.15s" fill="freeze"/>}
      </rect>
      <rect x="21.5"  y="5" width="8.5" height="6" rx="2.2" fill={T.sageD}>
        {!pulse && <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.3s" fill="freeze"/>}
      </rect>
      <rect x="12.75" y="12" width="6.5" height="16" rx="2.2" fill={T.sageD}>
        {!pulse && <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.45s" fill="freeze"/>}
        {!pulse && <animate attributeName="height" values="0;16" dur="0.5s" begin="0.45s" fill="freeze"/>}
      </rect>
    </svg>
  );
}

Object.assign(window, {
  ScreenWelcome, ScreenAccount, ScreenName, ScreenCountry, ScreenGoal, ScreenBody,
  ScreenRestrictions, ScreenTraining, ScreenPantry, ScreenGenerating, ScreenReady, ScreenHome,
  AnimatedLogo,
});
