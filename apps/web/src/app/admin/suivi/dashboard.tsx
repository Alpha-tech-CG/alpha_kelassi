import Link from 'next/link'
import { PLAN_META, formatFcfa, normalizePlan } from '@alpha-kelassi/types'

/** Rendu du tableau de bord « Suivi de l'app » (données de admin_app_stats). */

export interface Stats {
  days: number
  from: string
  today: string
  generated_at: string
  series: { day: string; signups: number; active: number }[]
  students_total: number
  signups_period: number
  dau: number
  wau: number
  mau: number
  events_period: number
  platforms: Record<string, number>
  retention: { cohort_d1: number; back_d1: number; cohort_w2: number; back_w2: number }
  top_chapters: { id: string; title: string; subject: string | null; series: string | null; views: number; viewers: number }[]
  top_lessons: { title: string; chapter: string; views: number; viewers: number }[]
  events_by_name: Record<string, number>
  quizzes_completed: number
  funnel: {
    steps: { index: number; step: string; devices: number }[]
    submitted: number
    signed_up: number
    onboarded: number
    first_content: number
  }
  payments: {
    by_status: Record<string, number>
    revenue: number
    by_plan: { plan: string; payments: number; revenue: number }[]
    by_kind: Record<string, number>
    failure_reasons: { reason: string; n: number }[]
    by_network: { network: string; ok: number; ko: number }[]
  }
  conversions: {
    new_paying_period: number
    paying_now: number
    paying_by_plan: Record<string, number>
    paywall_viewers: number
    paywall_then_paid: number
  }
}

/** Agrégats de admin_web_vitals() (migration 076), valeurs en millisecondes. */
export interface WebVitalsStats {
  days: number
  overall: Partial<Record<VitalMetric, { n: number; p75: number; poor_pct: number }>>
  pages: { path: string; n: number; lcp: number | null; inp: number | null; ttfb: number | null }[]
}

type VitalMetric = 'LCP' | 'INP' | 'TTFB'

/** Seuils officiels des Core Web Vitals : bon ≤ premier, mauvais > second. */
const VITALS: { key: VitalMetric; label: string; hint: string; good: number; poor: number }[] = [
  { key: 'LCP', label: 'Affichage du contenu', hint: 'LCP', good: 2500, poor: 4000 },
  { key: 'INP', label: 'Réactivité aux clics', hint: 'INP', good: 200, poor: 500 },
  { key: 'TTFB', label: 'Réponse du serveur', hint: 'TTFB', good: 800, poor: 1800 },
]

