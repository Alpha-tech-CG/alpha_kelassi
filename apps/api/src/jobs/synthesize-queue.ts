import { Queue } from 'bullmq'

export interface SynthesizeJobData {
  document_id: string
  title:       string
  level?:      string  // 'bepc' | 'bac_c' | 'bac_d' | 'bac_a'
}

const queueRedisUrl = process.env['QUEUE_REDIS_URL'] ?? ''
const isConfigured  = !!queueRedisUrl && !queueRedisUrl.includes('xxxx')

export const synthesizeQueue: Queue<SynthesizeJobData> | null = isConfigured
  ? new Queue<SynthesizeJobData>('synthesize_chapters', {
      connection: { url: queueRedisUrl },
      defaultJobOptions: {
        attempts:        2,
        backoff:         { type: 'exponential', delay: 15_000 },
        removeOnComplete: 30,
        removeOnFail:    20,
      },
    })
  : null
