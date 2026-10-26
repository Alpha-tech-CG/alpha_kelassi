// Auto-generated Supabase types stub
// Run `pnpm db:generate-types` to regenerate from Supabase schema

import type { StudyLevel } from './levels'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'student' | 'admin' | 'tutor' | 'teacher' | 'parent'
          plan: 'free' | 'premium'
          xp: number
          streak: number
          onboarding_completed: boolean
          track_type: 'generale' | 'technique' | 'professionnel' | null
          study_level_pref: StudyLevel | null
          subject_ids_pref: string[] | null
          whatsapp_opt_in: boolean
          reminder_hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'admin' | 'tutor' | 'teacher' | 'parent'
          plan?: 'free' | 'premium'
          xp?: number
          streak?: number
          onboarding_completed?: boolean
          track_type?: 'generale' | 'technique' | 'professionnel' | null
          study_level_pref?: StudyLevel | null
          subject_ids_pref?: string[] | null
          whatsapp_opt_in?: boolean
          reminder_hour?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'admin' | 'tutor' | 'teacher' | 'parent'
          plan?: 'free' | 'premium'
          xp?: number
          streak?: number
          onboarding_completed?: boolean
          track_type?: 'generale' | 'technique' | 'professionnel' | null
          study_level_pref?: StudyLevel | null
          subject_ids_pref?: string[] | null
          whatsapp_opt_in?: boolean | undefined
          reminder_hour?: number | undefined
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_log: {
        Row: {
          id: string
          user_id: string
          channel: 'whatsapp' | 'sms'
          template: string
          to_phone: string
          body: string | null
          status: 'sent' | 'failed' | 'delivered' | 'read'
          provider_id: string | null
          dedup_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel: 'whatsapp' | 'sms'
          template: string
          to_phone: string
          body?: string | null
          status?: 'sent' | 'failed' | 'delivered' | 'read'
          provider_id?: string | null
          dedup_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel?: 'whatsapp' | 'sms'
          template?: string
          to_phone?: string
          body?: string | null
          status?: 'sent' | 'failed' | 'delivered' | 'read'
          provider_id?: string | null
          dedup_key?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'message_log_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      videos: {
        Row: {
          id: string
          subject_id: string
          title: string
          description: string | null
          level: StudyLevel
          provider: 'youtube' | 'vimeo'
          external_id: string
          url: string
          duration_sec: number | null
          thumbnail_url: string | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          description?: string | null
          level: StudyLevel
          provider?: 'youtube' | 'vimeo'
          external_id: string
          url: string
          duration_sec?: number | null
          thumbnail_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          description?: string | null
          level?: StudyLevel
          provider?: 'youtube' | 'vimeo'
          external_id?: string
          url?: string
          duration_sec?: number | null
          thumbnail_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'videos_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
        ]
      }
      subjects: {
        Row: {
          id: string
          name: string
          level: StudyLevel
          track_type: 'generale' | 'technique' | 'professionnel'
          country_code: string
          icon: string | null
          parent_subject_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          level: StudyLevel
          track_type?: 'generale' | 'technique' | 'professionnel'
          country_code?: string
          icon?: string | null
          parent_subject_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: StudyLevel
          track_type?: 'generale' | 'technique' | 'professionnel'
          country_code?: string
          icon?: string | null
          parent_subject_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          id: string
          subject_id: string
          series_id: string | null
          title: string
          order_index: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          series_id?: string | null
          title: string
          order_index?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          series_id?: string | null
          title?: string
          order_index?: number
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chapters_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
        ]
      }
      lessons: {
        Row: {
          id: string
          chapter_id: string
          type: 'cours' | 'resume' | 'quiz' | 'video'
          title: string
          content: string | null
          video_url: string | null
          duration_min: number | null
          is_premium: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          type: 'cours' | 'resume' | 'quiz' | 'video'
          title: string
          content?: string | null
          video_url?: string | null
          duration_min?: number | null
          is_premium?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          type?: 'cours' | 'resume' | 'quiz' | 'video'
          title?: string
          content?: string | null
          video_url?: string | null
          duration_min?: number | null
          is_premium?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lessons_chapter_id_fkey'
            columns: ['chapter_id']
            isOneToOne: false
            referencedRelation: 'chapters'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          id: string
          subject_id: string | null
          type: 'cours' | 'examen'
          title: string
          level: StudyLevel
          year: number | null
          session: 'normale' | 'rattrapage' | null
          country_code: string
          pdf_url: string
          corrige_url: string | null
          text_content: string | null
          is_premium: boolean
          embed_status: 'pending' | 'processing' | 'done' | 'error' | null
          indexed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id?: string | null
          type: 'cours' | 'examen'
          title: string
          level: StudyLevel
          year?: number | null
          session?: 'normale' | 'rattrapage' | null
          country_code?: string
          pdf_url?: string | null
          corrige_url?: string | null
          text_content?: string | null
          is_premium?: boolean
          embed_status?: 'pending' | 'processing' | 'done' | 'error' | null
          indexed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string | null
          type?: 'cours' | 'examen'
          title?: string
          level?: StudyLevel
          year?: number | null
          session?: 'normale' | 'rattrapage' | null
          country_code?: string
          pdf_url?: string | null
          corrige_url?: string | null
          text_content?: string | null
          is_premium?: boolean
          embed_status?: 'pending' | 'processing' | 'done' | 'error' | null
          indexed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
        ]
      }
      document_chunks: {
        Row: {
          id: string
          document_id: string
          content: string
          chunk_index: number
          page_number: number | null
          embedding: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          content: string
          chunk_index: number
          page_number?: number | null
          embedding?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          content?: string
          chunk_index?: number
          page_number?: number | null
          embedding?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'document_chunks_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string | null
          title?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chat_sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'chat_sessions_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chat_messages_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'chat_sessions'
            referencedColumns: ['id']
          },
        ]
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          lesson_id: string | null
          front: string
          back: string
          next_review: string
          ease_factor: number
          interval: number
          reps: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          lesson_id?: string | null
          front: string
          back: string
          next_review?: string
          ease_factor?: number
          interval?: number
          reps?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string | null
          lesson_id?: string | null
          front?: string
          back?: string
          next_review?: string
          ease_factor?: number
          interval?: number
          reps?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'flashcards_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flashcards_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flashcards_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_code: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_code: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_code?: string
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_badges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      document_views: {
        Row: {
          id: string
          user_id: string
          document_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'document_views_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'document_views_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_sub_id: string | null
          cinetpay_ref: string | null
          feexpay_ref: string | null
          plan: 'free' | 'premium'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_sub_id?: string | null
          cinetpay_ref?: string | null
          feexpay_ref?: string | null
          plan?: 'free' | 'premium'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_sub_id?: string | null
          cinetpay_ref?: string | null
          feexpay_ref?: string | null
          plan?: 'free' | 'premium'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          platform: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          platform?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          platform?: string
          created_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          score_avg: number | null
          streak_days: number
          last_active: string | null
          flashcards_reviewed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          score_avg?: number | null
          streak_days?: number
          last_active?: string | null
          flashcards_reviewed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          score_avg?: number | null
          streak_days?: number
          last_active?: string | null
          flashcards_reviewed?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_progress_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_progress_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      beta_feedback: {
        Row: {
          id: string
          user_id: string
          rating: number
          comment: string | null
          page: string | null
          app_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rating: number
          comment?: string | null
          page?: string | null
          app_version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          page?: string | null
          app_version?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'beta_feedback_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          cta_label: string | null
          cta_url: string | null
          target_plan: 'all' | 'free' | 'premium'
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type?: string | undefined
          title: string
          message: string
          cta_label?: string | null | undefined
          cta_url?: string | null | undefined
          target_plan?: 'all' | 'free' | 'premium' | undefined
          is_active?: boolean | undefined
          expires_at?: string | null | undefined
          created_at?: string
        }
        Update: {
          id?: string
          type?: string | undefined
          title?: string | undefined
          message?: string | undefined
          cta_label?: string | null | undefined
          cta_url?: string | null | undefined
          target_plan?: 'all' | 'free' | 'premium' | undefined
          is_active?: boolean | undefined
          expires_at?: string | null | undefined
          created_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          id: string
          subject_id: string
          document_id: string | null
          title: string
          description: string | null
          level: StudyLevel
          time_limit_sec: number
          is_premium: boolean
          is_exam: boolean
          is_monthly_test: boolean
          is_term_exam: boolean
          default_month_id: string | null
          default_term_id: string | null
          chapter_id: string | null
          year: number | null
          exam_kind: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          document_id?: string | null
          title: string
          description?: string | null
          level: StudyLevel
          time_limit_sec?: number
          is_premium?: boolean
          is_exam?: boolean
          is_monthly_test?: boolean
          is_term_exam?: boolean
          default_month_id?: string | null
          default_term_id?: string | null
          chapter_id?: string | null
          year?: number | null
          exam_kind?: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          document_id?: string | null
          title?: string
          description?: string | null
          level?: StudyLevel
          time_limit_sec?: number
          is_premium?: boolean
          is_exam?: boolean
          is_monthly_test?: boolean
          is_term_exam?: boolean
          default_month_id?: string | null
          default_term_id?: string | null
          chapter_id?: string | null
          year?: number | null
          exam_kind?: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          deleted_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quizzes_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quizzes_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
        ]
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          position: number
          prompt: string
          options: Json
          correct_index: number
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          position: number
          prompt: string
          options: Json
          correct_index: number
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          position?: number
          prompt?: string
          options?: Json
          correct_index?: number
          explanation?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_questions_quiz_id_fkey'
            columns: ['quiz_id']
            isOneToOne: false
            referencedRelation: 'quizzes'
            referencedColumns: ['id']
          },
        ]
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          total: number
          duration_sec: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          total: number
          duration_sec: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          total?: number
          duration_sec?: number
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_attempts_quiz_id_fkey'
            columns: ['quiz_id']
            isOneToOne: false
            referencedRelation: 'quizzes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quiz_attempts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      quiz_attempt_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_index: number | null
          is_correct: boolean
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_index?: number | null
          is_correct: boolean
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_index?: number | null
          is_correct?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_attempt_answers_attempt_id_fkey'
            columns: ['attempt_id']
            isOneToOne: false
            referencedRelation: 'quiz_attempts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quiz_attempt_answers_question_id_fkey'
            columns: ['question_id']
            isOneToOne: false
            referencedRelation: 'quiz_questions'
            referencedColumns: ['id']
          },
        ]
      }
      exam_events: {
        Row: {
          id: string
          level: StudyLevel
          label: string
          exam_date: string
          country_code: string
          created_at: string
        }
        Insert: {
          id?: string
          level: StudyLevel
          label: string
          exam_date: string
          country_code?: string
          created_at?: string
        }
        Update: {
          id?: string
          level?: StudyLevel
          label?: string
          exam_date?: string
          country_code?: string
          created_at?: string
        }
        Relationships: []
      }
      revision_plans: {
        Row: {
          id: string
          user_id: string
          level: StudyLevel
          title: string
          exam_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: StudyLevel
          title: string
          exam_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: StudyLevel
          title?: string
          exam_date?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'revision_plans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      revision_sessions: {
        Row: {
          id: string
          user_id: string
          plan_id: string | null
          subject_id: string | null
          title: string
          scheduled_date: string
          duration_min: number
          is_done: boolean
          done_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: string | null
          subject_id?: string | null
          title: string
          scheduled_date: string
          duration_min?: number
          is_done?: boolean
          done_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string | null
          subject_id?: string | null
          title?: string
          scheduled_date?: string
          duration_min?: number
          is_done?: boolean
          done_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'revision_sessions_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'revision_plans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'revision_sessions_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'revision_sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      tutor_profiles: {
        Row: {
          user_id: string
          bio: string | null
          id_doc_url: string | null
          bac_doc_url: string | null
          is_verified: boolean
          verified_at: string | null
          score: number
          wallet_balance: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          bio?: string | null
          id_doc_url?: string | null
          bac_doc_url?: string | null
          is_verified?: boolean
          verified_at?: string | null
          score?: number
          wallet_balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          bio?: string | null
          id_doc_url?: string | null
          bac_doc_url?: string | null
          is_verified?: boolean
          verified_at?: string | null
          score?: number
          wallet_balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tutor_subjects: {
        Row: { tutor_id: string; subject_id: string }
        Insert: { tutor_id: string; subject_id: string }
        Update: { tutor_id?: string; subject_id?: string }
        Relationships: []
      }
      correction_missions: {
        Row: {
          id: string
          student_id: string
          tutor_id: string | null
          subject_id: string
          exercise_url: string
          work_url: string
          status: 'pending' | 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed'
          accepted_at: string | null
          due_at: string | null
          delivered_at: string | null
          attempts: number
          reward_fcfa: number
          ai_verdict: string | null
          deep_analysis: Json | null
          priority: number
          request_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          tutor_id?: string | null
          subject_id: string
          exercise_url: string
          work_url: string
          status?: 'pending' | 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed'
          accepted_at?: string | null
          due_at?: string | null
          delivered_at?: string | null
          attempts?: number
          reward_fcfa?: number
          ai_verdict?: string | null
          deep_analysis?: Json | null
          priority?: number
          request_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          tutor_id?: string | null
          subject_id?: string
          exercise_url?: string
          work_url?: string
          status?: 'pending' | 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed'
          accepted_at?: string | null
          due_at?: string | null
          delivered_at?: string | null
          attempts?: number
          reward_fcfa?: number
          ai_verdict?: string | null
          deep_analysis?: Json | null
          priority?: number
          request_key?: string | null
          created_at?: string
        }
        Relationships: []
      }
      correction_solutions: {
        Row: {
          id: string
          mission_id: string
          attempt: number
          photo_url: string
          ai_status: 'pending' | 'ok' | 'error'
          ai_feedback: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          attempt: number
          photo_url: string
          ai_status?: 'pending' | 'ok' | 'error'
          ai_feedback?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          attempt?: number
          photo_url?: string
          ai_status?: 'pending' | 'ok' | 'error'
          ai_feedback?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      correction_disputes: {
        Row: {
          id: string
          mission_id: string
          student_id: string
          description: string
          ai_explanation: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          student_id: string
          description: string
          ai_explanation?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          student_id?: string
          description?: string
          ai_explanation?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tutor_ratings: {
        Row: {
          id: string
          mission_id: string
          student_id: string
          tutor_id: string
          clarity: number
          quality: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          student_id: string
          tutor_id: string
          clarity: number
          quality: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          student_id?: string
          tutor_id?: string
          clarity?: number
          quality?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tutor_wallet_transactions: {
        Row: {
          id: string
          tutor_id: string
          mission_id: string | null
          amount_fcfa: number
          type: 'credit' | 'withdrawal'
          status: 'pending' | 'completed' | 'rejected'
          provider_ref: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          mission_id?: string | null
          amount_fcfa: number
          type: 'credit' | 'withdrawal'
          status?: 'pending' | 'completed' | 'rejected'
          provider_ref?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          mission_id?: string | null
          amount_fcfa?: number
          type?: 'credit' | 'withdrawal'
          status?: 'pending' | 'completed' | 'rejected'
          provider_ref?: string | null
          created_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          score: number | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lesson_progress_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      exercises: {
        Row: {
          id: string
          chapter_id: string
          title: string
          statement: string
          difficulty: number
          is_premium: boolean
          order_index: number
          created_at: string
          deleted_at: string | null
          exam_kind: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          origin: 'reel' | 'genere' | null
          variant_of: string | null
          duration_min: number | null
          bareme: Json | null
          exam_year: number | null
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          statement: string
          difficulty?: number
          is_premium?: boolean
          order_index?: number
          created_at?: string
          deleted_at?: string | null
          exam_kind?: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          origin?: 'reel' | 'genere' | null
          variant_of?: string | null
          duration_min?: number | null
          bareme?: Json | null
          exam_year?: number | null
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          statement?: string
          difficulty?: number
          is_premium?: boolean
          order_index?: number
          created_at?: string
          deleted_at?: string | null
          exam_kind?: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac' | null
          origin?: 'reel' | 'genere' | null
          variant_of?: string | null
          duration_min?: number | null
          bareme?: Json | null
          exam_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'exercises_chapter_id_fkey'
            columns: ['chapter_id']
            isOneToOne: false
            referencedRelation: 'chapters'
            referencedColumns: ['id']
          },
        ]
      }
      exercise_solutions: {
        Row: {
          exercise_id: string
          solution: string
          created_at: string
        }
        Insert: {
          exercise_id: string
          solution: string
          created_at?: string
        }
        Update: {
          exercise_id?: string
          solution?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exercise_solutions_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: true
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
        ]
      }
      chapter_flashcards: {
        Row: {
          id: string
          chapter_id: string
          front: string
          back: string
          order_index: number
          source: 'auto' | 'manuel'
          created_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          front: string
          back: string
          order_index?: number
          source?: 'auto' | 'manuel'
          created_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          front?: string
          back?: string
          order_index?: number
          source?: 'auto' | 'manuel'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chapter_flashcards_chapter_id_fkey'
            columns: ['chapter_id']
            isOneToOne: false
            referencedRelation: 'chapters'
            referencedColumns: ['id']
          },
        ]
      }
      exam_results: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          mode: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac'
          scores: Json
          total: number | null
          max_total: number | null
          duration_sec: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          mode: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac'
          scores?: Json
          total?: number | null
          max_total?: number | null
          duration_sec?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          mode?: 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac'
          scores?: Json
          total?: number | null
          max_total?: number | null
          duration_sec?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exam_results_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
        ]
      }
      exercise_attempts: {
        Row: {
          user_id: string
          exercise_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          exercise_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          exercise_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exercise_attempts_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'exercise_attempts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      academic_years: {
        Row: {
          id: string
          level: StudyLevel
          country_code: string
          label: string
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          level: StudyLevel
          country_code?: string
          label: string
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          level?: StudyLevel
          country_code?: string
          label?: string
          start_date?: string
          end_date?: string
          created_at?: string
        }
        Relationships: []
      }
      terms: {
        Row: {
          id: string
          academic_year_id: string
          term_number: number
          label: string
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          academic_year_id: string
          term_number: number
          label: string
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          academic_year_id?: string
          term_number?: number
          label?: string
          start_date?: string
          end_date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'terms_academic_year_id_fkey'
            columns: ['academic_year_id']
            isOneToOne: false
            referencedRelation: 'academic_years'
            referencedColumns: ['id']
          },
        ]
      }
      school_months: {
        Row: {
          id: string
          term_id: string
          label: string
          start_date: string
          end_date: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          term_id: string
          label: string
          start_date: string
          end_date: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          term_id?: string
          label?: string
          start_date?: string
          end_date?: string
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'school_months_term_id_fkey'
            columns: ['term_id']
            isOneToOne: false
            referencedRelation: 'terms'
            referencedColumns: ['id']
          },
        ]
      }
      curriculum_items: {
        Row: {
          id: string
          subject_id: string
          chapter_id: string | null
          lesson_id: string | null
          exercise_id: string | null
          quiz_id: string | null
          item_type: 'chapter' | 'lesson' | 'exercise' | 'quiz'
          school_month_id: string
          term_id: string
          is_core: boolean
          is_revision: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          chapter_id?: string | null
          lesson_id?: string | null
          exercise_id?: string | null
          quiz_id?: string | null
          item_type: 'chapter' | 'lesson' | 'exercise' | 'quiz'
          school_month_id: string
          term_id: string
          is_core?: boolean
          is_revision?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          chapter_id?: string | null
          lesson_id?: string | null
          exercise_id?: string | null
          quiz_id?: string | null
          item_type?: 'chapter' | 'lesson' | 'exercise' | 'quiz'
          school_month_id?: string
          term_id?: string
          is_core?: boolean
          is_revision?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'curriculum_items_school_month_id_fkey'
            columns: ['school_month_id']
            isOneToOne: false
            referencedRelation: 'school_months'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_term_id_fkey'
            columns: ['term_id']
            isOneToOne: false
            referencedRelation: 'terms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_subject_id_fkey'
            columns: ['subject_id']
            isOneToOne: false
            referencedRelation: 'subjects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_chapter_id_fkey'
            columns: ['chapter_id']
            isOneToOne: false
            referencedRelation: 'chapters'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_exercise_id_fkey'
            columns: ['exercise_id']
            isOneToOne: false
            referencedRelation: 'exercises'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_items_quiz_id_fkey'
            columns: ['quiz_id']
            isOneToOne: false
            referencedRelation: 'quizzes'
            referencedColumns: ['id']
          },
        ]
      }
      curriculum_item_review: {
        Row: {
          id: string
          user_id: string
          curriculum_item_id: string
          score_best: number | null
          attempts_count: number
          last_reviewed_at: string | null
          next_review_at: string | null
          ease_factor: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          curriculum_item_id: string
          score_best?: number | null
          attempts_count?: number
          last_reviewed_at?: string | null
          next_review_at?: string | null
          ease_factor?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          curriculum_item_id?: string
          score_best?: number | null
          attempts_count?: number
          last_reviewed_at?: string | null
          next_review_at?: string | null
          ease_factor?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'curriculum_item_review_curriculum_item_id_fkey'
            columns: ['curriculum_item_id']
            isOneToOne: false
            referencedRelation: 'curriculum_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'curriculum_item_review_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      series: {
        Row: {
          id: string
          code: string
          label: string
          track: 'generale' | 'technique' | 'professionnel'
          level: StudyLevel
          country_code: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          label: string
          track: 'generale' | 'technique' | 'professionnel'
          level: StudyLevel
          country_code?: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          label?: string
          track?: 'generale' | 'technique' | 'professionnel'
          level?: StudyLevel
          country_code?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_weak_areas: {
        Row: {
          user_id: string
          subject_id: string
          subject_name: string
          answered: number
          wrong: number
          error_rate: number
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_plan_level: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      submit_quiz_attempt: {
        Args: { p_quiz_id: string; p_answers: Json; p_duration_sec: number; p_mode?: string }
        Returns: Json
      }
      search_chunks: {
        Args: {
          query_embedding: string
          match_count?: number
          min_similarity?: number
          filter_document?: string | null
          p_include_premium?: boolean
        }
        Returns: {
          id: string
          document_id: string
          content: string
          chunk_index: number
          page_number: number | null
          metadata: Json
          similarity: number
        }[]
      }
      increment_xp: {
        Args: { p_user_id: string; p_amount: number }
        Returns: number
      }
      increment_tutor_wallet: {
        Args: { p_tutor_id: string; p_amount: number }
        Returns: undefined
      }
      debit_tutor_wallet: {
        Args: { p_tutor_id: string; p_amount: number }
        Returns: number | null
      }
      reconcile_failed_payout: {
        Args: { p_txn_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof Database },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
