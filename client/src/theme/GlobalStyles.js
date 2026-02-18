import { createGlobalStyle } from 'styled-components'
const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; -webkit-font-smoothing: antialiased; }
  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6; min-height: 100vh;
    /* Prevent horizontal scroll on mobile */
    overflow-x: hidden;
  }
  h1, h2, h3, h4 { font-family: ${({ theme }) => theme.fonts.display}; line-height: 1.2; letter-spacing: -0.02em; }
  /* Responsive type scale */
  @media (max-width: 480px) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.375rem; }
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { color: ${({ theme }) => theme.colors.accentLight}; } }
  button {
    cursor: pointer; border: none; background: none;
    font-family: ${({ theme }) => theme.fonts.body};
    /* Minimum touch target */
    min-height: 44px;
    min-width: 44px;
  }
  input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.body};
    /* Prevent zoom on iOS */
    font-size: 16px;
  }
  img { max-width: 100%; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 3px; }
`
export default GlobalStyles
