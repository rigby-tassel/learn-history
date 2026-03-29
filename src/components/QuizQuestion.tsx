import { useState } from 'react'
import { Mic, MicOff, Send, CheckCircle2, XCircle } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { useEvaluateAnswer } from '@/hooks/useQuiz'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { cn } from '@/lib/utils'

interface QuizQuestionCardProps {
  question: QuizQuestion
  onAnswer: (answer: QuizAnswer) => void
  showFeedback: boolean
  lastAnswer?: QuizAnswer
  onNext: () => void
  isLast: boolean
}

export default function QuizQuestionCard({
  question,
  onAnswer,
  showFeedback,
  lastAnswer,
  onNext,
  isLast,
}: QuizQuestionCardProps) {
  const [textInput, setTextInput] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const evaluateMutation = useEvaluateAnswer()
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition()

  const displayInput = isListening ? transcript : textInput

  const handleOptionSelect = async (option: string) => {
    if (showFeedback) return
    setSelectedOption(option)
    const isCorrect = option === question.correctAnswer
    setFeedback(question.explanation)
    onAnswer({
      questionId: question.id,
      userAnswer: option,
      isCorrect,
    })
  }

  const handleFreeResponse = async () => {
    const answer = displayInput.trim()
    if (!answer) return

    if (isListening) stopListening()

    try {
      const result = await evaluateMutation.mutateAsync({
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: answer,
      })
      setFeedback(result.feedback)
      onAnswer({
        questionId: question.id,
        userAnswer: answer,
        isCorrect: result.isCorrect,
      })
    } catch {
      // Fallback: simple string matching
      const isCorrect = answer.toLowerCase().includes(
        question.correctAnswer.toLowerCase().split(' ').slice(0, 3).join(' ')
      )
      setFeedback(question.explanation)
      onAnswer({
        questionId: question.id,
        userAnswer: answer,
        isCorrect,
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <p className="text-base font-semibold text-slate-900 mb-4">{question.question}</p>

      {/* Multiple choice / True-false */}
      {(question.type === 'multiple_choice' || question.type === 'true_false') && question.options && (
        <div className="space-y-2 mb-4">
          {question.options.map(option => {
            const isSelected = selectedOption === option
            const isCorrectOption = option === question.correctAnswer
            let optionStyle = 'border-slate-200 hover:border-primary hover:bg-primary/5'
            if (showFeedback && isSelected && lastAnswer?.isCorrect) {
              optionStyle = 'border-correct bg-green-50 text-green-800'
            } else if (showFeedback && isSelected && !lastAnswer?.isCorrect) {
              optionStyle = 'border-incorrect bg-red-50 text-red-800'
            } else if (showFeedback && isCorrectOption) {
              optionStyle = 'border-correct bg-green-50 text-green-800'
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                  optionStyle,
                  showFeedback && 'pointer-events-none',
                )}
              >
                <span className="flex items-center gap-2">
                  {showFeedback && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-correct shrink-0" />}
                  {showFeedback && isSelected && !lastAnswer?.isCorrect && <XCircle className="w-4 h-4 text-incorrect shrink-0" />}
                  {option}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Free response */}
      {question.type === 'free_response' && !showFeedback && (
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
            <textarea
              value={displayInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 text-sm outline-none bg-transparent resize-none min-h-[60px] text-slate-900 placeholder:text-slate-400"
              disabled={isListening}
            />
            <div className="flex flex-col gap-2 shrink-0">
              {isSupported && (
                <button
                  type="button"
                  onClick={() => isListening ? stopListening() : startListening()}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isListening ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500',
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={handleFreeResponse}
                disabled={!displayInput.trim() || evaluateMutation.isPending}
                className="p-2 bg-primary text-white rounded-lg disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          {evaluateMutation.isPending && (
            <p className="text-xs text-slate-400 mt-2">Checking your answer...</p>
          )}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className={cn(
          'rounded-xl px-4 py-3 mb-4 animate-fade-in',
          lastAnswer?.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200',
        )}>
          <p className="text-sm font-semibold mb-1">
            {lastAnswer?.isCorrect ? '🎉 Correct!' : '💡 Not quite!'}
          </p>
          <p className="text-sm text-slate-700">{feedback}</p>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={onNext}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors animate-fade-in"
        >
          {isLast ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  )
}
