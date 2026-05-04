/**
 * TriFlow Design System
 * Centralized styling constants and helper functions for consistent UI
 */

// ═══════════════════════════════════════════════════════════
// SPACING SCALE
// ═══════════════════════════════════════════════════════════
export const SPACING = {
  xs: 4,      // Minimal gaps
  sm: 8,      // Small spacing
  md: 12,     // Medium spacing
  lg: 16,     // Large spacing (cards, main padding)
  xl: 20,     // Extra large
  '2xl': 28,  // Double extra large
};

// ═══════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════
export const BORDER_RADIUS = {
  sm: 8,      // Small components, inputs
  md: 12,     // Input fields
  lg: 16,     // Cards, main components
  full: 99,   // Buttons, avatars, pills
};

// ═══════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE
// ═══════════════════════════════════════════════════════════
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 600,
    fontFamily: "'Playfair Display',serif",
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 24,
    fontWeight: 600,
    fontFamily: "'Playfair Display',serif",
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: 600,
    fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.4,
  },
  body: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.5,
  },
  small: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "'DM Sans',sans-serif",
    lineHeight: 1.4,
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    fontFamily: "'DM Sans',sans-serif",
    letterSpacing: "0.07em",
    lineHeight: 1.3,
  },
};

// ═══════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════
export const SHADOWS = {
  sm: "0 2px 4px rgba(0,0,0,0.08)",
  md: "0 4px 12px rgba(0,0,0,0.12)",
  lg: "0 8px 24px rgba(0,0,0,0.15)",
};

// ═══════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════
export const TRANSITIONS = {
  fast: "all 0.2s ease",
  normal: "all 0.3s ease",
  slow: "all 0.4s ease",
};

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR COMPONENT STYLES
// ═══════════════════════════════════════════════════════════

/**
 * Card styling helper
 * @param {Object} T - Theme object with color properties
 * @param {string} variant - 'default', 'elevated', or 'empty'
 * @returns {Object} CSS style object
 */
export const cardStyle = (T, variant = 'default') => {
  const base = {
    background: T.card,
    borderRadius: BORDER_RADIUS.lg,
    border: `1px solid ${T.border}`,
    transition: TRANSITIONS.slow,
  };

  const variants = {
    default: {
      ...base,
      padding: `${SPACING.lg}px`,
    },
    elevated: {
      ...base,
      padding: `${SPACING.lg}px`,
      boxShadow: SHADOWS.md,
    },
    empty: {
      ...base,
      padding: `${SPACING['2xl']}px ${SPACING.xl}px`,
      textAlign: 'center',
    },
  };

  return variants[variant] || variants.default;
};

/**
 * Button styling helper
 * @param {Object} T - Theme object with color properties
 * @param {string} variant - 'primary' or 'secondary'
 * @param {string} state - 'default', 'hover', or 'disabled'
 * @returns {Object} CSS style object
 */
export const buttonStyle = (T, variant = 'primary', state = 'default') => {
  const baseStyle = {
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 15,
    fontWeight: 600,
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.lg,
    transition: TRANSITIONS.fast,
  };

  const variants = {
    primary: {
      default: {
        ...baseStyle,
        background: T.sage,
        color: '#fff',
      },
      hover: {
        ...baseStyle,
        background: T.sageD,
        color: '#fff',
        boxShadow: SHADOWS.sm,
      },
      disabled: {
        ...baseStyle,
        background: T.muted,
        color: T.textSub,
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    secondary: {
      default: {
        ...baseStyle,
        background: T.border,
        color: T.charcoal,
      },
      hover: {
        ...baseStyle,
        background: T.border2,
        color: T.charcoal,
      },
      disabled: {
        ...baseStyle,
        background: T.muted,
        color: T.textSub,
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
  };

  return variants[variant]?.[state] || variants.primary.default;
};

/**
 * Input styling helper
 * @param {Object} T - Theme object with color properties
 * @param {string} state - 'default', 'focus', 'error', or 'disabled'
 * @returns {Object} CSS style object
 */
export const inputStyle = (T, state = 'default') => {
  const baseStyle = {
    width: '100%',
    padding: `${SPACING.md}px ${SPACING.lg}px`,
    borderRadius: BORDER_RADIUS.md,
    background: T.card,
    fontSize: 14,
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: 400,
    color: T.charcoal,
    outline: 'none',
    transition: TRANSITIONS.normal,
    marginBottom: SPACING.lg,
  };

  const states = {
    default: {
      ...baseStyle,
      border: `1.5px solid ${T.border}`,
    },
    focus: {
      ...baseStyle,
      border: `1.5px solid ${T.sage}`,
      boxShadow: `0 0 0 3px ${T.sage}22`,
    },
    error: {
      ...baseStyle,
      border: `1.5px solid ${T.clay}`,
      background: T.clay + '22',
    },
    disabled: {
      ...baseStyle,
      border: `1.5px solid ${T.border}`,
      background: T.muted + '44',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  };

  return states[state] || states.default;
};

/**
 * Chip/Tag styling helper
 * @param {Object} T - Theme object with color properties
 * @param {string} color - Color to use for the chip
 * @returns {Object} CSS style object
 */
export const chipStyle = (T, color = null) => {
  const chipColor = color || T.sage;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${SPACING.xs}px ${SPACING.md}px`,
    borderRadius: BORDER_RADIUS.full,
    fontSize: 12,
    fontWeight: 500,
    background: chipColor + '22',
    color: chipColor,
    fontFamily: "'DM Sans',sans-serif",
    transition: TRANSITIONS.fast,
  };
};

/**
 * Flex container helper for consistent spacing between items
 * @param {string} gap - Gap size key from SPACING
 * @param {boolean} column - Use flex-direction: column
 * @returns {Object} CSS style object
 */
export const flexContainer = (gap = 'md', column = false) => ({
  display: 'flex',
  flexDirection: column ? 'column' : 'row',
  gap: SPACING[gap] || SPACING.md,
});

/**
 * Grid layout helper
 * @param {number} columns - Number of columns
 * @param {string} gap - Gap size key from SPACING
 * @returns {Object} CSS style object
 */
export const gridLayout = (columns = 2, gap = 'md') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gap: SPACING[gap] || SPACING.md,
});

/**
 * Text overflow helper
 * @param {number} lines - Number of lines before truncation
 * @returns {Object} CSS style object
 */
export const textEllipsis = (lines = 1) => {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };
};

/**
 * Responsive padding helper
 * @param {string} mobile - Mobile padding key from SPACING
 * @param {string} desktop - Desktop padding key from SPACING (optional)
 * @returns {Object} CSS style object (will need media query for full responsive)
 */
export const responsivePadding = (mobile = 'lg', desktop = null) => {
  const mobileVal = SPACING[mobile] || SPACING.lg;
  return {
    padding: `${mobileVal}px`,
  };
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Darken a color by a percentage
 * @param {string} color - Hex color string
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export const darkenColor = (color, percent = 10) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

/**
 * Add opacity to a color
 * @param {string} color - Hex color string
 * @param {number} opacity - Opacity percentage (0-100)
 * @returns {string} Color with opacity
 */
export const colorWithOpacity = (color, opacity = 50) => {
  const alpha = Math.round((opacity / 100) * 255).toString(16);
  return color + alpha;
};
