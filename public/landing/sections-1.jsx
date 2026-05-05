// ============================================================
// TriFlow Landing — Sections (hero, how, demo, ai, pricing, faq)
// ============================================================

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

// ─── Animated marquee of habits ───────────────────────────────
function HabitMarquee({ T }) {
  const items = [
    { n: "Meditar 10 min", i: "leaf", c: "sage" },
    { n: "Beber agua", i: "drop", c: "sky" },
    { n: "Correr 5 km", i: "run", c: "clay" },
    { n: "Leer 20 páginas", i: "book", c: "violet" },
    { n: "Dormir 8 horas", i: "moon", c: "violet" },
    { n: "Estiramiento matinal", i: "spark", c: "sand" },
    { n: "Sin azúcar", i: "apple", c: "clay" },
    { n: "Journaling", i: "book", c: "sage" },
    { n: "Caminar 8K pasos", i: "run", c: "sky" },
    { n: "Respiración 4-7-8", i: "leaf", c: "sage" },
  ];
  const row = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", padding: "8px 0", maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <div style={{ display: "flex", gap: 12, animation: "tfMarquee 50s linear infinite", width: "max-content" }}>
        {row.map((it, i) => {
          const c = T[it.c] || T.sage;
          return (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 18px", borderRadius: 99,
              background: T.card, border: `1px solid ${T.border}`,
              fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14,
              color: T.charcoal, whiteSpace: "nowrap",
            }}>
              <span style={{ width: 28, height: 28, borderRadius: 99, background: c + "22", color: c, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <window.Icon name={it.i} size={14} />
              </span>
              {it.n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.HabitMarquee = HabitMarquee;

// ─── HERO ─────────────────────────────────────────────────────
function Hero({ T, variant = "editorial" }) {
  const [checked, setChecked] = useStateS({ medita: true, leer: false, agua: true, correr: false, dormir: false });
  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));

  // Auto-demo: cycle through checking habits
  useEffectS(() => {
    if (variant !== "editorial") return;
    let i = 2;
    const ids = ["leer", "correr", "dormir"];
    const t = setInterval(() => {
      setChecked(c => {
        const id = ids[(i++) % ids.length];
        return { ...c, [id]: !c[id] };
      });
    }, 3200);
    return () => clearInterval(t);
  }, [variant]);

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <section data-screen-label="01 Hero" style={{ position: "relative", padding: "80px 5vw 60px", overflow: "hidden" }}>
      {/* Background flow lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.5 }} preserveAspectRatio="none" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="flow1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={T.sage} stopOpacity="0"/>
            <stop offset="50%" stopColor={T.sage} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={T.sage} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,500 Q300,300 600,420 T1200,300" fill="none" stroke="url(#flow1)" strokeWidth="1.2"/>
        <path d="M0,600 Q400,420 700,540 T1200,440" fill="none" stroke="url(#flow1)" strokeWidth="1"/>
        <path d="M0,700 Q500,520 800,640 T1200,540" fill="none" stroke="url(#flow1)" strokeWidth="0.8"/>
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1.1fr) minmax(280px, 1fr)", gap: "clamp(20px, 5vw, 80px)", maxWidth: 1400, margin: "0 auto", alignItems: "center", position: "relative" }}>
        {/* Copy */}
        <div>
          <window.Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 99, fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, color: T.textMid, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: T.sage }} />
              Nueva versión · Asistente IA integrado
            </div>
          </window.Reveal>

          <window.Reveal delay={80}>
            <h1 style={{
              fontFamily: window.TRIFLOW_FONTS.display,
              fontSize: "clamp(48px, 7vw, 92px)",
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              color: T.charcoal,
              margin: 0,
            }}>
              Cambia tus<br/>
              hábitos.<br/>
              <span style={{ fontStyle: "italic", color: T.sage, fontWeight: 400 }}>Encuentra</span>
              {" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                tu flow.
                <svg width="100%" height="14" viewBox="0 0 280 14" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -4, width: "100%" }}>
                  <path d="M2,8 Q70,2 140,7 T278,6" fill="none" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
          </window.Reveal>

          <window.Reveal delay={160}>
            <p style={{
              fontFamily: window.TRIFLOW_FONTS.body,
              fontSize: 19, lineHeight: 1.55,
              color: T.textMid, marginTop: 32, marginBottom: 36,
              maxWidth: 540,
              textWrap: "pretty",
            }}>
              La app de salud que entiende cómo vives. Hábitos, entrenamiento, nutrición y un asistente de IA que te conoce — todo en un solo lugar, simple y honesto.
            </p>
          </window.Reveal>

          <window.Reveal delay={220}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <window.Btn T={T} kind="primary" size="lg" iconRight="arrow" href="/?start">Empieza gratis</window.Btn>
              <window.Btn T={T} kind="ghost" size="lg" icon="play">Ver demo · 90s</window.Btn>
            </div>
          </window.Reveal>

          <window.Reveal delay={280}>
            <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", marginRight: -6 }}>
                  {["#7C9E87","#C4856A","#9B8EC4","#7EA8C4"].map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: 99, background: `linear-gradient(135deg, ${c}, ${c}cc)`, border: `2px solid ${T.bg}`, marginLeft: i ? -10 : 0 }} />
                  ))}
                </div>
                <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, lineHeight: 1.3 }}>
                  <strong style={{ color: T.charcoal }}>+12.400</strong> personas<br/>cambiando sus hábitos
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: T.border }} />
              <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid }}>
                <div style={{ display: "flex", gap: 2, color: T.sand, marginBottom: 2 }}>
                  {[1,1,1,1,1].map((_, i) => <span key={i}>★</span>)}
                </div>
                <strong style={{ color: T.charcoal }}>4,9 / 5</strong> · 1.200+ reseñas
              </div>
            </div>
          </window.Reveal>
        </div>

        {/* Phone with live habit demo */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <window.Reveal delay={140} y={40}>
            <div style={{ position: "relative" }}>
              {/* Floating side cards */}
              <div style={{ position: "absolute", top: 80, left: -120, padding: 14, background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", animation: "tfFloat 6s ease-in-out infinite", zIndex: 2, width: 200 }}>
                <div style={{ fontSize: 11, color: T.textSub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Racha actual</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                  <span style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 36, color: T.charcoal, fontWeight: 600, lineHeight: 1 }}>28</span>
                  <span style={{ fontSize: 13, color: T.textMid }}>días</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <window.Spark data={[6,8,9,12,16,18,22,24,28]} color={T.sage} w={170} h={28} />
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 100, right: -120, padding: 14, background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", animation: "tfFloat 7s ease-in-out infinite 1s", zIndex: 2, width: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: T.violet + "22", color: T.violetD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <window.Icon name="spark" size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T.violetD, fontWeight: 600 }}>IA · Hoy</div>
                    <div style={{ fontSize: 10, color: T.textSub }}>Sugerencia personal</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.charcoal, marginTop: 8, lineHeight: 1.4 }}>
                  Has dormido mejor. Es buen día para entrenar piernas.
                </div>
              </div>

              <window.PhoneFrame T={T} width={320} accent={T.sage}>
                <window.HomeScreen T={T} checked={checked} onToggle={toggle} />
              </window.PhoneFrame>

              {/* Click hint */}
              <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 11, color: T.textSub, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: T.sage, animation: "tfPulse 1.4s ease infinite" }} />
                Toca para marcar — es real
              </div>
            </div>
          </window.Reveal>
        </div>
      </div>

      {/* Habit marquee */}
      <div style={{ marginTop: 80 }}>
        <window.HabitMarquee T={T} />
      </div>
    </section>
  );
}
window.Hero = Hero;

