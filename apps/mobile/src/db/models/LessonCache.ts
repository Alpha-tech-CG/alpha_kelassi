import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

/** Cache offline d'une leçon (résumé / cours) — migr. 027. */
export class LessonCacheModel extends Model {
  static override table = 'lesson_cache'

  @field('lesson_id') lessonId!: string
  @field('type') type!: string
  @field('content') content!: string
  @field('cached_at') cachedAt!: number
}
