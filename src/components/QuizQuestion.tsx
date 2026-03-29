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
  const [feedback, setFeedback] = useState('')
  const [answerAnim, setAnswerAnim] = useState<'correct' | 'wrong' | null>(null)
  const evaluateMutation = useEvaluateAnswer()
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition()

  const displayInput = isListening ? transcript : textInput

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return
    setSelectedOption(option)
    const isCorrect = option === question.correctAnswer
    setAnswerAnim(isCorrect ? 'correct' : 'wrong')
    setFeedback(question.explanation)

    if (isCorrect) {
      window.dispatchEvent(new Event('game-confetti'))
    }

    onAnswer({ questionId: question.id, userAnswer: option, isCorrect })
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
      setAnswerAnim(result.isCorrect ? 'correct' : 'wrong')
      if (result.isCorrect) window.dispatchEvent(new Event('game-confetti'))
      onAnswer({ questionId: question.id, userAnswer: answer, isCorrect: result.isCorrect })
    } catch {
      const isCorrect = answer.toLowerCase().includes(
        question.correctAnswer.toLowerCase().split(' ').slice(0, 3).join(' ')
      )
      setFeedback(question.explanation)
      setAnswerAnim(isCorrect ? 'correct' : 'wrong')
      if (isCorrect) window.dispatchEvent(new Event('game-confetti'))
      onAnswer({ questionId: question.id, userAnswer: answer, isCorrect })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5">
        <p className="text-base font-bold text-slate-900 mb-4 leading-snug">{question.question}</p>

        {/* Multiple choice / True-false */}
        {(question.type === 'multiple_choice' || question.type === 'true_false') && question.options && (
          <div className="space-y-2.5 mb-4">
            {question.options.map(option => {
              const isSelected = selectedOption === option
              const isCorrectOption = option === question.correctAnswer

              let optionClass = 'border-slate-200 bg-white active:scale-[0.98]'
              if (showFeedback && isSelected && lastAnswer?.isCorrect) {
                optionClass = 'border-correct bg-green-50 animate-correct-bounce'
              } else if (showFeedback && isSelected && !lastAnswer?.isCorrect) {
                optionClass = 'border-incorrect bg-red-50 animate-shake'
              } else if (showFeedback && isCorrectOption) {
                optionClass = 'border-correct bg-green-50'
              }

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showFeedback}
                  className={cn(
                    'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all min-h-[44px]',
                    optionClass,
                    showFeedback && 'pointer-events-none',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {showFeedback && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-correct shrink-0" />}
                    {showFeedback && isSelected && !lastAnswer?.isCorrect && <XCircle className="w-5 h-5 text-incorrect shrink-0" />}
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
            <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5">
              <textarea
                value={displayInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 text-sm outline-none bg-transparent resize-none min-h-[56px] text-slate-900 placeholder:text-slate-400"
                disabled={isListening}
              />
              <div className="flex gap-1.5 shrink-0 pb-0.5">
                {isSupported && (
                  <button
                    type="button"
                    onClick={() => isListening ? stopListening() : startListening()}
                    className={cn(
                      'p-2.5 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
                      isListening ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                <button
                  onClick={handleFreeResponse}
                  disabled={!displayInput.trim() || evaluateMutation.isPending}
                  className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-40 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            {evaluateMutation.isPending && (
              <p className="text-xs text-slate-400 mt-2 animate-pulse">Checking your answer...</p>
            )}
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={cn(
            'rounded-xl px-4 py-3 mb-4 animate-slide-up',
            answerAnim === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200',
          )}>
            <p className="text-sm font-bold mb-0.5">
              {answerAnim === 'correct' ? '🎉 Correct! +25 XP' : '💡 Not quite!'}
            </p>
            <p className="text-sm text-slate-600">{feedback}</p>
          </div>
        )}

        {/* Next button */}
        {showFeedback && (
          <button
            onClick={onNext}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform animate-fade-in min-h-[44px]"
          >
            {isLast ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
