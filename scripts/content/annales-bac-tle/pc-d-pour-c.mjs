// Sujets de PHYSIQUE-CHIMIE du bac D (2010-2020) proposés AUSSI en Terminale C, comme
// sujets d'entraînement (demande de l'utilisateur, 26/10/2026) — comme le sujet de maths E
// rangé en maths C. Le contenu vient des modules pc-d-* (aucune copie du texte) ; seul un
// bandeau est ajouté en tête d'énoncé. Rangs : après les sujets propres à la série C.
import * as D1 from './pc-d-2015-2020.mjs'
import * as D2 from './pc-d-2010-2014.mjs'

const BANDEAU = `> 📝 Sujet du baccalauréat **série D**, proposé en entraînement aux élèves de série C (même programme de physique-chimie pour l'essentiel).\n\n`
const pourC = (list) => list.map((e) => ({ ...e, statement: BANDEAU + e.statement }))

export const BLOCS = [
  { subject: 'CHIMIE', levels: ['bac_c'], chapterTitle: 'Annales du bac — Chimie', orderStart: 20, get exercises() { return pourC(D1.BLOCS[0].exercises) } },
  { subject: 'Physique', levels: ['bac_c'], chapterTitle: 'Annales du bac — Physique', orderStart: 20, get exercises() { return pourC(D1.BLOCS[1].exercises) } },
  { subject: 'CHIMIE', levels: ['bac_c'], chapterTitle: 'Annales du bac — Chimie', orderStart: 120, get exercises() { return pourC(D2.BLOCS[0].exercises) } },
  { subject: 'Physique', levels: ['bac_c'], chapterTitle: 'Annales du bac — Physique', orderStart: 120, get exercises() { return pourC(D2.BLOCS[1].exercises) } },
]
