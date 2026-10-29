/**
 * Détection basique de tentatives de prompt injection / override d'instructions
 * dans les messages envoyés au tuteur IA (Gemini).
 *
 * Objectif : filtrer les tentatives ÉVIDENTES d'un élève qui copie-colle un
 * "jailbreak" trouvé en ligne pour faire dévier Kelassi de son rôle pédagogique
 * (méthode socratique) ou lui faire divulguer son system prompt. Ce n'est PAS
 * un rempart contre un attaquant déterminé et sophistiqué — l'objectif est de
 * rester bienveillant envers des élèves, pas de bloquer agressivement des
 * questions légitimes qui contiendraient incidemment un mot-clé (ex. un élève
 * qui demande "c'est quoi un system prompt ?" en cours d'info ne doit
 * idéalement pas être bloqué à tort ; on accepte un faux négatif occasionnel
 * plutôt qu'un faux positif fréquent).
 */

// Chaque pattern cible une intention d'override explicite (verbe d'instruction
// + cible "instructions/rôle/règles/prompt"), pas un mot-clé isolé, pour
// limiter les faux positifs sur des questions légitimes.
const INJECTION_PATTERNS: RegExp[] = [
  // FR — ignorer/oublier les instructions précédentes
  /ignor[ea][a-z]*\s+(?:les\s+|tes\s+|toutes\s+les\s+)?instructions?\s+(?:précédentes?|ci-dessus|du\s+système|initiales?)/i,
  /oubli[ea][a-z]*\s+(?:tout\s+)?(?:ce\s+qui\s+précède|les\s+instructions?|ton\s+rôle|tes\s+règles?)/i,
  /(?:fais\s+comme\s+si|à\s+partir\s+de\s+maintenant)[^.]{0,40}(?:aucune\s+règle|pas\s+de\s+règles?|plus\s+de\s+limites?|sans\s+restriction)/i,

  // FR — changement de rôle / persona
  /tu\s+es\s+maintenant\s+/i,
  /tu\s+n['’]es\s+plus\s+kelassi/i,
  /nouveau\s+rôle\s*:/i,
  /change\s+de\s+rôle/i,
  /joue\s+le\s+rôle\s+d[e']\s*(?:un|une)?\s*(?!élève|professeur|enseignant)/i,

  // FR — extraction de prompt système
  /(?:révèle|montre|affiche|donne|répète)[- ]?(?:moi\s+)?(?:ton|le)\s+(?:prompt\s+système|system\s+prompt|instructions?\s+(?:système|internes?))/i,
  /quel(?:les?)?\s+(?:sont\s+)?tes?\s+instructions?\s+(?:système|internes?|cachées?)/i,

  // EN — ignore/forget previous instructions
  /ignore\s+(?:all\s+|the\s+)?(?:previous|prior|above)\s+instructions?/i,
  /forget\s+(?:everything\s+)?(?:above|previous|prior)/i,
  /disregard\s+(?:all\s+|the\s+)?(?:previous|prior|above)\s+instructions?/i,

  // EN — role override
  /you\s+are\s+now\s+/i,
  /you['’]?re\s+no\s+longer\s+kelassi/i,
  /new\s+role\s*:/i,
  /act\s+as\s+if\s+you\s+(?:are|were)\s+/i,
  /pretend\s+(?:you\s+are|to\s+be)\s+/i,
  /developer\s+mode/i,
  /jailbreak/i,

  // EN — system prompt extraction
  /(?:reveal|show|print|repeat)\s+(?:me\s+)?(?:your\s+)?system\s+prompt/i,
  /what\s+(?:are\s+)?your\s+(?:system\s+|internal\s+|hidden\s+)?instructions?/i,

  // Balises de rôle explicites parfois utilisées pour usurper le format du
  // prompt système (peu importe la langue).
  /\[\s*system\s*\]/i,
  /<\s*system\s*>/i,
]

/**
 * Renvoie true si le texte contient un motif de tentative d'override
 * d'instructions courante (FR/EN). Insensible à la casse.
 */
export function detectInjectionAttempt(text: string): boolean {
  if (!text) return false
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text))
}
