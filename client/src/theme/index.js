export const SYMBOLS = {
  earth: "♁\uFE0E",
  earthAlt: "⊕\uFE0E",
  sun: "☉\uFE0E",
  moon: "☽\uFE0E",
  spring: "♈\uFE0E",
  summer: "♋\uFE0E",
  fall: "♎\uFE0E",
  winter: "♑\uFE0E",
  star: "✦\uFE0E",
};

export const SEASON_SYMBOLS = {
  spring: "♈\uFE0E",
  summer: "♋\uFE0E",
  fall: "♎\uFE0E",
  winter: "♑\uFE0E",
};

export const bp = {
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

// Shorthand media query helpers — use in styled-components like:
// ${mq.sm`color: red;`}
export const mq = {
  sm: (...args) => `@media (max-width: ${bp.sm}) { ${args} }`,
  md: (...args) => `@media (max-width: ${bp.md}) { ${args} }`,
  lg: (...args) => `@media (max-width: ${bp.lg}) { ${args} }`,
  smUp: (...args) => `@media (min-width: ${bp.sm}) { ${args} }`,
  mdUp: (...args) => `@media (min-width: ${bp.md}) { ${args} }`,
};

export const theme = {
  colors: {
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
    display: `'Georgia', 'Times New Roman', serif`,
    body: `'Inter', 'Helvetica Neue', sans-serif`,
    mono: `'JetBrains Mono', 'Courier New', monospace`,
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.375rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
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
  radius: { sm: "4px", md: "8px", lg: "16px", xl: "24px", round: "9999px" },
  transitions: { fast: "150ms ease", normal: "250ms ease", slow: "400ms ease" },
  bp,
};
export default theme;
