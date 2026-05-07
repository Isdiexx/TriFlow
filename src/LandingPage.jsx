/**
 * TriFlow Landing Page — Versión React integrada
 * Usa designSystem.js para mantener coherencia visual con la app
 */

import { useState } from 'react';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS } from './designSystem.js';

const LIGHT = {
  bg: "#F7F5F0",
  surface: "#FDFCFA",
  card: "#FFFFFF",
  border: "#EAE4D8",
  border2: "#D8D0C0",
  sage: "#7C9E87",
  sageL: "#A8C4AF",
  sageD: "#5A7D65",
  sand: "#C4A882",
  clay: "#C4856A",
  sky: "#7EA8C4",
  violet: "#9B8EC4",
  violetL: "#C4B8E8",
  violetD: "#7060A8",
  charcoal: "#2C2C2C",
  textMid: "#6B6458",
  textSub: "#9C9284",
  muted: "#B8B0A0",
  scrollbar: "#C8C0B0"
};

const DARK = {
  bg: "#161C18",
  surface: "#1C2420",
  card: "#212B25",
  border: "#2A3830",
  border2: "#354540",
  sage: "#7EC494",
  sageL: "#A8D4B4",
  sageD: "#5A9970",
  sand: "#D4B48C",
  clay: "#D4956A",
  sky: "#8AB8D4",
  violet: "#B4A8D8",
  violetL: "#7868A8",
  violetD: "#CEC4EC",
  charcoal: "#EAE6DE",
  textMid: "#A8A090",
  textSub: "#6E6860",
  muted: "#4A4840",
  scrollbar: "#2A3830"
};

