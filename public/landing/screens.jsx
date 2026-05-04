// ============================================================
// TriFlow phone screen mockups (used in hero + how-it-works)
// ============================================================

const HABITS_SEED = [
  { id: "agua", name: "Beber 8 vasos de agua", icon: "drop", color: "sky", time: "Todo el día", streak: 12 },
  { id: "medita", name: "Meditar 10 min", icon: "leaf", color: "sage", time: "07:00", streak: 28 },
  { id: "leer", name: "Leer 20 páginas", icon: "book", color: "violet", time: "21:30", streak: 6 },
  { id: "correr", name: "Correr 5 km", icon: "run", color: "clay", time: "18:00", streak: 4 },
  { id: "dormir", name: "Dormir 8 horas", icon: "moon", color: "violet", time: "23:00", streak: 19 },
];
window.HABITS_SEED = HABITS_SEED;

// ─── Habit row used inside the phone ──────────────────────────
function HabitRow({ T, habit, checked, onToggle, compact }) {
  const c = T[habit.color] || T.sage;
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        display: "flex", alignItems: "center", gap: 12,
        padding: compact ? "10px 12px" : "14px 14px",
        background: T.card,
        border: `1px solid ${checked ? c : T.border}`,
        borderRadius: 16,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: window.TRIFLOW_FONTS.body,
        transition: "all .35s ease",
        boxShadow: checked ? `0 6px 16px ${c}26` : "none",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: checked ? c : c + "22",
        color: checked ? "#fff" : c,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .3s ease",
        flexShrink: 0,
      }}>
        {checked ? <window.Icon name="check" size={20} /> : <window.Icon name={habit.icon} size={20} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: T.charcoal,
          textDecoration: checked ? "line-through" : "none",
          opacity: checked ? 0.55 : 1,
          transition: "all .3s ease",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{habit.name}</div>
        <div style={{ fontSize: 11, color: T.textSub, marginTop: 2, display: "flex", gap: 8 }}>
          <span>{habit.time}</span>
          <span style={{ color: c, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <window.Icon name="flame" size={10} />{habit.streak}d
          </span>
        </div>
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 99,
        border: `1.5px solid ${checked ? c : T.border2}`,
        background: checked ? c : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .3s ease",
      }}>
        {checked && <window.Icon name="check" size={14} color="#fff" strokeWidth={2.5} />}
      </div>
    </button>
  );
}
window.HabitRow = HabitRow;

