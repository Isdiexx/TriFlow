// ============================================================
// TriFlow Landing — Top nav
// ============================================================
const { useState: useStateN, useEffect: useEffectN } = React;

function Nav({ T, onTweaks }) {
  const [scrolled, setScrolled] = useStateN(false);
  useEffectN(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    { l: "Cómo funciona", h: "#how" },
    { l: "Asistente IA", h: "#ai" },
    { l: "Precios", h: "#pricing" },
    { l: "FAQ", h: "#faq" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 12, zIndex: 50,
      margin: "12px 5vw 0",
      padding: scrolled ? "10px 16px 10px 22px" : "14px 16px 14px 22px",
      background: scrolled ? `${T.card}EE` : `${T.bg}cc`,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${scrolled ? T.border : T.border}`,
      borderRadius: 99,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all .3s ease",
      boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.06)" : "none",
    }}>
      <window.Logo T={T} size={20} />
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {links.map((l, i) => (
          <a key={i} href={l.h} style={{
            padding: "8px 14px", color: T.textMid, textDecoration: "none",
            fontFamily: window.TRIFLOW_FONTS.body, fontSize: 14, borderRadius: 99,
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = T.charcoal; e.currentTarget.style.background = T.bg; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.background = "transparent"; }}
          >{l.l}</a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <window.Btn T={T} kind="link" size="sm">Iniciar sesión</window.Btn>
        <window.Btn T={T} kind="primary" size="sm" iconRight="arrow">Empieza gratis</window.Btn>
      </div>
    </nav>
  );
}
window.Nav = Nav;
