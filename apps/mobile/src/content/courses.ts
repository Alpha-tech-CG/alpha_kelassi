export type CourseLevel = 'bepc' | 'bac_a' | 'bac_c' | 'bac_d'

export interface CourseSection {
  title: string
  body: string[]
}

export interface HardcodedCourse {
  id: string
  level: CourseLevel
  subject: string
  chapter: string
  title: string
  summary: string
  duration: string
  isPremium: boolean
  objectives: string[]
  sections: CourseSection[]
  takeaways: string[]
}

export const levelLabels: Record<CourseLevel | '', string> = {
  '': 'Tous',
  bepc: 'BEPC',
  bac_a: 'BAC A',
  bac_c: 'BAC C',
  bac_d: 'BAC D',
}

export const courses: HardcodedCourse[] = [
  {
    id: 'bac_d-maths-derivees',
    level: 'bac_d',
    subject: 'Mathematiques',
    chapter: 'Derivees',
    title: 'Les derivees - cours complet',
    summary: 'Comprendre le nombre derive, les formules usuelles et les applications aux variations.',
    duration: '35 min',
    isPremium: false,
    objectives: [
      'Calculer une derivee simple.',
      'Etudier le sens de variation d une fonction.',
      'Interpreter graphiquement le signe de la derivee.',
    ],
    sections: [
      {
        title: 'Idee principale',
        body: [
          'La derivee mesure la vitesse de variation d une fonction. Si la fonction represente une position, sa derivee represente une vitesse.',
          'Graphiquement, la derivee en un point correspond au coefficient directeur de la tangente a la courbe en ce point.',
        ],
      },
      {
        title: 'Formules a connaitre',
        body: [
          'Si f(x) = x^n, alors f prime(x) = n x^(n-1).',
          'Si f(x) = ax + b, alors f prime(x) = a.',
          'La derivee d une somme est la somme des derivees.',
        ],
      },
      {
        title: 'Application aux variations',
        body: [
          'Quand f prime(x) est positif sur un intervalle, f est croissante sur cet intervalle.',
          'Quand f prime(x) est negatif sur un intervalle, f est decroissante.',
          'Les points ou f prime(x) = 0 sont souvent des candidats pour les extremums.',
        ],
      },
    ],
    takeaways: [
      'Derivee positive: la fonction monte.',
      'Derivee negative: la fonction descend.',
      'Derivee nulle: possible maximum ou minimum.',
    ],
  },
  {
    id: 'bac_c-physique-mouvement',
    level: 'bac_c',
    subject: 'Physique',
    chapter: 'Mouvement rectiligne',
    title: 'Mouvement rectiligne uniforme et accelere',
    summary: 'Revoir position, vitesse, acceleration et equations horaires.',
    duration: '30 min',
    isPremium: false,
    objectives: [
      'Distinguer vitesse et acceleration.',
      'Utiliser les equations horaires.',
      'Lire un graphique x(t) ou v(t).',
    ],
    sections: [
      {
        title: 'Mouvement uniforme',
        body: [
          'Un mouvement rectiligne uniforme se fait en ligne droite avec une vitesse constante.',
          'L equation horaire s ecrit souvent x(t) = x0 + vt.',
        ],
      },
      {
        title: 'Mouvement accelere',
        body: [
          'Quand l acceleration est constante, la vitesse varie regulierement.',
          'On utilise v(t) = v0 + at et x(t) = x0 + v0t + 1/2 at^2.',
        ],
      },
    ],
    takeaways: [
      'Vitesse constante: acceleration nulle.',
      'Acceleration constante: vitesse lineaire.',
      'Toujours verifier les unites.',
    ],
  },
  {
    id: 'bepc-francais-argumentation',
    level: 'bepc',
    subject: 'Francais',
    chapter: 'Argumentation',
    title: 'Construire un paragraphe argumentatif',
    summary: 'Apprendre a formuler une idee, la justifier et l illustrer clairement.',
    duration: '25 min',
    isPremium: false,
    objectives: [
      'Identifier une these.',
      'Construire un argument.',
      'Ajouter un exemple pertinent.',
    ],
    sections: [
      {
        title: 'Structure simple',
        body: [
          'Un bon paragraphe argumentatif contient une idee principale, une explication et un exemple.',
          'La phrase d idee annonce clairement ce que tu veux defendre.',
        ],
      },
      {
        title: 'Connecteurs utiles',
        body: [
          'Pour ajouter: de plus, ensuite, aussi.',
          'Pour expliquer: car, parce que, en effet.',
          'Pour conclure: donc, ainsi, par consequent.',
        ],
      },
    ],
    takeaways: [
      'Une idee par paragraphe.',
      'Un argument doit etre explique.',
      'Un exemple rend la reponse concrete.',
    ],
  },
  {
    id: 'bac_a-philo-conscience',
    level: 'bac_a',
    subject: 'Philosophie',
    chapter: 'La conscience',
    title: 'La conscience et la connaissance de soi',
    summary: 'Comprendre les notions de conscience immediate, reflexive et morale.',
    duration: '40 min',
    isPremium: true,
    objectives: [
      'Definir la conscience.',
      'Distinguer conscience psychologique et morale.',
      'Construire une problematique simple.',
    ],
    sections: [
      {
        title: 'Definition',
        body: [
          'La conscience est la capacite de se rendre compte de ce que l on vit, pense ou fait.',
          'Elle permet a l humain de prendre du recul sur lui-meme.',
        ],
      },
      {
        title: 'Probleme philosophique',
        body: [
          'Se connaitre soi-meme parait naturel, mais nos desirs, nos habitudes et nos illusions peuvent nous echapper.',
          'La question devient alors: la conscience suffit-elle pour se connaitre ?',
        ],
      },
    ],
    takeaways: [
      'La conscience donne du recul.',
      'Elle ne garantit pas une connaissance totale de soi.',
      'Une dissertation part toujours d un probleme.',
    ],
  },
]

export function getCourseById(id: string) {
  return courses.find((course) => course.id === id)
}
