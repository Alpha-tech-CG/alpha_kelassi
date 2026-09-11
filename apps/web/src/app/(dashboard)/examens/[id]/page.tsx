import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ExamenViewer } from './examen-viewer'
import { LockedFeature } from '@/components/subscription/locked-feature'
import { getEntitlements } from '@/lib/subscription/server'
import { supabaseAdmin } from '@/lib/admin-guard'
import { DocumentReaderClient } from '@/components/document-reader-client'

const LEVEL_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  bepc:  { label: 'BEPC',  bg: 'bg-blue-100',   color: 'text-blue-700' },
  bac_a: { label: 'BAC A', bg: 'bg-amber-100',  color: 'text-amber-700' },
  bac_c: { label: 'BAC C', bg: 'bg-violet-100', color: 'text-violet-700' },
  bac_d: { label: 'BAC D', bg: 'bg-emerald-100',color: 'text-emerald-700' },
}

export default async function ExamenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('*, subjects(id, name, level)')
    .eq('id', id)
    .eq('type', 'examen')
    .maybeSingle()

  // En Gratuit, une annale par matière est ouverte ; la base masque les autres.
  if (!doc) {
    const { data: exists } = await supabaseAdmin.from('documents').select('id').eq('id', id).eq('type', 'examen').maybeSingle()
    if (!exists) notFound()
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <LockedFeature feature="full_annals" backHref="/examens" backLabel="← Retour aux annales" />
      </div>
    )
  }

  const ent = await getEntitlements(user.id)
  if (doc.is_premium && !ent.can('full_annals')) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <LockedFeature feature="full_annals" backHref="/examens" backLabel="← Retour aux annales" />
      </div>
    )
  }

  const bucket = doc.is_premium ? 'pdfs-premium' : 'pdfs-public'
  const enonceFile = doc.pdf_url?.split('/').pop() ?? ''
  const corrigeFile = doc.corrige_url ? doc.corrige_url.split('/').pop() ?? '' : null

  // URLs signées 15 min
  const [{ data: enonceSign }, corrigeSignResult] = await Promise.all([
    supabase.storage.from(bucket).createSignedUrl(enonceFile, 900),
    corrigeFile
      ? supabase.storage.from(bucket).createSignedUrl(corrigeFile, 900)
      : Promise.resolve(null),
  ])

  // Exercices indexés par le RAG
  const { data: exercises } = await supabase
    .from('document_chunks')
    .select('id, content, chunk_index, page_number, metadata')
    .eq('document_id', id)
    .filter('metadata->>is_exercise', 'eq', 'true')
    .order('chunk_index')
    .limit(30)

  // Chunks de contexte (non-exercices) pour détecter les chapitres et parties
  const { data: contextChunks } = await supabase
    .from('document_chunks')
    .select('chunk_index, content')
    .eq('document_id', id)
    .neq('metadata->>is_exercise', 'true')
    .order('chunk_index')
    .limit(60)

  const enonceUrl = enonceSign?.signedUrl ?? null
  const corrigeUrl = (corrigeSignResult as { data?: { signedUrl: string } } | null)?.data?.signedUrl ?? null
  const lvl = LEVEL_CONFIG[doc.level] ?? { label: doc.level, bg: 'bg-gray-100', color: 'text-gray-600' }
  const subjectName = (doc.subjects as { name: string } | null)?.name
  const hasCorrige = !!doc.corrige_url

  // Vérifie si le fichier est un PDF (sinon : DOCX ou TXT → afficher text_content)
  const isPdf = doc.pdf_url?.toLowerCase().endsWith('.pdf') ?? false
  const textContent = (doc as Record<string, unknown>).text_content as string | null

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/examens" className="hover:text-gray-600 transition-colors">Examens</Link>
        <span>›</span>
        {doc.level && (
          <>
            <Link href={`/examens?level=${doc.level}`} className="hover:text-violet-600 transition-colors">
              {lvl.label}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="text-gray-700 truncate max-w-xs">{doc.title}</span>
      </nav>

      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lvl.bg} ${lvl.color}`}>
              {lvl.label}
            </span>
            {doc.year && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                📅 {doc.year}
              </span>
            )}
            {doc.session && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                doc.session === 'rattrapage'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {doc.session === 'rattrapage' ? '🔄' : '✅'} Session {doc.session}
              </span>
            )}
            {subjectName && (
              <span className="text-xs text-gray-500">{subjectName}</span>
            )}
            {/* Badge corrigé */}
            {hasCorrige && !doc.is_premium && (
              <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-100">
                ✅ Corrigé disponible
              </span>
            )}
            {hasCorrige && doc.is_premium && (
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
                ⭐ Corrigé inclus pour les abonnés
              </span>
            )}
            {!hasCorrige && (
              <span className="text-xs bg-gray-50 text-gray-400 px-2.5 py-1 rounded-full border border-gray-100">
                Corrigé non disponible
              </span>
            )}
          </div>
        </div>

        {/* CTA Kelassi */}
        <Link
          href={`/tuteur?document=${doc.id}`}
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          🤖 Demander à Kelassi
        </Link>
      </div>

      {/* Visionneuse avec gate freemium */}
      <div>
        {isPdf && enonceUrl ? (
          /* Fichier PDF → visionneuse PDF avec exercices */
          <ExamenViewer
            docId={doc.id}
            title={doc.title}
            level={doc.level}
            year={doc.year ?? null}
            enonceUrl={enonceUrl}
            corrigeUrl={corrigeUrl}
            corrigeIsPremium={!!doc.is_premium}
            exercises={exercises ?? []}
            contextChunks={contextChunks ?? []}
          />
        ) : textContent ? (
          /* Fichier DOCX / TXT → afficher le texte extrait comme pour les cours */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <DocumentReaderClient text={textContent} />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-400">
            <p className="text-2xl mb-2">⏳</p>
            <p className="font-medium text-gray-600">Contenu en cours de traitement</p>
            <p className="text-sm mt-1">Reviens dans quelques instants.</p>
          </div>
        )}
      </div>
    </div>
  )
}
