import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/subscription/server'
import { allowedExamModes, EXAM_MODE_LABELS, STUDY_LEVELS, LEVEL_META, isStudyLevel, type ExamMode } from '@alpha-kelassi/types'
import { RAYONS, isRayon, rayonMeta, examName, type PrepaRayon } from '@/lib/prepa'
import { ExamensHistorique } from './examens-historique'

/**
 * Espace « Prépa » (remplace l'ancienne page « Examens d'État »).
 *
 * Trois étapes, portées par l'URL :
 *   /examens                         → choix du rayon (Bac test, blanc, rouge, anciens sujets, TD)
 *   /examens?rayon=bac_blanc         → choix de la matière
 *   /examens?rayon=bac_blanc&subject → épreuves (ou chapitres de TD) de la matière
 *
 * Même organisation que l'application mobile (`apps/mobile/src/app/prepa`).
 * Les épreuves sans question sont masquées (`question_total`, migration 059).
 */

interface SearchParams { rayon?: string; subject?: string; level?: string }
interface Subject { id: string; name: string; level: string }
interface Epreuve { id: string; title: string; year: number | null; time_limit_sec: number; is_premium: boolean; subject_id: string; question_total: number }
interface Sujet { id: string; title: string; year: number | null; session: string | null; is_premium: boolean; corrige_url: string | null; subject_id: string }
interface TdChapter { id: string; title: string; order_index: number; subject_id: string; count: number }

const ALL_MODES: ExamMode[] = ['entrainement', 'bac_test', 'bac_blanc', 'bac_rouge']
const card = 'flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-emerald-300 hover:shadow-md transition-all'

