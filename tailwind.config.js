/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Swiss Editorial Palette
        editorial: {
          bg: '#FAFAF9',           // Warm Alabaster Off-white
          bgDark: '#0D0E11',       // Deep Charcoal/Obsidian
          surface: '#FFFFFF',      // Pure White card
          surfaceDark: '#14161B',  // Slate Charcoal surface
          border: '#E7E5E4',       // Hairline neutral-200 border
          borderDark: '#23262F',   // Hairline dark border
          ink: '#121316',          // Confident heavy type
          inkDark: '#F3F4F6',      // Confident white headline
          muted: '#6B7280',        // Editorial secondary text
          mutedDark: '#9CA3AF',    // Dark mode secondary
          subtle: '#9CA3AF',
          accent: '#D83A20',       // Bold Swiss Signal Vermilion (singular accent)
          accentHover: '#B92B14',
          accentMuted: 'rgba(216, 58, 32, 0.08)',
          accentBorder: 'rgba(216, 58, 32, 0.25)',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        widestEditorial: '0.12em',
      },
      borderWidth: {
        hairline: '1px',
      },
    },
  },
  plugins: [],
}
