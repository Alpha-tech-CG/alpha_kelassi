import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'

/** Migrations WatermelonDB. v1 → v2 : ajout de la table lesson_cache (cache offline des leçons). */
export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'lesson_cache',
          columns: [
            { name: 'lesson_id', type: 'string', isIndexed: true },
            { name: 'type', type: 'string' },
            { name: 'content', type: 'string' },
            { name: 'cached_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
})
