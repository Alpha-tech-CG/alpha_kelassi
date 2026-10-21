import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Titres de la page d'accueil (variable posée par next/font dans app/page.tsx).
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Mots d'accent en italique dans les titres de la page d'accueil.
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Palette Cognix de la page d'accueil.
        primary: '#101B4D',
        secondary: '#1E3A8A',
        accent: '#FFB703',
        // Page d'accueil : encre, papier chaud et sable.
        ink: '#0E1530',
        paper: '#F7F5F0',
        sand: '#EDE8DD',
        // Page d'accueil : couleurs du logo et de l'app Cognix (bleu / blanc).
        'cx-navy': '#0F1B2D',
        'cx-blue': '#1E74E8',
        'cx-sky': '#E7F0FD',
        'cx-paper': '#F4F8FE',
        'cx-cyan': '#35C0F0',
        background: '#F8FAFC',
        foreground: '#0F172A',
        card: '#FFFFFF',
        border: '#E2E8F0',
        muted: { DEFAULT: '#F1F5F9', foreground: '#64748B' },
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
