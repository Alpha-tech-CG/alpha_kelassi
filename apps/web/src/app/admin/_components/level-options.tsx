import { CYCLES, CYCLE_ORDER, LEVEL_META, levelsOfCycle } from '@alpha-kelassi/types'

/**
 * Options d'un <select> de classe, rangées par cycle (Primaire, Collège, Lycée).
 * Avec plus de trente classes, une liste à plat devenait difficile à parcourir.
 */
export function LevelOptions() {
  return (
    <>
      {CYCLE_ORDER.map((cycle) => (
        <optgroup key={cycle} label={`${CYCLES[cycle].label} — ${CYCLES[cycle].exam}`}>
          {levelsOfCycle(cycle).map((l) => (
            <option key={l} value={l}>
              {LEVEL_META[l].exam ? `${LEVEL_META[l].classe} · ${LEVEL_META[l].label}` : LEVEL_META[l].classe}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  )
}
