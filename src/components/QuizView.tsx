import { useState } from 'react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import QuizQuestionCard from './QuizQuestion'

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
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Quiz Time!</h2>
        <span className="text-sm text-slate-400">
          {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < currentIndex
                ? 'bg-primary'
                : i === currentIndex
                  ? 'bg-primary/50'
                  : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {currentQuestion && (
        <QuizQuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
          lastAnswer={answers[answers.length - 1]}
          onNext={handleNext}
          isLast={isLast}
        />
      )}
    </div>
  )
}
