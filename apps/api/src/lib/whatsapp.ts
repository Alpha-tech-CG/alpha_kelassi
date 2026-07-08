// Client WhatsApp Business Cloud API (Meta).
// Env-gated : no-op propre si non configuré (comme redis/embedQueue).

const PHONE_ID = process.env['WHATSAPP_PHONE_NUMBER_ID'] ?? ''
const TOKEN    = process.env['WHATSAPP_ACCESS_TOKEN'] ?? ''
const VERSION  = process.env['WHATSAPP_API_VERSION'] ?? 'v21.0'

export function isWhatsAppConfigured(): boolean {
  return !!PHONE_ID && !PHONE_ID.includes('xxxx') && !!TOKEN && !TOKEN.includes('xxxx')
}

interface SendResult { ok: boolean; id?: string | undefined; error?: string | undefined }

async function post(payload: Record<string, unknown>): Promise<SendResult> {
  if (!isWhatsAppConfigured()) return { ok: false, error: 'WHATSAPP_NOT_CONFIGURED' }
  try {
    const res = await fetch(`https://graph.facebook.com/${VERSION}/${PHONE_ID}/messages`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
    })
    const json = (await res.json()) as { messages?: Array<{ id: string }>; error?: { message: string } }
    if (!res.ok) return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` }
    return { ok: true, id: json.messages?.[0]?.id }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'unknown' }
  }
}

/** Message template (business-initiated, hors fenêtre 24h — nécessite un template approuvé côté Meta) */
export function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  langCode: string,
  bodyParams: string[] = []
): Promise<SendResult> {
  return post({
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: langCode },
      ...(bodyParams.length
        ? { components: [{ type: 'body', parameters: bodyParams.map((text) => ({ type: 'text', text })) }] }
        : {}),
    },
  })
}

/** Message texte libre (uniquement dans la fenêtre de session 24h après un message entrant) */
export function sendWhatsAppText(to: string, text: string): Promise<SendResult> {
  return post({ to, type: 'text', text: { body: text, preview_url: false } })
}
