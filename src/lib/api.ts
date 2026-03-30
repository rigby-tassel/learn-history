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

  // No images — cards use gradient backgrounds
  const cards = (parsed.lessonCards || []).map((card: LessonCard) => ({
    ...card,
    mediaType: 'none' as const,
    mediaUrl: undefined,
  }))

  return {
    lessonCards: cards,
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
