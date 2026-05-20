import { createClient } from '@supabase/supabase-js'
import type { Database } from '@alpha-kelassi/types'

export const supabase = createClient<Database>(
  process.env['SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!,
  { auth: { persistSession: false } }
)
