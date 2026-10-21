import { GoogleGenAI } from '@google/genai'

// Modération d'un message AVANT publication (BLOC D). Deux étages :
//  1) Filtres regex rapides et déterministes — coordonnées (tel/email) et liens
//     externes (D.5 : aucune coordonnée ne peut être partagée).
//  2) Analyse Gemini — insultes/violence, contenu sexuel, harcèlement.
// Si Gemini n'est pas configuré, on retombe sur les seuls filtres regex.

export interface ModResult { ok: boolean; reason?: string; category?: string }

const PHONE_RE = /(?:\+?\d[\s.\-]?){8,}/            // 8+ chiffres → numéro probable
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/
const LINK_RE  = /(https?:\/\/|www\.|t\.me\/|wa\.me\/|\b\w+\.(?:com|net|org|fr|cg|io|me)\b)/i

export function regexFilter(content: string): ModResult {
  if (EMAIL_RE.test(content)) return { ok: false, category: 'coordonnees', reason: 'Le partage d’adresses e-mail n’est pas autorisé.' }
  if (PHONE_RE.test(content.replace(/\s/g, ' '))) return { ok: false, category: 'coordonnees', reason: 'Le partage de numéros de téléphone n’est pas autorisé.' }
  if (LINK_RE.test(content)) return { ok: false, category: 'lien', reason: 'Le partage de liens externes n’est pas autorisé ici.' }
  return { ok: true }
}

let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI | null {
  const key = process.env['GEMINI_API_KEY']
  if (!key) return null
  if (!_genai) _genai = new GoogleGenAI({ apiKey: key })
  return _genai
}

export async function moderateMessage(content: string): Promise<ModResult> {
  const rx = regexFilter(content)
  if (!rx.ok) return rx

  const genai = getGenai()
  if (!genai) return { ok: true }   // pas d'IA → on a au moins passé les filtres regex

  const prompt =
    'Tu es un modérateur d’une app scolaire pour mineurs. Analyse ce message d’élève et détermine s’il doit être BLOQUÉ. ' +
    'Bloque si : insulte / violence, contenu sexuel, harcèlement / intimidation. Laisse passer les messages scolaires normaux, ' +
    'les blagues bon enfant et les désaccords polis. Réponds STRICTEMENT en JSON : ' +
    '{"block": true|false, "category": "insulte|sexuel|harcelement|ok", "reason": "<courte explication en français si bloqué>"}.\n\n' +
    `Message : """${content.slice(0, 2000)}"""`

  try {
    const resp = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { thinkingConfig: { thinkingBudget: 0 } },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const text = resp.text ?? ''
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
    if (json.block === true) {
      return { ok: false, category: String(json.category ?? 'inapproprie'), reason: String(json.reason ?? 'Message contraire aux règles.').slice(0, 300) }
    }
    return { ok: true }
  } catch {
    // En cas d'échec IA, ne bloque pas les messages normaux (les filtres regex ont déjà passé).
    return { ok: true }
  }
}
