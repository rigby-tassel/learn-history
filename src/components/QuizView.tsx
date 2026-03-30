import { useState } from 'react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import QuizQuestionCard from './QuizQuestion'
import { cn } from '@/lib/utils'

interface QuizViewProps {
  questions: QuizQuestion[]
  onComplete: (answers: QuizAnswer[]) => void
}

export default function QuizView({ questions, onComplete }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleAnswer = (answer: QuizAnswer) => {
    const updated = [...answers, answer]
    setAnswers(updated)
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (isLast) {
      onComplete(answers)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md">
            <span className="text-white text-base">🧠</span>
          </div>
          <h2 className="text-lg font-black text-foreground">Quiz Time</h2>
        </div>
        <span className="text-sm font-bold text-primary">{currentIndex + 1}/{questions.length}</span>
      </div>

      {/* Progress segments */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => {
          const answered = answers[i]
          return (
            <div key={i} className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={cn(
                'h-full rounded-full transition-all duration-500',
                i < currentIndex
                  ? answered?.isCorrect ? 'w-full bg-success-gradient' : 'w-full bg-incorrect'
                  : i === currentIndex
                    ? 'w-full bg-primary/30'
                    : 'w-0',
              )} />
            </div>
          )
        })}
      </div>

      {/* Question card with entrance animation */}
      {currentQuestion && (
        <div key={currentIndex} className="animate-card-enter">
          <QuizQuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            lastAnswer={answers[answers.length - 1]}
            onNext={handleNext}
            isLast={isLast}
          />
        </div>
      )}
    </div>
  )
}