// ─── HOW IT WORKS ─────────────────────────────────────────────
function HowItWorks({ T }) {
  const steps = [
    { num: "01", title: "Define tu objetivo", body: "Cuéntale a TriFlow qué quieres cambiar. Bajar peso, dormir mejor, correr tu primera 10K. Lo que sea.", icon: "user", color: "sage" },
    { num: "02", title: "Recibe tu plan", body: "El asistente IA crea tu menú semanal, plan de entrenamiento y rutina de hábitos basado en tu vida real.", icon: "spark", color: "violet" },
    { num: "03", title: "Sigue tu flow", body: "Marca, mide y ajusta. La app aprende de tus patrones y te acompaña sin presionar.", icon: "leaf", color: "clay" },
  ];

  return (
    <section data-screen-label="02 How it works" style={{ padding: "120px 5vw", background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ marginBottom: 56 }}>
            <window.SectionEyebrow T={T} num="01">Cómo funciona</window.SectionEyebrow>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, maxWidth: 800, textWrap: "balance" }}>
              Tres pasos. <span style={{ fontStyle: "italic", color: T.sage }}>Cero fricción.</span>
            </h2>
          </div>
        </window.Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
          {steps.map((s, i) => {
            const c = T[s.color];
            return (
              <window.Reveal key={i} delay={i * 80}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 28, height: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, fontFamily: window.TRIFLOW_FONTS.display, fontSize: 140, color: T.border, lineHeight: 1, fontWeight: 600, opacity: 0.5 }}>{s.num}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: c + "22", color: c, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative" }}>
                    <window.Icon name={s.icon} size={26} />
                  </div>
                  <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 11, color: T.textSub, letterSpacing: "0.08em", marginBottom: 8 }}>PASO {s.num}</div>
                  <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 26, fontWeight: 600, color: T.charcoal, margin: 0, marginBottom: 12, lineHeight: 1.15 }}>{s.title}</h3>
                  <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 15, lineHeight: 1.55, color: T.textMid, margin: 0, textWrap: "pretty" }}>{s.body}</p>
                </div>
              </window.Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.HowItWorks = HowItWorks;