// ─── Inicio / Dashboard screen ────────────────────────────────
function HomeScreen({ T, checked = {}, onToggle, name = "Diego" }) {
  const habits = HABITS_SEED.slice(0, 4);
  const completed = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ width: "100%", height: "100%", background: T.bg, display: "flex", flexDirection: "column", fontFamily: window.TRIFLOW_FONTS.body }}>
      <window.StatusBar T={T} />
      <div style={{ padding: "44px 18px 18px", flex: 1, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, color: T.textSub, letterSpacing: "0.06em", textTransform: "uppercase" }}>Lunes 4 de mayo</div>
            <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 26, color: T.charcoal, marginTop: 4, lineHeight: 1.1 }}>Hola, {name}</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: `linear-gradient(135deg, ${T.sage}, ${T.sageD})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 }}>{name[0]}</div>
        </div>

        {/* Hero ring card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 76, height: 76 }}>
            <window.Ring value={completed} max={habits.length} size={76} stroke={6} color={T.sage} track={T.border} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, color: T.charcoal, lineHeight: 1 }}>{completed}<span style={{ fontSize: 13, color: T.textSub }}>/{habits.length}</span></span>
              <span style={{ fontSize: 9, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>hoy</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 18, color: T.charcoal, lineHeight: 1.2 }}>{completed === habits.length ? "Día perfecto" : completed >= 2 ? "Vas bien" : "Empieza tu día"}</div>
            <div style={{ fontSize: 12, color: T.textSub, marginTop: 4, lineHeight: 1.4 }}>{completed === habits.length ? "Cinco rachas activas." : `${habits.length - completed} hábitos por completar`}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {[1,1,1,1,1,0,0].map((d, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < 5 ? T.sage : T.border }} />
              ))}
            </div>
          </div>
        </div>

        {/* Habit list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {habits.map(h => (
            <window.HabitRow key={h.id} T={T} habit={h} checked={!!checked[h.id]} onToggle={() => onToggle && onToggle(h.id)} compact />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        display: "flex", justifyContent: "space-around", padding: "10px 8px 22px",
        background: T.surface, borderTop: `1px solid ${T.border}`,
      }}>
        {[
          { i: "ring", l: "Inicio", a: true },
          { i: "calendar", l: "Hábito" },
          { i: "apple", l: "Despensa" },
          { i: "dumbbell", l: "Entrena" },
          { i: "spark", l: "IA" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: t.a ? T.sage : T.textSub }}>
            <window.Icon name={t.i} size={18} />
            <span style={{ fontSize: 10 }}>{t.l}</span>
            {t.a && <div style={{ width: 16, height: 2, borderRadius: 99, background: T.sage }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
window.HomeScreen = HomeScreen;

// ─── Asistente IA Screen ──────────────────────────────────────
function AssistantScreen({ T, msgs }) {
  return (
    <div style={{ width: "100%", height: "100%", background: T.bg, display: "flex", flexDirection: "column", fontFamily: window.TRIFLOW_FONTS.body }}>
      <window.StatusBar T={T} />
      <div style={{ padding: "8px 18px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 99, background: `linear-gradient(135deg, ${T.violet}, ${T.violetD})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <window.Icon name="spark" size={16} />
        </div>
        <div>
          <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 16, color: T.charcoal }}>Asistente IA</div>
          <div style={{ fontSize: 10, color: T.sage, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, background: T.sage, borderRadius: 99 }} />En línea
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%",
              padding: "10px 14px",
              borderRadius: 18,
              borderTopLeftRadius: m.role === "user" ? 18 : 4,
              borderTopRightRadius: m.role === "user" ? 4 : 18,
              background: m.role === "user" ? T.sage : T.card,
              color: m.role === "user" ? "#fff" : T.charcoal,
              fontSize: 13, lineHeight: 1.5,
              border: m.role === "user" ? "none" : `1px solid ${T.border}`,
              animation: "tfFadeUp .4s ease both",
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${T.border}` }}>
        <div style={{ background: T.card, borderRadius: 99, padding: "8px 14px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1, color: T.textSub, fontSize: 12 }}>Pregunta cualquier cosa…</span>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: T.sage, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <window.Icon name="arrow" size={14} strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </div>
  );
}
window.AssistantScreen = AssistantScreen;

// ─── Entrena Screen ───────────────────────────────────────────
function TrainScreen({ T }) {
  const ejercicios = [
    { name: "Sentadilla con barra", sets: "4×8", done: true },
    { name: "Press banca", sets: "4×10", done: true },
    { name: "Remo con barra", sets: "3×12", done: false },
    { name: "Plancha", sets: "3×45s", done: false },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: T.bg, display: "flex", flexDirection: "column", fontFamily: window.TRIFLOW_FONTS.body }}>
      <window.StatusBar T={T} />
      <div style={{ padding: "32px 18px 14px" }}>
        <div style={{ fontSize: 11, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase" }}>Semana 2 · Día 3</div>
        <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 24, color: T.charcoal, marginTop: 4 }}>Tren superior</div>
      </div>
      <div style={{ padding: "0 18px", display: "flex", gap: 6, marginBottom: 14 }}>
        {[1,2,3,4].map(w => (
          <div key={w} style={{
            flex: 1, padding: "8px 0", borderRadius: 99, textAlign: "center",
            fontSize: 12, fontWeight: 500,
            background: w === 2 ? T.violet + "22" : T.card,
            color: w === 2 ? T.violetD : T.textSub,
            border: `1px solid ${w === 2 ? T.violet : T.border}`,
          }}>S{w}</div>
        ))}
      </div>
      <div style={{ padding: "0 18px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
        {ejercicios.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: T.card, borderRadius: 14, border: `1px solid ${T.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.violet + "22", color: T.violetD, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <window.Icon name="dumbbell" size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>{e.name}</div>
              <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{e.sets}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 99, background: e.done ? T.sage : "transparent", border: `1.5px solid ${e.done ? T.sage : T.border2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {e.done && <window.Icon name="check" size={12} color="#fff" strokeWidth={2.5} />}
            </div>
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: 14, background: T.violet + "15", borderRadius: 16, border: `1px dashed ${T.violet}66` }}>
          <div style={{ fontSize: 11, color: T.violetD, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>IA · Sugerencia</div>
          <div style={{ fontSize: 12, color: T.charcoal, lineHeight: 1.4 }}>Aumenta 2.5kg en sentadilla la próxima sesión. Has progresado bien.</div>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ background: T.charcoal, color: T.bg, padding: 14, borderRadius: 99, textAlign: "center", fontSize: 14, fontWeight: 500 }}>Empezar sesión</div>
      </div>
    </div>
  );
}
window.TrainScreen = TrainScreen;

// ─── Despensa Screen ──────────────────────────────────────────
function PantryScreen({ T }) {
  const items = [
    { n: "Avena integral", q: "850g", c: "sage" },
    { n: "Pollo pechuga", q: "1.2kg", c: "clay" },
    { n: "Brócoli fresco", q: "400g", c: "sage" },
    { n: "Huevos camperos", q: "12 un", c: "sand" },
    { n: "Yogur griego", q: "500g", c: "sky" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: T.bg, display: "flex", flexDirection: "column", fontFamily: window.TRIFLOW_FONTS.body }}>
      <window.StatusBar T={T} />
      <div style={{ padding: "32px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase" }}>Despensa</div>
          <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 24, color: T.charcoal, marginTop: 4 }}>23 items</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: T.charcoal, color: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <window.Icon name="scan" size={18} />
        </div>
      </div>
      <div style={{ padding: "0 18px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => {
          const c = T[it.c];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: T.card, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: c + "22", color: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <window.Icon name="apple" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>{it.n}</div>
                <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>Disponible</div>
              </div>
              <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 12, color: T.textMid }}>{it.q}</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ background: T.sage + "22", color: T.sageD, padding: 12, borderRadius: 14, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <window.Icon name="spark" size={14} />
          <span>Genera tu menú con lo que tienes</span>
        </div>
      </div>
    </div>
  );
}
window.PantryScreen = PantryScreen;
