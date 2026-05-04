// ============================================================
// TriFlow Landing — Shared primitives (icons, mockup, helpers)
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

// ─── Icon system (line, monospace-feeling, no emoji) ──────────
function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.6 }) {
  const s = { width: size, height: size, color, flexShrink: 0 };
  const common = { fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "check":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M4 12.5l5 5L20 6.5"/></svg>;
    case "spark":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "flame":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 3c1 3 4 4.5 4 8a4 4 0 1 1-8 0c0-2 1-3 1-5 1.5 1 2 2 3-3z"/></svg>;
    case "drop":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 3l5 7a6 6 0 1 1-10 0l5-7z"/></svg>;
    case "leaf":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M20 4c-9 0-15 5-15 12 0 2 1 4 3 4 7 0 12-6 12-16zM6 19c4-5 8-8 13-11"/></svg>;
    case "moon":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M20 14a8 8 0 1 1-10-10 7 7 0 0 0 10 10z"/></svg>;
    case "book":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>;
    case "run":
      return <svg viewBox="0 0 24 24" style={s}><circle {...common} cx="14" cy="4.5" r="1.8"/><path {...common} d="M6 21l3-5 3 2 1-5-3-3 5-2 2 4 3-1"/></svg>;
    case "dumbbell":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M3 10v4M6 7v10M9 10h6M18 7v10M21 10v4"/></svg>;
    case "apple":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 7c-2-3-7-2-7 3 0 5 3 11 7 11s7-6 7-11c0-5-5-6-7-3z"/><path {...common} d="M12 7c0-2 1-4 3-4"/></svg>;
    case "brain":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 3V4z"/></svg>;
    case "arrow":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrowDiag":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M7 17L17 7M9 7h8v8"/></svg>;
    case "play":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M7 4l13 8-13 8V4z"/></svg>;
    case "plus":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 5v14M5 12h14"/></svg>;
    case "minus":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M5 12h14"/></svg>;
    case "ring":
      return <svg viewBox="0 0 24 24" style={s}><circle {...common} cx="12" cy="12" r="8"/></svg>;
    case "chevron":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M9 6l6 6-6 6"/></svg>;
    case "bolt":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/></svg>;
    case "heart":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/></svg>;
    case "calendar":
      return <svg viewBox="0 0 24 24" style={s}><rect {...common} x="3" y="5" width="18" height="16" rx="2"/><path {...common} d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "scan":
      return <svg viewBox="0 0 24 24" style={s}><path {...common} d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3M4 12h16"/></svg>;
    case "user":
      return <svg viewBox="0 0 24 24" style={s}><circle {...common} cx="12" cy="8" r="4"/><path {...common} d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case "logo": {
      // TriFlow mark — outer triangle composed of three nested gradient stripes:
      // Orden (despensa) · Hábito (alimentación) · Transformación (entrenamiento)
      const gid = "tf_logo_grad_" + (color === "currentColor" ? "cc" : color.replace(/[^a-z0-9]/gi, ""));
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <defs>
            <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.35"/>
            </linearGradient>
          </defs>
          {/* Outer triangle (Transformación) */}
          <path d="M16 3L29 27H3Z" fill={`url(#${gid})`} opacity="0.32"/>
          {/* Mid triangle (Hábito) */}
          <path d="M16 9.5L25 26H7Z" fill={`url(#${gid})`} opacity="0.55"/>
          {/* Inner triangle (Orden) */}
          <path d="M16 16L21 25H11Z" fill={`url(#${gid})`} opacity="1"/>
          {/* Crisp outer stroke */}
          <path d="M16 3L29 27H3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      );
    }
    default:
      return null;
  }
}
window.Icon = Icon;

// ─── Logo wordmark ────────────────────────────────────────────
// Modern, minimal "T" monogram: three rounded pills sitting on top
// (the three pillars — Transformación, Hábito, Orden) and one
// vertical pill descending from the center. Geometric, flat, bold.
function Logo({ T, size = 22 }) {
  const iconSize = size + 6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        {/* Three pillars at top — equal width, small gaps */}
        <rect x="2"    y="5" width="8.5" height="6" rx="2.2" fill={T.sageL}/>
        <rect x="11.75" y="5" width="8.5" height="6" rx="2.2" fill={T.sage}/>
        <rect x="21.5" y="5" width="8.5" height="6" rx="2.2" fill={T.sageD}/>
        {/* Stem — flows down from the three pillars */}
        <rect x="12.75" y="12" width="6.5" height="16" rx="2.2" fill={T.sageD}/>
      </svg>
      <span style={{
        fontFamily: window.TRIFLOW_FONTS.display,
        fontSize: size,
        fontWeight: 500,
        color: T.charcoal,
        letterSpacing: "-0.035em",
      }}>TriFlow</span>
    </div>
  );
}
window.Logo = Logo;