// ─── INTERACTIVE TRACKER ──────────────────────────────────────
function InteractiveTracker({ T }) {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const [completed, setCompleted] = useStateS({});
  const [selectedDay, setSelectedDay] = useStateS(3);

  const habits = [
    { id: "h1", name: "Meditar", icon: "leaf", color: "sage", time: "07:00" },
    { id: "h2", name: "8 vasos de agua", icon: "drop", color: "sky", time: "Día" },
    { id: "h3", name: "Caminar 8K pasos", icon: "run", color: "clay", time: "Tarde" },
    { id: "h4", name: "Leer", icon: "book", color: "violet", time: "21:30" },
  ];

  const toggle = (id) => {
    const k = `${selectedDay}_${id}`;
    setCompleted(c => ({ ...c, [k]: !c[k] }));
  };

  const dayCount = (d) => habits.filter(h => completed[`${d}_${h.id}`]).length;
  const total = Object.values(completed).filter(Boolean).length;

  return (
    <section data-screen-label="03 Demo interactivo" style={{ padding: "120px 5vw" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <window.SectionEyebrow T={T} num="02">Pruébalo aquí</window.SectionEyebrow>
              <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, maxWidth: 720, textWrap: "balance" }}>
                Marca un hábito. <span style={{ fontStyle: "italic", color: T.sage }}>Siente el flow.</span>
              </h2>
            </div>
            <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14, color: T.textMid, maxWidth: 420 }}>
              Esta no es una imagen. Es la app misma corriendo aquí. Cambia el día, marca tareas, observa cómo crece tu semana.
            </div>
          </div>
        </window.Reveal>

        <window.Reveal delay={120}>
          <div style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 32,
            padding: 32,
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1fr) minmax(300px, 1.4fr)",
            gap: 32,
            boxShadow: "0 24px 60px rgba(0,0,0,0.06)",
          }}>
            {/* Week column */}
            <div>
              <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 11, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Esta semana</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 32 }}>
                {days.map((d, i) => {
                  const cnt = dayCount(i);
                  const pct = cnt / habits.length;
                  const active = i === selectedDay;
                  return (
                    <button key={i} onClick={() => setSelectedDay(i)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      padding: "12px 4px",
                      background: active ? T.bg : "transparent",
                      border: `1px solid ${active ? T.charcoal : T.border}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      transition: "all .25s ease",
                    }}>
                      <span style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 11, color: T.textSub, letterSpacing: "0.08em" }}>{d}</span>
                      <div style={{ position: "relative", width: 36, height: 36 }}>
                        <window.Ring value={cnt} max={habits.length} size={36} stroke={3.5} color={T.sage} track={T.border} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: pct === 1 ? T.sage : T.charcoal }}>
                          {cnt}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: 20, background: T.bg, borderRadius: 18, border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 11, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Resumen</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 44, fontWeight: 600, color: T.charcoal, lineHeight: 1 }}>{total}</div>
                    <div style={{ fontSize: 12, color: T.textMid, marginTop: 4 }}>completados esta semana</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 24, color: T.sage, fontWeight: 600 }}>+{Math.max(0, total - 3)}</div>
                    <div style={{ fontSize: 11, color: T.textSub }}>vs. semana pasada</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {days.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: T.border, overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, width: `${(dayCount(i) / habits.length) * 100}%`, background: T.sage, transition: "width .5s ease" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Habits column */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 11, color: T.textSub, letterSpacing: "0.1em", textTransform: "uppercase" }}>Hábitos · {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"][selectedDay]}</div>
                <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid }}>{dayCount(selectedDay)} de {habits.length}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {habits.map((h) => {
                  const k = `${selectedDay}_${h.id}`;
                  return <window.HabitRow key={h.id} T={T} habit={{ ...h, streak: 1 + (selectedDay * 2) }} checked={!!completed[k]} onToggle={() => toggle(h.id)} />;
                })}
              </div>

              <div style={{ marginTop: 20, padding: 16, background: T.violet + "12", borderRadius: 14, border: `1px solid ${T.violet}33`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: T.violet + "22", color: T.violetD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <window.Icon name="spark" size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.violetD, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Insight de IA</div>
                  <div style={{ fontSize: 13, color: T.charcoal, lineHeight: 1.5 }}>
                    {dayCount(selectedDay) === habits.length
                      ? "Día perfecto. Tu cuerpo lo recordará — son las pequeñas victorias las que cambian todo."
                      : dayCount(selectedDay) >= 2
                      ? "Vas en buen ritmo. ¿Te animas con uno más antes de cerrar el día?"
                      : "Empieza por el más pequeño. Una buena cadena nace de un solo eslabón."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </window.Reveal>
      </div>
    </section>
  );
}
window.InteractiveTracker = InteractiveTracker;
