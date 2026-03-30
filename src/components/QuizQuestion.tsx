import { useState } from 'react'
import { Mic, MicOff, Send, CheckCircle2, XCircle } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { useEvaluateAnswer } from '@/hooks/useQuiz'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
    if (isCorrect) window.dispatchEvent(new Event('game-confetti'))
    onAnswer({ questionId: question.id, userAnswer: option, isCorrect })
  }

  const handleFreeResponse = async () => {
    const answer = displayInput.trim()
    if (!answer) return
    if (isListening) stopListening()
    try {
      const result = await evaluateMutation.mutateAsync({
        question: question.question, correctAnswer: question.correctAnswer, userAnswer: answer,
      })
      setFeedback(result.feedback)
      setAnswerAnim(result.isCorrect ? 'correct' : 'wrong')
      if (result.isCorrect) window.dispatchEvent(new Event('game-confetti'))
      onAnswer({ questionId: question.id, userAnswer: answer, isCorrect: result.isCorrect })
    } catch {
      const isCorrect = answer.toLowerCase().includes(question.correctAnswer.toLowerCase().split(' ').slice(0, 3).join(' '))
      setFeedback(question.explanation)
      setAnswerAnim(isCorrect ? 'correct' : 'wrong')
      if (isCorrect) window.dispatchEvent(new Event('game-confetti'))
      onAnswer({ questionId: question.id, userAnswer: answer, isCorrect })
    }
  }

  const questionOptions = question.options || []

  return (
    <div>
      <p className="text-lg font-black text-foreground mb-5 leading-snug">{question.question}</p>

      {(question.type === 'multiple_choice' || question.type === 'true_false') && questionOptions.length > 0 && (
        <div className="space-y-3 mb-5">
          {questionOptions.map((option, optIdx) => {
            const isSelected = selectedOption === option
            const isCorrectOption = option === question.correctAnswer
            const letter = String.fromCharCode(65 + optIdx)

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
                className={cn(
                  'w-full text-left px-4 py-4 rounded-2xl text-[15px] font-semibold transition-all',
                  'min-h-[56px] active:scale-[0.97] shadow-sm',
                  // Default
                  !showFeedback && !isSelected && 'bg-card border-2 border-border hover:border-primary/30 hover:shadow-md',
                  // Correct
                  showFeedback && isCorrectOption && 'bg-green-50 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-correct-bounce',
                  // Wrong selected
                  showFeedback && isSelected && !lastAnswer?.isCorrect && 'bg-red-50 border-2 border-red-500 animate-shake',
                  // Others when feedback
                  showFeedback && !isSelected && !isCorrectOption && 'opacity-30 border-2 border-transparent',
                  showFeedback && 'pointer-events-none',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn(
                    'size-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all',
                    showFeedback && isCorrectOption ? 'bg-green-500 text-white' :
                    showFeedback && isSelected && !lastAnswer?.isCorrect ? 'bg-red-500 text-white' :
                    'bg-muted text-muted-foreground',
                  )}>
                    {showFeedback && isCorrectOption ? <CheckCircle2 className="size-5" /> :
                     showFeedback && isSelected && !lastAnswer?.isCorrect ? <XCircle className="size-5" /> :
                     letter}
                  </span>
                  <span className={cn(
                    showFeedback && isCorrectOption && 'text-green-700',
                    showFeedback && isSelected && !lastAnswer?.isCorrect && 'text-red-700',
                  )}>{option}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'free_response' && !showFeedback && (
        <div className="mb-5">
          <div className="flex items-end gap-2">
            <Textarea
              value={displayInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 min-h-[56px] text-sm rounded-xl resize-none"
              disabled={isListening}
            />
            <div className="flex flex-col gap-1.5 shrink-0">
              {isSupported && (
                <Button
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={() => isListening ? stopListening() : startListening()}
                  className="rounded-xl size-11"
                >
                  {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                </Button>
              )}
              <Button
                onClick={handleFreeResponse}
                disabled={!displayInput.trim() || evaluateMutation.isPending}
                size="icon"
                className="rounded-xl size-11 bg-brand-gradient text-white border-0"
              >
                <Send className="size-5" />
              </Button>
            </div>
          </div>
          {evaluateMutation.isPending && (
            <p className="text-xs text-muted-foreground mt-2 animate-pulse">Checking your answer...</p>
          )}
        </div>
      )}

      {showFeedback && (
        <div className={cn(
          'rounded-2xl px-5 py-4 mb-5 animate-slide-up',
          answerAnim === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200',
        )}>
          <p className="text-base font-black mb-1">
            {answerAnim === 'correct' ? '🎉 Correct! +25 XP' : '💡 Not quite!'}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{feedback}</p>
        </div>
      )}

      {showFeedback && (
        <Button
          onClick={onNext}
          className="w-full rounded-2xl h-14 text-base font-bold animate-fade-in bg-brand-gradient text-white
                     shadow-xl active:scale-[0.97] transition-transform border-0"
        >
          {isLast ? 'See Results 🏆' : 'Next Question →'}
        </Button>
      )}
    </div>
  )
}
