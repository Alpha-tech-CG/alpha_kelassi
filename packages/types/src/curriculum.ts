import type { Level } from './models'

/**
 * Architecture pédagogique structurée (migr. 027).
 * Filière → Série → Chapitre → Leçon (4 blocs) → Progression.
 */

// Aligné sur l'enum Postgres `track_type` (migr. 026 + 027), valeurs FR.
export type TrackType = 'generale' | 'technique' | 'professionnel'

// Les 4 blocs d'un chapitre.
export type LessonType = 'cours' | 'resume' | 'quiz' | 'video'

// Réutilise le type `Level` déjà défini dans models.ts (pas de doublon).
export type StudyLevel = Level

export interface Series {
  id: string
  code: string        // 'A', 'C', 'D', 'G1'…
  label: string
  track: TrackType
  level: StudyLevel
  country_code: string
}

export interface Chapter {
  id: string
  subject_id: string
  series_id: string | null
  title: string
  order_index: number
  description: string | null
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  chapter_id: string
  type: LessonType
  title: string
  content: string | null
  video_url: string | null
  duration_min: number | null
  is_premium: boolean
  order_index: number
}

export interface LessonProgress {
  lesson_id: string
  completed: boolean
  score: number | null
  completed_at: string | null
}

export interface ChapterWithProgress extends Chapter {
  progress: {
    cours_done: number
    resume_done: number
    quiz_done: number
    video_done: number
    quiz_avg_score: number | null
    total_lessons: number
    completed_lessons: number
    percent: number
  }
}