export default function LandingPage({ onNavigateToApp }) {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  const heroStyle = {
    minHeight: '100vh',
    background: T.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${SPACING.xl * 2}px`,
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: 'clamp(48px, 8vw, 80px)',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    color: T.charcoal,
    lineHeight: 1.1,
    marginBottom: SPACING.lg,
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: T.textMid,
    marginBottom: SPACING.xl * 1.5,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: `0 auto ${SPACING.xl * 1.5}px`,
  };

  const ctaButtonStyle = {
    padding: `${SPACING.lg}px ${SPACING.xl}px`,
    background: T.sage,
    color: '#fff',
    border: 'none',
    borderRadius: BORDER_RADIUS.full,
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: TRANSITIONS.fast,
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: `${SPACING.lg}px ${SPACING.xl}px`,
    background: T.bg,
    borderBottom: `1px solid ${T.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  };

  return (
    <div style={{ background: T.bg, color: T.charcoal, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        button:hover { opacity: 0.9; filter: brightness(1.05); }
        button:active { transform: scale(0.98); }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={navStyle}>
        <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
          Tri<span style={{ color: T.sage }}>Flow</span>
        </div>
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Hero */}
      <section style={heroStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: SPACING.xl }}>
            <span style={{ fontSize: '20px' }}>✨</span>
          </div>

          <h1 style={titleStyle}>
            Cambia tus<br />
            hábitos.<br />
            <span style={{ fontStyle: 'italic', color: T.sage, fontWeight: 400 }}>Encuentra</span> tu flow.
          </h1>

          <p style={subtitleStyle}>
            La app de salud que entiende cómo vives. Hábitos, entrenamiento, nutrición y un asistente de IA que te conoce — todo en un solo lugar, simple y honesto.
          </p>

          <div style={{ display: 'flex', gap: SPACING.lg, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={ctaButtonStyle}
              onClick={onNavigateToApp}
            >
              Empieza gratis →
            </button>
            <button
              style={{
                ...ctaButtonStyle,
                background: 'transparent',
                border: `1.5px solid ${T.border}`,
                color: T.charcoal,
              }}
            >
              Ver demo · 90s
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: SPACING['2xl'], display: 'flex', gap: SPACING.xl, justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px', color: T.textMid }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
              <span style={{ color: T.sand }}>★★★★★</span>
              <span><strong style={{ color: T.charcoal }}>4,9 / 5</strong> · 1.200+ reseñas</span>
            </div>
            <div>
              <strong style={{ color: T.charcoal }}>+12.400</strong> personas cambiando sus hábitos
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: `${SPACING.xl * 3}px ${SPACING.xl}px`, background: T.surface }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: SPACING.xl * 2, textAlign: 'center', color: T.charcoal }}>
            Las herramientas que necesitas
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: SPACING.xl }}>
            {[
              { icon: '🎯', title: 'Hábitos', desc: 'Seguimiento diario de tus metas' },
              { icon: '🥗', title: 'Nutrición', desc: 'Menú semanal personalizado' },
              { icon: '💪', title: 'Entrenamiento', desc: 'Planes adaptados a tu nivel' },
              { icon: '⚖️', title: 'Peso', desc: 'Historial y tendencias' },
              { icon: '✨', title: 'IA Asistente', desc: 'Tu coach personal 24/7' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: SPACING.lg,
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: SPACING.md }}>{feature.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: SPACING.sm, color: T.charcoal }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: T.textMid }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section style={{ padding: `${SPACING.xl * 3}px ${SPACING.xl}px`, background: T.bg }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: SPACING.xl * 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.sm, background: T.violet + '18', color: T.violet, fontSize: '12px', fontWeight: 600, padding: `${SPACING.xs + 2}px ${SPACING.md}px`, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.lg, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.violet, display: 'inline-block' }} />
              Próximamente
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: "'Playfair Display', serif", fontWeight: 600, color: T.charcoal, marginBottom: SPACING.md }}>
              Tu equipo de salud,<br />
              <span style={{ fontStyle: 'italic', color: T.violet, fontWeight: 400 }}>en un solo lugar</span>
            </h2>
            <p style={{ fontSize: '16px', color: T.textMid, maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
              Conecta con nutricionistas, entrenadores y profesionales de la salud verificados. Agenda, seguimiento y planes — todo integrado con tu progreso en TriFlow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: SPACING.lg }}>
            {[
              { initials: 'CV', name: 'Camila Vásquez', role: 'Nutricionista Clínica', rating: 4.9, reviews: 127, specialties: ['Pérdida de peso', 'Deportiva'], price: '$25.000/sesión', color: T.sage },
              { initials: 'MR', name: 'Martín Reyes', role: 'Entrenador Personal', rating: 4.8, reviews: 94, specialties: ['Fuerza', 'Hipertrofia'], price: '$20.000/sesión', color: T.violet },
              { initials: 'SF', name: 'Sofía Fuentes', role: 'Psicóloga Deportiva', rating: 5.0, reviews: 68, specialties: ['Motivación', 'Hábitos'], price: '$30.000/sesión', color: T.sky },
              { initials: 'DR', name: 'Diego Rojas', role: 'Kinesiólogo', rating: 4.7, reviews: 53, specialties: ['Rehabilitación', 'Movilidad'], price: '$22.000/sesión', color: T.clay },
            ].map((pro, i) => (
              <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, transition: TRANSITIONS.slow, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg }}>
                  <div style={{ width: 52, height: 52, borderRadius: BORDER_RADIUS.full, background: pro.color + '20', border: `2px solid ${pro.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: pro.color, fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>
                    {pro.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: T.charcoal }}>{pro.name}</div>
                    <div style={{ fontSize: '13px', color: pro.color, fontWeight: 500, marginTop: 2 }}>{pro.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md }}>
                  <span style={{ color: T.sand, fontSize: '13px' }}>★</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: T.charcoal }}>{pro.rating}</span>
                  <span style={{ fontSize: '12px', color: T.textSub }}>({pro.reviews} reseñas)</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.xs + 2, marginBottom: SPACING.lg }}>
                  {pro.specialties.map((s, j) => (
                    <span key={j} style={{ fontSize: '11px', padding: `${SPACING.xs}px ${SPACING.sm + 2}px`, background: pro.color + '12', color: pro.color, borderRadius: BORDER_RADIUS.full, fontWeight: 500 }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.border}`, paddingTop: SPACING.md }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: T.charcoal }}>{pro.price}</span>
                  <button style={{ padding: `${SPACING.sm}px ${SPACING.lg}px`, borderRadius: BORDER_RADIUS.full, background: 'transparent', border: `1.5px solid ${pro.color}50`, color: pro.color, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: TRANSITIONS.fast }}>
                    Ver perfil
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: SPACING.xl * 1.5 }}>
            <p style={{ fontSize: '14px', color: T.textSub, marginBottom: SPACING.md }}>
              ¿Eres profesional de la salud?
            </p>
            <button style={{ padding: `${SPACING.md}px ${SPACING.xl}px`, borderRadius: BORDER_RADIUS.full, background: 'transparent', border: `1.5px solid ${T.border}`, color: T.charcoal, fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: TRANSITIONS.fast }}>
              Únete como profesional →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: `${SPACING.xl * 3}px ${SPACING.xl}px`, textAlign: 'center', background: T.surface }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: SPACING.xl, color: T.charcoal }}>
            ¿Listo para cambiar?
          </h2>
          <p style={{ fontSize: '18px', color: T.textMid, marginBottom: SPACING.xl * 2 }}>
            Únete a miles de personas que ya encontraron su flow. Comienza gratis hoy.
          </p>
          <button
            style={{ ...ctaButtonStyle, padding: `${SPACING.lg + 4}px ${SPACING.xl + 8}px`, fontSize: '18px' }}
            onClick={onNavigateToApp}
          >
            Empieza ahora →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: `${SPACING.xl}px`, textAlign: 'center', color: T.textSub, borderTop: `1px solid ${T.border}` }}>
        <p>© 2026 TriFlow. Diseñado para ti.</p>
      </footer>
    </div>
  );
}
