import { useState, useCallback } from 'react'
import type { ExploreSession, LessonCard, QuizQuestion, QuizAnswer, SessionPhase } from '@/types'

const STORAGE_KEY = 'explore-session'

function createSession(topic: string): ExploreSession {
  return {
    id: crypto.randomUUID(),
    topic,
    lessonCards: [],
    quizQuestions: [],
    quizAnswers: [],
    currentCardIndex: 0,
    phase: 'loading',
    suggestedSubtopics: [],
  }
}

function loadSession(): ExploreSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session: ExploreSession) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function useExploreSession() {
  const [session, setSession] = useState<ExploreSession | null>(loadSession)

  const update = useCallback((patch: Partial<ExploreSession>) => {
    setSession(prev => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      saveSession(next)
      return next
    })
  }, [])

  const startSession = useCallback((topic: string) => {
    const s = createSession(topic)
    saveSession(s)
    setSession(s)
    return s
  }, [])

  const setContent = useCallback((
    lessonCards: LessonCard[],
    quizQuestions: QuizQuestion[],
    suggestedSubtopics: string[],
  ) => {
    update({ lessonCards, quizQuestions, suggestedSubtopics, phase: 'learning' })
  }, [update])

  const nextCard = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev
      const nextIndex = prev.currentCardIndex + 1
      if (nextIndex >= prev.lessonCards.length) {
        const next = { ...prev, phase: 'quiz' as SessionPhase }
        saveSession(next)
        return next
      }
      const next = { ...prev, currentCardIndex: nextIndex }
      saveSession(next)
      return next
    })
  }, [])

  const prevCard = useCallback(() => {
    update({ currentCardIndex: Math.max(0, (session?.currentCardIndex ?? 1) - 1) })
  }, [update, session?.currentCardIndex])

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    setSession(prev => {
      if (!prev) return prev
      const next = { ...prev, quizAnswers: [...prev.quizAnswers, answer] }
      if (next.quizAnswers.length >= next.quizQuestions.length) {
        next.phase = 'results'
      }
      saveSession(next)
      return next
    })
  }, [])

  const resetSession = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  return {
    session,
    startSession,
    setContent,
    nextCard,
    prevCard,
    submitAnswer,
    resetSession,
    setPhase: (phase: SessionPhase) => update({ phase }),
  }
}