export default async function PrepaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/examens')

  const [{ data: profile }, ent] = await Promise.all([
    supabase.from('users').select('study_level_pref, track_type').eq('id', user.id).maybeSingle(),
    getEntitlements(user.id),
  ])
  const prof = profile as { study_level_pref?: string | null; track_type?: string | null } | null
  // `?level=` permet de consulter une autre classe (admins, élèves sans profil).
  const level = isStudyLevel(sp.level) ? sp.level : (prof?.study_level_pref ?? null)
  const track = isStudyLevel(sp.level) ? null : (prof?.track_type ?? null)
  const allowed = new Set<string>(allowedExamModes(ent.plan))
  const rayon: PrepaRayon | null = isRayon(sp.rayon) ? sp.rayon : null
  const lvlQuery = isStudyLevel(sp.level) ? `&level=${sp.level}` : ''

  /* ── Étape 1 : le rayon ────────────────────────────────────────────────── */
  if (!rayon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          {level && <span className="inline-block text-xs font-black text-white bg-red-600 rounded-full px-3 py-1 mb-2">{LEVEL_META[level as keyof typeof LEVEL_META]?.label ?? level}</span>}
          <h1 className="text-3xl font-black text-gray-900">Prépa</h1>
          <p className="text-gray-500 mt-1 text-sm">Choisis comment tu veux t&apos;entraîner pour le {examName(level)}, puis ta matière.</p>
        </div>

        {!level && <LevelPicker current={null} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {RAYONS.map((r) => {
            const m = rayonMeta(r, level)
            const locked = !!m.mode && !allowed.has(m.mode)
            const featured = r === 'bac_blanc'
            return (
              <Link key={r} href={`/examens?rayon=${r}${lvlQuery}`}
                className={`group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 ${featured ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-gray-100'}`}>
                <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${featured ? 'bg-white/20' : 'bg-emerald-50'}`}>{m.emoji}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-lg font-black ${featured ? 'text-white' : 'text-gray-900'}`}>{m.label}</span>
                  <span className={`block text-sm ${featured ? 'text-emerald-50' : 'text-gray-500'}`}>{m.desc}</span>
                </span>
                {locked
                  ? <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${featured ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>🔒 {m.plan === 'pro' ? 'Pro' : 'Starter'}</span>
                  : <span className={`text-2xl ${featured ? 'text-white' : 'text-emerald-600'}`}>›</span>}
              </Link>
            )
          })}
        </div>

        <ExamensHistorique />
      </div>
    )
  }

  const meta = rayonMeta(rayon, level)

  // Matières de la classe (et de la filière de l'élève).
  let sq = supabase.from('subjects').select('id, name, level').order('name')
  if (level) sq = sq.eq('level', level)
  if (track) sq = sq.eq('track_type', track)
  const { data: subs } = await sq
  const subjects = (subs ?? []) as Subject[]
  const ids = subjects.map((s) => s.id)

  let epreuves: Epreuve[] = []
  let sujets: Sujet[] = []
  let chapters: TdChapter[] = []
  if (ids.length > 0) {
    if (rayon === 'td') {
      const { data } = await supabase.from('exercises')
        .select('id, chapters!inner(id, title, order_index, subject_id)')
        .in('chapters.subject_id', ids).is('deleted_at', null)
      const map = new Map<string, TdChapter>()
      for (const row of (data ?? []) as unknown as { chapters: { id: string; title: string; order_index: number | null; subject_id: string } | null }[]) {
        const c = row.chapters
        if (!c) continue
        const cur = map.get(c.id) ?? { id: c.id, title: c.title, order_index: c.order_index ?? 0, subject_id: c.subject_id, count: 0 }
        cur.count += 1
        map.set(c.id, cur)
      }
      chapters = [...map.values()].sort((a, b) => a.order_index - b.order_index)
    } else {
      const [{ data: qz }, docs] = await Promise.all([
        supabase.from('quizzes')
          .select('id, title, year, time_limit_sec, is_premium, subject_id, question_total')
          .eq('is_exam', true).eq('exam_kind', rayon).is('deleted_at', null).in('subject_id', ids)
          .order('year', { ascending: false, nullsFirst: false }),
        rayon === 'ancien_bac'
          ? supabase.from('documents').select('id, title, year, session, is_premium, corrige_url, subject_id')
              .eq('type', 'examen').in('subject_id', ids).order('year', { ascending: false, nullsFirst: false })
          : Promise.resolve({ data: [] }),
      ])
      epreuves = ((qz ?? []) as unknown as Epreuve[]).filter((e) => (e.question_total ?? 0) > 0)
      sujets = (docs.data ?? []) as unknown as Sujet[]
    }
  }

  const counts = new Map<string, number>()
  const add = (sid: string, n = 1) => counts.set(sid, (counts.get(sid) ?? 0) + n)
  if (rayon === 'td') chapters.forEach((c) => add(c.subject_id, c.count))
  else { epreuves.forEach((e) => add(e.subject_id)); sujets.forEach((d) => add(d.subject_id)) }

  const subject = subjects.find((s) => s.id === sp.subject) ?? null
  const locked = !!meta.mode && !allowed.has(meta.mode)

  const breadcrumb = (
    <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
      <Link href={`/examens${lvlQuery ? `?${lvlQuery.slice(1)}` : ''}`} className="text-emerald-700 hover:underline font-medium">Prépa</Link>
      <span className="text-gray-300">›</span>
      {subject
        ? <Link href={`/examens?rayon=${rayon}${lvlQuery}`} className="text-emerald-700 hover:underline font-medium">{meta.label}</Link>
        : <span className="text-gray-700 font-semibold">{meta.label}</span>}
      {subject && <><span className="text-gray-300">›</span><span className="text-gray-700 font-semibold">{subject.name}</span></>}
    </nav>
  )

  /* ── Étape 2 : la matière ──────────────────────────────────────────────── */
  if (!subject) {
    const has = (id: string) => ((counts.get(id) ?? 0) > 0 ? 1 : 0)
    const ordered = [...subjects].sort((a, b) => has(b.id) - has(a.id) || a.name.localeCompare(b.name, 'fr'))
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {breadcrumb}
        <h1 className="text-2xl font-black text-gray-900">{meta.emoji} {meta.label} — choisis ta matière</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">{meta.desc}</p>
        {ordered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Aucune matière pour ta classe pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ordered.map((s) => {
              const n = counts.get(s.id) ?? 0
              return (
                <Link key={s.id} href={`/examens?rayon=${rayon}&subject=${s.id}${lvlQuery}`} className={`${card} ${n === 0 ? 'opacity-60' : ''}`}>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-gray-900 truncate">{s.name}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {n === 0 ? 'Bientôt disponible' : rayon === 'td' ? `${n} exercice${n > 1 ? 's' : ''}` : `${n} sujet${n > 1 ? 's' : ''}`}
                    </span>
                  </span>
                  <span className="text-emerald-600 text-xl">›</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  /* ── Étape 3 : TD de la matière ────────────────────────────────────────── */
  if (rayon === 'td') {
    const list = chapters.filter((c) => c.subject_id === subject.id)
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {breadcrumb}
        <h1 className="text-2xl font-black text-gray-900 mb-1">TD — {subject.name}</h1>
        <p className="text-gray-500 text-sm mb-6">Réponds d&apos;abord, puis ouvre le corrigé.</p>
        {list.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Pas encore d&apos;exercices dans cette matière. Reviens bientôt !</p>
        ) : (
          <div className="space-y-2">
            {list.map((c, i) => (
              <Link key={c.id} href={`/examens/td/${c.id}`} className={card}>
                <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-gray-900">{c.title}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{c.count} exercice{c.count > 1 ? 's' : ''} corrigé{c.count > 1 ? 's' : ''}</span>
                </span>
                <span className="text-emerald-600 text-xl">›</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Étape 3 : épreuves de la matière ──────────────────────────────────── */
  const list = epreuves.filter((e) => e.subject_id === subject.id)
  const pdfs = sujets.filter((d) => d.subject_id === subject.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {breadcrumb}
      <h1 className="text-2xl font-black text-gray-900 mb-1">{meta.emoji} {meta.label} — {subject.name}</h1>
      <p className="text-gray-500 text-sm mb-6">{meta.desc}</p>

      {locked && (
        <Link href="/billing" className="block bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-4 py-3 text-sm font-semibold mb-4">
          🔒 Le {meta.label} est inclus dans la formule {meta.plan === 'pro' ? 'Pro' : 'Starter'}. Voir les formules ›
        </Link>
      )}

      {list.length === 0 && pdfs.length === 0 && (
        <p className="text-center text-gray-400 py-16">Aucun sujet « {meta.label} » dans cette matière pour l&apos;instant. Reviens bientôt !</p>
      )}

      <div className="space-y-2">
        {list.map((ep) => {
          const info = `${ep.year ? `Session ${ep.year} · ` : ''}${Math.round(ep.time_limit_sec / 60)} min · ${ep.question_total} question${ep.question_total > 1 ? 's' : ''}`
          // Rayon à mode fixe : un seul bouton. Ancien sujet : un bouton par mode.
          if (meta.mode) {
            return (
              <Link key={ep.id} href={locked ? '/billing' : `/quiz/${ep.id}?mode=${meta.mode}`} className={card}>
                <span className="text-2xl">{meta.emoji}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-gray-900">{ep.title} {ep.is_premium ? '⭐' : ''}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{info}</span>
                </span>
                <span className="text-emerald-600 text-xl">{locked ? '🔒' : '›'}</span>
              </Link>
            )
          }
          return (
            <div key={ep.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-gray-900">{ep.title} {ep.is_premium ? '⭐' : ''}</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">{info}</p>
              <div className="flex flex-wrap gap-2">
                {ALL_MODES.map((m) => allowed.has(m) ? (
                  <Link key={m} href={`/quiz/${ep.id}?mode=${m}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100">{EXAM_MODE_LABELS[m]}</Link>
                ) : (
                  <Link key={m} href="/billing" className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-400">🔒 {EXAM_MODE_LABELS[m]}</Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {pdfs.length > 0 && (
        <>
          <h2 className="font-black text-gray-900 mt-8 mb-3">Sujets officiels (PDF)</h2>
          <div className="space-y-2">
            {pdfs.map((d) => (
              <Link key={d.id} href={`/examens/${d.id}`} className={card}>
                <span className="text-2xl">📄</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-gray-900">{d.title} {d.is_premium ? '⭐' : ''}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {[d.year, d.session].filter(Boolean).join(' · ') || 'Sujet'}{d.corrige_url ? ' · corrigé disponible' : ''}
                  </span>
                </span>
                <span className="text-emerald-600 text-xl">›</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** Choix de la classe quand le profil n'en indique pas. */
function LevelPicker({ current }: { current: string | null }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
      <p className="text-sm font-semibold text-gray-700 mb-2">Choisis ta classe</p>
      <div className="flex flex-wrap gap-2">
        {STUDY_LEVELS.map((l) => (
          <Link key={l} href={`/examens?level=${l}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${current === l ? 'bg-gray-900 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {LEVEL_META[l].label}
          </Link>
        ))}
      </div>
    </div>
  )
}