// ─── Section heading helper ───────────────────────────────────
function SectionEyebrow({ T, num, children, color }) {
  const c = color || T.sage;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: window.TRIFLOW_FONTS.body,
      fontSize: 12, fontWeight: 500,
      letterSpacing: "0.18em", textTransform: "uppercase",
      color: c,
    }}>
      <span style={{
        fontFamily: window.TRIFLOW_FONTS.mono,
        fontSize: 11, color: T.textSub,
        letterSpacing: "0.1em",
      }}>{num}</span>
      <span style={{ width: 24, height: 1, background: c, opacity: 0.6 }} />
      <span>{children}</span>
    </div>
  );
}
window.SectionEyebrow = SectionEyebrow;

// ─── Button ───────────────────────────────────────────────────
function Btn({ T, kind = "primary", size = "md", icon, iconRight, children, onClick, style, href }) {
  const sizes = {
    sm: { padding: "10px 18px", fontSize: 13 },
    md: { padding: "14px 24px", fontSize: 15 },
    lg: { padding: "18px 30px", fontSize: 16 },
  };
  const kinds = {
    primary: { background: T.charcoal, color: T.bg, border: `1px solid ${T.charcoal}` },
    sage: { background: T.sage, color: "#fff", border: `1px solid ${T.sage}` },
    ghost: { background: "transparent", color: T.charcoal, border: `1px solid ${T.border2}` },
    link: { background: "transparent", color: T.charcoal, border: "none", padding: 0 },
  };
  const base = {
    fontFamily: window.TRIFLOW_FONTS.body,
    fontWeight: 500,
    borderRadius: 99,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    transition: "all .25s ease",
    textDecoration: "none",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...kinds[kind],
    ...style,
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => {
        if (kind === "primary") { e.currentTarget.style.background = T.sageD; e.currentTarget.style.borderColor = T.sageD; e.currentTarget.style.color = "#fff"; }
        if (kind === "sage") { e.currentTarget.style.background = T.sageD; e.currentTarget.style.borderColor = T.sageD; }
        if (kind === "ghost") { e.currentTarget.style.background = T.charcoal; e.currentTarget.style.color = T.bg; e.currentTarget.style.borderColor = T.charcoal; }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, kinds[kind]);
      }}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16} />}
    </Tag>
  );
}
window.Btn = Btn;

// ─── Progress ring ────────────────────────────────────────────
function Ring({ value, max = 1, size = 64, stroke = 5, color, track }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / (max || 1)));
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.5,0,.2,1)" }} />
    </svg>
  );
}
window.Ring = Ring;

// ─── Sparkline ────────────────────────────────────────────────
function Spark({ data, color, w = 120, h = 36, fill = true }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pad = 3, ww = w - pad * 2, hh = h - pad * 2;
  const pts = data.map((v, i) => [pad + i * (ww / (data.length - 1)), pad + hh - ((v - mn) / rng) * hh]);
  const path = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L");
  const area = path + `L${pts[pts.length - 1][0].toFixed(1)},${h}L${pts[0][0].toFixed(1)},${h}Z`;
  const id = useMemo(() => "spk_" + Math.random().toString(36).slice(2, 9), []);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}
window.Spark = Spark;

// ─── Reveal on scroll ─────────────────────────────────────────
function Reveal({ children, delay = 0, y = 24, as: Tag = "div", style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Immediately reveal if already in viewport on mount
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh && r.bottom > 0) {
      setVis(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setVis(true); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity .8s ease ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</Tag>
  );
}
window.Reveal = Reveal;

// ─── iPhone frame ─────────────────────────────────────────────
function PhoneFrame({ T, children, width = 320, scale = 1, glow = true, accent }) {
  const h = width * 2.05;
  const a = accent || T.sage;
  return (
    <div style={{ position: "relative", width, height: h, transform: `scale(${scale})`, transformOrigin: "center" }}>
      {glow && (
        <div style={{
          position: "absolute", inset: -40,
          background: `radial-gradient(closest-side, ${a}26, transparent 70%)`,
          filter: "blur(20px)", pointerEvents: "none", zIndex: 0,
        }} />
      )}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", height: "100%",
        background: T.charcoal,
        borderRadius: 46,
        padding: 7,
        boxShadow: `0 30px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08), inset 0 0 0 1px ${T.border2}33`,
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: T.bg,
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 100, height: 28, background: T.charcoal, borderRadius: 99, zIndex: 10,
          }} />
          {children}
        </div>
      </div>
    </div>
  );
}
window.PhoneFrame = PhoneFrame;

// ─── Status bar inside phone ──────────────────────────────────
function StatusBar({ T }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 28px 6px", fontFamily: window.TRIFLOW_FONTS.body,
      fontSize: 13, fontWeight: 600, color: T.charcoal,
    }}>
      <span>9:41</span>
      <span style={{ width: 100 }} />
      <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
        <svg width="16" height="10" viewBox="0 0 16 10"><path d="M1 8h2v1H1zM5 6h2v3H5zM9 4h2v5H9zM13 1h2v8h-2z" fill="currentColor"/></svg>
        <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0.5" y="1" width="16" height="8" rx="1.5" fill="none" stroke="currentColor"/><rect x="2" y="2.5" width="11" height="5" rx="0.5" fill="currentColor"/><rect x="17" y="3.5" width="2" height="3" rx="0.5" fill="currentColor"/></svg>
      </span>
    </div>
  );
}
window.StatusBar = StatusBar;
