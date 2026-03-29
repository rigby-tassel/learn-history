import type { LessonCard, QuizQuestion } from '@/types'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) throw new Error('Missing VITE_OPENAI_API_KEY in .env')
  return key
}

async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

export interface SearchResult {
  lessonCards: LessonCard[]
  quizQuestions: QuizQuestion[]
  suggestedSubtopics: string[]
}

export async function searchContent(topic: string): Promise<SearchResult> {
  const { LESSON_SYSTEM_PROMPT } = await import('@/constants')

  const content = await callOpenAI([
    { role: 'system', content: LESSON_SYSTEM_PROMPT },
    { role: 'user', content: `Create an engaging lesson about: ${topic}` },
  ])

  const parsed = JSON.parse(content)

  // Fetch Wikipedia images for each card
  const cardsWithMedia = await Promise.all(
    parsed.lessonCards.map(async (card: LessonCard & { mediaSearchTerm?: string }) => {
      if (card.mediaSearchTerm) {
        try {
          const img = await fetchWikipediaImage(card.mediaSearchTerm)
          if (img) {
            return { ...card, mediaType: 'image' as const, mediaUrl: img.url, mediaCaption: img.caption || card.mediaCaption }
          }
        } catch {
          // Fall through to no media
        }
      }
      return { ...card, mediaType: card.mediaUrl ? card.mediaType : 'none' as const }
    })
  )

  return {
    lessonCards: cardsWithMedia,
    quizQuestions: parsed.quizQuestions || [],
    suggestedSubtopics: parsed.suggestedSubtopics || [],
  }
}

export async function evaluateAnswer(
  question: string,
  correctAnswer: string,
  userAnswer: string,
): Promise<{ isCorrect: boolean; feedback: string }> {
  const { EVALUATE_SYSTEM_PROMPT } = await import('@/constants')

  const content = await callOpenAI([
    { role: 'system', content: EVALUATE_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Question: ${question}\nExpected answer: ${correctAnswer}\nStudent's answer: ${userAnswer}`,
    },
  ])

  return JSON.parse(content)
}

async function fetchWikipediaImage(searchTerm: string): Promise<{ url: string; caption: string } | null> {
  try {
    // Use Wikipedia's search API to find the best matching page
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srlimit=3&format=json&origin=*`
    )
    if (!searchRes.ok) return null
    const searchData = await searchRes.json()
    const pages = searchData.query?.search
    if (!pages || pages.length === 0) return null

    // Try each search result until we find one with an image
    for (const page of pages) {
      const title = page.title
      const summaryRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      )
      if (!summaryRes.ok) continue
      const data = await summaryRes.json()
      if (data.originalimage?.source) {
        return { url: data.originalimage.source, caption: data.description || searchTerm }
      }
      if (data.thumbnail?.source) {
        return { url: data.thumbnail.source, caption: data.description || searchTerm }
      }
    }
    return null
  } catch {
    return null
  }
}