const vitalColor = (key: VitalMetric, v: number | null | undefined) => {
  const t = VITALS.find((x) => x.key === key)!
  if (v == null) return 'text-gray-400'
  return v <= t.good ? 'text-green-700' : v <= t.poor ? 'text-amber-600' : 'text-red-600'
}
const ms = (v: number | null | undefined) =>
  v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('fr', { maximumFractionDigits: 1 })} s` : `${Math.round(v)} ms`

function VitalsCard({ v }: { v: WebVitalsStats | null }) {
  return (
    <Card title={v ? `Vitesse ressentie sur le site (${v.days} jours)` : 'Vitesse ressentie sur le site'}>
      {!v ? <Empty>Mesures indisponibles.</Empty> : Object.keys(v.overall).length === 0 ? (
        <Empty>Aucune mesure reçue sur la période.</Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {VITALS.map((t) => {
              const o = v.overall[t.key]
              return (
                <div key={t.key} className="rounded-xl border border-gray-100 p-4">
                  <p className={`text-2xl font-black tabular-nums ${vitalColor(t.key, o?.p75)}`}>{ms(o?.p75)}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-0.5">{t.label} <span className="text-gray-400">({t.hint})</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {o ? `${o.n.toLocaleString('fr')} mesures · ${o.poor_pct.toLocaleString('fr')} % lentes` : 'pas de mesure'}
                  </p>
                </div>
              )
            })}
          </div>
          {v.pages.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="font-semibold py-1 pr-3">Pages les plus lentes à afficher</th>
                    <th className="font-semibold py-1 px-2 text-right">LCP</th>
                    <th className="font-semibold py-1 px-2 text-right">INP</th>
                    <th className="font-semibold py-1 px-2 text-right">TTFB</th>
                    <th className="font-semibold py-1 pl-2 text-right">Visites</th>
                  </tr>
                </thead>
                <tbody>
                  {v.pages.map((p) => (
                    <tr key={p.path} className="border-t border-gray-50">
                      <td className="py-1.5 pr-3 font-mono text-xs text-gray-700 break-all">{p.path}</td>
                      <td className={`py-1.5 px-2 text-right tabular-nums ${vitalColor('LCP', p.lcp)}`}>{ms(p.lcp)}</td>
                      <td className={`py-1.5 px-2 text-right tabular-nums ${vitalColor('INP', p.inp)}`}>{ms(p.inp)}</td>
                      <td className={`py-1.5 px-2 text-right tabular-nums ${vitalColor('TTFB', p.ttfb)}`}>{ms(p.ttfb)}</td>
                      <td className="py-1.5 pl-2 text-right tabular-nums text-gray-500">{p.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <p className="text-[11px] text-gray-400 mt-4">
        Élèves connectés, sur le site web uniquement · 75e centile (3 élèves sur 4 ont fait mieux) · vert = bon, orange = à améliorer, rouge = lent.
      </p>
    </Card>
  )
}

const STEP_LABEL: Record<string, string> = {
  prenom: 'Prénom', nom: 'Nom', naissance: 'Date de naissance', classe: 'Classe',
  ecole: 'École', ville: 'Ville', objectif: 'Objectif', compte: 'E-mail et mot de passe',
}
const EVENT_LABEL: Record<string, string> = {
  app_open: 'Ouvertures d’app', register_step: 'Écrans d’inscription vus', register_submitted: 'Inscriptions envoyées',
  register_completed: 'Comptes confirmés', onboarding_completed: 'Parcours choisis', chapter_opened: 'Chapitres ouverts',
  lesson_opened: 'Leçons ouvertes', quiz_completed: 'QCM terminés', paywall_viewed: 'Visites de l’écran Abonnement',
  web_vital: 'Mesures de vitesse (site)',
}
const KIND_LABEL: Record<string, string> = {
  new: 'Nouveaux', upgrade: 'Montées de formule', renewal: 'Renouvellements', downgrade: 'Descentes', inconnu: 'Non précisé',
}
const PAY_STATUS_LABEL: Record<string, string> = {
  successful: 'Réussis', failed: 'Échoués', pending: 'En attente', cancelled: 'Annulés', expired: 'Expirés',
}

const pct = (n: number, d: number) => (d > 0 ? `${Math.round((100 * n) / d)} %` : '—')
const planLabel = (p: string) => PLAN_META[normalizePlan(p)]?.label ?? p
const dayLabel = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 ${className}`}>
      <h2 className="font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
      {hint ? <p className="text-[11px] text-gray-400 mt-1">{hint}</p> : null}
    </div>
  )
}

