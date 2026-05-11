// TriFlow SVG Icon System — line/stroke style, 24x24 viewBox
// Replaces Unicode icons for professional, consistent look

export default function TFIcon({ name, size = 22, stroke = 1.6, color, style }) {
  const p = { fill: "none", stroke: color || "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    // Tab bar icons
    inicio: <><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" {...p}/></>,
    habito: <><rect x="3.5" y="4.5" width="17" height="16" rx="2" {...p}/><path d="M3.5 9.5h17M8 3v3M16 3v3" {...p}/><path d="M8 13l1.6 1.6L13 11" {...p}/></>,
    despensa: <><path d="M4 6.5l8-3.5 8 3.5v11l-8 3.5-8-3.5z" {...p}/><path d="M4 6.5l8 3.5 8-3.5M12 10v11" {...p}/></>,
    entrena: <><path d="M5 9v6M19 9v6M3 11v2M21 11v2M7 7v10M17 7v10M7 12h10" {...p}/></>,
    asistente: <><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" {...p}/><circle cx="18" cy="18" r="1.4" fill={color || "currentColor"}/></>,
    perfil: <><circle cx="12" cy="8" r="3.5" {...p}/><path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" {...p}/></>,
    // Utility icons
    plus: <><path d="M12 5v14M5 12h14" {...p}/></>,
    check: <><path d="M5 12.5l4.5 4.5L19 7" {...p}/></>,
    close: <><path d="M6 6l12 12M18 6L6 18" {...p}/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" {...p}/></>,
    arrowL: <><path d="M19 12H5M11 6l-6 6 6 6" {...p}/></>,
    chevron: <><path d="M9 6l6 6-6 6" {...p}/></>,
    chevronD: <><path d="M6 9l6 6 6-6" {...p}/></>,
    sun: <><circle cx="12" cy="12" r="4" {...p}/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" {...p}/></>,
    moon: <><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" {...p}/></>,
    leaf: <><path d="M4 20s2-12 16-16c0 0-2 16-16 16zM4 20l8-8" {...p}/></>,
    scan: <><path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3M7 12h10" {...p}/></>,
    apple: <><path d="M12 8c0-2 1.5-4 4-4 0 2-2 3.5-4 3.5M8 8c-3 0-5 3-5 6.5 0 4 2.5 6.5 5 6.5 1.2 0 2-.5 3-.5s1.8.5 3 .5c2.5 0 5-2.5 5-6.5 0-3.5-2-6.5-5-6.5-1.5 0-2.5.6-3 .6s-1.5-.6-3-.6z" {...p}/></>,
    dumbbell: <><path d="M6 8v8M3 10v4M18 8v8M21 10v4M9 7v10M15 7v10M9 12h6" {...p}/></>,
    cart: <><path d="M3 4h2l2 12h11l2-8H7" {...p}/><circle cx="9" cy="20" r="1.4" fill={color || "currentColor"}/><circle cx="18" cy="20" r="1.4" fill={color || "currentColor"}/></>,
    receipt: <><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h4" {...p}/></>,
    camera: <><rect x="3" y="7" width="18" height="13" rx="2" {...p}/><path d="M8 7l2-3h4l2 3" {...p}/><circle cx="12" cy="13.5" r="3.5" {...p}/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3zM10 19a2 2 0 0 0 4 0" {...p}/></>,
    flame: <><path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-5-5-10-5-10z" {...p}/></>,
    chat: <><path d="M4 4h16v12H8l-4 4z" {...p}/></>,
    settings: <><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" {...p}/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16zM14 5l4 4" {...p}/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" {...p}/></>,
    logout: <><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H10" {...p}/></>,
    water: <><path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z" {...p}/></>,
    weight: <><path d="M5 7h14l-1.5 13H6.5zM9 7a3 3 0 0 1 6 0" {...p}/></>,
    send: <><path d="M4 20l16-8L4 4l3 8z" {...p}/></>,
    refresh: <><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4" {...p}/></>,
    sparkles: <><path d="M12 3l1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3zM18 16l.7 2L21 19l-2.3.7-.7 2-.7-2L15 19l2.3-.7z" {...p}/></>,
    target: <><circle cx="12" cy="12" r="9" {...p}/><circle cx="12" cy="12" r="5" {...p}/><circle cx="12" cy="12" r="1.5" fill={color || "currentColor"}/></>,
    clock: <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5l3 2" {...p}/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" {...p}/><path d="M8 11V7a4 4 0 0 1 8 0v4" {...p}/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    ring: <><circle cx="12" cy="12" r="8" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle", ...style }}>
      {paths[name] || paths.sparkles}
    </svg>
  );
}
