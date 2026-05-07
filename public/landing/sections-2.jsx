// ============================================================
// TriFlow Landing — Sections 2 (AI showcase, features grid, pricing, FAQ, footer)
// ============================================================

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT } = React;

// ─── AI ASSISTANT showcase ────────────────────────────────────
function AIAssistant({ T }) {
  const conversation = [
    { role: "user", text: "Quiero bajar 5kg en 3 meses" },
    { role: "assistant", text: "Perfecto, Diego. Con tu peso actual (85kg) y entrenando 3 días, es muy alcanzable. Voy a crear tu plan." },
    { role: "assistant", text: "Tu menú semanal usa lo que ya tienes en despensa. Tu rutina prioriza piernas y cardio ligero." },
    { role: "user", text: "Hoy no quiero entrenar." },
    { role: "assistant", text: "Está bien. Lo muevo a mañana y te dejo una caminata de 30 min como activación. ¿Prefieres mañana o jueves?" },
  ];
  const [shown, setShown] = useStateT(0);
  const [typing, setTyping] = useStateT(false);
  const ref = useRefT(null);
  const [started, setStarted] = useStateT(false);

  useEffectT(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffectT(() => {
    if (!started) return;
    if (shown >= conversation.length) return;
    const isAssistant = conversation[shown].role === "assistant";
    setTyping(isAssistant);
    const t = setTimeout(() => {
      setTyping(false);
      setShown(s => s + 1);
    }, isAssistant ? 1400 : 800);
    return () => clearTimeout(t);
  }, [started, shown]);

  return (
    <section ref={ref} data-screen-label="04 Asistente IA" style={{ padding: "120px 5vw", background: T.charcoal, color: T.bg, position: "relative", overflow: "hidden" }}>
      {/* Decorative gradient */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: `radial-gradient(closest-side, ${T.violet}33, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -200, left: -200, width: 500, height: 500, background: `radial-gradient(closest-side, ${T.sage}26, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 1fr)", gap: "clamp(20px, 5vw, 80px)", alignItems: "center", position: "relative" }}>
        <div>
          <window.Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${T.violet}66`, borderRadius: 99, fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, color: T.violetL, marginBottom: 24 }}>
              <window.Icon name="spark" size={12} />
              Powered by Claude
            </div>
          </window.Reveal>
          <window.Reveal delay={80}>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, marginBottom: 24, textWrap: "balance" }}>
              Un coach que <span style={{ fontStyle: "italic", color: T.violetL }}>te conoce</span> de verdad.
            </h2>
          </window.Reveal>
          <window.Reveal delay={140}>
            <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 18, lineHeight: 1.6, color: "#A8A090", maxWidth: 540, marginBottom: 32, textWrap: "pretty" }}>
              Tu asistente lee tu progreso, tus hábitos, tu despensa y tu agenda. Te propone planes realistas y se adapta cuando la vida cambia. Sin juicios, sin presión.
            </p>
          </window.Reveal>
          <window.Reveal delay={200}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { i: "calendar", t: "Mueve tu plan cuando tienes un mal día" },
                { i: "apple", t: "Genera menús con lo que ya tienes en casa" },
                { i: "dumbbell", t: "Ajusta cargas según cómo te sientes" },
                { i: "heart", t: "Aprende tus patrones, no impone los suyos" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: window.TRIFLOW_FONTS.body, fontSize: 15, color: "#D4CDB8" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: T.violet + "33", color: T.violetL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <window.Icon name={f.i} size={16} />
                  </div>
                  {f.t}
                </div>
              ))}
            </div>
          </window.Reveal>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <window.Reveal delay={120} y={40}>
            <div style={{ width: 440, maxWidth: "100%", background: "#0E1410", border: `1px solid #2A3830`, borderRadius: 28, padding: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: `1px solid #2A3830`, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, background: `linear-gradient(135deg, ${T.violet}, ${T.violetD})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <window.Icon name="spark" size={18} />
                </div>
                <div>
                  <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 16, color: "#EAE6DE" }}>TriFlow Asistente</div>
                  <div style={{ fontSize: 11, color: "#8AC494", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, background: "#8AC494", borderRadius: 99 }} />Pensando contigo</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 380 }}>
                {conversation.slice(0, shown).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "tfFadeUp .4s ease both" }}>
                    <div style={{
                      maxWidth: "82%", padding: "12px 16px", borderRadius: 18,
                      borderTopLeftRadius: m.role === "user" ? 18 : 4,
                      borderTopRightRadius: m.role === "user" ? 4 : 18,
                      background: m.role === "user" ? T.violet : "#1C2420",
                      color: m.role === "user" ? "#fff" : "#EAE6DE",
                      fontSize: 14, lineHeight: 1.5,
                      fontFamily: window.TRIFLOW_FONTS.body,
                    }}>{m.text}</div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ padding: "14px 16px", borderRadius: 18, borderTopLeftRadius: 4, background: "#1C2420", display: "inline-flex", gap: 4 }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: "#A8A090", animation: `tfDot 1.2s ease ${i * 0.15}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </window.Reveal>
        </div>
      </div>
    </section>
  );
}
window.AIAssistant = AIAssistant;

// ─── FEATURES GRID (bento) ────────────────────────────────────
function FeaturesGrid({ T }) {
  return (
    <section data-screen-label="05 Features" style={{ padding: "120px 5vw" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ marginBottom: 56, maxWidth: 800 }}>
            <window.SectionEyebrow T={T} num="03">Todo lo que necesitas</window.SectionEyebrow>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, textWrap: "balance" }}>
              Cinco herramientas. <span style={{ fontStyle: "italic", color: T.sage }}>Una sola vida.</span>
            </h2>
          </div>
        </window.Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gridAutoRows: "minmax(200px, auto)", gap: "clamp(12px, 2vw, 16px)" }}>
          {/* Hábitos — large */}
          <window.Reveal as="div" style={{ gridColumn: "span 4", gridRow: "span 2" }}>
            <div style={{ height: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: T.sage + "22", color: T.sageD, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <window.Icon name="leaf" size={12} /> Hábitos
                </div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 36, fontWeight: 600, color: T.charcoal, marginTop: 20, marginBottom: 12, lineHeight: 1.1 }}>Construye rachas que importan</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 15, color: T.textMid, lineHeight: 1.55, maxWidth: 480, textWrap: "pretty" }}>
                  Define tus hábitos y déjalos vivir. TriFlow se ocupa de recordártelos en el momento preciso, sin spam, sin ansiedad.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 24 }}>
                {[3,5,7,4,8,12,15,18,22,28,24,30].map((v, i) => (
                  <div key={i} style={{ flex: 1, height: v * 4, background: i === 11 ? T.sage : T.sageL + "55", borderRadius: 4, transition: "all .3s" }} />
                ))}
              </div>
            </div>
          </window.Reveal>

          {/* Despensa */}
          <window.Reveal as="div" delay={80} style={{ gridColumn: "span 2" }}>
            <div style={{ height: "100%", background: T.sand + "1a", border: `1px solid ${T.sand}55`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 14, background: T.sand + "33", color: T.sand, alignItems: "center", justifyContent: "center" }}>
                <window.Icon name="scan" size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, color: T.charcoal, margin: 0, marginBottom: 6 }}>Escanea tu despensa</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, lineHeight: 1.5, margin: 0 }}>Código de barras y listo. La IA cocina con lo que tienes.</p>
              </div>
            </div>
          </window.Reveal>

          {/* Menú */}
          <window.Reveal as="div" delay={120} style={{ gridColumn: "span 2" }}>
            <div style={{ height: "100%", background: T.clay + "1a", border: `1px solid ${T.clay}55`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 14, background: T.clay + "33", color: T.clay, alignItems: "center", justifyContent: "center" }}>
                <window.Icon name="apple" size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, color: T.charcoal, margin: 0, marginBottom: 6 }}>Menú a tu medida</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, lineHeight: 1.5, margin: 0 }}>Sin lactosa, vegano, alta proteína. Tú decides.</p>
              </div>
            </div>
          </window.Reveal>

          {/* Entrena */}
          <window.Reveal as="div" delay={160} style={{ gridColumn: "span 2" }}>
            <div style={{ height: "100%", background: T.violet + "1a", border: `1px solid ${T.violet}55`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 14, background: T.violet + "33", color: T.violetD, alignItems: "center", justifyContent: "center" }}>
                <window.Icon name="dumbbell" size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, color: T.charcoal, margin: 0, marginBottom: 6 }}>Entrenamiento progresivo</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, lineHeight: 1.5, margin: 0 }}>Cargas que crecen contigo, sin saltarse nada.</p>
              </div>
            </div>
          </window.Reveal>

          {/* Peso tracking */}
          <window.Reveal as="div" delay={200} style={{ gridColumn: "span 2" }}>
            <div style={{ height: "100%", background: T.sky + "1a", border: `1px solid ${T.sky}55`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 14, background: T.sky + "33", color: T.sky, alignItems: "center", justifyContent: "center" }}>
                  <window.Icon name="ring" size={22} />
                </div>
                <window.Spark data={[88, 87.5, 87, 86.8, 86, 85.5, 85]} color={T.sky} w={90} h={36} />
              </div>
              <div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, color: T.charcoal, margin: 0, marginBottom: 6 }}>Progreso real</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, lineHeight: 1.5, margin: 0 }}>Peso, agua, sueño. Datos honestos, no vanidad.</p>
              </div>
            </div>
          </window.Reveal>

          {/* Privacy */}
          <window.Reveal as="div" delay={240} style={{ gridColumn: "span 2" }}>
            <div style={{ height: "100%", background: T.charcoal, color: T.bg, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 14, background: T.bg + "22", color: T.bg, alignItems: "center", justifyContent: "center" }}>
                <window.Icon name="moon" size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, margin: 0, marginBottom: 6 }}>Tu data, tuya</h3>
                <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: "#A8A090", lineHeight: 1.5, margin: 0 }}>Sin venta a terceros. Exporta cuando quieras.</p>
              </div>
            </div>
          </window.Reveal>
        </div>
      </div>
    </section>
  );
}
window.FeaturesGrid = FeaturesGrid;

// ─── METRICS ──────────────────────────────────────────────────
function Metrics({ T }) {
  const m = [
    { n: "12.400+", l: "personas activas" },
    { n: "847.300", l: "hábitos completados" },
    { n: "92%", l: "mantienen la racha al mes" },
    { n: "4,9 ★", l: "en App Store y Play" },
  ];
  return (
    <section data-screen-label="06 Metrics" style={{ padding: "80px 5vw", background: T.bgDeep || T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(20px, 3vw, 32px)" }}>
        {m.map((it, i) => (
          <window.Reveal key={i} delay={i * 60}>
            <div>
              <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 600, color: T.charcoal, lineHeight: 1, letterSpacing: "-0.02em" }}>{it.n}</div>
              <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 13, color: T.textMid, marginTop: 8, letterSpacing: "0.02em" }}>{it.l}</div>
            </div>
          </window.Reveal>
        ))}
      </div>
    </section>
  );
}
window.Metrics = Metrics;

// ─── TESTIMONIALS ─────────────────────────────────────────────
function Testimonials({ T }) {
  const t = [
    { name: "Camila R.", role: "Diseñadora · Santiago", text: "Probé tres apps de hábitos antes. TriFlow es la primera que no me hace sentir culpa cuando fallo un día.", color: "sage" },
    { name: "Andrés M.", role: "Ingeniero · Madrid", text: "El asistente entiende cuando le digo 'hoy no'. Mueve mi semana y sigo. Eso vale oro.", color: "violet" },
    { name: "Sofía L.", role: "Estudiante · CDMX", text: "Bajé 6kg en 4 meses sin obsesionarme. La parte de despensa con escáner me cambió la cocina.", color: "clay" },
  ];
  return (
    <section data-screen-label="07 Testimonials" style={{ padding: "120px 5vw" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ marginBottom: 56 }}>
            <window.SectionEyebrow T={T} num="04">Lo que dicen</window.SectionEyebrow>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, maxWidth: 760, textWrap: "balance" }}>
              Personas reales, <span style={{ fontStyle: "italic", color: T.sage }}>cambios reales.</span>
            </h2>
          </div>
        </window.Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 2vw, 20px)" }}>
          {t.map((q, i) => {
            const c = T[q.color];
            return (
              <window.Reveal key={i} delay={i * 80}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 28, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 56, color: c, lineHeight: 0.5, marginBottom: 8 }}>“</div>
                  <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 16, lineHeight: 1.55, color: T.charcoal, flex: 1, margin: 0, marginBottom: 24, textWrap: "pretty" }}>{q.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 99, background: `linear-gradient(135deg, ${c}, ${c}99)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontFamily: window.TRIFLOW_FONTS.body }}>{q.name[0]}</div>
                    <div>
                      <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14, fontWeight: 600, color: T.charcoal }}>{q.name}</div>
                      <div style={{ fontSize: 12, color: T.textSub }}>{q.role}</div>
                    </div>
                  </div>
                </div>
              </window.Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.Testimonials = Testimonials;

