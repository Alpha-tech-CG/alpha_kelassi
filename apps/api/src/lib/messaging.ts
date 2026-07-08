import { supabaseAdmin } from './supabase.js'
import { isWhatsAppConfigured, sendWhatsAppTemplate } from './whatsapp.js'
import { sendSms } from './sms.js'

interface NotifyOptions {
  userId: string
  dedupKey: string                                   // ex. 'reminder:<user>:<YYYY-MM-DD>'
  template: { name: string; lang: string; params: string[] }  // message WhatsApp (template approuvé Meta)
  smsBody: string                                    // texte utilisé pour le repli SMS + journalisé
}

interface NotifyResult { status: 'sent' | 'skipped' | 'failed'; channel?: 'whatsapp' | 'sms' | undefined; reason?: string | undefined }

/**
 * Envoie une notification à un utilisateur : WhatsApp d'abord, repli SMS.
 * Idempotent : si dedup_key a déjà été utilisé, on ne renvoie rien.
 * À appeler uniquement côté serveur (utilise le service role qui bypass RLS).
 */
export async function notifyUser(opts: NotifyOptions): Promise<NotifyResult> {
  const { userId, dedupKey, template, smsBody } = opts

  // 1. Idempotence : déjà envoyé ?
  const { data: existing } = await supabaseAdmin
    .from('message_log')
    .select('id')
    .eq('dedup_key', dedupKey)
    .maybeSingle()
  if (existing) return { status: 'skipped', reason: 'ALREADY_SENT' }

  // 2. Profil + opt-in
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('phone, whatsapp_opt_in')
    .eq('id', userId)
    .single()
  if (!user?.phone) return { status: 'skipped', reason: 'NO_PHONE' }
  if (!user.whatsapp_opt_in) return { status: 'skipped', reason: 'NOT_OPTED_IN' }

  const to = user.phone.replace(/^\+/, '')  // Meta attend le numéro sans '+'

  // 3. WhatsApp d'abord
  let channel: 'whatsapp' | 'sms' = 'whatsapp'
  let result = isWhatsAppConfigured()
    ? await sendWhatsAppTemplate(to, template.name, template.lang, template.params)
    : { ok: false, error: 'WHATSAPP_NOT_CONFIGURED' as string, id: undefined as string | undefined }

  // 4. Repli SMS
  if (!result.ok) {
    channel = 'sms'
    result = await sendSms(user.phone, smsBody)
  }

  // 5. Journalise (dedup_key unique garantit l'absence de doublon même en cas de course)
  const { error: logErr } = await supabaseAdmin.from('message_log').insert({
    user_id:     userId,
    channel,
    template:    template.name,
    to_phone:    user.phone,
    body:        smsBody,
    status:      result.ok ? 'sent' : 'failed',
    provider_id: result.id ?? null,
    dedup_key:   dedupKey,
  })
  // Course perdue sur le dedup_key : un autre process a déjà envoyé → on considère skipped
  if (logErr && logErr.code === '23505') return { status: 'skipped', reason: 'RACE' }

  return result.ok ? { status: 'sent', channel } : { status: 'failed', channel, reason: result.error }
}
