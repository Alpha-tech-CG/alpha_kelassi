import { GoogleGenAI } from '@google/genai'

// Lazy — évite de faire planter tout le serveur au démarrage si
// GEMINI_API_KEY n'est pas encore configurée
let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

const BATCH_SIZE = 100
const EMBED_MODEL = 'text-embedding-004'

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(
      batch.map((text) =>
        getGenai().models.embedContent({
          model: EMBED_MODEL,
          contents: text,
          config: { taskType: 'RETRIEVAL_DOCUMENT' },
        })
      )
    )
    for (const result of results) {
      const values = result.embeddings?.[0]?.values ?? []
      embeddings.push(values)
    }
  }

  return embeddings
}

export async function embedQuery(text: string): Promise<number[]> {
  const result = await getGenai().models.embedContent({
    model: EMBED_MODEL,
    contents: text,
    config: { taskType: 'RETRIEVAL_QUERY' },
  })
  return result.embeddings?.[0]?.values ?? []
}