// ─── PRICING ──────────────────────────────────────────────────
function Pricing({ T }) {
  const plans = [
    { name: "Empieza", price: "Gratis", body: "Para siempre", features: ["Hasta 3 hábitos", "Tracking de peso y agua", "Asistente IA · 20 mensajes/mes"], cta: "Crear cuenta", kind: "ghost" },
    { name: "Flow", price: "$4,90", body: "por mes", features: ["Hábitos ilimitados", "Menú semanal con IA", "Plan de entrenamiento", "Escáner de despensa", "Asistente IA ilimitado"], cta: "Empezar 14 días gratis", kind: "primary", featured: true },
    { name: "Flow Plus", price: "$9,90", body: "por mes", features: ["Todo lo de Flow", "Coach humano 1×/mes", "Análisis de sangre integrable", "Prioridad en soporte"], cta: "Hablar con ventas", kind: "ghost" },
  ];

  return (
    <section data-screen-label="08 Pricing" style={{ padding: "120px 5vw", background: T.surface, borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <window.SectionEyebrow T={T} num="05">Precios honestos</window.SectionEyebrow>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, textWrap: "balance" }}>
              Empieza <span style={{ fontStyle: "italic", color: T.sage }}>hoy</span>. Pagas cuando estés listo.
            </h2>
          </div>
        </window.Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(12px, 2vw, 16px)", maxWidth: 1100, margin: "0 auto" }}>
          {plans.map((p, i) => (
            <window.Reveal key={i} delay={i * 80}>
              <div style={{
                background: p.featured ? T.charcoal : T.card,
                color: p.featured ? T.bg : T.charcoal,
                border: `1px solid ${p.featured ? T.charcoal : T.border}`,
                borderRadius: 28,
                padding: 32,
                position: "relative",
                height: "100%",
                display: "flex", flexDirection: "column",
                transform: p.featured ? "translateY(-8px)" : "none",
                boxShadow: p.featured ? "0 24px 60px rgba(0,0,0,0.16)" : "none",
              }}>
                {p.featured && (
                  <div style={{ position: "absolute", top: -12, left: 32, padding: "4px 12px", background: T.sage, color: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: window.TRIFLOW_FONTS.body }}>Más popular</div>
                )}
                <div style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 22, fontWeight: 600, marginBottom: 12 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
                  <span style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: 48, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>{p.price}</span>
                  <span style={{ fontSize: 13, opacity: 0.7 }}>{p.body}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 24 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, fontFamily: window.TRIFLOW_FONTS.body, lineHeight: 1.45 }}>
                      <span style={{ color: p.featured ? T.sage : T.sage, marginTop: 2, flexShrink: 0 }}><window.Icon name="check" size={16} strokeWidth={2.2} /></span>
                      <span style={{ opacity: p.featured ? 0.9 : 1 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <window.Btn T={T} kind={p.featured ? "sage" : "ghost"} size="md" href="/?start" style={{ width: "100%", justifyContent: "center", ...(p.featured ? {} : (p.featured ? {} : {})) }}>
                  {p.cta}
                </window.Btn>
              </div>
            </window.Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Pricing = Pricing;

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ({ T }) {
  const items = [
    { q: "¿Necesito saber de fitness para usarlo?", a: "Para nada. Le cuentas tus objetivos y tu rutina, y la app construye el plan. La IA explica todo en lenguaje simple." },
    { q: "¿Qué pasa si fallo un día?", a: "Nada malo. TriFlow no te castiga. Reorganiza tu semana sin presión y sigue contigo donde lo dejaste." },
    { q: "¿Puedo cancelar cuando quiera?", a: "Sí, en un click. Sin permanencia, sin letra chica. Y exportas todos tus datos al irte." },
    { q: "¿La IA realmente me conoce?", a: "Lee tu perfil, tus hábitos completados, tu progreso de peso, tu despensa y tus restricciones. Cada respuesta usa tu contexto." },
    { q: "¿Es seguro con mis datos?", a: "Sí. Cifrado en tránsito y en reposo. Tus datos no se venden ni entrenan a terceros. Punto." },
  ];
  const [open, setOpen] = useStateT(0);
  return (
    <section data-screen-label="09 FAQ" style={{ padding: "120px 5vw" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{ marginBottom: 48 }}>
            <window.SectionEyebrow T={T} num="06">Preguntas</window.SectionEyebrow>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.charcoal, marginTop: 18, textWrap: "balance" }}>
              Lo que <span style={{ fontStyle: "italic", color: T.sage }}>te preguntas</span>.
            </h2>
          </div>
        </window.Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <window.Reveal key={i} delay={i * 40}>
                <div style={{ background: T.card, border: `1px solid ${isOpen ? T.charcoal : T.border}`, borderRadius: 18, overflow: "hidden", transition: "all .3s ease" }}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                    width: "100%", padding: "22px 24px", background: "none", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    cursor: "pointer", textAlign: "left",
                    fontFamily: window.TRIFLOW_FONTS.body, fontSize: 17, fontWeight: 500, color: T.charcoal,
                  }}>
                    <span>{it.q}</span>
                    <span style={{ flexShrink: 0, color: T.textMid, transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform .25s ease" }}>
                      <window.Icon name="plus" size={20} />
                    </span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
                    <div style={{ padding: "0 24px 22px", fontFamily: window.TRIFLOW_FONTS.body, fontSize: 15, color: T.textMid, lineHeight: 1.6, textWrap: "pretty" }}>{it.a}</div>
                  </div>
                </div>
              </window.Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.FAQ = FAQ;

// ─── MARKETPLACE PREVIEW ──────────────────────────────────────
function Marketplace({ T }) {
  const pros = [
    { initials: "CV", name: "Camila Vásquez", role: "Nutricionista Clínica", rating: 4.9, reviews: 127, tags: ["Pérdida de peso", "Deportiva"], price: "$25.000/sesión", color: T.sage },
    { initials: "MR", name: "Martín Reyes", role: "Entrenador Personal", rating: 4.8, reviews: 94, tags: ["Fuerza", "Hipertrofia"], price: "$20.000/sesión", color: T.violet },
    { initials: "SF", name: "Sofía Fuentes", role: "Psicóloga Deportiva", rating: 5.0, reviews: 68, tags: ["Motivación", "Hábitos"], price: "$30.000/sesión", color: T.sky },
    { initials: "DR", name: "Diego Rojas", role: "Kinesiólogo", rating: 4.7, reviews: 53, tags: ["Rehabilitación", "Movilidad"], price: "$22.000/sesión", color: T.clay },
  ];

  return (
    <section data-screen-label="09b Marketplace" style={{ padding: "120px 5vw", background: T.surface }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <window.Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${T.violet}44`, borderRadius: 99, fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, color: T.violet, marginBottom: 24, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.violet, display: "inline-block", animation: "tfPulse 2s ease infinite" }} />
              Próximamente
            </div>
          </window.Reveal>
          <window.Reveal delay={80}>
            <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, marginBottom: 20, textWrap: "balance" }}>
              Tu equipo de salud,{" "}
              <span style={{ fontFamily: window.TRIFLOW_FONTS.serif, fontStyle: "italic", color: T.violet, fontWeight: 400 }}>en un solo lugar</span>
            </h2>
          </window.Reveal>
          <window.Reveal delay={140}>
            <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 18, lineHeight: 1.6, color: T.textMid, maxWidth: 580, margin: "0 auto", textWrap: "pretty" }}>
              Conecta con nutricionistas, entrenadores y profesionales de la salud verificados. Agenda, seguimiento y planes — todo integrado con tu progreso en TriFlow.
            </p>
          </window.Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }} className="pricing-grid">
          {pros.map((pro, i) => (
            <window.Reveal key={i} delay={i * 80}>
              <div style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 20,
                padding: "28px 24px", transition: "all .35s ease", position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = pro.color + "66"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${pro.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 99, background: pro.color + "18",
                    border: `2px solid ${pro.color}40`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: pro.color, fontFamily: window.TRIFLOW_FONTS.display, flexShrink: 0,
                  }}>
                    {pro.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: T.charcoal, fontFamily: window.TRIFLOW_FONTS.body }}>{pro.name}</div>
                    <div style={{ fontSize: 13, color: pro.color, fontWeight: 500, marginTop: 2, fontFamily: window.TRIFLOW_FONTS.body }}>{pro.role}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <span style={{ color: T.sand, fontSize: 14 }}>★</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, fontFamily: window.TRIFLOW_FONTS.body }}>{pro.rating}</span>
                  <span style={{ fontSize: 13, color: T.textSub, fontFamily: window.TRIFLOW_FONTS.body }}>({pro.reviews} reseñas)</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {pro.tags.map((tag, j) => (
                    <span key={j} style={{
                      fontSize: 11, padding: "4px 10px", background: pro.color + "14", color: pro.color,
                      borderRadius: 99, fontWeight: 500, fontFamily: window.TRIFLOW_FONTS.body,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.charcoal, fontFamily: window.TRIFLOW_FONTS.body }}>{pro.price}</span>
                  <button style={{
                    padding: "8px 18px", borderRadius: 99, background: "transparent",
                    border: `1.5px solid ${pro.color}55`, color: pro.color, fontSize: 13,
                    fontWeight: 600, cursor: "pointer", fontFamily: window.TRIFLOW_FONTS.body,
                    transition: "all .2s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = pro.color + "14"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            </window.Reveal>
          ))}
        </div>

        <window.Reveal delay={400}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 15, color: T.textSub, marginBottom: 16, fontFamily: window.TRIFLOW_FONTS.body }}>
              ¿Eres profesional de la salud?
            </p>
            <a href="/?start" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 28px", borderRadius: 99, border: `1.5px solid ${T.border}`,
              color: T.charcoal, fontSize: 15, fontWeight: 500, textDecoration: "none",
              fontFamily: window.TRIFLOW_FONTS.body, transition: "all .2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.violet; e.currentTarget.style.color = T.violet; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.charcoal; }}
            >
              Únete como profesional <window.Icon name="arrowDiag" size={14} />
            </a>
          </div>
        </window.Reveal>
      </div>
    </section>
  );
}
window.Marketplace = Marketplace;

// ─── FINAL CTA ────────────────────────────────────────────────
function FinalCTA({ T }) {
  return (
    <section data-screen-label="10 CTA final" style={{ padding: "120px 5vw" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <window.Reveal>
          <div style={{
            background: T.charcoal, color: T.bg,
            borderRadius: 32, padding: "80px 6vw",
            position: "relative", overflow: "hidden",
            textAlign: "center",
          }}>
            <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: `radial-gradient(closest-side, ${T.sage}55, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${T.bg}33`, borderRadius: 99, fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, color: T.bg, marginBottom: 28, opacity: 0.7 }}>
                <window.Icon name="leaf" size={12} /> Tu próximo capítulo
              </div>
              <h2 style={{ fontFamily: window.TRIFLOW_FONTS.display, fontSize: "clamp(44px, 7vw, 92px)", fontWeight: 600, lineHeight: 0.98, letterSpacing: "-0.025em", margin: 0, marginBottom: 24, textWrap: "balance" }}>
                Tu cambio<br/>
                <span style={{ fontStyle: "italic", color: T.sageL }}>empieza</span> hoy.
              </h2>
              <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 18, lineHeight: 1.6, color: "#A8A090", maxWidth: 600, margin: "0 auto 40px", textWrap: "pretty" }}>
                Sin tarjeta. Sin permanencia. Solo tú, tus hábitos y un asistente que te entiende.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <window.Btn T={T} kind="sage" size="lg" iconRight="arrow" href="/?start">Empezar gratis</window.Btn>
                <a href="#" style={{ padding: "18px 30px", borderRadius: 99, border: `1px solid ${T.bg}33`, color: T.bg, textDecoration: "none", fontFamily: window.TRIFLOW_FONTS.body, fontSize: 16, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 10 }}>
                  Hablar con un humano <window.Icon name="arrowDiag" size={16}/>
                </a>
              </div>
            </div>
          </div>
        </window.Reveal>
      </div>
    </section>
  );
}
window.FinalCTA = FinalCTA;

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({ T }) {
  const cols = [
    { title: "Producto", links: ["Hábitos", "Menú semanal", "Entrenamiento", "Asistente IA", "Despensa"] },
    { title: "Empresa", links: ["Sobre TriFlow", "Manifiesto", "Blog", "Carreras", "Prensa"] },
    { title: "Soporte", links: ["Centro de ayuda", "Contacto", "Estado", "Comunidad"] },
    { title: "Legal", links: ["Privacidad", "Términos", "Cookies", "Seguridad"] },
  ];
  return (
    <footer data-screen-label="11 Footer" style={{ padding: "60px 5vw 30px", background: T.bgDeep || T.surface, borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(24px, 4vw, 40px)", paddingBottom: 48, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <window.Logo T={T} size={22} />
            <p style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14, color: T.textMid, marginTop: 16, lineHeight: 1.55, maxWidth: 320, textWrap: "pretty" }}>
              La app de salud que entiende cómo vives. Hecha con cuidado, en español, para Latinoamérica y el mundo.
            </p>
          </div>
          {cols.map((c, i) => (
            <div key={i}>
              <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, fontWeight: 600, color: T.charcoal, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>{c.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.links.map((l, j) => (
                  <li key={j}><a href="#" style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14, color: T.textMid, textDecoration: "none" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: window.TRIFLOW_FONTS.mono, fontSize: 12, color: T.textSub }}>© 2026 TriFlow · Hecho con cuidado en Santiago</div>
          <div style={{ fontFamily: window.TRIFLOW_FONTS.body, fontSize: 12, color: T.textSub, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: T.sage }} />
            Todos los sistemas operando
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
