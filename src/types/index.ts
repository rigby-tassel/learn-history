export interface LessonCard {
  id: string
  order: number
  title: string
  content: string
  funFact?: string
  keyDates?: string[]
  mediaType: 'image' | 'video' | 'none'
  mediaUrl?: string
  mediaCaption?: string
  sourceUrl?: string
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'free_response'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface QuizAnswer {
  questionId: string
  userAnswer: string
  isCorrect: boolean
}

export type SessionPhase = 'loading' | 'learning' | 'quiz' | 'results'

export interface ExploreSession {
  id: string
  topic: string
  lessonCards: LessonCard[]
  quizQuestions: QuizQuestion[]
  quizAnswers: QuizAnswer[]
  currentCardIndex: number
  phase: SessionPhase
  suggestedSubtopics: string[]
}
