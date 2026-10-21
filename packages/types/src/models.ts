export type UserRole = 'student' | 'admin'
/** Valeur stockée en base ; `premium` est l'ancienne offre unique, lue comme `pro`. */
export type UserPlan = import('./subscriptions').SubscriptionPlan | 'premium'
export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'canceled' | 'suspended' | 'past_due' | 'trialing'
export type DocumentType = 'cours' | 'examen'
export type ExamSession = 'normale' | 'rattrapage'
/** @deprecated Utiliser `StudyLevel` de `./levels`, aligné sur l'enum PostgreSQL. */
export type Level = import('./levels').StudyLevel
export type MessageRole = 'user' | 'assistant'

export interface User {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  role: UserRole
  plan: UserPlan
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_sub_id: string | null
  cinetpay_ref: string | null
  feexpay_ref: string | null
  plan: UserPlan
  status: SubscriptionStatus
  billing_interval: 'month' | 'year' | null
  amount: number | null
  currency: string
  started_at: string | null
  expires_at: string | null
  cancelled_at: string | null
  suspended_at: string | null
  payment_provider: 'feexpay' | 'stripe' | 'cinetpay' | 'admin' | null
  provider_transaction_id: string | null
  product_key: string | null
  source: 'payment' | 'admin' | 'legacy'
  created_at: string
}

export interface Subject {
  id: string
  name: string
  level: Level
  country_code: string
  icon: string | null
  created_at: string
}

export interface Document {
  id: string
  subject_id: string
  type: DocumentType
  title: string
  level: Level
  year: number | null
  session: ExamSession | null
  country_code: string
  pdf_url: string
  text_content: string | null
  is_premium: boolean
  created_at: string
}

export interface DocumentChunk {
  id: string
  document_id: string
  content: string
  chunk_index: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  document_id: string | null
  title: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: MessageRole
  content: string
  created_at: string
}

export interface Flashcard {
  id: string
  user_id: string
  document_id: string
  front: string
  back: string
  next_review: string
  ease_factor: number
  interval: number
  reps: number
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  subject_id: string
  flashcards_reviewed: number
  score_avg: number
  streak_days: number
  last_active: string
}
