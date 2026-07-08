// Envoi SMS via Africa's Talking (repli quand WhatsApp indisponible / non configuré).
// La logique OTP dans routes/auth.ts reste inchangée ; ceci est le sender réutilisable.

interface SendResult { ok: boolean; id?: string | undefined; error?: string | undefined }

export function isSmsConfigured(): boolean {
  const key = process.env['AT_API_KEY'] ?? ''
  return !!key && !key.includes('xxxx')
}

export async function sendSms(to: string, message: string): Promise<SendResult> {
  if (!isSmsConfigured()) return { ok: false, error: 'SMS_NOT_CONFIGURED' }
  try {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method:  'POST',
      headers: {
        apiKey:         process.env['AT_API_KEY']!,
        Accept:         'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: process.env['AT_USERNAME'] ?? 'sandbox',
        to,
        message,
        from: process.env['AT_SENDER_ID'] ?? 'Kelassi',
      }),
    })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    const json = (await res.json()) as { SMSMessageData?: { Recipients?: Array<{ messageId?: string }> } }
    return { ok: true, id: json.SMSMessageData?.Recipients?.[0]?.messageId }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'unknown' }
  }
}
