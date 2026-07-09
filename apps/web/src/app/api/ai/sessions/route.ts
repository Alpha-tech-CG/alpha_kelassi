import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/** GET /api/ai/sessions — liste des sessions de chat de l'utilisateur */
export async function GET(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data } = await supabase
    .from('chat_sessions')
    .select('id, created_at, document_id, documents(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  return NextResponse.json({ data: data ?? [] })
}

/** DELETE /api/ai/sessions — supprime TOUTES les sessions de l'utilisateur */
export async function DELETE(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Récupère les IDs des sessions de l'utilisateur
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', user.id)

  if (sessions && sessions.length > 0) {
    const ids = sessions.map((s) => s.id)

    // Supprime les messages d'abord (FK), puis les sessions
    await supabase.from('chat_messages').delete().in('session_id', ids)
    await supabase.from('chat_sessions').delete().in('id', ids)
  }

  return NextResponse.json({ success: true })
}