/** Histogramme en colonnes, sans bibliothèque : rendu serveur, lisible en mobile. */
function Columns({ series, field, color, label }: {
  series: Stats['series']; field: 'signups' | 'active'; color: string; label: string
}) {
  const max = Math.max(1, ...series.map((s) => s[field]))
  const total = series.reduce((s, x) => s + x[field], 0)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">max {max} / jour</p>
      </div>
      <div className="flex items-end gap-[2px] h-28" role="img" aria-label={`${label} : ${total} sur la période`}>
        {series.map((s) => (
          <div key={s.day} className="flex-1 h-full flex items-end" title={`${dayLabel(s.day)} : ${s[field]}`}>
            <div className={`w-full rounded-t ${color}`} style={{ height: `${(100 * s[field]) / max}%`, minHeight: s[field] > 0 ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 mt-1">
        <span>{dayLabel(series[0]?.day ?? '')}</span>
        <span>{dayLabel(series[series.length - 1]?.day ?? '')}</span>
      </div>
    </div>
  )
}

function Bar({ label, value, max, right, color = 'bg-blue-600' }: { label: string; value: number; max: number; right: string; color?: string }) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-gray-700 truncate">{label}</span>
        <span className="text-gray-500 tabular-nums flex-shrink-0">{right}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${max > 0 ? (100 * value) / max : 0}%` }} />
      </div>
    </div>
  )
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-400 text-sm text-center py-6">{children}</p>
)

export function Dashboard({ s, vitals }: { s: Stats; vitals: WebVitalsStats | null }) {
  const r = s.retention
  const f = s.funnel
  const p = s.payments
  const c = s.conversions
  const firstStep = f.steps.find((x) => x.index === 0)?.devices ?? 0
  const funnelMax = Math.max(firstStep, f.submitted, f.signed_up, 1)
  const paid = p.by_status['successful'] ?? 0
  const failed = (p.by_status['failed'] ?? 0) + (p.by_status['cancelled'] ?? 0) + (p.by_status['expired'] ?? 0)
  const topChapterMax = Math.max(1, ...s.top_chapters.map((x) => x.views))
  const topLessonMax = Math.max(1, ...s.top_lessons.map((x) => x.views))
  const eventsSorted = Object.entries(s.events_by_name).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      {/* ── Usage ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Kpi label="Élèves inscrits" value={s.students_total.toLocaleString('fr')} hint={`+${s.signups_period} sur ${s.days} jours`} />
        <Kpi label="Actifs aujourd’hui" value={s.dau.toLocaleString('fr')} hint="heure du Congo" />
        <Kpi label="Actifs sur 7 jours" value={s.wau.toLocaleString('fr')} hint={`${pct(s.wau, s.students_total)} des élèves`} />
        <Kpi label={`Actifs sur ${s.days} jours`} value={s.mau.toLocaleString('fr')} hint={`${pct(s.mau, s.students_total)} des élèves`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inscriptions et activité par jour">
          <div className="space-y-6">
            <Columns series={s.series} field="signups" color="bg-blue-500" label={`Inscriptions (${s.signups_period})`} />
            <Columns series={s.series} field="active" color="bg-blue-600" label="Élèves actifs" />
          </div>
          <p className="text-[11px] text-gray-400 mt-4">
            Actif = au moins un événement d’app, une leçon validée ou un QCM terminé ce jour-là.
          </p>
        </Card>

        <Card title="Rétention des nouveaux inscrits">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Kpi label="Revenus le lendemain (J+1)" value={pct(r.back_d1, r.cohort_d1)} hint={`${r.back_d1} sur ${r.cohort_d1} inscrits`} />
            <Kpi label="Revenus la 2e semaine" value={pct(r.back_w2, r.cohort_w2)} hint={`${r.back_w2} sur ${r.cohort_w2} inscrits (J+7 à J+13)`} />
          </div>
          <p className="text-xs text-gray-500">
            Calculé sur les élèves inscrits pendant la période et assez anciens pour être mesurés.
          </p>
          <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-2">Plateformes (appareils ou comptes distincts)</h3>
          {Object.keys(s.platforms).length === 0 ? (
            <Empty>Aucun événement reçu pour l’instant.</Empty>
          ) : (
            <div className="space-y-2">
              {Object.entries(s.platforms).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                <Bar key={k} label={k === 'web' ? 'Site web' : k === 'ios' ? 'iPhone' : 'Android'} value={v}
                  max={Math.max(...Object.values(s.platforms))} right={`${v}`} color="bg-sky-500" />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Entonnoir ─────────────────────────────────────────── */}
      <Card title="Entonnoir d’inscription (application mobile)">
        {f.steps.length === 0 && f.signed_up === 0 ? (
          <Empty>Pas encore de données : les étapes sont envoyées à partir de la version 1.0.12 de l’app.</Empty>
        ) : (
          <div className="space-y-2.5">
            {f.steps.map((st) => (
              <Bar key={`${st.index}-${st.step}`}
                label={`${st.index + 1}. ${STEP_LABEL[st.step] ?? st.step}`}
                value={st.devices} max={funnelMax}
                right={`${st.devices} · ${pct(st.devices, firstStep)}`} color="bg-blue-500" />
            ))}
            <Bar label="Inscription envoyée" value={f.submitted} max={funnelMax} right={`${f.submitted} · ${pct(f.submitted, firstStep)}`} color="bg-blue-700" />
            <div className="border-t border-gray-100 my-3" />
            <Bar label="Comptes créés (période)" value={f.signed_up} max={funnelMax} right={`${f.signed_up}`} />
            <Bar label="Parcours choisi (onboarding terminé)" value={f.onboarded} max={funnelMax} right={`${f.onboarded} · ${pct(f.onboarded, f.signed_up)}`} />
            <Bar label="Premier contenu ouvert" value={f.first_content} max={funnelMax} right={`${f.first_content} · ${pct(f.first_content, f.signed_up)}`} />
            <p className="text-[11px] text-gray-400 pt-2">
              Étapes comptées par appareil (identifiant d’installation anonyme). La chute entre deux étapes = abandons à cet écran.
              Les comptes créés incluent les inscriptions faites sur le site.
            </p>
          </div>
        )}
      </Card>

      {/* ── Contenus ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Chapitres les plus ouverts">
          {s.top_chapters.length === 0 ? <Empty>Aucune ouverture de chapitre enregistrée.</Empty> : (
            <div className="space-y-3">
              {s.top_chapters.map((ch) => (
                <Bar key={ch.id}
                  label={`${ch.title.trim()}${ch.subject ? ` — ${ch.subject}` : ''}${ch.series ? ` (${ch.series})` : ''}`}
                  value={ch.views} max={topChapterMax} right={`${ch.views} vues · ${ch.viewers} élèves`} />
              ))}
            </div>
          )}
        </Card>
        <Card title="Leçons les plus ouvertes">
          {s.top_lessons.length === 0 ? <Empty>Aucune ouverture de leçon enregistrée.</Empty> : (
            <div className="space-y-3">
              {s.top_lessons.map((l, i) => (
                <Bar key={i} label={`${l.title.trim()}${l.chapter && l.chapter !== l.title ? ` — ${l.chapter}` : ''}`}
                  value={l.views} max={topLessonMax} right={`${l.views} vues · ${l.viewers} élèves`} color="bg-teal-500" />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4">QCM terminés sur la période : <strong>{s.quizzes_completed}</strong></p>
        </Card>
      </div>

      {/* ── Abonnements et paiements ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Kpi label="Abonnés payants actuels" value={c.paying_now.toLocaleString('fr')} hint={`${pct(c.paying_now, s.students_total)} des élèves`} />
        <Kpi label="Nouveaux payants" value={c.new_paying_period.toLocaleString('fr')} hint={`1er paiement sur ${s.days} jours`} />
        <Kpi label="Encaissé (FeexPay)" value={formatFcfa(p.revenue)} hint={`${paid} paiements réussis`} />
        <Kpi label="Paiements réussis" value={pct(paid, paid + failed)} hint={`${failed} échoués, annulés ou expirés`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Conversion gratuit → payant">
          <div className="space-y-2.5">
            <Bar label="Élèves ayant ouvert l’écran Abonnement" value={c.paywall_viewers} max={Math.max(1, c.paywall_viewers)} right={`${c.paywall_viewers}`} color="bg-amber-500" />
            <Bar label="… puis ayant payé" value={c.paywall_then_paid} max={Math.max(1, c.paywall_viewers)} right={`${c.paywall_then_paid} · ${pct(c.paywall_then_paid, c.paywall_viewers)}`} color="bg-amber-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-2">Abonnés actuels par formule</h3>
          {Object.keys(c.paying_by_plan).length === 0 ? <Empty>Aucun abonné payant.</Empty> : (
            <ul className="text-sm space-y-1">
              {Object.entries(c.paying_by_plan).map(([plan, n]) => (
                <li key={plan} className="flex justify-between"><span>{planLabel(plan)}</span><span className="tabular-nums font-semibold">{n}</span></li>
              ))}
            </ul>
          )}
          <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-2">Paiements réussis par type</h3>
          {Object.keys(p.by_kind).length === 0 ? <Empty>Aucun paiement réussi sur la période.</Empty> : (
            <ul className="text-sm space-y-1">
              {Object.entries(p.by_kind).map(([k, n]) => (
                <li key={k} className="flex justify-between"><span>{KIND_LABEL[k] ?? k}</span><span className="tabular-nums font-semibold">{n}</span></li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Paiements FeexPay">
          {Object.keys(p.by_status).length === 0 ? <Empty>Aucune transaction sur la période.</Empty> : (
            <>
              <ul className="text-sm space-y-1 mb-5">
                {Object.entries(p.by_status).map(([k, n]) => (
                  <li key={k} className="flex justify-between"><span>{PAY_STATUS_LABEL[k] ?? k}</span><span className="tabular-nums font-semibold">{n}</span></li>
                ))}
              </ul>
              {p.by_plan.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Encaissé par formule</h3>
                  <ul className="text-sm space-y-1 mb-5">
                    {p.by_plan.map((x) => (
                      <li key={x.plan} className="flex justify-between"><span>{planLabel(x.plan)} · {x.payments}</span><span className="tabular-nums font-semibold">{formatFcfa(x.revenue)}</span></li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Par réseau Mobile Money</h3>
              <ul className="text-sm space-y-1 mb-5">
                {p.by_network.map((x) => (
                  <li key={x.network} className="flex justify-between"><span>{x.network}</span><span className="tabular-nums">{x.ok} ✓ · {x.ko} ✗</span></li>
                ))}
              </ul>
              {p.failure_reasons.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Motifs d’échec</h3>
                  <ul className="text-sm space-y-1">
                    {p.failure_reasons.map((x) => (
                      <li key={x.reason} className="flex justify-between gap-3"><span className="truncate">{x.reason}</span><span className="tabular-nums font-semibold">{x.n}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <p className="text-xs text-gray-500 mt-4">
            Détail des transactions : <Link href="/admin/subscriptions" className="text-blue-700 font-semibold hover:underline">Abonnements</Link>.
          </p>
        </Card>
      </div>

      <VitalsCard v={vitals} />

      <Card title={`Événements reçus (${s.events_period.toLocaleString('fr')})`}>
        {eventsSorted.length === 0 ? <Empty>Aucun événement reçu sur la période.</Empty> : (
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {eventsSorted.map(([k, n]) => (
              <li key={k} className="flex justify-between"><span className="text-gray-700">{EVENT_LABEL[k] ?? k}</span><span className="tabular-nums font-semibold">{n.toLocaleString('fr')}</span></li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-gray-400 mt-4">
          Mis à jour le {new Date(s.generated_at).toLocaleString('fr-FR', { timeZone: 'Africa/Brazzaville' })} · période du {dayLabel(s.from)} au {dayLabel(s.today)}
        </p>
      </Card>
    </div>
  )
}
