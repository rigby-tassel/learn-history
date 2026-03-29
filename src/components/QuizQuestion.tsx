import { useState } from 'react'
import { Mic, MicOff, Send, CheckCircle2, XCircle } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { useEvaluateAnswer } from '@/hooks/useQuiz'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  return (
    <Card className="rounded-2xl border-0 shadow-md">
      <CardContent className="p-5">
        <p className="text-base font-bold text-card-foreground mb-4 leading-snug">{question.question}</p>

        {(question.type === 'multiple_choice' || question.type === 'true_false') && question.options && (
          <div className="space-y-2.5 mb-4">
            {question.options.map(option => {
              const isSelected = selectedOption === option
              const isCorrectOption = option === question.correctAnswer
              let cls = 'border-border bg-card hover:bg-secondary'
              if (showFeedback && isSelected && lastAnswer?.isCorrect) cls = 'border-green-500 bg-green-50 animate-correct-bounce'
              else if (showFeedback && isSelected && !lastAnswer?.isCorrect) cls = 'border-red-500 bg-red-50 animate-shake'
              else if (showFeedback && isCorrectOption) cls = 'border-green-500 bg-green-50'

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showFeedback}
                  className={cn(
                    'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all min-h-[48px] active:scale-[0.98]',
                    cls, showFeedback && 'pointer-events-none',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {showFeedback && isCorrectOption && <CheckCircle2 className="size-5 text-green-600 shrink-0" />}
                    {showFeedback && isSelected && !lastAnswer?.isCorrect && <XCircle className="size-5 text-red-500 shrink-0" />}
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {question.type === 'free_response' && !showFeedback && (
          <div className="mb-4">
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
                  className="rounded-xl size-11"
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
            'rounded-xl px-4 py-3 mb-4 animate-slide-up',
            answerAnim === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200',
          )}>
            <p className="text-sm font-bold mb-0.5">
              {answerAnim === 'correct' ? '🎉 Correct! +25 XP' : '💡 Not quite!'}
            </p>
            <p className="text-sm text-muted-foreground">{feedback}</p>
          </div>
        )}

        {showFeedback && (
          <Button onClick={onNext} className="w-full rounded-xl h-12 text-base font-semibold animate-fade-in">
            {isLast ? 'See Results' : 'Next Question'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
