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
        // Montserrat partout (variable posée par next/font dans app/layout.tsx).
        sans: ['var(--font-display)', 'Montserrat', 'system-ui', 'sans-serif'],
        // Titres de la page d'accueil (variable posée par next/font dans app/page.tsx).
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Mots d'accent en italique dans les titres de la page d'accueil.
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Charte Cognix (bleu / blanc, logo) appliquée à tout le site : les
           gris et les bleus de Tailwind sont recalés sur le navy et le bleu
           Cognix, si bien que les pages existantes en héritent. */
        gray: {
          50: '#F6F8FC',
          100: '#EEF2F8',
          200: '#DFE5EF',
          300: '#C6CFDD',
          400: '#8C98AD',
          500: '#66738A',
          600: '#4B576D',
          700: '#364156',
          800: '#232D40',
          900: '#0F1B2D',
          950: '#0A111F',
        },
        blue: {
          50: '#F1F6FE',
          100: '#E3EDFC',
          200: '#C5DBFA',
          300: '#97BEF5',
          400: '#5E9BEF',
          500: '#3584EB',
          600: '#1E74E8',
          700: '#155DC4',
          800: '#134C9C',
          900: '#123F7D',
          950: '#0D2852',
        },
        primary: '#0F1B2D',
        secondary: '#1E74E8',
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
          50: '#F1F6FE',
          100: '#E3EDFC',
          200: '#C5DBFA',
          300: '#97BEF5',
          400: '#5E9BEF',
          500: '#3584EB',
          600: '#1E74E8',
          700: '#155DC4',
          800: '#134C9C',
          900: '#123F7D',
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
