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
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
    )
    if (!res.ok) return null

    const data = await res.json()
    if (data.thumbnail?.source) {
      // Get a larger version by modifying the thumbnail URL
      const largeUrl = data.thumbnail.source.replace(/\/\d+px-/, '/800px-')
      return { url: largeUrl, caption: data.description || searchTerm }
    }
    return null
  } catch {
    return null
  }
}
