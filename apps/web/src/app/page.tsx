import Link from 'next/link'

const FEATURES = [
  { icon: '📚', title: 'Cours résumés', desc: 'Tous les cours du BEPC et BAC par matière, clairs et structurés.' },
  { icon: '📝', title: 'Examens officiels', desc: 'Années 2010-2024 avec corrigés détaillés étape par étape.' },
  { icon: '🤖', title: 'Tuteur IA Kelassi', desc: 'Pose une question, Kelassi t\'explique avec la méthode Feynman.' },
  { icon: '📴', title: 'Mode hors-ligne', desc: 'Télécharge tes cours. Révise sans connexion internet.' },
]

const LEVELS = [
  { label: 'BEPC', color: 'bg-blue-100 text-blue-800', desc: '3ème' },
  { label: 'BAC C', color: 'bg-purple-100 text-purple-800', desc: 'Maths-Sciences' },
  { label: 'BAC D', color: 'bg-green-100 text-green-800', desc: 'Sciences Naturelles' },
  { label: 'BAC A', color: 'bg-amber-100 text-amber-800', desc: 'Lettres' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-extrabold text-blue-600">Kelassi</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Connexion</Link>
          <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Commencer gratuit
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🇨🇬 Fait pour les élèves congolais
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Réussis ton <span className="text-blue-600">BEPC</span> et ton{' '}
          <span className="text-blue-600">BAC</span> avec l'IA
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Cours résumés · Examens d'État officiels avec corrigés · Tuteur IA disponible 24h/24
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/cours"
            className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-300"
          >
            Voir les cours
          </Link>
        </div>

        {/* Niveaux */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {LEVELS.map((l) => (
            <span key={l.label} className={`px-3 py-1 rounded-full text-sm font-medium ${l.color}`}>
              {l.label} · {l.desc}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Tout ce qu'il te faut pour réussir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-gray-500 mb-8">10 questions IA gratuites par jour. Pas de carte requise.</p>
        <Link
          href="/register"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700"
        >
          Créer mon compte gratuit
        </Link>
      </section>

      {/* App mobile */}
      <section className="bg-blue-600 py-16 text-center px-6">
        <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Application mobile</p>
        <h2 className="text-3xl font-bold text-white mb-3">Révise même sans connexion</h2>
        <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm">
          Télécharge tes cours en avance. Révise dans le bus, sans WiFi. Tes flashcards se synchronisent quand tu te reconnectes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900"
          >
            <span className="text-2xl">🍎</span>
            <div className="text-left">
              <p className="text-xs text-gray-400">Disponible sur</p>
              <p className="text-sm font-semibold">App Store</p>
            </div>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <p className="text-xs text-gray-400">Disponible sur</p>
              <p className="text-sm font-semibold">Google Play</p>
            </div>
          </a>
        </div>
      </section>

      {/* Témoignage beta */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">Programme Beta — Brazzaville & Pointe-Noire</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { quote: 'Kelassi m\'a aidé à comprendre les intégrales en 20 minutes.', name: 'Élève BAC C · Lycée Savorgnan de Brazza' },
            { quote: 'J\'adore les flashcards. Je révise dans le bus maintenant !', name: 'Élève BEPC · Brazzaville' },
            { quote: 'Le tuteur IA explique mieux que certains profs, franchement.', name: 'Élève BAC D · Pointe-Noire' },
          ].map((t) => (
            <div key={t.name} className="bg-white border rounded-2xl p-5 text-left">
              <p className="text-gray-600 text-sm italic mb-3">"{t.quote}"</p>
              <p className="text-xs text-gray-400">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-gray-500 mb-8">10 questions IA gratuites par jour. Pas de carte requise.</p>
        <Link
          href="/register"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700"
        >
          Créer mon compte gratuit
        </Link>
      </section>

      <footer className="border-t py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-blue-600 text-base">Kelassi</span>
          <div className="flex gap-6">
            <Link href="/cgu" className="hover:text-gray-600">CGU</Link>
            <Link href="/confidentialite" className="hover:text-gray-600">Confidentialité</Link>
            <a href="mailto:support@kelassi.app" className="hover:text-gray-600">Contact</a>
          </div>
          <span>© 2026 Alpha-Tech · Congo Brazzaville</span>
        </div>
      </footer>
    </main>
  )
}
