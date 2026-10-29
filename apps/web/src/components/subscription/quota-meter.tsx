/**
 * Jauge de quota : l'information est donnée en texte (lecteurs d'écran,
 * daltonisme), la barre ne fait que l'illustrer.
 */
export function QuotaMeter({
  label,
  used,
  limit,
  summary,
  detail,
}: {
  label: string
  used: number
  limit: number | null
  summary: string
  detail?: string
}) {
  const pct = limit ? Math.min(100, Math.round((100 * used) / limit)) : 0
  const reached = limit !== null && used >= limit
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-sm font-semibold text-gray-600">
          {limit === null ? 'Sans limite' : `${used} / ${limit}`}
        </p>
      </div>
      {limit !== null && limit > 0 && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={Math.min(used, limit)}
          aria-valuetext={summary}
          className="h-2 rounded-full bg-gray-100 overflow-hidden"
        >
          <div className={`h-full rounded-full ${reached ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      <p className="text-xs text-gray-600 mt-2">{summary}</p>
      {detail && <p className={`text-xs mt-0.5 ${reached ? 'text-red-700 font-semibold' : 'text-gray-500'}`}>{detail}</p>}
    </div>
  )
}
