export const theme = {
  colors: {
    // Dark theme palette
    bg: "#0e0f0f",
    bgElevated: "#151718",
    bgCard: "#1c1e1f",
    bgCardHover: "#222526",
    textPrimary: "#e8e4dc",
    textSecondary: "#9a9590",
    textMuted: "#5c5854",
    accent: "#c97d3a",
    accentLight: "#e09b5a",
    accentDim: "#7a4d22",
    spring: "#5a7a4a",
    summer: "#c97d3a",
    fall: "#8b4a2a",
    winter: "#3a5a7a",
    success: "#4a7a5a",
    warning: "#c9a03a",
    danger: "#7a3a3a",
    border: "#2a2c2e",
    borderLight: "#3a3c3e",
  },

  fonts: {
    display: '"Georgia", "Times New Roman", serif',
    body: '"Inter", Helvetica Neue, sans-serif',
    mono: '"JetBrains Mono", "Courier New", monospace',
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    round: "9999px",
  },

  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },
};

export const SYMBOLS = {
  earth: "♁",
  earthAlt: "⊕",
  sun: "☉︎",
  moon: "☽︎",
  spring: "♈︎",
  summer: "♋︎",
  fall: "♎︎",
  winter: "♑︎",
  star: "✦︎",
};

export const SEASON_SYMBOLS = {
  spring: "♈︎",
  summer: "☉︎",
  fall: "♎︎",
  winter: "♑︎",
};

// Breakpoints for responsive design
export const bp = {
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

// Media query helpers
export const mq = {
  sm: `@media (max-width: ${bp.sm})`,
  md: `@media (max-width: ${bp.md})`,
  lg: `@media (max-width: ${bp.lg})`,
  smUp: `@media (min-width: ${bp.sm})`,
  mdUp: `@media (min-width: ${bp.md})`,
  lgUp: `@media (min-width: ${bp.lg})`,
};
