import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { headers } from 'next/headers'
import { WebVitals } from '@/components/web-vitals'
import { AppTracker } from '@/components/app-tracker'
import './globals.css'
import './callouts.css'
// Animations et micro-interactions de la charte (boutons, cartes, défilés).
import './landing.css'

// Police unique du site (charte Cognix), exposée en variable pour Tailwind.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://alpha-kelassi-web.vercel.app'),
  title: {
    default: 'Cognix — Révisions CEPE, BEPC & BAC au Congo',
    template: '%s | Cognix',
  },
  description: 'Cours résumés, examens d\'État officiels avec corrigés et tuteur IA pour les élèves congolais. Prépare ton CEPE, ton BEPC et ton BAC avec Cognix.',
  keywords: ['BEPC Congo', 'BAC Congo Brazzaville', 'cours révision', 'examens état corrigés', 'tuteur IA', 'révision scolaire Congo'],
  authors: [{ name: 'Cognix' }],
  creator: 'Cognix',
  openGraph: {
    title: 'Cognix — Révisions CEPE, BEPC & BAC au Congo',
    description: 'L\'app de révision IA pour les élèves congolais',
    locale: 'fr_CG',
    type: 'website',
    siteName: 'Cognix',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cognix — Alpha Kelassi' }],
  },
  twitter: {
    card: 'summary',
    images: ['/og.png'],
    title: 'Cognix — Révisions CEPE, BEPC & BAC au Congo',
    description: 'Cours, examens officiels et tuteur IA pour les élèves congolais',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://kelassi.app',
  },
}

export const viewport: Viewport = {
  themeColor: '#1E74E8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nonce de la CSP, posé par le middleware. Lire les en-têtes rend chaque page
  // dynamique : c'est voulu, une page mise en cache servirait un nonce périmé.
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html lang="fr" className={montserrat.variable} style={{ colorScheme: 'light' }}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={montserrat.className}>
        <WebVitals />
        <AppTracker />
        {children}
        {/* Le navigateur masque l'attribut nonce une fois la page chargée : sans
            suppressHydrationWarning, React signale un faux décalage. */}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}`,
        }} />
      </body>
    </html>
  )
}
