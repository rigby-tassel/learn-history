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

// Gamification types
export type XPEvent = 'card-complete' | 'quiz-correct' | 'session-complete' | 'subtopic-explore'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
}

export interface GameState {
  xp: number
  level: number
  streak: {
    current: number
    lastActiveDate: string // "2026-03-28"
  }
  achievements: Achievement[]
  stats: {
    totalSessions: number
    totalTopicsExplored: string[]
    perfectQuizzes: number
    subtopicsExplored: number
  }
}

export interface LevelInfo {
  level: number
  name: string
  xpThreshold: number
}

export interface XPAwardResult {
  amount: number
  newTotal: number
  leveledUp: boolean
  newLevel?: LevelInfo
}
