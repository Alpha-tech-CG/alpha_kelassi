import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schema } from './schema'
import { migrations } from './migrations'
import { DocumentModel } from './models/Document'
import { LessonCacheModel } from './models/LessonCache'

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'kelassi',
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error', error)
  },
})

export const database = new Database({
  adapter,
  modelClasses: [DocumentModel, LessonCacheModel],
})

export { DocumentModel, LessonCacheModel }
