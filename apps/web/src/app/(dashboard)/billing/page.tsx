'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  AI_DAILY_LIMITS, EXAM_MODE_LABELS, PLAN_EXCLUSIONS, PLAN_FEATURE_LINES, PLAN_LEVELS, PLAN_META,
  SUBSCRIPTION_PLANS, TUTOR_CORRECTION_MONTHLY_LIMITS,
  allowedExamModes, annualSavings, computeSubscriptionChange, formatFcfa, isSubscriptionPlan,
  normalizePlan, planPrice, productKeyFor,
  type BillingInterval, type PaidPlan, type SubscriptionPlan,
} from '@alpha-kelassi/types'
import { QuotaMeter } from '@/components/subscription/quota-meter'
import { useBillingMe } from '@/lib/subscription/client'

const dateFr = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const STATUS_LABEL: Record<string, string> = {
  active: 'Active', pending: 'Programmée', expired: 'Expirée', canceled: 'Remplacée ou annulée',
  suspended: 'Suspendue', past_due: 'Impayée', trialing: 'Essai',
  successful: 'Réussi', failed: 'Échoué', cancelled: 'Annulé',
}

function BillingContent() {
  const params = useSearchParams()
  const { data: me, loading, reload } = useBillingMe()
  const [interval, setBillingInterval] = useState<BillingInterval>('month')
  const [selected, setSelected] = useState<PaidPlan | null>(null)
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>('MTN')
  const [phone, setPhone] = useState('')
  const [paying, setPaying] = useState(false)
  const [status, setStatus] = useState<{ tone: 'info' | 'ok' | 'error'; text: string } | null>(null)
  const payRef = useRef<HTMLDivElement>(null)

  // Lien direct depuis un écran verrouillé : /billing?plan=pro
  useEffect(() => {
    const p = params.get('plan')
    if (p && isSubscriptionPlan(p) && p !== 'free') setSelected(p)
  }, [params])

  const currentPlan: SubscriptionPlan = me?.plan ?? 'free'
  const currentSub = me?.current_subscription ?? null

  const preview = useMemo(() => {
    if (!selected) return null
    const current = currentSub
      ? { plan: normalizePlan(currentSub.plan), interval: currentSub.billing_interval, expiresAt: currentSub.expires_at ? new Date(currentSub.expires_at) : null }
      : null
    return computeSubscriptionChange(current, { plan: selected, interval })
  }, [selected, interval, currentSub])

  function choose(plan: PaidPlan) {
    setSelected(plan)
    setStatus(null)
    setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  async function pay() {
    if (!selected) return
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 8) { setStatus({ tone: 'error', text: 'Saisis ton numéro Mobile Money (9 chiffres).' }); return }

    setPaying(true)
    setStatus({ tone: 'info', text: 'Envoi de la demande de paiement…' })
    try {
      const res = await fetch('/api/billing/feexpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product: productKeyFor(selected, interval), phone: digits, network }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.data?.reference) {
        setStatus({
          tone: 'error',
          text: json?.error?.message ?? (res.status === 401 ? 'Ta session a expiré. Reconnecte-toi pour souscrire.' : 'Le paiement n’a pas pu être lancé. Réessaie.'),
        })
        return
      }

      const reference: string = json.data.reference
      setStatus({ tone: 'info', text: 'Confirme le paiement sur ton téléphone (code Mobile Money)…' })
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000))
        const s = await fetch(`/api/billing/feexpay/status?reference=${reference}`, { credentials: 'include' })
        const sj = await s.json().catch(() => null)
        const st: string | undefined = sj?.data?.status
        if (st && st !== 'pending') {
          setStatus({ tone: st === 'successful' ? 'ok' : 'error', text: sj.data.message })
          if (st === 'successful') { setSelected(null); setPhone(''); await reload() }
          return
        }
      }
      setStatus({ tone: 'info', text: 'Paiement toujours en attente. Si tu l’as validé, ta formule s’activera dans quelques minutes : tu peux quitter cette page.' })
    } catch {
      setStatus({ tone: 'error', text: 'Connexion interrompue. Si tu as validé sur ton téléphone, vérifie ta formule dans quelques minutes.' })
    } finally {
      setPaying(false)
    }
  }

  const ai = me?.usage.ai_questions
  const corrections = me?.usage.tutor_corrections

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Les formules Cognix</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Choisis la préparation qui te convient. Paiement par Mobile Money, sans prélèvement automatique.
        </p>
      </header>

      {/* ── Ma formule ── */}
      {!loading && me && (
        <section aria-labelledby="ma-formule" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 id="ma-formule" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ma formule</h2>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {me.plan_label}
                {currentSub?.billing_interval && <span className="text-base font-semibold text-gray-500"> · {currentSub.billing_interval === 'month' ? 'mensuelle' : 'annuelle'}</span>}
              </p>
              {me.is_admin && <p className="text-sm text-gray-500 mt-1">Compte administrateur : accès complet à toutes les fonctionnalités.</p>}
              {currentSub?.expires_at && (
                <p className={`text-sm mt-1 ${me.expiring_soon ? 'text-red-700 font-semibold' : 'text-gray-600'}`}>
                  Active jusqu’au {dateFr(currentSub.expires_at)}
                  {me.days_left !== null && ` (${me.days_left} jour${me.days_left > 1 ? 's' : ''} restant${me.days_left > 1 ? 's' : ''})`}.
                  {me.expiring_soon && ' Pense à la renouveler pour ne rien perdre.'}
                </p>
              )}
              {currentSub && !currentSub.expires_at && !me.is_admin && <p className="text-sm text-gray-600 mt-1">Sans date d’échéance.</p>}
              {me.scheduled.map((s) => (
                <p key={s.id} className="text-sm text-gray-600 mt-1">
                  Programmée : {PLAN_META[normalizePlan(s.plan)].label} à partir du {dateFr(s.started_at)}.
                </p>
              ))}
              {me.expiring_soon && currentSub && currentPlan !== 'free' && (
                <button
                  type="button"
                  onClick={() => { setBillingInterval(currentSub.billing_interval ?? 'month'); choose(currentPlan as PaidPlan) }}
                  className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700"
                >
                  Renouveler ma formule {me.plan_label}
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 md:w-[28rem]">
              {ai && <QuotaMeter label="Questions Cognix IA aujourd’hui" used={ai.used} limit={ai.limit === null ? null : ai.limit + ai.bonus} summary={ai.message.summary} detail={ai.message.detail} />}
              {corrections && <QuotaMeter label="Corrections par tuteur ce mois-ci" used={corrections.used} limit={corrections.limit === null ? null : corrections.limit + corrections.bonus} summary={corrections.message.summary} detail={corrections.message.detail} />}
            </div>
          </div>
        </section>
      )}

      {/* ── Offres ── */}
      <section aria-labelledby="offres">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 id="offres" className="text-xl font-black text-gray-900">Comparer les formules</h2>
          <div className="inline-flex rounded-xl bg-gray-100 p-1 self-start" role="group" aria-label="Période de facturation">
            {(['month', 'year'] as const).map((i) => (
              <button
                key={i}
                type="button"
                aria-pressed={interval === i}
                onClick={() => setBillingInterval(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${interval === i ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
              >
                {i === 'month' ? 'Paiement mensuel' : 'Paiement annuel — 2 mois offerts'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const meta = PLAN_META[plan]
            const isCurrent = plan === currentPlan
            const price = planPrice(plan, interval)
            const higher = PLAN_LEVELS[plan] > PLAN_LEVELS[currentPlan]
            const modes = allowedExamModes(plan).map((m) => EXAM_MODE_LABELS[m])
            return (
              <article
                key={plan}
                aria-labelledby={`plan-${plan}`}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-5 ${
                  isCurrent ? 'border-emerald-500' : plan === 'pro' ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-wrap gap-2 mb-2 min-h-[1.5rem]">
                  {meta.highlight && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">{meta.highlight}</span>}
                  {isCurrent && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Ta formule actuelle</span>}
                </div>
                <h3 id={`plan-${plan}`} className="text-xl font-black text-gray-900">{meta.label}</h3>
                <p className="text-sm text-gray-500 mb-3">{meta.tagline}</p>

                <p className="text-3xl font-black text-gray-900 whitespace-nowrap">
                  {formatFcfa(price)}
                  <span className="text-sm font-semibold text-gray-500"> {plan === 'free' ? '' : interval === 'month' ? '/ mois' : '/ an'}</span>
                </p>
                {plan !== 'free' && (
                  <p className="text-xs text-gray-600 mt-1 min-h-[1rem]">
                    {interval === 'year'
                      ? `Soit ${formatFcfa(Math.round(price / 12))} par mois — tu économises ${formatFcfa(annualSavings(plan))}.`
                      : `Ou ${formatFcfa(planPrice(plan, 'year'))} par an (économie de ${formatFcfa(annualSavings(plan))}).`}
                  </p>
                )}

                <dl className="grid grid-cols-1 gap-2 text-sm mt-4 p-3 rounded-xl bg-gray-50">
                  <div><dt className="text-xs text-gray-600">Cognix IA</dt><dd className="font-bold text-gray-900">{AI_DAILY_LIMITS[plan]} questions par jour</dd></div>
                  <div><dt className="text-xs text-gray-600">Corrections par tuteur</dt><dd className="font-bold text-gray-900">{TUTOR_CORRECTION_MONTHLY_LIMITS[plan] ? `${TUTOR_CORRECTION_MONTHLY_LIMITS[plan]} par mois` : 'Non incluses'}</dd></div>
                  <div><dt className="text-xs text-gray-600">Simulations</dt><dd className="font-bold text-gray-900">{modes.length ? modes.join(', ') : 'Aucune'}</dd></div>
                </dl>

                <ul className="mt-4 space-y-1.5 text-sm flex-1">
                  {PLAN_FEATURE_LINES[plan].map((f) => (
                    <li key={f} className="flex gap-2 text-gray-700"><span aria-hidden="true" className="text-emerald-600 font-bold">✓</span><span>{f}</span></li>
                  ))}
                  {PLAN_EXCLUSIONS[plan].map((f) => (
                    <li key={f} className="flex gap-2 text-gray-500"><span aria-hidden="true" className="font-bold">✕</span><span><span className="sr-only">Non inclus : </span>{f}</span></li>
                  ))}
                </ul>

                <div className="mt-5">
                  {plan === 'free' ? (
                    <p className="text-sm text-center text-gray-500">{isCurrent ? 'Formule gratuite en cours' : 'Accessible à tous, sans paiement'}</p>
                  ) : isCurrent && !me?.is_admin ? (
                    <button type="button" onClick={() => choose(plan)} className="w-full py-2.5 rounded-xl text-sm font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                      Renouveler {meta.label}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => choose(plan)}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold ${higher ? 'bg-gray-900 text-white hover:bg-gray-700' : 'border-2 border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                    >
                      {higher ? `Passer à ${meta.label}` : `Choisir ${meta.label} à l’échéance`}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Paiement ── */}
      {selected && (
        <section ref={payRef} aria-labelledby="paiement" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 max-w-2xl mx-auto scroll-mt-6">
          <h2 id="paiement" className="text-xl font-black text-gray-900">
            Payer la formule {PLAN_META[selected].label} {interval === 'month' ? 'mensuelle' : 'annuelle'}
          </h2>
          <p className="text-2xl font-black text-gray-900 mt-2">{formatFcfa(planPrice(selected, interval))}</p>

          {preview && (
            <p className="text-sm text-gray-700 mt-2">
              {preview.kind === 'new' && `Ta formule sera active dès le paiement confirmé, jusqu’au ${dateFr(preview.expiresAt.toISOString())}.`}
              {preview.kind === 'upgrade' && `Montée immédiate : ta nouvelle formule démarre dès le paiement confirmé.${preview.creditDays > 0 ? ` Les jours restants de ta formule actuelle sont convertis en ${preview.creditDays} jour${preview.creditDays > 1 ? 's' : ''} supplémentaire${preview.creditDays > 1 ? 's' : ''}` : ''} — jusqu’au ${dateFr(preview.expiresAt.toISOString())}.`}
              {preview.kind === 'renewal' && `Renouvellement : la nouvelle période commencera à la fin de celle en cours, le ${dateFr(preview.startsAt.toISOString())}.`}
              {preview.kind === 'downgrade' && `Tu gardes ta formule actuelle jusqu’au ${dateFr(preview.startsAt.toISOString())} ; ${PLAN_META[selected].label} prendra le relais ensuite.`}
            </p>
          )}

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-gray-700 mb-2">Opérateur Mobile Money</legend>
            <div className="flex gap-2">
              {(['MTN', 'AIRTEL'] as const).map((n) => (
                <label key={n} className={`flex-1 cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold ${network === n ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                  <input type="radio" name="network" value={n} checked={network === n} onChange={() => setNetwork(n)} className="sr-only" />
                  {n === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="momo-phone" className="block text-sm font-semibold text-gray-700 mt-4 mb-1.5">Numéro Mobile Money</label>
          <div className="flex">
            <span className="px-4 py-3 bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl text-gray-600 text-sm font-medium">+242</span>
            <input
              id="momo-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="06 XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={paying}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div role="status" aria-live="polite" className="min-h-[1.5rem] mt-4">
            {status && (
              <p className={`rounded-xl p-3 text-sm ${status.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : status.tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}>
                {status.text}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 disabled:opacity-50"
            >
              {paying ? 'Paiement en cours…' : `Payer ${formatFcfa(planPrice(selected, interval))} par Mobile Money`}
            </button>
            <button type="button" onClick={() => { setSelected(null); setStatus(null) }} disabled={paying} className="py-3 px-4 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-50">
              Annuler
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Paiement sécurisé FeexPay. Ta formule n’est activée qu’après confirmation du paiement par l’opérateur. Aucun renouvellement automatique.
          </p>
        </section>
      )}

      {/* ── Historique ── */}
      {me && (me.transactions.length > 0 || me.history.length > 0) && (
        <section aria-labelledby="historique" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <h2 id="historique" className="text-lg font-black text-gray-900 mb-3">Historique</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Paiements et abonnements</caption>
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                  <th scope="col" className="py-2 pr-4">Date</th>
                  <th scope="col" className="py-2 pr-4">Formule</th>
                  <th scope="col" className="py-2 pr-4">Montant</th>
                  <th scope="col" className="py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {me.transactions.map((t) => (
                  <tr key={t.reference} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 whitespace-nowrap">{dateFr(t.created_at)}</td>
                    <td className="py-2 pr-4">{PLAN_META[normalizePlan(t.plan)].label} {t.billing_interval === 'month' ? 'mensuelle' : 'annuelle'}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{formatFcfa(t.amount)}</td>
                    <td className="py-2">{STATUS_LABEL[t.status] ?? t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section aria-labelledby="questions" className="max-w-3xl mx-auto text-sm text-gray-600 space-y-2">
        <h2 id="questions" className="text-lg font-black text-gray-900">Bon à savoir</h2>
        <p><strong>Pas de prélèvement automatique :</strong> tu renouvelles ta formule quand tu le souhaites, par un nouveau paiement.</p>
        <p><strong>Monter de formule :</strong> la nouvelle formule démarre tout de suite et les jours restants de l’ancienne sont convertis au prorata.</p>
        <p><strong>Descendre de formule :</strong> tu gardes ta formule actuelle jusqu’à son échéance, puis la nouvelle prend le relais.</p>
        <p><strong>À l’expiration :</strong> ton compte repasse en Gratuit. Ta progression, tes badges et ton historique sont conservés.</p>
        <p>Une question sur ton abonnement ? <Link href="/dashboard" className="underline">Contacte le support</Link> depuis le bouton d’avis en bas de l’écran.</p>
      </section>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  )
}
