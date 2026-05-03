import type { Config } from 'tailwindcss'

/** Gold scale and surfaces; consumed by Tailwind v4 when using classic config discovery. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#f9f6ea',
          100: '#f0e8cc',
          200: '#e0cf94',
          300: '#d7bc4c',
          400: '#c5a021',
          500: '#d4af37',
          600: '#b8922e',
          700: '#8a6c22',
          800: '#5c4817',
          900: '#3d300f',
          950: '#1f1808',
        },
        surface: {
          DEFAULT: '#141414',
          deep: '#0a0a0a',
          muted: '#1a1a1a',
          ink: '#111111',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        readable: '72ch',
      },
    },
  },
  plugins: [],
} satisfies Config
